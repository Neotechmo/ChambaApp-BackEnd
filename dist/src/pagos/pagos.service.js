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
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PagosService = class PagosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId, rolId) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id: data.solicitud_id },
            include: { servicio: true, pago: true },
        });
        if (!solicitud) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (solicitud.pago) {
            throw new common_1.ConflictException('La solicitud ya tiene pago registrado');
        }
        if (rolId !== 1 && solicitud.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes pagar esta solicitud');
        }
        return this.prisma.pago.create({
            data: {
                monto: data.monto,
                metodo: data.metodo,
                referencia: data.referencia,
                solicitud_id: data.solicitud_id,
            },
            include: this.includeRelations(),
        });
    }
    async findAll(userId, rolId) {
        if (rolId === 1) {
            return this.prisma.pago.findMany({
                include: this.includeRelations(),
                orderBy: { id: 'asc' },
            });
        }
        return this.prisma.pago.findMany({
            where: {
                solicitud: {
                    OR: [
                        { cliente_id: userId },
                        {
                            servicio: {
                                prestador_id: userId,
                            },
                        },
                    ],
                },
            },
            include: this.includeRelations(),
            orderBy: { id: 'asc' },
        });
    }
    async findOne(id, userId, rolId) {
        const pago = await this.prisma.pago.findUnique({
            where: { id },
            include: this.includeRelations(),
        });
        if (!pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        if (rolId !== 1 &&
            pago.solicitud.cliente_id !== userId &&
            pago.solicitud.servicio.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes ver este pago');
        }
        return pago;
    }
    async update(id, data, userId, rolId) {
        const pago = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && pago.solicitud.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes editar este pago');
        }
        return this.prisma.pago.update({
            where: { id },
            data: {
                monto: data.monto,
                metodo: data.metodo,
                referencia: data.referencia,
                estado: data.estado,
                fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : undefined,
            },
            include: this.includeRelations(),
        });
    }
    async remove(id, userId, rolId) {
        const pago = await this.findOne(id, userId, rolId);
        if (rolId !== 1 && pago.solicitud.cliente_id !== userId) {
            throw new common_1.ForbiddenException('No puedes eliminar este pago');
        }
        await this.prisma.pago.delete({
            where: { id },
        });
        return {
            message: 'Pago eliminado correctamente',
        };
    }
    includeRelations() {
        return {
            solicitud: {
                include: {
                    cliente: true,
                    servicio: {
                        include: {
                            prestador: true,
                        },
                    },
                },
            },
        };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagosService);
//# sourceMappingURL=pagos.service.js.map