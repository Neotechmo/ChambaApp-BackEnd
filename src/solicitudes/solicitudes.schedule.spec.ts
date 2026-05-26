import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';

describe('SolicitudesService agenda', () => {
  const clientId = 10;
  const providerId = 20;
  const future = new Date(Date.now() + 24 * 60 * 60 * 1000);

  function request(overrides: Record<string, unknown> = {}) {
    return {
      id: 1,
      titulo: 'Visita',
      descripcion: 'Reparacion',
      direccion_servicio: 'Calle 1',
      prioridad: 'normal',
      estado: 'pending',
      fecha_solicitud: new Date(),
      fecha_programada: future,
      fecha_propuesta: null,
      propuesta_pendiente: false,
      duracion_estimada_min: 60,
      precio_estimado: 350,
      precio_final: null,
      cliente_id: clientId,
      servicio_id: 2,
      cliente: {
        id: clientId,
        nombre: 'Cliente',
        apellido: 'Demo',
        telefono: '111',
      },
      servicio: {
        id: 2,
        titulo: 'Plomeria',
        precio_base: 350,
        prestador_id: providerId,
        prestador: {
          id: providerId,
          nombre: 'Prestador',
          apellido: 'Demo',
          telefono: '222',
        },
      },
      direccion: null,
      pago: null,
      ...overrides,
    };
  }

  function setup() {
    const transaction = {
      $executeRaw: jest.fn().mockResolvedValue(1),
      solicitud: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    const prisma = {
      servicio: { findFirst: jest.fn() },
      direccion: { findFirst: jest.fn() },
      solicitud: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest
        .fn()
        .mockImplementation((callback: (tx: unknown) => unknown) =>
          callback(transaction),
        ),
    };
    const notifications = { create: jest.fn().mockResolvedValue({}) };
    const events = { emitUserEvent: jest.fn() };
    const service = new SolicitudesService(
      prisma as never,
      notifications as never,
      events as never,
    );
    return { service, prisma, transaction };
  }

  it('creates a request with a future schedule and duration', async () => {
    const { service, prisma } = setup();
    prisma.servicio.findFirst.mockResolvedValue({
      id: 2,
      precio_base: 350,
      prestador_id: providerId,
      disponible: true,
      prestador: { disponible: true },
    });
    prisma.solicitud.create.mockImplementation(({ data }: { data: object }) =>
      Promise.resolve(request(data)),
    );

    const result = await service.createRequest(
      {
        serviceId: 2,
        titulo: 'Visita',
        descripcion: 'Reparacion',
        fechaSolicitada: future.toISOString(),
        duracionEstimadaMin: 60,
      },
      clientId,
    );

    expect(result.scheduledAt).toEqual(future);
    expect(result.estimatedDurationMin).toBe(60);
  });

  it('rejects a past requested date', async () => {
    const { service } = setup();
    await expect(
      service.createRequest(
        {
          serviceId: 2,
          titulo: 'Visita',
          descripcion: 'Reparacion',
          fechaSolicitada: new Date(Date.now() - 1000).toISOString(),
          duracionEstimadaMin: 60,
        },
        clientId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an overlapping accepted job with SCHEDULE_CONFLICT', async () => {
    const { service, transaction } = setup();
    transaction.solicitud.findFirst.mockResolvedValue(request());
    transaction.solicitud.findMany.mockResolvedValue([
      {
        fecha_programada: new Date(future.getTime() + 30 * 60 * 1000),
        duracion_estimada_min: 60,
      },
    ]);

    await expect(service.acceptRequest(1, providerId)).rejects.toMatchObject({
      response: { code: 'SCHEDULE_CONFLICT' },
    });
  });

  it('accepts a job that does not overlap another booking', async () => {
    const { service, transaction } = setup();
    transaction.solicitud.findFirst.mockResolvedValue(request());
    transaction.solicitud.findMany.mockResolvedValue([
      {
        fecha_programada: new Date(future.getTime() + 60 * 60 * 1000),
        duracion_estimada_min: 60,
      },
    ]);
    transaction.solicitud.update.mockResolvedValue(
      request({ estado: 'accepted' }),
    );

    const accepted = await service.acceptRequest(1, providerId);
    expect(accepted.status).toBe('accepted');
  });

  it('denies rescheduling a request belonging to another client', async () => {
    const { service, prisma } = setup();
    prisma.solicitud.findFirst.mockResolvedValue(null);

    await expect(
      service.rescheduleRequest(1, clientId + 1, {
        fechaSolicitada: future.toISOString(),
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
