'use server';

import { prisma } from '@/lib/db';
import { WordService } from '@/services/word-service';
import { evaluateGuess, calculateScore, getTimeLimitByDifficulty } from '@/lib/game-logic';
import { createGameSchema, gameGuessSchema, gameActionSchema } from '@/lib/validations';
import { 
  validateAuth, 
  validateRateLimit, 
  validateGameOwnership, 
  validateCSRF,
  SecurityError 
} from '@/lib/security';
import { revalidatePath } from 'next/cache';

export async function createGame(input: {
  mode: string;
  difficulty: string;
  customWord?: string;
  discardPrevious?: boolean;
}) {
  try {
    // Security validations
    await validateCSRF();
    const userId = await validateAuth();
    
    // Rate limiting
    const clientIP = (await import('next/headers')).headers().get('x-forwarded-for') || 'unknown';
    await validateRateLimit(`create_game_${userId}_${clientIP}`, 5); // 5 games per minute
    
    const validated = createGameSchema.parse(input);

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    // Discard any existing IN_PROGRESS games if requested
    if (validated.discardPrevious) {
      await prisma.game.updateMany({
        where: {
          userId: dbUser.id,
          status: 'IN_PROGRESS',
        },
        data: {
          status: 'DISCARDED',
        },
      });
    }

    let wordData;
    if (validated.mode === 'DAILY') {
      wordData = await WordService.getDailyWord(new Date());
    } else if (validated.customWord) {
      const existingWord = await prisma.word.findUnique({
        where: { word: validated.customWord },
        select: { id: true, word: true, difficulty: true },
      });
      if (!existingWord) {
        throw new SecurityError('Invalid word', 'INVALID_WORD');
      }
      wordData = existingWord;
    } else {
      wordData = await WordService.getRandomWord(dbUser.id, validated.difficulty);
    }

    if (!wordData) {
      throw new SecurityError('No words available', 'NO_WORDS');
    }

    // Determine max attempts based on difficulty selection
    let maxAttempts = 6;
    if (validated.difficulty === 'EASY') {
      maxAttempts = 8;
    } else if (validated.difficulty === 'HARD' || validated.difficulty === 'EXPERT') {
      maxAttempts = 5;
    }

    // Set time limit for TIME_ATTACK mode
    const timeLimit = validated.mode === 'TIME_ATTACK' 
      ? getTimeLimitByDifficulty(validated.difficulty)
      : null;

    const game = await prisma.game.create({
      data: {
        userId: dbUser.id,
        wordId: wordData.id,
        mode: validated.mode,
        difficulty: validated.difficulty,
        status: 'IN_PROGRESS',
        maxAttempts,
        timeLimit,
      },
      include: {
        word: {
          select: {
            id: true,
            length: true,
            difficulty: true,
          },
        },
      },
    });

    return {
      success: true,
      game: {
        id: game.id,
        wordLength: game.word.length,
        maxAttempts: game.maxAttempts,
        difficulty: game.difficulty,
        mode: game.mode,
        timeLimit: game.timeLimit,
      },
    };
  } catch (error) {
    if (error instanceof SecurityError) {
      return { error: error.message };
    }
    console.error('Create game error:', error);
    return { error: 'Failed to create game' };
  }
}

