import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

/**
 * Spinner animado para estados de carga
 *
 * Uso:
 * <Spinner />
 * <Spinner size="lg" />
 * <Spinner label="Cargando..." />
 */
export default function Spinner({ size = "md", className, label }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={cn(
          "animate-spin rounded-full border-blue-500 border-t-transparent",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label={label || "Cargando"}
      />
      {label && (
        <p className="text-sm text-gray-600 animate-pulse">{label}</p>
      )}
    </div>
  );
}

/**
 * Spinner inline para textos
 */
export function SpinnerInline({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
