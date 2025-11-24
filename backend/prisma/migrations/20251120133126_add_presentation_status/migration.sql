-- CreateEnum
CREATE TYPE "PresentationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "status" "PresentationStatus" NOT NULL DEFAULT 'INACTIVE';
