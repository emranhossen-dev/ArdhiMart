'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavBar from '@/components/BottomNavBar';
import SearchModal from '@/components/SearchModal';
import { defaultStoreConfig } from '@/config/storeConfig';
import { useStore } from '@/context/StoreContext';
import {
  User,
  Edit,
  Package,
  Clock,
  CheckCircle,
  ListOrdered,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  Sun,
  Moon,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { products, theme, toggleTheme } = useStore();
  const [storeConfig] = useState(defaultStoreConfig);
  const [activeTab, setActiveTab] = useState('account');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Demo user data
  const user = {
    name: 'Alex Sterling',
    status: 'Premium Member',
    email: 'alex.sterling@example.com',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    totalOrders: 128,
    pendingOrders: 3,
    deliveredOrders: 125,
  };

  const recentOrders = [
    {
      id: '8892',
      productName: 'Minimalist Product',
      status: 'In Transit',
      price: 2450,
      image: products[0]?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
    },
    {
      id: '8874',
      productName: 'Tech Lifestyle Accessory',
      status: 'Delivered',
      price: 1800,
      image: products[1]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        siteName={storeConfig.name}
        cartCount={2}
        onOpenMenu={() => console.log('Open Menu')}
        onOpenCart={() => router.push('/cart')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-28 space-y-8">
        {/* Profile Header Card */}
        <section className="flex flex-col items-center text-center pt-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-800 p-1 bg-white dark:bg-slate-900 shadow-md mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {user.status}
          </p>

          <button
            onClick={() => alert('Edit Profile Modal')}
            className="mt-4 px-6 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </section>

        {/* Bento Summary Cards */}
        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-xs">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                {user.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl">
              <Package className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-xs">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                {user.pendingOrders}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Pending
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-xs">
            <Truck className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                {user.deliveredOrders}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Delivered
              </p>
            </div>
          </div>
        </section>

        {/* Quick Navigation Options */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
            Account Details
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-800 shadow-xs">
            <Link
              href="/products"
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ListOrdered className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  My Orders
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  Wishlist
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <button
              onClick={() => alert('Delivery Addresses')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  Saved Addresses
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => alert('Account Settings')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  Settings
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* App Theme Switcher (Light / Dark Mode) */}
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
                  <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                    App Theme
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">
                    Currently: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-800 text-amber-400 border-slate-700'
                  : 'bg-orange-50 text-[#FF6B00] border-orange-200'
              }`}>
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </span>
            </button>
          </div>
        </section>

        {/* Recent Orders List */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Recent Orders
            </h3>
            <Link
              href="/products"
              className="text-xs font-bold text-gray-900 dark:text-white underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/account/orders/${order.id}/track`)}
                className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 flex gap-4 cursor-pointer hover:shadow-md transition-all"
              >
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-16 h-20 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs text-gray-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          order.status === 'In Transit'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {order.productName}
                    </p>
                  </div>
                  <p className="font-extrabold text-sm text-gray-900 dark:text-white">
                    {storeConfig.currency}
                    {order.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sign Out Button */}
        <section className="pt-2">
          <button
            onClick={() => {
              alert('Signed Out Successfully');
              router.push('/');
            }}
            className="w-full py-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </section>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={1}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCategories={() => router.push('/products')}
      />

      {/* Search Modal */}
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
