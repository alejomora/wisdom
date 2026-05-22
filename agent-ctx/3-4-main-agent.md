# Task 3-4: Expand Question Pool & Increase Shop Prices

## Agent: Main Agent
## Date: 2024-01-07

## Task Summary
Updated `/home/z/my-project/prisma/seed.ts` with two major changes:
1. Expanded question pool with real vocabulary for all 73 generated scenarios
2. Increased shop prices by specified multipliers

## Changes Made

### 1. scenarioVocabulary Object
Added a comprehensive `scenarioVocabulary` object before the `generateQuestionsForScenario` function containing 15 real English-Spanish word pairs for each of the 73 generated scenarios:
- 21 Basic scenarios (family, food, animals, etc.)
- 25 Intermediate scenarios (small-talk, at-the-office, etc.)
- 25 Advanced scenarios (business-negotiations, academic-writing, etc.)

### 2. Rewritten generateQuestionsForScenario()
- Now reads from `scenarioVocabulary` map using scenario slug
- Picks random words from vocabulary for varied sessions
- Generates 12-13 questions per lesson type (was 8-9)
- All question types use real vocabulary words
- Added helper functions: `shuffle()`, `pickRandom()`, `getWrongOptions()`, `roundTo50()`
- Falls back to generic vocab if scenario not found in map

### 3. Shop Price Increases
All 68 reward items updated with new prices:
- Common: 3x multiplier (e.g., 80→250, 100→300)
- Rare: 2.5x multiplier (e.g., 350→900, 400→1000)
- Epic: 2x multiplier (e.g., 900→1800, 1000→2000)
- Legendary: 2x multiplier (e.g., 2000→4000, 5000→10000)
- All prices rounded to nearest 50

### Preserved
- All hand-crafted scenario templates (alphabet, numbers, colors, greetings) unchanged
- All 68 reward items still present (33 avatars + 18 frames + 17 titles)
- No new npm packages added

## Verification
- Lint passes
- Database reseeded successfully: 75 scenarios, 221 lessons, 2778 questions, 68 rewards
- Sample food question verified: "What does 'queso' mean in English?" → correctAnswer: "cheese"
- Shop prices verified: cheapest common avatar = 250, most expensive legendary avatar = 10000
