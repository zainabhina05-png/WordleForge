import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { findUserSafely } from '@/lib/db-utils';
import { Trophy, Target, Flame, Clock, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { QuickPlay } from './quick-play';
import { DashboardHero } from '@/components/dashboard-hero';
import { AnimatedStatCard } from '@/components/animated-stat-card';

interface PageProps {
  searchParams: { error?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const errorMessage = searchParams.error
    ? decodeURIComponent(searchParams.error)
    : null;

  // Use safer database query with timeout
  const dbUser = await findUserSafely(userId);

  if (!dbUser) {
    return (
      <div className="container mx-auto px-6 py-10">
        {/* Section header */}
        <div className="mb-8">
          <h1
            className="font-serif font-medium text-graphite mb-2"
            style={{ fontSize: '43px', letterSpacing: '-0.215px', lineHeight: '1.1' }}
          >
            Dashboard
          </h1>
          <div className="flex items-center gap-2 text-graphite font-sans text-sm">
            <AlertCircle className="h-4 w-4" />
            <p>Unable to connect to database. Please try again later.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-cards border border-vellum bg-bone p-6">
            <h2 className="font-serif font-medium text-ink mb-1" style={{ fontSize: '22px' }}>Quick Play</h2>
            <p className="font-sans text-graphite text-sm mb-4">Start a new game</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/game/new?mode=INFINITE&difficulty=MEDIUM"
                className="btn-pill text-center inline-block w-full"
                style={{ textAlign: 'center' }}
              >
                Classic Game
              </Link>
              <Link
                href="/guest"
                className="rounded-cards border border-vellum bg-chalk px-4 py-2 text-center font-sans text-xs text-graphite hover:bg-bone transition-colors"
              >
                Guest Mode
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dbUser.statistics;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* ── Hero Section ── */}
      <DashboardHero userName={dbUser.firstName} />

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-cards border border-ink bg-bone px-4 py-3 font-sans text-sm text-ink">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage === 'unexpected-error' ? 'Something went wrong starting your game. Please try again.' : errorMessage}</span>
        </div>
      )}

      {/* ── Section header ── */}
      <div className="mb-10">
        <h1
          className="font-serif font-medium text-graphite mb-1"
          style={{ fontSize: '43px', letterSpacing: '-0.215px', lineHeight: '1.1' }}
        >
          Dashboard
        </h1>
        <p className="font-sans text-graphite" style={{ fontSize: '15px' }}>
          Welcome back, {dbUser.firstName || 'Player'}
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="mb-8 grid gap-px md:grid-cols-2 lg:grid-cols-4 border border-vellum rounded-cards overflow-hidden">
        {[
          {
            label: 'Games Played',
            value: stats?.gamesPlayed || 0,
            icon: <Target className="h-3.5 w-3.5 text-graphite" />,
          },
          {
            label: 'Win Rate',
            value: `${stats ? Math.round(stats.winPercentage) : 0}%`,
            icon: <Trophy className="h-3.5 w-3.5 text-graphite" />,
          },
          {
            label: 'Current Streak',
            value: stats?.currentStreak || 0,
            icon: <Flame className="h-3.5 w-3.5 text-graphite" />,
          },
          {
            label: 'Avg. Guesses',
            value: stats ? stats.averageGuesses.toFixed(1) : '—',
            icon: <Clock className="h-3.5 w-3.5 text-graphite" />,
          },
        ].map((stat, i) => (
          <AnimatedStatCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* ── Content grid ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* QuickPlay client component */}
        <QuickPlay />

        {/* Recent Activity */}
        <div className="rounded-cards border border-vellum bg-bone p-6">
          <h2
            className="font-serif font-medium text-ink mb-1"
            style={{ fontSize: '22px', letterSpacing: '-0.11px' }}
          >
            Recent Activity
          </h2>
          <p className="font-sans text-graphite text-sm mb-5">Your latest games</p>

          <div className="font-sans" style={{ fontSize: '14px' }}>
            {(stats?.gamesPlayed || 0) === 0 ? (
              <p className="text-graphite">No games yet. Start your first game!</p>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Total Games', value: stats?.gamesPlayed || 0, color: 'text-ink' },
                  { label: 'Wins', value: stats?.gamesWon || 0, color: 'text-ink' },
                  {
                    label: 'Losses',
                    value: (stats?.gamesPlayed || 0) - (stats?.gamesWon || 0),
                    color: 'text-graphite',
                  },
                  { label: 'Best Streak', value: stats?.maxStreak || 0, color: 'text-ink' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-vellum pb-3 last:border-b-0 last:pb-0">
                    <span className="text-graphite">{row.label}</span>
                    <span className={`font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
