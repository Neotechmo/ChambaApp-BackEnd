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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        return service;
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
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map