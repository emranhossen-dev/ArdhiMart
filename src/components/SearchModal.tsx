'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/store';
import { Search, Star } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: string;
  onSelectProduct: (product: Product) => void;
  initialQuery?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [executedQuery, setExecutedQuery] = useState(initialQuery);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setExecutedQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleSearchExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setExecutedQuery(query.trim());
  };

  const searchTerm = executedQuery || query;
  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : products.slice(0, 4); // Default top products if empty

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 md:p-20 flex justify-center items-start cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-scale-in cursor-default mt-8 sm:mt-0"
      >
        {/* Search Input Bar with Search Icon on Right (No Cross X Button) */}
        <form
          onSubmit={handleSearchExecute}
          className="p-3 sm:p-4 border-b border-gray-200 dark:border-slate-800 flex items-center"
        >
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchExecute();
                }
              }}
              placeholder="Search products, categories, brands..."
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md pl-3 pr-12 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
            />
            {/* Search Icon Button on Right Side */}
            <button
              type="submit"
              onClick={handleSearchExecute}
              aria-label="Execute Search"
              className="absolute right-0 top-0 bottom-0 px-3.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-r-md flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results List */}
        <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {searchTerm.trim() ? `Matched Results (${filteredProducts.length})` : 'Popular Searches'}
            </p>
            <button
              onClick={onClose}
              className="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-1">
              <Search className="w-8 h-8 text-gray-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                No products found matching &quot;{searchTerm}&quot;
              </p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center gap-3 sm:gap-4 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-800"
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg bg-gray-100 dark:bg-slate-700 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {prod.title}
                  </h5>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                    {prod.category} {prod.brand ? `• ${prod.brand}` : ''}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {currency}
                    {prod.price.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-end gap-0.5 text-[10px] sm:text-xs text-amber-500 font-bold mt-0.5">
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
