'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBadgesBar from '@/components/TrustBadgesBar';
import CategoryGrid from '@/components/CategoryGrid';
import FlashSaleSection from '@/components/FlashSaleSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import PromotionalEntryModal from '@/components/PromotionalEntryModal';
import { useStore } from '@/context/StoreContext';

export default function Home() {
  const { storeConfig, heroBanner, categories, products } = useStore();

  const trendingProducts = products.filter(
    (p) => p.badge === 'Trending' || p.badge === 'Featured' || p.badge === 'Best Seller' || p.isFeatured
  );

  // New Arrivals includes all items tagged New/Hot or recently added database products
  const newArrivals = products.filter(
    (p) => p.badge === 'New' || p.badge === 'Hot' || p.isNew
  );
  const displayNewArrivals = newArrivals.length >= 4 ? newArrivals : [...products].reverse();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top Navigation Header */}
      <Header siteName={storeConfig.name} />

      <main className="flex-1 w-full pb-6 space-y-2">
        {/* 1. Hero Banner */}
        <HeroSection banner={heroBanner} />

        {/* 2. Trust Badges Bar (24/7 Delivery) */}
        <TrustBadgesBar />

        {/* 3. Shop By Category Showcase (Moved UP right under 24/7 Delivery Bar) */}
        <CategoryGrid categories={categories} />

        {/* 4. Flash Sale Section */}
        <FlashSaleSection />

        {/* 5. Product Showcases */}
        {products.length === 0 ? null : products.length <= 3 ? (
          /* When store has 1 to 3 products, show them proudly ONCE without repeating in multiple duplicate sections */
          <FeaturedProducts
            title="Featured Products"
            products={products}
            viewAllLink="/products"
          />
        ) : (
          <>
            {/* Trending Collections Section */}
            <FeaturedProducts
              title="Trending Collections"
              products={trendingProducts.length > 0 ? trendingProducts : products.slice(0, 10)}
              viewAllLink="/products?sort=trending"
            />

            {/* New Arrivals Section */}
            <FeaturedProducts
              title="New Arrivals"
              products={displayNewArrivals}
              viewAllLink="/products?sort=newest"
            />

            {/* Category-Wise Product Card Showcase Sections */}
            {categories.map((cat) => {
              const catProducts = products.filter(
                (p) => p.category && p.category.toLowerCase().trim() === cat.name.toLowerCase().trim()
              );
              if (catProducts.length === 0) return null;

              return (
                <FeaturedProducts
                  key={cat.id}
                  title={`${cat.name} Showcase`}
                  products={catProducts}
                  viewAllLink={`/products?category=${encodeURIComponent(cat.name)}`}
                />
              );
            })}
          </>
        )}

        {/* 8. Customer Reviews & Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Comprehensive E-Commerce Footer */}
      <Footer />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Promotional Entry Modal (Masks background loading & delivers special offer) */}
      <PromotionalEntryModal />
    </div>
  );
}
