import { prisma } from '@/lib/db';
import { VALID_GUESSES } from '@/lib/dictionary/valid-guesses';

export class WordService {
  private static recentWords = new Map<string, Set<string>>();
  private static HISTORY_LIMIT = 50;

  static async getRandomWord(
    userId: string,
    difficulty: string,
    wordLength?: number
  ): Promise<{ id: string; word: string; difficulty: string } | null> {
    const userHistory = this.recentWords.get(userId) || new Set();

    const where: {
      difficulty: string;
      length?: number;
      word?: { notIn: string[] };
    } = {
      difficulty,
    };

    if (wordLength) {
      where.length = wordLength;
    }

    if (userHistory.size > 0) {
      where.word = { notIn: Array.from(userHistory) };
    }

    const count = await prisma.word.count({ where });

    if (count === 0) {
      this.recentWords.delete(userId);
      return this.getRandomWord(userId, difficulty, wordLength);
    }

    const skip = Math.floor(Math.random() * count);
    const word = await prisma.word.findFirst({
      where,
      skip,
      select: {
        id: true,
        word: true,
        difficulty: true,
      },
    });

    if (word) {
      userHistory.add(word.word);
      if (userHistory.size > this.HISTORY_LIMIT) {
        const firstItem = userHistory.values().next().value;
        if (firstItem) userHistory.delete(firstItem);
      }
      this.recentWords.set(userId, userHistory);
    }

    return word;
  }

  static async getDailyWord(date: Date): Promise<{
    id: string;
    word: string;
    difficulty: string;
  } | null> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // Canonical UTC midnight

    const dailyWord = await prisma.dailyWord.findUnique({
      where: { date: startOfDay },
      include: {
        word: {
          select: {
            id: true,
            word: true,
            difficulty: true,
          },
        },
      },
    });

    if (dailyWord?.word) {
      return dailyWord.word;
    }

    // Fallback: Pick a word deterministically from the Word table
    const difficulty = 'MEDIUM';
    const count = await prisma.word.count({ where: { difficulty } });
    if (count === 0) return null;

    const dayNumber = Math.floor(startOfDay.getTime() / (24 * 60 * 60 * 1000));
    const skip = dayNumber % count;

    return prisma.word.findFirst({
      where: { difficulty },
      skip,
      select: {
        id: true,
        word: true,
        difficulty: true,
      },
    });
  }

  static async isValidWord(word: string): Promise<boolean> {
    return VALID_GUESSES.has(word.toLowerCase());
  }

  static async getWordDetails(wordId: string) {
    return prisma.word.findUnique({
      where: { id: wordId },
      select: {
        word: true,
        definition: true,
        pronunciation: true,
        partOfSpeech: true,
        examples: true,
        synonyms: true,
        origin: true,
      },
    });
  }

  static async incrementWordFrequency(wordId: string): Promise<void> {
    await prisma.word.update({
      where: { id: wordId },
      data: {
        frequency: {
          increment: 1,
        },
      },
    });
  }
}
