import { describe, it, expect } from 'vitest';
import {
  gameGuessSchema,
  createGameSchema,
  updateProfileSchema,
  gameActionSchema,
} from '@/lib/validations';

describe('Zod Validation Schemas', () => {
  describe('gameGuessSchema', () => {
    it('should accept valid guess', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
        word: 'HELLO',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid game ID format', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'invalid-id',
        word: 'HELLO',
      });
      expect(result.success).toBe(false);
    });

    it('should reject word shorter than 4 letters', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
        word: 'HEY',
      });
      expect(result.success).toBe(false);
    });

    it('should reject word longer than 8 letters', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
        word: 'ABCDEFGHI',
      });
      expect(result.success).toBe(false);
    });

    it('should reject word with non-letter characters', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
        word: 'HELLO123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject word with special characters', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
        word: 'HELLO!',
      });
      expect(result.success).toBe(false);
    });

    it('should normalize word to uppercase', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
        word: 'hello',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.word).toBe('HELLO');
      }
    });

    it('should reject missing game ID', () => {
      const result = gameGuessSchema.safeParse({
        word: 'HELLO',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing word', () => {
      const result = gameGuessSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createGameSchema', () => {
    it('should accept valid game creation', () => {
      const result = createGameSchema.safeParse({
        mode: 'CLASSIC',
        difficulty: 'MEDIUM',
      });
      expect(result.success).toBe(true);
    });

    it('should accept custom word', () => {
      const result = createGameSchema.safeParse({
        mode: 'CUSTOM',
        difficulty: 'EASY',
        customWord: 'hello',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customWord).toBe('hello');
      }
    });

    it('should reject invalid mode', () => {
      const result = createGameSchema.safeParse({
        mode: 'INVALID_MODE',
        difficulty: 'MEDIUM',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid difficulty', () => {
      const result = createGameSchema.safeParse({
        mode: 'CLASSIC',
        difficulty: 'IMPOSSIBLE',
      });
      expect(result.success).toBe(false);
    });

    it('should reject custom word with numbers', () => {
      const result = createGameSchema.safeParse({
        mode: 'CUSTOM',
        difficulty: 'EASY',
        customWord: 'hello123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject custom word too short', () => {
      const result = createGameSchema.safeParse({
        mode: 'CUSTOM',
        difficulty: 'EASY',
        customWord: 'hi',
      });
      expect(result.success).toBe(false);
    });

    it('should set discardPrevious default to false', () => {
      const result = createGameSchema.safeParse({
        mode: 'CLASSIC',
        difficulty: 'MEDIUM',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discardPrevious).toBe(false);
      }
    });
  });

  describe('updateProfileSchema', () => {
    it('should accept valid profile update', () => {
      const result = updateProfileSchema.safeParse({
        username: 'newusername',
        bio: 'I love Wordle!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject username shorter than 3 chars', () => {
      const result = updateProfileSchema.safeParse({
        username: 'ab',
      });
      expect(result.success).toBe(false);
    });

    it('should reject username longer than 20 chars', () => {
      const result = updateProfileSchema.safeParse({
        username: 'a'.repeat(21),
      });
      expect(result.success).toBe(false);
    });

    it('should reject username with invalid characters', () => {
      const result = updateProfileSchema.safeParse({
        username: 'invalid-username!',
      });
      expect(result.success).toBe(false);
    });

    it('should accept username with alphanumeric and underscore', () => {
      const result = updateProfileSchema.safeParse({
        username: 'user_123',
      });
      expect(result.success).toBe(true);
    });

    it('should normalize username to lowercase', () => {
      const result = updateProfileSchema.safeParse({
        username: 'UserName',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe('username');
      }
    });

    it('should reject bio longer than 500 chars', () => {
      const result = updateProfileSchema.safeParse({
        bio: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should accept empty optional fields', () => {
      const result = updateProfileSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('gameActionSchema', () => {
    it('should accept valid game action', () => {
      const result = gameActionSchema.safeParse({
        gameId: 'clh7y8s3r000008jp9z0z0z0z',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid game ID format', () => {
      const result = gameActionSchema.safeParse({
        gameId: 'not-a-cuid',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty game ID', () => {
      const result = gameActionSchema.safeParse({
        gameId: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject game ID longer than 50 chars', () => {
      const result = gameActionSchema.safeParse({
        gameId: 'c' + 'a'.repeat(50),
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing game ID', () => {
      const result = gameActionSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
