import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // This endpoint just signals that a reset was requested.
    // The actual re-seeding should be done via `bun run prisma/seed.ts` on the server.
    // For now, we'll just clean user-specific data and reset the demo user.
    const { db } = await import('@/lib/db');

    // Delete all user-specific data
    await db.userAnswer.deleteMany();
    await db.examResult.deleteMany();
    await db.userProgress.deleteMany();
    await db.userAchievement.deleteMany();
    await db.userMission.deleteMany();
    await db.ranking.deleteMany();
    await db.notification.deleteMany();
    await db.userReward.deleteMany();

    // Reset the demo user to level 1
    const demoUser = await db.user.findFirst({ where: { email: 'demo@lingoquest.com' } });
    if (demoUser) {
      await db.user.update({
        where: { id: demoUser.id },
        data: {
          xp: 0,
          coins: 50,
          totalStars: 0,
          level: 1,
          lives: 5,
          maxLives: 5,
          streak: 0,
          longestStreak: 0,
          wordsLearned: 0,
          exercisesDone: 0,
          accuracy: 0,
          listeningScore: 0,
          writingScore: 0,
          speakingScore: 0,
          currentLevelId: 'basic',
          title: 'Principiante',
        },
      });
    }

    // Unlock the first scenario for the demo user
    if (demoUser) {
      const firstScenario = await db.scenario.findFirst({
        where: { isStarter: true },
        orderBy: { order: 'asc' },
      });
      if (firstScenario) {
        await db.userProgress.create({
          data: {
            userId: demoUser.id,
            scenarioId: firstScenario.id,
            status: 'unlocked',
            progress: 0,
            stars: 0,
            xpEarned: 0,
          },
        });
      }

      // Create a ranking entry
      await db.ranking.create({
        data: {
          userId: demoUser.id,
          type: 'global',
          xp: 0,
          rank: 999,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Datos reseteados. El usuario comienza en nivel 1.' });
  } catch (error) {
    console.error('Reset database error:', error);
    return NextResponse.json({ error: 'Error al resetear la base de datos' }, { status: 500 });
  }
}
