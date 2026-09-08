"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavBar from "@/components/BottomNavBar";
import { notifySuccess, showErrorModal } from "@/lib/sweetalert";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const getFirebaseErrorMessage = (err: any): string => {
    if (!err) return "An unexpected error occurred.";
    const code = err.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password. Please check your credentials.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later or reset your password.";
      case "auth/popup-closed-by-user":
        return "Google Sign-In popup was closed before completing.";
      case "auth/popup-blocked":
        return "Sign-In popup was blocked by your browser. Please allow popups for this site.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase Console. Please add it to Authorized Domains.";
      case "auth/network-request-failed":
        return "Network connection failed. Please check your internet connection.";
      default:
        return err.message?.replace(/^Firebase:\s*/, "") || "Failed to log in. Please check your credentials.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      notifySuccess("Welcome Back!", "Logged in successfully to ArdhiMart.");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      const msg = getFirebaseErrorMessage(err);
      setErrorMessage(msg);
      showErrorModal("Login Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      notifySuccess("Welcome!", "Signed in with Google successfully.");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      const msg = getFirebaseErrorMessage(err);
      setErrorMessage(msg);
      showErrorModal("Google Sign-In Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col justify-between font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        {/* Split Card Container */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Branded Graphics Panel (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-[#180d04] text-white p-10 flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-black text-xl shadow-md">
                  A
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  Ardhi<span className="text-[#FF6B00]">Mart</span>
                </span>
              </Link>

              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Your Trusted Destination for Smart Gadgets & Lifestyle
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Log in to track your parcels in real-time, view order history, manage your saved wishlist, and access exclusive member deals.
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div className="space-y-4 my-8 relative z-10">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white">100% Genuine Products</p>
                  <p className="text-slate-400 text-[11px]">Directly sourced with official warranty check</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white">Nationwide Express Delivery</p>
                  <p className="text-slate-400 text-[11px]">24h delivery in Dhaka, 48-72h all Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white">Cash on Delivery Available</p>
                  <p className="text-slate-400 text-[11px]">Pay only after inspecting your parcel</p>
                </div>
              </div>
            </div>

            {/* Bottom Proof Note */}
            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 relative z-10 flex items-center justify-between">
              <span>Trusted by 10,000+ Happy Shoppers</span>
              <span className="font-bold text-white">★★★★★ 4.9/5</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">

              {/* Title & Subtitle */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF6B00] block mb-1">
                  Customer Account
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter your email and password to access your account.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300">
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-[#FF6B00] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-orange-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? "Signing In..." : "Sign In to Account"}</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-gray-400 font-bold text-[10px]">
                    Or Continue With
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In with Google</span>
              </button>

              {/* Bottom Register Switch */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-slate-800">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="text-[#FF6B00] font-extrabold hover:underline inline-flex items-center gap-1 ml-1"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
