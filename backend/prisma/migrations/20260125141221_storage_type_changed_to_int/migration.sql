/*
  Warnings:

  - You are about to alter the column `totalStorage` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `usedStorage` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "totalStorage" SET DATA TYPE INTEGER,
ALTER COLUMN "usedStorage" SET DATA TYPE INTEGER;
