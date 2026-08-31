'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import SearchModal from '@/components/SearchModal';
import { defaultStoreConfig } from '@/config/storeConfig';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { notifySuccess } from '@/lib/sweetalert';
import {
  User as UserIcon,
  Package,
  Clock,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  Sun,
  Moon,
  ShoppingBag,
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const { user, logout } = useAuth();
  const { products, wishlistIds, theme, toggleTheme, addToCart } = useStore();
  const [storeConfig] = useState(defaultStoreConfig);
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleLogout = async () => {
    await logout();
    notifySuccess('Signed Out', 'You have been logged out successfully.');
    router.push('/');
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const recentOrders = [
    {
      id: '8849201A',
      productName: 'Smart LED Digital Pen Holder',
      status: 'In Transit',
      price: 2450,
      image: products[0]?.image || '/images/ardhimart-smart-pen-holder.webp',
      date: '2026-08-30',
    },
    {
      id: '8874902B',
      productName: 'Luxury Gift Box Set',
      status: 'Delivered',
      price: 3200,
      image: products[1]?.image || '/images/ardhimart-giftbox-valentine-set.webp',
      date: '2026-08-25',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header
        siteName={storeConfig.name}
        cartCount={0}
        onOpenMenu={() => {}}
        onOpenCart={() => router.push('/cart')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-28 space-y-6">
        
        {/* Profile Header Card */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-4 border-[#FF6B00] p-0.5 bg-white dark:bg-slate-900 shadow-md shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google Profile Avatar'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#FF6B00]/10 text-[#FF6B00] font-black text-2xl flex items-center justify-center">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10" />}
                </div>
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
                  {user?.displayName || 'ArdhiMart Member'}
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {user?.email || 'Logged In Account'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-red-100 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </section>

        {/* Tab Navigation Switcher Bar */}
        <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-4 h-4" /> Track Orders
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist ({wishlistProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </section>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bento Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-xs">
                <Package className="w-5 h-5 text-[#FF6B00]" />
                <div>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">2</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-xs">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white">1</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Transit</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-xs">
                <Truck className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white">1</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivered</p>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-800 shadow-xs">
              <button
                onClick={() => setActiveTab('orders')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-xs text-gray-900 dark:text-white">Track Recent Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-xs text-gray-900 dark:text-white">Saved Wishlist Items ({wishlistProducts.length})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-xs text-gray-900 dark:text-white">Account & App Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TRACK ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white px-1">
              Your Order History & Tracking
            </h3>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-16 h-16 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200 dark:border-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-xs text-gray-900 dark:text-white">
                          Order #{order.id}
                        </p>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            order.status === 'In Transit'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-300 font-semibold mt-1">
                        {order.productName}
                      </p>
                      <p className="text-xs font-extrabold text-[#FF6B00] mt-0.5">
                        ৳{order.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/account/orders/${order.id}/track`}
                    className="w-full sm:w-auto px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-xs"
                  >
                    <Truck className="w-4 h-4" /> Track Parcel
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white px-1">
              Your Saved Wishlist ({wishlistProducts.length})
            </h3>

            {wishlistProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
                <Heart className="w-10 h-10 text-gray-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-gray-600 dark:text-slate-400">
                  Your wishlist is currently empty.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-5 py-2.5 bg-[#FF6B00] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-[#e05e00] transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-3 flex gap-3 items-center shadow-xs"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {p.title}
                      </h4>
                      <p className="text-xs font-extrabold text-[#FF6B00] mt-0.5">
                        ৳{p.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="p-2.5 bg-[#FF6B00] text-white rounded-xl hover:bg-[#e05e00] transition-colors shrink-0 cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white px-1">
              Account Preferences & Settings
            </h3>

            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-800 shadow-xs">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-indigo-600" />
                  )}
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 dark:text-white block">
                      App Theme Appearance
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">
                      Current Mode: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-lg border bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white border-gray-200 dark:border-slate-700">
                  Toggle Theme
                </span>
              </button>

              <div className="p-4 space-y-1">
                <p className="font-extrabold text-xs text-gray-900 dark:text-white">Delivery Address</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mohammadpur, Dhaka-1207, Bangladesh</p>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-xs text-gray-900 dark:text-white">Customer Support</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone: 01895627138 (10 AM - 10 PM)</p>
                </div>
                <a
                  href="tel:01895627138"
                  className="px-3 py-1.5 bg-[#FF6B00] text-white text-xs font-bold rounded-lg"
                >
                  Call Support
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer className="hidden md:block" />

      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlistProducts.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCategories={() => router.push('/products')}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={storeConfig.currency}
        onSelectProduct={(p) => router.push(`/products/${p.id}`)}
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="animate-pulse space-y-3">
          <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto" />
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-32 mx-auto" />
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
