'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn, SlideIn } from '@/components/animations';

export default function Footer() {
    const t = useTranslations('footer');
    const th = useTranslations('header');

    return (
        <footer className="bg-bg-dark-alt py-12">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                    <SlideIn from="left">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Image src="/logo.png" alt="Nodex" width={36} height={36} className="w-9 h-9 rounded-lg object-cover" />
                                <span className="text-lg font-bold text-white tracking-tight">NODEX</span>
                            </div>
                            <p className="text-text-on-dark opacity-60 text-sm max-w-[300px]">{t('desc')}</p>
                        </div>
                    </SlideIn>

                    <SlideIn from="right">
                        <div className="flex flex-wrap gap-6">
                            <a href="#hero" className="text-sm text-text-on-dark opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">{th('home')}</a>
                            <a href="#about" className="text-sm text-text-on-dark opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">{th('about')}</a>
                            <a href="#team" className="text-sm text-text-on-dark opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">{th('team')}</a>
                            <a href="#events" className="text-sm text-text-on-dark opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">{th('events')}</a>
                            <a href="https://t.me/nodexcc" target="_blank" rel="noopener noreferrer" className="text-sm text-text-on-dark opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">{th('telegram')}</a>
                        </div>
                    </SlideIn>
                </div>

                <FadeIn>
                    <div className="border-t border-white/10 pt-6 text-center text-sm text-text-on-dark opacity-40">
                        <p>© {new Date().getFullYear()} {t('copyright')}</p>
                        <p className="mt-2 text-xs">
                            Developed by{' '}
                            <a href="https://github.com/Shake0707" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-cyber-glow transition-colors opacity-70 hover:opacity-100">
                                Shakhriyor
                            </a>
                        </p>
                    </div>
                </FadeIn>
            </div>
        </footer>
    );
}
