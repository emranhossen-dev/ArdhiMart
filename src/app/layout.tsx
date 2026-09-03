import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/StoreShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ardhimart.com"),
  title: "ArdhiMart - Gifts, Fashion & Smart Gadgets in BD",
  description: "আপনার প্রিয়জনকে চমকে দিন ArdhiMart-এর অনন্য গিফট কালেকশন দিয়ে! কাপল কম্বো বক্স, স্মার্ট গ্যাজেট, ফ্যাশন জুয়েলারি ও আরও অনেক কিছু। সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে পাঠানো হয়। ArdhiMart — গিফটই হোক আপনার ভালোবাসার ভাষা!",
  alternates: {
    canonical: "https://ardhimart.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "ArdhiMart",
    "gift shop bangladesh",
    "online gift shop bd",
    "couple combo gift box bd",
    "smart gadgets bangladesh",
    "fashion jewellery bd",
    "unique gift items bd",
    "cash on delivery bd",
    "birthday gifts bd",
    "anniversary gifts bd",
  ],
  authors: [{ name: "ArdhiMart Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ardhimart.com",
    title: "ArdhiMart - Gifts, Fashion & Smart Gadgets in BD",
    description: "আপনার প্রিয়জনকে চমকে দিন ArdhiMart-এর অনন্য গিফট কালেকশন দিয়ে! কাপল কম্বো বক্স, স্মার্ট গ্যাজেট, ফ্যাশন জুয়েলারি ও আরও অনেক কিছু। সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে পাঠানো হয়।",
    siteName: "ArdhiMart",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ArdhiMart — Gifts, Fashion & Smart Gadgets Shop in Bangladesh",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ArdhiMart",
      "url": "https://ardhimart.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ardhimart.com/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "name": "ArdhiMart",
      "url": "https://ardhimart.com",
      "logo": "https://ardhimart.com/logo.png",
      "image": "https://ardhimart.com/logo.png",
      "description": "Shop unique gifts, trendy gadgets & premium accessories at ArdhiMart across Bangladesh.",
      "sameAs": [
        "https://facebook.com/ardhimart",
        "https://instagram.com/ardhimart"
      ]
    }
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Explicit Google Favicon & Apple Icon HTML Links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Google Organization JSON-LD Schema for Google Search & Search Console Brand Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
