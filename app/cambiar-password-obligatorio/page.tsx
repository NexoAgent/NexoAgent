import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cambiarPasswordObligatorio } from "@/app/actions/usuarios-empresa";
import PasswordInput from "@/app/components/PasswordInput";

export default async function CambiarPasswordObligatorioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const session = await auth();
  const { error, success } = await searchParams;

  if (!session?.user) {
    redirect("/login");
  }

  // Si el usuario no requiere cambio de contraseña, redirigir al dashboard
  if (!session.user.requiereCambioPassword) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cambio de Contraseña Requerido
          </h1>
          <p className="text-sm text-gray-600">
            Por seguridad, debes cambiar tu contraseña provisional antes de continuar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">⚠️ {decodeURIComponent(error)}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">✅ {decodeURIComponent(success)}</p>
          </div>
        )}

        <form action={cambiarPasswordObligatorio} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Usuario:</strong> {session.user.name}
              <br />
              <strong>Email:</strong> {session.user.email}
            </p>
          </div>

          <PasswordInput
            name="passwordActual"
            label="Contraseña Actual (Provisional)"
            placeholder="Ingresa tu contraseña provisional"
            required
            autoComplete="current-password"
          />

          <PasswordInput
            name="passwordNueva"
            label="Nueva Contraseña"
            placeholder="Mínimo 8 caracteres"
            required
            autoComplete="new-password"
          />

          <PasswordInput
            name="passwordConfirmar"
            label="Confirmar Nueva Contraseña"
            placeholder="Repite tu nueva contraseña"
            required
            autoComplete="new-password"
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-800">
              <strong>Requisitos de la contraseña:</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-2 space-y-1">
              <li>• Mínimo 8 caracteres</li>
              <li>• Debe ser diferente a la contraseña provisional</li>
              <li>• Se recomienda usar mayúsculas, minúsculas y números</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
          >
            Cambiar Contraseña y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
