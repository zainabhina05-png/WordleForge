'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MenuOverlay } from './menu-overlay';
import { HERO_QUICK_LINKS } from './slides-data';
import { useSmoothScroll } from './smooth-scroll';

interface FloatingNavProps {
  variant?: 'landing' | 'auth';
}

export function FloatingNav({ variant = 'landing' }: FloatingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { scrollTo } = useSmoothScroll() ?? {};

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > 120 && latest > prev) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleSectionClick = (href: string) => {
    const hash = href.replace('/#', '#');
    if (scrollTo) {
      scrollTo(hash, { offset: -80 });
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[80]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-1 rounded-full border border-vellum bg-bone/90 backdrop-blur-md shadow-sm px-1.5 py-1.5">
          {variant === 'landing' ? (
            <>
              <div className="hidden md:flex items-center">
                {HERO_QUICK_LINKS.filter((l) => l.href.startsWith('/#')).map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => handleSectionClick(link.href)}
                    className="px-3 py-2 font-sans text-xs text-graphite hover:text-ink hover:bg-vellum/50 rounded-full transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <Link
                href="/sign-in"
                className="px-4 py-2 font-sans text-xs text-ink hover:bg-vellum/50 rounded-full transition-colors md:hidden"
              >
                Sign In
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="px-4 py-2 font-sans text-xs text-ink hover:bg-vellum/50 rounded-full transition-colors"
            >
              Home
            </Link>
          )}

          <Link href="/" className="logo-mark mx-1 hover:opacity-70 transition-opacity" aria-label="WordForge home">
            W
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="px-4 py-2 font-sans text-xs text-ink hover:bg-vellum/50 rounded-full transition-colors flex items-center gap-2"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="hidden sm:inline">Menu</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </motion.header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
