"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Filter {
  id: string;
  label: string;
  value: string;
  count?: number;
  icon?: ReactNode;
}

interface FilterBarProps {
  filters: Filter[];
  activeFilter: string;
  onChange: (filterId: string) => void;
  className?: string;
}

/**
 * Barra de filtros con tabs
 *
 * Uso:
 * <FilterBar
 *   filters={[
 *     { id: "all", label: "Todas", value: "all", count: 50 },
 *     { id: "pending", label: "Pendientes", value: "pending", count: 5 },
 *   ]}
 *   activeFilter={activeFilter}
 *   onChange={setActiveFilter}
 * />
 */
export default function FilterBar({
  filters,
  activeFilter,
  onChange,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide",
        className
      )}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {filter.icon && (
              <span className={cn(isActive ? "text-white" : "text-gray-500")}>
                {filter.icon}
              </span>
            )}
            <span>{filter.label}</span>
            {filter.count !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
