import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ardhimart.com';

  const staticRoutes = [
    { route: '', priority: 1.0 },
    { route: '/products', priority: 0.9 },
    { route: '/products/combo-gift-boxes', priority: 0.9 },
    { route: '/products/smart-gadgets', priority: 0.9 },
    { route: '/products/fashion-jewellery', priority: 0.9 },
    { route: '/products/mens-clothing', priority: 0.9 },
    { route: '/faq', priority: 0.8 },
    { route: '/return-policy', priority: 0.8 },
    { route: '/login', priority: 0.8 },
  ].map(({ route, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: priority,
  }));

  return [...staticRoutes];
}
