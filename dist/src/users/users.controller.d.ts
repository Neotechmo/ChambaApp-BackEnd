import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: AuthUser): Promise<{
        id: number;
        rol: string;
        nombre: string;
        apellido: string | null;
        correo: string;
        telefono: string | null;
        avatar: string | null;
        ubicacion: {
            ciudad: string | null;
            estado: string | null;
            lat: number | null;
            lng: number | null;
        };
        preferencias: string | number | boolean | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        estadisticas: {
            solicitudes: number;
            completados: number;
            favoritos: number;
            ratingExperiencia: number | null;
        };
        especialidad: string | null;
        descripcion: string | null;
        experienciaAnios: number | null;
        precioHora: number | null;
        zonaCobertura: string | null;
        disponible: boolean;
        verificado: boolean;
        etiquetas: string[];
    }>;
    updateProfile(data: UpdateProfileDto, user: AuthUser): Promise<{
        id: number;
        rol: string;
        nombre: string;
        apellido: string | null;
        correo: string;
        telefono: string | null;
        avatar: string | null;
        ubicacion: {
            ciudad: string | null;
            estado: string | null;
            lat: number | null;
            lng: number | null;
        };
        preferencias: string | number | boolean | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        estadisticas: {
            solicitudes: number;
            completados: number;
            favoritos: number;
            ratingExperiencia: number | null;
        };
        especialidad: string | null;
        descripcion: string | null;
        experienciaAnios: number | null;
        precioHora: number | null;
        zonaCobertura: string | null;
        disponible: boolean;
        verificado: boolean;
        etiquetas: string[];
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
            disponible: boolean;
            titulo: string;
            descripcion: string;
            precio_base: number;
            fecha_creacion: Date;
            prestador_id: number;
            categoria_id: number | null;
        }[];
        solicitudes: {
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
            disponible: boolean;
            titulo: string;
            descripcion: string;
            precio_base: number;
            fecha_creacion: Date;
            prestador_id: number;
            categoria_id: number | null;
        }[];
        solicitudes: {
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
            disponible: boolean;
            titulo: string;
            descripcion: string;
            precio_base: number;
            fecha_creacion: Date;
            prestador_id: number;
            categoria_id: number | null;
        }[];
        solicitudes: {
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
            disponible: boolean;
            titulo: string;
            descripcion: string;
            precio_base: number;
            fecha_creacion: Date;
            prestador_id: number;
            categoria_id: number | null;
        }[];
        solicitudes: {
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
export declare class ProvidersProfileController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfessionalProfile(data: UpdateProviderProfileDto, user: AuthUser): Promise<{
        id: number;
        rol: string;
        nombre: string;
        apellido: string | null;
        correo: string;
        telefono: string | null;
        avatar: string | null;
        ubicacion: {
            ciudad: string | null;
            estado: string | null;
            lat: number | null;
            lng: number | null;
        };
        preferencias: string | number | boolean | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        estadisticas: {
            solicitudes: number;
            completados: number;
            favoritos: number;
            ratingExperiencia: number | null;
        };
        especialidad: string | null;
        descripcion: string | null;
        experienciaAnios: number | null;
        precioHora: number | null;
        zonaCobertura: string | null;
        disponible: boolean;
        verificado: boolean;
        etiquetas: string[];
    }>;
}
export declare class ProviderAvailabilityController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateAvailability(data: UpdateAvailabilityDto, user: AuthUser): Promise<{
        id: number;
        rol: string;
        nombre: string;
        apellido: string | null;
        correo: string;
        telefono: string | null;
        avatar: string | null;
        ubicacion: {
            ciudad: string | null;
            estado: string | null;
            lat: number | null;
            lng: number | null;
        };
        preferencias: string | number | boolean | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        estadisticas: {
            solicitudes: number;
            completados: number;
            favoritos: number;
            ratingExperiencia: number | null;
        };
        especialidad: string | null;
        descripcion: string | null;
        experienciaAnios: number | null;
        precioHora: number | null;
        zonaCobertura: string | null;
        disponible: boolean;
        verificado: boolean;
        etiquetas: string[];
    }>;
}
