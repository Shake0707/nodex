'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import CountUp from '@/components/CountUp';
import { ElegantShape } from '@/components/ui/shape-landing-hero';
import type { Stats } from '@/lib/api';

interface HeroProps {
    stats: Stats;
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
});

export default function Hero({ stats }: HeroProps) {
    const t = useTranslations('hero');

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ paddingTop: '56px', background: 'var(--color-bg)' }}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/[0.04] via-transparent to-[#00D4FF]/[0.04] blur-3xl pointer-events-none" />

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-[#A855F7]/[0.12]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-[#00D4FF]/[0.12]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.10]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-[#A855F7]/[0.08]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />
                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-[#00D4FF]/[0.08]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040408] via-transparent to-[#040408]/80 pointer-events-none" />

            {/* ── Main content ── */}
            <div className="relative z-[2] text-center px-5 md:px-8 max-w-[1100px] mx-auto w-full">

                {/* Mono label */}
                <motion.div {...fadeUp(0.05)} className="mb-8">
                    <span
                        className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] uppercase"
                        style={{ color: 'rgba(245,243,255,0.3)' }}
                    >
                        <span className="live-dot" />
                        {t('badge') || 'CYBERSECURITY · UZBEKISTAN · 2026'}
                        <span className="live-dot" />
                    </span>
                </motion.div>

                {/* Giant heading */}
                <motion.h1
                    {...fadeUp(0.15)}
                    className="font-black mb-6"
                    style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}
                >
                    <span
                        className="block text-white"
                        style={{ fontSize: 'clamp(64px, 10vw, 128px)' }}
                    >
                        NODEX
                    </span>
                    <span
                        className="block text-gradient-pink"
                        style={{ fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.15, marginTop: '0.15em' }}
                    >
                        {t('titleSuffix') || 'SECURITY CLUB'}
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    {...fadeUp(0.3)}
                    className="text-base md:text-lg max-w-[520px] mx-auto leading-relaxed mb-10"
                    style={{ color: 'rgba(245,243,255,0.4)', fontFamily: 'var(--font-sans)' }}
                >
                    {t('subtitle')}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    {...fadeUp(0.4)}
                    className="flex flex-col sm:flex-row gap-3 justify-center mb-20"
                >
                    <a href="#about" className="btn-primary">
                        {t('btnDetails')} →
                    </a>
                    <a
                        href="https://t.me/nodexcc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                    >
                        Telegram ↗
                    </a>
                </motion.div>
            </div>

            {/* ── Stats bar ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 z-[2]"
                style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(8,8,15,0.8)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                    <div className="flex items-stretch">
                        {[
                            { end: stats.members_count, label: t('statMembers') },
                            { end: stats.events_count,  label: t('statEvents') },
                            { end: stats.partners_count, label: t('statPartners') },
                        ].map((s, i) => (
                            <div key={i} className="flex items-stretch flex-1">
                                <div className="flex-1 py-6 text-center">
                                    <div
                                        className="text-2xl md:text-3xl font-black leading-none mb-1 text-gradient-pink"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        <CountUp end={s.end} suffix="+" />
                                    </div>
                                    <div
                                        className="text-[10px] uppercase tracking-[0.2em]"
                                        style={{ color: 'rgba(245,243,255,0.25)', fontFamily: 'var(--font-mono)' }}
                                    >
                                        {s.label}
                                    </div>
                                </div>
                                {i < 2 && (
                                    <div
                                        className="w-px self-stretch my-4"
                                        style={{ background: 'rgba(255,255,255,0.06)' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
