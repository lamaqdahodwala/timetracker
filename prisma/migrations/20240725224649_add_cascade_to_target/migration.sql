-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Target" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetValue" INTEGER NOT NULL,
    "setOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "length" TEXT NOT NULL,
    "columnId" INTEGER NOT NULL,
    CONSTRAINT "Target_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Target" ("columnId", "id", "length", "setOn", "targetValue") SELECT "columnId", "id", "length", "setOn", "targetValue" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
CREATE UNIQUE INDEX "Target_columnId_key" ON "Target"("columnId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
