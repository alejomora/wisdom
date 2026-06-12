import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const LIFE_PACKAGES: Record<string, { lives: number; cost: number }> = {
  small: { lives: 5, cost: 1000 },
  medium: { lives: 10, cost: 1800 },
  large: { lives: 15, cost: 2500 },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, package: packageName } = body;
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const pkg = LIFE_PACKAGES[packageName];
    if (!pkg) return NextResponse.json({ error: 'Invalid package. Use: small, medium, or large' }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.coins < pkg.cost) return NextResponse.json({ error: 'Monedas insuficientes', coinsRequired: pkg.cost, currentCoins: user.coins }, { status: 400 });

    const now = new Date();
    const lastRefill = new Date(user.livesLastRefill);
    const minutesSinceRefill = (now.getTime() - lastRefill.getTime()) / 60000;
    const livesToRefill = Math.min(Math.floor(minutesSinceRefill / 30), user.maxLives - user.lives);
    const currentLives = Math.min(user.lives + livesToRefill, user.maxLives);
    const newLives = Math.min(currentLives + pkg.lives, 99);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { coins: user.coins - pkg.cost, lives: newLives, maxLives: Math.max(user.maxLives, 5), livesLastRefill: now },
    });
    const { password: _, ...userData } = updatedUser;
    return NextResponse.json({ user: userData, lives: newLives, livesAdded: pkg.lives, coinsDeducted: pkg.cost });
  } catch (error) {
    console.error('Buy lives error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
