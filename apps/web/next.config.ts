import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
    output: 'standalone' as const,
    turbopack: {
        root: path.resolve(__dirname, '../..'),
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'api.nodex.uz' },
            { protocol: 'http',  hostname: 'localhost', port: '4000' },
        ],
        formats: ['image/avif', 'image/webp'],
    },
};

export default withNextIntl(nextConfig);
