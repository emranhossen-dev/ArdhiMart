'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { ShieldCheck, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 pt-10 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-4 h-4" /> গোপনীয়তা নীতি
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            আপনার তথ্যের সুরক্ষা আমাদের সর্বোচ্চ অগ্রাধিকার। নিচে বিস্তারিত জানুন আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখি।
          </p>
          <p className="text-xs text-gray-400">সর্বশেষ আপডেট: জানুয়ারি ২০২৬</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed shadow-xl shadow-gray-200/50 dark:shadow-none">

          <section className="relative pl-12">
            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">১. আমরা কী তথ্য সংগ্রহ করি?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              আপনি যখন আমাদের ওয়েবসাইটে অর্ডার করেন বা রেজিস্ট্রেশন করেন, আমরা আপনার নাম, মোবাইল নম্বর, ডেলিভারি ঠিকানা এবং ইমেইল সংগ্রহ করি। এই তথ্যগুলো শুধুমাত্র আপনার অর্ডার প্রসেস ও ডেলিভারি নিশ্চিত করার জন্য ব্যবহার করা হয়।
            </p>
          </section>

          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">২. তথ্য কীভাবে ব্যবহার করা হয়?</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-none">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" /> অর্ডার কনফার্মেশন ও ডেলিভারি আপডেট পাঠাতে।</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" /> কাস্টমার সার্ভিস সহায়তা প্রদান করতে।</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" /> নতুন অফার ও প্রমো কোড জানাতে (যদি আপনি সম্মতি দেন)।</li>
            </ul>
          </section>

          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">৩. তথ্য কি তৃতীয় পক্ষের সাথে শেয়ার করা হয়?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              না। আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের সাথে বিক্রি বা শেয়ার করি না। শুধুমাত্র ডেলিভারি পার্টনার (Steadfast, Pathao Courier)-কে ডেলিভারি সম্পন্ন করার জন্য আপনার নাম ও ঠিকানা প্রদান করা হয়।
            </p>
          </section>

          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">৪. তথ্য সুরক্ষা</h2>
            <p className="text-gray-600 dark:text-gray-300">
              আপনার তথ্য সম্পূর্ণ নিরাপদ রাখতে আমরা SSL এনক্রিপশন ও সিকিউর সার্ভার ব্যবহার করি। যেকোনো প্রশ্নে আমাদের সাথে যোগাযোগ করুন।
            </p>
          </section>

        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
