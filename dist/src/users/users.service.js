"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const userExists = await this.prisma.usuario.findUnique({
            where: { correo: data.correo },
        });
        if (userExists) {
            throw new common_1.ConflictException('El correo ya existe');
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        return this.prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                password_hash: passwordHash,
                telefono: data.telefono,
                foto_perfil: data.foto_perfil,
                activo: data.activo,
                verificado: data.verificado,
                rol_id: data.rol_id,
            },
            select: this.userSelect(),
        });
    }
    async findAll() {
        return this.prisma.usuario.findMany({
            select: this.userSelect(),
            orderBy: {
                id: 'asc',
            },
        });
    }
    async findOne(id) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            select: this.userSelect(),
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async getProfile(id) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            include: {
                rol: true,
                solicitudes: { select: { estado: true } },
                favoritos_cliente: { select: { id: true } },
                calificaciones_realizadas: { select: { puntuacion: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const ratings = user.calificaciones_realizadas;
        const ratingExperiencia = ratings.length
            ? ratings.reduce((total, rating) => total + rating.puntuacion, 0) /
                ratings.length
            : null;
        return {
            id: user.id,
            rol: user.rol.nombre,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            telefono: user.telefono,
            avatar: user.foto_perfil,
            ubicacion: {
                ciudad: user.ciudad,
                estado: user.estado,
                lat: user.lat,
                lng: user.lng,
            },
            preferencias: user.preferencias ?? {},
            estadisticas: {
                solicitudes: user.solicitudes.length,
                completados: user.solicitudes.filter((request) => request.estado === 'completed').length,
                favoritos: user.favoritos_cliente.length,
                ratingExperiencia,
            },
            especialidad: user.especialidad,
            descripcion: user.descripcion_profesional,
            experienciaAnios: user.experiencia_anios,
            precioHora: user.precio_hora,
            zonaCobertura: user.zona_cobertura,
            disponible: user.disponible,
            verificado: user.verificado,
            etiquetas: user.etiquetas,
        };
    }
    async updateProfile(id, data) {
        if (data.correo) {
            const existing = await this.prisma.usuario.findUnique({
                where: { correo: data.correo },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('El correo ya existe');
            }
        }
        await this.prisma.usuario.update({
            where: { id },
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                telefono: data.telefono,
                foto_perfil: data.avatar,
                ciudad: data.ubicacion?.ciudad,
                estado: data.ubicacion?.estado,
                lat: data.ubicacion?.lat,
                lng: data.ubicacion?.lng,
                preferencias: data.preferencias,
            },
        });
        return this.getProfile(id);
    }
    async updateProviderProfile(id, data) {
        await this.prisma.usuario.update({
            where: { id },
            data: {
                especialidad: data.especialidad,
                descripcion_profesional: data.descripcion,
                experiencia_anios: data.experienciaAnios,
                precio_hora: data.precioHora,
                zona_cobertura: data.zonaCobertura,
                disponible: data.disponible,
                etiquetas: data.etiquetas,
            },
        });
        return this.getProfile(id);
    }
    async update(id, data, requesterId, rolId) {
        if (rolId !== 1 && requesterId !== id) {
            throw new common_1.ForbiddenException('No puedes editar este usuario');
        }
        await this.findOne(id);
        if (data.correo) {
            const userExists = await this.prisma.usuario.findUnique({
                where: { correo: data.correo },
            });
            if (userExists && userExists.id !== id) {
                throw new common_1.ConflictException('El correo ya existe');
            }
        }
        const passwordHash = data.password
            ? await bcrypt.hash(data.password, 10)
            : undefined;
        return this.prisma.usuario.update({
            where: { id },
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                password_hash: passwordHash,
                telefono: data.telefono,
                foto_perfil: data.foto_perfil,
                activo: data.activo,
                verificado: data.verificado,
                rol_id: rolId === 1 ? data.rol_id : undefined,
            },
            select: this.userSelect(),
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.usuario.delete({
            where: { id },
        });
        return {
            message: 'Usuario eliminado correctamente',
        };
    }
    userSelect() {
        return {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            foto_perfil: true,
            activo: true,
            verificado: true,
            fecha_registro: true,
            rol: true,
            servicios: true,
            solicitudes: true,
            calificaciones_realizadas: true,
            calificaciones_recibidas: true,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map