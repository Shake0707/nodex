import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nodex.uz';

export const metadata: Metadata = {
  title: 'Nodex — Kiberxavfsizlik klubi',
  description: "Nodex — Al-Xorazmiy nomidagi maktab qoshidagi kiberxavfsizlik klubi. CTF musobaqalar, amaliy mashg'ulotlar va bepul darslar.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Nodex — Kiberxavfsizlik klubi',
    description: "Nodex — Al-Xorazmiy nomidagi maktab qoshidagi kiberxavfsizlik klubi.",
    url: SITE_URL,
    siteName: 'Nodex',
    type: 'website',
    images: [{
      url: `${SITE_URL}/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Nodex — Kiberxavfsizlik klubi',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nodex — Kiberxavfsizlik klubi',
    description: "Nodex — Al-Xorazmiy nomidagi maktab qoshidagi kiberxavfsizlik klubi.",
  },
};

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale || 'uz'} data-scroll-behavior="smooth" className={`${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
