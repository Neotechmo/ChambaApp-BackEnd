import { PrismaService } from '../prisma/prisma.service';
import type { AddressDto } from './dto/address.dto';
export declare class AddressesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number): Promise<{
        data: {
            id: number;
            ciudad: string;
            estado: string;
            lat: number | null;
            lng: number | null;
            etiqueta: string | null;
            calle: string;
            codigo_postal: string | null;
            usuario_id: number;
        }[];
    }>;
    create(userId: number, data: AddressDto): import("@prisma/client").Prisma.Prisma__DireccionClient<{
        id: number;
        ciudad: string;
        estado: string;
        lat: number | null;
        lng: number | null;
        etiqueta: string | null;
        calle: string;
        codigo_postal: string | null;
        usuario_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, userId: number, data: AddressDto): Promise<{
        id: number;
        ciudad: string;
        estado: string;
        lat: number | null;
        lng: number | null;
        etiqueta: string | null;
        calle: string;
        codigo_postal: string | null;
        usuario_id: number;
    }>;
}
