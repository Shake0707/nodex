'use client';

import EventForm from '@/components/admin/EventForm';

export default function NewEventPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Yangi tadbir qo'shish</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EventForm />
            </div>
        </div>
    );
}
