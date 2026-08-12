'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Play, Zap, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function QuickPlay() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('MEDIUM');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setUTCHours(24, 0, 0, 0); // Next UTC midnight
      
      const diffMs = nextReset.getTime() - now.getTime();
      if (diffMs <= 0) {
        return '00:00:00';
      }
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="rounded-cards border border-vellum bg-bone p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2
          className="font-serif font-medium text-ink mb-1"
          style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
        >
          Quick Play
        </h2>
        <p className="font-sans text-graphite text-sm">Configure your difficulty and start a game</p>
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <span
          className="font-sans text-graphite uppercase block"
          style={{ fontSize: '11px', letterSpacing: '0.12em' }}
        >
          Difficulty
        </span>
        <div className="grid grid-cols-3 gap-px border border-vellum rounded-cards overflow-hidden">
          {['EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <motion.button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2.5 px-3 font-sans text-xs font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-ink text-paper'
                  : 'bg-chalk text-graphite hover:bg-bone hover:text-ink'
              }`}
            >
              {diff.charAt(0) + diff.slice(1).toLowerCase()}
            </motion.button>
          ))}
        </div>
        <p className="font-sans text-graphite italic" style={{ fontSize: '12px' }}>
          {selectedDifficulty === 'EASY' && 'Easier words — 8 attempts allowed.'}
          {selectedDifficulty === 'MEDIUM' && 'Standard gameplay — 6 attempts.'}
          {selectedDifficulty === 'HARD' && 'Rare words, 5 attempts, must use revealed letters.'}
        </p>
      </motion.div>

      {/* Game Mode Buttons */}
      <motion.div className="flex flex-col gap-2" variants={itemVariants}>
        {/* Classic — primary pill */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Link
            href={`/game/new?mode=INFINITE&difficulty=${selectedDifficulty}`}
            className="flex items-center justify-center gap-2 rounded-buttons bg-ink px-4 py-2.5 font-sans text-xs font-normal text-paper hover:opacity-80 transition-opacity"
          >
            <Play className="h-3.5 w-3.5" />
            Classic Game — {selectedDifficulty.charAt(0) + selectedDifficulty.slice(1).toLowerCase()}
          </Link>
        </motion.div>

        {/* Time Attack — secondary */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Link
            href={`/game/new?mode=TIME_ATTACK&difficulty=${selectedDifficulty}`}
            className="flex items-center justify-center gap-2 rounded-buttons border border-vellum bg-chalk px-4 py-2.5 font-sans text-xs text-graphite hover:bg-bone hover:border-ink hover:text-ink transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            Time Attack — {selectedDifficulty.charAt(0) + selectedDifficulty.slice(1).toLowerCase()}
          </Link>
        </motion.div>

        {/* Daily Challenge — with countdown */}
        <div className="pt-2 border-t border-vellum mt-1">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href="/game/new?mode=DAILY&difficulty=MEDIUM"
              className="flex items-center justify-center gap-2 rounded-buttons border border-ink bg-transparent px-4 py-2.5 font-sans text-xs font-medium text-ink hover:bg-ink hover:text-paper transition-all"
            >
              <Calendar className="h-3.5 w-3.5" />
              Daily Challenge
            </Link>
          </motion.div>
          {timeLeft && (
            <motion.div
              className="flex items-center justify-center gap-1.5 mt-2 font-sans text-graphite"
              style={{ fontSize: '11px' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="h-3 w-3" />
              <span>Next puzzle in {timeLeft}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
