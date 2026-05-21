import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lessons = await db.lesson.findMany({
      where: { scenarioId: id },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

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
