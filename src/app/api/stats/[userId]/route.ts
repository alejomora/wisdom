import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Find user by ID
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 1. Calculate accuracy by exercise type
    // Get all UserAnswer records for this user, including the related Question
    const userAnswers = await db.userAnswer.findMany({
      where: { userId },
      include: {
        question: {
          select: { type: true },
        },
      },
    });

    // Group by question type and calculate accuracy
    const typeStats: Record<string, { correct: number; total: number }> = {};

    for (const answer of userAnswers) {
      const type = answer.question.type;
      if (!typeStats[type]) {
        typeStats[type] = { correct: 0, total: 0 };
      }
      typeStats[type].total += 1;
      if (answer.isCorrect) {
        typeStats[type].correct += 1;
      }
    }

    const accuracyByType: Record<
      string,
      { correct: number; total: number; accuracy: number }
    > = {};

    for (const [type, stats] of Object.entries(typeStats)) {
      accuracyByType[type] = {
        correct: stats.correct,
        total: stats.total,
        accuracy:
          stats.total > 0
            ? Math.round((stats.correct / stats.total) * 10000) / 100
            : 0,
      };
    }

    // 2. Calculate weekly progress (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyProgressRecords = await db.userProgress.findMany({
      where: {
        userId,
        status: 'completed',
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        createdAt: true,
      },
    });

    // Build day name map and count completions per day
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const weeklyProgress: Record<string, number> = {};

    // Initialize all 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = dayNames[date.getDay()];
      weeklyProgress[dayName] = 0;
    }

    // Count completed lessons per day
    for (const record of weeklyProgressRecords) {
      const dayName = dayNames[record.createdAt.getDay()];
      if (dayName in weeklyProgress) {
        weeklyProgress[dayName] += 1;
      }
    }

    // 3. Challenge stats
    const challengesTotal = user.challengeWins + user.challengeLosses;
    const winRate =
      challengesTotal > 0
        ? Math.round((user.challengeWins / challengesTotal) * 10000) / 100
        : 0;

    // 4. Level progress calculation
    // XP thresholds: each level requires progressively more XP
    // Simple formula: level N requires N * 100 XP total
    const currentLevel = user.level;
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpForNextLevel = currentLevel * 100;
    const xpInLevel = user.xp - xpForCurrentLevel;

    const levelProgress = {
      current: currentLevel,
      xpInLevel: Math.max(0, xpInLevel),
      xpForNext: xpForNextLevel - xpForCurrentLevel,
    };

    // 5. Build comprehensive response
    return NextResponse.json({
      user: {
        name: user.name,
        avatar: user.avatar,
        frame: user.frame,
        title: user.title,
        xp: user.xp,
        coins: user.coins,
        level: user.level,
        streak: user.streak,
        longestStreak: user.longestStreak,
        wordsLearned: user.wordsLearned,
        exercisesDone: user.exercisesDone,
        totalStudyTime: user.totalStudyTime,
        accuracy: user.accuracy,
        listeningScore: user.listeningScore,
        writingScore: user.writingScore,
        speakingScore: user.speakingScore,
        challengeWins: user.challengeWins,
        challengeLosses: user.challengeLosses,
      },
      accuracyByType,
      weeklyProgress,
      challengesTotal,
      winRate,
      levelProgress,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
