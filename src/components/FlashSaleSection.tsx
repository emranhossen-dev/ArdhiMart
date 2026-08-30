'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Flame, Clock, ShoppingCart, ArrowRight } from 'lucide-react';
import { ProductCard, ProductSkeletonCard } from '@/components/ProductCard';

export const FlashSaleSection: React.FC = () => {
  const { products, isLoading } = useStore();

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(17, 0, 0, 0);

      if (now.getTime() >= target.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      const diffMs = target.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.slice(0, 6);

  return (
    <section className="py-5 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Header with Single Line Title, Timer & View All Link */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-gray-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 rounded-lg shrink-0">
            <Flame className="w-5 h-5 fill-red-500 animate-pulse" />
          </div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate whitespace-nowrap">
            Flash Deals
          </h3>

          {/* Timer Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* View All Link */}
        <Link
          href="/products?category=Flash%20Deals"
          className="text-xs font-bold text-[#FF6B00] hover:text-[#e05e00] flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 6 PRODUCTS PER ROW SHOWCASE ON DESKTOP */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProductSkeletonCard key={n} />
          ))}
        </div>
      ) : flashProducts.length === 0 ? (
        <div className="py-8 text-center space-y-1">
          <div className="w-10 h-10 mx-auto rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">No Flash Sale Products</h4>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {flashProducts.map((prod, idx) => (
            <ProductCard
              key={prod.id}
              product={prod}
              showStockBar={true}
              stockSoldPercent={85 - idx * 10}
              stockLeftCount={idx + 2}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FlashSaleSection;
