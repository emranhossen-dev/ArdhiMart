'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Lock } from 'lucide-react';

export const TrustBadgesBar: React.FC = () => {
  const badges = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: '24-48h Delivery in BD',
    },
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery',
      desc: 'Pay when product arrives',
    },
    {
      icon: RefreshCw,
      title: '3-Day Replacement',
      desc: 'Instant replacement guarantee',
    },
    {
      icon: Lock,
      title: '100% Secure',
      desc: 'Encrypted payment checkout',
    },
  ];

  return (
    <section className="bg-gray-100/70 dark:bg-slate-900/60 border-y border-gray-200/80 dark:border-slate-800 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {badges.map((b, idx) => {
          const IconComponent = b.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/60 dark:border-slate-800 shadow-xs"
            >
              <div className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-black dark:text-white shrink-0">
                <IconComponent className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                  {b.title}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustBadgesBar;
