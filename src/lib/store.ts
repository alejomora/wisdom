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
  | 'exam'
  | 'battle'
  | 'readings';

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
  energy: number;
  maxEnergy: number;
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
  unlockedSpanishReadings: string[];
  unlockedAudioReadings: string[];
  purchasedReadings: string[];
  shopReadings: ReadingData[];
  purchasedShopReadings: string[];
}

// ============================================
// READING TYPES
// ============================================
export interface ReadingData {
  id: string;
  title: string;
  titleEs: string;
  passage: string;
  passageEs: string;
  level: string;
  difficulty: number;
  xpReward: number;
  questions: ReadingQuestion[];
}

export interface ReadingQuestion {
  id: string;
  question: string;
  questionEs: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  explanationEs: string;
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

  // Battle State
  battleQuestions: Question[];
  battleCurrentIndex: number;
  battleScore: number;
  battleTimeLeft: number;
  battleIsActive: boolean;
  battleResults: ExerciseResult[];
  battleOpponentScore: number;
  battleOpponent: { name: string; avatar: string } | null;

  // Reading State
  readings: ReadingData[];
  currentReading: ReadingData | null;
  showSpanishTranslation: boolean;
  unlockedSpanishReadings: string[];
  unlockedAudioReadings: string[];
  purchasedReadings: string[];

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

  // Session Timer State
  sessionStartTime: number;
  showMiniGame: boolean;
  miniGameType: string; // 'boxes' | 'wheel' | 'memory' | 'trivia'
  miniGameCompleted: boolean;

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
  consumeEnergy: (amount: number) => void;
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

  // Actions - Battle
  startBattle: () => Promise<void>;
  answerBattleQuestion: (answer: string) => void;
  nextBattleQuestion: () => void;
  endBattle: () => void;
  resetBattle: () => void;

  // Actions - Readings
  loadReadings: () => void;
  selectReading: (readingId: string | null) => void;
  unlockSpanishTranslation: (readingId: string) => void;
  unlockAudioReading: (readingId: string) => void;
  answerReadingQuestion: (readingId: string, questionIndex: number, answerIndex: number) => boolean;
  setShowSpanishTranslation: (val: boolean) => void;
  buyReading: (readingId: string) => void;
  buyReadingPack: (level: string, count: number) => void;
  isReadingUnlocked: (readingId: string) => boolean;
  buyShopReading: (readingId: string) => void;
  isShopReadingUnlocked: (readingId: string) => boolean;

  // Actions - Session & Mini Games
  startSessionTimer: () => void;
  activateMiniGame: (gameType: string) => void;
  closeMiniGame: () => void;

  // Actions - Shop Purchases (consumables)
  buyLives: (amount: number) => void;
  buyEnergy: () => void;
  buyCoinPack: (amount: number) => void;
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
// READINGS DATA
// ============================================
const READINGS_DATA: ReadingData[] = [
  {
    id: 'reading-1',
    title: 'A Day at the Park',
    titleEs: 'Un Día en el Parque',
    passage: 'Sarah went to the park on a sunny Saturday morning. She brought a book and a sandwich for lunch. The park was full of children playing on the swings and families having picnics. Sarah found a quiet spot under a large oak tree and started reading. After a while, a friendly dog came up to her and wagged its tail. Sarah gave the dog a small piece of her sandwich. The dog\'s owner, an elderly man, came over and thanked her. They started talking about books and soon became friends. Sarah learned that the man\'s name was Mr. Thompson and he had been a teacher for thirty years. They decided to meet at the park every Saturday to discuss books.',
    passageEs: 'Sarah fue al parque en una mañana soleada de sábado. Trajo un libro y un sándwich para el almuerzo. El parque estaba lleno de niños jugando en los columpios y familias haciendo picnics. Sarah encontró un lugar tranquilo bajo un gran roble y comenzó a leer. Después de un rato, un perro amigable se acercó a ella y movió su cola. Sarah le dio al perro un pequeño trozo de su sándwich. El dueño del perro, un hombre mayor, se acercó y le agradeció. Empezaron a hablar sobre libros y pronto se hicieron amigos. Sarah aprendió que el nombre del hombre era el Sr. Thompson y había sido profesor durante treinta años. Decidieron encontrarse en el parque cada sábado para hablar de libros.',
    level: 'basic',
    difficulty: 2,
    xpReward: 50,
    questions: [
      { id: 'r1q1', question: 'What did Sarah bring to the park?', questionEs: '¿Qué trajo Sarah al parque?', options: ['A bike and a ball', 'A book and a sandwich', 'A phone and a drink', 'A guitar and a hat'], correctAnswer: 1, explanation: 'The text says "She brought a book and a sandwich for lunch."', explanationEs: 'El texto dice "Ella trajo un libro y un sándwich para el almuerzo."' },
      { id: 'r1q2', question: 'Who did Sarah meet at the park?', questionEs: '¿A quién conoció Sarah en el parque?', options: ['A young woman', 'A child', 'An elderly man', 'A teacher from her school'], correctAnswer: 2, explanation: 'She met Mr. Thompson, described as "an elderly man."', explanationEs: 'Conoció al Sr. Thompson, descrito como "un hombre mayor."' },
      { id: 'r1q3', question: 'What was Mr. Thompson\'s profession?', questionEs: '¿Cuál era la profesión del Sr. Thompson?', options: ['Doctor', 'Writer', 'Teacher', 'Chef'], correctAnswer: 2, explanation: 'The text states he "had been a teacher for thirty years."', explanationEs: 'El texto dice que "había sido profesor durante treinta años."' },
      { id: 'r1q4', question: 'What did they decide to do every Saturday?', questionEs: '¿Qué decidieron hacer cada sábado?', options: ['Go swimming', 'Meet at the park to discuss books', 'Have lunch together', 'Walk the dog'], correctAnswer: 1, explanation: 'They "decided to meet at the park every Saturday to discuss books."', explanationEs: 'Decidieron "encontrarse en el parque cada sábado para hablar de libros."' },
    ]
  },
  {
    id: 'reading-2',
    title: 'The Restaurant Order',
    titleEs: 'El Pedido en el Restaurante',
    passage: 'Carlos and Maria decided to try a new Italian restaurant downtown. When they arrived, the waiter greeted them warmly and showed them to a table by the window. Carlos ordered the spaghetti carbonara, which is his favorite pasta dish. Maria chose the mushroom risotto because she is a vegetarian. The waiter recommended a nice red wine to go with their meal. While they waited for their food, they enjoyed the bread and olive oil that was served as a starter. The food arrived after twenty minutes and it was delicious. For dessert, they shared a tiramisu, which was the best they had ever tasted. The total bill came to forty-five dollars, and they left a generous tip for the excellent service.',
    passageEs: 'Carlos y María decidieron probar un nuevo restaurante italiano en el centro. Cuando llegaron, el camarero los recibió calurosamente y los llevó a una mesa junto a la ventana. Carlos pidió los espaguetis carbonara, que es su plato de pasta favorito. María eligió el risotto de champiñones porque es vegetariana. El camarero les recomendó un buen vino tinto para acompañar su comida. Mientras esperaban la comida, disfrutaron del pan y aceite de oliva que se sirvió como entrada. La comida llegó después de veinte minutos y estaba deliciosa. De postre, compartieron un tiramisú, que fue el mejor que habían probado. La cuenta total fue de cuarenta y cinco dólares, y dejaron una generosa propina por el excelente servicio.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'r2q1', question: 'Why did Maria choose the mushroom risotto?', questionEs: '¿Por qué María eligió el risotto de champiñones?', options: ['It was the cheapest option', 'She is a vegetarian', 'The waiter recommended it', 'She loves mushrooms'], correctAnswer: 1, explanation: 'Maria chose it "because she is a vegetarian."', explanationEs: 'María lo eligió "porque es vegetariana."' },
      { id: 'r2q2', question: 'What did they have as a starter?', questionEs: '¿Qué tuvieron como entrada?', options: ['Soup and salad', 'Bread and olive oil', 'Cheese and crackers', 'Bruschetta'], correctAnswer: 1, explanation: 'They enjoyed "bread and olive oil that was served as a starter."', explanationEs: 'Disfrutaron de "pan y aceite de oliva que se sirvió como entrada."' },
      { id: 'r2q3', question: 'What dessert did they share?', questionEs: '¿Qué postre compartieron?', options: ['Cheesecake', 'Gelato', 'Tiramisu', 'Panna cotta'], correctAnswer: 2, explanation: 'They shared a "tiramisu."', explanationEs: 'Compartieron un "tiramisú."' },
      { id: 'r2q4', question: 'How much was the total bill?', questionEs: '¿Cuánto fue la cuenta total?', options: ['Thirty dollars', 'Forty-five dollars', 'Fifty dollars', 'Twenty-five dollars'], correctAnswer: 1, explanation: 'The total bill came to "forty-five dollars."', explanationEs: 'La cuenta total fue de "cuarenta y cinco dólares."' },
    ]
  },
  {
    id: 'reading-3',
    title: 'Job Interview Success',
    titleEs: 'Éxito en la Entrevista de Trabajo',
    passage: 'Emma had been preparing for her job interview at TechCorp for two weeks. She researched the company thoroughly, practiced common interview questions, and picked out a professional outfit. On the day of the interview, she arrived fifteen minutes early. The hiring manager, Mrs. Chen, was impressed by Emma\'s punctuality. During the interview, Emma answered questions confidently and gave specific examples of her previous work experience. She asked thoughtful questions about the company\'s future projects. At the end of the interview, Mrs. Chen told Emma that she was one of the strongest candidates. Three days later, Emma received a phone call offering her the position. She was thrilled and accepted immediately. Emma learned that preparation and confidence are the keys to a successful interview.',
    passageEs: 'Emma había estado preparándose para su entrevista de trabajo en TechCorp durante dos semanas. Investigó la empresa a fondo, practicó preguntas comunes de entrevistas y eligió un atuendo profesional. El día de la entrevista, llegó quince minutos antes. La gerente de contratación, la Sra. Chen, quedó impresionada por la puntualidad de Emma. Durante la entrevista, Emma respondió las preguntas con confianza y dio ejemplos específicos de su experiencia laboral anterior. Hizo preguntas reflexivas sobre los proyectos futuros de la empresa. Al final de la entrevista, la Sra. Chen le dijo a Emma que era una de las candidatas más fuertes. Tres días después, Emma recibió una llamada telefónica ofreciéndole el puesto. Estaba emocionada y aceptó inmediatamente. Emma aprendió que la preparación y la confianza son las claves de una entrevista exitosa.',
    level: 'advanced',
    difficulty: 4,
    xpReward: 75,
    questions: [
      { id: 'r3q1', question: 'How long did Emma prepare for the interview?', questionEs: '¿Cuánto tiempo se preparó Emma para la entrevista?', options: ['One week', 'Two weeks', 'One month', 'Three days'], correctAnswer: 1, explanation: 'She had been preparing "for two weeks."', explanationEs: 'Había estado preparándose "durante dos semanas."' },
      { id: 'r3q2', question: 'How early did Emma arrive for the interview?', questionEs: '¿Cuán temprano llegó Emma para la entrevista?', options: ['Five minutes', 'Ten minutes', 'Fifteen minutes', 'Thirty minutes'], correctAnswer: 2, explanation: 'She "arrived fifteen minutes early."', explanationEs: 'Llegó "quince minutos antes."' },
      { id: 'r3q3', question: 'What impressed Mrs. Chen about Emma?', questionEs: '¿Qué impresionó a la Sra. Chen sobre Emma?', options: ['Her outfit', 'Her punctuality', 'Her resume', 'Her education'], correctAnswer: 1, explanation: 'Mrs. Chen "was impressed by Emma\'s punctuality."', explanationEs: 'La Sra. Chen "quedó impresionada por la puntualidad de Emma."' },
      { id: 'r3q4', question: 'What did Emma learn from this experience?', questionEs: '¿Qué aprendió Emma de esta experiencia?', options: ['Interviews are scary', 'Always wear a suit', 'Preparation and confidence are key', 'Arrive early always'], correctAnswer: 2, explanation: 'She learned that "preparation and confidence are the keys to a successful interview."', explanationEs: 'Aprendió que "la preparación y la confianza son las claves de una entrevista exitosa."' },
    ]
  },
  {
    id: 'reading-4',
    title: 'The Lost Dog',
    titleEs: 'El Perro Perdido',
    passage: 'Last Tuesday, eight-year-old Tom was walking home from school when he found a small brown dog sitting alone on the sidewalk. The dog looked scared and hungry. It had a collar but no tag. Tom carefully approached the dog and offered his sandwich. The dog wagged its tail and ate the sandwich happily. Tom decided to take the dog home. His mother called the animal shelter and the local veterinary clinic. An hour later, a woman named Mrs. Garcia arrived at their house. She had been looking for her dog, Biscuit, since morning. Biscuit had escaped from the garden when the gate was left open. Mrs. Garcia was so grateful that she brought Tom a box of cookies the next day. Tom was happy that Biscuit was safe at home.',
    passageEs: 'El martes pasado, Tom, de ocho años, caminaba hacia casa desde la escuela cuando encontró un pequeño perro marrón sentado solo en la acera. El perro se veía asustado y hambriento. Tenía un collar pero sin chapa. Tom se acercó cuidadosamente al perro y le ofreció su sándwich. El perro movió su cola y comió el sándwich felizmente. Tom decidió llevar al perro a casa. Su madre llamó al refugio de animales y a la clínica veterinaria local. Una hora después, una mujer llamada Sra. García llegó a su casa. Había estado buscando a su perro, Biscuit, desde la mañana. Biscuit había escapado del jardín cuando la puerta se dejó abierta. La Sra. García estaba tan agradecida que le trajo a Tom una caja de galletas al día siguiente. Tom estaba feliz de que Biscuit estuviera seguro en casa.',
    level: 'basic',
    difficulty: 2,
    xpReward: 50,
    questions: [
      { id: 'r4q1', question: 'How old is Tom?', questionEs: '¿Cuántos años tiene Tom?', options: ['Six', 'Seven', 'Eight', 'Nine'], correctAnswer: 2, explanation: 'Tom is described as "eight-year-old."', explanationEs: 'Tom es descrito como "de ocho años."' },
      { id: 'r4q2', question: 'What did Tom give to the dog?', questionEs: '¿Qué le dio Tom al perro?', options: ['A bone', 'His sandwich', 'A toy', 'Some water'], correctAnswer: 1, explanation: 'Tom "offered his sandwich" to the dog.', explanationEs: 'Tom "le ofreció su sándwich" al perro.' },
      { id: 'r4q3', question: 'What was the dog\'s name?', questionEs: '¿Cuál era el nombre del perro?', options: ['Rex', 'Spot', 'Biscuit', 'Brownie'], correctAnswer: 2, explanation: 'The dog\'s name was Biscuit.', explanationEs: 'El nombre del perro era Biscuit.' },
      { id: 'r4q4', question: 'How did the dog escape?', questionEs: '¿Cómo escapó el perro?', options: ['It jumped the fence', 'The gate was left open', 'It dug under the fence', 'Someone took it'], correctAnswer: 1, explanation: 'Biscuit "had escaped from the garden when the gate was left open."', explanationEs: 'Biscuit "había escapado del jardín cuando la puerta se dejó abierta."' },
    ]
  },
  {
    id: 'reading-5',
    title: 'Business Meeting Etiquette',
    titleEs: 'Etiqueta en Reuniones de Negocios',
    passage: 'In the corporate world, understanding business meeting etiquette is essential for professional success. First, always arrive on time or a few minutes early. Being late shows disrespect for others\' time. Second, come prepared with all necessary documents and a clear understanding of the meeting\'s agenda. Third, listen actively when others are speaking. Avoid checking your phone or working on your laptop unless it is directly related to the meeting. Fourth, when presenting your ideas, be concise and clear. Use data and examples to support your points. Fifth, respect differing opinions and engage in constructive debate rather than argument. Finally, after the meeting, send a brief summary email to all participants outlining the key decisions and action items. Following these guidelines will help you build a professional reputation and make your meetings more productive.',
    passageEs: 'En el mundo corporativo, entender la etiqueta de las reuniones de negocios es esencial para el éxito profesional. Primero, siempre llegue a tiempo o unos minutos antes. Llegar tarde muestra falta de respeto por el tiempo de los demás. Segundo, venga preparado con todos los documentos necesarios y una comprensión clara de la agenda de la reunión. Tercero, escuche activamente cuando otros hablan. Evite revisar su teléfono o trabajar en su computadora a menos que esté directamente relacionado con la reunión. Cuarto, al presentar sus ideas, sea conciso y claro. Use datos y ejemplos para apoyar sus puntos. Quinto, respete las opiniones diferentes y participe en un debate constructivo en lugar de una discusión. Finalmente, después de la reunión, envíe un breve correo electrónico resumiendo las decisiones clave y los elementos de acción. Seguir estas pautas le ayudará a construir una reputación profesional y hacer que sus reuniones sean más productivas.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 80,
    questions: [
      { id: 'r5q1', question: 'According to the text, what shows disrespect?', questionEs: 'Según el texto, ¿qué muestra falta de respeto?', options: ['Speaking too much', 'Being late', 'Asking questions', 'Taking notes'], correctAnswer: 1, explanation: 'The text states "Being late shows disrespect for others\' time."', explanationEs: 'El texto dice "Llegar tarde muestra falta de respeto por el tiempo de los demás."' },
      { id: 'r5q2', question: 'What should you do when presenting ideas?', questionEs: '¿Qué debe hacer al presentar ideas?', options: ['Speak loudly', 'Be concise and clear', 'Use many slides', 'Tell jokes'], correctAnswer: 1, explanation: 'The text advises to "be concise and clear" when presenting.', explanationEs: 'El texto aconseja "ser conciso y claro" al presentar.' },
      { id: 'r5q3', question: 'What should you do after the meeting?', questionEs: '¿Qué debe hacer después de la reunión?', options: ['Go home immediately', 'Send a summary email', 'Call your boss', 'Plan the next meeting'], correctAnswer: 1, explanation: 'After the meeting, "send a brief summary email to all participants."', explanationEs: 'Después de la reunión, "envíe un breve correo electrónico resumiendo a todos los participantes."' },
      { id: 'r5q4', question: 'How should you handle differing opinions?', questionEs: '¿Cómo debe manejar opiniones diferentes?', options: ['Ignore them', 'Argue strongly', 'Engage in constructive debate', 'Agree with everyone'], correctAnswer: 2, explanation: 'The text says to "respect differing opinions and engage in constructive debate."', explanationEs: 'El texto dice "respete las opiniones diferentes y participe en un debate constructivo."' },
    ]
  },
  {
    id: 'reading-6',
    title: 'Planning a Vacation',
    titleEs: 'Planear unas Vacaciones',
    passage: 'The Rodriguez family is planning their summer vacation. They want to visit a place where they can relax and have fun. Mr. Rodriguez suggests going to the beach, but Mrs. Rodriguez prefers the mountains where it is cooler. Their teenage daughter, Sofia, wants to visit a big city like New York or Chicago. The youngest son, Diego, says he just wants to go anywhere there is a swimming pool. After discussing for an hour, they decide to compromise. They will go to a resort near a lake that has both a beach area and hiking trails in the nearby mountains. The resort also has an outdoor pool, which makes Diego happy. It is located two hours from a small city where Sofia can go shopping. Mrs. Rodriguez starts looking for flights and hotel reservations online. They plan to stay for one week in July.',
    passageEs: 'La familia Rodríguez está planeando sus vacaciones de verano. Quieren visitar un lugar donde puedan relajarse y divertirse. El Sr. Rodríguez sugiere ir a la playa, pero la Sra. Rodríguez prefiere las montañas donde hace más fresco. Su hija adolescente, Sofía, quiere visitar una gran ciudad como Nueva York o Chicago. El hijo menor, Diego, dice que solo quiere ir a donde haya una piscina. Después de discutir por una hora, deciden llegar a un acuerdo. Irán a un resort cerca de un lago que tiene tanto área de playa como senderos para caminar en las montañas cercanas. El resort también tiene una piscina al aire libre, lo que hace feliz a Diego. Está ubicado a dos horas de una pequeña ciudad donde Sofía puede ir de compras. La Sra. Rodríguez empieza a buscar vuelos y reservas de hotel en línea. Planean quedarse una semana en julio.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'r6q1', question: 'What does Mr. Rodriguez suggest?', questionEs: '¿Qué sugiere el Sr. Rodríguez?', options: ['Going to the mountains', 'Going to the beach', 'Visiting a big city', 'Staying home'], correctAnswer: 1, explanation: 'Mr. Rodriguez "suggests going to the beach."', explanationEs: 'El Sr. Rodríguez "sugiere ir a la playa."' },
      { id: 'r6q2', question: 'What does Diego want?', questionEs: '¿Qué quiere Diego?', options: ['To go to the beach', 'To visit a city', 'A swimming pool', 'To go hiking'], correctAnswer: 2, explanation: 'Diego "just wants to go anywhere there is a swimming pool."', explanationEs: 'Diego "solo quiere ir a donde haya una piscina."' },
      { id: 'r6q3', question: 'What was their final decision?', questionEs: '¿Cuál fue su decisión final?', options: ['Go to the beach', 'Go to the mountains', 'Go to a lake resort', 'Visit New York'], correctAnswer: 2, explanation: 'They decided to "go to a resort near a lake."', explanationEs: 'Decidieron "ir a un resort cerca de un lago."' },
      { id: 'r6q4', question: 'When are they planning to go?', questionEs: '¿Cuándo planean ir?', options: ['In June', 'In July', 'In August', 'In September'], correctAnswer: 1, explanation: 'They plan to stay for "one week in July."', explanationEs: 'Planean quedarse "una semana en julio."' },
    ]
  },
  {
    id: 'reading-7',
    title: 'My First Day at School',
    titleEs: 'Mi Primer Día de Escuela',
    passage: 'It was Maria\'s first day at her new school, and she felt very nervous. Her family had moved to a different city during the summer, so she did not know anyone. When she walked into the classroom, the teacher, Miss Flores, smiled at her and introduced her to the class. "Everyone, this is Maria. Please make her feel welcome," Miss Flores said. A girl named Laura raised her hand and said, "You can sit next to me!" Maria felt relieved. During lunch, Laura invited Maria to eat with her and her friends. They talked about their favorite books and TV shows. By the end of the day, Maria had made three new friends and was no longer nervous. She realized that starting at a new school was not as scary as she had imagined. When she got home, she told her mother it was the best first day ever.',
    passageEs: 'Era el primer día de María en su nueva escuela, y se sentía muy nerviosa. Su familia se había mudado a otra ciudad durante el verano, así que no conocía a nadie. Cuando entró al salón, la maestra, la Srta. Flores, le sonrió y la presentó a la clase. "Todos, esta es María. Por favor hagan que se sienta bienvenida," dijo la Srta. Flores. Una niña llamada Laura levantó la mano y dijo, "¡Puedes sentarte a mi lado!" María se sintió aliviada. Durante el almuerzo, Laura invitó a María a comer con ella y sus amigas. Hablaron sobre sus libros y programas de televisión favoritos. Al final del día, María había hecho tres nuevas amigas y ya no estaba nerviosa. Se dio cuenta de que empezar en una nueva escuela no era tan aterrador como había imaginado. Cuando llegó a casa, le dijo a su madre que había sido el mejor primer día.',
    level: 'basic',
    difficulty: 1,
    xpReward: 50,
    questions: [
      { id: 'r7q1', question: 'Why was Maria nervous?', questionEs: '¿Por qué estaba María nerviosa?', options: ['She forgot her homework', 'It was her first day at a new school', 'She was sick', 'She lost her backpack'], correctAnswer: 1, explanation: 'Maria was nervous because "It was her first day at her new school."', explanationEs: 'María estaba nerviosa porque "Era su primer día en su nueva escuela."' },
      { id: 'r7q2', question: 'Who invited Maria to sit next to her?', questionEs: '¿Quién invitó a María a sentarse a su lado?', options: ['Miss Flores', 'A boy named Carlos', 'A girl named Laura', 'The principal'], correctAnswer: 2, explanation: 'A girl named Laura said, "You can sit next to me!"', explanationEs: 'Una niña llamada Laura dijo, "¡Puedes sentarte a mi lado!"' },
      { id: 'r7q3', question: 'How many friends did Maria make by the end of the day?', questionEs: '¿Cuántas amigas hizo María al final del día?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 2, explanation: 'By the end of the day, Maria "had made three new friends."', explanationEs: 'Al final del día, María "había hecho tres nuevas amigas."' },
      { id: 'r7q4', question: 'What did Maria tell her mother?', questionEs: '¿Qué le dijo María a su madre?', options: ['She wanted to change schools', 'It was the best first day ever', 'She did not like the food', 'The teacher was mean'], correctAnswer: 1, explanation: 'She told her mother "it was the best first day ever."', explanationEs: 'Le dijo a su madre que "había sido el mejor primer día."' },
    ]
  },
  {
    id: 'reading-8',
    title: 'The Farmer\'s Market',
    titleEs: 'El Mercado de Agricultores',
    passage: 'Every Saturday morning, the town holds a farmer\'s market in the central square. Farmers from the surrounding countryside bring their fresh fruits, vegetables, cheese, and bread to sell. The market opens at seven o\'clock and closes at noon. People love to arrive early to get the best selection. There are also local artisans who sell handmade crafts, such as pottery, jewelry, and wooden toys. A small band plays folk music near the fountain, creating a cheerful atmosphere. Children can ride ponies or get their faces painted. Many families make the farmer\'s market a weekly tradition, buying their groceries for the week while enjoying the community spirit. The market has been running for over twenty years and is one of the most popular events in town.',
    passageEs: 'Cada sábado por la mañana, el pueblo celebra un mercado de agricultores en la plaza central. Los agricultores de los alrededores traen sus frutas frescas, verduras, queso y pan para vender. El mercado abre a las siete y cierra al mediodía. A la gente le gusta llegar temprano para obtener la mejor selección. También hay artesanos locales que venden artesanías hechas a mano, como cerámica, joyería y juguetes de madera. Una pequeña banda toca música folclórica cerca de la fuente, creando un ambiente alegre. Los niños pueden montar ponis o que les pinten la cara. Muchas familias hacen del mercado de agricultores una tradición semanal, comprando sus víveres para la semana mientras disfrutan del espíritu comunitario. El mercado ha funcionado durante más de veinte años y es uno de los eventos más populares del pueblo.',
    level: 'basic',
    difficulty: 2,
    xpReward: 50,
    questions: [
      { id: 'r8q1', question: 'When does the market open?', questionEs: '¿Cuándo abre el mercado?', options: ['At six o\'clock', 'At seven o\'clock', 'At eight o\'clock', 'At nine o\'clock'], correctAnswer: 1, explanation: 'The market "opens at seven o\'clock."', explanationEs: 'El mercado "abre a las siete."' },
      { id: 'r8q2', question: 'What do artisans sell at the market?', questionEs: '¿Qué venden los artesanos en el mercado?', options: ['Fresh fish', 'Handmade crafts', 'Clothing', 'Electronics'], correctAnswer: 1, explanation: 'Artisans sell "handmade crafts, such as pottery, jewelry, and wooden toys."', explanationEs: 'Los artesanos venden "artesanías hechas a mano, como cerámica, joyería y juguetes de madera."' },
      { id: 'r8q3', question: 'How long has the market been running?', questionEs: '¿Cuánto tiempo ha funcionado el mercado?', options: ['Five years', 'Ten years', 'Fifteen years', 'Over twenty years'], correctAnswer: 3, explanation: 'The market "has been running for over twenty years."', explanationEs: 'El mercado "ha funcionado durante más de veinte años."' },
      { id: 'r8q4', question: 'What can children do at the market?', questionEs: '¿Qué pueden hacer los niños en el mercado?', options: ['Cook food', 'Ride ponies or get faces painted', 'Sell vegetables', 'Play video games'], correctAnswer: 1, explanation: 'Children can "ride ponies or get their faces painted."', explanationEs: 'Los niños pueden "montar ponis o que les pinten la cara."' },
    ]
  },
  {
    id: 'reading-9',
    title: 'The Weather Forecast',
    titleEs: 'El Pronóstico del Tiempo',
    passage: 'David always checks the weather forecast before planning his weekend activities. On Friday evening, he watched the news and the meteorologist said that Saturday would be sunny and warm, but Sunday would be rainy and cool. David decided to plan a hike for Saturday and an indoor activity for Sunday. He invited his friend Jenny to go hiking at the nearby nature reserve. They packed water bottles, sandwiches, and sunscreen. The hike was wonderful and they saw many beautiful birds and wildflowers. On Sunday, as predicted, it rained all day. David stayed home and baked chocolate chip cookies while listening to his favorite podcasts. He was happy that he had checked the forecast because it helped him make the most of his weekend. If he had not planned ahead, he might have been stuck indoors on the sunny day and caught in the rain on Sunday.',
    passageEs: 'David siempre revisa el pronóstico del tiempo antes de planear sus actividades del fin de semana. El viernes por la noche, vio las noticias y el meteorólogo dijo que el sábado sería soleado y cálido, pero el domingo sería lluvioso y fresco. David decidió planear una caminata para el sábado y una actividad bajo techo para el domingo. Invitó a su amiga Jenny a ir de excursión a la reserva natural cercana. Empacaron botellas de agua, sándwiches y protector solar. La caminata fue maravillosa y vieron muchos pájaros hermosos y flores silvestres. El domingo, como se predijo, llovió todo el día. David se quedó en casa y horneó galletas con chispas de chocolate mientras escuchaba sus podcasts favoritos. Estaba feliz de haber revisado el pronóstico porque lo ayudó a aprovechar al máximo su fin de semana. Si no hubiera planeado con anticipación, podría haber estado atrapado en el interior el día soleado y sorprendido por la lluvia el domingo.',
    level: 'basic',
    difficulty: 2,
    xpReward: 50,
    questions: [
      { id: 'r9q1', question: 'What did the meteorologist say about Sunday?', questionEs: '¿Qué dijo el meteorólogo sobre el domingo?', options: ['It would be hot and sunny', 'It would be rainy and cool', 'It would be windy', 'It would snow'], correctAnswer: 1, explanation: 'The meteorologist said Sunday "would be rainy and cool."', explanationEs: 'El meteorólogo dijo que el domingo "sería lluvioso y fresco."' },
      { id: 'r9q2', question: 'What did David and Jenny pack for the hike?', questionEs: '¿Qué empacaron David y Jenny para la excursión?', options: ['Books and blankets', 'Water, sandwiches, and sunscreen', 'Cameras and maps', 'Fishing rods and bait'], correctAnswer: 1, explanation: 'They "packed water bottles, sandwiches, and sunscreen."', explanationEs: 'Empacaron "botellas de agua, sándwiches y protector solar."' },
      { id: 'r9q3', question: 'What did David do on Sunday?', questionEs: '¿Qué hizo David el domingo?', options: ['Went swimming', 'Baked cookies and listened to podcasts', 'Watched movies', 'Cleaned the house'], correctAnswer: 1, explanation: 'David "stayed home and baked chocolate chip cookies while listening to his favorite podcasts."', explanationEs: 'David "se quedó en casa y horneó galletas con chispas de chocolate mientras escuchaba sus podcasts favoritos."' },
      { id: 'r9q4', question: 'Why was David happy he checked the forecast?', questionEs: '¿Por qué estaba David feliz de haber revisado el pronóstico?', options: ['He liked the meteorologist', 'It helped him make the most of his weekend', 'He wanted to learn about weather', 'His friend told him to'], correctAnswer: 1, explanation: 'He was happy because "it helped him make the most of his weekend."', explanationEs: 'Estaba feliz porque "lo ayudó a aprovechar al máximo su fin de semana."' },
    ]
  },
  {
    id: 'reading-10',
    title: 'The Science Fair Project',
    titleEs: 'El Proyecto de la Feria de Ciencias',
    passage: 'Luis and his science partner, Ana, were working on a project for the school science fair. They decided to investigate which type of soil was best for growing tomato plants. They set up three pots with different types of soil: sand, clay, and potting mix. Each pot received the same amount of water and sunlight. Over four weeks, they carefully measured the height of the plants and recorded their observations in a journal. At the end of the experiment, the plant in potting mix had grown the tallest, reaching thirty centimeters. The plant in clay grew to eighteen centimeters, and the one in sand only reached ten centimeters. Luis and Ana created a colorful poster showing their hypothesis, method, results, and conclusion. At the science fair, the judges were impressed by their thorough work and awarded them second place. Luis learned that careful observation and recording data are essential for good science.',
    passageEs: 'Luis y su compañera de ciencias, Ana, estaban trabajando en un proyecto para la feria de ciencias de la escuela. Decidieron investigar qué tipo de suelo era mejor para cultivar plantas de tomate. Prepararon tres macetas con diferentes tipos de suelo: arena, arcilla y mezcla para macetas. Cada maceta recibió la misma cantidad de agua y luz solar. Durante cuatro semanas, midieron cuidadosamente la altura de las plantas y registraron sus observaciones en un diario. Al final del experimento, la planta en la mezcla para macetas había crecido la más alta, alcanzando treinta centímetros. La planta en arcilla creció a dieciocho centímetros, y la de arena solo alcanzó diez centímetros. Luis y Ana crearon un cartel colorido mostrando su hipótesis, método, resultados y conclusión. En la feria de ciencias, los jueces quedaron impresionados por su trabajo exhaustivo y les otorgaron el segundo lugar. Luis aprendió que la observación cuidadosa y el registro de datos son esenciales para la buena ciencia.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'r10q1', question: 'What was the students\' hypothesis about?', questionEs: '¿Sobre qué era la hipótesis de los estudiantes?', options: ['The best fertilizer', 'Which soil type was best for growing tomatoes', 'How much water tomatoes need', 'The effect of sunlight on plants'], correctAnswer: 1, explanation: 'They decided to "investigate which type of soil was best for growing tomato plants."', explanationEs: 'Decidieron "investigar qué tipo de suelo era mejor para cultivar plantas de tomate."' },
      { id: 'r10q2', question: 'How tall did the plant in potting mix grow?', questionEs: '¿Cuánto creció la planta en la mezcla para macetas?', options: ['Ten centimeters', 'Eighteen centimeters', 'Thirty centimeters', 'Forty centimeters'], correctAnswer: 2, explanation: 'The plant in potting mix "reached thirty centimeters."', explanationEs: 'La planta en la mezcla para macetas "alcanzó treinta centímetros."' },
      { id: 'r10q3', question: 'What prize did Luis and Ana win?', questionEs: '¿Qué premio ganaron Luis y Ana?', options: ['First place', 'Second place', 'Third place', 'Honorable mention'], correctAnswer: 1, explanation: 'The judges "awarded them second place."', explanationEs: 'Los jueces "les otorgaron el segundo lugar."' },
      { id: 'r10q4', question: 'What did Luis learn from the experiment?', questionEs: '¿Qué aprendió Luis del experimento?', options: ['Tomatoes are easy to grow', 'Sand is the worst soil', 'Careful observation and data recording are essential', 'Science fairs are fun'], correctAnswer: 2, explanation: 'Luis learned that "careful observation and recording data are essential for good science."', explanationEs: 'Luis aprendió que "la observación cuidadosa y el registro de datos son esenciales para la buena ciencia."' },
    ]
  },
  {
    id: 'reading-11',
    title: 'Public Transportation in the City',
    titleEs: 'El Transporte Público en la Ciudad',
    passage: 'Using public transportation in a large city can be both convenient and challenging. The subway system is usually the fastest way to travel during rush hour because it avoids traffic on the roads. However, during peak times, the trains can be extremely crowded, and passengers may have to stand for the entire journey. Buses are another popular option. They cover more areas than the subway and are often preferred for shorter distances. One advantage of buses is that passengers can enjoy the view of the city through the windows. Many cities now offer mobile apps that show real-time arrival information, making it easier to plan trips. Monthly passes are usually more economical than buying individual tickets every day. Some cities have also introduced electric buses and bike-sharing programs to reduce pollution. Understanding the different options and planning ahead can make commuting much more pleasant and efficient.',
    passageEs: 'Usar el transporte público en una gran ciudad puede ser tanto conveniente como desafiante. El sistema de metro suele ser la forma más rápida de viajar durante las horas pico porque evita el tráfico en las carreteras. Sin embargo, durante las horas pico, los trenes pueden estar extremadamente llenos, y los pasajeros pueden tener que estar de pie durante todo el viaje. Los autobuses son otra opción popular. Cubren más áreas que el metro y a menudo se prefieren para distancias cortas. Una ventaja de los autobuses es que los pasajeros pueden disfrutar de la vista de la ciudad a través de las ventanas. Muchas ciudades ahora ofrecen aplicaciones móviles que muestran información de llegada en tiempo real, facilitando la planificación de los viajes. Los pases mensuales suelen ser más económicos que comprar boletos individuales todos los días. Algunas ciudades también han introducido autobuses eléctricos y programas de bicicletas compartidas para reducir la contaminación. Entender las diferentes opciones y planificar con anticipación puede hacer que el viaje sea mucho más agradable y eficiente.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'r11q1', question: 'Why is the subway fastest during rush hour?', questionEs: '¿Por qué el metro es más rápido durante las horas pico?', options: ['It has fewer stops', 'It avoids traffic on the roads', 'It runs more frequently', 'It is cheaper'], correctAnswer: 1, explanation: 'The subway is fastest "because it avoids traffic on the roads."', explanationEs: 'El metro es más rápido "porque evita el tráfico en las carreteras."' },
      { id: 'r11q2', question: 'What is one advantage of buses over the subway?', questionEs: '¿Cuál es una ventaja de los autobuses sobre el metro?', options: ['They are faster', 'They are cheaper', 'Passengers can enjoy the city view', 'They are less crowded'], correctAnswer: 2, explanation: 'One advantage is that "passengers can enjoy the view of the city through the windows."', explanationEs: 'Una ventaja es que "los pasajeros pueden disfrutar de la vista de la ciudad a través de las ventanas."' },
      { id: 'r11q3', question: 'What have some cities introduced to reduce pollution?', questionEs: '¿Qué han introducido algunas ciudades para reducir la contaminación?', options: ['More subway lines', 'Electric buses and bike-sharing programs', 'Free transportation', 'Larger buses'], correctAnswer: 1, explanation: 'Some cities have "introduced electric buses and bike-sharing programs to reduce pollution."', explanationEs: 'Algunas ciudades han "introducido autobuses eléctricos y programas de bicicletas compartidas para reducir la contaminación."' },
      { id: 'r11q4', question: 'What makes commuting more pleasant and efficient?', questionEs: '¿Qué hace que el viaje sea más agradable y eficiente?', options: ['Driving a car', 'Avoiding rush hour', 'Understanding options and planning ahead', 'Walking everywhere'], correctAnswer: 2, explanation: 'Understanding options and planning ahead "can make commuting much more pleasant and efficient."', explanationEs: 'Entender las opciones y planificar con anticipación "puede hacer que el viaje sea mucho más agradable y eficiente."' },
    ]
  },
  {
    id: 'reading-12',
    title: 'A Volunteer Experience',
    titleEs: 'Una Experiencia de Voluntariado',
    passage: 'Last summer, Patricia decided to volunteer at a local community center that helps children from low-income families. Every morning from Monday to Friday, she helped the children with their homework and organized educational games. In the afternoons, she assisted with art projects and reading sessions. Patricia was surprised to learn that many of the children did not have books at home, so she started a book donation campaign at her school. Within two weeks, she collected over one hundred books. The children were thrilled to have new stories to read. One boy named Miguel told Patricia that he wanted to become a teacher when he grew up because of the way she helped him learn. This moment deeply touched Patricia. She realized that volunteering was not just about giving time; it was about making a real difference in someone\'s life. She plans to continue volunteering every summer and encourages her friends to do the same.',
    passageEs: 'El verano pasado, Patricia decidió ser voluntaria en un centro comunitario local que ayuda a niños de familias de bajos ingresos. Cada mañana de lunes a viernes, ayudaba a los niños con sus tareas y organizaba juegos educativos. Por las tardes, asistía con proyectos de arte y sesiones de lectura. Patricia se sorprendió al enterarse de que muchos de los niños no tenían libros en casa, así que inició una campaña de donación de libros en su escuela. En dos semanas, recolectó más de cien libros. Los niños estaban emocionados de tener nuevas historias para leer. Un niño llamado Miguel le dijo a Patricia que quería ser maestro cuando creciera por la forma en que ella lo ayudaba a aprender. Este momento conmovió profundamente a Patricia. Se dio cuenta de que ser voluntaria no era solo dar tiempo; era hacer una diferencia real en la vida de alguien. Planea continuar siendo voluntaria cada verano y anima a sus amigos a hacer lo mismo.',
    level: 'intermediate',
    difficulty: 4,
    xpReward: 60,
    questions: [
      { id: 'r12q1', question: 'Why did Patricia start a book donation campaign?', questionEs: '¿Por qué Patricia inició una campaña de donación de libros?', options: ['She wanted to get rid of old books', 'Many children did not have books at home', 'The school asked her to', 'She needed community service hours'], correctAnswer: 1, explanation: 'She started the campaign because "many of the children did not have books at home."', explanationEs: 'Inició la campaña porque "muchos de los niños no tenían libros en casa."' },
      { id: 'r12q2', question: 'How many books did Patricia collect?', questionEs: '¿Cuántos libros recolectó Patricia?', options: ['Fifty books', 'Seventy-five books', 'Over one hundred books', 'Two hundred books'], correctAnswer: 2, explanation: 'She "collected over one hundred books."', explanationEs: 'Recolectó "más de cien libros."' },
      { id: 'r12q3', question: 'What did Miguel want to become?', questionEs: '¿Qué quería ser Miguel?', options: ['A doctor', 'A teacher', 'An artist', 'A scientist'], correctAnswer: 1, explanation: 'Miguel "wanted to become a teacher when he grew up."', explanationEs: 'Miguel "quería ser maestro cuando creciera."' },
      { id: 'r12q4', question: 'What did Patricia realize about volunteering?', questionEs: '¿Qué se dio cuenta Patricia sobre el voluntariado?', options: ['It is boring', 'It was about making a real difference in someone\'s life', 'It is only for students', 'It takes too much time'], correctAnswer: 1, explanation: 'She realized "it was about making a real difference in someone\'s life."', explanationEs: 'Se dio cuenta de que "era hacer una diferencia real en la vida de alguien."' },
    ]
  },
  {
    id: 'reading-13',
    title: 'The Impact of Social Media on Society',
    titleEs: 'El Impacto de las Redes Sociales en la Sociedad',
    passage: 'Social media has transformed the way people communicate, share information, and form opinions. On the positive side, platforms like social networks allow individuals to stay connected with friends and family across the globe. They provide a space for marginalized voices to be heard and enable rapid mobilization for social causes. Small businesses can reach customers without expensive advertising campaigns. However, social media also has significant drawbacks. The spread of misinformation and fake news can influence public opinion and even elections. Studies have shown that excessive social media use can lead to anxiety, depression, and low self-esteem, particularly among teenagers. The algorithms designed to maximize engagement often create echo chambers, where users are only exposed to viewpoints that reinforce their existing beliefs. Finding a balance between leveraging the benefits of social media while mitigating its harms remains one of the great challenges of the digital age. Education in digital literacy is essential for navigating this complex landscape responsibly.',
    passageEs: 'Las redes sociales han transformado la forma en que las personas se comunican, comparten información y forman opiniones. En el lado positivo, las plataformas como las redes sociales permiten a las personas mantenerse conectadas con amigos y familiares en todo el mundo. Proporcionan un espacio para que las voces marginadas sean escuchadas y permiten una movilización rápida para causas sociales. Las pequeñas empresas pueden llegar a los clientes sin costosas campañas publicitarias. Sin embargo, las redes sociales también tienen importantes desventajas. La propagación de información errónea y noticias falsas puede influir en la opinión pública e incluso en las elecciones. Los estudios han demostrado que el uso excesivo de las redes sociales puede provocar ansiedad, depresión y baja autoestima, particularmente entre los adolescentes. Los algoritmos diseñados para maximizar el compromiso a menudo crean cámaras de eco, donde los usuarios solo están expuestos a puntos de vista que refuerzan sus creencias existentes. Encontrar un equilibrio entre aprovechar los beneficios de las redes sociales mientras se mitigan sus daños sigue siendo uno de los grandes desafíos de la era digital. La educación en alfabetización digital es esencial para navegar este paisaje complejo de manera responsable.',
    level: 'advanced',
    difficulty: 4,
    xpReward: 75,
    questions: [
      { id: 'r13q1', question: 'What is one positive effect of social media mentioned?', questionEs: '¿Cuál es un efecto positivo de las redes sociales mencionado?', options: ['It eliminates all misinformation', 'Marginalized voices can be heard', 'It replaces traditional education', 'It reduces screen time'], correctAnswer: 1, explanation: 'Social media "provide a space for marginalized voices to be heard."', explanationEs: 'Las redes sociales "proporcionan un espacio para que las voces marginadas sean escuchadas."' },
      { id: 'r13q2', question: 'What can excessive social media use lead to?', questionEs: '¿A qué puede llevar el uso excesivo de las redes sociales?', options: ['Better physical health', 'Anxiety, depression, and low self-esteem', 'Improved grades', 'More friendships'], correctAnswer: 1, explanation: 'Excessive use "can lead to anxiety, depression, and low self-esteem."', explanationEs: 'El uso excesivo "puede provocar ansiedad, depresión y baja autoestima."' },
      { id: 'r13q3', question: 'What are echo chambers?', questionEs: '¿Qué son las cámaras de eco?', options: ['Rooms with good acoustics', 'Spaces where users only see viewpoints that reinforce existing beliefs', 'Places where people argue', 'Social media headquarters'], correctAnswer: 1, explanation: 'Echo chambers are "where users are only exposed to viewpoints that reinforce their existing beliefs."', explanationEs: 'Las cámaras de eco son "donde los usuarios solo están expuestos a puntos de vista que refuerzan sus creencias existentes."' },
      { id: 'r13q4', question: 'What is essential for navigating the digital landscape responsibly?', questionEs: '¿Qué es esencial para navegar el paisaje digital de manera responsable?', options: ['Using more social media', 'Digital literacy education', 'Avoiding all technology', 'Creating more algorithms'], correctAnswer: 1, explanation: '"Education in digital literacy is essential for navigating this complex landscape responsibly."', explanationEs: '"La educación en alfabetización digital es esencial para navegar este paisaje complejo de manera responsable."' },
    ]
  },
  {
    id: 'reading-14',
    title: 'Climate Change and Renewable Energy',
    titleEs: 'El Cambio Climático y la Energía Renovable',
    passage: 'Climate change is one of the most pressing issues facing the world today. The burning of fossil fuels such as coal, oil, and natural gas releases carbon dioxide and other greenhouse gases into the atmosphere. These gases trap heat from the sun, causing global temperatures to rise. The consequences include melting ice caps, rising sea levels, more frequent extreme weather events, and the loss of biodiversity. To address this crisis, many countries are investing heavily in renewable energy sources. Solar power harnesses energy from the sun using photovoltaic panels, while wind power uses turbines to convert wind energy into electricity. Hydropower generates electricity from flowing water, and geothermal energy taps into heat from beneath the Earth\'s surface. Unlike fossil fuels, these renewable sources produce little to no greenhouse gas emissions. Transitioning to renewable energy requires significant investment and infrastructure changes, but the long-term benefits for the planet are undeniable. Individuals can also contribute by reducing their energy consumption and supporting clean energy initiatives.',
    passageEs: 'El cambio climático es uno de los problemas más urgentes que enfrenta el mundo hoy. La quema de combustibles fósiles como el carbón, el petróleo y el gas natural libera dióxido de carbono y otros gases de efecto invernadero en la atmósfera. Estos gases atrapan el calor del sol, provocando que las temperaturas globales aumenten. Las consecuencias incluyen el derretimiento de los casquetes polares, el aumento del nivel del mar, eventos climáticos extremos más frecuentes y la pérdida de biodiversidad. Para abordar esta crisis, muchos países están invirtiendo fuertemente en fuentes de energía renovable. La energía solar aprovecha la energía del sol usando paneles fotovoltaicos, mientras que la energía eólica usa turbinas para convertir la energía del viento en electricidad. La energía hidroeléctrica genera electricidad a partir del agua que fluye, y la energía geotérmica aprovecha el calor del interior de la Tierra. A diferencia de los combustibles fósiles, estas fuentes renovables producen pocas o ninguna emisión de gases de efecto invernadero. La transición a la energía renovable requiere una inversión significativa y cambios en la infraestructura, pero los beneficios a largo plazo para el planeta son innegables. Los individuos también pueden contribuir reduciendo su consumo de energía y apoyando iniciativas de energía limpia.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 80,
    questions: [
      { id: 'r14q1', question: 'What do greenhouse gases do?', questionEs: '¿Qué hacen los gases de efecto invernadero?', options: ['Cool the Earth', 'Trap heat from the sun', 'Create oxygen', 'Block sunlight'], correctAnswer: 1, explanation: 'Greenhouse gases "trap heat from the sun, causing global temperatures to rise."', explanationEs: 'Los gases de efecto invernadero "atrapán el calor del sol, provocando que las temperaturas globales aumenten."' },
      { id: 'r14q2', question: 'How does solar power work?', questionEs: '¿Cómo funciona la energía solar?', options: ['It burns coal', 'It harnesses energy from the sun using photovoltaic panels', 'It uses wind turbines', 'It taps into underground heat'], correctAnswer: 1, explanation: 'Solar power "harnesses energy from the sun using photovoltaic panels."', explanationEs: 'La energía solar "aprovecha la energía del sol usando paneles fotovoltaicos."' },
      { id: 'r14q3', question: 'What is a benefit of renewable energy over fossil fuels?', questionEs: '¿Cuál es un beneficio de la energía renovable sobre los combustibles fósiles?', options: ['It is cheaper to produce', 'It produces little to no greenhouse gas emissions', 'It is easier to transport', 'It creates more jobs'], correctAnswer: 1, explanation: '"Unlike fossil fuels, these renewable sources produce little to no greenhouse gas emissions."', explanationEs: '"A diferencia de los combustibles fósiles, estas fuentes renovables producen pocas o ninguna emisión de gases de efecto invernadero."' },
      { id: 'r14q4', question: 'How can individuals contribute to addressing climate change?', questionEs: '¿Cómo pueden los individuos contribuir a abordar el cambio climático?', options: ['By using more electricity', 'By reducing energy consumption and supporting clean energy', 'By moving to colder regions', 'By ignoring the problem'], correctAnswer: 1, explanation: 'Individuals can contribute by "reducing their energy consumption and supporting clean energy initiatives."', explanationEs: 'Los individuos pueden contribuir "reduciendo su consumo de energía y apoyando iniciativas de energía limpia."' },
    ]
  },
  {
    id: 'reading-15',
    title: 'The Psychology of Decision Making',
    titleEs: 'La Psicología de la Toma de Decisiones',
    passage: 'Every day, humans make thousands of decisions, from trivial choices like what to eat for breakfast to consequential ones like changing careers. Psychologists have identified several cognitive biases that influence our decision-making processes. Confirmation bias leads people to seek out information that supports their existing beliefs while ignoring contradictory evidence. The anchoring effect causes individuals to rely too heavily on the first piece of information they encounter when making judgments. Loss aversion refers to the tendency to prefer avoiding losses over acquiring equivalent gains, meaning that losing fifty dollars feels worse than gaining fifty dollars feels good. The paradox of choice suggests that having too many options can actually lead to decision paralysis and decreased satisfaction with the chosen option. Understanding these biases is the first step toward making more rational decisions. Strategies such as taking time before making important choices, considering alternative viewpoints, and being aware of emotional influences can help individuals overcome their cognitive limitations and make better-informed decisions.',
    passageEs: 'Cada día, los seres humanos toman miles de decisiones, desde elecciones triviales como qué desayunar hasta decisiones trascendentales como cambiar de carrera. Los psicólogos han identificado varios sesgos cognitivos que influyen en nuestros procesos de toma de decisiones. El sesgo de confirmación lleva a las personas a buscar información que apoye sus creencias existentes mientras ignoran la evidencia contradictoria. El efecto de anclaje hace que los individuos dependan demasiado de la primera información que encuentran al hacer juicios. La aversión a la pérdida se refiere a la tendencia a preferir evitar pérdidas en lugar de adquirir ganancias equivalentes, lo que significa que perder cincuenta dólares se siente peor que ganar cincuenta dólares se siente bien. La paradoja de la elección sugiere que tener demasiadas opciones puede llevar a la parálisis por análisis y a una menor satisfacción con la opción elegida. Entender estos sesgos es el primer paso para tomar decisiones más racionales. Estrategias como tomarse un tiempo antes de hacer elecciones importantes, considerar puntos de vista alternativos y ser consciente de las influencias emocionales pueden ayudar a los individuos a superar sus limitaciones cognitivas y tomar decisiones mejor informadas.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 80,
    questions: [
      { id: 'r15q1', question: 'What is confirmation bias?', questionEs: '¿Qué es el sesgo de confirmación?', options: ['Always confirming your choices', 'Seeking information that supports existing beliefs while ignoring contradictory evidence', 'Agreeing with everyone', 'Making decisions quickly'], correctAnswer: 1, explanation: 'Confirmation bias "leads people to seek out information that supports their existing beliefs while ignoring contradictory evidence."', explanationEs: 'El sesgo de confirmación "lleva a las personas a buscar información que apoye sus creencias existentes mientras ignoran la evidencia contradictoria."' },
      { id: 'r15q2', question: 'What does loss aversion mean?', questionEs: '¿Qué significa la aversión a la pérdida?', options: ['Always choosing the safest option', 'Preferring to avoid losses over acquiring equivalent gains', 'Never taking risks', 'Losing money on purpose'], correctAnswer: 1, explanation: 'Loss aversion is "the tendency to prefer avoiding losses over acquiring equivalent gains."', explanationEs: 'La aversión a la pérdida es "la tendencia a preferir evitar pérdidas en lugar de adquirir ganancias equivalentes."' },
      { id: 'r15q3', question: 'What is the paradox of choice?', questionEs: '¿Qué es la paradoja de la elección?', options: ['Choosing is always good', 'Having too many options can lead to decision paralysis and decreased satisfaction', 'Fewer choices are always better', 'People always choose the first option'], correctAnswer: 1, explanation: 'The paradox of choice suggests "having too many options can actually lead to decision paralysis and decreased satisfaction."', explanationEs: 'La paradoja de la elección sugiere que "tener demasiadas opciones puede llevar a la parálisis por análisis y a una menor satisfacción."' },
      { id: 'r15q4', question: 'What strategy can help overcome cognitive biases?', questionEs: '¿Qué estrategia puede ayudar a superar los sesgos cognitivos?', options: ['Making faster decisions', 'Considering alternative viewpoints and being aware of emotional influences', 'Always trusting your instinct', 'Ignoring psychology'], correctAnswer: 1, explanation: 'Strategies include "considering alternative viewpoints, and being aware of emotional influences."', explanationEs: 'Las estrategias incluyen "considerar puntos de vista alternativos y ser consciente de las influencias emocionales."' },
    ]
  },
];

