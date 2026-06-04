"use client";

import { useEffect } from "react";

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  maxWhatsApps: number;
  maxAgentes: number;
  maxConversacionesMes: number;
}

interface PlanSelectorProps {
  planes: Plan[];
  planActualId: string | null;
}

export default function PlanSelector({ planes, planActualId }: PlanSelectorProps) {
  useEffect(() => {
    // Prevenir cualquier scroll al hacer clic en los radio buttons
    const labels = document.querySelectorAll('input[name="planId"]');
    labels.forEach((input) => {
      input.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        target.checked = true;
        // Forzar que la página no se mueva
        window.scrollTo({ top: window.scrollY, behavior: 'auto' });
      });
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {planes.map((plan) => {
        const esActual = planActualId === plan.id;
        return (
          <label
            key={plan.id}
            className="relative cursor-pointer block"
            onClick={(e) => {
              // Prevenir scroll
              const scrollY = window.scrollY;
              setTimeout(() => {
                window.scrollTo({ top: scrollY, behavior: 'auto' });
              }, 0);
            }}
          >
            <input
              type="radio"
              name="planId"
              value={plan.id}
              defaultChecked={esActual}
              required
              className="sr-only peer"
            />
            <div
              className="rounded-xl p-5 border-2 border-gray-200 bg-white peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors"
              style={{ minHeight: '280px' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900">{plan.nombre}</h3>
                <span
                  className="px-2 py-1 text-xs font-medium rounded"
                  style={{
                    backgroundColor: esActual ? '#DBEAFE' : 'transparent',
                    color: esActual ? '#1E40AF' : 'transparent',
                    minWidth: '90px',
                    textAlign: 'center'
                  }}
                >
                  Seleccionado
                </span>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">${plan.precio}</p>
                <p className="text-sm text-gray-600">USD/mes</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {plan.maxWhatsApps === -1
                      ? "WhatsApp ilimitados"
                      : `${plan.maxWhatsApps} WhatsApp${plan.maxWhatsApps > 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {plan.maxAgentes === -1
                      ? "Agentes ilimitados"
                      : `${plan.maxAgentes} agentes`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{plan.maxConversacionesMes.toLocaleString()} conversaciones/mes</span>
                </div>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
