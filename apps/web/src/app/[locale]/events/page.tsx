import { getLocale } from 'next-intl/server';
import EventsListClient from '@/app/[locale]/events/EventsListClient';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nodex.uz';

const metaByLocale: Record<string, { title: string; description: string }> = {
    uz: { title: 'Tadbirlar', description: 'Nodex klubi tomonidan o\'tkazilgan barcha tadbirlar va CTF musobaqalar ro\'yxati.' },
    en: { title: 'Events', description: 'All events and CTF competitions organized by Nodex cybersecurity club.' },
    ru: { title: 'Мероприятия', description: 'Все мероприятия и CTF-соревнования клуба кибербезопасности Nodex.' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const meta = metaByLocale[locale] || metaByLocale.uz;
    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: `${SITE_URL}/${locale}/events`,
            siteName: 'Nodex',
            type: 'website',
            images: [{ url: `${SITE_URL}/logo.png`, width: 400, height: 400, alt: meta.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.description,
        },
    };
}

export default async function EventsPage() {
    const locale = await getLocale();

    return (
        <>
            <main className="pt-[72px] min-h-screen bg-bg">
                <EventsListClient locale={locale} />
            </main>
        </>
    );
}
