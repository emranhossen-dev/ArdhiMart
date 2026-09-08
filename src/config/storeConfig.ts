import { StoreConfig, HeroBanner, Category, Product } from '@/types/store';

export const defaultStoreConfig: StoreConfig = {
  name: "ArdhiMart",
  tagline: "Premium E-commerce Experience",
  currency: "৳",
  logoUrl: "/logo.png",
  announcementText: "Welcome Offer! প্রতিটি অর্ডারের সাথে পাচ্ছেন ১০০৳ ফ্রি গিফট ভাউচার কার্ড!",
  phone: "01895627138",
  email: "martardhi@gmail.com",
  address: "Mohammadpur, Dhaka-1207",
  flatShippingFee: 120,
  deliveryInsideDhaka: 70,
  deliveryOutsideDhaka: 130,
  freeShippingThreshold: 2000,
  taxRate: 0,
};

export const defaultHeroBanner: HeroBanner = {
  badge: "Smart Tech Collection ⚡",
  title: "Smart LED Digital Pen Holder",
  subtitle: "Premium desk organizer with digital clock, alarm & ambient LED light. Elevate your workspace with a modern touch!",
  imageUrl: "/images/ardhimart-smart-pen-holder.webp",
  ctaPrimaryText: "Order Now",
  ctaPrimaryLink: "/products",
  ctaSecondaryText: "Explore Gadgets",
  ctaSecondaryLink: "/products",
};

export const defaultCategories: Category[] = [];

export const defaultProducts: Product[] = [];
