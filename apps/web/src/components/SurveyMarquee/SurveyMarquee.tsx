import Link from 'next/link';
import { SurveyActive } from '@/lib/api';

interface SurveyMarqueeProps {
    surveys: SurveyActive[];
    locale: string;
}

export default function SurveyMarquee({ surveys, locale }: SurveyMarqueeProps) {
    if (!surveys.length) return null;

    const localeKey = `marquee_text_${locale}` as keyof SurveyActive;
    const firstSurvey = surveys[0];

    // Build marquee text: combine all active surveys separated by ⚡
    const combinedText = surveys
        .map((s) => (s[localeKey] as string) || s.marquee_text_uz)
        .join('  ⚡  ');

    // Repeat for seamless loop
    const repeated = Array(6).fill(combinedText).join('  ⚡⚡  ');

    return (
        <div className="relative w-full overflow-hidden border-b survey-marquee-bar" style={{ height: 44, marginTop: 56 }}>
            {/* Glow edge masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10" style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }} />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10" style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }} />

            <Link
                href={`/${locale}/surveys/${firstSurvey.id}`}
                className="flex items-center h-full group"
            >
                <div
                    className="marquee-track-left flex items-center gap-0 whitespace-nowrap"
                    style={{ willChange: 'transform' }}
                >
                    <span className="inline-flex items-center gap-2 text-[13px] font-mono tracking-wide survey-marquee-text px-8">
                        <span className="survey-marquee-icon">⚡</span>
                        {repeated}
                        <span className="survey-marquee-cta ml-4">→ Qatnashing</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}
