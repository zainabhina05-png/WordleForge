'use client';

import { motion } from 'framer-motion';
import { HERO_SLIDES, HeroSlide } from './slides-data';
import { VisualizerBars } from './visualizer-bars';

interface BottomDockProps {
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function BottomDock({ activeIndex, onSelect, onPrev, onNext }: BottomDockProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const slide = HERO_SLIDES[activeIndex]!;
  const total = HERO_SLIDES.length;
  const indexLabel = String(activeIndex + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] pointer-events-none">
      <div className="px-4 md:px-8 pb-4 md:pb-6">
        {/* Visualizer + counter row */}
        <div className="flex items-end justify-between gap-4 mb-3 pointer-events-auto">
          <div className="hidden md:block max-w-xs">
            <p className="font-sans text-graphite" style={{ fontSize: '11px', lineHeight: 1.5 }}>
              Strategy, puzzles, and progression. Fast, lean, and endlessly replayable.
            </p>
          </div>

          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <VisualizerBars active={true} count={56} />
          </div>

          <div className="flex items-center gap-3 font-sans text-xs text-ink shrink-0">
            <button
              onClick={onPrev}
              className="w-8 h-8 flex items-center justify-center hover:opacity-50 transition-opacity"
              aria-label="Previous slide"
            >
              ⟪
            </button>
            <span className="tabular-nums tracking-wider">
              {`${indexLabel} / ${totalLabel}`}
            </span>
            <button
              onClick={onNext}
              className="w-8 h-8 flex items-center justify-center hover:opacity-50 transition-opacity"
              aria-label="Next slide"
            >
              ⟫
            </button>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          <div className="logo-mark shrink-0 hidden sm:flex">W</div>

          <div className="flex-1 flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
            <div className="hidden md:block w-px h-8 bg-ink/15 shrink-0" />

            {HERO_SLIDES.map((s, i) => (
              <SlideThumb
                key={s.id}
                slide={s}
                active={i === activeIndex}
                onClick={() => onSelect(i)}
              />
            ))}

            <div className="hidden md:block w-px h-8 bg-ink/15 shrink-0" />
          </div>

          <div className="hidden lg:block text-right shrink-0">
            <p className="font-sans text-graphite uppercase tracking-widest" style={{ fontSize: '10px' }}>
              {slide.tag}
            </p>
            <p className="font-serif text-ink" style={{ fontSize: '13px' }}>
              {slide.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideThumb({
  slide,
  active,
  onClick,
}: {
  slide: HeroSlide;
  active: boolean;
  onClick: () => void;
}) {
  const tileColors: Record<string, string> = {
    correct: 'bg-ink',
    present: 'bg-graphite',
    absent: 'bg-vellum',
    empty: 'bg-chalk border border-vellum',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative shrink-0 w-[72px] md:w-[88px] h-[44px] md:h-[52px] rounded-cards overflow-hidden border transition-colors ${
        active ? 'border-ink ring-1 ring-ink/20' : 'border-vellum hover:border-graphite'
      }`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`View ${slide.title}`}
      aria-current={active ? 'true' : undefined}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: `linear-gradient(135deg, ${slide.accent}22, ${slide.accent}44)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-[3px] p-2">
        {slide.tiles.map((t, i) => (
          <div
            key={i}
            className={`w-[10px] h-[10px] md:w-[11px] md:h-[11px] rounded-[2px] ${tileColors[t]}`}
          />
        ))}
      </div>
      {active && (
        <motion.div
          layoutId="thumb-active"
          className="absolute inset-0 border-2 border-ink rounded-cards pointer-events-none"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
