'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FadeIn, staggerContainer, staggerItem } from '@/components/animations';
import { getUploadUrl, PLACEHOLDER, type Event } from '@/lib/api';
import SafeImage from '@/components/ui/SafeImage';
import { getLocalizedField, formatDate, MONTH_NAMES, stripHtml } from '@/lib/locale-helpers';

interface EventsProps {
    events: Event[];
    locale: string;
}

export default function Events({ events, locale }: EventsProps) {
    const t = useTranslations('events');

    const featured = events[0];
    const rest = events.slice(1, 4);

    return (
        <section
            id="events"
            className="py-24 md:py-32 relative overflow-hidden section-separator"
            style={{ background: 'var(--color-bg-alt)' }}
        >
            {/* Cyan ambient — top right */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 400, height: 400,
                    background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
                    top: '-60px', right: '-60px',
                    filter: 'blur(50px)',
                }}
            />

            <div className="max-w-[1180px] mx-auto px-5 md:px-8 relative">

                <FadeIn>
                    <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
                        <div>
                            <span className="section-label mb-3">{t('label')}</span>
                            <h2
                                className="text-4xl md:text-5xl font-black leading-tight"
                                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                            >
                                {t('title')}
                            </h2>
                        </div>
                        {events.length > 0 && (
                            <Link
                                href={`/${locale}/events`}
                                className="text-sm font-mono tracking-wider transition-colors duration-200"
                                style={{ color: 'rgba(245,243,255,0.3)', letterSpacing: '0.1em' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#00D4FF')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,255,0.3)')}
                            >
                                {t('showAll')} →
                            </Link>
                        )}
                    </div>
                </FadeIn>

                {events.length > 0 ? (
                    <div className="space-y-4">
                        {/* Featured event — large */}
                        {featured && (
                            <FadeIn>
                                <motion.div
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    className="card-neo-cyan overflow-hidden group"
                                >
                                    <Link href={`/${locale}/events/${featured.id}`} className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div
                                            className="w-full md:w-2/5 h-56 md:h-auto relative overflow-hidden shrink-0"
                                            style={{ minHeight: '240px', background: 'var(--color-surface-2)' }}
                                        >
                                            <SafeImage
                                                src={getUploadUrl(featured.preview_image_url) || getUploadUrl(featured.image_url)}
                                                fallback={PLACEHOLDER.event}
                                                alt={getLocalizedField(featured, 'title', locale)}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{ background: 'linear-gradient(to right, transparent 60%, rgba(14,14,24,0.6))' }}
                                            />

                                            {/* Date badge */}
                                            <div
                                                className="absolute top-4 left-4 px-3 py-2 text-center"
                                                style={{
                                                    background: 'rgba(4,4,8,0.85)',
                                                    border: '1px solid rgba(0,212,255,0.3)',
                                                    backdropFilter: 'blur(12px)',
                                                }}
                                            >
                                                <div
                                                    className="text-xl font-black leading-none"
                                                    style={{ fontFamily: 'var(--font-display)', color: '#00D4FF' }}
                                                >
                                                    {new Date(featured.event_date).getDate()}
                                                </div>
                                                <div
                                                    className="text-[9px] font-mono uppercase tracking-wider mt-0.5"
                                                    style={{ color: 'rgba(0,212,255,0.5)' }}
                                                >
                                                    {(MONTH_NAMES[locale] || MONTH_NAMES.uz)[new Date(featured.event_date).getMonth()]?.slice(0, 3)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 p-7 flex flex-col justify-center">
                                            <div className="flex gap-2 mb-4 flex-wrap">
                                                <span className="tag-cyber"><CalendarOutlined style={{ fontSize: 11 }} /> {formatDate(featured.event_date, locale)}</span>
                                                <span className="tag-cyber"><EnvironmentOutlined style={{ fontSize: 11 }} /> {featured.location}</span>
                                            </div>
                                            <h3
                                                className="text-xl md:text-2xl font-black mb-3 leading-snug group-hover:text-gradient-cyan transition-all"
                                                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                                            >
                                                {getLocalizedField(featured, 'title', locale)}
                                            </h3>
                                            <p
                                                className="text-sm leading-relaxed line-clamp-3"
                                                style={{ color: 'rgba(245,243,255,0.4)' }}
                                            >
                                                {stripHtml(getLocalizedField(featured, 'description', locale))}
                                            </p>
                                            <div className="mt-5">
                                                <span
                                                    className="text-[12px] font-mono tracking-wider"
                                                    style={{ color: '#00D4FF' }}
                                                >
                                                    {t('showAll')} →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </FadeIn>
                        )}

                        {/* Rest: compact grid */}
                        {rest.length > 0 && (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-40px' }}
                            >
                                {rest.map((event) => {
                                    const eventDate = new Date(event.event_date);
                                    const monthNames = MONTH_NAMES[locale] || MONTH_NAMES.uz;
                                    const eventImage = getUploadUrl(event.preview_image_url) || getUploadUrl(event.image_url);

                                    return (
                                        <motion.div
                                            key={event.id}
                                            variants={staggerItem}
                                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                            className="card-neo overflow-hidden group"
                                        >
                                            <Link href={`/${locale}/events/${event.id}`} className="block">
                                                {/* Image */}
                                                <div
                                                    className="w-full h-40 relative overflow-hidden"
                                                    style={{ background: 'var(--color-surface-2)' }}
                                                >
                                                    <SafeImage
                                                        src={eventImage}
                                                        fallback={PLACEHOLDER.event}
                                                        alt={getLocalizedField(event, 'title', locale)}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
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
                                                            {eventDate.getDate()}
                                                        </div>
                                                        <div
                                                            className="text-[8px] font-mono uppercase"
                                                            style={{ color: 'rgba(168,85,247,0.5)' }}
                                                        >
                                                            {monthNames[eventDate.getMonth()]?.slice(0, 3)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="p-4">
                                                    <div className="mb-2">
                                                        <span className="tag-cyber" style={{ fontSize: '9px' }}><EnvironmentOutlined style={{ fontSize: 9 }} /> {event.location}</span>
                                                    </div>
                                                    <h3
                                                        className="text-[15px] font-bold leading-snug mb-1.5"
                                                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                                                    >
                                                        {getLocalizedField(event, 'title', locale)}
                                                    </h3>
                                                    <p
                                                        className="text-[12px] leading-relaxed line-clamp-2"
                                                        style={{ color: 'rgba(245,243,255,0.35)' }}
                                                    >
                                                        {stripHtml(getLocalizedField(event, 'description', locale))}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <FadeIn>
                        <p
                            className="text-center py-20 text-lg"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {t('empty')}
                        </p>
                    </FadeIn>
                )}
            </div>
        </section>
    );
}
