'use client';

export const runtime = 'edge';

import React, { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import FeaturedProducts from '@/components/FeaturedProducts';
import EyesLoader from '@/components/EyesLoader';
import { Product } from '@/types/store';
import { useStore, mapApiProduct } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { notifySuccess, notifyInfo } from '@/lib/sweetalert';
import { getCategorySlug } from '@/lib/slug';
import * as fpixel from '@/lib/fpixel';
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
  MessageCircle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Check,
} from 'lucide-react';

const DIVERSE_REVIEWS_POOL = [
  {
    userName: 'তানভীর আহমেদ',
    rating: 5,
    comment: 'প্রডাক্টটি একদম ছবির মতোই পেয়েছি। প্যাকেজিং ও ফিনিশিং প্রিমিয়াম ছিল। ধন্যবাদ আরধিমার্ট!',
    date: '২ সেপ্টেম্বর, ২০২৬',
  },
  {
    userName: 'নুসরাত জাহান',
    rating: 5,
    comment: 'অসাধারণ একটা জিনিস! ছবিতে যেমন দেখেছি বাস্তবেও ঠিক তেমনই পেয়েছি। ডেলিভারিও দ্রুত পেয়েছি।',
    date: '৩১ আগস্ট, ২০২৬',
  },
  {
    userName: 'আব্দুল্লাহ আল মামুন',
    rating: 5,
    comment: 'প্রডাক্টটি হাতে পেয়েছি। কোয়ালিটি অনেক ভালো এবং ফাস্ট ডেলিভারি পেয়েছি। ধন্যবাদ!',
    date: '২৮ আগস্ট, ২০২৬',
  },
  {
    userName: 'মেহেদী হাসান',
    rating: 5,
    comment: 'অর্ডার করার পরদিনই ডেলিভারি পেয়েছি। প্রোডাক্টের বিল্ড কোয়ালিটি যথেষ্ট প্রিমিয়াম এবং টেকসই।',
    date: '২৬ আগস্ট, ২০২৬',
  },
  {
    userName: 'সাদিয়া রহমান',
    rating: 5,
    comment: 'অরিজিনাল প্রোডাক্ট দেওয়ার জন্য ধন্যবাদ। ডেলিভারি ম্যানের ব্যবহারও খুব অমায়িক ছিল। ১০০% রেকমেন্ডেড!',
    date: '২৪ আগস্ট, ২০২৬',
  },
  {
    userName: 'রাফিকুল ইসলাম',
    rating: 5,
    comment: 'দাম অনুযায়ী কোয়ালিটি চমৎকার। ক্যাশ অন ডেলিভারিতে চেক করে রিসিভ করতে পেরেছি।',
    date: '২১ আগস্ট, ২০২৬',
  },
  {
    userName: 'ফারহানা ইয়াসমিন',
    rating: 5,
    comment: 'খুবই সুন্দর ও কাজের একটা প্রোডাক্ট। গিফট হিসেবে দিয়েছিলাম, সে খুব পছন্দ করেছে!',
    date: '১৮ আগস্ট, ২০২৬',
  },
  {
    userName: 'আরিফুল হক',
    rating: 5,
    comment: '১০০% অরিজিনাল প্রডাক্ট। সাপোর্ট টিমও অনেক হেল্পফুল ছিল। সামনে আরও অর্ডার করবো।',
    date: '১৫ আগস্ট, ২০২৬',
  },
];

interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

