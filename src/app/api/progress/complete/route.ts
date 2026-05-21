import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, stars, xpEarned, accuracy, results } = body;

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'userId and lessonId are required' },
        { status: 400 }
      );
    }

    // Find the lesson to get scenarioId
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { scenario: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Update or create lesson progress
    const lessonProgress = await db.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      create: {
        userId,
        lessonId,
        scenarioId: lesson.scenarioId,
        status: 'completed',
        progress: 100,
        stars: stars ?? 0,
        xpEarned: xpEarned ?? 0,
        completedAt: new Date(),
      },
      update: {
        status: 'completed',
        progress: 100,
        stars: { set: Math.max(stars ?? 0, 0) },
        xpEarned: xpEarned ?? 0,
        completedAt: new Date(),
      },
    });

    // Update stars to keep the best score
    if (lessonProgress.stars < (stars ?? 0)) {
      await db.userProgress.update({
        where: { id: lessonProgress.id },
        data: { stars: stars ?? 0 },
      });
    }

    // Also ensure scenario progress exists
    await db.userProgress.upsert({
      where: {
        userId_scenarioId: { userId, scenarioId: lesson.scenarioId },
      },
      create: {
        userId,
        scenarioId: lesson.scenarioId,
        status: 'in_progress',
        progress: 0,
        stars: 0,
        xpEarned: 0,
      },
      update: {},
    });

    // Get current user
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate new user stats
    const newXp = user.xp + (xpEarned ?? 0);
    const coinsEarned = (stars ?? 0) * 10 + Math.floor((accuracy ?? 0) * 20);
    const newCoins = user.coins + coinsEarned;
    const newTotalStars = user.totalStars + (stars ?? 0);
    const newExercisesDone = user.exercisesDone + 1;

    // Calculate level from XP
    let newLevel = 1;
    if (newXp > 0) {
      let lvl = 1;
      while (newXp >= lvl * (lvl - 1) * 50 + 100 * lvl) {
        lvl++;
      }
      newLevel = lvl;
    }

    // Calculate running accuracy
    const newAccuracy =
      user.exercisesDone > 0
        ? (user.accuracy * user.exercisesDone + (accuracy ?? 0)) / (user.exercisesDone + 1)
        : (accuracy ?? 0);

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = user.streak;
    let newLongestStreak = user.longestStreak;

    if (user.lastActiveDate === today) {
      // Already active today
    } else if (user.lastActiveDate === yesterday) {
      newStreak = user.streak + 1;
    } else {
      newStreak = 1;
    }
    if (newStreak > newLongestStreak) {
      newLongestStreak = newStreak;
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        coins: newCoins,
        totalStars: newTotalStars,
        level: newLevel,
        exercisesDone: newExercisesDone,
        accuracy: newAccuracy,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today,
        wordsLearned: user.wordsLearned + Math.floor((accuracy ?? 0) * 5),
      },
    });

    // Save individual answer results if provided
    if (Array.isArray(results)) {
      for (const result of results) {
        await db.userAnswer.create({
          data: {
            userId,
            questionId: result.questionId,
            answer: result.answer ?? '',
            isCorrect: result.isCorrect ?? false,
            timeTaken: result.timeTaken ?? 0,
          },
        });
      }
    }

    // Check for achievement unlocks
    const newAchievements: Array<{
      id: string;
      name: string;
      icon: string;
      reward: number;
    }> = [];

    const achievements = await db.achievement.findMany();
    const unlockedAchievements = await db.userAchievement.findMany({
      where: { userId },
    });
    const unlockedSlugs = new Set(
      unlockedAchievements.map((ua) => ua.achievementId)
    );

    for (const achievement of achievements) {
      if (unlockedSlugs.has(achievement.id)) continue;

      let met = false;

      switch (achievement.category) {
        case 'exercises':
          met = newExercisesDone >= achievement.requirement;
          break;
        case 'streak':
          met = newStreak >= achievement.requirement;
          break;
        case 'xp':
          met = newXp >= achievement.requirement;
          break;
        case 'scenarios': {
          const completedScenarios = await db.userProgress.count({
            where: {
              userId,
              scenarioId: { not: null },
              status: 'completed',
            },
          });
          met = completedScenarios >= achievement.requirement;
          break;
        }
        case 'special':
          met = (accuracy ?? 0) >= 1.0;
          break;
      }

      if (met) {
        await db.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        // Award coins for achievement
        if (achievement.reward > 0) {
          await db.user.update({
            where: { id: userId },
            data: { coins: { increment: achievement.reward } },
          });
        }

        newAchievements.push({
          id: achievement.id,
          name: achievement.name,
          icon: achievement.icon,
          reward: achievement.reward,
        });
      }
    }

    // Return updated user data (exclude password)
    const { password: _, ...userData } = updatedUser;

    return NextResponse.json({
      user: userData,
      progress: lessonProgress,
      coinsEarned,
      newAchievements,
    });
  } catch (error) {
    console.error('Complete progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
