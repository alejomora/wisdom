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

    const lessons = await db.lesson.findMany({
      where: { scenarioId: id },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    // If userId provided, include lesson progress
    let userProgressMap: Record<string, {
      status: string;
      stars: number;
      progress: number;
    }> = {};

    if (userId) {
      const progress = await db.userProgress.findMany({
        where: {
          userId,
          lessonId: { in: lessons.map((l) => l.id) },
        },
        select: {
          lessonId: true,
          status: true,
          stars: true,
          progress: true,
        },
      });

      for (const p of progress) {
        if (p.lessonId) {
          userProgressMap[p.lessonId] = {
            status: p.status,
            stars: p.stars,
            progress: p.progress,
          };
        }
      }
    }

    const result = lessons.map((lesson) => ({
      id: lesson.id,
      scenarioId: lesson.scenarioId,
      title: lesson.title,
      titleEs: lesson.titleEs,
      description: lesson.description,
      descriptionEs: lesson.descriptionEs,
      type: lesson.type,
      order: lesson.order,
      xpReward: lesson.xpReward,
      questionCount: lesson._count.questions,
      userProgress: userProgressMap[lesson.id] ?? undefined,
    }));

    return NextResponse.json({ lessons: result });
  } catch (error) {
    console.error('Get lessons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
