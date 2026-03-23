'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
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
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-5 space-y-3">
                <div className="flex gap-2">
                    <div className="h-6 w-24 bg-gray-200 rounded-md" />
                    <div className="h-6 w-20 bg-gray-200 rounded-md" />
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
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
    const year = d.getFullYear();
    const img = getUploadUrl(event.preview_image_url) || getUploadUrl(event.image_url);

    return (
        <Link
            href={`/${locale}/events/${event.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:border-primary/15 hover:-translate-y-1"
        >
            <div className="relative h-48 bg-linear-to-br from-bg-dark to-primary-dark flex items-center justify-center text-5xl text-cyber-glow overflow-hidden">
                {img ? (
                    <img
                        src={img}
                        alt={getLocalizedField(event, 'title', locale)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,102,255,0.2),transparent_60%)]" />
                        🏁
                    </>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center shadow-sm">
                    <div className="text-lg font-bold text-primary leading-none">{day}</div>
                    <div className="text-[10px] font-semibold text-text-muted uppercase">{mon} {year}</div>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {getLocalizedField(event, 'title', locale)}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-3">
                    {stripHtml(getLocalizedField(event, 'description', locale))}
                </p>
                {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <span>📍</span>
                        <span>{event.location}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

// ─── Pagination ───

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
                ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-all ${p === page
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-text-muted'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
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

    // ─── TanStack Query ───
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

    // ─── Handlers ───

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
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-16">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="block font-mono text-sm font-medium text-primary uppercase tracking-[2px] mb-3">
                    {t('label')}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-text-muted text-base md:text-lg max-w-[600px] mx-auto">{t('subtitle')}</p>
            </div>

            {/* Controls: Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,102,255,0.08)] transition-all placeholder:text-gray-400"
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(''); setPage(1); setDebouncedSearch(''); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-sm"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary cursor-pointer text-text-muted min-w-[180px]"
                >
                    <option value="date_desc">{t('sortDateDesc')}</option>
                    <option value="date_asc">{t('sortDateAsc')}</option>
                    <option value="title_asc">{t('sortTitleAsc')}</option>
                    <option value="title_desc">{t('sortTitleDesc')}</option>
                </select>
            </div>

            {/* Results count */}
            {!isFetching && (
                <p className="text-xs text-text-muted mb-6 text-center">
                    {t('found', { count: total })}
                </p>
            )}

            {/* Grid: Skeleton or Events */}
            {isFetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: limit }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} locale={locale} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-text-muted text-lg">{search ? t('noResults') : t('empty')}</p>
                </div>
            )}

            {/* Pagination */}
            {!isFetching && totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    );
}
