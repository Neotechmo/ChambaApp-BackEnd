import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const data = await this.prisma.direccion.findMany({
      where: { usuario_id: userId },
      orderBy: { id: 'desc' },
    });
    return { data };
  }

  create(userId: number, data: AddressDto) {
    return this.prisma.direccion.create({
      data: {
        etiqueta: data.etiqueta,
        calle: data.calle,
        ciudad: data.ciudad,
        estado: data.estado,
        codigo_postal: data.codigoPostal,
        lat: data.lat,
        lng: data.lng,
        usuario_id: userId,
      },
    });
  }

  async update(id: number, userId: number, data: AddressDto) {
    const address = await this.prisma.direccion.findFirst({
      where: { id, usuario_id: userId },
    });
    if (!address) {
      throw new NotFoundException('Direccion no encontrada');
    }
    return this.prisma.direccion.update({
      where: { id },
      data: {
        etiqueta: data.etiqueta,
        calle: data.calle,
        ciudad: data.ciudad,
        estado: data.estado,
        codigo_postal: data.codigoPostal,
        lat: data.lat,
        lng: data.lng,
      },
    });
  }
}