export async function submitGuess(input: { gameId: string; word: string }) {
  try {
    // Security validations
    await validateCSRF();
    const userId = await validateAuth();
    
    // Rate limiting - more generous for gameplay
    const clientIP = (await import('next/headers')).headers().get('x-forwarded-for') || 'unknown';
    await validateRateLimit(`submit_guess_${userId}_${clientIP}`, 30); // 30 guesses per minute

    const validated = gameGuessSchema.parse(input);

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    const game = await prisma.game.findUnique({
      where: { id: validated.gameId },
      include: {
        word: {
          select: { id: true, word: true, length: true },
        },
        guesses: {
          orderBy: { position: 'asc' },
          select: { word: true, feedback: true, position: true },
        },
      },
    });

    if (!game) {
      throw new SecurityError('Game not found', 'GAME_NOT_FOUND');
    }

    validateGameOwnership(game, dbUser.id);

    if (game.status !== 'IN_PROGRESS') {
      throw new SecurityError('Game already finished', 'GAME_FINISHED');
    }

    // Check time limit for TIME_ATTACK mode
    if (game.timeLimit) {
      const elapsedSeconds = Math.floor((Date.now() - game.startedAt.getTime()) / 1000);
      if (elapsedSeconds > game.timeLimit) {
        // Time's up - auto-lose
        const duration = Math.floor((Date.now() - game.startedAt.getTime()) / 1000);
        await prisma.game.update({
          where: { id: game.id },
          data: {
            status: 'LOST',
            won: false,
            completedAt: new Date(),
            duration,
            score: 0,
            timeRemaining: 0,
          },
        });
        await updateUserStatistics(dbUser.id, false, game.currentRow, duration);
        revalidatePath('/game');
        revalidatePath('/dashboard');
        return { error: 'Time is up! Game over.' };
      }
    }

    if (game.guesses.length >= game.maxAttempts) {
      throw new SecurityError('No attempts remaining', 'NO_ATTEMPTS');
    }

    if (validated.word.length !== game.word.length) {
      throw new SecurityError(
        `Word must be ${game.word.length} letters long`, 
        'INVALID_LENGTH'
      );
    }

    const isValid = await WordService.isValidWord(validated.word);
    if (!isValid) {
      return { error: 'Not in word list', isValid: false };
    }

    // Hard Mode Constraints Check
    if ((game.difficulty === 'HARD' || game.difficulty === 'EXPERT') && game.guesses.length > 0) {
      const lastGuess = game.guesses[game.guesses.length - 1];
      if (lastGuess) {
        const lastFeedback = JSON.parse(lastGuess.feedback as string) as Array<{
          letter: string;
          status: 'correct' | 'present' | 'absent';
          position: number;
        }>;

        // Validate hard mode constraints
        for (const item of lastFeedback) {
          if (item.status === 'correct' && item.letter) {
            const guessLetter = validated.word[item.position];
            if (!guessLetter || guessLetter !== item.letter) {
              throw new SecurityError(
                `Hard Mode: The ${item.position + 1} letter must be "${item.letter}"`,
                'HARD_MODE_VIOLATION'
              );
            }
          }
        }

        for (const item of lastFeedback) {
          if (item.status === 'present' && item.letter) {
            if (!validated.word.includes(item.letter)) {
              throw new SecurityError(
                `Hard Mode: Guess must contain "${item.letter}"`,
                'HARD_MODE_VIOLATION'
              );
            }
          }
        }
      }
    }

    const feedback = evaluateGuess(validated.word, game.word.word);
    const isCorrect = validated.word === game.word.word.toUpperCase();
    const position = game.guesses.length;

    await prisma.guess.create({
      data: {
        gameId: game.id,
        word: validated.word,
        feedback: JSON.stringify(feedback),
        position,
      },
    });

    const gameWon = isCorrect;
    const gameLost = !isCorrect && position + 1 >= game.maxAttempts;
    const gameOver = gameWon || gameLost;

    if (gameOver) {
      const duration = Math.floor((Date.now() - game.startedAt.getTime()) / 1000);
      const timeRemaining = game.timeLimit ? Math.max(0, game.timeLimit - duration) : null;
      const score = gameWon
        ? calculateScore(position + 1, game.maxAttempts, duration, game.hintsUsed)
        : 0;

      await prisma.game.update({
        where: { id: game.id },
        data: {
          status: gameWon ? 'WON' : 'LOST',
          won: gameWon,
          completedAt: new Date(),
          duration,
          score,
          timeRemaining,
        },
      });

      await updateUserStatistics(dbUser.id, gameWon, position + 1, duration);
      await WordService.incrementWordFrequency(game.word.id);
    } else {
      await prisma.game.update({
        where: { id: game.id },
        data: {
          currentRow: position + 1,
        },
      });
    }

    revalidatePath('/game');
    revalidatePath('/dashboard');

    return {
      success: true,
      feedback,
      isCorrect,
      gameOver,
      won: gameWon,
      answer: gameOver ? game.word.word : undefined,
    };
  } catch (error) {
    if (error instanceof SecurityError) {
      return { error: error.message };
    }
    console.error('Submit guess error:', error);
    return { error: 'Failed to submit guess' };
  }
}

