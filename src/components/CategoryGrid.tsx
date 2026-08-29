'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto Slider Left to Right
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Shop By Category
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
            Explore curated collections
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer shadow-xs"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer shadow-xs"
            aria-label="Next categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SINGLE-ROW 5-COLUMN FULL-WIDTH CAROUSEL ON MOBILE & DESKTOP */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex overflow-x-auto gap-3 snap-x snap-mandatory scroll-smooth no-scrollbar py-1"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            className="group cursor-pointer shrink-0 snap-start flex flex-col items-center w-[calc(20%-0.6rem)] min-w-[110px] sm:min-w-[140px] md:min-w-[160px]"
          >
            {/* FULL-WIDTH CRISP IMAGE CARD */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-2 relative border border-gray-200 dark:border-slate-800 shadow-sm transition-all group-hover:shadow-md group-hover:border-indigo-500/50">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
            </div>
            <p className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors truncate w-full text-center">
              {cat.name}
            </p>
            {cat.itemCount && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold truncate">
                {cat.itemCount} Items
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
