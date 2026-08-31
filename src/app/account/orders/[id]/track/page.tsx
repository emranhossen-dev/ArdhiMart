'use client';

export const runtime = 'edge';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  ArrowLeft,
  Truck,
  Check,
  HelpCircle,
  Search,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawIdParam = resolvedParams?.id || '';
  const initialSearchId = (rawIdParam && rawIdParam !== 'track') ? rawIdParam : '';

  const { products } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialSearchId);
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrderDetails = async (idOrPhone: string) => {
    if (!idOrPhone || !idOrPhone.trim()) {
      setErrorMsg('Please enter an Order ID (e.g. 980) or Mobile Number.');
      return;
    }

    const cleanQuery = idOrPhone.trim();
    setIsLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
      
      // Try Direct ID lookup first
      const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data.orderNumber)) {
          setOrderData(data);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: Search orders list by query
      const listRes = await fetch(`${baseUrl}/orders?search=${encodeURIComponent(cleanQuery)}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData) && listData.length > 0) {
          setOrderData(listData[0]);
          setIsLoading(false);
          return;
        }
      }

      // Fallback 2: Check all orders list if small dataset
      const allRes = await fetch(`${baseUrl}/orders`);
      if (allRes.ok) {
        const allData = await allRes.json();
        if (Array.isArray(allData)) {
          const match = allData.find((o: any) => 
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

      setErrorMsg(`No active order found for ID or Phone #${cleanQuery}`);
    } catch (err: any) {
      setErrorMsg('Could not connect to tracking server. Please verify your order number.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearchId) {
      fetchOrderDetails(initialSearchId);
    }
  }, [initialSearchId]);

  const currentStatus = (orderData?.status || 'pending').toLowerCase();

  const timelineSteps = [
    {
      title: 'Order Placed (অর্ডার সফল হয়েছে)',
      description: 'We have received your order.',
      statusKey: 'pending',
      completed: true,
    },
    {
      title: 'Processing (প্রসেসিং চলছে)',
      description: 'Order packed & prepared for shipment.',
      statusKey: 'processing',
      completed: ['processing', 'shipped', 'delivered'].includes(currentStatus),
    },
    {
      title: 'Out for Delivery (ডেলিভারিতে আছে)',
      description: 'Courier partner is delivering to your address.',
      statusKey: 'shipped',
      completed: ['shipped', 'delivered'].includes(currentStatus),
    },
    {
      title: 'Delivered (ডেলিভারি সম্পন্ন)',
      description: 'Order confirmed delivered by courier.',
      statusKey: 'delivered',
      completed: currentStatus === 'delivered',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans pb-12 select-none">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 h-16 flex items-center justify-between px-4">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
          TRACK ORDER
        </span>

        <div className="w-9" />
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-5">
        {/* Search Input Box */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
            Enter Order ID (e.g. 980) or Mobile Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrderDetails(searchQuery)}
              placeholder="e.g. 980 or 01700000000"
              className="flex-1 px-4 py-2.5 text-xs bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => fetchOrderDetails(searchQuery)}
              disabled={isLoading}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Track
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2">
            <Clock className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500">Searching Order #{searchQuery}...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-6 text-center bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="text-xs font-bold">{errorMsg}</p>
          </div>
        ) : orderData ? (
          <>
            {/* Order Header Summary */}
            <section className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">
                    Order #{orderData.orderNumber || orderData.id}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Customer: <strong className="text-gray-900 dark:text-white">{orderData.customerName}</strong> ({orderData.customerPhone})
                  </p>
                </div>

                <div className="bg-indigo-600 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Truck className="w-3.5 h-3.5" />
                  {orderData.status || 'PENDING'}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                {(orderData.order_items || orderData.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-200 dark:bg-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-gray-400">
                        Img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {item.productName || 'Product Item'}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Qty: {item.quantity || 1} • ৳{item.price || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tracking Timeline */}
            <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
                Live Order Progress
              </h2>

              <div className="relative pl-3 space-y-6">
                {timelineSteps.map((step, idx) => {
                  return (
                    <div key={idx} className="relative flex gap-3.5 items-start">
                      {idx < timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-2.5 top-5 bottom-0 w-0.5 -ml-px ${
                            step.completed ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-800'
                          }`}
                        />
                      )}

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center z-10 shrink-0 mt-0.5 ${
                          step.completed
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700'
                        }`}
                      >
                        {step.completed && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>

                      <div className={!step.completed ? 'opacity-50' : ''}>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}

        {/* Support Link */}
        <section className="pt-2 flex justify-center">
          <button
            onClick={() => alert('Customer Support Hotline: +8801700000000')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" /> Need help with tracking?
          </button>
        </section>
      </main>
    </div>
  );
}
