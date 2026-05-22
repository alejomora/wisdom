import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') ?? 'global';

    // Validate type
    const validTypes = ['global', 'weekly', 'monthly'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be global, weekly, or monthly' },
        { status: 400 }
      );
    }

    // For global ranking, directly query users by XP
    if (type === 'global') {
      const users = await db.user.findMany({
        orderBy: { xp: 'desc' },
        take: 20,
        select: {
          id: true,
          name: true,
          avatar: true,
          xp: true,
          level: true,
        },
      });

      const rankings = users.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
      }));

      return NextResponse.json({ rankings, type: 'global' });
    }

    // For weekly/monthly, compute period string
    let period = '';
    const now = new Date();

    if (type === 'weekly') {
      // ISO week: YYYY-WXX
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(
        ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
      );
      period = `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
    } else if (type === 'monthly') {
      period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    // Try to get from Ranking table first
    const existingRankings = await db.ranking.findMany({
      where: { type, period },
      orderBy: { rank: 'asc' },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
          },
        },
      },
    });

    if (existingRankings.length > 0) {
      const rankings = existingRankings.map((r) => ({
        rank: r.rank,
        userId: r.userId,
        name: r.user.name,
        avatar: r.user.avatar,
        xp: r.xp,
        level: r.user.level,
      }));
      return NextResponse.json({ rankings, type, period });
    }

    // Fallback: return global rankings for weekly/monthly if no period data exists
    const users = await db.user.findMany({
      orderBy: { xp: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
      },
    });

    const rankings = users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
    }));

    return NextResponse.json({ rankings, type, period });
  } catch (error) {
    console.error('Get rankings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
