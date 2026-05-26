import type { AuthUser } from '../auth/types/auth-user.type';
import { AddressDto } from './dto/address.dto';
import { AddressesService } from './addresses.service';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAll(user: AuthUser): Promise<{
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
    create(data: AddressDto, user: AuthUser): import("@prisma/client").Prisma.Prisma__DireccionClient<{
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
    update(id: number, data: AddressDto, user: AuthUser): Promise<{
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
