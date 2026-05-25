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

      // ── Reading State ───────────────────────────
      readings: [],
      currentReading: null,
      showSpanishTranslation: false,
      unlockedSpanishReadings: [],
      unlockedAudioReadings: [],
      purchasedReadings: [],

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

      // ────────────────────────────────────────────
      // BATTLE ACTIONS
      // ────────────────────────────────────────────
      startBattle: async () => {
        set({ isLoading: true });
        try {
          // Try to fetch random battle questions from API
          const res = await fetch(`${API_BASE}/battle/questions`);
          let battleQuestions: Question[] = [];

          if (res.ok) {
            const data = await res.json();
            battleQuestions = (data.questions ?? data).slice(0, 5);
          }

          // Fallback: use existing questions from the store if API fails or returns empty
          if (battleQuestions.length === 0) {
            const storeQuestions = get().questions;
            if (storeQuestions.length > 0) {
              // Shuffle and pick up to 5
              const shuffled = [...storeQuestions].sort(() => Math.random() - 0.5);
              battleQuestions = shuffled.slice(0, 5);
            }
          }

          // Generate a random opponent score for fun
          const opponentScore = Math.floor(Math.random() * 4) + 1; // 1-4

          set({
            battleQuestions,
            battleCurrentIndex: 0,
            battleScore: 0,
            battleTimeLeft: 30,
            battleIsActive: true,
            battleResults: [],
            battleOpponentScore: opponentScore,
            currentView: 'battle',
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to start battle:', error);
          // Fallback: try to use existing questions
          const storeQuestions = get().questions;
          if (storeQuestions.length > 0) {
            const shuffled = [...storeQuestions].sort(() => Math.random() - 0.5);
            const battleQuestions = shuffled.slice(0, 5);
            const opponentScore = Math.floor(Math.random() * 4) + 1;
            set({
              battleQuestions,
              battleCurrentIndex: 0,
              battleScore: 0,
              battleTimeLeft: 30,
              battleIsActive: true,
              battleResults: [],
              battleOpponentScore: opponentScore,
              currentView: 'battle',
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
            get().setNotification({ type: 'error', message: 'No questions available for battle. Complete some lessons first!' });
          }
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

      buyReadingPack: (level, count) => {
        const { user, purchasedReadings } = get();
        if (!user) return;
        // Pricing: basic: 1=1000, 3=2800, 5=4000; intermediate: 1=1500, 3=4000, 5=6500; advanced: 1=2000, 3=5000, 5=8000
        const prices: Record<string, Record<number, number>> = {
          basic: { 1: 1000, 3: 2800, 5: 4000 },
          intermediate: { 1: 1500, 3: 4000, 5: 6500 },
          advanced: { 1: 2000, 3: 5000, 5: 8000 },
        };
        const cost = prices[level]?.[count];
        if (!cost) return;
        if (user.coins < cost) {
          get().setNotification({ type: 'error', message: `¡Necesitas ${cost} monedas!` });
          return;
        }
        // Find unpurchased readings of this level
        const readings = get().readings;
        const available = readings.filter(r => r.level === level && !purchasedReadings.includes(r.id) && !isFirstInLevel(r.id, level));
        const toBuy = available.slice(0, count);
        if (toBuy.length === 0) {
          get().setNotification({ type: 'error', message: 'Ya tienes todas las lecturas de este nivel.' });
          return;
        }
        const updatedUser = { ...user, coins: user.coins - cost };
        const updatedPurchased = [...purchasedReadings, ...toBuy.map(r => r.id)];
        set({ user: updatedUser, purchasedReadings: updatedPurchased });
        syncUserToDb(user.id, { coins: updatedUser.coins });
        get().playSound('reward');
        get().setNotification({ type: 'success', message: `¡${toBuy.length} lecturas compradas!` });
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
        const updatedUser = { ...user, coins: user.coins - cost, lives: Math.min(user.lives + amount, user.maxLives) };
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
        // Energy gives +1 life as proxy (since there's no separate energy field)
        const updatedUser = { ...user, coins: user.coins - 500, lives: Math.min(user.lives + 1, user.maxLives) };
        set({ user: updatedUser });
        syncUserToDb(user.id, { coins: updatedUser.coins, lives: updatedUser.lives });
        get().playSound('reward');
        get().setNotification({ type: 'success', message: '¡Energía recargada!' });
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
