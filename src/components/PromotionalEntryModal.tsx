'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface PromotionalEntryModalProps {
  forceOpen?: boolean;
  onCloseModal?: () => void;
}

export const PromotionalEntryModal: React.FC<PromotionalEntryModalProps> = ({
  forceOpen = false,
  onCloseModal,
}) => {
  const { storeConfig } = useStore();
  const isEnabled = forceOpen || (storeConfig?.enablePromoModal ?? true);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      setIsOpen(false);
      return;
    }

    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('ardhi_promo_dismissed');
      if (dismissed) return;

      const handleScroll = () => {
        if (window.scrollY > 400) {
          setIsOpen(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };

      if (window.scrollY > 400) {
        setIsOpen(true);
      } else {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [forceOpen, isEnabled]);

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in transition-opacity select-none"
      aria-modal="true"
      role="dialog"
    >
      {/* Close Button (Outside modal) */}
      <div className="relative w-full max-w-[400px] flex justify-end mb-2 pointer-events-none">
        <button
          onClick={handleClose}
          aria-label="Close promotional popup"
          className="pointer-events-auto p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white shadow-xl backdrop-blur-md border border-white/30 transition-all active:scale-95 cursor-pointer z-[101]"
        >
          <X className="w-5 h-5 stroke-2" />
        </button>
      </div>

      {/* Modern Voucher Gift Card Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] p-6 sm:p-8 bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(245,158,11,0.3)] animate-scale-in flex flex-col items-center justify-center text-center overflow-hidden"
      >
        {/* Glowing Ambient Highlights */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-black tracking-wider uppercase mb-4 shadow-md border border-white/20">
          <Gift className="w-3.5 h-3.5" />
          <span>স্পেশাল গিফট অফার</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug drop-shadow-md mb-2">
          প্রতি অর্ডারে <span className="text-amber-400">১০০৳ ভাউচার</span> ফ্রি!
        </h2>

        {/* Short Bengali Description */}
        <p className="text-xs sm:text-sm text-slate-300 drop-shadow mb-5 font-medium leading-relaxed max-w-xs">
          যেকোনো অর্ডার করলেই পার্সেলের সাথে পাচ্ছেন <strong className="text-amber-300">১০০ টাকার ফ্রি ভাউচার কার্ড</strong>, যা আপনার পরবর্তী অর্ডারে ব্যবহার করতে পারবেন।
        </p>

        {/* Voucher Card Representation */}
        <div className="w-full relative rounded-2xl p-4 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-indigo-950/40 border border-amber-500/40 shadow-inner flex flex-col items-center justify-center text-center space-y-2 group">
          <div className="flex items-center justify-between w-full border-b border-amber-500/20 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ArdhiMart Privilege Card
            </span>
            <span className="text-[10px] font-extrabold text-slate-400">Next Order</span>
          </div>

          <div className="py-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight flex items-center justify-center gap-1">
              <span>৳১০০</span>
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md">
                Gift Voucher
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold mt-1">
              পরবর্তী যেকোনো কেনাকাটায় ১০০ টাকা ক্যাশ ডিসকাউন্ট
            </p>
          </div>

          <div className="w-full pt-1 text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> পার্সেলের ভেতর ভাউচার কার্ডটি দেওয়া থাকবে
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleClose}
          className="w-full mt-5 py-3 px-6 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>বুঝে পেয়েছি (OK)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PromotionalEntryModal;
