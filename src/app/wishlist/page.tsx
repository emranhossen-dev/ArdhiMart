'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { useStore } from '@/context/StoreContext';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  PackageX
} from 'lucide-react';
import { notifySuccess } from '@/lib/sweetalert';

export default function WishlistPage() {
  const { products, wishlistIds, toggleWishlist, addToCart, storeConfig } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-28">
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded-lg mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 animate-pulse" />
            ))}
          </div>
        </main>
        <Footer className="hidden md:block" />
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-16">
        {/* Desktop Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-bold">My Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-gray-200/70 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>My Wishlist</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              আপনার পছন্দের পণ্যগুলো এখানে সেভ থাকে। যেকোনো সময় সরাসরি কার্টে যুক্ত করে অর্ডার করতে পারেন।
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:underline self-start sm:self-auto"
            >
              <span>Explore More Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 mx-auto text-rose-500">
              <Heart className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our catalogue and click the heart icon on any product to save it to your personal wishlist for later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Discover Trending Gadgets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Responsive Desktop Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => {
              const discountPercent =
                product.comparePrice && product.comparePrice > product.price
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
                >
                  {/* Top Thumbnail & Badges */}
                  <div className="relative aspect-square w-full bg-gray-100 dark:bg-slate-800/80 overflow-hidden">
                    <Link href={`/products/${product.urlSlug || product.id}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                        -{discountPercent}% OFF
                      </span>
                    )}

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {product.category && (
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          {product.category}
                        </span>
                      )}

                      <Link
                        href={`/products/${product.urlSlug || product.id}`}
                        className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-[#FF6B00] transition-colors line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </Link>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                          {storeConfig.currency}
                          {product.price.toLocaleString()}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                            {storeConfig.currency}
                            {product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button: Add to Cart */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full h-10 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
