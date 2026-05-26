import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(clienteId: number) {
    const favorites = await this.prisma.favorito.findMany({
      where: { cliente_id: clienteId },
      include: {
        prestador: {
          include: {
            servicios: {
              where: { disponible: true },
              include: {
                categoria: true,
                calificaciones: { select: { puntuacion: true } },
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return {
      data: favorites
        .filter((favorite) => favorite.prestador.servicios[0])
        .map((favorite) => {
          const service = favorite.prestador.servicios[0];
          const scores = service.calificaciones;
          return {
            id: service.id,
            providerId: favorite.prestador_id,
            nombre: [favorite.prestador.nombre, favorite.prestador.apellido]
              .filter(Boolean)
              .join(' '),
            oficio: favorite.prestador.especialidad ?? service.titulo,
            categoria: service.categoria,
            precio: service.precio_base,
            unidadPrecio: 'hora',
            disponibilidad: favorite.prestador.disponible
              ? 'Disponible'
              : 'No disponible',
            rating: scores.length
              ? scores.reduce((total, score) => total + score.puntuacion, 0) /
                scores.length
              : 0,
            reviews: scores.length,
            verificado: favorite.prestador.verificado,
            favorito: true,
          };
        }),
    };
  }

  async create(clienteId: number, providerId: number) {
    const provider = await this.prisma.usuario.findFirst({
      where: { id: providerId, rol: { nombre: 'prestador' } },
    });
    if (!provider) {
      throw new NotFoundException('Prestador no encontrado');
    }
    if (clienteId === providerId) {
      throw new ConflictException('No puedes guardar tu propio perfil');
    }

    await this.prisma.favorito.upsert({
      where: {
        cliente_id_prestador_id: {
          cliente_id: clienteId,
          prestador_id: providerId,
        },
      },
      update: {},
      create: { cliente_id: clienteId, prestador_id: providerId },
    });
    return { providerId, favorito: true };
  }

  async remove(clienteId: number, providerId: number) {
    await this.prisma.favorito.deleteMany({
      where: { cliente_id: clienteId, prestador_id: providerId },
    });
    return { providerId, favorito: false };
  }
}
