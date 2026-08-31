import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ardhimart.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image/', '/images/', '/logo.png', '/favicon.ico'],
        disallow: ['/checkout', '/checkout/*', '/account/*', '/cart', '/api/*'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/_next/static/', '/_next/image/', '/images/', '/logo.png', '/favicon.ico'],
        disallow: ['/checkout', '/checkout/*', '/account/*', '/cart'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/_next/static/', '/_next/image/', '/images/', '/logo.png'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
