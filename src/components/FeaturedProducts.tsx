'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { ProductCard, ProductSkeletonCard } from '@/components/ProductCard';

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
  const productsList = customProducts || defaultProds;

  return (
    <section className={`py-5 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none ${className}`}>
      {/* Section Header: Single line title + View All Link on the Right (Requirements 4 & 14) */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProductSkeletonCard key={n} />
          ))}
        </div>
      ) : productsList.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">No products found</h4>
        </div>
      ) : (
        /* 6 PRODUCTS PER ROW SHOWCASE ON DESKTOP */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {productsList.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
