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
    const respuestaVieja = auto.respuesta;

    // Solo actualizar si contiene "asistente virtual"
    if (respuestaVieja.toLowerCase().includes("asistente virtual")) {
      const nombreEmpresa = auto.empresa.nombre;

      // Generar mensaje personalizado con Katy
      const respuestaNueva = `¡Hola! Soy Katy de ${nombreEmpresa} 😊 ¿En qué te puedo ayudar?`;

      await prisma.automatizacion.update({
        where: { id: auto.id },
        data: { respuesta: respuestaNueva },
      });

      console.log(`✅ Actualizada: ${nombreEmpresa}`);
      console.log(`   Antes: ${respuestaVieja}`);
      console.log(`   Ahora: ${respuestaNueva}`);
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
