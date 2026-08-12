-- AddColumn timeLimit and timeRemaining to Game model
ALTER TABLE "Game" ADD COLUMN "timeLimit" INTEGER;
ALTER TABLE "Game" ADD COLUMN "timeRemaining" INTEGER;
