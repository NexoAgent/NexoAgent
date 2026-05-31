"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600">Error</h1>
        <p className="text-xl text-gray-900 mt-4 font-semibold">
          Algo salió mal
        </p>
        <p className="text-gray-600 mt-2">
          {error.message || "Ocurrió un error inesperado. Por favor intenta de nuevo."}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
