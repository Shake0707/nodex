'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
    images: string[];
    alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
    const [selected, setSelected] = useState<number | null>(null);

    const close = () => setSelected(null);
    const prev = useCallback(() => setSelected((i) => (i !== null && i > 0 ? i - 1 : images.length - 1)), [images.length]);
    const next = useCallback(() => setSelected((i) => (i !== null && i < images.length - 1 ? i + 1 : 0)), [images.length]);

    useEffect(() => {
        if (selected === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handler);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handler);
        };
    }, [selected, prev, next]);

    return (
        <>
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className="aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <img
                            src={url}
                            alt={`${alt} - ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {selected !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
                    onClick={close}
                >
                    {/* Close */}
                    <button
                        onClick={close}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl cursor-pointer transition-colors z-10"
                    >
                        ✕
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-4 text-white/60 text-sm font-mono">
                        {selected + 1} / {images.length}
                    </div>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-3 md:left-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl cursor-pointer transition-colors"
                        >
                            ‹
                        </button>
                    )}

                    {/* Image */}
                    <img
                        src={images[selected]}
                        alt={`${alt} - ${selected + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-3 md:right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl cursor-pointer transition-colors"
                        >
                            ›
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
