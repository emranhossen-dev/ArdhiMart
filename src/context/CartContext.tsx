"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ExtendedProduct } from "../data/products";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { showAddToCartModal } from "../lib/sweetalert";
import * as fpixel from "@/lib/fpixel";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  cartItemId?: string;
  quantity: number;
  variantColor?: string;
  variantSize?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: Partial<CartItem>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Navigation & Filtering
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeMobileTab: string;
  setActiveMobileTab: (tab: string) => void;

  // Quick View Modal
  previewProduct: ExtendedProduct | null;
  setPreviewProduct: (product: ExtendedProduct | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState("home");
  const [previewProduct, setPreviewProduct] = useState<ExtendedProduct | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ardhimart_cart") || localStorage.getItem("websites_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const mapped: CartItem[] = parsed.map((item: any) => {
            if (item && item.product) {
              return {
                id: item.product.id,
                name: item.product.title || item.product.name,
                price: item.product.price,
                image: item.product.image,
                category: item.product.category || '',
                rating: item.product.rating || 5,
                reviewCount: item.product.reviewsCount || 0,
                quantity: item.quantity || 1,
                variantColor: item.selectedVariant || '',
                cartItemId: `${item.product.id}-${item.selectedVariant || ''}`,
              };
            }
            return item;
          }).filter(Boolean);
          setCart(mapped);
        }
      }
      const savedWishlist = localStorage.getItem("ardhimart_wishlist") || localStorage.getItem("websites_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error("Failed to parse cart/wishlist from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("websites_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart, isLoaded]);

  // Save wishlist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("websites_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [wishlist, isLoaded]);

  const addToCart = (product: Product, options?: Partial<CartItem>) => {
    const variantColor = options?.variantColor || "";
    const variantSize = options?.variantSize || "";
    const key = `${product.id}-${variantColor}-${variantSize}`;
    const addedQty = options?.quantity || 1;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.cartItemId || item.id) === key
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += addedQty;
        return updated;
      } else {
        const newItem: CartItem = {
          ...product,
          cartItemId: key,
          quantity: addedQty,
          variantColor,
          variantSize,
        };
        return [...prev, newItem];
      }
    });

    // Facebook Pixel AddToCart tracking
    fpixel.event('AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price * addedQty,
      currency: 'BDT',
    });

    showAddToCartModal(product.name, product.image, () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/cart';
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || item.id) !== cartItemId));
    toast.error("আইটেমটি কার্ট থেকে মুছে ফেলা হয়েছে");
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.cartItemId || item.id) === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const isPresent = wishlist.includes(productId);
    if (isPresent) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast("উইশলিস্ট থেকে সরানো হয়েছে", { icon: "❤️" });
    } else {
      setWishlist((prev) => [...prev, productId]);
      toast.success("উইশলিস্টে যোগ করা হয়েছে!");
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeMobileTab,
        setActiveMobileTab,
        previewProduct,
        setPreviewProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
