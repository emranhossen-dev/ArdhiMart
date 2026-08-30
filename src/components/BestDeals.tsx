"use client";

import React from "react";
import { PRODUCTS_DATA } from "../data/products";
import { ProductCard } from "./ProductCard";
import { useCart } from "../context/CartContext";
import { HiOutlineChevronRight } from "react-icons/hi2";

export const BestDeals: React.FC = () => {
  const { setSelectedCategory } = useCart();

  const deals = PRODUCTS_DATA.filter((p) => p.isBestDeal || p.discountPercent);

  return (
    <section id="best-deals" className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            সেরা ডিলসমূহ (Best Deals)
          </h2>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
            ফ্ল্যাশ সেল
          </span>
        </div>

        <button
          onClick={() => {
            setSelectedCategory("All");
            const catalog = document.getElementById("product-catalog");
            if (catalog) {
              catalog.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="text-blue-500 hover:text-blue-400 font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>সবগুলো দেখুন</span>
          <HiOutlineChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Best Deals Grid - Render 2-col (mobile) / 3-col (sm) / 4-col (md) / 6-col (lg+) ProductCard layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {deals.slice(0, 6).map((product: any) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              title: product.title || product.name || 'Untitled Product',
              price: product.price || 0,
              rating: product.rating || 5.0,
              badge: product.badge || 'Deal',
              image: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
              category: product.category || 'General',
            }}
          />
        ))}
      </div>
    </section>
  );
};
