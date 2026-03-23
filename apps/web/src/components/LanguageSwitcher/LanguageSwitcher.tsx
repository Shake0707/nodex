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
        <div className="flex gap-0.5 rounded-lg bg-bg-alt p-0.5">
            {locales.map((loc) => (
                <button
                    key={loc.code}
                    className={`px-2.5 py-1.5 text-xs font-semibold font-mono rounded-md tracking-wide transition-all ${locale === loc.code
                            ? 'bg-primary text-white shadow-md'
                            : 'text-text-muted hover:text-primary'
                        }`}
                    onClick={() => switchLocale(loc.code)}
                >
                    {loc.label}
                </button>
            ))}
        </div>
    );
}
