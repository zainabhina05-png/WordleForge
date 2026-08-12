'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { HERO_SLIDES } from './slides-data';
import { BottomDock } from './bottom-dock';
import { FloatingNav } from './floating-nav';
import { HeroSideNav } from './hero-side-nav';

const tileStyles: Record<string, string> = {
  correct: 'bg-ink text-paper border-ink',
  present: 'bg-graphite text-paper border-graphite',
  absent: 'bg-vellum text-ink border-vellum',
  empty: 'bg-bone text-ink border-vellum',
};

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const slide = HERO_SLIDES[activeIndex]!;
  const { scrollY } = useScroll();
  const wordX = useTransform(scrollY, [0, 400], [0, -80]);
  const forgeX = useTransform(scrollY, [0, 400], [0, 80]);
  const titleOpacity = useTransform(scrollY, [0, 400], [0.72, 0.18]);
  const cardY = useTransform(scrollY, [0, 500], [0, 60]);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-x-clip pb-32">
      <FloatingNav />
      <HeroSideNav />

      {/* Split typography — Nudot-style giant title */}
      <div className="absolute inset-x-0 top-[12vh] md:top-[10vh] flex items-start justify-between px-4 md:px-8 lg:px-12 pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="font-serif font-medium text-ink leading-none block"
            style={{ fontSize: 'clamp(40px, 10vw, 120px)', letterSpacing: '-0.04em', x: wordX, opacity: titleOpacity }}
          >
            WORD
          </motion.span>
        </motion.div>

        <div className="flex flex-col items-center pt-4 md:pt-8">
          <motion.div
            className="logo-mark mb-2"
            style={{ width: 48, height: 48, fontSize: 22 }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            W
          </motion.div>
          <motion.span
            className="font-sans text-graphite uppercase tracking-widest text-center"
            style={{ fontSize: '10px', letterSpacing: '0.14em' }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            ( Infinite Puzzles )
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="font-serif font-medium text-ink leading-none block text-right"
            style={{ fontSize: 'clamp(40px, 10vw, 120px)', letterSpacing: '-0.04em', x: forgeX, opacity: titleOpacity }}
          >
            FORGE
          </motion.span>
        </motion.div>
      </div>

      {/* Center carousel card */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-28 md:pt-32 relative z-10">
        <motion.div style={{ y: cardY }} className="w-full max-w-lg">
        <motion.div
          className="relative w-full aspect-[4/3] md:aspect-[16/10]"
          style={{ perspective: 1200 }}
          initial={{ rotateX: 8, y: 40, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 rounded-cards border border-vellum bg-bone shadow-2xl overflow-hidden"
            style={{ transform: 'rotateY(-2deg) rotateX(2deg)' }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col p-6 md:p-8"
              >
                <span
                  className="font-sans text-graphite uppercase tracking-widest mb-4"
                  style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                >
                  {slide.tag}
                </span>

                <h2
                  className="font-serif font-medium text-ink mb-2"
                  style={{ fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.02em' }}
                >
                  {slide.title}
                </h2>

                <p className="font-sans text-graphite mb-8" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                  {slide.subtitle}
                </p>

                {/* Mini game board preview */}
                <div className="flex-1 flex flex-col justify-center gap-2">
                  {[0, 1].map((row) => (
                    <div key={row} className="flex gap-2 justify-center">
                      {Array.from({ length: 5 }).map((_, col) => {
                        const letter = row === 0 ? slide.word[col] : '';
                        const state = row === 0 ? (slide.tiles[col] ?? 'empty') : 'empty';
                        return (
                          <div
                            key={col}
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-sans font-medium text-sm border rounded-[4px] ${tileStyles[state]}`}
                          >
                            {letter}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        </motion.div>

        {/* Hero CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mt-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/sign-up" className="btn-pill">
            Get Started
          </Link>
          <Link
            href="/guest"
            className="font-sans text-xs text-graphite underline-offset-2 hover:underline transition-all"
          >
            Try as Guest →
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center gap-2 font-sans text-graphite"
          style={{ fontSize: '11px', letterSpacing: '0.1em' }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>SCROLL</span>
          <span>↓</span>
        </motion.div>
      </div>

      <BottomDock
        activeIndex={activeIndex}
        onSelect={goTo}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  );
}
