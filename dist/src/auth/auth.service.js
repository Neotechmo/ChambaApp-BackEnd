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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const nest_winston_1 = require("nest-winston");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    logger;
    constructor(prisma, jwtService, logger) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = logger;
    }
    async register(data) {
        this.logger.log({ message: 'Intento de registro', correo: data.correo }, 'AuthService');
        const userExists = await this.prisma.usuario.findUnique({
            where: {
                correo: data.correo,
            },
        });
        if (userExists) {
            this.logger.warn({ message: 'Registro fallido: correo duplicado', correo: data.correo }, 'AuthService');
            throw new common_1.ConflictException('El correo ya existe');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const roleName = data.rol ?? (data.rol_id === 3 ? 'prestador' : 'cliente');
        const role = await this.prisma.role.findUnique({
            where: {
                nombre: roleName,
            },
        });
        if (!role) {
            throw new common_1.BadRequestException('Rol no valido para registro');
        }
        const user = await this.prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                telefono: data.telefono,
                password_hash: hashedPassword,
                rol_id: role.id,
            },
            include: {
                rol: true,
            },
        });
        this.logger.log({ message: 'Usuario registrado', userId: user.id, rol: user.rol.nombre }, 'AuthService');
        return {
            message: `Usuario ${data.nombre} ha sido registrado`,
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                rol: user.rol.nombre,
                telefono: user.telefono,
            },
        };
    }
    async login(data) {
        const user = await this.prisma.usuario.findUnique({
            where: {
                correo: data.correo,
            },
            include: {
                rol: true,
            },
        });
        if (!user) {
            this.logger.warn({ message: 'Login fallido: usuario no encontrado', correo: data.correo }, 'AuthService');
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        if (!user.activo) {
            this.logger.warn({ message: 'Login fallido: cuenta desactivada', userId: user.id }, 'AuthService');
            throw new common_1.UnauthorizedException('La cuenta esta desactivada');
        }
        const passwordMatch = await bcrypt.compare(data.password, user.password_hash);
        if (!passwordMatch) {
            this.logger.warn({ message: 'Login fallido: contraseña incorrecta', userId: user.id }, 'AuthService');
            throw new common_1.UnauthorizedException('Contraseña es incorrecta');
        }
        this.logger.log({ message: 'Login exitoso', userId: user.id, rol: user.rol.nombre }, 'AuthService');
        const payload = {
            sub: user.id,
            correo: user.correo,
            rol_id: user.rol_id,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                rol: user.rol.nombre,
                telefono: user.telefono,
                avatar: user.foto_perfil,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map