import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nodex.uz';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getEventIds(): Promise<number[]> {
    try {
        const res = await fetch(`${API_BASE}/events`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []).map((e: { id: number }) => e.id);
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const locales = ['uz', 'en', 'ru'];
    const eventIds = await getEventIds();

    const entries: MetadataRoute.Sitemap = [];

    // Landing pages
    for (const locale of locales) {
        entries.push({
            url: `${SITE_URL}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        });
    }

    // Events list pages
    for (const locale of locales) {
        entries.push({
            url: `${SITE_URL}/${locale}/events`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        });
    }

    // Individual event pages
    for (const id of eventIds) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}/events/${id}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        }
    }

    return entries;
}
