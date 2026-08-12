-- Add missing DailyWord table
CREATE TABLE IF NOT EXISTS "DailyWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id")
);

CREATE INDEX IF NOT EXISTS "DailyWord_date_idx" ON "DailyWord"("date");
CREATE INDEX IF NOT EXISTS "DailyWord_wordId_idx" ON "DailyWord"("wordId");
