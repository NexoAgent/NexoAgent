"use client";

import { useState, useEffect } from "react";
import { formatShortcut, isMac } from "@/lib/hooks/useKeyboardShortcuts";

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string;
    description: string;
  }>;
}

/**
 * Modal de ayuda que muestra todos los atajos de teclado disponibles
 * Se abre con "?" o "Shift+/"
 */
export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const mac = isMac();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abrir con "?" (Shift + /)
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        // No abrir si está en un input
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          setIsOpen(true);
        }
      }

      // Cerrar con Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: "General",
      shortcuts: [
        {
          keys: mac ? "⌘K" : "Ctrl+K",
          description: "Abrir búsqueda global",
        },
        {
          keys: "?",
          description: "Mostrar atajos de teclado",
        },
        {
          keys: "Esc",
          description: "Cerrar modal o búsqueda",
        },
      ],
    },
    {
      title: "Navegación",
      shortcuts: [
        {
          keys: "G + H",
          description: "Ir a Inicio",
        },
        {
          keys: "G + C",
          description: "Ir a Conversaciones",
        },
        {
          keys: "G + R",
          description: "Ir a CRM",
        },
        {
          keys: "G + K",
          description: "Ir a Conocimiento",
        },
        {
          keys: "G + A",
          description: "Ir a Agenda",
        },
      ],
    },
    {
      title: "Acciones",
      shortcuts: [
        {
          keys: "C",
          description: "Nueva conversación",
        },
        {
          keys: "N",
          description: "Nuevo contacto",
        },
        {
          keys: "/",
          description: "Buscar en página",
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Atajos de Teclado
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Usa estos atajos para navegar más rápido
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-600">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Presiona <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded">?</kbd> en cualquier momento para ver esta ayuda
          </p>
        </div>
      </div>
    </div>
  );
}
