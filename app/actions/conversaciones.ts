"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notificarModoHumano } from "@/lib/push-notifications";

export async function reactivarIA(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.conversacion.update({
    where: { id },
    data: { modoHumano: false },
  });
  revalidatePath("/dashboard/conversaciones");
  revalidatePath(`/dashboard/conversaciones/${id}`);
}

export async function activarModoHumano(
  conversacionId: string,
  empresaId: string,
  numeroCliente: string
) {
  await prisma.conversacion.update({
    where: { id: conversacionId },
    data: { modoHumano: true },
  });

  // Enviar notificación push
  try {
    await notificarModoHumano(empresaId, conversacionId, numeroCliente);
  } catch (error) {
    console.error("Error al enviar notificación de modo humano:", error);
  }

  revalidatePath(`/empresa/${empresaId}/conversaciones`);
  revalidatePath(`/empresa/${empresaId}/conversaciones/${conversacionId}`);
}
