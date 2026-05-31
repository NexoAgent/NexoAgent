type Automatizacion = {
  id: string;
  trigger: string;
  condicion: string | null;
  mensaje: string;
};

// Evalúa si alguna automatización se activa para este mensaje
export function evaluarAutomatizaciones(
  automatizaciones: Automatizacion[],
  mensaje: string,
  esPrimerMensaje: boolean,
  zonaHoraria = "America/Mexico_City"
): Automatizacion | null {
  for (const auto of automatizaciones) {
    if (auto.trigger === "PRIMER_MENSAJE" && esPrimerMensaje) {
      return auto;
    }

    if (auto.trigger === "PALABRA_CLAVE" && auto.condicion) {
      const palabras = auto.condicion.split(",").map((p) => p.trim().toLowerCase());
      const mensajeLower = mensaje.toLowerCase();
      if (palabras.some((p) => p && mensajeLower.includes(p))) {
        return auto;
      }
    }

    if (auto.trigger === "FUERA_HORARIO" && auto.condicion) {
      // condicion formato: "09:00-18:00" = horario de atención
      // Si el mensaje llega FUERA de ese horario, se activa
      const [inicio, fin] = auto.condicion.split("-");
      if (inicio && fin) {
        const ahora = new Date().toLocaleTimeString("es-MX", {
          timeZone: zonaHoraria,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        if (ahora < inicio || ahora >= fin) {
          return auto;
        }
      }
    }
  }
  return null;
}
