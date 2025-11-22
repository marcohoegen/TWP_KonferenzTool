-- DropForeignKey
ALTER TABLE "AdminPasswordTest" DROP CONSTRAINT "AdminPasswordTest_adminId_fkey";

-- AddForeignKey
ALTER TABLE "AdminPasswordTest" ADD CONSTRAINT "AdminPasswordTest_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
