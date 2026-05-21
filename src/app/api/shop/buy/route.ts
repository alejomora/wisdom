import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, rewardId } = body;

    if (!userId || !rewardId) {
      return NextResponse.json(
        { error: 'userId and rewardId are required' },
        { status: 400 }
      );
    }

    // Check user exists and has enough coins
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check reward exists
    const reward = await db.reward.findUnique({ where: { id: rewardId } });
    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (!reward.available) {
      return NextResponse.json({ error: 'Reward is not available' }, { status: 400 });
    }

    // Check if already purchased
    const existing = await db.userReward.findUnique({
      where: { userId_rewardId: { userId, rewardId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 });
    }

    // Check if user has enough coins
    if (user.coins < reward.cost) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    // Deduct coins and create purchase record
    const [updatedUser, userReward] = await Promise.all([
      db.user.update({
        where: { id: userId },
        data: { coins: user.coins - reward.cost },
      }),
      db.userReward.create({
        data: { userId, rewardId },
      }),
    ]);

    const { password: _, ...userData } = updatedUser;

    return NextResponse.json({
      user: userData,
      userReward,
      message: `Purchased ${reward.name}!`,
    });
  } catch (error) {
    console.error('Buy reward error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
