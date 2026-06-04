"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "EUR";

interface CurrencySwitcherProps {
  onChange?: (currency: Currency) => void;
  className?: string;
}

export function CurrencySwitcher({ onChange, className = "" }: CurrencySwitcherProps) {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    // Cargar preferencia del localStorage
    const saved = localStorage.getItem("preferredCurrency") as Currency;
    if (saved === "USD" || saved === "EUR") {
      setCurrency(saved);
      onChange?.(saved);
    }
  }, [onChange]);

  const handleToggle = () => {
    const newCurrency: Currency = currency === "USD" ? "EUR" : "USD";
    setCurrency(newCurrency);
    localStorage.setItem("preferredCurrency", newCurrency);
    onChange?.(newCurrency);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Moneda:</span>
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex items-center bg-gray-100 rounded-lg p-1 transition-colors hover:bg-gray-200"
        aria-label="Cambiar moneda"
      >
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${
            currency === "USD"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600"
          }`}
        >
          $ USD
        </span>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${
            currency === "EUR"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600"
          }`}
        >
          € EUR
        </span>
      </button>
    </div>
  );
}

// Hook para usar la moneda en componentes
export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency") as Currency;
    if (saved === "USD" || saved === "EUR") {
      setCurrency(saved);
    }
  }, []);

  return currency;
}

// Utilidad para formatear precios
export function formatPrice(priceUSD: number, currency: Currency): string {
  const USD_TO_EUR = 0.92; // Tasa de cambio aproximada

  if (currency === "EUR") {
    const priceEUR = priceUSD * USD_TO_EUR;
    return `€${priceEUR.toFixed(2)}`;
  }

  return `$${priceUSD}`;
}

// Utilidad para obtener el símbolo de moneda
export function getCurrencySymbol(currency: Currency): string {
  return currency === "USD" ? "$" : "€";
}

// Utilidad para obtener el texto completo
export function getCurrencyText(currency: Currency): string {
  return currency === "USD" ? "USD/mes" : "EUR/mes";
}
