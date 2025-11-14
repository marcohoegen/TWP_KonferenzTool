-- CreateTable
CREATE TABLE "AdminPasswordTest" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminPasswordTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminPasswordTest_adminId_key" ON "AdminPasswordTest"("adminId");

-- AddForeignKey
ALTER TABLE "AdminPasswordTest" ADD CONSTRAINT "AdminPasswordTest_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
