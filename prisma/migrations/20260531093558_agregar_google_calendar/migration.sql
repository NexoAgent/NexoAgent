-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "googleCalendarLink" TEXT,
ADD COLUMN     "googleEventId" TEXT;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleCalendarId" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3);
