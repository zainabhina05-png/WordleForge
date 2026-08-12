'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GameBoard } from './game-board';
import { Keyboard } from './keyboard';
import { GameTimer } from './game-timer';
import { useGame } from '../hooks/use-game';
import { Button } from '@/components/ui/button';
import { discardGame } from '@/server/actions/game-actions';
import { HelpCircle, Flag, RotateCcw, Home, AlertTriangle, LogOut, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameClientProps {
  game: {
    id: string;
    wordLength: number;
    maxAttempts: number;
    currentRow: number;
    guesses: Array<{ word: string; feedback: unknown }>;
    mode: string;
    difficulty: string;
    timeLimit?: number | null;
    startedAt?: string;
  };
}

export function GameClient({ game }: GameClientProps) {
  const router = useRouter();
  const [showForfeitModal, setShowForfeitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const {
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
  } = useGame({
    gameId: game.id,
    wordLength: game.wordLength,
    maxAttempts: game.maxAttempts,
    initialGuesses: game.guesses,
  });

  // Warn on tab closure if game is playing
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameStatus]);

  const feedback = game.guesses.map((g) => g.feedback) as Array<
    Array<{ letter: string; status: 'correct' | 'present' | 'absent' }>
  >;

  const onConfirmForfeit = async () => {
    setShowForfeitModal(false);
    await handleForfeit();
  };

  const onSaveProgress = () => {
    setShowExitModal(false);
    router.push('/dashboard');
  };

  const onDiscardGame = async () => {
    setIsDiscarding(true);
    await discardGame(game.id);
    setIsDiscarding(false);
    setShowExitModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ── Exit Confirmation Modal ── */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-bone border border-vellum p-8 rounded-cards text-center space-y-5"
            >
              {/* Monogram-style icon */}
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
                  You have a game in progress. Save your progress to resume later, or discard this game.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  onClick={onSaveProgress}
                  disabled={isDiscarding}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Progress
                </Button>
                <Button
                  onClick={onDiscardGame}
                  disabled={isDiscarding}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-ink text-ink hover:bg-chalk"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDiscarding ? 'Discarding…' : 'Discard Game'}
                </Button>
                <Button
                  onClick={() => setShowExitModal(false)}
                  disabled={isDiscarding}
                  variant="ghost"
                  className="w-full text-graphite hover:text-ink"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Forfeit Confirmation Modal ── */}
      <AnimatePresence>
        {showForfeitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-bone border border-vellum p-8 rounded-cards text-center space-y-5"
            >
              <div className="mx-auto w-10 h-10 rounded-full border border-ink flex items-center justify-center text-ink">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="font-serif font-medium text-ink mb-2"
                  style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
                >
                  Forfeit Game?
                </h3>
                <p className="font-sans text-graphite" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  Are you sure you want to forfeit? This will count as a loss and reveal the answer.
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={onConfirmForfeit}
                  disabled={isForfeiting}
                  variant="outline"
                  className="flex-1 border-ink text-ink hover:bg-chalk"
                >
                  {isForfeiting ? 'Forfeiting…' : 'Yes, Forfeit'}
                </Button>
                <Button
                  onClick={() => setShowForfeitModal(false)}
                  disabled={isForfeiting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Game Container ── */}
      <div className="rounded-cards border border-vellum bg-bone p-6">
        {/* Game header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (gameStatus === 'playing') {
                  setShowExitModal(true);
                } else {
                  router.push('/dashboard');
                }
              }}
              className="text-graphite hover:text-ink transition-colors p-1 rounded-cards hover:bg-chalk"
              title="Exit Game"
            >
              <Home className="h-4 w-4" />
            </button>
            <h2
              className="font-serif font-medium text-ink"
              style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
            >
              WordForge
            </h2>
          </div>
          {/* Mode + difficulty badges + timer */}
          <div className="flex gap-2 items-center">
            {game.timeLimit && game.startedAt && (
              <GameTimer
                timeLimit={game.timeLimit}
                startedAt={game.startedAt}
                gameStatus={gameStatus}
                onTimeUp={handleForfeit}
              />
            )}
            <span
              className="rounded-buttons border border-vellum bg-chalk px-3 py-1 font-sans text-graphite"
              style={{ fontSize: '11px' }}
            >
              {game.mode}
            </span>
            <span
              className="rounded-buttons border border-ink bg-transparent px-3 py-1 font-sans text-ink font-medium"
              style={{ fontSize: '11px' }}
            >
              {game.difficulty}
            </span>
          </div>
        </div>

        {/* Game Result Card */}
        {gameStatus !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-cards p-5 text-center border ${
              gameStatus === 'won'
                ? 'bg-chalk border-vellum'
                : 'bg-bone border-ink'
            }`}
          >
            <div className="text-2xl mb-2">{gameStatus === 'won' ? '◆' : '◇'}</div>
            <h3
              className="font-serif font-medium text-ink mb-1"
              style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
            >
              {gameStatus === 'won' ? 'Solved.' : 'Game Over.'}
            </h3>
            {revealedAnswer && (
              <p className="font-sans text-graphite mb-4" style={{ fontSize: '14px' }}>
                The word was{' '}
                <span
                  className="font-medium text-ink uppercase tracking-widest"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {revealedAnswer}
                </span>
              </p>
            )}
            <div className="flex justify-center gap-3">
              <Button asChild size="sm">
                <Link href={`/game/new?mode=${game.mode}&difficulty=${game.difficulty}`}>
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Play Again
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <Home className="mr-2 h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Board */}
        <div className="flex justify-center mb-8">
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            wordLength={game.wordLength}
            maxAttempts={game.maxAttempts}
            feedback={feedback}
          />
        </div>

        {/* Hint & Forfeit controls */}
        {gameStatus === 'playing' && (
          <div className="flex justify-center gap-3 mb-4">
            <Button
              onClick={handleUseHint}
              disabled={hintsUsed >= 1 || isUsingHint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {hintsUsed >= 1 ? 'Hint Used' : isUsingHint ? 'Getting Hint…' : 'Hint'}
            </Button>

            <Button
              onClick={() => setShowForfeitModal(true)}
              disabled={isForfeiting}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-graphite hover:text-ink"
            >
              <Flag className="h-3.5 w-3.5" />
              Forfeit
            </Button>
          </div>
        )}

        {/* Keyboard */}
        <Keyboard
          onKeyPress={handleKeyPress}
          keyStates={keyStates}
          disabled={gameStatus !== 'playing' || isSubmitting || isForfeiting}
        />

        {/* Attempt counter */}
        <div
          className="text-center font-sans text-graphite mt-4"
          style={{ fontSize: '12px' }}
        >
          {guesses.length} / {game.maxAttempts} attempts
        </div>
      </div>
    </div>
  );
}
