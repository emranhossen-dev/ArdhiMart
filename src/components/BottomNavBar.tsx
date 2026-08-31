'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User, LucideIcon } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

interface BottomNavBarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  wishlistCount?: number;
  onOpenSearch?: () => void;
  onOpenCategories?: () => void;
}

interface NavTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  isActive: boolean;
  action?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  wishlistCount,
  onOpenSearch,
  onOpenCategories,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems, wishlistIds, setIsSearchOpen } = useStore();
  const { user } = useAuth();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const effectiveWishlistCount = wishlistCount !== undefined ? wishlistCount : wishlistIds.length;

  const tabs: NavTabItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      href: '/products',
      isActive: pathname === '/products',
      action: onOpenCategories,
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      href: '#',
      action: onOpenSearch || (() => setIsSearchOpen(true)),
      isActive: activeTab === 'search',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      href: '/cart',
      badge: totalCartCount > 0 ? totalCartCount : undefined,
      isActive: pathname === '/cart' || pathname === '/checkout',
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      href: '/account',
      badge: effectiveWishlistCount > 0 ? effectiveWishlistCount : undefined,
      isActive: pathname.startsWith('/account'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-[#FF6B00] border-t border-[#e05e00] h-16 flex items-center justify-around px-2 sm:hidden transition-colors shadow-2xl text-white">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const active = tab.isActive;

        if (tab.action) {
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.href && tab.href !== '#') router.push(tab.href);
                if (tab.action) tab.action();
              }}
              className={`flex flex-col items-center justify-center w-14 py-1 relative transition-all active:scale-90 ${
                active
                  ? 'text-white font-black scale-105'
                  : 'text-orange-100/90 hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                {tab.id === 'account' && user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Account Avatar"
                    referrerPolicy="no-referrer"
                    className={`w-5.5 h-5.5 rounded-full object-cover border ${
                      active ? 'border-white ring-2 ring-white/60' : 'border-orange-200'
                    }`}
                  />
                ) : tab.id === 'cart' ? (
                  <Image
                    src="/ardhimart-bag.svg"
                    alt="Cart"
                    width={26}
                    height={26}
                    className={`w-6.5 h-6.5 object-contain transition-all brightness-0 invert ${
                      active ? 'opacity-100 scale-105' : 'opacity-85'
                    }`}
                  />
                ) : (
                  <IconComponent className={`w-5 h-5 ${active ? 'stroke-[2.5px] text-white' : 'stroke-2 text-orange-100'}`} />
                )}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-white text-[#FF6B00] font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href!}
            className={`flex flex-col items-center justify-center w-14 py-1 relative transition-all active:scale-90 ${
              active
                ? 'text-white font-black scale-105'
                : 'text-orange-100/90 hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              {tab.id === 'cart' ? (
                <Image
                  src="/ardhimart-bag.svg"
                  alt="Cart"
                  width={26}
                  height={26}
                  className={`w-6.5 h-6.5 object-contain transition-all brightness-0 invert ${
                    active ? 'opacity-100 scale-105' : 'opacity-85'
                  }`}
                />
              ) : (
                <IconComponent className={`w-5 h-5 ${active ? 'stroke-[2.5px] text-white' : 'stroke-2 text-orange-100'}`} />
              )}
              {tab.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 bg-white text-[#FF6B00] font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
