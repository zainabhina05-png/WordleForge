'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HERO_QUICK_LINKS } from './slides-data';
import { useSmoothScroll } from './smooth-scroll';

export function HeroSideNav() {
  const { scrollTo } = useSmoothScroll() ?? {};
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const sections = HERO_QUICK_LINKS.filter((l) => l.href.startsWith('/#')).map((link) => ({
      id: link.href.replace('/#', ''),
      element: document.querySelector(link.href.replace('/', '')),
    })).filter((s) => s.element);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (href: string) => {
    const hash = href.replace('/#', '#');
    if (scrollTo) {
      scrollTo(hash, { offset: -80 });
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-[75] hidden lg:flex flex-col gap-1"
      aria-label="Hero quick links"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {HERO_QUICK_LINKS.map((link, i) => {
        const id = link.href.replace('/#', '');
        const active = link.href.startsWith('/#') && activeId === id;
        const isSection = link.href.startsWith('/#');

        const labelContent = (
          <>
            <span className="relative block overflow-hidden h-[18px]">
              <span
                className={`block font-sans uppercase tracking-[0.18em] transition-transform duration-500 ease-out-expo group-hover:-translate-y-full ${
                  active ? 'text-ink' : 'text-graphite'
                }`}
                style={{ fontSize: '11px' }}
              >
                {link.label}
              </span>
              <span
                className="absolute inset-0 font-sans uppercase tracking-[0.18em] text-ink translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                style={{ fontSize: '11px' }}
              >
                {link.label}
              </span>
            </span>
            <motion.span
              className="block font-sans text-graphite mt-0.5"
              style={{ fontSize: '10px', letterSpacing: '0.06em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
            >
              {link.caption}
            </motion.span>
          </>
        );

        if (isSection) {
          return (
            <button
              key={link.href}
              type="button"
              onClick={() => handleClick(link.href)}
              className="group text-left py-1"
              aria-current={active ? 'true' : undefined}
            >
              {labelContent}
            </button>
          );
        }

        return (
          <Link key={link.href} href={link.href} className="group text-left py-1">
            {labelContent}
          </Link>
        );
      })}
    </motion.nav>
  );
}
