import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    fetchSurveyRegistrations,
} from '@/lib/admin-api';

export function useSurveys() {
    return useQuery({ queryKey: ['surveys'], queryFn: fetchSurveys });
}

export function useCreateSurvey() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createSurvey(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['surveys'] }),
    });
}

export function useUpdateSurvey() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
            updateSurvey(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['surveys'] }),
    });
}

export function useDeleteSurvey() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteSurvey(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['surveys'] }),
    });
}

export function useSurveyRegistrations(id: number) {
    return useQuery({
        queryKey: ['survey-registrations', id],
        queryFn: () => fetchSurveyRegistrations(id),
        enabled: !!id,
    });
}
