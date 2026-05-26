import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RejectRequestDto, UpdateJobStatusDto } from './dto/request-action.dto';
import { ProposeDateDto, RescheduleRequestDto } from './dto/reschedule-request.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { SolicitudesService } from './solicitudes.service';
export declare class SolicitudesController {
    private readonly solicitudesService;
    constructor(solicitudesService: SolicitudesService);
    create(data: CreateSolicitudDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    findAll(user: AuthUser): Promise<({
        cliente: {
            id: number;
            nombre: string;
            apellido: string | null;
            telefono: string | null;
            rol: {
                id: number;
                nombre: string;
            };
        };
        servicio: {
            prestador: {
                id: number;
                nombre: string;
                apellido: string | null;
                telefono: string | null;
                rol: {
                    id: number;
                    nombre: string;
                };
            };
        } & {
            id: number;
            disponible: boolean;
            titulo: string;
            descripcion: string;
            precio_base: number;
            fecha_creacion: Date;
            prestador_id: number;
            categoria_id: number | null;
        };
        direccion: {
            id: number;
            ciudad: string;
            estado: string;
            lat: number | null;
            lng: number | null;
            etiqueta: string | null;
            calle: string;
            codigo_postal: string | null;
            usuario_id: number;
        } | null;
        pago: {
            id: number;
            estado: string;
            fecha_creacion: Date;
            solicitud_id: number;
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
    })[] | {
        data: {
            id: number;
            title: string;
            description: string | null;
            priority: string;
            status: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            proposedAt: Date | null;
            hasPendingDateProposal: boolean;
            estimatedDurationMin: number | null;
            estimatedPrice: number;
            finalPrice: number | null;
            payment: {
                id: number;
                amount: number;
                method: string | null;
                reference: string | null;
                status: string;
                paidAt: Date | null;
            } | null;
            address: string | {
                id: number;
                street: string;
                city: string;
                state: string;
                lat: number | null;
                lng: number | null;
            } | null;
            client: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            provider: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            service: {
                id: number;
                title: string;
            };
        }[];
    }>;
    findOne(id: number, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    update(id: number, data: UpdateSolicitudDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
export declare class RequestsController {
    private readonly solicitudesService;
    constructor(solicitudesService: SolicitudesService);
    create(data: CreateRequestDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    findMine(user: AuthUser): Promise<{
        data: {
            id: number;
            title: string;
            description: string | null;
            priority: string;
            status: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            proposedAt: Date | null;
            hasPendingDateProposal: boolean;
            estimatedDurationMin: number | null;
            estimatedPrice: number;
            finalPrice: number | null;
            payment: {
                id: number;
                amount: number;
                method: string | null;
                reference: string | null;
                status: string;
                paidAt: Date | null;
            } | null;
            address: string | {
                id: number;
                street: string;
                city: string;
                state: string;
                lat: number | null;
                lng: number | null;
            } | null;
            client: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            provider: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            service: {
                id: number;
                title: string;
            };
        }[];
    }>;
    findOne(id: number, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    cancel(id: number, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    reschedule(id: number, data: RescheduleRequestDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    acceptProposedDate(id: number, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
}
export declare class ProviderRequestsController {
    private readonly solicitudesService;
    constructor(solicitudesService: SolicitudesService);
    findRequests(user: AuthUser): Promise<{
        data: {
            id: number;
            title: string;
            description: string | null;
            priority: string;
            status: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            proposedAt: Date | null;
            hasPendingDateProposal: boolean;
            estimatedDurationMin: number | null;
            estimatedPrice: number;
            finalPrice: number | null;
            payment: {
                id: number;
                amount: number;
                method: string | null;
                reference: string | null;
                status: string;
                paidAt: Date | null;
            } | null;
            address: string | {
                id: number;
                street: string;
                city: string;
                state: string;
                lat: number | null;
                lng: number | null;
            } | null;
            client: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            provider: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            service: {
                id: number;
                title: string;
            };
        }[];
    }>;
    accept(id: number, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    reject(id: number, data: RejectRequestDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    proposeDate(id: number, data: ProposeDateDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    findJobs(user: AuthUser): Promise<{
        data: {
            id: number;
            title: string;
            description: string | null;
            priority: string;
            status: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            proposedAt: Date | null;
            hasPendingDateProposal: boolean;
            estimatedDurationMin: number | null;
            estimatedPrice: number;
            finalPrice: number | null;
            payment: {
                id: number;
                amount: number;
                method: string | null;
                reference: string | null;
                status: string;
                paidAt: Date | null;
            } | null;
            address: string | {
                id: number;
                street: string;
                city: string;
                state: string;
                lat: number | null;
                lng: number | null;
            } | null;
            client: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            provider: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            service: {
                id: number;
                title: string;
            };
        }[];
    }>;
    updateStatus(id: number, data: UpdateJobStatusDto, user: AuthUser): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        proposedAt: Date | null;
        hasPendingDateProposal: boolean;
        estimatedDurationMin: number | null;
        estimatedPrice: number;
        finalPrice: number | null;
        payment: {
            id: number;
            amount: number;
            method: string | null;
            reference: string | null;
            status: string;
            paidAt: Date | null;
        } | null;
        address: string | {
            id: number;
            street: string;
            city: string;
            state: string;
            lat: number | null;
            lng: number | null;
        } | null;
        client: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        provider: {
            id: number;
            nombre: string;
            telefono: string | null;
        };
        service: {
            id: number;
            title: string;
        };
    }>;
    getCalendar(user: AuthUser): Promise<{
        data: {
            id: number;
            title: string;
            description: string | null;
            priority: string;
            status: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            proposedAt: Date | null;
            hasPendingDateProposal: boolean;
            estimatedDurationMin: number | null;
            estimatedPrice: number;
            finalPrice: number | null;
            payment: {
                id: number;
                amount: number;
                method: string | null;
                reference: string | null;
                status: string;
                paidAt: Date | null;
            } | null;
            address: string | {
                id: number;
                street: string;
                city: string;
                state: string;
                lat: number | null;
                lng: number | null;
            } | null;
            client: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            provider: {
                id: number;
                nombre: string;
                telefono: string | null;
            };
            service: {
                id: number;
                title: string;
            };
        }[];
    }>;
}
