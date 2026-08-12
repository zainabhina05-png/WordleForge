import { prisma } from './db';

export async function checkAndUnlockAchievements(userId: string): Promise<void> {
  const statistics = await prisma.statistics.findUnique({
    where: { userId },
  });

  if (!statistics) return;

  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue;

    let shouldUnlock = false;

    switch (achievement.name) {
      case 'first_win':
        shouldUnlock = statistics.gamesWon >= 1;
        break;
      case 'win_streak_5':
        shouldUnlock = statistics.maxStreak >= 5;
        break;
      case 'perfect_game':
        shouldUnlock = statistics.perfectGames >= 1;
        break;
      case 'games_played_100':
        shouldUnlock = statistics.gamesPlayed >= 100;
        break;
    }

    if (shouldUnlock) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      await prisma.profile.update({
        where: { userId },
        data: {
          xp: { increment: achievement.xpReward },
          coins: { increment: achievement.coinReward },
        },
      });
    }
  }
}
