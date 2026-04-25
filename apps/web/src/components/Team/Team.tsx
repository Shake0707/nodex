'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn, staggerContainer, staggerItem } from '@/components/animations';
import { getUploadUrl, PLACEHOLDER, type Member } from '@/lib/api';
import SafeImage from '@/components/ui/SafeImage';

interface TeamProps {
    members: Member[];
    locale: string;
}

export default function Team({ members, locale }: TeamProps) {
    const t = useTranslations('team');

    const getName = (m: Member) => (m as unknown as Record<string, string>)[`name_${locale}`] || m.name_uz;
    const getRole = (m: Member) => (m as unknown as Record<string, string>)[`role_${locale}`] || m.role_uz;
    const getDesc = (m: Member) => (m as unknown as Record<string, string>)[`description_${locale}`] || m.description_uz;

    return (
        <section
            id="team"
            className="py-24 md:py-32 relative overflow-hidden section-separator"
            style={{ background: 'var(--color-bg)' }}
        >
            {/* Pink ambient — left */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 400, height: 400,
                    background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)',
                    top: '30%', left: '-80px',
                    filter: 'blur(50px)',
                }}
            />

            <div className="max-w-[1180px] mx-auto px-5 md:px-8 relative">

                <FadeIn>
                    <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
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
                            style={{ color: 'rgba(245,243,255,0.35)', fontFamily: 'var(--font-sans)' }}
                        >
                            {t('subtitle')}
                        </p>
                    </div>
                </FadeIn>

                {members.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {members.map((member) => {
                            const photoUrl = getUploadUrl(member.photo_url);
                            return (
                                <motion.div
                                    key={member.id}
                                    variants={staggerItem}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    className="card-neo overflow-hidden group cursor-default"
                                >
                                    {/* Photo */}
                                    <div
                                        className="w-full h-56 relative overflow-hidden"
                                        style={{ background: 'var(--color-surface-2)' }}
                                    >
                                        <SafeImage
                                            src={photoUrl}
                                            fallback={PLACEHOLDER.member}
                                            alt={getName(member)}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Gradient overlay */}
                                        <div
                                            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(168,85,247,0.12), transparent 60%)',
                                            }}
                                        />

                                        {/* Status dot */}
                                        <div
                                            className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1"
                                            style={{
                                                background: 'rgba(8,8,15,0.8)',
                                                border: '1px solid rgba(255,255,255,0.07)',
                                                backdropFilter: 'blur(8px)',
                                            }}
                                        >
                                            <div className="live-dot" style={{ width: '5px', height: '5px' }} />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3
                                            className="text-base font-bold mb-1.5"
                                            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                                        >
                                            {getName(member)}
                                        </h3>
                                        <div className="mb-3">
                                            <span className="tag-cyber" style={{ fontSize: '9px' }}>
                                                {getRole(member)}
                                            </span>
                                        </div>
                                        <p
                                            className="text-[13px] leading-relaxed line-clamp-3"
                                            style={{ color: 'rgba(245,243,255,0.35)' }}
                                        >
                                            {getDesc(member)}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <FadeIn>
                        <p
                            className="text-center py-20 text-lg"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {t('empty')}
                        </p>
                    </FadeIn>
                )}
            </div>
        </section>
    );
}
