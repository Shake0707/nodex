'use client';

import { useState, FormEvent } from 'react';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login.mutate({ username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-dark">
            <div className="bg-white rounded-2xl p-10 w-full max-w-[400px] shadow-2xl text-[#1a1a2e]">
                <h1 className="text-2xl font-extrabold text-center mb-2 text-[#1a1a2e] flex items-center justify-center gap-2"><ThunderboltOutlined style={{ color: '#A855F7' }} /> Nodex Admin</h1>
                <p className="text-center text-text-muted mb-8">Tizimga kirish</p>

                {login.isError && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm mb-4 text-center">
                        Login yoki parol noto&apos;g&apos;ri
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                        disabled={login.isPending}
                    >
                        {login.isPending ? 'Kirish...' : 'Kirish'}
                    </button>
                </form>
            </div>
        </div>
    );
}
