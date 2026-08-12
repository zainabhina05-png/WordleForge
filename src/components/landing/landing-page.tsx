'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SmoothScroll } from './smooth-scroll';
import { HeroCarousel } from './hero-carousel';
import { GrainOverlay } from './grain-overlay';

function RevealBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-putty overflow-x-hidden relative">
        <GrainOverlay />
        <HeroCarousel />

        {/* Features section */}
        <section id="features" className="px-6 py-24 md:py-32 border-t border-vellum">
          <div className="max-w-6xl mx-auto">
            <RevealBlock className="mb-4">
              <span
                className="font-sans text-graphite uppercase tracking-widest"
                style={{ fontSize: '11px', letterSpacing: '0.12em' }}
              >
                Why WordForge
              </span>
            </RevealBlock>

            <RevealBlock delay={0.1} className="mb-16">
              <h2
                className="font-serif font-medium text-ink max-w-2xl"
                style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                Defining the core DNA of word puzzles
              </h2>
            </RevealBlock>

            <div className="grid gap-px md:grid-cols-3 border border-vellum rounded-cards overflow-hidden">
              {[
                {
                  num: 'I',
                  title: 'Unlimited Gameplay',
                  body: 'Play as many games as you want with a dictionary of 50,000+ words across any difficulty.',
                },
                {
                  num: 'II',
                  title: 'Multiple Modes',
                  body: 'Classic, Daily Challenge, Time Attack — each mode sharpens a different cognitive muscle.',
                },
                {
                  num: 'III',
                  title: 'Track Progress',
                  body: 'Detailed statistics, win streaks, and global leaderboards put your skill in context.',
                },
              ].map((item, i) => (
                <RevealBlock key={i} delay={0.15 + i * 0.1}>
                  <div className="bg-bone p-6 flex flex-col gap-4 border-r border-vellum last:border-r-0 h-full">
                    <span className="font-sans text-graphite" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                      {item.num}
                    </span>
                    <h3
                      className="font-serif font-medium text-ink"
                      style={{ fontSize: '22px', letterSpacing: '-0.11px', lineHeight: 1.33 }}
                    >
                      {item.title}
                    </h3>
                    <p className="font-sans text-graphite" style={{ fontSize: '15px', lineHeight: 1.5 }}>
                      {item.body}
                    </p>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </div>
        </section>

        {/* Modes marquee section */}
        <section id="modes" className="py-16 border-t border-vellum overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap">
            {[...Array(2)].map((_, copy) => (
              <div key={copy} className="flex shrink-0 animate-marquee">
                {['CLASSIC', 'DAILY', 'TIME ATTACK', 'LEADERBOARD', 'STREAKS', 'GUESS', 'SOLVE', 'PLAY'].map(
                  (word) => (
                    <span
                      key={`${copy}-${word}`}
                      className="font-serif font-medium text-ink/10 mx-8"
                      style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '-0.03em' }}
                    >
                      {word}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="px-6 py-24 md:py-32 border-t border-vellum text-center">
          <RevealBlock>
            <h2
              className="font-serif font-medium text-ink mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.02em' }}
            >
              Ready to forge your streak?
            </h2>
          </RevealBlock>
          <RevealBlock delay={0.15}>
            <Link href="/sign-up" className="btn-pill inline-block">
              Get Started Free
            </Link>
          </RevealBlock>
        </section>

        {/* Footer */}
        <footer className="border-t border-vellum bg-chalk px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="logo-mark" style={{ width: '22px', height: '22px', fontSize: '11px' }}>
              W
            </span>
            <span className="font-sans text-graphite" style={{ fontSize: '12px' }}>
              WordForge
            </span>
          </div>
          <span className="font-sans text-graphite" style={{ fontSize: '11px' }}>
            © {new Date().getFullYear()}
          </span>
        </footer>
      </main>
    </SmoothScroll>
  );
}
