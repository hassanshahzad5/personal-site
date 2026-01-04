'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export function useTabParam<T extends string>(
  validTabs: readonly T[],
  defaultTab: T
): [T, (tab: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get('tab');
  const isValidTab = tabParam !== null && validTabs.includes(tabParam as T);
  const currentTab = isValidTab ? (tabParam as T) : defaultTab;

  useEffect(() => {
    if (tabParam !== null && !isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('tab');
      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    }
  }, [tabParam, isValidTab, searchParams, router, pathname]);

  const setTab = useCallback((tab: T) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === defaultTab) {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname, defaultTab]);

  return [currentTab, setTab];
}
