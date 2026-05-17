import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSolicitudDto } from './dto/create-solicitud.dto';
import type { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Injectable()
export class SolicitudesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSolicitudDto, userId: number) {
    const service = await this.prisma.servicio.findUnique({
      where: { id: data.servicio_id },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return this.prisma.solicitud.create({
      data: {
        descripcion: data.descripcion,
        direccion_servicio: data.direccion_servicio,
        cliente_id: userId,
        servicio_id: data.servicio_id,
      },
      include: this.includeRelations(),
    });
  }

  async findAll(userId: number, rolId: number) {
    if (rolId === 1) {
      return this.prisma.solicitud.findMany({
        include: this.includeRelations(),
        orderBy: { id: 'asc' },
      });
    }

    return this.prisma.solicitud.findMany({
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

    return this.prisma.solicitud.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
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
        include: {
          rol: true,
        },
      },
      servicio: {
        include: {
          prestador: {
            include: {
              rol: true,
            },
          },
        },
      },
      pago: true,
      calificacion: true,
    };
  }
}
