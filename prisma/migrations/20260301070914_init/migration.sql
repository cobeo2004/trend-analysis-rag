-- CreateTable
CREATE TABLE "TrendEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "query" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProcessingStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "TrendEntry_location_year_category_idx" ON "TrendEntry"("location", "year", "category");

-- CreateIndex
CREATE INDEX "TrendEntry_query_idx" ON "TrendEntry"("query");
