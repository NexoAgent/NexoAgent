"use client";

import { useRef } from "react";

interface FormularioRespuestaProps {
  conversacionId: string;
  empresaId: string;
  modoHumano: boolean;
  enviarMensajeHumano: (formData: FormData) => Promise<void>;
}

export default function FormularioRespuesta({
  conversacionId,
  empresaId,
  modoHumano,
  enviarMensajeHumano,
}: FormularioRespuestaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Si presiona ENTER (sin Shift), enviar el formulario
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Evitar salto de línea

      if (formRef.current && textareaRef.current?.value.trim()) {
        formRef.current.requestSubmit(); // Enviar el formulario
      }
    }
    // Si presiona Shift+ENTER, permitir salto de línea (comportamiento por defecto)
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <form ref={formRef} action={enviarMensajeHumano} className="flex gap-3">
        <input type="hidden" name="conversacionId" value={conversacionId} />
        <input type="hidden" name="empresaId" value={empresaId} />

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            name="contenido"
            placeholder={
              modoHumano
                ? "Escribe tu respuesta... (Enter para enviar, Shift+Enter para nueva línea)"
                : "IA está respondiendo automáticamente"
            }
            disabled={!modoHumano}
            required
            rows={3}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!modoHumano}
          className="self-end px-5 py-3 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg"
          style={{
            background: modoHumano
              ? "linear-gradient(135deg, #2B82F0 0%, #15B8C9 100%)"
              : "#9CA3AF",
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Enviar
        </button>
      </form>

      {!modoHumano && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          La IA está respondiendo automáticamente. Activa el modo humano para
          responder tú mismo.
        </p>
      )}
    </div>
  );
}
