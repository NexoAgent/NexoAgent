"use server";

import { prisma } from "@/lib/prisma";
import { TipoContacto } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function actualizarContacto(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;
  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as TipoContacto;
  const notas = formData.get("notas") as string;

  await prisma.contacto.update({
    where: { id },
    data: {
      nombre: nombre?.trim() || null,
      tipo,
      notas: notas?.trim() || null,
    },
  });

  redirect(`/empresa/${empresaId}/crm/${id}?guardado=1`);
}

export async function crearContacto(formData: FormData) {
  const empresaId = formData.get("empresaId") as string;
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const tipo = formData.get("tipo") as TipoContacto;

  if (!telefono?.trim()) return;

  await prisma.contacto.create({
    data: {
      empresaId,
      telefono: telefono.trim(),
      nombre: nombre?.trim() || null,
      tipo: tipo || "LEAD",
    },
  });

  revalidatePath(`/empresa/${empresaId}/crm`);
}

export async function eliminarContacto(formData: FormData) {
  const id = formData.get("id") as string;
  const empresaId = formData.get("empresaId") as string;
  await prisma.contacto.delete({ where: { id } });
  redirect(`/empresa/${empresaId}/crm`);
}
