import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import LoadingButton from "../ui/LoadingButton";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  steps?: string[];
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  steps,
  className,
}: EmptyStateProps) {
  const defaultIcon = (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
        {icon || defaultIcon}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md mb-6">{description}</p>

      {steps && steps.length > 0 && (
        <ol className="text-left text-sm text-gray-600 space-y-2 mb-6">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <LoadingButton
              onClick={action.onClick}
              variant={action.variant || "primary"}
            >
              {action.label}
            </LoadingButton>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const EmptyStates = {
  conversaciones: {
    title: "Aún no hay conversaciones",
    description: "Cuando llegue el primer mensaje por WhatsApp, aparecerá aquí.",
    steps: [
      "Conecta tu WhatsApp Business",
      "Espera el primer mensaje de un cliente",
      "¡Listo! El agente IA responderá automáticamente",
    ],
  },
  contactos: {
    title: "No hay contactos registrados",
    description: "Los contactos se crean automáticamente cuando llegan mensajes.",
    steps: [
      "Recibe mensajes por WhatsApp",
      "Se crea un contacto automáticamente",
      "Puedes agregar notas y hacer seguimiento",
    ],
  },
  citas: {
    title: "Sin citas agendadas",
    description: "Las citas se crean cuando los clientes las solicitan por WhatsApp.",
    steps: [
      "Cliente solicita una cita por WhatsApp",
      "La IA la agenda automáticamente",
      "Se sincroniza con Google Calendar",
    ],
  },
  documentos: {
    title: "Sin documentos de conocimiento",
    description: "Sube documentos para que el agente aprenda sobre tu negocio.",
    steps: [
      "Sube un PDF o archivo de texto",
      "El documento se procesa automáticamente",
      "El agente usa esta información para responder",
    ],
  },
};
