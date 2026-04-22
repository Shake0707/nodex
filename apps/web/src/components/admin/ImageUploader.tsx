'use client';

import { useState, useRef, useCallback } from 'react';
import { InboxOutlined, CameraOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadFile } from '@/lib/admin-api';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Rasm' }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

    const doUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Faqat rasm fayllar ruxsat etilgan');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Fayl hajmi 5MB dan oshmasligi kerak');
            return;
        }
        setError('');
        // Show local preview immediately
        const preview = URL.createObjectURL(file);
        setLocalPreview(preview);
        setUploading(true);
        try {
            const url = await uploadFile(file);
            onChange(url);
            // Keep local preview as fallback if server URL fails too
        } catch (err) {
            console.error('Upload error:', err);
            setError('Yuklashda xatolik yuz berdi');
            // Keep localPreview so user still sees their image
        } finally {
            setUploading(false);
            // Reset input to allow re-selecting the same file
            if (inputRef.current) inputRef.current.value = '';
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) doUpload(file);
    }, [doUpload]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) doUpload(file);
    };

    const serverPreview = value
        ? value.startsWith('http') ? value : `${apiUrl.replace('/api', '')}${value}`
        : null;

    const previewUrl = localPreview || serverPreview;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">{label}</label>

            {/* Preview */}
            {previewUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                    {!uploading && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                className="px-3 py-1.5 bg-white text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => inputRef.current?.click()}
                            >
                                <ReloadOutlined /> Almashtirish
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                                onClick={() => { onChange(''); setLocalPreview(null); }}
                            >
                                <DeleteOutlined /> O&apos;chirish
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Drop zone */}
            {!previewUrl && (
                <div
                    className={`relative w-full h-36 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${dragOver
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-gray-300 bg-gray-50 hover:border-primary/50 hover:bg-primary/2'
                        }`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <div className="text-3xl">{dragOver ? <InboxOutlined /> : <CameraOutlined />}</div>
                    <p className="text-xs text-text-muted text-center px-4">
                        <span className="text-primary font-semibold">Bosing</span> yoki rasmni shu yerga tashlang
                    </p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WebP · max 5MB</p>
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
