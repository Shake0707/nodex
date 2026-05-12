'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSurveyRegistrations } from '@/hooks/useSurveys';

interface Registration {
    id: number;
    first_name: string;
    last_name: string;
    age: number;
    email: string;
    telegram: string | null;
    school: string;
    grade: string;
    submitted_at: string;
}

function fmtDate(d: string) {
    return new Date(d).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' });
}

export default function RegistrationsPage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useSurveyRegistrations(Number(id));

    const registrations: Registration[] = Array.isArray(data) ? data : [];

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/surveys" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    <ArrowLeftOutlined /> Orqaga
                </Link>
                <span className="text-gray-300">/</span>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Registratsiyalar</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#1a1a2e]">Jami: {registrations.length} ta</h2>
                </div>

                {isLoading ? (
                    <p className="p-6 text-gray-500">Yuklanmoqda...</p>
                ) : registrations.length === 0 ? (
                    <p className="p-6 text-gray-400 text-sm">Hali registratsiya yo&apos;q.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    {['#', 'Ism', 'Familiya', 'Yosh', 'Email', 'Telegram', 'Maktab', 'Sinf', 'Sana'].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((r, i) => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 border-b border-gray-50 text-gray-400">{i + 1}</td>
                                        <td className="px-4 py-3 border-b border-gray-50 font-medium">{r.first_name}</td>
                                        <td className="px-4 py-3 border-b border-gray-50">{r.last_name}</td>
                                        <td className="px-4 py-3 border-b border-gray-50">{r.age}</td>
                                        <td className="px-4 py-3 border-b border-gray-50">
                                            <a href={`mailto:${r.email}`} className="text-blue-500 hover:underline">{r.email}</a>
                                        </td>
                                        <td className="px-4 py-3 border-b border-gray-50">
                                            {r.telegram ? (
                                                <a href={`https://t.me/${r.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{r.telegram}</a>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 border-b border-gray-50">{r.school}</td>
                                        <td className="px-4 py-3 border-b border-gray-50">{r.grade}</td>
                                        <td className="px-4 py-3 border-b border-gray-50 whitespace-nowrap text-gray-500">{fmtDate(r.submitted_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
