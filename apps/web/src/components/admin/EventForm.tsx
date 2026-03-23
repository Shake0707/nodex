'use client';

import { useState, FormEvent, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents';
import ImageUploader from '@/components/admin/ImageUploader';
import { uploadFile } from '@/lib/admin-api';
import { getUploadUrl } from '@/lib/api';

const RichTextEditor = lazy(() => import('@/components/admin/RichTextEditor'));

interface EventData {
    id?: number;
    title_uz: string; title_en: string; title_ru: string;
    description_uz: string; description_en: string; description_ru: string;
    event_date: string; location: string;
    preview_image_url: string;
    images: string[];
}

interface Props {
    initialData?: EventData;
    isEditing?: boolean;
}

const emptyForm: Omit<EventData, 'id'> = {
    title_uz: '', title_en: '', title_ru: '',
    description_uz: '', description_en: '', description_ru: '',
    event_date: '', location: '',
    preview_image_url: '',
    images: [],
};

export default function EventForm({ initialData, isEditing }: Props) {
    const router = useRouter();
    const createEvent = useCreateEvent();
    const updateEvent = useUpdateEvent();

    const [form, setForm] = useState<Omit<EventData, 'id'>>(
        initialData
            ? {
                title_uz: initialData.title_uz,
                title_en: initialData.title_en,
                title_ru: initialData.title_ru,
                description_uz: initialData.description_uz,
                description_en: initialData.description_en,
                description_ru: initialData.description_ru,
                event_date: initialData.event_date?.slice(0, 10) || '',
                location: initialData.location,
                preview_image_url: initialData.preview_image_url,
                images: initialData.images || [],
            }
            : emptyForm
    );

    const [galleryUploading, setGalleryUploading] = useState(false);

    const set = <K extends keyof Omit<EventData, 'id'>>(key: K, val: Omit<EventData, 'id'>[K]) =>
        setForm((p) => ({ ...p, [key]: val }));

    const handleGalleryUpload = async (files: FileList) => {
        const remaining = 10 - form.images.length;
        const toUpload = Array.from(files).slice(0, remaining);
        if (toUpload.length === 0) return;

        setGalleryUploading(true);
        try {
            const urls = await Promise.all(toUpload.map((f) => uploadFile(f)));
            set('images', [...form.images, ...urls]);
        } catch (err) {
            console.error('Gallery upload error:', err);
        } finally {
            setGalleryUploading(false);
        }
    };

    const removeGalleryImage = (idx: number) => {
        set('images', form.images.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            event_date: form.event_date ? new Date(form.event_date).toISOString() : undefined,
        };

        const onSuccess = () => router.push('/admin/events');

        if (isEditing && initialData?.id) {
            updateEvent.mutate({ id: initialData.id, data: payload }, { onSuccess });
        } else {
            createEvent.mutate(payload, { onSuccess });
        }
    };

    const isPending = createEvent.isPending || updateEvent.isPending;



    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Preview Image */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Preview rasm (asosiy)</h3>
                <ImageUploader
                    value={form.preview_image_url}
                    onChange={(url) => set('preview_image_url', url)}
                    label="Preview rasm"
                />
            </div>

            {/* Gallery */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Galereya ({form.images.length}/10)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                    {form.images.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                                src={getUploadUrl(url) || url}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {form.images.length < 10 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
                            />
                            {galleryUploading ? (
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-2xl text-gray-400 mb-1">+</span>
                                    <span className="text-[10px] text-gray-400">Rasm qo'shish</span>
                                </>
                            )}
                        </label>
                    )}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Titles */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Sarlavhalar</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['uz', 'en', 'ru'] as const).map((lang) => (
                        <div key={lang} className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Nomi ({lang.toUpperCase()})</label>
                            <input
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={form[`title_${lang}`]}
                                onChange={(e) => set(`title_${lang}`, e.target.value)}
                                required={lang === 'uz'}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Date + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Sana</label>
                    <input
                        type="date"
                        className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                        value={form.event_date}
                        onChange={(e) => set('event_date', e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Joy</label>
                    <input
                        className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                        value={form.location}
                        onChange={(e) => set('location', e.target.value)}
                    />
                </div>
            </div>

            {/* Descriptions */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Tavsif</h3>
                <div className="flex flex-col gap-5">
                    {(['uz', 'en', 'ru'] as const).map((lang) => (
                        <div key={`d_${lang}`} className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Tavsif ({lang.toUpperCase()})</label>
                            <Suspense fallback={<div className="h-[120px] border border-gray-300 rounded-lg animate-pulse bg-gray-50" />}>
                                <RichTextEditor
                                    value={form[`description_${lang}`]}
                                    onChange={(html) => set(`description_${lang}`, html)}
                                />
                            </Suspense>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.push('/admin/events')}
                    className="px-6 py-3 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    Bekor qilish
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {isPending ? 'Saqlanmoqda...' : isEditing ? 'Saqlash' : 'Yaratish'}
                </button>
            </div>
        </form>
    );
}
