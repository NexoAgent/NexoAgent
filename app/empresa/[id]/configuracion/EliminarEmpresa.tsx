"use client";

import { eliminarEmpresa } from "@/app/actions/empresas";

export default function EliminarEmpresa({ id, nombre }: { id: string; nombre: string }) {
  async function handleSubmit(formData: FormData) {
    if (!confirm(`¿Seguro que quieres eliminar "${nombre}"? Se borrarán todos sus datos permanentemente.`)) {
      return;
    }
    await eliminarEmpresa(formData);
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium py-2 px-5 rounded-lg transition-colors hover:bg-red-600 hover:text-white"
        style={{ border: "1px solid #FECACA", color: "#DC2626" }}
      >
        Eliminar empresa
      </button>
    </form>
  );
}
