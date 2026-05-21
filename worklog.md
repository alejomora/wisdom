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
