'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn, staggerContainer, staggerItem } from '@/components/animations';

const ICONS = [
    // Book
    <svg key="book" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    // Terminal
    <svg key="terminal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    // Trophy
    <svg key="trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    // Academic
    <svg key="academic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
];

export default function About() {
    const t = useTranslations('about');

    const features = [
        { icon: ICONS[0], title: t('feature1Title'), desc: t('feature1Desc') },
        { icon: ICONS[1], title: t('feature2Title'), desc: t('feature2Desc') },
        { icon: ICONS[2], title: t('feature3Title'), desc: t('feature3Desc') },
        { icon: ICONS[3], title: t('feature4Title'), desc: t('feature4Desc') },
    ];

    return (
        <section
            id="about"
            className="py-24 md:py-32 relative overflow-hidden section-separator"
            style={{ background: 'var(--color-bg-alt)' }}
        >
            {/* Cyan ambient glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 500, height: 400,
                    background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)',
                    top: 0, left: '60%',
                    filter: 'blur(50px)',
                }}
            />

            <div className="max-w-[1180px] mx-auto px-5 md:px-8 relative">
                {/* Two-column layout: text left, grid right */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-20 items-start">

                    {/* Left: text block */}
                    <FadeIn>
                        <div className="lg:sticky lg:top-24">
                            <span className="section-label mb-4">{t('label')}</span>
                            <h2
                                className="text-4xl md:text-5xl font-black leading-[1.05] mb-6"
                                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                            >
                                {t('title')}
                            </h2>
                            <div
                                className="w-12 h-[2px] mb-6"
                                style={{ background: 'linear-gradient(90deg, #A855F7, #00D4FF)' }}
                            />
                            <p
                                className="text-base md:text-lg leading-relaxed mb-8"
                                style={{ color: 'rgba(245,243,255,0.45)', maxWidth: '400px' }}
                            >
                                {t('subtitle')}
                            </p>

                            {/* Three data tags */}
                            <div className="flex flex-wrap gap-2">
                                <span className="tag-cyber">24/7 Learning</span>
                                <span className="tag-cyber">Open Source</span>
                                <span className="tag-pink">100% Free</span>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Right: 2x2 feature grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                variants={staggerItem}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="card-neo p-6 group cursor-default relative overflow-hidden"
                            >
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 flex items-center justify-center mb-4"
                                    style={{
                                        background: 'rgba(168,85,247,0.1)',
                                        border: '1px solid rgba(168,85,247,0.2)',
                                        color: '#A855F7',
                                    }}
                                >
                                    {f.icon}
                                </div>

                                <h3
                                    className="text-[15px] font-bold mb-2"
                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                                >
                                    {f.title}
                                </h3>
                                <p
                                    className="text-[13px] leading-relaxed"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {f.desc}
                                </p>

                                {/* Bottom neon bar on hover */}
                                <div
                                    className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500"
                                    style={{ background: 'linear-gradient(90deg, #A855F7, #00D4FF)' }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
