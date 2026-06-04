-- CreateEnum
CREATE TYPE "EstadoPlan" AS ENUM ('TRIAL', 'ACTIVO', 'SUSPENDIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "precioMXN" DOUBLE PRECISION,
    "maxWhatsApps" INTEGER NOT NULL,
    "maxAgentes" INTEGER NOT NULL,
    "maxConversacionesMes" INTEGER NOT NULL,
    "maxDocumentosMB" INTEGER NOT NULL,
    "transferenciaAgentes" BOOLEAN NOT NULL DEFAULT false,
    "ruteoInteligente" BOOLEAN NOT NULL DEFAULT false,
    "analyticsAvanzados" BOOLEAN NOT NULL DEFAULT false,
    "apiPersonalizada" BOOLEAN NOT NULL DEFAULT false,
    "soportePrioritario" BOOLEAN NOT NULL DEFAULT false,
    "horariosPersonalizados" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Empresa"
ADD COLUMN "planId" TEXT,
ADD COLUMN "estadoPlan" "EstadoPlan" NOT NULL DEFAULT 'TRIAL',
ADD COLUMN "fechaVencimiento" TIMESTAMP(3),
ADD COLUMN "conversacionesEsteMes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "ultimoResetContador" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_nombre_key" ON "Plan"("nombre");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
