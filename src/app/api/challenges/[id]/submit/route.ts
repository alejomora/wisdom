import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, correctAnswers, totalQuestions, timeTaken } = body;

    if (!userId || correctAnswers === undefined || totalQuestions === undefined || timeTaken === undefined) {
      return NextResponse.json(
        { error: 'userId, correctAnswers, totalQuestions, and timeTaken are required' },
        { status: 400 }
      );
    }

    // Find the challenge
    const challenge = await db.challenge.findUnique({
      where: { id },
      include: {
        attempts: true,
        challenger: { select: { id: true } },
        challenged: { select: { id: true } },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Verify challenge status is pending or active
    if (challenge.status !== 'pending' && challenge.status !== 'active') {
      return NextResponse.json(
        { error: 'Challenge is not accepting submissions' },
        { status: 400 }
      );
    }

    // Verify user is part of the challenge (challenger or challenged)
    const isChallenger = challenge.challengerId === userId;
    const isChallenged = challenge.challengedId === userId;
    if (!isChallenger && !isChallenged) {
      return NextResponse.json(
        { error: 'You are not a participant in this challenge' },
        { status: 403 }
      );
    }

    // Verify user hasn't already submitted
    const existingAttempt = challenge.attempts.find((a) => a.userId === userId);
    if (existingAttempt) {
      return NextResponse.json(
        { error: 'You have already submitted your attempt for this challenge' },
        { status: 400 }
      );
    }

    // Calculate score: (correctAnswers / totalQuestions) * 1000 - (timeTaken * 0.5)
    const score = (correctAnswers / totalQuestions) * 1000 - timeTaken * 0.5;

    // Create ChallengeAttempt
    const attempt = await db.challengeAttempt.create({
      data: {
        challengeId: id,
        userId,
        correctAnswers,
        totalQuestions,
        timeTaken,
        score,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Check if this is the second attempt (both players have submitted)
    const allAttempts = [...challenge.attempts, { userId, score, correctAnswers, timeTaken }];
    let result: 'win' | 'lose' | 'tie' | 'waiting' = 'waiting';
    let updatedChallenge = null;

    if (allAttempts.length === 2) {
      const [attempt1, attempt2] = allAttempts;
      const user1Id = attempt1.userId;
      const user2Id = attempt2.userId;

      let winnerId: string | null = null;
      let isTie = false;

      // Compare scores: higher score wins
      if (attempt1.score > attempt2.score) {
        winnerId = user1Id;
      } else if (attempt2.score > attempt1.score) {
        winnerId = user2Id;
      } else {
        // Scores tied: more correct answers wins
        if (attempt1.correctAnswers > attempt2.correctAnswers) {
          winnerId = user1Id;
        } else if (attempt2.correctAnswers > attempt1.correctAnswers) {
          winnerId = user2Id;
        } else {
          // Still tied: less time wins
          if (attempt1.timeTaken < attempt2.timeTaken) {
            winnerId = user1Id;
          } else if (attempt2.timeTaken < attempt1.timeTaken) {
            winnerId = user2Id;
          } else {
            // True tie
            isTie = true;
          }
        }
      }

      if (isTie) {
        // True tie: both get coins +1500 (refund)
        await db.$transaction([
          db.challenge.update({
            where: { id },
            data: { status: 'completed' },
          }),
          db.user.update({
            where: { id: user1Id },
            data: { coins: { increment: 1500 } },
          }),
          db.user.update({
            where: { id: user2Id },
            data: { coins: { increment: 1500 } },
          }),
        ]);
        result = 'tie';
      } else {
        // Winner gets: challengeWins +1, coins +2500 (net gain of +1000)
        // Loser gets: challengeLosses +1, coins +500 (net loss of -1000)
        const loserId = winnerId === user1Id ? user2Id : user1Id;

        await db.$transaction([
          db.challenge.update({
            where: { id },
            data: { winnerId, status: 'completed' },
          }),
          db.user.update({
            where: { id: winnerId },
            data: {
              challengeWins: { increment: 1 },
              coins: { increment: 2500 },
            },
          }),
          db.user.update({
            where: { id: loserId },
            data: {
              challengeLosses: { increment: 1 },
              coins: { increment: 500 },
            },
          }),
        ]);

        result = winnerId === userId ? 'win' : 'lose';
      }

      // Fetch the updated challenge with all relations
      updatedChallenge = await db.challenge.findUnique({
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
          },
        },
      });
    } else {
      // Only one attempt so far, still waiting for the other player
      updatedChallenge = await db.challenge.findUnique({
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
          },
        },
      });
    }

    return NextResponse.json({
      attempt,
      challenge: updatedChallenge,
      result,
    });
  } catch (error) {
    console.error('Submit challenge attempt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
