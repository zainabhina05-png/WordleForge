export const GAME_CONFIG = {
  MAX_ATTEMPTS: 6,
  MIN_WORD_LENGTH: 4,
  MAX_WORD_LENGTH: 8,
  HINT_COST: 10,
  WIN_BASE_SCORE: 100,
  PERFECT_GAME_BONUS: 50,
  SPEED_BONUS_MULTIPLIER: 2,
} as const;

export const XP_REWARDS = {
  GAME_WIN: 50,
  GAME_LOSS: 10,
  PERFECT_GAME: 100,
  DAILY_CHALLENGE: 75,
  STREAK_MILESTONE_5: 150,
  STREAK_MILESTONE_10: 300,
  STREAK_MILESTONE_25: 500,
  ACHIEVEMENT_UNLOCK: 100,
} as const;

export const COIN_REWARDS = {
  GAME_WIN: 5,
  GAME_LOSS: 1,
  PERFECT_GAME: 15,
  DAILY_LOGIN: 10,
  WEEKLY_MILESTONE: 50,
} as const;

export const DIFFICULTY_SETTINGS = {
  EASY: { minLength: 4, maxLength: 5, wordPool: 'common' },
  MEDIUM: { minLength: 5, maxLength: 6, wordPool: 'moderate' },
  HARD: { minLength: 6, maxLength: 7, wordPool: 'advanced' },
  EXPERT: { minLength: 7, maxLength: 8, wordPool: 'expert' },
} as const;

export const RATE_LIMITS = {
  GAMES_PER_MINUTE: 10,
  API_CALLS_PER_MINUTE: 60,
} as const;

export const TILE_STATES = {
  EMPTY: 'empty',
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent',
} as const;

export const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
] as const;
