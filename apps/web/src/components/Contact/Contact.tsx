'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RobotOutlined } from '@ant-design/icons';
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
                            <RobotOutlined style={{ fontSize: 16 }} /> {t('btnBot')}
                        </motion.a>
                        <motion.a
                            href="https://t.me/nodexcc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <svg viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
                                <defs>
                                    <linearGradient x1="50%" y1="0%" x2="50%" y2="99.2583404%" id="linearGradient-1">
                                        <stop stopColor="#2AABEE" offset="0%" />
                                        <stop stopColor="#229ED9" offset="100%" />
                                    </linearGradient>
                                </defs>
                                <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <circle id="Oval" fill="url(#linearGradient-1)" cx="500" cy="500" r="500"></circle>
                                    <path d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z" id="Path-3" fill="#FFFFFF"></path>
                                </g>
                            </svg> {t('btnChannel')}
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
                            { label: '41.302704, 69.315786', desc: 'Tashkent, UZ' },
                            { label: 'EST. 2026', desc: 'Founded' },
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
