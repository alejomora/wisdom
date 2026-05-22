import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get today's date and this week's date range
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekStartStr = startOfWeek.toISOString().split('T')[0];

    // Get all missions (daily, weekly and special)
    const allMissions = await db.mission.findMany({
      where: {
        type: { in: ['daily', 'weekly', 'special'] },
      },
    });

    // Get user's mission progress
    const userMissions = await db.userMission.findMany({
      where: { userId },
    });

    // Build a lookup map for quick access
    const userMissionMap = new Map<string, Map<string, typeof userMissions[0]>>();
    for (const um of userMissions) {
      if (!userMissionMap.has(um.missionId)) {
        userMissionMap.set(um.missionId, new Map());
      }
      userMissionMap.get(um.missionId)!.set(um.date, um);
    }

    // Process daily missions
    const dailyMissions = allMissions
      .filter((m) => m.type === 'daily')
      .map((mission) => {
        // Check if there's a user mission entry for today
        const dateMap = userMissionMap.get(mission.id);
        const todayEntry = dateMap?.get(today);

        let progress = todayEntry?.progress ?? 0;
        let completed = todayEntry?.completed ?? false;
        let claimed = todayEntry?.claimed ?? false;

        // Auto-calculate progress for today if no entry exists
        if (!todayEntry) {
          switch (mission.category) {
            case 'exercises':
              progress = 0; // Will be populated when user completes exercises
              break;
            case 'streak':
              progress = user.lastActiveDate === today ? 1 : 0;
              break;
            case 'xp':
              progress = 0;
              break;
            case 'scenarios':
              progress = 0;
              break;
            default:
              progress = 0;
          }
          completed = progress >= mission.requirement;
        }

        return {
          id: mission.id,
          slug: mission.slug,
          title: mission.title,
          titleEs: mission.titleEs,
          description: mission.description,
          descriptionEs: mission.descriptionEs,
          type: mission.type,
          category: mission.category,
          requirement: mission.requirement,
          rewardXp: mission.rewardXp,
          rewardCoins: mission.rewardCoins,
          icon: mission.icon,
          progress,
          completed,
          claimed,
          date: today,
        };
      });

    // Process weekly missions with auto-calculation
    const weeklyMissionsPromises = allMissions
      .filter((m) => m.type === 'weekly')
      .map(async (mission) => {
        const dateMap = userMissionMap.get(mission.id);
        const weekEntry = dateMap?.get(weekStartStr);

        let progress = weekEntry?.progress ?? 0;
        let completed = weekEntry?.completed ?? false;
        let claimed = weekEntry?.claimed ?? false;

        // Auto-calculate progress for this week if no entry exists
        if (!weekEntry) {
          const weekStart = new Date(weekStartStr);
          switch (mission.category) {
            case 'exercises': {
              const completedThisWeek = await db.userProgress.count({
                where: {
                  userId,
                  lessonId: { not: null },
                  scenarioId: null,
                  status: 'completed',
                  completedAt: { gte: weekStart },
                },
              });
              progress = completedThisWeek;
              break;
            }
            case 'xp': {
              const xpThisWeek = await db.userProgress.aggregate({
                where: {
                  userId,
                  lessonId: { not: null },
                  scenarioId: null,
                  status: 'completed',
                  completedAt: { gte: weekStart },
                },
                _sum: { xpEarned: true },
              });
              progress = xpThisWeek._sum.xpEarned ?? 0;
              break;
            }
            case 'scenarios': {
              const scenariosThisWeek = await db.userProgress.count({
                where: {
                  userId,
                  scenarioId: { not: null },
                  lessonId: null,
                  status: 'completed',
                  completedAt: { gte: weekStart },
                },
              });
              progress = scenariosThisWeek;
              break;
            }
            case 'streak':
              progress = user.streak;
              break;
            default:
              progress = 0;
          }
          completed = progress >= mission.requirement;
        }

        return {
          id: mission.id,
          slug: mission.slug,
          title: mission.title,
          titleEs: mission.titleEs,
          description: mission.description,
          descriptionEs: mission.descriptionEs,
          type: mission.type,
          category: mission.category,
          requirement: mission.requirement,
          rewardXp: mission.rewardXp,
          rewardCoins: mission.rewardCoins,
          icon: mission.icon,
          progress,
          completed,
          claimed,
          date: weekStartStr,
        };
      });

    const weeklyMissions = await Promise.all(weeklyMissionsPromises);

    // Process special missions (one-time, based on cumulative stats)
    const specialMissionsPromises = allMissions
      .filter((m) => m.type === 'special')
      .map(async (mission) => {
        // Special missions use a fixed date key "special"
        const dateMap = userMissionMap.get(mission.id);
        const specialEntry = dateMap?.get('special');

        let progress = specialEntry?.progress ?? 0;
        let completed = specialEntry?.completed ?? false;
        let claimed = specialEntry?.claimed ?? false;

        // Auto-calculate progress based on cumulative stats
        if (!specialEntry) {
          switch (mission.category) {
            case 'exercises':
              progress = user.exercisesDone;
              break;
            case 'streak':
              progress = user.longestStreak;
              break;
            case 'xp':
              progress = user.xp;
              break;
            case 'scenarios': {
              // Count completed scenario progress records (scenarioId set, lessonId null)
              const completedScenarios = await db.userProgress.count({
                where: {
                  userId,
                  scenarioId: { not: null },
                  lessonId: null,
                  status: 'completed',
                },
              });
              progress = completedScenarios;
              break;
            }
            default:
              progress = 0;
          }
          completed = progress >= mission.requirement;
        }

        return {
          id: mission.id,
          slug: mission.slug,
          title: mission.title,
          titleEs: mission.titleEs,
          description: mission.description,
          descriptionEs: mission.descriptionEs,
          type: mission.type,
          category: mission.category,
          requirement: mission.requirement,
          rewardXp: mission.rewardXp,
          rewardCoins: mission.rewardCoins,
          icon: mission.icon,
          progress,
          completed,
          claimed,
          date: 'special',
        };
      });

    const specialMissions = await Promise.all(specialMissionsPromises);

    return NextResponse.json({
      daily: dailyMissions,
      weekly: weeklyMissions,
      special: specialMissions,
    });
  } catch (error) {
    console.error('Get missions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
