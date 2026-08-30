'use client';

import React, { useState } from 'react';
import { Product } from '@/types/store';
import { Search, X, Star } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: string;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(query.toLowerCase()))
      )
    : products.slice(0, 3); // Default show top products

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6 md:p-20 flex justify-center items-start cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-scale-in cursor-default"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, brands..."
            className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-white placeholder-gray-400 font-medium"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            {query.trim() ? `Search Results (${filteredProducts.length})` : 'Popular Searches'}
          </p>

          {filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No products found matching &quot;{query}&quot;
            </p>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-14 h-14 object-cover rounded-lg bg-gray-100 dark:bg-slate-700 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {prod.title}
                  </h5>
                  <p className="text-xs text-gray-400 font-medium">
                    {prod.category} {prod.brand ? `• ${prod.brand}` : ''}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                    {currency}
                    {prod.price.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-end gap-0.5 text-xs text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
