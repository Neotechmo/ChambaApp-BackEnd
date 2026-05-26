"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async client(userId) {
        const monthStart = this.monthStart();
        const [requests, favorites, monthPayments] = await Promise.all([
            this.prisma.solicitud.findMany({
                where: { cliente_id: userId },
                include: {
                    servicio: {
                        include: {
                            prestador: { select: { id: true, nombre: true, apellido: true } },
                        },
                    },
                },
                orderBy: { fecha_programada: 'asc' },
            }),
            this.prisma.favorito.count({ where: { cliente_id: userId } }),
            this.prisma.pago.aggregate({
                where: {
                    solicitud: { cliente_id: userId },
                    fecha_pago: { gte: monthStart },
                    estado: 'paid',
                },
                _sum: { monto: true },
            }),
        ]);
        return {
            activeRequests: requests.filter((request) => ['pending', 'accepted', 'on_the_way', 'in_progress'].includes(request.estado)).length,
            completedServices: requests.filter((request) => request.estado === 'completed').length,
            monthSpent: monthPayments._sum.monto ?? 0,
            favorites,
            upcoming: requests
                .filter((request) => request.fecha_programada && request.estado === 'accepted')
                .slice(0, 5)
                .map((request) => ({
                id: request.id,
                title: request.titulo ?? request.servicio.titulo,
                scheduledAt: request.fecha_programada,
                provider: request.servicio.prestador,
            })),
        };
    }
    async provider(userId) {
        const [requests, ratings, earnings] = await Promise.all([
            this.prisma.solicitud.findMany({
                where: { servicio: { prestador_id: userId } },
            }),
            this.prisma.calificacion.findMany({
                where: { prestador_id: userId },
                select: { puntuacion: true },
            }),
            this.earnings(userId),
        ]);
        const average = ratings.length
            ? ratings.reduce((total, rating) => total + rating.puntuacion, 0) /
                ratings.length
            : 0;
        return {
            pendingRequests: requests.filter((request) => request.estado === 'pending').length,
            activeJobs: requests.filter((request) => ['accepted', 'on_the_way', 'in_progress'].includes(request.estado)).length,
            completedJobs: requests.filter((request) => request.estado === 'completed').length,
            rating: average,
            reviews: ratings.length,
            earnings,
        };
    }
    async earnings(userId, from, to) {
        const start = from ? new Date(from) : this.monthStart();
        const end = to ? new Date(to) : new Date();
        const payments = await this.prisma.pago.findMany({
            where: {
                solicitud: { servicio: { prestador_id: userId } },
                estado: 'paid',
                fecha_pago: { gte: start, lte: end },
            },
            orderBy: { fecha_creacion: 'asc' },
        });
        const byDay = new Map();
        for (const payment of payments) {
            const date = payment.fecha_pago.toISOString().slice(0, 10);
            byDay.set(date, (byDay.get(date) ?? 0) + payment.monto);
        }
        const total = payments.reduce((sum, payment) => sum + payment.monto, 0);
        return {
            weekly: Array.from(byDay, ([date, amount]) => ({ date, amount })),
            monthTotal: total,
            weekTotal: total,
            availableBalance: total,
            monthlyGrowthPercent: 0,
        };
    }
    async transactions(userId) {
        const payments = await this.prisma.pago.findMany({
            where: {
                solicitud: { servicio: { prestador_id: userId } },
                estado: 'paid',
            },
            include: {
                solicitud: {
                    include: {
                        cliente: { select: { id: true, nombre: true, apellido: true } },
                        servicio: { select: { id: true, titulo: true } },
                    },
                },
            },
            orderBy: { fecha_creacion: 'desc' },
        });
        return { data: payments };
    }
    monthStart() {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map