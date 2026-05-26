import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';

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
        categoria_id: data.categoryId,
      },
      include: {
        prestador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            rol: true,
          },
        },
      },
    });
  }

  async findAll(query: ListServicesQueryDto) {
    const where = {
      ...(query.search
        ? {
            OR: [
              {
                titulo: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                descripcion: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                prestador: {
                  especialidad: {
                    contains: query.search,
                    mode: 'insensitive' as const,
                  },
                },
              },
            ],
          }
        : {}),
      ...(query.categoryId ? { categoria_id: query.categoryId } : {}),
      ...(query.available !== undefined ? { disponible: query.available } : {}),
      ...(query.verified !== undefined || query.available === true
        ? {
            prestador: {
              verificado: query.verified,
              disponible: query.available === true ? true : undefined,
            },
          }
        : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            precio_base: {
              gte: query.minPrice,
              lte: query.maxPrice,
            },
          }
        : {}),
    };

    const [services, total] = await this.prisma.$transaction([
      this.prisma.servicio.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy:
          query.sort === 'price_asc'
            ? { precio_base: 'asc' }
            : query.sort === 'price_desc'
              ? { precio_base: 'desc' }
              : { fecha_creacion: 'desc' },
        include: {
          prestador: true,
          categoria: true,
          calificaciones: { select: { puntuacion: true } },
        },
      }),
      this.prisma.servicio.count({ where }),
    ]);

    const mapped = services
      .map((service) => this.toCatalogItem(service, query.lat, query.lng))
      .filter(
        (service) =>
          (query.minRating === undefined ||
            service.rating >= query.minRating) &&
          (query.radiusKm === undefined ||
            (service.distanciaKm !== null &&
              service.distanciaKm <= query.radiusKm)),
      );
    if (query.sort === 'rating') {
      mapped.sort((a, b) => b.rating - a.rating);
    } else if (query.sort === 'distance') {
      mapped.sort(
        (a, b) =>
          (a.distanciaKm ?? Number.POSITIVE_INFINITY) -
          (b.distanciaKm ?? Number.POSITIVE_INFINITY),
      );
    } else if (query.sort === 'availability') {
      mapped.sort((a, b) =>
        a.disponibilidad === b.disponibilidad
          ? 0
          : a.disponibilidad === 'Disponible'
            ? -1
            : 1,
      );
    }

    return {
      data: mapped,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findCategories() {
    const categories = await this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: {
            servicios: {
              where: {
                disponible: true,
                prestador: { disponible: true },
              },
            },
          },
        },
      },
    });

    return {
      data: categories.map((category) => ({
        id: category.id,
        nombre: category.nombre,
        providersAvailable: category._count.servicios,
      })),
    };
  }

  async findOne(id: number) {
    const service = await this.prisma.servicio.findUnique({
      where: { id },
      include: {
        prestador: true,
        categoria: true,
        calificaciones: {
          select: { puntuacion: true, comentario: true, fecha_creacion: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return {
      ...this.toCatalogItem(service),
      descripcion: service.descripcion,
      experienciaAnios: service.prestador.experiencia_anios,
      zonaCobertura: service.prestador.zona_cobertura,
      etiquetas: service.prestador.etiquetas,
      coordinates: {
        lat: service.prestador.lat,
        lng: service.prestador.lng,
      },
    };
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
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio_base: data.precio_base,
        disponible: data.disponible,
        categoria_id: data.categoryId,
      },
      include: {
        prestador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
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

  private toCatalogItem(
    service: {
      id: number;
      titulo: string;
      descripcion: string;
      precio_base: number;
      disponible: boolean;
      prestador_id: number;
      categoria: { id: number; nombre: string } | null;
      prestador: {
        nombre: string;
        apellido: string | null;
        especialidad: string | null;
        disponible: boolean;
        verificado: boolean;
        lat: number | null;
        lng: number | null;
        experiencia_anios: number | null;
        zona_cobertura: string | null;
        etiquetas: string[];
      };
      calificaciones: { puntuacion: number }[];
    },
    originLat?: number,
    originLng?: number,
  ) {
    const reviews = service.calificaciones.length;
    const rating = reviews
      ? service.calificaciones.reduce(
          (total, ratingValue) => total + ratingValue.puntuacion,
          0,
        ) / reviews
      : 0;

    const distanciaKm =
      originLat !== undefined &&
      originLng !== undefined &&
      service.prestador.lat !== null &&
      service.prestador.lng !== null
        ? this.distanceKm(
            originLat,
            originLng,
            service.prestador.lat,
            service.prestador.lng,
          )
        : null;

    return {
      id: service.id,
      providerId: service.prestador_id,
      nombre: [service.prestador.nombre, service.prestador.apellido]
        .filter(Boolean)
        .join(' '),
      oficio: service.prestador.especialidad ?? service.titulo,
      categoria: service.categoria,
      precio: service.precio_base,
      unidadPrecio: 'hora',
      distanciaKm,
      distancia: distanciaKm === null ? null : `${distanciaKm.toFixed(1)} km`,
      disponibilidad:
        service.disponible && service.prestador.disponible
          ? 'Disponible'
          : 'No disponible',
      rating,
      reviews,
      verificado: service.prestador.verificado,
      favorito: false,
    };
  }

  private distanceKm(latA: number, lngA: number, latB: number, lngB: number) {
    const radians = (value: number) => (value * Math.PI) / 180;
    const dLat = radians(latB - latA);
    const dLng = radians(lngB - lngA);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(radians(latA)) *
        Math.cos(radians(latB)) *
        Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
