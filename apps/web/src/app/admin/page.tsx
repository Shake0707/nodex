'use client';

import { useMembers } from '@/hooks/useMembers';
import { useEvents } from '@/hooks/useEvents';
import { usePartners } from '@/hooks/usePartners';

export default function DashboardPage() {
    const { data: membersData } = useMembers();
    const { data: eventsData } = useEvents();
    const { data: partnersData } = usePartners();

    const members = Array.isArray(membersData) ? membersData : [];
    const events = Array.isArray(eventsData) ? eventsData : [];
    const partners = Array.isArray(partnersData) ? partnersData : [];

    const stats = [
        { value: members.length, label: '👥 Members', color: 'text-blue-500' },
        { value: events.length, label: '🏆 Events', color: 'text-green-500' },
        { value: partners.length, label: '🤝 Partners', color: 'text-purple-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
