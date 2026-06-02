"use client";

import Tooltip from "./help/Tooltip";

export function TipoContactoTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Lead: Contacto potencial | Cliente: Ya compró | Proveedor: Proveedor de servicios">
      {children}
    </Tooltip>
  );
}

export function ConversacionesTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Número total de conversaciones de WhatsApp con este contacto">
      {children}
    </Tooltip>
  );
}
