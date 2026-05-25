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

## Task 1: store.ts Enhancements (Agent: Main)

### Date: 2025-03-04

### Changes Made to `/home/z/my-project/src/lib/store.ts`:

1. **Added `purchasedReadings: string[]` to `PersistedPreferences` interface** (line 203)
   - Enables persistence of purchased reading IDs across sessions

2. **Expanded READINGS_DATA from 6 to 15 readings** (5 per level)
   - reading-7: "My First Day at School" (basic, difficulty 1, 50 XP)
   - reading-8: "The Farmer's Market" (basic, difficulty 2, 50 XP)
   - reading-9: "The Weather Forecast" (basic, difficulty 2, 50 XP)
   - reading-10: "The Science Fair Project" (intermediate, difficulty 3, 60 XP)
   - reading-11: "Public Transportation in the City" (intermediate, difficulty 3, 60 XP)
   - reading-12: "A Volunteer Experience" (intermediate, difficulty 4, 60 XP)
   - reading-13: "The Impact of Social Media on Society" (advanced, difficulty 4, 75 XP)
   - reading-14: "Climate Change and Renewable Energy" (advanced, difficulty 5, 80 XP)
   - reading-15: "The Psychology of Decision Making" (advanced, difficulty 5, 80 XP)
   - Each new reading has 4 questions with Spanish translations

3. **Added `TITLE_TIERS` constant and `computeTitle` function** (after READINGS_DATA)
   - 7 title tiers from Principiante (0) to Gran Maestro (100)
   - `computeTitle()` returns matching title and icon based on exercisesDone

4. **Added `isFirstInLevel` helper function** (before store definition)
   - Determines if a reading is the first (free) reading in its level

5. **Added new state fields to `AppStoreState` interface**:
   - Reading State: `purchasedReadings: string[]`
   - Session Timer State: `sessionStartTime`, `showMiniGame`, `miniGameType`, `miniGameCompleted`
   - Actions: `buyReading`, `buyReadingPack`, `isReadingUnlocked`, `startSessionTimer`, `activateMiniGame`, `closeMiniGame`, `buyLives`, `buyEnergy`, `buyCoinPack`

6. **Added state initial values in store implementation**:
   - `purchasedReadings: []`
   - `sessionStartTime: 0`, `showMiniGame: false`, `miniGameType: ''`, `miniGameCompleted: false`

7. **Updated `unlockSpanishTranslation` price from 250 to 200 coins**

8. **Added 9 new store actions**:
   - `buyReading`: Purchase a single reading for 500 coins
   - `buyReadingPack`: Purchase multiple readings of a level at bulk pricing
   - `isReadingUnlocked`: Check if reading is free (first in level) or purchased
   - `buyLives`: Purchase lives (5/10/15/20) at tiered pricing
   - `buyEnergy`: Purchase energy for 500 coins (+1 life)
   - `buyCoinPack`: Free coin reward (simulated video watch)
   - `startSessionTimer`: Initialize session tracking
   - `activateMiniGame`: Show a mini-game overlay
   - `closeMiniGame`: Close mini-game and mark completed

9. **Updated persist middleware**:
   - Added `purchasedReadings` to `partialize` and `merge` functions

### Verification:
- `bun run lint` passed with no errors
- Dev server running successfully with no compilation errors

## Task 2: page.tsx Enhancements (Agent: Main)

### Date: 2025-03-04

### Changes Made to `/home/z/my-project/src/app/page.tsx`:

1. **Updated import line (line 5)**
   - Added `computeTitle` and `TITLE_TIERS` to the import from `@/lib/store`

2. **Updated ReadingsView (formerly line 3098)**
   - Added level tabs (Básico, Intermedio, Avanzado) to filter readings by level
   - First reading of each level is FREE (🆓 badge), others cost 500 coins
   - Uses `isReadingUnlocked` and `buyReading` from the store
   - Lock icon (🔒) shown on unpurchased readings
   - Audio narration: 250 coins (uses `unlockAudioReading`)
   - Spanish translation: 200 coins (uses `unlockSpanishTranslation`)
   - Play/Pause toggle for audio narration ("Escuchar Lectura" / "Detener Lectura")
   - Already purchased readings show "Leer →" button instead of buy button
   - Shows audio/spanish badges on readings that have been unlocked
   - Link to shop for reading packs at the bottom

