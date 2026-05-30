import { prisma } from "@/lib/prisma";
import { crearEmpresa } from "@/app/actions/empresas";
import Link from "next/link";

export default async function EmpresasPage() {
  const empresas = await prisma.empresa.findMany({
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { conversaciones: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona las empresas registradas en el sistema</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Formulario nueva empresa */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Nueva empresa</h2>
          <p className="text-xs text-gray-400 mb-5">Registra una empresa para activar su asistente de WhatsApp</p>
          <form action={crearEmpresa} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre de la empresa</label>
              <input
                name="nombre"
                type="text"
                required
                placeholder="Ej: Ferretería López"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Número de WhatsApp</label>
              <input
                name="telefono"
                type="text"
                required
                placeholder="Ej: +14155238886"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Crear empresa
            </button>
          </form>
        </div>

        {/* Lista de empresas */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Registradas ({empresas.length})</h2>
          </div>
          {empresas.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-400">Aún no hay empresas.</p>
              <p className="text-xs text-gray-400 mt-1">Crea la primera usando el formulario.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {empresas.map((e) => (
                <div key={e.id} className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xs font-semibold">{e.nombre[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{e.nombre}</p>
                    <p className="text-xs text-gray-400">{e.telefonoWhatsapp}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{e._count.conversaciones} conv.</span>
                    <Link
                      href={`/empresa/${e.id}`}
                      className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver panel →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
