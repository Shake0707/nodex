'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn, ScaleIn } from '@/components/animations';

export default function Contact() {
    const t = useTranslations('contact');

    return (
        <section id="contact" className="py-16 md:py-24 bg-bg-dark overflow-hidden relative">
            {/* Decorative */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyber-glow/20 to-transparent" />
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 border border-primary/10 rounded-full" />
            <div className="absolute top-20 left-10 w-24 h-24 border border-cyber-glow/10 rounded-full" />

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative">
                <div className="text-center max-w-[600px] mx-auto">
                    <FadeIn>
                        <span className="block font-mono text-sm font-medium text-cyber-glow uppercase tracking-[2px] mb-3">{t('label')}</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('title')}</h2>
                        <p className="text-text-on-dark opacity-80 text-base md:text-lg mb-10">{t('subtitle')}</p>
                    </FadeIn>

                    <ScaleIn delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <motion.a
                                href="https://t.me/nodexccbot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(0,102,255,0.3)]"
                                whileHover={{ y: -4, boxShadow: '0 8px 35px rgba(0,102,255,0.5)' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.2 }}
                            >
                                🤖 {t('btnBot')}
                            </motion.a>
                            <motion.a
                                href="https://t.me/nodexcc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl"
                                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.2 }}
                            >
                                📢 {t('btnChannel')}
                            </motion.a>
                        </div>
                    </ScaleIn>

                    {/* Social proof / trust badges */}
                    <FadeIn delay={0.3}>
                        <div className="flex items-center justify-center gap-8 text-text-on-dark opacity-40">
                            <div className="flex flex-col items-center">
                                <span className="text-lg">🔒</span>
                                <span className="text-[10px] mt-1 font-mono">Secure</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-lg">⚡</span>
                                <span className="text-[10px] mt-1 font-mono">Fast</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-lg">🌍</span>
                                <span className="text-[10px] mt-1 font-mono">Global</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
