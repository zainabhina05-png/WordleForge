import { prisma } from './db';

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 15000,
  errorMessage = 'Database operation timed out'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

export async function findUserSafely(clerkId: string) {
  try {
    return await withTimeout(
      prisma.user.findUnique({
        where: { clerkId },
        select: {
          id: true,
          firstName: true,
          profile: {
            select: {
              totalGames: true,
              totalWins: true,
              currentStreak: true,
            }
          },
          statistics: {
            select: {
              gamesPlayed: true,
              gamesWon: true,
              gamesLost: true,
              winPercentage: true,
              currentStreak: true,
              maxStreak: true,
              averageGuesses: true,
            }
          },
        },
      }),
      15000,
      'Failed to connect to database'
    );
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}