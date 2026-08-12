import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Target, Star } from 'lucide-react';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      profile: true,
      statistics: true,
      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          unlockedAt: 'desc',
        },
      },
    },
  });

  if (!dbUser) {
    redirect('/sign-in');
  }

  const { profile, statistics, achievements } = dbUser;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Section header */}
      <div className="mb-10">
        <h1
          className="font-serif font-medium text-ink mb-1"
          style={{ fontSize: '43px', letterSpacing: '-0.215px', lineHeight: '1.1' }}
        >
          Profile
        </h1>
        <p className="font-sans text-graphite" style={{ fontSize: '15px' }}>
          {dbUser.username || dbUser.firstName || 'Player'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Level & Progress */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Level &amp; Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Level + XP bar */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-sans text-graphite" style={{ fontSize: '12px' }}>Level</span>
                  <span
                    className="font-serif font-medium text-ink"
                    style={{ fontSize: '34px', letterSpacing: '-0.1px', lineHeight: '1' }}
                  >
                    {profile?.level || 1}
                  </span>
                </div>
                {/* XP progress bar — hairline vellum track, ink fill */}
                <div className="h-px bg-vellum w-full overflow-hidden relative">
                  <div
                    className="h-full bg-ink absolute left-0 top-0"
                    style={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
                  />
                </div>
                <div className="mt-1.5 font-sans text-graphite" style={{ fontSize: '11px' }}>
                  {profile?.xp || 0} / {Math.ceil(((profile?.level || 1) * 1000) / 100) * 100} XP
                </div>
              </div>

              {/* Profile stats */}
              <div className="space-y-3 border-t border-vellum pt-4">
                {[
                  { label: 'Total Games', value: profile?.totalGames || 0 },
                  { label: 'Total Wins', value: profile?.totalWins || 0 },
                  {
                    label: 'Win Rate',
                    value: `${profile?.totalGames
                      ? Math.round((profile.totalWins / profile.totalGames) * 100)
                      : 0}%`,
                  },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-sans text-graphite" style={{ fontSize: '13px' }}>{row.label}</span>
                    <span className="font-sans font-medium text-ink" style={{ fontSize: '15px' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>{achievements.length} unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="font-sans text-graphite" style={{ fontSize: '14px' }}>
                  No achievements unlocked yet. Keep playing to earn your first achievement!
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {achievements.map(({ achievement, unlockedAt }) => (
                    <div
                      key={achievement.id}
                      className="flex items-start gap-3 rounded-cards border border-vellum bg-chalk p-4"
                    >
                      <div className="text-2xl shrink-0">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-sans font-medium text-ink" style={{ fontSize: '13px' }}>
                            {achievement.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs rounded-buttons">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="font-sans text-graphite" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                          {achievement.description}
                        </p>
                        <p className="mt-1.5 font-sans text-graphite opacity-60" style={{ fontSize: '11px' }}>
                          {new Date(unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-px md:grid-cols-2 border border-vellum rounded-cards overflow-hidden">
                {[
                  { icon: <Trophy className="h-4 w-4 text-graphite" />, value: statistics?.gamesWon || 0, label: 'Games Won' },
                  { icon: <Flame className="h-4 w-4 text-graphite" />, value: statistics?.maxStreak || 0, label: 'Best Streak' },
                  { icon: <Target className="h-4 w-4 text-graphite" />, value: statistics ? statistics.averageGuesses.toFixed(1) : '—', label: 'Avg. Guesses' },
                  { icon: <Star className="h-4 w-4 text-graphite" />, value: statistics?.perfectGames || 0, label: 'Perfect Games' },
                ].map((stat, i) => (
                  <div key={i} className="bg-chalk p-5 border-r border-b border-vellum last:border-r-0 [&:nth-child(even)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-graphite" style={{ fontSize: '12px' }}>{stat.label}</span>
                      {stat.icon}
                    </div>
                    <div
                      className="font-serif font-medium text-ink"
                      style={{ fontSize: '34px', letterSpacing: '-0.1px', lineHeight: '1' }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
