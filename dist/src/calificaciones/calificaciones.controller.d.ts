import type { AuthUser } from '../auth/types/auth-user.type';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
export declare class CalificacionesController {
    private readonly calificacionesService;
    constructor(calificacionesService: CalificacionesService);
    create(data: CreateCalificacionDto, user: AuthUser): Promise<{
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
        servicio: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        };
        solicitud: {
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
        prestador_id: number;
        puntuacion: number;
        comentario: string | null;
        solicitud_id: number;
        cliente_id: number;
        servicio_id: number;
    }>;
    findAll(user: AuthUser): Promise<({
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
        servicio: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        };
        solicitud: {
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
        prestador_id: number;
        puntuacion: number;
        comentario: string | null;
        solicitud_id: number;
        cliente_id: number;
        servicio_id: number;
    })[]>;
    findOne(id: number, user: AuthUser): Promise<{
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
        servicio: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        };
        solicitud: {
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
        prestador_id: number;
        puntuacion: number;
        comentario: string | null;
        solicitud_id: number;
        cliente_id: number;
        servicio_id: number;
    }>;
    update(id: number, data: UpdateCalificacionDto, user: AuthUser): Promise<{
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
        servicio: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        };
        solicitud: {
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
        prestador_id: number;
        puntuacion: number;
        comentario: string | null;
        solicitud_id: number;
        cliente_id: number;
        servicio_id: number;
    }>;
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
