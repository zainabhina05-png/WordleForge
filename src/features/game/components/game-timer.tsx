'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '@/lib/game-logic';

interface GameTimerProps {
  timeLimit: number | null | undefined; // in seconds
  startedAt: string; // ISO string
  gameStatus: 'playing' | 'won' | 'lost' | 'forfeited';
  onTimeUp?: () => void;
}

export function GameTimer({ timeLimit, startedAt, gameStatus, onTimeUp }: GameTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!timeLimit || gameStatus !== 'playing') return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const startTime = new Date(startedAt).getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);

      setTimeRemaining(remaining);
      setIsWarning(remaining <= 30); // Warning when 30s or less

      if (remaining <= 0 && gameStatus === 'playing') {
        onTimeUp?.();
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [timeLimit, startedAt, gameStatus, onTimeUp]);

  if (!timeLimit) return null;

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-2 rounded-cards border font-sans text-sm font-medium ${
        isWarning
          ? 'border-ink bg-paper/50 text-ink animate-pulse'
          : 'border-vellum bg-chalk text-graphite'
      }`}
      animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
      transition={isWarning ? { duration: 0.8, repeat: Infinity } : {}}
    >
      <Clock className="h-4 w-4" />
      <span className="font-mono tracking-tight">
        {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
      </span>
    </motion.div>
  );
}
