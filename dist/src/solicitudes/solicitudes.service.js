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
const notifications_service_1 = require("../notifications/notifications.service");
const chats_gateway_1 = require("../chats/chats.gateway");
let SolicitudesService = class SolicitudesService {
    prisma;
    notifications;
    events;
    constructor(prisma, notifications, events) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.events = events;
    }
    async create(data, userId) {
        const service = await this.prisma.servicio.findUnique({
            where: { id: data.servicio_id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        const request = await this.prisma.solicitud.create({
            data: {
                descripcion: data.descripcion,
                direccion_servicio: data.direccion_servicio,
                cliente_id: userId,
                servicio_id: data.servicio_id,
            },
            include: this.includeRelations(),
        });
        return this.toRequestResponse(request, userId);
    }
    async createRequest(data, userId) {
        const scheduledAt = this.futureDate(data.fechaSolicitada);
        if (!data.serviceId && !data.providerId) {
            throw new common_1.BadRequestException('Debes seleccionar un servicio o prestador');
        }
        const service = await this.prisma.servicio.findFirst({
            where: data.serviceId
                ? { id: data.serviceId }
                : {
                    prestador_id: data.providerId,
                    categoria_id: data.categoryId,
                    disponible: true,
                },
            include: { prestador: true },
        });
        if (!service || !service.disponible || !service.prestador.disponible) {
            throw new common_1.NotFoundException('Servicio disponible no encontrado');
        }
        if (service.prestador_id === userId) {
            throw new common_1.BadRequestException('No puedes solicitar tu propio servicio');
        }
        const address = data.direccionId
            ? await this.prisma.direccion.findFirst({
                where: { id: data.direccionId, usuario_id: userId },
            })
            : null;
        if (data.direccionId && !address) {
            throw new common_1.NotFoundException('Direccion no encontrada');
        }
        const request = await this.prisma.solicitud.create({
            data: {
                titulo: data.titulo,
                descripcion: data.descripcion,
                prioridad: data.prioridad ?? 'normal',
                fecha_programada: scheduledAt,
                duracion_estimada_min: data.duracionEstimadaMin,
                direccion_servicio: data.direccion ?? address?.calle,
                direccion_id: address?.id,
                precio_estimado: data.precioEstimado ?? service.precio_base,
                cliente_id: userId,
                servicio_id: service.id,
            },
            include: this.includeRelations(),
        });
        await this.notify(service.prestador_id, 'Nueva solicitud agendada', `Tienes una solicitud para ${scheduledAt.toISOString()}.`);
        this.events.emitUserEvent(service.prestador_id, 'requestCreated', {
            requestId: request.id,
            scheduledAt,
        });
        return this.toRequestResponse(request, userId);
    }
    async findMine(userId) {
        const requests = await this.prisma.solicitud.findMany({
            where: { cliente_id: userId },
            include: this.includeRelations(),
            orderBy: { fecha_solicitud: 'desc' },
        });
        return {
            data: requests.map((request) => this.toRequestResponse(request, userId)),
        };
    }
    async findProviderRequests(userId) {
        const requests = await this.prisma.solicitud.findMany({
            where: {
                servicio: { prestador_id: userId },
                estado: { in: ['pending', 'rejected', 'cancelled'] },
            },
            include: this.includeRelations(),
            orderBy: { fecha_solicitud: 'desc' },
        });
        return {
            data: requests.map((request) => this.toRequestResponse(request, userId)),
        };
    }
    async findProviderJobs(userId) {
        const requests = await this.prisma.solicitud.findMany({
            where: {
                servicio: { prestador_id: userId },
                estado: { in: ['accepted', 'on_the_way', 'in_progress', 'completed'] },
            },
            include: this.includeRelations(),
            orderBy: { fecha_programada: 'asc' },
        });
        return {
            data: requests.map((request) => this.toRequestResponse(request, userId)),
        };
    }
    async findProviderCalendar(userId) {
        return this.findProviderJobs(userId);
    }
    async findRequest(id, userId, rolId) {
        const request = await this.findOne(id, userId, rolId);
        return this.toRequestResponse(request, userId);
    }
    async cancelRequest(id, userId) {
        const request = await this.prisma.solicitud.findUnique({
            where: { id },
            include: { servicio: true },
        });
        if (!request || request.cliente_id !== userId) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (!['pending', 'accepted'].includes(request.estado)) {
            throw new common_1.ConflictException('La solicitud ya no puede cancelarse');
        }
        const updated = await this.changeStatus(id, 'cancelled', userId);
        this.events.emitUserEvent(request.servicio.prestador_id, 'requestStatusChanged', updated);
        return updated;
    }
    async acceptRequest(id, providerId) {
        const updated = await this.prisma.$transaction(async (transaction) => {
            await transaction.$executeRaw `SELECT pg_advisory_xact_lock(${providerId})`;
            const request = await this.getProviderRequest(id, providerId, transaction);
            if (request.estado !== 'pending') {
                throw new common_1.ConflictException('La solicitud ya fue respondida');
            }
            await this.ensureAvailable(request, providerId, transaction);
            return transaction.solicitud.update({
                where: { id },
                data: { estado: 'accepted' },
                include: this.includeRelations(),
            });
        });
        await this.notify(updated.cliente_id, 'Solicitud aceptada', 'Tu solicitud fue aceptada por el prestador.');
        const response = this.toRequestResponse(updated, providerId);
        this.events.emitUserEvent(updated.cliente_id, 'requestStatusChanged', response);
        return response;
    }
    async rejectRequest(id, providerId, motivo) {
        const request = await this.getProviderRequest(id, providerId);
        if (request.estado !== 'pending') {
            throw new common_1.ConflictException('La solicitud ya fue respondida');
        }
        const updated = await this.prisma.solicitud.update({
            where: { id },
            data: {
                estado: 'rejected',
                descripcion: motivo
                    ? `${request.descripcion ?? ''}\nMotivo rechazo: ${motivo}`.trim()
                    : undefined,
            },
            include: this.includeRelations(),
        });
        await this.notify(request.cliente_id, 'Solicitud rechazada', motivo ?? 'El prestador rechazo la solicitud.');
        const response = this.toRequestResponse(updated, providerId);
        this.events.emitUserEvent(request.cliente_id, 'requestStatusChanged', response);
        return response;
    }
    async rescheduleRequest(id, clientId, data) {
        const request = await this.getClientRequest(id, clientId);
        if (request.estado !== 'pending') {
            throw new common_1.ConflictException('Solo puedes reprogramar una solicitud pendiente');
        }
        const scheduledAt = this.futureDate(data.fechaSolicitada);
        const updated = await this.prisma.solicitud.update({
            where: { id },
            data: {
                fecha_programada: scheduledAt,
                duracion_estimada_min: data.duracionEstimadaMin ?? request.duracion_estimada_min,
                fecha_propuesta: null,
                propuesta_pendiente: false,
            },
            include: this.includeRelations(),
        });
        await this.notify(request.servicio.prestador_id, 'Solicitud reprogramada', `El cliente cambio la fecha a ${scheduledAt.toISOString()}.`);
        this.events.emitUserEvent(request.servicio.prestador_id, 'requestRescheduled', {
            requestId: id,
            scheduledAt,
        });
        return this.toRequestResponse(updated, clientId);
    }
    async proposeDate(id, providerId, proposedDate) {
        const request = await this.getProviderRequest(id, providerId);
        if (request.estado !== 'pending') {
            throw new common_1.ConflictException('Solo puedes proponer fecha para una solicitud pendiente');
        }
        const date = this.futureDate(proposedDate);
        const updated = await this.prisma.solicitud.update({
            where: { id },
            data: { fecha_propuesta: date, propuesta_pendiente: true },
            include: this.includeRelations(),
        });
        await this.notify(request.cliente_id, 'Nueva fecha propuesta', `El prestador propuso ${date.toISOString()} para tu servicio.`);
        this.events.emitUserEvent(request.cliente_id, 'dateProposed', {
            requestId: id,
            proposedAt: date,
        });
        return this.toRequestResponse(updated, providerId);
    }
    async acceptProposedDate(id, clientId) {
        const request = await this.getClientRequest(id, clientId);
        if (request.estado !== 'pending' ||
            !request.propuesta_pendiente ||
            !request.fecha_propuesta) {
            throw new common_1.ConflictException('No hay una propuesta de fecha pendiente');
        }
        const updated = await this.prisma.solicitud.update({
            where: { id },
            data: {
                fecha_programada: request.fecha_propuesta,
                fecha_propuesta: null,
                propuesta_pendiente: false,
            },
            include: this.includeRelations(),
        });
        await this.notify(request.servicio.prestador_id, 'Fecha propuesta aceptada', 'El cliente acepto la nueva fecha solicitada.');
        this.events.emitUserEvent(request.servicio.prestador_id, 'dateAccepted', {
            requestId: id,
            scheduledAt: request.fecha_propuesta,
        });
        return this.toRequestResponse(updated, clientId);
    }
    async updateJobStatus(id, providerId, status) {
        const request = await this.getProviderRequest(id, providerId);
        const allowed = {
            accepted: ['on_the_way', 'in_progress'],
            on_the_way: ['in_progress'],
            in_progress: ['completed'],
        };
        if (!allowed[request.estado]?.includes(status)) {
            throw new common_1.ConflictException('Cambio de estado no permitido');
        }
        const updated = await this.changeStatus(id, status, providerId);
        this.events.emitUserEvent(request.cliente_id, 'requestStatusChanged', updated);
        return updated;
    }
    async findAll(userId, rolId) {
        if (rolId === 1) {
            return this.prisma.solicitud.findMany({
                include: this.includeRelations(),
                orderBy: { id: 'asc' },
            });
        }
        const requests = await this.prisma.solicitud.findMany({
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
        return {
            data: requests.map((request) => this.toRequestResponse(request, userId)),
        };
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
        const nextStatus = data.estado
            ? this.normalizeStatus(data.estado)
            : solicitud.estado;
        if (rolId !== 1 && data.estado) {
            if (solicitud.cliente_id === userId && nextStatus !== 'cancelled') {
                throw new common_1.ForbiddenException('Solo puedes cancelar tu solicitud');
            }
            if (solicitud.servicio.prestador_id === userId &&
                ![
                    'accepted',
                    'rejected',
                    'on_the_way',
                    'in_progress',
                    'completed',
                ].includes(nextStatus)) {
                throw new common_1.ForbiddenException('Estado no permitido para el prestador');
            }
        }
        const updated = await this.prisma.solicitud.update({
            where: { id },
            data: { ...data, estado: data.estado ? nextStatus : undefined },
            include: this.includeRelations(),
        });
        return this.toRequestResponse(updated, userId);
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
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    telefono: true,
                    rol: true,
                },
            },
            servicio: {
                include: {
                    prestador: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            telefono: true,
                            rol: true,
                        },
                    },
                },
            },
            pago: true,
            calificacion: true,
            direccion: true,
        };
    }
    async getProviderRequest(id, providerId, database = this.prisma) {
        const request = await database.solicitud.findFirst({
            where: { id, servicio: { prestador_id: providerId } },
            include: this.includeRelations(),
        });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        return request;
    }
    async changeStatus(id, status, viewerId) {
        const updated = await this.prisma.solicitud.update({
            where: { id },
            data: { estado: status },
            include: this.includeRelations(),
        });
        return this.toRequestResponse(updated, viewerId);
    }
    normalizeStatus(status) {
        const statuses = {
            pendiente: 'pending',
            aceptada: 'accepted',
            rechazada: 'rejected',
            completada: 'completed',
            cancelada: 'cancelled',
        };
        return statuses[status] ?? status;
    }
    toRequestResponse(request, viewerId) {
        const mayShowContact = request.cliente.id === viewerId ||
            ['accepted', 'on_the_way', 'in_progress', 'completed'].includes(request.estado);
        return {
            id: request.id,
            title: request.titulo ?? request.servicio.titulo,
            description: request.descripcion,
            priority: request.prioridad,
            status: this.normalizeStatus(request.estado),
            requestedAt: request.fecha_solicitud,
            scheduledAt: request.fecha_programada,
            proposedAt: request.fecha_propuesta,
            hasPendingDateProposal: request.propuesta_pendiente,
            estimatedDurationMin: request.duracion_estimada_min,
            estimatedPrice: request.precio_estimado ?? request.servicio.precio_base,
            finalPrice: request.precio_final,
            payment: request.pago
                ? {
                    id: request.pago.id,
                    amount: request.pago.monto,
                    method: request.pago.metodo,
                    reference: request.pago.referencia,
                    status: this.normalizePaymentStatus(request.pago.estado),
                    paidAt: request.pago.fecha_pago,
                }
                : null,
            address: mayShowContact
                ? request.direccion
                    ? {
                        id: request.direccion.id,
                        street: request.direccion.calle,
                        city: request.direccion.ciudad,
                        state: request.direccion.estado,
                        lat: request.direccion.lat,
                        lng: request.direccion.lng,
                    }
                    : request.direccion_servicio
                : null,
            client: {
                id: request.cliente.id,
                nombre: [request.cliente.nombre, request.cliente.apellido]
                    .filter(Boolean)
                    .join(' '),
                telefono: mayShowContact ? request.cliente.telefono : null,
            },
            provider: {
                id: request.servicio.prestador.id,
                nombre: [
                    request.servicio.prestador.nombre,
                    request.servicio.prestador.apellido,
                ]
                    .filter(Boolean)
                    .join(' '),
                telefono: mayShowContact ? request.servicio.prestador.telefono : null,
            },
            service: { id: request.servicio.id, title: request.servicio.titulo },
        };
    }
    async getClientRequest(id, clientId) {
        const request = await this.prisma.solicitud.findFirst({
            where: { id, cliente_id: clientId },
            include: this.includeRelations(),
        });
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        return request;
    }
    futureDate(value) {
        const date = new Date(value);
        if (date.getTime() <= Date.now()) {
            throw new common_1.BadRequestException('La fecha solicitada debe ser futura');
        }
        return date;
    }
    async ensureAvailable(request, providerId, database = this.prisma) {
        if (!request.fecha_programada || !request.duracion_estimada_min) {
            throw new common_1.BadRequestException('La solicitud debe tener fecha y duracion para aceptarse');
        }
        const active = await database.solicitud.findMany({
            where: {
                id: { not: request.id },
                estado: { in: ['accepted', 'on_the_way', 'in_progress'] },
                servicio: { prestador_id: providerId },
                fecha_programada: { not: null },
                duracion_estimada_min: { not: null },
            },
            select: {
                fecha_programada: true,
                duracion_estimada_min: true,
            },
        });
        const start = request.fecha_programada.getTime();
        const end = start + request.duracion_estimada_min * 60_000;
        const conflicts = active.some((job) => {
            const otherStart = job.fecha_programada.getTime();
            const otherEnd = otherStart + job.duracion_estimada_min * 60_000;
            return start < otherEnd && end > otherStart;
        });
        if (conflicts) {
            throw new common_1.ConflictException({
                message: 'Ya tienes un servicio agendado en ese horario',
                code: 'SCHEDULE_CONFLICT',
            });
        }
    }
    normalizePaymentStatus(status) {
        const statuses = {
            pendiente: 'pending',
            pagado: 'paid',
            fallido: 'failed',
            reembolsado: 'refunded',
        };
        return statuses[status] ?? status;
    }
    async notify(userId, title, message) {
        await this.notifications.create({ userId, title, message });
    }
};
exports.SolicitudesService = SolicitudesService;
exports.SolicitudesService = SolicitudesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        chats_gateway_1.ChatsGateway])
], SolicitudesService);
//# sourceMappingURL=solicitudes.service.js.map