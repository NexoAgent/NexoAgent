import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Configurar VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:perofaga@gmail.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export type NotificationType = "mensaje" | "modo-humano" | "cita";

export interface PushNotificationPayload {
  title: string;
  body: string;
  type: NotificationType;
  url?: string;
  empresaId?: string;
  conversacionId?: string;
  requireInteraction?: boolean;
  tag?: string;
  renotify?: boolean;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  image?: string;
  timestamp?: number;
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
      type: payload.type,
      url: payload.url || "/",
      empresaId: payload.empresaId,
      conversacionId: payload.conversacionId,
      requireInteraction: payload.requireInteraction || false,
      tag: payload.tag || "nexoagent-notification",
      renotify: payload.renotify || false,
      actions: payload.actions || [],
      image: payload.image,
      timestamp: payload.timestamp || Date.now(),
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
 * Agrupa mensajes del mismo cliente automáticamente
 */
export async function notificarNuevoMensaje(
  empresaId: string,
  conversacionId: string,
  numeroCliente: string,
  contenido: string
) {
  // Verificar si ya hay mensajes recientes de esta conversación
  const mensajesRecientes = await contarMensajesRecientes(conversacionId);

  let title: string;
  let body: string;

  if (mensajesRecientes > 1) {
    // Agrupar: mostrar contador
    title = `💬 ${mensajesRecientes} nuevos mensajes de ${numeroCliente}`;
    body = "Tienes mensajes sin leer en esta conversación";
  } else {
    // Mensaje individual
    const mensajeTruncado = contenido.length > 100
      ? contenido.substring(0, 100) + "..."
      : contenido;
    title = `💬 Nuevo mensaje de ${numeroCliente}`;
    body = mensajeTruncado;
  }

  await sendPushNotification(empresaId, {
    title,
    body,
    type: "mensaje",
    url: `/empresa/${empresaId}/conversaciones/${conversacionId}`,
    empresaId,
    conversacionId,
    tag: `mensaje-${conversacionId}`, // Mismo tag = reemplaza la anterior
    renotify: true, // Re-notifica cuando se actualiza
    requireInteraction: false,
  });
}

/**
 * Cuenta mensajes recientes de una conversación (últimos 2 minutos)
 * para agrupar notificaciones
 */
async function contarMensajesRecientes(conversacionId: string): Promise<number> {
  const dosMinutosAtras = new Date(Date.now() - 2 * 60 * 1000);

  const count = await prisma.mensaje.count({
    where: {
      conversacionId,
      rol: "CLIENTE",
      creadoEn: {
        gte: dosMinutosAtras,
      },
    },
  });

  return count;
}

/**
 * Notificación cuando la IA deriva a modo humano
 * ALTA PRIORIDAD - Requiere atención inmediata
 */
export async function notificarModoHumano(
  empresaId: string,
  conversacionId: string,
  numeroCliente: string
) {
  await sendPushNotification(empresaId, {
    title: `🚨 URGENTE: Atención requerida`,
    body: `${numeroCliente} necesita hablar con un humano`,
    type: "modo-humano",
    url: `/empresa/${empresaId}/conversaciones/${conversacionId}`,
    empresaId,
    conversacionId,
    tag: `modo-humano-${conversacionId}`,
    requireInteraction: true, // No se cierra automáticamente
    renotify: true,
    actions: [
      { action: "ver", title: "👁️ Ver ahora" },
      { action: "ignorar", title: "❌ Ignorar" },
    ],
  });
}

/**
 * Notificación cuando se crea una nueva cita
 * PRIORIDAD NORMAL - Informativa
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
    type: "cita",
    url: `/empresa/${empresaId}/agenda`,
    empresaId,
    tag: `cita-${citaId}`,
    requireInteraction: false,
    timestamp: fecha.getTime(),
  });
}
