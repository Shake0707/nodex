'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    DashboardOutlined,
    TeamOutlined,
    TrophyOutlined,
    UsergroupAddOutlined,
    ThunderboltOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useLogout } from '@/hooks/useAuth';

const links = [
    { href: '/admin', label: 'Dashboard', Icon: DashboardOutlined },
    { href: '/admin/members', label: 'Members', Icon: TeamOutlined },
    { href: '/admin/events', label: 'Events', Icon: TrophyOutlined },
    { href: '/admin/partners', label: 'Partners', Icon: UsergroupAddOutlined },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const logout = useLogout();

    return (
        <aside className="w-60 min-h-screen bg-[#1a1a2e] text-gray-300 flex flex-col p-6 fixed left-0 top-0 z-50 max-md:w-full max-md:min-h-auto max-md:relative max-md:flex-row max-md:p-3 max-md:items-center max-md:overflow-x-auto">
            <div className="flex items-center gap-2.5 mb-10 px-2 max-md:mb-0 max-md:mr-4">
                <ThunderboltOutlined style={{ fontSize: 22, color: '#A855F7' }} />
                <span className="text-lg font-bold tracking-tight">Nodex Admin</span>
            </div>

            <nav className="flex flex-col gap-1 flex-1 max-md:flex-row max-md:gap-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-all max-md:whitespace-nowrap max-md:px-3 max-md:py-2 max-md:text-xs ${
                            pathname === link.href
                                ? 'bg-primary/15 text-blue-400 font-semibold'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <link.Icon style={{ fontSize: 15 }} />
                        {link.label}
                    </Link>
                ))}
            </nav>

            <button
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium text-red-400 text-left transition-all hover:bg-red-500/10 cursor-pointer max-md:whitespace-nowrap max-md:px-3 max-md:py-2 max-md:text-xs"
                onClick={() => logout.mutate()}
            >
                <LogoutOutlined style={{ fontSize: 15 }} />
                Logout
            </button>
        </aside>
    );
}
