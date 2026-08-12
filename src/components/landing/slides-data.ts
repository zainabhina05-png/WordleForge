export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  accent: string;
  tiles: Array<'correct' | 'present' | 'absent' | 'empty'>;
  word: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'classic',
    title: 'Classic Mode',
    subtitle: 'Five letters. Six guesses. One word.',
    tag: 'CORE GAMEPLAY',
    accent: '#595855',
    word: 'FORGE',
    tiles: ['correct', 'present', 'absent', 'absent', 'correct'],
  },
  {
    id: 'daily',
    title: 'Daily Challenge',
    subtitle: 'One puzzle per day. Compete globally.',
    tag: 'DAILY SERIES',
    accent: '#808080',
    word: 'WORDS',
    tiles: ['correct', 'correct', 'present', 'absent', 'absent'],
  },
  {
    id: 'time',
    title: 'Time Attack',
    subtitle: 'Race the clock. Chain your streaks.',
    tag: 'SPEED MODE',
    accent: '#000000',
    word: 'QUICK',
    tiles: ['present', 'present', 'correct', 'correct', 'correct'],
  },
  {
    id: 'unlimited',
    title: 'Unlimited Words',
    subtitle: '50,000+ words. Never run out.',
    tag: 'INFINITE PLAY',
    accent: '#595855',
    word: 'PLAYS',
    tiles: ['absent', 'present', 'correct', 'correct', 'correct'],
  },
  {
    id: 'leaderboard',
    title: 'Global Leaderboard',
    subtitle: 'Track streaks. Climb the ranks.',
    tag: 'COMPETITIVE',
    accent: '#808080',
    word: 'RANKS',
    tiles: ['correct', 'absent', 'present', 'absent', 'correct'],
  },
];

export const HERO_QUICK_LINKS = [
  { href: '/#hero', label: 'Home', caption: '( Start )' },
  { href: '/#features', label: 'Features', caption: '( Why Play )' },
  { href: '/#modes', label: 'Modes', caption: '( Game Types )' },
  { href: '/sign-up', label: 'Join', caption: '( Get Started )' },
  { href: '/guest', label: 'Guest', caption: '( Try Free )' },
];

export const NAV_SECTIONS = [
  { href: '/#hero', label: 'Home', index: '( Home )' },
  { href: '/#features', label: 'Features', index: '( Features )' },
  { href: '/#modes', label: 'Game Modes', index: '( Modes )' },
  { href: '/sign-up', label: 'Get Started', index: '( Join )' },
  { href: '/guest', label: 'Try as Guest', index: '( Guest )' },
];
