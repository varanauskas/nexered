/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    basePath: "/base",
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/',
                permanent: true,
            },
            {
                source: '/old-blog/:path*',
                destination: '/blog/:path*',
                permanent: false
            },
            {
                source: '/old-blog/:slug',
                destination: '/news/:slug',
                permanent: true,
            },
            {
                source: '/blog/:slug*',
                destination: '/news/:slug*',
                permanent: true,
            },
            {
                source: '/with-basePath',
                destination: '/another',
                permanent: false,
            },
            {
                source: '/without-basePath',
                destination: '/another',
                basePath: false,
                permanent: false,
            },
            {
                source: '/custom-status-code',
                destination: '/status-code-303',
                statusCode: 303
            }
        ];
    },
};

module.exports = nextConfig;