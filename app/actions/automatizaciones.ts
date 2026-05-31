"use server";

import { prisma } from "@/lib/prisma";
import { TipoTrigger } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearAutomatizacion(formData: FormData) {
  const empresaId = formData.get("empresaId") as string;
  const nombre = formData.get("nombre") as string;
  const trigger = formData.get("trigger") as TipoTrigger;
  const condicion = formData.get("condicion") as string;
  const mensaje = formData.get("mensaje") as string;

  if (!nombre?.trim() || !mensaje?.trim()) return;

  await prisma.automatizacion.create({
    data: {
      empresaId,
      nombre: nombre.trim(),
      trigger,
      condicion: condicion?.trim() || null,
      mensaje: mensaje.trim(),
    },
  });

  redirect(`/empresa/${empresaId}/automatizaciones`);
}

export async function toggleAutomatizacion(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;
  const activa = formData.get("activa") === "true";

  await prisma.automatizacion.update({
    where: { id },
    data: { activa: !activa },
  });

  revalidatePath(`/empresa/${empresaId}/automatizaciones`);
}

export async function eliminarAutomatizacion(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;

  await prisma.automatizacion.delete({ where: { id } });
  revalidatePath(`/empresa/${empresaId}/automatizaciones`);
}
