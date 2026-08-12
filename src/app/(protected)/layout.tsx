import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { withTimeout } from '@/lib/db-utils';
import { prisma } from '@/lib/db';
import { Navigation } from '@/components/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  let dbUser = null;
  
  try {
    dbUser = await withTimeout(
      prisma.user.findUnique({
        where: { clerkId: userId },
      }),
      15000,
      'Database timeout while finding user'
    );
  } catch (error) {
    console.error('Error finding user in protected layout:', error);
  }

  if (!dbUser) {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      redirect('/sign-in');
    }

    try {
      dbUser = await withTimeout(
        prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            username: clerkUser.username || undefined,
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            imageUrl: clerkUser.imageUrl || undefined,
          },
        }),
        15000,
        'Database timeout while creating user'
      );

      await Promise.all([
        withTimeout(prisma.profile.create({ data: { userId: dbUser.id } }), 15000),
        withTimeout(prisma.statistics.create({ data: { userId: dbUser.id } }), 15000),
        withTimeout(prisma.userSettings.create({ data: { userId: dbUser.id } }), 15000),
      ]);
    } catch (error) {
      console.error('Error creating user:', error);
      // Try to find user again in case of duplicate error
      try {
        dbUser = await withTimeout(
          prisma.user.findUnique({
            where: { clerkId: userId },
          }),
          15000
        );
      } catch (findError) {
        console.error('Failed to find user after creation error:', findError);
      }

      if (!dbUser) {
        redirect('/sign-in');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation user={dbUser} />
      <div className="pb-16">{children}</div>
    </div>
  );
}
