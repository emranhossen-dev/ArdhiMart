'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const PageNavigationLoader: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show brief spinner transition on route change
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Top Slim Loading Progress Bar */}
      <div className="h-0.5 w-full bg-gray-200/30 overflow-hidden">
        <div className="h-full bg-[#FF6B00] animate-pulse" style={{ width: '80%' }} />
      </div>
    </div>
  );
};

export default PageNavigationLoader;
