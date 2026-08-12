'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';
import { User } from '@prisma/client';

interface NavigationProps {
  user: User;
}

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/game', label: 'Play' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
];

export function Navigation({ user }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

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

  return (
    <>
      {/* Floating interactive navbar — Nudot-style pill */}
      <motion.header
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-1 rounded-full border border-vellum bg-bone/90 backdrop-blur-md shadow-sm px-1.5 py-1.5">
          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 font-sans text-xs rounded-full transition-colors ${
                    active ? 'text-ink' : 'text-graphite hover:text-ink hover:bg-vellum/50'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-vellum/60 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <Link href="/dashboard" className="logo-mark mx-1 hover:opacity-70 transition-opacity" aria-label="WordForge">
            W
          </Link>

          <div className="hidden md:block">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-7 w-7' } }} />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden px-3 py-2 font-sans text-xs text-ink hover:bg-vellum/50 rounded-full transition-colors flex items-center gap-2"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-x-4 top-20 z-[95] md:hidden rounded-cards border border-vellum bg-bone/95 backdrop-blur-md shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-4 flex flex-col gap-1">
                {links.map((link, i) => {
                  const active = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-4 py-3 font-sans text-sm rounded-cards transition-colors ${
                          active ? 'bg-vellum text-ink font-medium' : 'text-graphite hover:bg-vellum/50 hover:text-ink'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="border-t border-vellum mt-2 pt-3 px-4 flex items-center justify-between">
                  <span className="font-sans text-xs text-graphite truncate max-w-[160px]">
                    {user.firstName || user.username || 'Player'}
                  </span>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-7 w-7' } }} />
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
