"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  icon?: ReactNode;
}

/**
 * Componente de error accionable con contexto claro
 *
 * Uso:
 * <ErrorMessage
 *   title="No se pudo enviar el mensaje"
 *   message="Verifica tu conexión a internet y vuelve a intentarlo."
 *   action={{
 *     label: "Reintentar",
 *     onClick: handleRetry
 *   }}
 *   secondaryAction={{
 *     label: "Contactar soporte",
 *     onClick: () => window.location.href = 'mailto:support@...'
 *   }}
 * />
 */
export default function ErrorMessage({
  title,
  message,
  type = "error",
  action,
  secondaryAction,
  className,
  icon,
}: ErrorMessageProps) {
  const styles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-500",
      titleColor: "text-red-900",
      textColor: "text-red-700",
      buttonPrimary: "bg-red-600 hover:bg-red-700 text-white",
      buttonSecondary: "text-red-600 hover:bg-red-100",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconColor: "text-amber-500",
      titleColor: "text-amber-900",
      textColor: "text-amber-700",
      buttonPrimary: "bg-amber-600 hover:bg-amber-700 text-white",
      buttonSecondary: "text-amber-600 hover:bg-amber-100",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-500",
      titleColor: "text-blue-900",
      textColor: "text-blue-700",
      buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonSecondary: "text-blue-600 hover:bg-blue-100",
    },
  };

  const style = styles[type];

  const defaultIcon = {
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        style.bg,
        style.border,
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn("flex-shrink-0", style.iconColor)}>
          {icon || defaultIcon[type]}
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h3 className={cn("text-sm font-semibold mb-1", style.titleColor)}>
              {title}
            </h3>
          )}
          <p className={cn("text-sm", style.textColor)}>{message}</p>

          {/* Actions */}
          {(action || secondaryAction) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {action && (
                <button
                  onClick={action.onClick}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    style.buttonPrimary
                  )}
                >
                  {action.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    style.buttonSecondary
                  )}
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Mensajes de error predefinidos comunes
 */
export const ErrorMessages = {
  networkError: (onRetry?: () => void) => ({
    title: "Error de conexión",
    message: "No se pudo conectar al servidor. Verifica tu conexión a internet.",
    type: "error" as const,
    action: onRetry
      ? {
          label: "Reintentar",
          onClick: onRetry,
        }
      : undefined,
  }),

  unauthorized: () => ({
    title: "No autorizado",
    message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    type: "warning" as const,
    action: {
      label: "Iniciar sesión",
      onClick: () => (window.location.href = "/login"),
    },
  }),

  notFound: () => ({
    title: "No encontrado",
    message: "El recurso que buscas no existe o ha sido eliminado.",
    type: "warning" as const,
  }),

  serverError: (onRetry?: () => void) => ({
    title: "Error del servidor",
    message: "Algo salió mal en nuestros servidores. Estamos trabajando para solucionarlo.",
    type: "error" as const,
    action: onRetry
      ? {
          label: "Reintentar",
          onClick: onRetry,
        }
      : undefined,
    secondaryAction: {
      label: "Contactar soporte",
      onClick: () => (window.location.href = "mailto:perofaga@gmail.com"),
    },
  }),

  validationError: (message: string) => ({
    title: "Datos inválidos",
    message,
    type: "warning" as const,
  }),
};
