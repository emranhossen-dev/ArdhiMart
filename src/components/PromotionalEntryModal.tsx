'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Truck, Gift } from 'lucide-react';

interface PromotionalEntryModalProps {
  forceOpen?: boolean;
  onCloseModal?: () => void;
}

export const PromotionalEntryModal: React.FC<PromotionalEntryModalProps> = ({
  forceOpen = false,
  onCloseModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate dynamic remaining time until 5:00 PM today (or tomorrow 5:00 PM if past 5 PM)
  const getRemainingTimeUntil5PM = () => {
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);

    if (now.getTime() >= target.getTime()) {
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0, 0);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingTimeUntil5PM);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('ardhi_promo_dismissed');
      if (!dismissed) {
        // Subtle delay to allow layout paint while background product fetch executes silently
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [forceOpen]);

  // Dynamic 5:00 PM Daily Countdown timer tick effect
  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      setTimeLeft(getRemainingTimeUntil5PM());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('ardhi_promo_dismissed', 'true');
      } catch (e) {}
    }
    if (onCloseModal) onCloseModal();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      {/* Ultra Compact Modal Container for Mobile & Desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] sm:max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 dark:border-amber-500/20 transform transition-all animate-scale-in"
      >
        {/* Decorative Header Banner (No Sparkles Icon) */}
        <div className="relative bg-gradient-to-r from-amber-500 via-[#FF6B00] to-orange-600 px-5 py-5 sm:px-6 sm:py-6 text-white text-center overflow-hidden">
          {/* Background Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/15 rounded-full blur-lg pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-black/15 rounded-full blur-lg pointer-events-none" />

          {/* Top Right Close Button (X) */}
          <button
            onClick={handleClose}
            aria-label="Close promotional popup"
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/25 hover:bg-black/45 text-white/90 hover:text-white backdrop-blur-xs transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2 text-amber-100 border border-white/20 shadow-xs">
            <span>স্পেশাল মেগা অফার ⚡</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-xs">
            ৳১০০ ভাউচার কার্ড + ফ্রি ডেলিভারি!
          </h3>
          <p className="text-[11px] sm:text-xs font-medium text-amber-100 mt-1 opacity-95">
            আজকের অর্ডারে বিশেষ মেগা সুবিধা উপভোগ করুন
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* 2 Core Offer Highlights */}
          <div className="space-y-2.5">
            {/* Offer 1: Free Shipping */}
            <div className="flex items-center gap-3 p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-extrabold text-gray-900 dark:text-amber-200">
                  ৳৯৯৯+ কেনাকাটায় ফ্রি ডেলিভারি!
                </span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                  যেকোনো স্থান থেকে ডেলিভারি চার্জ সম্পূর্ণ মাফ
                </span>
              </div>
            </div>

            {/* Offer 2: 100Tk Physical Voucher Card on Delivery */}
            <div className="flex items-center gap-3 p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-extrabold text-gray-900 dark:text-emerald-200">
                  যেকোনো পণ্য কিনলেই ৳১০০ ভাউচার কার্ড!
                </span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                  কার্ডের কুপন কোড দিয়ে পরবর্তী অর্ডারে পাবেন ৳১০০ ছাড়
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Timer Block */}
          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-bold text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00] animate-spin-slow" />
              <span>অফারের সময় বাকি:</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-white">
              <span className="bg-gray-900 dark:bg-slate-700 px-2 py-0.5 rounded shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-gray-900 dark:text-white font-bold">:</span>
              <span className="bg-gray-900 dark:bg-slate-700 px-2 py-0.5 rounded shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-gray-900 dark:text-white font-bold">:</span>
              <span className="bg-[#FF6B00] px-2 py-0.5 rounded shadow-xs animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalEntryModal;
