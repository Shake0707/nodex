import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, createMember, updateMember, deleteMember } from '@/lib/admin-api';

export function useMembers() {
    return useQuery({ queryKey: ['members'], queryFn: fetchMembers });
}

export function useCreateMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createMember(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
    });
}

export function useUpdateMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateMember(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
    });
}

export function useDeleteMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteMember(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
    });
}
