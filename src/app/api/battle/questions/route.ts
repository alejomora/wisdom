import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = Math.min(parseInt(searchParams.get('count') || '5'), 20);

    // Get all question IDs
    const allQuestions = await db.question.findMany({
      select: { id: true, type: true },
    });

    if (allQuestions.length === 0) {
      return NextResponse.json({ questions: [] });
    }

    // Shuffle and pick random questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    // Fetch full question data for selected IDs
    const questions = await db.question.findMany({
      where: { id: { in: selected.map(q => q.id) } },
    });

    // Shuffle the order of the questions
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

    return NextResponse.json({ questions: shuffledQuestions });
  } catch (error) {
    console.error('Battle questions error:', error);
    return NextResponse.json(
      { error: 'Failed to load battle questions' },
      { status: 500 }
    );
  }
}
