import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAPI, logoutAPI, getMeAPI } from '@/lib/admin-api';
import { useRouter } from 'next/navigation';

export function useMe() {
    return useQuery({
        queryKey: ['admin-me'],
        queryFn: () => getMeAPI().then((r) => r.data),
        retry: false,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            loginAPI(username, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-me'] });
            router.push('/admin');
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logoutAPI,
        onSuccess: () => {
            queryClient.clear();
            router.push('/admin/login');
        },
    });
}
