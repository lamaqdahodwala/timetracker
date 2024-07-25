/*
  Warnings:

  - Added the required column `value` to the `Row` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Row" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "columnId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "Row_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Row" ("columnId", "date", "id") SELECT "columnId", "date", "id" FROM "Row";
DROP TABLE "Row";
ALTER TABLE "new_Row" RENAME TO "Row";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
