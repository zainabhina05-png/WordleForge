import { LetterFeedback } from '@/types';

export function evaluateGuess(guess: string, answer: string): LetterFeedback[] {
  const guessArray = guess.toUpperCase().split('');
  const answerArray = answer.toUpperCase().split('');
  const result: LetterFeedback[] = [];
  const answerLetterCount = new Map<string, number>();

  answerArray.forEach((letter) => {
    answerLetterCount.set(letter, (answerLetterCount.get(letter) || 0) + 1);
  });

  guessArray.forEach((letter, _index) => {
    if (letter === answerArray[_index]) {
      result.push({
        letter,
        status: 'correct',
        position: _index,
      });
      answerLetterCount.set(letter, (answerLetterCount.get(letter) || 0) - 1);
    } else {
      result.push({
        letter,
        status: 'absent',
        position: _index,
      });
    }
  });

  result.forEach((item, _index) => {
    if (item.status === 'absent') {
      const count = answerLetterCount.get(item.letter) || 0;
      if (count > 0) {
        item.status = 'present';
        answerLetterCount.set(item.letter, count - 1);
      }
    }
  });

  return result;
}

export function isValidWord(word: string, minLength: number, maxLength: number): boolean {
  const length = word.length;
  const isAlpha = /^[A-Za-z]+$/.test(word);
  return isAlpha && length >= minLength && length <= maxLength;
}

export function calculateScore(
  guessCount: number,
  maxAttempts: number,
  duration: number,
  hintsUsed: number
): number {
  const baseScore = 100;
  const attemptBonus = (maxAttempts - guessCount) * 20;
  const speedBonus = Math.max(0, 300 - duration) / 10;
  const hintPenalty = hintsUsed * 15;
  
  return Math.max(0, Math.round(baseScore + attemptBonus + speedBonus - hintPenalty));
}

export function getKeyboardState(
  guesses: string[],
  answer: string
): Map<string, 'correct' | 'present' | 'absent' | 'unused'> {
  const keyState = new Map<string, 'correct' | 'present' | 'absent' | 'unused'>();

  guesses.forEach((guess) => {
    const feedback = evaluateGuess(guess, answer);
    feedback.forEach(({ letter, status }) => {
      const currentState = keyState.get(letter.toUpperCase());
      
      if (status === 'correct') {
        keyState.set(letter.toUpperCase(), 'correct');
      } else if (status === 'present' && currentState !== 'correct') {
        keyState.set(letter.toUpperCase(), 'present');
      } else if (status === 'absent' && !currentState) {
        keyState.set(letter.toUpperCase(), 'absent');
      }
    });
  });

  return keyState;
}

export function generateHint(answer: string, guesses: string[]): string {
  const knownLetters = new Set<string>();
  
  guesses.forEach((guess) => {
    const feedback = evaluateGuess(guess, answer);
    feedback.forEach(({ letter, status }) => {
      if (status === 'correct' || status === 'present') {
        knownLetters.add(letter.toUpperCase());
      }
    });
  });

  for (const letter of answer.toUpperCase().split('')) {
    if (!knownLetters.has(letter)) {
      return `The word contains the letter "${letter}"`;
    }
  }

  return 'Try focusing on letter positions';
}

export function getTimeLimitByDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'EASY':
      return 300; // 5 minutes
    case 'MEDIUM':
      return 180; // 3 minutes
    case 'HARD':
    case 'EXPERT':
      return 90; // 1.5 minutes
    default:
      return 300; // Default to 5 minutes
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
