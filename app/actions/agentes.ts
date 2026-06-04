"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { checkPlanLimit } from "@/lib/plan-limits";

export async function crearAgente(formData: FormData) {
  try {
    const session = await auth();
    if (!session) redirect("/login");

    const empresaId = formData.get("empresaId") as string;
    const nombre = (formData.get("nombre") as string).trim();
    const descripcion = (formData.get("descripcion") as string)?.trim() || null;
    const prompt = (formData.get("prompt") as string).trim();
    const color = (formData.get("color") as string) || "#3B82F6";
    const palabrasClaveStr = (formData.get("palabrasClave") as string)?.trim() || "";
    const horarioInicio = (formData.get("horarioInicio") as string) || null;
    const horarioFin = (formData.get("horarioFin") as string) || null;

    // Validar permisos
    if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
      redirect(`/empresa/${session.user.empresaId}/agentes?error=No+autorizado`);
    }

    // Verificar límite del plan
    const limitCheck = await checkPlanLimit(empresaId, "agentes");
    if (!limitCheck.allowed) {
      redirect(`/empresa/${empresaId}/agentes?error=${encodeURIComponent(limitCheck.message)}`);
    }

    if (!nombre || !prompt) {
      redirect(`/empresa/${empresaId}/agentes/nuevo?error=Nombre+y+prompt+son+requeridos`);
    }

    // Procesar palabras clave
    const palabrasClave = palabrasClaveStr
      ? palabrasClaveStr.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean)
      : [];

    // Procesar días de la semana
    const diasSemanaValues = formData.getAll("diasSemana");
    const diasSemana = diasSemanaValues.map((v) => parseInt(v as string));

    // Verificar si es el primer agente
    const count = await prisma.agente.count({
      where: { empresaId },
    });

    const esPrincipal = count === 0;

    await prisma.agente.create({
      data: {
        empresaId,
        nombre,
        descripcion,
        prompt,
        color,
        palabrasClave,
        horarioInicio,
        horarioFin,
        diasSemana: diasSemana.length > 0 ? diasSemana : [0, 1, 2, 3, 4, 5, 6],
        esPrincipal,
        activo: true,
      },
    });

    redirect(`/empresa/${empresaId}/agentes?success=Agente+creado+correctamente`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[crearAgente] Error:", error);
    const empresaId = formData.get("empresaId") as string;
    redirect(`/empresa/${empresaId}/agentes/nuevo?error=Error+al+crear+el+agente`);
  }
}

export async function actualizarAgente(formData: FormData) {
  try {
    const session = await auth();
    if (!session) redirect("/login");

    const empresaId = formData.get("empresaId") as string;
    const agenteId = formData.get("agenteId") as string;
    const nombre = (formData.get("nombre") as string).trim();
    const descripcion = (formData.get("descripcion") as string)?.trim() || null;
    const prompt = (formData.get("prompt") as string).trim();
    const color = (formData.get("color") as string) || "#3B82F6";
    const palabrasClaveStr = (formData.get("palabrasClave") as string)?.trim() || "";
    const horarioInicio = (formData.get("horarioInicio") as string) || null;
    const horarioFin = (formData.get("horarioFin") as string) || null;

    // Validar permisos
    if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
      redirect(`/empresa/${session.user.empresaId}/agentes?error=No+autorizado`);
    }

    const agente = await prisma.agente.findUnique({
      where: { id: agenteId },
    });

    if (!agente || agente.empresaId !== empresaId) {
      redirect(`/empresa/${empresaId}/agentes?error=Agente+no+encontrado`);
    }

    if (!nombre || !prompt) {
      redirect(`/empresa/${empresaId}/agentes/${agenteId}?error=Nombre+y+prompt+son+requeridos`);
    }

    // Procesar palabras clave
    const palabrasClave = palabrasClaveStr
      ? palabrasClaveStr.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean)
      : [];

    // Procesar días de la semana
    const diasSemanaValues = formData.getAll("diasSemana");
    const diasSemana = diasSemanaValues.map((v) => parseInt(v as string));

    await prisma.agente.update({
      where: { id: agenteId },
      data: {
        nombre,
        descripcion,
        prompt,
        color,
        palabrasClave,
        horarioInicio,
        horarioFin,
        diasSemana: diasSemana.length > 0 ? diasSemana : [0, 1, 2, 3, 4, 5, 6],
      },
    });

    redirect(`/empresa/${empresaId}/agentes?success=Agente+actualizado+correctamente`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[actualizarAgente] Error:", error);
    const empresaId = formData.get("empresaId") as string;
    const agenteId = formData.get("agenteId") as string;
    redirect(`/empresa/${empresaId}/agentes/${agenteId}?error=Error+al+actualizar+el+agente`);
  }
}

