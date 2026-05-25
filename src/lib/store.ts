import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// API BASE URL
// ============================================
const API_BASE = '/api';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ViewName =
  | 'dashboard'
  | 'levels'
  | 'scenario-map'
  | 'exercise'
  | 'profile'
  | 'rankings'
  | 'statistics'
  | 'missions'
  | 'shop'
  | 'admin'
  | 'exam';

export interface UserData {
  id: string;
  name: string;
  avatar: string;
  frame: string;
  title: string;
  email: string;
  role: string;
  xp: number;
  coins: number;
  totalStars: number;
  level: number;
  lives: number;
  maxLives: number;
  livesLastRefill: string;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  wordsLearned: number;
  exercisesDone: number;
  totalStudyTime: number;
  accuracy: number;
  listeningScore: number;
  writingScore: number;
  speakingScore: number;
  currentLevelId: string;
  theme: string;
  infiniteLivesUntil: number;
  blocked?: boolean;
}

export interface Level {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  color: string;
  order: number;
  minXp: number;
}

export interface Scenario {
  id: string;
  levelId: string;
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  image: string;
  difficulty: number;
  xpReward: number;
  order: number;
  isStarter: boolean;
  progress?: UserProgressData;
}

export interface Lesson {
  id: string;
  scenarioId: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  type: string;
  order: number;
  xpReward: number;
  progress?: UserProgressData;
}

export interface Question {
  id: string;
  lessonId: string;
  type: string;
  prompt: string;
  promptEs: string;
  hintEn: string;
  hintEs: string;
  audioText: string;
  options: string; // JSON array
  correctAnswer: string;
  explanation: string;
  explanationEs: string;
  image: string;
  points: number;
  order: number;
}

export interface UserProgressData {
  id: string;
  status: string;
  progress: number;
  stars: number;
  xpEarned: number;
  completedAt: string | null;
}

export interface ExerciseResult {
  questionId: string;
  isCorrect: boolean;
  timeTaken: number;
}

export interface RewardData {
  type: string;
  title: string;
  message: string;
  xp?: number;
  coins?: number;
  stars?: number;
  achievement?: {
    name: string;
    icon: string;
  };
}

export interface NotificationData {
  type: string;
  message: string;
}

export type SoundType = 'correct' | 'wrong' | 'reward' | 'levelup' | 'unlock' | 'bark';

export interface ShopItem {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  type: string; // avatar | frame | title | skin | theme
  icon: string;
  rarity: string; // common | rare | epic | legendary
  cost: number;
  purchased: boolean;
}

export interface InventoryItem {
  id: string;
  rewardId: string;
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  type: string;
  icon: string;
  rarity: string;
  cost: number;
  equipped: boolean;
  purchased: string;
}

// ============================================
// PERSISTED PREFERENCES
// ============================================
export type SpeechSpeed = 'slow' | 'normal';

export type ViewMode = 'normal' | 'clean';

interface PersistedPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: string;
  speechSpeed: SpeechSpeed;
  speechVoiceIndex: number;
  viewMode: ViewMode;
  infiniteLivesUntil: number;
  lastStreakGiftAt: number;
}

// ============================================
// STORE STATE & ACTIONS
// ============================================
export interface AppStoreState {
  // Navigation / Views
  currentView: ViewName;
  selectedLevelId: string | null;
  selectedScenarioId: string | null;
  selectedLessonId: string | null;

  // User State
  user: UserData | null;
  isLoggedIn: boolean;

  // Game Data
  levels: Level[];
  scenarios: Scenario[];
  lessons: Lesson[];
  questions: Question[];

  // Exercise State
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showResult: boolean;
  exerciseResults: ExerciseResult[];
  exerciseStartTime: number;
  hintsUsed: number;
  isExerciseComplete: boolean;
  exerciseXpEarned: number;
  exerciseStars: number;

  // Shop State
  shopItems: ShopItem[];
  inventory: InventoryItem[];

