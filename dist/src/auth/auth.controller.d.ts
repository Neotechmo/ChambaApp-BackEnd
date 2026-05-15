import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(data: RegisterDto): Promise<{
        message: string;
        user: {
            nombre: string;
            correo: string;
            telefono: string;
        };
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
        user: {
            nombre: string;
            correo: string;
            telefono: string;
        };
    }>;
}
