"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EmpresaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en módulo de empresa:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-red-900 mb-4">Error en la aplicación</h1>
        <p className="text-gray-700 mb-6">
          {error.message || "Ocurrió un error al cargar este módulo."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
