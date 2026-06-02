"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  storageKey?: string;
  className?: string;
}

export default function ViewToggle({
  value,
  onChange,
  storageKey,
  className,
}: ViewToggleProps) {
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey) as ViewMode;
      if (saved) onChange(saved);
    }
  }, [storageKey, onChange]);

  const handleChange = (mode: ViewMode) => {
    onChange(mode);
    if (storageKey) {
      localStorage.setItem(storageKey, mode);
    }
  };

  return (
    <div className={cn("flex items-center gap-1 bg-gray-100 rounded-lg p-1", className)}>
      <button
        onClick={() => handleChange("grid")}
        className={cn(
          "p-2 rounded-lg transition-colors",
          value === "grid"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:text-gray-900"
        )}
        title="Vista de tarjetas"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => handleChange("list")}
        className={cn(
          "p-2 rounded-lg transition-colors",
          value === "list"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:text-gray-900"
        )}
        title="Vista de lista"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
