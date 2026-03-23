'use client';

import { ReactNode } from 'react';

interface AdminModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function AdminModal({ title, isOpen, onClose, children }: AdminModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#1a1a2e]">{title}</h3>
                    <button className="w-8 h-8 rounded-lg bg-gray-100 text-sm flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
