---
Task ID: 1
Agent: Main Agent
Task: Fix scenario completion, score updates, duplicate rewards, expand questions, increase prices

Work Log:
- Identified ROOT CAUSE: UserProgress model had @@unique([userId, scenarioId]) and @@unique([userId, lessonId]) constraints. When lesson progress records set BOTH lessonId AND scenarioId, they occupied BOTH unique slots. Then when the code tried to upsert scenario progress with the same (userId, scenarioId), it found the lesson progress record instead and OVERWROTE it with scenario-level data, destroying the lesson's completion status.
- Fixed `/api/progress/complete/route.ts`: Lesson progress records now set lessonId ONLY (no scenarioId). Scenario progress records set scenarioId ONLY (no lessonId). This prevents unique constraint conflicts.
- Fixed `/api/levels/[id]/scenarios/route.ts`: Added `lessonId: null` filter to only get scenario progress records
- Fixed `/api/scenarios/[id]/lessons/route.ts`: Added `scenarioId: null` filter to only get lesson progress records
- Fixed `/api/missions/claim/route.ts`: Updated all progress queries to properly filter by lessonId=null (for scenario counts) or scenarioId=null (for lesson counts)
- Fixed `/api/missions/[userId]/route.ts`: Same filtering updates for mission progress calculations
- Fixed `src/lib/store.ts`: Added `scenarioCompleted` flag handling, play unlock sound when scenario completed, fixed replay detection UI (no confetti on replay)
- Expanded question pool in `prisma/seed.ts`: Added scenarioVocabulary for all 73 scenarios with real English-Spanish word pairs, rewrote generateQuestionsForScenario() to use real vocabulary (12-15 questions per lesson instead of 8)
- Increased shop prices: Common 3x, Rare 2.5x, Epic 2x, Legendary 2x (rounded to nearest 50)
- Fixed demo user progress in seed to create separate scenario and lesson progress records
- Reseeded database and verified all fixes with comprehensive API tests

Stage Summary:
- ROOT CAUSE FOUND: Lesson and scenario progress records conflicted on @@unique([userId, scenarioId]) constraint
- FIX: Lesson progress = lessonId only, Scenario progress = scenarioId only
- ALL TESTS PASSED: Scenario completion ✅, Scenario unlocking ✅, Score updates ✅, No duplicate rewards ✅, Progress tracking ✅
- Questions expanded from ~8 to 12-15 per lesson with real vocabulary
- Shop prices increased 2x-3x across all items
