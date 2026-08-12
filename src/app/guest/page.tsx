'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KEYBOARD_LAYOUT } from '@/lib/constants';
import { evaluateGuess } from '@/lib/game-logic';
import { Button } from '@/components/ui/button';
import { Home, Save, Trash2, LogOut, Delete } from 'lucide-react';

const GUEST_WORDS = [
  'world', 'about', 'think', 'place', 'right',
  'great', 'small', 'after', 'every', 'where',
];

type TileStatus = 'empty' | 'current' | 'correct' | 'present' | 'absent';

interface Tile {
  letter: string;
  status: TileStatus;
}

export default function GuestGamePage() {
  const router = useRouter();
  const [targetWord, setTargetWord] = useState<string>('world');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyStates, setKeyStates] = useState<Map<string, TileStatus>>(new Map());
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [savedGameAvailable, setSavedGameAvailable] = useState<{ targetWord: string; guesses: string[]; keyStates?: [string, TileStatus][]; } | null>(null);

  const wordLength = targetWord.length;
  const maxAttempts = 6;

  useEffect(() => {
    setIsMounted(true);
    const played = localStorage.getItem('guestGamePlayed') === 'true';
    if (played) {
      setHasPlayed(true);
      return;
    }

    // Check for saved guest game
    const savedStr = localStorage.getItem('guestSavedGame');
    if (savedStr) {
      try {
        const saved = JSON.parse(savedStr);
        if (saved && saved.targetWord && saved.guesses) {
          setSavedGameAvailable(saved);
        }
      } catch (err) {
        // Intentionally unused - error is caught but not needed for JSON parsing
        void err;
        localStorage.removeItem('guestSavedGame');
      }
    } else {
      // Pick random word
      const word = GUEST_WORDS[Math.floor(Math.random() * GUEST_WORDS.length)] ?? 'world';
      setTargetWord(word);
    }
  }, []);

  const onResumeSavedGame = () => {
    if (savedGameAvailable) {
      setTargetWord(savedGameAvailable.targetWord);
      setGuesses(savedGameAvailable.guesses || []);
      if (savedGameAvailable.keyStates) {
        setKeyStates(new Map(savedGameAvailable.keyStates));
      }
      setSavedGameAvailable(null);
    }
  };

  const onDiscardSavedGame = () => {
    localStorage.removeItem('guestSavedGame');
    setSavedGameAvailable(null);
    const word = GUEST_WORDS[Math.floor(Math.random() * GUEST_WORDS.length)] ?? 'world';
    setTargetWord(word);
    setGuesses([]);
  };

  const showMessage = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      showMessage(`Word must be ${wordLength} letters`);
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 500);
      return;
    }

    const feedback = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    const newKeyStates = new Map(keyStates);
    feedback.forEach(({ letter, status }) => {
      const key = letter.toUpperCase();
      const current = newKeyStates.get(key);
      if (status === 'correct') newKeyStates.set(key, 'correct');
      else if (status === 'present' && current !== 'correct') newKeyStates.set(key, 'present');
      else if (!current || current === 'empty') newKeyStates.set(key, 'absent');
    });
    setKeyStates(newKeyStates);

    const won = currentGuess.toUpperCase() === targetWord.toUpperCase();
    if (won) {
      setGameStatus('won');
      showMessage('Solved. Sign up to save your score!', 4000);
      localStorage.setItem('guestGamePlayed', 'true');
      localStorage.removeItem('guestSavedGame');
    } else if (newGuesses.length >= maxAttempts) {
      setGameStatus('lost');
      showMessage(`The word was: ${targetWord.toUpperCase()}`, 5000);
      localStorage.setItem('guestGamePlayed', 'true');
      localStorage.removeItem('guestSavedGame');
    }
  }, [currentGuess, guesses, keyStates, targetWord, wordLength]);

  useEffect(() => {
    if (gameStatus !== 'playing' || hasPlayed || savedGameAvailable) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') submitGuess();
      else if (e.key === 'Backspace') setCurrentGuess(p => p.slice(0, -1));
      else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
        setCurrentGuess(p => p + e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentGuess, gameStatus, submitGuess, wordLength, hasPlayed, savedGameAvailable]);

  const handleVirtualKey = (key: string) => {
    if (gameStatus !== 'playing' || hasPlayed || savedGameAvailable) return;
    if (key === 'ENTER') submitGuess();
    else if (key === 'BACKSPACE') setCurrentGuess(p => p.slice(0, -1));
    else if (currentGuess.length < wordLength) setCurrentGuess(p => p + key);
  };

  const onSaveGuestProgress = () => {
    localStorage.setItem('guestSavedGame', JSON.stringify({
      targetWord,
      guesses,
      keyStates: Array.from(keyStates.entries()),
      savedAt: Date.now(),
    }));
    setShowExitModal(false);
    router.push('/');
  };

  const onDiscardGuestGame = () => {
    localStorage.removeItem('guestSavedGame');
    setShowExitModal(false);
    router.push('/');
  };

  // Structured tile states
  const getTileStyle = (status: TileStatus) => {
    const styles: Record<TileStatus, string> = {
      empty: 'border-2 border-vellum bg-transparent text-ink',
      current: 'border-2 border-ink bg-transparent text-ink',
      correct: 'border-0 bg-ink text-paper',
      present: 'border-0 bg-graphite text-paper',
      absent: 'border-0 bg-chalk text-graphite opacity-60',
    };
    return styles[status];
  };

  // Structured keyboard key states
  const getKeyStyle = (key: string) => {
    const state = keyStates.get(key);
    if (state === 'correct') return 'bg-ink text-paper hover:opacity-80';
    if (state === 'present') return 'bg-graphite text-paper hover:opacity-80';
    if (state === 'absent') return 'bg-chalk text-graphite opacity-50 hover:opacity-60 border border-vellum';
    return 'bg-bone text-ink hover:bg-chalk border border-vellum';
  };

  const buildGrid = () => {
    const rows: Tile[][] = [];
    for (let i = 0; i < maxAttempts; i++) {
      const row: Tile[] = [];
      if (i < guesses.length) {
        const guess = guesses[i] ?? '';
        const feedback = evaluateGuess(guess, targetWord);
        for (let j = 0; j < wordLength; j++) {
          row.push({ letter: guess[j] ?? '', status: (feedback[j]?.status ?? 'absent') as TileStatus });
        }
      } else if (i === guesses.length && gameStatus === 'playing') {
        for (let j = 0; j < wordLength; j++) {
          row.push({ letter: currentGuess[j] ?? '', status: j < currentGuess.length ? 'current' : 'empty' });
        }
      } else {
        for (let j = 0; j < wordLength; j++) {
          row.push({ letter: '', status: 'empty' });
        }
      }
      rows.push(row);
    }
    return rows;
  };

  // Loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-putty flex flex-col">
        <header className="border-b border-vellum bg-putty px-6 h-10 flex items-center justify-between">
          <div className="logo-mark">W</div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Already played
  if (hasPlayed) {
    return (
      <div className="min-h-screen bg-putty flex flex-col">
        <header className="border-b border-vellum bg-putty px-6 h-10 flex items-center justify-between">
          <div className="logo-mark">W</div>
          <Link href="/sign-in" className="link-ghost">Sign In</Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-bone border border-vellum p-8 rounded-cards text-center space-y-6"
          >
            {/* Monogram icon */}
            <div className="mx-auto logo-mark" style={{ width: '48px', height: '48px', fontSize: '22px' }}>W</div>

            <div className="space-y-2">
              <h2
                className="font-serif font-medium text-ink"
                style={{ fontSize: '26px', letterSpacing: '-0.13px' }}
              >
                Guest Game Used
              </h2>
              <p className="font-sans text-graphite" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                You&apos;ve completed your free guest game. Create an account to unlock unlimited games,
                track your statistics, and climb the leaderboard.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href="/sign-up" className="btn-pill text-center block">
                Create Free Account
              </Link>
              <Link
                href="/sign-in"
                className="rounded-buttons border border-vellum bg-chalk px-4 py-2.5 font-sans text-xs text-graphite hover:bg-bone hover:border-ink hover:text-ink transition-all text-center block"
              >
                Sign In
              </Link>
              <Link href="/" className="link-ghost text-center block mt-1">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const grid = buildGrid();

  return (
    <div className="min-h-screen bg-putty flex flex-col">
      {/* Resume Saved Game Modal */}
      <AnimatePresence>
        {savedGameAvailable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-md bg-bone border border-vellum p-8 rounded-cards text-center space-y-5"
            >
              <div className="mx-auto w-10 h-10 rounded-full border border-ink flex items-center justify-center text-ink">
                <Save className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="font-serif font-medium text-ink mb-2"
                  style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
                >
                  Unfinished Game
                </h3>
                <p className="font-sans text-graphite" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  You have a saved game in progress. Resume or start fresh?
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <Button onClick={onResumeSavedGame} className="flex-1">Resume</Button>
                <Button onClick={onDiscardSavedGame} variant="outline" className="flex-1">Start New</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-md bg-bone border border-vellum p-8 rounded-cards text-center space-y-5"
            >
              <div className="mx-auto w-10 h-10 rounded-full border border-ink flex items-center justify-center text-ink">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="font-serif font-medium text-ink mb-2"
                  style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
                >
                  Exit Game?
                </h3>
                <p className="font-sans text-graphite" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  Save your progress to resume later, or discard this game.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button onClick={onSaveGuestProgress} className="w-full flex items-center justify-center gap-2">
                  <Save className="h-3.5 w-3.5" /> Save Progress
                </Button>
                <Button onClick={onDiscardGuestGame} variant="outline" className="w-full flex items-center justify-center gap-2 border-ink hover:bg-chalk">
                  <Trash2 className="h-3.5 w-3.5" /> Discard Game
                </Button>
                <Button onClick={() => setShowExitModal(false)} variant="ghost" className="w-full text-graphite hover:text-ink">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-vellum bg-putty px-6 h-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (gameStatus === 'playing' && guesses.length > 0) {
                setShowExitModal(true);
              } else {
                router.push('/');
              }
            }}
            className="text-graphite hover:text-ink transition-colors"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </button>
          <Link href="/" className="font-serif font-medium text-ink" style={{ fontSize: '16px' }}>
            WordForge
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-graphite hidden sm:block" style={{ fontSize: '12px' }}>
            Guest — 1 free game
          </span>
          <Link href="/sign-up" className="btn-pill" style={{ padding: '6px 14px' }}>
            Sign Up
          </Link>
        </div>
      </header>

      {/* Vellum notice strip */}
      <div className="border-b border-vellum bg-chalk px-6 py-2 text-center">
        <p className="font-sans text-graphite" style={{ fontSize: '12px' }}>
          Playing as guest.{' '}
          <Link href="/sign-up" className="font-medium text-ink underline underline-offset-2">
            Sign up free
          </Link>{' '}
          to save progress and play unlimited.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-6 px-4 gap-5">
        {/* Toast message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-buttons bg-ink px-5 py-2.5 font-sans text-paper text-xs shadow-none"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game result */}
        {gameStatus !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-cards p-5 text-center border ${
              gameStatus === 'won' ? 'bg-chalk border-vellum' : 'bg-bone border-ink'
            }`}
          >
            <div className="font-serif text-2xl text-ink mb-2">{gameStatus === 'won' ? '◆' : '◇'}</div>
            <p
              className="font-serif font-medium text-ink mb-1"
              style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
            >
              {gameStatus === 'won' ? 'Solved.' : 'Game Over.'}
            </p>
            {gameStatus === 'lost' && (
              <p className="font-sans text-graphite text-sm mb-3">
                The word was{' '}
                <span className="font-medium text-ink uppercase tracking-widest" style={{ letterSpacing: '0.15em' }}>
                  {targetWord}
                </span>
              </p>
            )}
            <p className="font-sans text-graphite text-sm mb-4">
              Sign up to play unlimited games and save your stats.
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/sign-up" className="btn-pill" style={{ padding: '8px 16px' }}>
                Sign Up Free
              </Link>
              <Link
                href="/"
                className="rounded-buttons border border-vellum bg-chalk px-4 py-2 font-sans text-xs text-graphite hover:bg-bone transition-colors"
              >
                Home
              </Link>
            </div>
          </motion.div>
        )}

        {/* Tile grid */}
        <div className="flex flex-col gap-2">
          {grid.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex gap-2"
              animate={shakeRow === rowIndex ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {row.map((tile, colIndex) => (
                <motion.div
                  key={colIndex}
                  initial={rowIndex < guesses.length && guesses.length > 0 && rowIndex === guesses.length - 1 ? { rotateX: 90 } : false}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: colIndex * 0.1, duration: 0.3 }}
                  className={`flex h-14 w-14 items-center justify-center rounded-cards text-2xl font-bold uppercase font-sans ${getTileStyle(tile.status)}`}
                >
                  {tile.letter}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Virtual keyboard */}
        <div className="w-full max-w-lg">
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 mb-1.5">
              {row.map((key) => {
                const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
                return (
                  <button
                    key={key}
                    onClick={() => handleVirtualKey(key)}
                    className={`rounded-cards font-sans text-xs font-medium transition-all ${
                      isSpecial
                        ? 'px-3 h-12 bg-ink text-paper hover:opacity-80'
                        : `h-12 w-9 ${getKeyStyle(key)}`
                    }`}
                  >
                    {key === 'BACKSPACE' ? <Delete className="h-4 w-4 mx-auto" /> : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
