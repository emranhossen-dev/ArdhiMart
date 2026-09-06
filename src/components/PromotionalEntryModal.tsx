'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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
        // Assume the hero banner is about 400-500px tall
        if (window.scrollY > 400) {
          setIsOpen(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };

      // Check immediately in case user loads page already scrolled down
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

  const handleCopy = () => {
    navigator.clipboard.writeText('FD20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md animate-fade-in transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      {/* Close Button (Outside modal) */}
      <div className="relative w-full max-w-[380px] flex justify-end mb-3 pointer-events-none">
        <button
          onClick={handleClose}
          aria-label="Close promotional popup"
          className="pointer-events-auto p-3 rounded-full bg-white/20 hover:bg-white/40 text-white shadow-xl backdrop-blur-md border border-white/30 transition-all active:scale-95 cursor-pointer z-[101]"
        >
          <X className="w-6 h-6 stroke-2" />
        </button>
      </div>

      {/* 
        Leaf Shape Modal Container 
        Glassmorphism (transparent, blur, white border)
        Leaf shape achieved via asymmetric border radius (top-right and bottom-left large radius)
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] p-8 sm:p-10 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] animate-scale-in flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          borderRadius: '2rem 100px 2rem 100px', // Leaf Shape
        }}
      >
        {/* Decorative Glow inside */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-orange-400/20 rounded-full mix-blend-screen filter blur-[40px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[40px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center mt-2">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white text-xs font-black tracking-widest uppercase mb-6 shadow-lg border border-white/20">
            Welcome Gift
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md mb-3">
            Claim Extra <span className="text-orange-400">20%</span> Off
          </h2>
          
          <p className="text-sm sm:text-base text-gray-200 drop-shadow mb-8 font-medium">
            On your very first order at ArdhiMart!
          </p>

          {/* Coupon Code Section */}
          <div className="w-full flex items-center justify-between bg-black/30 border border-white/20 rounded-2xl p-2 pl-6 shadow-inner backdrop-blur-md">
            <span className="text-2xl font-black text-white tracking-widest font-mono">
              FD20
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                copied 
                  ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                  : 'bg-white text-black hover:bg-gray-100 shadow-lg'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>
          
          <p className="text-[10px] text-gray-300/80 mt-4 font-medium uppercase tracking-wider">
            Apply this code at checkout
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="w-full mt-3 py-2.5 px-6 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>ঠিক আছে (OK)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionalEntryModal;
