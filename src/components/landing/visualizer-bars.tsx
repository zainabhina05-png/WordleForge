'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VisualizerBarsProps {
  count?: number;
  active?: boolean;
  className?: string;
}

export function VisualizerBars({ count = 48, active = true, className = '' }: VisualizerBarsProps) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: count }, () => 20 + Math.random() * 60)
  );

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setHeights((prev) =>
        prev.map((h) => {
          const delta = (Math.random() - 0.5) * 30;
          return Math.max(8, Math.min(100, h + delta));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [active, count]);

  return (
    <div className={`flex items-end gap-[2px] h-8 overflow-hidden ${className}`}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-ink/25 origin-bottom"
          animate={{ height: `${h}%`, opacity: active ? 0.35 + (h / 100) * 0.45 : 0.15 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
