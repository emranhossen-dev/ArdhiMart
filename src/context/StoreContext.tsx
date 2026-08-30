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
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ardhimart_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light'; // DEFAULT LIGHT MODE!
  });

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
      applyTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const [storeConfig] = useState<StoreConfig>(defaultStoreConfig);
  const [categories] = useState<Category[]>(defaultCategories);
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('ardhimart_cached_products');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const clean = parsed.filter((p: any) => p.id && !p.id.startsWith('prod-') && p.title !== 'Ceramic Minimalist Vase');
            if (clean.length > 0) return clean;
          }
        }
      } catch (e) {
        console.warn('Cache read error:', e);
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [heroBanner] = useState(defaultHeroBanner);

  // Fetch real database products from NestJS REST API with resilient retry logic
  React.useEffect(() => {
    let isMounted = true;
    let retries = 0;

    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
        const res = await fetch(`${baseUrl}/products`, {
          next: { revalidate: 30 }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            const mapped = data.map((item: any) => ({
              ...item,
              id: String(item.id),
              title: item.title || item.name || 'Untitled Product',
              price: Number(item.price || 0),
              comparePrice: item.comparePrice ? Number(item.comparePrice) : undefined,
              rating: typeof item.rating === 'number' ? item.rating : 5.0,
              reviewsCount: typeof item.reviewsCount === 'number' ? item.reviewsCount : 0,
              badge: item.badge || 'New',
              image: item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
              galleryImages: item.galleryImages && Array.isArray(item.galleryImages) ? item.galleryImages : [],
              category: item.category || 'Electronics',
              color: item.color || item.variantOptions || '',
              shortDescription: item.shortDescription || '',
              description: item.description || '',
              usability: item.usability || '',
              features: item.features && Array.isArray(item.features) ? item.features : [],
              material: item.material || '',
              warranty: item.warranty || '',
              deliveryInsideDhaka: item.deliveryInsideDhaka ? Number(item.deliveryInsideDhaka) : 80,
              deliveryOutsideDhaka: item.deliveryOutsideDhaka ? Number(item.deliveryOutsideDhaka) : 120,
              sku: item.sku || '',
              urlSlug: item.urlSlug || item.slug || (item.title ? item.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '') || String(item.id),
            }));
            setProducts(mapped);
            setIsLoading(false);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('ardhimart_cached_products', JSON.stringify(mapped));
              } catch (e) {}
            }
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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const addToCart = (product: Product, quantity: number = 1, selectedVariant?: string) => {
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

    showAddToCartModal(product.title, product.image, () => setIsCartOpen(true));
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
