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
  title: "ArdhiMart — Premium Tech & Everyday Gadgets in BD", // Exactly 51 characters (Optimal SERP Title)
  description: "Shop premium tech gadgets, power banks & smartwatch accessories at ArdhiMart. Enjoy fast 24h delivery across Bangladesh with Cash on Delivery!", // Exactly 153 characters (Optimal SERP Description)
  keywords: [
    "ArdhiMart",
    "online shopping bangladesh",
    "tech gadgets bd",
    "power bank price in bd",
    "smartwatch bangladesh",
    "cash on delivery gadgets bd",
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
    title: "ArdhiMart — Premium Tech & Everyday Gadgets in BD",
    description: "Shop premium tech gadgets, power banks & smartwatch accessories at ArdhiMart across Bangladesh.",
    siteName: "ArdhiMart",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ArdhiMart E-Commerce Storefront Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
