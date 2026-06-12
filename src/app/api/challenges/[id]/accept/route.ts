import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Find the challenge
    const challenge = await db.challenge.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, name: true } },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Verify challenge status is pending
    if (challenge.status !== 'pending') {
      return NextResponse.json(
        { error: 'Challenge is not available for acceptance' },
        { status: 400 }
      );
    }

    // Verify userId is not the challenger
    if (challenge.challengerId === userId) {
      return NextResponse.json(
        { error: 'You cannot accept your own challenge' },
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
        { error: 'Not enough coins. You need at least 1500 coins to accept a challenge.' },
        { status: 400 }
      );
    }

    // Deduct 1500 coins from user and update challenge in a transaction
    const [, updatedChallenge] = await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { coins: user.coins - 1500 },
      }),
      db.challenge.update({
        where: { id },
        data: {
          challengedId: userId,
          pot: 3000,
          status: 'active',
        },
        include: {
          challenger: { select: { id: true, name: true, avatar: true } },
          challenged: { select: { id: true, name: true, avatar: true } },
          scenario: { select: { id: true, name: true, nameEs: true, icon: true } },
          attempts: {
            include: {
              user: { select: { id: true, name: true, avatar: true } },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ challenge: updatedChallenge });
  } catch (error) {
    console.error('Accept challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
