import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper: dynamically calculate progress for a mission based on user stats
async function calculateDynamicProgress(
  mission: { type: string; category: string; requirement: number },
  user: { id: string; exercisesDone: number; longestStreak: number; xp: number; streak: number; lastActiveDate: string },
  dateKey: string
): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const weekStartStr = startOfWeek.toISOString().split('T')[0];

  if (mission.type === 'special') {
    // Special missions: use cumulative stats
    switch (mission.category) {
      case 'exercises':
        return user.exercisesDone;
      case 'streak':
        return user.longestStreak;
      case 'xp':
        return user.xp;
      case 'scenarios': {
        const completedScenarios = await db.userProgress.count({
          where: {
            userId: user.id,
            scenarioId: { not: null },
            status: 'completed',
          },
        });
        return completedScenarios;
      }
      case 'pronunciation':
        return 0;
      default:
        return 0;
    }
  } else if (mission.type === 'daily' && dateKey === today) {
    // Daily missions: calculate today's progress
    switch (mission.category) {
      case 'streak':
        return user.lastActiveDate === today ? 1 : 0;
      case 'exercises': {
        // Count exercises completed today
        const todayStart = new Date(today);
        const completedToday = await db.userProgress.count({
          where: {
            userId: user.id,
            lessonId: { not: null },
            status: 'completed',
            completedAt: { gte: todayStart },
          },
        });
        return completedToday;
      }
      case 'xp': {
        // XP earned today from completed lessons
        const todayStart = new Date(today);
        const xpToday = await db.userProgress.aggregate({
          where: {
            userId: user.id,
            lessonId: { not: null },
            status: 'completed',
            completedAt: { gte: todayStart },
          },
          _sum: { xpEarned: true },
        });
        return xpToday._sum.xpEarned ?? 0;
      }
      case 'scenarios': {
        const todayStart = new Date(today);
        const scenariosToday = await db.userProgress.count({
          where: {
            userId: user.id,
            scenarioId: { not: null },
            status: 'completed',
            completedAt: { gte: todayStart },
          },
        });
        return scenariosToday;
      }
      default:
        return 0;
    }
  } else if (mission.type === 'weekly' && dateKey === weekStartStr) {
    // Weekly missions: calculate this week's progress
    const weekStart = new Date(weekStartStr);
    switch (mission.category) {
      case 'exercises': {
        const completedThisWeek = await db.userProgress.count({
          where: {
            userId: user.id,
            lessonId: { not: null },
            status: 'completed',
            completedAt: { gte: weekStart },
          },
        });
        return completedThisWeek;
      }
      case 'xp': {
        const xpThisWeek = await db.userProgress.aggregate({
          where: {
            userId: user.id,
            lessonId: { not: null },
            status: 'completed',
            completedAt: { gte: weekStart },
          },
          _sum: { xpEarned: true },
        });
        return xpThisWeek._sum.xpEarned ?? 0;
      }
      case 'scenarios': {
        const scenariosThisWeek = await db.userProgress.count({
          where: {
            userId: user.id,
            scenarioId: { not: null },
            status: 'completed',
            completedAt: { gte: weekStart },
          },
        });
        return scenariosThisWeek;
      }
      case 'streak':
        return user.streak;
      default:
        return 0;
    }
  }

  return 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, missionId, date } = body;

    if (!userId || !missionId) {
      return NextResponse.json(
        { error: 'userId and missionId are required' },
        { status: 400 }
      );
    }

    // Check user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check mission exists
    const mission = await db.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Determine the date key
    const dateKey = date || new Date().toISOString().split('T')[0];

    // ALWAYS dynamically calculate progress to verify completion
    const dynamicProgress = await calculateDynamicProgress(mission, user, dateKey);
    const isDynamicallyCompleted = dynamicProgress >= mission.requirement;

    // Check if user has a UserMission record
    let userMission = await db.userMission.findUnique({
      where: {
        userId_missionId_date: { userId, missionId, date: dateKey },
      },
    });

    if (userMission) {
      // Record exists — check if already claimed
      if (userMission.claimed) {
        return NextResponse.json(
          { error: 'Reward already claimed' },
          { status: 400 }
        );
      }

      // If the record shows not completed, but dynamic calculation shows it IS completed,
      // update the record to reflect the actual state
      if (!userMission.completed && isDynamicallyCompleted) {
        userMission = await db.userMission.update({
          where: { id: userMission.id },
          data: { completed: true, progress: dynamicProgress },
        });
      }

      // If still not completed after dynamic check, reject
      if (!userMission.completed) {
        return NextResponse.json(
          { error: 'Mission not yet completed' },
          { status: 400 }
        );
      }
    } else {
      // No record exists — verify completion using dynamic calculation
      if (!isDynamicallyCompleted) {
        return NextResponse.json(
          { error: 'Mission not yet completed' },
          { status: 400 }
        );
      }

      // Mission IS complete based on dynamic calculation — create the UserMission record
      userMission = await db.userMission.create({
        data: {
          userId,
          missionId,
          date: dateKey,
          progress: dynamicProgress,
          completed: true,
          claimed: false,
        },
      });
    }

    // Mark as claimed and give rewards
    await db.userMission.update({
      where: { id: userMission.id },
      data: { claimed: true },
    });

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        xp: user.xp + mission.rewardXp,
        coins: user.coins + mission.rewardCoins,
      },
    });

    const { password: _, ...userData } = updatedUser;

    return NextResponse.json({
      user: userData,
      mission: {
        id: mission.id,
        title: mission.title,
        titleEs: mission.titleEs,
        rewardXp: mission.rewardXp,
        rewardCoins: mission.rewardCoins,
      },
      message: `Claimed ${mission.rewardXp} XP and ${mission.rewardCoins} coins!`,
    });
  } catch (error) {
    console.error('Claim mission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
