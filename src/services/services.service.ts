import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateServiceDto, userId: number) {
    return this.prisma.servicio.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio_base: data.precio_base,

        prestador_id: userId,
      },
      include: {
        prestador: {
          include: {
            rol: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.servicio.findMany({
      include: {
        prestador: {
          include: {
            rol: true,
          },
        },
        solicitudes: true,
        calificaciones: true,
      },
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.servicio.findUnique({
      where: { id },
      include: {
        prestador: {
          include: {
            rol: true,
          },
        },
        solicitudes: {
          include: {
            cliente: true,
            pago: true,
            calificacion: true,
          },
        },
        calificaciones: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return service;
  }

  async update(
    id: number,
    data: UpdateServiceDto,
    userId: number,
    rolId: number,
  ) {
    const service = await this.prisma.servicio.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (rolId !== 1 && service.prestador_id !== userId) {
      throw new ForbiddenException('No puedes editar este servicio');
    }

    return this.prisma.servicio.update({
      where: { id },
      data,
      include: {
        prestador: {
          include: {
            rol: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number, rolId: number) {
    const service = await this.prisma.servicio.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (rolId !== 1 && service.prestador_id !== userId) {
      throw new ForbiddenException('No puedes eliminar este servicio');
    }

    await this.prisma.servicio.delete({
      where: { id },
    });

    return {
      message: 'Servicio eliminado correctamente',
    };
  }
}
