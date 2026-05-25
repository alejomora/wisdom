import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, userId, amount, name, email, password, role } = body

    switch (action) {
      case 'give_lives': {
        if (!userId || !amount) {
          return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 })
        }
        const user = await db.user.update({
          where: { id: userId },
          data: { lives: { increment: amount } },
        })
        return NextResponse.json({ message: `Added ${amount} lives to ${user.name}`, user })
      }

      case 'give_coins': {
        if (!userId || !amount) {
          return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 })
        }
        const user = await db.user.update({
          where: { id: userId },
          data: { coins: { increment: amount } },
        })
        return NextResponse.json({ message: `Added ${amount} coins to ${user.name}`, user })
      }

      case 'give_xp': {
        if (!userId || !amount) {
          return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 })
        }
        const user = await db.user.update({
          where: { id: userId },
          data: { xp: { increment: amount } },
        })
        return NextResponse.json({ message: `Added ${amount} XP to ${user.name}`, user })
      }

      case 'block': {
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }
        const user = await db.user.update({
          where: { id: userId },
          data: { blocked: true },
        })
        return NextResponse.json({ message: `Blocked ${user.name}`, user })
      }

      case 'unblock': {
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }
        const user = await db.user.update({
          where: { id: userId },
          data: { blocked: false },
        })
        return NextResponse.json({ message: `Unblocked ${user.name}`, user })
      }

      case 'create_user': {
        if (!name || !email || !password) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }
        // Check if email already exists
        const existing = await db.user.findUnique({ where: { email } })
        if (existing) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
        }
        const user = await db.user.create({
          data: {
            name,
            email,
            password, // In production, hash this!
            role: role || 'user',
            avatar: '🎯',
          },
        })
        return NextResponse.json({ message: `Created user ${user.name}`, user })
      }

      case 'delete_user': {
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }
        // Don't allow deleting admin users
        const targetUser = await db.user.findUnique({ where: { id: userId } })
        if (!targetUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        if (targetUser.role === 'admin') {
          return NextResponse.json({ error: 'Cannot delete admin users' }, { status: 403 })
        }
        // Delete related records first
        await db.userAnswer.deleteMany({ where: { userId } })
        await db.userMission.deleteMany({ where: { userId } })
        await db.userAchievement.deleteMany({ where: { userId } })
        await db.userReward.deleteMany({ where: { userId } })
        await db.userProgress.deleteMany({ where: { userId } })
        await db.ranking.deleteMany({ where: { userId } })
        await db.notification.deleteMany({ where: { userId } })
        await db.user.delete({ where: { id: userId } })
        return NextResponse.json({ message: `Deleted user ${targetUser.name}` })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Admin action error:', error)
    return NextResponse.json({ error: error.message || 'Action failed' }, { status: 500 })
  }
}
