/*
  Warnings:

  - You are about to alter the column `expiresAt` on the `ResetCodes` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `ResetCodes` MODIFY `expiresAt` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `BalanceHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `balance` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accountId` INTEGER NOT NULL,

    INDEX `BalanceHistory_accountId_date_idx`(`accountId`, `date`),
    UNIQUE INDEX `BalanceHistory_accountId_date_key`(`accountId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BalanceHistory` ADD CONSTRAINT `BalanceHistory_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
