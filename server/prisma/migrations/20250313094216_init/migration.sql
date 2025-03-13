/*
  Warnings:

  - Added the required column `sections` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `inchargeSection` VARCHAR(191) NULL,
    ADD COLUMN `sections` TEXT NOT NULL;
