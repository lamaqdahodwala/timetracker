/*
  Warnings:

  - You are about to alter the column `date` on the `Row` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Row" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "columnId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "Row_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Row" ("columnId", "date", "id", "value") SELECT "columnId", "date", "id", "value" FROM "Row";
DROP TABLE "Row";
ALTER TABLE "new_Row" RENAME TO "Row";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
