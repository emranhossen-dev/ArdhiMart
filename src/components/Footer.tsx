'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { notifySuccess } from '@/lib/sweetalert';
import Image from 'next/image';
import {
  Send,
  PhoneCall,
  Mail,
  MapPin,
  Heart,
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { storeConfig } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      notifySuccess('Subscribed Successfully!', 'Thank you for subscribing to our newsletter.');
      setEmail('');
    }
  };

  return (
    <footer className={`bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 pt-8 pb-24 md:pt-12 md:pb-8 border-t border-gray-200/80 dark:border-slate-800 transition-colors ${className}`}>
      <div className="max-w-7xl mx-auto px-4 space-y-8 md:space-y-12">
        {/* Newsletter Banner */}
        <div className="flex bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Join Our VIP Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
              Get exclusive promo discount codes, new arrivals & flash sale alerts straight to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="h-12 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl px-4 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-[#FF6B00] transition-colors w-full sm:w-72"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
            >
              Subscribe
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image
                src="/logo.png?v=2"
                alt="ArdhiMart Logo"
                width={140}
                height={40}
                unoptimized
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-black text-xl sm:text-2xl tracking-tight leading-none">
                <span className="text-[#FF6B00]">Ardhi</span>
                <span className="text-[#0F396F] dark:text-blue-400">Mart</span>
              </span>
            </Link>
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
              Curated minimalist essentials and modern luxury e-commerce experience across Bangladesh.
            </p>
            <div className="space-y-2 text-xs text-gray-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <a href={`tel:${storeConfig.phone || '01895627138'}`} className="hover:text-[#FF6B00] transition-colors">
                  {storeConfig.phone || '01895627138'} (10 AM - 10 PM)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <a href={`mailto:${storeConfig.email || 'martardhi@gmail.com'}`} className="hover:text-[#FF6B00] transition-colors">
                  {storeConfig.email || 'martardhi@gmail.com'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>{storeConfig.address || 'Mohammadpur, Dhaka-1207'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Shop Categories (Sitelinks) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-800 pb-2">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-slate-400 font-medium">
              <li>
                <Link href="/products" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products/combo-gift-boxes" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Combo Gift Boxes
                </Link>
              </li>
              <li>
                <Link href="/products/smart-gadgets" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Smart Gadgets
                </Link>
              </li>
              <li>
                <Link href="/products/fashion-jewellery" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Fashion & Jewellery
                </Link>
              </li>
              <li>
                <Link href="/products/mens-clothing" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-800 pb-2">
              Customer Care & Policies
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
              <li>
                <Link href="/faq" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  7-Day Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#FF6B00] dark:hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments & Courier Partners */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-800 pb-2">
              Accepted Payments & Couriers
            </h4>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Payment Partners
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 rounded border border-pink-200 dark:border-pink-900">
                  bKash
                </span>
                <span className="px-2.5 py-1 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded border border-orange-200 dark:border-orange-900">
                  Nagad
                </span>
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded border border-gray-200 dark:border-slate-700">
                  COD (Cash on Delivery)
                </span>
                <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-900">
                  Visa / MasterCard
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Logistics Partners
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300">
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                  Steadfast Courier
                </span>
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                  Pathao Courier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Agency Credit Bar (Single Divider Line) */}
        <div className="pt-1 md:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {storeConfig.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <span>Developed by</span>
            <a
              href="https://nextstation26.asia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white hover:text-[#FF6B00] dark:hover:text-blue-400 font-bold tracking-wide transition-colors underline decoration-gray-400 dark:decoration-slate-600"
            >
              NextStation26
            </a>
            <span className="text-gray-300 dark:text-slate-700">|</span>
            <a
              href="https://emran.work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-slate-300 hover:text-[#FF6B00] dark:hover:text-white font-semibold transition-colors inline-flex items-center gap-1 underline decoration-transparent hover:decoration-current"
            >
              Meet the Developer ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
