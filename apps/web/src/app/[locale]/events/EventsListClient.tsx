'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { searchEvents } from '@/lib/admin-api';
import { getUploadUrl, type Event } from '@/lib/api';
import { getLocalizedField, MONTH_SHORT, stripHtml } from '@/lib/locale-helpers';

// ─── Types ───

type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc';

interface Props {
    locale: string;
}

// ─── Skeleton Card ───

function SkeletonCard() {
    return (
        <div className="card-neo overflow-hidden animate-pulse">
            <div className="h-48" style={{ background: 'var(--color-surface-2)' }} />
            <div className="p-5 space-y-3">
                <div className="flex gap-2">
                    <div className="h-5 w-20 rounded" style={{ background: 'var(--color-surface-2)' }} />
                    <div className="h-5 w-16 rounded" style={{ background: 'var(--color-surface-2)' }} />
                </div>
                <div className="h-4 w-3/4 rounded" style={{ background: 'var(--color-surface-2)' }} />
                <div className="h-3 w-full rounded" style={{ background: 'var(--color-surface-2)' }} />
                <div className="h-3 w-2/3 rounded" style={{ background: 'var(--color-surface-2)' }} />
            </div>
        </div>
    );
}

// ─── Event Card ───

interface EventCardProps {
    event: Event;
    locale: string;
}

function EventCard({ event, locale }: EventCardProps) {
    const d = new Date(event.event_date);
    const day = d.getDate();
    const mon = (MONTH_SHORT[locale] || MONTH_SHORT.uz)[d.getMonth()];
    const img = getUploadUrl(event.preview_image_url) || getUploadUrl(event.image_url);

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-neo overflow-hidden group"
        >
            <Link href={`/${locale}/events/${event.id}`} className="block">
                {/* Image */}
                <div
                    className="relative h-48 overflow-hidden"
                    style={{ background: 'var(--color-surface-2)' }}
                >
                    {img ? (
                        <Image
                            src={img}
                            alt={getLocalizedField(event, 'title', locale)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(0,212,255,0.04))' }}
                        />
                    )}

                    {/* Date badge */}
                    <div
                        className="absolute top-3 left-3 px-2 py-1 text-center"
                        style={{
                            background: 'rgba(4,4,8,0.85)',
                            border: '1px solid rgba(168,85,247,0.3)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <div
                            className="text-base font-black leading-none"
                            style={{ fontFamily: 'var(--font-display)', color: '#A855F7' }}
                        >
                            {day}
                        </div>
                        <div
                            className="text-[8px] font-mono uppercase"
                            style={{ color: 'rgba(168,85,247,0.5)' }}
                        >
                            {mon}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4">
                    {event.location && (
                        <div className="mb-2">
                            <span className="tag-cyber" style={{ fontSize: '9px' }}>📍 {event.location}</span>
                        </div>
                    )}
                    <h3
                        className="text-[15px] font-bold leading-snug mb-1.5 line-clamp-2"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                    >
                        {getLocalizedField(event, 'title', locale)}
                    </h3>
                    <p
                        className="text-sm leading-relaxed line-clamp-2"
                        style={{ color: 'rgba(245,243,255,0.35)' }}
                    >
                        {stripHtml(getLocalizedField(event, 'description', locale))}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Pagination ───

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const navBtn = (disabled: boolean): React.CSSProperties => ({
        background: 'transparent',
        border: '1px solid rgba(0,212,255,0.3)',
        color: disabled ? 'rgba(0,212,255,0.2)' : '#00D4FF',
        fontFamily: 'var(--font-mono)',
        padding: '8px 14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px',
    });

    const pageBtn = (active: boolean): React.CSSProperties => ({
        background: active ? '#A855F7' : 'var(--color-surface)',
        border: `1px solid ${active ? '#A855F7' : 'rgba(255,255,255,0.07)'}`,
        color: active ? '#fff' : 'rgba(245,243,255,0.4)',
        fontFamily: 'var(--font-mono)',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '13px',
    });

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                style={navBtn(page <= 1)}
            >
                ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    style={pageBtn(p === page)}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                style={navBtn(page >= totalPages)}
            >
                →
            </button>
        </div>
    );
}

// ─── Main Component ───

export default function EventsListClient({ locale }: Props) {
    const t = useTranslations('eventsPage');

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sort, setSort] = useState<SortOption>('date_desc');
    const limit = 9;
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, isFetching } = useQuery({
        queryKey: ['events-search', debouncedSearch, page, sort],
        queryFn: () => searchEvents({
            q: debouncedSearch || undefined,
            page,
            limit,
            sort,
        }),
    });

    const events: Event[] = data?.data || [];
    const total: number = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.length > 0 && value.length < 3) return;
        debounceRef.current = setTimeout(() => {
            setPage(1);
            setDebouncedSearch(value);
        }, 400);
    };

    const handleSortChange = (newSort: SortOption) => {
        setSort(newSort);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14 md:py-20">

            {/* Header */}
            <div className="text-center mb-12">
                <span className="section-label mb-3">{t('label')}</span>
                <h1
                    className="text-4xl md:text-5xl font-black mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                >
                    {t('title')}
                </h1>
                <p
                    className="text-base md:text-lg max-w-[600px] mx-auto"
                    style={{ color: 'rgba(245,243,255,0.35)' }}
                >
                    {t('subtitle')}
                </p>
            </div>

            {/* Controls: Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
                <div className="relative flex-1">
                    <span
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono"
                        style={{ color: 'rgba(0,212,255,0.4)' }}
                    >
                        ⌕
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-10 pr-10 py-3 text-sm outline-none transition-all"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            color: 'var(--color-text)',
                            fontFamily: 'var(--font-mono)',
                        }}
                        onFocus={e => (e.currentTarget.style.border = '1px solid rgba(0,212,255,0.4)')}
                        onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)')}
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(''); setPage(1); setDebouncedSearch(''); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer transition-colors"
                            style={{ color: 'rgba(245,243,255,0.3)', fontFamily: 'var(--font-mono)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#00D4FF')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,255,0.3)')}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="px-4 py-3 outline-none cursor-pointer min-w-[180px]"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(245,243,255,0.5)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                    }}
                >
                    <option value="date_desc">{t('sortDateDesc')}</option>
                    <option value="date_asc">{t('sortDateAsc')}</option>
                    <option value="title_asc">{t('sortTitleAsc')}</option>
                    <option value="title_desc">{t('sortTitleDesc')}</option>
                </select>
            </div>

            {/* Results count */}
            {!isFetching && (
                <p
                    className="text-xs mb-6 text-center font-mono"
                    style={{ color: 'rgba(245,243,255,0.25)' }}
                >
                    {t('found', { count: total })}
                </p>
            )}

            {/* Grid: Skeleton or Events */}
            {isFetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: limit }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} locale={locale} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <div
                        className="text-3xl mb-4 font-mono"
                        style={{ color: 'rgba(0,212,255,0.2)' }}
                    >
                        [ ]
                    </div>
                    <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
                        {search ? t('noResults') : t('empty')}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {!isFetching && totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    );
}
