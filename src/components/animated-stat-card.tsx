'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  index: number;
}

export function AnimatedStatCard({ label, value, icon, index }: AnimatedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.02 }}
      className="bg-bone border-r border-vellum last:border-r-0 p-6 cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-sans text-graphite" style={{ fontSize: '12px' }}>
          {label}
        </span>
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
          {icon}
        </motion.div>
      </div>
      <motion.div
        className="font-serif font-medium text-ink"
        style={{ fontSize: '34px', lineHeight: '1.1', letterSpacing: '-0.1px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
