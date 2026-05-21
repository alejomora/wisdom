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

    // Check if lesson was already completed (to prevent double rewards)
    const existingProgress = await db.userProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    const isAlreadyCompleted = existingProgress?.status === 'completed';

    // Update or create lesson progress
    // If already completed, only update stars if the new score is better
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
        // Only update stars if the new score is better
        stars: { set: Math.max(existingProgress?.stars ?? 0, stars ?? 0) },
        xpEarned: xpEarned ?? 0,
        completedAt: new Date(),
      },
    });

    // Also ensure scenario progress exists and check if all lessons are completed
    // Get all lessons in this scenario
    const allLessonsInScenario = await db.lesson.findMany({
      where: { scenarioId: lesson.scenarioId },
      select: { id: true },
    });
    const lessonIds = allLessonsInScenario.map((l) => l.id);

    // Count completed lessons for this user in this scenario
    const completedLessonsCount = await db.userProgress.count({
      where: {
        userId,
        lessonId: { in: lessonIds },
        status: 'completed',
      },
    });

    const allLessonsCompleted = completedLessonsCount >= allLessonsInScenario.length;
    const scenarioStatus = allLessonsCompleted ? 'completed' : 'in_progress';
    const scenarioProgress = allLessonsCompleted ? 100 : Math.round((completedLessonsCount / allLessonsInScenario.length) * 100);

    // Calculate best stars across all completed lessons in this scenario
    let bestScenarioStars = 0;
    if (allLessonsCompleted) {
      const lessonProgressRecords = await db.userProgress.findMany({
        where: {
          userId,
          lessonId: { in: lessonIds },
          status: 'completed',
        },
        select: { stars: true },
      });
      // Use the minimum stars as the scenario stars (like Duolingo - based on weakest lesson)
      bestScenarioStars = lessonProgressRecords.length > 0
        ? Math.min(...lessonProgressRecords.map((r) => r.stars))
        : 0;
    }

    await db.userProgress.upsert({
      where: {
        userId_scenarioId: { userId, scenarioId: lesson.scenarioId },
      },
      create: {
        userId,
        scenarioId: lesson.scenarioId,
        status: scenarioStatus,
        progress: scenarioProgress,
        stars: bestScenarioStars,
        xpEarned: 0,
        ...(allLessonsCompleted ? { completedAt: new Date() } : {}),
      },
      update: {
        status: scenarioStatus,
        progress: scenarioProgress,
        ...(allLessonsCompleted ? { stars: bestScenarioStars, completedAt: new Date() } : {}),
      },
    });

    // Get current user
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let coinsEarned = 0;
    let newXp = user.xp;
    let newCoins = user.coins;
    let newTotalStars = user.totalStars;
    let newExercisesDone = user.exercisesDone;
    let newAccuracy = user.accuracy;
    let newWordsLearned = user.wordsLearned;

    if (isAlreadyCompleted) {
      // Lesson was already completed - NO additional rewards
      // Only update stars if the new score is better (already handled in upsert)
      coinsEarned = 0;
    } else {
      // First time completing this lesson - award full rewards
      newXp = user.xp + (xpEarned ?? 0);
      coinsEarned = (stars ?? 0) * 10 + Math.floor((accuracy ?? 0) * 20);
      newCoins = user.coins + coinsEarned;
      newTotalStars = user.totalStars + (stars ?? 0);
      newExercisesDone = user.exercisesDone + 1;
      newAccuracy =
        user.exercisesDone > 0
          ? (user.accuracy * user.exercisesDone + (accuracy ?? 0)) / (user.exercisesDone + 1)
          : (accuracy ?? 0);
      newWordsLearned = user.wordsLearned + Math.floor((accuracy ?? 0) * 5);
    }

    // Calculate level from XP
    let newLevel = 1;
    if (newXp > 0) {
      let lvl = 1;
      while (newXp >= lvl * (lvl - 1) * 50 + 100 * lvl) {
        lvl++;
      }
      newLevel = lvl;
    }

    // Update streak (always update, even on replay - to maintain streak)
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
        wordsLearned: newWordsLearned,
      },
    });

    // Save individual answer results if provided (always save, even on replay for analytics)
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

    // Check for achievement unlocks (only for first completion)
    const newAchievements: Array<{
      id: string;
      name: string;
      icon: string;
      reward: number;
    }> = [];

    if (!isAlreadyCompleted) {
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
    }

    // Return updated user data (exclude password)
    const { password: _, ...userData } = updatedUser;

    return NextResponse.json({
      user: userData,
      progress: lessonProgress,
      coinsEarned,
      isReplay: isAlreadyCompleted,
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
