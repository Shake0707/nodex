import { getLocale } from 'next-intl/server';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Team from '@/components/Team/Team';
import Events from '@/components/Events/Events';
import Partners from '@/components/Partners/Partners';
import Contact from '@/components/Contact/Contact';
import SurveyMarquee from '@/components/SurveyMarquee/SurveyMarquee';
import { getMembers, getEvents, getPartners, getStats, getActiveSurveys, Member, Event, Partner, SurveyActive } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nodex.uz';

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nodex',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Nodex — kiberxavfsizlik klubi | Cybersecurity club',
    sameAs: [
        'https://t.me/nodexcc',
    ],
    foundingDate: '2025',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'UZ',
    },
};

export default async function Home() {
    const locale = await getLocale();

    let members: Member[] = [];
    let events: Event[] = [];
    let partners: Partner[] = [];
    let activeSurveys: SurveyActive[] = [];
    let stats = { members_count: 20, events_count: 1, partners_count: 2 };

    try {
        [members, events, partners, stats, activeSurveys] = await Promise.all([
            getMembers(),
            getEvents(),
            getPartners(),
            getStats(),
            getActiveSurveys(),
        ]);
    } catch (e) {
        console.error('API fetch error:', e);
    }

    console.log(activeSurveys);
    

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main>
                <SurveyMarquee surveys={activeSurveys} locale={locale} />
                <Hero stats={stats} hasSurveyBanner={activeSurveys.length > 0} />
                <About />
                <Team members={members} locale={locale} />
                <Events events={events} locale={locale} />
                <Partners partners={partners} />
                <Contact />
            </main>
        </>
    );
}
