import { useTranslations } from 'next-intl';
import MatrixRain from '@/components/MatrixRain';
import CountUp from '@/components/CountUp';
import type { Stats } from '@/lib/api';

interface HeroProps {
    stats: Stats;
}

export default function Hero({ stats }: HeroProps) {
    const t = useTranslations('hero');

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center bg-bg-dark overflow-hidden pt-[72px]">
            <MatrixRain />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-bg-dark)_70%)] z-1" />

            <div className="relative z-2 text-center max-w-[800px] px-4 md:px-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-5 tracking-tight">
                    <span className="bg-linear-to-br from-primary to-cyber-glow bg-clip-text text-transparent">{t('title')}</span>{' '}
                    {t('titleSuffix')}
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-text-on-dark mb-8 md:mb-10 leading-relaxed opacity-85">
                    {t('subtitle')}
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center mb-10 md:mb-16">
                    <a href="#about" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl shadow-[0_4px_15px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,102,255,0.4)] transition-all duration-300">
                        {t('btnDetails')}
                    </a>
                    <a
                        href="https://t.me/nodexcc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 hover:-translate-y-1 hover:border-white/70 transition-all duration-300"
                    >
                        📢 {t('btnTelegram')}
                    </a>
                </div>

                <div className="flex gap-6 md:gap-12 justify-center flex-wrap">
                    {[
                        { end: stats.members_count, label: t('statMembers') },
                        { end: stats.events_count, label: t('statEvents') },
                        { end: stats.partners_count, label: t('statPartners') },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-cyber-glow font-mono leading-none mb-1">
                                <CountUp end={s.end} suffix="+" />
                            </div>
                            <div className="text-sm text-text-on-dark opacity-70">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
