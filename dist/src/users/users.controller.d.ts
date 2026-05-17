import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: AuthUser): Promise<{
        id: number;
        nombre: string;
        correo: string;
        apellido: string | null;
        telefono: string | null;
        foto_perfil: string | null;
        activo: boolean;
        verificado: boolean;
        fecha_registro: Date;
        rol: {
            id: number;
            nombre: string;
        };
        servicios: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        }[];
        solicitudes: {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_realizadas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_recibidas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    }>;
    create(data: CreateUserDto): Promise<{
        id: number;
        nombre: string;
        correo: string;
        apellido: string | null;
        telefono: string | null;
        foto_perfil: string | null;
        activo: boolean;
        verificado: boolean;
        fecha_registro: Date;
        rol: {
            id: number;
            nombre: string;
        };
        servicios: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        }[];
        solicitudes: {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_realizadas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_recibidas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    }>;
    findAll(): Promise<{
        id: number;
        nombre: string;
        correo: string;
        apellido: string | null;
        telefono: string | null;
        foto_perfil: string | null;
        activo: boolean;
        verificado: boolean;
        fecha_registro: Date;
        rol: {
            id: number;
            nombre: string;
        };
        servicios: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        }[];
        solicitudes: {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_realizadas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_recibidas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        nombre: string;
        correo: string;
        apellido: string | null;
        telefono: string | null;
        foto_perfil: string | null;
        activo: boolean;
        verificado: boolean;
        fecha_registro: Date;
        rol: {
            id: number;
            nombre: string;
        };
        servicios: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        }[];
        solicitudes: {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_realizadas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_recibidas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    }>;
    update(id: number, data: UpdateUserDto, user: AuthUser): Promise<{
        id: number;
        nombre: string;
        correo: string;
        apellido: string | null;
        telefono: string | null;
        foto_perfil: string | null;
        activo: boolean;
        verificado: boolean;
        fecha_registro: Date;
        rol: {
            id: number;
            nombre: string;
        };
        servicios: {
            id: number;
            titulo: string;
            descripcion: string;
            precio_base: number;
            disponible: boolean;
            fecha_creacion: Date;
            prestador_id: number;
        }[];
        solicitudes: {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_realizadas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones_recibidas: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
