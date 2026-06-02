import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Componente base de skeleton (placeholder animado)
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200",
        className
      )}
    />
  );
}

/**
 * Skeleton para texto (líneas)
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full" // Última línea más corta
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton para card/tarjeta
 */
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Skeleton para tabla
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-gray-200 p-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para lista
 */
export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3"
        >
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para chat/conversación
 */
export function SkeletonChat() {
  return (
    <div className="space-y-4 p-5">
      {/* Mensaje del cliente */}
      <div className="flex justify-start">
        <div className="max-w-sm space-y-1">
          <Skeleton className="h-16 w-64 rounded-2xl rounded-tl-sm" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Mensaje del asistente */}
      <div className="flex justify-end">
        <div className="max-w-sm space-y-1 items-end flex flex-col">
          <Skeleton className="h-20 w-72 rounded-2xl rounded-tr-sm" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Mensaje del cliente */}
      <div className="flex justify-start">
        <div className="max-w-sm space-y-1">
          <Skeleton className="h-12 w-48 rounded-2xl rounded-tl-sm" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para página completa
 */
export function SkeletonPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main content */}
      <SkeletonTable />
    </div>
  );
}
