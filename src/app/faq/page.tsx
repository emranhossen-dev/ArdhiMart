'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { ChevronDown, HelpCircle, Truck, CreditCard, ShieldCheck } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: FAQCategory[] = [
    {
      title: 'অর্ডার ও ডেলিভারি',
      icon: <Truck className="w-5 h-5 text-orange-500" />,
      items: [
        {
          q: 'ডেলিভারি পেতে কতদিন সময় লাগে?',
          a: 'ঢাকার ভেতরে ডেলিভারি সাধারণত ২৪ থেকে ৪৮ ঘণ্টা সময় নেয়। আর ঢাকার বাইরে ডেলিভারি পৌঁছাতে ২ থেকে ৪ কার্যদিবস (Business Days) সময় লাগতে পারে। আবহাওয়া বা বিশেষ পরিস্থিতির কারণে কখনো কখনো কিছুটা বিলম্ব হতে পারে।',
        },
        {
          q: 'ডেলিভারি চার্জ কত?',
          a: 'ঢাকার ভেতরে হোম ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে (সারা বাংলাদেশে) কুরিয়ার চার্জ ১২০ টাকা। তবে বিশেষ ক্যাম্পেইন চলাকালীন সময়ে ফ্রি ডেলিভারি অফার থাকতে পারে।',
        },
        {
          q: 'আমার অর্ডারটি কীভাবে ট্র্যাক করবো?',
          a: 'অর্ডার কনফার্ম হওয়ার পর আপনি এসএমএস (SMS)-এর মাধ্যমে একটি ট্র্যাকিং লিঙ্ক পেয়ে যাবেন। এছাড়াও আমাদের ওয়েবসাইটের "Track Order" পেজে গিয়ে আপনার অর্ডার আইডি দিয়ে লাইভ স্ট্যাটাস দেখতে পারবেন।',
        },
        {
          q: 'অর্ডার করার পর কি ক্যানসেল করা যাবে?',
          a: 'অর্ডার কনফার্মেশনের জন্য আমাদের প্রতিনিধি কল করার সময় আপনি চাইলে অর্ডারটি বাতিল করতে পারবেন। তবে পার্সেল কুরিয়ারে হ্যান্ডওভার হয়ে গেলে ক্যানসেল করা সম্ভব নয়।',
        }
      ]
    },
    {
      title: 'পেমেন্ট ও রিফান্ড',
      icon: <CreditCard className="w-5 h-5 text-blue-500" />,
      items: [
        {
          q: 'ক্যাশ অন ডেলিভারি (COD) কি এভেইলেবল?',
          a: 'হ্যাঁ! বাংলাদেশের ৬৪টি জেলাতেই আমাদের ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। আপনি প্রোডাক্ট হাতে পেয়ে ডেলিভারি ম্যানকে সরাসরি পেমেন্ট করতে পারবেন।',
        },
        {
          q: 'কী কী পেমেন্ট মেথড সাপোর্ট করে?',
          a: 'আপনি বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), এবং যেকোনো ভিসা বা মাস্টারকার্ডের মাধ্যমে অগ্রিম পেমেন্ট করতে পারবেন।',
        },
        {
          q: 'অ্যাডভান্স পেমেন্ট করলে কি কোনো ডিসকাউন্ট আছে?',
          a: 'হ্যাঁ, ফুল অ্যাডভান্স পেমেন্টে অনেক সময় আমাদের স্পেশাল ডিসকাউন্ট বা ফ্রি ডেলিভারি অফার থাকে, যা চেকআউট পেজে দেখতে পাবেন।',
        }
      ]
    },
    {
      title: 'প্রোডাক্ট ও রিটার্ন পলিসি',
      icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
      items: [
        {
          q: 'প্রোডাক্ট ড্যামেজ বা ভুল প্রোডাক্ট পেলে কী করবো?',
          a: 'ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করে রিসিভ করার অনুরোধ করা হচ্ছে। যদি প্রোডাক্টে কোনো ত্রুটি থাকে বা ভুল প্রোডাক্ট যায়, তবে সাথে সাথে ডেলিভারি ম্যানকে ফেরত দিন অথবা আমাদের হটলাইনে কল করুন।',
        },
        {
          q: 'প্রোডাক্ট পছন্দ না হলে কি রিটার্ন করা যাবে?',
          a: 'যদি প্রোডাক্টের ছবি এবং বর্ণনার সাথে বাস্তবের প্রোডাক্টের মিল না থাকে, তবে আপনি ৩ দিনের রিপ্লেসমেন্ট পলিসির আওতায় এটি পরিবর্তন করতে পারবেন। তবে শুধুমাত্র পছন্দ হয়নি, এমন কারণে রিটার্ন গ্রহণযোগ্য নয়।',
        },
        {
          q: 'প্রোডাক্টের কি কোনো গ্যারান্টি বা ওয়ারেন্টি আছে?',
          a: 'ইলেকট্রনিক্স এবং গ্যাজেট আইটেমগুলোতে নির্দিষ্ট সময়ের ওয়ারেন্টি থাকে যা প্রোডাক্টের ডেসক্রিপশনে উল্লেখ করা থাকে। ফ্যাশন বা গিফট আইটেমগুলোর ক্ষেত্রে ম্যানুফ্যাকচারিং ডিফেক্ট থাকলে রিপ্লেসমেন্ট দেওয়া হয়।',
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      {/* Hero Header for FAQ */}
      <div className="bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950 pt-10 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <HelpCircle className="w-4 h-4" /> কাস্টমার সাপোর্ট
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            অর্ডার, ডেলিভারি এবং পেমেন্ট সংক্রান্ত আপনার যেকোনো প্রশ্নের উত্তর নিচে দেওয়া হলো। 
            পছন্দের ক্যাটাগরি থেকে আপনার উত্তরটি জেনে নিন।
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {faqData.map((category, catIdx) => (
            <button
              key={catIdx}
              onClick={() => {
                setOpenCategory(catIdx);
                setOpenIndex(0);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm ${
                openCategory === catIdx
                  ? 'bg-black text-white dark:bg-white dark:text-black scale-105 shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
              }`}
            >
              {category.icon}
              {category.title}
            </button>
          ))}
        </div>

        {/* Accordion Content */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-500">
          <div className="space-y-4">
            {faqData[openCategory].items.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm' 
                      : 'border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left gap-4 p-4 sm:p-5 font-bold text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none"
                  >
                    <span className="flex-1 leading-snug">{faq.q}</span>
                    <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-orange-500 text-white rotate-180' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                    }`}>
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>
                  
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 sm:p-5 pt-0 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Support Block */}
        <div className="mt-12 bg-gray-900 dark:bg-slate-800 text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/20 to-purple-600/20 pointer-events-none" />
          <h3 className="text-2xl font-black mb-3">আরও কিছু জানার আছে?</h3>
          <p className="text-gray-300 text-sm font-medium mb-6 max-w-md mx-auto">
            আপনার প্রশ্নের উত্তর এখানে না পেলে সরাসরি আমাদের কাস্টমার সাপোর্ট টিমের সাথে যোগাযোগ করুন।
          </p>
          <a
            href="tel:+8801700000000"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg hover:shadow-orange-500/50"
          >
            কল করুন হটলাইনে
          </a>
        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
