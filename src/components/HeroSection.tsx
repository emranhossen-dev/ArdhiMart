'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/types/store';

interface HeroSectionProps {
  banner?: HeroBanner;
  onCtaClick?: () => void;
}

interface SlideItem {
  badge?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ banner }) => {
  const [dynamicSlides, setDynamicSlides] = useState<SlideItem[]>([]);

  // Fetch live banners directly from PostgreSQL REST API
  useEffect(() => {
    const fetchLiveBanners = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
        const res = await fetch(`${baseUrl}/banners?activeOnly=true`).catch(() =>
          fetch('https://ardhimart-backend.onrender.com/api/v1/banners?activeOnly=true')
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mappedSlides: SlideItem[] = data.map((b: any) => ({
              badge: b.badge || '',
              title: b.title,
              subtitle: b.subtitle || '',
              imageUrl: b.imageUrl || b.image || '/images/ardhimart-smart-pen-holder.webp',
              ctaPrimaryText: b.btn1Text || 'Order Now',
              ctaPrimaryLink: b.btn1Link || b.linkUrl || '/products',
              ctaSecondaryText: b.btn2Text || '',
              ctaSecondaryLink: b.btn2Link || '',
            }));
            setDynamicSlides(mappedSlides);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live banners from database:', err);
      }
    };

    fetchLiveBanners();
    const interval = setInterval(fetchLiveBanners, 12000); // 12s live background re-sync
    return () => clearInterval(interval);
  }, []);

  const defaultSlides: SlideItem[] = [
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

  const slides = dynamicSlides.length > 0 ? dynamicSlides : defaultSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel slider every 4.5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || slides[0];

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
          {/* Badge */}
          {activeSlide.badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wide uppercase bg-amber-500 text-slate-950 shadow-md">
              {activeSlide.badge}
            </span>
          )}

          {/* Headline (Center Aligned) */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md text-center">
            {activeSlide.title}
          </h2>

          {/* Subtitle (Center Aligned) */}
          {activeSlide.subtitle && (
            <p className="text-gray-200 text-sm sm:text-base font-medium line-clamp-2 max-w-lg mx-auto text-center">
              {activeSlide.subtitle}
            </p>
          )}

          {/* Action Buttons (Center Aligned) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
            <Link
              href={activeSlide.ctaPrimaryLink || '/products'}
              className="btn-shimmer w-full sm:w-auto px-6 h-10 bg-[#FF6B00] hover:bg-[#E56000] text-white font-extrabold text-xs sm:text-sm rounded-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {activeSlide.ctaPrimaryText || 'Order Now'}
            </Link>

            {activeSlide.ctaSecondaryText && (
              <Link
                href={activeSlide.ctaSecondaryLink || '/products'}
                className="btn-shimmer w-full sm:w-auto px-6 h-10 bg-[#0F396F] hover:bg-[#164685] text-white font-bold text-xs sm:text-sm rounded-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {activeSlide.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slide Navigation Pagination Dots */}
      {slides.length > 1 && (
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
      )}
    </section>
  );
};

export default HeroSection;