3. **Updated ShopView (formerly line 2268)**
   - Added 5 tabs: Cosméticos, Vidas, Energía, Monedas, Lecturas
   - Removed 'title' from shopTypes filter (titles now auto-assigned via computeTitle)
   - Cosméticos tab: avatars + frames (no titles), with sub-filter
   - Vidas tab: 4 packs (5/10/15/20 lives) at tiered pricing (1000/1800/2500/3000 coins)
   - Energía tab: energy refill for 500 coins
   - Monedas tab: coin packs via "watch video" with 3-second progress bar animation (1000/3000/5000/10000 coins)
   - Lecturas tab: reading packs by level (Básico 1600, Intermedio 1800, Avanzado 2000 coins)
   - Spanish UI labels throughout

4. **Added SessionTimer component**
   - Floating widget in top-right corner
   - Shows 15-minute countdown in MM:SS format
   - Animated circular SVG progress ring
   - When timer reaches 0, shows 🎉 and "¡Jugar!" button
   - Calls `activateMiniGame('boxes')` when button clicked
   - Auto-starts on login via `startSessionTimer()`

5. **Added MiniGameBoxes component**
   - 6 gift boxes: 3 prizes (5 lives, 1000 coins, 500 coins), 3 angry dogs
   - Lives can only appear once (tracked via ref)
   - Tapping a dog ends the game
   - Shows prizes won in emerald section
   - Close button when game over or all prizes found

6. **Added MiniGameWheel component**
   - Fortune wheel with 8 segments (6 prizes + 2 dogs)
   - CSS transition-based spin animation (3 seconds)
   - Calculates winning segment from rotation angle
   - Prizes: 500/1000/1500/2000 coins, 100 energy, 5 lives
   - Dog segments play bark sound

7. **Added MiniGameMemory component**
   - 12 cards (6 English-Spanish word pairs)
   - Cards shuffled randomly
   - Flip two cards at a time to find matching pairs
   - Move counter and match detection
   - Awards +50 XP +300 coins on completion

8. **Added MiniGameTrivia component**
   - 5 vocabulary questions with 30-second timer
   - Progress bar showing question advancement
   - Color-coded answers (green correct, red wrong)
   - Awards XP and coins based on score (15 XP + 100 coins per correct answer)

9. **Updated Home component**
   - Added `startSessionTimer` call on login (in existing useEffect)
   - Renders `<SessionTimer />` after `<Header />`
   - Renders all 4 mini game components before Streak Gift Modal

10. **Updated Dashboard**
    - Added "Mini Juegos" section with 4 game buttons:
      - 🎁 Cajas Sorpresa (boxes)
      - 🎡 Rueda (wheel)
      - 🧠 Memoria (memory)
      - ⚡ Trivia (trivia)
    - Buttons call `activateMiniGame()` from the store

### Lint Fixes:
- Replaced `useEffect` + `setState` patterns in mini games with React-recommended "adjust state during render" pattern (using `useState` to track previous prop value instead of `useRef`)
- This avoids `react-hooks/set-state-in-effect` and `react-hooks/refs` lint errors

### Verification:
- `bun run lint` passed with no errors
- Dev server compiling successfully

---
Task ID: 3
Agent: Main Agent
Task: Animated SVG avatars, improved frames, and better mini game graphics

Work Log:
- Created AnimatedAvatar component (~340 lines) with SVG-based characters
  - 8 expression types: normal (blinking), tongue out, wink, yawn, laugh, angry, surprise, cool
  - 20+ avatar themes mapping emoji to character style (skin, hair, accessories)
  - Hair styles: short, long, pigtails, bun, fox, cat, dog, robot, alien, wizard, hero, princess, prince, vampire, ninja
  - Accessories: glasses, grad cap, crown, hat, mask, antenna
  - Idle floating animation + expression cycling every 3-5 seconds
  - Expression emoji indicator shown in corner when non-normal
  - Eyes blink in normal mode, squint in laugh, close in wink/yawn, go big in surprise
  - Mouths change per expression (smile, open, tongue out, frown, etc.)
- Created AnimatedFrame component (~90 lines) with dramatic visual effects
  - 18 frame themes with unique color palettes (fire, ice, stars, diamond, royal, rainbow, electric, sakura, wave, nature, blade, shield, theater, music, cosmic, floral, butterfly, champion)
  - Rotating conic gradient border animation
  - Color-cycling border animation (frame-border-dance)
  - Glow pulse effect (frame-rotate-glow)
  - 8 sparkle particles with staggered animations
  - Large bouncing frame emoji badge in corner (prominent, not just a tiny icon)
