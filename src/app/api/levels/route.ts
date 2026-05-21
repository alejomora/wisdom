import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const levels = await db.level.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { scenarios: true },
        },
      },
    });

    const result = levels.map((level) => ({
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
    }));

    return NextResponse.json({ levels: result });
  } catch (error) {
    console.error('Get levels error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
