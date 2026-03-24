import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
    output: 'standalone' as const,
    turbopack: {
        root: path.resolve(__dirname, '../..'),
    },
};

export default withNextIntl(nextConfig);
