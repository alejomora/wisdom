import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const challenge = await db.challenge.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, name: true, avatar: true } },
        challenged: { select: { id: true, name: true, avatar: true } },
        winner: { select: { id: true, name: true, avatar: true } },
        scenario: { select: { id: true, name: true, nameEs: true, icon: true } },
        attempts: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { completedAt: 'asc' },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error('Get challenge result error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
