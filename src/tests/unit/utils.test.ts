import { describe, it, expect } from 'vitest';
import { calculateWinPercentage, calculateAverageGuesses, formatDuration } from '@/lib/utils';

describe('Utils', () => {
  describe('calculateWinPercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculateWinPercentage(7, 10)).toBe(70);
      expect(calculateWinPercentage(1, 2)).toBe(50);
    });

    it('should handle zero total games', () => {
      expect(calculateWinPercentage(0, 0)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculateWinPercentage(1, 3)).toBe(33);
    });
  });

  describe('calculateAverageGuesses', () => {
    it('should calculate correct average', () => {
      expect(calculateAverageGuesses(15, 5)).toBe(3);
      expect(calculateAverageGuesses(20, 4)).toBe(5);
    });

    it('should handle zero games won', () => {
      expect(calculateAverageGuesses(0, 0)).toBe(0);
    });

    it('should round to one decimal place', () => {
      expect(calculateAverageGuesses(17, 5)).toBe(3.4);
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(45)).toBe('0:45');
      expect(formatDuration(5)).toBe('0:05');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
      expect(formatDuration(300)).toBe('5:00');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0:00');
    });
  });
});
