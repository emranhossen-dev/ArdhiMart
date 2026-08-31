'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Tamim Iqbal',
      role: 'Verified Buyer',
      rating: 5,
      comment:
        'Outstanding product quality and packaging! Delivered inside Dhaka within 24 hours via Steadfast Courier. Highly recommended storefront!',
      avatar: '/logo.png',
    },
    {
      name: 'Nusrat Jahan',
      role: 'Verified Buyer',
      rating: 5,
      comment:
        'The minimalist ceramic vase looks even better in real life. Smooth checkout experience and fast customer service support.',
      avatar: '/logo.png',
    },
    {
      name: 'Tanvir Hossain',
      role: 'Verified Buyer',
      rating: 5,
      comment:
        'Cash on delivery was smooth and the rider let me inspect product before paying. Best e-commerce shopping experience in BD!',
      avatar: '/logo.png',
    },
  ];

  return (
    <section className="py-12 px-4 bg-gray-50/80 dark:bg-slate-900/40 border-y border-gray-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs uppercase tracking-widest bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>4.9 / 5.0 Rating from 5,000+ Customers</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            What Our Customers Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 relative"
            >
              <Quote className="w-8 h-8 text-gray-200 dark:text-slate-800 absolute top-4 right-4" />

              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  &quot;{r.comment}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    {r.name}
                  </h4>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ {r.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
