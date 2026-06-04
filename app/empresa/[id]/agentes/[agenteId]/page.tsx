import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { actualizarAgente, eliminarAgente, toggleActivoAgente, marcarAgentePrincipal } from "@/app/actions/agentes";

export default async function EditarAgentePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; agenteId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: empresaId, agenteId } = await params;
  const { error } = await searchParams;

  const session = await auth();
  if (!session) redirect("/login");

  if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
    redirect(`/empresa/${session.user.empresaId}/agentes`);
  }

  const agente = await prisma.agente.findUnique({
    where: { id: agenteId },
    include: {
      _count: {
        select: {
          conversaciones: true,
        },
      },
    },
  });

  if (!agente || agente.empresaId !== empresaId) {
    redirect(`/empresa/${empresaId}/agentes?error=Agente+no+encontrado`);
  }

  const colores = [
    { hex: "#3B82F6", nombre: "Azul" },
    { hex: "#10B981", nombre: "Verde" },
    { hex: "#F59E0B", nombre: "Amarillo" },
    { hex: "#EF4444", nombre: "Rojo" },
    { hex: "#8B5CF6", nombre: "Violeta" },
    { hex: "#EC4899", nombre: "Rosa" },
    { hex: "#06B6D4", nombre: "Cian" },
    { hex: "#6366F1", nombre: "Índigo" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Agente</h1>
        <p className="text-gray-600 mt-2">{agente.nombre}</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ⚠️ {decodeURIComponent(error)}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Estado actual</p>
            <div className="flex items-center gap-2 mt-1">
              {agente.activo && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Activo
                </span>
              )}
              {!agente.activo && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  Inactivo
                </span>
              )}
              {agente.esPrincipal && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                  Principal
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{agente._count.conversaciones}</p>
            <p className="text-xs text-gray-500">conversaciones</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <form action={toggleActivoAgente} className="inline">
          <input type="hidden" name="empresaId" value={empresaId} />
          <input type="hidden" name="agenteId" value={agenteId} />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              agente.activo
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {agente.activo ? "Desactivar" : "Activar"}
          </button>
        </form>

        {!agente.esPrincipal && (
          <form action={marcarAgentePrincipal} className="inline">
            <input type="hidden" name="empresaId" value={empresaId} />
            <input type="hidden" name="agenteId" value={agenteId} />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-medium transition"
            >
              Marcar como principal
            </button>
          </form>
        )}

        {!agente.esPrincipal && (
          <form action={eliminarAgente} className="inline">
            <input type="hidden" name="empresaId" value={empresaId} />
            <input type="hidden" name="agenteId" value={agenteId} />
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm("¿Seguro que deseas eliminar este agente?")) {
                  e.preventDefault();
                }
              }}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition"
            >
              Eliminar agente
            </button>
          </form>
        )}
      </div>

      <form action={actualizarAgente} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <input type="hidden" name="empresaId" value={empresaId} />
        <input type="hidden" name="agenteId" value={agenteId} />

        {/* Información básica */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información básica</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del agente *
              </label>
              <input
                type="text"
                name="nombre"
                required
                defaultValue={agente.nombre}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                name="descripcion"
                defaultValue={agente.descripcion || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color identificativo
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {colores.map((color) => (
                  <label
                    key={color.hex}
                    className="relative cursor-pointer group"
                    title={color.nombre}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color.hex}
                      defaultChecked={color.hex === agente.color}
                      className="sr-only peer"
                    />
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-transparent peer-checked:border-gray-900 peer-checked:ring-2 peer-checked:ring-gray-900 peer-checked:ring-offset-2 transition"
                      style={{ backgroundColor: color.hex }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personalidad y comportamiento</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt del agente *
            </label>
            <textarea
              name="prompt"
              required
              rows={8}
              defaultValue={agente.prompt}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Ruteo */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ruteo automático</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palabras clave (separadas por comas)
            </label>
            <input
              type="text"
              name="palabrasClave"
              defaultValue={agente.palabrasClave?.join(", ") || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Horarios */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Horarios de disponibilidad</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora inicio
              </label>
              <input
                type="time"
                name="horarioInicio"
                defaultValue={agente.horarioInicio || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora fin
              </label>
              <input
                type="time"
                name="horarioFin"
                defaultValue={agente.horarioFin || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de la semana
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 1, label: "Lun" },
                { value: 2, label: "Mar" },
                { value: 3, label: "Mié" },
                { value: 4, label: "Jue" },
                { value: 5, label: "Vie" },
                { value: 6, label: "Sáb" },
                { value: 0, label: "Dom" },
              ].map((dia) => (
                <label key={dia.value} className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    name="diasSemana"
                    value={dia.value}
                    defaultChecked={agente.diasSemana?.includes(dia.value)}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-2 border-2 border-gray-300 rounded-lg peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700 transition text-sm font-medium">
                    {dia.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-md"
          >
            Guardar cambios
          </button>
          <a
            href={`/empresa/${empresaId}/agentes`}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
