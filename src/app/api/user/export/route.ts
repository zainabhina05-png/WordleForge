import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, validateRateLimit, SecurityError } from '@/lib/security';

/**
 * GDPR Compliance: Data Export Endpoint
 * 
 * Allows users to export all their personal data in JSON format.
 * Required by GDPR Article 20 (Right to Data Portability) and Article 15 (Right of Access).
 */
export async function GET() {
  try {
    // Authentication required
    const userId = await validateAuth();
    
    // Rate limit: 3 exports per hour per user
    const clientIP = (await import('next/headers')).headers().get('x-forwarded-for') || 'unknown';
    await validateRateLimit(`user_export_${userId}_${clientIP}`, 3);

    // Get database user ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      throw new SecurityError('User not found', 'USER_NOT_FOUND');
    }

    // Fetch ALL user data across all tables
    const userData = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: {
        profile: true,
        statistics: true,
        settings: true,
        games: {
          include: {
            guesses: true,
            word: {
              select: {
                word: true,
                difficulty: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
        friendsFrom: {
          include: {
            toUser: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        friendsTo: {
          include: {
            fromUser: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        reports: true,
      },
    });

    if (!userData) {
      throw new SecurityError('User data not found', 'USER_NOT_FOUND');
    }

    // Get leaderboard entries
    const leaderboardEntries = await prisma.leaderboard.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });

    // Get audit logs related to this user
    const auditLogs = await prisma.auditLog.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      take: 100, // Last 100 audit entries
    });

    // Construct comprehensive export package
    const exportData = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        userId: userData.id,
        clerkId: userData.clerkId,
        dataFormat: 'JSON',
        gdprCompliance: 'Article 15 (Right of Access) & Article 20 (Right to Data Portability)',
      },
      personalInformation: {
        id: userData.id,
        clerkId: userData.clerkId,
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        lastLoginAt: userData.lastLoginAt,
      },
      profile: userData.profile,
      statistics: userData.statistics,
      settings: userData.settings,
      games: userData.games.map((game) => ({
        id: game.id,
        word: game.word.word, // Include answer since user owns this data
        mode: game.mode,
        difficulty: game.difficulty,
        status: game.status,
        won: game.won,
        score: game.score,
        startedAt: game.startedAt,
        completedAt: game.completedAt,
        duration: game.duration,
        hintsUsed: game.hintsUsed,
        guesses: game.guesses.map((g) => ({
          word: g.word,
          feedback: g.feedback,
          position: g.position,
          createdAt: g.createdAt,
        })),
      })),
      achievements: userData.achievements.map((ua) => ({
        achievement: ua.achievement,
        unlockedAt: ua.unlockedAt,
        progress: ua.progress,
      })),
      notifications: userData.notifications,
      leaderboardEntries,
      friends: {
        outgoing: userData.friendsFrom.map((f) => ({
          friendEmail: f.toUser.email,
          friendUsername: f.toUser.username,
          status: f.status,
          createdAt: f.createdAt,
        })),
        incoming: userData.friendsTo.map((f) => ({
          friendEmail: f.fromUser.email,
          friendUsername: f.fromUser.username,
          status: f.status,
          createdAt: f.createdAt,
        })),
      },
      reports: userData.reports,
      auditLogs: auditLogs.map((log) => ({
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        metadata: log.metadata,
        ipAddress: log.ipAddress ? '[REDACTED FOR PRIVACY]' : null, // Anonymize IPs
        createdAt: log.createdAt,
      })),
      dataUsageSummary: {
        totalGames: userData.games.length,
        totalAchievements: userData.achievements.length,
        totalNotifications: userData.notifications.length,
        totalFriends: userData.friendsFrom.length + userData.friendsTo.length,
        totalReports: userData.reports.length,
      },
    };

    // Log the export for compliance tracking
    await prisma.auditLog.create({
      data: {
        userId: dbUser.id,
        action: 'USER_DATA_EXPORT',
        entity: 'User',
        entityId: userData.clerkId,
        metadata: {
          exportedAt: new Date().toISOString(),
          ipAddress: clientIP,
        },
        ipAddress: clientIP,
      },
    });

    // Return as JSON with appropriate headers
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="wordforge_data_export_${Date.now()}.json"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    if (error instanceof SecurityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'RATE_LIMITED' ? 429 : 401 }
      );
    }
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
