-- Drop the enum columns and recreate as text
ALTER TABLE "Game" ALTER COLUMN "mode" TYPE TEXT USING "mode"::TEXT;
ALTER TABLE "Game" ALTER COLUMN "difficulty" TYPE TEXT USING "difficulty"::TEXT;
ALTER TABLE "Game" ALTER COLUMN "status" TYPE TEXT USING "status"::TEXT;
ALTER TABLE "Word" ALTER COLUMN "difficulty" TYPE TEXT USING "difficulty"::TEXT;
ALTER TABLE "Achievement" ALTER COLUMN "rarity" TYPE TEXT USING "rarity"::TEXT;

-- Drop the enum types
DROP TYPE IF EXISTS "GameMode" CASCADE;
DROP TYPE IF EXISTS "GameStatus" CASCADE;
DROP TYPE IF EXISTS "Difficulty" CASCADE;
DROP TYPE IF EXISTS "AchievementRarity" CASCADE;
DROP TYPE IF EXISTS "LeaderboardType" CASCADE;
