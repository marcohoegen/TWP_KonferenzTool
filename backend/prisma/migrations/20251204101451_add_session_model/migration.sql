/*
  Warnings:

  - Added the required column `sessionId` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionNumber" INTEGER NOT NULL,
    "sessionName" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
