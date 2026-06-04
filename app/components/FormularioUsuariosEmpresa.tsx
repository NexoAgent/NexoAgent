"use client";

import { useState } from "react";
import PasswordInput from "./PasswordInput";

export default function FormularioUsuariosEmpresa() {
  const [usuariosOpcionales, setUsuariosOpcionales] = useState<number[]>([]);

  const agregarUsuario = () => {
    if (usuariosOpcionales.length < 10) {
      setUsuariosOpcionales([...usuariosOpcionales, usuariosOpcionales.length]);
    }
  };

  const eliminarUsuario = (index: number) => {
    setUsuariosOpcionales(usuariosOpcionales.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Usuario Principal - OBLIGATORIO */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-blue-900">
            Usuario Principal (Obligatorio)
          </h3>
          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            REQUERIDO
          </span>
        </div>
        <p className="text-sm text-blue-700 mb-4">
          Este será el usuario administrador principal de la empresa
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              name="usuarioPrincipalNombre"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="usuarioPrincipalEmail"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: juan@empresa.com"
            />
          </div>

          <div>
            <PasswordInput
              name="usuarioPrincipalPassword"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
            />
          </div>
        </div>
      </div>

      {/* Usuarios Opcionales */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Usuarios Adicionales (Opcional)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Puedes agregar hasta 10 usuarios adicionales. Recibirán contraseñas provisionales.
            </p>
          </div>
          {usuariosOpcionales.length < 10 && (
            <button
              type="button"
              onClick={agregarUsuario}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Usuario
            </button>
          )}
        </div>

        {usuariosOpcionales.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">No hay usuarios adicionales</p>
            <p className="text-xs mt-1">Haz clic en "Agregar Usuario" para crear uno</p>
          </div>
        )}

        <div className="space-y-4">
          {usuariosOpcionales.map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Usuario #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => eliminarUsuario(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name={`usuarioOpcional${index}Nombre`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Ej: María García"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name={`usuarioOpcional${index}Email`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Ej: maria@empresa.com"
                  />
                </div>
              </div>

              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Contraseña provisional:</strong> Se generará automáticamente y se enviará por email.
                  El usuario deberá cambiarla en su primer inicio de sesión.
                </p>
              </div>
            </div>
          ))}
        </div>

        {usuariosOpcionales.length > 0 && usuariosOpcionales.length < 10 && (
          <button
            type="button"
            onClick={agregarUsuario}
            className="mt-4 w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition font-medium text-sm"
          >
            + Agregar otro usuario ({10 - usuariosOpcionales.length} disponibles)
          </button>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sobre las contraseñas provisionales:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Los usuarios adicionales recibirán un email con su contraseña</li>
              <li>Deberán cambiarla obligatoriamente en el primer inicio de sesión</li>
              <li>Las contraseñas son seguras y generadas aleatoriamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
