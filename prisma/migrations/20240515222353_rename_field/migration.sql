/*
  Warnings:

  - You are about to drop the column `date` on the `Column` table. All the data in the column will be lost.
  - Added the required column `lastUpdated` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "today" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL
);
INSERT INTO "new_Column" ("id", "name", "today") SELECT "id", "name", "today" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
