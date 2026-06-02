"use client";

import { useToast } from "@/lib/context/ToastContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  };
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Duración de la animación
  };

  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-900",
      textColor: "text-emerald-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      textColor: "text-red-700",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
      textColor: "text-amber-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      textColor: "text-blue-700",
    },
  };

  const style = styles[toast.type];

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
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
        "rounded-xl border shadow-lg p-4 min-w-[320px] transition-all duration-300",
        style.bg,
        style.border,
        isExiting
          ? "opacity-0 translate-x-8"
          : "opacity-100 translate-x-0 animate-slide-in-right"
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            style.iconBg,
            style.iconColor
          )}
        >
          {icons[toast.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={cn("text-sm font-semibold mb-1", style.titleColor)}>
              {toast.title}
            </p>
          )}
          <p className={cn("text-sm", style.textColor)}>{toast.message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
