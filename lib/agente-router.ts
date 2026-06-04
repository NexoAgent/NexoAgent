/**
 * Lógica de ruteo de agentes
 */

import { prisma } from "@/lib/prisma";
import type { Agente } from "../app/generated/prisma/client";

/**
 * Detecta el agente apropiado para una conversación
 * basado en palabras clave y disponibilidad
 */
export async function detectarAgente(
  empresaId: string,
  mensaje: string
): Promise<string | null> {
  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 5); // "HH:MM"
  const diaActual = ahora.getDay(); // 0=Domingo, 1=Lunes, etc.

  // Obtener todos los agentes activos
  const agentes = await prisma.agente.findMany({
    where: {
      empresaId,
      activo: true,
    },
    orderBy: {
      esPrincipal: "desc", // Principal primero como fallback
    },
  });

  if (agentes.length === 0) return null;

  const mensajeLower = mensaje.toLowerCase();

  // 1. Buscar por palabras clave
  for (const agente of agentes) {
    if (!agente.palabrasClave || agente.palabrasClave.length === 0) continue;

    // Verificar si alguna palabra clave está en el mensaje
    const tieneKeyword = agente.palabrasClave.some((keyword) =>
      mensajeLower.includes(keyword.toLowerCase())
    );

    if (tieneKeyword) {
      // Verificar horario de disponibilidad
      if (estaDisponible(agente, horaActual, diaActual)) {
        return agente.id;
      }
    }
  }

  // 2. Fallback: agente principal
  const agentePrincipal = agentes.find((a) => a.esPrincipal);
  if (agentePrincipal) {
    return agentePrincipal.id;
  }

  // 3. Si no hay principal, el primero activo
  return agentes[0]?.id || null;
}

/**
 * Verifica si un agente está disponible en este momento
 */
function estaDisponible(
  agente: Agente,
  horaActual: string,
  diaActual: number
): boolean {
  // Si no tiene horarios configurados, siempre disponible
  if (!agente.horarioInicio || !agente.horarioFin || !agente.diasSemana) {
    return true;
  }

  // Verificar día de la semana
  if (!agente.diasSemana.includes(diaActual)) {
    return false;
  }

  // Verificar hora
  if (horaActual < agente.horarioInicio || horaActual > agente.horarioFin) {
    return false;
  }

  return true;
}

/**
 * Obtiene el agente asignado a una conversación
 * o lo detecta y asigna si no tiene uno
 */
export async function obtenerOAsignarAgente(
  conversacionId: string,
  empresaId: string,
  mensaje: string
): Promise<{ agenteId: string; prompt: string } | null> {
  // Ver si ya tiene agente asignado
  const conversacion = await prisma.conversacion.findUnique({
    where: { id: conversacionId },
    include: { agente: true },
  });

  if (!conversacion) return null;

  // Si ya tiene agente y está activo, usarlo
  if (conversacion.agente && conversacion.agente.activo) {
    return {
      agenteId: conversacion.agente.id,
      prompt: conversacion.agente.prompt,
    };
  }

  // Detectar agente apropiado
  const agenteId = await detectarAgente(empresaId, mensaje);
  if (!agenteId) return null;

  // Asignar agente a la conversación
  await prisma.conversacion.update({
    where: { id: conversacionId },
    data: { agenteId },
  });

  // Obtener el agente
  const agente = await prisma.agente.findUnique({
    where: { id: agenteId },
  });

  if (!agente) return null;

  return {
    agenteId: agente.id,
    prompt: agente.prompt,
  };
}

/**
 * Transfiere una conversación a otro agente
 */
export async function transferirAgente(
  conversacionId: string,
  agenteDestinoId: string,
  motivo?: string
): Promise<boolean> {
  try {
    // Obtener conversación actual
    const conversacion = await prisma.conversacion.findUnique({
      where: { id: conversacionId },
      select: { agenteId: true },
    });

    if (!conversacion) return false;

    // Crear registro de transferencia
    await prisma.transferenciaAgente.create({
      data: {
        conversacionId,
        agenteOrigenId: conversacion.agenteId,
        agenteDestinoId,
        motivo: motivo || "Transferencia manual",
        aprobada: true,
      },
    });

    // Actualizar conversación
    await prisma.conversacion.update({
      where: { id: conversacionId },
      data: { agenteId: agenteDestinoId },
    });

    return true;
  } catch (error) {
    console.error("[transferirAgente] Error:", error);
    return false;
  }
}
