import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questions = await db.question.findMany({
      where: { lessonId: id },
      orderBy: { order: 'asc' },
    });

    const result = questions.map((q) => ({
      id: q.id,
      lessonId: q.lessonId,
      type: q.type,
      prompt: q.prompt,
      promptEs: q.promptEs,
      hintEn: q.hintEn,
      hintEs: q.hintEs,
      audioText: q.audioText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      explanationEs: q.explanationEs,
      image: q.image,
      points: q.points,
      order: q.order,
    }));

    return NextResponse.json({ questions: result });
  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
