"use client";

import { useState } from "react";

interface NotificationTesterProps {
  empresaId: string;
}

export default function NotificationTester({ empresaId }: NotificationTesterProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  async function testNotification() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/push/test?empresaId=${empresaId}`);
      const data = await response.json();
      setResult(data);

      if (data.success && data.result.sent > 0) {
        alert("✅ Notificación de prueba enviada correctamente!");
      } else if (data.subscriptions === 0) {
        alert("⚠️ No hay suscripciones activas. Activa las notificaciones primero.");
      } else {
        alert("❌ Error al enviar notificación. Revisa la consola.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: String(error) });
      alert("❌ Error al enviar notificación de prueba");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="text-xs text-blue-600 hover:text-blue-700 underline"
      >
        {showPanel ? "Ocultar" : "Mostrar"} panel de pruebas
      </button>

      {showPanel && (
        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            🧪 Probar Notificaciones Push
          </h3>
          <p className="text-xs text-blue-700 mb-3">
            Envía una notificación de prueba para verificar que todo funciona correctamente.
          </p>

          <button
            onClick={testNotification}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {loading ? "Enviando..." : "🚀 Enviar Notificación de Prueba"}
          </button>

          {result && (
            <div className="mt-3 p-3 bg-white rounded border border-blue-200">
              <p className="text-xs font-semibold mb-2">Resultado:</p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-3 text-xs text-blue-600">
            <p className="font-semibold mb-1">Checklist:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>¿Permisos de notificaciones otorgados?</li>
              <li>¿Service Worker registrado?</li>
              <li>¿Botón de notificaciones muestra "activadas"?</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
