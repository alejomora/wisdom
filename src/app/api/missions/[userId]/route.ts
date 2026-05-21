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

    // Get all missions (daily and weekly)
    const allMissions = await db.mission.findMany({
      where: {
        type: { in: ['daily', 'weekly'] },
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

        // Calculate progress based on category
        let progress = todayEntry?.progress ?? 0;
        let completed = todayEntry?.completed ?? false;
        let claimed = todayEntry?.claimed ?? false;

        // Auto-calculate progress for today if no entry exists
        if (!todayEntry) {
          switch (mission.category) {
            case 'exercises':
              // Count exercises completed today from UserProgress
              progress = 0; // Will be populated when user completes exercises
              break;
            case 'streak':
              progress = user.lastActiveDate === today ? 1 : 0;
              break;
            case 'xp':
              // XP earned today would need tracking - set to 0 for now
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

    // Process weekly missions
    const weeklyMissions = allMissions
      .filter((m) => m.type === 'weekly')
      .map((mission) => {
        const dateMap = userMissionMap.get(mission.id);
        const weekEntry = dateMap?.get(weekStartStr);

        let progress = weekEntry?.progress ?? 0;
        let completed = weekEntry?.completed ?? false;
        let claimed = weekEntry?.claimed ?? false;

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

    return NextResponse.json({
      daily: dailyMissions,
      weekly: weeklyMissions,
    });
  } catch (error) {
    console.error('Get missions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
