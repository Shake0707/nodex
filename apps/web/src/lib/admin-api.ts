import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

/* ========== Auth ========== */
export const loginAPI = (username: string, password: string) =>
    api.post('/auth/login', { username, password });

export const logoutAPI = () => api.post('/auth/logout');

export const getMeAPI = () => api.get('/auth/me');

/* ========== Members ========== */
export const fetchMembers = () => api.get('/members').then((r) => r.data.data);
export const createMember = (data: Record<string, unknown>) =>
    api.post('/members', data);
export const updateMember = (id: number, data: Record<string, unknown>) =>
    api.put(`/members/${id}`, data);
export const deleteMember = (id: number) => api.delete(`/members/${id}`);

/* ========== Events ========== */
export const fetchEvents = () => api.get('/events').then((r) => r.data.data);
export const createEvent = (data: Record<string, unknown>) =>
    api.post('/events', data);
export const updateEvent = (id: number, data: Record<string, unknown>) =>
    api.put(`/events/${id}`, data);
export const deleteEvent = (id: number) => api.delete(`/events/${id}`);

/* ========== Partners ========== */
export const fetchPartners = () => api.get('/partners').then((r) => r.data.data);
export const createPartner = (data: Record<string, unknown>) =>
    api.post('/partners', data);
export const updatePartner = (id: number, data: Record<string, unknown>) =>
    api.put(`/partners/${id}`, data);
export const deletePartner = (id: number) => api.delete(`/partners/${id}`);

/* ========== Upload ========== */
export const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': undefined as unknown as string },
    });
    return res.data.data.url;
};

/* ========== Stats ========== */
export const fetchStats = () => api.get('/stats').then((r) => r.data);

/* ========== Public Events Search ========== */
export const searchEvents = (params: { q?: string; page?: number; limit?: number; sort?: string }) =>
    api.get('/events/search', { params }).then((r) => r.data);
