import { PrismaService } from '../prisma/prisma.service';
import type { CreateCalificacionDto } from './dto/create-calificacion.dto';
import type { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import type { CreateReviewDto } from './dto/create-review.dto';
export declare class CalificacionesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCalificacionDto, userId: number, rolId: number): Promise<{
        cliente: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        servicio: {
            id: number;
            titulo: string;
        };
        solicitud: {
            id: number;
            estado: string;
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
    createReview(solicitudId: number, data: CreateReviewDto, userId: number): Promise<{
        cliente: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        servicio: {
            id: number;
            titulo: string;
        };
        solicitud: {
            id: number;
            estado: string;
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
    providerReviews(providerId: number): Promise<{
        summary: {
            average: number;
            total: number;
            satisfactionPercent: number;
            distribution: Record<string, number>;
        };
        data: {
            id: number;
            clientName: string;
            service: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
        }[];
    }>;
    findAll(userId: number, rolId: number): Promise<({
        cliente: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        servicio: {
            id: number;
            titulo: string;
        };
        solicitud: {
            id: number;
            estado: string;
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
            apellido: string | null;
        };
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        servicio: {
            id: number;
            titulo: string;
        };
        solicitud: {
            id: number;
            estado: string;
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
            apellido: string | null;
        };
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
        };
        servicio: {
            id: number;
            titulo: string;
        };
        solicitud: {
            id: number;
            estado: string;
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
