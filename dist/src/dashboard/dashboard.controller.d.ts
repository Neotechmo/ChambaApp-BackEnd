import type { AuthUser } from '../auth/types/auth-user.type';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    client(user: AuthUser): Promise<{
        activeRequests: number;
        completedServices: number;
        monthSpent: number;
        favorites: number;
        upcoming: {
            id: number;
            title: string;
            scheduledAt: Date | null;
            provider: {
                id: number;
                nombre: string;
                apellido: string | null;
            };
        }[];
    }>;
    provider(user: AuthUser): Promise<{
        pendingRequests: number;
        activeJobs: number;
        completedJobs: number;
        rating: number;
        reviews: number;
        earnings: {
            weekly: {
                date: string;
                amount: number;
            }[];
            monthTotal: number;
            weekTotal: number;
            availableBalance: number;
            monthlyGrowthPercent: number;
        };
    }>;
}
export declare class ProviderEarningsController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    earnings(user: AuthUser, from?: string, to?: string): Promise<{
        weekly: {
            date: string;
            amount: number;
        }[];
        monthTotal: number;
        weekTotal: number;
        availableBalance: number;
        monthlyGrowthPercent: number;
    }>;
    transactions(user: AuthUser): Promise<{
        data: ({
            solicitud: {
                cliente: {
                    id: number;
                    nombre: string;
                    apellido: string | null;
                };
                servicio: {
                    id: number;
                    titulo: string;
                };
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
            };
        } & {
            id: number;
            estado: string;
            fecha_creacion: Date;
            solicitud_id: number;
            monto: number;
            metodo: string | null;
            referencia: string | null;
            fecha_pago: Date | null;
        })[];
    }>;
}
