'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn, ScaleIn, staggerContainer, staggerItem } from '@/components/animations';

export default function About() {
    const t = useTranslations('about');

    const features = [
        { icon: '📚', title: t('feature1Title'), desc: t('feature1Desc'), color: 'from-blue-500/10 to-blue-600/5' },
        { icon: '💻', title: t('feature2Title'), desc: t('feature2Desc'), color: 'from-green-500/10 to-green-600/5' },
        { icon: '🏆', title: t('feature3Title'), desc: t('feature3Desc'), color: 'from-purple-500/10 to-purple-600/5' },
        { icon: '🎓', title: t('feature4Title'), desc: t('feature4Desc'), color: 'from-amber-500/10 to-amber-600/5' },
    ];

    const highlights = [
        { value: '24/7', label: t('feature1Title'), icon: '⚡' },
        { value: 'Open', label: 'Source', icon: '🌐' },
        { value: '100%', label: 'Free', icon: '🎯' },
    ];

    return (
        <section id="about" className="py-16 md:py-24 bg-bg-alt relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-20 left-[-100px] w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-[-100px] w-96 h-96 bg-cyber-glow/[0.03] rounded-full blur-3xl" />

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative">
                <FadeIn>
                    <span className="block text-center font-mono text-sm font-medium text-primary uppercase tracking-[2px] mb-3">
                        {t('label')}
                    </span>
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">{t('title')}</h2>
                    <p className="text-center text-text-muted text-base md:text-lg max-w-[600px] mx-auto mb-8">
                        {t('subtitle')}
                    </p>
                </FadeIn>

                {/* Highlight badges */}
                <ScaleIn delay={0.15}>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-14 md:mb-16">
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.06, y: -3 }}
                                className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                            >
                                <span className="text-xl">{h.icon}</span>
                                <div>
                                    <div className="text-sm font-bold text-primary leading-none">{h.value}</div>
                                    <div className="text-xs text-text-muted">{h.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScaleIn>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={staggerItem}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-shadow hover:shadow-xl hover:border-primary/15 cursor-default relative overflow-hidden"
                        >
                            {/* Card gradient accent */}
                            <div className={`absolute inset-0 bg-linear-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className="relative">
                                <motion.div
                                    className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-2xl mb-5"
                                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                                >
                                    {f.icon}
                                </motion.div>
                                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
                            </div>
                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
