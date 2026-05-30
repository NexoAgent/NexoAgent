-- CreateEnum
CREATE TYPE "TipoContacto" AS ENUM ('LEAD', 'CLIENTE', 'PROVEEDOR');

-- AlterTable
ALTER TABLE "Conversacion" ADD COLUMN     "contactoId" TEXT;

-- CreateTable
CREATE TABLE "Contacto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT,
    "telefono" TEXT NOT NULL,
    "tipo" "TipoContacto" NOT NULL DEFAULT 'LEAD',
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contacto_empresaId_telefono_key" ON "Contacto"("empresaId", "telefono");

-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "Contacto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
