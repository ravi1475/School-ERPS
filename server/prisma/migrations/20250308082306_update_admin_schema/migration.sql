/*
  Warnings:

  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `School` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;
