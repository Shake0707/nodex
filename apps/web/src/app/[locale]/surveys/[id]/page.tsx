import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import SurveyRegistrationForm from '@/components/Survey/SurveyRegistrationForm';
import { getSurveyPublic } from '@/lib/api';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params;
    try {
        const survey = await getSurveyPublic(Number(id));
        const title = locale === 'ru' ? survey.title_ru : locale === 'en' ? survey.title_en : survey.title_uz;
        return { title };
    } catch {
        return { title: 'Survey' };
    }
}

export default async function SurveyPage({ params }: Props) {
    const { id } = await params;
    const locale = await getLocale();

    let survey;
    try {
        survey = await getSurveyPublic(Number(id));
    } catch (e) {
        const status = e instanceof Error ? e.message : '';
        if (status === '404') notFound();
        throw e;
    }

    const title = locale === 'ru' ? survey.title_ru : locale === 'en' ? survey.title_en : survey.title_uz;
    const desc = locale === 'ru' ? survey.description_ru : locale === 'en' ? survey.description_en : survey.description_uz;

    return (
        <div className="survey-page">
            <div
                className="pointer-events-none fixed top-0 left-0 w-full h-full"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(168,85,247,0.07) 0%, transparent 70%)', zIndex: 0 }}
            />
            <div
                className="pointer-events-none fixed top-0 right-0 w-full h-full"
                style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 80%, rgba(0,212,255,0.05) 0%, transparent 70%)', zIndex: 0 }}
            />

            <div className="survey-page__inner relative z-10">
                <p className="section-label mb-10">
                    <span style={{ color: 'rgba(245,243,255,0.3)' }}>Nodex</span>
                    {' / '}
                    <span>Survey</span>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '64px', alignItems: 'start' }}
                    className="survey-split-grid">
                    {/* Left — event detail */}
                    <div style={{ position: 'sticky', top: 96 }}>
                        <h1 className="survey-event-title">{title}</h1>
                        {desc && <p className="survey-event-desc">{desc}</p>}
                    </div>

                    {/* Right — form only */}
                    <div>
                        <SurveyRegistrationForm surveyId={Number(id)} locale={locale} />
                    </div>
                </div>
            </div>
        </div>
    );
}