// ============================================
// AUTOMATIC TITLES BASED ON PROGRESS
// ============================================
export const TITLE_TIERS = [
  { title: 'Principiante', icon: '🌱', minBoards: 0 },
  { title: 'Aprendiz', icon: '📚', minBoards: 5 },
  { title: 'Estudiante', icon: '🎓', minBoards: 15 },
  { title: 'Avanzado', icon: '💪', minBoards: 30 },
  { title: 'Experto', icon: '⭐', minBoards: 50 },
  { title: 'Maestro', icon: '🏆', minBoards: 75 },
  { title: 'Gran Maestro', icon: '👑', minBoards: 100 },
] as const;

export function computeTitle(exercisesDone: number): { title: string; icon: string } {
  let matched = TITLE_TIERS[0];
  for (const tier of TITLE_TIERS) {
    if (exercisesDone >= tier.minBoards) matched = tier;
  }
  return { title: matched.title, icon: matched.icon };
}

function isFirstInLevel(readingId: string, level: string): boolean {
  const levelReadings = READINGS_DATA.filter(r => r.level === level);
  return levelReadings.length > 0 && levelReadings[0].id === readingId;
}

// ============================================
// SHOP EXCLUSIVE READINGS DATA
// These are DIFFERENT readings only available through the shop
// ============================================
const SHOP_READINGS_DATA: ReadingData[] = [
  {
    id: 'shop-reading-1',
    title: 'The Mystery of the Missing Necklace',
    titleEs: 'El Misterio del Collar Perdido',
    passage: 'Detective Clara received a call from Mrs. Henderson on a rainy Monday morning. Her precious diamond necklace had disappeared from the safe in her bedroom. Clara arrived at the mansion and examined the scene carefully. The safe was open but showed no signs of forced entry. There were only three people who knew the combination: Mrs. Henderson herself, her butler James, and her daughter Emily. Clara interviewed each suspect separately. James said he had been in the kitchen all morning preparing breakfast. Emily claimed she was at school and had not returned until noon. Mrs. Henderson said she had last seen the necklace the night before. Clara noticed wet footprints leading from the garden door to the study, where she found a muddy glove under the desk. The glove had the initials E.H. — Emily Henderson. When confronted, Emily confessed that she had taken the necklace to pay for her college tuition and planned to replace it with a fake. Clara returned the necklace and recommended family counseling.',
    passageEs: 'La detective Clara recibió una llamada de la Sra. Henderson en una lluviosa mañana del lunes. Su precioso collar de diamantes había desaparecido de la caja fuerte en su dormitorio. Clara llegó a la mansión y examinó la escena con cuidado. La caja fuerte estaba abierta pero no mostraba señales de entrada forzada. Solo había tres personas que conocían la combinación: la propia Sra. Henderson, su mayordomo James y su hija Emily. Clara entrevistó a cada sospechoso por separado. James dijo que había estado en la cocina toda la mañana preparando el desayuno. Emily afirmó que estaba en la escuela y no había regresado hasta el mediodía. La Sra. Henderson dijo que había visto el collar por última vez la noche anterior. Clara notó huellas mojadas que iban de la puerta del jardín al estudio, donde encontró un guante sucio bajo el escritorio. El guante tenía las iniciales E.H. — Emily Henderson. Cuando fue confrontada, Emily confesó que había tomado el collar para pagar su matrícula universitaria y planeaba reemplazarlo con uno falso. Clara devolvió el collar y recomendó terapia familiar.',
    level: 'intermediate',
    difficulty: 4,
    xpReward: 70,
    questions: [
      { id: 'sr1q1', question: 'Who called Detective Clara?', questionEs: '¿Quién llamó a la detective Clara?', options: ['James the butler', 'Mrs. Henderson', 'Emily Henderson', 'The police'], correctAnswer: 1, explanation: 'Mrs. Henderson called Clara about her missing necklace.', explanationEs: 'La Sra. Henderson llamó a Clara por su collar perdido.' },
      { id: 'sr1q2', question: 'How many people knew the safe combination?', questionEs: '¿Cuántas personas conocían la combinación de la caja fuerte?', options: ['Two', 'Three', 'Four', 'Five'], correctAnswer: 1, explanation: 'Three people knew the combination: Mrs. Henderson, James, and Emily.', explanationEs: 'Tres personas conocían la combinación: la Sra. Henderson, James y Emily.' },
      { id: 'sr1q3', question: 'What clue helped Clara solve the case?', questionEs: '¿Qué pista ayudó a Clara a resolver el caso?', options: ['A broken lock', 'A muddy glove with initials', 'A witness statement', 'A security camera video'], correctAnswer: 1, explanation: 'Clara found a muddy glove with the initials E.H. under the desk.', explanationEs: 'Clara encontró un guante sucio con las iniciales E.H. bajo el escritorio.' },
      { id: 'sr1q4', question: 'Why did Emily take the necklace?', questionEs: '¿Por qué Emily tomó el collar?', options: ['To buy a car', 'To pay for college tuition', 'To give it as a gift', 'To sell it for travel'], correctAnswer: 1, explanation: 'Emily took the necklace to pay for her college tuition.', explanationEs: 'Emily tomó el collar para pagar su matrícula universitaria.' },
    ]
  },
  {
    id: 'shop-reading-2',
    title: 'The Secret Garden Recipe',
    titleEs: 'La Receta del Jardín Secreto',
    passage: 'Grandma Rosa was famous in her small village for her delicious vegetable soup. Everyone wanted to know the secret recipe, but she never shared it. One day, her granddaughter Sofia came to visit for the summer. Sofia loved cooking and begged her grandmother to teach her the recipe. Grandma Rosa smiled and said, "The secret is not in the ingredients, my dear. It is in the garden." Every morning, Rosa took Sofia to the backyard where they grew tomatoes, carrots, onions, and herbs. Rosa explained that fresh ingredients picked at the right time make all the difference. She taught Sofia how to tell when a tomato was perfectly ripe by its color and smell. She showed her how to cut onions without crying by chilling them first. Most importantly, she taught her to add love and patience to every dish. After two weeks of practice, Sofia finally made the soup on her own. Grandma Rosa tasted it and had tears of joy. "You have learned the real secret," she said. "Cooking is about caring for the people you feed." Sofia returned home with more than a recipe — she had learned a philosophy of life.',
    passageEs: 'La abuela Rosa era famosa en su pequeño pueblo por su deliciosa sopa de verduras. Todos querían conocer la receta secreta, pero ella nunca la compartía. Un día, su nieta Sofía vino a visitarla por el verano. A Sofía le encantaba cocinar y le rogó a su abuela que le enseñara la receta. La abuela Rosa sonrió y dijo: "El secreto no está en los ingredientes, querida. Está en el jardín." Cada mañana, Rosa llevaba a Sofía al patio donde cultivaban tomates, zanahorias, cebollas y hierbas. Rosa explicaba que los ingredientes frescos recolectados en el momento adecuado hacen toda la diferencia. Le enseñó a Sofía cómo saber cuándo un tomate estaba perfectamente maduro por su color y olor. Le mostró cómo cortar cebollas sin llorar enfriándolas primero. Lo más importante, le enseñó a añadir amor y paciencia a cada plato. Después de dos semanas de práctica, Sofía finalmente hizo la sopa por su cuenta. La abuela Rosa la probó y tuvo lágrimas de alegría. "Has aprendido el verdadero secreto," dijo. "Cocinar es cuidar a las personas que alimentas." Sofía regresó a casa con más que una receta — había aprendido una filosofía de vida.',
    level: 'basic',
    difficulty: 2,
    xpReward: 55,
    questions: [
      { id: 'sr2q1', question: 'What was Grandma Rosa famous for?', questionEs: '¿Por qué era famosa la abuela Rosa?', options: ['Her singing', 'Her vegetable soup', 'Her garden flowers', 'Her dancing'], correctAnswer: 1, explanation: 'Grandma Rosa was famous for her delicious vegetable soup.', explanationEs: 'La abuela Rosa era famosa por su deliciosa sopa de verduras.' },
      { id: 'sr2q2', question: 'What was the real secret of the recipe?', questionEs: '¿Cuál era el verdadero secreto de la receta?', options: ['A special spice', 'Fresh ingredients from the garden', 'Cooking time', 'A handwritten note'], correctAnswer: 1, explanation: 'The secret was fresh ingredients from the garden, picked at the right time.', explanationEs: 'El secreto era los ingredientes frescos del jardín, recolectados en el momento adecuado.' },
      { id: 'sr2q3', question: 'How did Rosa teach Sofia to cut onions without crying?', questionEs: '¿Cómo enseñó Rosa a Sofía a cortar cebollas sin llorar?', options: ['Wearing goggles', 'Chilling them first', 'Using a food processor', 'Cutting under water'], correctAnswer: 1, explanation: 'She showed her how to cut onions without crying by chilling them first.', explanationEs: 'Le mostró cómo cortar cebollas sin llorar enfriándolas primero.' },
      { id: 'sr2q4', question: 'What did Sofia learn beyond the recipe?', questionEs: '¿Qué aprendió Sofía más allá de la receta?', options: ['How to garden', 'That cooking is about caring for people', 'How to write a cookbook', 'How to run a restaurant'], correctAnswer: 1, explanation: 'Sofia learned that "Cooking is about caring for the people you feed."', explanationEs: 'Sofía aprendió que "Cocinar es cuidar a las personas que alimentas."' },
    ]
  },
  {
    id: 'shop-reading-3',
    title: 'The Space Explorer\'s Journal',
    titleEs: 'El Diario del Explorador Espacial',
    passage: 'Captain Amelia Chen was the first human to set foot on Mars. In her journal, she described the experience as both terrifying and magnificent. The journey from Earth took seven months aboard the spacecraft Horizon. During the trip, the crew of four maintained a strict schedule of exercise, research, and equipment checks to prevent muscle loss in zero gravity. When they finally entered Mars orbit, Amelia could see the massive Olympus Mons volcano and the deep Valles Marineris canyon system from the window. Landing day was the most nerve-wracking experience of her life. The descent module shook violently as it entered the thin Martian atmosphere. When the engines finally shut down and the capsule was still, Amelia opened the hatch and stepped onto the rusty red soil. She felt the light gravity — only about thirty-eight percent of Earth\'s — and described it as feeling like she could jump over a building. The team spent thirty days on the surface, collecting rock samples and searching for signs of ancient water. On day twenty-two, they found mineral deposits that could only have formed in the presence of water, confirming that Mars once had rivers and lakes. Amelia wrote in her journal: "We came looking for the past of Mars, but we found the future of humanity."',
    passageEs: 'La capitana Amelia Chen fue la primera humana en pisar Marte. En su diario, describió la experiencia como aterradora y magnífica al mismo tiempo. El viaje desde la Tierra tomó siete meses a bordo de la nave Horizon. Durante el viaje, la tripulación de cuatro mantuvo un estricto horario de ejercicio, investigación y revisiones de equipo para prevenir la pérdida muscular en gravedad cero. Cuando finalmente entraron en la órbita de Marte, Amelia pudo ver el enorme volcán Olympus Mons y el profundo sistema de cañones Valles Marineris desde la ventana. El día del aterrizaje fue la experiencia más estresante de su vida. El módulo de descenso se sacudió violentamente al entrar en la delgada atmósfera marciana. Cuando los motores finalmente se apagaron y la cápsula quedó quieta, Amelia abrió la escotilla y pisó el suelo rojo oxidado. Sintió la gravedad ligera — solo alrededor del treinta y ocho por ciento de la de la Tierra — y describió que sentía que podría saltar sobre un edificio. El equipo pasó treinta días en la superficie, recolectando muestras de roca y buscando señales de agua antigua. En el día veintidós, encontraron depósitos minerales que solo podrían haberse formado en presencia de agua, confirmando que Marte alguna vez tuvo ríos y lagos. Amelia escribió en su diario: "Vinimos buscando el pasado de Marte, pero encontramos el futuro de la humanidad."',
    level: 'advanced',
    difficulty: 5,
    xpReward: 85,
    questions: [
      { id: 'sr3q1', question: 'How long did the journey from Earth to Mars take?', questionEs: '¿Cuánto tiempo tomó el viaje de la Tierra a Marte?', options: ['Three months', 'Five months', 'Seven months', 'One year'], correctAnswer: 2, explanation: 'The journey from Earth took seven months aboard the spacecraft Horizon.', explanationEs: 'El viaje desde la Tierra tomó siete meses a bordo de la nave Horizon.' },
      { id: 'sr3q2', question: 'How many crew members were on the mission?', questionEs: '¿Cuántos miembros de la tripulación había en la misión?', options: ['Two', 'Three', 'Four', 'Six'], correctAnswer: 2, explanation: 'The crew of four maintained a strict schedule during the trip.', explanationEs: 'La tripulación de cuatro mantuvo un estricto horario durante el viaje.' },
      { id: 'sr3q3', question: 'What is Mars gravity compared to Earth?', questionEs: '¿Cuál es la gravedad de Marte comparada con la Tierra?', options: ['About 10%', 'About 38%', 'About 50%', 'About 75%'], correctAnswer: 1, explanation: 'Mars gravity is only about thirty-eight percent of Earth\'s.', explanationEs: 'La gravedad de Marte es solo alrededor del treinta y ocho por ciento de la de la Tierra.' },
      { id: 'sr3q4', question: 'What did they find on day twenty-two?', questionEs: '¿Qué encontraron en el día veintidós?', options: ['Alien fossils', 'Mineral deposits from ancient water', 'A frozen lake', 'Volcanic activity'], correctAnswer: 1, explanation: 'They found mineral deposits that could only have formed in the presence of water.', explanationEs: 'Encontraron depósitos minerales que solo podrían haberse formado en presencia de agua.' },
    ]
  },
  {
    id: 'shop-reading-4',
    title: 'The Dragon of Crystal Lake',
    titleEs: 'El Dragón del Lago de Cristal',
    passage: 'Long ago, in a small village near Crystal Lake, the people lived in fear of a terrible dragon. Every full moon, the dragon would fly down from the mountain and demand offerings of gold and food. One day, a young girl named Lily decided she had had enough. She packed a bag with bread, cheese, and a small mirror, and climbed the mountain to the dragon\'s cave. When she entered, the dragon roared and breathed fire. But Lily stood tall and said, "I want to talk to you." The dragon was surprised — no one had ever wanted to talk before. Lily asked the dragon why it demanded offerings. The dragon looked sad and said, "I am lonely. Nobody ever visits me except to bring things. I just want a friend." Lily felt sorry for the dragon. She sat down and shared her bread and cheese with it. They talked for hours about the stars, the mountains, and the flowers by the lake. The dragon told Lily its name was Ember and that it had been living alone for a hundred years. From that day on, Lily visited Ember every week. The dragon stopped demanding offerings and instead helped the village by lighting their fires in winter and protecting them from storms. The villagers learned that sometimes the scariest things just need a little kindness.',
    passageEs: 'Hace mucho tiempo, en un pequeño pueblo cerca del Lago de Cristal, la gente vivía con miedo de un terrible dragón. Cada luna llena, el dragón bajaba volando de la montaña y exigía ofrendas de oro y comida. Un día, una niña llamada Lily decidió que había tenido suficiente. Empacó una bolsa con pan, queso y un pequeño espejo, y subió la montaña hasta la cueva del dragón. Cuando entró, el dragón rugió y lanzó fuego. Pero Lily se mantuvo firme y dijo: "Quiero hablar contigo." El dragón se sorprendió — nadie había querido hablar antes. Lily le preguntó al dragón por qué exigía ofrendas. El dragón se veía triste y dijo: "Estoy solo. Nadie me visita nunca excepto para traer cosas. Solo quiero un amigo." Lily sintió pena por el dragón. Se sentó y compartió su pan y queso con él. Hablaron durante horas sobre las estrellas, las montañas y las flores junto al lago. El dragón le dijo a Lily que su nombre era Ember y que había vivido solo por cien años. Desde ese día, Lily visitaba a Ember cada semana. El dragón dejó de exigir ofrendas y en su lugar ayudaba al pueblo encendiendo sus fuegos en invierno y protegiéndolos de las tormentas. Los aldeanos aprendieron que a veces las cosas más aterradoras solo necesitan un poco de bondad.',
    level: 'basic',
    difficulty: 2,
    xpReward: 55,
    questions: [
      { id: 'sr4q1', question: 'What did the dragon demand every full moon?', questionEs: '¿Qué exigía el dragón cada luna llena?', options: ['Children', 'Gold and food', 'Magic spells', 'Flowers and songs'], correctAnswer: 1, explanation: 'The dragon would demand offerings of gold and food every full moon.', explanationEs: 'El dragón exigía ofrendas de oro y comida cada luna llena.' },
      { id: 'sr4q2', question: 'Why did the dragon demand offerings?', questionEs: '¿Por qué el dragón exigía ofrendas?', options: ['It was greedy', 'It was hungry', 'It was lonely and wanted attention', 'It was angry'], correctAnswer: 2, explanation: 'The dragon said "I am lonely. Nobody ever visits me... I just want a friend."', explanationEs: 'El dragón dijo "Estoy solo. Nadie me visita nunca... Solo quiero un amigo."' },
      { id: 'sr4q3', question: 'What was the dragon\'s name?', questionEs: '¿Cuál era el nombre del dragón?', options: ['Firewing', 'Ember', 'Shadow', 'Crystal'], correctAnswer: 1, explanation: 'The dragon told Lily its name was Ember.', explanationEs: 'El dragón le dijo a Lily que su nombre era Ember.' },
      { id: 'sr4q4', question: 'How did the dragon help the village after befriending Lily?', questionEs: '¿Cómo ayudó el dragón al pueblo después de hacerse amigo de Lily?', options: ['It gave them gold', 'It lit their fires and protected them from storms', 'It hunted for them', 'It built houses'], correctAnswer: 1, explanation: 'The dragon helped by lighting their fires in winter and protecting them from storms.', explanationEs: 'El dragón ayudaba encendiendo sus fuegos en invierno y protegiéndolos de las tormentas.' },
    ]
  },
  {
    id: 'shop-reading-5',
    title: 'The Art of Negotiation',
    titleEs: 'El Arte de la Negociación',
    passage: 'Effective negotiation is a skill that can be learned and improved with practice. Whether you are negotiating a salary, a business deal, or a conflict resolution, the same fundamental principles apply. First, preparation is essential. Before any negotiation, research the other party\'s needs, interests, and constraints. Understand your own bottom line — the minimum outcome you would accept. Second, listen more than you speak. Many negotiators make the mistake of talking too much and revealing their position. By listening carefully, you can identify the other party\'s priorities and find areas of mutual benefit. Third, aim for a win-win outcome. The best negotiations leave both parties satisfied. If one side feels cheated, the relationship will suffer and future deals may be impossible. Fourth, be willing to walk away. Having alternatives gives you power. If you have no other options, you will be forced to accept whatever is offered. Fifth, use objective criteria to support your position. Citing market data, industry standards, or expert opinions makes your arguments more persuasive. Finally, maintain a professional and respectful attitude throughout the process. Emotions can derail negotiations, so stay calm and focused on the issues at hand.',
    passageEs: 'La negociación efectiva es una habilidad que se puede aprender y mejorar con la práctica. Ya sea que esté negociando un salario, un acuerdo comercial o una resolución de conflictos, los mismos principios fundamentales se aplican. Primero, la preparación es esencial. Antes de cualquier negociación, investigue las necesidades, intereses y restricciones de la otra parte. Entienda su propia línea base — el resultado mínimo que aceptaría. Segundo, escuche más de lo que habla. Muchos negociadores cometen el error de hablar demasiado y revelar su posición. Al escuchar cuidadosamente, puede identificar las prioridades de la otra parte y encontrar áreas de beneficio mutuo. Tercero, busque un resultado de ganar-ganar. Las mejores negociaciones dejan a ambas partes satisfechas. Si un lado se siente engañado, la relación sufrirá y los acuerdos futuros pueden ser imposibles. Cuarto, esté dispuesto a retirarse. Tener alternativas le da poder. Si no tiene otras opciones, se verá obligado a aceptar lo que se ofrezca. Quinto, use criterios objetivos para apoyar su posición. Citar datos de mercado, estándares de la industria u opiniones de expertos hace que sus argumentos sean más persuasivos. Finalmente, mantenga una actitud profesional y respetuosa durante todo el proceso. Las emociones pueden descarrilar las negociaciones, así que mantenga la calma y concéntrese en los asuntos en cuestión.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 80,
    questions: [
      { id: 'sr5q1', question: 'What should you do before any negotiation?', questionEs: '¿Qué debe hacer antes de cualquier negociación?', options: ['Make demands', 'Prepare and research', 'Find a lawyer', 'Write a contract'], correctAnswer: 1, explanation: 'Preparation is essential — research the other party\'s needs, interests, and constraints.', explanationEs: 'La preparación es esencial — investigue las necesidades, intereses y restricciones de la otra parte.' },
      { id: 'sr5q2', question: 'What mistake do many negotiators make?', questionEs: '¿Qué error cometen muchos negociadores?', options: ['Listening too much', 'Talking too much and revealing their position', 'Being too polite', 'Asking too many questions'], correctAnswer: 1, explanation: 'Many negotiators talk too much and reveal their position instead of listening.', explanationEs: 'Muchos negociadores hablan demasiado y revelan su posición en lugar de escuchar.' },
      { id: 'sr5q3', question: 'What gives you power in a negotiation?', questionEs: '¿Qué le da poder en una negociación?', options: ['Speaking loudly', 'Having alternatives and being willing to walk away', 'Bringing more people', 'Being aggressive'], correctAnswer: 1, explanation: 'Having alternatives and being willing to walk away gives you power.', explanationEs: 'Tener alternativas y estar dispuesto a retirarse le da poder.' },
      { id: 'sr5q4', question: 'Why should you use objective criteria?', questionEs: '¿Por qué debe usar criterios objetivos?', options: ['To confuse the other party', 'To make arguments more persuasive', 'To show off knowledge', 'To delay the negotiation'], correctAnswer: 1, explanation: 'Citing market data, industry standards, or expert opinions makes your arguments more persuasive.', explanationEs: 'Citar datos de mercado, estándares de la industria u opiniones de expertos hace que sus argumentos sean más persuasivos.' },
    ]
  },
  {
    id: 'shop-reading-6',
    title: 'The Robot Soccer Championship',
    titleEs: 'El Campeonato de Fútbol de Robots',
    passage: 'The annual Robot Soccer Championship attracted teams from twenty different countries. Each team had built a team of five small robots programmed to play soccer autonomously. The robots could not be remotely controlled — they had to make their own decisions using artificial intelligence and sensors. Team Japan had the fastest robots with advanced vision systems. Team Germany had the most precise passing algorithms. Team Brazil, surprisingly, had the most creative plays, with robots that could fake out opponents with unexpected moves. The championship final was between Japan and Brazil. In the first half, Japan scored two quick goals using their speed advantage. But in the second half, the Brazilian robots adapted their strategy, spreading the field wider and using quick passes to confuse the Japanese defense. Brazil scored three goals in the final ten minutes to win the championship. The lead programmer for Team Brazil, a sixteen-year-old girl named Ana, explained that she had trained the robots using machine learning from thousands of real soccer matches. "The robots learned that creativity and teamwork can beat raw speed," she said with a smile. The championship proved that the future of robotics is not just about technology — it is about how creatively we use it.',
    passageEs: 'El Campeonato Anual de Fútbol de Robots atrajo a equipos de veinte países diferentes. Cada equipo había construido un equipo de cinco pequeños robots programados para jugar al fútbol de forma autónoma. Los robots no podían ser controlados a distancia — tenían que tomar sus propias decisiones usando inteligencia artificial y sensores. El equipo de Japón tenía los robots más rápidos con sistemas de visión avanzados. El equipo de Alemania tenía los algoritmos de pases más precisos. El equipo de Brasil, sorprendentemente, tenía las jugadas más creativas, con robots que podían engañar a los oponentes con movimientos inesperados. La final del campeonato fue entre Japón y Brasil. En la primera mitad, Japón anotó dos goles rápidos usando su ventaja de velocidad. Pero en la segunda mitad, los robots brasileños adaptaron su estrategia, abriendo más el campo y usando pases rápidos para confundir la defensa japonesa. Brasil anotó tres goles en los últimos diez minutos para ganar el campeonato. La programadora principal del equipo de Brasil, una chica de dieciséis años llamada Ana, explicó que había entrenado a los robots usando aprendizaje automático a partir de miles de partidos de fútbol reales. "Los robots aprendieron que la creatividad y el trabajo en equipo pueden vencer la velocidad bruta," dijo con una sonrisa. El campeonato demostró que el futuro de la robótica no es solo sobre tecnología — se trata de qué tan creativamente la usamos.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 65,
    questions: [
      { id: 'sr6q1', question: 'How many robots did each team have?', questionEs: '¿Cuántos robots tenía cada equipo?', options: ['Three', 'Five', 'Seven', 'Eleven'], correctAnswer: 1, explanation: 'Each team had built a team of five small robots.', explanationEs: 'Cada equipo había construido un equipo de cinco pequeños robots.' },
      { id: 'sr6q2', question: 'What was special about the robots?', questionEs: '¿Qué era especial sobre los robots?', options: ['They were remote controlled', 'They made autonomous decisions using AI', 'They were very expensive', 'They could fly'], correctAnswer: 1, explanation: 'The robots could not be remotely controlled — they made their own decisions using artificial intelligence.', explanationEs: 'Los robots no podían ser controlados a distancia — tomaban sus propias decisiones usando inteligencia artificial.' },
      { id: 'sr6q3', question: 'Who was the lead programmer for Team Brazil?', questionEs: '¿Quién era la programadora principal del equipo de Brasil?', options: ['A professor', 'A sixteen-year-old girl named Ana', 'A professional coach', 'A robotics engineer'], correctAnswer: 1, explanation: 'The lead programmer was a sixteen-year-old girl named Ana.', explanationEs: 'La programadora principal era una chica de dieciséis años llamada Ana.' },
      { id: 'sr6q4', question: 'How did Team Brazil train their robots?', questionEs: '¿Cómo entrenó el equipo de Brasil a sus robots?', options: ['By manually programming each move', 'Using machine learning from thousands of real soccer matches', 'By copying other teams', 'By trial and error only'], correctAnswer: 1, explanation: 'Ana trained the robots using machine learning from thousands of real soccer matches.', explanationEs: 'Ana entrenó a los robots usando aprendizaje automático a partir de miles de partidos de fútbol reales.' },
    ]
  },
  {
    id: 'shop-reading-7',
    title: 'Maria\'s Morning Routine',
    titleEs: 'La Rutina Matutina de María',
    passage: 'Maria wakes up every day at six thirty in the morning. The first thing she does is stretch for five minutes before getting out of bed. Then she goes to the bathroom and brushes her teeth. After that, she takes a quick shower and gets dressed for work. Maria always eats breakfast before leaving the house. She usually has toast with butter and a cup of coffee with milk. Sometimes she adds a piece of fruit like a banana or an apple. While she eats, she listens to the news on the radio. At seven thirty, she puts on her coat, grabs her bag, and walks to the bus stop. The bus arrives at seven forty-five and takes about twenty minutes to get to her office. Maria likes to use this time to read a book or check her messages. She arrives at work by eight fifteen, giving her enough time to settle at her desk before starting at eight thirty. Maria says that having a regular morning routine helps her feel organized and ready for the day ahead.',
    passageEs: 'María se despierta todos los días a las seis y media de la mañana. Lo primero que hace es estirarse durante cinco minutos antes de levantarse de la cama. Luego va al baño y se cepilla los dientes. Después de eso, se da una ducha rápida y se viste para el trabajo. María siempre desayuna antes de salir de casa. Suele comer tostadas con mantequilla y una taza de café con leche. A veces añade una pieza de fruta como un plátano o una manzana. Mientras come, escucha las noticias en la radio. A las siete y media, se pone el abrigo, toma su bolso y camina hacia la parada del autobús. El autobús llega a las siete y cuarenta y cinco y tarda unos veinte minutos en llegar a su oficina. A María le gusta usar este tiempo para leer un libro o revisar sus mensajes. Llega al trabajo a las ocho y cuarto, dándole suficiente tiempo para acomodarse en su escritorio antes de empezar a las ocho y media. María dice que tener una rutina matutina regular la ayuda a sentirse organizada y lista para el día que viene.',
    level: 'basic',
    difficulty: 1,
    xpReward: 50,
    questions: [
      { id: 'sr7q1', question: 'What time does Maria wake up?', questionEs: '¿A qué hora se despierta María?', options: ['Six thirty', 'Seven o\'clock', 'Five forty-five', 'Seven fifteen'], correctAnswer: 0, explanation: 'Maria wakes up every day at six thirty in the morning.', explanationEs: 'María se despierta todos los días a las seis y media de la mañana.' },
      { id: 'sr7q2', question: 'What does Maria usually have for breakfast?', questionEs: '¿Qué suele tomar María para desayunar?', options: ['Cereal and juice', 'Toast with butter and coffee', 'Pancakes and tea', 'Eggs and bacon'], correctAnswer: 1, explanation: 'She usually has toast with butter and a cup of coffee with milk.', explanationEs: 'Suele comer tostadas con mantequilla y una taza de café con leche.' },
      { id: 'sr7q3', question: 'How does Maria get to work?', questionEs: '¿Cómo llega María al trabajo?', options: ['She walks', 'By bus', 'By car', 'By train'], correctAnswer: 1, explanation: 'She walks to the bus stop and takes a bus to her office.', explanationEs: 'Camina hacia la parada del autobús y toma un autobús hacia su oficina.' },
      { id: 'sr7q4', question: 'Why does Maria like having a routine?', questionEs: '¿Por qué le gusta a María tener una rutina?', options: ['It saves money', 'It is faster', 'Her friends have routines too', 'It helps her feel organized and ready'], correctAnswer: 3, explanation: 'Maria says having a regular morning routine helps her feel organized and ready for the day.', explanationEs: 'María dice que tener una rutina matutina regular la ayuda a sentirse organizada y lista.' },
    ]
  },
  {
    id: 'shop-reading-8',
    title: 'The Joy of Painting',
    titleEs: 'La Alegría de Pintar',
    passage: 'When Tom was ten years old, his art teacher gave the class a simple assignment: paint something that makes you happy. While other students painted their pets or their favorite toys, Tom painted a sunset. He mixed orange, pink, and purple on his palette and watched the colors blend together on the paper. Something magical happened that day. Tom discovered that painting made him feel calm and peaceful. He started painting every day after school. First, he used watercolors because they were easy to clean up. Later, he tried acrylics and then oil paints. Each medium had its own special qualities. Watercolors were soft and flowing. Acrylics dried quickly and had bright colors. Oil paints took a long time to dry but allowed him to create smooth blends. By the time Tom was fifteen, he had painted over two hundred pictures. His parents hung his artwork all over their house. One day, a neighbor saw his paintings and asked if she could buy one. Tom was amazed that someone wanted to pay for his art. He sold his first painting for fifty dollars. Today, Tom teaches art at a community center and tells his students the same thing his teacher told him: "Paint what makes you happy."',
    passageEs: 'Cuando Tom tenía diez años, su maestra de arte le dio a la clase una tarea sencilla: pinta algo que te haga feliz. Mientras otros estudiantes pintaban a sus mascotas o sus juguetes favoritos, Tom pintó un atardecer. Mezcló naranja, rosa y púrpura en su paleta y observó cómo los colores se fusionaban en el papel. Algo mágico sucedió ese día. Tom descubrió que pintar lo hacía sentir tranquilo y en paz. Empezó a pintar todos los días después de la escuela. Primero, usó acuarelas porque eran fáciles de limpiar. Más tarde, probó acrílicos y luego pinturas al óleo. Cada medio tenía sus propias cualidades especiales. Las acuarelas eran suaves y fluidas. Los acrílicos se secaban rápidamente y tenían colores brillantes. Las pinturas al óleo tardaban mucho en secarse pero le permitían crear mezclas suaves. Cuando Tom tenía quince años, había pintado más de doscientos cuadros. Sus padres colgaron sus obras de arte por toda la casa. Un día, una vecina vio sus pinturas y preguntó si podía comprar una. Tom estaba asombrado de que alguien quisiera pagar por su arte. Vendió su primera pintura por cincuenta dólares. Hoy, Tom enseña arte en un centro comunitario y les dice a sus estudiantes lo mismo que su maestra le dijo: "Pinta lo que te haga feliz."',
    level: 'basic',
    difficulty: 2,
    xpReward: 55,
    questions: [
      { id: 'sr8q1', question: 'What was Tom\'s art assignment?', questionEs: '¿Cuál era la tarea de arte de Tom?', options: ['Paint a self-portrait', 'Paint a landscape', 'Paint something that makes you happy', 'Paint your family'], correctAnswer: 2, explanation: 'The assignment was to paint something that makes you happy.', explanationEs: 'La tarea era pintar algo que te haga feliz.' },
      { id: 'sr8q2', question: 'Which type of paint dries the fastest?', questionEs: '¿Qué tipo de pintura se seca más rápido?', options: ['Oil paints', 'Acrylics', 'Watercolors', 'Gouache'], correctAnswer: 1, explanation: 'Acrylics dried quickly and had bright colors.', explanationEs: 'Los acrílicos se secaban rápidamente y tenían colores brillantes.' },
      { id: 'sr8q3', question: 'How much did Tom sell his first painting for?', questionEs: '¿Por cuánto vendió Tom su primera pintura?', options: ['Fifty dollars', 'One hundred dollars', 'Twenty dollars', 'Two hundred dollars'], correctAnswer: 0, explanation: 'Tom sold his first painting for fifty dollars.', explanationEs: 'Tom vendió su primera pintura por cincuenta dólares.' },
      { id: 'sr8q4', question: 'What does Tom do now?', questionEs: '¿Qué hace Tom ahora?', options: ['He is a famous artist', 'He sells paintings online', 'He works in a museum', 'He teaches art at a community center'], correctAnswer: 3, explanation: 'Today, Tom teaches art at a community center.', explanationEs: 'Hoy, Tom enseña arte en un centro comunitario.' },
    ]
  },
  {
    id: 'shop-reading-9',
    title: 'My Best Friend Buddy',
    titleEs: 'Mi Mejor Amigo Buddy',
    passage: 'Buddy is a golden retriever who has been part of the Garcia family for three years. They adopted him from an animal shelter when he was just a puppy. At first, Buddy was shy and scared. He hid under the sofa and did not want to come out. But with patience and love, the family helped him feel safe. Now, Buddy is the happiest dog in the neighborhood. Every morning, he wakes up the family by jumping on their beds and wagging his tail. He loves to play fetch in the backyard and can catch a ball in midair. His favorite treat is peanut butter, which the family puts inside a special toy that keeps him busy for hours. Buddy also knows several tricks. He can sit, shake hands, roll over, and even bring the newspaper from the driveway. The most amazing thing about Buddy is how he comforts people. When someone in the family is sad, Buddy lies down next to them and rests his head on their lap. The Garcias say that Buddy is not just a pet — he is a family member who teaches them about loyalty and unconditional love every single day.',
    passageEs: 'Buddy es un golden retriever que ha sido parte de la familia García durante tres años. Lo adoptaron de un refugio de animales cuando era solo un cachorro. Al principio, Buddy era tímido y asustadizo. Se escondía bajo el sofá y no quería salir. Pero con paciencia y amor, la familia lo ayudó a sentirse seguro. Ahora, Buddy es el perro más feliz del vecindario. Cada mañana, despierta a la familia saltando sobre sus camas y moviendo su cola. Le encanta jugar a buscar la pelota en el patio trasero y puede atrapar una bola en el aire. Su premio favorito es la mantequilla de maní, que la familia pone dentro de un juguete especial que lo mantiene ocupado durante horas. Buddy también sabe varios trucos. Puede sentarse, dar la pata, rodar e incluso traer el periódico de la entrada. Lo más increíble de Buddy es cómo consuela a las personas. Cuando alguien en la familia está triste, Buddy se acuesta junto a ellos y reposa su cabeza en su regazo. Los García dicen que Buddy no es solo una mascota — es un miembro de la familia que les enseña sobre lealtad y amor incondicional todos los días.',
    level: 'basic',
    difficulty: 1,
    xpReward: 50,
    questions: [
      { id: 'sr9q1', question: 'Where did the Garcia family get Buddy?', questionEs: '¿De dónde obtuvo la familia García a Buddy?', options: ['From a pet store', 'From an animal shelter', 'From a friend', 'From a breeder'], correctAnswer: 1, explanation: 'They adopted him from an animal shelter when he was just a puppy.', explanationEs: 'Lo adoptaron de un refugio de animales cuando era solo un cachorro.' },
      { id: 'sr9q2', question: 'What is Buddy\'s favorite treat?', questionEs: '¿Cuál es el premio favorito de Buddy?', options: ['Bones', 'Cheese', 'Peanut butter', 'Dog biscuits'], correctAnswer: 2, explanation: 'His favorite treat is peanut butter.', explanationEs: 'Su premio favorito es la mantequilla de maní.' },
      { id: 'sr9q3', question: 'How does Buddy comfort sad family members?', questionEs: '¿Cómo consuela Buddy a los miembros tristes de la familia?', options: ['He lies next to them and rests his head on their lap', 'He brings them toys', 'He barks until they smile', 'He licks their face'], correctAnswer: 0, explanation: 'When someone is sad, Buddy lies down next to them and rests his head on their lap.', explanationEs: 'Cuando alguien está triste, Buddy se acuesta junto a ellos y reposa su cabeza en su regazo.' },
      { id: 'sr9q4', question: 'What does the family say Buddy teaches them?', questionEs: '¿Qué dice la familia que Buddy les enseña?', options: ['How to train dogs', 'How to be brave', 'How to cook', 'Loyalty and unconditional love'], correctAnswer: 3, explanation: 'The Garcias say Buddy teaches them about loyalty and unconditional love every day.', explanationEs: 'Los García dicen que Buddy les enseña sobre lealtad y amor incondicional todos los días.' },
    ]
  },
  {
    id: 'shop-reading-10',
    title: 'The Four Seasons',
    titleEs: 'Las Cuatro Estaciones',
    passage: 'In many parts of the world, the year is divided into four seasons: spring, summer, autumn, and winter. Each season has its own weather, activities, and beauty. Spring arrives after winter and brings warmer temperatures. Trees grow new leaves, flowers begin to bloom, and baby animals are born. Many people enjoy planting gardens and taking walks in the park during spring. Summer is the warmest season. Days are longer, and children are on vacation from school. Families go to the beach, have picnics, and eat ice cream to stay cool. Summer is also a popular time for traveling and outdoor sports like swimming and hiking. Autumn, also called fall, brings cooler weather. The leaves on the trees change color, turning red, orange, and yellow before falling to the ground. People harvest fruits and vegetables, and students return to school. Autumn is famous for its beautiful scenery and holidays like Thanksgiving. Winter is the coldest season. In many places, snow covers the ground and people wear heavy coats, scarves, and gloves. Children love building snowmen and having snowball fights. Each season lasts about three months, and together they create the cycle of nature that affects all living things on Earth.',
    passageEs: 'En muchas partes del mundo, el año se divide en cuatro estaciones: primavera, verano, otoño e invierno. Cada estación tiene su propio clima, actividades y belleza. La primavera llega después del invierno y trae temperaturas más cálidas. Los árboles crecen nuevas hojas, las flores comienzan a florecer y nacen animales bebés. Muchas personas disfrutan plantar jardines y dar paseos por el parque durante la primavera. El verano es la estación más cálida. Los días son más largos y los niños están de vacaciones escolares. Las familias van a la playa, hacen picnics y comen helado para refrescarse. El verano también es una época popular para viajar y practicar deportes al aire libre como la natación y el senderismo. El otoño trae clima más fresco. Las hojas de los árboles cambian de color, volviéndose rojas, naranjas y amarillas antes de caer al suelo. La gente cosecha frutas y verduras, y los estudiantes regresan a la escuela. El otoño es famoso por sus hermosos paisajes y festividades como el Día de Acción de Gracias. El invierno es la estación más fría. En muchos lugares, la nieve cubre el suelo y la gente usa abrigos pesados, bufandas y guantes. A los niños les encanta hacer muñecos de nieve y tener peleas de bolas de nieve. Cada estación dura aproximadamente tres meses y juntas crean el ciclo de la naturaleza que afecta a todos los seres vivos de la Tierra.',
    level: 'basic',
    difficulty: 2,
    xpReward: 55,
    questions: [
      { id: 'sr10q1', question: 'What happens during spring?', questionEs: '¿Qué sucede durante la primavera?', options: ['Leaves fall from trees', 'Snow covers the ground', 'Trees grow new leaves and flowers bloom', 'Days become shorter'], correctAnswer: 2, explanation: 'In spring, trees grow new leaves, flowers begin to bloom, and baby animals are born.', explanationEs: 'En primavera, los árboles crecen nuevas hojas, las flores comienzan a florecer y nacen animales bebés.' },
      { id: 'sr10q2', question: 'Why do people eat ice cream in summer?', questionEs: '¿Por qué la gente come helado en verano?', options: ['It is a tradition', 'To stay cool', 'It is cheaper in summer', 'Ice cream trucks come more often'], correctAnswer: 1, explanation: 'Families eat ice cream to stay cool during summer.', explanationEs: 'Las familias comen helado para refrescarse durante el verano.' },
      { id: 'sr10q3', question: 'What happens to leaves in autumn?', questionEs: '¿Qué les sucede a las hojas en otoño?', options: ['They change color and fall', 'They grow bigger', 'They turn green', 'They become flowers'], correctAnswer: 0, explanation: 'In autumn, leaves change color, turning red, orange, and yellow before falling to the ground.', explanationEs: 'En otoño, las hojas cambian de color, volviéndose rojas, naranjas y amarillas antes de caer al suelo.' },
      { id: 'sr10q4', question: 'How long does each season last?', questionEs: '¿Cuánto dura cada estación?', options: ['One month', 'Six months', 'Two months', 'About three months'], correctAnswer: 3, explanation: 'Each season lasts about three months.', explanationEs: 'Cada estación dura aproximadamente tres meses.' },
    ]
  },
  {
    id: 'shop-reading-11',
    title: 'At the Farmer\'s Market',
    titleEs: 'En el Mercado de Agricultores',
    passage: 'Every Saturday morning, the town square transforms into a busy farmer\'s market. Local farmers and producers set up colorful tents and fill their tables with fresh fruits, vegetables, bread, cheese, and homemade jams. The market opens at eight o\'clock, but early shoppers arrive even before that to get the best selection. Maria, one of the regular vendors, sells organic tomatoes, lettuce, and herbs from her garden. She believes that fresh, locally grown food tastes better and is healthier than food that travels long distances. Next to her tent, Mr. Thompson sells artisan bread that he bakes every Friday night. The smell of warm bread attracts customers from far away. At the corner of the market, a family from Mexico sells tamales and fresh salsa. Their stand always has a long line of hungry customers. Shopping at the farmer\'s market is different from shopping at a supermarket. Here, you can talk directly to the people who grow or make your food. You can ask questions about how the food was produced and even get cooking tips. Many people also bring reusable bags and baskets, which helps reduce plastic waste. The market closes at one in the afternoon, and by then, most of the fresh produce has been sold.',
    passageEs: 'Cada sábado por la mañana, la plaza del pueblo se transforma en un bullicioso mercado de agricultores. Los agricultores y productores locales instalan coloridas carpas y llenan sus mesas con frutas frescas, verduras, pan, queso y mermeladas caseras. El mercado abre a las ocho en punto, pero los compradores madrugadores llegan incluso antes para obtener la mejor selección. María, una de las vendedoras habituales, vende tomates orgánicos, lechuga y hierbas de su jardín. Ella cree que la comida fresca y cultivada localmente sabe mejor y es más saludable que la comida que viaja largas distancias. Junto a su carpa, el Sr. Thompson vende pan artesanal que hornea cada viernes por la noche. El olor del pan tibio atrae a clientes de lejos. En la esquina del mercado, una familia de México vende tamales y salsa fresca. Su puesto siempre tiene una larga fila de clientes hambrientos. Comprar en el mercado de agricultores es diferente a comprar en un supermercado. Aquí, puedes hablar directamente con las personas que cultivan o elaboran tu comida. Puedes hacer preguntas sobre cómo se produjo la comida e incluso obtener consejos de cocina. Muchas personas también traen bolsas y cestas reutilizables, lo que ayuda a reducir los residuos plásticos. El mercado cierra a la una de la tarde, y para entonces, la mayor parte de los productos frescos se han vendido.',
    level: 'basic',
    difficulty: 1,
    xpReward: 50,
    questions: [
      { id: 'sr11q1', question: 'When does the farmer\'s market open?', questionEs: '¿Cuándo abre el mercado de agricultores?', options: ['At eight o\'clock', 'At nine o\'clock', 'At seven o\'clock', 'At ten o\'clock'], correctAnswer: 0, explanation: 'The market opens at eight o\'clock.', explanationEs: 'El mercado abre a las ocho en punto.' },
      { id: 'sr11q2', question: 'What does Mr. Thompson sell?', questionEs: '¿Qué vende el Sr. Thompson?', options: ['Cheese and milk', 'Vegetables', 'Artisan bread', 'Homemade jam'], correctAnswer: 2, explanation: 'Mr. Thompson sells artisan bread that he bakes every Friday night.', explanationEs: 'El Sr. Thompson vende pan artesanal que hornea cada viernes por la noche.' },
      { id: 'sr11q3', question: 'What is a benefit of shopping at the farmer\'s market?', questionEs: '¿Cuál es un beneficio de comprar en el mercado de agricultores?', options: ['The prices are always lower', 'You can talk directly to the people who grow your food', 'It is faster than a supermarket', 'There is more parking'], correctAnswer: 1, explanation: 'At the farmer\'s market, you can talk directly to the people who grow or make your food.', explanationEs: 'En el mercado de agricultores, puedes hablar directamente con las personas que cultivan o elaboran tu comida.' },
      { id: 'sr11q4', question: 'When does the market close?', questionEs: '¿Cuándo cierra el mercado?', options: ['At twelve o\'clock', 'At two o\'clock', 'At eleven o\'clock', 'At one in the afternoon'], correctAnswer: 3, explanation: 'The market closes at one in the afternoon.', explanationEs: 'El mercado cierra a la una de la tarde.' },
    ]
  },
  {
    id: 'shop-reading-12',
    title: 'Riding the School Bus',
    titleEs: 'Viajando en el Autobús Escolar',
    passage: 'Every weekday morning, millions of children around the world ride school buses to get to school. The big yellow bus has become a symbol of education in many countries. The school bus picks up students from designated stops along a route that is carefully planned to be efficient and safe. Jamie is a ten-year-old student who rides bus number seven every morning. Her stop is at the corner of Maple Street and Oak Avenue. She always arrives five minutes early because the bus is never late. The bus driver, Mr. Davis, greets each student by name as they board. Inside the bus, Jamie sits with her best friend, Sophie. They talk about their homework, their teachers, and what they plan to do at recess. The ride takes about twenty minutes, which is just enough time to finish a conversation or review spelling words. Some students read books or listen to music through headphones. The school bus is not just transportation — it is also a place where friendships are made. Jamie has known some of the kids on her bus since kindergarten. The bus also teaches responsibility. Students must follow rules like staying seated, keeping the aisles clear, and using quiet voices so the driver can concentrate on the road.',
    passageEs: 'Cada mañana de lunes a viernes, millones de niños en todo el mundo viajan en autobuses escolares para llegar a la escuela. El gran autobús amarillo se ha convertido en un símbolo de la educación en muchos países. El autobús escolar recoge a los estudiantes en paradas designadas a lo largo de una ruta que está cuidadosamente planificada para ser eficiente y segura. Jamie es una estudiante de diez años que viaja en el autobús número siete cada mañana. Su parada está en la esquina de la calle Maple y la avenida Oak. Siempre llega cinco minutos antes porque el autobús nunca llega tarde. El conductor del autobús, el Sr. Davis, saluda a cada estudiante por su nombre cuando sube. Dentro del autobús, Jamie se sienta con su mejor amiga, Sophie. Hablan sobre su tarea, sus maestros y lo que planean hacer en el recreo. El viaje dura unos veinte minutos, que es suficiente tiempo para terminar una conversación o repasar las palabras de deletreo. Algunos estudiantes leen libros o escuchan música con auriculares. El autobús escolar no es solo transporte — también es un lugar donde se hacen amistades. Jamie conoce a algunos de los niños de su autobús desde el kindergarten. El autobús también enseña responsabilidad. Los estudiantes deben seguir reglas como permanecer sentados, mantener los pasillos despejados y usar voces bajas para que el conductor pueda concentrarse en la carretera.',
    level: 'basic',
    difficulty: 1,
    xpReward: 50,
    questions: [
      { id: 'sr12q1', question: 'What color are school buses in many countries?', questionEs: '¿De qué color son los autobuses escolares en muchos países?', options: ['Green', 'Blue', 'Yellow', 'Red'], correctAnswer: 2, explanation: 'The big yellow bus has become a symbol of education in many countries.', explanationEs: 'El gran autobús amarillo se ha convertido en un símbolo de la educación en muchos países.' },
      { id: 'sr12q2', question: 'Who greets students by name?', questionEs: '¿Quién saluda a los estudiantes por su nombre?', options: ['The bus driver, Mr. Davis', 'The teacher', 'The principal', 'A fellow student'], correctAnswer: 0, explanation: 'The bus driver, Mr. Davis, greets each student by name as they board.', explanationEs: 'El conductor del autobús, el Sr. Davis, saluda a cada estudiante por su nombre cuando sube.' },
      { id: 'sr12q3', question: 'How long does Jamie\'s bus ride take?', questionEs: '¿Cuánto dura el viaje en autobús de Jamie?', options: ['About ten minutes', 'About twenty minutes', 'About thirty minutes', 'About fifteen minutes'], correctAnswer: 1, explanation: 'The ride takes about twenty minutes.', explanationEs: 'El viaje dura unos veinte minutos.' },
      { id: 'sr12q4', question: 'What is one rule students must follow on the bus?', questionEs: '¿Cuál es una regla que los estudiantes deben seguir en el autobús?', options: ['No talking at all', 'Share their snacks', 'Stay seated', 'Read quietly'], correctAnswer: 2, explanation: 'Students must follow rules like staying seated, keeping the aisles clear, and using quiet voices.', explanationEs: 'Los estudiantes deben seguir reglas como permanecer sentados, mantener los pasillos despejados y usar voces bajas.' },
    ]
  },
  {
    id: 'shop-reading-13',
    title: 'A Day at Maple Elementary',
    titleEs: 'Un Día en la Escuela Maple',
    passage: 'Maple Elementary School is a small school with about three hundred students from kindergarten to fifth grade. The school day starts at eight thirty and ends at three o\'clock. Each grade has two classrooms, and every classroom has about twenty-five students and one teacher. The school building is surrounded by a large playground with swings, slides, and a basketball court. A typical day begins with morning announcements over the loudspeaker. Then students go to their first class, which is usually reading or language arts. After that, they have math, then science or social studies. At eleven thirty, students have lunch in the cafeteria. The school serves hot meals, but many students prefer to bring their own lunch from home. After lunch, there is a thirty-minute recess where students can play outside. In the afternoon, students have special classes like art, music, or physical education. On Fridays, the whole school gathers in the auditorium for an assembly where students showcase their projects and celebrate achievements. Mrs. Johnson, the principal, believes that school should be a place where every child feels welcome and excited to learn. She often says, "At Maple Elementary, we grow together."',
    passageEs: 'La Escuela Primaria Maple es una escuela pequeña con unos trescientos estudiantes desde kindergarten hasta quinto grado. El día escolar comienza a las ocho y media y termina a las tres en punto. Cada grado tiene dos salones, y cada salón tiene unos veinticinco estudiantes y un maestro. El edificio de la escuela está rodeado por un gran patio de recreo con columpios, toboganes y una cancha de baloncesto. Un día típico comienza con los anuncios matutinos por el altavoz. Luego los estudiantes van a su primera clase, que suele ser lectura o artes del lenguaje. Después de eso, tienen matemáticas, luego ciencias o estudios sociales. A las once y media, los estudiantes almuerzan en la cafetería. La escuela sirve comidas calientes, pero muchos estudiantes prefieren traer su propio almuerzo de casa. Después del almuerzo, hay un recreo de treinta minutos donde los estudiantes pueden jugar afuera. Por la tarde, los estudiantes tienen clases especiales como arte, música o educación física. Los viernes, toda la escuela se reúne en el auditorio para una asamblea donde los estudiantes presentan sus proyectos y celebran sus logros. La Sra. Johnson, la directora, cree que la escuela debe ser un lugar donde cada niño se sienta bienvenido y emocionado por aprender. Ella suele decir: "En la Escuela Maple, crecemos juntos."',
    level: 'basic',
    difficulty: 2,
    xpReward: 55,
    questions: [
      { id: 'sr13q1', question: 'How many students attend Maple Elementary?', questionEs: '¿Cuántos estudiantes asisten a la Escuela Maple?', options: ['About one hundred', 'About three hundred', 'About five hundred', 'About one thousand'], correctAnswer: 1, explanation: 'Maple Elementary has about three hundred students.', explanationEs: 'La Escuela Maple tiene unos trescientos estudiantes.' },
      { id: 'sr13q2', question: 'What is the first class of the day usually?', questionEs: '¿Cuál suele ser la primera clase del día?', options: ['Reading or language arts', 'Math', 'Science', 'Physical education'], correctAnswer: 0, explanation: 'The first class is usually reading or language arts.', explanationEs: 'La primera clase suele ser lectura o artes del lenguaje.' },
      { id: 'sr13q3', question: 'When do students have recess?', questionEs: '¿Cuándo tienen recreo los estudiantes?', options: ['Before school', 'Before lunch', 'After lunch', 'At the end of the day'], correctAnswer: 2, explanation: 'After lunch, there is a thirty-minute recess where students can play outside.', explanationEs: 'Después del almuerzo, hay un recreo de treinta minutos donde los estudiantes pueden jugar afuera.' },
      { id: 'sr13q4', question: 'What does the principal often say?', questionEs: '¿Qué suele decir la directora?', options: ['"Study hard every day."', '"At Maple Elementary, we grow together."', '"Learning is fun."', '"Welcome to our school."'], correctAnswer: 1, explanation: 'Mrs. Johnson often says, "At Maple Elementary, we grow together."', explanationEs: 'La Sra. Johnson suele decir: "En la Escuela Maple, crecemos juntos."' },
    ]
  },
  {
    id: 'shop-reading-14',
    title: 'Sunday Family Dinner',
    titleEs: 'La Cena Familiar del Domingo',
    passage: 'In the Martinez family, Sunday dinner is the most important tradition of the week. Every Sunday at five o\'clock, the entire family gathers at Grandma Isabel\'s house. The family is big — there are usually about twenty people including aunts, uncles, cousins, and of course Grandma Isabel herself. Preparing the meal is a group effort. Grandma Isabel makes her famous chicken and rice, a recipe that has been in the family for over fifty years. Uncle Pedro brings fresh bread from the bakery where he works. Aunt Carmen makes a big salad with vegetables from her garden. The cousins set the table and help in the kitchen. Dinner is served at six o\'clock, but the food is only part of the tradition. The real magic happens around the table. Family members share stories about their week, laugh at old jokes, and sometimes discuss important family matters. The children play together after eating while the adults have coffee and dessert. Grandma Isabel always says that the secret to a happy family is spending time together. She believes that no matter how busy everyone gets during the week, Sunday dinner reminds them that they are connected and that family comes first. This tradition has kept the Martinez family close for generations, and even the youngest cousins already know that Sunday is for family.',
    passageEs: 'En la familia Martínez, la cena del domingo es la tradición más importante de la semana. Cada domingo a las cinco en punto, toda la familia se reúne en la casa de la abuela Isabel. La familia es grande — suele haber unas veinte personas incluyendo tíos, tías, primos y, por supuesto, la propia abuela Isabel. Preparar la comida es un esfuerzo de grupo. La abuela Isabel prepara su famoso pollo con arroz, una receta que ha estado en la familia por más de cincuenta años. El tío Pedro trae pan fresco de la panadería donde trabaja. La tía Carmen hace una gran ensalada con verduras de su jardín. Los primos ponen la mesa y ayudan en la cocina. La cena se sirve a las seis en punto, pero la comida es solo parte de la tradición. La verdadera magia sucede alrededor de la mesa. Los miembros de la familia comparten historias sobre su semana, se ríen de viejos chistes y a veces discuten asuntos familiares importantes. Los niños juegan juntos después de comer mientras los adultos toman café y postre. La abuela Isabel siempre dice que el secreto de una familia feliz es pasar tiempo juntos. Ella cree que no importa qué tan ocupados estén todos durante la semana, la cena del domingo les recuerda que están conectados y que la familia es lo primero. Esta tradición ha mantenido unida a la familia Martínez durante generaciones, e incluso los primos más pequeños ya saben que el domingo es para la familia.',
    level: 'basic',
    difficulty: 2,
    xpReward: 55,
    questions: [
      { id: 'sr14q1', question: 'What time does the Martinez family gather on Sundays?', questionEs: '¿A qué hora se reúne la familia Martínez los domingos?', options: ['At five o\'clock', 'At six o\'clock', 'At four o\'clock', 'At seven o\'clock'], correctAnswer: 0, explanation: 'Every Sunday at five o\'clock, the entire family gathers at Grandma Isabel\'s house.', explanationEs: 'Cada domingo a las cinco en punto, toda la familia se reúne en la casa de la abuela Isabel.' },
      { id: 'sr14q2', question: 'What does Grandma Isabel make for dinner?', questionEs: '¿Qué prepara la abuela Isabel para la cena?', options: ['Pasta and salad', 'Chicken and rice', 'Roast beef and potatoes', 'Fish and vegetables'], correctAnswer: 1, explanation: 'Grandma Isabel makes her famous chicken and rice.', explanationEs: 'La abuela Isabel prepara su famoso pollo con arroz.' },
      { id: 'sr14q3', question: 'How many people usually attend Sunday dinner?', questionEs: '¿Cuántas personas suelen asistir a la cena del domingo?', options: ['About ten', 'About thirty', 'About twenty', 'About fifteen'], correctAnswer: 2, explanation: 'There are usually about twenty people at Sunday dinner.', explanationEs: 'Suele haber unas veinte personas en la cena del domingo.' },
      { id: 'sr14q4', question: 'What does Grandma Isabel say is the secret to a happy family?', questionEs: '¿Qué dice la abuela Isabel que es el secreto de una familia feliz?', options: ['Eating good food', 'Having a big house', 'Working hard', 'Spending time together'], correctAnswer: 3, explanation: 'Grandma Isabel always says that the secret to a happy family is spending time together.', explanationEs: 'La abuela Isabel siempre dice que el secreto de una familia feliz es pasar tiempo juntos.' },
    ]
  },
  {
    id: 'shop-reading-15',
    title: 'Lost in Tokyo',
    titleEs: 'Perdido en Tokio',
    passage: 'When Daniel arrived in Tokyo for the first time, he felt like he had landed on another planet. The train station was enormous, with thousands of people walking in every direction. The signs were all in Japanese, and although he had studied basic phrases, he could not read the characters. He had planned to take the train to his hotel, but he could not figure out which platform to use. After standing helplessly for ten minutes, he decided to ask for help. He approached a young woman in a business suit and said slowly, "Excuse me, do you speak English?" To his relief, she smiled and answered in perfect English. She not only told him which train to take but also walked him to the correct platform and showed him how to buy a ticket from the machine. During the train ride, Daniel noticed how clean and quiet everything was. People spoke softly on their phones and did not eat or drink on the train. When he finally arrived at his hotel, he felt grateful for the kindness of strangers. That experience taught him an important lesson about traveling: language barriers can be challenging, but most people are willing to help if you ask politely. He spent the rest of his trip exploring temples, eating ramen, and making friends with locals who appreciated his effort to learn their language.',
    passageEs: 'Cuando Daniel llegó a Tokio por primera vez, sintió como si hubiera aterrizado en otro planeta. La estación de tren era enorme, con miles de personas caminando en todas direcciones. Los letreros estaban todos en japonés, y aunque había estudiado frases básicas, no podía leer los caracteres. Había planeado tomar el tren hacia su hotel, pero no podía descifrar qué plataforma usar. Después de estar parado sin saber qué hacer durante diez minutos, decidió pedir ayuda. Se acercó a una joven con traje de negocios y dijo lentamente: "Disculpe, ¿habla inglés?" Para su alivio, ella sonrió y respondió en inglés perfecto. No solo le dijo qué tren tomar, sino que también lo acompañó hasta la plataforma correcta y le mostró cómo comprar un boleto en la máquina. Durante el viaje en tren, Daniel notó qué tan limpio y silencioso era todo. La gente hablaba en voz baja por teléfono y no comía ni bebía en el tren. Cuando finalmente llegó a su hotel, se sintió agradecido por la bondad de los extraños. Esa experiencia le enseñó una lección importante sobre viajar: las barreras del idioma pueden ser un desafío, pero la mayoría de las personas están dispuestas a ayudar si preguntas con educación. Pasó el resto de su viaje explorando templos, comiendo ramen y haciendo amigos con los locales que apreciaban su esfuerzo por aprender su idioma.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'sr15q1', question: 'Why did Daniel feel like he was on another planet?', questionEs: '¿Por qué Daniel sentía como si estuviera en otro planeta?', options: ['The food was strange', 'The signs were all in Japanese and he could not read them', 'The weather was different', 'Everyone was staring at him'], correctAnswer: 1, explanation: 'The signs were all in Japanese, and he could not read the characters.', explanationEs: 'Los letreros estaban todos en japonés, y no podía leer los caracteres.' },
      { id: 'sr15q2', question: 'How did the young woman help Daniel?', questionEs: '¿Cómo ayudó la joven a Daniel?', options: ['She called a taxi for him', 'She told him which train and walked him to the platform', 'She gave him a map', 'She translated all the signs'], correctAnswer: 1, explanation: 'She told him which train to take and walked him to the correct platform.', explanationEs: 'Le dijo qué tren tomar y lo acompañó hasta la plataforma correcta.' },
      { id: 'sr15q3', question: 'What did Daniel notice about the train?', questionEs: '¿Qué notó Daniel sobre el tren?', options: ['It was clean and quiet', 'It was very crowded', 'It was delayed', 'It was very fast'], correctAnswer: 0, explanation: 'Daniel noticed how clean and quiet everything was on the train.', explanationEs: 'Daniel notó qué tan limpio y silencioso era todo en el tren.' },
      { id: 'sr15q4', question: 'What lesson did Daniel learn about traveling?', questionEs: '¿Qué lección aprendió Daniel sobre viajar?', options: ['Always carry a map', 'Learn the language before you go', 'Most people are willing to help if you ask politely', 'Never travel alone'], correctAnswer: 2, explanation: 'He learned that most people are willing to help if you ask politely.', explanationEs: 'Aprendió que la mayoría de las personas están dispuestas a ayudar si preguntas con educación.' },
    ]
  },
  {
    id: 'shop-reading-16',
    title: 'The Smartphone Revolution',
    titleEs: 'La Revolución del Teléfono Inteligente',
    passage: 'It is hard to imagine life without smartphones today, but these devices have only been around for a little over fifteen years. Before smartphones, people used separate devices for different tasks: a camera for photos, a map for directions, a calculator for math, and a phone for calls. The smartphone combined all of these functions into one device that fits in your pocket. This change revolutionized how people communicate, work, and entertain themselves. Social media apps like Instagram and TikTok have created entirely new ways to share experiences and connect with others. Navigation apps have made it almost impossible to get lost. Mobile banking allows people to manage their money without visiting a bank. However, the smartphone revolution has also brought challenges. Many people spend too much time on their phones, leading to problems with sleep, concentration, and social skills. Children and teenagers are especially vulnerable to screen addiction. Some schools have banned phones during class time to help students focus. Privacy is another concern, as smartphones collect vast amounts of personal data. Despite these challenges, smartphones continue to evolve. New features like artificial intelligence assistants, foldable screens, and improved cameras appear every year. The key is finding a healthy balance between using technology and living in the real world.',
    passageEs: 'Es difícil imaginar la vida sin teléfonos inteligentes hoy en día, pero estos dispositivos solo han existido por un poco más de quince años. Antes de los teléfonos inteligentes, las personas usaban dispositivos separados para diferentes tareas: una cámara para fotos, un mapa para direcciones, una calculadora para matemáticas y un teléfono para llamadas. El teléfono inteligente combinó todas estas funciones en un dispositivo que cabe en tu bolsillo. Este cambio revolucionó la forma en que las personas se comunican, trabajan y se entretienen. Las aplicaciones de redes sociales como Instagram y TikTok han creado formas completamente nuevas de compartir experiencias y conectar con otros. Las aplicaciones de navegación han hecho que sea casi imposible perderse. La banca móvil permite a las personas administrar su dinero sin visitar un banco. Sin embargo, la revolución del teléfono inteligente también ha traído desafíos. Muchas personas pasan demasiado tiempo en sus teléfonos, lo que lleva a problemas de sueño, concentración y habilidades sociales. Los niños y adolescentes son especialmente vulnerables a la adicción a las pantallas. Algunas escuelas han prohibido los teléfonos durante las clases para ayudar a los estudiantes a concentrarse. La privacidad es otra preocupación, ya que los teléfonos inteligentes recopilan grandes cantidades de datos personales. A pesar de estos desafíos, los teléfonos inteligentes continúan evolucionando. Nuevas funciones como asistentes de inteligencia artificial, pantallas plegables y cámaras mejoradas aparecen cada año. La clave es encontrar un equilibrio saludable entre el uso de la tecnología y la vida en el mundo real.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 65,
    questions: [
      { id: 'sr16q1', question: 'How long have smartphones been around?', questionEs: '¿Cuánto tiempo hace que existen los teléfonos inteligentes?', options: ['About five years', 'About ten years', 'A little over fifteen years', 'About twenty years'], correctAnswer: 2, explanation: 'Smartphones have only been around for a little over fifteen years.', explanationEs: 'Los teléfonos inteligentes solo han existido por un poco más de quince años.' },
      { id: 'sr16q2', question: 'What did people use before smartphones for different tasks?', questionEs: '¿Qué usaba la gente antes de los teléfonos inteligentes para diferentes tareas?', options: ['Separate devices for each task', 'Only computers', 'Nothing at all', 'Other people to help them'], correctAnswer: 0, explanation: 'Before smartphones, people used separate devices for different tasks.', explanationEs: 'Antes de los teléfonos inteligentes, las personas usaban dispositivos separados para diferentes tareas.' },
      { id: 'sr16q3', question: 'What problem do children and teenagers face with smartphones?', questionEs: '¿Qué problema enfrentan los niños y adolescentes con los teléfonos inteligentes?', options: ['High costs', 'Screen addiction', 'Poor camera quality', 'Limited apps'], correctAnswer: 1, explanation: 'Children and teenagers are especially vulnerable to screen addiction.', explanationEs: 'Los niños y adolescentes son especialmente vulnerables a la adicción a las pantallas.' },
      { id: 'sr16q4', question: 'What is the key message about smartphone use?', questionEs: '¿Cuál es el mensaje clave sobre el uso de teléfonos inteligentes?', options: ['Use them as much as possible', 'Avoid them completely', 'Only use them for work', 'Finding a healthy balance'], correctAnswer: 3, explanation: 'The key is finding a healthy balance between using technology and living in the real world.', explanationEs: 'La clave es encontrar un equilibrio saludable entre el uso de la tecnología y la vida en el mundo real.' },
    ]
  },
  {
    id: 'shop-reading-17',
    title: 'The Plastic Problem',
    titleEs: 'El Problema del Plástico',
    passage: 'Every year, approximately eight million tons of plastic waste enters the world\'s oceans. This staggering amount is equivalent to dumping a garbage truck full of plastic into the ocean every minute of every day. Plastic does not decompose like organic materials. Instead, it breaks down into smaller pieces called microplastics, which can take hundreds of years to disappear. These tiny plastic particles are swallowed by fish, birds, and other marine animals, causing serious health problems and even death. Scientists have found microplastics in the deepest parts of the ocean and in the most remote areas of the Arctic. Even more alarming, microplastics have been detected in the food we eat and the water we drink. The plastic problem affects humans directly. Many countries are taking action to reduce plastic waste. Some have banned single-use plastic bags and straws. Others have implemented deposit return schemes for plastic bottles, encouraging people to recycle. Innovative companies are developing biodegradable alternatives made from corn starch, seaweed, and other natural materials. Individual actions also matter. Using reusable bags, bottles, and containers can significantly reduce the amount of plastic waste each person generates. Refusing plastic cutlery, bringing your own coffee cup, and choosing products with minimal packaging are small steps that add up to a big difference. The ocean belongs to everyone, and protecting it is a shared responsibility.',
    passageEs: 'Cada año, aproximadamente ocho millones de toneladas de residuos plásticos entran en los océanos del mundo. Esta asombrosa cantidad es equivalente a verter un camión de basura lleno de plástico en el océano cada minuto de cada día. El plástico no se descompone como los materiales orgánicos. En su lugar, se descompone en piezas más pequeñas llamadas microplásticos, que pueden tardar cientos de años en desaparecer. Estas pequeñas partículas de plástico son tragadas por peces, aves y otros animales marinos, causando graves problemas de salud e incluso la muerte. Los científicos han encontrado microplásticos en las partes más profundas del océano y en las áreas más remotas del Ártico. Aún más alarmante, se han detectado microplásticos en los alimentos que comemos y el agua que bebemos. El problema del plástico afecta directamente a los humanos. Muchos países están tomando medidas para reducir los residuos plásticos. Algunos han prohibido las bolsas y pajitas de plástico de un solo uso. Otros han implementado sistemas de devolución de depósitos para botellas de plástico, incentivando a las personas a reciclar. Empresas innovadoras están desarrollando alternativas biodegradables hechas de almidón de maíz, algas y otros materiales naturales. Las acciones individuales también importan. Usar bolsas, botellas y contenedores reutilizables puede reducir significativamente la cantidad de residuos plásticos que cada persona genera. Rechazar los cubiertos de plástico, traer tu propia taza de café y elegir productos con envase mínimo son pequeños pasos que suman una gran diferencia. El océano pertenece a todos, y protegerlo es una responsabilidad compartida.',
    level: 'intermediate',
    difficulty: 4,
    xpReward: 70,
    questions: [
      { id: 'sr17q1', question: 'How much plastic waste enters the ocean each year?', questionEs: '¿Cuántos residuos plásticos entran en el océano cada año?', options: ['About one million tons', 'Approximately eight million tons', 'About five million tons', 'About ten million tons'], correctAnswer: 1, explanation: 'Approximately eight million tons of plastic waste enters the world\'s oceans each year.', explanationEs: 'Aproximadamente ocho millones de toneladas de residuos plásticos entran en los océanos cada año.' },
      { id: 'sr17q2', question: 'What are microplastics?', questionEs: '¿Qué son los microplásticos?', options: ['Small pieces of broken-down plastic', 'Tiny fish in the ocean', 'A type of biodegradable plastic', 'Plastic recycling machines'], correctAnswer: 0, explanation: 'Microplastics are smaller pieces that plastic breaks down into, which can take hundreds of years to disappear.', explanationEs: 'Los microplásticos son piezas más pequeñas en las que se descompone el plástico, que pueden tardar cientos de años en desaparecer.' },
      { id: 'sr17q3', question: 'What have some countries done to reduce plastic waste?', questionEs: '¿Qué han hecho algunos países para reducir los residuos plásticos?', options: ['Increased plastic production', 'Banned single-use plastic bags and straws', 'Stopped using plastic entirely', 'Built more recycling plants'], correctAnswer: 1, explanation: 'Some countries have banned single-use plastic bags and straws.', explanationEs: 'Algunos países han prohibido las bolsas y pajitas de plástico de un solo uso.' },
      { id: 'sr17q4', question: 'What is one individual action to reduce plastic waste?', questionEs: '¿Cuál es una acción individual para reducir los residuos plásticos?', options: ['Buying more plastic products', 'Using reusable bags and containers', 'Throwing plastic in the ocean', 'Ignoring the problem'], correctAnswer: 1, explanation: 'Using reusable bags, bottles, and containers can significantly reduce the amount of plastic waste each person generates.', explanationEs: 'Usar bolsas, botellas y contenedores reutilizables puede reducir significativamente los residuos plásticos que cada persona genera.' },
    ]
  },
  {
    id: 'shop-reading-18',
    title: 'The Benefits of Meditation',
    titleEs: 'Los Beneficios de la Meditación',
    passage: 'Meditation has been practiced for thousands of years, originally as part of religious and spiritual traditions. Today, it has become a popular way to manage stress and improve mental health without any religious connection. Scientific research has shown that regular meditation can reduce anxiety, lower blood pressure, and improve sleep quality. There are many types of meditation, but most share the same basic principle: focusing your attention and eliminating the stream of jumbled thoughts that may be crowding your mind. Mindfulness meditation, one of the most popular forms, involves paying attention to the present moment without judgment. You simply observe your thoughts, feelings, and sensations as they come and go. Another common type is guided meditation, where a teacher or recording leads you through a series of relaxing images or thoughts. Starting a meditation practice is simple. Find a quiet place, sit comfortably, and focus on your breathing. When your mind wanders — and it will — gently bring your attention back to your breath. Even five minutes a day can make a noticeable difference. Many people who meditate regularly report feeling calmer, more focused, and better equipped to handle life\'s challenges. Some companies now offer meditation rooms and break-time sessions for their employees, recognizing that a healthy mind leads to better productivity. Meditation is not about emptying your mind completely — it is about training your attention and developing a healthier relationship with your thoughts.',
    passageEs: 'La meditación se ha practicado durante miles de años, originalmente como parte de tradiciones religiosas y espirituales. Hoy en día, se ha convertido en una forma popular de manejar el estrés y mejorar la salud mental sin ninguna conexión religiosa. La investigación científica ha demostrado que la meditación regular puede reducir la ansiedad, bajar la presión arterial y mejorar la calidad del sueño. Hay muchos tipos de meditación, pero la mayoría comparten el mismo principio básico: enfocar tu atención y eliminar el flujo de pensamientos confusos que pueden estar abarrotando tu mente. La meditación de atención plena, una de las formas más populares, implica prestar atención al momento presente sin juzgar. Simplemente observas tus pensamientos, sentimientos y sensaciones mientras van y vienen. Otro tipo común es la meditación guiada, donde un maestro o una grabación te guía a través de una serie de imágenes o pensamientos relajantes. Comenzar una práctica de meditación es sencillo. Encuentra un lugar tranquilo, siéntate cómodamente y concéntrate en tu respiración. Cuando tu mente divague — y lo hará — lleva suavemente tu atención de vuelta a tu respiración. Incluso cinco minutos al día pueden hacer una diferencia notable. Muchas personas que meditan regularmente reportan sentirse más tranquilas, más enfocadas y mejor equipadas para manejar los desafíos de la vida. Algunas empresas ahora ofrecen salas de meditación y sesiones durante los descansos para sus empleados, reconociendo que una mente sana conduce a una mejor productividad. La meditación no se trata de vaciar tu mente completamente — se trata de entrenar tu atención y desarrollar una relación más saludable con tus pensamientos.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'sr18q1', question: 'What has scientific research shown about meditation?', questionEs: '¿Qué ha demostrado la investigación científica sobre la meditación?', options: ['It can cure all diseases', 'It only works for religious people', 'It can reduce anxiety, lower blood pressure, and improve sleep', 'It has no proven benefits'], correctAnswer: 2, explanation: 'Scientific research has shown that regular meditation can reduce anxiety, lower blood pressure, and improve sleep quality.', explanationEs: 'La investigación científica ha demostrado que la meditación regular puede reducir la ansiedad, bajar la presión arterial y mejorar la calidad del sueño.' },
      { id: 'sr18q2', question: 'What is the basic principle of most meditation?', questionEs: '¿Cuál es el principio básico de la mayoría de las meditaciones?', options: ['Focusing attention and eliminating jumbled thoughts', 'Emptying the mind completely', 'Thinking about happy memories', 'Chanting words repeatedly'], correctAnswer: 0, explanation: 'Most meditation shares the basic principle of focusing your attention and eliminating the stream of jumbled thoughts.', explanationEs: 'La mayoría de las meditaciones comparten el principio básico de enfocar tu atención y eliminar el flujo de pensamientos confusos.' },
      { id: 'sr18q3', question: 'How many minutes of meditation per day can make a difference?', questionEs: '¿Cuántos minutos de meditación al día pueden marcar la diferencia?', options: ['Thirty minutes', 'Five minutes', 'One hour', 'Twenty minutes'], correctAnswer: 1, explanation: 'Even five minutes a day can make a noticeable difference.', explanationEs: 'Incluso cinco minutos al día pueden hacer una diferencia notable.' },
      { id: 'sr18q4', question: 'What is meditation really about?', questionEs: '¿De qué trata realmente la meditación?', options: ['Becoming religious', 'Training your attention and developing a healthier relationship with thoughts', 'Sleeping better', 'Being alone'], correctAnswer: 1, explanation: 'Meditation is about training your attention and developing a healthier relationship with your thoughts.', explanationEs: 'La meditación se trata de entrenar tu atención y desarrollar una relación más saludable con tus pensamientos.' },
    ]
  },
  {
    id: 'shop-reading-19',
    title: 'Day of the Dead',
    titleEs: 'Día de los Muertos',
    passage: 'The Day of the Dead, or Día de los Muertos, is a Mexican holiday celebrated on November first and second. Despite its name, it is not a sad or scary occasion. Instead, it is a joyful celebration of life and a time to remember and honor loved ones who have passed away. The holiday combines indigenous Aztec traditions with Catholic beliefs that were brought by Spanish colonizers. Families build elaborate altars called ofrendas in their homes. These altars are decorated with bright orange marigold flowers, candles, photographs of the deceased, and their favorite foods and drinks. It is believed that the spirits of the departed return to visit their families during this time, and the ofrendas help guide them home. One of the most iconic symbols of the holiday is the sugar skull. These colorful skulls are made from sugar and decorated with bright icing and sequins. They are not meant to be frightening — they represent the sweetness of life and the acceptance of death as a natural part of the human experience. People also write calaveras literarias, which are funny poems that playfully mock the living. Parades, music, and dancing fill the streets. In some regions, families spend the night at the cemetery, keeping company with their departed loved ones among candlelight and flowers. Day of the Dead reminds us that those we love never truly leave us as long as we remember them.',
    passageEs: 'El Día de los Muertos es una festividad mexicana que se celebra el primero y el dos de noviembre. A pesar de su nombre, no es una ocasión triste o aterradora. En cambio, es una celebración alegre de la vida y un momento para recordar y honrar a los seres queridos que han fallecido. La festividad combina tradiciones indígenas aztecas con creencias católicas que trajeron los colonizadores españoles. Las familias construyen elaborados altares llamados ofrendas en sus hogares. Estos altares se decoran con flores de cempasúchil de color naranja brillante, velas, fotografías de los difuntos y sus comidas y bebidas favoritas. Se cree que los espíritus de los fallecidos regresan para visitar a sus familias durante este tiempo, y las ofrendas ayudan a guiarlos a casa. Uno de los símbolos más icónicos de la festividad es la calavera de azúcar. Estas coloridas calaveras están hechas de azúcar y decoradas con glaseado brillante y lentejuelas. No están destinadas a ser aterradoras — representan la dulzura de la vida y la aceptación de la muerte como parte natural de la experiencia humana. Las personas también escriben calaveras literarias, que son poemas divertidos que burlan juguetonamente a los vivos. Desfiles, música y bailes llenan las calles. En algunas regiones, las familias pasan la noche en el cementerio, haciendo compañía a sus seres queridos difuntos entre la luz de las velas y las flores. El Día de los Muertos nos recuerda que aquellos que amamos nunca nos dejan verdaderamente mientras los recordemos.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 65,
    questions: [
      { id: 'sr19q1', question: 'When is the Day of the Dead celebrated?', questionEs: '¿Cuándo se celebra el Día de los Muertos?', options: ['November first and second', 'October thirty-first', 'December twelfth', 'January first'], correctAnswer: 0, explanation: 'The Day of the Dead is celebrated on November first and second.', explanationEs: 'El Día de los Muertos se celebra el primero y el dos de noviembre.' },
      { id: 'sr19q2', question: 'What are ofrendas?', questionEs: '¿Qué son las ofrendas?', options: ['Special prayers', 'Elaborate altars decorated for the deceased', 'Traditional dances', 'Types of food'], correctAnswer: 1, explanation: 'Families build elaborate altars called ofrendas in their homes.', explanationEs: 'Las familias construyen elaborados altares llamados ofrendas en sus hogares.' },
      { id: 'sr19q3', question: 'What do sugar skulls represent?', questionEs: '¿Qué representan las calaveras de azúcar?', options: ['Fear and horror', 'The sweetness of life and acceptance of death', 'Wealth and prosperity', 'Evil spirits'], correctAnswer: 1, explanation: 'Sugar skulls represent the sweetness of life and the acceptance of death as a natural part of the human experience.', explanationEs: 'Las calaveras de azúcar representan la dulzura de la vida y la aceptación de la muerte como parte natural de la experiencia humana.' },
      { id: 'sr19q4', question: 'What is the main message of Day of the Dead?', questionEs: '¿Cuál es el mensaje principal del Día de los Muertos?', options: ['Death should be feared', 'Life is short', 'Those we love never truly leave us if we remember them', 'Parties are important'], correctAnswer: 2, explanation: 'Day of the Dead reminds us that those we love never truly leave us as long as we remember them.', explanationEs: 'El Día de los Muertos nos recuerda que aquellos que amamos nunca nos dejan verdaderamente mientras los recordemos.' },
    ]
  },
  {
    id: 'shop-reading-20',
    title: 'The Marathon Runner',
    titleEs: 'La Corredora de Maratón',
    passage: 'Elena had never been athletic as a child. She preferred reading books to playing sports, and the idea of running seemed boring and painful. But everything changed when she turned thirty. A routine check-up revealed that her cholesterol was high and her doctor warned her that she needed to exercise regularly. Elena decided to start with something simple: walking. Every evening after work, she walked around her neighborhood for thirty minutes. After a month, walking felt easy, so she started jogging for short intervals. A minute of jogging followed by two minutes of walking, then repeat. Slowly, she increased the jogging time and decreased the walking time. After six months, Elena could run continuously for thirty minutes. She signed up for her first five-kilometer race and finished in thirty-two minutes. The feeling of crossing the finish line was incredible. She was hooked. Over the next two years, Elena gradually increased her distance. She ran a ten-kilometer race, then a half marathon. Each time, she set a new personal record. The ultimate challenge came when she decided to run a full marathon — forty-two point two kilometers. Training for a marathon required commitment. She ran five days a week, with a long run on weekends that eventually reached thirty-two kilometers. On race day, Elena felt a mixture of excitement and fear. The last ten kilometers were the hardest, but she pushed through the pain. When she crossed the finish line in four hours and fifteen minutes, she cried tears of joy. Elena proved that it is never too late to change your life.',
    passageEs: 'Elena nunca había sido atlética cuando era niña. Prefería leer libros a practicar deportes, y la idea de correr le parecía aburrida y dolorosa. Pero todo cambió cuando cumplió treinta años. Un chequeo de rutina reveló que su colesterol estaba alto y su médico le advirtió que necesitaba hacer ejercicio regularmente. Elena decidió empezar con algo simple: caminar. Cada tarde después del trabajo, caminaba por su vecindario durante treinta minutos. Después de un mes, caminar se sintió fácil, así que empezó a trotar en intervalos cortos. Un minuto de trote seguido de dos minutos de caminata, luego repetir. Lentamente, aumentó el tiempo de trote y disminuyó el tiempo de caminata. Después de seis meses, Elena podía correr continuamente durante treinta minutos. Se inscribió en su primera carrera de cinco kilómetros y terminó en treinta y dos minutos. La sensación de cruzar la meta fue increíble. Quedó enganchada. Durante los dos años siguientes, Elena aumentó gradualmente su distancia. Corrió una carrera de diez kilómetros, luego una media maratón. Cada vez, estableció un nuevo récord personal. El desafío definitivo llegó cuando decidió correr una maratón completa — cuarenta y dos punto dos kilómetros. Entrenar para una maratón requería compromiso. Corría cinco días a la semana, con una carrera larga los fines de semana que eventualmente alcanzó los treinta y dos kilómetros. El día de la carrera, Elena sintió una mezcla de emoción y miedo. Los últimos diez kilómetros fueron los más difíciles, pero superó el dolor. Cuando cruzó la meta en cuatro horas y quince minutos, lloró de alegría. Elena demostró que nunca es demasiado tarde para cambiar tu vida.',
    level: 'intermediate',
    difficulty: 4,
    xpReward: 70,
    questions: [
      { id: 'sr20q1', question: 'Why did Elena start exercising?', questionEs: '¿Por qué Elena empezó a hacer ejercicio?', options: ['She wanted to win a race', 'Her friends convinced her', 'Her doctor warned her about high cholesterol', 'She wanted to lose weight'], correctAnswer: 2, explanation: 'A routine check-up revealed that her cholesterol was high and her doctor warned her she needed to exercise.', explanationEs: 'Un chequeo de rutina reveló que su colesterol estaba alto y su médico le advirtió que necesitaba hacer ejercicio.' },
      { id: 'sr20q2', question: 'How did Elena begin her fitness journey?', questionEs: '¿Cómo comenzó Elena su camino hacia la aptitud física?', options: ['Walking around her neighborhood', 'Running five kilometers', 'Joining a gym', 'Swimming at a pool'], correctAnswer: 0, explanation: 'Elena decided to start with something simple: walking around her neighborhood for thirty minutes.', explanationEs: 'Elena decidió empezar con algo simple: caminar por su vecindario durante treinta minutos.' },
      { id: 'sr20q3', question: 'How long is a full marathon?', questionEs: '¿Cuánto tiempo dura una maratón completa?', options: ['Twenty-one kilometers', 'Forty-two point two kilometers', 'Ten kilometers', 'Fifty kilometers'], correctAnswer: 1, explanation: 'A full marathon is forty-two point two kilometers.', explanationEs: 'Una maratón completa es de cuarenta y dos punto dos kilómetros.' },
      { id: 'sr20q4', question: 'What did Elena prove?', questionEs: '¿Qué demostró Elena?', options: ['Running is easy', 'Everyone should run marathons', 'Doctors are always right', 'It is never too late to change your life'], correctAnswer: 3, explanation: 'Elena proved that it is never too late to change your life.', explanationEs: 'Elena demostró que nunca es demasiado tarde para cambiar tu vida.' },
    ]
  },
  {
    id: 'shop-reading-21',
    title: 'The Street Musician',
    titleEs: 'El Músico Callejero',
    passage: 'Every afternoon, a young man named Carlos sets up his guitar case on the corner of Fifth Avenue and Main Street. He opens the case, drops in a few coins to encourage others, and begins to play. Carlos is a street musician, also known as a busker. He plays a mix of Latin American songs, jazz standards, and his own original compositions. The music floats through the busy street, and people walking by often slow down to listen. Some drop a dollar or two into his open case. Others simply smile and keep walking. Carlos did not always play on the street. He studied music at a university and dreamed of becoming a concert guitarist. But after graduation, he found that the music industry was extremely competitive. Record labels rejected his demos, and concert venues wanted artists who were already famous. Rather than give up, Carlos took his music to the streets. He discovered that playing for everyday people was actually more rewarding than performing in concert halls. His audience was real and honest — if they liked a song, they stopped and listened. If they did not, they kept walking. One day, a woman filmed him playing and posted the video online. It went viral, receiving over two million views. Suddenly, Carlos had the attention he had been seeking. He was offered a recording contract, but he still plays on the street every afternoon. He says the street keeps him humble and reminds him why he started making music in the first place — to connect with people through sound.',
    passageEs: 'Cada tarde, un joven llamado Carlos instala su estuche de guitarra en la esquina de la Quinta Avenida y la Calle Principal. Abre el estuche, deja caer algunas monedas para animar a otros y comienza a tocar. Carlos es un músico callejero, también conocido como busker. Toca una mezcla de canciones latinoamericanas, estándares de jazz y sus propias composiciones originales. La música flota por la calle bulliciosa, y la gente que pasa a menudo se detiene para escuchar. Algunos dejan un dólar o dos en su estuche abierto. Otros simplemente sonríen y siguen caminando. Carlos no siempre tocó en la calle. Estudió música en una universidad y soñaba con convertirse en guitarrista de concierto. Pero después de graduarse, descubrió que la industria musical era extremadamente competitiva. Las discográficas rechazaron sus demos y los lugares de conciertos querían artistas que ya fueran famosos. En lugar de rendirse, Carlos llevó su música a las calles. Descubrió que tocar para la gente común era en realidad más gratificante que actuar en salas de concierto. Su audiencia era real y honesta — si les gustaba una canción, se detenían y escuchaban. Si no, seguían caminando. Un día, una mujer lo filmó tocando y publicó el video en internet. Se hizo viral, recibiendo más de dos millones de visitas. De repente, Carlos tenía la atención que había estado buscando. Le ofrecieron un contrato de grabación, pero todavía toca en la calle cada tarde. Dice que la calle lo mantiene humilde y le recuerda por qué empezó a hacer música en primer lugar — para conectar con las personas a través del sonido.',
    level: 'intermediate',
    difficulty: 3,
    xpReward: 60,
    questions: [
      { id: 'sr21q1', question: 'What kind of music does Carlos play?', questionEs: '¿Qué tipo de música toca Carlos?', options: ['Only classical music', 'A mix of Latin American songs, jazz, and originals', 'Only rock and roll', 'Only his own songs'], correctAnswer: 1, explanation: 'Carlos plays a mix of Latin American songs, jazz standards, and his own original compositions.', explanationEs: 'Carlos toca una mezcla de canciones latinoamericanas, estándares de jazz y sus propias composiciones originales.' },
      { id: 'sr21q2', question: 'Why did Carlos start playing on the street?', questionEs: '¿Por qué Carlos empezó a tocar en la calle?', options: ['He enjoyed being outdoors', 'He was rejected by record labels and concert venues', 'He lost his guitar', 'His professor told him to'], correctAnswer: 1, explanation: 'Record labels rejected his demos, and concert venues wanted artists who were already famous, so he took his music to the streets.', explanationEs: 'Las discográficas rechazaron sus demos y los lugares de conciertos querían artistas famosos, así que llevó su música a las calles.' },
      { id: 'sr21q3', question: 'What happened when a video of Carlos went viral?', questionEs: '¿Qué pasó cuando un video de Carlos se hizo viral?', options: ['He was offered a recording contract', 'He stopped playing music', 'He moved to another city', 'He became a teacher'], correctAnswer: 0, explanation: 'He was offered a recording contract after the video went viral.', explanationEs: 'Le ofrecieron un contrato de grabación después de que el video se hiciera viral.' },
      { id: 'sr21q4', question: 'Why does Carlos continue playing on the street?', questionEs: '¿Por qué Carlos sigue tocando en la calle?', options: ['He cannot afford a concert hall', 'It keeps him humble and connects him to people', 'He does not like recording studios', 'His fans prefer it'], correctAnswer: 1, explanation: 'He says the street keeps him humble and reminds him why he started making music — to connect with people through sound.', explanationEs: 'Dice que la calle lo mantiene humilde y le recuerda por qué empezó a hacer música — para conectar con las personas a través del sonido.' },
    ]
  },
  {
    id: 'shop-reading-22',
    title: 'Living in New York',
    titleEs: 'Viviendo en Nueva York',
    passage: 'New York City is one of the most diverse and exciting places in the world. With over eight million residents, it is the largest city in the United States. People from every corner of the globe have made it their home, creating a rich cultural mosaic that can be seen in the food, art, music, and languages found throughout the five boroughs: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Living in New York has many advantages. The city offers world-class museums, Broadway shows, professional sports, and restaurants serving cuisine from virtually every country. The public transportation system, although sometimes frustrating, runs twenty-four hours a day and can take you anywhere in the city for a few dollars. Central Park provides a green escape from the concrete and glass of the urban landscape. However, living in New York also has significant challenges. The cost of living is among the highest in the world. Rent for a small apartment can be several thousand dollars per month. The city is loud, crowded, and fast-paced, which can be overwhelming for newcomers. Winters are cold and summers are hot and humid. Despite these difficulties, New Yorkers are known for their resilience and energy. They adapt to the rhythm of the city and take pride in their ability to thrive in one of the most demanding urban environments on Earth. As the famous saying goes, "If you can make it here, you can make it anywhere."',
    passageEs: 'La ciudad de Nueva York es uno de los lugares más diversos y emocionantes del mundo. Con más de ocho millones de habitantes, es la ciudad más grande de los Estados Unidos. Personas de todos los rincones del planeta la han hecho su hogar, creando un rico mosaico cultural que se puede ver en la comida, el arte, la música y los idiomas que se encuentran en los cinco distritos: Manhattan, Brooklyn, Queens, el Bronx y Staten Island. Vivir en Nueva York tiene muchas ventajas. La ciudad ofrece museos de clase mundial, espectáculos de Broadway, deportes profesionales y restaurantes que sirven cocina de prácticamente todos los países. El sistema de transporte público, aunque a veces frustrante, funciona las veinticuatro horas del día y puede llevarte a cualquier parte de la ciudad por unos pocos dólares. Central Park proporciona un escape verde del concreto y el vidrio del paisaje urbano. Sin embargo, vivir en Nueva York también tiene desafíos significativos. El costo de vida está entre los más altos del mundo. El alquiler de un apartamento pequeño puede ser de varios miles de dólares por mes. La ciudad es ruidosa, concurrida y de ritmo acelerado, lo que puede ser abrumador para los recién llegados. Los inviernos son fríos y los veranos son calurosos y húmedos. A pesar de estas dificultades, los neoyorquinos son conocidos por su resiliencia y energía. Se adaptan al ritmo de la ciudad y se enorgullecen de su capacidad para prosperar en uno de los entornos urbanos más exigentes de la Tierra. Como dice el famoso dicho: "Si puedes triunfar aquí, puedes triunfar en cualquier lugar."',
    level: 'intermediate',
    difficulty: 4,
    xpReward: 65,
    questions: [
      { id: 'sr22q1', question: 'How many residents does New York City have?', questionEs: '¿Cuántos habitantes tiene la ciudad de Nueva York?', options: ['Over eight million', 'About five million', 'About ten million', 'About three million'], correctAnswer: 0, explanation: 'New York City has over eight million residents.', explanationEs: 'Nueva York tiene más de ocho millones de habitantes.' },
      { id: 'sr22q2', question: 'How many boroughs does New York City have?', questionEs: '¿Cuántos distritos tiene la ciudad de Nueva York?', options: ['Three', 'Five', 'Seven', 'Four'], correctAnswer: 1, explanation: 'New York City has five boroughs: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.', explanationEs: 'Nueva York tiene cinco distritos: Manhattan, Brooklyn, Queens, el Bronx y Staten Island.' },
      { id: 'sr22q3', question: 'What is one advantage of living in New York?', questionEs: '¿Cuál es una ventaja de vivir en Nueva York?', options: ['Low cost of living', 'Quiet neighborhoods', 'World-class museums, Broadway shows, and diverse restaurants', 'Warm weather year-round'], correctAnswer: 2, explanation: 'The city offers world-class museums, Broadway shows, professional sports, and restaurants serving cuisine from virtually every country.', explanationEs: 'La ciudad ofrece museos de clase mundial, espectáculos de Broadway, deportes profesionales y restaurantes de cocina de prácticamente todos los países.' },
      { id: 'sr22q4', question: 'What is the famous saying about New York?', questionEs: '¿Cuál es el dicho famoso sobre Nueva York?', options: ['"The city that never learns."', '"The big apple."', '"If you can make it here, you can make it anywhere."', '"New York is the center of the world."'], correctAnswer: 2, explanation: 'As the famous saying goes, "If you can make it here, you can make it anywhere."', explanationEs: 'Como dice el famoso dicho: "Si puedes triunfar aquí, puedes triunfar en cualquier lugar."' },
    ]
  },
  {
    id: 'shop-reading-23',
    title: 'The CRISPR Revolution',
    titleEs: 'La Revolución CRISPR',
    passage: 'CRISPR-Cas9 is one of the most groundbreaking scientific discoveries of the twenty-first century. This gene-editing technology allows scientists to modify DNA with unprecedented precision, potentially curing genetic diseases that have plagued humanity for generations. The technology was adapted from a natural defense mechanism found in bacteria, which use CRISPR sequences to recognize and cut the DNA of invading viruses. In 2012, researchers Jennifer Doudna and Emmanuelle Charpentier published a paper demonstrating that this system could be programmed to edit any DNA sequence. Their work earned them the Nobel Prize in Chemistry in 2020. The potential applications of CRISPR are staggering. Scientists have already used it to modify crops to resist drought and disease, create malaria-resistant mosquitoes, and treat genetic disorders like sickle cell anemia in clinical trials. However, CRISPR also raises profound ethical questions. In 2018, a Chinese scientist caused international outrage by using CRISPR to edit the genes of human embryos, resulting in the birth of the first gene-edited babies. The scientific community widely condemned this experiment as premature and irresponsible. Concerns include off-target effects, where unintended parts of the genome are modified, and the possibility of creating permanent changes to the human gene pool that could have unforeseen consequences. The line between curing disease and enhancing human capabilities is dangerously thin. Regulation and international cooperation will be essential to ensure that CRISPR is used responsibly and equitably, for the benefit of all humanity rather than just a privileged few.',
    passageEs: 'CRISPR-Cas9 es uno de los descubrimientos científicos más revolucionarios del siglo veintiuno. Esta tecnología de edición genética permite a los científicos modificar el ADN con una precisión sin precedentes, curando potencialmente enfermedades genéticas que han afectado a la humanidad durante generaciones. La tecnología fue adaptada de un mecanismo de defensa natural que se encuentra en las bacterias, que usan secuencias CRISPR para reconocer y cortar el ADN de los virus invasores. En 2012, las investigadoras Jennifer Doudna y Emmanuelle Charpentier publicaron un artículo demostrando que este sistema podía programarse para editar cualquier secuencia de ADN. Su trabajo les valió el Premio Nobel de Química en 2020. Las aplicaciones potenciales de CRISPR son asombrosas. Los científicos ya la han usado para modificar cultivos para resistir la sequía y las enfermedades, crear mosquitos resistentes a la malaria y tratar trastornos genéticos como la anemia de células falciformes en ensayos clínicos. Sin embargo, CRISPR también plantea profundas cuestiones éticas. En 2018, un científico chino causó indignación internacional al usar CRISPR para editar los genes de embriones humanos, resultando en el nacimiento de los primeros bebés editados genéticamente. La comunidad científica condenó ampliamente este experimento como prematuro e irresponsable. Las preocupaciones incluyen efectos fuera del objetivo, donde partes no deseadas del genoma son modificadas, y la posibilidad de crear cambios permanentes en el acervo génico humano que podrían tener consecuencias imprevistas. La línea entre curar enfermedades y mejorar las capacidades humanas es peligrosamente delgada. La regulación y la cooperación internacional serán esenciales para garantizar que CRISPR se use de manera responsable y equitativa, en beneficio de toda la humanidad y no solo de unos pocos privilegiados.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 90,
    questions: [
      { id: 'sr23q1', question: 'Where was the CRISPR system originally found?', questionEs: '¿Dónde se encontró originalmente el sistema CRISPR?', options: ['In bacteria as a defense mechanism', 'In human cells', 'In plants', 'In laboratory experiments'], correctAnswer: 0, explanation: 'The technology was adapted from a natural defense mechanism found in bacteria.', explanationEs: 'La tecnología fue adaptada de un mecanismo de defensa natural que se encuentra en las bacterias.' },
      { id: 'sr23q2', question: 'When did Doudna and Charpentier win the Nobel Prize?', questionEs: '¿Cuándo ganaron Doudna y Charpentier el Premio Nobel?', options: ['In 2012', 'In 2018', 'In 2020', 'In 2015'], correctAnswer: 2, explanation: 'Their work earned them the Nobel Prize in Chemistry in 2020.', explanationEs: 'Su trabajo les valió el Premio Nobel de Química en 2020.' },
      { id: 'sr23q3', question: 'What caused international outrage in 2018?', questionEs: '¿Qué causó indignación internacional en 2018?', options: ['A failed clinical trial', 'A Chinese scientist edited the genes of human embryos', 'CRISPR was banned worldwide', 'A disease was accidentally created'], correctAnswer: 1, explanation: 'A Chinese scientist caused international outrage by using CRISPR to edit the genes of human embryos.', explanationEs: 'Un científico chino causó indignación internacional al usar CRISPR para editar los genes de embriones humanos.' },
      { id: 'sr23q4', question: 'What does the passage suggest is essential for responsible CRISPR use?', questionEs: '¿Qué sugiere el pasaje que es esencial para el uso responsable de CRISPR?', options: ['More funding', 'Faster experiments', 'Private sector control', 'Regulation and international cooperation'], correctAnswer: 3, explanation: 'Regulation and international cooperation will be essential to ensure CRISPR is used responsibly and equitably.', explanationEs: 'La regulación y la cooperación internacional serán esenciales para garantizar que CRISPR se use de manera responsable y equitativa.' },
    ]
  },
  {
    id: 'shop-reading-24',
    title: 'From Garage to Global',
    titleEs: 'Del Garaje al Mundo',
    passage: 'Some of the world\'s most successful companies started in garages. Amazon, Apple, Google, and Disney all began with a bold idea and very limited resources. What these companies share is not just humble beginnings but a relentless focus on solving problems that matter to people. Entrepreneurship is about identifying a need and creating a solution, often with little money and no guarantee of success. Sara Blakely, the founder of Spanx, started her company with five thousand dollars in savings and no experience in the fashion industry. She cut the feet off her pantyhose to create a smoother silhouette under white pants, and realized other women might want the same thing. She faced hundreds of rejections from manufacturers before finding one willing to produce her product. Today, Spanx is a billion-dollar brand. Similarly, Brian Chesky and Joe Gebbia could not pay their rent in San Francisco, so they put air mattresses on their living room floor and offered them as accommodation to conference attendees. That idea became Airbnb, now valued at over one hundred billion dollars. The path from garage to global is never smooth. Most startups fail within the first five years. Successful entrepreneurs share certain qualities: resilience in the face of rejection, the ability to pivot when things do not go as planned, and a willingness to learn from mistakes rather than be defeated by them. Perhaps most importantly, they understand that failure is not the opposite of success — it is a stepping stone toward it.',
    passageEs: 'Algunas de las empresas más exitosas del mundo comenzaron en garajes. Amazon, Apple, Google y Disney todas empezaron con una idea audaz y recursos muy limitados. Lo que estas empresas comparten no es solo orígenes humildes sino un enfoque implacable en resolver problemas que importan a las personas. El emprendimiento se trata de identificar una necesidad y crear una solución, a menudo con poco dinero y sin garantía de éxito. Sara Blakely, la fundadora de Spanx, comenzó su empresa con cinco mil dólares de ahorros y sin experiencia en la industria de la moda. Cortó los pies de sus pantimedias para crear una silueta más suave bajo pantalones blancos, y se dio cuenta de que otras mujeres podrían querer lo mismo. Enfrentó cientos de rechazos de fabricantes antes de encontrar uno dispuesto a producir su producto. Hoy, Spanx es una marca de mil millones de dólares. De manera similar, Brian Chesky y Joe Gebbia no podían pagar su alquiler en San Francisco, así que pusieron colchones inflables en el suelo de su sala y los ofrecieron como alojamiento a los asistentes a una conferencia. Esa idea se convirtió en Airbnb, ahora valorada en más de cien mil millones de dólares. El camino del garaje al mundo nunca es fácil. La mayoría de las startups fracasan en los primeros cinco años. Los emprendedores exitosos comparten ciertas cualidades: resiliencia frente al rechazo, la capacidad de cambiar de dirección cuando las cosas no salen como se planeó y la disposición de aprender de los errores en lugar de ser derrotados por ellos. Quizás lo más importante, entienden que el fracaso no es lo opuesto al éxito — es un peldaño hacia él.',
    level: 'advanced',
    difficulty: 4,
    xpReward: 80,
    questions: [
      { id: 'sr24q1', question: 'What do Amazon, Apple, Google, and Disney have in common?', questionEs: '¿Qué tienen en común Amazon, Apple, Google y Disney?', options: ['They were all founded by women', 'They all started in garages', 'They all sell technology', 'They all began as online stores'], correctAnswer: 1, explanation: 'Some of the world\'s most successful companies started in garages, including Amazon, Apple, Google, and Disney.', explanationEs: 'Algunas de las empresas más exitosas del mundo comenzaron en garajes, incluyendo Amazon, Apple, Google y Disney.' },
      { id: 'sr24q2', question: 'How much money did Sara Blakely start Spanx with?', questionEs: '¿Con cuánto dinero empezó Sara Blakely Spanx?', options: ['Five thousand dollars', 'One hundred thousand dollars', 'Five hundred dollars', 'One million dollars'], correctAnswer: 0, explanation: 'Sara Blakely started her company with five thousand dollars in savings.', explanationEs: 'Sara Blakely comenzó su empresa con cinco mil dólares de ahorros.' },
      { id: 'sr24q3', question: 'How did Airbnb begin?', questionEs: '¿Cómo comenzó Airbnb?', options: ['As a hotel booking website', 'The founders rented air mattresses to conference attendees', 'As a travel agency', 'As a real estate company'], correctAnswer: 1, explanation: 'Brian Chesky and Joe Gebbia put air mattresses on their living room floor and offered them as accommodation to conference attendees.', explanationEs: 'Brian Chesky y Joe Gebbia pusieron colchones inflables en su sala y los ofrecieron como alojamiento a asistentes a una conferencia.' },
      { id: 'sr24q4', question: 'What do successful entrepreneurs understand about failure?', questionEs: '¿Qué entienden los emprendedores exitosos sobre el fracaso?', options: ['Failure should be avoided at all costs', 'Failure means you should quit', 'It is a stepping stone toward success', 'Failure is only for beginners'], correctAnswer: 2, explanation: 'They understand that failure is not the opposite of success — it is a stepping stone toward it.', explanationEs: 'Entienden que el fracaso no es lo opuesto al éxito — es un peldaño hacia él.' },
    ]
  },
  {
    id: 'shop-reading-25',
    title: 'The Ripple Effect of Trade Wars',
    titleEs: 'El Efecto Dominó de las Guerras Comerciales',
    passage: 'Trade wars occur when countries impose tariffs or other trade barriers against each other in retaliation for what they perceive as unfair trade practices. While these measures are often intended to protect domestic industries, their effects ripple throughout the global economy in ways that are difficult to predict and nearly impossible to contain. When Country A imposes a tariff on steel from Country B, the immediate effect is that steel becomes more expensive in Country A. This raises costs for construction companies, automobile manufacturers, and any industry that relies on steel. Consumers end up paying higher prices for cars, appliances, and housing. Country B, in response, may impose its own tariffs on agricultural products from Country A, hurting farmers who lose access to a major market. The historical record is instructive. The Smoot-Hawley Tariff Act of 1930, signed by President Herbert Hoover, raised tariffs on over twenty thousand imported goods. Rather than protecting American jobs, it triggered retaliatory tariffs from trading partners, which intensified the Great Depression. Global trade shrank by approximately sixty-six percent between 1929 and 1934. Modern economies are even more interconnected through global supply chains. A single smartphone contains components manufactured in dozens of countries. When trade barriers rise, these supply chains are disrupted, increasing costs and creating uncertainty that discourages investment. Economists broadly agree that free trade, while not without losers, creates more overall prosperity than protectionism. The challenge lies in managing the transition for workers and industries displaced by globalization, rather than erecting walls that ultimately harm everyone.',
    passageEs: 'Las guerras comerciales ocurren cuando los países imponen aranceles u otras barreras comerciales entre sí en represalia por lo que perciben como prácticas comerciales injustas. Si bien estas medidas a menudo pretenden proteger a las industrias nacionales, sus efectos se propagan por toda la economía global de maneras que son difíciles de predecir y casi imposibles de contener. Cuando el País A impone un arancel al acero del País B, el efecto inmediato es que el acero se vuelve más caro en el País A. Esto aumenta los costos para las empresas de construcción, los fabricantes de automóviles y cualquier industria que dependa del acero. Los consumidores terminan pagando precios más altos por autos, electrodomésticos y viviendas. El País B, en respuesta, puede imponer sus propios aranceles a los productos agrícolas del País A, perjudicando a los agricultores que pierden acceso a un mercado importante. El registro histórico es instructivo. La Ley de Aranceles Smoot-Hawley de 1930, firmada por el presidente Herbert Hoover, elevó los aranceles a más de veinte mil productos importados. En lugar de proteger los empleos estadounidenses, provocó aranceles de represalia de los socios comerciales, lo que intensificó la Gran Depresión. El comercio global se contrajo aproximadamente un sesenta y seis por ciento entre 1929 y 1934. Las economías modernas están aún más interconectadas a través de cadenas de suministro globales. Un solo teléfono inteligente contiene componentes fabricados en docenas de países. Cuando las barreras comerciales aumentan, estas cadenas de suministro se ven interrumpidas, aumentando los costos y creando incertidumbre que desalienta la inversión. Los economistas coinciden ampliamente en que el libre comercio, aunque no esté exento de perdedores, crea más prosperidad general que el proteccionismo. El desafío radica en gestionar la transición para los trabajadores e industrias desplazados por la globalización, en lugar de erigir muros que finalmente perjudican a todos.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 85,
    questions: [
      { id: 'sr25q1', question: 'What is the immediate effect when a country imposes a tariff on steel?', questionEs: '¿Cuál es el efecto inmediato cuando un país impone un arancel al acero?', options: ['Steel becomes more expensive', 'Steel becomes cheaper', 'Steel production increases', 'Steel quality improves'], correctAnswer: 0, explanation: 'The immediate effect is that steel becomes more expensive in the country imposing the tariff.', explanationEs: 'El efecto inmediato es que el acero se vuelve más caro en el país que impone el arancel.' },
      { id: 'sr25q2', question: 'What did the Smoot-Hawley Tariff Act of 1930 ultimately do?', questionEs: '¿Qué hizo finalmente la Ley de Aranceles Smoot-Hawley de 1930?', options: ['Created millions of jobs', 'Reduced consumer prices', 'Intensified the Great Depression', 'Increased global trade'], correctAnswer: 2, explanation: 'Rather than protecting American jobs, it triggered retaliatory tariffs which intensified the Great Depression.', explanationEs: 'En lugar de proteger los empleos estadounidenses, provocó aranceles de represalia que intensificaron la Gran Depresión.' },
      { id: 'sr25q3', question: 'By how much did global trade shrink between 1929 and 1934?', questionEs: '¿En cuánto se contrajo el comercio global entre 1929 y 1934?', options: ['About thirty percent', 'Approximately sixty-six percent', 'About fifty percent', 'About eighty percent'], correctAnswer: 1, explanation: 'Global trade shrank by approximately sixty-six percent between 1929 and 1934.', explanationEs: 'El comercio global se contrajo aproximadamente un sesenta y seis por ciento entre 1929 y 1934.' },
      { id: 'sr25q4', question: 'What do economists broadly agree on?', questionEs: '¿En qué coinciden ampliamente los economistas?', options: ['Tariffs are always beneficial', 'Protectionism creates the most jobs', 'Free trade creates more overall prosperity than protectionism', 'Trade wars are necessary'], correctAnswer: 2, explanation: 'Economists broadly agree that free trade creates more overall prosperity than protectionism.', explanationEs: 'Los economistas coinciden ampliamente en que el libre comercio crea más prosperidad general que el proteccionismo.' },
    ]
  },
  {
    id: 'shop-reading-26',
    title: 'The Power of Habit',
    titleEs: 'El Poder del Hábito',
    passage: 'Nearly forty percent of the actions we perform each day are not the result of conscious decisions but of habits. This finding, from research by psychologists at Duke University, reveals the enormous influence that automatic behaviors have on our lives. Understanding how habits form and how they can be changed is one of the most practical applications of behavioral psychology. Every habit follows a three-step loop known as the habit loop. First, there is a cue, a trigger that tells your brain to go into automatic mode. This could be a time of day, an emotional state, a location, or the company of specific people. Second, there is a routine, which is the behavior itself — the action you take. Third, there is a reward, the benefit your brain receives that helps it remember the loop in the future. Over time, this loop becomes increasingly automatic. The key insight from habit research is that you cannot simply eliminate a bad habit. Instead, you must replace the routine while keeping the same cue and reward. For example, if you habitually eat a cookie every afternoon at three o\'clock, the cue might be the time and the reward might be a temporary energy boost and a break from work. Replacing the cookie with a walk or a piece of fruit while maintaining the same cue and reward can gradually rewire the habit loop. This principle applies to organizations and societies as well. Companies like Starbucks train employees using habit loops to maintain consistency. Hospitals that have reduced surgical errors did so by creating new habits around checklists. The power of habit is that, once formed, it requires very little mental effort to maintain, freeing our conscious minds for more complex tasks.',
    passageEs: 'Casi el cuarenta por ciento de las acciones que realizamos cada día no son el resultado de decisiones conscientes sino de hábitos. Este hallazgo, de la investigación de psicólogos de la Universidad de Duke, revela la enorme influencia que los comportamientos automáticos tienen en nuestras vidas. Entender cómo se forman los hábitos y cómo pueden cambiarse es una de las aplicaciones más prácticas de la psicología del comportamiento. Cada hábito sigue un ciclo de tres pasos conocido como el ciclo del hábito. Primero, hay una señal, un disparador que le dice a tu cerebro que entre en modo automático. Esta puede ser una hora del día, un estado emocional, un lugar o la compañía de personas específicas. Segundo, hay una rutina, que es el comportamiento en sí — la acción que tomas. Tercero, hay una recompensa, el beneficio que tu cerebro recibe y que le ayuda a recordar el ciclo en el futuro. Con el tiempo, este ciclo se vuelve cada vez más automático. La idea clave de la investigación sobre hábitos es que no puedes simplemente eliminar un mal hábito. En su lugar, debes reemplazar la rutina manteniendo la misma señal y recompensa. Por ejemplo, si habitualmente comes una galleta cada tarde a las tres, la señal podría ser la hora y la recompensa podría ser un aumento temporal de energía y un descanso del trabajo. Reemplazar la galleta con un paseo o una pieza de fruta mientras se mantienen la misma señal y recompensa puede gradualmente reconfigurar el ciclo del hábito. Este principio también se aplica a las organizaciones y las sociedades. Empresas como Starbucks entrenan a sus empleados usando ciclos de hábito para mantener la consistencia. Los hospitales que han reducido los errores quirúrgicos lo hicieron creando nuevos hábitos alrededor de las listas de verificación. El poder del hábito es que, una vez formado, requiere muy poco esfuerzo mental para mantenerse, liberando nuestras mentes conscientes para tareas más complejas.',
    level: 'advanced',
    difficulty: 4,
    xpReward: 75,
    questions: [
      { id: 'sr26q1', question: 'What percentage of daily actions are habits according to Duke University research?', questionEs: '¿Qué porcentaje de las acciones diarias son hábitos según la investigación de la Universidad de Duke?', options: ['About twenty percent', 'Nearly forty percent', 'About sixty percent', 'About ten percent'], correctAnswer: 1, explanation: 'Nearly forty percent of the actions we perform each day are habits.', explanationEs: 'Casi el cuarenta por ciento de las acciones que realizamos cada día son hábitos.' },
      { id: 'sr26q2', question: 'What are the three steps of the habit loop?', questionEs: '¿Cuáles son los tres pasos del ciclo del hábito?', options: ['Cue, routine, and reward', 'Trigger, action, and result', 'Stimulus, behavior, and outcome', 'Desire, effort, and satisfaction'], correctAnswer: 0, explanation: 'Every habit follows a three-step loop: cue, routine, and reward.', explanationEs: 'Cada hábito sigue un ciclo de tres pasos: señal, rutina y recompensa.' },
      { id: 'sr26q3', question: 'How can a bad habit be changed according to the passage?', questionEs: '¿Cómo se puede cambiar un mal hábito según el pasaje?', options: ['By willpower alone', 'By avoiding the cue', 'By replacing the routine while keeping the same cue and reward', 'By increasing the reward'], correctAnswer: 2, explanation: 'You must replace the routine while keeping the same cue and reward.', explanationEs: 'Debes reemplazar la rutina manteniendo la misma señal y recompensa.' },
      { id: 'sr26q4', question: 'What is the power of habit once it is formed?', questionEs: '¿Cuál es el poder del hábito una vez formado?', options: ['It makes us smarter', 'It helps us earn more money', 'It becomes harder to change', 'It requires very little mental effort to maintain'], correctAnswer: 3, explanation: 'Once formed, a habit requires very little mental effort to maintain, freeing our conscious minds for more complex tasks.', explanationEs: 'Una vez formado, un hábito requiere muy poco esfuerzo mental para mantenerse, liberando nuestras mentes conscientes para tareas más complejas.' },
    ]
  },
  {
    id: 'shop-reading-27',
    title: 'The Ethics of AI',
    titleEs: 'La Ética de la Inteligencia Artificial',
    passage: 'Artificial intelligence is transforming every sector of society, from healthcare and finance to criminal justice and military operations. As AI systems make increasingly consequential decisions, the question of ethics has moved from academic debate to urgent practical necessity. One of the most pressing concerns is algorithmic bias. AI systems learn from historical data, which often reflects existing societal prejudices. A hiring algorithm trained on past employment data may systematically disadvantage women or minorities. A criminal risk assessment tool may assign higher risk scores to people of color based on biased arrest records. These are not hypothetical scenarios — they have been documented in real-world applications. Another critical issue is transparency and accountability. Many advanced AI systems, particularly deep learning models, operate as black boxes. Even their creators cannot fully explain why a particular decision was made. This opacity is problematic when AI determines whether someone receives a loan, is granted bail, or is diagnosed with a disease. The question of responsibility becomes tangled: when an AI system causes harm, who is accountable — the programmer, the company, or the algorithm itself? Furthermore, AI raises fundamental questions about autonomy and human agency. As recommendation algorithms shape what news we read, what products we buy, and even whom we date, are we still making free choices? The concentration of AI power in a handful of technology giants compounds these concerns, as a small number of corporations now wield unprecedented influence over billions of people. Addressing these ethical challenges requires not just technical solutions but robust legal frameworks, diverse perspectives in AI development, and ongoing public discourse about the kind of society we wish to create.',
    passageEs: 'La inteligencia artificial está transformando todos los sectores de la sociedad, desde la salud y las finanzas hasta la justicia penal y las operaciones militares. A medida que los sistemas de IA toman decisiones cada vez más trascendentales, la cuestión de la ética ha pasado del debate académico a una necesidad práctica urgente. Una de las preocupaciones más apremiantes es el sesgo algorítmico. Los sistemas de IA aprenden de datos históricos, que a menudo reflejan los prejuicios sociales existentes. Un algoritmo de contratación entrenado con datos de empleo pasados puede sistemáticamente perjudicar a mujeres o minorías. Una herramienta de evaluación de riesgo criminal puede asignar puntuaciones de riesgo más altas a personas de color basándose en registros de arrestos sesgados. Estos no son escenarios hipotéticos — han sido documentados en aplicaciones del mundo real. Otro tema crítico es la transparencia y la responsabilidad. Muchos sistemas avanzados de IA, particularmente los modelos de aprendizaje profundo, operan como cajas negras. Incluso sus creadores no pueden explicar completamente por qué se tomó una decisión particular. Esta opacidad es problemática cuando la IA determina si alguien recibe un préstamo, se le concede la libertad bajo fianza o se le diagnostica una enfermedad. La pregunta de la responsabilidad se complica: cuando un sistema de IA causa daño, ¿quién es responsable — el programador, la empresa o el algoritmo mismo? Además, la IA plantea preguntas fundamentales sobre la autonomía y la agencia humana. A medida que los algoritmos de recomendación moldean qué noticias leemos, qué productos compramos e incluso con quién salimos, ¿estamos aún haciendo elecciones libres? La concentración del poder de la IA en un puñado de gigantes tecnológicos agrava estas preocupaciones, ya que un pequeño número de corporaciones ejerce ahora una influencia sin precedentes sobre miles de millones de personas. Abordar estos desafíos éticos requiere no solo soluciones técnicas sino marcos legales robustos, perspectivas diversas en el desarrollo de la IA y un discurso público continuo sobre el tipo de sociedad que deseamos crear.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 90,
    questions: [
      { id: 'sr27q1', question: 'What is algorithmic bias?', questionEs: '¿Qué es el sesgo algorítmico?', options: ['When AI systems learn from data that reflects societal prejudices', 'AI systems that only work in certain countries', 'AI that is too expensive for poor communities', 'AI systems that are too slow to be useful'], correctAnswer: 0, explanation: 'AI systems learn from historical data, which often reflects existing societal prejudices.', explanationEs: 'Los sistemas de IA aprenden de datos históricos, que a menudo reflejan los prejuicios sociales existentes.' },
      { id: 'sr27q2', question: 'What does "black box" mean in the context of AI?', questionEs: '¿Qué significa "caja negra" en el contexto de la IA?', options: ['AI systems that are physically black', 'Systems whose decisions cannot be fully explained even by their creators', 'AI that works in the dark', 'Systems that are very expensive'], correctAnswer: 1, explanation: 'Many advanced AI systems operate as black boxes — even their creators cannot fully explain why a particular decision was made.', explanationEs: 'Muchos sistemas avanzados de IA operan como cajas negras — incluso sus creadores no pueden explicar completamente por qué se tomó una decisión.' },
      { id: 'sr27q3', question: 'What happens when AI systems cause harm?', questionEs: '¿Qué pasa cuando los sistemas de IA causan daño?', options: ['The government always pays compensation', 'It is unclear who is accountable', 'The AI system is shut down immediately', 'The user is always responsible'], correctAnswer: 1, explanation: 'When an AI system causes harm, who is accountable — the programmer, the company, or the algorithm itself — becomes a tangled question.', explanationEs: 'Cuando un sistema de IA causa daño, quién es responsable — el programador, la empresa o el algoritmo mismo — se convierte en una pregunta complicada.' },
      { id: 'sr27q4', question: 'What does the passage suggest is needed to address AI ethics?', questionEs: '¿Qué sugiere el pasaje que se necesita para abordar la ética de la IA?', options: ['Only technical solutions', 'Banning all AI development', 'More funding for AI companies', 'Technical solutions, legal frameworks, diverse perspectives, and public discourse'], correctAnswer: 3, explanation: 'Addressing these ethical challenges requires not just technical solutions but robust legal frameworks, diverse perspectives, and ongoing public discourse.', explanationEs: 'Abordar estos desafíos éticos requiere no solo soluciones técnicas sino marcos legales robustos, perspectivas diversas y un discurso público continuo.' },
    ]
  },
  {
    id: 'shop-reading-28',
    title: 'What Is Happiness?',
    titleEs: '¿Qué Es la Felicidad?',
    passage: 'Philosophers have debated the nature of happiness for over two thousand years, and they still have not reached a consensus. Ancient Greek philosophers offered two competing visions. The Hedonists, led by Epicurus, argued that happiness is the pursuit of pleasure and the avoidance of pain. A happy life, in this view, is one filled with enjoyable experiences and free from suffering. The Stoics, by contrast, believed that happiness comes from accepting the things we cannot change and cultivating virtue and self-discipline. In their view, external circumstances like wealth or health do not determine happiness — only our internal responses to those circumstances matter. Modern psychology has added empirical data to this ancient debate. Research by Daniel Gilbert at Harvard suggests that humans are remarkably bad at predicting what will make them happy, a phenomenon he calls affective forecasting errors. People consistently overestimate how much happiness a new car, a promotion, or even winning the lottery will bring, and they underestimate their ability to adapt to negative events. Another influential theory, proposed by psychologists Ed Diener and Martin Seligman, distinguishes between hedonic well-being, which is about pleasure and positive emotions, and eudaimonic well-being, which comes from living a meaningful life aligned with one\'s values. Studies suggest that while pleasure brings short-term satisfaction, meaning and purpose provide deeper, more lasting well-being. Perhaps the most surprising finding is the role of social connections. Across cultures and demographics, the strongest predictor of happiness is not income, achievement, or even health — it is the quality of our relationships with other people.',
    passageEs: 'Los filósofos han debatido la naturaleza de la felicidad durante más de dos mil años, y aún no han llegado a un consenso. Los filósofos griegos antiguos ofrecieron dos visiones competitivas. Los hedonistas, liderados por Epicuro, argumentaban que la felicidad es la búsqueda del placer y la evitación del dolor. Una vida feliz, en esta visión, es una llena de experiencias placenteras y libre de sufrimiento. Los estoicos, por el contrario, creían que la felicidad viene de aceptar las cosas que no podemos cambiar y cultivar la virtud y la autodisciplina. En su visión, las circunstancias externas como la riqueza o la salud no determinan la felicidad — solo importan nuestras respuestas internas a esas circunstancias. La psicología moderna ha añadido datos empíricos a este debate antiguo. La investigación de Daniel Gilbert en Harvard sugiere que los humanos son notablemente malos para predecir qué los hará felices, un fenómeno que él llama errores de pronóstico afectivo. Las personas consistentemente sobreestiman cuánta felicidad traerá un auto nuevo, una promoción o incluso ganar la lotería, y subestiman su capacidad para adaptarse a eventos negativos. Otra teoría influyente, propuesta por los psicólogos Ed Diener y Martin Seligman, distingue entre el bienestar hedónico, que se trata de placer y emociones positivas, y el bienestar eudaimónico, que proviene de vivir una vida significativa alineada con los valores propios. Los estudios sugieren que mientras el placer trae satisfacción a corto plazo, el significado y el propósito proporcionan un bienestar más profundo y duradero. Quizás el hallazgo más sorprendente es el papel de las conexiones sociales. A través de culturas y demografías, el predictor más fuerte de la felicidad no es el ingreso, el logro o incluso la salud — es la calidad de nuestras relaciones con otras personas.',
    level: 'advanced',
    difficulty: 4,
    xpReward: 80,
    questions: [
      { id: 'sr28q1', question: 'What did the Hedonists believe about happiness?', questionEs: '¿Qué creían los hedonistas sobre la felicidad?', options: ['It comes from pursuing pleasure and avoiding pain', 'It comes from virtue and self-discipline', 'It comes from wealth and power', 'It comes from helping others'], correctAnswer: 0, explanation: 'The Hedonists argued that happiness is the pursuit of pleasure and the avoidance of pain.', explanationEs: 'Los hedonistas argumentaban que la felicidad es la búsqueda del placer y la evitación del dolor.' },
      { id: 'sr28q2', question: 'What are affective forecasting errors?', questionEs: '¿Qué son los errores de pronóstico afectivo?', options: ['Mistakes in weather prediction', 'People are bad at predicting what will make them happy', 'Errors in financial forecasting', 'Problems with emotional intelligence'], correctAnswer: 1, explanation: 'Humans are remarkably bad at predicting what will make them happy, a phenomenon called affective forecasting errors.', explanationEs: 'Los humanos son notablemente malos para predecir qué los hará felices, un fenómeno llamado errores de pronóstico afectivo.' },
      { id: 'sr28q3', question: 'What is the difference between hedonic and eudaimonic well-being?', questionEs: '¿Cuál es la diferencia entre el bienestar hedónico y el eudaimónico?', options: ['Hedonic is about pleasure; eudaimonic is about meaning and purpose', 'They are the same thing', 'Hedonic is long-term; eudaimonic is short-term', 'Hedonic is about health; eudaimonic is about money'], correctAnswer: 0, explanation: 'Hedonic well-being is about pleasure and positive emotions, while eudaimonic well-being comes from living a meaningful life aligned with one\'s values.', explanationEs: 'El bienestar hedónico se trata de placer y emociones positivas, mientras que el eudaimónico proviene de vivir una vida significativa alineada con los valores propios.' },
      { id: 'sr28q4', question: 'What is the strongest predictor of happiness across cultures?', questionEs: '¿Cuál es el predictor más fuerte de la felicidad a través de las culturas?', options: ['Income level', 'Educational achievement', 'Physical health', 'The quality of relationships with other people'], correctAnswer: 3, explanation: 'Across cultures and demographics, the strongest predictor of happiness is the quality of our relationships with other people.', explanationEs: 'A través de culturas y demografías, el predictor más fuerte de la felicidad es la calidad de nuestras relaciones con otras personas.' },
    ]
  },
  {
    id: 'shop-reading-29',
    title: 'The Tipping Point',
    titleEs: 'El Punto de Inflexión',
    passage: 'Climate scientists have identified several tipping points in the Earth\'s climate system — thresholds beyond which changes become self-reinforcing and potentially irreversible. Once crossed, these tipping points can trigger cascading effects that accelerate global warming regardless of human efforts to reduce emissions. Understanding these thresholds is critical for informed policy decisions. One of the most studied tipping points is the destabilization of the West Antarctic ice sheet. As global temperatures rise, the ice sheet loses mass through melting and the calving of icebergs. When enough ice is lost, the sheet\'s grounding line — where ice meets the ocean floor — retreats past a ridge, allowing warm ocean water to flow underneath and accelerate melting from below. This creates a feedback loop that cannot be stopped even if temperatures stabilize. Scientists estimate this tipping point could be crossed between one and three degrees Celsius of warming above pre-industrial levels, a range we are rapidly approaching. Another critical tipping point involves the Amazon rainforest. Often called the lungs of the Earth, the Amazon generates approximately twenty percent of the world\'s oxygen and stores vast amounts of carbon. However, deforestation combined with increasing temperatures and drought is pushing the forest toward a savannization threshold. Beyond this point, the Amazon would begin releasing more carbon than it absorbs, transforming from a carbon sink into a carbon source. The thawing of permafrost in the Arctic presents a similar danger. As frozen soil melts, it releases methane, a greenhouse gas approximately eighty times more potent than carbon dioxide over a twenty-year period. Each of these tipping points increases the likelihood of crossing others, creating a domino effect that could fundamentally alter the planet\'s climate system within decades rather than centuries.',
    passageEs: 'Los científicos climáticos han identificado varios puntos de inflexión en el sistema climático de la Tierra — umbrales más allá de los cuales los cambios se vuelven autorreforzantes y potencialmente irreversibles. Una vez cruzados, estos puntos de inflexión pueden desencadenar efectos en cascada que aceleran el calentamiento global independientemente de los esfuerzos humanos por reducir las emisiones. Entender estos umbrales es fundamental para tomar decisiones políticas informadas. Uno de los puntos de inflexión más estudiados es la desestabilización de la capa de hielo de la Antártida Occidental. A medida que las temperaturas globales aumentan, la capa de hielo pierde masa a través del derretimiento y el desprendimiento de icebergs. Cuando se pierde suficiente hielo, la línea de grounding — donde el hielo se encuentra con el fondo del océano — retrocede más allá de una cresta, permitiendo que el agua cálida del océano fluya por debajo y acelere el derretimiento desde abajo. Esto crea un bucle de retroalimentación que no puede detenerse incluso si las temperaturas se estabilizan. Los científicos estiman que este punto de inflexión podría cruzarse entre uno y tres grados Celsius de calentamiento por encima de los niveles preindustriales, un rango que nos acercamos rápidamente. Otro punto de inflexión crítico involucra la selva amazónica. A menudo llamada los pulmones de la Tierra, la Amazonía genera aproximadamente el veinte por ciento del oxígeno del mundo y almacena grandes cantidades de carbono. Sin embargo, la deforestación combinada con el aumento de las temperaturas y la sequía está empujando al bosque hacia un umbral de sabanización. Más allá de este punto, la Amazonía comenzaría a liberar más carbono del que absorbe, transformándose de sumidero de carbono a fuente de carbono. El deshielo del permafrost en el Ártico presenta un peligro similar. A medida que el suelo congelado se derrite, libera metano, un gas de efecto invernadero aproximadamente ochenta veces más potente que el dióxido de carbono durante un período de veinte años. Cada uno de estos puntos de inflexión aumenta la probabilidad de cruzar otros, creando un efecto dominó que podría alterar fundamentalmente el sistema climático del planeta en décadas en lugar de siglos.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 85,
    questions: [
      { id: 'sr29q1', question: 'What is a climate tipping point?', questionEs: '¿Qué es un punto de inflexión climático?', options: ['A threshold beyond which changes become self-reinforcing and irreversible', 'A temperature record', 'A weather forecast model', 'A political agreement on climate'], correctAnswer: 0, explanation: 'Tipping points are thresholds beyond which changes become self-reinforcing and potentially irreversible.', explanationEs: 'Los puntos de inflexión son umbrales más allá de los cuales los cambios se vuelven autorreforzantes y potencialmente irreversibles.' },
      { id: 'sr29q2', question: 'What happens when the Antarctic ice sheet\'s grounding line retreats past a ridge?', questionEs: '¿Qué sucede cuando la línea de grounding de la capa de hielo antártica retrocede más allá de una cresta?', options: ['The ice becomes thicker', 'Warm ocean water flows underneath and accelerates melting', 'The ice sheet stabilizes', 'New ice forms on top'], correctAnswer: 1, explanation: 'When the grounding line retreats past a ridge, warm ocean water flows underneath and accelerates melting from below.', explanationEs: 'Cuando la línea de grounding retrocede más allá de una cresta, el agua cálida del océano fluye por debajo y acelera el derretimiento.' },
      { id: 'sr29q3', question: 'What could happen to the Amazon beyond the savannization threshold?', questionEs: '¿Qué podría pasarle a la Amazonía más allá del umbral de sabanización?', options: ['It would grow larger', 'It would become a desert', 'It would release more carbon than it absorbs', 'It would generate more oxygen'], correctAnswer: 2, explanation: 'Beyond the savannization threshold, the Amazon would begin releasing more carbon than it absorbs.', explanationEs: 'Más allá del umbral de sabanización, la Amazonía comenzaría a liberar más carbono del que absorbe.' },
      { id: 'sr29q4', question: 'Why is methane from thawing permafrost particularly dangerous?', questionEs: '¿Por qué es particularmente peligroso el metano del permafrost que se derrite?', options: ['It smells terrible', 'It is about eighty times more potent than carbon dioxide over twenty years', 'It is impossible to detect', 'It only affects the Arctic'], correctAnswer: 1, explanation: 'Methane is approximately eighty times more potent than carbon dioxide over a twenty-year period.', explanationEs: 'El metano es aproximadamente ochenta veces más potente que el dióxido de carbono durante un período de veinte años.' },
    ]
  },
  {
    id: 'shop-reading-30',
    title: 'The Vaccine That Changed the World',
    titleEs: 'La Vacuna Que Cambió el Mundo',
    passage: 'The development of mRNA vaccines against COVID-19 represents one of the most remarkable achievements in the history of medicine. What makes this breakthrough extraordinary is not just its impact on the pandemic but the decades of persistent research that preceded it and the revolutionary implications for future medicine. The story begins with Hungarian-born scientist Katalin Karikó, who spent decades studying messenger RNA at the University of Pennsylvania. For years, her work was dismissed and underfunded because the scientific establishment believed mRNA was too unstable to be used therapeutically. Grant after grant was rejected. She was demoted from her faculty position in 1995. But Karikó persisted, convinced that mRNA held the key to a new kind of medicine. In 2005, she and immunologist Drew Weissman made a crucial discovery: by modifying the nucleosides in mRNA, they could prevent the inflammatory immune response that had made synthetic mRNA unusable. This breakthrough, largely ignored at the time, became the foundation for the COVID-19 vaccines developed by Pfizer-BioNTech and Moderna. The speed of vaccine development was unprecedented. Traditional vaccine development typically takes ten to fifteen years. The mRNA vaccines were designed within days of the virus genome being published and authorized for emergency use within eleven months. Beyond COVID-19, mRNA technology holds promise for treating cancer, heart disease, and other conditions. Clinical trials are already underway for personalized cancer vaccines that train the immune system to attack specific tumors. Karikó and Weissman received the Nobel Prize in Medicine in 2023, a testament to the power of perseverance and the importance of funding basic research that may not show immediate practical applications.',
    passageEs: 'El desarrollo de vacunas de ARNm contra el COVID-19 representa uno de los logros más notables en la historia de la medicina. Lo que hace extraordinario este avance no es solo su impacto en la pandemia sino las décadas de investigación persistente que lo precedieron y las implicaciones revolucionarias para la medicina futura. La historia comienza con la científica de origen húngaro Katalin Karikó, quien pasó décadas estudiando el ARN mensajero en la Universidad de Pensilvania. Durante años, su trabajo fue descartado y subfinanciado porque el establecimiento científico creía que el ARNm era demasiado inestable para ser usado terapéuticamente. Beca tras beca fue rechazada. Fue degradada de su posición docente en 1995. Pero Karikó persistió, convencida de que el ARNm tenía la clave para un nuevo tipo de medicina. En 2005, ella y el inmunólogo Drew Weissman hicieron un descubrimiento crucial: al modificar los nucleósidos en el ARNm, podían prevenir la respuesta inflamatoria que había hecho que el ARNm sintético fuera inutilizable. Este avance, en gran parte ignorado en su momento, se convirtió en la base de las vacunas contra el COVID-19 desarrolladas por Pfizer-BioNTech y Moderna. La velocidad del desarrollo de la vacuna fue sin precedentes. El desarrollo tradicional de vacunas típicamente toma de diez a quince años. Las vacunas de ARNm fueron diseñadas en cuestión de días después de que se publicara el genoma del virus y autorizadas para uso de emergencia en once meses. Más allá del COVID-19, la tecnología de ARNm tiene promesas para tratar el cáncer, enfermedades cardíacas y otras condiciones. Ya están en marcha ensayos clínicos para vacunas personalizadas contra el cáncer que entrenan al sistema inmunológico para atacar tumores específicos. Karikó y Weissman recibieron el Premio Nobel de Medicina en 2023, un testimonio del poder de la perseverancia y la importancia de financiar la investigación básica que puede no mostrar aplicaciones prácticas inmediatas.',
    level: 'advanced',
    difficulty: 5,
    xpReward: 90,
    questions: [
      { id: 'sr30q1', question: 'Why was Katalin Karikó\'s work initially dismissed?', questionEs: '¿Por qué el trabajo de Katalin Karikó fue inicialmente descartado?', options: ['She was not qualified', 'mRNA was considered too unstable for therapeutic use', 'She worked at the wrong university', 'Her research was about viruses'], correctAnswer: 1, explanation: 'Her work was dismissed because the scientific establishment believed mRNA was too unstable to be used therapeutically.', explanationEs: 'Su trabajo fue descartado porque el establecimiento científico creía que el ARNm era demasiado inestable para ser usado terapéuticamente.' },
      { id: 'sr30q2', question: 'What crucial discovery did Karikó and Weissman make in 2005?', questionEs: '¿Qué descubrimiento crucial hicieron Karikó y Weissman en 2005?', options: ['Modifying nucleosides in mRNA prevents inflammatory immune responses', 'mRNA can cure all diseases', 'Vaccines can be made from sugar', 'Viruses are not dangerous'], correctAnswer: 0, explanation: 'By modifying the nucleosides in mRNA, they could prevent the inflammatory immune response that had made synthetic mRNA unusable.', explanationEs: 'Al modificar los nucleósidos en el ARNm, podían prevenir la respuesta inflamatoria que había hecho que el ARNm sintético fuera inutilizable.' },
      { id: 'sr30q3', question: 'How long does traditional vaccine development typically take?', questionEs: '¿Cuánto tiempo suele tomar el desarrollo tradicional de vacunas?', options: ['One to two years', 'Six months', 'Ten to fifteen years', 'Twenty years'], correctAnswer: 2, explanation: 'Traditional vaccine development typically takes ten to fifteen years.', explanationEs: 'El desarrollo tradicional de vacunas típicamente toma de diez a quince años.' },
      { id: 'sr30q4', question: 'What broader promise does mRNA technology hold?', questionEs: '¿Qué promesa más amplia tiene la tecnología de ARNm?', options: ['Replacing all doctors', 'Treating cancer, heart disease, and other conditions', 'Eliminating all viruses', 'Making people immortal'], correctAnswer: 1, explanation: 'Beyond COVID-19, mRNA technology holds promise for treating cancer, heart disease, and other conditions.', explanationEs: 'Más allá del COVID-19, la tecnología de ARNm tiene promesas para tratar el cáncer, enfermedades cardíacas y otras condiciones.' },
    ]
  },]

