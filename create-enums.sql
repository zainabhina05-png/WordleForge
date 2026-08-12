-- Create Enum Types for WordForge
-- Run this in Neon SQL Editor

-- Create enum types
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');
CREATE TYPE "GameMode" AS ENUM ('CLASSIC', 'INFINITE', 'DAILY', 'HARD', 'ZEN', 'TIME_ATTACK', 'SPEED_RUN', 'PRACTICE', 'CUSTOM');
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRESS', 'WON', 'LOST', 'ABANDONED');
CREATE TYPE "AchievementRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- Update the Word table to use the enum
ALTER TABLE "Word" ALTER COLUMN "difficulty" TYPE "Difficulty" USING "difficulty"::"Difficulty";

-- Update the Game table to use the enums
ALTER TABLE "Game" ALTER COLUMN "mode" TYPE "GameMode" USING "mode"::"GameMode";
ALTER TABLE "Game" ALTER COLUMN "difficulty" TYPE "Difficulty" USING "difficulty"::"Difficulty";
ALTER TABLE "Game" ALTER COLUMN "status" TYPE "GameStatus" USING "status"::"GameStatus";

-- Update the Achievement table to use the enum
ALTER TABLE "Achievement" ALTER COLUMN "rarity" TYPE "AchievementRarity" USING "rarity"::"AchievementRarity";