  // UI State
  showConfetti: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  speechSpeed: SpeechSpeed;
  speechVoiceIndex: number;
  viewMode: ViewMode;
  infiniteLivesUntil: number;
  lastStreakGiftAt: number;
  showStreakGiftModal: boolean;
  showRewardModal: boolean;
  rewardData: RewardData | null;
  isLoading: boolean;
  showLevelUpAnimation: boolean;
  notification: NotificationData | null;

  // Actions - Navigation
  navigate: (view: ViewName, data?: { levelId?: string; scenarioId?: string; lessonId?: string }) => void;

  // Actions - User
  setUser: (user: UserData | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // Actions - Data Loading
  loadLevels: () => Promise<void>;
  loadScenarios: (levelId: string) => Promise<void>;
  loadLessons: (scenarioId: string) => Promise<void>;
  loadQuestions: (lessonId: string) => Promise<void>;

  // Actions - Exercise
  startExercise: (lessonId: string) => Promise<void>;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  completeExercise: () => Promise<void>;
  useHint: () => void;
  resetExercise: () => void;

  // Actions - User Progress
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  loseLife: () => void;
  refillLives: () => void;
  updateStreak: () => void;

  // Actions - Shop
  loadShop: () => Promise<void>;
  buyReward: (rewardId: string) => Promise<void>;
  equipReward: (rewardId: string) => Promise<void>;

  // Actions - UI
  setShowConfetti: (val: boolean) => void;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  setSpeechVoiceIndex: (index: number) => void;
  setViewMode: (mode: ViewMode) => void;
  activateInfiniteLives: (minutes: number) => void;
  hasInfiniteLives: () => boolean;
  checkStreakGift: () => void;
  claimStreakGift: (boxIndex: number) => void;
  setShowStreakGiftModal: (val: boolean) => void;
  playSound: (type: SoundType) => void;
  claimReward: (reward: RewardData) => void;
  setNotification: (notification: NotificationData | null) => void;
  setShowRewardModal: (val: boolean) => void;
  setRewardData: (data: RewardData | null) => void;
  setIsLoading: (val: boolean) => void;
  setShowLevelUpAnimation: (val: boolean) => void;
}

// ============================================
// HELPER: XP-to-Level calculation
// ============================================
function calculateLevelFromXp(xp: number): number {
  // Level thresholds: level 1 = 0xp, level 2 = 100xp, level 3 = 250xp, etc.
  // Formula: level N requires N*(N-1)*50 XP
  if (xp <= 0) return 1;
  let level = 1;
  while (xp >= level * (level - 1) * 50 + 100 * level) {
    level++;
  }
  return level;
}

// ============================================
// HELPER: Parse JSON options from Question
// ============================================
export function parseQuestionOptions(optionsJson: string): string[] {
  try {
    return JSON.parse(optionsJson);
  } catch {
    return [];
  }
}

// ============================================
// HELPER: Sync user data to database (fire-and-forget)
// ============================================
function syncUserToDb(userId: string, data: Record<string, unknown>) {
  fetch(`${API_BASE}/user/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...data }),
  }).catch(() => {
    // Silently fail - data will be synced on next interaction
    console.warn('Failed to sync user data to DB');
  });
}

// ============================================
// ZUSTAND STORE
// ============================================
export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // ── Navigation / Views ──────────────────────
      currentView: 'dashboard',
      selectedLevelId: null,
      selectedScenarioId: null,
      selectedLessonId: null,

      // ── User State ──────────────────────────────
      user: null,
      isLoggedIn: false,

      // ── Game Data ───────────────────────────────
      levels: [],
      scenarios: [],
      lessons: [],
      questions: [],

      // ── Exercise State ──────────────────────────
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isCorrect: null,
      showResult: false,
      exerciseResults: [],
      exerciseStartTime: 0,
      hintsUsed: 0,
      isExerciseComplete: false,
      exerciseXpEarned: 0,
      exerciseStars: 0,

      // ── Shop State ──────────────────────────────
      shopItems: [],
      inventory: [],

      // ── UI State ────────────────────────────────
      showConfetti: false,
      soundEnabled: true,
      musicEnabled: true,
      speechSpeed: 'normal' as SpeechSpeed,
      speechVoiceIndex: -1, // -1 = default voice
      viewMode: 'normal' as ViewMode,
      infiniteLivesUntil: 0,
      lastStreakGiftAt: 0,
      showStreakGiftModal: false,
      showRewardModal: false,
      rewardData: null,
      isLoading: false,
      showLevelUpAnimation: false,
      notification: null,

      // ────────────────────────────────────────────
      // NAVIGATION
      // ────────────────────────────────────────────
      navigate: (view, data) => {
        set((state) => ({
          currentView: view,
          selectedLevelId: data?.levelId ?? state.selectedLevelId,
          selectedScenarioId: data?.scenarioId ?? state.selectedScenarioId,
          selectedLessonId: data?.lessonId ?? state.selectedLessonId,
        }));
      },

      // ────────────────────────────────────────────
      // USER ACTIONS
      // ────────────────────────────────────────────
      setUser: (user) => {
        set({
          user,
          isLoggedIn: user !== null,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await res.json();
          const userData = data.user;

          // Calculate lives refill based on time elapsed since last refill
          if (userData) {
            const now = new Date();
            const lastRefill = new Date(userData.livesLastRefill);
            const minutesSinceRefill = (now.getTime() - lastRefill.getTime()) / 60000;
            const livesToRefill = Math.min(
              Math.floor(minutesSinceRefill / 30),
              (userData.maxLives || 5) - userData.lives
            );
            if (livesToRefill > 0) {
              userData.lives = Math.min(userData.lives + livesToRefill, userData.maxLives || 5);
              userData.livesLastRefill = now.toISOString();
              // Sync the refilled lives back to DB
              syncUserToDb(userData.id, { lives: userData.lives, livesLastRefill: userData.livesLastRefill });
            }
          }

          // Restore infinite lives from DB
          const dbInfiniteLivesUntil = userData?.infiniteLivesUntil || 0;

          set({
            user: userData,
            isLoggedIn: true,
            isLoading: false,
            infiniteLivesUntil: dbInfiniteLivesUntil > Date.now() ? dbInfiniteLivesUntil : 0,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          currentView: 'dashboard',
          selectedLevelId: null,
          selectedScenarioId: null,
          selectedLessonId: null,
          levels: [],
          scenarios: [],
          lessons: [],
          questions: [],
          exerciseResults: [],
          isExerciseComplete: false,
        });
      },

      // ────────────────────────────────────────────
      // DATA LOADING
      // ────────────────────────────────────────────
      loadLevels: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/levels`);
          if (!res.ok) throw new Error('Failed to load levels');
          const data = await res.json();
          set({ levels: data.levels ?? data, isLoading: false });
        } catch (error) {
          console.error('Failed to load levels:', error);
          set({ isLoading: false });
        }
      },

      loadScenarios: async (levelId) => {
        set({ isLoading: true, selectedLevelId: levelId });
        try {
          const userId = get().user?.id;
          const url = userId
            ? `${API_BASE}/levels/${levelId}/scenarios?userId=${userId}`
            : `${API_BASE}/levels/${levelId}/scenarios`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to load scenarios');
          const data = await res.json();
          set({ scenarios: data.scenarios ?? data, isLoading: false });
        } catch (error) {
          console.error('Failed to load scenarios:', error);
          set({ isLoading: false });
        }
      },

      loadLessons: async (scenarioId) => {
        set({ isLoading: true, selectedScenarioId: scenarioId });
        try {
          const userId = get().user?.id;
          const url = userId
            ? `${API_BASE}/scenarios/${scenarioId}/lessons?userId=${userId}`
            : `${API_BASE}/scenarios/${scenarioId}/lessons`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to load lessons');
          const data = await res.json();
          set({ lessons: data.lessons ?? data, isLoading: false });
        } catch (error) {
          console.error('Failed to load lessons:', error);
          set({ isLoading: false });
        }
      },

      loadQuestions: async (lessonId) => {
        set({ isLoading: true, selectedLessonId: lessonId });
        try {
          const res = await fetch(`${API_BASE}/lessons/${lessonId}/questions`);
          if (!res.ok) throw new Error('Failed to load questions');
          const data = await res.json();
          set({ questions: data.questions ?? data, isLoading: false });
        } catch (error) {
          console.error('Failed to load questions:', error);
          set({ isLoading: false });
        }
      },

      // ────────────────────────────────────────────
      // EXERCISE ACTIONS
      // ────────────────────────────────────────────
      startExercise: async (lessonId) => {
        set({ isLoading: true });
        try {
          // Load questions for the lesson
          const res = await fetch(`${API_BASE}/lessons/${lessonId}/questions`);
          if (!res.ok) throw new Error('Failed to load questions');
          const data = await res.json();
          const questions = data.questions ?? data;

          set({
            selectedLessonId: lessonId,
            questions,
            currentQuestionIndex: 0,
            selectedAnswer: null,
            isCorrect: null,
            showResult: false,
            exerciseResults: [],
            exerciseStartTime: Date.now(),
            hintsUsed: 0,
            isExerciseComplete: false,
            exerciseXpEarned: 0,
            exerciseStars: 0,
            currentView: 'exercise',
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to start exercise:', error);
          set({ isLoading: false });
        }
      },

      answerQuestion: (answer) => {
        const { questions, currentQuestionIndex, exerciseStartTime, exerciseResults } = get();
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        // Normalize answers for comparison: remove commas and extra spaces for ordering exercises
        // This fixes the bug where order_words correctAnswer is "A, B, C, D" but user input is "A B C D"
        const normalizeAnswer = (ans: string) => ans.trim().toLowerCase().replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim();
        const isCorrect = normalizeAnswer(answer) === normalizeAnswer(currentQuestion.correctAnswer);
        const timeTaken = Date.now() - exerciseStartTime;

        set({
          selectedAnswer: answer,
          isCorrect,
          showResult: true,
          exerciseResults: [
            ...exerciseResults,
            {
              questionId: currentQuestion.id,
              isCorrect,
              timeTaken,
            },
          ],
        });

        // Play sound
        if (isCorrect) {
          get().playSound('correct');
        } else {
          get().playSound('wrong');
        }
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
          // Exercise complete
          get().completeExercise();
        } else {
          set({
            currentQuestionIndex: nextIndex,
            selectedAnswer: null,
            isCorrect: null,
            showResult: false,
            exerciseStartTime: Date.now(),
          });
        }
      },

      completeExercise: async () => {
        const { exerciseResults, questions, selectedLessonId, user } = get();
        if (!user) return;

        // Calculate rewards
        const correctCount = exerciseResults.filter((r) => r.isCorrect).length;
        const totalCount = exerciseResults.length;
        const accuracy = totalCount > 0 ? correctCount / totalCount : 0;

        // XP: base 10 per correct answer + bonus for speed
        const baseXp = correctCount * 10;
        const speedBonus = Math.floor(
          exerciseResults.reduce((sum, r) => sum + (r.isCorrect ? Math.max(0, 30000 - r.timeTaken) / 1000 : 0), 0)
        );
        const totalXp = baseXp + speedBonus;

        // Stars: 3 for 90%+, 2 for 70%+, 1 for 50%+, 0 otherwise
        let stars = 0;
        if (accuracy >= 0.9) stars = 3;
        else if (accuracy >= 0.7) stars = 2;
        else if (accuracy >= 0.5) stars = 1;

        // Coins: 5 per correct answer + bonus for stars
        const coins = correctCount * 5 + stars * 10;

        // Optimistic update - will be corrected by backend response
        const newTotalStars = user.totalStars + stars;
        const newXp = user.xp + totalXp;
        const newCoins = user.coins + coins;
        const newLevel = calculateLevelFromXp(newXp);
        const didLevelUp = newLevel > user.level;

        // Update user state optimistically
        const updatedUser: UserData = {
          ...user,
          xp: newXp,
          coins: newCoins,
          totalStars: newTotalStars,
          level: newLevel,
          exercisesDone: user.exercisesDone + 1,
          wordsLearned: user.wordsLearned + correctCount,
          accuracy:
            user.exercisesDone > 0
              ? (user.accuracy * user.exercisesDone + accuracy) / (user.exercisesDone + 1)
              : accuracy,
        };

        set({
          user: updatedUser,
          isExerciseComplete: true,
          exerciseXpEarned: totalXp,
          exerciseStars: stars,
          showConfetti: stars >= 2,
          showRewardModal: true,
          rewardData: {
            type: 'exercise_complete',
            title: stars >= 2 ? 'Great Job!' : stars >= 1 ? 'Good Effort!' : 'Keep Practicing!',
            message: `You earned ${totalXp} XP, ${coins} coins, and ${stars} star${stars !== 1 ? 's' : ''}!`,
            xp: totalXp,
            coins,
            stars,
          },
        });

        if (didLevelUp) {
          set({ showLevelUpAnimation: true });
          get().playSound('levelup');
        } else if (stars >= 2) {
          get().playSound('reward');
        }

        // Persist results to the backend
        try {
          const res = await fetch(`${API_BASE}/progress/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              lessonId: selectedLessonId,
              stars,
              xpEarned: totalXp,
              accuracy,
              results: exerciseResults,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            // Update user from backend (has accurate stats)
            // Backend will NOT add XP/coins if this was a replay
            if (data.user) {
              set({ user: data.user });
            }
            // If this was a replay, update the UI to show no rewards were earned
            if (data.isReplay) {
              set({
                rewardData: {
                  type: 'exercise_complete',
                  title: 'Practice Complete!',
                  message: 'You already completed this lesson. Only your best star score is updated.',
                  xp: 0,
                  coins: 0,
                  stars: 0,
                },
                exerciseXpEarned: 0,
                showConfetti: false,
              });
            }
            // If the scenario was just completed, play unlock sound
            if (data.scenarioCompleted) {
              get().playSound('unlock');
            }
            // Refresh scenarios to reflect updated progress/unlocks
            const selectedLevelId = get().selectedLevelId;
            if (selectedLevelId) {
              const userId = get().user?.id;
              const url = userId
                ? `${API_BASE}/levels/${selectedLevelId}/scenarios?userId=${userId}`
                : `${API_BASE}/levels/${selectedLevelId}/scenarios`;
              const scenariosRes = await fetch(url);
              if (scenariosRes.ok) {
                const scenariosData = await scenariosRes.json();
                set({ scenarios: scenariosData.scenarios ?? scenariosData });
              }
            }
          }
        } catch (error) {
          console.error('Failed to save exercise results:', error);
        }
      },

      useHint: () => {
        const { hintsUsed, questions, currentQuestionIndex } = get();
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        set({ hintsUsed: hintsUsed + 1 });

        // Show hint as notification
        const hint = currentQuestion.hintEn || currentQuestion.hintEs || 'No hint available';
        set({
          notification: {
            type: 'hint',
            message: `Hint: ${hint}`,
          },
        });
      },

      resetExercise: () => {
        set({
          currentQuestionIndex: 0,
          selectedAnswer: null,
          isCorrect: null,
          showResult: false,
          exerciseResults: [],
          exerciseStartTime: 0,
          hintsUsed: 0,
          isExerciseComplete: false,
          exerciseXpEarned: 0,
          exerciseStars: 0,
          showConfetti: false,
          showRewardModal: false,
          rewardData: null,
        });
      },

      // ────────────────────────────────────────────
      // USER PROGRESS ACTIONS
      // ────────────────────────────────────────────
      addXp: (amount) => {
        const { user } = get();
        if (!user) return;

        const newXp = user.xp + amount;
        const newLevel = calculateLevelFromXp(newXp);
        const didLevelUp = newLevel > user.level;

        set({
          user: { ...user, xp: newXp, level: newLevel },
        });

        if (didLevelUp) {
          set({ showLevelUpAnimation: true });
          get().playSound('levelup');
        }
      },

      addCoins: (amount) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, coins: user.coins + amount } });
      },

      loseLife: () => {
        const { user, infiniteLivesUntil } = get();
        if (!user || user.lives <= 0) return;
        // Don't lose lives if infinite lives is active
        if (infiniteLivesUntil > Date.now()) return;
        const updatedUser = { ...user, lives: user.lives - 1 };
        set({ user: updatedUser });
        // Sync lives to DB
        syncUserToDb(user.id, { lives: updatedUser.lives });
      },

      refillLives: () => {
        const { user } = get();
        if (!user) return;

        const now = new Date();
        const lastRefill = new Date(user.livesLastRefill);
        const minutesSinceRefill = (now.getTime() - lastRefill.getTime()) / 60000;

        // Refill 1 life every 30 minutes
        const livesToRefill = Math.min(
          Math.floor(minutesSinceRefill / 30),
          user.maxLives - user.lives
        );

        if (livesToRefill > 0) {
          const updatedUser = {
            ...user,
            lives: Math.min(user.lives + livesToRefill, user.maxLives),
            livesLastRefill: now.toISOString(),
          };
          set({ user: updatedUser });
          // Sync lives to DB
          syncUserToDb(user.id, { lives: updatedUser.lives, livesLastRefill: updatedUser.livesLastRefill });
        }
      },

      updateStreak: () => {
        const { user } = get();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newStreak = user.streak;
        let newLongestStreak = user.longestStreak;

        if (user.lastActiveDate === today) {
          // Already active today, no change
          return;
        } else if (user.lastActiveDate === yesterday) {
          // Consecutive day
          newStreak = user.streak + 1;
        } else {
          // Streak broken
          newStreak = 1;
        }

        if (newStreak > newLongestStreak) {
          newLongestStreak = newStreak;
        }

        const updatedUser = {
          ...user,
          streak: newStreak,
          longestStreak: newLongestStreak,
          lastActiveDate: today,
        };

        set({ user: updatedUser });
        // Sync streak to DB
        syncUserToDb(user.id, {
          streak: newStreak,
          longestStreak: newLongestStreak,
          lastActiveDate: today,
        });
      },

      // ────────────────────────────────────────────
      // UI ACTIONS
      // ────────────────────────────────────────────
      // ────────────────────────────────────────────
      // SHOP ACTIONS
      // ────────────────────────────────────────────
      loadShop: async () => {
        const { user } = get();
        if (!user) return;
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/shop/inventory?userId=${user.id}`);
          if (!res.ok) throw new Error('Failed to load shop');
          const data = await res.json();
          set({ shopItems: data.shopItems ?? [], inventory: data.inventory ?? [], isLoading: false });
        } catch (error) {
          console.error('Failed to load shop:', error);
          set({ isLoading: false });
        }
      },

      buyReward: async (rewardId) => {
        const { user } = get();
        if (!user) return;
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/shop/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, rewardId }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Purchase failed');
          }
          const data = await res.json();
          set({
            user: data.user ?? user,
            isLoading: false,
          });
          // Reload shop to update purchased state
          await get().loadShop();
          get().playSound('reward');
          get().setNotification({ type: 'success', message: data.message || 'Item purchased!' });
        } catch (error: any) {
          console.error('Buy reward error:', error);
          set({ isLoading: false });
          get().setNotification({ type: 'error', message: error.message || 'Purchase failed' });
        }
      },

      equipReward: async (rewardId) => {
        const { user } = get();
        if (!user) return;
        try {
          const res = await fetch(`${API_BASE}/shop/equip`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, rewardId }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Equip failed');
          }
          const data = await res.json();
          set({ user: data.user ?? user });
          // Reload shop to update equipped state
          await get().loadShop();
          get().playSound('unlock');
          get().setNotification({ type: 'success', message: data.message || 'Item equipped!' });
        } catch (error: any) {
          console.error('Equip reward error:', error);
          get().setNotification({ type: 'error', message: error.message || 'Equip failed' });
        }
      },

      setShowConfetti: (val) => set({ showConfetti: val }),

      setSpeechSpeed: (speed) => set({ speechSpeed: speed }),

      setSpeechVoiceIndex: (index) => set({ speechVoiceIndex: index }),

      setViewMode: (mode) => set({ viewMode: mode }),

      activateInfiniteLives: (minutes) => {
        const until = Date.now() + minutes * 60 * 1000;
        set({ infiniteLivesUntil: until });
        // Also set lives to max during infinite lives
        const { user } = get();
        if (user) {
          set({ user: { ...user, lives: user.maxLives } });
          // Sync infinite lives and lives to DB
          syncUserToDb(user.id, { infiniteLivesUntil: until, lives: user.maxLives });
        }
      },

      hasInfiniteLives: () => {
        const { infiniteLivesUntil } = get();
        return infiniteLivesUntil > Date.now();
      },

      checkStreakGift: () => {
        const { user, lastStreakGiftAt } = get();
        if (!user) return;
        // Show gift modal every 7 streak days
        if (user.streak >= 7 && user.streak !== lastStreakGiftAt && user.streak % 7 === 0) {
          set({ showStreakGiftModal: true, lastStreakGiftAt: user.streak });
        }
      },

      claimStreakGift: (boxIndex) => {
        // Generate gift contents: 3 prizes and 3 dogs, shuffled
        const prizes = [
          { type: 'coins', amount: 100, label: '100 Monedas', icon: '🪙' },
          { type: 'energy', amount: 50, label: '50 Energía', icon: '⚡' },
          { type: 'infinite_lives', amount: 10, label: 'Vidas Infinitas 10 min', icon: '💖' },
          { type: 'dog', amount: 0, label: 'Perro Bravo!', icon: '🐕' },
          { type: 'dog', amount: 0, label: 'Perro Bravo!', icon: '🐕' },
          { type: 'dog', amount: 0, label: 'Perro Bravo!', icon: '🐕' },
        ];
        // Shuffle the prizes deterministically based on current date + streak
        const { user } = get();
        if (!user) return;
        const seed = new Date().toDateString().length + user.streak;
        const shuffled = [...prizes].sort(() => {
          // Simple pseudo-random based on seed
          const x = Math.sin(seed + boxIndex) * 10000;
          return x - Math.floor(x) - 0.5;
        });
        const selected = shuffled[boxIndex];

        if (selected.type === 'dog') {
          get().playSound('bark');
          set({ showStreakGiftModal: false });
          get().setNotification({ type: 'error', message: '🐕 ¡Perro bravo! Más suerte la próxima vez' });
        } else {
          get().playSound('reward');
          const updatedUser = { ...user };
          if (selected.type === 'coins') {
            updatedUser.coins += selected.amount;
          } else if (selected.type === 'energy') {
            updatedUser.coins += 25; // Energy equivalent as coins bonus
          } else if (selected.type === 'infinite_lives') {
            get().activateInfiniteLives(selected.amount);
          }
          set({ user: updatedUser, showStreakGiftModal: false, showConfetti: true });
          get().setNotification({ type: 'success', message: `🎁 ¡Ganaste: ${selected.label}!` });
          // Sync to backend - use the comprehensive sync function
          syncUserToDb(user.id, { coins: updatedUser.coins, xp: updatedUser.xp });
        }
      },

      setShowStreakGiftModal: (val) => set({ showStreakGiftModal: val }),

      playSound: (type) => {
        const { soundEnabled } = get();
        if (!soundEnabled) return;

        // Sound playback via Web Audio API
        try {
          if (typeof window === 'undefined' || !window.AudioContext) return;

          const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

          const frequencies: Record<SoundType, number> = {
            correct: 523.25, // C5
            wrong: 200,     // low buzz
            reward: 659.25, // E5
            levelup: 783.99, // G5
            unlock: 880,    // A5
            bark: 350,      // rough bark
          };

          const frequency = frequencies[type] ?? 440;

          if (type === 'wrong') {
            // Short low buzz for wrong answer
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.3);
          } else if (type === 'bark') {
            // Dog bark: two short bursts
            for (let i = 0; i < 2; i++) {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.type = 'square';
              const startTime = audioCtx.currentTime + i * 0.15;
              osc.frequency.setValueAtTime(400, startTime);
              osc.frequency.exponentialRampToValueAtTime(250, startTime + 0.1);
              gain.gain.setValueAtTime(0.2, startTime);
              gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
              osc.start(startTime);
              osc.stop(startTime + 0.12);
            }
          } else {
            // Pleasant ascending tone for positive sounds
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

            if (type === 'levelup') {
              // Two-tone ascending for level up
              osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
              osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15);
              osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3);
            } else if (type === 'unlock') {
              // Bright double tone for unlock
              osc.frequency.setValueAtTime(880, audioCtx.currentTime);
              osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.1);
            }

            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.5);
          }
        } catch (error) {
          // Silently fail if audio is not available
          console.warn('Sound playback failed:', error);
        }
      },

      claimReward: (reward) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = { ...user };
        if (reward.xp) updatedUser.xp += reward.xp;
        if (reward.coins) updatedUser.coins += reward.coins;
        if (reward.stars) updatedUser.totalStars += reward.stars;

        set({
          user: updatedUser,
          showRewardModal: false,
          rewardData: null,
        });

        get().playSound('reward');
      },

      setNotification: (notification) => set({ notification }),

      setShowRewardModal: (val) => set({ showRewardModal: val }),

      setRewardData: (data) => set({ rewardData: data }),

      setIsLoading: (val) => set({ isLoading: val }),

      setShowLevelUpAnimation: (val) => set({ showLevelUpAnimation: val }),
    }),
    {
      name: 'lingoquest-preferences',
      // Only persist user preferences, not the entire state
      partialize: (state): PersistedPreferences => ({
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        theme: state.user?.theme ?? 'default',
        speechSpeed: state.speechSpeed,
        speechVoiceIndex: state.speechVoiceIndex,
        viewMode: state.viewMode,
        infiniteLivesUntil: state.infiniteLivesUntil,
        lastStreakGiftAt: state.lastStreakGiftAt,
      }),
      // Rehydrate persisted preferences back into the store
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<PersistedPreferences>;
        return {
          ...currentState,
          soundEnabled: persisted.soundEnabled ?? currentState.soundEnabled,
          musicEnabled: persisted.musicEnabled ?? currentState.musicEnabled,
          speechSpeed: persisted.speechSpeed ?? currentState.speechSpeed,
          speechVoiceIndex: persisted.speechVoiceIndex ?? currentState.speechVoiceIndex,
          viewMode: persisted.viewMode ?? currentState.viewMode,
          infiniteLivesUntil: persisted.infiniteLivesUntil ?? currentState.infiniteLivesUntil,
          lastStreakGiftAt: persisted.lastStreakGiftAt ?? currentState.lastStreakGiftAt,
        };
      },
    }
  )
);

