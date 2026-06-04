-- Migration: Allow multiple users per empresa
-- Date: 2026-06-04
-- Description: Change from 1-to-1 to 1-to-many relationship between Empresa and Usuario

-- Add new columns to Usuario table
ALTER TABLE "Usuario" ADD COLUMN "esUsuarioPrincipal" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Usuario" ADD COLUMN "requiereCambioPassword" BOOLEAN NOT NULL DEFAULT false;

-- Drop unique constraint on empresaId to allow multiple users per empresa
ALTER TABLE "Usuario" DROP CONSTRAINT IF EXISTS "Usuario_empresaId_key";

-- Add index on empresaId for performance
CREATE INDEX IF NOT EXISTS "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- Mark existing users as principal users
UPDATE "Usuario" SET "esUsuarioPrincipal" = true WHERE "empresaId" IS NOT NULL;
