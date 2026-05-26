import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatsGateway } from '../chats/chats.gateway';
import type { CreatePagoDto } from './dto/create-pago.dto';
import type { CreateRequestPaymentDto } from './dto/request-payment.dto';
import type { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly events: ChatsGateway,
  ) {}

  async create(data: CreatePagoDto, userId: number, rolId: number) {
    void rolId;
    return this.createForRequest(
      data.solicitud_id,
      { method: data.metodo ?? 'no_especificado', reference: data.referencia },
      userId,
    );
  }

  async createForRequest(
    requestId: number,
    data: CreateRequestPaymentDto,
    userId: number,
  ) {
    const request = await this.payableRequest(requestId, userId);
    if (request.pago) {
      throw new ConflictException('La solicitud ya tiene pago registrado');
    }
    const payment = await this.prisma.pago.create({
      data: {
        monto: this.amountFor(request),
        metodo: data.method,
        referencia: data.reference,
        solicitud_id: request.id,
      },
    });
    return this.toPaymentResponse(payment);
  }

  async findByRequest(requestId: number, userId: number, rolId: number) {
    const request = await this.prisma.solicitud.findUnique({
      where: { id: requestId },
      include: { servicio: true, pago: true },
    });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (
      rolId !== 1 &&
      request.cliente_id !== userId &&
      request.servicio.prestador_id !== userId
    ) {
      throw new ForbiddenException('No puedes ver este pago');
    }
    if (!request.pago) {
      throw new NotFoundException('Pago no encontrado');
    }
    return this.toPaymentResponse(request.pago);
  }

  async confirm(requestId: number, userId: number) {
    const request = await this.payableRequest(requestId, userId);
    if (!request.pago) {
      throw new NotFoundException('Pago no encontrado');
    }
    if (this.normalizeStatus(request.pago.estado) === 'paid') {
      return this.toPaymentResponse(request.pago);
    }
    if (this.normalizeStatus(request.pago.estado) !== 'pending') {
      throw new ConflictException('El pago ya no puede confirmarse');
    }
    const payment = await this.prisma.pago.update({
      where: { id: request.pago.id },
      data: { estado: 'paid', fecha_pago: new Date() },
    });
    await this.notifications.create({
      userId: request.servicio.prestador_id,
      title: 'Pago confirmado',
      message: `El pago de la solicitud ${request.id} fue confirmado.`,
    });
    this.events.emitUserEvent(
      request.servicio.prestador_id,
      'paymentPaid',
      this.toPaymentResponse(payment),
    );
    return this.toPaymentResponse(payment);
  }

  async findAll(userId: number, rolId: number) {
    if (rolId === 1) {
      return this.prisma.pago.findMany({
        include: this.includeRelations(),
        orderBy: { id: 'asc' },
      });
    }

    return this.prisma.pago.findMany({
      where: {
        solicitud: {
          OR: [
            { cliente_id: userId },
            {
              servicio: {
                prestador_id: userId,
              },
            },
          ],
        },
      },
      include: this.includeRelations(),
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number, userId: number, rolId: number) {
    const pago = await this.prisma.pago.findUnique({
      where: { id },
      include: this.includeRelations(),
    });

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    if (
      rolId !== 1 &&
      pago.solicitud.cliente_id !== userId &&
      pago.solicitud.servicio.prestador_id !== userId
    ) {
      throw new ForbiddenException('No puedes ver este pago');
    }

    return pago;
  }

  async update(id: number, data: UpdatePagoDto, userId: number, rolId: number) {
    const pago = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && pago.solicitud.cliente_id !== userId) {
      throw new ForbiddenException('No puedes editar este pago');
    }

    if (
      rolId !== 1 &&
      (data.monto !== undefined || data.estado || data.fecha_pago)
    ) {
      throw new ForbiddenException(
        'No puedes modificar el monto o estado del pago',
      );
    }
    const updated = await this.prisma.pago.update({
      where: { id },
      data: {
        monto: rolId === 1 ? data.monto : undefined,
        metodo: data.metodo,
        referencia: data.referencia,
        estado: data.estado,
        fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : undefined,
      },
      include: this.includeRelations(),
    });
    return updated;
  }

  async remove(id: number, userId: number, rolId: number) {
    const pago = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && pago.solicitud.cliente_id !== userId) {
      throw new ForbiddenException('No puedes eliminar este pago');
    }

    await this.prisma.pago.delete({
      where: { id },
    });

    return {
      message: 'Pago eliminado correctamente',
    };
  }

  private includeRelations() {
    return {
      solicitud: {
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
            },
          },
          servicio: {
            include: {
              prestador: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                },
              },
            },
          },
        },
      },
    };
  }

  private async payableRequest(requestId: number, userId: number) {
    const request = await this.prisma.solicitud.findFirst({
      where: { id: requestId, cliente_id: userId },
      include: { servicio: true, pago: true },
    });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    if (
      !['accepted', 'on_the_way', 'in_progress', 'completed'].includes(
        request.estado,
      )
    ) {
      throw new BadRequestException(
        'Solo puedes pagar una solicitud aceptada o completada',
      );
    }
    return request;
  }

  private amountFor(request: {
    precio_final: number | null;
    precio_estimado: number | null;
    servicio: { precio_base: number };
  }) {
    return (
      request.precio_final ??
      request.precio_estimado ??
      request.servicio.precio_base
    );
  }

  private toPaymentResponse(payment: {
    id: number;
    solicitud_id: number;
    monto: number;
    metodo: string | null;
    referencia: string | null;
    estado: string;
    fecha_pago: Date | null;
  }) {
    return {
      id: payment.id,
      requestId: payment.solicitud_id,
      amount: payment.monto,
      method: payment.metodo,
      reference: payment.referencia,
      status: this.normalizeStatus(payment.estado),
      paidAt: payment.fecha_pago,
    };
  }

  private normalizeStatus(status: string) {
    const aliases: Record<string, string> = {
      pendiente: 'pending',
      pagado: 'paid',
      fallido: 'failed',
      reembolsado: 'refunded',
    };
    return aliases[status] ?? status;
  }
}
