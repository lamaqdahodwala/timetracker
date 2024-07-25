-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Row" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "columnId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "Row_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Row" ("columnId", "date", "id", "value") SELECT "columnId", "date", "id", "value" FROM "Row";
DROP TABLE "Row";
ALTER TABLE "new_Row" RENAME TO "Row";
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
    CONSTRAINT "Column_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Column" ("factor", "id", "lastUpdated", "name", "stackable", "threshold", "today", "type", "userId") SELECT "factor", "id", "lastUpdated", "name", "stackable", "threshold", "today", "type", "userId" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
