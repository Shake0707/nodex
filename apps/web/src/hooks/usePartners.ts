import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPartners, createPartner, updatePartner, deletePartner } from '@/lib/admin-api';

export function usePartners() {
    return useQuery({ queryKey: ['partners'], queryFn: fetchPartners });
}

export function useCreatePartner() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createPartner(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['partners'] }),
    });
}

export function useUpdatePartner() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updatePartner(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['partners'] }),
    });
}

export function useDeletePartner() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePartner(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['partners'] }),
    });
}
