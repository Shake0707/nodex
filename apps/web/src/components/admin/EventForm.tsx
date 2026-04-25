'use client';

import { useState, FormEvent, lazy, Suspense } from 'react';
import Image from 'next/image';
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

const LIMITS = {
    title:       { min: 3,  max: 120 },
    location:    { min: 3,  max: 100 },
    description: { min: 20, max: 5000 },
} as const;

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

type Errors = Record<string, string>;

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

    const [errors, setErrors] = useState<Errors>({});
    const [galleryUploading, setGalleryUploading] = useState(false);

    const set = <K extends keyof Omit<EventData, 'id'>>(key: K, val: Omit<EventData, 'id'>[K]) => {
        setForm((p) => ({ ...p, [key]: val }));
        // clear error on change
        setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
    };

    const validate = (f: typeof form): Errors => {
        const e: Errors = {};

        // Preview image
        if (!f.preview_image_url) {
            e.preview_image_url = 'Preview rasm majburiy';
        }

        // Gallery — at least 1
        if (f.images.length === 0) {
            e.images = 'Galereyaga kamida 1 ta rasm qo\'shish majburiy';
        }

        // Titles — all 3 languages required
        (['uz', 'en', 'ru'] as const).forEach((lang) => {
            const val = f[`title_${lang}`].trim();
            const key = `title_${lang}`;
            if (!val) {
                e[key] = `Sarlavha (${lang.toUpperCase()}) majburiy`;
            } else if (val.length < LIMITS.title.min) {
                e[key] = `Kamida ${LIMITS.title.min} ta belgi`;
            } else if (val.length > LIMITS.title.max) {
                e[key] = `Ko'pi bilan ${LIMITS.title.max} ta belgi`;
            }
        });

        // Date
        if (!f.event_date) {
            e.event_date = 'Sana majburiy';
        }

        // Location
        const loc = f.location.trim();
        if (!loc) {
            e.location = 'Joy majburiy';
        } else if (loc.length < LIMITS.location.min) {
            e.location = `Kamida ${LIMITS.location.min} ta belgi`;
        } else if (loc.length > LIMITS.location.max) {
            e.location = `Ko'pi bilan ${LIMITS.location.max} ta belgi`;
        }

        // Descriptions — all 3 languages required
        (['uz', 'en', 'ru'] as const).forEach((lang) => {
            const key = `description_${lang}`;
            const raw = f[key as keyof typeof f] as string;
            const plain = stripHtml(raw);
            if (!plain) {
                e[key] = `Tavsif (${lang.toUpperCase()}) majburiy`;
            } else if (plain.length < LIMITS.description.min) {
                e[key] = `Kamida ${LIMITS.description.min} ta belgi`;
            } else if (plain.length > LIMITS.description.max) {
                e[key] = `Ko'pi bilan ${LIMITS.description.max} ta belgi`;
            }
        });

        return e;
    };

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

        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // scroll to first error
            const firstKey = Object.keys(validationErrors)[0];
            document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

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
        <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>

            {/* Preview Image */}
            <div id="field-preview_image_url">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Preview rasm (asosiy) <span className="text-red-500">*</span>
                </h3>
                <ImageUploader
                    value={form.preview_image_url}
                    onChange={(url) => set('preview_image_url', url)}
                    label="Preview rasm"
                />
                {errors.preview_image_url && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.preview_image_url}</p>
                )}
            </div>

            {/* Gallery */}
            <div id="field-images">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Galereya ({form.images.length}/10) <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(kamida 1 ta rasm)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                    {form.images.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                                src={getUploadUrl(url) || url}
                                alt={`Gallery ${idx + 1}`}
                                fill
                                unoptimized={!(getUploadUrl(url) || url).startsWith('http')}
                                className="object-cover"
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
                        <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${errors.images ? 'border-red-400 bg-red-50 hover:border-red-500' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}>
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
                                    <span className="text-[10px] text-gray-400">Rasm qo&apos;shish</span>
                                </>
                            )}
                        </label>
                    )}
                </div>
                {errors.images && (
                    <p className="text-xs text-red-500">{errors.images}</p>
                )}
            </div>

            <hr className="border-gray-100" />

            {/* Titles */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Sarlavhalar <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">({LIMITS.title.min}–{LIMITS.title.max} belgi)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['uz', 'en', 'ru'] as const).map((lang) => {
                        const key = `title_${lang}`;
                        const val = form[key as keyof typeof form] as string;
                        return (
                            <div key={lang} id={`field-${key}`} className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600">
                                    Nomi ({lang.toUpperCase()}) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary transition-colors ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                    value={val}
                                    onChange={(e) => set(key as keyof typeof form, e.target.value)}
                                    minLength={LIMITS.title.min}
                                    maxLength={LIMITS.title.max}
                                    placeholder={`Kamida ${LIMITS.title.min} ta belgi`}
                                />
                                <div className="flex justify-between items-center">
                                    {errors[key]
                                        ? <p className="text-xs text-red-500">{errors[key]}</p>
                                        : <span />
                                    }
                                    <span className={`text-[11px] ml-auto ${val.length > LIMITS.title.max ? 'text-red-500' : 'text-gray-400'}`}>
                                        {val.length}/{LIMITS.title.max}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Date + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="field-event_date" className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">
                        Sana <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        className={`px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary transition-colors ${errors.event_date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        value={form.event_date}
                        onChange={(e) => set('event_date', e.target.value)}
                    />
                    {errors.event_date && <p className="text-xs text-red-500">{errors.event_date}</p>}
                </div>
                <div id="field-location" className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">
                        Joy <span className="text-red-500">*</span>
                        <span className="text-gray-400 font-normal ml-1">({LIMITS.location.min}–{LIMITS.location.max} belgi)</span>
                    </label>
                    <input
                        className={`px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary transition-colors ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        value={form.location}
                        onChange={(e) => set('location', e.target.value)}
                        minLength={LIMITS.location.min}
                        maxLength={LIMITS.location.max}
                        placeholder={`Kamida ${LIMITS.location.min} ta belgi`}
                    />
                    <div className="flex justify-between items-center">
                        {errors.location
                            ? <p className="text-xs text-red-500">{errors.location}</p>
                            : <span />
                        }
                        <span className={`text-[11px] ml-auto ${form.location.length > LIMITS.location.max ? 'text-red-500' : 'text-gray-400'}`}>
                            {form.location.length}/{LIMITS.location.max}
                        </span>
                    </div>
                </div>
            </div>

            {/* Descriptions */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Tavsif <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(kamida {LIMITS.description.min} ta belgi)</span>
                </h3>
                <div className="flex flex-col gap-5">
                    {(['uz', 'en', 'ru'] as const).map((lang) => {
                        const key = `description_${lang}`;
                        const raw = form[key as keyof typeof form] as string;
                        const plainLen = stripHtml(raw).length;
                        return (
                            <div key={`d_${lang}`} id={`field-${key}`} className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600">
                                    Tavsif ({lang.toUpperCase()}) <span className="text-red-500">*</span>
                                </label>
                                <div className={errors[key] ? 'ring-1 ring-red-400 rounded-lg' : ''}>
                                    <Suspense fallback={<div className="h-[120px] border border-gray-300 rounded-lg animate-pulse bg-gray-50" />}>
                                        <RichTextEditor
                                            value={raw}
                                            onChange={(html) => set(key as keyof typeof form, html)}
                                        />
                                    </Suspense>
                                </div>
                                <div className="flex justify-between items-center">
                                    {errors[key]
                                        ? <p className="text-xs text-red-500">{errors[key]}</p>
                                        : <span />
                                    }
                                    <span className={`text-[11px] ml-auto ${plainLen > LIMITS.description.max ? 'text-red-500' : 'text-gray-400'}`}>
                                        {plainLen}/{LIMITS.description.max}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
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
