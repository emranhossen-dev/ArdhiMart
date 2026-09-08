'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { useStore } from '@/context/StoreContext';
import { notifySuccess, notifyError, notifyInfo } from '@/lib/sweetalert';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Lock,
  ArrowRight,
  Tag,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, storeConfig, updateQuantity, removeFromCart } = useStore();

  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Track checked/selected item IDs for checkout
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  // Initialize selectedItemIds from sessionStorage or default to all items
  useEffect(() => {
    setIsMounted(true);
    if (cartItems.length > 0 && !hasInitializedSelection) {
      if (typeof window !== 'undefined') {
        try {
          const saved = sessionStorage.getItem('ardhimart_checkout_selected_ids');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const validIds = parsed.filter((id) =>
                cartItems.some((item) => item.product.id === id)
              );
              setSelectedItemIds(validIds.length > 0 ? validIds : cartItems.map((i) => i.product.id));
              setHasInitializedSelection(true);
              return;
            }
          }
        } catch (e) {}
      }
      setSelectedItemIds(cartItems.map((i) => i.product.id));
      setHasInitializedSelection(true);
    }
  }, [cartItems, hasInitializedSelection]);

  // Keep selectedItemIds synchronized when cart items change
  useEffect(() => {
    if (hasInitializedSelection && cartItems.length > 0) {
      setSelectedItemIds((prev) => {
        const valid = prev.filter((id) => cartItems.some((item) => item.product.id === id));
        return valid;
      });
    }
  }, [cartItems, hasInitializedSelection]);

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ardhimart_checkout_selected_ids', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === cartItems.length) {
      setSelectedItemIds([]);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ardhimart_checkout_selected_ids', JSON.stringify([]));
      }
    } else {
      const allIds = cartItems.map((i) => i.product.id);
      setSelectedItemIds(allIds);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ardhimart_checkout_selected_ids', JSON.stringify(allIds));
      }
    }
  };

  // Only checked items are considered active for subtotal and checkout
  const activeCartItems = cartItems.filter((item) => selectedItemIds.includes(item.product.id));

  const subtotal = activeCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Restore saved coupon on mount or re-validate if subtotal changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('ardhimart_applied_coupon');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.code) {
            setAppliedCoupon(parsed.code);
            // Re-calculate discount based on current subtotal if percentage
            if (parsed.type === 'percentage') {
              const recalculated = Math.round((subtotal * Number(parsed.value)) / 100);
              setDiscountAmount(recalculated);
            } else {
              setDiscountAmount(Number(parsed.discountAmount || parsed.value || 0));
            }
            setCouponMessage(parsed.message || `Coupon ${parsed.code} applied`);
          }
        }
      } catch (e) {}
    }
  }, [subtotal]);

  const handleApplyCoupon = async () => {
    const codeToTest = couponCode.trim().toUpperCase();
    if (!codeToTest) {
      notifyError('Coupon Required', 'Please enter a valid coupon code.');
      return;
    }

    if (subtotal <= 0) {
      notifyError('No Selected Items', 'Checkmark at least one item before applying coupon.');
      return;
    }

    setIsValidatingCoupon(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
      const res = await fetch(`${baseUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToTest,
          orderAmount: subtotal,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && data.valid) {
        setDiscountAmount(Number(data.discountAmount || 0));
        setAppliedCoupon(data.code);
        setCouponMessage(data.message || `Coupon ${data.code} applied!`);
        setCouponCode('');

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ardhimart_applied_coupon', JSON.stringify(data));
        }

        notifySuccess('Promo Coupon Applied!', data.message || `You saved ৳${data.discountAmount}!`);
      } else {
        const errorMsg = data?.message || 'Invalid or expired promo code';
        notifyError('Invalid Coupon', Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
      }
    } catch (err) {
      notifyError('Connection Error', 'Could not validate coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponMessage(null);
    setCouponCode('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ardhimart_applied_coupon');
    }
    notifyInfo('Coupon Removed', 'Promotional discount has been removed.');
  };

  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleProceedToCheckout = () => {
    if (activeCartItems.length === 0) {
      notifyError(
        'পণ্য নির্বাচন করুন',
        'চেকআউট এ যাওয়ার জন্য অনুগ্রহ করে অন্তত একটি পণ্যের পাশে চেকমার্ক টিক দিন।'
      );
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ardhimart_checkout_selected_ids', JSON.stringify(selectedItemIds));
    }
    router.push('/checkout');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-28">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Your Cart
            </h1>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800" />
            <div className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800" />
          </div>
        </main>
        <Footer className="hidden md:block" />
        <BottomNavBar />
      </div>
    );
  }

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 lg:pb-16">
        {/* Desktop Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-bold">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-200/70 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Shopping Cart</span>
              {cartItems.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6B00] border border-orange-200 dark:border-orange-800">
                  {activeCartItems.length} of {cartItems.length} Selected
                </span>
              )}
            </h1>
            {cartItems.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                যে পণ্যগুলো এখন কিনতে চান সেগুলো টিক দিন। আন-চেক করা পণ্যগুলো কার্টেই সেভ থাকবে।
              </p>
            )}
          </div>

          {cartItems.length > 0 && (
            <Link
              href="/products"
              className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>+ Add more products</span>
            </Link>
          )}
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-slate-800/80 flex items-center justify-center mb-6 mx-auto text-[#FF6B00]">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Looks like you haven&apos;t added any products to your shopping cart yet. Explore our trending products and hot deals today!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* 2-Column Responsive Desktop Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List (col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Select All Bar Card */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer select-none font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-[#FF6B00] transition-colors">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B00] accent-[#FF6B00] rounded cursor-pointer"
                  />
                  <span>Select All ({selectedItemIds.length} of {cartItems.length} items)</span>
                </label>

                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Only checked items proceed to checkout</span>
                </span>
              </div>

              {/* Items Card Container */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl divide-y divide-gray-100 dark:divide-slate-800 shadow-sm overflow-hidden">
                {cartItems.map(({ product, quantity, selectedVariant }) => {
                  const isSelected = selectedItemIds.includes(product.id);
                  const itemTotal = product.price * quantity;

                  return (
                    <div
                      key={`${product.id}-${selectedVariant || ''}`}
                      className={`p-4 sm:p-5 flex items-start gap-3 sm:gap-5 transition-all ${
                        isSelected
                          ? 'bg-transparent'
                          : 'bg-gray-50/50 dark:bg-slate-950/40 opacity-70'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="pt-2 sm:pt-6 shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(product.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B00] accent-[#FF6B00] rounded cursor-pointer"
                          title={isSelected ? 'Uncheck to exclude' : 'Check to include'}
                        />
                      </div>

                      {/* Product Thumbnail */}
                      <Link
                        href={`/products/${product.urlSlug || product.id}`}
                        className="w-20 h-24 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200/60 dark:border-slate-700/60 hover:opacity-95 transition-opacity"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Info & Controls */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 sm:py-1">
                        <div>
                          <div className="flex items-start justify-between gap-3 pr-2">
                            <Link
                              href={`/products/${product.urlSlug || product.id}`}
                              className="font-bold text-xs sm:text-base text-gray-900 dark:text-white hover:text-[#FF6B00] transition-colors line-clamp-2"
                            >
                              {product.title}
                            </Link>

                            <button
                              onClick={() => removeFromCart(product.id)}
                              aria-label="Remove item"
                              className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                              title="Delete from cart"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {product.category && (
                              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                {product.category}
                              </span>
                            )}
                            {selectedVariant && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                                Variant: {selectedVariant}
                              </span>
                            )}
                            {!isSelected && (
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/50">
                                Unchecked (Saved for later)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Bar */}
                        <div className="flex flex-wrap items-end justify-between gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-3">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800 h-9">
                              <button
                                onClick={() => updateQuantity(product.id, -1)}
                                disabled={quantity <= 1}
                                className={`w-8 sm:w-9 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 ${
                                  quantity <= 1
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer'
                                }`}
                                title="Decrease"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-9 text-center text-xs font-black text-gray-900 dark:text-white">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, 1)}
                                className="w-8 sm:w-9 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
                                title="Increase"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-xs text-gray-400 hidden sm:inline">
                              ৳{product.price.toLocaleString()} each
                            </span>
                          </div>

                          {/* Line Total */}
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                              {storeConfig.currency}
                              {itemTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust Badges Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF6B00] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">Fast Nationwide Delivery</p>
                    <p className="text-[11px] text-gray-500">24-48 hrs in Dhaka, 2-3 days outside</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">100% Genuine Products</p>
                    <p className="text-[11px] text-gray-500">Directly sourced & verified authentic</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-500 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">3-Day Easy Return</p>
                    <p className="text-[11px] text-gray-500">Hassle-free replacement policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary & Promo Code (col-span-4) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              {/* Promo Code Input Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B00]" />
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Have a Coupon Code?
                  </label>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 truncate">
                          {appliedCoupon} Applied (-{storeConfig.currency}{discountAmount})
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate">
                          {couponMessage || `৳${discountAmount} discount applied`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer px-2 py-1 transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="e.g. SAVE100"
                      className="flex-1 h-11 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 text-xs text-gray-900 dark:text-white uppercase font-mono outline-none focus:border-[#FF6B00] transition-colors"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="h-11 px-5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidatingCoupon ? 'Validating...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                  <h2 className="font-extrabold text-base text-gray-900 dark:text-white">
                    Order Summary
                  </h2>
                  <span className="text-xs font-bold text-[#FF6B00]">
                    {activeCartItems.length} {activeCartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Selected Items Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {storeConfig.currency}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Coupon Discount</span>
                      <span>
                        -{storeConfig.currency}
                        {discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      Calculated at checkout by district
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-gray-900 dark:text-white block">
                        Estimated Total
                      </span>
                      <span className="text-[10px] text-gray-400">VAT & Taxes included</span>
                    </div>
                    <span className="text-xl font-black text-[#FF6B00]">
                      {storeConfig.currency}
                      {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Unchecked Info Note */}
                {activeCartItems.length < cartItems.length && (
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {cartItems.length - activeCartItems.length}টি আনচেক করা পণ্য কার্টেই সংরক্ষিত থাকবে।
                    </span>
                  </div>
                )}

                {/* Desktop Primary Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={activeCartItems.length === 0}
                  className={`w-full h-13 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    activeCartItems.length > 0
                      ? 'bg-[#FF6B00] hover:bg-[#e05e00] text-white active:scale-98 shadow-orange-500/20'
                      : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout ({activeCartItems.length} Items)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit SSL Encrypted & 100% Secure Checkout</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Mobile Bottom Action Bar (Only on mobile < lg) */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 p-3.5 z-40 shadow-2xl">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">Total Payable</span>
              <span className="text-base font-black text-[#FF6B00]">
                {storeConfig.currency}
                {totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={activeCartItems.length === 0}
              className={`flex-1 h-11 px-5 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                activeCartItems.length > 0
                  ? 'bg-[#FF6B00] hover:bg-[#e05e00] text-white active:scale-95'
                  : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Checkout ({activeCartItems.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