// ============================================
// BATTLE QUESTIONS
// ============================================
export interface BattleQuestion {
  id: string;
  prompt: string;
  promptEs: string;
  options: string[];
  correctIndex: number;
  level: 'basic' | 'intermediate' | 'advanced';
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  // ── BASIC (100 questions) ──────────────────
  { id: 'bq-1', prompt: 'What color is the sky on a clear day?', promptEs: '¿De qué color es el cielo en un día despejado?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctIndex: 1, level: 'basic' },
  { id: 'bq-2', prompt: 'How do you say "rojo" in English?', promptEs: '¿Cómo se dice "rojo" en inglés?', options: ['Red', 'Blue', 'Green', 'White'], correctIndex: 0, level: 'basic' },
  { id: 'bq-3', prompt: 'What number comes after seven?', promptEs: '¿Qué número viene después del siete?', options: ['Six', 'Eight', 'Nine', 'Ten'], correctIndex: 1, level: 'basic' },
  { id: 'bq-4', prompt: 'What is the English word for "perro"?', promptEs: '¿Cuál es la palabra en inglés para "perro"?', options: ['Cat', 'Dog', 'Bird', 'Fish'], correctIndex: 1, level: 'basic' },
  { id: 'bq-5', prompt: 'Which day comes after Monday?', promptEs: '¿Qué día viene después del lunes?', options: ['Sunday', 'Wednesday', 'Tuesday', 'Friday'], correctIndex: 2, level: 'basic' },
  { id: 'bq-6', prompt: 'What is "agua" in English?', promptEs: '¿Qué es "agua" en inglés?', options: ['Fire', 'Water', 'Air', 'Earth'], correctIndex: 1, level: 'basic' },
  { id: 'bq-7', prompt: 'How many months are in a year?', promptEs: '¿Cuántos meses hay en un año?', options: ['Ten', 'Eleven', 'Twelve', 'Thirteen'], correctIndex: 2, level: 'basic' },
  { id: 'bq-8', prompt: 'What is the opposite of "hot"?', promptEs: '¿Cuál es lo opuesto de "hot"?', options: ['Warm', 'Cold', 'Cool', 'Mild'], correctIndex: 1, level: 'basic' },
  { id: 'bq-9', prompt: 'What color is grass?', promptEs: '¿De qué color es la hierba?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctIndex: 2, level: 'basic' },
  { id: 'bq-10', prompt: 'What is "madre" in English?', promptEs: '¿Qué es "madre" en inglés?', options: ['Father', 'Sister', 'Mother', 'Brother'], correctIndex: 2, level: 'basic' },
  { id: 'bq-11', prompt: 'Which season comes after winter?', promptEs: '¿Qué estación viene después del invierno?', options: ['Summer', 'Fall', 'Spring', 'Winter'], correctIndex: 2, level: 'basic' },
  { id: 'bq-12', prompt: 'What is the English word for "casa"?', promptEs: '¿Cuál es la palabra en inglés para "casa"?', options: ['Car', 'House', 'School', 'Store'], correctIndex: 1, level: 'basic' },
  { id: 'bq-13', prompt: 'How do you say "grande" in English?', promptEs: '¿Cómo se dice "grande" en inglés?', options: ['Small', 'Big', 'Tall', 'Short'], correctIndex: 1, level: 'basic' },
  { id: 'bq-14', prompt: 'What fruit is yellow and curved?', promptEs: '¿Qué fruta es amarilla y curvada?', options: ['Apple', 'Orange', 'Banana', 'Grape'], correctIndex: 2, level: 'basic' },
  { id: 'bq-15', prompt: 'What is "libro" in English?', promptEs: '¿Qué es "libro" en inglés?', options: ['Pen', 'Book', 'Desk', 'Chair'], correctIndex: 1, level: 'basic' },
  { id: 'bq-16', prompt: 'Which body part do you see with?', promptEs: '¿Con qué parte del cuerpo ves?', options: ['Ears', 'Nose', 'Mouth', 'Eyes'], correctIndex: 3, level: 'basic' },
  { id: 'bq-17', prompt: 'What is "comer" in English?', promptEs: '¿Qué es "comer" en inglés?', options: ['Drink', 'Sleep', 'Eat', 'Run'], correctIndex: 2, level: 'basic' },
  { id: 'bq-18', prompt: 'What day is between Friday and Sunday?', promptEs: '¿Qué día está entre el viernes y el domingo?', options: ['Thursday', 'Saturday', 'Monday', 'Wednesday'], correctIndex: 1, level: 'basic' },
  { id: 'bq-19', prompt: 'What is the English word for "gato"?', promptEs: '¿Cuál es la palabra en inglés para "gato"?', options: ['Dog', 'Mouse', 'Cat', 'Rabbit'], correctIndex: 2, level: 'basic' },
  { id: 'bq-20', prompt: 'How do you say "bienvenido" in English?', promptEs: '¿Cómo se dice "bienvenido" en inglés?', options: ['Goodbye', 'Welcome', 'Hello', 'Thanks'], correctIndex: 1, level: 'basic' },
  { id: 'bq-21', prompt: 'What is "mesa" in English?', promptEs: '¿Qué es "mesa" en inglés?', options: ['Chair', 'Table', 'Desk', 'Sofa'], correctIndex: 1, level: 'basic' },
  { id: 'bq-22', prompt: 'Which animal says "moo"?', promptEs: '¿Qué animal dice "mu"?', options: ['Pig', 'Sheep', 'Cow', 'Horse'], correctIndex: 2, level: 'basic' },
  { id: 'bq-23', prompt: 'What is the opposite of "big"?', promptEs: '¿Cuál es lo opuesto de "big"?', options: ['Small', 'Large', 'Huge', 'Wide'], correctIndex: 0, level: 'basic' },
  { id: 'bq-24', prompt: 'What color is a banana?', promptEs: '¿De qué color es una banana?', options: ['Red', 'Green', 'Yellow', 'Orange'], correctIndex: 2, level: 'basic' },
  { id: 'bq-25', prompt: 'How do you say "amigo" in English?', promptEs: '¿Cómo se dice "amigo" en inglés?', options: ['Enemy', 'Friend', 'Neighbor', 'Teacher'], correctIndex: 1, level: 'basic' },
  { id: 'bq-26', prompt: 'What is "escuela" in English?', promptEs: '¿Qué es "escuela" en inglés?', options: ['Hospital', 'School', 'Church', 'Office'], correctIndex: 1, level: 'basic' },
  { id: 'bq-27', prompt: 'How many days are in a week?', promptEs: '¿Cuántos días hay en una semana?', options: ['Five', 'Six', 'Seven', 'Eight'], correctIndex: 2, level: 'basic' },
  { id: 'bq-28', prompt: 'What is the English word for "sol"?', promptEs: '¿Cuál es la palabra en inglés para "sol"?', options: ['Moon', 'Star', 'Sun', 'Cloud'], correctIndex: 2, level: 'basic' },
  { id: 'bq-29', prompt: 'Which month comes after March?', promptEs: '¿Qué mes viene después de marzo?', options: ['February', 'April', 'May', 'June'], correctIndex: 1, level: 'basic' },
  { id: 'bq-30', prompt: 'What is "hermano" in English?', promptEs: '¿Qué es "hermano" en inglés?', options: ['Sister', 'Cousin', 'Brother', 'Uncle'], correctIndex: 2, level: 'basic' },
  { id: 'bq-31', prompt: 'What do you wear on your feet?', promptEs: '¿Qué te pones en los pies?', options: ['Hat', 'Gloves', 'Shoes', 'Scarf'], correctIndex: 2, level: 'basic' },
  { id: 'bq-32', prompt: 'What is "leche" in English?', promptEs: '¿Qué es "leche" en inglés?', options: ['Water', 'Juice', 'Milk', 'Tea'], correctIndex: 2, level: 'basic' },
  { id: 'bq-33', prompt: 'What is the opposite of "happy"?', promptEs: '¿Cuál es lo opuesto de "happy"?', options: ['Glad', 'Sad', 'Angry', 'Tired'], correctIndex: 1, level: 'basic' },
  { id: 'bq-34', prompt: 'Which room do you cook in?', promptEs: '¿En qué habitación cocinas?', options: ['Bedroom', 'Bathroom', 'Kitchen', 'Living room'], correctIndex: 2, level: 'basic' },
  { id: 'bq-35', prompt: 'What is "flor" in English?', promptEs: '¿Qué es "flor" en inglés?', options: ['Tree', 'Grass', 'Flower', 'Leaf'], correctIndex: 2, level: 'basic' },
  { id: 'bq-36', prompt: 'How do you say "buenos días" in English?', promptEs: '¿Cómo se dice "buenos días" en inglés?', options: ['Good night', 'Good morning', 'Good evening', 'Goodbye'], correctIndex: 1, level: 'basic' },
  { id: 'bq-37', prompt: 'What is the English word for "pollo"?', promptEs: '¿Cuál es la palabra en inglés para "pollo"?', options: ['Beef', 'Fish', 'Chicken', 'Pork'], correctIndex: 2, level: 'basic' },
  { id: 'bq-38', prompt: 'What number is between 10 and 12?', promptEs: '¿Qué número está entre 10 y 12?', options: ['9', '13', '11', '14'], correctIndex: 2, level: 'basic' },
  { id: 'bq-39', prompt: 'What is "cielo" in English?', promptEs: '¿Qué es "cielo" en inglés?', options: ['Ground', 'Sky', 'Sea', 'Mountain'], correctIndex: 1, level: 'basic' },
  { id: 'bq-40', prompt: 'Which weather involves snow?', promptEs: '¿Qué clima implica nieve?', options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'], correctIndex: 3, level: 'basic' },
  { id: 'bq-41', prompt: 'What is "padre" in English?', promptEs: '¿Qué es "padre" en inglés?', options: ['Father', 'Mother', 'Uncle', 'Grandfather'], correctIndex: 0, level: 'basic' },
  { id: 'bq-42', prompt: 'What do you use to write?', promptEs: '¿Qué usas para escribir?', options: ['Eraser', 'Pen', 'Ruler', 'Scissors'], correctIndex: 1, level: 'basic' },
  { id: 'bq-43', prompt: 'How do you say "gracias" in English?', promptEs: '¿Cómo se dice "gracias" en inglés?', options: ['Please', 'Sorry', 'Thank you', 'Hello'], correctIndex: 2, level: 'basic' },
  { id: 'bq-44', prompt: 'What is the opposite of "fast"?', promptEs: '¿Cuál es lo opuesto de "fast"?', options: ['Quick', 'Slow', 'Rapid', 'Swift'], correctIndex: 1, level: 'basic' },
  { id: 'bq-45', prompt: 'What is "mariposa" in English?', promptEs: '¿Qué es "mariposa" en inglés?', options: ['Bee', 'Butterfly', 'Spider', 'Ant'], correctIndex: 1, level: 'basic' },
  { id: 'bq-46', prompt: 'What fruit is typically red and round?', promptEs: '¿Qué fruta es típicamente roja y redonda?', options: ['Banana', 'Orange', 'Apple', 'Pear'], correctIndex: 2, level: 'basic' },
  { id: 'bq-47', prompt: 'What is "playa" in English?', promptEs: '¿Qué es "playa" en inglés?', options: ['Mountain', 'Beach', 'River', 'Lake'], correctIndex: 1, level: 'basic' },
  { id: 'bq-48', prompt: 'Which animal lives in water?', promptEs: '¿Qué animal vive en el agua?', options: ['Dog', 'Cat', 'Fish', 'Bird'], correctIndex: 2, level: 'basic' },
  { id: 'bq-49', prompt: 'What is "puerta" in English?', promptEs: '¿Qué es "puerta" en inglés?', options: ['Window', 'Wall', 'Door', 'Floor'], correctIndex: 2, level: 'basic' },
  { id: 'bq-50', prompt: 'How do you say "por favor" in English?', promptEs: '¿Cómo se dice "por favor" en inglés?', options: ['Thank you', 'Please', 'Sorry', 'Excuse me'], correctIndex: 1, level: 'basic' },
  { id: 'bq-51', prompt: 'What is the English word for "naranja" (fruit)?', promptEs: '¿Cuál es la palabra en inglés para "naranja" (fruta)?', options: ['Lemon', 'Apple', 'Orange', 'Peach'], correctIndex: 2, level: 'basic' },
  { id: 'bq-52', prompt: 'What body part do you hear with?', promptEs: '¿Con qué parte del cuerpo escuchas?', options: ['Eyes', 'Ears', 'Nose', 'Hands'], correctIndex: 1, level: 'basic' },
  { id: 'bq-53', prompt: 'What is "cama" in English?', promptEs: '¿Qué es "cama" en inglés?', options: ['Chair', 'Sofa', 'Bed', 'Table'], correctIndex: 2, level: 'basic' },
  { id: 'bq-54', prompt: 'Which season is the hottest?', promptEs: '¿Qué estación es la más caliente?', options: ['Spring', 'Summer', 'Fall', 'Winter'], correctIndex: 1, level: 'basic' },
  { id: 'bq-55', prompt: 'What is "estrella" in English?', promptEs: '¿Qué es "estrella" en inglés?', options: ['Moon', 'Sun', 'Star', 'Planet'], correctIndex: 2, level: 'basic' },
  { id: 'bq-56', prompt: 'What do you drink from a cup?', promptEs: '¿Qué bebes de una taza?', options: ['Bread', 'Rice', 'Coffee', 'Salad'], correctIndex: 2, level: 'basic' },
  { id: 'bq-57', prompt: 'How do you say "adiós" in English?', promptEs: '¿Cómo se dice "adiós" en inglés?', options: ['Hello', 'Please', 'Goodbye', 'Thanks'], correctIndex: 2, level: 'basic' },
  { id: 'bq-58', prompt: 'What is the English word for "nieve"?', promptEs: '¿Cuál es la palabra en inglés para "nieve"?', options: ['Rain', 'Snow', 'Wind', 'Ice'], correctIndex: 1, level: 'basic' },
  { id: 'bq-59', prompt: 'What is "caballo" in English?', promptEs: '¿Qué es "caballo" en inglés?', options: ['Cow', 'Horse', 'Pig', 'Sheep'], correctIndex: 1, level: 'basic' },
  { id: 'bq-60', prompt: 'Which shape has three sides?', promptEs: '¿Qué forma tiene tres lados?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], correctIndex: 2, level: 'basic' },
  { id: 'bq-61', prompt: 'What is "ventana" in English?', promptEs: '¿Qué es "ventana" en inglés?', options: ['Door', 'Wall', 'Window', 'Roof'], correctIndex: 2, level: 'basic' },
  { id: 'bq-62', prompt: 'What is the English word for "árbol"?', promptEs: '¿Cuál es la palabra en inglés para "árbol"?', options: ['Bush', 'Flower', 'Tree', 'Grass'], correctIndex: 2, level: 'basic' },
  { id: 'bq-63', prompt: 'What do you wear on your head?', promptEs: '¿Qué te pones en la cabeza?', options: ['Hat', 'Shoes', 'Gloves', 'Socks'], correctIndex: 0, level: 'basic' },
  { id: 'bq-64', prompt: 'What is "pájaro" in English?', promptEs: '¿Qué es "pájaro" en inglés?', options: ['Fish', 'Dog', 'Cat', 'Bird'], correctIndex: 3, level: 'basic' },
  { id: 'bq-65', prompt: 'How do you count from one to three?', promptEs: '¿Cómo cuentas de uno a tres?', options: ['One, two, three', 'Uno, dos, tres', 'First, second, third', 'A, B, C'], correctIndex: 0, level: 'basic' },
  { id: 'bq-66', prompt: 'What is "plato" in English?', promptEs: '¿Qué es "plato" en inglés?', options: ['Cup', 'Fork', 'Plate', 'Knife'], correctIndex: 2, level: 'basic' },
  { id: 'bq-67', prompt: 'What color are leaves in spring?', promptEs: '¿De qué color son las hojas en primavera?', options: ['Brown', 'Green', 'Yellow', 'Red'], correctIndex: 1, level: 'basic' },
  { id: 'bq-68', prompt: 'What is "pelota" in English?', promptEs: '¿Qué es "pelota" en inglés?', options: ['Ball', 'Bat', 'Racket', 'Net'], correctIndex: 0, level: 'basic' },
  { id: 'bq-69', prompt: 'Which meal do you eat in the morning?', promptEs: '¿Qué comida comes por la mañana?', options: ['Lunch', 'Dinner', 'Breakfast', 'Snack'], correctIndex: 2, level: 'basic' },
  { id: 'bq-70', prompt: 'What is "tren" in English?', promptEs: '¿Qué es "tren" en inglés?', options: ['Bus', 'Train', 'Car', 'Plane'], correctIndex: 1, level: 'basic' },
  { id: 'bq-71', prompt: 'What is the opposite of "tall"?', promptEs: '¿Cuál es lo opuesto de "tall"?', options: ['High', 'Short', 'Long', 'Wide'], correctIndex: 1, level: 'basic' },
  { id: 'bq-72', prompt: 'What is "silla" in English?', promptEs: '¿Qué es "silla" en inglés?', options: ['Table', 'Desk', 'Chair', 'Sofa'], correctIndex: 2, level: 'basic' },
  { id: 'bq-73', prompt: 'How do you say "lo siento" in English?', promptEs: '¿Cómo se dice "lo siento" en inglés?', options: ['Thank you', 'Please', 'I\'m sorry', 'Excuse me'], correctIndex: 2, level: 'basic' },
  { id: 'bq-74', prompt: 'What is "río" in English?', promptEs: '¿Qué es "río" en inglés?', options: ['Lake', 'River', 'Ocean', 'Pond'], correctIndex: 1, level: 'basic' },
  { id: 'bq-75', prompt: 'What do you use to cut paper?', promptEs: '¿Qué usas para cortar papel?', options: ['Glue', 'Scissors', 'Pen', 'Eraser'], correctIndex: 1, level: 'basic' },
  { id: 'bq-76', prompt: 'What is the English word for "olla"?', promptEs: '¿Cuál es la palabra en inglés para "olla"?', options: ['Pan', 'Pot', 'Plate', 'Cup'], correctIndex: 1, level: 'basic' },
  { id: 'bq-77', prompt: 'Which animal says "oink"?', promptEs: '¿Qué animal dice "oink"?', options: ['Cow', 'Sheep', 'Pig', 'Duck'], correctIndex: 2, level: 'basic' },
  { id: 'bq-78', prompt: 'What is "montaña" in English?', promptEs: '¿Qué es "montaña" en inglés?', options: ['Hill', 'Mountain', 'Valley', 'Cliff'], correctIndex: 1, level: 'basic' },
  { id: 'bq-79', prompt: 'How do you say "buenas noches" in English?', promptEs: '¿Cómo se dice "buenas noches" en inglés?', options: ['Good morning', 'Good afternoon', 'Good night', 'Good day'], correctIndex: 2, level: 'basic' },
  { id: 'bq-80', prompt: 'What is "maestro" in English?', promptEs: '¿Qué es "maestro" en inglés?', options: ['Student', 'Teacher', 'Doctor', 'Driver'], correctIndex: 1, level: 'basic' },
  { id: 'bq-81', prompt: 'What is the opposite of "new"?', promptEs: '¿Cuál es lo opuesto de "new"?', options: ['Modern', 'Old', 'Fresh', 'Recent'], correctIndex: 1, level: 'basic' },
  { id: 'bq-82', prompt: 'What is "luna" in English?', promptEs: '¿Qué es "luna" en inglés?', options: ['Sun', 'Star', 'Moon', 'Planet'], correctIndex: 2, level: 'basic' },
  { id: 'bq-83', prompt: 'Which vegetable is orange and long?', promptEs: '¿Qué vegetal es naranja y largo?', options: ['Potato', 'Tomato', 'Carrot', 'Onion'], correctIndex: 2, level: 'basic' },
  { id: 'bq-84', prompt: 'What is "manzana" in English?', promptEs: '¿Qué es "manzana" en inglés?', options: ['Orange', 'Banana', 'Apple', 'Grape'], correctIndex: 2, level: 'basic' },
  { id: 'bq-85', prompt: 'What do you sleep on?', promptEs: '¿En qué duermes?', options: ['Table', 'Chair', 'Bed', 'Floor'], correctIndex: 2, level: 'basic' },
  { id: 'bq-86', prompt: 'What is "llave" in English?', promptEs: '¿Qué es "llave" en inglés?', options: ['Lock', 'Key', 'Door', 'Handle'], correctIndex: 1, level: 'basic' },
  { id: 'bq-87', prompt: 'How do you say "me llamo..." in English?', promptEs: '¿Cómo se dice "me llamo..." en inglés?', options: ['I am called...', 'My name is...', 'I live in...', 'I come from...'], correctIndex: 1, level: 'basic' },
  { id: 'bq-88', prompt: 'What is "televisión" in English?', promptEs: '¿Qué es "televisión" en inglés?', options: ['Radio', 'Computer', 'Television', 'Phone'], correctIndex: 2, level: 'basic' },
  { id: 'bq-89', prompt: 'Which is a primary color?', promptEs: '¿Cuál es un color primario?', options: ['Purple', 'Orange', 'Green', 'Red'], correctIndex: 3, level: 'basic' },
  { id: 'bq-90', prompt: 'What is "helado" in English?', promptEs: '¿Qué es "helado" en inglés?', options: ['Cake', 'Ice cream', 'Candy', 'Cookie'], correctIndex: 1, level: 'basic' },
  { id: 'bq-91', prompt: 'What is "zapato" in English?', promptEs: '¿Qué es "zapato" en inglés?', options: ['Shirt', 'Pants', 'Shoe', 'Hat'], correctIndex: 2, level: 'basic' },
  { id: 'bq-92', prompt: 'Which animal can fly?', promptEs: '¿Qué animal puede volar?', options: ['Fish', 'Bird', 'Dog', 'Horse'], correctIndex: 1, level: 'basic' },
  { id: 'bq-93', prompt: 'What is "reloj" in English?', promptEs: '¿Qué es "reloj" en inglés?', options: ['Watch/Clock', 'Phone', 'Calendar', 'Timer'], correctIndex: 0, level: 'basic' },
  { id: 'bq-94', prompt: 'What is the opposite of "open"?', promptEs: '¿Cuál es lo opuesto de "open"?', options: ['Wide', 'Closed', 'Narrow', 'Shut'], correctIndex: 1, level: 'basic' },
  { id: 'bq-95', prompt: 'What is "pan" in English?', promptEs: '¿Qué es "pan" en inglés?', options: ['Rice', 'Bread', 'Pasta', 'Cereal'], correctIndex: 1, level: 'basic' },
  { id: 'bq-96', prompt: 'How do you say "¿Cómo estás?" in English?', promptEs: '¿Cómo se dice "¿Cómo estás?" en inglés?', options: ['How are you?', 'What is your name?', 'Where are you?', 'Who are you?'], correctIndex: 0, level: 'basic' },
  { id: 'bq-97', prompt: 'What is "camiseta" in English?', promptEs: '¿Qué es "camiseta" en inglés?', options: ['Jacket', 'T-shirt', 'Coat', 'Sweater'], correctIndex: 1, level: 'basic' },
  { id: 'bq-98', prompt: 'What is the English word for "bosque"?', promptEs: '¿Cuál es la palabra en inglés para "bosque"?', options: ['Desert', 'Forest', 'Beach', 'Field'], correctIndex: 1, level: 'basic' },
  { id: 'bq-99', prompt: 'Which number is fifty?', promptEs: '¿Qué número es cincuenta?', options: ['15', '40', '50', '60'], correctIndex: 2, level: 'basic' },
  { id: 'bq-100', prompt: 'What is "hijo" in English?', promptEs: '¿Qué es "hijo" en inglés?', options: ['Daughter', 'Son', 'Child', 'Baby'], correctIndex: 1, level: 'basic' },

  // ── INTERMEDIATE (100 questions) ───────────
  { id: 'bq-101', prompt: 'What is the past tense of "go"?', promptEs: '¿Cuál es el pasado de "go"?', options: ['Goed', 'Gone', 'Went', 'Going'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-102', prompt: 'Which word means "to arrive at a place"?', promptEs: '¿Qué palabra significa "llegar a un lugar"?', options: ['Leave', 'Reach', 'Depart', 'Exit'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-103', prompt: 'What is the comparative of "beautiful"?', promptEs: '¿Cuál es el comparativo de "beautiful"?', options: ['More beautiful', 'Beautifuller', 'Most beautiful', 'Beautifuler'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-104', prompt: 'Complete: "If it rains, I ___ take an umbrella."', promptEs: 'Completa: "Si llueve, yo ___ llevar una sombrilla."', options: ['will', 'would', 'had', 'was'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-105', prompt: 'What is "receta médica" in English?', promptEs: '¿Qué es "receta médica" en inglés?', options: ['Receipt', 'Prescription', 'Recipe', 'Invoice'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-106', prompt: 'Which word is an adverb?', promptEs: '¿Qué palabra es un adverbio?', options: ['Quick', 'Quickly', 'Quicker', 'Quickest'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-107', prompt: 'What does "to look forward to" mean?', promptEs: '¿Qué significa "to look forward to"?', options: ['To regret', 'To anticipate eagerly', 'To avoid', 'To forget'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-108', prompt: 'What is the past tense of "write"?', promptEs: '¿Cuál es el pasado de "write"?', options: ['Writed', 'Wrote', 'Written', 'Writing'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-109', prompt: 'Which preposition fits: "She arrived ___ the airport"?', promptEs: '¿Qué preposición cabe: "Ella llegó ___ el aeropuerto"?', options: ['in', 'on', 'at', 'to'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-110', prompt: 'What is "entrevista de trabajo" in English?', promptEs: '¿Qué es "entrevista de trabajo" en inglés?', options: ['Job interview', 'Work meeting', 'Business talk', 'Office chat'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-111', prompt: 'What is the superlative of "expensive"?', promptEs: '¿Cuál es el superlativo de "expensive"?', options: ['Expensivest', 'Most expensive', 'More expensive', 'Expensiver'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-112', prompt: 'Complete: "She has been studying ___ three hours."', promptEs: 'Completa: "Ella ha estado estudiando ___ tres horas."', options: ['since', 'for', 'during', 'while'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-113', prompt: 'What is "medio ambiente" in English?', promptEs: '¿Qué es "medio ambiente" en inglés?', options: ['Environment', 'Atmosphere', 'Climate', 'Weather'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-114', prompt: 'What is the past tense of "buy"?', promptEs: '¿Cuál es el pasado de "buy"?', options: ['Buyed', 'Bought', 'Buied', 'Buying'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-115', prompt: 'Which sentence is correct?', promptEs: '¿Cuál oración es correcta?', options: ['She don\'t like coffee', 'She doesn\'t likes coffee', 'She doesn\'t like coffee', 'She not like coffee'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-116', prompt: 'What does "to give up" mean?', promptEs: '¿Qué significa "to give up"?', options: ['To continue', 'To surrender', 'To start', 'To delay'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-117', prompt: 'What is "billete de avión" in English?', promptEs: '¿Qué es "billete de avión" en inglés?', options: ['Plane ticket', 'Boarding pass', 'Flight card', 'Air voucher'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-118', prompt: 'Which preposition fits: "The book is ___ the table"?', promptEs: '¿Qué preposición cabe: "El libro está ___ la mesa"?', options: ['in', 'at', 'on', 'by'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-119', prompt: 'What is the past participle of "eat"?', promptEs: '¿Cuál es el participio pasado de "eat"?', options: ['Eated', 'Ate', 'Eaten', 'Eating'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-120', prompt: 'Complete: "I wish I ___ speak French."', promptEs: 'Completa: "Ojalá yo ___ hablar francés."', options: ['can', 'could', 'would', 'should'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-121', prompt: 'What is "ecuación" in English?', promptEs: '¿Qué es "ecuación" en inglés?', options: ['Equation', 'Question', 'Solution', 'Problem'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-122', prompt: 'What does "to run out of" mean?', promptEs: '¿Qué significa "to run out of"?', options: ['To have plenty', 'To exhaust a supply', 'To create more', 'To organize'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-123', prompt: 'What is the comparative of "good"?', promptEs: '¿Cuál es el comparativo de "good"?', options: ['Gooder', 'More good', 'Better', 'Best'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-124', prompt: 'Which word means "a person who travels for work"?', promptEs: '¿Qué palabra significa "una persona que viaja por trabajo"?', options: ['Tourist', 'Commuter', 'Business traveler', 'Explorer'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-125', prompt: 'Complete: "He ___ to the store yesterday."', promptEs: 'Completa: "Él ___ a la tienda ayer."', options: ['goes', 'went', 'going', 'has gone'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-126', prompt: 'What is "contaminación" in English?', promptEs: '¿Qué es "contaminación" en inglés?', options: ['Pollution', 'Contamination', 'Infection', 'Dirtiness'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-127', prompt: 'What is the past tense of "teach"?', promptEs: '¿Cuál es el pasado de "teach"?', options: ['Teached', 'Taught', 'Teached', 'Teaching'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-128', prompt: 'Which preposition fits: "I was born ___ 1995"?', promptEs: '¿Qué preposición cabe: "Yo nací ___ 1995"?', options: ['on', 'at', 'in', 'by'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-129', prompt: 'What does "to figure out" mean?', promptEs: '¿Qué significa "to figure out"?', options: ['To be confused', 'To understand/solve', 'To ignore', 'To forget'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-130', prompt: 'What is "desarrollo sostenible" in English?', promptEs: '¿Qué es "desarrollo sostenible" en inglés?', options: ['Economic growth', 'Sustainable development', 'Green energy', 'Ecological balance'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-131', prompt: 'Complete: "She is ___ than her sister."', promptEs: 'Completa: "Ella es ___ que su hermana."', options: ['more tall', 'taller', 'tallest', 'most tall'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-132', prompt: 'What is the past tense of "think"?', promptEs: '¿Cuál es el pasado de "think"?', options: ['Thinked', 'Thought', 'Thinks', 'Thinking'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-133', prompt: 'What does "to turn down" mean?', promptEs: '¿Qué significa "to turn down"?', options: ['To accept', 'To reject', 'To increase', 'To rotate'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-134', prompt: 'What is "reciclaje" in English?', promptEs: '¿Qué es "reciclaje" en inglés?', options: ['Recycling', 'Reusing', 'Reducing', 'Rebuilding'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-135', prompt: 'Complete: "They have ___ here since morning."', promptEs: 'Completa: "Ellos han ___ aquí desde la mañana."', options: ['be', 'being', 'been', 'was'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-136', prompt: 'What is the opposite of "polite"?', promptEs: '¿Cuál es lo opuesto de "polite"?', options: ['Gentle', 'Rude', 'Kind', 'Nice'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-137', prompt: 'Which sentence uses the present perfect correctly?', promptEs: '¿Cuál oración usa el presente perfecto correctamente?', options: ['I have went to Paris', 'I have gone to Paris', 'I has gone to Paris', 'I have go to Paris'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-138', prompt: 'What is "enchufe" in English?', promptEs: '¿Qué es "enchufe" en inglés?', options: ['Plug', 'Switch', 'Wire', 'Battery'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-139', prompt: 'What does "to catch up" mean?', promptEs: '¿Qué significa "to catch up"?', options: ['To fall behind', 'To reach the same level', 'To slow down', 'To leave early'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-140', prompt: 'Complete: "If I ___ you, I would study harder."', promptEs: 'Completa: "Si yo ___ tú, estudiaría más duro."', options: ['am', 'was', 'were', 'be'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-141', prompt: 'What is "emergencia" in English?', promptEs: '¿Qué es "emergencia" en inglés?', options: ['Emergency', 'Urgency', 'Danger', 'Alert'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-142', prompt: 'What is the past tense of "catch"?', promptEs: '¿Cuál es el pasado de "catch"?', options: ['Catched', 'Caught', 'Catched', 'Catching'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-143', prompt: 'Which word means "relating to the mind"?', promptEs: '¿Qué palabra significa "relacionado con la mente"?', options: ['Physical', 'Mental', 'Emotional', 'Spiritual'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-144', prompt: 'What does "to call off" mean?', promptEs: '¿Qué significa "to call off"?', options: ['To shout', 'To cancel', 'To invite', 'To dial'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-145', prompt: 'What is "ahorro de energía" in English?', promptEs: '¿Qué es "ahorro de energía" en inglés?', options: ['Energy waste', 'Energy saving', 'Power cut', 'Energy boost'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-146', prompt: 'Complete: "She ___ already left when I arrived."', promptEs: 'Completa: "Ella ya ___ salido cuando yo llegué."', options: ['has', 'have', 'had', 'was'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-147', prompt: 'What is "consejo" in English?', promptEs: '¿Qué es "consejo" en inglés?', options: ['Advice', 'Advise', 'Council', 'Counsel'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-148', prompt: 'What is the past tense of "bring"?', promptEs: '¿Cuál es el pasado de "bring"?', options: ['Bringed', 'Brought', 'Brang', 'Bringed'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-149', prompt: 'Which preposition fits: "He depends ___ his parents"?', promptEs: '¿Qué preposición cabe: "Él depende ___ sus padres"?', options: ['of', 'on', 'at', 'from'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-150', prompt: 'What does "to put off" mean?', promptEs: '¿Qué significa "to put off"?', options: ['To wear', 'To postpone', 'To remove', 'To place'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-151', prompt: 'Complete: "This is the ___ movie I have ever seen."', promptEs: 'Completa: "Esta es la película ___ que he visto."', options: ['worse', 'worst', 'bad', 'more bad'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-152', prompt: 'What is "estacionamiento" in English?', promptEs: '¿Qué es "estacionamiento" en inglés?', options: ['Garage', 'Parking', 'Driveway', 'Highway'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-153', prompt: 'What is the past tense of "choose"?', promptEs: '¿Cuál es el pasado de "choose"?', options: ['Choosed', 'Chose', 'Chosen', 'Choosing'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-154', prompt: 'What does "to look after" mean?', promptEs: '¿Qué significa "to look after"?', options: ['To search', 'To take care of', 'To observe', 'To ignore'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-155', prompt: 'Complete: "She asked me where I ___."', promptEs: 'Completa: "Ella me preguntó dónde yo ___."', options: ['live', 'lived', 'living', 'lives'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-156', prompt: 'What is "servicio al cliente" in English?', promptEs: '¿Qué es "servicio al cliente" en inglés?', options: ['Customer service', 'Client help', 'User support', 'Shopper aid'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-157', prompt: 'What is the superlative of "bad"?', promptEs: '¿Cuál es el superlativo de "bad"?', options: ['Baddest', 'Worse', 'Worst', 'More bad'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-158', prompt: 'Which sentence uses "used to" correctly?', promptEs: '¿Cuál oración usa "used to" correctamente?', options: ['I use to play tennis', 'I used to play tennis', 'I used play tennis', 'I am used to play tennis'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-159', prompt: 'What does "to get along with" mean?', promptEs: '¿Qué significa "to get along with"?', options: ['To argue', 'To have a good relationship', 'To travel', 'To meet'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-160', prompt: 'What is "gobierno" in English?', promptEs: '¿Qué es "gobierno" en inglés?', options: ['Government', 'Governor', 'Governance', 'Gallery'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-161', prompt: 'Complete: "By the time we arrived, the movie ___."', promptEs: 'Completa: "Cuando llegamos, la película ___."', options: ['starts', 'started', 'had started', 'has started'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-162', prompt: 'What is the past tense of "fly"?', promptEs: '¿Cuál es el pasado de "fly"?', options: ['Flyed', 'Flied', 'Flew', 'Flown'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-163', prompt: 'What does "to come across" mean?', promptEs: '¿Qué significa "to come across"?', options: ['To cross the street', 'To find by chance', 'To disagree', 'To travel'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-164', prompt: 'Which word is a conjunction?', promptEs: '¿Qué palabra es una conjunción?', options: ['Quickly', 'Although', 'Beautiful', 'Running'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-165', prompt: 'What is "tecnología de la información" in English?', promptEs: '¿Qué es "tecnología de la información" en inglés?', options: ['Information technology', 'Computer science', 'Data systems', 'Digital media'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-166', prompt: 'Complete: "I have been living here ___ 2010."', promptEs: 'Completa: "He estado viviendo aquí ___ 2010."', options: ['for', 'since', 'from', 'during'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-167', prompt: 'What is the past tense of "swim"?', promptEs: '¿Cuál es el pasado de "swim"?', options: ['Swimmed', 'Swam', 'Swum', 'Swimming'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-168', prompt: 'What does "to break down" mean?', promptEs: '¿Qué significa "to break down"?', options: ['To repair', 'To stop working', 'To build', 'To improve'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-169', prompt: 'What is "factura" in English (business context)?', promptEs: '¿Qué es "factura" en inglés (contexto de negocios)?', options: ['Recipe', 'Invoice', 'Receipt', 'Bill'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-170', prompt: 'Complete: "She told me that she ___ the exam."', promptEs: 'Completa: "Ella me dijo que ella ___ el examen."', options: ['passes', 'pass', 'had passed', 'has passed'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-171', prompt: 'What is "experiencia laboral" in English?', promptEs: '¿Qué es "experiencia laboral" en inglés?', options: ['Work experience', 'Job interview', 'Career path', 'Professional skill'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-172', prompt: 'What is the comparative of "far"?', promptEs: '¿Cuál es el comparativo de "far"?', options: ['Farrer', 'Farther', 'More far', 'Farest'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-173', prompt: 'What does "to take over" mean?', promptEs: '¿Qué significa "to take over"?', options: ['To surrender', 'To assume control', 'To give away', 'To release'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-174', prompt: 'Which sentence uses reported speech correctly?', promptEs: '¿Cuál oración usa el estilo indirecto correctamente?', options: ['He said he is happy', 'He said he was happy', 'He said he happy', 'He said was happy'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-175', prompt: 'What is "combustible fósil" in English?', promptEs: '¿Qué es "combustible fósil" en inglés?', options: ['Fossil fuel', 'Natural gas', 'Organic matter', 'Fossil energy'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-176', prompt: 'Complete: "Neither John ___ Mary could attend."', promptEs: 'Completa: "Ni John ___ Mary pudieron asistir."', options: ['or', 'and', 'nor', 'but'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-177', prompt: 'What is the past tense of "break"?', promptEs: '¿Cuál es el pasado de "break"?', options: ['Breaked', 'Broke', 'Broken', 'Breaking'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-178', prompt: 'What does "to hang out" mean?', promptEs: '¿Qué significa "to hang out"?', options: ['To wait', 'To spend time socially', 'To exercise', 'To decorate'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-179', prompt: 'What is "derechos humanos" in English?', promptEs: '¿Qué es "derechos humanos" en inglés?', options: ['Human resources', 'Human rights', 'Legal rights', 'Civil laws'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-180', prompt: 'Complete: "I would have helped you if I ___ known."', promptEs: 'Completa: "Yo te habría ayudado si yo ___ sabido."', options: ['have', 'has', 'had', 'would'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-181', prompt: 'What is "efecto invernadero" in English?', promptEs: '¿Qué es "efecto invernadero" en inglés?', options: ['Greenhouse effect', 'Solar effect', 'Heating effect', 'Climate shift'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-182', prompt: 'What is the past participle of "see"?', promptEs: '¿Cuál es el participio pasado de "see"?', options: ['Saw', 'Seeded', 'Seen', 'Seeing'], correctIndex: 2, level: 'intermediate' },
  { id: 'bq-183', prompt: 'What does "to point out" mean?', promptEs: '¿Qué significa "to point out"?', options: ['To hide', 'To draw attention to', 'To ignore', 'To remove'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-184', prompt: 'Complete: "She is used ___ early."', promptEs: 'Completa: "Ella está acostumbrada ___ temprano."', options: ['to wake up', 'to waking up', 'wake up', 'waking up'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-185', prompt: 'What is "conocimiento" in English?', promptEs: '¿Qué es "conocimiento" en inglés?', options: ['Knowledge', 'Intelligence', 'Wisdom', 'Information'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-186', prompt: 'What is the past tense of "sleep"?', promptEs: '¿Cuál es el pasado de "sleep"?', options: ['Sleeped', 'Slept', 'Slept', 'Sleeping'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-187', prompt: 'What does "to carry on" mean?', promptEs: '¿Qué significa "to carry on"?', options: ['To stop', 'To continue', 'To transport', 'To return'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-188', prompt: 'Which word means "happening every two years"?', promptEs: '¿Qué palabra significa "que ocurre cada dos años"?', options: ['Annual', 'Biannual', 'Monthly', 'Weekly'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-189', prompt: 'What is "responsabilidad social" in English?', promptEs: '¿Qué es "responsabilidad social" en inglés?', options: ['Social media', 'Social responsibility', 'Community service', 'Public duty'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-190', prompt: 'Complete: "The cake was ___ by my grandmother."', promptEs: 'Completa: "El pastel fue ___ por mi abuela."', options: ['bake', 'baked', 'baking', 'bakes'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-191', prompt: 'What is "vida silvestre" in English?', promptEs: '¿Qué es "vida silvestre" en inglés?', options: ['Wildlife', 'Nature', 'Animals', 'Forest life'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-192', prompt: 'What does "to make up" mean (as in a story)?', promptEs: '¿Qué significa "to make up" (como en una historia)?', options: ['To improve', 'To invent', 'To reconcile', 'To apply makeup'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-193', prompt: 'Complete: "He suggested that she ___ a doctor."', promptEs: 'Completa: "Él sugirió que ella ___ un médico."', options: ['sees', 'see', 'saw', 'seeing'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-194', prompt: 'What is "energía renovable" in English?', promptEs: '¿Qué es "energía renovable" en inglés?', options: ['Nuclear energy', 'Renewable energy', 'Fossil energy', 'Electric energy'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-195', prompt: 'What is the past tense of "drive"?', promptEs: '¿Cuál es el pasado de "drive"?', options: ['Drived', 'Drove', 'Driven', 'Driving'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-196', prompt: 'What does "to stand for" mean?', promptEs: '¿Qué significa "to stand for"?', options: ['To sit down', 'To represent', 'To oppose', 'To tolerate'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-197', prompt: 'Complete: "Not only ___ intelligent, but she is also kind."', promptEs: 'Completa: "No solo ___ inteligente, sino que también es amable."', options: ['she is', 'is she', 'does she', 'she does'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-198', prompt: 'What is "igualdad de oportunidades" in English?', promptEs: '¿Qué es "igualdad de oportunidades" en inglés?', options: ['Equal opportunity', 'Fair chance', 'Equal rights', 'Job security'], correctIndex: 0, level: 'intermediate' },
  { id: 'bq-199', prompt: 'What is the past tense of "grow"?', promptEs: '¿Cuál es el pasado de "grow"?', options: ['Growed', 'Grew', 'Grown', 'Growing'], correctIndex: 1, level: 'intermediate' },
  { id: 'bq-200', prompt: 'What does "to set up" mean?', promptEs: '¿Qué significa "to set up"?', options: ['To tear down', 'To establish', 'To close', 'To reduce'], correctIndex: 1, level: 'intermediate' },

  // ── ADVANCED (100 questions) ───────────────
  { id: 'bq-201', prompt: 'What does the idiom "break the ice" mean?', promptEs: '¿Qué significa el modismo "break the ice"?', options: ['To cause damage', 'To initiate conversation', 'To create conflict', 'To cool down'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-202', prompt: 'Which sentence uses the passive voice correctly?', promptEs: '¿Cuál oración usa la voz pasiva correctamente?', options: ['The report was wrote by Jane', 'The report was written by Jane', 'The report is write by Jane', 'The report writing by Jane'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-203', prompt: 'What does "to bear in mind" mean?', promptEs: '¿Qué significa "to bear in mind"?', options: ['To forget', 'To remember/consider', 'To ignore', 'To imagine'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-204', prompt: 'Complete: "Had I known about the meeting, I ___ attended."', promptEs: 'Completa: "Si hubiera sabido sobre la reunión, yo ___ asistido."', options: ['will have', 'would have', 'should', 'must have'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-205', prompt: 'What is "rendimiento" in a business context?', promptEs: '¿Qué es "rendimiento" en un contexto de negocios?', options: ['Performance', 'Attendance', 'Schedule', 'Salary'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-206', prompt: 'What does the idiom "hit the nail on the head" mean?', promptEs: '¿Qué significa el modismo "hit the nail on the head"?', options: ['To be exactly right', 'To cause injury', 'To build something', 'To make a mistake'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-207', prompt: 'Which sentence uses reported speech correctly?', promptEs: '¿Cuál oración usa el estilo indirecto correctamente?', options: ['She said she will come tomorrow', 'She said she would come the next day', 'She said she comes tomorrow', 'She said she would come tomorrow'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-208', prompt: 'What does "to be on the fence" mean?', promptEs: '¿Qué significa "to be on the fence"?', options: ['To be certain', 'To be undecided', 'To be angry', 'To be seated'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-209', prompt: 'What is "rentabilidad" in English?', promptEs: '¿Qué es "rentabilidad" en inglés?', options: ['Profitability', 'Renting', 'Payment', 'Discount'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-210', prompt: 'Complete: "The committee ___ divided in their opinions."', promptEs: 'Completa: "El comité ___ dividido en sus opiniones."', options: ['is', 'are', 'were', 'have been'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-211', prompt: 'What does the idiom "a blessing in disguise" mean?', promptEs: '¿Qué significa el modismo "a blessing in disguise"?', options: ['A hidden curse', 'Something good from a bad situation', 'A religious event', 'A fake gift'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-212', prompt: 'Which phrasal verb means "to postpone"?', promptEs: '¿Qué phrasal verb significa "posponer"?', options: ['Put off', 'Put on', 'Put in', 'Put up'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-213', prompt: 'What is "cadena de suministro" in English?', promptEs: '¿Qué es "cadena de suministro" en inglés?', options: ['Supply chain', 'Production line', 'Distribution network', 'Delivery route'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-214', prompt: 'Complete: "Not until he arrived ___ the news."', promptEs: 'Completa: "No hasta que él llegó ___ la noticia."', options: ['we heard', 'did we hear', 'we did hear', 'heard we'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-215', prompt: 'What does "to pull someone\'s leg" mean?', promptEs: '¿Qué significa "to pull someone\'s leg"?', options: ['To injure someone', 'To joke with someone', 'To delay someone', 'To help someone walk'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-216', prompt: 'What is the formal register of "I want to talk to you"?', promptEs: '¿Cuál es el registro formal de "I want to talk to you"?', options: ['I gotta talk to ya', 'I would like to speak with you', 'I need a word', 'Let\'s chat'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-217', prompt: 'What is "deuda externa" in English?', promptEs: '¿Qué es "deuda externa" en inglés?', options: ['Foreign debt', 'Internal debt', 'National loan', 'External credit'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-218', prompt: 'Complete: "She insisted ___ paying for the meal."', promptEs: 'Completa: "Ella insistió ___ pagar la comida."', options: ['to', 'on', 'for', 'at'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-219', prompt: 'What does "to burn the midnight oil" mean?', promptEs: '¿Qué significa "to burn the midnight oil"?', options: ['To waste resources', 'To work late into the night', 'To start a fire', 'To be careless'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-220', prompt: 'Which sentence uses the subjunctive mood?', promptEs: '¿Cuál oración usa el modo subjuntivo?', options: ['I wish I was rich', 'I wish I were rich', 'I wish I am rich', 'I wish I will be rich'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-221', prompt: 'What is "inflación" in English?', promptEs: '¿Qué es "inflación" en inglés?', options: ['Inflation', 'Deflation', 'Recession', 'Depression'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-222', prompt: 'What does the idiom "the ball is in your court" mean?', promptEs: '¿Qué significa el modismo "the ball is in your court"?', options: ['You are playing tennis', 'It is your decision/responsibility', 'You have won', 'The game is over'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-223', prompt: 'Complete: "Scarcely had she arrived ___ the phone rang."', promptEs: 'Completa: "Apenas había llegado ___ el teléfono sonó."', options: ['when', 'than', 'that', 'after'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-224', prompt: 'What is "ventaja competitiva" in English?', promptEs: '¿Qué es "ventaja competitiva" en inglés?', options: ['Competitive advantage', 'Market share', 'Business edge', 'Profit margin'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-225', prompt: 'What does "to go the extra mile" mean?', promptEs: '¿Qué significa "to go the extra mile"?', options: ['To travel far', 'To make more effort than expected', 'To complain', 'To give up'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-226', prompt: 'Which word means "to make something less severe"?', promptEs: '¿Qué palabra significa "hacer algo menos severo"?', options: ['Exacerbate', 'Mitigate', 'Amplify', 'Complicate'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-227', prompt: 'What is "responsabilidad corporativa" in English?', promptEs: '¿Qué es "responsabilidad corporativa" en inglés?', options: ['Corporate responsibility', 'Company duty', 'Business ethics', 'Corporate law'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-228', prompt: 'Complete: "He ___ have finished by now; he started hours ago."', promptEs: 'Completa: "Él ___ haber terminado ya; empezó hace horas."', options: ['can\'t', 'must', 'shouldn\'t', 'might not'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-229', prompt: 'What does "to read between the lines" mean?', promptEs: '¿Qué significa "to read between the lines"?', options: ['To read carefully', 'To understand hidden meanings', 'To skip words', 'To read quickly'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-230', prompt: 'What is the past participle of "arise"?', promptEs: '¿Cuál es el participio pasado de "arise"?', options: ['Arised', 'Arose', 'Arisen', 'Arising'], correctIndex: 2, level: 'advanced' },
  { id: 'bq-231', prompt: 'What is "análisis de viabilidad" in English?', promptEs: '¿Qué es "análisis de viabilidad" en inglés?', options: ['Cost analysis', 'Feasibility study', 'Risk assessment', 'Market research'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-232', prompt: 'What does the idiom "to be on thin ice" mean?', promptEs: '¿Qué significa el modismo "to be on thin ice"?', options: ['To be in a risky situation', 'To be cold', 'To be athletic', 'To be careful with sports'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-233', prompt: 'Complete: "Were she ___ , she would understand."', promptEs: 'Completa: "Si ella ___ , entendería."', options: ['here', 'there', 'to come', 'arriving'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-234', prompt: 'What does "to bring to the table" mean?', promptEs: '¿Qué significa "to bring to the table"?', options: ['To serve food', 'To contribute something valuable', 'To have a meeting', 'To eat together'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-235', prompt: 'What is "fusión empresarial" in English?', promptEs: '¿Qué es "fusión empresarial" en inglés?', options: ['Business merger', 'Company split', 'Hostile takeover', 'Joint venture'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-236', prompt: 'Which sentence uses inversion correctly?', promptEs: '¿Cuál oración usa la inversión correctamente?', options: ['Never I have seen such beauty', 'Never have I seen such beauty', 'Have I never seen such beauty', 'Such beauty I have never seen'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-237', prompt: 'What does the idiom "to cut corners" mean?', promptEs: '¿Qué significa el modismo "to cut corners"?', options: ['To be efficient', 'To do something poorly to save time/money', 'To turn around', 'To make a shortcut in driving'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-238', prompt: 'What is "cultura corporativa" in English?', promptEs: '¿Qué es "cultura corporativa" en inglés?', options: ['Corporate culture', 'Company tradition', 'Office rules', 'Team spirit'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-239', prompt: 'Complete: "It\'s high time we ___ about the environment."', promptEs: 'Completa: "Ya es hora de que ___ sobre el medio ambiente."', options: ['do something', 'did something', 'doing something', 'have done something'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-240', prompt: 'What does "to get your act together" mean?', promptEs: '¿Qué significa "to get your act together"?', options: ['To perform on stage', 'To organize yourself effectively', 'To rehearse', 'To act professionally'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-241', prompt: 'What is "estados financieros" in English?', promptEs: '¿Qué es "estados financieros" en inglés?', options: ['Financial statements', 'Money reports', 'Bank records', 'Economic data'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-242', prompt: 'What does the idiom "to beat around the bush" mean?', promptEs: '¿Qué significa el modismo "to beat around the bush"?', options: ['To be direct', 'To avoid the main topic', 'To garden', 'To hit something'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-243', prompt: 'Complete: "So intense ___ that we couldn\'t look away."', promptEs: 'Completa: "Tan intenso ___ que no podíamos mirar hacia otro lado."', options: ['was it', 'it was', 'did it', 'it did'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-244', prompt: 'What does "to keep someone in the loop" mean?', promptEs: '¿Qué significa "to keep someone in the loop"?', options: ['To trap someone', 'To keep someone informed', 'To exclude someone', 'To circle around'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-245', prompt: 'What is "capital de riesgo" in English?', promptEs: '¿Qué es "capital de riesgo" en inglés?', options: ['Risk capital', 'Venture capital', 'Danger money', 'Loan guarantee'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-246', prompt: 'What does "to think outside the box" mean?', promptEs: '¿Qué significa "to think outside the box"?', options: ['To be confused', 'To think creatively/unconventionally', 'To leave a room', 'To be outdoors'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-247', prompt: 'Complete: "Little ___ know what was about to happen."', promptEs: 'Completa: "Poco ___ saber lo que estaba a punto de suceder."', options: ['did they', 'they did', 'do they', 'they do'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-248', prompt: 'What is "plan de contingencia" in English?', promptEs: '¿Qué es "plan de contingencia" en inglés?', options: ['Emergency plan', 'Contingency plan', 'Backup strategy', 'Crisis response'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-249', prompt: 'What does the idiom "to throw in the towel" mean?', promptEs: '¿Qué significa el modismo "to throw in the towel"?', options: ['To clean up', 'To give up/admit defeat', 'To start a fight', 'To do laundry'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-250', prompt: 'Which sentence demonstrates nominalization?', promptEs: '¿Cuál oración demuestra nominalización?', options: ['They decided quickly', 'They made a quick decision', 'They were deciding fast', 'They decide with speed'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-251', prompt: 'What is "producto interior bruto" in English?', promptEs: '¿Qué es "producto interior bruto" en inglés?', options: ['Gross domestic product', 'National income', 'Economic output', 'Market value'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-252', prompt: 'What does "to play it by ear" mean?', promptEs: '¿Qué significa "to play it by ear"?', options: ['To listen carefully', 'To improvise/decide as you go', 'To play music', 'To be deaf'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-253', prompt: 'Complete: "Only then ___ understand the truth."', promptEs: 'Completa: "Solo entonces ___ entender la verdad."', options: ['she did', 'did she', 'she does', 'does she'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-254', prompt: 'What does "to step up to the plate" mean?', promptEs: '¿Qué significa "to step up to the plate"?', options: ['To play baseball', 'To take responsibility', 'To eat a meal', 'To arrive late'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-255', prompt: 'What is "alianza estratégica" in English?', promptEs: '¿Qué es "alianza estratégica" en inglés?', options: ['Strategic alliance', 'Business friendship', 'Corporate bond', 'Mutual agreement'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-256', prompt: 'What does the idiom "to be a dime a dozen" mean?', promptEs: '¿Qué significa el modismo "to be a dime a dozen"?', options: ['To be very expensive', 'To be common/not special', 'To be rare', 'To cost ten cents'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-257', prompt: 'Complete: "Under no circumstances ___ reveal the password."', promptEs: 'Completa: "Bajo ninguna circunstancia ___ revelar la contraseña."', options: ['you should', 'should you', 'you must', 'must you to'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-258', prompt: 'What is "balance general" in English?', promptEs: '¿Qué es "balance general" en inglés?', options: ['Balance sheet', 'Income statement', 'Cash flow', 'Profit report'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-259', prompt: 'What does "to get to the bottom of" mean?', promptEs: '¿Qué significa "to get to the bottom of"?', options: ['To dig a hole', 'To find the real cause', 'To fall down', 'To be last'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-260', prompt: 'Which word means "to make something happen faster"?', promptEs: '¿Qué palabra significa "hacer que algo ocurra más rápido"?', options: ['Hinder', 'Expedite', 'Delay', 'Complicate'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-261', prompt: 'What is "paradigma" in English?', promptEs: '¿Qué es "paradigma" en inglés?', options: ['Paradigm', 'Paragraph', 'Paradox', 'Parallel'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-262', prompt: 'What does the idiom "to bite the bullet" mean?', promptEs: '¿Qué significa el modismo "to bite the bullet"?', options: ['To eat metal', 'To face something unpleasant bravely', 'To be reckless', 'To avoid a problem'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-263', prompt: 'Complete: "The more you practice, ___ you become."', promptEs: 'Completa: "Cuanto más practicas, ___ te vuelves."', options: ['the better', 'the best', 'better', 'best'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-264', prompt: 'What is "comercio internacional" in English?', promptEs: '¿Qué es "comercio internacional" en inglés?', options: ['International trade', 'Foreign exchange', 'Global market', 'World commerce'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-265', prompt: 'What does "to be at a crossroads" mean?', promptEs: '¿Qué significa "to be at a crossroads"?', options: ['To be lost', 'To face an important decision', 'To be at an intersection', 'To be confused'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-266', prompt: 'Which is an example of a mixed conditional?', promptEs: '¿Cuál es un ejemplo de un condicional mixto?', options: ['If I had studied, I would pass', 'If I study, I will pass', 'If I had studied, I would have passed', 'If I study, I pass'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-267', prompt: 'What is "diferencia competitiva" in English?', promptEs: '¿Qué es "diferencia competitiva" en inglés?', options: ['Competitive differentiation', 'Market gap', 'Price advantage', 'Quality control'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-268', prompt: 'What does "to let the cat out of the bag" mean?', promptEs: '¿Qué significa "to let the cat out of the bag"?', options: ['To free an animal', 'To reveal a secret', 'To cause chaos', 'To be surprised'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-269', prompt: 'Complete: "It is essential that every student ___ the exam."', promptEs: 'Completa: "Es esencial que cada estudiante ___ el examen."', options: ['passes', 'pass', 'passed', 'passing'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-270', prompt: 'What is "acuerdo de confidencialidad" in English?', promptEs: '¿Qué es "acuerdo de confidencialidad" en inglés?', options: ['Confidentiality agreement', 'Privacy policy', 'Non-disclosure agreement', 'Secrecy contract'], correctIndex: 2, level: 'advanced' },
  { id: 'bq-271', prompt: 'What does "to be in hot water" mean?', promptEs: '¿Qué significa "to be in hot water"?', options: ['To take a bath', 'To be in trouble', 'To be thirsty', 'To cook'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-272', prompt: 'What is "cuota de mercado" in English?', promptEs: '¿Qué es "cuota de mercado" en inglés?', options: ['Market share', 'Market price', 'Trade quota', 'Sales rate'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-273', prompt: 'Complete: "She objected ___ treated unfairly."', promptEs: 'Completa: "Ella se opuso ___ tratada injustamente."', options: ['to be', 'to being', 'being', 'on being'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-274', prompt: 'What does "to see eye to eye" mean?', promptEs: '¿Qué significa "to see eye to eye"?', options: ['To look at each other', 'To agree completely', 'To stare', 'To examine closely'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-275', prompt: 'What is "auditoría externa" in English?', promptEs: '¿Qué es "auditoría externa" en inglés?', options: ['External audit', 'Outside inspection', 'Financial review', 'Compliance check'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-276', prompt: 'What does the idiom "to miss the boat" mean?', promptEs: '¿Qué significa el modismo "to miss the boat"?', options: ['To be late for a trip', 'To miss an opportunity', 'To be seasick', 'To lose transportation'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-277', prompt: 'Complete: "Rarely ___ such a magnificent performance."', promptEs: 'Completa: "Rara vez ___ una actuación tan magnífica."', options: ['we have seen', 'have we seen', 'we saw', 'saw we'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-278', prompt: 'What is "ley antimonopolio" in English?', promptEs: '¿Qué es "ley antimonopolio" en inglés?', options: ['Anti-monopoly law', 'Competition law', 'Trade regulation', 'Market control act'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-279', prompt: 'What does "to take something with a grain of salt" mean?', promptEs: '¿Qué significa "to take something with a grain of salt"?', options: ['To eat something salty', 'To not take something too seriously', 'To add flavor', 'To be suspicious of food'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-280', prompt: 'Which sentence uses a cleft structure?', promptEs: '¿Cuál oración usa una estructura escindida?', options: ['I like pizza', 'It is pizza that I like', 'Pizza is my favorite', 'I enjoy eating pizza'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-281', prompt: 'What is "proceso de debida diligencia" in English?', promptEs: '¿Qué es "proceso de debida diligencia" en inglés?', options: ['Due diligence process', 'Careful investigation', 'Legal review', 'Background check'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-282', prompt: 'What does "to put all your eggs in one basket" mean?', promptEs: '¿Qué significa "to put all your eggs in one basket"?', options: ['To shop for groceries', 'To risk everything on one thing', 'To be organized', 'To carry many items'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-283', prompt: 'Complete: "He could hardly believe his eyes, ___?"', promptEs: 'Completa: "Apenas podía creer sus ojos, ___?"', options: ['could he', 'couldn\'t he', 'did he', 'didn\'t he'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-284', prompt: 'What is "inversión extranjera directa" in English?', promptEs: '¿Qué es "inversión extranjera directa" en inglés?', options: ['Direct foreign investment', 'Foreign direct investment', 'International funding', 'Overseas capital'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-285', prompt: 'What does "to be the tip of the iceberg" mean?', promptEs: '¿Qué significa "to be the tip of the iceberg"?', options: ['To be very cold', 'To be a small visible part of a larger problem', 'To be floating', 'To be sharp'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-286', prompt: 'Which word means "to officially confirm"?', promptEs: '¿Qué palabra significa "confirmar oficialmente"?', options: ['Ratify', 'Reject', 'Postpone', 'Debate'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-287', prompt: 'What is "depreciación acelerada" in English?', promptEs: '¿Qué es "depreciación acelerada" en inglés?', options: ['Fast depreciation', 'Accelerated depreciation', 'Quick value loss', 'Rapid decline'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-288', prompt: 'What does "to be on the same page" mean?', promptEs: '¿Qué significa "to be on the same page"?', options: ['To read together', 'To have a shared understanding', 'To write the same thing', 'To study together'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-289', prompt: 'Complete: "But for your help, I ___ finished the project."', promptEs: 'Completa: "Si no fuera por tu ayuda, yo ___ terminado el proyecto."', options: ['wouldn\'t have', 'won\'t have', 'don\'t have', 'can\'t have'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-290', prompt: 'What is "punto de equilibrio" in English?', promptEs: '¿Qué es "punto de equilibrio" en inglés?', options: ['Equilibrium point', 'Break-even point', 'Balance center', 'Stability mark'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-291', prompt: 'What does the idiom "to add insult to injury" mean?', promptEs: '¿Qué significa el modismo "to add insult to injury"?', options: ['To be rude to a patient', 'To make a bad situation worse', 'To apologize', 'To get revenge'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-292', prompt: 'Which sentence is an example of hedging?', promptEs: '¿Cuál oración es un ejemplo de hedging?', options: ['This is definitely wrong', 'This may possibly be incorrect', 'This is wrong', 'I know this is wrong'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-293', prompt: 'What is "costo de oportunidad" in English?', promptEs: '¿Qué es "costo de oportunidad" en inglés?', options: ['Opportunity cost', 'Lost profit', 'Missed chance', 'Alternative expense'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-294', prompt: 'What does "to keep your chin up" mean?', promptEs: '¿Qué significa "to keep your chin up"?', options: ['To exercise', 'To stay positive in difficulty', 'To look up', 'To be tall'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-295', prompt: 'Complete: "No sooner had she left ___ it started to rain."', promptEs: 'Completa: "Apenas había salido ___ empezó a llover."', options: ['when', 'than', 'that', 'before'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-296', prompt: 'What is "flujo de caja" in English?', promptEs: '¿Qué es "flujo de caja" en inglés?', options: ['Cash flow', 'Money stream', 'Payment flow', 'Revenue current'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-297', prompt: 'What does "to give someone the benefit of the doubt" mean?', promptEs: '¿Qué significa "to give someone the benefit of the doubt"?', options: ['To distrust someone', 'To believe someone despite uncertainty', 'To be doubtful', 'To benefit from doubt'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-298', prompt: 'What is "propiedad intelectual" in English?', promptEs: '¿Qué es "propiedad intelectual" en inglés?', options: ['Intellectual property', 'Mental ownership', 'Brain asset', 'Creative patent'], correctIndex: 0, level: 'advanced' },
  { id: 'bq-299', prompt: 'What does "to be a game changer" mean?', promptEs: '¿Qué significa "to be a game changer"?', options: ['To play a different sport', 'To significantly change a situation', 'To cheat in a game', 'To switch teams'], correctIndex: 1, level: 'advanced' },
  { id: 'bq-300', prompt: 'Complete: "Seldom ___ such dedication in a young employee."', promptEs: 'Completa: "Rara vez ___ tanta dedicación en un empleado joven."', options: ['we see', 'do we see', 'we saw', 'did we saw'], correctIndex: 1, level: 'advanced' },
];

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

      // ── Battle State ────────────────────────────
      battleQuestions: [],
      battleCurrentIndex: 0,
      battleScore: 0,
      battleTimeLeft: 10,
      battleIsActive: false,
      battleResults: [],
      battleOpponentScore: 0,
      battleOpponent: null,

      // ── Reading State ───────────────────────────
      readings: [],
      currentReading: null,
      showSpanishTranslation: false,
      unlockedSpanishReadings: [],
      unlockedAudioReadings: [],
      purchasedReadings: [],
      shopReadings: SHOP_READINGS_DATA,
      purchasedShopReadings: [],

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

      // Session Timer State
      sessionStartTime: 0,
      showMiniGame: false,
      miniGameType: '',
      miniGameCompleted: false,

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
            // Ensure energy/maxEnergy defaults
            userData.energy = userData.energy ?? 100;
            userData.maxEnergy = userData.maxEnergy ?? 200;

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

        // Play sound & lose life on wrong answer
        if (isCorrect) {
          get().playSound('correct');
        } else {
          get().playSound('wrong');
          get().loseLife();
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

      consumeEnergy: (amount) => {
        const { user } = get();
        if (!user) return;
        const newEnergy = Math.max(0, (user.energy || 100) - amount);
        const updatedUser = { ...user, energy: newEnergy };
        set({ user: updatedUser });
        syncUserToDb(user.id, { energy: newEnergy });
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

      // ────────────────────────────────────────────
      // BATTLE ACTIONS
      // ────────────────────────────────────────────
      startBattle: async () => {
        set({ isLoading: true });
        try {
          const { user } = get();

          // Validate battle cost: 100 coins + 20 energy
          if (!user) { set({ isLoading: false }); return; }
          if (user.coins < 100) {
            set({ isLoading: false });
            get().setNotification({ type: 'error', message: '¡Necesitas 100 monedas para entrar en batalla!' });
            return;
          }
          if ((user.energy || 0) < 20) {
            set({ isLoading: false });
            get().setNotification({ type: 'error', message: '¡Necesitas 20 de energía para entrar en batalla!' });
            return;
          }

          // Deduct battle cost
          get().addCoins(-100);
          get().consumeEnergy(20);

          const userLevel = user?.currentLevelId || 'basic';

          // Determine available question levels based on user level
          const availableLevels: string[] = ['basic'];
          if (userLevel === 'intermediate' || userLevel === 'advanced') {
            availableLevels.push('intermediate');
          }
          if (userLevel === 'advanced') {
            availableLevels.push('advanced');
          }

          // Filter battle questions by available levels
          const pool = BATTLE_QUESTIONS.filter(q => availableLevels.includes(q.level));

          // Shuffle and pick 5
          const shuffled = [...pool].sort(() => Math.random() - 0.5);
          const selectedQuestions = shuffled.slice(0, 5);

          // Create virtual opponent
          const opponents = [
            { name: 'María', avatar: '👩' },
            { name: 'Carlos', avatar: '👨' },
            { name: 'Sofía', avatar: '👧' },
            { name: 'Diego', avatar: '🧑' },
            { name: 'Ana', avatar: '👩‍🎓' },
            { name: 'Pedro', avatar: '👨‍💻' },
            { name: 'Lucía', avatar: '👩‍🏫' },
            { name: 'Javier', avatar: '🧑‍🎓' },
          ];
          const opponent = opponents[Math.floor(Math.random() * opponents.length)];
          const opponentScore = Math.floor(Math.random() * 4) + 1; // 1-4

          // Convert BattleQuestion to Question format for compatibility
          const battleQuestions = selectedQuestions.map(bq => ({
            id: bq.id,
            lessonId: 'battle',
            type: 'multiple_choice',
            prompt: bq.prompt,
            promptEs: bq.promptEs,
            hintEn: '',
            hintEs: '',
            audioText: bq.prompt,
            options: JSON.stringify(bq.options),
            correctAnswer: bq.options[bq.correctIndex],
            explanation: '',
            explanationEs: '',
            image: '',
            points: 10,
            order: 0,
          }));

          set({
            battleQuestions,
            battleCurrentIndex: 0,
            battleScore: 0,
            battleTimeLeft: 10,
            battleIsActive: true,
            battleResults: [],
            battleOpponentScore: opponentScore,
            battleOpponent: opponent,
            currentView: 'battle',
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to start battle:', error);
          set({ isLoading: false });
          get().setNotification({ type: 'error', message: 'Error al iniciar la batalla' });
        }
      },

      answerBattleQuestion: (answer) => {
        const { battleQuestions, battleCurrentIndex, battleResults, battleScore } = get();
        const currentQuestion = battleQuestions[battleCurrentIndex];
        if (!currentQuestion) return;

        const normalizeAnswer = (ans: string) => ans.trim().toLowerCase().replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim();
        const isCorrect = normalizeAnswer(answer) === normalizeAnswer(currentQuestion.correctAnswer);
        const timeTaken = (10 - get().battleTimeLeft) * 1000; // approximate time taken

        set({
          battleScore: isCorrect ? battleScore + 1 : battleScore,
          battleResults: [
            ...battleResults,
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

      nextBattleQuestion: () => {
        const { battleCurrentIndex, battleQuestions } = get();
        const nextIndex = battleCurrentIndex + 1;

        if (nextIndex >= battleQuestions.length) {
          // Battle complete - set index first so summary screen renders
          set({ battleCurrentIndex: nextIndex });
          get().endBattle();
        } else {
          set({
            battleCurrentIndex: nextIndex,
            battleTimeLeft: 10,
          });
        }
      },

      endBattle: () => {
        const { battleResults, battleScore, battleOpponentScore, user } = get();

        // Calculate rewards
        const correctCount = battleResults.filter((r) => r.isCorrect).length;
        const won = battleScore > battleOpponentScore;

        // XP: 15 per correct answer, bonus if won
        const baseXp = correctCount * 15;
        const winBonus = won ? 25 : 0;
        const totalXp = baseXp + winBonus;

        // Battle bet rewards:
        // Win: +200 coins (100 bet returned + 100 bonus) and +40 energy (20 bet returned + 20 bonus)
        // Lose: nothing returned (already lost the 100 coins and 20 energy at start)
        const totalCoins = won ? 200 : 0;
        const totalEnergy = won ? 40 : 0;

        set({ battleIsActive: false });

        if (user) {
          // Add rewards
          get().addXp(totalXp);
          if (totalCoins > 0) get().addCoins(totalCoins);
          if (totalEnergy > 0) {
            const newEnergy = Math.min((user.energy || 0) + totalEnergy, user.maxEnergy || 200);
            set({ user: { ...user, energy: newEnergy } });
            syncUserToDb(user.id, { energy: newEnergy });
          }

          // Show reward modal
          set({
            showRewardModal: true,
            rewardData: {
              type: 'battle_complete',
              title: won ? 'Victory!' : 'Battle Over!',
              message: won
                ? `¡Ganaste! ${correctCount}/${battleResults.length} correctas. +${totalXp} XP, +${totalCoins} monedas, +${totalEnergy} energía`
                : `Perdiste ${correctCount}/${battleResults.length} correctas. +${totalXp} XP`,
              xp: totalXp,
              coins: totalCoins,
            },
            showConfetti: won,
          });

          if (won) {
            get().playSound('reward');
          }
        }
      },

      resetBattle: () => {
        set({
          battleQuestions: [],
          battleCurrentIndex: 0,
          battleScore: 0,
          battleTimeLeft: 10,
          battleIsActive: false,
          battleResults: [],
          battleOpponentScore: 0,
          battleOpponent: null,
        });
      },

      // ────────────────────────────────────────────
      // READING ACTIONS
      // ────────────────────────────────────────────
      loadReadings: () => {
        set({ readings: READINGS_DATA });
      },

      selectReading: (readingId) => {
        if (!readingId) {
          set({ currentReading: null, showSpanishTranslation: false });
          return;
        }
        const { readings } = get();
        const reading = readings.find((r) => r.id === readingId) ?? null;
        set({
          currentReading: reading,
          showSpanishTranslation: false,
        });
      },

      unlockSpanishTranslation: (readingId) => {
        const { user, unlockedSpanishReadings } = get();
        if (!user) return;
        if (user.coins < 200) {
          get().setNotification({ type: 'error', message: 'Not enough coins! You need 200 coins.' });
          return;
        }
        if (unlockedSpanishReadings.includes(readingId)) return;

        // Deduct coins and unlock
        const updatedUser = { ...user, coins: user.coins - 200 };
        const updatedUnlocked = [...unlockedSpanishReadings, readingId];

        set({
          user: updatedUser,
          unlockedSpanishReadings: updatedUnlocked,
        });

        // Sync to DB
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('unlock');
        get().setNotification({ type: 'success', message: 'Spanish translation unlocked!' });
      },

      unlockAudioReading: (readingId) => {
        const { user, unlockedAudioReadings } = get();
        if (!user) return;
        if (user.coins < 250) {
          get().setNotification({ type: 'error', message: 'Not enough coins! You need 250 coins.' });
          return;
        }
        if (unlockedAudioReadings.includes(readingId)) return;

        // Deduct coins and unlock
        const updatedUser = { ...user, coins: user.coins - 250 };
        const updatedUnlocked = [...unlockedAudioReadings, readingId];

        set({
          user: updatedUser,
          unlockedAudioReadings: updatedUnlocked,
        });

        // Sync to DB
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('unlock');
        get().setNotification({ type: 'success', message: 'Audio reading unlocked!' });
      },

      answerReadingQuestion: (readingId, questionIndex, answerIndex) => {
        const { readings } = get();
        const reading = readings.find((r) => r.id === readingId);
        if (!reading) return false;

        const question = reading.questions[questionIndex];
        if (!question) return false;

        const isCorrect = question.correctAnswer === answerIndex;

        if (isCorrect) {
          get().playSound('correct');
          // Award XP for correct reading answer
          const xpPerQuestion = Math.floor(reading.xpReward / reading.questions.length);
          get().addXp(xpPerQuestion);
        } else {
          get().playSound('wrong');
        }

        return isCorrect;
      },

      setShowSpanishTranslation: (val) => set({ showSpanishTranslation: val }),

      buyReading: (readingId) => {
        const { user, purchasedReadings } = get();
        if (!user) return;
        if (purchasedReadings.includes(readingId)) return;
        if (user.coins < 500) {
          get().setNotification({ type: 'error', message: '¡Necesitas 500 monedas para comprar esta lectura!' });
          return;
        }
        const updatedUser = { ...user, coins: user.coins - 500 };
        const updatedPurchased = [...purchasedReadings, readingId];
        set({ user: updatedUser, purchasedReadings: updatedPurchased });
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('unlock');
        get().setNotification({ type: 'success', message: '¡Lectura comprada!' });
      },

      buyReadingPack: (level, _count) => {
        // Now buys ONE reading at a time (count param ignored for single purchase)
        const { user, purchasedReadings } = get();
        if (!user) return;
        // Price per single reading by level
        const pricePerLevel: Record<string, number> = {
          basic: 1000,
          intermediate: 1500,
          advanced: 2000,
        };
        const cost = pricePerLevel[level];
        if (!cost) return;
        if (user.coins < cost) {
          get().setNotification({ type: 'error', message: `¡Necesitas ${cost} monedas!` });
          return;
        }
        // Find first unpurchased reading of this level (excluding the free first one)
        const readings = get().readings;
        const available = readings.filter(r => r.level === level && !purchasedReadings.includes(r.id) && !isFirstInLevel(r.id, level));
        if (available.length === 0) {
          get().setNotification({ type: 'error', message: 'Ya tienes todas las lecturas de este nivel.' });
          return;
        }
        const toBuy = available[0]; // Just buy the first unpurchased one
        const updatedUser = { ...user, coins: user.coins - cost };
        const updatedPurchased = [...purchasedReadings, toBuy.id];
        set({ user: updatedUser, purchasedReadings: updatedPurchased });
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('reward');
        get().setNotification({ type: 'success', message: `¡Lectura "${toBuy.title}" comprada!` });
      },

      isReadingUnlocked: (readingId) => {
        const { purchasedReadings, readings } = get();
        // First reading of each level is free
        const reading = readings.find(r => r.id === readingId);
        if (!reading) return false;
        const levelReadings = readings.filter(r => r.level === reading.level);
        if (levelReadings[0]?.id === readingId) return true; // First is free
        return purchasedReadings.includes(readingId);
      },

      buyShopReading: (readingId) => {
        const { user, purchasedShopReadings, shopReadings } = get();
        if (!user) return;
        if (purchasedShopReadings.includes(readingId)) return;
        const reading = shopReadings.find(r => r.id === readingId);
        if (!reading) return;
        const cost = reading.level === 'basic' ? 800 : reading.level === 'intermediate' ? 1200 : 1500;
        if (user.coins < cost) {
          get().setNotification({ type: 'error', message: `¡Necesitas ${cost} monedas para comprar esta lectura!` });
          return;
        }
        const updatedUser = { ...user, coins: user.coins - cost };
        const updatedPurchased = [...purchasedShopReadings, readingId];
        set({ user: updatedUser, purchasedShopReadings: updatedPurchased });
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('unlock');
        get().setNotification({ type: 'success', message: `¡Lectura exclusiva "${reading.title}" desbloqueada!` });
      },

      isShopReadingUnlocked: (readingId) => {
        const { purchasedShopReadings } = get();
        return purchasedShopReadings.includes(readingId);
      },

      buyLives: (amount) => {
        const { user } = get();
        if (!user) return;
        const prices: Record<number, number> = { 5: 1000, 10: 1800, 15: 2500, 20: 3000 };
        const cost = prices[amount];
        if (!cost) return;
        if (user.coins < cost) {
          get().setNotification({ type: 'error', message: `¡Necesitas ${cost} monedas!` });
          return;
        }
        const updatedUser = { ...user, coins: user.coins - cost, lives: Math.min(user.lives + amount, 20) };
        set({ user: updatedUser });
        syncUserToDb(user.id, { coins: updatedUser.coins, lives: updatedUser.lives });
        get().playSound('reward');
        get().setNotification({ type: 'success', message: `¡${amount} vidas compradas!` });
      },

      buyEnergy: () => {
        const { user } = get();
        if (!user) return;
        if (user.coins < 500) {
          get().setNotification({ type: 'error', message: '¡Necesitas 500 monedas para energía!' });
          return;
        }
        const maxE = user.maxEnergy || 200;
        const updatedUser = { ...user, coins: user.coins - 500, energy: maxE, maxEnergy: maxE };
        set({ user: updatedUser });
        syncUserToDb(user.id, { coins: updatedUser.coins, energy: updatedUser.energy });
        get().playSound('reward');
        get().setNotification({ type: 'success', message: '¡Energía recargada! ⚡' });
      },

      buyCoinPack: (amount) => {
        // This is the "watch video" simulated purchase - just gives coins for free
        const { user } = get();
        if (!user) return;
        const updatedUser = { ...user, coins: user.coins + amount };
        set({ user: updatedUser });
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('reward');
        get().setNotification({ type: 'success', message: `¡${amount} monedas obtenidas!` });
      },

      startSessionTimer: () => {
        set({ sessionStartTime: Date.now(), showMiniGame: false, miniGameCompleted: false });
      },

      activateMiniGame: (gameType) => {
        const { user, sessionStartTime, miniGameCompleted } = get();
        // Admin can open anytime
        if (user?.role === 'admin') {
          set({ showMiniGame: true, miniGameType: gameType });
          return;
        }
        // Regular users: only when timer has completed and haven't used this round
        if (!sessionStartTime || miniGameCompleted) {
          get().setNotification({ type: 'error', message: '¡Debes esperar a que el reloj llegue a cero!' });
          return;
        }
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        if (elapsed < 15 * 60) {
          const remaining = Math.ceil((15 * 60 - elapsed) / 60);
          get().setNotification({ type: 'error', message: `¡Debes esperar ${remaining} minutos más!` });
          return;
        }
        set({ showMiniGame: true, miniGameType: gameType });
      },

      closeMiniGame: () => {
        set({ showMiniGame: false, miniGameType: '', miniGameCompleted: true });
        // Start a new 15-minute timer cycle so the user has to wait again
        set({ sessionStartTime: Date.now() });
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
      name: 'wisdomquest-preferences',
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
        unlockedSpanishReadings: state.unlockedSpanishReadings,
        unlockedAudioReadings: state.unlockedAudioReadings,
        purchasedReadings: state.purchasedReadings,
        purchasedShopReadings: state.purchasedShopReadings,
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
          unlockedSpanishReadings: persisted.unlockedSpanishReadings ?? currentState.unlockedSpanishReadings,
          unlockedAudioReadings: persisted.unlockedAudioReadings ?? currentState.unlockedAudioReadings,
          purchasedReadings: persisted.purchasedReadings ?? currentState.purchasedReadings,
          purchasedShopReadings: persisted.purchasedShopReadings ?? currentState.purchasedShopReadings,
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
