import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateServiceDto } from './dto/create-service.dto';

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
    });
  }

  async findAll() {
    return this.prisma.servicio.findMany({
      include: {
        prestador: true,
      },
    });
  }
}
