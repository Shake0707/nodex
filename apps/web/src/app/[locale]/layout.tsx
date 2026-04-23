import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import QueryProvider from '@/components/QueryProvider';
import '../globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nodex.uz';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

const metaByLocale: Record<string, { title: string; description: string }> = {
    uz: {
        title: 'Nodex — Kiberxavfsizlik klubi',
        description: 'Nodex — Al-Xorazmiy nomidagi maktab qoshidagi kiberxavfsizlik klubi. CTF musobaqalar, amaliy mashg\'ulotlar va bepul darslar.',
    },
    en: {
        title: 'Nodex — Cybersecurity Club',
        description: 'Nodex is a cybersecurity club at Al-Khwarizmi school. CTF competitions, practical workshops and free lessons.',
    },
    ru: {
        title: 'Nodex — Клуб кибербезопасности',
        description: 'Nodex — клуб кибербезопасности при школе им. Аль-Хорезми. CTF-соревнования, практические занятия и бесплатные уроки.',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const meta = metaByLocale[locale] || metaByLocale.uz;
    const locales = ['uz', 'en', 'ru'];
    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = `${SITE_URL}/${l}`;
    }

    return {
        title: {
            default: meta.title,
            template: `%s | Nodex`,
        },
        description: meta.description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: `${SITE_URL}/${locale}`,
            languages,
        },
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: `${SITE_URL}/${locale}`,
            siteName: 'Nodex',
            locale: locale === 'uz' ? 'uz_UZ' : locale === 'ru' ? 'ru_RU' : 'en_US',
            type: 'website',
            images: [{
                url: `${SITE_URL}/logo.png`,
                width: 1200,
                height: 630,
                alt: meta.title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as 'uz' | 'en' | 'ru')) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <QueryProvider>
                <Header />
                {children}
                <Footer />
            </QueryProvider>
        </NextIntlClientProvider>
    );
}
