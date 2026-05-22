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
      include: {
        progress: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
        missions: {
          include: {
            mission: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { password: _, ...userData } = user;

    // Format progress
    const progress = user.progress.map((p) => ({
      id: p.id,
      scenarioId: p.scenarioId,
      lessonId: p.lessonId,
      status: p.status,
      progress: p.progress,
      stars: p.stars,
      xpEarned: p.xpEarned,
      completedAt: p.completedAt?.toISOString() ?? null,
    }));

    // Format achievements
    const achievements = user.achievements.map((ua) => ({
      id: ua.achievement.id,
      slug: ua.achievement.slug,
      name: ua.achievement.name,
      nameEs: ua.achievement.nameEs,
      description: ua.achievement.description,
      descriptionEs: ua.achievement.descriptionEs,
      icon: ua.achievement.icon,
      category: ua.achievement.category,
      reward: ua.achievement.reward,
      unlockedAt: ua.unlockedAt.toISOString(),
    }));

    // Format mission progress
    const missionProgress = user.missions.map((um) => ({
      id: um.mission.id,
      slug: um.mission.slug,
      title: um.mission.title,
      titleEs: um.mission.titleEs,
      description: um.mission.description,
      descriptionEs: um.mission.descriptionEs,
      type: um.mission.type,
      category: um.mission.category,
      requirement: um.mission.requirement,
      rewardXp: um.mission.rewardXp,
      rewardCoins: um.mission.rewardCoins,
      icon: um.mission.icon,
      progress: um.progress,
      completed: um.completed,
      claimed: um.claimed,
      date: um.date,
    }));

    return NextResponse.json({
      user: userData,
      progress,
      achievements,
      missions: missionProgress,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
