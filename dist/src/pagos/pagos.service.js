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
const notifications_service_1 = require("../notifications/notifications.service");
const chats_gateway_1 = require("../chats/chats.gateway");
let PagosService = class PagosService {
    prisma;
    notifications;
    events;
    constructor(prisma, notifications, events) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.events = events;
    }
    async create(data, userId, rolId) {
        void rolId;
        return this.createForRequest(data.solicitud_id, { method: data.metodo ?? 'no_especificado', reference: data.referencia }, userId);
    }
    async createForRequest(requestId, data, userId) {
        const request = await this.payableRequest(requestId, userId);
        if (request.pago) {
            throw new common_1.ConflictException('La solicitud ya tiene pago registrado');
        }
        const payment = await this.prisma.pago.create({
            data: {
                monto: this.amountFor(request),
                metodo: data.method,
                referencia: data.reference,
                solicitud_id: request.id,
            },
        });
        return this.toPaymentResponse(payment);
    }
    async findByRequest(requestId, userId, rolId) {
        const request = await this.prisma.solicitud.findUnique({
            where: { id: requestId },
            include: { servicio: true, pago: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (rolId !== 1 &&
            request.cliente_id !== userId &&
            request.servicio.prestador_id !== userId) {
            throw new common_1.ForbiddenException('No puedes ver este pago');
        }
        if (!request.pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        return this.toPaymentResponse(request.pago);
    }
    async confirm(requestId, userId) {
        const request = await this.payableRequest(requestId, userId);
        if (!request.pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        if (this.normalizeStatus(request.pago.estado) === 'paid') {
            return this.toPaymentResponse(request.pago);
        }
        if (this.normalizeStatus(request.pago.estado) !== 'pending') {
            throw new common_1.ConflictException('El pago ya no puede confirmarse');
        }
        const payment = await this.prisma.pago.update({
            where: { id: request.pago.id },
            data: { estado: 'paid', fecha_pago: new Date() },
        });
        await this.notifications.create({
            userId: request.servicio.prestador_id,
            title: 'Pago confirmado',
            message: `El pago de la solicitud ${request.id} fue confirmado.`,
        });
        this.events.emitUserEvent(request.servicio.prestador_id, 'paymentPaid', this.toPaymentResponse(payment));
        return this.toPaymentResponse(payment);
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
        if (rolId !== 1 &&
            (data.monto !== undefined || data.estado || data.fecha_pago)) {
            throw new common_1.ForbiddenException('No puedes modificar el monto o estado del pago');
        }
        const updated = await this.prisma.pago.update({
            where: { id },
            data: {
                monto: rolId === 1 ? data.monto : undefined,
                metodo: data.metodo,
                referencia: data.referencia,
                estado: data.estado,
                fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : undefined,
            },
            include: this.includeRelations(),
        });
        return updated;
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
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                        },
                    },
                    servicio: {
                        include: {
                            prestador: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    apellido: true,
                                },
                            },
                        },
                    },
                },
            },
        };
    }
    async payableRequest(requestId, userId) {
        const request = await this.prisma.solicitud.findFirst({
            where: { id: requestId, cliente_id: userId },
            include: { servicio: true, pago: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (!['accepted', 'on_the_way', 'in_progress', 'completed'].includes(request.estado)) {
            throw new common_1.BadRequestException('Solo puedes pagar una solicitud aceptada o completada');
        }
        return request;
    }
    amountFor(request) {
        return (request.precio_final ??
            request.precio_estimado ??
            request.servicio.precio_base);
    }
    toPaymentResponse(payment) {
        return {
            id: payment.id,
            requestId: payment.solicitud_id,
            amount: payment.monto,
            method: payment.metodo,
            reference: payment.referencia,
            status: this.normalizeStatus(payment.estado),
            paidAt: payment.fecha_pago,
        };
    }
    normalizeStatus(status) {
        const aliases = {
            pendiente: 'pending',
            pagado: 'paid',
            fallido: 'failed',
            reembolsado: 'refunded',
        };
        return aliases[status] ?? status;
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        chats_gateway_1.ChatsGateway])
], PagosService);
//# sourceMappingURL=pagos.service.js.map