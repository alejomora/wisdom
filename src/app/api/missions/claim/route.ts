import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper: auto-calculate progress for a mission based on user stats
function calculateAutoProgress(mission: { category: string; requirement: number }, user: { exercisesDone: number; longestStreak: number; xp: number; lastActiveDate: string; streak: number }): number {
  switch (mission.category) {
    case 'exercises':
      return user.exercisesDone;
    case 'streak':
      return user.longestStreak;
    case 'xp':
      return user.xp;
    case 'scenarios':
      // Would need UserProgress count — return 0 for now
      return 0;
    case 'pronunciation':
      return 0;
    default:
      return 0;
  }
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

    // Check if user has a UserMission record
    let userMission = await db.userMission.findUnique({
      where: {
        userId_missionId_date: { userId, missionId, date: dateKey },
      },
    });

    if (userMission) {
      // Record exists — check if completed and not yet claimed
      if (!userMission.completed) {
        return NextResponse.json(
          { error: 'Mission not yet completed' },
          { status: 400 }
        );
      }

      if (userMission.claimed) {
        return NextResponse.json(
          { error: 'Reward already claimed' },
          { status: 400 }
        );
      }
    } else {
      // No record exists — auto-calculate progress to verify completion
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const weekStartStr = startOfWeek.toISOString().split('T')[0];

      let autoProgress = 0;

      if (mission.type === 'special') {
        // Special missions: use cumulative stats
        autoProgress = calculateAutoProgress(mission, user);
      } else if (mission.type === 'daily' && dateKey === today) {
        // Daily missions: auto-calculate today's progress
        switch (mission.category) {
          case 'streak':
            autoProgress = user.lastActiveDate === today ? 1 : 0;
            break;
          case 'exercises':
          case 'xp':
          case 'scenarios':
          case 'pronunciation':
            autoProgress = 0; // These need actual tracking
            break;
          default:
            autoProgress = 0;
        }
      } else if (mission.type === 'weekly' && dateKey === weekStartStr) {
        // Weekly missions: would need weekly tracking
        autoProgress = 0;
      }

      if (autoProgress < mission.requirement) {
        return NextResponse.json(
          { error: 'Mission not yet completed' },
          { status: 400 }
        );
      }

      // Mission IS complete based on auto-calculation — create the UserMission record
      userMission = await db.userMission.create({
        data: {
          userId,
          missionId,
          date: dateKey,
          progress: autoProgress,
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
