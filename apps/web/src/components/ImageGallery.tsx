'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
    images: string[];
    alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
    const [selected, setSelected] = useState<number | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);

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

    const total = images.length;
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <>
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelected(idx)}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative overflow-hidden cursor-pointer"
                        style={{
                            aspectRatio: '4/3',
                            background: 'var(--color-surface-2)',
                            border: hovered === idx
                                ? '1px solid rgba(0,212,255,0.45)'
                                : '1px solid rgba(255,255,255,0.05)',
                            borderTop: hovered === idx
                                ? '1px solid #00D4FF'
                                : '1px solid rgba(0,212,255,0.4)',
                            boxShadow: hovered === idx
                                ? '0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(0,212,255,0.06)'
                                : 'none',
                            transform: hovered === idx ? 'translateY(-2px)' : 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                        }}
                    >
                        <img
                            src={url}
                            alt={`${alt} — ${idx + 1}`}
                            className="w-full h-full object-cover"
                            style={{
                                transform: hovered === idx ? 'scale(1.04)' : 'scale(1)',
                                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                            }}
                        />
                        {/* Index chip */}
                        <div
                            className="absolute bottom-2 right-2 px-2 py-0.5"
                            style={{
                                background: 'rgba(4,4,8,0.85)',
                                border: '1px solid rgba(0,212,255,0.25)',
                                backdropFilter: 'blur(8px)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 9,
                                letterSpacing: '0.1em',
                                color: 'rgba(0,212,255,0.6)',
                                lineHeight: 1.4,
                            }}
                        >
                            {pad(idx + 1)}/{pad(total)}
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {selected !== null && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{
                        background: 'rgba(4,4,8,0.96)',
                        backdropFilter: 'blur(20px)',
                    }}
                    onClick={close}
                >
                    {/* Counter top-left */}
                    <div
                        className="absolute top-5 left-5"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            letterSpacing: '0.2em',
                            color: '#00D4FF',
                        }}
                    >
                        [ {pad(selected + 1)} / {pad(total)} ]
                    </div>

                    {/* Close */}
                    <button
                        onClick={close}
                        className="absolute top-4 right-4 flex items-center justify-center cursor-pointer transition-all"
                        style={{
                            width: 36,
                            height: 36,
                            border: '1px solid rgba(0,212,255,0.35)',
                            background: 'transparent',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 14,
                            color: 'rgba(0,212,255,0.7)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                            e.currentTarget.style.color = '#00D4FF';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(0,212,255,0.7)';
                        }}
                    >
                        ✕
                    </button>

                    {/* Prev */}
                    {total > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 md:left-7 flex items-center justify-center cursor-pointer transition-all"
                            style={{
                                width: 44,
                                height: 44,
                                border: '1px solid rgba(0,212,255,0.3)',
                                background: 'transparent',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 20,
                                color: 'rgba(0,212,255,0.6)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                                e.currentTarget.style.borderColor = '#00D4FF';
                                e.currentTarget.style.color = '#00D4FF';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                                e.currentTarget.style.color = 'rgba(0,212,255,0.6)';
                            }}
                        >
                            ‹
                        </button>
                    )}

                    {/* Image */}
                    <img
                        src={images[selected]}
                        alt={`${alt} — ${selected + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain"
                        style={{
                            border: '1px solid rgba(0,212,255,0.15)',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,212,255,0.04)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Next */}
                    {total > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 md:right-7 flex items-center justify-center cursor-pointer transition-all"
                            style={{
                                width: 44,
                                height: 44,
                                border: '1px solid rgba(0,212,255,0.3)',
                                background: 'transparent',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 20,
                                color: 'rgba(0,212,255,0.6)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                                e.currentTarget.style.borderColor = '#00D4FF';
                                e.currentTarget.style.color = '#00D4FF';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                                e.currentTarget.style.color = 'rgba(0,212,255,0.6)';
                            }}
                        >
                            ›
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
