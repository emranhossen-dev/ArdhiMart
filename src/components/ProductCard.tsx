'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { Heart, Star, ShoppingCart, Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showStockBar?: boolean;
  stockSoldPercent?: number;
  stockLeftCount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showStockBar = false,
  stockSoldPercent = 85,
  stockLeftCount = 3,
}) => {
  const { storeConfig, wishlistIds, toggleWishlist, addToCart, cartItems, updateQuantity } = useStore();
  const isWishlisted = wishlistIds.includes(product.id);
  const cartItem = cartItems.find((item) => item.product.id === product.id);

  // Parse gallery images for product card slider
  const rawGallery = product.galleryImages;
  let parsedGallery: string[] = [];
  if (Array.isArray(rawGallery)) {
    parsedGallery = rawGallery;
  } else if (typeof rawGallery === 'string' && (rawGallery as string).trim()) {
    parsedGallery = (rawGallery as string).split(',').map((s) => s.trim()).filter(Boolean);
  }
  const images = Array.from(new Set([product.image, ...parsedGallery].filter(Boolean)));
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchEndX, setTouchEndX] = useState<number>(0);
  const displayImages = images.length > 1 ? [...images, images[0]] : images;
  const [isResetting, setIsResetting] = useState(false);

  // Auto-slide permanently disabled per user preference

  const handleTouchStart = (e: React.TouchEvent) => {
    if (images.length > 1) {
      e.stopPropagation();
      setTouchStartX(e.targetTouches[0].clientX);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (images.length > 1) {
      e.stopPropagation();
      setTouchEndX(e.targetTouches[0].clientX);
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (images.length > 1) {
      e.stopPropagation();
      if (touchStartX && touchEndX) {
        const distance = touchStartX - touchEndX;
        if (distance > 30) {
          // Swiped Left -> Next image inside this card
          setCurrentImgIndex((prev: number) => (prev < images.length - 1 ? prev + 1 : 0));
        } else if (distance < -30) {
          // Swiped Right -> Previous image inside this card
          setCurrentImgIndex((prev: number) => (prev > 0 ? prev - 1 : images.length - 1));
        }
      }
      setTouchStartX(0);
      setTouchEndX(0);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200/80 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Thumbnail Container - Full Width Edge to Edge */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[4/3] sm:aspect-square bg-gray-50 dark:bg-slate-800 overflow-hidden shrink-0 group/img select-none"
      >
        <Link href={`/products/${product.urlSlug || product.id}`} className="block w-full h-full overflow-hidden">
          <div
            className="w-full h-full flex"
            style={{
              transform: `translateX(-${currentImgIndex * 100}%)`,
              transition: isResetting ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {displayImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.title} - ${(idx % images.length) + 1}`}
                className="w-full h-full object-cover shrink-0 group-hover/img:scale-105 transition-transform duration-500"
              />
            ))}
          </div>
        </Link>

        {/* Swipe Indicators / Dots if Multiple Images Exist (ZERO Arrow Buttons) */}
        {images.length > 1 && (
          <div className="absolute bottom-1.5 left-0 w-full flex justify-center gap-1 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  currentImgIndex === idx ? 'bg-[#FF6B00] w-3' : 'bg-black/30 dark:bg-white/40 w-1'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#FF6B00] text-white font-extrabold text-[9px] uppercase rounded shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Wishlist"
          className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors shadow-xs active:scale-90 cursor-pointer"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Details Body */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/products/${product.urlSlug || product.id}`}>
            <h3 className="font-semibold text-xs text-gray-900 dark:text-white text-justify line-clamp-2 sm:line-clamp-3 hover:underline leading-snug">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-0.5 mb-1 text-amber-500 font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Stock Bar for Flash Deals */}
          {showStockBar && (
            <div className="my-1 space-y-0.5">
              <div className="flex justify-between text-[9px] font-bold text-gray-500">
                <span>Sold: {stockSoldPercent}%</span>
                <span className="text-red-500">Only {stockLeftCount} Left!</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all"
                  style={{ width: `${stockSoldPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Price & Full Width Add to Cart Action (No divider line) */}
        <div className="mt-1 flex flex-col justify-end">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">
              {storeConfig.currency}
              {product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {storeConfig.currency}
                {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {cartItem ? (
            <div className="w-full mt-2 h-8 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-md px-2 py-1 shadow-xs">
              <Link
                href="/cart"
                className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 hover:underline truncate"
                title="View Cart"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{cartItem.quantity} in Cart</span>
              </Link>

              <div className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded px-1.5 py-0.5">
                {cartItem.quantity > 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateQuantity(product.id, -1);
                    }}
                    className="w-4 h-4 flex items-center justify-center text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white cursor-pointer"
                    title="Decrease quantity"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                ) : null}
                <span className="text-[11px] font-black text-gray-900 dark:text-white px-1">
                  {cartItem.quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(product.id, 1);
                  }}
                  className="w-4 h-4 flex items-center justify-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer font-bold"
                  title="Add more"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              aria-label="Add to Cart"
              className="btn-shimmer w-full mt-2 py-1.5 px-2 bg-[#0F396F] hover:bg-[#164685] text-white rounded-md text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductSkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
      <div className="w-full aspect-[4/3] sm:aspect-square bg-gray-200 dark:bg-slate-800" />
      <div className="p-2.5 sm:p-3 space-y-2">
        <div className="h-3.5 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="w-7 h-7 bg-gray-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
