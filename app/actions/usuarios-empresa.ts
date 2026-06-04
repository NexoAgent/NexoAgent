"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import crypto from "crypto";

/**
 * Generar contraseña provisional segura
 */
function generarPasswordProvisional(): string {
  // Genera una contraseña de 12 caracteres con mayúsculas, minúsculas, números y símbolos
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let password = "";

  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  return password;
}

/**
 * Crear empresa con múltiples usuarios
 */
export async function crearEmpresaConUsuarios(formData: FormData) {
  console.log("[crearEmpresaConUsuarios] Iniciando...");

  try {
    console.log("[crearEmpresaConUsuarios] Verificando sesión...");
    const session = await auth();
    console.log("[crearEmpresaConUsuarios] Sesión:", session?.user?.email, session?.user?.rol);

    if (!session || session.user.rol !== "PROVEEDOR") {
      redirect("/admin/empresas/nueva?error=No+autorizado");
    }

    // Datos de la empresa
    const nombre = formData.get("nombre") as string;
    const rif = (formData.get("rif") as string) || null;
    const nif = (formData.get("nif") as string) || null;
    const responsable = (formData.get("responsable") as string) || null;
    const direccion = (formData.get("direccion") as string) || null;
    const telefono = (formData.get("telefono") as string) || null;
    const telefonoWhatsapp = formData.get("telefonoWhatsapp") as string;
    const email = (formData.get("email") as string) || null;
    const planId = (formData.get("planId") as string) || null;

    // Usuario principal (OBLIGATORIO)
    const usuarioPrincipalNombre = formData.get("usuarioPrincipalNombre") as string;
    const usuarioPrincipalEmail = formData.get("usuarioPrincipalEmail") as string;
    const usuarioPrincipalPassword = formData.get("usuarioPrincipalPassword") as string;

    // Función para crear URL con datos del formulario
    const createErrorUrl = (errorMsg: string) => {
      const params = new URLSearchParams({
        error: errorMsg,
        nombre: nombre || "",
        rif: rif || "",
        nif: nif || "",
        responsable: responsable || "",
        direccion: direccion || "",
        telefono: telefono || "",
        telefonoWhatsapp: telefonoWhatsapp || "",
        email: email || "",
        planId: planId || "",
      });
      return `/admin/empresas/nueva?${params.toString()}`;
    };

    // Validaciones básicas
    if (!nombre || !telefonoWhatsapp) {
      redirect(createErrorUrl("Faltan campos requeridos de la empresa"));
    }

    if (!planId) {
      redirect(createErrorUrl("Debe seleccionar un plan"));
    }

    // Validar usuario principal
    if (!usuarioPrincipalNombre || !usuarioPrincipalEmail || !usuarioPrincipalPassword) {
      redirect(createErrorUrl("El usuario principal es obligatorio"));
    }

    if (usuarioPrincipalPassword.length < 8) {
      redirect(createErrorUrl("La contraseña del usuario principal debe tener mínimo 8 caracteres"));
    }

    // Validar que el teléfono no exista
    const existente = await prisma.empresa.findUnique({
      where: { telefonoWhatsapp },
    });

    if (existente) {
      redirect(createErrorUrl("Ya existe una empresa con ese WhatsApp"));
    }

    // Validar que el RIF no exista (si se proporcionó)
    if (rif) {
      const empresaConRif = await prisma.empresa.findUnique({
        where: { rif },
      });

      if (empresaConRif) {
        redirect(createErrorUrl("Ya existe una empresa con ese RIF"));
      }
    }

    // Validar que el NIF no exista (si se proporcionó)
    if (nif) {
      const empresaConNif = await prisma.empresa.findUnique({
        where: { nif },
      });

      if (empresaConNif) {
        redirect(createErrorUrl("Ya existe una empresa con ese NIF"));
      }
    }

    // Validar email del usuario principal
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: usuarioPrincipalEmail },
    });

    if (usuarioExistente) {
      redirect(createErrorUrl("Ya existe un usuario con ese email"));
    }

    // Recopilar usuarios opcionales
    const usuariosOpcionales: Array<{ nombre: string; email: string }> = [];
    for (let i = 0; i < 10; i++) {
      const nombre = formData.get(`usuarioOpcional${i}Nombre`) as string;
      const email = formData.get(`usuarioOpcional${i}Email`) as string;

      if (nombre && email) {
        // Validar que el email no exista
        const usuarioExiste = await prisma.usuario.findUnique({
          where: { email },
        });

        if (usuarioExiste) {
          redirect(createErrorUrl(`El email ${email} ya está registrado`));
        }

        usuariosOpcionales.push({ nombre, email });
      }
    }

    console.log("[crearEmpresaConUsuarios] Creando empresa con", 1 + usuariosOpcionales.length, "usuarios");

    // Calcular fecha de vencimiento (14 días para trial)
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 14);

    // Crear empresa y usuarios en una transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Crear empresa
      const empresa = await tx.empresa.create({
        data: {
          nombre,
          rif,
          nif,
          responsable,
          direccion,
          telefono,
          telefonoWhatsapp,
          email,
          planId,
          estadoPlan: "TRIAL",
          fechaVencimiento,
        },
      });

      // 2. Crear usuario principal
      const passwordPrincipalHash = await bcrypt.hash(usuarioPrincipalPassword, 10);
      const usuarioPrincipal = await tx.usuario.create({
        data: {
          email: usuarioPrincipalEmail,
          password: passwordPrincipalHash,
          nombre: usuarioPrincipalNombre,
          rol: "CLIENTE",
          empresaId: empresa.id,
          esUsuarioPrincipal: true,
          requiereCambioPassword: false,
        },
      });

      // 3. Crear usuarios opcionales con contraseñas provisionales
      const usuariosCreados = [];
      for (const usuario of usuariosOpcionales) {
        const passwordProvisional = generarPasswordProvisional();
        const passwordHash = await bcrypt.hash(passwordProvisional, 10);

        const usuarioCreado = await tx.usuario.create({
          data: {
            email: usuario.email,
            password: passwordHash,
            nombre: usuario.nombre,
            rol: "CLIENTE",
            empresaId: empresa.id,
            esUsuarioPrincipal: false,
            requiereCambioPassword: true,
          },
        });

        usuariosCreados.push({
          ...usuarioCreado,
          passwordProvisional, // Para enviar por email
        });
      }

      return { empresa, usuarioPrincipal, usuariosCreados };
    });

    console.log("[crearEmpresaConUsuarios] Empresa creada exitosamente:", resultado.empresa.id);

    // TODO: Enviar emails con contraseñas provisionales
    // for (const usuario of resultado.usuariosCreados) {
    //   await enviarEmailPasswordProvisional({
    //     email: usuario.email,
    //     nombre: usuario.nombre,
    //     password: usuario.passwordProvisional,
    //     empresaNombre: resultado.empresa.nombre,
    //   });
    // }

    redirect(`/admin?success=${encodeURIComponent(`Empresa creada con ${1 + resultado.usuariosCreados.length} usuario(s)`)}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("[crearEmpresaConUsuarios] Error completo:", error);
    console.error("[crearEmpresaConUsuarios] Stack:", error instanceof Error ? error.stack : "No stack");
    const mensaje = error instanceof Error ? error.message : "Error+desconocido";
    redirect(`/admin/empresas/nueva?error=${encodeURIComponent(mensaje)}`);
  }
}

/**
 * Cambiar contraseña obligatorio (primer login con password provisional)
 */
export async function cambiarPasswordObligatorio(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }

    const passwordActual = formData.get("passwordActual") as string;
    const passwordNueva = formData.get("passwordNueva") as string;
    const passwordConfirmar = formData.get("passwordConfirmar") as string;

    // Validaciones
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      redirect("/cambiar-password-obligatorio?error=Todos+los+campos+son+requeridos");
    }

    if (passwordNueva.length < 8) {
      redirect("/cambiar-password-obligatorio?error=La+contraseña+debe+tener+mínimo+8+caracteres");
    }

    if (passwordNueva !== passwordConfirmar) {
      redirect("/cambiar-password-obligatorio?error=Las+contraseñas+no+coinciden");
    }

    // Obtener usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true, requiereCambioPassword: true },
    });

    if (!usuario || !usuario.password) {
      redirect("/cambiar-password-obligatorio?error=Usuario+no+encontrado");
    }

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(passwordActual, usuario.password);
    if (!passwordValida) {
      redirect("/cambiar-password-obligatorio?error=La+contraseña+actual+es+incorrecta");
    }

    // Verificar que la nueva contraseña sea diferente
    const mismaPassword = await bcrypt.compare(passwordNueva, usuario.password);
    if (mismaPassword) {
      redirect("/cambiar-password-obligatorio?error=La+nueva+contraseña+debe+ser+diferente");
    }

    // Actualizar contraseña
    const passwordHash = await bcrypt.hash(passwordNueva, 10);
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: passwordHash,
        requiereCambioPassword: false,
      },
    });

    console.log("[cambiarPasswordObligatorio] Contraseña cambiada exitosamente para usuario:", session.user.id);

    // Redirigir al dashboard
    redirect("/dashboard?success=Contraseña+actualizada+exitosamente");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("[cambiarPasswordObligatorio] Error:", error);
    redirect("/cambiar-password-obligatorio?error=Error+al+cambiar+la+contraseña");
  }
}
