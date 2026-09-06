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
import { getCategorySlug } from '@/lib/slug';

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
        {/* 1. Hero Banner */}
        <HeroSection banner={heroBanner} />

        {/* 2. Trust Badges Bar (24/7 Delivery) */}
        <TrustBadgesBar />

        {/* 3. Shop By Category Showcase (Moved UP right under 24/7 Delivery Bar) */}
        <CategoryGrid categories={categories} />

        {/* 4. Flash Sale Section */}
        <FlashSaleSection />

        {/* 5. Product Showcases - based strictly on Admin Section Checkmarks */}
        {products.length === 0 ? null : (
          <>
            {/* Featured Products Section - strictly products checked as Featured */}
            {featuredProducts.length > 0 && (
              <FeaturedProducts
                title="Featured Products"
                products={featuredProducts}
                viewAllLink="/products?filter=featured"
              />
            )}

            {/* Trending Collections Section - strictly products checked as Trending */}
            {trendingProducts.length > 0 && (
              <FeaturedProducts
                title="Trending Collections"
                products={trendingProducts}
                viewAllLink="/products?sort=trending"
              />
            )}

            {/* New Arrivals Section - strictly products checked as New Arrival */}
            {newArrivals.length > 0 && (
              <FeaturedProducts
                title="New Arrivals"
                products={newArrivals}
                viewAllLink="/products?sort=newest"
              />
            )}

            {/* Fallback: if no products have any of the 3 section checkmarks, display All Products once under Featured */}
            {featuredProducts.length === 0 && trendingProducts.length === 0 && newArrivals.length === 0 && (
              <FeaturedProducts
                title="Featured Products"
                products={products}
                viewAllLink="/products"
              />
            )}

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
                  viewAllLink={`/category/${getCategorySlug(cat.name, cat.slug)}`}
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
