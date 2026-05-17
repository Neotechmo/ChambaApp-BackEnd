import type { AuthUser } from '../auth/types/auth-user.type';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(data: CreateServiceDto, user: AuthUser): Promise<{
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
    }>;
    findAll(): Promise<({
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
        solicitudes: {
            id: number;
            descripcion: string | null;
            direccion_servicio: string | null;
            estado: string;
            fecha_solicitud: Date;
            cliente_id: number;
            servicio_id: number;
        }[];
        calificaciones: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    } & {
        id: number;
        titulo: string;
        descripcion: string;
        precio_base: number;
        disponible: boolean;
        fecha_creacion: Date;
        prestador_id: number;
    })[]>;
    findOne(id: number): Promise<{
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
        solicitudes: ({
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
        })[];
        calificaciones: {
            id: number;
            fecha_creacion: Date;
            prestador_id: number;
            puntuacion: number;
            comentario: string | null;
            solicitud_id: number;
            cliente_id: number;
            servicio_id: number;
        }[];
    } & {
        id: number;
        titulo: string;
        descripcion: string;
        precio_base: number;
        disponible: boolean;
        fecha_creacion: Date;
        prestador_id: number;
    }>;
    update(id: number, data: UpdateServiceDto, user: AuthUser): Promise<{
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
    }>;
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
