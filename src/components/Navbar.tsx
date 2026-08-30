"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiXMark,
} from "react-icons/hi2";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    totalItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoriesList = [
    "All",
    "Electronics",
    "Accessories",
    "Smartwatch",
    "Audio",
    "Home",
    "Lifestyle",
    "Fashion",
  ];

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setMobileMenuOpen(false);
    if (cat === "All") {
      router.push("/products");
    } else {
      router.push(`/products?category=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 text-gray-900 dark:text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: 1. Hamburger Icon (lg:hidden) + 2. Logo + 3. Brand Name */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-800 dark:text-gray-100 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors cursor-pointer shrink-0 group flex flex-col justify-center gap-1.5 items-start"
            aria-label="Open Menu"
          >
            {mobileMenuOpen ? (
              <HiXMark className="w-6 h-6 text-gray-800 dark:text-gray-100" />
            ) : (
              <>
                <span className="w-6 h-0.5 bg-current rounded-full transition-all group-hover:w-6 group-hover:bg-[#FF6B00]" />
                <span className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:w-6 group-hover:bg-[#FF6B00]" />
                <span className="w-5 h-0.5 bg-current rounded-full transition-all group-hover:w-6 group-hover:bg-[#FF6B00]" />
              </>
            )}
          </button>

          <Link
            href="/"
            onClick={() => setSelectedCategory("All")}
            className="flex items-center gap-2 group shrink-0"
            title="ArdhiMart"
          >
            {/* Clean Logo Image without dark cover box */}
            <Image
              src="/logo.png"
              alt="ArdhiMart Logo"
              width={140}
              height={36}
              priority
              className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-none">
              <span className="text-[#FF6B00]">Ardhi</span>
              <span className="text-[#0F396F] dark:text-blue-400">Mart</span>
            </span>
          </Link>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="flex flex-1 max-w-lg relative mx-1 sm:mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg pl-4 pr-10 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] transition-colors"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 pointer-events-none">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="pointer-events-auto hover:text-black dark:hover:text-white p-0.5"
                >
                  <HiXMark className="w-4 h-4 text-gray-400" />
                </button>
              ) : (
                <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Cart Icon, Profile Icon & Settings Icon */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          <Link
            href="/cart"
            className="relative p-2 sm:p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Shopping Cart Page"
          >
            <div className="relative">
              <HiOutlineShoppingBag className="w-5 h-5 text-[#FF6B00]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-xs font-bold text-gray-800 dark:text-gray-200">Cart</span>
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            className="p-2 sm:p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="User Account"
          >
            <HiOutlineUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {user && (
              <span className="hidden md:inline text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[80px] truncate">
                {user.displayName || user.email}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="p-2 sm:p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <HiOutlineCog6Tooth className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:rotate-45 transition-transform" />
            <span className="hidden md:inline text-xs font-bold text-gray-800 dark:text-gray-200">Settings</span>
          </Link>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-4 space-y-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => {
              setSelectedCategory("All");
              setMobileMenuOpen(false);
            }}
            className="block text-gray-900 dark:text-white py-1 hover:text-[#FF6B00]"
          >
            Home
          </Link>
          <div className="pt-2 border-t border-gray-200 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2 font-bold">
              Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left py-1.5 px-3 rounded-lg border text-xs cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0F396F] border-[#164685] text-white font-bold"
                      : "bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Pills Bar */}
      <div className="border-t border-gray-200/80 dark:border-slate-800/60 bg-gray-50/80 dark:bg-slate-950/60 px-3 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 max-w-7xl mx-auto min-w-max text-xs font-semibold">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0F396F] border-[#164685] text-white shadow-xs font-bold"
                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
