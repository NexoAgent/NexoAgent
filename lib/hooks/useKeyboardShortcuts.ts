import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

/**
 * Hook para manejar atajos de teclado globales
 *
 * Uso:
 * useKeyboardShortcuts([
 *   {
 *     key: "k",
 *     ctrlKey: true,
 *     metaKey: true, // Para Mac
 *     description: "Abrir búsqueda",
 *     action: () => setSearchOpen(true)
 *   },
 *   {
 *     key: "/",
 *     description: "Buscar en página",
 *     action: () => focusSearchInput()
 *   }
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Excepción: permitir Escape y Ctrl/Cmd+K incluso en inputs
        if (
          event.key !== "Escape" &&
          !(
            event.key.toLowerCase() === "k" &&
            (event.ctrlKey || event.metaKey)
          )
        ) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey : true;
        const metaMatches = shortcut.metaKey ? event.metaKey : true;
        const shiftMatches = shortcut.shiftKey ? event.shiftKey : true;
        const altMatches = shortcut.altKey ? event.altKey : true;

        // Para Ctrl+Key, aceptar tanto Ctrl como Meta (Mac)
        const modifierMatches =
          shortcut.ctrlKey || shortcut.metaKey
            ? event.ctrlKey || event.metaKey
            : ctrlMatches && metaMatches;

        if (
          keyMatches &&
          modifierMatches &&
          shiftMatches &&
          altMatches
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Detecta si el usuario está en Mac
 */
export function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

/**
 * Formatea un atajo de teclado para mostrarlo
 * Ejemplo: formatShortcut({ key: "k", ctrlKey: true }) → "Ctrl+K" o "⌘K"
 */
export function formatShortcut(shortcut: Omit<KeyboardShortcut, "description" | "action">): string {
  const parts: string[] = [];
  const mac = isMac();

  if (shortcut.ctrlKey || shortcut.metaKey) {
    parts.push(mac ? "⌘" : "Ctrl");
  }

  if (shortcut.shiftKey) {
    parts.push(mac ? "⇧" : "Shift");
  }

  if (shortcut.altKey) {
    parts.push(mac ? "⌥" : "Alt");
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join(mac ? "" : "+");
}
