"use client";

import { useFormState } from "react-dom";
import { crearAutomatizacion } from "@/app/actions/automatizaciones";
import LoadingButton from "@/app/components/ui/LoadingButton";
import ErrorMessage from "@/app/components/ui/ErrorMessage";

const TRIGGERS = [
  {
    key: "PRIMER_MENSAJE",
    label: "Primer mensaje",
    desc: "Cuando un contacto escribe por primera vez",
  },
  {
    key: "PALABRA_CLAVE",
    label: "Palabra clave",
    desc: "Cuando el mensaje contiene ciertas palabras",
  },
  {
    key: "FUERA_HORARIO",
    label: "Fuera de horario",
    desc: "Cuando llega un mensaje fuera del horario de atención",
  },
];

interface AutomatizacionFormProps {
  empresaId: string;
}

export default function AutomatizacionForm({ empresaId }: AutomatizacionFormProps) {
  const [state, formAction] = useFormState(
    async (_prevState: any, formData: FormData) => {
      try {
        await crearAutomatizacion(formData);
        return { success: true, error: null };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Error al crear automatización"
        };
      }
    },
    { success: false, error: null }
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="empresaId" value={empresaId} />

      {state.error && (
        <ErrorMessage
          message={state.error}
          type="error"
        />
      )}

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#41566B" }}>
          Nombre
        </label>
        <input
          name="nombre"
          type="text"
          required
          placeholder="Ej: Bienvenida nuevos clientes"
          className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#41566B" }}>
          Tipo de disparador
        </label>
        <select
          name="trigger"
          className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
        >
          {TRIGGERS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label} — {t.desc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#41566B" }}>
          Condición{" "}
          <span className="font-normal" style={{ color: "#73869A" }}>
            (solo para Palabra clave y Fuera de horario)
          </span>
        </label>
        <input
          name="condicion"
          type="text"
          placeholder="Ej: precio, tarifa  ó  09:00-18:00"
          className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#41566B" }}>
          Mensaje a enviar
        </label>
        <textarea
          name="mensaje"
          required
          rows={4}
          placeholder="Ej: ¡Hola! Soy Katy 😊 ¿En qué te puedo ayudar hoy?"
          className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none"
          style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
        />
      </div>

      <LoadingButton
        type="submit"
        className="w-full text-white text-sm font-medium py-2.5 rounded-lg transition-opacity hover:opacity-90 grad-bg"
      >
        Crear automatización
      </LoadingButton>
    </form>
  );
}
