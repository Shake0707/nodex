const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
}

export interface Event {
    id: number;
    title_uz: string;
    title_en: string;
    title_ru: string;
    description_uz: string;
    description_en: string;
    description_ru: string;
    image_url: string;
    preview_image_url: string;
    images: string[];
    event_date: string;
    location: string;
}

export interface Partner {
    id: number;
    name: string;
    logo_image_url: string;
    website_url: string | null;
}

export interface Stats {
    members_count: number;
    events_count: number;
    partners_count: number;
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
}

export const getMembers = () => fetchAPI<Member[]>('/members');
export const getEvents = () => fetchAPI<Event[]>('/events');
export const getEvent = (id: number) => fetchAPI<Event>(`/events/${id}`);
export const getPartners = () => fetchAPI<Partner[]>('/partners');
export const getStats = () => fetchAPI<Stats>('/stats');

/** Convert relative /uploads/... path to full backend URL */
export function getUploadUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = API_BASE.replace('/api', '');
    return `${base}${path}`;
}
