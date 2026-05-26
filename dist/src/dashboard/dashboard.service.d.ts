import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    client(userId: number): Promise<{
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
    provider(userId: number): Promise<{
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
    earnings(userId: number, from?: string, to?: string): Promise<{
        weekly: {
            date: string;
            amount: number;
        }[];
        monthTotal: number;
        weekTotal: number;
        availableBalance: number;
        monthlyGrowthPercent: number;
    }>;
    transactions(userId: number): Promise<{
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
    private monthStart;
}
