-- WordForge Database Setup SQL
-- Run this in Neon SQL Editor

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkId" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "username" TEXT UNIQUE,
    "imageUrl" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3)
);

-- Create Profile table
CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "bio" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "totalWins" INTEGER NOT NULL DEFAULT 0,
    "totalLosses" INTEGER NOT NULL DEFAULT 0,
    "averageGuesses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fastestSolve" INTEGER,
    "favoriteDifficulty" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Word table
CREATE TABLE IF NOT EXISTS "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL UNIQUE,
    "length" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "definition" TEXT,
    "pronunciation" TEXT,
    "partOfSpeech" TEXT,
    "examples" TEXT[],
    "synonyms" TEXT[],
    "origin" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Game table
CREATE TABLE IF NOT EXISTS "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'CLASSIC',
    "difficulty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentRow" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 6,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "won" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Game_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id")
);

-- Create Guess table
CREATE TABLE IF NOT EXISTS "Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "feedback" JSONB NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Guess_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE
);

-- Create Statistics table
CREATE TABLE IF NOT EXISTS "Statistics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "gamesLost" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "totalGuesses" INTEGER NOT NULL DEFAULT 0,
    "averageGuesses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fastestWinSeconds" INTEGER,
    "totalPlayTimeSeconds" INTEGER NOT NULL DEFAULT 0,
    "perfectGames" INTEGER NOT NULL DEFAULT 0,
    "guessDistribution" JSONB NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}',
    "winPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPlayedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Achievement table
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requirement" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "coinReward" INTEGER NOT NULL DEFAULT 0,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create UserAchievement table
CREATE TABLE IF NOT EXISTS "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserAchievement_userId_achievementId_key" UNIQUE ("userId", "achievementId"),
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id")
);

-- Create UserSettings table
CREATE TABLE IF NOT EXISTS "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "musicEnabled" BOOLEAN NOT NULL DEFAULT false,
    "hintsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "darkMode" BOOLEAN NOT NULL DEFAULT true,
    "colorBlindMode" BOOLEAN NOT NULL DEFAULT false,
    "highContrastMode" BOOLEAN NOT NULL DEFAULT false,
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "keyboardShortcuts" BOOLEAN NOT NULL DEFAULT true,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "User_clerkId_idx" ON "User"("clerkId");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_username_idx" ON "User"("username");
CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");
CREATE INDEX IF NOT EXISTS "Word_word_idx" ON "Word"("word");
CREATE INDEX IF NOT EXISTS "Word_difficulty_idx" ON "Word"("difficulty");
CREATE INDEX IF NOT EXISTS "Word_length_idx" ON "Word"("length");
CREATE INDEX IF NOT EXISTS "Game_userId_idx" ON "Game"("userId");
CREATE INDEX IF NOT EXISTS "Game_wordId_idx" ON "Game"("wordId");
CREATE INDEX IF NOT EXISTS "Game_status_idx" ON "Game"("status");
CREATE INDEX IF NOT EXISTS "Game_mode_idx" ON "Game"("mode");
CREATE INDEX IF NOT EXISTS "Guess_gameId_idx" ON "Guess"("gameId");
CREATE INDEX IF NOT EXISTS "Statistics_userId_idx" ON "Statistics"("userId");
CREATE INDEX IF NOT EXISTS "Achievement_category_idx" ON "Achievement"("category");
CREATE INDEX IF NOT EXISTS "Achievement_rarity_idx" ON "Achievement"("rarity");
CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");
CREATE INDEX IF NOT EXISTS "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");
CREATE INDEX IF NOT EXISTS "UserSettings_userId_idx" ON "UserSettings"("userId");
