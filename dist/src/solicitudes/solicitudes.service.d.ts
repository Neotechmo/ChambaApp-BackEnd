import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatsGateway } from '../chats/chats.gateway';
import type { CreateSolicitudDto } from './dto/create-solicitud.dto';
import type { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { RescheduleRequestDto } from './dto/reschedule-request.dto';
export declare class SolicitudesService {
    private readonly prisma;
    private readonly notifications;
    private readonly events;
    constructor(prisma: PrismaService, notifications: NotificationsService, events: ChatsGateway);
    create(data: CreateSolicitudDto, userId: number): Promise<{
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
    createRequest(data: CreateRequestDto, userId: number): Promise<{
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
    findMine(userId: number): Promise<{
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
    findProviderRequests(userId: number): Promise<{
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
    findProviderJobs(userId: number): Promise<{
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
    findProviderCalendar(userId: number): Promise<{
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
    findRequest(id: number, userId: number, rolId: number): Promise<{
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
    cancelRequest(id: number, userId: number): Promise<{
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
    acceptRequest(id: number, providerId: number): Promise<{
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
    rejectRequest(id: number, providerId: number, motivo?: string): Promise<{
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
    rescheduleRequest(id: number, clientId: number, data: RescheduleRequestDto): Promise<{
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
    proposeDate(id: number, providerId: number, proposedDate: string): Promise<{
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
    acceptProposedDate(id: number, clientId: number): Promise<{
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
    updateJobStatus(id: number, providerId: number, status: string): Promise<{
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
    findAll(userId: number, rolId: number): Promise<({
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
    findOne(id: number, userId: number, rolId: number): Promise<{
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
    }>;
    update(id: number, data: UpdateSolicitudDto, userId: number, rolId: number): Promise<{
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
    remove(id: number, userId: number, rolId: number): Promise<{
        message: string;
    }>;
    private includeRelations;
    private getProviderRequest;
    private changeStatus;
    private normalizeStatus;
    private toRequestResponse;
    private getClientRequest;
    private futureDate;
    private ensureAvailable;
    private normalizePaymentStatus;
    private notify;
}
