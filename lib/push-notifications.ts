import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Configurar VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:perofaga@gmail.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  empresaId?: string;
  conversacionId?: string;
  requireInteraction?: boolean;
  tag?: string;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

/**
 * Envía una notificación push a todos los dispositivos suscritos de una empresa
 */
export async function sendPushNotification(
  empresaId: string,
  payload: PushNotificationPayload
) {
  try {
    // Obtener todas las suscripciones activas de la empresa
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { empresaId },
    });

    if (subscriptions.length === 0) {
      console.log(`No hay suscripciones push para empresa ${empresaId}`);
      return { sent: 0, failed: 0 };
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || "/",
      empresaId: payload.empresaId,
      conversacionId: payload.conversacionId,
      requireInteraction: payload.requireInteraction || false,
      tag: payload.tag || "nexoagent-notification",
      actions: payload.actions || [],
    });

    let sent = 0;
    let failed = 0;

    // Enviar notificación a cada suscripción
    const promises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload
        );
        sent++;
      } catch (error: unknown) {
        failed++;
        console.error(`Error enviando notificación a ${sub.endpoint}:`, error);

        // Si la suscripción es inválida (410 Gone), eliminarla
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
          console.log(`Suscripción eliminada (410 Gone): ${sub.id}`);
        }
      }
    });

    await Promise.all(promises);

    console.log(
      `Notificaciones enviadas para empresa ${empresaId}: ${sent} exitosas, ${failed} fallidas`
    );

    return { sent, failed };
  } catch (error) {
    console.error("Error enviando notificaciones push:", error);
    throw error;
  }
}

/**
 * Notificación cuando un nuevo mensaje llega
 */
export async function notificarNuevoMensaje(
  empresaId: string,
  conversacionId: string,
  numeroCliente: string,
  contenido: string
) {
  const mensajeTruncado = contenido.length > 100
    ? contenido.substring(0, 100) + "..."
    : contenido;

  await sendPushNotification(empresaId, {
    title: `💬 Nuevo mensaje de ${numeroCliente}`,
    body: mensajeTruncado,
    url: `/empresa/${empresaId}/conversaciones/${conversacionId}`,
    empresaId,
    conversacionId,
    tag: `mensaje-${conversacionId}`,
    requireInteraction: false,
  });
}

/**
 * Notificación cuando la IA deriva a modo humano
 */
export async function notificarModoHumano(
  empresaId: string,
  conversacionId: string,
  numeroCliente: string
) {
  await sendPushNotification(empresaId, {
    title: `👤 Atención requerida - ${numeroCliente}`,
    body: "La IA derivó esta conversación a modo humano. El cliente necesita tu atención.",
    url: `/empresa/${empresaId}/conversaciones/${conversacionId}`,
    empresaId,
    conversacionId,
    tag: `modo-humano-${conversacionId}`,
    requireInteraction: true, // Requiere que el usuario interactúe
    actions: [
      { action: "ver", title: "Ver conversación" },
      { action: "ignorar", title: "Ignorar" },
    ],
  });
}

/**
 * Notificación cuando se crea una nueva cita
 */
export async function notificarNuevaCita(
  empresaId: string,
  citaId: string,
  nombreCliente: string,
  fecha: Date
) {
  const fechaFormateada = new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);

  await sendPushNotification(empresaId, {
    title: `📅 Nueva cita agendada`,
    body: `${nombreCliente} - ${fechaFormateada}`,
    url: `/empresa/${empresaId}/agenda`,
    empresaId,
    tag: `cita-${citaId}`,
    requireInteraction: false,
  });
}
