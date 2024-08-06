/*
  Warnings:

  - You are about to drop the column `utcOffset` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "utcOffset",
ADD COLUMN     "timezone" TEXT;
