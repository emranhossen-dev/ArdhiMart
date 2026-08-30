'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Settings } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface HeaderProps {
  siteName?: string;
  cartCount?: number;
  onOpenMenu?: () => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteName,
  cartCount: customCartCount,
  onOpenMenu: customOpenMenu,
  onOpenCart: customOpenCart,
  onOpenSearch: customOpenSearch,
}) => {
  const {
    storeConfig,
    cartItems,
    setIsCartOpen,
    setIsSearchOpen,
    setIsMenuOpen,
  } = useStore();

  const computedCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = customCartCount !== undefined ? customCartCount : computedCartCount;

  const handleMenuClick = () => {
    setIsMenuOpen(true);
    if (customOpenMenu) customOpenMenu();
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    if (customOpenSearch) customOpenSearch();
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
    if (customOpenCart) customOpenCart();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 text-gray-900 dark:text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Group: Stylish Staggered Hamburger (Mobile only - lg:hidden) -> Logo Image -> Brand Name */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={handleMenuClick}
            aria-label="Open Mobile Menu"
            className="lg:hidden p-1.5 text-gray-800 dark:text-gray-100 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors cursor-pointer group flex flex-col justify-center gap-1.5 items-start"
          >
            <span className="w-6 h-0.5 bg-current rounded-full transition-all group-hover:w-6 group-hover:bg-[#FF6B00]" />
            <span className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:w-6 group-hover:bg-[#FF6B00]" />
            <span className="w-5 h-0.5 bg-current rounded-full transition-all group-hover:w-6 group-hover:bg-[#FF6B00]" />
          </button>

          <Link
            href="/"
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
            {/* Brand Name with Ardhi (#FF6B00) and Mart (#0F396F) Colors */}
            <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-none">
              <span className="text-[#FF6B00]">Ardhi</span>
              <span className="text-[#0F396F] dark:text-blue-400">Mart</span>
            </span>
          </Link>
        </div>

        {/* Right Actions: Search, Cart & Settings */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSearchClick}
            aria-label="Search"
            className="p-2 sm:p-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-200 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={handleCartClick}
            aria-label="Open Cart"
            className="p-2 sm:p-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-200 rounded-lg transition-all active:scale-95 relative cursor-pointer flex items-center gap-1.5"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B00] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-gray-800 dark:text-gray-200">Cart</span>
          </button>

          <Link
            href="/account"
            aria-label="Settings"
            title="Settings"
            className="p-2 sm:p-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-200 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline text-xs font-bold text-gray-800 dark:text-gray-200">Settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
