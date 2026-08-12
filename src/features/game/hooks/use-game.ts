'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitGuess, useHint, forfeitGame } from '@/server/actions/game-actions';
import { KeyState } from '@/types';

interface UseGameProps {
  gameId: string;
  wordLength: number;
  maxAttempts: number;
  initialGuesses?: Array<{ word: string; feedback: unknown }>;
}

export function useGame({ gameId, wordLength, maxAttempts, initialGuesses = [] }: UseGameProps) {
  void maxAttempts; // Used in calculateScore, but not directly in this function
  const [guesses, setGuesses] = useState<string[]>(
    initialGuesses.map((g) => g.word)
  );
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [revealedAnswer, setRevealedAnswer] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForfeiting, setIsForfeiting] = useState(false);
  const [keyStates, _setKeyStates] = useState<Map<string, KeyState>>(new Map());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isUsingHint, setIsUsingHint] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameStatus !== 'playing' || isSubmitting || isForfeiting) return;

      if (event.key === 'Enter') {
        handleSubmitGuess();
      } else if (event.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, gameStatus, isSubmitting, isForfeiting, wordLength]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing' || isSubmitting || isForfeiting) return;

      if (key === 'ENTER') {
        handleSubmitGuess();
      } else if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentGuess, gameStatus, isSubmitting, isForfeiting, wordLength]
  );

  const handleSubmitGuess = async () => {
    if (currentGuess.length !== wordLength) {
      toast({
        title: 'Invalid guess',
        description: `Word must be ${wordLength} letters long`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitGuess({
        gameId,
        word: currentGuess,
      });

      if ('error' in result) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      setGuesses((prev) => [...prev, currentGuess]);
      setCurrentGuess('');

      if (result.gameOver) {
        setGameStatus(result.won ? 'won' : 'lost');
        setRevealedAnswer(result.answer);
        
        if (result.won) {
          toast({
            title: 'Congratulations!',
            description: `You won! The word was ${result.answer}`,
          });
        } else {
          toast({
            title: 'Game Over',
            description: `The word was ${result.answer}`,
          });
        }
      }
    } catch (error) {
      // Intentionally unused - error is caught but not needed
      void error;
      toast({
        title: 'Error',
        description: 'Failed to submit guess',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseHint = async () => {
    if (hintsUsed >= 1 || isUsingHint) return;
    
    setIsUsingHint(true);

    try {
      // useHint is a server action, not a React hook - name is misleading but correct
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const result = await useHint(gameId);

      if ('error' in result) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      setHintsUsed(1);
      toast({
        title: 'Hint',
        description: result.hint,
        duration: 5000,
      });
    } catch (error) {
      // Intentionally unused - error is caught but not needed
      void error;
      toast({
        title: 'Error',
        description: 'Failed to get hint',
        variant: 'destructive',
      });
    } finally {
      setIsUsingHint(false);
    }
  };

  const handleForfeit = async () => {
    if (gameStatus !== 'playing' || isForfeiting) return;

    setIsForfeiting(true);

    try {
      const result = await forfeitGame(gameId);

      if ('error' in result) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      setGameStatus('lost');
      if (result.answer) {
        setRevealedAnswer(result.answer);
      }
      toast({
        title: 'Game Forfeited',
        description: `The word was ${result.answer}`,
        variant: 'destructive',
      });
    } catch (error) {
      // Intentionally unused - error is caught but not needed
      void error;
      toast({
        title: 'Error',
        description: 'Failed to forfeit game',
        variant: 'destructive',
      });
    } finally {
      setIsForfeiting(false);
    }
  };

  return {
    guesses,
    currentGuess,
    gameStatus,
    revealedAnswer,
    isSubmitting,
    isForfeiting,
    keyStates,
    hintsUsed,
    isUsingHint,
    handleKeyPress,
    handleUseHint,
    handleForfeit,
  };
}
