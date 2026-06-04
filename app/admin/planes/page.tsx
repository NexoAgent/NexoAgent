import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PlanesPage() {
  const session = await auth();

  if (!session || session.user.rol !== "PROVEEDOR") {
    redirect("/dashboard");
  }

  const planes = await prisma.plan.findMany({
    orderBy: { orden: "asc" },
    include: {
      _count: {
        select: { empresas: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold font-sora" style={{ color: "#0E2436" }}>
              Planes y Suscripciones
            </h1>
            <p className="text-sm mt-1" style={{ color: "#73869A" }}>
              Gestiona los planes comerciales disponibles
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>
      </div>

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {planes.map((plan) => {
          const esIlimitado = (valor: number) => valor === -1;
          const formatearLimite = (valor: number, unidad: string) =>
            esIlimitado(valor) ? "Ilimitado" : `${valor} ${unidad}`;

          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              style={{ border: "2px solid #E2E9F0" }}
            >
              {/* Header */}
              <div
                className="px-6 py-5"
                style={{
                  background:
                    plan.nombre === "STARTER"
                      ? "linear-gradient(135deg, #2B82F0 0%, #15B8C9 100%)"
                      : plan.nombre === "BUSINESS"
                      ? "linear-gradient(135deg, #15B8C9 0%, #22B26B 100%)"
                      : "linear-gradient(135deg, #22B26B 0%, #2B82F0 100%)",
                }}
              >
                <h3 className="text-xl font-bold text-white font-sora">
                  {plan.nombre}
                </h3>
                <p className="text-white/90 text-sm mt-1">{plan.descripcion}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    ${plan.precio}
                  </span>
                  <span className="text-white/80 text-sm ml-2">USD/mes</span>
                </div>
              </div>

              {/* Límites */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>WhatsApp:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {formatearLimite(plan.maxWhatsApps, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>Agentes:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {formatearLimite(plan.maxAgentes, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>Conversaciones/mes:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {plan.maxConversacionesMes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#41566B" }}>Documentos:</span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {formatearLimite(plan.maxDocumentosMB, "MB")}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div
                className="px-6 py-4"
                style={{ borderTop: "1px solid #E2E9F0" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#73869A" }}>
                  Características
                </p>
                <div className="space-y-2">
                  {[
                    { key: "transferenciaAgentes", label: "Transferencia de agentes" },
                    { key: "ruteoInteligente", label: "Ruteo inteligente" },
                    { key: "analyticsAvanzados", label: "Analytics avanzados" },
                    { key: "apiPersonalizada", label: "API personalizada" },
                    { key: "soportePrioritario", label: "Soporte prioritario" },
                    { key: "horariosPersonalizados", label: "Horarios personalizados" },
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center gap-2 text-xs">
                      {plan[feature.key as keyof typeof plan] ? (
                        <>
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span style={{ color: "#0E2436" }}>{feature.label}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span style={{ color: "#73869A" }}>{feature.label}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderTop: "1px solid #E2E9F0", background: "#F4F7FA" }}
              >
                <div className="text-sm">
                  <span style={{ color: "#73869A" }}>Empresas: </span>
                  <span className="font-semibold" style={{ color: "#0E2436" }}>
                    {plan._count.empresas}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    plan.visible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.visible ? "Visible" : "Oculto"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Información sobre Planes
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            • <strong>Valor -1 = Ilimitado</strong>: Para agentes o documentos sin límite
          </p>
          <p>
            • <strong>Nuevas empresas</strong>: Inician en estado TRIAL por 14 días
          </p>
          <p>
            • <strong>Contador mensual</strong>: Se resetea automáticamente cada mes
          </p>
          <p>
            • <strong>Precios</strong>: Expresados en USD, opcionalmente se puede agregar precio en moneda local
          </p>
        </div>
      </div>
    </div>
  );
}
