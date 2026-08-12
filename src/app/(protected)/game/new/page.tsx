import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { createGame } from '@/server/actions/game-actions';

interface PageProps {
  searchParams: {
    mode?: string;
    difficulty?: string;
  };
}

export default async function NewGamePage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const mode = searchParams.mode || 'INFINITE';
  const difficulty = searchParams.difficulty || 'MEDIUM';

  let result;
  try {
    result = await createGame({ mode, difficulty, discardPrevious: true });
  } catch (error) {
    // Re-throw Next.js redirect errors — they must not be swallowed
    if (isRedirectError(error)) throw error;
    console.error('Unexpected game creation error:', error);
    redirect('/dashboard?error=unexpected-error');
  }

  if ('error' in result && result.error) {
    console.error('Game creation error:', result.error);
    redirect(`/dashboard?error=${encodeURIComponent(result.error)}`);
  }

  // Success - redirect to the game
  redirect('/game');
}
