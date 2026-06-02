import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/**
 * Hook para prefetch de rutas en hover
 *
 * Uso:
 * const prefetch = usePrefetch();
 *
 * <Link
 *   href="/conversaciones/123"
 *   onMouseEnter={() => prefetch("/conversaciones/123")}
 * >
 */
export function usePrefetch() {
  const router = useRouter();
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  const prefetch = useCallback(
    (route: string) => {
      // Evitar prefetch duplicado
      if (prefetchedRoutes.current.has(route)) return;

      // Marcar como prefetched
      prefetchedRoutes.current.add(route);

      // Prefetch con Next.js router
      router.prefetch(route);
    },
    [router]
  );

  return prefetch;
}

/**
 * Helper para crear props de prefetch
 */
export function createPrefetchProps(href: string, prefetch: (route: string) => void) {
  return {
    href,
    onMouseEnter: () => prefetch(href),
  };
}
