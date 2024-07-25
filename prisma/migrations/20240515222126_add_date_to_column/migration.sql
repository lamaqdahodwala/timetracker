-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "today" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Column" ("id", "name", "today") SELECT "id", "name", "today" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
