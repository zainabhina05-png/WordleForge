import { z } from 'zod';

// Enhanced validation schemas with stricter security

export const gameGuessSchema = z.object({
  gameId: z
    .string()
    .min(1, 'Game ID is required')
    .max(50, 'Game ID too long')
    .regex(/^c[a-z0-9]{24}$/i, 'Invalid game ID format'),
  word: z
    .string()
    .min(4, 'Word must be at least 4 letters')
    .max(8, 'Word must be at most 8 letters')
    .regex(/^[A-Za-z]+$/, 'Word must contain only letters')
    .transform(val => val.toUpperCase().trim()),
});

export const createGameSchema = z.object({
  mode: z.enum(['CLASSIC', 'INFINITE', 'DAILY', 'HARD', 'ZEN', 'TIME_ATTACK', 'SPEED_RUN', 'PRACTICE', 'CUSTOM']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  customWord: z
    .string()
    .min(4)
    .max(8)
    .regex(/^[A-Za-z]+$/)
    .transform(val => val.toLowerCase().trim())
    .optional(),
  discardPrevious: z.boolean().optional().default(false),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform(val => val.trim().toLowerCase())
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters')
    .transform(val => val.trim())
    .optional(),
  theme: z.enum(['dark', 'light']).optional(),
});

export const settingsSchema = z.object({
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  hintsEnabled: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  colorBlindMode: z.boolean().optional(),
  highContrastMode: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  keyboardShortcuts: z.boolean().optional(),
  notifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  language: z
    .string()
    .max(10)
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code')
    .optional(),
});

export const reportSchema = z.object({
  type: z.enum(['user', 'game', 'content', 'bug', 'other']),
  targetId: z
    .string()
    .min(1, 'Target ID is required')
    .max(50, 'Target ID too long'),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(100, 'Reason too long')
    .transform(val => val.trim()),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .transform(val => val.trim())
    .optional(),
});

// New validation schemas for security

export const gameActionSchema = z.object({
  gameId: z
    .string()
    .min(1)
    .max(50)
    .regex(/^c[a-z0-9]{24}$/i, 'Invalid game ID format'),
});

export const webhookSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
  object: z.string(),
  timestamp: z.number().optional(),
});

export type GameGuessInput = z.infer<typeof gameGuessSchema>;
export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type GameActionInput = z.infer<typeof gameActionSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;