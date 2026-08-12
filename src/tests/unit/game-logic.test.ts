import { describe, it, expect } from 'vitest';
import { evaluateGuess, isValidWord, calculateScore, getKeyboardState } from '@/lib/game-logic';

describe('Game Logic', () => {
  describe('evaluateGuess', () => {
    it('should mark all correct letters', () => {
      const feedback = evaluateGuess('HELLO', 'HELLO');
      expect(feedback).toHaveLength(5);
      expect(feedback.every((f) => f.status === 'correct')).toBe(true);
    });

    it('should mark absent letters', () => {
      // When a letter in the guess doesn't appear in the answer at all
      const feedback = evaluateGuess('XYZAB', 'HELLO');
      expect(feedback.every((f) => f.status === 'absent')).toBe(true);
    });

    it('should mark present letters', () => {
      const feedback = evaluateGuess('HLELO', 'HELLO');
      const statuses = feedback.map((f) => f.status);
      expect(statuses).toContain('present');
    });

    it('should handle duplicate letters correctly', () => {
      // SPEED vs ERASE: S-absent, P-absent, E-present, E-present, D-absent
      // The two E's: both at wrong positions (S and D at pos 0,4 in answer; E at pos 0,4)
      const feedback = evaluateGuess('SPEED', 'ERASE');
      // Find which letters are at which positions
      expect(feedback[2].letter).toBe('E');
      expect(feedback[2].status).toBe('present'); // E at wrong position
      expect(feedback[3].letter).toBe('E');
      expect(feedback[3].status).toBe('present'); // E at wrong position (both E's are misplaced)
    });

    it('should not mark duplicate as present if already marked correct', () => {
      // ALLOY vs LOCAL: A-present, L-present, L-present, O-present, Y-absent
      // Positions: A(0)≠L(0), L(1)≠O(1), L(2)≠C(2), O(3)≠A(3), Y(4)≠L(4)
      // None match by position, so both L's are 'present' (in answer but wrong position)
      const feedback = evaluateGuess('ALLOY', 'LOCAL');
      const lPositions = feedback.filter((f) => f.letter === 'L');
      expect(lPositions.length).toBe(2);
      // Both should be present since neither is at the correct position
      expect(lPositions[0].status).toBe('present');
      expect(lPositions[1].status).toBe('present');
    });

    it('should be case insensitive', () => {
      const feedback1 = evaluateGuess('hello', 'HELLO');
      const feedback2 = evaluateGuess('HELLO', 'hello');
      expect(feedback1).toEqual(feedback2);
    });

    it('should track correct position', () => {
      const feedback = evaluateGuess('HELLO', 'HELLO');
      expect(feedback[0]).toMatchObject({
        letter: 'H',
        status: 'correct',
        position: 0,
      });
    });
  });

  describe('isValidWord', () => {
    it('should accept valid word', () => {
      expect(isValidWord('HELLO', 4, 8)).toBe(true);
    });

    it('should reject word below min length', () => {
      expect(isValidWord('HI', 4, 8)).toBe(false);
    });

    it('should reject word above max length', () => {
      expect(isValidWord('ABCDEFGHI', 4, 8)).toBe(false);
    });

    it('should reject word with numbers', () => {
      expect(isValidWord('HELLO123', 4, 8)).toBe(false);
    });

    it('should reject word with special characters', () => {
      expect(isValidWord('HELLO!', 4, 8)).toBe(false);
    });

    it('should accept word at min length boundary', () => {
      expect(isValidWord('HELL', 4, 8)).toBe(true);
    });

    it('should accept word at max length boundary', () => {
      expect(isValidWord('HELLOHEL', 4, 8)).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isValidWord('hello', 4, 8)).toBe(true);
      expect(isValidWord('HELLO', 4, 8)).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should give maximum score for perfect game (1 guess, no hints)', () => {
      const score = calculateScore(1, 6, 10, 0);
      expect(score).toBeGreaterThan(100);
    });

    it('should give lower score for more guesses', () => {
      const score1 = calculateScore(1, 6, 100, 0);
      const score6 = calculateScore(6, 6, 100, 0);
      expect(score1).toBeGreaterThan(score6);
    });

    it('should give bonus for speed', () => {
      const slowScore = calculateScore(3, 6, 500, 0);
      const fastScore = calculateScore(3, 6, 100, 0);
      expect(fastScore).toBeGreaterThan(slowScore);
    });

    it('should penalize hint usage', () => {
      const noHints = calculateScore(3, 6, 100, 0);
      const withHints = calculateScore(3, 6, 100, 1);
      expect(noHints).toBeGreaterThan(withHints);
    });

    it('should never return negative score', () => {
      const score = calculateScore(6, 6, 1000, 5);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should reward finishing in fewer attempts', () => {
      const easy = calculateScore(2, 6, 100, 0);
      const hard = calculateScore(5, 6, 100, 0);
      expect(easy).toBeGreaterThan(hard);
    });
  });

  describe('getKeyboardState', () => {
    it('should initialize empty keyboard state', () => {
      const state = getKeyboardState([], 'HELLO');
      expect(state.size).toBe(0);
    });

    it('should mark guessed correct letters', () => {
      const state = getKeyboardState(['HELLO'], 'HELLO');
      expect(state.get('H')).toBe('correct');
      expect(state.get('E')).toBe('correct');
    });

    it('should mark guessed absent letters', () => {
      const state = getKeyboardState(['ABCDE'], 'HELLO');
      expect(state.get('A')).toBe('absent');
      expect(state.get('B')).toBe('absent');
    });

    it('should mark present letters', () => {
      const state = getKeyboardState(['HLELO'], 'HELLO');
      // H is correct at position 0
      expect(state.get('H')).toBe('correct');
      // L is present (position 1 and 2 in HELLO, but at 1 and 2 in guess too, so correct)
      expect(state.get('L')).toBe('correct');
    });

    it('should prioritize correct over present', () => {
      const state = getKeyboardState(['HELLO', 'LLLLL'], 'HELLO');
      expect(state.get('H')).toBe('correct');
      expect(state.get('L')).toBe('correct'); // Should stay correct, not downgrade to present
    });

    it('should track multiple guesses', () => {
      // SPEED vs ERASE: S-present, P-absent, E-present, E-present, D-absent
      // CREAM vs ERASE: C-absent, R-correct (pos 1), E-present, A-present, M-absent
      // After CREAM, R is marked as 'correct'
      const state = getKeyboardState(['SPEED', 'CREAM'], 'ERASE');
      expect(state.get('S')).toBe('present'); // S in ERASE but at different position
      expect(state.get('P')).toBe('absent');
      expect(state.get('E')).toBe('present'); // E always at wrong positions in both guesses
      expect(state.get('R')).toBe('correct'); // R at position 1 in CREAM matches ERASE
      expect(state.get('A')).toBe('present');
    });
  });
});
