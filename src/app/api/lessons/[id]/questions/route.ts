import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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

    const mapped = questions.map((q) => ({
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

    // Shuffle questions for variety (but keep flashcards first if they exist for learning flow)
    const flashcards = mapped.filter((q) => q.type === 'flashcard');
    const others = mapped.filter((q) => q.type !== 'flashcard');

    const shuffledOthers = shuffleArray(others);

    // Show flashcards first (learning phase), then shuffled other questions (practice phase)
    // Limit to max 8 questions per session for a good experience
    const maxQuestions = 8;
    const selectedOthers = shuffledOthers.slice(0, maxQuestions - flashcards.length);
    const result = [...flashcards, ...selectedOthers];

    return NextResponse.json({ questions: result });
  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
