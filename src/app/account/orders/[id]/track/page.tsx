'use client';

export const runtime = 'edge';

import React, { useState, useEffect, use } from 'react';
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
  CheckCircle2
} from 'lucide-react';

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

    // Check localStorage cache first for immediate rendering
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
    let targetId = (rawIdParam && rawIdParam !== 'track') ? rawIdParam : '';

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

  const currentStatus = (orderData?.status || 'pending').toLowerCase();

  const timelineSteps = [
    {
      title: 'Order Placed (অর্ডার সফল হয়েছে)',
      description: 'আপনার অর্ডারটি সিস্টেমে যুক্ত হয়েছে।',
      statusKey: 'pending',
      completed: true,
    },
    {
      title: 'Processing & Packaging (প্রসেসিং চলছে)',
      description: 'পণ্যটি চেক করে প্যাকেজিং সম্পন্ন করা হচ্ছে।',
      statusKey: 'processing',
      completed: ['processing', 'shipped', 'delivered'].includes(currentStatus),
    },
    {
      title: 'Out for Delivery (কুরিয়ারে হস্তান্তর)',
      description: 'কুরিয়ার পার্টনার আপনার ঠিকানায় ডেলিভারি নিয়ে রওনা দিয়েছে।',
      statusKey: 'shipped',
      completed: ['shipped', 'delivered'].includes(currentStatus),
    },
    {
      title: 'Delivered (ডেলিভারি সম্পন্ন)',
      description: 'পণ্যটি আপনার নিকট সফলভাবে পৌঁছে দেওয়া হয়েছে।',
      statusKey: 'delivered',
      completed: currentStatus === 'delivered',
    },
  ];

  const orderNumber = orderData?.orderNumber || orderData?.id || searchQuery;
  const items = orderData?.order_items || orderData?.items || [];
  const totalAmount = orderData?.totalAmount || 0;
  const shippingFee = orderData?.shippingFee ?? 80;
  const subtotal = orderData?.subtotal || (totalAmount > shippingFee ? totalAmount - shippingFee : totalAmount);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans pb-24">
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পেছনে যান</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            অর্ডার ট্র্যাকিং (Order Tracking)
          </h1>
          <div className="w-16" />
        </div>

        {/* Search Input Box */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
            অর্ডার আইডি অথবা মোবাইল নম্বর দিয়ে খুঁজুন
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrderDetails(searchQuery)}
              placeholder="e.g. 1001 or 017XXXXXXXX"
              className="flex-1 px-4 py-3 text-sm bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white font-mono focus:outline-none focus:border-[#FF6B00]"
            />
            <button
              onClick={() => fetchOrderDetails(searchQuery)}
              disabled={isLoading}
              className="px-6 py-3 text-xs font-extrabold text-white bg-[#FF6B00] hover:bg-[#e05e00] rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>ট্র্যাক করুন</span>
            </button>
          </div>
        </div>

        {isLoading && !orderData ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-sm">
            <Clock className="w-10 h-10 text-[#FF6B00] animate-spin mx-auto" />
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              অর্ডার #{searchQuery} এর তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : errorMsg && !orderData ? (
          <div className="p-6 text-center bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="text-xs sm:text-sm font-bold">{errorMsg}</p>
          </div>
        ) : orderData ? (
          <div className="space-y-6 animate-fade-in">
            {/* Top Order Stats Card */}
            <section className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Order Number
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                    #{orderNumber}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-500/10 text-[#FF6B00] border border-[#FF6B00]/20 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    {currentStatus === 'delivered'
                      ? 'ডেলিভারি সম্পন্ন'
                      : currentStatus === 'shipped'
                      ? 'ডেলিভারিতে আছে'
                      : currentStatus === 'processing'
                      ? 'প্রসেসিং চলছে'
                      : 'অর্ডার কনফার্মড'}
                  </span>
                </div>
              </div>

              {/* Customer & Delivery Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">ডেলিভারি ঠিকানা</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5 leading-relaxed">
                      {orderData.shippingAddress || 'Dhaka, Bangladesh'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <Phone className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">গ্রাহকের তথ্য</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                      {orderData.customerName || 'Customer'}
                    </p>
                    <p className="text-gray-500 font-mono mt-0.5">
                      {orderData.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <CreditCard className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">পেমেন্ট মাধ্যম</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ক্যাশ অন ডেলিভারি (Cash on Delivery)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">অর্ডারের তারিখ</span>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                      {orderData.createdAt
                        ? new Date(orderData.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'সম্প্রতি'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Tracking Progress Timeline */}
            <section className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
                ডেলিভারি অগ্রগতি (Delivery Progress)
              </h3>

              <div className="relative pl-3 space-y-6 pt-2">
                {timelineSteps.map((step, idx) => {
                  return (
                    <div key={idx} className="relative flex gap-3.5 items-start">
                      {idx < timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-2.5 top-5 bottom-0 w-0.5 -ml-px ${
                            step.completed ? 'bg-[#FF6B00]' : 'bg-gray-200 dark:bg-slate-800'
                          }`}
                        />
                      )}

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center z-10 shrink-0 mt-0.5 ${
                          step.completed
                            ? 'bg-[#FF6B00] text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700'
                        }`}
                      >
                        {step.completed && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>

                      <div className={!step.completed ? 'opacity-40' : ''}>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Ordered Items List */}
            <section className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                    অর্ডারকৃত পণ্যসমূহ ({items.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 bg-gray-50/80 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName || item.title || 'Product'}
                        className="w-14 h-14 object-cover rounded-xl bg-gray-200 dark:bg-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-gray-400">
                        No Image
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

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>সাবটোটাল (Subtotal)</span>
                  <span className="font-bold text-gray-900 dark:text-white">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>ডেলিভারি চার্জ (Shipping)</span>
                  <span className="font-bold text-gray-900 dark:text-white">৳{shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-slate-800">
                  <span>সর্বমোট মূল্য (Total Amount)</span>
                  <span className="text-[#FF6B00]">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {/* Support Card */}
        <section className="text-center p-4 bg-orange-50/40 dark:bg-slate-900/40 border border-orange-100 dark:border-slate-800 rounded-2xl">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            অর্ডার নিয়ে কোনো প্রশ্ন বা জরুরি সহায়তার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন
          </p>
          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
          </a>
        </section>
      </main>

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
