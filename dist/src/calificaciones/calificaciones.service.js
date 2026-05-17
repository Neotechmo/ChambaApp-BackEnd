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
exports.CalificacionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CalificacionesService = class CalificacionesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId, rolId) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id: data.solicitud_id },
            include: {
                servicio: true,
                calificacion: true,
            },
        });
        if (!solicitud) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (solicitud.calificacion) {
            throw new common_1.ConflictException('La solicitud ya fue calificada');
        }
        if (rolId !== 1 && solicitud.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes calificar esta solicitud');
        }
        if (solicitud.estado !== 'completada') {
            throw new common_1.BadRequestException('Solo puedes calificar solicitudes completadas');
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
    async findAll(userId, rolId) {
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
    async findOne(id, userId, rolId) {
        const calificacion = await this.prisma.calificacion.findUnique({
            where: { id },
            include: this.includeRelations(),
        });
        if (!calificacion) {
            throw new common_1.NotFoundException('Calificacion no encontrada');
        }
        if (rolId !== 1 &&
            calificacion.cliente_id !== userId &&
            calificacion.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes ver esta calificacion');
        }
        return calificacion;
    }
    async update(id, data, userId, rolId) {
        const calificacion = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && calificacion.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes editar esta calificacion');
        }
        return this.prisma.calificacion.update({
            where: { id },
            data,
            include: this.includeRelations(),
        });
    }
    async remove(id, userId, rolId) {
        const calificacion = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && calificacion.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes eliminar esta calificacion');
        }
        await this.prisma.calificacion.delete({
            where: { id },
        });
        return {
            message: 'Calificacion eliminada correctamente',
        };
    }
    includeRelations() {
        return {
            cliente: true,
            prestador: true,
            servicio: true,
            solicitud: true,
        };
    }
};
exports.CalificacionesService = CalificacionesService;
exports.CalificacionesService = CalificacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalificacionesService);
//# sourceMappingURL=calificaciones.service.js.map