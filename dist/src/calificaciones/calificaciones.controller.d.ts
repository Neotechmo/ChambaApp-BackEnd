import type { AuthUser } from '../auth/types/auth-user.type';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class CalificacionesController {
    private readonly calificacionesService;
    constructor(calificacionesService: CalificacionesService);
    create(data: CreateCalificacionDto, user: AuthUser): Promise<{
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
    findAll(user: AuthUser): Promise<({
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
    findOne(id: number, user: AuthUser): Promise<{
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
    update(id: number, data: UpdateCalificacionDto, user: AuthUser): Promise<{
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
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
export declare class RequestReviewsController {
    private readonly calificacionesService;
    constructor(calificacionesService: CalificacionesService);
    create(id: number, data: CreateReviewDto, user: AuthUser): Promise<{
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
}
export declare class ProviderPublicReviewsController {
    private readonly calificacionesService;
    constructor(calificacionesService: CalificacionesService);
    findReviews(id: number): Promise<{
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
}
export declare class ProviderReviewSummaryController {
    private readonly calificacionesService;
    constructor(calificacionesService: CalificacionesService);
    summary(user: AuthUser): Promise<{
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
}
