'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { FileText, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 pt-10 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <FileText className="w-4 h-4" /> শর্তাবলি
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            ArdhiMart ব্যবহার করার আগে অনুগ্রহ করে নিচের শর্তাবলি মনোযোগ দিয়ে পড়ুন।
          </p>
          <p className="text-xs text-gray-400">সর্বশেষ আপডেট: জানুয়ারি ২০২৬</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed shadow-xl shadow-gray-200/50 dark:shadow-none">

          <section className="relative pl-12">
            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">১. পরিষেবা ব্যবহারের শর্ত</h2>
            <p className="text-gray-600 dark:text-gray-300">
              ArdhiMart-এর ওয়েবসাইট ব্যবহার করে আপনি এই শর্তাবলিতে সম্মতি জানাচ্ছেন। ওয়েবসাইটে প্রদর্শিত সকল পণ্যের মূল্য, স্টক ও তথ্য পরিবর্তন হতে পারে।
            </p>
          </section>

          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">২. অর্ডার ও পেমেন্ট</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" /> অর্ডার দেওয়ার পর আমাদের প্রতিনিধি কনফার্মেশন কলের মাধ্যমে অর্ডারটি নিশ্চিত করবেন।</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" /> ক্যাশ অন ডেলিভারি বা অ্যাডভান্স পেমেন্ট — উভয় পদ্ধতিতে পেমেন্ট করা যাবে।</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" /> ভুয়া অর্ডার বা একাধিকবার অর্ডার বাতিল করলে পরবর্তী অর্ডারে অগ্রিম পেমেন্ট প্রযোজ্য হবে।</li>
            </ul>
          </section>

          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">৩. দায়বদ্ধতার সীমা</h2>
            <p className="text-gray-600 dark:text-gray-300">
              কুরিয়ার সার্ভিসের কারণে ডেলিভারিতে বিলম্ব হলে ArdhiMart সরাসরি দায়ী নয়। তবে আমরা সর্বদা আপনার পক্ষে কুরিয়ার পার্টনারদের সাথে যোগাযোগ করে সমস্যা সমাধানের চেষ্টা করবো।
            </p>
          </section>

          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">৪. পরিবর্তনের অধিকার</h2>
            <p className="text-gray-600 dark:text-gray-300">
              ArdhiMart যেকোনো সময় এই শর্তাবলি পরিবর্তন করার অধিকার রাখে। পরিবর্তিত শর্তাবলি ওয়েবসাইটে প্রকাশিত হওয়ার সাথে সাথে কার্যকর হবে।
            </p>
          </section>

        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
