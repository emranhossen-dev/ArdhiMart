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
  AlertCircle
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
        'প্রোডাক্ট সিলেক্ট করুন',
        'চেকআউট এ যাওয়ার জন্য অনুগ্রহ করে অন্তত একটি প্রোডাক্টের পাশে চেকমার্ক টিক দিন।'
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
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-28">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Your Cart
            </h1>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800" />
            <div className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800" />
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
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-28">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Your Cart
              {cartItems.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {activeCartItems.length} of {cartItems.length} Selected
                </span>
              )}
            </h1>
            {cartItems.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                যে প্রোডাক্টগুলো এখন অর্ডার করতে চান সেগুলো টিক দিন। আন-চেক করা প্রোডাক্টগুলো কার্টেই থাকবে।
              </p>
            )}
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {cartItems.reduce((s, i) => s + i.quantity, 0)} Total in Cart
          </span>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Looks like you haven&apos;t added anything to your shopping cart yet.
            </p>
            <Link
              href="/products"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items List */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
              {/* Select All Checkbox Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer select-none font-bold text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <span>Select All ({selectedItemIds.length}/{cartItems.length})</span>
                </label>

                <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Only checked items go to checkout</span>
                </div>
              </div>

              {cartItems.map(({ product, quantity }) => {
                const isSelected = selectedItemIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`flex items-start gap-3 sm:gap-4 py-3.5 border-b border-gray-100 dark:border-slate-800 last:border-none relative rounded-xl transition-all ${
                      isSelected
                        ? 'bg-transparent'
                        : 'opacity-65 bg-gray-50/60 dark:bg-slate-950/30 px-2'
                    }`}
                  >
                    {/* Item Checkbox */}
                    <div className="pt-2 sm:pt-4 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(product.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-indigo-600 rounded cursor-pointer transition hover:scale-110"
                        title={isSelected ? 'চেকআউট তালিকা থেকে বাদ দিন' : 'চেকআউট তালিকায় যুক্ত করুন'}
                      />
                    </div>

                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200/50 dark:border-slate-800"
                    />

                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start pr-6">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                            {product.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Category: {product.category}
                        </p>

                        {!isSelected && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                            Saved for later (Unchecked)
                          </span>
                        )}

                        <p className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">
                          {storeConfig.currency}
                          {product.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800 h-8">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={quantity <= 1}
                            className={`w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 ${
                              quantity <= 1
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer'
                            }`}
                            title={quantity <= 1 ? 'Use trash icon to delete item' : 'Decrease'}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      aria-label="Remove item"
                      className="absolute top-3 right-0 text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="কার্ট থেকে সম্পূর্ণ ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Input */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-2">
                Promo Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                        {appliedCoupon} Applied (-{storeConfig.currency}{discountAmount})
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        {couponMessage || `Discount of ৳${discountAmount} applied to cart`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer px-2 py-1 transition-colors"
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
                    placeholder="Enter code (e.g. FD20)"
                    className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 text-sm text-gray-900 dark:text-white uppercase font-mono outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {activeCartItems.length} items selected
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal ({activeCartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {storeConfig.currency}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Promo Discount</span>
                    <span>-{storeConfig.currency}{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-500">Calculated at checkout</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-slate-800">
                  <span>Total Payable</span>
                  <span>
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
                    {cartItems.length - activeCartItems.length}টি আনচেক করা প্রোডাক্ট কার্টেই সেভ থাকবে, সেগুলো অর্ডার হবে না।
                  </span>
                </div>
              )}

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                disabled={activeCartItems.length === 0}
                className={`w-full h-14 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg mt-4 cursor-pointer ${
                  activeCartItems.length > 0
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95'
                    : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Proceed to Checkout ({activeCartItems.length} Items)
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 pt-1">
                <Lock className="w-3.5 h-3.5" /> 100% Encrypted & Secure Checkout
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
