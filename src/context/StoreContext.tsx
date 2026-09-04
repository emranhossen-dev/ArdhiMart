'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, StoreConfig, Category } from '@/types/store';
import {
  defaultStoreConfig,
  defaultCategories,
  defaultProducts,
  defaultHeroBanner,
} from '@/config/storeConfig';
import { notifySuccess, notifyInfo, showAddToCartModal } from '@/lib/sweetalert';
import { useAuth } from '@/context/AuthContext';
import * as fpixel from '@/lib/fpixel';

interface StoreContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  storeConfig: StoreConfig;
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  heroBanner: typeof defaultHeroBanner;
  cartItems: CartItem[];
  wishlistIds: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedVariant?: string, options?: { showModal?: boolean }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const mapApiProduct = (item: any): Product => {
  const tagsArray = Array.isArray(item.tags)
    ? item.tags
    : typeof item.tags === 'string'
    ? item.tags.split(',').map((s: string) => s.trim())
    : [];

  const keywordsArray = Array.isArray(item.keywords)
    ? item.keywords
    : typeof item.keywords === 'string'
    ? item.keywords.split(',').map((s: string) => s.trim())
    : [];

  const isFlashSaleVal =
    tagsArray.includes('flash_sale') ||
    keywordsArray.includes('flash_sale') ||
    Boolean(item.isFlashSale);

  const mainBadgeTag =
    tagsArray.find((t: string) => t !== 'flash_sale') || item.badge || '';

  const finalBadge =
    mainBadgeTag === 'None' || mainBadgeTag === 'none' ? '' : mainBadgeTag;

  return {
    ...item,
    id: String(item.id),
    title: item.title || item.name || 'Untitled Product',
    price: Number(item.price || 0),
    comparePrice: item.comparePrice ? Number(item.comparePrice) : undefined,
    rating: typeof item.rating === 'number' ? item.rating : 5.0,
    reviewsCount: typeof item.reviewsCount === 'number' ? item.reviewsCount : 0,
    badge: finalBadge,
    isNew: finalBadge === 'New' || finalBadge === 'Hot',
    isFeatured: finalBadge === 'Featured' || finalBadge === 'Trending',
    isFlashSale: isFlashSaleVal,
    image: item.image || '/images/ardhimart-smart-pen-holder.webp',
    galleryImages: Array.isArray(item.galleryImages)
      ? item.galleryImages
      : typeof item.galleryImages === 'string' && item.galleryImages.trim()
      ? item.galleryImages.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
    category: item.category || 'Electronics',
    color: item.color || item.variantOptions || '',
    shortDescription: item.shortDescription || '',
    description: item.description || '',
    usability: item.usability || '',
    features: Array.isArray(item.features)
      ? item.features
      : typeof item.features === 'string' && item.features.trim()
      ? item.features.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [],
    material: item.material || '',
    warranty: item.warranty || '',
    deliveryInsideDhaka: item.deliveryInsideDhaka ? Number(item.deliveryInsideDhaka) : 80,
    deliveryOutsideDhaka: item.deliveryOutsideDhaka ? Number(item.deliveryOutsideDhaka) : 120,
    sku: item.sku || '',
    urlSlug: item.urlSlug || item.slug || (item.title ? item.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '') || String(item.id),
  };
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const applyTheme = (t: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ardhimart_theme', newTheme);
    }
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ardhimart_theme');
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved);
        applyTheme(saved);
      }
    }
  }, []);

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ardhimart_store_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...defaultStoreConfig,
            enableCardImageAutoSlide: parsed.enableCardImageAutoSlide !== undefined ? Boolean(parsed.enableCardImageAutoSlide) : true,
            enableGridCarouselAutoSlide: parsed.enableGridCarouselAutoSlide !== undefined ? Boolean(parsed.enableGridCarouselAutoSlide) : true,
            autoSlideSpeed: Number(parsed.autoSlideSpeed || 3000),
          };
        }
      } catch (e) {}
    }
    return {
      ...defaultStoreConfig,
      enableCardImageAutoSlide: true,
      enableGridCarouselAutoSlide: true,
      autoSlideSpeed: 3000,
    };
  });

  React.useEffect(() => {
    const fetchLiveSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/settings').catch(() =>
          fetch('https://ardhimart-backend.onrender.com/api/v1/settings')
        );
        if (res.ok) {
          const data = await res.json();
          setStoreConfig((prev) => ({
            ...prev,
            enableCardImageAutoSlide: data.enableCardImageAutoSlide !== undefined ? Boolean(data.enableCardImageAutoSlide) : true,
            enableGridCarouselAutoSlide: data.enableGridCarouselAutoSlide !== undefined ? Boolean(data.enableGridCarouselAutoSlide) : true,
            autoSlideSpeed: Number(data.autoSlideSpeed || 3000),
          }));
        }
      } catch (e) {}
    };

    fetchLiveSettings();
    const interval = setInterval(fetchLiveSettings, 15000);
    return () => clearInterval(interval);
  }, []);
  
  // Clean live product state with instant localStorage fallback to prevent cold-start 404
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ardhimart_live_products_cache');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ardhimart_live_products_cache');
        if (saved && JSON.parse(saved).length > 0) return false;
      } catch (e) {}
    }
    return true;
  });

  const [heroBanner] = useState(defaultHeroBanner);

  // Dynamic categories synced from Admin / Backend database API
  const [dbCategories, setDbCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ardhimart_admin_categories') || localStorage.getItem('ardhimart_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((c: any) => ({
              id: c.id || `cat-${c.slug}`,
              name: c.name,
              slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              image: c.image || '/images/ardhimart-smart-pen-holder.webp',
              description: c.description || '',
              itemCount: c.productCount || 0
            }));
          }
        }
      } catch (e) {}
    }
    return [];
  });

  // Sync categories directly from NestJS PostgreSQL REST API
  React.useEffect(() => {
    const fetchLiveCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
        const res = await fetch(`${baseUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          const dataArr = Array.isArray(data) ? data : (data && data.id ? [data] : null);
          if (dataArr && dataArr.length > 0) {
            const mapCategory = (c: any): Category => ({
              id: c.id || `cat-${c.slug}`,
              name: c.name,
              slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              image: c.image || '/images/ardhimart-smart-pen-holder.webp',
              description: c.description || '',
              itemCount: c.productCount || 0,
              parentId: c.parentId || null,
              children: Array.isArray(c.children) ? c.children.map(mapCategory) : []
            });

            setDbCategories(dataArr.map(mapCategory));
          }
        }
      } catch (e) {}
    };

    fetchLiveCategories();
    const interval = setInterval(fetchLiveCategories, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  // Dynamically compute unique categories from Admin/API categories + products
  const categories = React.useMemo(() => {
    const existingMap = new Map<string, Category>();

    // Helper to add category & children
    const addCat = (c: Category) => {
      existingMap.set(c.name.toLowerCase().trim(), c);
      if (c.children && c.children.length > 0) {
        c.children.forEach(addCat);
      }
    };

    // 1. Add categories created in Admin / Database
    dbCategories.forEach(addCat);

    // 2. Dynamically add from database products if not present
    products.forEach((p) => {
      if (p.category) {
        const key = p.category.toLowerCase().trim();
        if (!existingMap.has(key)) {
          existingMap.set(key, {
            id: `cat-${key.replace(/[^a-z0-9]/g, '-')}`,
            name: p.category,
            slug: key.replace(/[^a-z0-9]/g, '-'),
            image: p.image || '/images/ardhimart-smart-pen-holder.webp',
            itemCount: 1,
            parentId: null,
            children: []
          });
        }
      }
    });

    return Array.from(existingMap.values());
  }, [dbCategories, products]);

  // Fetch real database products from NestJS REST API with resilient retry logic
  React.useEffect(() => {
    let isMounted = true;
    let retries = 0;

    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
        const res = await fetch(`${baseUrl}/products`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            const mapped = data.map(mapApiProduct);
            setProducts(mapped);
            setIsLoading(false);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('ardhimart_live_products_cache', JSON.stringify(mapped));
              } catch (e) {}
            }

            // Fetch categories REST API
            try {
              const catRes = await fetch(`${baseUrl}/categories`);
              if (catRes.ok) {
                const catData = await catRes.json();
                const catArr = Array.isArray(catData) ? catData : (catData && catData.id ? [catData] : null);
                if (catArr && catArr.length > 0 && isMounted) {
                  setDbCategories(
                    catArr.map((c: any) => ({
                      id: c.id || `cat-${c.slug}`,
                      name: c.name,
                      slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      image: c.image || '/images/ardhimart-smart-pen-holder.webp',
                      description: c.description || '',
                      itemCount: c.productCount || 0
                    }))
                  );
                }
              }
            } catch (e) {}

            return;
          }
        }
      } catch (err) {
        console.warn('Backend API fetch attempt warning:', err);
      }

      if (retries < 3 && isMounted) {
        retries++;
        setTimeout(fetchProducts, 1200);
      } else if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user } = useAuth();

  // Auto-sync active cart items to backend for admin tracking
  React.useEffect(() => {
    if (user) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
      fetch(`${baseUrl}/customers/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName || 'Customer',
          email: user.email || '',
          avatar: user.photoURL || '',
          provider: user.providerData[0]?.providerId || 'password',
          cartItems: cartItems.map((i) => ({
            id: i.product.id,
            title: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
          })),
        }),
      }).catch((e) => console.warn('Cart sync error:', e));
    }
  }, [user, cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariant?: string,
    options?: { showModal?: boolean }
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedVariant === selectedVariant);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant }];
    });

    // Facebook Pixel AddToCart tracking
    fpixel.event('AddToCart', {
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price * quantity,
      currency: 'BDT',
    });

    if (options?.showModal !== false) {
      showAddToCartModal(product.title, product.image, () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/cart';
        }
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    notifyInfo('Item removed from cart');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        notifyInfo('Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        notifySuccess('Added to Wishlist!');
        return [...prev, productId];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        storeConfig,
        categories,
        products,
        isLoading,
        heroBanner,
        cartItems,
        wishlistIds,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isMenuOpen,
        setIsMenuOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
