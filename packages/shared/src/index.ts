// ==================
// Member Types
// ==================
export interface Member {
    id: number;
    name_uz: string;
    name_en: string;
    name_ru: string;
    role_uz: string;
    role_en: string;
    role_ru: string;
    description_uz: string;
    description_en: string;
    description_ru: string;
    photo_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMemberDto {
    name_uz: string;
    name_en: string;
    name_ru: string;
    role_uz: string;
    role_en: string;
    role_ru: string;
    description_uz: string;
    description_en: string;
    description_ru: string;
    photo_url?: string;
}

export type UpdateMemberDto = Partial<CreateMemberDto>;

// ==================
// Event Types
// ==================
export interface Event {
    id: number;
    title_uz: string;
    title_en: string;
    title_ru: string;
    description_uz: string;
    description_en: string;
    description_ru: string;
    image_url: string;
    event_date: Date;
    location: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateEventDto {
    title_uz: string;
    title_en: string;
    title_ru: string;
    description_uz: string;
    description_en: string;
    description_ru: string;
    image_url?: string;
    event_date: string;
    location: string;
}

export type UpdateEventDto = Partial<CreateEventDto>;

// ==================
// Partner Types
// ==================
export interface Partner {
    id: number;
    name: string;
    logo_image_url: string;
    website_url: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePartnerDto {
    name: string;
    logo_image_url?: string;
    website_url?: string;
}

export type UpdatePartnerDto = Partial<CreatePartnerDto>;

// ==================
// Auth Types
// ==================
export interface Admin {
    id: number;
    username: string;
    created_at: Date;
}

export interface LoginDto {
    username: string;
    password: string;
}

// ==================
// API Response Types
// ==================
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// ==================
// Site Stats
// ==================
export interface SiteStats {
    members_count: number;
    events_count: number;
    partners_count: number;
}

// ==================
// Locale
// ==================
export type Locale = 'uz' | 'en' | 'ru';

export function getLocalizedField<T extends Record<string, any>>(
    item: T,
    field: string,
    locale: Locale,
): string {
    const key = `${field}_${locale}`;
    return (item as any)[key] || (item as any)[`${field}_uz`] || '';
}
