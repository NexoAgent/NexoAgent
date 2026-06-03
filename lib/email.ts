import { Resend } from "resend";

const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Lazy initialization de Resend solo cuando hay API key
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no está configurado. Los emails no se enviarán.");
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Enviar email cuando se crea un nuevo ticket
 */
export async function enviarEmailNuevoTicket({
  ticketId,
  titulo,
  descripcion,
  prioridad,
  categoria,
  creadoPor,
  destinatarioEmail,
  destinatarioNombre,
}: {
  ticketId: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  categoria: string;
  creadoPor: string;
  destinatarioEmail: string;
  destinatarioNombre: string;
}) {
  const ticketUrl = `${APP_URL}/dashboard/tickets/${ticketId}`;

  const prioridadLabel: Record<string, string> = {
    BAJA: "Baja",
    MEDIA: "Media",
    ALTA: "Alta",
    URGENTE: "⚠️ Urgente",
  };

  const categoriaLabel: Record<string, string> = {
    GENERAL: "General",
    TECNICO: "Técnico",
    FACTURACION: "Facturación",
    FUNCIONALIDAD: "Funcionalidad",
    BUG: "Bug",
    MEJORA: "Mejora",
  };

  const client = getResendClient();
  if (!client) {
    console.log(`[DEV] Email simulado (Resend no configurado)`);
    return;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: destinatarioEmail,
      subject: `Nuevo ticket: ${titulo}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">NexoAgent</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sistema de Tickets</p>
            </div>

            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">¡Nuevo Ticket Creado!</h2>

              <p style="color: #4b5563;">Hola <strong>${destinatarioNombre}</strong>,</p>

              <p style="color: #4b5563;">Se ha creado un nuevo ticket que requiere tu atención:</p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">${titulo}</h3>

                <div style="margin-bottom: 10px;">
                  <span style="display: inline-block; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 12px; font-weight: 500; margin-right: 8px;">
                    ${categoriaLabel[categoria] || categoria}
                  </span>
                  <span style="display: inline-block; padding: 4px 12px; background: ${
                    prioridad === "URGENTE"
                      ? "#fee2e2"
                      : prioridad === "ALTA"
                      ? "#fed7aa"
                      : "#e0e7ff"
                  }; color: ${
        prioridad === "URGENTE"
          ? "#991b1b"
          : prioridad === "ALTA"
          ? "#9a3412"
          : "#3730a3"
      }; border-radius: 4px; font-size: 12px; font-weight: 500;">
                    ${prioridadLabel[prioridad] || prioridad}
                  </span>
                </div>

                <p style="color: #6b7280; margin: 15px 0 10px 0; white-space: pre-wrap;">${descripcion}</p>

                <p style="color: #9ca3af; font-size: 14px; margin: 10px 0 0 0;">
                  Creado por: <strong>${creadoPor}</strong>
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${ticketUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Ver Ticket
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                Este email fue enviado automáticamente por NexoAgent. Si no debes recibir estas notificaciones, por favor contacta al administrador.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de nuevo ticket:", error);
    // No lanzamos el error para que no falle la creación del ticket
  }
}

/**
 * Enviar email cuando se agrega una respuesta a un ticket
 */
export async function enviarEmailRespuestaTicket({
  ticketId,
  titulo,
  mensaje,
  respuestaDe,
  destinatarioEmail,
  destinatarioNombre,
  esInterno,
}: {
  ticketId: string;
  titulo: string;
  mensaje: string;
  respuestaDe: string;
  destinatarioEmail: string;
  destinatarioNombre: string;
  esInterno: boolean;
}) {
  const ticketUrl = `${APP_URL}/dashboard/tickets/${ticketId}`;

  const client = getResendClient();
  if (!client) {
    console.log(`[DEV] Email simulado (Resend no configurado)`);
    return;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: destinatarioEmail,
      subject: `${esInterno ? "[Nota Interna] " : ""}Nueva respuesta en: ${titulo}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">NexoAgent</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sistema de Tickets</p>
            </div>

            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Nueva Respuesta ${esInterno ? "(Nota Interna)" : ""}</h2>

              <p style="color: #4b5563;">Hola <strong>${destinatarioNombre}</strong>,</p>

              <p style="color: #4b5563;">${respuestaDe} ha respondido en el ticket:</p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">${titulo}</h3>

                ${
                  esInterno
                    ? '<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 15px;"><p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">📝 Nota Interna - Solo visible para el equipo</p></div>'
                    : ""
                }

                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 3px solid #667eea;">
                  <p style="color: #4b5563; margin: 0; white-space: pre-wrap;">${mensaje}</p>
                </div>

                <p style="color: #9ca3af; font-size: 14px; margin: 15px 0 0 0;">
                  Por: <strong>${respuestaDe}</strong>
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${ticketUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Ver Conversación Completa
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                Este email fue enviado automáticamente por NexoAgent. Si no debes recibir estas notificaciones, por favor contacta al administrador.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de respuesta:", error);
  }
}

/**
 * Enviar email cuando cambia el estado de un ticket
 */
export async function enviarEmailCambioEstado({
  ticketId,
  titulo,
  estadoAnterior,
  estadoNuevo,
  cambiadoPor,
  destinatarioEmail,
  destinatarioNombre,
}: {
  ticketId: string;
  titulo: string;
  estadoAnterior: string;
  estadoNuevo: string;
  cambiadoPor: string;
  destinatarioEmail: string;
  destinatarioNombre: string;
}) {
  const ticketUrl = `${APP_URL}/dashboard/tickets/${ticketId}`;

  const estadoLabels: Record<string, string> = {
    ABIERTO: "Abierto",
    EN_PROGRESO: "En Progreso",
    RESUELTO: "Resuelto",
    CERRADO: "Cerrado",
  };

  const estadoColors: Record<string, string> = {
    ABIERTO: "#3b82f6",
    EN_PROGRESO: "#f59e0b",
    RESUELTO: "#10b981",
    CERRADO: "#6b7280",
  };

  const client = getResendClient();
  if (!client) {
    console.log(`[DEV] Email simulado (Resend no configurado)`);
    return;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: destinatarioEmail,
      subject: `Estado actualizado: ${titulo}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">NexoAgent</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sistema de Tickets</p>
            </div>

            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Estado Actualizado</h2>

              <p style="color: #4b5563;">Hola <strong>${destinatarioNombre}</strong>,</p>

              <p style="color: #4b5563;">El estado del ticket ha sido actualizado:</p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">${titulo}</h3>

                <div style="display: flex; align-items: center; gap: 15px; margin: 20px 0;">
                  <div style="text-align: center;">
                    <div style="background: ${estadoColors[estadoAnterior]}; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                      ${estadoLabels[estadoAnterior] || estadoAnterior}
                    </div>
                    <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Anterior</p>
                  </div>

                  <div style="color: #9ca3af; font-size: 24px;">→</div>

                  <div style="text-align: center;">
                    <div style="background: ${estadoColors[estadoNuevo]}; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                      ${estadoLabels[estadoNuevo] || estadoNuevo}
                    </div>
                    <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Nuevo</p>
                  </div>
                </div>

                <p style="color: #9ca3af; font-size: 14px; margin: 15px 0 0 0;">
                  Actualizado por: <strong>${cambiadoPor}</strong>
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${ticketUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Ver Ticket
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                Este email fue enviado automáticamente por NexoAgent. Si no debes recibir estas notificaciones, por favor contacta al administrador.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de cambio de estado:", error);
  }
}

/**
 * Enviar email cuando se asigna un ticket
 */
export async function enviarEmailAsignacionTicket({
  ticketId,
  titulo,
  descripcion,
  prioridad,
  asignadoPor,
  destinatarioEmail,
  destinatarioNombre,
}: {
  ticketId: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  asignadoPor: string;
  destinatarioEmail: string;
  destinatarioNombre: string;
}) {
  const ticketUrl = `${APP_URL}/dashboard/tickets/${ticketId}`;

  const prioridadLabel: Record<string, string> = {
    BAJA: "Baja",
    MEDIA: "Media",
    ALTA: "Alta",
    URGENTE: "⚠️ Urgente",
  };

  const client = getResendClient();
  if (!client) {
    console.log(`[DEV] Email simulado (Resend no configurado)`);
    return;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: destinatarioEmail,
      subject: `Ticket asignado: ${titulo}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">NexoAgent</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sistema de Tickets</p>
            </div>

            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Ticket Asignado</h2>

              <p style="color: #4b5563;">Hola <strong>${destinatarioNombre}</strong>,</p>

              <p style="color: #4b5563;">Se te ha asignado el siguiente ticket:</p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">${titulo}</h3>

                <div style="margin-bottom: 15px;">
                  <span style="display: inline-block; padding: 4px 12px; background: ${
                    prioridad === "URGENTE"
                      ? "#fee2e2"
                      : prioridad === "ALTA"
                      ? "#fed7aa"
                      : "#e0e7ff"
                  }; color: ${
        prioridad === "URGENTE"
          ? "#991b1b"
          : prioridad === "ALTA"
          ? "#9a3412"
          : "#3730a3"
      }; border-radius: 4px; font-size: 12px; font-weight: 500;">
                    Prioridad: ${prioridadLabel[prioridad] || prioridad}
                  </span>
                </div>

                <p style="color: #6b7280; margin: 15px 0 10px 0; white-space: pre-wrap;">${descripcion}</p>

                <p style="color: #9ca3af; font-size: 14px; margin: 10px 0 0 0;">
                  Asignado por: <strong>${asignadoPor}</strong>
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${ticketUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Ver y Responder
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                Este email fue enviado automáticamente por NexoAgent. Si no debes recibir estas notificaciones, por favor contacta al administrador.
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de asignación:", error);
  }
}
