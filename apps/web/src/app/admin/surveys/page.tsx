'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { useSurveys, useCreateSurvey, useUpdateSurvey, useDeleteSurvey } from '@/hooks/useSurveys';
import AdminModal from '@/components/admin/AdminModal';

interface SurveyRow {
    id: number;
    title_uz: string; title_en: string; title_ru: string;
    description_uz: string; description_en: string; description_ru: string;
    marquee_text_uz: string; marquee_text_en: string; marquee_text_ru: string;
    is_active: boolean;
    starts_at: string;
    ends_at: string | null;
    _count?: { registrations: number };
}

const emptyForm = {
    title_uz: '', title_en: '', title_ru: '',
    description_uz: '', description_en: '', description_ru: '',
    marquee_text_uz: '', marquee_text_en: '', marquee_text_ru: '',
    is_active: false,
    starts_at: '',
    ends_at: '',
};

function fmtDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' });
}

function toLocalInput(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SurveysPage() {
    const { data, isLoading } = useSurveys();
    const createSurvey = useCreateSurvey();
    const updateSurvey = useUpdateSurvey();
    const removeSurvey = useDeleteSurvey();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<SurveyRow | null>(null);
    const [form, setForm] = useState(emptyForm);

    const surveys: SurveyRow[] = Array.isArray(data) ? data : [];

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (s: SurveyRow) => {
        setEditing(s);
        setForm({
            title_uz: s.title_uz, title_en: s.title_en, title_ru: s.title_ru,
            description_uz: s.description_uz, description_en: s.description_en, description_ru: s.description_ru,
            marquee_text_uz: s.marquee_text_uz, marquee_text_en: s.marquee_text_en, marquee_text_ru: s.marquee_text_ru,
            is_active: s.is_active,
            starts_at: toLocalInput(s.starts_at),
            ends_at: toLocalInput(s.ends_at),
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload: Record<string, unknown> = {
            ...form,
            starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : undefined,
            ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        };
        if (editing) {
            updateSurvey.mutate({ id: editing.id, data: payload }, { onSuccess: () => setModalOpen(false) });
        } else {
            createSurvey.mutate(payload, { onSuccess: () => setModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Oprosni o'chirmoqchimisiz?")) removeSurvey.mutate(id);
    };

    const set = (key: string, val: unknown) => setForm((p) => ({ ...p, [key]: val }));

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Surveys (Oproslar)</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1a1a2e]">Barcha oproslar ({surveys.length})</h2>
                    <button
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                        onClick={openCreate}
                    >
                        + Qo&apos;shish
                    </button>
                </div>

                {isLoading ? (
                    <p className="p-6 text-gray-500">Yuklanmoqda...</p>
                ) : surveys.length === 0 ? (
                    <p className="p-6 text-gray-400 text-sm">Hech qanday opros yo&apos;q.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['Sarlavha (UZ)', 'Boshlanish', 'Tugash', 'Holat', 'Javoblar', 'Amallar'].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {surveys.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3.5 text-sm border-b border-gray-50 max-w-[200px] truncate font-medium">{s.title_uz}</td>
                                        <td className="px-6 py-3.5 text-sm border-b border-gray-50 whitespace-nowrap text-gray-600">{fmtDate(s.starts_at)}</td>
                                        <td className="px-6 py-3.5 text-sm border-b border-gray-50 whitespace-nowrap text-gray-600">{fmtDate(s.ends_at)}</td>
                                        <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                            {s.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                                                    <CheckCircleOutlined /> Faol
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                                    <CloseCircleOutlined /> Nofaol
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3.5 text-sm border-b border-gray-50 text-gray-600">
                                            {s._count?.registrations ?? 0}
                                        </td>
                                        <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/surveys/${s.id}/registrations`}
                                                    className="px-2.5 py-1.5 bg-cyan-50 text-cyan-600 text-xs font-semibold rounded-md hover:bg-cyan-100 flex items-center"
                                                >
                                                    <EyeOutlined />
                                                </Link>
                                                <button
                                                    className="px-2.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-md cursor-pointer flex items-center"
                                                    onClick={() => openEdit(s)}
                                                >
                                                    <EditOutlined />
                                                </button>
                                                <button
                                                    className="px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-md cursor-pointer hover:bg-red-100 flex items-center"
                                                    onClick={() => handleDelete(s.id)}
                                                >
                                                    <DeleteOutlined />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AdminModal
                title={editing ? 'Oprosni tahrirlash' : 'Yangi opros'}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Title */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sarlavha</p>
                        {['uz', 'en', 'ru'].map((lang) => (
                            <div key={lang} className="flex flex-col gap-1.5 mb-2">
                                <label className="text-xs font-semibold text-gray-700">Sarlavha ({lang.toUpperCase()})</label>
                                <input
                                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                    value={(form as Record<string, unknown>)[`title_${lang}`] as string}
                                    onChange={(e) => set(`title_${lang}`, e.target.value)}
                                    required={lang === 'uz'}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tavsif (meropriyatiya haqida)</p>
                        {['uz', 'en', 'ru'].map((lang) => (
                            <div key={lang} className="flex flex-col gap-1.5 mb-2">
                                <label className="text-xs font-semibold text-gray-700">Tavsif ({lang.toUpperCase()})</label>
                                <textarea
                                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors min-h-[80px] resize-y"
                                    value={(form as Record<string, unknown>)[`description_${lang}`] as string}
                                    onChange={(e) => set(`description_${lang}`, e.target.value)}
                                    required={lang === 'uz'}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Marquee text */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Yuguruvchi satr matni</p>
                        {['uz', 'en', 'ru'].map((lang) => (
                            <div key={lang} className="flex flex-col gap-1.5 mb-2">
                                <label className="text-xs font-semibold text-gray-700">Marquee ({lang.toUpperCase()})</label>
                                <input
                                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                    value={(form as Record<string, unknown>)[`marquee_text_${lang}`] as string}
                                    onChange={(e) => set(`marquee_text_${lang}`, e.target.value)}
                                    required={lang === 'uz'}
                                    placeholder="Yangi so'rovnoma! Qatnashing →"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Dates */}
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Boshlanish vaqti *</label>
                            <input
                                type="datetime-local"
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={form.starts_at}
                                onChange={(e) => set('starts_at', e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Tugash vaqti (ixtiyoriy)</label>
                            <input
                                type="datetime-local"
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={form.ends_at}
                                onChange={(e) => set('ends_at', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Active toggle */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                            className={`relative w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-primary' : 'bg-gray-200'}`}
                            onClick={() => set('is_active', !form.is_active)}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {form.is_active ? 'Faol (lendingda ko\'rinadi)' : 'Nofaol'}
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                        disabled={createSurvey.isPending || updateSurvey.isPending}
                    >
                        {(createSurvey.isPending || updateSurvey.isPending) ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </form>
            </AdminModal>
        </div>
    );
}
