-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_sessionId_fkey";

-- AlterTable
ALTER TABLE "Presentation" ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
