export type TileState = 'empty' | 'correct' | 'present' | 'absent' | 'current';

export type KeyState = 'unused' | 'correct' | 'present' | 'absent';

export interface TileFeedback {
  letter: string;
  state: TileState;
}

export interface GameState {
  id: string;
  word: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  maxAttempts: number;
}

export interface LetterFeedback {
  letter: string;
  status: 'correct' | 'present' | 'absent';
  position: number;
}

export interface GuessResult {
  isValid: boolean;
  isCorrect: boolean;
  feedback: LetterFeedback[];
  message?: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  winPercentage: number;
  averageGuesses: number;
  guessDistribution: Record<number, number>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  imageUrl: string | null;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  xpReward: number;
  coinReward: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlocked: boolean;
  progress: number;
}
