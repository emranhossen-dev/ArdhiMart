'use client';

import React from 'react';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart } from 'lucide-react';
import { ProductCard, ProductSkeletonCard } from '@/components/ProductCard';

interface FeaturedProductsProps {
  products?: Product[];
  title?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products: customProducts,
  title = 'Trending Collections',
}) => {
  const { products: defaultProds, isLoading } = useStore();
  const productsList = customProducts || defaultProds;

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200/80 dark:border-slate-800 pb-3">
        <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <span className="text-xs font-bold text-gray-500">
          {productsList.length} Items Available
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <ProductSkeletonCard key={n} />
          ))}
        </div>
      ) : productsList.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">No products found in store</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Use Admin Panel to publish products to Neon PostgreSQL database.
          </p>
        </div>
      ) : (
        /* STANDARD 2-COL MOBILE, 3-COL TABLET, 4-COL DESKTOP, 5-COL LARGE GRID */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {productsList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
