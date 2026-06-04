-- Crear tabla Agente
CREATE TABLE "Agente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "prompt" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "palabrasClave" TEXT[],
    "horarioInicio" TEXT,
    "horarioFin" TEXT,
    "diasSemana" INTEGER[],
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agente_pkey" PRIMARY KEY ("id")
);

-- Crear tabla TransferenciaAgente
CREATE TABLE "TransferenciaAgente" (
    "id" TEXT NOT NULL,
    "conversacionId" TEXT NOT NULL,
    "agenteOrigenId" TEXT,
    "agenteDestinoId" TEXT NOT NULL,
    "motivo" TEXT,
    "aprobada" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferenciaAgente_pkey" PRIMARY KEY ("id")
);

-- Agregar campo agenteId a Conversacion
ALTER TABLE "Conversacion" ADD COLUMN "agenteId" TEXT;

-- Índices para Agente
CREATE INDEX "Agente_empresaId_idx" ON "Agente"("empresaId");
CREATE INDEX "Agente_activo_idx" ON "Agente"("activo");

-- Índices para TransferenciaAgente
CREATE INDEX "TransferenciaAgente_conversacionId_idx" ON "TransferenciaAgente"("conversacionId");
CREATE INDEX "TransferenciaAgente_agenteOrigenId_idx" ON "TransferenciaAgente"("agenteOrigenId");
CREATE INDEX "TransferenciaAgente_agenteDestinoId_idx" ON "TransferenciaAgente"("agenteDestinoId");

-- Índice para agenteId en Conversacion
CREATE INDEX "Conversacion_agenteId_idx" ON "Conversacion"("agenteId");

-- Foreign keys
ALTER TABLE "Agente" ADD CONSTRAINT "Agente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_agenteId_fkey" FOREIGN KEY ("agenteId") REFERENCES "Agente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransferenciaAgente" ADD CONSTRAINT "TransferenciaAgente_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TransferenciaAgente" ADD CONSTRAINT "TransferenciaAgente_agenteOrigenId_fkey" FOREIGN KEY ("agenteOrigenId") REFERENCES "Agente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransferenciaAgente" ADD CONSTRAINT "TransferenciaAgente_agenteDestinoId_fkey" FOREIGN KEY ("agenteDestinoId") REFERENCES "Agente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Crear agente principal para cada empresa existente
INSERT INTO "Agente" ("id", "empresaId", "nombre", "descripcion", "prompt", "activo", "esPrincipal", "color", "palabrasClave", "diasSemana", "creadoEn", "actualizadoEn")
SELECT
  gen_random_uuid()::text,
  "id" as "empresaId",
  'Asistente General' as "nombre",
  'Agente virtual principal de atención al cliente' as "descripcion",
  COALESCE("promptSistema", 'Eres un asistente virtual amable y profesional.') as "prompt",
  true as "activo",
  true as "esPrincipal",
  '#3B82F6' as "color",
  ARRAY[]::TEXT[] as "palabrasClave",
  ARRAY[0,1,2,3,4,5,6]::INTEGER[] as "diasSemana",
  CURRENT_TIMESTAMP as "creadoEn",
  CURRENT_TIMESTAMP as "actualizadoEn"
FROM "Empresa";

-- Asignar el agente principal a todas las conversaciones existentes
UPDATE "Conversacion" c
SET "agenteId" = (
  SELECT a."id"
  FROM "Agente" a
  WHERE a."empresaId" = c."empresaId"
  AND a."esPrincipal" = true
  LIMIT 1
);
