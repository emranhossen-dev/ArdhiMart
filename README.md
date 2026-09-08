# 🛍️ ArdhiMart — Modern E-Commerce Storefront

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Edge_Ready-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFA611?logo=firebase&logoColor=white)](https://firebase.google.com/)

A ultra-fast, mobile-optimized, conversion-focused **Headless E-Commerce Storefront** built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**. Deployed on **Cloudflare Pages** for sub-100ms global edge delivery.

---

## 📌 Project Overview

**ArdhiMart Storefront** is designed for the modern online shopping experience in Bangladesh and beyond. It features seamless one-page checkout, instant search, dynamic flash deals, category navigation, real-time cart synchronization, and complete Facebook Pixel & Meta Conversions API integration.

### 🌐 Live Links & Demos
- **Live Storefront Website**: [https://ardhimart.com](https://ardhimart.com)
- **Admin Dashboard**: [https://admin.ardhimart.com](https://admin.ardhimart.com)
- **Backend REST API**: [https://ardhimart-backend.onrender.com/api/v1](https://ardhimart-backend.onrender.com/api/v1)

---

## 🖼️ UI Preview

```text
+---------------------------------------------------------------+
|  [⚡ Flash Sale Banner]  Free Delivery on Orders Over ৳2500   |
+---------------------------------------------------------------+
|  ArdhiMart   [ 🔍 Search Products... ]   🛒 (3) Cart | 👤 Acc   |
+---------------------------------------------------------------+
|  🔥 Hot Deals  |  📱 Smart Gadgets  |  👕 Men's  |  👗 Women's |
+---------------------------------------------------------------+
|                                                               |
|   +-------------------+  +-------------------+  +-----------+ |
|   |  [Product Photo]  |  |  [Product Photo]  |  | [Photo]   | |
|   |  Polo T-Shirt     |  |  Smart Earbuds    |  | Leather   | |
|   |  ৳ 990  (৳1250)   |  |  ৳ 1850 (৳2200)   |  | ৳ 750     | |
|   |  [ Buy Now ]      |  |  [ Buy Now ]      |  | [Buy Now] | |
|   +-------------------+  +-------------------+  +-----------+ |
|                                                               |
+---------------------------------------------------------------+
```
*(You can place a real screenshot in your repo under `/public/preview.png` and reference it with `![ArdhiMart Storefront](/public/preview.png)`)*

---

## ✨ Main Features

- ⚡ **Blazing Fast Performance**: Next.js 16 App Router with Server & Client components optimized for ultra-low latency on Cloudflare Edge.
- 🛍️ **High-Converting Express Checkout**: Streamlined Cash on Delivery (COD) and Online Payment form requiring minimal customer inputs to maximize checkout completion.
- 📱 **Mobile-First UX**: Responsive drawer navigation, sticky bottom navigation bar, quick "Buy Now" triggers, and touch-friendly product carousels.
- 🔍 **Instant Search & Category Filters**: Multi-criteria product filtering by category, price range, deal badges, and live keyword search.
- 🛒 **Persistent Shopping Cart**: Real-time cart state with quantity controls, inside/outside Dhaka shipping fee auto-calculation, and promo coupon discounts.
- 📊 **Marketing & Pixel Tracking**: Integrated Meta (Facebook) Pixel with PageView, ViewContent, AddToCart, and Purchase event tracking.
- 🔐 **Firebase Authentication**: Seamless Google and Phone/Email customer authentication.
- 🎨 **Visual Badges & Deal Timers**: Dynamic countdown timers for flash deals, stock urgency chips, and verified quality badges.

---

## 🛠️ Main Technologies & Stack

- **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment & Edge Runtime**: [Cloudflare Pages](https://pages.cloudflare.com/) via `@cloudflare/next-on-pages`
- **Authentication & Backend Services**: [Firebase SDK](https://firebase.google.com/)

---

## 📦 Key Dependencies

| Dependency | Purpose |
| :--- | :--- |
| `next` (`16.3.0`) | App Router, Server Actions, Image Optimization & SSR |
| `react` & `react-dom` (`19.2.8`) | Core UI component engine |
| `firebase` (`^12.18.0`) | Customer authentication & event logging |
| `lucide-react` & `react-icons` | Comprehensive modern vector icon set |
| `react-hot-toast` & `sweetalert2` | Notification toasts and order confirmation modals |
| `tailwindcss` (`^4`) | Modern utility-first CSS styling engine |
| `@cloudflare/next-on-pages` | Cloudflare Pages edge build adapter |

---

## 🚀 Local Machine Setup & Run Guideline

Follow these simple steps to run the storefront on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/ardhimart/ardhimart-frontend.git
cd ardhimart-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=https://ardhimart-backend.onrender.com/api/v1

# Firebase Client SDK Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ardhimart.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ardhimart
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ardhimart.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Meta / Facebook Pixel Tracking
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```text
src/
├── app/                 # Next.js App Router (pages & layouts)
│   ├── category/        # Dynamic category pages [slug]
│   ├── products/        # Product listing & details [slug]
│   ├── checkout/        # High-converting express checkout
│   ├── terms/           # Policy, terms, privacy, & FAQ pages
│   ├── layout.tsx       # Root layout with providers & nav
│   └── page.tsx         # Homepage with hero, banners & deals
├── components/          # Modular UI components (Navbar, Cart, ProductCard)
├── config/              # Store configuration, delivery charges & settings
├── context/             # React Contexts (StoreContext, CartContext)
├── hooks/               # Custom hooks for search, screen resize & local storage
├── lib/                 # API helpers, Facebook Pixel, Slugifiers
└── types/               # TypeScript interfaces for products, orders & carts
```

---

## 📄 License & Ownership
Copyright © 2026 **ArdhiMart E-Commerce Ecosystem**. All rights reserved.
