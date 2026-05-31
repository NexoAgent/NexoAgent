"use server";

import { prisma } from "@/lib/prisma";
import { EstadoCita } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setCredentials, createEvent, updateEvent, deleteEvent } from "@/lib/google-calendar";

export async function crearCita(formData: FormData) {
  const empresaId = formData.get("empresaId") as string;
  const nombreCliente = formData.get("nombreCliente") as string;
  const telefono = formData.get("telefono") as string;
  const inicio = formData.get("inicio") as string;
  const duracion = parseInt(formData.get("duracion") as string) || 60;
  const notas = formData.get("notas") as string;

  if (!nombreCliente?.trim() || !telefono?.trim() || !inicio) return;

  const inicioDate = new Date(inicio);
  const finDate = new Date(inicioDate.getTime() + duracion * 60 * 1000);

  // Busca si el contacto existe
  const contacto = await prisma.contacto.findUnique({
    where: { empresaId_telefono: { empresaId, telefono: telefono.trim() } },
  });

  const empresa = await prisma.empresa.findUnique({
    where: { id: empresaId },
    select: { googleAccessToken: true, googleRefreshToken: true, googleCalendarId: true },
  });

  let googleEventId: string | null = null;
  let googleCalendarLink: string | null = null;

  // Crear evento en Google Calendar si está conectado
  if (empresa?.googleAccessToken && empresa.googleCalendarId) {
    try {
      const auth = setCredentials(empresa.googleAccessToken, empresa.googleRefreshToken || undefined);
      const event = await createEvent(auth, empresa.googleCalendarId, {
        summary: `Cita con ${nombreCliente.trim()}`,
        description: `Tel: ${telefono.trim()}\n${notas?.trim() || ""}`,
        start: inicioDate,
        end: finDate,
      });
      googleEventId = event.id;
      googleCalendarLink = event.link;
    } catch (error) {
      console.error("Error creando evento en Google Calendar:", error);
    }
  }

  await prisma.cita.create({
    data: {
      empresaId,
      contactoId: contacto?.id ?? null,
      nombreCliente: nombreCliente.trim(),
      telefono: telefono.trim(),
      inicio: inicioDate,
      fin: finDate,
      notas: notas?.trim() || null,
      googleEventId,
      googleCalendarLink,
    },
  });

  revalidatePath(`/empresa/${empresaId}/agenda`);
}

export async function cambiarEstadoCita(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;
  const estado = formData.get("estado") as EstadoCita;

  const cita = await prisma.cita.findUnique({
    where: { id },
    include: { empresa: { select: { googleAccessToken: true, googleRefreshToken: true, googleCalendarId: true } } },
  });

  // Actualizar en Google Calendar si existe el evento
  if (cita?.googleEventId && cita.empresa.googleAccessToken && cita.empresa.googleCalendarId) {
    try {
      const auth = setCredentials(cita.empresa.googleAccessToken, cita.empresa.googleRefreshToken || undefined);
      await updateEvent(auth, cita.empresa.googleCalendarId, cita.googleEventId, {
        status: estado === "CANCELADA" ? "cancelled" : "confirmed",
      });
    } catch (error) {
      console.error("Error actualizando evento en Google Calendar:", error);
    }
  }

  await prisma.cita.update({ where: { id }, data: { estado } });
  revalidatePath(`/empresa/${empresaId}/agenda`);
}

export async function eliminarCita(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;

  const cita = await prisma.cita.findUnique({
    where: { id },
    include: { empresa: { select: { googleAccessToken: true, googleRefreshToken: true, googleCalendarId: true } } },
  });

  // Eliminar de Google Calendar si existe
  if (cita?.googleEventId && cita.empresa.googleAccessToken && cita.empresa.googleCalendarId) {
    try {
      const auth = setCredentials(cita.empresa.googleAccessToken, cita.empresa.googleRefreshToken || undefined);
      await deleteEvent(auth, cita.empresa.googleCalendarId, cita.googleEventId);
    } catch (error) {
      console.error("Error eliminando evento en Google Calendar:", error);
    }
  }

  await prisma.cita.delete({ where: { id } });
  revalidatePath(`/empresa/${empresaId}/agenda`);
}

export async function desconectarGoogleCalendar(formData: FormData) {
  const empresaId = formData.get("empresaId") as string;

  await prisma.empresa.update({
    where: { id: empresaId },
    data: {
      googleAccessToken: null,
      googleRefreshToken: null,
      googleCalendarId: null,
      googleTokenExpiry: null,
    },
  });

  revalidatePath(`/empresa/${empresaId}/agenda`);
  redirect(`/empresa/${empresaId}/agenda?google_disconnected=1`);
}

export async function guardarCalendly(formData: FormData) {
  const empresaId = formData.get("empresaId") as string;
  const calendlyUrl = formData.get("calendlyUrl") as string;

  await prisma.empresa.update({
    where: { id: empresaId },
    data: { calendlyUrl: calendlyUrl?.trim() || null },
  });

  revalidatePath(`/empresa/${empresaId}/agenda`);
}
