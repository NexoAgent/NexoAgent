import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { crearAgente } from "@/app/actions/agentes";
import { checkPlanLimit } from "@/lib/plan-limits";

export default async function NuevoAgentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: empresaId } = await params;

  const session = await auth();
  if (!session) redirect("/login");

  if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
    redirect(`/empresa/${session.user.empresaId}/agentes/nuevo`);
  }

  const empresa = await prisma.empresa.findUnique({
    where: { id: empresaId },
    include: { plan: true },
  });

  if (!empresa) redirect("/dashboard");

  const limitCheck = await checkPlanLimit(empresaId, "agentes");

  if (!limitCheck.allowed) {
    redirect(`/empresa/${empresaId}/agentes?error=Has+alcanzado+el+límite+de+tu+plan`);
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
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Agente</h1>
        <p className="text-gray-600 mt-2">
          Configura un agente especializado para tu empresa
        </p>
      </div>

      <form action={crearAgente} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <input type="hidden" name="empresaId" value={empresaId} />

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Atención al Cliente, Ventas, Soporte Técnico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                name="descripcion"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Breve descripción del rol del agente"
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
                      defaultChecked={color.hex === "#3B82F6"}
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

        {/* Prompt del agente */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              placeholder="Eres un agente especializado en... Tu objetivo es... Debes responder de manera..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Define cómo debe comportarse este agente, su tono, conocimiento especializado, y tareas específicas.
            </p>
          </div>
        </div>

        {/* Ruteo inteligente */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ruteo automático</h2>
          <p className="text-sm text-gray-600 mb-4">
            Configura palabras clave para que las conversaciones se asignen automáticamente a este agente
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palabras clave (separadas por comas)
            </label>
            <input
              type="text"
              name="palabrasClave"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="soporte, ayuda, problema, técnico, error"
            />
            <p className="text-xs text-gray-500 mt-2">
              Cuando un mensaje contenga estas palabras, se asignará automáticamente a este agente
            </p>
          </div>
        </div>

        {/* Horarios */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Horarios de disponibilidad</h2>
          <p className="text-sm text-gray-600 mb-4">
            Define cuándo este agente está disponible (opcional)
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora inicio
              </label>
              <input
                type="time"
                name="horarioInicio"
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
                <label
                  key={dia.value}
                  className="relative cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="diasSemana"
                    value={dia.value}
                    defaultChecked
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
            Crear agente
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
