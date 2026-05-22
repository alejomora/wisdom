import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    // Get all user's purchased rewards
    const userRewards = await db.userReward.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { purchased: 'desc' },
    });

    const inventory = userRewards.map((ur) => ({
      id: ur.id,
      rewardId: ur.reward.id,
      slug: ur.reward.slug,
      name: ur.reward.name,
      nameEs: ur.reward.nameEs,
      description: ur.reward.description,
      descriptionEs: ur.reward.descriptionEs,
      type: ur.reward.type,
      icon: ur.reward.icon,
      rarity: ur.reward.rarity,
      cost: ur.reward.cost,
      equipped: ur.equipped,
      purchased: ur.purchased.toISOString(),
    }));

    // Also get all available rewards for the shop
    const allRewards = await db.reward.findMany({
      where: { available: true },
      orderBy: { cost: 'asc' },
    });

    const purchasedIds = new Set(userRewards.map((ur) => ur.rewardId));

    const shopItems = allRewards.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      nameEs: r.nameEs,
      description: r.description,
      descriptionEs: r.descriptionEs,
      type: r.type,
      icon: r.icon,
      rarity: r.rarity,
      cost: r.cost,
      purchased: purchasedIds.has(r.id),
    }));

    return NextResponse.json({ inventory, shopItems });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