export async function useHint(gameId: string) {
  try {
    await validateCSRF();
    const userId = await validateAuth();
    
    // Rate limiting for hints
    const clientIP = (await import('next/headers')).headers().get('x-forwarded-for') || 'unknown';
    await validateRateLimit(`use_hint_${userId}_${clientIP}`, 3); // 3 hints per minute

    const validated = gameActionSchema.parse({ gameId });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    const game = await prisma.game.findUnique({
      where: { id: validated.gameId },
      include: {
        word: {
          select: { word: true },
        },
        guesses: {
          orderBy: { position: 'asc' },
          select: { word: true },
        },
      },
    });

    if (!game) {
      throw new SecurityError('Game not found', 'GAME_NOT_FOUND');
    }

    validateGameOwnership(game, dbUser.id);

    if (game.status !== 'IN_PROGRESS') {
      throw new SecurityError('Game already finished', 'GAME_FINISHED');
    }

    if (game.hintsUsed >= 1) {
      throw new SecurityError('You have already used your hint for this game', 'HINT_USED');
    }

    // Update hints used count
    await prisma.game.update({
      where: { id: gameId },
      data: {
        hintsUsed: { increment: 1 },
      },
    });

    // Generate hint - either reveal a letter or its position
    const guessedWords = game.guesses.map(g => g.word);
    const targetWord = game.word.word.toUpperCase();
    const knownLetters = new Set<string>();
    const knownPositions = new Set<number>();

    // Analyze previous guesses
    guessedWords.forEach(guess => {
      const feedback = evaluateGuess(guess, targetWord);
      feedback.forEach(({ letter, status, position }) => {
        if (status === 'correct') {
          knownLetters.add(letter);
          knownPositions.add(position);
        } else if (status === 'present') {
          knownLetters.add(letter);
        }
      });
    });

    let hintText: string;

    // First try to reveal an unknown letter
    const unknownLetters = targetWord.split('').filter(letter => !knownLetters.has(letter));
    
    if (unknownLetters.length > 0) {
      const randomLetter = unknownLetters[Math.floor(Math.random() * unknownLetters.length)];
      hintText = `The word contains the letter "${randomLetter}"`;
    } else {
      // If all letters are known, reveal a position
      const unknownPositions = targetWord.split('').map((letter, index) => ({ letter, index }))
        .filter(({ index }) => !knownPositions.has(index));
      
      if (unknownPositions.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const randomPos = unknownPositions[Math.floor(Math.random() * unknownPositions.length)]!;
        hintText = `Position ${randomPos.index + 1} is "${randomPos.letter}"`;
      } else {
        hintText = 'You already know all the letters and positions!';
      }
    }

    revalidatePath('/game');

    return {
      success: true,
      hint: hintText,
      hintsRemaining: 0,
    };
  } catch (error) {
    if (error instanceof SecurityError) {
      return { error: error.message };
    }
    console.error('Use hint error:', error);
    return { error: 'Failed to generate hint' };
  }
}

export async function forfeitGame(gameId: string) {
  try {
    await validateCSRF();
    const userId = await validateAuth();
    
    const validated = gameActionSchema.parse({ gameId });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    const game = await prisma.game.findUnique({
      where: { id: validated.gameId },
      include: {
        word: {
          select: { word: true },
        },
      },
    });

    if (!game) {
      throw new SecurityError('Game not found', 'GAME_NOT_FOUND');
    }

    validateGameOwnership(game, dbUser.id);

    if (game.status !== 'IN_PROGRESS') {
      throw new SecurityError('Game already finished', 'GAME_FINISHED');
    }

    const duration = Math.floor((Date.now() - game.startedAt.getTime()) / 1000);

    await prisma.game.update({
      where: { id: game.id },
      data: {
        status: 'FORFEITED',
        won: false,
        completedAt: new Date(),
        duration,
        score: 0,
      },
    });

    await updateUserStatistics(dbUser.id, false, game.currentRow, duration);

    revalidatePath('/game');
    revalidatePath('/dashboard');

    return {
      success: true,
      answer: game.word.word,
    };
  } catch (error) {
    if (error instanceof SecurityError) {
      return { error: error.message };
    }
    console.error('Forfeit game error:', error);
    return { error: 'Failed to forfeit game' };
  }
}

