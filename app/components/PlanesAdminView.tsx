"use client";

import { useState } from "react";
import Link from "next/link";
import { CurrencySwitcher, formatPrice, getCurrencyText, type Currency } from "./CurrencySwitcher";

type Plan = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  maxWhatsApps: number;
  maxAgentes: number;
  maxConversacionesMes: number;
  maxDocumentosMB: number;
  transferenciaAgentes: boolean;
  ruteoInteligente: boolean;
  analyticsAvanzados: boolean;
  apiPersonalizada: boolean;
  soportePrioritario: boolean;
  horariosPersonalizados: boolean;
  visible: boolean;
  orden: number;
  _count: {
    empresas: number;
  };
};

interface PlanesAdminViewProps {
  planes: Plan[];
}

export default function PlanesAdminView({ planes }: PlanesAdminViewProps) {
  const [currency, setCurrency] = useState<Currency>("USD");

  const esIlimitado = (valor: number) => valor === -1;
  const formatearLimite = (valor: number, unidad: string) =>
    esIlimitado(valor) ? "Ilimitado" : `${valor} ${unidad}`;

  return (
    <>
      {/* Currency Switcher */}
      <div className="mb-6 flex justify-end">
        <CurrencySwitcher onChange={(curr) => setCurrency(curr)} />
      </div>

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {planes.map((plan) => {
          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              style={{ border: "2px solid #E2E9F0" }}
            >
              {/* Header */}
              <div
                className="px-6 py-5"
                style={{
                  background:
                    plan.nombre === "STARTER"
                      ? "linear-gradient(135deg, #2B82F0 0%, #15B8C9 100%)"
                      : plan.nombre === "BUSINESS"
                      ? "linear-gradient(135deg, #15B8C9 0%, #22B26B 100%)"
                      : "linear-gradient(135deg, #22B26B 0%, #2B82F0 100%)",
                }}
              >
                <h3 className="text-xl font-bold text-white font-sora">
                  {plan.nombre}
                </h3>
                <p className="text-white/90 text-sm mt-1">{plan.descripcion}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(plan.precio, currency)}
                  </span>
                  <span className="text-white/80 text-sm ml-2">{getCurrencyText(currency)}</span>
                </div>
              </div>

              {/* Límites */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>WhatsApp:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {formatearLimite(plan.maxWhatsApps, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>Agentes:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {formatearLimite(plan.maxAgentes, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>Conversaciones/mes:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {plan.maxConversacionesMes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>Documentos:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {formatearLimite(plan.maxDocumentosMB, "MB")}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div
                className="px-6 py-4"
                style={{ borderTop: "1px solid #E2E9F0" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#73869A" }}>
                  Características
                </p>
                <div className="space-y-2">
                  {[
                    { key: "transferenciaAgentes", label: "Transferencia de agentes" },
                    { key: "ruteoInteligente", label: "Ruteo inteligente" },
                    { key: "analyticsAvanzados", label: "Analytics avanzados" },
                    { key: "apiPersonalizada", label: "API personalizada" },
                    { key: "soportePrioritario", label: "Soporte prioritario" },
                    { key: "horariosPersonalizados", label: "Horarios personalizados" },
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center gap-2 text-xs">
                      {plan[feature.key as keyof typeof plan] ? (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span style={{ color: "#41566B" }}>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderTop: "1px solid #E2E9F0", background: "#FAFCFE" }}
              >
                <div className="text-xs" style={{ color: "#73869A" }}>
                  {plan._count.empresas} empresa{plan._count.empresas !== 1 ? "s" : ""}
                </div>
                <Link
                  href={`/admin/planes/${plan.id}/editar`}
                  className="text-xs font-medium hover:underline"
                  style={{ color: "#2B82F0" }}
                >
                  Editar plan
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
