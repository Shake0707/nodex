'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations';

export default function Contact() {
    const t = useTranslations('contact');

    return (
        <section
            id="contact"
            className="relative overflow-hidden"
            style={{ background: 'var(--color-bg-alt)' }}
        >
            {/* Full-bleed pink gradient band */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(0,212,255,0.06) 50%, transparent 100%)',
                }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Top border */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(0,212,255,0.3), transparent)' }}
            />

            <div className="max-w-[800px] mx-auto px-5 md:px-8 py-28 md:py-36 relative text-center">

                <FadeIn>
                    <span className="section-label mb-5">{t('label')}</span>
                    <h2
                        className="text-4xl md:text-6xl font-black mb-6 leading-[1.0]"
                        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
                    >
                        {t('title')}
                    </h2>
                    <p
                        className="text-base md:text-lg leading-relaxed mb-12 max-w-[440px] mx-auto"
                        style={{ color: 'rgba(245,243,255,0.4)' }}
                    >
                        {t('subtitle')}
                    </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            href="https://t.me/nodexccbot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            🤖 {t('btnBot')}
                        </motion.a>
                        <motion.a
                            href="https://t.me/nodexcc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            📢 {t('btnChannel')}
                        </motion.a>
                    </div>
                </FadeIn>

                {/* Technical decorative details */}
                <FadeIn delay={0.2}>
                    <div
                        className="flex items-center justify-center gap-8 mt-14 flex-wrap"
                        style={{ color: 'rgba(245,243,255,0.15)' }}
                    >
                        {[
                            { label: '41°17′N 69°15′E', desc: 'Tashkent, UZ' },
                            { label: 'EST. 2024', desc: 'Founded' },
                            { label: 'NODEX-CC', desc: 'Handle' },
                        ].map((item, i, arr) => (
                            <div key={i} className="flex items-center gap-8">
                                <div className="text-center">
                                    <div
                                        className="text-[11px] font-mono tracking-wider mb-0.5"
                                        style={{ color: 'rgba(245,243,255,0.2)' }}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        className="text-[9px] font-mono tracking-widest uppercase"
                                        style={{ color: 'rgba(245,243,255,0.1)' }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                                {i < arr.length - 1 && (
                                    <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.07)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
