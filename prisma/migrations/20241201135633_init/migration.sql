/*
  Warnings:

  - The values [QUQUED] on the enum `Artifact_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `modelId` to the `Artifact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Artifact` ADD COLUMN `modelId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('QUEUED', 'GENERATING', 'CANCELED', 'ERROR', 'DONE') NULL DEFAULT 'ERROR';
