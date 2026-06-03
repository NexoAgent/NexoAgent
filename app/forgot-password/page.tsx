import { requestPasswordReset } from "@/app/actions/password-reset";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="NexoAgent"
              width={576}
              height={180}
              priority
              className="w-auto h-36"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="text-gray-600 text-sm">
            Ingresa tu email y te enviaremos un link para recuperarla
          </p>
        </div>

        {searchParams.success ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm text-center">
              Si el email existe, recibirás un link de recuperación en tu correo.
            </p>
            <Link
              href="/login"
              className="block mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Volver al login
            </Link>
          </div>
        ) : (
          <>
            {searchParams.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{searchParams.error}</p>
              </div>
            )}

            <form action={requestPasswordReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
              >
                Enviar link de recuperación
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver al login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
