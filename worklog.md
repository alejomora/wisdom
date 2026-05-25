---
Task ID: 1-4
Agent: Main Agent
Task: Implement 4 user-requested improvements to Wisdom English Quest

Work Log:
- Added ViewMode type ('normal' | 'clean') to store with persistence
- Added clean mode CSS in globals.css with comprehensive overrides:
  - White/light background, all text forced to dark colors
  - Match exercise buttons get dark text (no white text)
  - Glass effects become light cards, neon text becomes dark
  - All headings, paragraphs, labels forced to dark in clean mode
- Added view mode toggle in Profile → Settings tab (🌙 Normal / ☀️ Clean)
- Added logout button in Settings tab
- Fixed voice selector: added 7 virtual voice styles (Deep Male, High Female, Fast Speaker, Slow & Clear, Friendly, Teacher) that always appear
- Virtual voices use different pitch/rate settings, always work regardless of browser voices
- Browser English voices still appear if available
- Added streak gift reward system:
  - Shows after 7-day streak with 6 gift boxes
  - 3 prizes: 100 coins, 50 energy, infinite lives for 10 minutes
  - 3 "perro bravo" (mad dog) boxes
  - Player picks 1 box only
  - Dog box plays bark sound, prize box plays reward sound + confetti
- Added infinite lives feature:
  - Timer displayed in header (∞ symbol with countdown)
  - loseLife() checks for infinite lives before deducting
  - Auto-expires after time runs out
- Added bark sound effect to playSound
- Expanded Admin Panel significantly:
  - Overview section with platform stats
  - Users section: list all users, search/filter, view stats
  - Actions: give lives/coins/XP, block/unblock, delete users
  - Create User section: form with name, email, password, role
- Added API endpoints: /api/admin/users, /api/admin/action, /api/user/sync
- Added `blocked` field to User Prisma schema
- Added blocked user check on login
- Fixed profile frame: now shows as decorative border instead of overlapping avatar
- Frame emoji shown as small badge in corner
- Admin credentials shown on login page
- All changes pushed to both GitHub repos

Stage Summary:
- Clean mode with dark text on light backgrounds ✓
- Voice options with 7 virtual styles ✓
- Streak gift system with 6 boxes (3 prizes + 3 dogs) ✓
- Comprehensive admin panel with user management ✓
- Both GitHub repos updated ✓
