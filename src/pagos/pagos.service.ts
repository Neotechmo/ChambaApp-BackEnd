import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePagoDto } from './dto/create-pago.dto';
import type { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePagoDto, userId: number, rolId: number) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id: data.solicitud_id },
      include: { servicio: true, pago: true },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.pago) {
      throw new ConflictException('La solicitud ya tiene pago registrado');
    }

    if (rolId !== 1 && solicitud.cliente_id !== userId) {
      throw new ForbiddenException('No puedes pagar esta solicitud');
    }

    return this.prisma.pago.create({
      data: {
        monto: data.monto,
        metodo: data.metodo,
        referencia: data.referencia,
        solicitud_id: data.solicitud_id,
      },
      include: this.includeRelations(),
    });
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

    return this.prisma.pago.update({
      where: { id },
      data: {
        monto: data.monto,
        metodo: data.metodo,
        referencia: data.referencia,
        estado: data.estado,
        fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : undefined,
      },
      include: this.includeRelations(),
    });
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
          cliente: true,
          servicio: {
            include: {
              prestador: true,
            },
          },
        },
      },
    };
  }
}
