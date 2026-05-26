export declare class ListServicesQueryDto {
    search?: string;
    categoryId?: number;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    available?: boolean;
    verified?: boolean;
    sort?: string;
    page: number;
    limit: number;
}
