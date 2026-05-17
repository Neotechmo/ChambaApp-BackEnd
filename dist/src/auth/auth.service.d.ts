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
            nombre: string;
            correo: string;
            rol: string;
            telefono: string;
        };
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
        user: {
            nombre: string;
            correo: string;
            rol: string;
            telefono: string;
        };
    }>;
}
