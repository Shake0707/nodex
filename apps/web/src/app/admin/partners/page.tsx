'use client';

import { useState, FormEvent } from 'react';
import { BankOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePartners, useCreatePartner, useUpdatePartner, useDeletePartner } from '@/hooks/usePartners';
import AdminModal from '@/components/admin/AdminModal';
import ImageUploader from '@/components/admin/ImageUploader';

interface PartnerRow { id: number; name: string; website_url: string; logo_image_url?: string; }

const emptyForm = { name: '', website_url: '', logo_image_url: '' };

export default function PartnersPage() {
    const { data, isLoading } = usePartners();
    const createPartner = useCreatePartner();
    const updatePartner = useUpdatePartner();
    const removePartner = useDeletePartner();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<PartnerRow | null>(null);
    const [form, setForm] = useState(emptyForm);

    const partners: PartnerRow[] = Array.isArray(data) ? data : [];

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (p: PartnerRow) => { setEditing(p); setForm({ name: p.name, website_url: p.website_url || '', logo_image_url: p.logo_image_url || '' }); setModalOpen(true); };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editing) {
            updatePartner.mutate({ id: editing.id, data: { ...form } }, { onSuccess: () => setModalOpen(false) });
        } else {
            createPartner.mutate({ ...form }, { onSuccess: () => setModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => { if (confirm("O'chirmoqchimisiz?")) removePartner.mutate(id); };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const getImgUrl = (url?: string) => url ? (url.startsWith('http') ? url : `${apiUrl.replace('/api', '')}${url}`) : null;

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Partners</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1a1a2e]">Barcha hamkorlar ({partners.length})</h2>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer" onClick={openCreate}>+ Qo&apos;shish</button>
                </div>

                {isLoading ? (
                    <p className="p-6 text-gray-500">Yuklanmoqda...</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Logo</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Nomi</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Website</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-lg">
                                            {getImgUrl(p.logo_image_url) ? (
                                                <img src={getImgUrl(p.logo_image_url)!} alt={p.name} className="w-full h-full object-contain p-1" />
                                            ) : <BankOutlined style={{ fontSize: 18, color: '#9ca3af' }} />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">{p.name}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">{p.website_url || '—'}</td>
                                    <td className="px-6 py-3.5 text-sm border-b border-gray-50">
                                        <div className="flex gap-2">
                                            <button className="px-2.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-md cursor-pointer flex items-center" onClick={() => openEdit(p)}><EditOutlined /></button>
                                            <button className="px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-md cursor-pointer hover:bg-red-100 flex items-center" onClick={() => handleDelete(p.id)}><DeleteOutlined /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AdminModal title={editing ? 'Tahrirlash' : 'Yangi hamkor'} isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <ImageUploader
                        value={form.logo_image_url}
                        onChange={(url) => setForm({ ...form, logo_image_url: url })}
                        label="Logotip"
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Nomi</label>
                        <input className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Website URL</label>
                        <input className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary transition-colors" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer" disabled={createPartner.isPending || updatePartner.isPending}>
                        {(createPartner.isPending || updatePartner.isPending) ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </form>
            </AdminModal>
        </div>
    );
}
