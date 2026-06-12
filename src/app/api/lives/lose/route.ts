import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.lives <= 0) return NextResponse.json({ error: 'No lives remaining', lives: 0 }, { status: 400 });

    const now = new Date();
    const lastRefill = new Date(user.livesLastRefill);
    const minutesSinceRefill = (now.getTime() - lastRefill.getTime()) / 60000;
    const livesToRefill = Math.min(Math.floor(minutesSinceRefill / 30), user.maxLives - user.lives);
    const currentLives = Math.min(user.lives + livesToRefill, user.maxLives);
    const newLives = Math.max(0, currentLives - 1);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { lives: newLives, livesLastRefill: livesToRefill > 0 ? now : user.livesLastRefill },
    });
    const { password: _, ...userData } = updatedUser;
    return NextResponse.json({ user: userData, lives: newLives });
  } catch (error) {
    console.error('Lose life error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
