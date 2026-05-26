import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        message: string;
        user: {
            id: number;
            nombre: string;
            apellido: string | null;
            correo: string;
            rol: string;
            telefono: string | null;
        };
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            nombre: string;
            apellido: string | null;
            correo: string;
            rol: string;
            telefono: string | null;
            avatar: string | null;
        };
    }>;
}
