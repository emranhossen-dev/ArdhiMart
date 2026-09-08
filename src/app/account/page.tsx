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
  CheckCircle2,
  ShieldCheck,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const { user, loading, logout } = useAuth();
  const { products, wishlistIds, theme, toggleTheme, addToCart } = useStore();
  const [storeConfig] = useState(defaultStoreConfig);
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Real orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Redirect unauthenticated user to /login
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Fetch real orders for current user
  useEffect(() => {
    if (!user) return;
    const fetchUserOrders = async () => {
      setIsOrdersLoading(true);
      const ordersMap = new Map<string, any>();

      // 1. Check local storage for orders placed in this browser session
      if (typeof window !== 'undefined') {
        try {
          const userOrdersStr = localStorage.getItem('ardhimart_user_orders');
          if (userOrdersStr) {
            const list = JSON.parse(userOrdersStr);
            if (Array.isArray(list)) {
              list.forEach((o: any) => {
                const key = String(o.orderNumber || o.id);
                if (key) ordersMap.set(key, o);
              });
            }
          }
          const lastOrderStr = localStorage.getItem('ardhimart_last_order');
          if (lastOrderStr) {
            const last = JSON.parse(lastOrderStr);
            const key = String(last.orderNumber || last.id);
            if (key && !ordersMap.has(key)) {
              ordersMap.set(key, last);
            }
          }
        } catch (e) {}
      }

      // 2. Fetch from backend orders API for user's phone, email, or name
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
        const queries = [user.email, user.phoneNumber, user.displayName].filter(Boolean) as string[];

        for (const q of queries) {
          const res = await fetch(`${baseUrl}/orders?search=${encodeURIComponent(q)}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              data.forEach((o: any) => {
                const key = String(o.orderNumber || o.id);
                if (key) ordersMap.set(key, o);
              });
            }
          }
        }
      } catch (e) {}

      const sortedOrders = Array.from(ordersMap.values()).sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setOrders(sortedOrders);
      setIsOrdersLoading(false);
    };

    fetchUserOrders();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    notifySuccess('লগআউট সম্পন্ন', 'আপনি সফলভাবে লগআউট হয়েছেন।');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const totalOrdersCount = orders.length;
  const inTransitCount = orders.filter((o) =>
    ['pending', 'processing', 'shipped', 'in transit'].includes((o.status || '').toLowerCase())
  ).length;
  const deliveredCount = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header
        siteName={storeConfig.name}
        cartCount={0}
        onOpenMenu={() => {}}
        onOpenCart={() => router.push('/cart')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Desktop Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 dark:text-white font-bold">আমার অ্যাকাউন্ট (My Account)</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#FF6B00] capitalize font-bold">{activeTab}</span>
        </nav>

        {/* Mobile Horizontal Pill Switcher (< lg) */}
        <section className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Package className="w-4 h-4" /> ড্যাশবোর্ড
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Truck className="w-4 h-4" /> আমার অর্ডার ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Heart className="w-4 h-4" /> উইশলিস্ট ({wishlistProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" /> সেটিংস
          </button>
        </section>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (lg:col-span-3) - Desktop Navigation Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#FF6B00] p-0.5 bg-white dark:bg-slate-800 shadow-md">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User Avatar'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] font-black text-2xl flex items-center justify-center">
                      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="Verified Customer">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white truncate">
                  {user.displayName || user.email?.split('@')[0] || 'Customer'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {user.email || user.phoneNumber || 'ArdhiMart Member'}
                </p>
                <span className="inline-block mt-2 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Verified Member
                </span>
              </div>
            </div>

            {/* Vertical Menu Links */}
            <nav className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>ড্যাশবোর্ড (Dashboard)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4" />
                  <span>আমার অর্ডার (My Orders)</span>
                </div>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>পছন্দের তালিকা (Wishlist)</span>
                </div>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'wishlist'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {wishlistProducts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>সেটিংস ও প্রাইভেসী</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </nav>

            {/* Customer Support Mini Card */}
            <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/50 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-5 border border-orange-200/50 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  কাস্টমার সাপোর্ট
                </h4>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                যেকোনো প্রয়োজনে কল করুন: <strong className="text-gray-900 dark:text-white font-mono">01895627138</strong>
              </p>
              <a
                href="https://wa.me/8801895627138"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                WhatsApp চ্যাট
              </a>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট করুন (Sign Out)</span>
            </button>
          </aside>

          {/* Right Column (lg:col-span-9) - Tab Content Panels */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Hero Banner */}
                <section className="bg-gradient-to-r from-orange-500 to-[#FF6B00] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-200">
                      স্বাগতম ArdhiMart অ্যাকাউন্টে
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black tracking-tight">
                      হ্যালো, {user.displayName || 'সম্মানিত গ্রাহক'}! 👋
                    </h2>
                    <p className="text-xs sm:text-sm text-orange-100 max-w-xl leading-relaxed">
                      আপনার অর্ডার অগ্রগতি ট্র্যাক করুন, পছন্দের গ্যাজেট সংরক্ষণ করুন এবং দ্রুত ক্যাশ অন ডেলিভারিতে অর্ডার প্লেস করুন।
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 hover:bg-orange-50 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#FF6B00]" />
                        <span>প্রোডাক্টস ব্রাউজ করুন</span>
                      </Link>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/20 hover:bg-black/30 text-white text-xs font-extrabold rounded-xl border border-white/20 transition-all cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>অর্ডার হিস্টোরি</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* 3 Bento Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-slate-800 text-[#FF6B00] flex items-center justify-center shrink-0 shadow-inner">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">{totalOrdersCount}</p>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">সর্বমোট অর্ডার</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">{inTransitCount}</p>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">প্রসেসিং ও ডেলিভারিতে</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">{deliveredCount}</p>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">সফল ডেলিভারি</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#FF6B00]" />
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                        সাম্প্রতিক অর্ডার ট্র্যাকিং (Recent Orders)
                      </h3>
                    </div>
                    {orders.length > 0 && (
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-extrabold text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>সব দেখুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isOrdersLoading ? (
                    <div className="p-8 text-center">
                      <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-gray-400">অর্ডারের তথ্য লোড হচ্ছে...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                      <Package className="w-10 h-10 text-gray-300 dark:text-slate-700 mx-auto" />
                      <p className="text-xs text-gray-500">আপনার কোনো সক্রিয় অর্ডার নেই।</p>
                      <Link
                        href="/products"
                        className="inline-block px-4 py-2 bg-[#FF6B00] text-white text-xs font-bold rounded-xl"
                      >
                        শপিং শুরু করুন
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => {
                        const orderId = String(order.orderNumber || order.id || '');
                        const itemsList = order.order_items || order.items || [];
                        const firstItem = itemsList[0];
                        const orderImg = firstItem?.image || products[0]?.image || '/logo.png';
                        const orderTitle = firstItem?.name || firstItem?.productName || (itemsList.length > 0 ? `${itemsList.length} টি পণ্য অর্ডার` : `অর্ডার #${orderId}`);
                        const orderPrice = Number(order.totalAmount || 0);
                        const orderStatus = String(order.status || 'pending');

                        return (
                          <div
                            key={order.id || orderId}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-800"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={orderImg}
                                alt={orderTitle}
                                className="w-14 h-14 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200 dark:border-slate-700"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-gray-900 dark:text-white">
                                    #{orderId}
                                  </span>
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-[#FF6B00] border border-[#FF6B00]/20">
                                    {orderStatus}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 truncate mt-0.5">
                                  {orderTitle}
                                </h4>
                                <p className="text-xs font-extrabold text-[#FF6B00] mt-0.5">
                                  ৳{orderPrice.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/account/orders/${encodeURIComponent(orderId)}/track`}
                              className="w-full sm:w-auto px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-xs shrink-0"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>ট্র্যাক পার্সেল</span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      আমার অর্ডার হিস্টোরি (Order History)
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      আপনার প্লেস করা সকল অর্ডারের লাইভ ট্র্যাকিং ও বিস্তারিত রসিদ
                    </p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                    মোট {orders.length} টি অর্ডার
                  </span>
                </div>

                {isOrdersLoading ? (
                  <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-16 text-center space-y-3 shadow-xs">
                    <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-gray-500">অর্ডারের তথ্য লোড হচ্ছে...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-slate-800/80 text-[#FF6B00] flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                        কোনো অর্ডার পাওয়া যায়নি (No Orders Found)
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                        আপনি এখনও কোনো অর্ডার করেননি। আমাদের প্রিমিয়াম ট্রেন্ডিং গ্যাজেটগুলো দেখতে পারেন।
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>শপিং করুন (Browse Products)</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const orderId = String(order.orderNumber || order.id || '');
                      const itemsList = order.order_items || order.items || [];
                      const firstItem = itemsList[0];
                      const orderImg = firstItem?.image || products[0]?.image || '/logo.png';
                      const orderTitle = firstItem?.name || firstItem?.productName || (itemsList.length > 0 ? `${itemsList.length} Items Order` : `Order #${orderId}`);
                      const orderPrice = Number(order.totalAmount || 0);
                      const orderStatus = String(order.status || 'pending');

                      const isDelivered = orderStatus.toLowerCase() === 'delivered';
                      const isInTransit = ['shipped', 'in transit', 'processing'].includes(orderStatus.toLowerCase());

                      return (
                        <div
                          key={order.id || orderId}
                          className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <img
                              src={orderImg}
                              alt={orderTitle}
                              className="w-16 h-16 object-cover rounded-2xl bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200 dark:border-slate-700"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm text-gray-900 dark:text-white">
                                  #{orderId}
                                </span>
                                <span
                                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                    isDelivered
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                                      : isInTransit
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                                      : 'bg-orange-100 text-[#FF6B00] dark:bg-orange-950/40 dark:text-orange-400 border-orange-300'
                                  }`}
                                >
                                  {orderStatus}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-bold mt-1 line-clamp-1">
                                {orderTitle}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>মোট পণ্য: {itemsList.length || 1} টি</span>
                                <span>•</span>
                                <span className="font-black text-[#FF6B00]">
                                  ৳{orderPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                            <Link
                              href={`/account/orders/${encodeURIComponent(orderId)}/track`}
                              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                              <Truck className="w-4 h-4" />
                              <span>ট্র্যাক করুন</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      পছন্দের উইশলিস্ট তালিকা ({wishlistProducts.length})
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      আপনার সেভ করা পণ্যগুলো সহজে কার্টে যুক্ত করে অর্ডার করতে পারেন
                    </p>
                  </div>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-slate-800 text-rose-500 flex items-center justify-center mx-auto">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                        আপনার উইশলিস্ট খালি
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                        পছন্দের যেকোনো পণ্যের হার্ট আইকনে ক্লিক করে উইশলিস্টে সেভ করে রাখুন।
                      </p>
                    </div>
                    <Link
                      href="/products"
                      className="inline-block px-6 py-3 bg-[#FF6B00] text-white font-black text-xs rounded-xl shadow-md hover:bg-[#e05e00] transition-colors"
                    >
                      পণ্যসমূহ এক্সপ্লোর করুন
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between shadow-xs space-y-3"
                      >
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {p.title}
                          </h4>
                          <p className="text-sm font-black text-[#FF6B00]">
                            ৳{p.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(p);
                            notifySuccess('কার্টে যুক্ত হয়েছে', `${p.title} আপনার শপিং ব্যাগে যুক্ত হয়েছে।`);
                          }}
                          className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>কার্টে যোগ করুন</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    অ্যাকাউন্ট ও অ্যাপ সেটিংস (Settings)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    আপনার প্রোফাইল প্রিফারেন্স ও থিম কন্ট্রোল
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-800 shadow-sm">
                  {/* Theme Switcher */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-slate-800 text-[#FF6B00] flex items-center justify-center">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                          অ্যাপের থিম মোড (Appearance)
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          বর্তমান মোড: {theme === 'dark' ? 'ডার্ক মোড (Dark Mode 🌙)' : 'লাইট মোড (Light Mode ☀️)'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-2 text-xs font-extrabold rounded-xl border bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white border-gray-200 dark:border-slate-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      থিম পরিবর্তন করুন
                    </button>
                  </div>

                  {/* Customer Information */}
                  <div className="p-6 space-y-3">
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                      ব্যক্তিগত তথ্য
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-2xl">
                        <span className="text-gray-400 block">নাম:</span>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{user.displayName || 'Customer'}</span>
                      </div>
                      <div className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-2xl">
                        <span className="text-gray-400 block">ইমেইল:</span>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{user.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Support Hotline */}
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                        সরাসরি কাস্টমার কেয়ার
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        যেকোনো জিজ্ঞাসা বা সহায়তায় প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত যোগাযোগ করুন
                      </p>
                    </div>
                    <a
                      href="tel:01895627138"
                      className="px-5 py-2.5 bg-[#FF6B00] text-white text-xs font-bold rounded-xl text-center"
                    >
                      কল করুন (01895627138)
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
