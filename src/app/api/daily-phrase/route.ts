import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get current day of year (1-366)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Count total phrases
    const totalPhrases = await db.dailyPhrase.count();

    // If no phrases exist, return a default phrase
    if (totalPhrases === 0) {
      return NextResponse.json({
        phrase: {
          id: 'default',
          phrase: 'Break a leg',
          phraseEs: '¡Mucha suerte!',
          context: 'Used to wish someone good luck, especially before a performance',
          example: 'Break a leg in your audition today!',
          exampleEs: '¡Mucha suerte en tu audición hoy!',
          category: 'general',
        },
      });
    }

    // Calculate which phrase to show (cycle through based on day)
    const phraseIndex = dayOfYear % totalPhrases;

    // Find the phrase at that index using skip + take
    const phrases = await db.dailyPhrase.findMany({
      skip: phraseIndex,
      take: 1,
    });

    const phrase = phrases[0];

    return NextResponse.json({
      phrase: {
        id: phrase.id,
        phrase: phrase.phrase,
        phraseEs: phrase.phraseEs,
        context: phrase.context,
        example: phrase.example,
        exampleEs: phrase.exampleEs,
        category: phrase.category,
      },
    });
  } catch (error) {
    console.error('Get daily phrase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
