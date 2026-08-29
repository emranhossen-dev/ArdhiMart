'use client';

export const runtime = 'edge';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import {
  Heart,
  Share2,
  Star,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Zap,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const {
    products,
    isLoading,
    storeConfig,
    wishlistIds,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
  } = useStore();

  // Find product by id or urlSlug
  const product: Product | undefined = products.find(
    (p) => p.id === productId || p.urlSlug === productId
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>(
    'description'
  );

  // Full-Screen Image Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!product || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-6 w-full aspect-square bg-gray-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            <div className="lg:col-span-6 space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-xl w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-xl w-1/3 animate-pulse" />
              <div className="h-14 bg-gray-200 dark:bg-slate-800 rounded-2xl w-full animate-pulse" />
              <div className="h-14 bg-gray-200 dark:bg-slate-800 rounded-2xl w-full animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    );
  }

  const galleryImages = [
    product.image,
    ...(product.galleryImages && Array.isArray(product.galleryImages) ? product.galleryImages : []),
  ].filter(Boolean);

  // Split comma-separated variants from database if present (product.color)
  const variantOptions = product.color
    ? product.color.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const isWishlisted = wishlistIds.includes(product.id);

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  // Filter Related Products (Same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || (variantOptions[0] ?? ''));
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || (variantOptions[0] ?? ''));
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans select-none">
      {/* Header */}
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-12">
        {/* Breadcrumb Navigation with Category Filter Link */}
        <div className="mb-6 pb-3 border-b border-gray-200/80 dark:border-slate-800">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-[#FF6B00] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${encodeURIComponent(product.category || 'All')}`}
              className="hover:text-[#FF6B00] transition-colors"
            >
              {product.category || 'Products'}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold truncate">{product.title}</span>
          </nav>
        </div>

        {/* 2-Column Responsive Layout (Balanced 6/6 split on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Sticky Product Gallery & Thumbnails Strip */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
            {/* Main Stage Image */}
            <div className="relative w-full aspect-square bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 overflow-hidden group shadow-sm flex items-center justify-center">
              <img
                src={galleryImages[activeImageIndex] || product.image}
                alt={product.title}
                className="w-full h-full object-contain cursor-zoom-in transition-all duration-500 group-hover:scale-105"
                onClick={() => openLightbox(activeImageIndex)}
              />

              {/* Lightbox Zoom Button */}
              <button
                onClick={() => openLightbox(activeImageIndex)}
                className="absolute top-4 right-4 p-3 bg-black/60 dark:bg-white/80 backdrop-blur-md text-white dark:text-black rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="View Fullscreen Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev/Next Chevron Controls */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selector Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-white dark:bg-slate-900 ${
                      activeImageIndex === idx
                        ? 'border-[#FF6B00] scale-105 shadow-md'
                        : 'border-gray-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Ratings, Pricing, Variants & CTAs */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs">
            
            {/* FULL-WIDTH PRODUCT TITLE AT TOP OF CARD */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-snug w-full block">
                {product.title}
              </h1>

              {/* Action Metadata Row below Full-Width Title */}
              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/products?category=${encodeURIComponent(product.category || 'All')}`}
                  className="text-xs font-extrabold text-[#FF6B00] hover:underline uppercase tracking-wider truncate whitespace-nowrap"
                >
                  {product.brand || product.category}
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-red-500 transition-all cursor-pointer shadow-xs active:scale-90"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        if (typeof window !== 'undefined' && navigator.share) {
                          await navigator.share({
                            title: product.title,
                            url: window.location.href,
                          });
                        } else if (typeof window !== 'undefined' && navigator.clipboard) {
                          await navigator.clipboard.writeText(window.location.href);
                          alert('Product link copied to clipboard!');
                        }
                      } catch {}
                    }}
                    aria-label="Share"
                    className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-black dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-90"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ratings & Verified Badge */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${product.reviewsCount ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-700'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate whitespace-nowrap">
                {product.reviewsCount ? `${product.rating.toFixed(1)} (${product.reviewsCount} reviews)` : 'No reviews yet'}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 truncate whitespace-nowrap">
                In Stock
              </span>
            </div>

            {/* Pricing Box & Discount Pill */}
            <div className="flex items-center gap-3 py-3 border-y border-gray-100 dark:border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {storeConfig.currency}
                {product.price.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-base sm:text-lg text-gray-400 line-through font-medium">
                  {storeConfig.currency}
                  {product.comparePrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#FF6B00] text-white font-black text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs truncate whitespace-nowrap">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Single Dynamic Variant Selector */}
            {variantOptions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
                  Select Option:{' '}
                  <span className="text-[#FF6B00] font-bold">
                    {selectedColor || variantOptions[0]}
                  </span>
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {variantOptions.map((opt) => {
                    const isSelected = (selectedColor || variantOptions[0]) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedColor(opt)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md scale-105'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-[#FF6B00]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded-2xl p-1 bg-gray-50 dark:bg-slate-950 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-xl text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 rounded-xl text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SIDE-BY-SIDE ADD TO CART & BUY NOW BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="btn-shimmer w-full py-3.5 px-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate whitespace-nowrap">Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-shimmer w-full py-3.5 px-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="truncate whitespace-nowrap">Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <section className="mt-8 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="flex border-b border-gray-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer truncate whitespace-nowrap ${
                activeTab === 'description'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white font-extrabold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab('specifications')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer truncate whitespace-nowrap ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white font-extrabold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Specifications
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer truncate whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-black dark:border-white text-black dark:text-white font-extrabold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Reviews ({product.reviewsCount || 0})
            </button>
          </div>

          <div className="p-4 text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-3">
                {product.shortDescription && (
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {product.shortDescription}
                  </p>
                )}
                <p className="whitespace-pre-line">
                  {product.description || 'পণ্যটির বিস্তারিত তথ্য শীঘ্রই সংযুক্ত করা হবে।'}
                </p>
                {product.usability && (
                  <div className="p-3.5 bg-orange-50/60 dark:bg-slate-950 rounded-2xl border border-orange-200/50 dark:border-slate-800 text-xs space-y-1">
                    <strong className="text-gray-900 dark:text-white block font-bold text-sm">
                      ব্যবহারবিধি ও যত্ন (Usability & Care Instructions):
                    </strong>
                    <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                      {product.usability}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <ul className="space-y-2">
                {product.material && (
                  <li className="flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="font-semibold text-gray-900 dark:text-white">Material</span>
                    <span>{product.material}</span>
                  </li>
                )}
                {product.warranty && (
                  <li className="flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="font-semibold text-gray-900 dark:text-white">Warranty</span>
                    <span>{product.warranty}</span>
                  </li>
                )}
                <li className="flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-800">
                  <span className="font-semibold text-gray-900 dark:text-white">Inside Dhaka Delivery Fee</span>
                  <span>৳{product.deliveryInsideDhaka || 80}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-gray-100 dark:border-slate-800">
                  <span className="font-semibold text-gray-900 dark:text-white">Outside Dhaka Delivery Fee</span>
                  <span>৳{product.deliveryOutsideDhaka || 120}</span>
                </li>
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="py-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  এখনও কোনো কাস্টমার রিভিউ পোস্ট করা হয়নি (No reviews yet).
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Trust Badges Bar */}
        <section className="px-4 py-6 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-slate-800 space-y-3 mt-6 rounded-3xl">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              Inside Dhaka: ৳{product.deliveryInsideDhaka || 80} | Outside Dhaka: ৳{product.deliveryOutsideDhaka || 120}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              7-Day Replacement Guarantee
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-500 text-[#FF6B00]" />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              Cash on Delivery Available & Encrypted Checkout
            </span>
          </div>
        </section>

        {/* Related Products Showcase */}
        <div className="mt-6 border-t border-gray-200 dark:border-slate-800">
          <FeaturedProducts title="You May Also Like" products={relatedProducts} />
        </div>
      </main>

      {/* Mobile-Only Fixed Bottom Bar (Hidden on Desktop 'sm:hidden') */}
      <div className="sm:hidden fixed bottom-16 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 px-4 py-3 flex gap-3 z-30 shadow-2xl">
        <button
          onClick={handleAddToCart}
          className="btn-shimmer flex-1 border border-gray-300 dark:border-slate-700 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span className="truncate whitespace-nowrap">Add to Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="btn-shimmer flex-[1.5] bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#e05e00] transition-colors active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span className="truncate whitespace-nowrap">Buy Now</span>
        </button>
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in">
          {/* Top Bar */}
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Image {lightboxIndex + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Full Screen Image View */}
          <div className="relative flex-1 flex items-center justify-center py-4">
            <img
              src={galleryImages[lightboxIndex] || product.image}
              alt={`${product.title} full view`}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all"
            />

            {/* Prev/Next Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                  }
                  className="absolute left-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex justify-center gap-3 py-2 overflow-x-auto">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  lightboxIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comprehensive Footer */}
      <Footer />

      {/* Bottom Nav */}
      <BottomNavBar />
    </div>
  );
}
