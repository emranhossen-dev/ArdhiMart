'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { notifySuccess, showErrorModal } from '@/lib/sweetalert';
import { Mail, Lock, KeyRound, ArrowRight, Eye, EyeOff, CheckCircle2, Clock, RotateCcw } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 5-minute countdown timer (300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(300);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
  };

  // STEP 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${getBackendUrl()}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSecondsRemaining(data.expiresInSeconds || 300);
        setStep(2);
        notifySuccess('OTP Code Sent!', 'A 6-digit verification code has been sent to your email.');
      } else {
        const err = data?.message || 'Failed to send OTP code. Please check your email.';
        setErrorMessage(Array.isArray(err) ? err.join(', ') : err);
        showErrorModal('Request Failed', Array.isArray(err) ? err.join(', ') : err);
      }
    } catch (err) {
      setErrorMessage('Network error. Could not connect to server. Please try again.');
      showErrorModal('Network Error', 'Could not connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // RESEND OTP (Preserves identical OTP if within 5 mins)
  const handleResendOtp = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${getBackendUrl()}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        if (data.expiresInSeconds) {
          setSecondsRemaining(data.expiresInSeconds);
        } else {
          setSecondsRemaining(300);
        }
        notifySuccess(
          'Code Re-sent!',
          secondsRemaining > 0
            ? 'Your active 5-minute code has been re-sent to your inbox.'
            : 'A fresh 6-digit code has been sent to your email.'
        );
      } else {
        const err = data?.message || 'Failed to resend code.';
        showErrorModal('Resend Failed', Array.isArray(err) ? err.join(', ') : err);
      }
    } catch (err) {
      showErrorModal('Network Error', 'Failed to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: Verify OTP & Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otp.trim() || otp.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${getBackendUrl()}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStep(3);
        notifySuccess('Password Reset!', 'Your password has been changed successfully.');
      } else {
        const err = data?.message || 'Password reset failed. Please verify your OTP.';
        setErrorMessage(Array.isArray(err) ? err.join(', ') : err);
        showErrorModal('Verification Failed', Array.isArray(err) ? err.join(', ') : err);
      }
    } catch (err) {
      setErrorMessage('Network error. Failed to connect to server.');
      showErrorModal('Network Error', 'Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 sm:px-10 py-8 sm:py-12 flex flex-col justify-center">
        <div className="space-y-6">

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6B00] flex items-center justify-center mx-auto mb-3 border border-orange-200 dark:border-orange-900/60 shadow-xs">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Forgot Your Password?
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Enter your registered account email. We will send you a 6-digit OTP code valid for 5 minutes.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6B00] flex items-center justify-center mx-auto mb-3 border border-orange-200 dark:border-orange-900/60 shadow-xs">
                  <Clock className="w-7 h-7" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Verify OTP & Reset
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Enter the 6-digit code sent to <strong className="text-gray-900 dark:text-white">{email}</strong>
                </p>

                {/* 5-Minute Timer Badge */}
                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Code Expires in: {formatTimer(secondsRemaining)}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                      6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="text-[11px] font-bold text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Resending within 5 minutes will re-send your active OTP"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Resend Code
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 592814"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-center py-2.5 text-base font-mono font-black tracking-widest text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    * এই কোডটির মেয়াদ ৫ মিনিট। ৫ মিনিট শেষ হওয়ার আগে রি-সেন্ড করলেও এই কোডটিই যাবে।
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    New Password (Min 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || secondsRemaining === 0}
                  className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying & Resetting...' : 'Update & Reset Password'}</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                >
                  ← Change Email Address
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="text-center space-y-6 animate-fadeIn py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Password Reset Successful!
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Your ArdhiMart account password has been updated. You can now sign in using your new password.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer className="hidden md:block" />
      <BottomNavBar />
    </div>
  );
}
