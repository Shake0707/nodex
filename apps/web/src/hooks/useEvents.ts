import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/lib/admin-api';

export function useEvents() {
    return useQuery({ queryKey: ['events'], queryFn: fetchEvents });
}

export function useCreateEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createEvent(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    });
}

export function useUpdateEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateEvent(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    });
}

export function useDeleteEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteEvent(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    });
}
