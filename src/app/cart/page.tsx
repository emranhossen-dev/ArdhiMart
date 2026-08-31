'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { useStore } from '@/context/StoreContext';
import { notifySuccess, notifyError } from '@/lib/sweetalert';
import { ShoppingCart, Trash2, Plus, Minus, Lock, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, storeConfig, updateQuantity, removeFromCart } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'FIRST50') {
      setDiscountAmount(500);
      setAppliedCoupon('FIRST50');
      notifySuccess('Promo Coupon Applied!', '৳500 flat discount applied to your order total.');
    } else if (couponCode.trim().length > 0) {
      notifyError('Invalid Promo Code', 'Try using code "FIRST50" for ৳500 OFF!');
    }
  };

  const totalAmount = Math.max(0, subtotal - discountAmount);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-28">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your Cart
          </h1>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {cartItems.reduce((s, i) => s + i.quantity, 0)} Items
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
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 py-3 border-b border-gray-100 dark:border-slate-800 last:border-none relative group"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                          {product.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Category: {product.category}
                      </p>
                      <p className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">
                        {storeConfig.currency}
                        {product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800 h-8">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
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
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-2">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. FIRST50)"
                  className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 text-sm text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Coupon &quot;{appliedCoupon}&quot; applied (-{storeConfig.currency}500)!
                </p>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                Order Summary
              </h3>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                  <span>Total</span>
                  <span>
                    {storeConfig.currency}
                    {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full h-14 bg-black dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg active:scale-95 mt-4 cursor-pointer"
              >
                Proceed to Checkout
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
