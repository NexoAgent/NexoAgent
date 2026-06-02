"use client";

import { ReactNode } from "react";
import LoadingButton from "./LoadingButton";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  icon?: ReactNode;
}

/**
 * Modal de confirmación para acciones destructivas o importantes
 *
 * Uso:
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={handleDelete}
 *   title="¿Eliminar contacto?"
 *   message="Esta acción no se puede deshacer. Se eliminará Juan Pérez y todo su historial."
 *   confirmText="Sí, eliminar"
 *   variant="danger"
 * />
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
  icon,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    if (!loading) {
      onClose();
    }
  };

  const variants = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      buttonVariant: "danger" as const,
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
      buttonVariant: "primary" as const,
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      buttonVariant: "primary" as const,
    },
  };

  const style = variants[variant];

  const defaultIcon = {
    danger: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${style.iconBg} ${style.iconColor}`}
            >
              {icon || defaultIcon[variant]}
            </div>
          </div>

          {/* Title & Message */}
          <div className="text-center mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${style.titleColor}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <LoadingButton
              onClick={handleConfirm}
              loading={loading}
              variant={style.buttonVariant}
              className="flex-1"
            >
              {confirmText}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook helper para manejar confirmaciones
 */
export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Omit<ConfirmDialogProps, "isOpen" | "onClose" | "onConfirm">>({
    title: "",
    message: "",
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(null);

  const confirm = (
    title: string,
    message: string,
    options?: Partial<Omit<ConfirmDialogProps, "isOpen" | "onClose" | "onConfirm" | "title" | "message">>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        ...options,
      });
      setOnConfirmCallback(() => async () => {
        resolve(true);
        setIsOpen(false);
      });
      setIsOpen(true);
    });
  };

  const Dialog = () => (
    <ConfirmDialog
      {...config}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      onConfirm={onConfirmCallback || (() => {})}
    />
  );

  return { confirm, Dialog };
}

// Necesitamos importar useState
import { useState } from "react";
