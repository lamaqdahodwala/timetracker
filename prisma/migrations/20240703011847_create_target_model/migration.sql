-- CreateTable
CREATE TABLE "Target" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetValue" INTEGER NOT NULL,
    "setOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "length" TEXT NOT NULL,
    "columnId" INTEGER NOT NULL,
    CONSTRAINT "Target_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Target_columnId_key" ON "Target"("columnId");
