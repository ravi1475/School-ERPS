-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SCHOOL', 'TEACHER');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'SCHOOL';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TEACHER';

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
