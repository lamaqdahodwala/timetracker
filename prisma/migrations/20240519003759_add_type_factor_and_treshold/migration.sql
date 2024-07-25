-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "today" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'additive',
    "factor" INTEGER NOT NULL DEFAULT 1,
    "threshold" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Column" ("id", "lastUpdated", "name", "today") SELECT "id", "lastUpdated", "name", "today" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
