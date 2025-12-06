/*
  Warnings:

  - Added the required column `conferenceId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "conferenceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
