'use client';

export const runtime = 'edge';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import {
  ArrowLeft,
  Truck,
  Check,
  Search,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  Package,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { notifySuccess } from '@/lib/sweetalert';

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawIdParam = resolvedParams?.id || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrderDetails = async (idOrPhone: string) => {
    if (!idOrPhone || !idOrPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে অর্ডার আইডি (যেমন: 1001) অথবা মোবাইল নম্বর লিখুন।');
      return;
    }

    const cleanQuery = idOrPhone.trim();
    setIsLoading(true);
    setErrorMsg('');

    // Check localStorage cache first for instant rendering
    let foundLocal = false;
    if (typeof window !== 'undefined') {
      try {
        const savedOrder = localStorage.getItem('ardhimart_last_order');
        if (savedOrder) {
          const parsed = JSON.parse(savedOrder);
          if (
            String(parsed.id) === cleanQuery ||
            String(parsed.orderNumber) === cleanQuery ||
            String(parsed.customerPhone).includes(cleanQuery)
          ) {
            setOrderData(parsed);
            foundLocal = true;
          }
        }
      } catch (e) {}
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';

      // 1. Direct ID lookup
      const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(cleanQuery)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data.orderNumber)) {
          setOrderData(data);
          setIsLoading(false);
          return;
        }
      }

      // 2. Search orders by query
      const listRes = await fetch(`${baseUrl}/orders?search=${encodeURIComponent(cleanQuery)}`, {
        cache: 'no-store',
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData) && listData.length > 0) {
          setOrderData(listData[0]);
          setIsLoading(false);
          return;
        }
      }

      // 3. Fallback to all orders
      const allRes = await fetch(`${baseUrl}/orders`, { cache: 'no-store' });
      if (allRes.ok) {
        const allData = await allRes.json();
        if (Array.isArray(allData)) {
          const match = allData.find(
            (o: any) =>
              String(o.id) === cleanQuery ||
              String(o.orderNumber) === cleanQuery ||
              String(o.customerPhone).includes(cleanQuery)
          );
          if (match) {
            setOrderData(match);
            setIsLoading(false);
            return;
          }
        }
      }

      if (!foundLocal) {
        setErrorMsg(`"${cleanQuery}" নম্বর দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার আইডি বা মোবাইল নম্বর দিন।`);
      }
    } catch (err: any) {
      if (!foundLocal) {
        setErrorMsg('সার্ভারের সাথে যোগাযোগ করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let targetId = (rawIdParam && rawIdParam !== 'track' && rawIdParam !== 'search') ? rawIdParam : '';

    if (!targetId && typeof window !== 'undefined') {
      try {
        const lastId = localStorage.getItem('ardhimart_last_order_id');
        if (lastId) targetId = lastId;
      } catch (e) {}
    }

    if (targetId) {
      setSearchQuery(targetId);
      fetchOrderDetails(targetId);
    }
  }, [rawIdParam]);

  const copyOrderId = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      notifySuccess('কপি হয়েছে', `অর্ডার আইডি #${id} ক্লিপবোর্ডে কপি করা হয়েছে`);
    }
  };

  const currentStatus = (orderData?.status || 'pending').toLowerCase();

  const timelineSteps = [
    {
      step: 1,
      title: 'Order Placed',
      titleBn: 'অর্ডার সফল হয়েছে',
      description: 'আপনার অর্ডারটি সফলভাবে সিস্টেমে যুক্ত হয়েছে এবং আমাদের টিম যাচাই করছে।',
      statusKey: 'pending',
      completed: true,
      current: currentStatus === 'pending',
    },
    {
      step: 2,
      title: 'Processing & Packaging',
      titleBn: 'প্রসেসিং ও প্যাকেজিং',
      description: 'পণ্য কোয়ালিটি চেক ও প্যাকিং সম্পন্ন করে কুরিয়ারে পাঠানোর জন্য প্রস্তুত করা হচ্ছে।',
      statusKey: 'processing',
      completed: ['processing', 'shipped', 'delivered'].includes(currentStatus),
      current: currentStatus === 'processing',
    },
    {
      step: 3,
      title: 'Out for Delivery',
      titleBn: 'কুরিয়ারে হস্তান্তর',
      description: 'কুরিয়ার পার্টনার আপনার ঠিকানায় পার্সেল পৌঁছে দেওয়ার উদ্দেশ্যে রওনা দিয়েছে।',
      statusKey: 'shipped',
      completed: ['shipped', 'delivered'].includes(currentStatus),
      current: currentStatus === 'shipped',
    },
    {
      step: 4,
      title: 'Delivered',
      titleBn: 'ডেলিভারি সম্পন্ন',
      description: 'পণ্যটি আপনার নিকট সফলভাবে হস্তান্তর করা হয়েছে। ArdhiMart-এর সাথে থাকার জন্য ধন্যবাদ!',
      statusKey: 'delivered',
      completed: currentStatus === 'delivered',
      current: currentStatus === 'delivered',
    },
  ];

  const orderNumber = orderData?.orderNumber || orderData?.id || searchQuery;
  const items = orderData?.order_items || orderData?.items || [];
  const totalAmount = orderData?.totalAmount || 0;
  const shippingFee = orderData?.shippingFee ?? 80;
  const discount = orderData?.discount || 0;
  const subtotal = orderData?.subtotal || (totalAmount > shippingFee ? totalAmount - shippingFee + discount : totalAmount);

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'delivered':
        return {
          text: 'ডেলিভারি সম্পন্ন (Delivered)',
          classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      case 'shipped':
        return {
          text: 'ডেলিভারিতে আছে (Out for Delivery)',
          classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          dot: 'bg-blue-500',
        };
      case 'processing':
        return {
          text: 'প্রসেসিং চলছে (Processing)',
          classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
        };
      default:
        return {
          text: 'অর্ডার কনফার্মড (Order Confirmed)',
          classes: 'bg-orange-500/10 text-[#FF6B00] border-[#FF6B00]/30',
          dot: 'bg-[#FF6B00]',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Desktop Breadcrumbs & Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <Link href="/" className="hover:text-[#FF6B00] transition-colors">হোম</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/account" className="hover:text-[#FF6B00] transition-colors">অ্যাকাউন্ট</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 dark:text-white font-bold">লাইভ পার্সেল ট্র্যাকিং</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>লাইভ পার্সেল ট্র্যাকিং</span>
              <span className="text-xs sm:text-sm font-extrabold uppercase px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 hidden sm:inline-block">
                Live Tracking
              </span>
            </h1>
          </div>

          <button
            onClick={() => router.back()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-300 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পেছনে যান</span>
          </button>
        </div>

        {/* Search Header Banner */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-gray-200/80 dark:border-slate-800 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mb-1.5">
              আপনার অর্ডারের বর্তমান অবস্থা জানুন
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              অর্ডার করার সময় প্রাপ্ত ইনভয়েস আইডি (যেমন: 1001) অথবা মোবাইল নম্বর লিখুন।
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchOrderDetails(searchQuery)}
                  placeholder="অর্ডার আইডি (যেমন: 1001) বা মোবাইল নম্বর লিখুন..."
                  className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
              </div>
              <button
                onClick={() => fetchOrderDetails(searchQuery)}
                disabled={isLoading}
                className="px-7 py-3 text-sm font-extrabold text-white bg-[#FF6B00] hover:bg-[#e05e00] rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>খোঁজা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>ট্র্যাক করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic States: Loading, Error, Empty, or Result */}
        {isLoading && !orderData ? (
          <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              অর্ডার #{searchQuery} এর লাইভ তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : errorMsg && !orderData ? (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/30 rounded-3xl border border-rose-200 dark:border-rose-900/50 space-y-3 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-10 h-10 mx-auto" />
            <h3 className="text-base font-extrabold">অর্ডার খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs sm:text-sm font-semibold max-w-md mx-auto">{errorMsg}</p>
          </div>
        ) : !orderData ? (
          <div className="p-12 sm:p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-slate-800 text-[#FF6B00] flex items-center justify-center mx-auto shadow-inner">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
              লাইভ পার্সেল ট্র্যাকিং পোর্টাল
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              আপনার অর্ডারের বর্তমান প্যাকেজিং ও কুরিয়ার ডেলিভারি স্ট্যাটাস দেখতে উপরের সার্চ বক্সে আপনার অর্ডার আইডি অথবা ফোন নম্বর দিন।
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Top Order Quick Info Strip */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Invoice / Tracking ID
                    </span>
                    <button
                      onClick={() => copyOrderId(String(orderNumber))}
                      className="p-1 text-gray-400 hover:text-[#FF6B00] transition-colors cursor-pointer"
                      title="কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                    #{orderNumber}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      অর্ডারের সময়:{' '}
                      {orderData.createdAt
                        ? new Date(orderData.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'সম্প্রতি'}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wide border flex items-center gap-2.5 ${statusBadge.classes}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${statusBadge.dot} animate-pulse`} />
                    <span>{statusBadge.text}</span>
                  </div>

                  <a
                    href="https://wa.me/8801895627138"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp হেল্পলাইন</span>
                  </a>
                </div>
              </div>

              {/* Desktop Horizontal Milestone Stepper */}
              <div className="pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-6">
                  ডেলিভারি মাইলস্টোন অগ্রগতি (Delivery Milestone)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                  {timelineSteps.map((step, idx) => {
                    return (
                      <div key={idx} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center relative gap-3 sm:gap-2 group">
                        {/* Connector line for desktop */}
                        {idx < timelineSteps.length - 1 && (
                          <div
                            className={`hidden sm:block absolute top-4 left-1/2 w-full h-1 -z-0 transition-all ${
                              step.completed ? 'bg-[#FF6B00]' : 'bg-gray-200 dark:bg-slate-800'
                            }`}
                          />
                        )}

                        {/* Step Bubble */}
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center z-10 shrink-0 font-extrabold text-xs transition-all ${
                            step.completed
                              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-400 border border-gray-300 dark:border-slate-700'
                          }`}
                        >
                          {step.completed ? <Check className="w-4 h-4 stroke-[3px]" /> : step.step}
                        </div>

                        {/* Step Label */}
                        <div className="space-y-0.5">
                          <p className={`text-xs font-extrabold ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                            {step.titleBn}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">
                            {step.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Live Tracking Activity Log */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <Truck className="w-5 h-5 text-[#FF6B00]" />
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                      লাইভ স্ট্যাটাস ও ট্র্যাকিং হিস্টোরি
                    </h3>
                  </div>

                  <div className="relative pl-3 space-y-8">
                    {timelineSteps.map((step, idx) => (
                      <div key={idx} className="relative flex gap-4 items-start">
                        {idx < timelineSteps.length - 1 && (
                          <div
                            className={`absolute left-3 top-6 bottom-0 w-0.5 -ml-px ${
                              step.completed ? 'bg-[#FF6B00]' : 'bg-gray-200 dark:bg-slate-800'
                            }`}
                          />
                        )}

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 mt-0.5 ${
                            step.completed
                              ? 'bg-[#FF6B00] text-white shadow-xs'
                              : 'bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700'
                          }`}
                        >
                          {step.completed ? (
                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                          )}
                        </div>

                        <div className={!step.completed ? 'opacity-40' : 'space-y-1'}>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                              {step.titleBn}
                            </h4>
                            <span className="text-[11px] font-semibold text-gray-400">
                              ({step.title})
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Shipping & Delivery Address Card */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <MapPin className="w-5 h-5 text-[#FF6B00]" />
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                      ডেলিভারি ও কাস্টমার ইনফরমেশন
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">
                        গ্রাহকের নাম ও মোবাইল
                      </span>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {orderData.customerName || 'গ্রাহকের নাম'}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#FF6B00]">
                        {orderData.customerPhone}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">
                        পেমেন্ট মেথড
                      </span>
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        <span>ক্যাশ অন ডেলিভারি (COD)</span>
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        পার্সেল রিসিভ করার সময় মূল্য পরিশোধযোগ্য
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-4 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">
                        সম্পূর্ণ ডেলিভারি ঠিকানা
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                        {orderData.shippingAddress || 'ঢাকা, বাংলাদেশ'}
                      </p>
                    </div>
                  </div>
                </section>

                {/* ArdhiMart Trust Guarantees */}
                <section className="bg-gradient-to-r from-orange-50/60 to-amber-50/40 dark:from-slate-900 dark:to-slate-800/60 rounded-3xl p-5 border border-orange-200/50 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                      ১০০% নিরাপদ ও নিশ্চিন্ত শপিং
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                      ডেলিভারি ম্যানের সামনে পার্সেলটি চেক করে মূল্য পরিশোধ করুন। যেকোনো সমস্যায় ৩ দিনের মধ্যে সহজ রিপ্লেসমেন্ট সুবিধা।
                    </p>
                  </div>
                </section>
              </div>

              {/* Right Column (lg:col-span-5) - Order Summary & Bill */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                {/* Items List Card */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#FF6B00]" />
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                        অর্ডারকৃত পণ্যসমূহ ({items.length})
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3.5 p-3 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-800"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName || item.title || 'Product'}
                            className="w-14 h-14 object-cover rounded-xl bg-gray-200 dark:bg-slate-700 shrink-0 border border-gray-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                            ছবি নেই
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                            {item.productName || item.title || 'Product Item'}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>পরিমাণ: <strong>{item.quantity || 1}</strong></span>
                            <span>•</span>
                            <span className="font-extrabold text-gray-900 dark:text-white">
                              ৳{(item.price || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Bill Breakdown */}
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>সাবটোটাল (Subtotal)</span>
                      <span className="font-bold text-gray-900 dark:text-white">৳{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>ডেলিভারি চার্জ (Delivery Charge)</span>
                      <span className="font-bold text-gray-900 dark:text-white">৳{shippingFee.toLocaleString()}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>কুপন ডিসকাউন্ট (Coupon Discount)</span>
                        <span>-৳{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-slate-800">
                      <span>সর্বমোট প্রদেয় বিল</span>
                      <span className="text-[#FF6B00]">৳{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </section>

                {/* Support Card */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    সহায়তা প্রয়োজন?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    অর্ডার পরিবর্তন অথবা জরুরি ডেলিভারির জন্য আমাদের কাস্টমার সাপোর্ট টিমে যোগাযোগ করুন।
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="tel:01895627138"
                      className="flex-1 py-2.5 px-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>কল করুন</span>
                    </a>
                    <a
                      href="https://wa.me/8801895627138"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
