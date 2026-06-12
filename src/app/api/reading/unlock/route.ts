import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const UNLOCK_COST_COINS = 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, scenarioId } = body;
    if (!userId || !scenarioId) return NextResponse.json({ error: 'userId and scenarioId are required' }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.coins < UNLOCK_COST_COINS) return NextResponse.json({ error: 'Monedas insuficientes', coinsRequired: UNLOCK_COST_COINS, currentCoins: user.coins }, { status: 400 });

    // Check if scenario exists (reading scenarios use hardcoded IDs like 'rf-basic-1')
    // They may not exist in the DB, so we handle that gracefully
    const scenario = await db.scenario.findUnique({ where: { id: scenarioId } }).catch(() => null);

    const existingProgress = await db.userProgress.findUnique({ where: { userId_scenarioId: { userId, scenarioId } } }).catch(() => null);
    if (existingProgress && existingProgress.status !== 'locked') return NextResponse.json({ error: 'Already unlocked' }, { status: 400 });

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { coins: user.coins - UNLOCK_COST_COINS },
    });

    if (existingProgress) {
      await db.userProgress.update({ where: { id: existingProgress.id }, data: { status: 'unlocked' } });
    } else {
      // Only create progress if scenario exists in DB, otherwise just deduct coins
      if (scenario) {
        await db.userProgress.create({ data: { userId, scenarioId, status: 'unlocked', progress: 0, stars: 0, xpEarned: 0 } });
      }
    }

    const { password: _, ...userData } = updatedUser;
    return NextResponse.json({ user: userData, scenarioId, status: 'unlocked', coinsDeducted: UNLOCK_COST_COINS });
  } catch (error) {
    console.error('Reading unlock error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
