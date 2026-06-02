"use client";

import { useState, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SwipeAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color: "red" | "blue" | "green" | "gray";
}

interface SwipeableItemProps {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  className?: string;
}

export default function SwipeableItem({
  children,
  leftAction,
  rightAction,
  threshold = 80,
  className,
}: SwipeableItemProps) {
  const [swipeDistance, setSwipeDistance] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const colors = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    gray: "bg-gray-500",
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const distance = currentX - startX.current;

    // Limitar el swipe según las acciones disponibles
    if (distance > 0 && !rightAction) return;
    if (distance < 0 && !leftAction) return;

    setSwipeDistance(distance);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    if (Math.abs(swipeDistance) >= threshold) {
      if (swipeDistance > 0 && rightAction) {
        rightAction.onClick();
      } else if (swipeDistance < 0 && leftAction) {
        leftAction.onClick();
      }
    }

    setSwipeDistance(0);
  };

  const showLeftAction = swipeDistance < -threshold / 2;
  const showRightAction = swipeDistance > threshold / 2;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Acción izquierda (swipe left) */}
      {leftAction && showLeftAction && (
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 flex items-center justify-center px-6 text-white",
            colors[leftAction.color]
          )}
          style={{ width: Math.min(Math.abs(swipeDistance), 120) }}
        >
          <div className="flex flex-col items-center gap-1">
            {leftAction.icon}
            <span className="text-xs font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Acción derecha (swipe right) */}
      {rightAction && showRightAction && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 flex items-center justify-center px-6 text-white",
            colors[rightAction.color]
          )}
          style={{ width: Math.min(swipeDistance, 120) }}
        >
          <div className="flex flex-col items-center gap-1">
            {rightAction.icon}
            <span className="text-xs font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeDistance}px)`,
          transition: isDragging.current ? "none" : "transform 0.3s ease",
        }}
        className="bg-white relative z-10"
      >
        {children}
      </div>
    </div>
  );
}
