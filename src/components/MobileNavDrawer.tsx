'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  Home,
  Grid,
  ShoppingBag,
  User,
  Search,
  Truck,
  PhoneCall,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { Category } from '@/types/store';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  categories: Category[];
  onOpenSearch: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  siteName,
  categories,
  onOpenSearch,
}) => {
  const router = useRouter();

  const handleNav = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel Sliding Smoothly from Left */}
      <div
        className={`fixed inset-y-0 left-0 max-w-full flex pr-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-screen max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/"
              onClick={onClose}
              className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white uppercase"
            >
              {siteName}
            </Link>
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Quick Search Shortcut */}
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full h-11 bg-gray-100 dark:bg-slate-800 rounded-xl px-4 flex items-center gap-3 text-gray-500 text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Search products, brands...</span>
            </button>

            {/* Main Navigation Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                Main Menu
              </p>

              <button
                onClick={() => handleNav('/')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-bold text-gray-900 dark:text-white transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>Home</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNav('/products')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-bold text-gray-900 dark:text-white transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Grid className="w-4 h-4 text-gray-500" />
                  <span>All Products</span>
                </div>
                <span className="text-[10px] font-extrabold bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full">
                  HOT
                </span>
              </button>

              <button
                onClick={() => handleNav('/cart')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-bold text-gray-900 dark:text-white transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/ardhimart-bag.svg"
                    alt="My Cart"
                    width={22}
                    height={22}
                    className="w-5 h-5 object-contain dark:brightness-0 dark:invert"
                  />
                  <span>My Cart</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNav('/account')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-bold text-gray-900 dark:text-white transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Account Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNav('/account')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-bold text-gray-900 dark:text-white transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings & Preferences</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNav('/account/orders/8849201A/track')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-bold text-gray-900 dark:text-white transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>Track Order</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Categories Section */}
            <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-slate-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                Categories
              </p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNav(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span>{cat.name}</span>
                  </div>
                  {cat.itemCount && (
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {cat.itemCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Contact */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 space-y-1 text-xs">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
              <PhoneCall className="w-4 h-4 text-gray-500" />
              <span>Customer Helpline</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium pl-6">
              +880 1700-000000 (10 AM - 10 PM)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavDrawer;
