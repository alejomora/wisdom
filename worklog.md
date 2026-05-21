---
Task ID: 1
Agent: Main Agent
Task: Add more avatars, frames, titles to the shop and explain/improve missions system

Work Log:
- Reviewed existing seed data: 11 rewards (5 avatars, 3 frames, 3 titles) and 8 missions (5 daily, 3 weekly)
- Expanded rewards from 11 to 68 items across all rarities:
  - 33 Avatars: 10 common, 10 rare, 8 epic, 5 legendary
  - 18 Frames: 4 common, 6 rare, 5 epic, 3 legendary
  - 17 Titles: 4 common, 6 rare, 4 epic, 3 legendary
- Expanded missions from 8 to 18 missions:
  - 8 Daily Missions (added: Perfect Score, Word Collector, Speed Learner)
  - 6 Weekly Missions (added: Full Week Streak, XP Overlord, Iron Student)
  - 4 Special Missions (new category: First Steps, World Traveler, Week Warrior, Knowledge Seeker)
- Created `/api/missions/claim` POST endpoint for claiming mission rewards
- Updated `/api/missions/[userId]` GET endpoint to include special missions with auto-calculated progress
- Completely redesigned MissionsView with:
  - Tabbed interface (Daily / Weekly / Special)
  - "How Do Missions Work?" explanation section
  - Claim reward button functionality
  - Visual progress bars with color coding per mission type
  - CLAIMED badge for completed missions
- Updated Admin Panel stats to reflect new data counts
- Reseeded database successfully: 68 rewards, 18 missions
- Lint check passes, dev server running

Stage Summary:
- Shop now has 68 items: 33 avatars, 18 frames, 17 titles across 4 rarity tiers
- Missions system fully functional with claim rewards feature
- 3 types of missions: Daily (reset daily), Weekly (reset weekly), Special (one-time)
- Special missions auto-track progress from cumulative user stats (exercises done, longest streak, total XP)

---
Task ID: 2
Agent: Main Agent
Task: Fix order_words exercise bug, scenario completion bug, mission claim bug, and improve scenario unlock UI

Work Log:
- **Fixed order_words answer validation bug**: The `correctAnswer` in the database was "A, B, C, D" (comma-separated), but the UI built user answers with space separators "A B C D". Added `normalizeAnswer()` function in store.ts that strips commas and normalizes spaces before comparison.
- **Fixed scenario never marked as "completed"**: The `/api/progress/complete` endpoint only set scenario status to `in_progress` and never checked if all lessons were done. Updated it to count completed lessons vs total lessons and mark scenario as `completed` when all lessons are done, including proper progress percentage and star calculation.
- **Fixed mission claim 400 error**: The claim API used a simple `userMission.completed` check from the database, which didn't match the dynamic progress calculation used by the missions list API. Rewrote the claim API to always dynamically calculate progress using `calculateDynamicProgress()` and verify completion the same way the UI does. Also added proper weekly mission progress calculation (was previously always returning 0).
- **Improved missions API**: Weekly missions now auto-calculate progress dynamically (exercises completed this week, XP earned this week, scenarios completed this week, streak). Special missions now count completed scenarios from UserProgress.
- **Updated lessons API**: Added `userId` query parameter support to include lesson completion progress (`userProgress` field with status, stars, progress).
- **Updated loadLessons store function**: Now passes `userId` to the lessons API to get completion data.
- **Improved ScenarioMap UI**: Added "🔓 Complete previous scenario to unlock" hint text for locked scenarios.
- **Improved Lesson Selection Modal**: Now shows lesson completion status (checkmark + green highlight for completed lessons), star ratings for completed lessons, and "X/Y lessons completed" counter in the header.

Stage Summary:
- order_words exercises now work correctly - commas are normalized during comparison
- Scenarios properly get marked as "completed" when all their lessons are finished
- Mission claim now works for all mission types with dynamic progress verification
- Scenario unlock progression is now clear: complete all lessons in a scenario → scenario completes → next scenario unlocks

---
Task ID: 3
Agent: Main Agent
Task: Fix scenario unlocking, prevent double rewards, expand questions, increase shop prices

Work Log:
- **Fixed scenario unlocking bug (ROOT CAUSE)**: `loadScenarios()` in store.ts was NOT passing `userId` to the API, so scenarios had no `progress` data, meaning `isUnlocked()` always returned false for non-starter scenarios. Added `userId` query parameter to the API call.
- **Added scenario refresh after exercise completion**: After saving exercise results to the backend, the store now refreshes the scenario list so the UI immediately reflects unlocked scenarios.
- **Fixed user data sync**: After completing exercise, the backend's updated user data (with accurate streak/accuracy) now overwrites the optimistic frontend update.
- **Prevented double rewards on replay**: The `/api/progress/complete` endpoint now checks if the lesson was already completed (`isAlreadyCompleted`). If yes, it skips adding XP, coins, stars, exercises count, and achievements. Only the best star score is updated. Frontend shows "Practice Complete! 🔄" message instead of reward message on replay.
- **Expanded question variety**: Each hand-crafted scenario lesson now has 8-10 questions (was 3-4). The `generateQuestionsForScenario()` function now generates 8-9 questions per lesson type (was 3-4). Covers all exercise types: multiple_choice, fill_blank, order_words, translate, listen_write, pronunciation, flashcard, build_sentence, find_error, match_concepts.
- **Fixed correctAnswer format**: Changed `order_words` and `match_concepts` correctAnswers from comma-separated ("A, B, C, D") to space-separated ("A B C D") to match how the UI builds answers.
- **Added question randomization**: The `/api/lessons/[id]/questions` endpoint now shuffles non-flashcard questions using Fisher-Yates shuffle, and limits to 8 questions per session (flashcards shown first for learning, then shuffled practice questions).
- **Increased shop prices** (roughly 2.5-3x across all rarities):
  - Common avatars: 30-55 → 80-200 coins
  - Rare avatars: 100-140 → 350-480 coins
  - Epic avatars: 300-380 → 900-1200 coins
  - Legendary avatars: 500-1000 → 2000-5000 coins
  - Common frames: 60-80 → 150-200 coins
  - Rare frames: 200-250 → 500-650 coins
  - Epic frames: 350-420 → 1000-1200 coins
  - Legendary frames: 700-900 → 2500-3500 coins
  - Common titles: 30-60 → 100-180 coins
  - Rare titles: 250-300 → 600-750 coins
  - Epic titles: 400-450 → 1200-1400 coins
  - Legendary titles: 500-1000 → 2500-5000 coins
- **Increased demo user starting coins**: 150 → 300 coins to match new price levels
- Reseeded database successfully with all changes

Stage Summary:
- Scenarios now unlock properly: completing all lessons in Alphabet → Numbers unlocks immediately
- No more double rewards: replaying completed lessons shows "Practice Complete" with 0 rewards
- Questions are now varied and shuffled: 8-10 questions per lesson, randomized order each session
- Shop prices are significantly higher, making items feel more rewarding to earn
