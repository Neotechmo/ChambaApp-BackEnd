import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatsGateway } from '../chats/chats.gateway';
import type { CreatePagoDto } from './dto/create-pago.dto';
import type { CreateRequestPaymentDto } from './dto/request-payment.dto';
import type { UpdatePagoDto } from './dto/update-pago.dto';
export declare class PagosService {
    private readonly prisma;
    private readonly notifications;
    private readonly events;
    constructor(prisma: PrismaService, notifications: NotificationsService, events: ChatsGateway);
    create(data: CreatePagoDto, userId: number, rolId: number): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    createForRequest(requestId: number, data: CreateRequestPaymentDto, userId: number): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    findByRequest(requestId: number, userId: number, rolId: number): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    confirm(requestId: number, userId: number): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    findAll(userId: number, rolId: number): Promise<({
        solicitud: {
            cliente: {
                id: number;
                nombre: string;
                apellido: string | null;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    apellido: string | null;
                };
            } & {
                id: number;
                disponible: boolean;
                titulo: string;
                descripcion: string;
                precio_base: number;
                fecha_creacion: Date;
                prestador_id: number;
                categoria_id: number | null;
            };
        } & {
            id: number;
            estado: string;
            titulo: string | null;
            descripcion: string | null;
            direccion_servicio: string | null;
            prioridad: string;
            fecha_solicitud: Date;
            fecha_programada: Date | null;
            fecha_propuesta: Date | null;
            propuesta_pendiente: boolean;
            duracion_estimada_min: number | null;
            precio_estimado: number | null;
            precio_final: number | null;
            cliente_id: number;
            servicio_id: number;
            direccion_id: number | null;
        };
    } & {
        id: number;
        estado: string;
        fecha_creacion: Date;
        solicitud_id: number;
        monto: number;
        metodo: string | null;
        referencia: string | null;
        fecha_pago: Date | null;
    })[]>;
    findOne(id: number, userId: number, rolId: number): Promise<{
        solicitud: {
            cliente: {
                id: number;
                nombre: string;
                apellido: string | null;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    apellido: string | null;
                };
            } & {
                id: number;
                disponible: boolean;
                titulo: string;
                descripcion: string;
                precio_base: number;
                fecha_creacion: Date;
                prestador_id: number;
                categoria_id: number | null;
            };
        } & {
            id: number;
            estado: string;
            titulo: string | null;
            descripcion: string | null;
            direccion_servicio: string | null;
            prioridad: string;
            fecha_solicitud: Date;
            fecha_programada: Date | null;
            fecha_propuesta: Date | null;
            propuesta_pendiente: boolean;
            duracion_estimada_min: number | null;
            precio_estimado: number | null;
            precio_final: number | null;
            cliente_id: number;
            servicio_id: number;
            direccion_id: number | null;
        };
    } & {
        id: number;
        estado: string;
        fecha_creacion: Date;
        solicitud_id: number;
        monto: number;
        metodo: string | null;
        referencia: string | null;
        fecha_pago: Date | null;
    }>;
    update(id: number, data: UpdatePagoDto, userId: number, rolId: number): Promise<{
        solicitud: {
            cliente: {
                id: number;
                nombre: string;
                apellido: string | null;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    apellido: string | null;
                };
            } & {
                id: number;
                disponible: boolean;
                titulo: string;
                descripcion: string;
                precio_base: number;
                fecha_creacion: Date;
                prestador_id: number;
                categoria_id: number | null;
            };
        } & {
            id: number;
            estado: string;
            titulo: string | null;
            descripcion: string | null;
            direccion_servicio: string | null;
            prioridad: string;
            fecha_solicitud: Date;
            fecha_programada: Date | null;
            fecha_propuesta: Date | null;
            propuesta_pendiente: boolean;
            duracion_estimada_min: number | null;
            precio_estimado: number | null;
            precio_final: number | null;
            cliente_id: number;
            servicio_id: number;
            direccion_id: number | null;
        };
    } & {
        id: number;
        estado: string;
        fecha_creacion: Date;
        solicitud_id: number;
        monto: number;
        metodo: string | null;
        referencia: string | null;
        fecha_pago: Date | null;
    }>;
    remove(id: number, userId: number, rolId: number): Promise<{
        message: string;
    }>;
    private includeRelations;
    private payableRequest;
    private amountFor;
    private toPaymentResponse;
    private normalizeStatus;
}
