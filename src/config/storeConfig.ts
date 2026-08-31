import { StoreConfig, HeroBanner, Category, Product } from '@/types/store';

export const defaultStoreConfig: StoreConfig = {
  name: "ArdhiMart",
  tagline: "Premium E-commerce Experience",
  currency: "৳",
  logoUrl: "/logo.png",
  announcementText: "Free Delivery on orders over ৳5000 | Use Code: FIRST50",
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

export const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "Clothing & Gifts",
    slug: "clothing",
    image: "/images/ardhimart-giftbox-valentine-set.webp",
    itemCount: 42,
  },
  {
    id: "cat-2",
    name: "Electronics & Tech",
    slug: "electronics",
    image: "/images/ardhimart-smart-pen-holder.webp",
    itemCount: 28,
  },
  {
    id: "cat-3",
    name: "Accessories & Decor",
    slug: "accessories",
    image: "/images/ardhimart-giftbox-set.webp",
    itemCount: 34,
  },
  {
    id: "cat-4",
    name: "Luxury Hampers",
    slug: "gifts",
    image: "/images/ardhimart-giftbox-valentine-set.webp",
    itemCount: 19,
  },
];

export const defaultProducts: Product[] = [];
