"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearEmpresa(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  if (!nombre?.trim() || !telefono?.trim()) return;
  await prisma.empresa.create({
    data: { nombre: nombre.trim(), telefonoWhatsapp: telefono.trim() },
  });
  revalidatePath("/dashboard/empresas");
}

export async function editarEmpresa(formData: FormData) {
  const id = formData.get("id") as string;
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  if (!id || !nombre?.trim() || !telefono?.trim()) return;
  await prisma.empresa.update({
    where: { id },
    data: { nombre: nombre.trim(), telefonoWhatsapp: telefono.trim() },
  });
  redirect(`/empresa/${id}/configuracion?editado=1`);
}

export async function eliminarEmpresa(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  // Elimina en cascada: mensajes → conversaciones → documentos → empresa
  await prisma.mensaje.deleteMany({
    where: { conversacion: { empresaId: id } },
  });
  await prisma.conversacion.deleteMany({ where: { empresaId: id } });
  await prisma.documento.deleteMany({ where: { empresaId: id } });
  await prisma.empresa.delete({ where: { id } });
  redirect("/dashboard/empresas");
}

export async function actualizarPrompt(formData: FormData) {
  const id = formData.get("id") as string;
  const prompt = formData.get("prompt") as string;
  const origen = formData.get("origen") as string;
  if (!id) return;
  await prisma.empresa.update({
    where: { id },
    data: { promptSistema: prompt?.trim() ?? null },
  });
  if (origen === "empresa") {
    redirect(`/empresa/${id}/configuracion?guardado=1`);
  }
  redirect("/dashboard/empresas?guardado=1");
}
