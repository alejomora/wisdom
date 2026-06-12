import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ENERGY_COST = 500; // coins
const MAX_ENERGY = 200;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.coins < ENERGY_COST) {
      return NextResponse.json({ error: 'Monedas insuficientes', coinsRequired: ENERGY_COST, currentCoins: user.coins }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        coins: user.coins - ENERGY_COST,
        livesLastRefill: new Date(), // Reset refill timer
      },
    });

    const { password: _, ...userData } = updatedUser;
    return NextResponse.json({ user: userData, energy: MAX_ENERGY, maxEnergy: MAX_ENERGY });
  } catch (error) {
    console.error('Buy energy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
