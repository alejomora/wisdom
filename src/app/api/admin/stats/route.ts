import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Total users
    const totalUsers = await db.user.count();

    // Total exercises completed (sum of exercisesDone)
    const exercisesResult = await db.user.aggregate({
      _sum: { exercisesDone: true },
    });
    const totalExercisesCompleted = exercisesResult._sum.exercisesDone ?? 0;

    // Total XP earned (sum of all users' xp)
    const xpResult = await db.user.aggregate({
      _sum: { xp: true },
    });
    const totalXpEarned = xpResult._sum.xp ?? 0;

    // Active users today (users whose lastActiveDate is today)
    const today = new Date().toISOString().split('T')[0];
    const activeUsersToday = await db.user.count({
      where: { lastActiveDate: today },
    });

    return NextResponse.json({
      totalUsers,
      totalExercisesCompleted,
      totalXpEarned,
      activeUsersToday,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
