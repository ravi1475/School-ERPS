/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `School` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'Not Provided',
ADD COLUMN     "code" TEXT NOT NULL DEFAULT 'SC000',
ADD COLUMN     "contact" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "established" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "principal" TEXT NOT NULL DEFAULT 'Unknown',
ALTER COLUMN "fullName" SET DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "class" TEXT[],
ADD COLUMN     "experience" TEXT NOT NULL DEFAULT '5+',
ADD COLUMN     "joining_year" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subjects" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "School_code_key" ON "School"("code");
