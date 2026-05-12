const API_BASE = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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

export interface SurveyActive {
    id: number;
    marquee_text_uz: string;
    marquee_text_en: string;
    marquee_text_ru: string;
}

export interface SurveyPublic {
    id: number;
    title_uz: string;
    title_en: string;
    title_ru: string;
    description_uz: string;
    description_en: string;
    description_ru: string;
}

export interface RegistrationData {
    first_name: string;
    last_name: string;
    age: number;
    email: string;
    telegram?: string;
    school: string;
    grade: string;
}

export async function getActiveSurveys(): Promise<SurveyActive[]> {
    try {
        const res = await fetch(`${API_BASE}/surveys/active`, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? json;
    } catch {
        return [];
    }
}

export async function getSurveyPublic(id: number): Promise<SurveyPublic> {
    const res = await fetch(`${API_BASE}/surveys/${id}/public`, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    return json.data ?? json;
}

export async function submitRegistration(id: number, data: RegistrationData): Promise<void> {
    const res = await fetch(`${API_BASE}/surveys/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
    }
}

/** Convert relative /uploads/... path to full backend URL */
export function getUploadUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = API_BASE.replace('/api', '');
    return `${base}${path}`;
}

export const PLACEHOLDER = {
    member: '/placeholders/member.svg',
    partner: '/placeholders/partner.svg',
    event: '/placeholders/event.svg',
} as const;
