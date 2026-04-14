'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

export default function Header() {
    const t = useTranslations('header');
    const locale = useLocale();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const isLanding = pathname === `/${locale}` || pathname === `/${locale}/`;
    const base = isLanding ? '' : `/${locale}/`;

    const navLinks = [
        { label: t('home'), href: `${base}#hero` },
        { label: t('about'), href: `${base}#about` },
        { label: t('team'), href: `${base}#team` },
        { label: t('events'), href: `${base}#events` },
        { label: t('partners'), href: `${base}#partners` },
        { label: t('contact'), href: `${base}#contact` },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
                style={{
                    height: '56px',
                    background: scrolled ? 'rgba(4,4,8,0.97)' : 'rgba(4,4,8,0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: scrolled
                        ? '1px solid rgba(168,85,247,0.2)'
                        : '1px solid rgba(255,255,255,0.05)',
                }}
            >
                <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-full flex items-center justify-between">

                    {/* Logo */}
                    <a href={`/${locale}/`} className="flex items-center gap-2.5 group">
                        <div className="relative w-8 h-8 overflow-hidden rounded">
                            <Image
                                src="/logo.png"
                                alt="Nodex"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span
                            className="text-[15px] font-black tracking-widest text-white"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                        >
                            NODEX
                        </span>
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="relative text-[13px] font-medium transition-colors duration-200 group"
                                style={{
                                    color: 'rgba(245,243,255,0.45)',
                                    fontFamily: 'var(--font-display)',
                                    letterSpacing: '0.04em',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#F5F3FF')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,255,0.45)')}
                            >
                                {link.label}
                                <span
                                    className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                                    style={{ background: '#A855F7' }}
                                />
                            </a>
                        ))}
                    </nav>

                    {/* Desktop right */}
                    <div className="hidden md:flex items-center gap-3">
                        <LanguageSwitcher />
                        <a
                            href="https://t.me/nodexccbot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-[13px]"
                            style={{ padding: '8px 20px' }}
                        >
                            {t('telegram')}
                        </a>
                    </div>

                    {/* Mobile burger */}
                    <button
                        className="flex md:hidden flex-col gap-[5px] w-7 z-[1001] p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <span
                            className="block w-full h-[1.5px] transition-all duration-300"
                            style={{
                                background: menuOpen ? '#A855F7' : '#F5F3FF',
                                transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none',
                            }}
                        />
                        <span
                            className="block w-full h-[1.5px] transition-all duration-300"
                            style={{
                                background: '#A855F7',
                                opacity: menuOpen ? 0 : 1,
                            }}
                        />
                        <span
                            className="block w-full h-[1.5px] transition-all duration-300"
                            style={{
                                background: menuOpen ? '#A855F7' : '#F5F3FF',
                                transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none',
                            }}
                        />
                    </button>
                </div>
            </header>

            {/* Mobile drawer — slide in from right */}
            <div
                className="fixed inset-0 z-[998] md:hidden transition-all duration-400"
                style={{
                    pointerEvents: menuOpen ? 'all' : 'none',
                }}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                        background: 'rgba(4,4,8,0.7)',
                        backdropFilter: 'blur(4px)',
                        opacity: menuOpen ? 1 : 0,
                    }}
                    onClick={() => setMenuOpen(false)}
                />

                {/* Drawer panel */}
                <div
                    className="absolute top-0 right-0 h-full w-72 flex flex-col pt-20 pb-8 px-8 transition-transform duration-400"
                    style={{
                        background: '#08080F',
                        borderLeft: '1px solid rgba(168,85,247,0.15)',
                        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
                    }}
                >
                    {/* Pink accent line at top */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, #A855F7, transparent)' }}
                    />

                    <nav className="flex flex-col gap-1 mb-8">
                        {navLinks.map((link, i) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="py-3 text-[15px] font-semibold border-b transition-colors duration-200"
                                style={{
                                    color: 'rgba(245,243,255,0.55)',
                                    fontFamily: 'var(--font-display)',
                                    borderColor: 'rgba(255,255,255,0.05)',
                                    transitionDelay: `${i * 30}ms`,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#F5F3FF')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,255,0.55)')}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="mb-6">
                        <LanguageSwitcher />
                    </div>

                    <a
                        href="https://t.me/nodexcc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full justify-center"
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('telegram')}
                    </a>

                    <div
                        className="mt-auto text-[11px] font-mono"
                        style={{ color: 'rgba(82,80,95,0.6)', letterSpacing: '0.1em' }}
                    >
                        NODEX © {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        </>
    );
}
