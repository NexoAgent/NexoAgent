import { ReactNode } from "react";

/**
 * Oculta visualmente pero mantiene accesible para lectores de pantalla
 */
export default function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}
