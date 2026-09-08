'use client';

import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Lightweight Framer Motion Provider
 * Uses `domAnimation` instead of full bundle, reducing JS overhead by ~65-70% (~12KB gzipped).
 * Enables `m` components (e.g. `m.div`, `m.section`) throughout the application.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      {children}
    </LazyMotion>
  );
}
