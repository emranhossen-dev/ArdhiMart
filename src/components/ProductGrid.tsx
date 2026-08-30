"use client";

import React, { useState } from "react";
import { PRODUCTS_DATA } from "../data/products";
import { ProductCard } from "./ProductCard";
import { useCart } from "../context/CartContext";
import { HiOutlineAdjustmentsHorizontal, HiOutlineArchiveBoxXMark } from "react-icons/hi2";

export const ProductGrid: React.FC = () => {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, wishlist } =
    useCart();
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high" | "rating">("featured");

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    // Category Filter
    if (selectedCategory === "Wishlist") {
      if (!wishlist.includes(product.id)) return false;
    } else if (selectedCategory !== "All") {
      if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(q);
      const catMatch = product.category.toLowerCase().includes(q);
      const brandMatch = product.brand.toLowerCase().includes(q);
      if (!nameMatch && !catMatch && !brandMatch) return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="product-catalog" className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {selectedCategory === "Wishlist"
                ? "সেভ করা প্রডাক্টস (Wishlist)"
                : selectedCategory === "All"
                ? "সকল পণ্যসমূহ (All Products)"
                : selectedCategory}
            </h2>
            <span className="text-xs bg-zinc-800 text-zinc-400 font-semibold px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} টি আইটেম
            </span>
          </div>
          {searchQuery && (
            <p className="text-xs text-zinc-400 mt-1">
              ফিল্টার ফলাফল &ldquo;<span className="text-blue-400 font-semibold">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <HiOutlineAdjustmentsHorizontal className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline font-semibold">সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-zinc-900">ফিচার্ড (Featured)</option>
              <option value="low" className="bg-zinc-900">দাম: কম থেকে বেশি</option>
              <option value="high" className="bg-zinc-900">দাম: বেশি থেকে কম</option>
              <option value="rating" className="bg-zinc-900">সর্বোচ্চ রেটিং</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Product Cards - Identical 2-col (mobile) / 3-col (sm) / 4-col (md+) layout */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                title: product.title || product.name || 'Untitled Product',
                price: product.price || 0,
                rating: product.rating || 5.0,
                badge: product.badge || 'New',
                image: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                category: product.category || 'General',
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center flex flex-col items-center justify-center bg-zinc-900/50 rounded-3xl border border-zinc-800/80 my-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-500 mb-4">
            <HiOutlineArchiveBoxXMark className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">কোনো পণ্য পাওয়া যায়নি</h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mb-5">
            আপনার অনুসন্ধানের সাথে মেলে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </section>
  );
};
