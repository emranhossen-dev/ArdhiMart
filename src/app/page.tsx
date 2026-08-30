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
import { useStore } from '@/context/StoreContext';

export default function Home() {
  const { storeConfig, heroBanner, categories, products } = useStore();

  const newArrivals = products.filter((p) => p.isNew || p.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top Announcement Bar */}
      <AnnouncementBar text={storeConfig.announcementText} />

      {/* Top Navigation Header */}
      <Header siteName={storeConfig.name} />

      <main className="flex-1 w-full pb-6 space-y-2">
        {/* 1. Hero Banner */}
        <HeroSection banner={heroBanner} />

        {/* 2. Trust Badges Bar */}
        <TrustBadgesBar />

        {/* 3. Flash Sale Section (Requirement 16) */}
        <FlashSaleSection />

        {/* 4. Trending Collections Section (Requirement 16) */}
        <FeaturedProducts title="Trending Collections" viewAllLink="/products?sort=trending" />

        {/* 5. New Arrivals Section (Requirement 16) */}
        <FeaturedProducts title="New Arrivals" products={newArrivals.length > 0 ? newArrivals : undefined} viewAllLink="/products?sort=newest" />

        {/* 6. Shop By Category Showcase (Requirement 16) */}
        <CategoryGrid categories={categories} />

        {/* 7. Customer Reviews & Testimonials (Requirement 16) */}
        <TestimonialsSection />
      </main>

      {/* Comprehensive E-Commerce Footer */}
      <Footer />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
}
