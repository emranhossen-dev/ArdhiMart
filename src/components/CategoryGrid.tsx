'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/store';
import { getCategorySlug } from '@/lib/slug';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-slide permanently disabled per user preference

  return (
    <section className="py-5 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Shop By Category
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
            Explore curated collections
          </p>
        </div>
      </div>

      {/* COMPACT & ROUNDED CATEGORY SLIDER (AT LEAST 5-6 VISIBLE PER ROW ON MOBILE, NO ARROW BUTTONS) */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex overflow-x-auto gap-2.5 sm:gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar py-2"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${getCategorySlug(cat.name, cat.slug)}`}
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            className="group cursor-pointer shrink-0 snap-start flex flex-col items-center w-[calc(16.66%-0.4rem)] min-w-[62px] sm:min-w-[85px] md:min-w-[105px]"
          >
            {/* ROUNDED CIRCULAR AVATAR ICON */}
            <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800 mb-1.5 border-2 border-transparent group-hover:border-[#FF6B00] shadow-sm transition-all group-hover:scale-108 group-hover:shadow-md flex items-center justify-center p-0.5">
              <img
                src={cat.image || '/images/ardhimart-giftbox-set.webp'}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="font-medium text-[10px] sm:text-[11px] text-gray-800 dark:text-gray-200 group-hover:text-[#FF6B00] transition-colors line-clamp-2 w-full text-center leading-tight break-words">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
