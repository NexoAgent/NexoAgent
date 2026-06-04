import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push-notifications";

/**
 * Endpoint de prueba para notificaciones push
 * GET /api/push/test?empresaId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get("empresaId");

    if (!empresaId) {
      return NextResponse.json(
        { error: "Falta empresaId" },
        { status: 400 }
      );
    }

    // Verificar permisos
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario || (usuario.empresaId !== empresaId && usuario.rol !== "PROVEEDOR")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener información de suscripciones
    const suscripciones = await prisma.pushSubscription.findMany({
      where: { empresaId },
      select: {
        id: true,
        endpoint: true,
        creadoEn: true,
        actualizadoEn: true,
        userAgent: true,
      },
    });

    console.log(`🧪 [TEST] Probando notificaciones para empresa ${empresaId}`);
    console.log(`🧪 [TEST] Suscripciones encontradas: ${suscripciones.length}`);

    if (suscripciones.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No hay suscripciones activas para esta empresa",
        subscriptions: 0,
      });
    }

    // Enviar notificación de prueba
    const resultado = await sendPushNotification(empresaId, {
      title: "🧪 Prueba de Notificación",
      body: "Esta es una notificación de prueba de NexoAgent. Si puedes verla, ¡todo funciona correctamente! 🎉",
      type: "mensaje",
      url: `/empresa/${empresaId}`,
      empresaId,
      requireInteraction: false,
      tag: "test-notification",
    });

    console.log(`🧪 [TEST] Resultado: ${resultado.sent} exitosas, ${resultado.failed} fallidas`);

    return NextResponse.json({
      success: true,
      message: "Notificación de prueba enviada",
      result: {
        sent: resultado.sent,
        failed: resultado.failed,
      },
      subscriptions: suscripciones.map((sub) => ({
        id: sub.id,
        endpoint: sub.endpoint.substring(0, 50) + "...",
        createdAt: sub.creadoEn,
        updatedAt: sub.actualizadoEn,
        userAgent: sub.userAgent,
      })),
    });
  } catch (error) {
    console.error("🧪 [TEST] Error:", error);
    return NextResponse.json(
      {
        error: "Error al enviar notificación de prueba",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Enviar notificación de prueba personalizada
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { empresaId, title, message, type } = body;

    if (!empresaId || !title || !message) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Verificar permisos
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario || (usuario.empresaId !== empresaId && usuario.rol !== "PROVEEDOR")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const resultado = await sendPushNotification(empresaId, {
      title,
      body: message,
      type: type || "mensaje",
      url: `/empresa/${empresaId}`,
      empresaId,
    });

    return NextResponse.json({
      success: true,
      sent: resultado.sent,
      failed: resultado.failed,
    });
  } catch (error) {
    console.error("Error enviando notificación personalizada:", error);
    return NextResponse.json(
      { error: "Error al enviar notificación" },
      { status: 500 }
    );
  }
}
