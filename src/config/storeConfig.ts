import { StoreConfig, HeroBanner, Category, Product } from '@/types/store';

export const defaultStoreConfig: StoreConfig = {
  name: "ArdhiMart",
  tagline: "Premium E-commerce Experience",
  currency: "৳",
  logoUrl: "/logo.png",
  announcementText: "Welcome Offer! Use Code: FD20 for 20% OFF",
  phone: "01895627138",
  email: "martardhi@gmail.com",
  address: "Mohammadpur, Dhaka-1207",
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
