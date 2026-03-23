'use client';

import { useState, FormEvent } from 'react';
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from '@/hooks/useMembers';
import AdminModal from '@/components/admin/AdminModal';
import ImageUploader from '@/components/admin/ImageUploader';

interface MemberRow {
    id: number;
    name_uz: string; name_en: string; name_ru: string;
    role_uz: string; role_en: string; role_ru: string;
    description_uz: string; description_en: string; description_ru: string;
    photo_url?: string;
}

const emptyForm = {
    name_uz: '', name_en: '', name_ru: '',
    role_uz: '', role_en: '', role_ru: '',
    description_uz: '', description_en: '', description_ru: '',
    photo_url: '',
};

export default function MembersPage() {
    const { data, isLoading } = useMembers();
    const createMember = useCreateMember();
    const updateMember = useUpdateMember();
    const removeMember = useDeleteMember();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<MemberRow | null>(null);
    const [form, setForm] = useState(emptyForm);

    const members: MemberRow[] = Array.isArray(data) ? data : [];

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (m: MemberRow) => {
        setEditing(m);
        setForm({
            name_uz: m.name_uz, name_en: m.name_en, name_ru: m.name_ru,
            role_uz: m.role_uz, role_en: m.role_en, role_ru: m.role_ru,
            description_uz: m.description_uz, description_en: m.description_en, description_ru: m.description_ru,
            photo_url: m.photo_url || '',
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editing) {
            updateMember.mutate({ id: editing.id, data: { ...form } }, { onSuccess: () => setModalOpen(false) });
        } else {
            createMember.mutate({ ...form }, { onSuccess: () => setModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => { if (confirm("O'chirmoqchimisiz?")) removeMember.mutate(id); };
    const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const getImgUrl = (url?: string) => url ? (url.startsWith('http') ? url : `${apiUrl.replace('/api', '')}${url}`) : null;

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Members</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1a1a2e]">Barcha a&apos;zolar ({members.length})</h2>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer" onClick={openCreate}>+ Qo&apos;shish</button>
                </div>

                {isLoading ? (
                    <p className="p-6 text-gray-500">Yuklanmoqda...</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Rasm</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Ism (UZ)</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Rol</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-lg">
                                            {getImgUrl(m.photo_url) ? (
                                                <img src={getImgUrl(m.photo_url)!} alt={m.name_uz} className="w-full h-full object-cover" />
                                            ) : '👤'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">{m.name_uz}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">{m.role_uz}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                        <div className="flex gap-2">
                                            <button className="px-2.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-md cursor-pointer" onClick={() => openEdit(m)}>✏️</button>
                                            <button className="px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-md cursor-pointer hover:bg-red-100" onClick={() => handleDelete(m.id)}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AdminModal title={editing ? 'Tahrirlash' : "Yangi a'zo"} isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <ImageUploader
                        value={form.photo_url}
                        onChange={(url) => set('photo_url', url)}
                        label="A'zo rasmi"
                    />

                    {['uz', 'en', 'ru'].map((lang) => (
                        <div key={lang} className="flex gap-3">
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-700">Ism ({lang.toUpperCase()})</label>
                                <input className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors" value={(form as Record<string, string>)[`name_${lang}`]} onChange={(e) => set(`name_${lang}`, e.target.value)} required={lang === 'uz'} />
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-700">Rol ({lang.toUpperCase()})</label>
                                <input className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors" value={(form as Record<string, string>)[`role_${lang}`]} onChange={(e) => set(`role_${lang}`, e.target.value)} />
                            </div>
                        </div>
                    ))}
                    {['uz', 'en', 'ru'].map((lang) => (
                        <div key={`d_${lang}`} className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Tavsif ({lang.toUpperCase()})</label>
                            <textarea className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors min-h-[70px] resize-y" value={(form as Record<string, string>)[`description_${lang}`]} onChange={(e) => set(`description_${lang}`, e.target.value)} />
                        </div>
                    ))}
                    <button type="submit" className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer" disabled={createMember.isPending || updateMember.isPending}>
                        {(createMember.isPending || updateMember.isPending) ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </form>
            </AdminModal>
        </div>
    );
}
