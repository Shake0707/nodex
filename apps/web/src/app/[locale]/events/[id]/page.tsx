import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getEvent, getUploadUrl, type Event } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';
import DOMPurify from 'isomorphic-dompurify';
import { getLocalizedField, formatDate, stripHtml } from '@/lib/locale-helpers';
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

    return (
        <>
            <main className="pt-[72px] min-h-screen bg-bg">
                <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10 md:py-16">
                    {/* Back link */}
                    <Link
                        href={`/${locale}/events`}
                        className="inline-flex items-center text-sm text-text-muted hover:text-primary transition-colors mb-8 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">{t('back')}</span>
                    </Link>

                    {/* Hero image */}
                    {heroImage && (
                        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                            <img
                                src={heroImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">{title}</h1>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-sm font-semibold text-primary">{t('date')}</span>
                            <span className="text-sm text-text">{formatDate(event.event_date, locale)}</span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-sm font-semibold text-primary">{t('location')}</span>
                                <span className="text-sm text-text">{event.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-primary/20 to-transparent mb-8" />

                    {/* Description */}
                    <article className="prose prose-gray max-w-none">
                        <h2 className="text-lg font-bold text-text mb-4">{t('description')}</h2>
                        <div
                            className="text-text-muted leading-relaxed text-base [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-500"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                        />
                    </article>

                    {/* Image Gallery */}
                    {galleryImages.length > 0 && (
                        <div className="mt-10">
                            <div className="h-px bg-linear-to-r from-transparent via-primary/20 to-transparent mb-8" />
                            <h2 className="text-lg font-bold text-text mb-5">{t('gallery')}</h2>
                            <ImageGallery images={galleryImages} alt={title} />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
