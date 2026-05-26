"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
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
    async findAll(query) {
        const where = {
            ...(query.search
                ? {
                    OR: [
                        {
                            titulo: {
                                contains: query.search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            descripcion: {
                                contains: query.search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            prestador: {
                                especialidad: {
                                    contains: query.search,
                                    mode: 'insensitive',
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
                orderBy: query.sort === 'price_asc'
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
            .filter((service) => (query.minRating === undefined ||
            service.rating >= query.minRating) &&
            (query.radiusKm === undefined ||
                (service.distanciaKm !== null &&
                    service.distanciaKm <= query.radiusKm)));
        if (query.sort === 'rating') {
            mapped.sort((a, b) => b.rating - a.rating);
        }
        else if (query.sort === 'distance') {
            mapped.sort((a, b) => (a.distanciaKm ?? Number.POSITIVE_INFINITY) -
                (b.distanciaKm ?? Number.POSITIVE_INFINITY));
        }
        else if (query.sort === 'availability') {
            mapped.sort((a, b) => a.disponibilidad === b.disponibilidad
                ? 0
                : a.disponibilidad === 'Disponible'
                    ? -1
                    : 1);
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Servicio no encontrado');
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
    async update(id, data, userId, rolId) {
        const service = await this.prisma.servicio.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        if (rolId !== 1 && service.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes editar este servicio');
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
    async remove(id, userId, rolId) {
        const service = await this.prisma.servicio.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        if (rolId !== 1 && service.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes eliminar este servicio');
        }
        await this.prisma.servicio.delete({
            where: { id },
        });
        return {
            message: 'Servicio eliminado correctamente',
        };
    }
    toCatalogItem(service, originLat, originLng) {
        const reviews = service.calificaciones.length;
        const rating = reviews
            ? service.calificaciones.reduce((total, ratingValue) => total + ratingValue.puntuacion, 0) / reviews
            : 0;
        const distanciaKm = originLat !== undefined &&
            originLng !== undefined &&
            service.prestador.lat !== null &&
            service.prestador.lng !== null
            ? this.distanceKm(originLat, originLng, service.prestador.lat, service.prestador.lng)
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
            disponibilidad: service.disponible && service.prestador.disponible
                ? 'Disponible'
                : 'No disponible',
            rating,
            reviews,
            verificado: service.prestador.verificado,
            favorito: false,
        };
    }
    distanceKm(latA, lngA, latB, lngB) {
        const radians = (value) => (value * Math.PI) / 180;
        const dLat = radians(latB - latA);
        const dLng = radians(lngB - lngA);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(radians(latA)) *
                Math.cos(radians(latB)) *
                Math.sin(dLng / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map