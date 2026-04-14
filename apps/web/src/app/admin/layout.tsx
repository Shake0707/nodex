'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useMe } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import '../globals.css';

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function AuthGuard({ children }: { children: ReactNode }) {
    const { data, isLoading, isError } = useMe();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && (isError || !data?.data) && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isLoading, isError, data, pathname, router]);

    if (pathname === '/admin/login') return <>{children}</>;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-400">
                Yuklanmoqda...
            </div>
        );
    }

    if (isError || !data?.data) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 text-[#1a1a2e]">
            <AdminSidebar />
            <main className="flex-1 ml-60 p-8 max-md:ml-0 max-md:p-4">{children}</main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthGuard>{children}</AuthGuard>
        </QueryClientProvider>
    );
}