// ============================================
// SELECTOR HOOKS (for performance optimization)
// ============================================

/** Select the current view name */
export const useCurrentView = () => useAppStore((s) => s.currentView);

/** Select the current user data */
export const useUser = () => useAppStore((s) => s.user);

/** Select whether the user is logged in */
export const useIsLoggedIn = () => useAppStore((s) => s.isLoggedIn);

/** Select all levels */
export const useLevels = () => useAppStore((s) => s.levels);

/** Select scenarios for the current level */
export const useScenarios = () => useAppStore((s) => s.scenarios);

/** Select lessons for the current scenario */
export const useLessons = () => useAppStore((s) => s.lessons);

/** Select questions for the current exercise */
export const useQuestions = () => useAppStore((s) => s.questions);

/** Select exercise state */
export const useExerciseState = () =>
  useAppStore((s) => ({
    currentQuestionIndex: s.currentQuestionIndex,
    selectedAnswer: s.selectedAnswer,
    isCorrect: s.isCorrect,
    showResult: s.showResult,
    exerciseResults: s.exerciseResults,
    hintsUsed: s.hintsUsed,
    isExerciseComplete: s.isExerciseComplete,
    exerciseXpEarned: s.exerciseXpEarned,
    exerciseStars: s.exerciseStars,
  }));

/** Select UI state */
export const useUIState = () =>
  useAppStore((s) => ({
    showConfetti: s.showConfetti,
    soundEnabled: s.soundEnabled,
    musicEnabled: s.musicEnabled,
    showRewardModal: s.showRewardModal,
    rewardData: s.rewardData,
    isLoading: s.isLoading,
    showLevelUpAnimation: s.showLevelUpAnimation,
    notification: s.notification,
  }));

/** Select current question */
export const useCurrentQuestion = () =>
  useAppStore((s) => s.questions[s.currentQuestionIndex] ?? null);
