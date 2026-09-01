'use client';

import React, { useRef } from 'react';
import { Product } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';

interface ProductGridCarouselProps {
  products: Product[];
  showStockBar?: boolean;
}

export const ProductGridCarousel: React.FC<ProductGridCarouselProps> = ({
  products,
  showStockBar = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  // Deduplicate products by ID just in case any array contains duplicate references
  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.id, p])).values()
  );

  // If 4 or fewer products, display in a clean, elegant responsive grid (EVERY product appears EXACTLY once)
  if (uniqueProducts.length <= 4) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
        {uniqueProducts.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard
              product={product}
              showStockBar={showStockBar}
            />
          </div>
        ))}
      </div>
    );
  }

  // If more than 4 products, display in a smooth horizontal scrollable row WITHOUT any artificial tripling or duplication!
  return (
    <div
      ref={containerRef}
      className="flex flex-row overflow-x-auto no-scrollbar scroll-smooth gap-3 sm:gap-4 py-1 select-none cursor-grab active:cursor-grabbing w-full"
    >
      {uniqueProducts.map((product) => (
        <div key={product.id} className="w-[160px] sm:w-[190px] md:w-[210px] shrink-0">
          <ProductCard
            product={product}
            showStockBar={showStockBar}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGridCarousel;
