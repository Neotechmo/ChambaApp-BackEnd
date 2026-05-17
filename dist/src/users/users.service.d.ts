import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    update(id: number, data: UpdateUserDto, requesterId: number, rolId: number): Promise<{
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
    private userSelect;
}
