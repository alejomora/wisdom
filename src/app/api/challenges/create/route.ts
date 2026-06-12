import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, scenarioId } = body;

    if (!userId || !scenarioId) {
      return NextResponse.json(
        { error: 'userId and scenarioId are required' },
        { status: 400 }
      );
    }

    // Find user and verify they have enough coins
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.coins < 1500) {
      return NextResponse.json(
        { error: 'Not enough coins. You need at least 1500 coins to create a challenge.' },
        { status: 400 }
      );
    }

    // Verify the scenario exists and has type "challenge"
    const scenario = await db.scenario.findUnique({ where: { id: scenarioId } });
    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    if (scenario.type !== 'challenge') {
      return NextResponse.json(
        { error: 'This scenario is not available for challenges.' },
        { status: 400 }
      );
    }

    // Deduct 1500 coins from user
    await db.user.update({
      where: { id: userId },
      data: { coins: user.coins - 1500 },
    });

    // Create Challenge with 7-day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const challenge = await db.challenge.create({
      data: {
        challengerId: userId,
        scenarioId,
        entryFee: 1500,
        pot: 1500,
        status: 'pending',
        expiresAt,
      },
      include: {
        challenger: { select: { id: true, name: true, avatar: true } },
        challenged: { select: { id: true, name: true, avatar: true } },
        scenario: { select: { id: true, name: true, nameEs: true, icon: true } },
      },
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    console.error('Create challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
