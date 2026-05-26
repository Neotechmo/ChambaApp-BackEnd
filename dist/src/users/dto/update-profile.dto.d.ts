declare class LocationDto {
    ciudad?: string;
    estado?: string;
    lat?: number;
    lng?: number;
}
export declare class UpdateProfileDto {
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
    avatar?: string;
    ubicacion?: LocationDto;
    preferencias?: Record<string, boolean | string[]>;
}
export {};
