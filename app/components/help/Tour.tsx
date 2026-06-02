"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface TourContextValue {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  const startTour = (tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem("tour-completed", "true");
  };

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        nextStep,
        prevStep,
        endTour,
      }}
    >
      {children}
      {isActive && <TourOverlay />}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) throw new Error("useTour must be used within TourProvider");
  return context;
}

function TourOverlay() {
  const { steps, currentStep, nextStep, prevStep, endTour } = useTour();
  const step = steps[currentStep];

  if (!step) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={endTour} />

      {/* Tooltip del tour */}
      <div className="fixed z-50 max-w-sm bg-white rounded-xl shadow-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">
              Paso {currentStep + 1} de {steps.length}
            </p>
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
          </div>
          <button
            onClick={endTour}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">{step.content}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirst}
            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === currentStep ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLast ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </>
  );
}

export const defaultTour: TourStep[] = [
  {
    target: "#conversaciones",
    title: "Conversaciones",
    content: "Aquí verás todos los chats con tus clientes. La IA responde automáticamente.",
  },
  {
    target: "#modo-humano",
    title: "Modo Humano",
    content: "Cuando un cliente necesita atención personalizada, puedes tomar el control.",
  },
  {
    target: "#crm",
    title: "CRM",
    content: "Gestiona todos tus contactos, agrega notas y haz seguimiento.",
  },
  {
    target: "#conocimiento",
    title: "Base de Conocimiento",
    content: "Sube documentos para que la IA aprenda sobre tu negocio.",
  },
  {
    target: "#agenda",
    title: "Agenda",
    content: "Las citas se crean automáticamente cuando los clientes las solicitan.",
  },
];
