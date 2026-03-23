'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FadeIn, staggerContainer, staggerItem } from '@/components/animations';
import { getUploadUrl, type Event } from '@/lib/api';
import { getLocalizedField, formatDate, MONTH_NAMES, stripHtml } from '@/lib/locale-helpers';

interface EventsProps {
    events: Event[];
    locale: string;
}

export default function Events({ events, locale }: EventsProps) {
    const t = useTranslations('events');

    return (
        <section id="events" className="py-16 md:py-24 bg-bg-alt relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute bottom-32 left-[-60px] w-80 h-80 bg-purple-500/4 rounded-full blur-3xl" />
            <div className="absolute top-32 right-[-60px] w-64 h-64 bg-primary/4 rounded-full blur-3xl" />

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative">
                <FadeIn>
                    <span className="block text-center font-mono text-sm font-medium text-primary uppercase tracking-[2px] mb-3">{t('label')}</span>
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">{t('title')}</h2>
                    <p className="text-center text-text-muted text-base md:text-lg max-w-[600px] mx-auto mb-12 md:mb-16">{t('subtitle')}</p>
                </FadeIn>

                {events.length > 0 ? (
                    <>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-7"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            {events.slice(0, 4).map((event) => {
                                const eventImage = getUploadUrl(event.preview_image_url) || getUploadUrl(event.image_url);
                                const eventDate = new Date(event.event_date);

                                return (
                                    <motion.div
                                        key={event.id}
                                        variants={staggerItem}
                                        whileHover={{ y: -8, transition: { duration: 0.25 } }}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-xl hover:border-primary/15 relative"
                                    >
                                        <Link href={`/${locale}/events/${event.id}`} className="block">
                                            <div className="w-full h-48 md:h-52 bg-linear-to-br from-bg-dark to-primary-dark flex items-center justify-center text-5xl text-cyber-glow overflow-hidden relative">
                                                {eventImage ? (
                                                    <motion.img
                                                        src={eventImage}
                                                        alt={getLocalizedField(event, 'title', locale)}
                                                        className="w-full h-full object-cover"
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                ) : (
                                                    <>
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,102,255,0.2),transparent_60%)]" />
                                                        🏁
                                                    </>
                                                )}
                                                {/* Date badge */}
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                                                    <div className="text-xs font-bold text-primary leading-none">
                                                        {eventDate.getDate()}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-text-muted uppercase">
                                                        {(MONTH_NAMES[locale] || MONTH_NAMES.uz)[eventDate.getMonth()]?.slice(0, 3)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex gap-4 mb-3 flex-wrap">
                                                    <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono bg-bg-alt px-2 py-1 rounded-md">📅 {formatDate(event.event_date, locale)}</span>
                                                    <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono bg-bg-alt px-2 py-1 rounded-md">📍 {event.location}</span>
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">{getLocalizedField(event, 'title', locale)}</h3>
                                                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                                                    {stripHtml(getLocalizedField(event, 'description', locale))}
                                                </p>
                                            </div>
                                        </Link>
                                        {/* Bottom accent */}
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Show all button */}
                        <FadeIn>
                            <div className="text-center mt-10">
                                <Link
                                    href={`/${locale}/events`}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all"
                                >
                                    {t('showAll')} →
                                </Link>
                            </div>
                        </FadeIn>
                    </>
                ) : (
                    <FadeIn>
                        <p className="text-center py-16 text-text-muted text-lg">{t('empty')}</p>
                    </FadeIn>
                )}
            </div>
        </section>
    );
}
