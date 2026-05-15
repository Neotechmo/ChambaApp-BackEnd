import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateServiceDto, userId: number): Promise<{
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
