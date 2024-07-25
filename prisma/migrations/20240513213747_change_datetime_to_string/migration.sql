-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Row" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL
);
INSERT INTO "new_Row" ("date", "id") SELECT "date", "id" FROM "Row";
DROP TABLE "Row";
ALTER TABLE "new_Row" RENAME TO "Row";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
