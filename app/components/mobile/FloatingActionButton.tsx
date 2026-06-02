"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FABProps {
  actions?: FABAction[];
  mainIcon?: React.ReactNode;
  mainAction?: () => void;
  className?: string;
}

export default function FloatingActionButton({
  actions = [],
  mainIcon,
  mainAction,
  className,
}: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainClick = () => {
    if (actions.length > 0) {
      setIsOpen(!isOpen);
    } else if (mainAction) {
      mainAction();
    }
  };

  const defaultIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div className={cn("fixed bottom-6 right-6 z-40", className)}>
      {/* Acciones expandidas */}
      {isOpen && actions.length > 0 && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20"
            onClick={() => setIsOpen(false)}
          />

          {/* Lista de acciones */}
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-slide-in-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Botón principal */}
      <button
        onClick={handleMainClick}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:shadow-xl",
          isOpen ? "bg-gray-600 rotate-45" : "bg-gradient-to-r from-blue-600 to-blue-500"
        )}
      >
        {mainIcon || defaultIcon}
      </button>
    </div>
  );
}
