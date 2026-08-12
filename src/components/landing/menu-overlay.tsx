'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NAV_SECTIONS } from './slides-data';
import { useSmoothScroll } from './smooth-scroll';

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

function isSectionLink(href: string) {
  return href.startsWith('/#');
}

function sectionHash(href: string) {
  return href.replace('/#', '#');
}

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollTo } = useSmoothScroll() ?? {};
  const pathname = usePathname();
  const onHome = pathname === '/';

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const handleSectionClick = (href: string) => {
    onClose();
    const hash = sectionHash(href);
    window.setTimeout(() => {
      if (scrollTo) {
        scrollTo(hash, { offset: -80 });
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 350);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          <motion.nav
            className="fixed inset-0 z-[95] flex flex-col justify-center px-6 md:px-16 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Main menu"
          >
            <div className="max-w-4xl mx-auto w-full pointer-events-auto">
              {NAV_SECTIONS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isSectionLink(item.href) && onHome ? (
                    <button
                      type="button"
                      onClick={() => handleSectionClick(item.href)}
                      className="group flex w-full items-center gap-6 py-3 md:py-4 border-b border-vellum/60 relative overflow-hidden text-left"
                    >
                      <NavItemContent item={item} hoveredIndex={hoveredIndex} index={i} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-6 py-3 md:py-4 border-b border-vellum/60 relative overflow-hidden"
                    >
                      <NavItemContent item={item} hoveredIndex={hoveredIndex} index={i} />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 md:top-10 md:right-16 font-sans text-xs text-graphite hover:text-ink transition-colors pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              Close ✕
            </motion.button>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

function NavItemContent({
  item,
  hoveredIndex,
  index,
}: {
  item: (typeof NAV_SECTIONS)[number];
  hoveredIndex: number | null;
  index: number;
}) {
  return (
    <>
      <span
        className="font-sans text-graphite shrink-0 hidden sm:block"
        style={{ fontSize: '11px', letterSpacing: '0.08em' }}
      >
        {item.index}
      </span>

      <span className="relative flex-1 overflow-hidden h-[clamp(36px,6vw,56px)]">
        <span
          className="block font-serif font-medium text-ink transition-transform duration-500 ease-out-expo group-hover:-translate-y-full"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {item.label}
        </span>
        <span
          className="absolute inset-0 font-serif font-medium italic text-graphite transition-transform duration-500 ease-out-expo translate-y-full group-hover:translate-y-0"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {item.label}
        </span>
      </span>

      <motion.span
        className="hidden md:flex w-16 h-10 rounded-cards border border-vellum bg-bone items-center justify-center overflow-hidden shrink-0"
        animate={{
          opacity: hoveredIndex === index ? 1 : 0,
          scale: hoveredIndex === index ? 1 : 0.85,
        }}
        transition={{ duration: 0.3 }}
      >
        <MiniGrid index={index} />
      </motion.span>
    </>
  );
}

function MiniGrid({ index }: { index: number }) {
  const patterns = [
    ['c', 'p', 'a', 'a', 'c'],
    ['c', 'c', 'p', 'a', 'a'],
    ['p', 'p', 'c', 'c', 'c'],
    ['a', 'p', 'c', 'c', 'c'],
    ['c', 'a', 'p', 'a', 'c'],
  ];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tiles = patterns[index % patterns.length]!;

  const colors: Record<string, string> = {
    c: 'bg-ink',
    p: 'bg-graphite',
    a: 'bg-vellum border border-vellum',
  };

  return (
    <div className="flex gap-[3px]">
      {tiles.map((t, i) => (
        <div key={i} className={`w-[6px] h-[6px] rounded-[1px] ${colors[t]}`} />
      ))}
    </div>
  );
}
