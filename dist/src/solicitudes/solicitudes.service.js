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
exports.SolicitudesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SolicitudesService = class SolicitudesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
        const service = await this.prisma.servicio.findUnique({
            where: { id: data.servicio_id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Servicio no encontrado');
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
    async findAll(userId, rolId) {
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
    async findOne(id, userId, rolId) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id },
            include: this.includeRelations(),
        });
        if (!solicitud) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (rolId !== 1 &&
            solicitud.cliente_id !== userId &&
            solicitud.servicio.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes ver esta solicitud');
        }
        return solicitud;
    }
    async update(id, data, userId, rolId) {
        const solicitud = await this.findOne(id, userId, rolId);
        if (rolId !== 1 &&
            solicitud.cliente_id !== userId &&
            solicitud.servicio.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes editar esta solicitud');
        }
        return this.prisma.solicitud.update({
            where: { id },
            data,
            include: this.includeRelations(),
        });
    }
    async remove(id, userId, rolId) {
        const solicitud = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && solicitud.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes eliminar esta solicitud');
        }
        await this.prisma.solicitud.delete({
            where: { id },
        });
        return {
            message: 'Solicitud eliminada correctamente',
        };
    }
    includeRelations() {
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
};
exports.SolicitudesService = SolicitudesService;
exports.SolicitudesService = SolicitudesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SolicitudesService);
//# sourceMappingURL=solicitudes.service.js.map