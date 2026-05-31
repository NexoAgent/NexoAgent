-- CreateEnum
CREATE TYPE "TipoTrigger" AS ENUM ('PRIMER_MENSAJE', 'PALABRA_CLAVE', 'FUERA_HORARIO');

-- CreateTable
CREATE TABLE "Automatizacion" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "trigger" "TipoTrigger" NOT NULL,
    "condicion" TEXT,
    "mensaje" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "ejecuciones" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Automatizacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Automatizacion" ADD CONSTRAINT "Automatizacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
