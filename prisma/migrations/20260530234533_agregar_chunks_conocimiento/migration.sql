-- CreateTable
CREATE TABLE "DocumentoChunk" (
    "id" TEXT NOT NULL,
    "documentoId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "indice" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentoChunk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentoChunk" ADD CONSTRAINT "DocumentoChunk_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "Documento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
