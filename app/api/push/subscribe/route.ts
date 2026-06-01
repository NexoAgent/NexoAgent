import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { subscription, empresaId } = body;

    if (!subscription || !empresaId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el usuario tenga acceso a esta empresa
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario || (usuario.empresaId !== empresaId && usuario.rol !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Guardar o actualizar la suscripción
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: {
        empresaId_endpoint: {
          empresaId,
          endpoint: subscription.endpoint,
        },
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: request.headers.get("user-agent") || undefined,
        actualizadoEn: new Date(),
      },
      create: {
        empresaId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: pushSubscription,
    });
  } catch (error) {
    console.error("Error al guardar suscripción push:", error);
    return NextResponse.json(
      { error: "Error al guardar suscripción" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get("empresaId");
    const endpoint = searchParams.get("endpoint");

    if (!empresaId || !endpoint) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el usuario tenga acceso a esta empresa
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario || (usuario.empresaId !== empresaId && usuario.rol !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Eliminar la suscripción
    await prisma.pushSubscription.deleteMany({
      where: {
        empresaId,
        endpoint,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar suscripción push:", error);
    return NextResponse.json(
      { error: "Error al eliminar suscripción" },
      { status: 500 }
    );
  }
}
