'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { useStore } from '@/context/StoreContext';
import { getCategorySlug } from '@/lib/slug';
import {
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
} from 'lucide-react';

import { ProductCard, ProductSkeletonCard } from '@/components/ProductCard';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQueryParam = searchParams.get('search');
  const sortParam = searchParams.get('sort');
  const filterParam = searchParams.get('filter');

  const {
    products,
    isLoading,
    storeConfig,
    categories,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // If someone enters via /products?category=..., redirect to clean /category/[slug] URL
  useEffect(() => {
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      const slug = getCategorySlug(categoryParam);
      router.replace(`/category/${slug}`);
    }
  }, [categoryParam, router]);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((prod) => {
      const matchCategory =
        selectedCategory === 'All' ||
        prod.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchPrice = prod.price <= maxPrice;
      const matchSearch = searchQueryParam
        ? prod.title.toLowerCase().includes(searchQueryParam.toLowerCase()) ||
          prod.category.toLowerCase().includes(searchQueryParam.toLowerCase()) ||
          (prod.brand && prod.brand.toLowerCase().includes(searchQueryParam.toLowerCase())) ||
          (prod.description && prod.description.toLowerCase().includes(searchQueryParam.toLowerCase()))
        : true;
      const matchSectionFilter =
        filterParam === 'featured'
          ? prod.isFeatured === true
          : sortParam === 'trending'
          ? prod.isTrending === true
          : sortParam === 'newest'
          ? prod.isNew === true
          : true;
      return matchCategory && matchPrice && matchSearch && matchSectionFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 dark:text-white font-semibold">
          {searchQueryParam
            ? `Search: "${searchQueryParam}"`
            : selectedCategory !== 'All'
            ? selectedCategory
            : 'All Products'}
        </span>
      </nav>

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {searchQueryParam
            ? `Results for "${searchQueryParam}"`
            : selectedCategory !== 'All'
            ? `${selectedCategory} Collection`
            : 'All Products & Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
        <Link
          href="/products"
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory.toLowerCase() === 'all'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const catSlug = getCategorySlug(cat.name, cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/category/${catSlug}`}
              className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Sticky Filter & Sort Control Bar */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-y border-gray-200/80 dark:border-slate-800 -mx-4 px-4 py-2.5 flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter {selectedCategory !== 'All' ? `(${selectedCategory})` : ''}
        </button>

        <button
          onClick={() =>
            setSortBy((prev) =>
              prev === 'featured'
                ? 'price-low'
                : prev === 'price-low'
                ? 'price-high'
                : prev === 'price-high'
                ? 'rating'
                : 'featured'
            )
          }
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort ({sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Low → High' : sortBy === 'price-high' ? 'High → Low' : 'Top Rated'})
        </button>
      </div>

      {/* Products Grid or Skeleton Loading Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProductSkeletonCard key={n} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-gray-500 text-sm font-semibold">No products found matching filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setMaxPrice(20000);
              setSortBy('featured');
            }}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Bottom Sheet Filter Modal / Drawer (Slides Up From Bottom) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center">
          {/* Backdrop */}
          <div
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Bottom Sheet Content Drawer */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col justify-between p-6 space-y-5 z-10 overflow-y-auto border-t border-gray-200 dark:border-slate-800 transition-transform duration-300">
            {/* Top Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto mb-1 shrink-0" />

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#FF6B00]" /> Filter Products
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full cursor-pointer bg-gray-100 dark:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Select Category
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                  <Link
                    href="/products"
                    onClick={() => setIsFilterOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer border bg-gray-50 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6B00]"
                  >
                    <span>All Products</span>
                  </Link>
                  {categories.map((cat) => {
                    const catSlug = getCategorySlug(cat.name, cat.slug);
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${catSlug}`}
                        onClick={() => setIsFilterOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer border bg-gray-50 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6B00]"
                      >
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Max Price Filter Slider */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="uppercase text-gray-400">Max Price</span>
                  <span className="text-gray-900 dark:text-white">
                    {storeConfig.currency}
                    {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#FF6B00] cursor-pointer"
                />
              </div>

              {/* Sort By Selection */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Apply & Reset Action Buttons */}
            <div className="pt-3 border-t border-gray-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMaxPrice(20000);
                  setSortBy('featured');
                }}
                className="flex-1 py-3.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-2xl cursor-pointer hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-xs rounded-2xl cursor-pointer shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AllProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />
      <Suspense fallback={
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/4 mx-auto" />
          </div>
        </main>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
