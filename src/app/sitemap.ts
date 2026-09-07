import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ardhimart.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';

  // Primary Sitelink & Category Target Routes (Highest Priority)
  const coreRoutes = [
    { route: '', priority: 1.0, changeFrequency: 'always' as const },
    { route: '/products?category=Flash%20Deals', priority: 0.95, changeFrequency: 'hourly' as const },
    { route: '/products?category=Smart%20Gadgets', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/products?category=Fashion%20%26%20Beauty', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/products?badge=New', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/products?badge=Trending', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/products', priority: 0.85, changeFrequency: 'daily' as const },
    { route: '/track', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/return-policy', priority: 0.5, changeFrequency: 'monthly' as const },
    { route: '/faq', priority: 0.5, changeFrequency: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.4, changeFrequency: 'monthly' as const },
    { route: '/terms-and-conditions', priority: 0.4, changeFrequency: 'monthly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  // Fetch dynamic categories and products from backend API for comprehensive indexing
  let dynamicProductRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data) ? data : data.products || [];
      dynamicProductRoutes = products.map((p: any) => ({
        url: `${baseUrl}/products/${p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.warn('Sitemap dynamic product fetch failed, serving core routes:', err);
  }

  return [...coreRoutes, ...dynamicProductRoutes];
}
