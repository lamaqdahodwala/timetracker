/*
  Warnings:

  - Added the required column `userId` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "today" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'additive',
    "factor" INTEGER NOT NULL DEFAULT 1,
    "threshold" INTEGER NOT NULL DEFAULT 0,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Column_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Column" ("factor", "id", "lastUpdated", "name", "stackable", "threshold", "today", "type") SELECT "factor", "id", "lastUpdated", "name", "stackable", "threshold", "today", "type" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
