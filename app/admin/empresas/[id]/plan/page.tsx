import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { asignarPlan } from "@/app/actions/admin";
import PlanSelector from "@/app/components/PlanSelector";

export default async function AsignarPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const session = await auth();

  if (!session || session.user.rol !== "PROVEEDOR") {
    redirect("/dashboard");
  }

  const empresa = await prisma.empresa.findUnique({
    where: { id },
    include: {
      plan: true,
      _count: {
        select: {
          numerosWhatsApp: true,
          agentes: true,
        },
      },
    },
  });

  if (!empresa) {
    redirect("/admin?error=Empresa+no+encontrada");
  }

  const planes = await prisma.plan.findMany({
    where: { visible: true },
    orderBy: { orden: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {empresa.plan ? "Cambiar Plan" : "Asignar Plan"}
        </h1>
        <p className="text-gray-600 mt-2">
          Empresa: <span className="font-semibold">{empresa.nombre}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ⚠️ {decodeURIComponent(error)}
        </div>
      )}

      {/* Estado actual */}
      {empresa.plan && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Plan actual</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-blue-700">{empresa.plan.nombre}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              empresa.estadoPlan === "ACTIVO" ? "bg-green-100 text-green-700" :
              empresa.estadoPlan === "TRIAL" ? "bg-blue-100 text-blue-700" :
              empresa.estadoPlan === "SUSPENDIDO" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {empresa.estadoPlan}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            ${empresa.plan.precio} USD/mes
          </p>
          {empresa.fechaVencimiento && (
            <p className="text-xs text-gray-500 mt-2">
              Vence: {new Date(empresa.fechaVencimiento).toLocaleDateString("es-VE")}
            </p>
          )}
        </div>
      )}

      {/* Uso actual */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-3">Recursos en uso</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Números WhatsApp</p>
            <p className="text-2xl font-bold text-gray-900">{empresa._count.numerosWhatsApp}</p>
          </div>
          <div>
            <p className="text-gray-600">Agentes</p>
            <p className="text-2xl font-bold text-gray-900">{empresa._count.agentes}</p>
          </div>
          <div>
            <p className="text-gray-600">Conversaciones este mes</p>
            <p className="text-2xl font-bold text-gray-900">{empresa.conversacionesEsteMes}</p>
          </div>
        </div>
      </div>

      {/* Seleccionar plan */}
      <form action={asignarPlan} className="space-y-6">
        <input type="hidden" name="empresaId" value={id} />

        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Seleccionar plan
          </label>

          <PlanSelector planes={planes} planActualId={empresa.planId} />
        </div>

        {/* Estado del plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado del plan
          </label>
          <select
            name="estadoPlan"
            defaultValue={empresa.estadoPlan}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="TRIAL">TRIAL - Período de prueba</option>
            <option value="ACTIVO">ACTIVO - Plan activo y pagado</option>
            <option value="SUSPENDIDO">SUSPENDIDO - Pago pendiente</option>
            <option value="CANCELADO">CANCELADO - Plan cancelado</option>
          </select>
        </div>

        {/* Fecha de vencimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de vencimiento
          </label>
          <input
            type="date"
            name="fechaVencimiento"
            defaultValue={
              empresa.fechaVencimiento
                ? new Date(empresa.fechaVencimiento).toISOString().split("T")[0]
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Fecha hasta la cual el plan estará activo
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {empresa.plan ? "Actualizar plan" : "Asignar plan"}
          </button>
          <a
            href="/admin"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
