/**
 * Script de diagnóstico para notificaciones push
 * Ejecutar con: npx tsx scripts/test-notifications.ts
 */

import { prisma } from "../lib/prisma";
import { sendPushNotification } from "../lib/push-notifications";

async function testNotifications() {
  console.log("🔍 Iniciando diagnóstico de notificaciones...\n");

  // 1. Verificar variables de entorno
  console.log("1️⃣ Variables de entorno:");
  console.log("   NEXT_PUBLIC_VAPID_PUBLIC_KEY:", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "✅ Configurada" : "❌ Falta");
  console.log("   VAPID_PRIVATE_KEY:", process.env.VAPID_PRIVATE_KEY ? "✅ Configurada" : "❌ Falta");
  console.log("   VAPID_SUBJECT:", process.env.VAPID_SUBJECT || "mailto:perofaga@gmail.com", "\n");

  // 2. Verificar suscripciones en la base de datos
  console.log("2️⃣ Suscripciones en base de datos:");
  const empresas = await prisma.empresa.findMany({
    select: { id: true, nombre: true }
  });

  for (const empresa of empresas) {
    const suscripciones = await prisma.pushSubscription.findMany({
      where: { empresaId: empresa.id },
      select: { id: true, endpoint: true, creadoEn: true }
    });

    console.log(`   📱 ${empresa.nombre} (${empresa.id}):`);
    if (suscripciones.length === 0) {
      console.log("      ⚠️  No hay suscripciones registradas");
    } else {
      suscripciones.forEach((sub, i) => {
        console.log(`      ✅ Suscripción ${i + 1}: ${sub.endpoint.substring(0, 50)}...`);
        console.log(`         Creada: ${sub.creadoEn.toLocaleString()}`);
      });
    }
    console.log();
  }

  // 3. Verificar conversaciones con modo humano
  console.log("3️⃣ Conversaciones en modo humano:");
  const conversacionesHumano = await prisma.conversacion.findMany({
    where: { modoHumano: true },
    include: {
      empresa: { select: { nombre: true } }
    },
    take: 10
  });

  if (conversacionesHumano.length === 0) {
    console.log("   ℹ️  No hay conversaciones en modo humano\n");
  } else {
    conversacionesHumano.forEach((conv) => {
      console.log(`   🚨 ${conv.empresa.nombre} - ${conv.numeroCliente}`);
      console.log(`      Actualizado: ${conv.actualizadoEn.toLocaleString()}`);
    });
    console.log();
  }

  // 4. Verificar frases de activación de modo humano
  console.log("4️⃣ Frases configuradas para activar modo humano:");
  const FRASES_HUMANO = [
    "quiero hablar con una persona",
    "quiero hablar con un humano",
    "quiero hablar con un agente",
    "hablar con alguien",
    "atención humana",
    "operador",
    "agente humano",
    "persona real",
  ];
  FRASES_HUMANO.forEach((frase, i) => {
    console.log(`   ${i + 1}. "${frase}"`);
  });
  console.log();

  // 5. Probar detección de frases
  console.log("5️⃣ Probando detección de frases:");
  const testMensajes = [
    "Hola, quiero información",
    "Necesito hablar con un humano",
    "quiero hablar con una persona",
    "ayuda por favor",
    "operador disponible?",
  ];

  function solicitaHumano(mensaje: string): boolean {
    const lower = mensaje.toLowerCase();
    return FRASES_HUMANO.some((frase) => lower.includes(frase));
  }

  testMensajes.forEach((msg) => {
    const activaModoHumano = solicitaHumano(msg);
    console.log(`   ${activaModoHumano ? "✅" : "❌"} "${msg}"`);
  });
  console.log();

  // 6. Verificar últimos mensajes de clientes
  console.log("6️⃣ Últimos mensajes de clientes:");
  const ultimosMensajes = await prisma.mensaje.findMany({
    where: { rol: "CLIENTE" },
    orderBy: { creadoEn: "desc" },
    take: 5,
    include: {
      conversacion: {
        select: {
          numeroCliente: true,
          modoHumano: true,
          empresa: { select: { nombre: true } }
        }
      }
    }
  });

  if (ultimosMensajes.length === 0) {
    console.log("   ℹ️  No hay mensajes de clientes\n");
  } else {
    ultimosMensajes.forEach((msg, i) => {
      const modoIcon = msg.conversacion.modoHumano ? "🚨" : "🤖";
      console.log(`   ${i + 1}. ${modoIcon} ${msg.conversacion.empresa.nombre} - ${msg.conversacion.numeroCliente}`);
      console.log(`      "${msg.contenido.substring(0, 60)}${msg.contenido.length > 60 ? "..." : ""}"`);
      console.log(`      Enviado: ${msg.creadoEn.toLocaleString()}`);
      if (solicitaHumano(msg.contenido)) {
        console.log(`      ⚠️  Este mensaje debería activar modo humano!`);
      }
    });
    console.log();
  }

  console.log("✅ Diagnóstico completado\n");
  console.log("📋 Recomendaciones:");
  console.log("   1. Verifica que las notificaciones estén habilitadas en el navegador");
  console.log("   2. Asegúrate de que el Service Worker esté registrado en /sw.js");
  console.log("   3. Verifica las variables de entorno VAPID en Vercel");
  console.log("   4. Revisa los logs del webhook en tiempo real con: vercel logs");
}

testNotifications()
  .then(() => {
    console.log("\n✅ Script finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
