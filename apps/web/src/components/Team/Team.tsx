'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FadeIn, staggerContainer, staggerItem } from '@/components/animations';
import { getUploadUrl, type Member } from '@/lib/api';

interface TeamProps {
    members: Member[];
    locale: string;
}

export default function Team({ members, locale }: TeamProps) {
    const t = useTranslations('team');

    const getName = (m: Member) => (m as unknown as Record<string, string>)[`name_${locale}`] || m.name_uz;
    const getRole = (m: Member) => (m as unknown as Record<string, string>)[`role_${locale}`] || m.role_uz;
    const getDesc = (m: Member) => (m as unknown as Record<string, string>)[`description_${locale}`] || m.description_uz;

    return (
        <section id="team" className="py-16 md:py-24 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-40 right-[-80px] w-64 h-64 bg-primary/[0.04] rounded-full blur-3xl" />

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative">
                <FadeIn>
                    <span className="block text-center font-mono text-sm font-medium text-primary uppercase tracking-[2px] mb-3">{t('label')}</span>
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">{t('title')}</h2>
                    <p className="text-center text-text-muted text-base md:text-lg max-w-[600px] mx-auto mb-12 md:mb-16">{t('subtitle')}</p>
                </FadeIn>

                {members.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {members.map((member) => (
                            <motion.div
                                key={member.id}
                                variants={staggerItem}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-xl hover:border-primary/15"
                            >
                                <div className="h-48 bg-linear-to-br from-bg-dark to-primary-dark flex items-center justify-center text-5xl text-cyber-glow overflow-hidden relative">
                                    {getUploadUrl(member.photo_url) ? (
                                        <motion.img
                                            src={getUploadUrl(member.photo_url)!}
                                            alt={getName(member)}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(0,212,255,0.15),transparent_60%)]" />
                                            👤
                                        </>
                                    )}
                                    {/* Status dot */}
                                    <div className="absolute top-3 right-3 w-3 h-3 bg-success rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-1">{getName(member)}</h3>
                                    <p className="text-sm font-mono text-primary font-medium mb-3">{getRole(member)}</p>
                                    <p className="text-sm text-text-muted leading-relaxed line-clamp-3">{getDesc(member)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <FadeIn>
                        <p className="text-center py-16 text-text-muted text-lg">{t('empty')}</p>
                    </FadeIn>
                )}
            </div>
        </section>
    );
}
