/*
  Warnings:

  - You are about to drop the column `data` on the `Artifact` table. All the data in the column will be lost.
  - Added the required column `inputPath` to the `Artifact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Artifact` DROP COLUMN `data`,
    ADD COLUMN `inputPath` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('QUQUED', 'GENERATING', 'CANCELED', 'ERROR', 'DONE') NULL DEFAULT 'ERROR',
    MODIFY `jobId` VARCHAR(191) NULL;
