import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function LeaderboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const topPlayers = await prisma.user.findMany({
    include: {
      profile: true,
      statistics: true,
    },
    orderBy: {
      profile: {
        totalWins: 'desc',
      },
    },
    take: 100,
  });

  // Structured: rank marks use geometric symbols instead of colored icons
  const getRankMark = (rank: number) => {
    if (rank === 1) return <span className="font-serif text-lg font-medium text-ink">◆</span>;
    if (rank === 2) return <span className="font-serif text-lg font-medium text-graphite">◇</span>;
    if (rank === 3) return <span className="font-serif text-base font-medium text-graphite">△</span>;
    return null;
  };

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Section header */}
      <div className="mb-10">
        <h1
          className="font-serif font-medium text-graphite mb-1"
          style={{ fontSize: '43px', letterSpacing: '-0.215px', lineHeight: '1.1' }}
        >
          Leaderboard
        </h1>
        <p className="font-sans text-graphite" style={{ fontSize: '15px' }}>
          Global rankings by total wins
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rankings</CardTitle>
          <CardDescription>Based on total wins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-vellum">
            {topPlayers.map((player, index) => {
              const rank = index + 1;
              const isCurrentUser = player.clerkId === userId;

              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 py-4 first:pt-0 last:pb-0 ${
                    isCurrentUser ? 'bg-chalk -mx-6 px-6' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex w-10 items-center justify-center shrink-0">
                    {getRankMark(rank) || (
                      <span
                        className="font-sans text-graphite"
                        style={{ fontSize: '12px' }}
                      >
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-medium text-ink" style={{ fontSize: '14px' }}>
                        {player.username || player.firstName || 'Anonymous'}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs rounded-buttons">
                          You
                        </Badge>
                      )}
                      <span
                        className="font-sans text-graphite border border-vellum rounded-buttons px-2 py-0.5"
                        style={{ fontSize: '11px' }}
                      >
                        Lv. {player.profile?.level || 1}
                      </span>
                    </div>
                    <div
                      className="mt-0.5 flex gap-3 font-sans text-graphite"
                      style={{ fontSize: '12px' }}
                    >
                      <span>
                        {player.profile?.totalGames
                          ? Math.round((player.profile.totalWins / player.profile.totalGames) * 100)
                          : 0}% win rate
                      </span>
                      <span className="text-vellum">·</span>
                      <span>{player.statistics?.maxStreak || 0} streak</span>
                    </div>
                  </div>

                  {/* Wins count */}
                  <div className="text-right shrink-0">
                    <div
                      className="font-serif font-medium text-ink"
                      style={{ fontSize: '26px', letterSpacing: '-0.13px', lineHeight: '1' }}
                    >
                      {player.profile?.totalWins || 0}
                    </div>
                    <div className="font-sans text-graphite" style={{ fontSize: '11px' }}>wins</div>
                  </div>
                </div>
              );
            })}

            {topPlayers.length === 0 && (
              <p className="py-10 text-center font-sans text-graphite" style={{ fontSize: '15px' }}>
                No players yet. Be the first to join!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
