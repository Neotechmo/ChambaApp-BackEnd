import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatsGateway } from '../chats/chats.gateway';
import type { CreateSolicitudDto } from './dto/create-solicitud.dto';
import type { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { RescheduleRequestDto } from './dto/reschedule-request.dto';

@Injectable()
export class SolicitudesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly events: ChatsGateway,
  ) {}

  async create(data: CreateSolicitudDto, userId: number) {
    const service = await this.prisma.servicio.findUnique({
      where: { id: data.servicio_id },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const request = await this.prisma.solicitud.create({
      data: {
        descripcion: data.descripcion,
        direccion_servicio: data.direccion_servicio,
        cliente_id: userId,
        servicio_id: data.servicio_id,
      },
      include: this.includeRelations(),
    });
    return this.toRequestResponse(request, userId);
  }

  async createRequest(data: CreateRequestDto, userId: number) {
    const scheduledAt = this.futureDate(data.fechaSolicitada);

    if (!data.serviceId && !data.providerId) {
      throw new BadRequestException(
        'Debes seleccionar un servicio o prestador',
      );
    }

    const service = await this.prisma.servicio.findFirst({
      where: data.serviceId
        ? { id: data.serviceId }
        : {
            prestador_id: data.providerId,
            categoria_id: data.categoryId,
            disponible: true,
          },
      include: { prestador: true },
    });

    if (!service || !service.disponible || !service.prestador.disponible) {
      throw new NotFoundException('Servicio disponible no encontrado');
    }

    if (service.prestador_id === userId) {
      throw new BadRequestException('No puedes solicitar tu propio servicio');
    }

    const address = data.direccionId
      ? await this.prisma.direccion.findFirst({
          where: { id: data.direccionId, usuario_id: userId },
        })
      : null;
    if (data.direccionId && !address) {
      throw new NotFoundException('Direccion no encontrada');
    }

    const request = await this.prisma.solicitud.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        prioridad: data.prioridad ?? 'normal',
        fecha_programada: scheduledAt,
        duracion_estimada_min: data.duracionEstimadaMin,
        direccion_servicio: data.direccion ?? address?.calle,
        direccion_id: address?.id,
        precio_estimado: data.precioEstimado ?? service.precio_base,
        cliente_id: userId,
        servicio_id: service.id,
      },
      include: this.includeRelations(),
    });

    await this.notify(
      service.prestador_id,
      'Nueva solicitud agendada',
      `Tienes una solicitud para ${scheduledAt.toISOString()}.`,
    );
    this.events.emitUserEvent(service.prestador_id, 'requestCreated', {
      requestId: request.id,
      scheduledAt,
    });

    return this.toRequestResponse(request, userId);
  }

  async findMine(userId: number) {
    const requests = await this.prisma.solicitud.findMany({
      where: { cliente_id: userId },
      include: this.includeRelations(),
      orderBy: { fecha_solicitud: 'desc' },
    });

    return {
      data: requests.map((request) => this.toRequestResponse(request, userId)),
    };
  }

  async findProviderRequests(userId: number) {
    const requests = await this.prisma.solicitud.findMany({
      where: {
        servicio: { prestador_id: userId },
        estado: { in: ['pending', 'rejected', 'cancelled'] },
      },
      include: this.includeRelations(),
      orderBy: { fecha_solicitud: 'desc' },
    });

    return {
      data: requests.map((request) => this.toRequestResponse(request, userId)),
    };
  }

  async findProviderJobs(userId: number) {
    const requests = await this.prisma.solicitud.findMany({
      where: {
        servicio: { prestador_id: userId },
        estado: { in: ['accepted', 'on_the_way', 'in_progress', 'completed'] },
      },
      include: this.includeRelations(),
      orderBy: { fecha_programada: 'asc' },
    });

    return {
      data: requests.map((request) => this.toRequestResponse(request, userId)),
    };
  }

  async findProviderCalendar(userId: number) {
    return this.findProviderJobs(userId);
  }

  async findRequest(id: number, userId: number, rolId: number) {
    const request = await this.findOne(id, userId, rolId);
    return this.toRequestResponse(request, userId);
  }

  async cancelRequest(id: number, userId: number) {
    const request = await this.prisma.solicitud.findUnique({
      where: { id },
      include: { servicio: true },
    });

    if (!request || request.cliente_id !== userId) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (!['pending', 'accepted'].includes(request.estado)) {
      throw new ConflictException('La solicitud ya no puede cancelarse');
    }

    const updated = await this.changeStatus(id, 'cancelled', userId);
    this.events.emitUserEvent(
      request.servicio.prestador_id,
      'requestStatusChanged',
      updated,
    );
    return updated;
  }

  async acceptRequest(id: number, providerId: number) {
    const updated = await this.prisma.$transaction(async (transaction) => {
      await transaction.$executeRaw`SELECT pg_advisory_xact_lock(${providerId})`;
      const request = await this.getProviderRequest(
        id,
        providerId,
        transaction,
      );
      if (request.estado !== 'pending') {
        throw new ConflictException('La solicitud ya fue respondida');
      }

      await this.ensureAvailable(request, providerId, transaction);
      return transaction.solicitud.update({
        where: { id },
        data: { estado: 'accepted' },
        include: this.includeRelations(),
      });
    });
    await this.notify(
      updated.cliente_id,
      'Solicitud aceptada',
      'Tu solicitud fue aceptada por el prestador.',
    );
    const response = this.toRequestResponse(updated, providerId);
    this.events.emitUserEvent(
      updated.cliente_id,
      'requestStatusChanged',
      response,
    );
    return response;
  }

  async rejectRequest(id: number, providerId: number, motivo?: string) {
    const request = await this.getProviderRequest(id, providerId);
    if (request.estado !== 'pending') {
      throw new ConflictException('La solicitud ya fue respondida');
    }

    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: {
        estado: 'rejected',
        descripcion: motivo
          ? `${request.descripcion ?? ''}\nMotivo rechazo: ${motivo}`.trim()
          : undefined,
      },
      include: this.includeRelations(),
    });
    await this.notify(
      request.cliente_id,
      'Solicitud rechazada',
      motivo ?? 'El prestador rechazo la solicitud.',
    );
    const response = this.toRequestResponse(updated, providerId);
    this.events.emitUserEvent(
      request.cliente_id,
      'requestStatusChanged',
      response,
    );
    return response;
  }

  async rescheduleRequest(
    id: number,
    clientId: number,
    data: RescheduleRequestDto,
  ) {
    const request = await this.getClientRequest(id, clientId);
    if (request.estado !== 'pending') {
      throw new ConflictException(
        'Solo puedes reprogramar una solicitud pendiente',
      );
    }
    const scheduledAt = this.futureDate(data.fechaSolicitada);
    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: {
        fecha_programada: scheduledAt,
        duracion_estimada_min:
          data.duracionEstimadaMin ?? request.duracion_estimada_min,
        fecha_propuesta: null,
        propuesta_pendiente: false,
      },
      include: this.includeRelations(),
    });
    await this.notify(
      request.servicio.prestador_id,
      'Solicitud reprogramada',
      `El cliente cambio la fecha a ${scheduledAt.toISOString()}.`,
    );
    this.events.emitUserEvent(
      request.servicio.prestador_id,
      'requestRescheduled',
      {
        requestId: id,
        scheduledAt,
      },
    );
    return this.toRequestResponse(updated, clientId);
  }

  async proposeDate(id: number, providerId: number, proposedDate: string) {
    const request = await this.getProviderRequest(id, providerId);
    if (request.estado !== 'pending') {
      throw new ConflictException(
        'Solo puedes proponer fecha para una solicitud pendiente',
      );
    }
    const date = this.futureDate(proposedDate);
    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: { fecha_propuesta: date, propuesta_pendiente: true },
      include: this.includeRelations(),
    });
    await this.notify(
      request.cliente_id,
      'Nueva fecha propuesta',
      `El prestador propuso ${date.toISOString()} para tu servicio.`,
    );
    this.events.emitUserEvent(request.cliente_id, 'dateProposed', {
      requestId: id,
      proposedAt: date,
    });
    return this.toRequestResponse(updated, providerId);
  }

  async acceptProposedDate(id: number, clientId: number) {
    const request = await this.getClientRequest(id, clientId);
    if (
      request.estado !== 'pending' ||
      !request.propuesta_pendiente ||
      !request.fecha_propuesta
    ) {
      throw new ConflictException('No hay una propuesta de fecha pendiente');
    }
    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: {
        fecha_programada: request.fecha_propuesta,
        fecha_propuesta: null,
        propuesta_pendiente: false,
      },
      include: this.includeRelations(),
    });
    await this.notify(
      request.servicio.prestador_id,
      'Fecha propuesta aceptada',
      'El cliente acepto la nueva fecha solicitada.',
    );
    this.events.emitUserEvent(request.servicio.prestador_id, 'dateAccepted', {
      requestId: id,
      scheduledAt: request.fecha_propuesta,
    });
    return this.toRequestResponse(updated, clientId);
  }

  async updateJobStatus(id: number, providerId: number, status: string) {
    const request = await this.getProviderRequest(id, providerId);
    const allowed: Record<string, string[]> = {
      accepted: ['on_the_way', 'in_progress'],
      on_the_way: ['in_progress'],
      in_progress: ['completed'],
    };

    if (!allowed[request.estado]?.includes(status)) {
      throw new ConflictException('Cambio de estado no permitido');
    }

    const updated = await this.changeStatus(id, status, providerId);
    this.events.emitUserEvent(
      request.cliente_id,
      'requestStatusChanged',
      updated,
    );
    return updated;
  }

  async findAll(userId: number, rolId: number) {
    if (rolId === 1) {
      return this.prisma.solicitud.findMany({
        include: this.includeRelations(),
        orderBy: { id: 'asc' },
      });
    }

    const requests = await this.prisma.solicitud.findMany({
      where: {
        OR: [
          { cliente_id: userId },
          {
            servicio: {
              prestador_id: userId,
            },
          },
        ],
      },
      include: this.includeRelations(),
      orderBy: { id: 'asc' },
    });
    return {
      data: requests.map((request) => this.toRequestResponse(request, userId)),
    };
  }

  async findOne(id: number, userId: number, rolId: number) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id },
      include: this.includeRelations(),
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (
      rolId !== 1 &&
      solicitud.cliente_id !== userId &&
      solicitud.servicio.prestador_id !== userId
    ) {
      throw new ForbiddenException('No puedes ver esta solicitud');
    }

    return solicitud;
  }

  async update(
    id: number,
    data: UpdateSolicitudDto,
    userId: number,
    rolId: number,
  ) {
    const solicitud = await this.findOne(id, userId, rolId);

    if (
      rolId !== 1 &&
      solicitud.cliente_id !== userId &&
      solicitud.servicio.prestador_id !== userId
    ) {
      throw new ForbiddenException('No puedes editar esta solicitud');
    }

    const nextStatus = data.estado
      ? this.normalizeStatus(data.estado)
      : solicitud.estado;
    if (rolId !== 1 && data.estado) {
      if (solicitud.cliente_id === userId && nextStatus !== 'cancelled') {
        throw new ForbiddenException('Solo puedes cancelar tu solicitud');
      }
      if (
        solicitud.servicio.prestador_id === userId &&
        ![
          'accepted',
          'rejected',
          'on_the_way',
          'in_progress',
          'completed',
        ].includes(nextStatus)
      ) {
        throw new ForbiddenException('Estado no permitido para el prestador');
      }
    }

    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: { ...data, estado: data.estado ? nextStatus : undefined },
      include: this.includeRelations(),
    });
    return this.toRequestResponse(updated, userId);
  }

  async remove(id: number, userId: number, rolId: number) {
    const solicitud = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && solicitud.cliente_id !== userId) {
      throw new ForbiddenException('No puedes eliminar esta solicitud');
    }

    await this.prisma.solicitud.delete({
      where: { id },
    });

    return {
      message: 'Solicitud eliminada correctamente',
    };
  }

  private includeRelations() {
    return {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
          rol: true,
        },
      },
      servicio: {
        include: {
          prestador: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              telefono: true,
              rol: true,
            },
          },
        },
      },
      pago: true,
      calificacion: true,
      direccion: true,
    };
  }

  private async getProviderRequest(
    id: number,
    providerId: number,
    database: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const request = await database.solicitud.findFirst({
      where: { id, servicio: { prestador_id: providerId } },
      include: this.includeRelations(),
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return request;
  }

  private async changeStatus(id: number, status: string, viewerId: number) {
    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: { estado: status },
      include: this.includeRelations(),
    });
    return this.toRequestResponse(updated, viewerId);
  }

  private normalizeStatus(status: string) {
    const statuses: Record<string, string> = {
      pendiente: 'pending',
      aceptada: 'accepted',
      rechazada: 'rejected',
      completada: 'completed',
      cancelada: 'cancelled',
    };
    return statuses[status] ?? status;
  }

  private toRequestResponse(
    request: {
      id: number;
      titulo: string | null;
      descripcion: string | null;
      direccion_servicio: string | null;
      prioridad: string;
      estado: string;
      fecha_solicitud: Date;
      fecha_programada: Date | null;
      fecha_propuesta: Date | null;
      propuesta_pendiente: boolean;
      duracion_estimada_min: number | null;
      precio_estimado: number | null;
      precio_final: number | null;
      pago?: {
        id: number;
        monto: number;
        metodo: string | null;
        referencia: string | null;
        estado: string;
        fecha_pago: Date | null;
      } | null;
      direccion?: {
        id: number;
        calle: string;
        ciudad: string;
        estado: string;
        lat: number | null;
        lng: number | null;
      } | null;
      cliente: {
        id: number;
        nombre: string;
        apellido: string | null;
        telefono: string | null;
      };
      servicio: {
        id: number;
        titulo: string;
        precio_base: number;
        prestador: {
          id: number;
          nombre: string;
          apellido: string | null;
          telefono: string | null;
        };
      };
    },
    viewerId?: number,
  ) {
    const mayShowContact =
      request.cliente.id === viewerId ||
      ['accepted', 'on_the_way', 'in_progress', 'completed'].includes(
        request.estado,
      );
    return {
      id: request.id,
      title: request.titulo ?? request.servicio.titulo,
      description: request.descripcion,
      priority: request.prioridad,
      status: this.normalizeStatus(request.estado),
      requestedAt: request.fecha_solicitud,
      scheduledAt: request.fecha_programada,
      proposedAt: request.fecha_propuesta,
      hasPendingDateProposal: request.propuesta_pendiente,
      estimatedDurationMin: request.duracion_estimada_min,
      estimatedPrice: request.precio_estimado ?? request.servicio.precio_base,
      finalPrice: request.precio_final,
      payment: request.pago
        ? {
            id: request.pago.id,
            amount: request.pago.monto,
            method: request.pago.metodo,
            reference: request.pago.referencia,
            status: this.normalizePaymentStatus(request.pago.estado),
            paidAt: request.pago.fecha_pago,
          }
        : null,
      address: mayShowContact
        ? request.direccion
          ? {
              id: request.direccion.id,
              street: request.direccion.calle,
              city: request.direccion.ciudad,
              state: request.direccion.estado,
              lat: request.direccion.lat,
              lng: request.direccion.lng,
            }
          : request.direccion_servicio
        : null,
      client: {
        id: request.cliente.id,
        nombre: [request.cliente.nombre, request.cliente.apellido]
          .filter(Boolean)
          .join(' '),
        telefono: mayShowContact ? request.cliente.telefono : null,
      },
      provider: {
        id: request.servicio.prestador.id,
        nombre: [
          request.servicio.prestador.nombre,
          request.servicio.prestador.apellido,
        ]
          .filter(Boolean)
          .join(' '),
        telefono: mayShowContact ? request.servicio.prestador.telefono : null,
      },
      service: { id: request.servicio.id, title: request.servicio.titulo },
    };
  }

  private async getClientRequest(id: number, clientId: number) {
    const request = await this.prisma.solicitud.findFirst({
      where: { id, cliente_id: clientId },
      include: this.includeRelations(),
    });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    return request;
  }

  private futureDate(value: string) {
    const date = new Date(value);
    if (date.getTime() <= Date.now()) {
      throw new BadRequestException('La fecha solicitada debe ser futura');
    }
    return date;
  }

  private async ensureAvailable(
    request: {
      id: number;
      fecha_programada: Date | null;
      duracion_estimada_min: number | null;
    },
    providerId: number,
    database: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    if (!request.fecha_programada || !request.duracion_estimada_min) {
      throw new BadRequestException(
        'La solicitud debe tener fecha y duracion para aceptarse',
      );
    }
    const active = await database.solicitud.findMany({
      where: {
        id: { not: request.id },
        estado: { in: ['accepted', 'on_the_way', 'in_progress'] },
        servicio: { prestador_id: providerId },
        fecha_programada: { not: null },
        duracion_estimada_min: { not: null },
      },
      select: {
        fecha_programada: true,
        duracion_estimada_min: true,
      },
    });
    const start = request.fecha_programada.getTime();
    const end = start + request.duracion_estimada_min * 60_000;
    const conflicts = active.some((job) => {
      const otherStart = job.fecha_programada!.getTime();
      const otherEnd = otherStart + job.duracion_estimada_min! * 60_000;
      return start < otherEnd && end > otherStart;
    });
    if (conflicts) {
      throw new ConflictException({
        message: 'Ya tienes un servicio agendado en ese horario',
        code: 'SCHEDULE_CONFLICT',
      });
    }
  }

  private normalizePaymentStatus(status: string) {
    const statuses: Record<string, string> = {
      pendiente: 'pending',
      pagado: 'paid',
      fallido: 'failed',
      reembolsado: 'refunded',
    };
    return statuses[status] ?? status;
  }

  private async notify(userId: number, title: string, message: string) {
    await this.notifications.create({ userId, title, message });
  }
}
