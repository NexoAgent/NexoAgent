/**
 * Utilidades para accesibilidad (a11y)
 */

/**
 * Verifica si un color tiene contraste suficiente
 * WCAG AA requiere 4.5:1 para texto normal, 3:1 para texto grande
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color: string): number {
  // Convertir hex a RGB
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Calcular luminancia relativa
  const [rr, gg, bb] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

/**
 * Genera ARIA attributes comunes
 */
export const aria = {
  button: (label: string, expanded?: boolean, controls?: string) => ({
    role: "button",
    "aria-label": label,
    ...(expanded !== undefined && { "aria-expanded": expanded }),
    ...(controls && { "aria-controls": controls }),
  }),

  input: (label: string, required?: boolean, invalid?: boolean, describedBy?: string) => ({
    "aria-label": label,
    ...(required && { "aria-required": true }),
    ...(invalid && { "aria-invalid": true }),
    ...(describedBy && { "aria-describedby": describedBy }),
  }),

  loading: (label: string = "Cargando") => ({
    role: "status",
    "aria-live": "polite",
    "aria-label": label,
  }),

  alert: (label?: string) => ({
    role: "alert",
    "aria-live": "assertive",
    ...(label && { "aria-label": label }),
  }),

  dialog: (label: string, describedBy?: string) => ({
    role: "dialog",
    "aria-modal": true,
    "aria-label": label,
    ...(describedBy && { "aria-describedby": describedBy }),
  }),

  navigation: (label: string) => ({
    role: "navigation",
    "aria-label": label,
  }),

  tablist: () => ({
    role: "tablist",
  }),

  tab: (selected: boolean, controls: string) => ({
    role: "tab",
    "aria-selected": selected,
    "aria-controls": controls,
    tabIndex: selected ? 0 : -1,
  }),

  tabpanel: (labelledBy: string) => ({
    role: "tabpanel",
    "aria-labelledby": labelledBy,
  }),
};

/**
 * Genera un ID único para vincular label con input
 */
export function generateId(prefix: string = "a11y"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verifica si el contraste cumple con WCAG
 */
export function meetsWCAG(foreground: string, background: string, level: "AA" | "AAA" = "AA"): {
  normal: boolean;
  large: boolean;
  ratio: number;
} {
  const ratio = getContrastRatio(foreground, background);
  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };

  return {
    normal: ratio >= thresholds[level].normal,
    large: ratio >= thresholds[level].large,
    ratio: Math.round(ratio * 100) / 100,
  };
}

/**
 * Announce para lectores de pantalla
 */
export function announce(message: string, priority: "polite" | "assertive" = "polite") {
  const announcer = document.createElement("div");
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", priority);
  announcer.className = "sr-only";
  announcer.textContent = message;
  document.body.appendChild(announcer);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}
