import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, coins, xp, lives, streak, longestStreak, lastActiveDate, infiniteLivesUntil } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (typeof coins === 'number') updateData.coins = coins
    if (typeof xp === 'number') updateData.xp = xp
    if (typeof lives === 'number') updateData.lives = lives
    if (typeof streak === 'number') updateData.streak = streak
    if (typeof longestStreak === 'number') updateData.longestStreak = longestStreak
    if (typeof lastActiveDate === 'string') updateData.lastActiveDate = lastActiveDate
    if (typeof infiniteLivesUntil === 'number') updateData.infiniteLivesUntil = infiniteLivesUntil

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    // Return updated user data (exclude password)
    const { password: _, ...userData } = user
    return NextResponse.json({ user: userData })
  } catch (error: any) {
    console.error('User sync error:', error)
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 })
  }
}
