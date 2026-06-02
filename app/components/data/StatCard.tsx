"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import LoadingButton from "../ui/LoadingButton";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  action,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div className="flex items-center gap-2 mb-4">
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-gray-600"
              )}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {change.value}%
            </span>
          )}
          <span className="text-sm text-gray-600">{change.label}</span>
        </div>
      )}

      {action && (
        <LoadingButton
          onClick={action.onClick}
          variant={action.variant || "secondary"}
          size="sm"
          className="w-full"
        >
          {action.label}
        </LoadingButton>
      )}
    </div>
  );
}
