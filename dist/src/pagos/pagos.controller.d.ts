import type { AuthUser } from '../auth/types/auth-user.type';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { CreateRequestPaymentDto } from './dto/request-payment.dto';
import { PagosService } from './pagos.service';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    create(data: CreatePagoDto, user: AuthUser): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    findAll(user: AuthUser): Promise<({
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
    findOne(id: number, user: AuthUser): Promise<{
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
    update(id: number, data: UpdatePagoDto, user: AuthUser): Promise<{
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
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
export declare class RequestPaymentsController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    getPayment(id: number, user: AuthUser): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    createPayment(id: number, data: CreateRequestPaymentDto, user: AuthUser): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
    confirmPayment(id: number, user: AuthUser): Promise<{
        id: number;
        requestId: number;
        amount: number;
        method: string | null;
        reference: string | null;
        status: string;
        paidAt: Date | null;
    }>;
}
