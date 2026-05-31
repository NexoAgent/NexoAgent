"use server";

import { prisma } from "@/lib/prisma";
import { EstadoCita } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

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

  await prisma.cita.create({
    data: {
      empresaId,
      contactoId: contacto?.id ?? null,
      nombreCliente: nombreCliente.trim(),
      telefono: telefono.trim(),
      inicio: inicioDate,
      fin: finDate,
      notas: notas?.trim() || null,
    },
  });

  revalidatePath(`/empresa/${empresaId}/agenda`);
}

export async function cambiarEstadoCita(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;
  const estado = formData.get("estado") as EstadoCita;

  await prisma.cita.update({ where: { id }, data: { estado } });
  revalidatePath(`/empresa/${empresaId}/agenda`);
}

export async function eliminarCita(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;

  await prisma.cita.delete({ where: { id } });
  revalidatePath(`/empresa/${empresaId}/agenda`);
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