- Added 20+ CSS keyframe animations in globals.css
  - Avatar expressions: idle, blink, tongue, wink, yawn, laugh, angry, surprise, bounce
  - Frame effects: glow, sparkle, border-dance
  - Mini game: box-shake, box-reveal, box-glow, wheel-led-blink, memory-card-glow, trivia-pulse, confetti-burst, dog-angry
- Improved MiniGameBoxes graphics:
  - 3D lid gradient effect on unopened boxes
  - Spring reveal animation with rotation on open
  - Dog angry shake animation with "GRRR!" text
  - Glow pulse on unopened boxes
  - Animated prizes with sparkle icons
  - Better background decoration
- Improved MiniGameWheel graphics:
  - SVG wheel with proper pie segments instead of CSS rectangles
  - 16 LED lights around the wheel with blinking effect
  - Triangular pointer with drop shadow
  - Center circle with 🎡 icon
  - Color-coded result cards (red for dog, green for prizes)
- Improved MiniGameMemory graphics:
  - Card flip animation (rotateY)
  - Score display with move counter and pair counter badges
  - Glowing matched cards (animate-memory-glow)
  - 🃏 card backs with subtle animation
  - Animated completion celebration
- Improved MiniGameTrivia graphics:
  - Question progress dots
  - Answer letter badges (A/B/C/D) in circles
  - ✅/❌ indicators on answered options
  - Animated timer pulse when low on time
  - Slide-in question transitions
  - Result screen with fun messages and animated emoji
- Updated all avatar displays to use AnimatedAvatar:
  - Profile (130px, with expressions)
  - Dashboard welcome banner (80px, with expressions)
  - Battle lobby VS display (70px)
  - Battle active header (40px)
  - Battle results (56px)
  - Rankings (32px)
  - Admin panel user list (32px)
- Updated Mini Games section in Dashboard with color-coded gradients and animated icons

Stage Summary:
- Animated SVG avatars with 8 expressions and 20+ themes ✓
- Dramatic animated frames with 18 themes and visual effects ✓
- All 4 mini games significantly improved visually ✓
- No existing functionality broken ✓
- Both GitHub repos updated ✓

---
Task ID: 4
Agent: Main Agent
Task: Revert animated SVG avatars to emoji style, add animated backgrounds and enhanced frames

Work Log:
- User reported that animated SVG avatars looked terrible ("quedaron horribles")
- Reverted avatars to original emoji-based display (🎯, 👩, 👨, etc.)
- Created new AnimatedAvatar component with:
  - Simple emoji display at proportional size (60% of container)
  - Animated gradient background that pulses and shifts colors per avatar theme
  - 20 avatar background themes with unique color palettes and particle colors
  - Floating particle effects (6 particles per avatar)
  - Glow pulse effect behind the emoji
  - Spinning dashed ring accent
  - Gentle idle floating animation
  - Drop shadow filter matching avatar theme color
- Enhanced AnimatedFrame component:
  - Rotating conic gradient border (replaces static gradient)
  - Outer glow ring with pulsing animation
  - 12 orbit sparkles (up from 8) with text shadow glow
  - Animated corner decorations (SVG bracket shapes)
  - Breathing animation on the whole frame
  - Color-cycling border layer
  - Gradient background on frame badge with glow
  - Larger badge size and better positioning
- Updated CSS animations in globals.css:
  - Removed old SVG avatar expression keyframes (blink, tongue, wink, yawn, laugh, angry, surprise)
  - Added new avatar keyframes: float, bg, glow-pulse, particle
  - Added new frame keyframes: rotate, glow-pulse, breathe
  - Updated sparkle animation to include translate(-50%, -50%)
  - Kept all mini game animations intact
- All existing functionality preserved (battle, shop, readings, mini games, energy, etc.)
- Lint passes with no errors
- Pushed to GitHub (commit 5d708fd)

Stage Summary:
- Avatars now show original emojis with animated gradient backgrounds ✓
- Frames enhanced with rotating conic gradient, orbit sparkles, corner decorations ✓
- No functionality broken ✓
- Code reduced by ~190 lines (465 removed, 276 added) ✓
