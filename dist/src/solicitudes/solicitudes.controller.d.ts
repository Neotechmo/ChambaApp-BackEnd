import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { SolicitudesService } from './solicitudes.service';
export declare class SolicitudesController {
    private readonly solicitudesService;
    constructor(solicitudesService: SolicitudesService);
    create(data: CreateSolicitudDto, user: AuthUser): Promise<{
        cliente: {
            rol: {
                id: number;
                nombre: string;
            };
        } & {
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
                rol: {
                    id: number;
                    nombre: string;
                };
            } & {
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
        pago: {
            id: number;
            fecha_creacion: Date;
            solicitud_id: number;
            estado: string;
            monto: number;
            metodo: string | null;
            referencia: string | null;
            fecha_pago: Date | null;
        } | null;
        calificacion: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        } | null;
    } & {
        id: number;
        descripcion: string | null;
        direccion_servicio: string | null;
        estado: string;
        fecha_solicitud: Date;
        cliente_id: number;
        servicio_id: number;
    }>;
    findAll(user: AuthUser): Promise<({
        cliente: {
            rol: {
                id: number;
                nombre: string;
            };
        } & {
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
                rol: {
                    id: number;
                    nombre: string;
                };
            } & {
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
        pago: {
            id: number;
            fecha_creacion: Date;
            solicitud_id: number;
            estado: string;
            monto: number;
            metodo: string | null;
            referencia: string | null;
            fecha_pago: Date | null;
        } | null;
        calificacion: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        } | null;
    } & {
        id: number;
        descripcion: string | null;
        direccion_servicio: string | null;
        estado: string;
        fecha_solicitud: Date;
        cliente_id: number;
        servicio_id: number;
    })[]>;
    findOne(id: number, user: AuthUser): Promise<{
        cliente: {
            rol: {
                id: number;
                nombre: string;
            };
        } & {
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
                rol: {
                    id: number;
                    nombre: string;
                };
            } & {
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
        pago: {
            id: number;
            fecha_creacion: Date;
            solicitud_id: number;
            estado: string;
            monto: number;
            metodo: string | null;
            referencia: string | null;
            fecha_pago: Date | null;
        } | null;
        calificacion: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        } | null;
    } & {
        id: number;
        descripcion: string | null;
        direccion_servicio: string | null;
        estado: string;
        fecha_solicitud: Date;
        cliente_id: number;
        servicio_id: number;
    }>;
    update(id: number, data: UpdateSolicitudDto, user: AuthUser): Promise<{
        cliente: {
            rol: {
                id: number;
                nombre: string;
            };
        } & {
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
                rol: {
                    id: number;
                    nombre: string;
                };
            } & {
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
        pago: {
            id: number;
            fecha_creacion: Date;
            solicitud_id: number;
            estado: string;
            monto: number;
            metodo: string | null;
            referencia: string | null;
            fecha_pago: Date | null;
        } | null;
        calificacion: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        } | null;
    } & {
        id: number;
        descripcion: string | null;
        direccion_servicio: string | null;
        estado: string;
        fecha_solicitud: Date;
        cliente_id: number;
        servicio_id: number;
    }>;
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
