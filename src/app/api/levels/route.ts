import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const levels = await db.level.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { scenarios: true },
        },
      },
    });

    // For each level, count total lessons and (if userId provided) completed lessons
    const result = await Promise.all(
      levels.map(async (level) => {
        // Count total lessons in this level
        const totalLessons = await db.lesson.count({
          where: {
            scenario: { levelId: level.id },
          },
        });

        let completedLessons = 0;
        if (userId) {
          // Count completed lessons for this user in this level
          completedLessons = await db.userProgress.count({
            where: {
              userId,
              lessonId: { not: null },
              status: 'completed',
              lesson: {
                scenario: { levelId: level.id },
              },
            },
          });
        }

        return {
          id: level.id,
          slug: level.slug,
          name: level.name,
          nameEs: level.nameEs,
          description: level.description,
          descriptionEs: level.descriptionEs,
          icon: level.icon,
          color: level.color,
          order: level.order,
          minXp: level.minXp,
          scenarioCount: level._count.scenarios,
          totalLessons,
          completedLessons,
        };
      })
    );

    return NextResponse.json({ levels: result });
  } catch (error) {
    console.error('Get levels error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
