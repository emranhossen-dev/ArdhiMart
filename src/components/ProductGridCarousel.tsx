'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  const [isInteracting, setIsInteracting] = useState(false);

  // Group products into 2-row column pairs: [[P0, P1], [P2, P3], ...]
  // If total products is odd, wrap around to fill the bottom row so NO BLANK CARD appears!
  const baseColumns: Product[][] = [];
  if (products.length > 0) {
    const list = products.length > 1 && products.length % 2 !== 0 ? [...products, products[0]] : products;
    for (let i = 0; i < list.length; i += 2) {
      baseColumns.push(list.slice(i, i + 2));
    }
  }

  // Triple columns for 100% seamless forward-only endless looping
  const displayColumns = baseColumns.length > 1 ? [...baseColumns, ...baseColumns, ...baseColumns] : baseColumns;

  // Time delay step slide (always slides FORWARD to the right, NEVER rewinds backward!)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || baseColumns.length <= 1) return;

    const timer = setInterval(() => {
      if (isInteracting) return;

      const firstCol = container.firstElementChild as HTMLElement;
      const colWidth = firstCol ? firstCol.offsetWidth + 16 : 180;
      const oneSetWidth = container.scrollWidth / 3;

      // If we reach the end of the 2nd set, jump silently back to 1st set without backwards animation
      if (container.scrollLeft >= oneSetWidth * 2) {
        container.scrollLeft = container.scrollLeft - oneSetWidth;
      }

      // Always slide FORWARD to the right
      container.scrollBy({ left: colWidth, behavior: 'smooth' });
    }, 3000);

    return () => clearInterval(timer);
  }, [isInteracting, baseColumns.length]);

  if (baseColumns.length === 0) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
      className="flex flex-row overflow-x-auto no-scrollbar scroll-smooth gap-3 sm:gap-4 py-1 select-none cursor-grab active:cursor-grabbing w-full"
    >
      {displayColumns.map((colPair, cIdx) => (
        <div key={cIdx} className="w-[160px] sm:w-[190px] md:w-[210px] shrink-0 flex flex-col gap-3 sm:gap-4">
          {colPair.map((product, pIdx) => (
            <div key={`${product.id}-${cIdx}-${pIdx}`} className="w-full">
              <ProductCard
                product={product}
                showStockBar={showStockBar}
                stockSoldPercent={showStockBar ? 85 - ((cIdx * 2 + pIdx) % 6) * 10 : undefined}
                stockLeftCount={showStockBar ? ((cIdx * 2 + pIdx) % 6) + 2 : undefined}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductGridCarousel;
