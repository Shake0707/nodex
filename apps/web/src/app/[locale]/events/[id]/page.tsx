import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getEvent, getUploadUrl, type Event } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';
import DOMPurify from 'isomorphic-dompurify';
import { getLocalizedField, formatDate, MONTH_SHORT, stripHtml } from '@/lib/locale-helpers';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nodex.uz';

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
    const { id, locale } = await params;
    try {
        const event = await getEvent(Number(id));
        const title = getLocalizedField(event, 'title', locale);
        const desc = stripHtml(getLocalizedField(event, 'description', locale)).slice(0, 160);
        const img = getUploadUrl(event.preview_image_url) || getUploadUrl(event.image_url);

        return {
            title,
            description: desc,
            openGraph: {
                title,
                description: desc,
                url: `${SITE_URL}/${locale}/events/${id}`,
                type: 'article',
                ...(img ? { images: [{ url: img, width: 1200, height: 630, alt: title }] } : {}),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: desc,
                ...(img ? { images: [img] } : {}),
            },
        };
    } catch {
        return { title: 'Event' };
    }
}

type Props = {
    params: Promise<{ id: string; locale: string }>;
};

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
    const locale = await getLocale();
    const t = await getTranslations('eventDetail');

    let event: Event;
    try {
        event = await getEvent(Number(id));
    } catch {
        notFound();
    }

    const title = getLocalizedField(event, 'title', locale);
    const description = getLocalizedField(event, 'description', locale);
    const heroImage = getUploadUrl(event.preview_image_url) || getUploadUrl(event.image_url);
    const galleryImages = (event.images || []).map((url: string) => getUploadUrl(url)).filter(Boolean) as string[];

    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate();
    const mon = (MONTH_SHORT[locale] || MONTH_SHORT.uz)[eventDate.getMonth()];
    const slugId = String(id).padStart(4, '0');
    const isUpcoming = eventDate.getTime() >= Date.now();

    const cornerStyle = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
        position: 'absolute',
        width: 22,
        height: 22,
        borderColor: 'rgba(0,212,255,0.55)',
        borderStyle: 'solid',
        borderWidth: 0,
        ...(pos === 'tl' && { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 }),
        ...(pos === 'tr' && { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 }),
        ...(pos === 'bl' && { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 }),
        ...(pos === 'br' && { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 }),
    });

    return (
        <main
            className="pt-[72px] min-h-screen relative overflow-x-hidden"
            style={{ background: 'var(--color-bg)' }}
        >
            {/* Ambient blobs */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
                    top: -60, left: -100,
                    filter: 'blur(80px)',
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 400, height: 400,
                    background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
                    bottom: 80, right: -80,
                    filter: 'blur(70px)',
                }}
            />

            <div className="max-w-[960px] mx-auto px-5 md:px-8 py-12 md:py-20 relative">

                {/* Breadcrumb */}
                <Link
                    href={`/${locale}/events`}
                    className="inline-flex items-center gap-2 mb-10 group"
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,243,255,0.28)',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={undefined}
                >
                    <span
                        className="group-hover:-translate-x-1 transition-transform"
                        style={{ color: 'rgba(0,212,255,0.5)' }}
                    >
                        ←
                    </span>
                    <span style={{ color: 'rgba(0,212,255,0.4)' }}>//</span>
                    <span>{t('back').replace('← ', '')}</span>
                    <span style={{ color: 'rgba(245,243,255,0.15)' }}>/</span>
                    <span style={{ color: 'rgba(168,85,247,0.6)' }}>EVENT_{slugId}</span>
                </Link>

                {/* Hero image */}
                {heroImage && (
                    <div
                        className="relative w-full overflow-hidden mb-10"
                        style={{
                            aspectRatio: '21/10',
                            background: 'var(--color-surface-2)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderTop: '1px solid rgba(168,85,247,0.5)',
                        }}
                    >
                        <img
                            src={heroImage}
                            alt={title}
                            className="w-full h-full object-cover"
                        />

                        {/* Corner brackets */}
                        <span style={cornerStyle('tl')} />
                        <span style={cornerStyle('tr')} />
                        <span style={cornerStyle('bl')} />
                        <span style={cornerStyle('br')} />

                        {/* Date badge */}
                        <div
                            className="absolute top-4 left-4 px-3 py-2 text-center"
                            style={{
                                background: 'rgba(4,4,8,0.88)',
                                border: '1px solid rgba(168,85,247,0.35)',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <div
                                className="text-2xl font-black leading-none"
                                style={{ fontFamily: 'var(--font-display)', color: '#A855F7' }}
                            >
                                {day}
                            </div>
                            <div
                                className="text-[9px] font-mono uppercase tracking-widest mt-0.5"
                                style={{ color: 'rgba(168,85,247,0.5)' }}
                            >
                                {mon}
                            </div>
                        </div>

                        {/* Status chip */}
                        <div
                            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5"
                            style={{
                                background: 'rgba(4,4,8,0.88)',
                                border: isUpcoming
                                    ? '1px solid rgba(57,255,20,0.3)'
                                    : '1px solid rgba(0,212,255,0.2)',
                                backdropFilter: 'blur(12px)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: isUpcoming ? '#39FF14' : 'rgba(0,212,255,0.6)',
                            }}
                        >
                            {isUpcoming ? (
                                <>
                                    <span className="live-dot" style={{ width: 5, height: 5 }} />
                                    LIVE
                                </>
                            ) : (
                                <>▶ ARCHIVE</>
                            )}
                        </div>

                        {/* Bottom gradient veil */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, rgba(4,4,8,0.65), transparent)' }}
                        />
                    </div>
                )}

                {/* Title */}
                <h1
                    className="font-black leading-[1.05] mb-10"
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(32px, 5vw, 58px)',
                        letterSpacing: '-0.02em',
                        color: 'var(--color-text)',
                    }}
                >
                    {title}
                </h1>

                {/* Metadata chips — cyber tags */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {/* Date chip */}
                    <div
                        className="inline-flex items-stretch overflow-hidden"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid rgba(168,85,247,0.18)',
                            borderLeft: '3px solid #A855F7',
                        }}
                    >
                        <div
                            className="flex items-center px-3"
                            style={{
                                background: 'rgba(168,85,247,0.08)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: '#A855F7',
                            }}
                        >
                            DATE
                        </div>
                        <div
                            className="flex items-center px-4 py-2.5"
                            style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 13,
                                fontWeight: 500,
                                color: '#F5F3FF',
                                letterSpacing: '0.01em',
                            }}
                        >
                            {formatDate(event.event_date, locale)}
                        </div>
                    </div>

                    {/* Location chip */}
                    {event.location && (
                        <div
                            className="inline-flex items-stretch overflow-hidden"
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid rgba(0,212,255,0.18)',
                                borderLeft: '3px solid #00D4FF',
                            }}
                        >
                            <div
                                className="flex items-center px-3"
                                style={{
                                    background: 'rgba(0,212,255,0.08)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 10,
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: '#00D4FF',
                                }}
                            >
                                LOC
                            </div>
                            <div
                                className="flex items-center px-4 py-2.5"
                                style={{
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: '#F5F3FF',
                                    letterSpacing: '0.01em',
                                }}
                            >
                                {event.location}
                            </div>
                        </div>
                    )}

                    {/* Slug chip */}
                    <div
                        className="inline-flex items-stretch overflow-hidden"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderLeft: '3px solid rgba(245,243,255,0.25)',
                        }}
                    >
                        <div
                            className="flex items-center px-3"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'rgba(245,243,255,0.4)',
                            }}
                        >
                            SLUG
                        </div>
                        <div
                            className="flex items-center px-4 py-2.5"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 12,
                                fontWeight: 500,
                                color: 'rgba(245,243,255,0.55)',
                                letterSpacing: '0.06em',
                            }}
                        >
                            EVENT_{slugId}
                        </div>
                    </div>
                </div>

                {/* Section divider */}
                <div className="section-divider mb-8" />

                {/* Description */}
                <div className="mb-2">
                    <span className="section-label">// 01 — {t('description')}</span>
                </div>
                <div className="section-divider mb-8" />

                <article
                    className="mb-14 leading-relaxed text-[15px] [&_a]:text-[#00D4FF] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#7BE8FF] [&_blockquote]:border-l-2 [&_blockquote]:border-[#00D4FF] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[rgba(245,243,255,0.45)] [&_strong]:text-[#A855F7] [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-[#F5F3FF] [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-[#F5F3FF] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:marker:text-[#A855F7] [&_p]:mb-4 [&_hr]:border-[rgba(255,255,255,0.07)] [&_hr]:my-8 [&_code]:text-[#39FF14] [&_code]:bg-[rgba(57,255,20,0.07)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]"
                    style={{ color: 'rgba(245,243,255,0.72)' }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                />

                {/* Gallery */}
                {galleryImages.length > 0 && (
                    <div className="mt-2">
                        <div className="mb-2">
                            <span className="section-label">// 02 — {t('gallery')}</span>
                        </div>
                        <div className="section-divider mb-8" />
                        <ImageGallery images={galleryImages} alt={title} />
                    </div>
                )}

                {/* Footer CTA */}
                <div
                    className="mt-16 pt-8 flex items-center justify-between flex-wrap gap-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <Link
                        href={`/${locale}/events`}
                        className="inline-flex items-center gap-2 group"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(245,243,255,0.3)',
                            transition: 'color 0.2s',
                        }}
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="group-hover:text-[#00D4FF] transition-colors">{t('back')}</span>
                    </Link>

                    <Link href={`/${locale}/events`} className="btn-outline" style={{ padding: '10px 24px', fontSize: 12 }}>
                        {t('back').replace('← ', '')} →
                    </Link>
                </div>

            </div>
        </main>
    );
}
