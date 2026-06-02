import { useEffect, useCallback, RefObject } from "react";

interface KeyboardNavOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  enabled?: boolean;
}

/**
 * Hook para navegación completa por teclado
 *
 * Uso:
 * useKeyboardNav({
 *   onEscape: handleClose,
 *   onEnter: handleSubmit,
 *   onArrowDown: selectNext,
 * });
 */
export function useKeyboardNav(options: KeyboardNavOptions) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onHome,
    onEnd,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
        case "Enter":
          if (onEnter) {
            e.preventDefault();
            onEnter();
          }
          break;
        case "ArrowUp":
          if (onArrowUp) {
            e.preventDefault();
            onArrowUp();
          }
          break;
        case "ArrowDown":
          if (onArrowDown) {
            e.preventDefault();
            onArrowDown();
          }
          break;
        case "ArrowLeft":
          if (onArrowLeft) {
            e.preventDefault();
            onArrowLeft();
          }
          break;
        case "ArrowRight":
          if (onArrowRight) {
            e.preventDefault();
            onArrowRight();
          }
          break;
        case "Tab":
          if (onTab) {
            e.preventDefault();
            onTab();
          }
          break;
        case "Home":
          if (onHome) {
            e.preventDefault();
            onHome();
          }
          break;
        case "End":
          if (onEnd) {
            e.preventDefault();
            onEnd();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onHome, onEnd]);
}

/**
 * Hook para focus trap (mantener el foco dentro de un contenedor)
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement>, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Focus inicial
    firstElement?.focus();

    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, enabled]);
}

/**
 * Hook para restablecer el foco al cerrar un modal
 */
export function useRestoreFocus(enabled: boolean = true) {
  const previousFocus = useCallback(() => {
    if (!enabled) return null;
    return document.activeElement as HTMLElement;
  }, [enabled]);

  const restoreFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);

  return { previousFocus, restoreFocus };
}
