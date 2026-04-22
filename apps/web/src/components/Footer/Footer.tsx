'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations';

export default function Footer() {
    const t = useTranslations('footer');
    const th = useTranslations('header');

    const navLinks = [
        { label: th('home'), href: '#hero' },
        { label: th('about'), href: '#about' },
        { label: th('team'), href: '#team' },
        { label: th('events'), href: '#events' },
        { label: th('partners'), href: '#partners' },
    ];

    const socialLinks = [
        { label: 'Telegram kanal', href: 'https://t.me/nodexcc', external: true },
        { label: 'Telegram bot', href: 'https://t.me/nodexccbot', external: true },
    ];

    return (
        <footer
            className="relative overflow-hidden"
            style={{
                background: '#020206',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Subtle pink bloom top-left */}
            <div
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                    width: 300, height: 200,
                    background: 'radial-gradient(ellipse, rgba(168,85,247,0.04) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                }}
            />

            <div className="max-w-295 mx-auto px-5 md:px-8 py-12">
                <FadeIn>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10"> */}
                    <div className="flex flex-wrap gap-10 mb-10 flex-col md2:flex-row">

                        {/* Brand */}
                        <div className="w-full md2:w-[30%]">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-7 h-7 overflow-hidden rounded">
                                    <Image
                                        src="/logo.png"
                                        alt="Nodex"
                                        width={28}
                                        height={28}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span
                                    className="text-sm font-black tracking-widest text-white"
                                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                                >
                                    NODEX
                                </span>
                            </div>
                            <p
                                className="text-[13px] leading-relaxed w-full"
                                style={{ color: 'rgba(245,243,255,0.25)' }}
                            >
                                {t('desc')}
                            </p>
                        </div>

                        {/* Nav */}
                        <div className="w-full md2:w-[30%]">
                            <p
                                className="text-[10px] font-mono tracking-widest uppercase mb-4"
                                style={{ color: 'rgba(245,243,255,0.2)' }}
                            >
                                Navigation
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {navLinks.map(link => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-[13px] transition-colors duration-200"
                                        style={{ color: 'rgba(245,243,255,0.3)', fontFamily: 'var(--font-sans)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#F5F3FF')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,255,0.3)')}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Social */}
                        <div className="w-full md2:w-[30%]">
                            <p
                                className="text-[10px] font-mono tracking-widest uppercase mb-4"
                                style={{ color: 'rgba(245,243,255,0.2)' }}
                            >
                                Community
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {socialLinks.map(link => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[13px] transition-colors duration-200"
                                        style={{ color: 'rgba(245,243,255,0.3)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#A855F7')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,255,0.3)')}
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div
                        className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <p
                            className="text-[11px] font-mono tracking-wider"
                            style={{ color: 'rgba(245,243,255,0.15)' }}
                        >
                            © {new Date().getFullYear()} {t('copyright')}
                        </p>
                        <p
                            className="text-[11px] font-mono"
                            style={{ color: 'rgba(245,243,255,0.12)' }}
                        >
                            Developed by{' '}
                            <a
                                href="https://github.com/Shake0707"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors duration-200"
                                style={{ color: 'rgba(168,85,247,0.5)' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#A855F7')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,85,247,0.5)')}
                            >
                                Shakhriyor
                            </a>
                        </p>
                    </div>
                </FadeIn>
            </div>
        </footer>
    );
}
