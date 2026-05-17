import { PrismaService } from '../prisma/prisma.service';
import type { CreateCalificacionDto } from './dto/create-calificacion.dto';
import type { UpdateCalificacionDto } from './dto/update-calificacion.dto';
export declare class CalificacionesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCalificacionDto, userId: number, rolId: number): Promise<{
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
    findAll(userId: number, rolId: number): Promise<({
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
    findOne(id: number, userId: number, rolId: number): Promise<{
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
    update(id: number, data: UpdateCalificacionDto, userId: number, rolId: number): Promise<{
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
    remove(id: number, userId: number, rolId: number): Promise<{
        message: string;
    }>;
    private includeRelations;
}
