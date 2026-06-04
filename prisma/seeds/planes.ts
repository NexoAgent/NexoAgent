import { prisma } from "../../lib/prisma";

export async function seedPlanes() {
  console.log("🌱 Seeding planes...");

  const planes = [
    {
      nombre: "STARTER",
      descripcion: "Plan ideal para pequeños negocios que inician con automatización",
      precio: 49.0, // USD
      precioMXN: null,
      maxWhatsApps: 1,
      maxAgentes: 3,
      maxConversacionesMes: 500,
      maxDocumentosMB: 10,
      transferenciaAgentes: false,
      ruteoInteligente: false,
      analyticsAvanzados: false,
      apiPersonalizada: false,
      soportePrioritario: false,
      horariosPersonalizados: false,
      orden: 1,
      visible: true,
    },
    {
      nombre: "BUSINESS",
      descripcion: "Plan profesional con múltiples canales y agentes especializados",
      precio: 149.0, // USD
      precioMXN: null,
      maxWhatsApps: 3,
      maxAgentes: 10,
      maxConversacionesMes: 2000,
      maxDocumentosMB: 100,
      transferenciaAgentes: true,
      ruteoInteligente: true,
      analyticsAvanzados: false,
      apiPersonalizada: false,
      soportePrioritario: false,
      horariosPersonalizados: true,
      orden: 2,
      visible: true,
    },
    {
      nombre: "CORPORATIVO",
      descripcion: "Plan empresarial con capacidades ilimitadas y soporte prioritario",
      precio: 399.0, // USD
      precioMXN: null,
      maxWhatsApps: 10,
      maxAgentes: -1, // Ilimitado
      maxConversacionesMes: 10000,
      maxDocumentosMB: -1, // Ilimitado
      transferenciaAgentes: true,
      ruteoInteligente: true,
      analyticsAvanzados: true,
      apiPersonalizada: true,
      soportePrioritario: true,
      horariosPersonalizados: true,
      orden: 3,
      visible: true,
    },
  ];

  for (const planData of planes) {
    const plan = await prisma.plan.upsert({
      where: { nombre: planData.nombre },
      update: planData,
      create: planData,
    });

    console.log(`  ✅ Plan ${plan.nombre} creado/actualizado`);
  }

  console.log("✅ Planes seeded correctamente\n");
}

// Si se ejecuta directamente
if (require.main === module) {
  seedPlanes()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