export async function toggleActivoAgente(formData: FormData) {
  try {
    const session = await auth();
    if (!session) redirect("/login");

    const empresaId = formData.get("empresaId") as string;
    const agenteId = formData.get("agenteId") as string;

    // Validar permisos
    if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
      redirect(`/empresa/${session.user.empresaId}/agentes?error=No+autorizado`);
    }

    const agente = await prisma.agente.findUnique({
      where: { id: agenteId },
    });

    if (!agente || agente.empresaId !== empresaId) {
      redirect(`/empresa/${empresaId}/agentes?error=Agente+no+encontrado`);
    }

    await prisma.agente.update({
      where: { id: agenteId },
      data: { activo: !agente.activo },
    });

    const mensaje = agente.activo ? "desactivado" : "activado";
    redirect(`/empresa/${empresaId}/agentes?success=Agente+${mensaje}+correctamente`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[toggleActivoAgente] Error:", error);
    const empresaId = formData.get("empresaId") as string;
    redirect(`/empresa/${empresaId}/agentes?error=Error+al+actualizar+el+agente`);
  }
}

export async function marcarAgentePrincipal(formData: FormData) {
  try {
    const session = await auth();
    if (!session) redirect("/login");

    const empresaId = formData.get("empresaId") as string;
    const agenteId = formData.get("agenteId") as string;

    // Validar permisos
    if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
      redirect(`/empresa/${session.user.empresaId}/agentes?error=No+autorizado`);
    }

    const agente = await prisma.agente.findUnique({
      where: { id: agenteId },
    });

    if (!agente || agente.empresaId !== empresaId) {
      redirect(`/empresa/${empresaId}/agentes?error=Agente+no+encontrado`);
    }

    // Quitar esPrincipal de todos
    await prisma.agente.updateMany({
      where: { empresaId },
      data: { esPrincipal: false },
    });

    // Marcar el nuevo como principal
    await prisma.agente.update({
      where: { id: agenteId },
      data: { esPrincipal: true },
    });

    redirect(`/empresa/${empresaId}/agentes?success=Agente+marcado+como+principal`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[marcarAgentePrincipal] Error:", error);
    const empresaId = formData.get("empresaId") as string;
    redirect(`/empresa/${empresaId}/agentes?error=Error+al+actualizar+el+agente`);
  }
}

export async function eliminarAgente(formData: FormData) {
  try {
    const session = await auth();
    if (!session) redirect("/login");

    const empresaId = formData.get("empresaId") as string;
    const agenteId = formData.get("agenteId") as string;

    // Validar permisos
    if (session.user.rol === "CLIENTE" && session.user.empresaId !== empresaId) {
      redirect(`/empresa/${session.user.empresaId}/agentes?error=No+autorizado`);
    }

    const agente = await prisma.agente.findUnique({
      where: { id: agenteId },
    });

    if (!agente || agente.empresaId !== empresaId) {
      redirect(`/empresa/${empresaId}/agentes?error=Agente+no+encontrado`);
    }

    if (agente.esPrincipal) {
      redirect(`/empresa/${empresaId}/agentes?error=No+puedes+eliminar+el+agente+principal`);
    }

    // Verificar si tiene conversaciones activas
    const conversacionesActivas = await prisma.conversacion.count({
      where: {
        agenteId: agenteId,
        estado: "ACTIVA",
      },
    });

    if (conversacionesActivas > 0) {
      redirect(`/empresa/${empresaId}/agentes?error=El+agente+tiene+conversaciones+activas.+Reasígnalas+primero.`);
    }

    await prisma.agente.delete({
      where: { id: agenteId },
    });

    redirect(`/empresa/${empresaId}/agentes?success=Agente+eliminado+correctamente`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[eliminarAgente] Error:", error);
    const empresaId = formData.get("empresaId") as string;
    redirect(`/empresa/${empresaId}/agentes?error=Error+al+eliminar+el+agente`);
  }
}
