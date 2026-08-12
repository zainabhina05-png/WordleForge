import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateWinPercentage(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function calculateAverageGuesses(totalGuesses: number, gamesWon: number): number {
  if (gamesWon === 0) return 0;
  return Math.round((totalGuesses / gamesWon) * 10) / 10;
}

export function generateShareText(
  guesses: number,
  maxAttempts: number,
  won: boolean,
  difficulty: string
): string {
  const emoji = won ? '🎯' : '❌';
  return `WordForge ${emoji} ${guesses}/${maxAttempts} (${difficulty})`;
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}
