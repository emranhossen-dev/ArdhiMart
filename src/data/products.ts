import { Product } from "../context/CartContext";

export interface ExtendedProduct extends Product {
  description: string;
  specs: { label: string; value: string }[];
  features?: string[];
  usability?: string;
  faqs?: { question: string; answer: string }[];
  gallery: string[];
  inStock: boolean;
  sku: string;
  brand: string;
  isBestDeal?: boolean;
  discountPercent?: number;
  supportsCustomText?: boolean;
  supportsPhotoUpload?: boolean;
  variants?: { name: string; options: string[] }[];
}

export const CATEGORIES = [
  { id: "Electronics", name: "Electronics", icon: "laptop", count: "১২৪ টি আইটেম" },
  { id: "Accessories", name: "Accessories", icon: "glasses", count: "৮৯ টি আইটেম" },
  { id: "Smartwatch", name: "Smartwatch", icon: "watch", count: "৪৫ টি আইটেম" },
  { id: "Audio", name: "Audio", icon: "headphones", count: "৬৭ টি আইটেম" },
  { id: "Home", name: "Home", icon: "home", count: "৯৮ টি আইটেম" },
  { id: "Lifestyle", name: "Lifestyle", icon: "briefcase", count: "১১২ টি আইটেম" },
  { id: "Fashion", name: "Fashion", icon: "shirt", count: "১৫৬ টি আইটেম" },
  { id: "More", name: "More", icon: "grid", count: "২০০+ আইটেম" },
];

export const HERO_SLIDES = [
  {
    id: "slide-1",
    tagline: "নতুন কালেকশন",
    title: "Upgrade Your Everyday",
    subtitle: "সেরা মানের সাউন্ড, স্মার্ট গেজেট ও লাইফস্টাইল প্রডাক্টস পান সেরা মূল্যে।",
    ctaText: "Shop Now",
    category: "Audio",
    image: "/images/ardhimart-smart-pen-holder.webp",
    badge: "বিশেষ ২৫% ছাড়",
    accentColor: "from-blue-600 via-indigo-600 to-purple-600",
  },
  {
    id: "slide-2",
    tagline: "স্মার্ট ফিটনেস ঘড়ি",
    title: "Smart Fitness Watch 8",
    subtitle: "হার্ট রেট, হেলথ ট্র্যাকিং, AMOLED ডিসপ্লে ও ১৪ দিনের মেগা ব্যাটারি লাইফ।",
    ctaText: "Explore Watch",
    category: "Smartwatch",
    image: "/images/ardhimart-giftbox-valentine-set.webp",
    badge: "হট ট্রেন্ডিং",
    accentColor: "from-sky-500 via-blue-600 to-cyan-500",
  },
  {
    id: "slide-3",
    tagline: "অসাধারণ সাউন্ড অভিজ্ঞতা",
    title: "AirPulse Noise Canceling TWS",
    subtitle: "এক্টিভ নয়েজ ক্যান্সেলেশন, ক্রিস্টাল ক্লিয়ার কলিং এবং ওয়্যারলেস চার্জিং কেস।",
    ctaText: "Grab Deal",
    category: "Audio",
    image: "/images/ardhimart-giftbox-set.webp",
    badge: "ফ্ল্যাশ সেল",
    accentColor: "from-purple-600 via-pink-600 to-rose-600",
  },
];

export const PRODUCTS_DATA: ExtendedProduct[] = [];
