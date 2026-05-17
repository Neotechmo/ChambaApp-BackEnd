import { PrismaService } from '../prisma/prisma.service';
import type { CreatePagoDto } from './dto/create-pago.dto';
import type { UpdatePagoDto } from './dto/update-pago.dto';
export declare class PagosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePagoDto, userId: number, rolId: number): Promise<{
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
    findAll(userId: number, rolId: number): Promise<({
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
    findOne(id: number, userId: number, rolId: number): Promise<{
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
    update(id: number, data: UpdatePagoDto, userId: number, rolId: number): Promise<{
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
    remove(id: number, userId: number, rolId: number): Promise<{
        message: string;
    }>;
    private includeRelations;
}
