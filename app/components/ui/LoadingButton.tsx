"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { SpinnerInline } from "./Spinner";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * Botón con estado de carga integrado
 *
 * Uso:
 * <LoadingButton loading={isLoading} onClick={handleSubmit}>
 *   Guardar
 * </LoadingButton>
 *
 * <LoadingButton loading={isLoading} loadingText="Guardando...">
 *   Guardar
 * </LoadingButton>
 */
export default function LoadingButton({
  loading = false,
  loadingText,
  variant = "primary",
  size = "md",
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg focus:ring-red-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading && <SpinnerInline className="text-current" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
