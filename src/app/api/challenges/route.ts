import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Build where clause: pending or active challenges, plus user's own if userId provided
    const where: Prisma.ChallengeWhereInput = userId
      ? {
          OR: [
            { status: { in: ['pending', 'active'] } },
            { challengerId: userId },
            { challengedId: userId },
          ],
        }
      : {
          status: { in: ['pending', 'active'] },
        };

    const challenges = await db.challenge.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('List challenges error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
