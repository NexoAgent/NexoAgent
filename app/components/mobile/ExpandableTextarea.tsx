"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ExpandableTextarea({
  value,
  onChange,
  placeholder = "Escribe un mensaje...",
  onSubmit,
  disabled = false,
  className,
}: ExpandableTextareaProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleFocus = () => {
    if (isMobile) {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    textareaRef.current?.blur();
  };

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit();
      handleClose();
    }
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700">Escribir respuesta</span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="text-blue-600 font-medium disabled:opacity-50"
          >
            Enviar
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus
          className="flex-1 p-4 text-base resize-none focus:outline-none"
        />
      </div>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={handleFocus}
      placeholder={placeholder}
      disabled={disabled}
      rows={3}
      className={cn(
        "w-full rounded-lg px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
        className
      )}
    />
  );
}
