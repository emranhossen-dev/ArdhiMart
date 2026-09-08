export interface StoreConfig {
  name: string;
  tagline: string;
  currency: string;
  logoUrl?: string;
  announcementText?: string;
  phone?: string;
  email?: string;
  address?: string;
  flatShippingFee?: number;
  deliveryInsideDhaka?: number;
  deliveryOutsideDhaka?: number;
  freeShippingThreshold?: number;
  taxRate?: number;
  enableCardImageAutoSlide?: boolean;
  enableGridCarouselAutoSlide?: boolean;
  autoSlideSpeed?: number;
  enablePromoModal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount?: number;
  parentId?: string | null;
  children?: Category[];
}

export interface Product {
  id: string;
  title: string;
  brand?: string;
  price: number;
  comparePrice?: number;
  rating: number;
  reviewsCount?: number;
  badge?: string;
  image: string;
  galleryImages?: string[];
  category: string;
  isNew?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  color?: string;
  variantName?: string;
  shortDescription?: string;
  description?: string;
  usability?: string;
  features?: string[];
  material?: string;
  warranty?: string;
  deliveryInsideDhaka?: number;
  deliveryOutsideDhaka?: number;
  sku?: string;
  urlSlug?: string;
  stock?: number;
  soldCount?: number;
  tags?: string[];
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
