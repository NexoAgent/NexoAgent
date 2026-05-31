import { prisma } from "@/lib/prisma";
import { crearCita, cambiarEstadoCita, eliminarCita, guardarCalendly } from "@/app/actions/agenda";
import { EstadoCita } from "@/app/generated/prisma/client";

function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

function formatearHora(fecha: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

function obtenerColorEstado(estado: EstadoCita): string {
  switch (estado) {
    case "CONFIRMADA":
      return "bg-green-100 text-green-800 border-green-300";
    case "CANCELADA":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
}

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [empresa, citas, citasHoy, citasProximas] = await Promise.all([
    prisma.empresa.findUnique({ where: { id }, select: { nombre: true, calendlyUrl: true } }),
    prisma.cita.findMany({
      where: { empresaId: id },
      include: { contacto: true },
      orderBy: { inicio: "desc" },
      take: 50,
    }),
    prisma.cita.count({
      where: {
        empresaId: id,
        inicio: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.cita.count({
      where: {
        empresaId: id,
        inicio: { gte: new Date() },
        estado: { not: "CANCELADA" },
      },
    }),
  ]);

  if (!empresa) return <div className="p-8 text-red-600">Empresa no encontrada</div>;

  const ahora = new Date();
  const citasPasadas = citas.filter((c) => c.fin < ahora);
  const citasFuturas = citas.filter((c) => c.inicio >= ahora && c.estado !== "CANCELADA");
  const citasCanceladas = citas.filter((c) => c.estado === "CANCELADA");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header con KPIs */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📅 Agenda</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Citas hoy</p>
          <p className="text-3xl font-bold text-blue-600">{citasHoy}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Próximas citas</p>
          <p className="text-3xl font-bold text-green-600">{citasProximas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total de citas</p>
          <p className="text-3xl font-bold text-purple-600">{citas.length}</p>
        </div>
      </div>

      {/* Integración Calendly */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🔗 Integración Calendly
        </h2>
        <form action={guardarCalendly} className="space-y-4">
          <input type="hidden" name="empresaId" value={id} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Calendly (opcional)
            </label>
            <input
              type="url"
              name="calendlyUrl"
              defaultValue={empresa.calendlyUrl || ""}
              placeholder="https://calendly.com/tu-usuario/cita-30min"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si configuras tu URL de Calendly, el agente podrá compartir este enlace con tus clientes
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Guardar configuración
          </button>
        </form>
      </div>

      {/* Formulario para nueva cita */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">➕ Agendar nueva cita</h2>
        <form action={crearCita} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="hidden" name="empresaId" value={id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del cliente *
            </label>
            <input
              type="text"
              name="nombreCliente"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (WhatsApp) *
            </label>
            <input
              type="tel"
              name="telefono"
              required
              placeholder="5212345678901"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y hora de inicio *
            </label>
            <input
              type="datetime-local"
              name="inicio"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (minutos) *
            </label>
            <select
              name="duracion"
              defaultValue="60"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              name="notas"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Crear cita
            </button>
          </div>
        </form>
      </div>

      {/* Lista de citas futuras */}
      {citasFuturas.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🔜 Próximas citas ({citasFuturas.length})
          </h2>
          <div className="space-y-3">
            {citasFuturas.map((cita) => (
              <div
                key={cita.id}
                className={`p-4 border-l-4 rounded-lg ${
                  cita.estado === "CONFIRMADA"
                    ? "border-green-500 bg-green-50"
                    : "border-yellow-500 bg-yellow-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cita.nombreCliente}</h3>
                    <p className="text-sm text-gray-600">📞 {cita.telefono}</p>
                    <p className="text-sm text-gray-600">
                      🕒 {formatearFecha(cita.inicio)} - {formatearHora(cita.fin)}
                    </p>
                    {cita.notas && (
                      <p className="text-sm text-gray-500 mt-1 italic">{cita.notas}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorEstado(
                        cita.estado
                      )}`}
                    >
                      {cita.estado}
                    </span>
                    <form action={cambiarEstadoCita} className="inline">
                      <input type="hidden" name="id" value={cita.id} />
                      <input type="hidden" name="empresaId" value={id} />
                      {cita.estado === "PENDIENTE" && (
                        <button
                          type="submit"
                          name="estado"
                          value="CONFIRMADA"
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                        >
                          Confirmar
                        </button>
                      )}
                    </form>
                    <form action={cambiarEstadoCita} className="inline">
                      <input type="hidden" name="id" value={cita.id} />
                      <input type="hidden" name="empresaId" value={id} />
                      <button
                        type="submit"
                        name="estado"
                        value="CANCELADA"
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                      >
                        Cancelar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de citas pasadas */}
      {citasPasadas.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📜 Historial ({citasPasadas.length})
          </h2>
          <div className="space-y-2">
            {citasPasadas.slice(0, 10).map((cita) => (
              <div
                key={cita.id}
                className="p-3 bg-gray-50 rounded border border-gray-200 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{cita.nombreCliente}</h3>
                  <p className="text-sm text-gray-600">
                    {formatearFecha(cita.inicio)} • {cita.telefono}
                  </p>
                  {cita.notas && (
                    <p className="text-xs text-gray-500 mt-1">{cita.notas}</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${obtenerColorEstado(
                    cita.estado
                  )}`}
                >
                  {cita.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citas canceladas */}
      {citasCanceladas.length > 0 && (
        <details className="bg-white p-6 rounded-lg shadow">
          <summary className="text-lg font-semibold cursor-pointer text-gray-700 hover:text-gray-900">
            ❌ Citas canceladas ({citasCanceladas.length})
          </summary>
          <div className="mt-4 space-y-2">
            {citasCanceladas.slice(0, 10).map((cita) => (
              <div
                key={cita.id}
                className="p-3 bg-red-50 rounded border border-red-200"
              >
                <h3 className="font-medium text-gray-800">{cita.nombreCliente}</h3>
                <p className="text-sm text-gray-600">
                  {formatearFecha(cita.inicio)} • {cita.telefono}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {citas.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No hay citas agendadas aún</p>
          <p className="text-sm text-gray-400 mt-2">
            Crea tu primera cita usando el formulario de arriba
          </p>
        </div>
      )}
    </div>
  );
}
