'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { RotateCcw, CheckCircle, ShieldAlert, PackageX, Wallet } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 pt-10 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <RotateCcw className="w-4 h-4" /> ৭ দিনের গ্যারান্টি
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
            রিটার্ন ও রিফান্ড পলিসি
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            আপনার কেনাকাটার অভিজ্ঞতা সুরক্ষিত রাখতে আমরা নিয়ে এসেছি সহজ ও ঝামেলাবিহীন রিটার্ন পলিসি। 
            দয়া করে নিচের শর্তাবলি ভালোভাবে পড়ে নিন।
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed shadow-xl shadow-gray-200/50 dark:shadow-none">
          
          {/* Step 1 */}
          <section className="relative pl-12">
            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ১. ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              আমরা সবসময় কোয়ালিটি প্রোডাক্ট নিশ্চিত করার চেষ্টা করি। তবে ডেলিভারি পাওয়ার পর যদি আপনি কোনো ডিফেক্টিভ, ড্যামেজ বা ভুল প্রোডাক্ট পান, তবে পরবর্তী ৭ দিনের মধ্যে আমাদের সাথে যোগাযোগ করে রিপ্লেসমেন্ট সুবিধা গ্রহণ করতে পারবেন।
            </p>
          </section>

          {/* Step 2 */}
          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              ২. রিটার্ন করার শর্তাবলি
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300 list-none">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                প্রোডাক্টটি অবশ্যই অব্যবহৃত এবং অরিজিনাল প্যাকেজিংয়ে থাকতে হবে।
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                প্রোডাক্টের সাথে থাকা সকল ট্যাগ, ম্যানুয়াল এবং এক্সেসরিজ অক্ষত থাকতে হবে।
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                পার্সেল খোলার সময় একটি আনবক্সিং ভিডিও (Unboxing Video) করা বাধ্যতামূলক। কোনো ধরনের ভাঙা বা ড্যামেজ ক্লেইমের ক্ষেত্রে আনবক্সিং ভিডিও ছাড়া অভিযোগ গ্রহণযোগ্য হবে না।
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                শুধুমাত্র "প্রোডাক্ট পছন্দ হয়নি" বা "প্রত্যাশা অনুযায়ী হয়নি" এমন কারণে রিটার্ন বা রিফান্ড গ্রহণযোগ্য নয়। 
              </li>
            </ul>
          </section>

          {/* Step 3 */}
          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ৩. রিফান্ড প্রসেস
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              আপনার পাঠানো রিটার্ন প্রোডাক্টটি আমাদের ওয়্যারহাউজে পৌঁছানোর পর সেটি ইন্সপেকশন করা হবে। রিটার্ন এপ্রুভ হলে পরবর্তী ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার প্রদত্ত বিকাশ (bKash), নগদ (Nagad) বা ব্যাংক অ্যাকাউন্টে রিফান্ডের টাকা পাঠিয়ে দেওয়া হবে। ডেলিভারি চার্জ সাধারণত রিফান্ডযোগ্য নয়।
            </p>
          </section>
          
          {/* Step 4 */}
          <section className="relative pl-12 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="absolute top-6 left-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center">
              <PackageX className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ৪. কীভাবে ক্লেইম করবেন?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              যেকোনো ধরনের রিটার্ন বা রিপ্লেসমেন্ট ক্লেইম করতে আমাদের হটলাইন নম্বরে কল করুন অথবা অর্ডার আইডিসহ আমাদের অফিসিয়াল ফেসবুক পেজে মেসেজ দিন। আমাদের কাস্টমার সার্ভিস প্রতিনিধি আপনাকে পরবর্তী ধাপে সাহায্য করবে।
            </p>
          </section>

        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
