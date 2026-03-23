'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/lib/admin-api';
import EventForm from '@/components/admin/EventForm';

export default function EditEventPage() {
    const params = useParams();
    const eventId = Number(params.id);

    const { data, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const events = Array.isArray(data) ? data : [];
    const event = events.find((e: { id: number }) => e.id === eventId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400">
                Yuklanmoqda...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center py-20 text-red-400">
                Tadbir topilmadi
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Tadbirni tahrirlash</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EventForm
                    initialData={{
                        id: event.id,
                        title_uz: event.title_uz,
                        title_en: event.title_en,
                        title_ru: event.title_ru,
                        description_uz: event.description_uz,
                        description_en: event.description_en,
                        description_ru: event.description_ru,
                        event_date: event.event_date,
                        location: event.location,
                        preview_image_url: event.preview_image_url || '',
                        images: event.images || [],
                    }}
                    isEditing
                />
            </div>
        </div>
    );
}
