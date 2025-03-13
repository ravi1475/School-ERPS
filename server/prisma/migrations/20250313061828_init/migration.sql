/*
  Warnings:

  - You are about to drop the column `class` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `joining_year` on the `teacher` table. All the data in the column will be lost.
  - Added the required column `address` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classes` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `teacher` DROP COLUMN `class`,
    DROP COLUMN `joining_year`,
    ADD COLUMN `address` TEXT NOT NULL,
    ADD COLUMN `classes` TEXT NOT NULL,
    ADD COLUMN `designation` VARCHAR(191) NOT NULL DEFAULT 'Teacher',
    ADD COLUMN `education` VARCHAR(191) NOT NULL,
    ADD COLUMN `inchargeClass` VARCHAR(191) NULL,
    ADD COLUMN `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `lastLogin` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL DEFAULT '0123456789',
    ADD COLUMN `profileImage` TEXT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    MODIFY `experience` VARCHAR(191) NOT NULL DEFAULT '0 years',
    MODIFY `isClassIncharge` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Teacher_email_idx` ON `Teacher`(`email`);

-- CreateIndex
CREATE INDEX `Teacher_isClassIncharge_idx` ON `Teacher`(`isClassIncharge`);

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_schoolId_fkey` TO `Teacher_schoolId_idx`;
