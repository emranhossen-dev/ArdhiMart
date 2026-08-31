'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { ProductCard, ProductSkeletonCard } from '@/components/ProductCard';

import ProductGridCarousel from '@/components/ProductGridCarousel';

interface FeaturedProductsProps {
  products?: Product[];
  title?: string;
  viewAllLink?: string;
  hideCountLabel?: boolean;
  className?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products: customProducts,
  title = 'Trending Collections',
  viewAllLink = '/products',
  hideCountLabel = false,
  className = '',
}) => {
  const { products: defaultProds, isLoading } = useStore();
  const productsList = customProducts !== undefined ? customProducts : defaultProds;

  if (!isLoading && productsList.length === 0) {
    return null;
  }

  return (
    <section className={`py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none ${className}`}>
      {/* Section Header: Single line title + View All Link on the Right */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-200/80 dark:border-slate-800 pb-2.5">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate whitespace-nowrap">
          {title}
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          {!hideCountLabel && (
            <span className="hidden sm:inline text-xs font-medium text-gray-400">
              ({productsList.length})
            </span>
          )}
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-[#FF6B00] hover:text-[#e05e00] flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-row overflow-x-auto gap-3 sm:gap-4 no-scrollbar">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-[160px] sm:w-[190px] shrink-0">
              <ProductSkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        /* 2-ROW HORIZONTAL AUTO-CAROUSEL WITHOUT ARROW BUTTONS */
        <ProductGridCarousel products={productsList} />
      )}
    </section>
  );
};

export default FeaturedProducts;
