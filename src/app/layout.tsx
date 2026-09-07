import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/StoreShell";
import FacebookPixel from "@/components/FacebookPixel";

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
  title: "ArdhiMart - Smart Gadgets, Fashion & Flash Deals in BD",
  description: "Shop trending smart gadgets, fashion & beauty essentials, and exclusive flash deals at ArdhiMart. 100% authentic products with fast cash on delivery across Bangladesh.",
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
    "smart gadgets bangladesh",
    "fashion and beauty bd",
    "flash deals bangladesh",
    "online shopping bd",
    "smart watch bd",
    "earbuds bangladesh",
    "gift items bd",
    "cash on delivery bd",
  ],
  authors: [{ name: "ArdhiMart Team" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {
      "facebook-domain-verification": "3jkij7uzt4hjc6y9e5262hjn10vsld",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ardhimart.com",
    title: "ArdhiMart - Smart Gadgets, Fashion & Flash Deals in BD",
    description: "Shop trending smart gadgets, fashion & beauty essentials, and exclusive flash deals at ArdhiMart. 100% authentic products with fast cash on delivery across Bangladesh.",
    siteName: "ArdhiMart",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ArdhiMart — Smart Gadgets, Fashion & Flash Deals in Bangladesh",
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
      "alternateName": ["Ardhi Mart", "Ardhimart BD", "Ardhimart.com"],
      "url": "https://ardhimart.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://ardhimart.com/products?search={search_term_string}"
        },
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
      "description": "Shop trending smart gadgets, fashion & beauty essentials, and exclusive flash deals at ArdhiMart across Bangladesh.",
      "telephone": "+8801895627138",
      "priceRange": "৳৳",
      "sameAs": [
        "https://facebook.com/ardhimart",
        "https://instagram.com/ardhimart"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Flash Deals",
          "description": "Limited-time flash sale discounts on top products.",
          "url": "https://ardhimart.com/products?category=Flash%20Deals"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Smart Gadgets",
          "description": "Smart watches, wireless audio, lifestyle electronics and accessories.",
          "url": "https://ardhimart.com/products?category=Smart%20Gadgets"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Fashion & Beauty",
          "description": "Girls fashion, beauty accessories, jewelry and lifestyle essentials.",
          "url": "https://ardhimart.com/products?category=Fashion%20%26%20Beauty"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "New Arrivals",
          "description": "Explore the freshest trending arrivals in Bangladesh.",
          "url": "https://ardhimart.com/products?badge=New"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Track Order",
          "description": "Track your parcel and delivery status in real-time.",
          "url": "https://ardhimart.com/track"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "Return & Refund Policy",
          "description": "Learn about our 3-day hassle-free replacement and refund guarantee.",
          "url": "https://ardhimart.com/return-policy"
        }
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
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="3jkij7uzt4hjc6y9e5262hjn10vsld" />

        {/* Google Organization JSON-LD Schema for Google Search & Search Console Brand Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <FacebookPixel />
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
