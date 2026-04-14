'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const locales = [
    { code: 'uz', label: 'UZ' },
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

    return (
        <div
            className="flex gap-0"
            style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
            }}
        >
            {locales.map((loc) => (
                <button
                    key={loc.code}
                    className="px-3 py-1.5 text-[11px] font-semibold tracking-widest transition-all duration-200"
                    style={{
                        fontFamily: 'var(--font-mono)',
                        background: locale === loc.code ? 'rgba(168,85,247,0.15)' : 'transparent',
                        color: locale === loc.code ? '#A855F7' : 'rgba(245,243,255,0.3)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onClick={() => switchLocale(loc.code)}
                >
                    {loc.label}
                </button>
            ))}
        </div>
    );
}
