import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getActiveGame } from '@/server/actions/game-actions';
import { GameClient } from '@/features/game/components/game-client';

export default async function GamePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const result = await getActiveGame();

  if ('error' in result || !result.game) {
    redirect('/game/new?mode=INFINITE&difficulty=MEDIUM');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GameClient game={result.game} />
    </div>
  );
}
