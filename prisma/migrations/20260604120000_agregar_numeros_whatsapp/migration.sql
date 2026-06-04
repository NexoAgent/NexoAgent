-- Crear tabla NumeroWhatsApp
CREATE TABLE "NumeroWhatsApp" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "nombre" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NumeroWhatsApp_pkey" PRIMARY KEY ("id")
);

-- Agregar campo numeroWhatsAppId a Conversacion
ALTER TABLE "Conversacion" ADD COLUMN "numeroWhatsAppId" TEXT;

-- Índices
CREATE UNIQUE INDEX "NumeroWhatsApp_telefono_key" ON "NumeroWhatsApp"("telefono");
CREATE INDEX "NumeroWhatsApp_empresaId_idx" ON "NumeroWhatsApp"("empresaId");
CREATE INDEX "NumeroWhatsApp_telefono_idx" ON "NumeroWhatsApp"("telefono");
CREATE INDEX "Conversacion_numeroWhatsAppId_idx" ON "Conversacion"("numeroWhatsAppId");

-- Foreign keys
ALTER TABLE "NumeroWhatsApp" ADD CONSTRAINT "NumeroWhatsApp_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_numeroWhatsAppId_fkey" FOREIGN KEY ("numeroWhatsAppId") REFERENCES "NumeroWhatsApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrar datos existentes: crear NumeroWhatsApp para cada Empresa
INSERT INTO "NumeroWhatsApp" ("id", "empresaId", "telefono", "nombre", "activo", "esPrincipal", "creadoEn", "actualizadoEn")
SELECT
  gen_random_uuid()::text,
  "id" as "empresaId",
  "telefonoWhatsapp" as "telefono",
  'Principal' as "nombre",
  true as "activo",
  true as "esPrincipal",
  CURRENT_TIMESTAMP as "creadoEn",
  CURRENT_TIMESTAMP as "actualizadoEn"
FROM "Empresa";

-- Actualizar conversaciones existentes para vincularlas con su número de WhatsApp
UPDATE "Conversacion" c
SET "numeroWhatsAppId" = (
  SELECT nw."id"
  FROM "NumeroWhatsApp" nw
  WHERE nw."empresaId" = c."empresaId"
  AND nw."esPrincipal" = true
  LIMIT 1
);
