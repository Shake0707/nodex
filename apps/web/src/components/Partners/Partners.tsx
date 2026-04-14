'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations';
import { getUploadUrl, type Partner } from '@/lib/api';

interface PartnersProps {
    partners: Partner[];
}

function PartnerCard({ partner }: { partner: Partner }) {
    const logo = getUploadUrl(partner.logo_image_url);

    const inner = (
        <div className="partner-card shrink-0 mx-4">
            <div className="partner-card__inner">
                {logo ? (
                    <img
                        src={logo}
                        alt={partner.name}
                        className="partner-card__logo"
                    />
                ) : (
                    <span className="partner-card__placeholder">{partner.name.slice(0, 2).toUpperCase()}</span>
                )}
                <span className="partner-card__name">{partner.name}</span>
            </div>
        </div>
    );

    if (partner.website_url) {
        return (
            <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="contents"
            >
                {inner}
            </a>
        );
    }
    return inner;
}

export default function Partners({ partners }: PartnersProps) {
    const t = useTranslations('partners');

    // Need at least enough items to fill the viewport — repeat to ensure seamless loop
    const copies = partners.length < 4 ? 6 : 3;
    const track = Array.from({ length: copies }, () => partners).flat();

    return (
        <section
            id="partners"
            className="py-24 md:py-32 relative overflow-hidden section-separator"
            style={{ background: 'var(--color-bg)' }}
        >
            {/* Ambient glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 65%)',
                    bottom: '-80px', left: '-80px',
                    filter: 'blur(60px)',
                }}
            />

            <div className="max-w-[1180px] mx-auto px-5 md:px-8 relative mb-16">
                <FadeIn>
                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div>
                            <span className="section-label mb-3">{t('label')}</span>
                            <h2
                                className="text-4xl md:text-5xl font-black leading-tight"
                                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                            >
                                {t('title')}
                            </h2>
                        </div>
                        <p
                            className="text-sm max-w-xs leading-relaxed"
                            style={{ color: 'rgba(245,243,255,0.35)' }}
                        >
                            {t('subtitle')}
                        </p>
                    </div>
                </FadeIn>
            </div>

            {partners.length > 0 ? (
                /* Edge-fade mask wrapper */
                <div
                    style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        className="flex flex-nowrap marquee-track-left"
                        style={{ width: 'max-content' }}
                    >
                        {track.map((partner, i) => (
                            <PartnerCard key={i} partner={partner} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-[1180px] mx-auto px-5 md:px-8">
                    <p
                        className="text-center py-20 text-lg"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {t('empty')}
                    </p>
                </div>
            )}
        </section>
    );
}
