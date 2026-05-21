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

    // Check user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check user owns this reward
    const userReward = await db.userReward.findUnique({
      where: { userId_rewardId: { userId, rewardId } },
      include: { reward: true },
    });

    if (!userReward) {
      return NextResponse.json({ error: 'You do not own this item' }, { status: 400 });
    }

    const reward = userReward.reward;
    const updateData: Record<string, string> = {};

    switch (reward.type) {
      case 'avatar':
        updateData.avatar = reward.icon;
        // Unequip all other avatars
        await db.userReward.updateMany({
          where: { userId, reward: { type: 'avatar' }, equipped: true },
          data: { equipped: false },
        });
        break;
      case 'frame':
        updateData.frame = reward.icon;
        // Unequip all other frames
        await db.userReward.updateMany({
          where: { userId, reward: { type: 'frame' }, equipped: true },
          data: { equipped: false },
        });
        break;
      case 'title':
        updateData.title = reward.nameEs || reward.name;
        // Unequip all other titles
        await db.userReward.updateMany({
          where: { userId, reward: { type: 'title' }, equipped: true },
          data: { equipped: false },
        });
        break;
      case 'skin':
        updateData.theme = reward.slug;
        await db.userReward.updateMany({
          where: { userId, reward: { type: 'skin' }, equipped: true },
          data: { equipped: false },
        });
        break;
      default:
        return NextResponse.json({ error: 'Unknown reward type' }, { status: 400 });
    }

    // Equip this item
    await db.userReward.update({
      where: { id: userReward.id },
      data: { equipped: true },
    });

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, ...userData } = updatedUser;

    return NextResponse.json({
      user: userData,
      message: `Equipped ${reward.name}!`,
    });
  } catch (error) {
    console.error('Equip reward error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
