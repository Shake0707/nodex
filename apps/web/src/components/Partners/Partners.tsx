'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn, staggerContainer, staggerItem } from '@/components/animations';
import { getUploadUrl, type Partner } from '@/lib/api';

interface PartnersProps {
    partners: Partner[];
}

export default function Partners({ partners }: PartnersProps) {
    const t = useTranslations('partners');

    return (
        <section id="partners" className="py-16 md:py-24 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute bottom-20 left-[-80px] w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl" />

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative">
                <FadeIn>
                    <span className="block text-center font-mono text-sm font-medium text-primary uppercase tracking-[2px] mb-3">{t('label')}</span>
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">{t('title')}</h2>
                    <p className="text-center text-text-muted text-base md:text-lg max-w-[600px] mx-auto mb-12 md:mb-16">{t('subtitle')}</p>
                </FadeIn>

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {partners.length > 0 ? (
                        partners.map((partner) => (
                            <motion.a
                                key={partner.id}
                                href={partner.website_url || '#'}
                                target={partner.website_url ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                variants={staggerItem}
                                whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.2 } }}
                                className="group flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-xl hover:border-primary/15 w-full relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <motion.div
                                    className="w-20 h-20 rounded-xl bg-bg-alt flex items-center justify-center text-4xl overflow-hidden relative"
                                    whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.3 } }}
                                >
                                    {getUploadUrl(partner.logo_image_url) ? (
                                        <img src={getUploadUrl(partner.logo_image_url)!} alt={partner.name} className="w-full h-full object-contain p-2" />
                                    ) : '🏢'}
                                </motion.div>
                                <span className="text-sm font-semibold text-text text-center relative">{partner.name}</span>
                                {partner.website_url && (
                                    <span className="text-[10px] text-text-muted font-mono opacity-0 group-hover:opacity-100 transition-opacity">↗ visit</span>
                                )}
                            </motion.a>
                        ))
                    ) : (
                        <p className="col-span-full text-center py-16 text-text-muted text-lg">{t('empty')}</p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
