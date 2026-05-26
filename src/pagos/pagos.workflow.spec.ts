import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PagosService } from './pagos.service';

describe('PagosService payment workflow', () => {
  const clientId = 10;
  const providerId = 20;

  function request(estado = 'accepted', pago: object | null = null) {
    return {
      id: 5,
      cliente_id: clientId,
      estado,
      precio_final: null,
      precio_estimado: 350,
      servicio: { precio_base: 500, prestador_id: providerId },
      pago,
    };
  }

  function setup() {
    const prisma = {
      solicitud: { findFirst: jest.fn(), findUnique: jest.fn() },
      pago: { create: jest.fn(), update: jest.fn() },
    };
    const notifications = { create: jest.fn().mockResolvedValue({}) };
    const events = { emitUserEvent: jest.fn() };
    const service = new PagosService(
      prisma as never,
      notifications as never,
      events as never,
    );
    return { service, prisma, notifications };
  }

  it('does not permit payment before a request is accepted', async () => {
    const { service, prisma } = setup();
    prisma.solicitud.findFirst.mockResolvedValue(request('pending'));

    await expect(
      service.createForRequest(5, { method: 'transferencia' }, clientId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('uses the backend price even when legacy payload sends another amount', async () => {
    const { service, prisma } = setup();
    prisma.solicitud.findFirst.mockResolvedValue(request());
    prisma.pago.create.mockImplementation(({ data }: { data: object }) =>
      Promise.resolve({
        id: 8,
        solicitud_id: 5,
        metodo: 'transferencia',
        referencia: null,
        estado: 'pending',
        fecha_pago: null,
        ...data,
      }),
    );

    const payment = await service.create(
      {
        solicitud_id: 5,
        monto: 1,
        metodo: 'transferencia',
      },
      clientId,
      2,
    );

    expect(payment.amount).toBe(350);
  });

  it('confirms a pending payment and notifies the provider', async () => {
    const { service, prisma, notifications } = setup();
    prisma.solicitud.findFirst.mockResolvedValue(
      request('accepted', {
        id: 8,
        solicitud_id: 5,
        monto: 350,
        metodo: 'transferencia',
        referencia: null,
        estado: 'pending',
        fecha_pago: null,
      }),
    );
    prisma.pago.update.mockResolvedValue({
      id: 8,
      solicitud_id: 5,
      monto: 350,
      metodo: 'transferencia',
      referencia: null,
      estado: 'paid',
      fecha_pago: new Date(),
    });

    const confirmed = await service.confirm(5, clientId);

    expect(confirmed.status).toBe('paid');
    expect(confirmed.paidAt).toBeInstanceOf(Date);
    expect(notifications.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: providerId }),
    );
  });

  it('denies payment access for an unrelated user', async () => {
    const { service, prisma } = setup();
    prisma.solicitud.findFirst.mockResolvedValue(null);

    await expect(
      service.createForRequest(5, { method: 'transferencia' }, clientId + 1),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
