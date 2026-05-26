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
]

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
      battleTimeLeft: 30,
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
            battleTimeLeft: 30,
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
        const timeTaken = (30 - get().battleTimeLeft) * 1000; // approximate time taken

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
          // Battle complete
          get().endBattle();
        } else {
          set({
            battleCurrentIndex: nextIndex,
            battleTimeLeft: 30,
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

        // Coins: 8 per correct answer, bonus if won
        const baseCoins = correctCount * 8;
        const coinWinBonus = won ? 15 : 0;
        const totalCoins = baseCoins + coinWinBonus;

        set({ battleIsActive: false });

        if (user) {
          // Add rewards
          get().addXp(totalXp);
          get().addCoins(totalCoins);

          // Show reward modal
          set({
            showRewardModal: true,
            rewardData: {
              type: 'battle_complete',
              title: won ? 'Victory!' : 'Battle Over!',
              message: won
                ? `You won! ${correctCount}/${battleResults.length} correct. +${totalXp} XP, +${totalCoins} coins`
                : `You lost ${correctCount}/${battleResults.length} correct. +${totalXp} XP, +${totalCoins} coins`,
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
          battleTimeLeft: 30,
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
        set({ showMiniGame: false, miniGameType: '', miniGameCompleted: true, sessionStartTime: 0 });
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
