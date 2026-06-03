"use client";

import { useFormState } from "react-dom";
import { crearContacto } from "@/app/actions/crm";
import LoadingButton from "@/app/components/ui/LoadingButton";
import ErrorMessage from "@/app/components/ui/ErrorMessage";

interface ContactFormProps {
  empresaId: string;
}

export default function ContactForm({ empresaId }: ContactFormProps) {
  const [state, formAction] = useFormState(
    async (_prevState: any, formData: FormData) => {
      try {
        await crearContacto(formData);
        return { success: true, error: null };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Error al crear contacto"
        };
      }
    },
    { success: false, error: null }
  );

  return (
    <div className="bg-white rounded-xl p-5 h-fit" style={{ border: "1px solid #E2E9F0" }}>
      <h2 className="font-semibold font-sora text-sm mb-4" style={{ color: "#0E2436" }}>
        Nuevo contacto
      </h2>

      {state.error && (
        <div className="mb-4">
          <ErrorMessage
            message={state.error}
            type="error"
          />
        </div>
      )}

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="empresaId" value={empresaId} />

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#41566B" }}>
            Nombre
          </label>
          <input
            name="nombre"
            type="text"
            placeholder="Ej: María García"
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#41566B" }}>
            Teléfono <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            name="telefono"
            type="text"
            required
            placeholder="Ej: +521234567890"
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#41566B" }}>
            Tipo
          </label>
          <select
            name="tipo"
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ border: "1px solid #E2E9F0", color: "#0E2436" }}
          >
            <option value="LEAD">Lead</option>
            <option value="CLIENTE">Cliente</option>
            <option value="PROVEEDOR">Proveedor</option>
          </select>
        </div>

        <LoadingButton
          type="submit"
          className="w-full text-white text-sm font-medium py-2 rounded-lg transition-opacity hover:opacity-90 grad-bg"
        >
          Crear contacto
        </LoadingButton>
      </form>
    </div>
  );
}
