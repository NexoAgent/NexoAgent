// Script para actualizar automatizaciones que dicen "asistente virtual" a "Katy"
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🔄 Actualizando automatizaciones...");

  const automatizaciones = await prisma.automatizacion.findMany({
    where: {
      trigger: "PRIMER_MENSAJE",
    },
    include: {
      empresa: {
        select: {
          nombre: true,
        },
      },
    },
  });

  console.log(`📋 Encontradas ${automatizaciones.length} automatizaciones de primer mensaje`);

  for (const auto of automatizaciones) {
    const mensajeViejo = auto.mensaje;

    // Solo actualizar si contiene "asistente virtual"
    if (mensajeViejo.toLowerCase().includes("asistente virtual")) {
      const nombreEmpresa = auto.empresa.nombre;

      // Generar mensaje personalizado con Katy
      const mensajeNuevo = `¡Hola! Soy Katy de ${nombreEmpresa} 😊 ¿En qué te puedo ayudar?`;

      await prisma.automatizacion.update({
        where: { id: auto.id },
        data: { mensaje: mensajeNuevo },
      });

      console.log(`✅ Actualizada: ${nombreEmpresa}`);
      console.log(`   Antes: ${mensajeViejo}`);
      console.log(`   Ahora: ${mensajeNuevo}`);
      console.log("");
    }
  }

  console.log("✨ ¡Listo!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
