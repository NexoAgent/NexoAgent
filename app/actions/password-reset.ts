"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";

/**
 * Solicitar recuperación de contraseña
 * Genera un token y lo guarda en la DB (en producción enviaría email)
 */
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    redirect("/forgot-password?error=Email+requerido");
  }

  // Verificar que el usuario existe
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  // Por seguridad, no revelamos si el email existe o no
  // Pero solo creamos el token si existe
  if (usuario) {
    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // TODO: En producción, enviar email con el link
    // Por ahora, en desarrollo, el link sería:
    // http://localhost:3000/reset-password?token=${token}
    console.log(`[DEV] Password reset link: /reset-password?token=${token}`);
  }

  // Siempre redirigir con mensaje de éxito (no revelar si el email existe)
  redirect("/forgot-password?success=true");
}

/**
 * Resetear contraseña usando el token
 */
export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !password || !confirmPassword) {
    redirect("/reset-password?error=Datos+incompletos");
  }

  if (password !== confirmPassword) {
    redirect(`/reset-password?token=${token}&error=Las+contraseñas+no+coinciden`);
  }

  if (password.length < 6) {
    redirect(`/reset-password?token=${token}&error=La+contraseña+debe+tener+al+menos+6+caracteres`);
  }

  // Buscar el token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    redirect("/reset-password?error=Token+inválido");
  }

  // Verificar que no haya expirado
  if (resetToken.expires < new Date()) {
    redirect("/reset-password?error=El+token+ha+expirado");
  }

  // Verificar que no haya sido usado
  if (resetToken.usado) {
    redirect("/reset-password?error=El+token+ya+fue+usado");
  }

  // Actualizar la contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.usuario.update({
    where: { email: resetToken.email },
    data: { password: passwordHash },
  });

  // Marcar el token como usado
  await prisma.passwordResetToken.update({
    where: { token },
    data: { usado: true },
  });

  // Redirigir al login con mensaje de éxito
  redirect("/login?success=Contraseña+actualizada+correctamente");
}
