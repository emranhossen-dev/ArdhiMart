'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { defaultStoreConfig } from '@/config/storeConfig';
import { CheckCircle2, ArrowRight, Truck } from 'lucide-react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storeConfig] = useState(defaultStoreConfig);

  const [orderId, setOrderId] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  useEffect(() => {
    // 1. Read from query params
    const queryId = searchParams.get('orderId');
    const queryAmount = searchParams.get('amount');

    if (queryId) {
      setOrderId(queryId);
    }
    if (queryAmount) {
      setTotalAmount(Number(queryAmount) || null);
    }

    // 2. Read from localStorage fallback
    if (typeof window !== 'undefined') {
      try {
        const savedOrder = localStorage.getItem('ardhimart_last_order');
        if (savedOrder) {
          const parsed = JSON.parse(savedOrder);
          if (!queryId && (parsed.orderNumber || parsed.id)) {
            setOrderId(String(parsed.orderNumber || parsed.id));
          }
          if (!queryAmount && parsed.totalAmount) {
            setTotalAmount(Number(parsed.totalAmount));
          }
        }
      } catch (e) {}
    }
  }, [searchParams]);

  const displayOrderId = orderId ? `#${orderId}` : '#ORD-CONFIRMED';

  const handleTrackOrder = () => {
    if (orderId && orderId !== '#ORD-CONFIRMED') {
      router.push(`/account/orders/${encodeURIComponent(orderId)}/track`);
    } else {
      router.push('/account/orders/track/track');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Animated Background Confetti Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 w-3 h-3 bg-black dark:bg-white rounded-full animate-bounce" />
        <div className="absolute top-20 right-1/3 w-2 h-4 bg-emerald-500 rotate-45 animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-4 h-2 bg-indigo-500 -rotate-12" />
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-amber-500 rounded-full" />
      </div>

      <main className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 relative z-10 animate-fade-in-up">
        {/* Animated Checkmark Circle */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5px]" />
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-800">
            <span className="text-gray-500 font-semibold uppercase tracking-wider">Order ID</span>
            <span className="font-black text-sm text-[#FF6B00]">{displayOrderId}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">ক্যাশ অন ডেলিভারি (COD)</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-bold text-gray-900 dark:text-white">১ - ৩ দিন (Courier)</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-800 text-sm">
            <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
            <span className="font-extrabold text-base text-gray-900 dark:text-white">
              {storeConfig.currency}
              {totalAmount !== null ? totalAmount.toLocaleString() : '---'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleTrackOrder}
            className="w-full h-12 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            Track Order (অর্ডার ট্র্যাক করুন)
          </button>

          <Link
            href="/products"
            className="w-full h-12 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
