/**
 * Formatea una fecha a un formato relativo legible para humanos
 * @param date - Fecha a formatear
 * @returns String con formato relativo (ej: "hace 2 min", "hace 1 hora", "ayer")
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Menos de 1 minuto
  if (diffInSeconds < 60) {
    return "ahora";
  }

  // Menos de 1 hora
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} min`;
  }

  // Menos de 24 horas
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours}h`;
  }

  // Menos de 7 días
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "ayer";
  }
  if (diffInDays < 7) {
    return `hace ${diffInDays} días`;
  }

  // Más de 7 días - mostrar fecha completa
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Formatea una fecha con hora para mostrar en el chat
 * Muestra formato relativo si es reciente, o fecha + hora si es antiguo
 */
export function formatChatTimestamp(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  // Si es de hoy, mostrar solo hora
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Si es de ayer
  if (diffInHours < 48 && date.getDate() === now.getDate() - 1) {
    return `Ayer ${date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Si es de esta semana
  if (diffInHours < 168) {
    return date.toLocaleDateString("es-MX", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Fecha completa
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Clase de utilidad para nombres de clases condicionales (similar a clsx/classnames)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
