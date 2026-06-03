"use client";

import Tooltip from "@/app/components/help/Tooltip";

interface ContactBadgeProps {
  tipo: "LEAD" | "CLIENTE" | "PROVEEDOR";
  label: string;
  color: string;
  bg: string;
}

const TOOLTIPS = {
  LEAD: "Contacto potencial que aún no ha comprado",
  CLIENTE: "Cliente que ya realizó una compra o contrató",
  PROVEEDOR: "Proveedor de servicios o productos",
};

export default function ContactBadge({ tipo, label, color, bg }: ContactBadgeProps) {
  return (
    <Tooltip content={TOOLTIPS[tipo]} position="top">
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium cursor-help"
        style={{ background: bg, color }}
      >
        {label}
      </span>
    </Tooltip>
  );
}
