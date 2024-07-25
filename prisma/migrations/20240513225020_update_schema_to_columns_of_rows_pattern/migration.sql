/*
  Warnings:

  - You are about to drop the column `rowId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `statistic` on the `Column` table. All the data in the column will be lost.
  - Added the required column `columnId` to the `Row` table without a default value. This is not possible if the table is not empty.
  - Added the required column `today` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Row" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "columnId" INTEGER NOT NULL,
    CONSTRAINT "Row_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Row" ("date", "id") SELECT "date", "id" FROM "Row";
DROP TABLE "Row";
ALTER TABLE "new_Row" RENAME TO "Row";
CREATE TABLE "new_Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "today" INTEGER NOT NULL
);
INSERT INTO "new_Column" ("id") SELECT "id" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
