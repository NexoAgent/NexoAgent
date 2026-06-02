"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import Spinner from "../ui/Spinner";

interface LazyListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  initialCount?: number;
  incrementCount?: number;
  threshold?: number;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  className?: string;
}

/**
 * Lista con lazy loading incremental
 *
 * Carga items progresivamente al hacer scroll
 */
export default function LazyList<T>({
  items,
  renderItem,
  initialCount = 10,
  incrementCount = 10,
  threshold = 200,
  loadingComponent,
  emptyComponent,
  className,
}: LazyListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (visibleCount >= items.length || isLoading) return;

    setIsLoading(true);

    // Simular carga asíncrona
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + incrementCount, items.length));
      setIsLoading(false);
    }, 100);
  }, [visibleCount, items.length, incrementCount, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < threshold) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore, threshold]);

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div className={className}>
      {visibleItems.map((item, index) => renderItem(item, index))}

      {hasMore && (
        <div className="flex justify-center py-6">
          {loadingComponent || <Spinner size="sm" />}
        </div>
      )}

      {!hasMore && items.length > initialCount && (
        <div className="text-center py-4 text-sm text-gray-500">
          Mostrando todos los resultados ({items.length})
        </div>
      )}
    </div>
  );
}

/**
 * Hook para lazy loading manual
 */
export function useLazyLoad<T>(
  items: T[],
  initialCount = 10,
  incrementCount = 10
) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + incrementCount, items.length));
  }, [items.length, incrementCount]);

  const reset = useCallback(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  const hasMore = visibleCount < items.length;
  const visibleItems = items.slice(0, visibleCount);

  return {
    visibleItems,
    hasMore,
    loadMore,
    reset,
    visibleCount,
    totalCount: items.length,
  };
}
