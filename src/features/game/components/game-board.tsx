'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TileState } from '@/types';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  wordLength: number;
  maxAttempts: number;
  feedback: Array<Array<{ letter: string; status: TileState }>>;
}

export function GameBoard({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  feedback,
}: GameBoardProps) {
  const emptyRows = maxAttempts - guesses.length - (currentGuess ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: wordLength }).map((_, colIndex) => {
            const feedbackItem = feedback[rowIndex]?.[colIndex];
            const letter = guess[colIndex] || '';
            
            return (
              <Tile
                key={colIndex}
                letter={letter}
                state={feedbackItem?.status || 'empty'}
                delay={colIndex * 0.1}
              />
            );
          })}
        </div>
      ))}

      {currentGuess && (
        <div className="flex gap-2">
          {Array.from({ length: wordLength }).map((_, colIndex) => (
            <Tile
              key={colIndex}
              letter={currentGuess[colIndex] || ''}
              state="current"
            />
          ))}
        </div>
      )}

      {Array.from({ length: emptyRows }).map((_, rowIndex) => (
        <div key={`empty-${rowIndex}`} className="flex gap-2">
          {Array.from({ length: wordLength }).map((_, colIndex) => (
            <Tile key={colIndex} letter="" state="empty" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface TileProps {
  letter: string;
  state: TileState;
  delay?: number;
}

function Tile({ letter, state, delay = 0 }: TileProps) {
  // Structured monochrome tile states:
  // empty   → hairline vellum border, transparent bg
  // current → solid ink border (active input)
  // correct → ink filled, paper text (strongest signal)
  // present → graphite filled, paper text (medium signal)
  // absent  → bone filled, graphite/40 text (weakest signal)
  const stateStyles: Record<TileState, string> = {
    empty: 'border-2 border-vellum bg-transparent text-ink',
    current: 'border-2 border-ink bg-transparent text-ink',
    correct: 'border-0 bg-ink text-paper',
    present: 'border-0 bg-graphite text-paper',
    absent: 'border-0 bg-chalk text-graphite opacity-60',
  };

  return (
    <motion.div
      initial={state !== 'empty' && state !== 'current' ? { rotateX: 0 } : false}
      animate={state !== 'empty' && state !== 'current' ? { rotateX: 360 } : {}}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-cards text-2xl font-bold uppercase font-sans md:h-16 md:w-16',
        stateStyles[state]
      )}
    >
      {letter}
    </motion.div>
  );
}
