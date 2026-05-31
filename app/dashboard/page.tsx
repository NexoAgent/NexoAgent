import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // CLIENTE: redirigir a su empresa
  if (session.user.rol === "CLIENTE") {
    if (session.user.empresaId) {
      redirect(`/empresa/${session.user.empresaId}`);
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sin empresa asignada
            </h1>
            <p className="text-gray-600">
              Contacta al administrador para que te asigne una empresa
            </p>
          </div>
        </div>
      );
    }
  }

  // PROVEEDOR: mostrar panel general
  const [empresas, conversaciones, mensajes, pendientes] = await Promise.all([
    prisma.empresa.count(),
    prisma.conversacion.count(),
    prisma.mensaje.count(),
    prisma.conversacion.count({ where: { modoHumano: true } }),
  ]);

  const ultimasEmpresas = await prisma.empresa.findMany({
    take: 5,
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { conversaciones: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel general</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de todas las empresas activas</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Empresas", valor: empresas, color: "blue", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
          { label: "Conversaciones", valor: conversaciones, color: "indigo", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
          { label: "Mensajes", valor: mensajes, color: "violet", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
          { label: "Esperan humano", valor: pendientes, color: "amber", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-lg bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.valor}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Empresas registradas</h2>
          <Link href="/dashboard/empresas" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Ver todas →
          </Link>
        </div>
        {ultimasEmpresas.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            No hay empresas todavía. <Link href="/dashboard/empresas" className="text-blue-600">Crea la primera</Link>.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {ultimasEmpresas.map((e) => (
              <div key={e.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-semibold">{e.nombre[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.nombre}</p>
                    <p className="text-xs text-gray-400">{e.telefonoWhatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{e._count.conversaciones} conversaciones</span>
                  <Link href={`/empresa/${e.id}`} className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    Ver panel
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
