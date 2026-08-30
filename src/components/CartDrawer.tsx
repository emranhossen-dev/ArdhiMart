'use client';

import React from 'react';
import { CartItem } from '@/types/store';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: string;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end items-start pt-16 pr-2 sm:pr-4">
      {/* Backdrop Overlay - Click Outside to Close */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in cursor-pointer"
      />

      {/* Dynamic Height Cart Drawer (Max 85vh height, Max 60vw width, Smooth Transition) */}
      <div className="relative z-10 w-full max-w-[92vw] sm:max-w-md lg:max-w-[60vw] max-h-[85vh] bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out animate-slide-up">
        {/* Drawer Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#FF6B00]" />
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              Shopping Cart ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-orange-50/60 dark:bg-slate-950 p-2.5 border-b border-orange-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
            <span>
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  🎉 FREE Shipping Unlocked!
                </span>
              ) : (
                <>Add {currency}{(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery</>
              )}
            </span>
            <span className="font-bold text-[#FF6B00]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FF6B00] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic Items List Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 min-h-[120px]">
          {items.length === 0 ? (
            <div className="py-8 text-center text-gray-400 space-y-2">
              <ShoppingBag className="w-10 h-10 stroke-1 mx-auto text-gray-300 dark:text-slate-700" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Your shopping bag is empty
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-200/80 dark:border-slate-800/80"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-16 object-cover rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-1">
                        {product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        aria-label="Remove item"
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-[11px] font-bold text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-xs text-gray-900 dark:text-white">
                      {currency}
                      {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary & 2 Action Buttons (Checkout & Continue Shopping) */}
        {items.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {currency}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Shipping:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {subtotal >= freeShippingThreshold ? 'FREE' : `${currency}120`}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white pt-1.5 border-t border-gray-100 dark:border-slate-800">
                <span>Total:</span>
                <span className="text-[#FF6B00]">
                  {currency}
                  {(
                    subtotal + (subtotal >= freeShippingThreshold ? 0 : 120)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* TWO BUTTONS: CHECKOUT & CONTINUE SHOPPING */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-3 border border-gray-300 dark:border-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-center"
              >
                Continue Shopping
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="btn-shimmer w-full py-2 px-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-md flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
