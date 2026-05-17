import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCalificacionDto } from './dto/create-calificacion.dto';
import type { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCalificacionDto, userId: number, rolId: number) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id: data.solicitud_id },
      include: {
        servicio: true,
        calificacion: true,
      },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.calificacion) {
      throw new ConflictException('La solicitud ya fue calificada');
    }

    if (rolId !== 1 && solicitud.cliente_id !== userId) {
      throw new ForbiddenException('No puedes calificar esta solicitud');
    }

    if (solicitud.estado !== 'completada') {
      throw new BadRequestException(
        'Solo puedes calificar solicitudes completadas',
      );
    }

    return this.prisma.calificacion.create({
      data: {
        puntuacion: data.puntuacion,
        comentario: data.comentario,
        cliente_id: solicitud.cliente_id,
        prestador_id: solicitud.servicio.prestador_id,
        servicio_id: solicitud.servicio_id,
        solicitud_id: solicitud.id,
      },
      include: this.includeRelations(),
    });
  }

  async findAll(userId: number, rolId: number) {
    if (rolId === 1) {
      return this.prisma.calificacion.findMany({
        include: this.includeRelations(),
        orderBy: { id: 'asc' },
      });
    }

    return this.prisma.calificacion.findMany({
      where: {
        OR: [{ cliente_id: userId }, { prestador_id: userId }],
      },
      include: this.includeRelations(),
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number, userId: number, rolId: number) {
    const calificacion = await this.prisma.calificacion.findUnique({
      where: { id },
      include: this.includeRelations(),
    });

    if (!calificacion) {
      throw new NotFoundException('Calificacion no encontrada');
    }

    if (
      rolId !== 1 &&
      calificacion.cliente_id !== userId &&
      calificacion.prestador_id !== userId
    ) {
      throw new ForbiddenException('No puedes ver esta calificacion');
    }

    return calificacion;
  }

  async update(
    id: number,
    data: UpdateCalificacionDto,
    userId: number,
    rolId: number,
  ) {
    const calificacion = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && calificacion.cliente_id !== userId) {
      throw new ForbiddenException('No puedes editar esta calificacion');
    }

    return this.prisma.calificacion.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
  }

  async remove(id: number, userId: number, rolId: number) {
    const calificacion = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && calificacion.cliente_id !== userId) {
      throw new ForbiddenException('No puedes eliminar esta calificacion');
    }

    await this.prisma.calificacion.delete({
      where: { id },
    });

    return {
      message: 'Calificacion eliminada correctamente',
    };
  }

  private includeRelations() {
    return {
      cliente: true,
      prestador: true,
      servicio: true,
      solicitud: true,
    };
  }
}
