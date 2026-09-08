'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { m } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBadgesBar from '@/components/TrustBadgesBar';
import CategoryGrid from '@/components/CategoryGrid';
import FlashSaleSection from '@/components/FlashSaleSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BottomNavBar from '@/components/BottomNavBar';
import { useStore } from '@/context/StoreContext';
import { getCategorySlug } from '@/lib/slug';

// Lazy load below-the-fold components to maximize mobile Initial Contentful Paint & Google PageSpeed
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  ssr: false,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
});

const PromotionalEntryModal = dynamic(() => import('@/components/PromotionalEntryModal'), {
  ssr: false,
});

export default function Home() {
  const { storeConfig, heroBanner, categories, products } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured === true);
  const trendingProducts = products.filter((p) => p.isTrending === true);
  const newArrivals = products.filter((p) => p.isNew === true);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top Navigation Header */}
      <Header siteName={storeConfig.name} />

      <main className="flex-1 w-full pb-6 space-y-2">
        {/* 1. Hero Banner (Eager Loaded for instant LCP on mobile) */}
        <HeroSection banner={heroBanner} />

        {/* 2. Trust Badges Bar (24/7 Delivery) */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <TrustBadgesBar />
        </m.div>

        {/* 3. Shop By Category Showcase */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <CategoryGrid categories={categories} />
        </m.div>

        {/* 4. Flash Sale Section */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <FlashSaleSection />
        </m.div>

        {/* 5. Product Showcases - based strictly on Admin Section Checkmarks */}
        {products.length === 0 ? null : (
          <>
            {/* Hot Deals Section */}
            {featuredProducts.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <FeaturedProducts
                  title="Hot Deals 🔥"
                  products={featuredProducts}
                  viewAllLink="/products?filter=hot_deals"
                />
              </m.div>
            )}

            {/* Trending Collections Section */}
            {trendingProducts.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <FeaturedProducts
                  title="Trending Collections"
                  products={trendingProducts}
                  viewAllLink="/products?sort=trending"
                />
              </m.div>
            )}

            {/* New Arrivals Section */}
            {newArrivals.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <FeaturedProducts
                  title="New Arrivals"
                  products={newArrivals}
                  viewAllLink="/products?sort=newest"
                />
              </m.div>
            )}

            {/* Fallback if no specific checkmarks */}
            {featuredProducts.length === 0 && trendingProducts.length === 0 && newArrivals.length === 0 && (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <FeaturedProducts
                  title="Featured Products"
                  products={products}
                  viewAllLink="/products"
                />
              </m.div>
            )}

            {/* Category-Wise Product Card Showcase Sections */}
            {categories.map((cat) => {
              const catProducts = products.filter(
                (p) => p.category && p.category.toLowerCase().trim() === cat.name.toLowerCase().trim()
              );
              if (catProducts.length === 0) return null;

              return (
                <m.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <FeaturedProducts
                    title={`${cat.name} Showcase`}
                    products={catProducts}
                    viewAllLink={`/category/${getCategorySlug(cat.name, cat.slug)}`}
                  />
                </m.div>
              );
            })}
          </>
        )}

        {/* 6. Customer Reviews & Testimonials (Lazy Loaded) */}
        <TestimonialsSection />
      </main>

      {/* Comprehensive E-Commerce Footer (Lazy Loaded) */}
      <Footer />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Promotional Entry Modal (Lazy Loaded) */}
      <PromotionalEntryModal />
    </div>
  );
}
