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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoritesService = class FavoritesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(clienteId) {
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
    async create(clienteId, providerId) {
        const provider = await this.prisma.usuario.findFirst({
            where: { id: providerId, rol: { nombre: 'prestador' } },
        });
        if (!provider) {
            throw new common_1.NotFoundException('Prestador no encontrado');
        }
        if (clienteId === providerId) {
            throw new common_1.ConflictException('No puedes guardar tu propio perfil');
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
    async remove(clienteId, providerId) {
        await this.prisma.favorito.deleteMany({
            where: { cliente_id: clienteId, prestador_id: providerId },
        });
        return { providerId, favorito: false };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map