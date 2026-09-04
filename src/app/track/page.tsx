'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TrackRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id') || searchParams.get('orderId');
    if (id) {
      router.replace(`/account/orders/${encodeURIComponent(id)}/track`);
    } else {
      let targetId = '';
      if (typeof window !== 'undefined') {
        try {
          targetId = localStorage.getItem('ardhimart_last_order_id') || '';
        } catch (e) {}
      }
      if (targetId) {
        router.replace(`/account/orders/${encodeURIComponent(targetId)}/track`);
      } else {
        router.replace('/account/orders/track/track');
      }
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackRedirect />
    </Suspense>
  );
}
