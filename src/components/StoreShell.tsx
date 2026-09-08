'use client';

import React, { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import MotionProvider from '@/components/MotionProvider';
import PageNavigationLoader from '@/components/PageNavigationLoader';
import EyesLoader from '@/components/EyesLoader';
import { useRouter } from 'next/navigation';

// Lazy load heavy modal & drawer overlays so mobile viewers download zero extra JS on initial paint
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), {
  ssr: false,
});

const SearchModal = dynamic(() => import('@/components/SearchModal'), {
  ssr: false,
});

const MobileNavDrawer = dynamic(() => import('@/components/MobileNavDrawer'), {
  ssr: false,
});

const StoreShellInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const {
    storeConfig,
    categories,
    products,
    cartItems,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    isMenuOpen,
    setIsMenuOpen,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useStore();

  const [showInitialLoader, setShowInitialLoader] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setShowInitialLoader(false), 200);
      return () => clearTimeout(t);
    }
    const fallback = setTimeout(() => setShowInitialLoader(false), 2000);
    return () => clearTimeout(fallback);
  }, [isLoading]);

  return (
    <MotionProvider>
      <Suspense fallback={null}>
        <PageNavigationLoader />
      </Suspense>

      {/* Global Animated Eye Loading Screen during initial site/data load */}
      {showInitialLoader && (
        <EyesLoader fullScreen />
      )}

      {children}

      {/* Global Slide-over Mobile Menu Navigation (Lazy Loaded on demand) */}
      {isMenuOpen && (
        <MobileNavDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          siteName={storeConfig.name}
          categories={categories}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Global Slide-over Cart Drawer (Lazy Loaded on demand) */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          currency={storeConfig.currency}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            router.push('/checkout');
          }}
        />
      )}

      {/* Global Search Modal (Lazy Loaded on demand) */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          currency={storeConfig.currency}
          onSelectProduct={(p) => router.push(`/products/${p.id}`)}
        />
      )}
    </MotionProvider>
  );
};

export const StoreShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <StoreShellInner>{children}</StoreShellInner>
        </StoreProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default StoreShell;
