"use client";

import { useState } from "react";
import { CurrencySwitcher, useCurrency, formatPrice, getCurrencyText, type Currency } from "./CurrencySwitcher";

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
  const [seleccionado, setSeleccionado] = useState(planActualId);
  const [currency, setCurrency] = useState<Currency>("USD");

  return (
    <>
      {/* Currency Switcher */}
      <div className="mb-6 flex justify-end">
        <CurrencySwitcher onChange={(curr) => setCurrency(curr)} />
      </div>

      <div
        className="plan-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '16px'
        }}
      >
        <style jsx>{`
          @media (min-width: 768px) {
            .plan-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
        `}</style>
      {planes.map((plan) => {
        const isSelected = seleccionado === plan.id;
        return (
          <div
            key={plan.id}
            onClick={(e) => {
              e.preventDefault();
              setSeleccionado(plan.id);
            }}
            style={{
              width: '100%',
              height: '260px',
              padding: '16px',
              border: '2px solid',
              borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, background-color 0.2s'
            }}
          >
            {/* Input oculto para el form */}
            <input
              type="radio"
              name="planId"
              value={plan.id}
              checked={isSelected}
              onChange={() => {}}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              required
            />

            {/* Badge en posición absoluta - no afecta layout */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '3px 6px',
                backgroundColor: isSelected ? '#DBEAFE' : 'transparent',
                color: isSelected ? '#1E40AF' : 'transparent',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                pointerEvents: 'none',
                width: '70px',
                textAlign: 'center'
              }}
            >
              Seleccionado
            </div>

            {/* Contenido */}
            <div style={{ paddingTop: '4px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                {plan.nombre}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', lineHeight: '1' }}>
                  {formatPrice(plan.precio, currency)}
                </p>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px' }}>
                  {getCurrencyText(currency)}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#374151', fontSize: '12px' }}>
                    {plan.maxWhatsApps === -1
                      ? "WhatsApp ilimitados"
                      : `${plan.maxWhatsApps} WhatsApp${plan.maxWhatsApps > 1 ? "s" : ""}`}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#374151', fontSize: '12px' }}>
                    {plan.maxAgentes === -1
                      ? "Agentes ilimitados"
                      : `${plan.maxAgentes} agentes`}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#374151', fontSize: '12px' }}>
                    {plan.maxConversacionesMes.toLocaleString()} conversaciones/mes
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}
