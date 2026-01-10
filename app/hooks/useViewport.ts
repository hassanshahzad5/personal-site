'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

/**
 * Viewport breakpoints aligned with Tailwind CSS
 * - mobile: < 640px (below sm)
 * - tablet: 640px - 1279px (sm to below xl)
 * - desktop: >= 1280px (xl and above)
 */
export type Viewport = 'mobile' | 'tablet' | 'desktop';

export interface ViewportBreakpoints {
  sm: number;  // 640px - start of tablet
  xl: number;  // 1280px - start of desktop
}

export const BREAKPOINTS: ViewportBreakpoints = {
  sm: 640,
  xl: 1280,
};

const getViewport = (): Viewport => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < BREAKPOINTS.sm) return 'mobile';
  if (width < BREAKPOINTS.xl) return 'tablet';
  return 'desktop';
};

const getServerViewport = (): Viewport => 'desktop';

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

/**
 * Hook to get the current viewport type
 * Returns 'mobile', 'tablet', or 'desktop' based on window width
 */
export function useViewport(): Viewport {
  const viewport = useSyncExternalStore(subscribe, getViewport, getServerViewport);
  return viewport;
}

/**
 * Hook to get viewport state with boolean helpers
 */
export function useViewportState() {
  const viewport = useViewport();
  
  return {
    viewport,
    isMobile: viewport === 'mobile',
    isTablet: viewport === 'tablet',
    isDesktop: viewport === 'desktop',
    // Compound checks
    isMobileOrTablet: viewport === 'mobile' || viewport === 'tablet',
    isTabletOrDesktop: viewport === 'tablet' || viewport === 'desktop',
  };
}
