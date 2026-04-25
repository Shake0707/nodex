'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FlagOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEvents, useDeleteEvent } from '@/hooks/useEvents';

interface EventRow {
    id: number;
    title_uz: string;
    event_date: string;
    location: string;
    preview_image_url?: string;
}

export default function EventsPage() {
    const { data, isLoading } = useEvents();
    const removeEvent = useDeleteEvent();

    const events: EventRow[] = Array.isArray(data) ? data : [];

    const handleDelete = (id: number) => {
        if (confirm("O'chirmoqchimisiz?")) removeEvent.mutate(id);
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const getImgUrl = (url?: string) => url ? (url.startsWith('http') ? url : `${apiUrl.replace('/api', '')}${url}`) : null;

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Events</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1a1a2e]">Barcha tadbirlar ({events.length})</h2>
                    <Link
                        href="/admin/events/new"
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        + Qo&apos;shish
                    </Link>
                </div>

                {isLoading ? (
                    <p className="p-6 text-gray-500">Yuklanmoqda...</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Rasm</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Nomi</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Sana</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Joy</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((ev) => (
                                <tr key={ev.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-lg">
                                            {getImgUrl(ev.preview_image_url) ? (
                                                <Image src={getImgUrl(ev.preview_image_url)!} alt={ev.title_uz} fill className="object-cover" />
                                            ) : <FlagOutlined style={{ fontSize: 18, color: '#9ca3af' }} />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50 font-medium">{ev.title_uz}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : '—'}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">{ev.location}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/events/${ev.id}/edit`} className="px-2.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-md flex items-center"><EditOutlined /></Link>
                                            <button className="px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-md cursor-pointer hover:bg-red-100 flex items-center" onClick={() => handleDelete(ev.id)}><DeleteOutlined /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
