import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * API endpoint para búsqueda global
 * GET /api/empresa/[id]/search?q=query
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Verificar autenticación
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener query de búsqueda
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.trim().toLowerCase();

    // Buscar en paralelo en todas las entidades
    const [conversaciones, contactos, citas] = await Promise.all([
      // Buscar conversaciones por número de cliente
      prisma.conversacion.findMany({
        where: {
          empresaId: id,
          numeroCliente: {
            contains: searchTerm,
          },
        },
        take: 5,
        orderBy: { actualizadoEn: "desc" },
        include: {
          mensajes: {
            orderBy: { creadoEn: "desc" },
            take: 1,
          },
        },
      }),

      // Buscar contactos por nombre o teléfono
      prisma.contacto.findMany({
        where: {
          empresaId: id,
          OR: [
            {
              nombre: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              telefono: {
                contains: searchTerm,
              },
            },
          ],
        },
        take: 5,
        orderBy: { creadoEn: "desc" },
      }),

      // Buscar citas por nombre de cliente
      prisma.cita.findMany({
        where: {
          empresaId: id,
          nombreCliente: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        take: 5,
        orderBy: { inicio: "desc" },
      }),
    ]);

    // Formatear resultados (sin iconos JSX, se agregan en el cliente)
    const results = [
      // Conversaciones
      ...conversaciones.map((conv) => ({
        id: conv.id,
        type: "conversacion" as const,
        title: conv.numeroCliente,
        subtitle: conv.mensajes[0]?.contenido || "Sin mensajes",
        url: `/empresa/${id}/conversaciones/${conv.id}`,
      })),

      // Contactos
      ...contactos.map((contacto) => ({
        id: contacto.id,
        type: "contacto" as const,
        title: contacto.nombre,
        subtitle: `${contacto.telefono} • ${contacto.tipo}`,
        url: `/empresa/${id}/crm/${contacto.id}`,
      })),

      // Citas
      ...citas.map((cita) => ({
        id: cita.id,
        type: "cita" as const,
        title: cita.nombreCliente,
        subtitle: new Date(cita.inicio).toLocaleString("es-MX", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        url: `/empresa/${id}/agenda`,
      })),
    ];

    // Ordenar por relevancia (las conversaciones primero, luego contactos, luego citas)
    const sortedResults = results.sort((a, b) => {
      const typeOrder = { conversacion: 0, contacto: 1, cita: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });

    return NextResponse.json({ results: sortedResults.slice(0, 10) });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json(
      { error: "Error al buscar" },
      { status: 500 }
    );
  }
}