export async function discardGame(gameId: string) {
  try {
    await validateCSRF();
    const userId = await validateAuth();
    
    const validated = gameActionSchema.parse({ gameId });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    const game = await prisma.game.findUnique({
      where: { id: validated.gameId },
      select: { id: true, userId: true, status: true },
    });

    if (!game) {
      throw new SecurityError('Game not found', 'GAME_NOT_FOUND');
    }

    validateGameOwnership(game, dbUser.id);

    if (game.status === 'IN_PROGRESS') {
      await prisma.game.update({
        where: { id: gameId },
        data: {
          status: 'DISCARDED',
        },
      });
    }

    revalidatePath('/game');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    if (error instanceof SecurityError) {
      return { error: error.message };
    }
    console.error('Discard game error:', error);
    return { error: 'Failed to discard game' };
  }
}

export async function getActiveGame() {
  try {
    const userId = await validateAuth();

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    const game = await prisma.game.findFirst({
      where: {
        userId: dbUser.id,
        status: 'IN_PROGRESS',
      },
      include: {
        guesses: {
          orderBy: { position: 'asc' },
          select: { word: true, feedback: true },
        },
        word: {
          select: { id: true, length: true },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    if (!game) {
      return { game: null };
    }

    return {
      game: {
        id: game.id,
        wordLength: game.word.length,
        maxAttempts: game.maxAttempts,
        currentRow: game.currentRow,
        guesses: game.guesses.map((g) => ({
          word: g.word,
          feedback: JSON.parse(g.feedback as string),
        })),
        mode: game.mode,
        difficulty: game.difficulty,
        hintsUsed: game.hintsUsed,
        timeLimit: game.timeLimit,
        startedAt: game.startedAt.toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof SecurityError) {
      return { error: error.message };
    }
    console.error('Get active game error:', error);
    return { error: 'Failed to get active game' };
  }
}

// Private helper function
async function updateUserStatistics(
  userId: string,
  won: boolean,
  guessCount: number,
  duration: number
) {
  const stats = await prisma.statistics.upsert({
    where: { userId },
    create: {
      userId,
      gamesPlayed: 1,
      gamesWon: won ? 1 : 0,
      gamesLost: won ? 0 : 1,
      currentStreak: won ? 1 : 0,
      maxStreak: won ? 1 : 0,
      totalGuesses: guessCount,
      averageGuesses: guessCount,
      fastestWinSeconds: won ? duration : null,
      totalPlayTimeSeconds: duration,
      perfectGames: won && guessCount === 1 ? 1 : 0,
    },
    update: {
      gamesPlayed: { increment: 1 },
      gamesWon: won ? { increment: 1 } : undefined,
      gamesLost: won ? undefined : { increment: 1 },
      currentStreak: won ? { increment: 1 } : 0,
      totalGuesses: { increment: guessCount },
      totalPlayTimeSeconds: { increment: duration },
      perfectGames: won && guessCount === 1 ? { increment: 1 } : undefined,
      lastPlayedAt: new Date(),
    },
  });

  if (won && (!stats.fastestWinSeconds || duration < stats.fastestWinSeconds)) {
    await prisma.statistics.update({
      where: { userId },
      data: { fastestWinSeconds: duration },
    });
  }

  if (won && stats.currentStreak > stats.maxStreak) {
    await prisma.statistics.update({
      where: { userId },
      data: { maxStreak: stats.currentStreak },
    });
  }

  const updatedStats = await prisma.statistics.findUnique({
    where: { userId },
  });

  if (updatedStats) {
    const winPercentage = (updatedStats.gamesWon / updatedStats.gamesPlayed) * 100;
    const averageGuesses = updatedStats.gamesWon > 0
      ? updatedStats.totalGuesses / updatedStats.gamesWon
      : 0;

    await prisma.statistics.update({
      where: { userId },
      data: {
        winPercentage,
        averageGuesses,
      },
    });
  }

  await prisma.profile.update({
    where: { userId },
    data: {
      totalGames: { increment: 1 },
      totalWins: won ? { increment: 1 } : undefined,
      totalLosses: won ? undefined : { increment: 1 },
      currentStreak: won ? { increment: 1 } : 0,
    },
  });
}