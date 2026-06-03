"use client";

import Tooltip from "./help/Tooltip";

/**
 * Tooltips específicos para el CRM
 */

export function LeadTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Contacto potencial que aún no ha comprado" position="top">
      {children}
    </Tooltip>
  );
}

export function ClienteTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Cliente que ya realizó una compra o contrató" position="top">
      {children}
    </Tooltip>
  );
}

export function ProveedorTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Proveedor de servicios o productos" position="top">
      {children}
    </Tooltip>
  );
}

export function ConversacionesTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Total de conversaciones por WhatsApp" position="bottom">
      {children}
    </Tooltip>
  );
}

export function ExportTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Exportar contactos a CSV o JSON" position="left">
      {children}
    </Tooltip>
  );
}

export function SearchTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip content="Buscar por nombre o teléfono" position="bottom">
      {children}
    </Tooltip>
  );
}

export function FilterTooltip({ tipo }: { tipo: "LEAD" | "CLIENTE" | "PROVEEDOR" | "TODOS" }) {
  const tooltips = {
    TODOS: "Mostrar todos los contactos",
    LEAD: "Filtrar solo contactos potenciales",
    CLIENTE: "Filtrar solo clientes que compraron",
    PROVEEDOR: "Filtrar solo proveedores",
  };

  return (
    <Tooltip content={tooltips[tipo]} position="bottom">
      <span className="inline-block">{/* El badge irá aquí */}</span>
    </Tooltip>
  );
}
