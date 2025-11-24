/*
  Warnings:

  - You are about to drop the column `userId` on the `Presentation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_userId_fkey";

-- AlterTable
ALTER TABLE "Presentation" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_PresentationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PresentationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PresentationToUser_B_index" ON "_PresentationToUser"("B");

-- AddForeignKey
ALTER TABLE "_PresentationToUser" ADD CONSTRAINT "_PresentationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Presentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PresentationToUser" ADD CONSTRAINT "_PresentationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