const getInitialReviews = (productId?: string): ReviewItem[] => {
  if (!productId) {
    return [
      { ...DIVERSE_REVIEWS_POOL[0], id: 'rev-default-1' },
      { ...DIVERSE_REVIEWS_POOL[1], id: 'rev-default-2' },
    ];
  }
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash << 5) - hash + productId.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const idx1 = positiveHash % DIVERSE_REVIEWS_POOL.length;
  const idx2 = (positiveHash + 3) % DIVERSE_REVIEWS_POOL.length;

  return [
    { ...DIVERSE_REVIEWS_POOL[idx1], id: `rev-${productId}-1` },
    { ...DIVERSE_REVIEWS_POOL[idx2], id: `rev-${productId}-2` },
  ];
};

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || '';
  const productId = decodeURIComponent(rawId).trim();

  const {
    products,
    isLoading: isStoreLoading,
    storeConfig,
    wishlistIds,
    toggleWishlist,
    addToCart,
    cartItems,
    updateQuantity,
    setIsCartOpen,
  } = useStore();

  const { user: currentUser } = useAuth();

  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [isDirectLoading, setIsDirectLoading] = useState<boolean>(false);
  const [directFetchFailed, setDirectFetchFailed] = useState<boolean>(false);

  const [userOrders, setUserOrders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ardhimart_user_orders');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // 1. Fast match from store context first (case-insensitive and title-slug fallback)
  const contextProduct = useMemo(() => {
    if (!productId || products.length === 0) return undefined;
    const cleanId = productId.toLowerCase();
    return products.find((p) => {
      const pId = String(p.id || '').toLowerCase().trim();
      const pSlug = String(p.urlSlug || (p as any).slug || '').toLowerCase().trim();
      const pTitleSlug = p.title
        ? p.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
        : '';
      return pId === cleanId || pSlug === cleanId || pTitleSlug === cleanId;
    });
  }, [products, productId]);

  // 2. If not yet in context (direct URL visit or cold start), fetch directly from API
  useEffect(() => {
    if (contextProduct) {
      setDirectProduct(contextProduct);
      return;
    }

    if (!productId) return;

    let isMounted = true;
    setIsDirectLoading(true);

    const fetchDirectProduct = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
        
        // Attempt A: Direct single item endpoint by slug/id
        const res = await fetch(`${baseUrl}/products/${encodeURIComponent(productId)}`);
        if (res.ok) {
          const item = await res.json();
          if (item && item.id && isMounted) {
            setDirectProduct(mapApiProduct(item));
            setIsDirectLoading(false);
            return;
          }
        }

        // Attempt B: In case slug is not indexed on single endpoint, search full list
        const listRes = await fetch(`${baseUrl}/products`);
        if (listRes.ok) {
          const allItems = await listRes.json();
          if (Array.isArray(allItems) && isMounted) {
            const cleanId = productId.toLowerCase();
            const found = allItems.find((p: any) => {
              const pId = String(p.id || '').toLowerCase().trim();
              const pSlug = String(p.urlSlug || p.slug || '').toLowerCase().trim();
              const pTitle = p.title ? p.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '';
              return pId === cleanId || pSlug === cleanId || pTitle === cleanId;
            });
            if (found) {
              setDirectProduct(mapApiProduct(found));
              setIsDirectLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Direct product fetch error:', err);
      }

      if (isMounted) {
        setIsDirectLoading(false);
        setDirectFetchFailed(true);
      }
    };

    fetchDirectProduct();

    return () => {
      isMounted = false;
    };
  }, [contextProduct, productId]);

  const product = contextProduct || directProduct;
  const cartItem = product ? cartItems.find((item) => item.product.id === product.id) : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Meta Pixel ViewContent event
  useEffect(() => {
    if (product) {
      fpixel.event('ViewContent', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'BDT',
      });
    }
  }, [product?.id]);

  // Real-Time Touch Drag & Swipe Transform State
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.targetTouches[0].clientX;
    const deltaX = currentX - startX;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -45) {
      // Swiped Left -> Next Image
      setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
    } else if (dragOffset > 45) {
      // Swiped Right -> Previous Image
      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  // Interactive Mouse Hover Zoom Lens State
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomOrigin({ x, y });
  };

  // Full-Screen Image Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reviews State initialized dynamically per product ID
  const [reviewsList, setReviewsList] = useState<
    Array<{
      id: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      image?: string;
    }>
  >(() => getInitialReviews(productId));

  useEffect(() => {
    if (productId) {
      setReviewsList(getInitialReviews(productId));
    }
  }, [productId]);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewImage, setNewReviewImage] = useState('');

  const isPageLoading = (!product && (isStoreLoading || isDirectLoading)) && !directFetchFailed;

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-48 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded w-full" />
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Product Not Found</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            The product you are looking for is currently unavailable or may have been removed.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors"
          >
            Browse All Products
          </Link>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    );
  }

  const rawGallery = product.galleryImages;
  let parsedGallery: string[] = [];

  if (Array.isArray(rawGallery)) {
    parsedGallery = rawGallery;
  } else if (typeof rawGallery === 'string' && (rawGallery as string).trim()) {
    parsedGallery = (rawGallery as string).split(',').map((s) => s.trim()).filter(Boolean);
  }

  const galleryImages = Array.from(
    new Set([product.image, ...parsedGallery].filter(Boolean))
  );

  const displayGalleryImages = galleryImages.length > 1 ? [...galleryImages, galleryImages[0]] : galleryImages;
  const [isResetting, setIsResetting] = useState(false);

  // Auto-slide permanently disabled per user preference

  const variantOptions = product.color
    ? product.color.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const isWishlisted = wishlistIds.includes(product.id);

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || (variantOptions[0] ?? ''));
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || (variantOptions[0] ?? ''), { showModal: false });
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewReviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Check if current logged-in user has purchased this product
  const hasPurchased = currentUser && userOrders.some((order: any) =>
    order.items?.some((item: any) => item.product?.id === product.id || item.productId === product.id)
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Requirement 13: Unauthenticated user -> Redirect to login page and return after login
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
      return;
    }

    // Check purchase history
    if (!hasPurchased && userOrders.length > 0) {
      notifyInfo('শুধুমাত্র ক্রয়কৃত কাস্টমারগণ রিভিউ দিতে পারবেন।');
      return;
    }

    if (!newComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      image: newReviewImage || undefined,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setNewComment('');
    setNewReviewImage('');
    setNewRating(5);
    notifySuccess('রিভিউ জমা হয়েছে!', 'আপনার মতামতের জন্য ধন্যবাদ।');
  };

  const featuresList = product.features && product.features.length > 0 ? product.features : [
    '১০০% প্রিমিয়াম ও অরিজিনাল কোয়ালিটি গ্যারান্টি।',
    'দীর্ঘস্থায়ী ও অত্যন্ত টেকসই উপাদান।',
    'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা।',
    '৭ দিনের সহজ রিটার্ন ও রিপ্লেসমেন্ট সুবিধা।',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans select-none">
      {/* Header */}
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 pb-24 lg:pb-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 pb-2 border-b border-gray-200/80 dark:border-slate-800">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-[#FF6B00] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={product.category ? `/category/${getCategorySlug(product.category)}` : '/products'}
              className="hover:text-[#FF6B00] transition-colors"
            >
              {product.category || 'Products'}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold truncate">{product.title}</span>
          </nav>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Product Gallery Slider */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-square bg-gray-50 dark:bg-slate-900 rounded-md border border-gray-200/80 dark:border-slate-800 overflow-hidden group shadow-xs touch-pan-y"
            >
              {/* Native 1-Way Infinite Track: Always Slides Left, Never Reverses */}
              <div
                className="w-full h-full flex"
                style={{
                  transform: `translateX(calc(-${activeImageIndex * 100}% + ${dragOffset}px))`,
                  transition: isResetting || isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {displayGalleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full shrink-0 flex items-center justify-center overflow-hidden cursor-zoom-in group/zoom"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onClick={() => openLightbox(idx % galleryImages.length)}
                  >
                    <img
                      src={img}
                      alt={`${product.title} - view ${(idx % galleryImages.length) + 1}`}
                      className="w-full h-full object-contain select-none transition-transform duration-300 group-hover/zoom:scale-175"
                      style={{
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => openLightbox(activeImageIndex)}
                className="absolute top-3 right-3 p-2 bg-black/60 dark:bg-white/80 backdrop-blur-md text-white dark:text-black rounded-md shadow hover:scale-105 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="View Fullscreen Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-md backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-md backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selector Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-white dark:bg-slate-900 ${
                      activeImageIndex === idx
                        ? 'border-[#FF6B00] scale-102 shadow-xs'
                        : 'border-gray-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Pricing, Variants & CTAs */}
          <div className="lg:col-span-6 space-y-4 py-1">
            
            {/* Title */}
            <div className="space-y-1.5">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-normal w-full text-left sm:text-justify block tracking-normal">
                {product.title}
              </h1>

              <div className="flex items-center justify-between pt-0.5">
                <Link
                  href={product.category ? `/category/${getCategorySlug(product.category)}` : '/products'}
                  className="text-xs font-bold text-[#FF6B00] hover:underline uppercase tracking-wider truncate whitespace-nowrap"
                >
                  {product.brand || product.category}
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="p-2 rounded-md bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 hover:text-red-500 transition-all cursor-pointer shadow-xs active:scale-90"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        if (typeof window !== 'undefined' && navigator.clipboard) {
                          await navigator.clipboard.writeText(window.location.href);
                          notifySuccess('Link Copied!', 'Product link copied to clipboard.');
                        }
                      } catch {}
                    }}
                    aria-label="Share"
                    className="p-2 rounded-md bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 hover:text-black dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-90"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Short Description for Desktop Only (Hidden on Mobile) */}
              {product.shortDescription && (
                <p className="hidden lg:block text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify border-t border-gray-100 dark:border-slate-800/80 pt-2 mt-1">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Ratings & Stock Row (Single language title - Requirement 11) */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                ({reviewsList.length + (product.reviewsCount || 0)} Reviews)
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                In Stock
              </span>
            </div>

            {/* Pricing Box & Discount Pill */}
            <div className="flex items-center gap-3 py-2 border-y border-gray-200/80 dark:border-slate-800">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                {storeConfig.currency}
                {product.price.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                  {storeConfig.currency}
                  {product.comparePrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#FF6B00] text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Dynamic Variant Options Selector */}
            {variantOptions.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  Select Option:{' '}
                  <span className="text-[#FF6B00] font-bold">
                    {selectedColor || variantOptions[0]}
                  </span>
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {variantOptions.map((opt) => {
                    const isSelected = (selectedColor || variantOptions[0]) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedColor(opt)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-[#FF6B00]'
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded-md p-0.5 bg-gray-50 dark:bg-slate-900 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 rounded text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-xs text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 rounded text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3 CTA BUTTONS TOTAL: ADD TO CART, BUY NOW, ORDER ON WHATSAPP (Requirement 9) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {cartItem ? (
                <div className="w-full h-11 flex items-center justify-between border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-md px-2.5 py-1.5 shadow-xs">
                  <Link
                    href="/cart"
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline truncate"
                    title="View Cart"
                  >
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{cartItem.quantity} in Cart</span>
                  </Link>

                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded px-2 py-1">
                    {cartItem.quantity > 1 ? (
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-4 h-4 flex items-center justify-center text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    ) : null}
                    <span className="text-xs font-black text-gray-900 dark:text-white px-1">
                      {cartItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-4 h-4 flex items-center justify-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer font-bold"
                      title="Add more"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="btn-shimmer w-full py-2.5 px-2 border-2 border-[#0F396F] text-[#0F396F] hover:bg-[#0F396F] hover:text-white dark:border-white dark:text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate whitespace-nowrap">Add to Cart</span>
                </button>
              )}

              <button
                onClick={handleBuyNow}
                className="btn-shimmer w-full py-2.5 px-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="truncate whitespace-nowrap">Buy Now</span>
              </button>
            </div>

            {/* THIRD CTA BUTTON: ORDER ON WHATSAPP WITH SLIDING SHIMMER ANIMATION */}
            <div className="pt-0.5">
              <a
                href={`https://wa.me/${(storeConfig?.phone || '01895627138').replace(/^0/, '880').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello, I would like to order "${product.title}".\nPrice: ৳${product.price}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-shimmer w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-md transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-white" />
                <span className="truncate whitespace-nowrap">ORDER ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>

        {/* STACKED CONTENT SECTIONS */}
        <div className="mt-6 space-y-6">
          
          {/* Section 1: Product Description */}
          <section className="border-b border-gray-200/80 dark:border-slate-800 pb-5 space-y-2.5">
            <div className="flex items-center gap-2 pb-1">
              <FileText className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Product Details
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2 text-justify">
              {product.shortDescription && (
                <p className="font-semibold text-gray-900 dark:text-white text-justify">
                  {product.shortDescription}
                </p>
              )}
              <p className="whitespace-pre-line leading-relaxed text-justify">
                {product.description || 'পণ্যটির বিস্তারিত বিবরণ এবং প্রস্তুত প্রণালী বাংলা ভাষায় সুন্দরভাবে উপস্থাপিত।'}
              </p>
            </div>
          </section>

          {/* Section 2: Key Features */}
          <section className="border-b border-gray-200/80 dark:border-slate-800 pb-5 space-y-2.5">
            <div className="flex items-center gap-2 pb-1">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Key Features
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {featuresList.map((feat: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug text-justify">{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: How to Use & Care Instructions */}
          <section className="border-b border-gray-200/80 dark:border-slate-800 pb-5 space-y-2.5">
            <div className="flex items-center gap-2 pb-1">
              <HelpCircle className="w-4 h-4 text-cyan-500" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                How to Use & Care Instructions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-normal text-justify">
              {product.usability || `১. ব্যবহারের পূর্বে প্যাকেটের ইউজার নির্দেশিকা সতর্কতার সাথে পড়ুন।
২. পানি, আর্দ্রতা এবং অতিরিক্ত উত্তাপ থেকে পণ্যটিকে দূরে সংরক্ষণ করুন।
৩. সঠিক ও নিয়মিত যত্নের মাধ্যমে পণ্যটির স্থায়িত্ব দীর্ঘমেয়াদী বজায় রাখুন।`}
            </p>
          </section>

          {/* Section 4: Customer Reviews (Single language title, clean 1-line reviewer info - Requirements 11 & 12) */}
          <section className="space-y-4 pb-4">
            <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Customer Reviews
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                {reviewsList.length} {reviewsList.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* List of Customer Reviews (1-line reviewer title - Requirement 12) */}
            {reviewsList.length > 0 ? (
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="py-2.5 border-b border-gray-100 dark:border-slate-800/60 space-y-1">
                    {/* Reviewer Name and Rating on Single Line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-gray-900 dark:text-white">{rev.userName}</span>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                    {/* Multi-line Review Comment */}
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">{rev.comment}</p>
                    {rev.image && (
                      <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 dark:border-slate-800 mt-1">
                        <img src={rev.image} alt="Review Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center space-y-1 text-xs text-gray-500">
                <p>No customer reviews yet. Be the first to review!</p>
              </div>
            )}

            {/* Submit Review Form (Clean Header, Input Box, Image, Submit - Requirement 13) */}
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                Submit Your Review
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Rating:
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400 hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Your Review:
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Write your review here..."
                    className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Attach Image (Optional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReviewImageUpload}
                    className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#FF6B00]/10 file:text-[#FF6B00] hover:file:bg-[#FF6B00]/20 cursor-pointer"
                  />
                  {newReviewImage && (
                    <div className="mt-1.5 w-14 h-14 rounded-md overflow-hidden border border-gray-200">
                      <img src={newReviewImage} alt="Review attachment" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-md transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </section>
        </div>

        {/* Trust Badges Bar */}
        <section className="px-4 py-4 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-slate-800 space-y-2 mt-4 rounded-md">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
              Inside Dhaka: ৳{product.deliveryInsideDhaka || 80} | Outside Dhaka: ৳{product.deliveryOutsideDhaka || 120}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
              7-Day Replacement Guarantee
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
              Cash on Delivery Available & Encrypted Checkout
            </span>
          </div>
        </section>

        {/* Related Products Showcase (Requirement 3: Unified Padding Matched with Top Section) */}
        <div className="mt-6 border-t border-gray-200 dark:border-slate-800 pt-4">
          <FeaturedProducts title="You May Also Like" products={relatedProducts} hideCountLabel={true} className="!px-0 !max-w-none" />
        </div>
      </main>

      {/* Mobile-Only Fixed Bottom Bar (2 CTA Buttons: Add to Cart & Buy Now) */}
      <div className="sm:hidden fixed bottom-16 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 px-3 py-2.5 flex gap-2 z-30 shadow-2xl">
        {cartItem ? (
          <div className="flex-1 h-10 flex items-center justify-between border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-2 shadow-xs">
            <Link
              href="/cart"
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline truncate"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{cartItem.quantity} in Cart</span>
            </Link>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded px-1.5 py-0.5">
              {cartItem.quantity > 1 ? (
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-4 h-4 flex items-center justify-center text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
              ) : null}
              <span className="text-[11px] font-black text-gray-900 dark:text-white px-1">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, 1)}
                className="w-4 h-4 flex items-center justify-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer font-bold"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="btn-shimmer flex-1 border border-[#0F396F] dark:border-blue-400 text-[#0F396F] dark:text-blue-400 py-2.5 rounded-lg font-extrabold text-xs uppercase text-center bg-white dark:bg-slate-900 active:scale-95 cursor-pointer truncate shadow-xs"
          >
            Add to Cart
          </button>
        )}

        <button
          onClick={handleBuyNow}
          className="btn-shimmer flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white py-2.5 rounded-lg font-extrabold text-xs uppercase text-center active:scale-95 cursor-pointer truncate shadow-md shadow-orange-500/20"
        >
          Buy Now
        </button>
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in">
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Image {lightboxIndex + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center py-4">
            <img
              src={galleryImages[lightboxIndex] || product.image}
              alt={`${product.title} full view`}
              className="max-h-[80vh] max-w-full object-contain rounded-md shadow-2xl transition-all"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                  }
                  className="absolute left-2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 py-2 overflow-x-auto">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  lightboxIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
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
