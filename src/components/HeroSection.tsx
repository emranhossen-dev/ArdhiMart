'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/types/store';

interface HeroSectionProps {
  banner?: HeroBanner;
  onCtaClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ banner }) => {
  const slides = [
    {
      badge: banner?.badge || 'Smart Tech Collection ⚡',
      title: banner?.title || 'Smart LED Digital Pen Holder',
      subtitle: banner?.subtitle || 'Premium desk organizer with digital clock, alarm & ambient LED light. Elevate your workspace with a modern touch!',
      imageUrl: banner?.imageUrl || '/images/ardhimart-smart-pen-holder.webp',
      ctaPrimaryText: banner?.ctaPrimaryText || 'Order Now',
      ctaPrimaryLink: banner?.ctaPrimaryLink || '/products',
      ctaSecondaryText: banner?.ctaSecondaryText || 'Explore Gadgets',
      ctaSecondaryLink: banner?.ctaSecondaryLink || '/products',
    },
    {
      badge: 'Mega Gift Hampers 🎁',
      title: 'Surprise Gift Box for Your Loved Ones',
      subtitle: 'Make birthdays, anniversaries & special moments unforgettable with our curated luxury gift combos.',
      imageUrl: '/images/ardhimart-giftbox-valentine-set.webp',
      ctaPrimaryText: 'Shop Gift Combos',
      ctaPrimaryLink: '/products',
      ctaSecondaryText: 'Explore Collection',
      ctaSecondaryLink: '/products',
    },
    {
      badge: 'Exclusive Gift Deals 🌟',
      title: 'Unique Gifts & Trending Decor Items',
      subtitle: 'Special discounts on illuminated glass flower domes, cute plush dolls & trending aesthetic home decor!',
      imageUrl: '/images/ardhimart-giftbox-set.webp',
      ctaPrimaryText: 'View Collection',
      ctaPrimaryLink: '/products',
      ctaSecondaryText: 'All Products',
      ctaSecondaryLink: '/products',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel slider every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[calc(100dvh-128px)] sm:h-[calc(100vh-80px)] min-h-[440px] bg-slate-950 overflow-hidden group select-none">
      {/* Slide Images */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-[4000ms] ease-out"
          />
          {/* Subtle Dark Gradient Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-end text-center pb-8 sm:pb-14">
        <div className="max-w-2xl mx-auto space-y-3.5 flex flex-col items-center text-center">
          {/* Headline (Center Aligned) */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md text-center">
            {slides[currentSlide].title}
          </h2>

          {/* Subtitle (Center Aligned) */}
          <p className="text-gray-200 text-sm sm:text-base font-medium line-clamp-2 max-w-lg mx-auto text-center">
            {slides[currentSlide].subtitle}
          </p>

          {/* Action Buttons (Center Aligned) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
            <Link
              href={slides[currentSlide].ctaPrimaryLink}
              className="btn-shimmer w-full sm:w-auto px-6 h-10 bg-[#FF6B00] hover:bg-[#E56000] text-white font-extrabold text-xs sm:text-sm rounded-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {slides[currentSlide].ctaPrimaryText}
            </Link>

            <Link
              href={slides[currentSlide].ctaSecondaryLink}
              className="btn-shimmer w-full sm:w-auto px-6 h-10 bg-[#0F396F] hover:bg-[#164685] text-white font-bold text-xs sm:text-sm rounded-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {slides[currentSlide].ctaSecondaryText}
            </Link>
          </div>
        </div>
      </div>



      {/* Slide Navigation Pagination Dots */}
      <div className="absolute bottom-4 left-0 w-full z-30 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === idx ? 'bg-[#FF6B00] w-8' : 'bg-white/40 hover:bg-white/70 w-2.5'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
