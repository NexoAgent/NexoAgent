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
 * Componente wrapper que hace prefetch en hover
 */
export function PrefetchLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const prefetch = usePrefetch();

  return (
    <a
      href={href}
      onMouseEnter={() => prefetch(href)}
      className={className}
    >
      {children}
    </a>
  );
}
