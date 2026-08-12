'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export function DashboardHero({ userName }: { userName?: string | null }) {
  const ref = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="relative mb-12 rounded-cards border border-vellum bg-bone p-8 md:p-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-paper/5 to-ink/5 pointer-events-none rounded-cards" />

      <motion.div
        ref={ref}
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge/Label */}
        <motion.span
          className="font-sans text-graphite uppercase tracking-widest mb-4 block"
          style={{ fontSize: '10px', letterSpacing: '0.14em' }}
          variants={itemVariants}
        >
          Welcome Back
        </motion.span>

        {/* Main Heading */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2
            className="font-serif font-medium text-ink"
            style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            {userName ? `Keep your streak alive, ${userName}` : 'Ready to play?'}
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-graphite mb-8 max-w-2xl"
          style={{ fontSize: '15px', lineHeight: 1.6 }}
          variants={itemVariants}
        >
          Every puzzle sharpens your vocabulary. Today&apos;s the perfect time to challenge yourself and expand your streak.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-3" variants={itemVariants}>
          <Link href="/game/new?mode=INFINITE&difficulty=MEDIUM" className="btn-pill">
            Start Game
          </Link>
          <Link
            href="/game/new?mode=TIME_ATTACK&difficulty=EASY"
            className="rounded-cards border border-vellum bg-chalk px-4 py-2 font-sans text-sm text-graphite hover:bg-bone transition-colors"
          >
            Time Attack
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-cards border border-vellum bg-chalk px-4 py-2 font-sans text-sm text-graphite hover:bg-bone transition-colors"
          >
            View Leaderboard →
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
