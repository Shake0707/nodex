import type { Event, Member } from './api';

// ─── Localized Field Access ───

type LocaleSuffix = 'uz' | 'en' | 'ru';

type LocalizedEntity = Event | Member;

/**
 * Type-safe access to localized fields like `title_uz`, `description_en`, etc.
 * Eliminates `as unknown as Record<string, string>` casts throughout the codebase.
 */
export function getLocalizedField(
    entity: LocalizedEntity,
    field: string,
    locale: string,
    fallbackLocale: LocaleSuffix = 'uz',
): string {
    const key = `${field}_${locale}`;
    const fallbackKey = `${field}_${fallbackLocale}`;
    return (entity[key as keyof typeof entity] as string) || (entity[fallbackKey as keyof typeof entity] as string) || '';
}

// ─── Month Names ───

export const MONTH_NAMES: Record<string, string[]> = {
    uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
};

export const MONTH_SHORT: Record<string, string[]> = {
    uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
};

// ─── Date Formatting ───

export function formatDate(dateStr: string, locale: string): string {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = (MONTH_NAMES[locale] || MONTH_NAMES.uz)[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
}

export function getMonthShort(dateStr: string, locale: string): string {
    const d = new Date(dateStr);
    return (MONTH_SHORT[locale] || MONTH_SHORT.uz)[d.getMonth()];
}

// ─── HTML Utilities ───

/** Strip HTML tags — for displaying rich-text as plain text in cards/previews */
export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}
