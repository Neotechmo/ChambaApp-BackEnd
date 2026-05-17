import type { AuthUser } from '../auth/types/auth-user.type';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagosService } from './pagos.service';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    create(data: CreatePagoDto, user: AuthUser): Promise<{
        solicitud: {
            cliente: {
                id: number;
                nombre: string;
                correo: string;
                apellido: string | null;
                password_hash: string;
                telefono: string | null;
                foto_perfil: string | null;
                activo: boolean;
                verificado: boolean;
                fecha_registro: Date;
                rol_id: number;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    correo: string;
                    apellido: string | null;
                    password_hash: string;
                    telefono: string | null;
                    foto_perfil: string | null;
                    activo: boolean;
                    verificado: boolean;
                    fecha_registro: Date;
                    rol_id: number;
                };
            } & {
                id: number;
                titulo: string;
                descripcion: string;
                precio_base: number;
                disponible: boolean;
                fecha_creacion: Date;
                prestador_id: number;
            };
        } & {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        };
    } & {
        id: number;
        fecha_creacion: Date;
        solicitud_id: number;
        estado: string;
        monto: number;
        metodo: string | null;
        referencia: string | null;
        fecha_pago: Date | null;
    }>;
    findAll(user: AuthUser): Promise<({
        solicitud: {
            cliente: {
                id: number;
                nombre: string;
                correo: string;
                apellido: string | null;
                password_hash: string;
                telefono: string | null;
                foto_perfil: string | null;
                activo: boolean;
                verificado: boolean;
                fecha_registro: Date;
                rol_id: number;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    correo: string;
                    apellido: string | null;
                    password_hash: string;
                    telefono: string | null;
                    foto_perfil: string | null;
                    activo: boolean;
                    verificado: boolean;
                    fecha_registro: Date;
                    rol_id: number;
                };
            } & {
                id: number;
                titulo: string;
                descripcion: string;
                precio_base: number;
                disponible: boolean;
                fecha_creacion: Date;
                prestador_id: number;
            };
        } & {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        };
    } & {
        id: number;
        fecha_creacion: Date;
        solicitud_id: number;
        estado: string;
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
                correo: string;
                apellido: string | null;
                password_hash: string;
                telefono: string | null;
                foto_perfil: string | null;
                activo: boolean;
                verificado: boolean;
                fecha_registro: Date;
                rol_id: number;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    correo: string;
                    apellido: string | null;
                    password_hash: string;
                    telefono: string | null;
                    foto_perfil: string | null;
                    activo: boolean;
                    verificado: boolean;
                    fecha_registro: Date;
                    rol_id: number;
                };
            } & {
                id: number;
                titulo: string;
                descripcion: string;
                precio_base: number;
                disponible: boolean;
                fecha_creacion: Date;
                prestador_id: number;
            };
        } & {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        };
    } & {
        id: number;
        fecha_creacion: Date;
        solicitud_id: number;
        estado: string;
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
                correo: string;
                apellido: string | null;
                password_hash: string;
                telefono: string | null;
                foto_perfil: string | null;
                activo: boolean;
                verificado: boolean;
                fecha_registro: Date;
                rol_id: number;
            };
            servicio: {
                prestador: {
                    id: number;
                    nombre: string;
                    correo: string;
                    apellido: string | null;
                    password_hash: string;
                    telefono: string | null;
                    foto_perfil: string | null;
                    activo: boolean;
                    verificado: boolean;
                    fecha_registro: Date;
                    rol_id: number;
                };
            } & {
                id: number;
                titulo: string;
                descripcion: string;
                precio_base: number;
                disponible: boolean;
                fecha_creacion: Date;
                prestador_id: number;
            };
        } & {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        };
    } & {
        id: number;
        fecha_creacion: Date;
        solicitud_id: number;
        estado: string;
        monto: number;
        metodo: string | null;
        referencia: string | null;
        fecha_pago: Date | null;
    }>;
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
