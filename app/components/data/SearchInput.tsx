"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  className?: string;
}

/**
 * Input de búsqueda con debounce
 *
 * Uso:
 * <SearchInput
 *   placeholder="Buscar conversaciones..."
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   debounce={300}
 * />
 */
export default function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  debounce = 300,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(internalValue);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [internalValue, debounce, onChange]);

  // Sincronizar con valor externo
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
