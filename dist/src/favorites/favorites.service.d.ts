import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(clienteId: number): Promise<{
        data: {
            id: number;
            providerId: number;
            nombre: string;
            oficio: string;
            categoria: {
                id: number;
                nombre: string;
            } | null;
            precio: number;
            unidadPrecio: string;
            disponibilidad: string;
            rating: number;
            reviews: number;
            verificado: boolean;
            favorito: boolean;
        }[];
    }>;
    create(clienteId: number, providerId: number): Promise<{
        providerId: number;
        favorito: boolean;
    }>;
    remove(clienteId: number, providerId: number): Promise<{
        providerId: number;
        favorito: boolean;
    }>;
}
