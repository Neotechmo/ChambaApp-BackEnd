import type { Request } from 'express';
export declare class UsersController {
    getProfile(req: Request & {
        user: {
            userId: number;
            correo: string;
            rol_id: number;
        };
    }): {
        message: string;
        user: Express.User & {
            userId: number;
            correo: string;
            rol_id: number;
        };
    };
}
