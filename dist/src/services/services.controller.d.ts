import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import type { Request } from 'express';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(data: CreateServiceDto, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        titulo: string;
        descripcion: string;
        precio_base: number;
        disponible: boolean;
        fecha_creacion: Date;
        id: number;
        prestador_id: number;
    }>;
    findAll(): Promise<({
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
            correo: string;
            password_hash: string;
            telefono: string | null;
            foto_perfil: string | null;
            activo: boolean;
            verificado: boolean;
            fecha_registro: Date;
            rol_id: number;
        };
    } & {
        titulo: string;
        descripcion: string;
        precio_base: number;
        disponible: boolean;
        fecha_creacion: Date;
        id: number;
        prestador_id: number;
    })[]>;
}
