import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? undefined;

    const scenarios = await db.scenario.findMany({
      where: { levelId: id },
      orderBy: { order: 'asc' },
    });

    // If userId provided, include user progress for each scenario
    let userProgressMap: Record<string, {
      id: string;
      status: string;
      progress: number;
      stars: number;
      xpEarned: number;
      completedAt: string | null;
    }> = {};

    if (userId) {
      const progress = await db.userProgress.findMany({
        where: {
          userId,
          scenarioId: { in: scenarios.map((s) => s.id) },
        },
      });

      for (const p of progress) {
        if (p.scenarioId) {
          userProgressMap[p.scenarioId] = {
            id: p.id,
            status: p.status,
            progress: p.progress,
            stars: p.stars,
            xpEarned: p.xpEarned,
            completedAt: p.completedAt?.toISOString() ?? null,
          };
        }
      }
    }

    const result = scenarios.map((scenario) => ({
      id: scenario.id,
      levelId: scenario.levelId,
      slug: scenario.slug,
      name: scenario.name,
      nameEs: scenario.nameEs,
      description: scenario.description,
      descriptionEs: scenario.descriptionEs,
      icon: scenario.icon,
      image: scenario.image,
      difficulty: scenario.difficulty,
      xpReward: scenario.xpReward,
      order: scenario.order,
      isStarter: scenario.isStarter,
      progress: userProgressMap[scenario.id] ?? undefined,
    }));

    return NextResponse.json({ scenarios: result });
  } catch (error) {
    console.error('Get scenarios error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
