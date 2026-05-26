import type { AuthUser } from '../auth/types/auth-user.type';
import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(user: AuthUser): Promise<{
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
    create(providerId: number, user: AuthUser): Promise<{
        providerId: number;
        favorito: boolean;
    }>;
    remove(providerId: number, user: AuthUser): Promise<{
        providerId: number;
        favorito: boolean;
    }>;
}
