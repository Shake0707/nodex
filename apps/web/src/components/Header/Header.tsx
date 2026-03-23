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

    // Check if on landing page (e.g. /uz, /en, /ru)
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

    return (
        <header
            className={`fixed top-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-md border-b border-black/5 z-[1000] transition-all ${scrolled ? 'shadow-md' : ''
                }`}
        >
            <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
                <a href={`/${locale}/`} className="flex items-center gap-2.5 text-xl font-extrabold text-primary tracking-tight">
                    <Image src="/logo.png" alt="Nodex" width={40} height={40} className="w-10 h-10 rounded-[10px] object-cover" />
                    NODEX
                </a>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[0.95rem] font-medium text-text-muted hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full after:rounded-sm"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <LanguageSwitcher />
                    <a
                        href="https://t.me/nodexccbot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all"
                    >
                        📢 {t('telegram')}
                    </a>
                </div>

                <div
                    className="flex md:hidden flex-col gap-[5px] w-7 cursor-pointer z-[1001]"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className={`w-full h-[3px] bg-text rounded-sm transition-all ${menuOpen ? 'rotate-45 translate-x-[5px] translate-y-[6px]' : ''}`} />
                    <span className={`w-full h-[3px] bg-text rounded-sm transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-full h-[3px] bg-text rounded-sm transition-all ${menuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[6px]' : ''}`} />
                </div>
            </div>

            {menuOpen && (
                <div className="fixed inset-0 bg-white/[0.98] backdrop-blur-xl z-[999] flex flex-col items-center justify-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-xl font-semibold text-text hover:text-primary transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <LanguageSwitcher />
                    <a
                        href="https://t.me/nodexcc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl mt-4"
                    >
                        📢 {t('telegram')}
                    </a>
                </div>
            )}
        </header>
    );
}
