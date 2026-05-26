import type { AuthUser } from '../auth/types/auth-user.type';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(data: CreateServiceDto, user: AuthUser): Promise<{
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
            rol: {
                id: number;
                nombre: string;
            };
        };
    } & {
        id: number;
        disponible: boolean;
        titulo: string;
        descripcion: string;
        precio_base: number;
        fecha_creacion: Date;
        prestador_id: number;
        categoria_id: number | null;
    }>;
    findAll(query: ListServicesQueryDto): Promise<{
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
            distanciaKm: number | null;
            distancia: string | null;
            disponibilidad: string;
            rating: number;
            reviews: number;
            verificado: boolean;
            favorito: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        descripcion: string;
        experienciaAnios: number | null;
        zonaCobertura: string | null;
        etiquetas: string[];
        coordinates: {
            lat: number | null;
            lng: number | null;
        };
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
        distanciaKm: number | null;
        distancia: string | null;
        disponibilidad: string;
        rating: number;
        reviews: number;
        verificado: boolean;
        favorito: boolean;
    }>;
    update(id: number, data: UpdateServiceDto, user: AuthUser): Promise<{
        prestador: {
            id: number;
            nombre: string;
            apellido: string | null;
            rol: {
                id: number;
                nombre: string;
            };
        };
    } & {
        id: number;
        disponible: boolean;
        titulo: string;
        descripcion: string;
        precio_base: number;
        fecha_creacion: Date;
        prestador_id: number;
        categoria_id: number | null;
    }>;
    remove(id: number, user: AuthUser): Promise<{
        message: string;
    }>;
}
export declare class CategoriesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(): Promise<{
        data: {
            id: number;
            nombre: string;
            providersAvailable: number;
        }[];
    }>;
}
