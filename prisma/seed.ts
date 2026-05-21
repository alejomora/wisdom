import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  console.log('🗑️  Cleaning existing data...');
  await db.userAnswer.deleteMany();
  await db.examResult.deleteMany();
  await db.userProgress.deleteMany();
  await db.userAchievement.deleteMany();
  await db.userMission.deleteMany();
  await db.ranking.deleteMany();
  await db.notification.deleteMany();
  await db.userReward.deleteMany();
  await db.question.deleteMany();
  await db.lesson.deleteMany();
  await db.exam.deleteMany();
  await db.scenario.deleteMany();
  await db.level.deleteMany();
  await db.achievement.deleteMany();
  await db.mission.deleteMany();
  await db.reward.deleteMany();
  await db.user.deleteMany();

  // ============================================
  // CREATE USERS
  // ============================================
  console.log('👤 Creating users...');
  const demoUser = await db.user.create({
    data: {
      email: 'demo@lingoquest.com',
      name: 'Player',
      avatar: '🎯',
      title: 'Word Explorer',
      password: 'demo123',
      role: 'user',
      xp: 250,
      coins: 300,
      totalStars: 12,
      level: 3,
      lives: 5,
      maxLives: 5,
      streak: 3,
      longestStreak: 7,
      lastActiveDate: new Date().toISOString().split('T')[0],
      wordsLearned: 45,
      exercisesDone: 23,
      accuracy: 0.78,
      listeningScore: 0.65,
      writingScore: 0.72,
      speakingScore: 0.55,
    },
  });

  const adminUser = await db.user.create({
    data: {
      email: 'admin@lingoquest.com',
      name: 'Admin',
      avatar: '🛡️',
      title: 'Platform Master',
      password: 'admin123',
      role: 'admin',
      xp: 5000,
      coins: 9999,
      totalStars: 75,
      level: 15,
    },
  });

  // ============================================
  // CREATE LEVELS
  // ============================================
  console.log('📊 Creating levels...');
  const basicLevel = await db.level.create({
    data: {
      slug: 'basic',
      name: 'Basic',
      nameEs: 'Básico',
      description: 'Start your English journey from zero',
      descriptionEs: 'Comienza tu viaje de inglés desde cero',
      icon: '🌱',
      color: '#22c55e',
      order: 1,
      minXp: 0,
    },
  });

  const intermediateLevel = await db.level.create({
    data: {
      slug: 'intermediate',
      name: 'Intermediate',
      nameEs: 'Intermedio',
      description: 'Build real-world conversation skills',
      descriptionEs: 'Desarrolla habilidades de conversación reales',
      icon: '🔥',
      color: '#f97316',
      order: 2,
      minXp: 1000,
    },
  });

  const advancedLevel = await db.level.create({
    data: {
      slug: 'advanced',
      name: 'Advanced',
      nameEs: 'Avanzado',
      description: 'Master professional and advanced English',
      descriptionEs: 'Domina el inglés profesional y avanzado',
      icon: '👑',
      color: '#a855f7',
      order: 3,
      minXp: 3000,
    },
  });

  // ============================================
  // CREATE SCENARIOS
  // ============================================
  console.log('🗺️  Creating scenarios...');

  const basicScenarios = [
    { slug: 'alphabet', name: 'Alphabet', nameEs: 'Alfabeto', icon: '🔤', difficulty: 1, xpReward: 30 },
    { slug: 'numbers', name: 'Numbers', nameEs: 'Números', icon: '🔢', difficulty: 1, xpReward: 30 },
    { slug: 'colors', name: 'Colors', nameEs: 'Colores', icon: '🎨', difficulty: 1, xpReward: 35 },
    { slug: 'greetings', name: 'Greetings', nameEs: 'Saludos', icon: '👋', difficulty: 1, xpReward: 40 },
    { slug: 'family', name: 'Family', nameEs: 'Familia', icon: '👨‍👩‍👧‍👦', difficulty: 1, xpReward: 40 },
    { slug: 'food', name: 'Food', nameEs: 'Comida', icon: '🍕', difficulty: 2, xpReward: 45 },
    { slug: 'animals', name: 'Animals', nameEs: 'Animales', icon: '🐾', difficulty: 2, xpReward: 45 },
    { slug: 'school', name: 'School', nameEs: 'Escuela', icon: '🏫', difficulty: 2, xpReward: 45 },
    { slug: 'house', name: 'House', nameEs: 'Casa', icon: '🏠', difficulty: 2, xpReward: 45 },
    { slug: 'clothes', name: 'Clothes', nameEs: 'Ropa', icon: '👕', difficulty: 2, xpReward: 50 },
    { slug: 'transportation', name: 'Transportation', nameEs: 'Transporte', icon: '🚌', difficulty: 3, xpReward: 50 },
    { slug: 'body-parts', name: 'Body Parts', nameEs: 'Partes del Cuerpo', icon: '🫀', difficulty: 3, xpReward: 50 },
    { slug: 'daily-routine', name: 'Daily Routine', nameEs: 'Rutina Diaria', icon: '⏰', difficulty: 3, xpReward: 55 },
    { slug: 'time', name: 'Time', nameEs: 'Hora', icon: '🕐', difficulty: 3, xpReward: 55 },
    { slug: 'weather', name: 'Weather', nameEs: 'Clima', icon: '🌤️', difficulty: 3, xpReward: 55 },
    { slug: 'shopping', name: 'Shopping', nameEs: 'Compras', icon: '🛍️', difficulty: 3, xpReward: 60 },
    { slug: 'restaurant', name: 'Restaurant', nameEs: 'Restaurante', icon: '🍽️', difficulty: 4, xpReward: 60 },
    { slug: 'work', name: 'Work', nameEs: 'Trabajo', icon: '💼', difficulty: 4, xpReward: 60 },
    { slug: 'travel', name: 'Travel', nameEs: 'Viaje', icon: '✈️', difficulty: 4, xpReward: 65 },
    { slug: 'directions', name: 'Directions', nameEs: 'Direcciones', icon: '🧭', difficulty: 4, xpReward: 65 },
    { slug: 'emotions', name: 'Emotions', nameEs: 'Emociones', icon: '😊', difficulty: 4, xpReward: 65 },
    { slug: 'hobbies', name: 'Hobbies', nameEs: 'Pasatiempos', icon: '🎸', difficulty: 5, xpReward: 70 },
    { slug: 'technology', name: 'Technology', nameEs: 'Tecnología', icon: '💻', difficulty: 5, xpReward: 70 },
    { slug: 'conversations', name: 'Conversations', nameEs: 'Conversaciones', icon: '💬', difficulty: 5, xpReward: 75 },
    { slug: 'real-life', name: 'Real Life Situations', nameEs: 'Situaciones Reales', icon: '🌍', difficulty: 5, xpReward: 80 },
  ];

  const intermediateScenarios = [
    { slug: 'small-talk', name: 'Small Talk', nameEs: 'Conversación Casual', icon: '🗣️', difficulty: 1, xpReward: 50 },
    { slug: 'at-the-office', name: 'At the Office', nameEs: 'En la Oficina', icon: '🏢', difficulty: 1, xpReward: 50 },
    { slug: 'phone-calls', name: 'Phone Calls', nameEs: 'Llamadas Telefónicas', icon: '📱', difficulty: 1, xpReward: 55 },
    { slug: 'making-plans', name: 'Making Plans', nameEs: 'Haciendo Planes', icon: '📅', difficulty: 2, xpReward: 55 },
    { slug: 'shopping-mall', name: 'Shopping Mall', nameEs: 'Centro Comercial', icon: '🏬', difficulty: 2, xpReward: 55 },
    { slug: 'hotel-checkin', name: 'Hotel Check-in', nameEs: 'Registro en Hotel', icon: '🏨', difficulty: 2, xpReward: 60 },
    { slug: 'doctor-visit', name: 'Doctor Visit', nameEs: 'Visita al Doctor', icon: '🏥', difficulty: 2, xpReward: 60 },
    { slug: 'bank-money', name: 'Bank & Money', nameEs: 'Banco y Dinero', icon: '🏦', difficulty: 3, xpReward: 60 },
    { slug: 'public-transport', name: 'Public Transport', nameEs: 'Transporte Público', icon: '🚇', difficulty: 3, xpReward: 65 },
    { slug: 'job-interview', name: 'Job Interview', nameEs: 'Entrevista de Trabajo', icon: '👔', difficulty: 3, xpReward: 65 },
    { slug: 'weather-chat', name: 'Weather Chat', nameEs: 'Hablar del Clima', icon: '⛅', difficulty: 3, xpReward: 65 },
    { slug: 'cooking-recipes', name: 'Cooking & Recipes', nameEs: 'Cocina y Recetas', icon: '👨‍🍳', difficulty: 3, xpReward: 70 },
    { slug: 'sports-fitness', name: 'Sports & Fitness', nameEs: 'Deportes y Fitness', icon: '⚽', difficulty: 4, xpReward: 70 },
    { slug: 'music-movies', name: 'Music & Movies', nameEs: 'Música y Películas', icon: '🎬', difficulty: 4, xpReward: 70 },
    { slug: 'news-media', name: 'News & Media', nameEs: 'Noticias y Medios', icon: '📰', difficulty: 4, xpReward: 75 },
    { slug: 'family-life', name: 'Family Life', nameEs: 'Vida Familiar', icon: '👶', difficulty: 4, xpReward: 75 },
    { slug: 'pet-care', name: 'Pet Care', nameEs: 'Cuidado de Mascotas', icon: '🐕', difficulty: 4, xpReward: 75 },
    { slug: 'home-repairs', name: 'Home Repairs', nameEs: 'Reparaciones del Hogar', icon: '🔧', difficulty: 5, xpReward: 80 },
    { slug: 'gardening', name: 'Gardening', nameEs: 'Jardinería', icon: '🌻', difficulty: 5, xpReward: 80 },
    { slug: 'car-problems', name: 'Car Problems', nameEs: 'Problemas con el Auto', icon: '🚗', difficulty: 5, xpReward: 80 },
    { slug: 'neighborhood', name: 'Neighborhood', nameEs: 'Vecindario', icon: '🏘️', difficulty: 5, xpReward: 85 },
    { slug: 'celebrations', name: 'Celebrations', nameEs: 'Celebraciones', icon: '🎉', difficulty: 5, xpReward: 85 },
    { slug: 'social-media', name: 'Social Media', nameEs: 'Redes Sociales', icon: '📲', difficulty: 5, xpReward: 85 },
    { slug: 'volunteer-work', name: 'Volunteer Work', nameEs: 'Trabajo Voluntario', icon: '🤝', difficulty: 5, xpReward: 90 },
    { slug: 'cultural-events', name: 'Cultural Events', nameEs: 'Eventos Culturales', icon: '🎭', difficulty: 5, xpReward: 90 },
  ];

  const advancedScenarios = [
    { slug: 'business-negotiations', name: 'Business Negotiations', nameEs: 'Negociaciones de Negocios', icon: '🤝', difficulty: 1, xpReward: 80 },
    { slug: 'academic-writing', name: 'Academic Writing', nameEs: 'Escritura Académica', icon: '📝', difficulty: 1, xpReward: 80 },
    { slug: 'legal-english', name: 'Legal English', nameEs: 'Inglés Legal', icon: '⚖️', difficulty: 2, xpReward: 85 },
    { slug: 'medical-english', name: 'Medical English', nameEs: 'Inglés Médico', icon: '🩺', difficulty: 2, xpReward: 85 },
    { slug: 'engineering-talk', name: 'Engineering Talk', nameEs: 'Conversación de Ingeniería', icon: '⚙️', difficulty: 2, xpReward: 85 },
    { slug: 'financial-reports', name: 'Financial Reports', nameEs: 'Reportes Financieros', icon: '📊', difficulty: 3, xpReward: 90 },
    { slug: 'marketing-strategy', name: 'Marketing Strategy', nameEs: 'Estrategia de Marketing', icon: '📈', difficulty: 3, xpReward: 90 },
    { slug: 'environmental-science', name: 'Environmental Science', nameEs: 'Ciencia Ambiental', icon: '🌍', difficulty: 3, xpReward: 90 },
    { slug: 'political-debate', name: 'Political Debate', nameEs: 'Debate Político', icon: '🏛️', difficulty: 4, xpReward: 95 },
    { slug: 'philosophical-discussion', name: 'Philosophical Discussion', nameEs: 'Discusión Filosófica', icon: '🤔', difficulty: 4, xpReward: 95 },
    { slug: 'tech-startup', name: 'Tech Startup', nameEs: 'Startup Tecnológica', icon: '🚀', difficulty: 4, xpReward: 95 },
    { slug: 'research-methods', name: 'Research Methods', nameEs: 'Métodos de Investigación', icon: '🔬', difficulty: 4, xpReward: 100 },
    { slug: 'public-speaking', name: 'Public Speaking', nameEs: 'Oratoria', icon: '🎤', difficulty: 5, xpReward: 100 },
    { slug: 'creative-writing', name: 'Creative Writing', nameEs: 'Escritura Creativa', icon: '✍️', difficulty: 5, xpReward: 100 },
    { slug: 'journalism', name: 'Journalism', nameEs: 'Periodismo', icon: '📰', difficulty: 5, xpReward: 100 },
    { slug: 'international-relations', name: 'International Relations', nameEs: 'Relaciones Internacionales', icon: '🌐', difficulty: 5, xpReward: 100 },
    { slug: 'project-management', name: 'Project Management', nameEs: 'Gestión de Proyectos', icon: '📋', difficulty: 5, xpReward: 100 },
    { slug: 'crisis-management', name: 'Crisis Management', nameEs: 'Gestión de Crisis', icon: '🚨', difficulty: 5, xpReward: 100 },
    { slug: 'art-critique', name: 'Art Critique', nameEs: 'Crítica de Arte', icon: '🎨', difficulty: 5, xpReward: 100 },
    { slug: 'scientific-presentation', name: 'Scientific Presentation', nameEs: 'Presentación Científica', icon: '🧪', difficulty: 5, xpReward: 100 },
    { slug: 'investment-banking', name: 'Investment Banking', nameEs: 'Banca de Inversión', icon: '💰', difficulty: 5, xpReward: 100 },
    { slug: 'diplomatic-english', name: 'Diplomatic English', nameEs: 'Inglés Diplomático', icon: '🕊️', difficulty: 5, xpReward: 100 },
    { slug: 'advanced-idioms', name: 'Advanced Idioms', nameEs: 'Idioms Avanzados', icon: '🧠', difficulty: 5, xpReward: 100 },
    { slug: 'phrasal-verbs-master', name: 'Phrasal Verbs Master', nameEs: 'Master de Phrasal Verbs', icon: '💪', difficulty: 5, xpReward: 100 },
    { slug: 'slang-colloquial', name: 'Slang & Colloquialisms', nameEs: 'Jerga y Coloquialismos', icon: '😎', difficulty: 5, xpReward: 100 },
  ];

  // Create scenarios for basic level
  for (let i = 0; i < basicScenarios.length; i++) {
    const s = basicScenarios[i];
    await db.scenario.create({
      data: {
        levelId: basicLevel.id,
        slug: s.slug,
        name: s.name,
        nameEs: s.nameEs,
        description: `Learn about ${s.name.toLowerCase()} in English`,
        descriptionEs: `Aprende sobre ${s.nameEs.toLowerCase()} en inglés`,
        icon: s.icon,
        difficulty: s.difficulty,
        xpReward: s.xpReward,
        order: i + 1,
        isStarter: i === 0,
      },
    });
  }

  for (let i = 0; i < intermediateScenarios.length; i++) {
    const s = intermediateScenarios[i];
    await db.scenario.create({
      data: {
        levelId: intermediateLevel.id,
        slug: s.slug,
        name: s.name,
        nameEs: s.nameEs,
        description: `Practice ${s.name.toLowerCase()} in English`,
        descriptionEs: `Practica ${s.nameEs.toLowerCase()} en inglés`,
        icon: s.icon,
        difficulty: s.difficulty,
        xpReward: s.xpReward,
        order: i + 1,
        isStarter: i === 0,
      },
    });
  }

  for (let i = 0; i < advancedScenarios.length; i++) {
    const s = advancedScenarios[i];
    await db.scenario.create({
      data: {
        levelId: advancedLevel.id,
        slug: s.slug,
        name: s.name,
        nameEs: s.nameEs,
        description: `Master ${s.name.toLowerCase()} in professional English`,
        descriptionEs: `Domina ${s.nameEs.toLowerCase()} en inglés profesional`,
        icon: s.icon,
        difficulty: s.difficulty,
        xpReward: s.xpReward,
        order: i + 1,
        isStarter: i === 0,
      },
    });
  }

  // ============================================
  // CREATE LESSONS & QUESTIONS
  // ============================================
  console.log('📚 Creating lessons and questions...');

  const allScenarios = await db.scenario.findMany({ include: { level: true } });

  // Question templates per scenario type
  const questionTemplates: Record<string, Array<{
    type: string;
    lessonTitle: string;
    lessonTitleEs: string;
    lessonType: string;
    questions: Array<{
      type: string;
      prompt: string;
      promptEs: string;
      hintEn: string;
      hintEs: string;
      audioText: string;
      options: string;
      correctAnswer: string;
      explanation: string;
      explanationEs: string;
      points: number;
    }>;
  }>> = {
    'alphabet': [{
      lessonTitle: 'The ABCs', lessonTitleEs: 'El ABC', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What is the first letter of the English alphabet?', promptEs: '¿Cuál es la primera letra del alfabeto inglés?', hintEn: 'Think about the ABC song', hintEs: 'Piensa en la canción del ABC', audioText: 'What is the first letter of the English alphabet?', options: '["A","B","C","D"]', correctAnswer: 'A', explanation: 'A is the first letter of the English alphabet', explanationEs: 'A es la primera letra del alfabeto inglés', points: 10 },
        { type: 'fill_blank', prompt: 'The letter that comes after B is ___', promptEs: 'La letra que viene después de B es ___', hintEn: 'Count: A, B, ...', hintEs: 'Cuenta: A, B, ...', audioText: 'The letter that comes after B is', options: '[]', correctAnswer: 'C', explanation: 'C comes after B in the alphabet', explanationEs: 'C viene después de B en el alfabeto', points: 10 },
        { type: 'order_words', prompt: 'Put these letters in alphabetical order: D, B, A, C', promptEs: 'Pon estas letras en orden alfabético: D, B, A, C', hintEn: 'Start from the beginning of the alphabet', hintEs: 'Empieza desde el principio del alfabeto', audioText: 'Put these letters in alphabetical order', options: '["D","B","A","C"]', correctAnswer: 'A B C D', explanation: 'The correct alphabetical order is A B C D', explanationEs: 'El orden alfabético correcto es A B C D', points: 15 },
        { type: 'multiple_choice', prompt: 'How many letters are in the English alphabet?', promptEs: '¿Cuántas letras hay en el alfabeto inglés?', hintEn: 'Count from A to Z', hintEs: 'Cuenta de la A a la Z', audioText: 'How many letters are in the English alphabet?', options: '["24","26","28","22"]', correctAnswer: '26', explanation: 'The English alphabet has 26 letters', explanationEs: 'El alfabeto inglés tiene 26 letras', points: 10 },
        { type: 'translate', prompt: 'Translate to English: la letra Z', promptEs: 'Traduce al inglés: la letra Z', hintEn: 'It is the last letter of the alphabet', hintEs: 'Es la última letra del alfabeto', audioText: 'Translate to English: the letter Z', options: '[]', correctAnswer: 'Z', explanation: 'Z is the last letter of the English alphabet', explanationEs: 'Z es la última letra del alfabeto inglés', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the letter you hear', promptEs: 'Escucha y escribe la letra que oyes', hintEn: 'It comes after M in the alphabet', hintEs: 'Viene después de M en el alfabeto', audioText: 'N', options: '[]', correctAnswer: 'N', explanation: 'The letter N is the 14th letter of the alphabet', explanationEs: 'La letra N es la decimocuarta letra del alfabeto', points: 15 },
        { type: 'flashcard', prompt: 'B - Ball / B - Pelota', promptEs: 'B - Pelota / B - Ball', hintEn: 'B is for Ball, a round toy you can throw', hintEs: 'B es para Ball (pelota), un juguete redondo que puedes lanzar', audioText: 'B, Ball', options: '[]', correctAnswer: 'B', explanation: 'B is the second letter of the alphabet. Think of "Ball"', explanationEs: 'B es la segunda letra del alfabeto. Piensa en "Ball"', points: 5 },
        { type: 'pronunciation', prompt: 'Practice saying: A B C D E', promptEs: 'Practica diciendo: A B C D E', hintEn: 'Say each letter clearly and slowly', hintEs: 'Di cada letra clara y lentamente', audioText: 'A B C D E', options: '[]', correctAnswer: 'A B C D E', explanation: 'These are the first five letters of the English alphabet', explanationEs: 'Estas son las primeras cinco letras del alfabeto inglés', points: 10 },
        { type: 'find_error', prompt: 'Find the mistake: A B C D F E G', promptEs: 'Encuentra el error: A B C D F E G', hintEn: 'Check the order of the last three letters', hintEs: 'Revisa el orden de las últimas tres letras', audioText: 'A B C D F E G', options: '[]', correctAnswer: 'A B C D E F G', explanation: 'E comes before F in the alphabet, so the correct order is A B C D E F G', explanationEs: 'E viene antes de F en el alfabeto, el orden correcto es A B C D E F G', points: 15 },
        { type: 'match_concepts', prompt: 'Match each letter with a word that starts with it', promptEs: 'Relaciona cada letra con una palabra que empiece con ella', hintEn: 'A=Apple, C=Cat, D=Dog', hintEs: 'A=Apple, C=Cat, D=Dog', audioText: 'Match each letter with a word', options: '["A-Apple","C-Cat","D-Dog"]', correctAnswer: 'Apple Cat Dog', explanation: 'Apple starts with A, Cat starts with C, Dog starts with D', explanationEs: 'Apple empieza con A, Cat empieza con C, Dog empieza con D', points: 15 },
      ]
    }, {
      lessonTitle: 'Vowel Sounds', lessonTitleEs: 'Sonidos Vocálicos', lessonType: 'pronunciation',
      questions: [
        { type: 'multiple_choice', prompt: 'Which of these is a vowel?', promptEs: '¿Cuál de estas es una vocal?', hintEn: 'Vowels are A, E, I, O, U', hintEs: 'Las vocales son A, E, I, O, U', audioText: 'Which of these is a vowel?', options: '["B","E","K","T"]', correctAnswer: 'E', explanation: 'E is one of the five vowels: A, E, I, O, U', explanationEs: 'E es una de las cinco vocales: A, E, I, O, U', points: 10 },
        { type: 'flashcard', prompt: 'A - Apple', promptEs: 'A - Manzana', hintEn: 'A is for Apple', hintEs: 'A es para Manzana (Apple)', audioText: 'A, Apple', options: '[]', correctAnswer: 'A', explanation: 'A is the first vowel sound. Think of "Apple"', explanationEs: 'A es el primer sonido vocal. Piensa en "Apple"', points: 5 },
        { type: 'multiple_choice', prompt: 'How many vowels are in the English alphabet?', promptEs: '¿Cuántas vocales hay en el alfabeto inglés?', hintEn: 'A, E, I, O, U', hintEs: 'A, E, I, O, U', audioText: 'How many vowels are in the English alphabet?', options: '["4","5","6","3"]', correctAnswer: '5', explanation: 'There are 5 vowels: A, E, I, O, U', explanationEs: 'Hay 5 vocales: A, E, I, O, U', points: 10 },
        { type: 'fill_blank', prompt: 'The five vowels are: A, E, I, O, ___', promptEs: 'Las cinco vocales son: A, E, I, O, ___', hintEn: 'It is the last vowel', hintEs: 'Es la última vocal', audioText: 'The five vowels are A E I O U', options: '[]', correctAnswer: 'U', explanation: 'U is the fifth and last vowel in the English alphabet', explanationEs: 'U es la quinta y última vocal en el alfabeto inglés', points: 10 },
        { type: 'order_words', prompt: 'Put the vowels in the correct alphabetical order: U, A, I, E, O', promptEs: 'Pon las vocales en orden alfabético correcto: U, A, I, E, O', hintEn: 'Think of the ABC order', hintEs: 'Piensa en el orden del ABC', audioText: 'Put the vowels in alphabetical order', options: '["U","A","I","E","O"]', correctAnswer: 'A E I O U', explanation: 'The vowels in alphabetical order are A E I O U', explanationEs: 'Las vocales en orden alfabético son A E I O U', points: 15 },
        { type: 'pronunciation', prompt: 'Practice saying the vowels: A E I O U', promptEs: 'Practica diciendo las vocales: A E I O U', hintEn: 'Say each vowel slowly and clearly', hintEs: 'Di cada vocal lenta y claramente', audioText: 'A E I O U', options: '[]', correctAnswer: 'A E I O U', explanation: 'These are the five vowel sounds in English', explanationEs: 'Estos son los cinco sonidos vocálicos en inglés', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the vowel you hear', promptEs: 'Escucha y escribe la vocal que oyes', hintEn: 'This vowel sounds like "ee"', hintEs: 'Esta vocal suena como "i" en español', audioText: 'I', options: '[]', correctAnswer: 'I', explanation: 'I is the third vowel and sounds like "ai" in English', explanationEs: 'I es la tercera vocal y suena como "ai" en inglés', points: 15 },
        { type: 'translate', prompt: 'Translate to English: vocal', promptEs: 'Traduce al inglés: vocal', hintEn: 'Think of the word for a letter that is not a consonant', hintEs: 'Piensa en la palabra para una letra que no es consonante', audioText: 'Translate to English: vocal', options: '[]', correctAnswer: 'vowel', explanation: 'vocal = vowel. The five vowels in English are A, E, I, O, U', explanationEs: 'vocal = vowel. Las cinco vocales en inglés son A, E, I, O, U', points: 10 },
        { type: 'find_error', prompt: 'Find the mistake: The vowels are A, E, I, O, Y', promptEs: 'Encuentra el error: Las vocales son A, E, I, O, Y', hintEn: 'Y is sometimes a vowel, but the standard five are different', hintEs: 'Y a veces es vocal, pero las cinco estándar son diferentes', audioText: 'The vowels are A E I O Y', options: '[]', correctAnswer: 'The vowels are A E I O U', explanation: 'The five standard vowels are A, E, I, O, U (not Y)', explanationEs: 'Las cinco vocales estándar son A, E, I, O, U (no Y)', points: 15 },
        { type: 'multiple_choice', prompt: 'Which letter is a consonant?', promptEs: '¿Qué letra es una consonante?', hintEn: 'Consonants are all letters that are NOT vowels', hintEs: 'Las consonantes son todas las letras que NO son vocales', audioText: 'Which letter is a consonant?', options: '["A","M","O","I"]', correctAnswer: 'M', explanation: 'M is a consonant. A, O, and I are vowels', explanationEs: 'M es una consonante. A, O e I son vocales', points: 10 },
      ]
    }],
    'numbers': [{
      lessonTitle: 'Counting 1-10', lessonTitleEs: 'Contando 1-10', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What number comes after 5?', promptEs: '¿Qué número viene después de 5?', hintEn: 'Count on your fingers', hintEs: 'Cuenta con tus dedos', audioText: 'What number comes after five?', options: '["4","6","7","3"]', correctAnswer: '6', explanation: '6 comes after 5', explanationEs: '6 viene después de 5', points: 10 },
        { type: 'fill_blank', prompt: 'The number 8 in English is ___', promptEs: 'El número 8 en inglés es ___', hintEn: 'It sounds like "eight"', hintEs: 'Suena como "eight"', audioText: 'The number eight in English is', options: '[]', correctAnswer: 'eight', explanation: '8 = eight', explanationEs: '8 = eight', points: 10 },
        { type: 'translate', prompt: 'Translate to English: tres', promptEs: 'Traduce al inglés: tres', hintEn: 'It rhymes with "free"', hintEs: 'Rima con "free"', audioText: 'Translate to English: tres', options: '[]', correctAnswer: 'three', explanation: 'tres = three', explanationEs: 'tres = three', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the number you hear', promptEs: 'Escucha y escribe el número que oyes', hintEn: 'Think of the number 7', hintEs: 'Piensa en el número 7', audioText: 'seven', options: '[]', correctAnswer: 'seven', explanation: 'The number is seven (7)', explanationEs: 'El número es seven (7)', points: 15 },
        { type: 'order_words', prompt: 'Put these numbers in order from smallest to largest: nine, three, one, six', promptEs: 'Pon estos números en orden de menor a mayor: nine, three, one, six', hintEn: 'Start with the smallest number', hintEs: 'Empieza con el número más pequeño', audioText: 'Put these numbers in order from smallest to largest', options: '["nine","three","one","six"]', correctAnswer: 'one three six nine', explanation: '1 (one), 3 (three), 6 (six), 9 (nine) is the correct order', explanationEs: '1 (one), 3 (three), 6 (six), 9 (nine) es el orden correcto', points: 15 },
        { type: 'flashcard', prompt: '5 - five ✋', promptEs: '5 - five ✋', hintEn: 'Five is the number of fingers on one hand', hintEs: 'Five es el número de dedos en una mano', audioText: 'five', options: '[]', correctAnswer: 'five', explanation: '5 = five. Think of five fingers on one hand', explanationEs: '5 = five. Piensa en cinco dedos de una mano', points: 5 },
        { type: 'pronunciation', prompt: 'Practice saying: one two three four five', promptEs: 'Practica diciendo: one two three four five', hintEn: 'Say each number clearly', hintEs: 'Di cada número claramente', audioText: 'one two three four five', options: '[]', correctAnswer: 'one two three four five', explanation: 'These are the numbers 1 through 5 in English', explanationEs: 'Estos son los números del 1 al 5 en inglés', points: 10 },
        { type: 'find_error', prompt: 'Find the mistake: I have too hands', promptEs: 'Encuentra el error: I have too hands', hintEn: '"Too" means "also" or "excessively" — which word sounds like it but means the number 2?', hintEs: '"Too" significa "también" o "excesivamente" — ¿qué palabra suena igual pero significa el número 2?', audioText: 'I have two hands', options: '[]', correctAnswer: 'I have two hands', explanation: '"Two" is the number 2. "Too" means "also". They sound the same but are spelled differently', explanationEs: '"Two" es el número 2. "Too" significa "también". Suenan igual pero se escriben diferente', points: 15 },
        { type: 'build_sentence', prompt: 'Build: I / have / two / hands', promptEs: 'Construye: I / have / two / hands', hintEn: 'Subject + verb + number + noun', hintEs: 'Sujeto + verbo + número + sustantivo', audioText: 'I have two hands', options: '["I","have","two","hands"]', correctAnswer: 'I have two hands', explanation: 'The correct sentence is "I have two hands"', explanationEs: 'La oración correcta es "I have two hands"', points: 15 },
        { type: 'match_concepts', prompt: 'Match the Spanish numbers with their English names', promptEs: 'Relaciona los números en español con sus nombres en inglés', hintEn: 'uno=one, cuatro=four, diez=ten', hintEs: 'uno=one, cuatro=four, diez=ten', audioText: 'Match the numbers', options: '["uno-one","cuatro-four","diez-ten"]', correctAnswer: 'one four ten', explanation: 'uno=one, cuatro=four, diez=ten', explanationEs: 'uno=one, cuatro=four, diez=ten', points: 15 },
      ]
    }, {
      lessonTitle: 'Numbers 11-100', lessonTitleEs: 'Números 11-100', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'How do you say 12 in English?', promptEs: '¿Cómo se dice 12 en inglés?', hintEn: 'It starts with "twel"', hintEs: 'Empieza con "twel"', audioText: 'How do you say twelve in English?', options: '["twelve","twenty","two","ten-two"]', correctAnswer: 'twelve', explanation: '12 = twelve', explanationEs: '12 = twelve', points: 10 },
        { type: 'fill_blank', prompt: '25 in English is twenty-___', promptEs: '25 en inglés es twenty-___', hintEn: 'Think of 5 = five', hintEs: 'Piensa en 5 = five', audioText: 'Twenty-five', options: '[]', correctAnswer: 'five', explanation: '25 = twenty-five', explanationEs: '25 = twenty-five', points: 10 },
        { type: 'multiple_choice', prompt: 'What is 100 in English?', promptEs: '¿Qué es 100 en inglés?', hintEn: 'It starts with "hun"', hintEs: 'Empieza con "hun"', audioText: 'What is one hundred in English?', options: '["a hundred","one hundred","hundred","both A and B"]', correctAnswer: 'both A and B', explanation: '100 can be said as "a hundred" or "one hundred"', explanationEs: '100 se puede decir "a hundred" o "one hundred"', points: 15 },
        { type: 'translate', prompt: 'Translate to English: quince', promptEs: 'Traduce al inglés: quince', hintEn: 'It starts with "fif"', hintEs: 'Empieza con "fif"', audioText: 'Translate to English: quince', options: '[]', correctAnswer: 'fifteen', explanation: 'quince = fifteen', explanationEs: 'quince = fifteen', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the number you hear', promptEs: 'Escucha y escribe el número que oyes', hintEn: 'This is three tens', hintEs: 'Esto es tres dieces', audioText: 'thirty', options: '[]', correctAnswer: 'thirty', explanation: 'The number is thirty (30)', explanationEs: 'El número es thirty (30)', points: 15 },
        { type: 'order_words', prompt: 'Put these numbers in order: fifty, twenty, eighty, ten', promptEs: 'Pon estos números en orden: fifty, twenty, eighty, ten', hintEn: 'Start with the smallest number', hintEs: 'Empieza con el número más pequeño', audioText: 'Put these numbers in order', options: '["fifty","twenty","eighty","ten"]', correctAnswer: 'ten twenty fifty eighty', explanation: '10 (ten), 20 (twenty), 50 (fifty), 80 (eighty) is the correct order', explanationEs: '10 (ten), 20 (twenty), 50 (fifty), 80 (eighty) es el orden correcto', points: 15 },
        { type: 'find_error', prompt: 'Find the mistake: I am eleventeen years old', promptEs: 'Encuentra el error: I am eleventeen years old', hintEn: 'There is no "eleventeen" in English', hintEs: 'No existe "eleventeen" en inglés', audioText: 'I am eleven years old', options: '[]', correctAnswer: 'I am eleven years old', explanation: '11 is "eleven", not "eleventeen". The "-teen" numbers start at 13 (thirteen)', explanationEs: '11 es "eleven", no "eleventeen". Los números con "-teen" empiezan en 13 (thirteen)', points: 15 },
        { type: 'build_sentence', prompt: 'Build: I / am / twenty / years / old', promptEs: 'Construye: I / am / twenty / years / old', hintEn: 'Standard way to say your age', hintEs: 'Forma estándar de decir tu edad', audioText: 'I am twenty years old', options: '["I","am","twenty","years","old"]', correctAnswer: 'I am twenty years old', explanation: 'The correct sentence is "I am twenty years old"', explanationEs: 'La oración correcta es "I am twenty years old"', points: 15 },
        { type: 'flashcard', prompt: '50 - fifty 🎯', promptEs: '50 - fifty 🎯', hintEn: 'Fifty is half of one hundred', hintEs: 'Fifty es la mitad de cien', audioText: 'fifty', options: '[]', correctAnswer: 'fifty', explanation: '50 = fifty. It is half of one hundred', explanationEs: '50 = fifty. Es la mitad de cien', points: 5 },
        { type: 'pronunciation', prompt: 'Practice saying: eleven twelve thirteen fourteen fifteen', promptEs: 'Practica diciendo: eleven twelve thirteen fourteen fifteen', hintEn: 'Notice the "-teen" ending on 13, 14, 15', hintEs: 'Nota la terminación "-teen" en 13, 14, 15', audioText: 'eleven twelve thirteen fourteen fifteen', options: '[]', correctAnswer: 'eleven twelve thirteen fourteen fifteen', explanation: '11-15 in English: eleven, twelve, thirteen, fourteen, fifteen', explanationEs: '11-15 en inglés: eleven, twelve, thirteen, fourteen, fifteen', points: 10 },
      ]
    }],
    'colors': [{
      lessonTitle: 'Basic Colors', lessonTitleEs: 'Colores Básicos', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What color is the sky on a clear day?', promptEs: '¿De qué color está el cielo en un día despejado?', hintEn: 'Think of a sunny day', hintEs: 'Piensa en un día soleado', audioText: 'What color is the sky on a clear day?', options: '["Red","Blue","Green","Yellow"]', correctAnswer: 'Blue', explanation: 'The sky is blue on a clear day', explanationEs: 'El cielo es azul en un día despejado', points: 10 },
        { type: 'translate', prompt: 'Translate to English: rojo', promptEs: 'Traduce al inglés: rojo', hintEn: 'Think of fire', hintEs: 'Piensa en el fuego', audioText: 'Translate to English: rojo', options: '[]', correctAnswer: 'red', explanation: 'rojo = red', explanationEs: 'rojo = red', points: 10 },
        { type: 'fill_blank', prompt: 'Grass is ___', promptEs: 'El pasto es ___', hintEn: 'Think of nature', hintEs: 'Piensa en la naturaleza', audioText: 'Grass is green', options: '[]', correctAnswer: 'green', explanation: 'Grass is green (verde)', explanationEs: 'El pasto es green (verde)', points: 10 },
        { type: 'match_concepts', prompt: 'Match the colors with their English names', promptEs: 'Relaciona los colores con sus nombres en inglés', hintEn: 'amarillo=yellow, negro=black, blanco=white', hintEs: 'yellow=amarillo, black=negro, white=blanco', audioText: 'Match the colors', options: '["amarillo-yellow","negro-black","blanco-white"]', correctAnswer: 'yellow black white', explanation: 'amarillo=yellow, negro=black, blanco=white', explanationEs: 'amarillo=yellow, negro=black, blanco=white', points: 15 },
        { type: 'flashcard', prompt: 'Blue - the color of the ocean 🌊', promptEs: 'Blue - el color del océano 🌊', hintEn: 'Blue is the color of water and sky', hintEs: 'Blue es el color del agua y el cielo', audioText: 'blue', options: '[]', correctAnswer: 'blue', explanation: 'Blue (azul) is the color of the sky and ocean', explanationEs: 'Blue (azul) es el color del cielo y el océano', points: 5 },
        { type: 'pronunciation', prompt: 'Practice saying: red blue green yellow black white', promptEs: 'Practica diciendo: red blue green yellow black white', hintEn: 'Say each color name clearly', hintEs: 'Di cada nombre de color claramente', audioText: 'red blue green yellow black white', options: '[]', correctAnswer: 'red blue green yellow black white', explanation: 'These are the six basic colors in English', explanationEs: 'Estos son los seis colores básicos en inglés', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the color you hear', promptEs: 'Escucha y escribe el color que oyes', hintEn: 'Think of the color of snow', hintEs: 'Piensa en el color de la nieve', audioText: 'white', options: '[]', correctAnswer: 'white', explanation: 'The color is white (blanco)', explanationEs: 'El color es white (blanco)', points: 15 },
        { type: 'order_words', prompt: 'Put these colors in alphabetical order: red, blue, green, black', promptEs: 'Pon estos colores en orden alfabético: red, blue, green, black', hintEn: 'Think of ABC order: B comes first', hintEs: 'Piensa en orden ABC: B viene primero', audioText: 'Put these colors in alphabetical order', options: '["red","blue","green","black"]', correctAnswer: 'black blue green red', explanation: 'Alphabetical order: black, blue, green, red', explanationEs: 'Orden alfabético: black, blue, green, red', points: 15 },
        { type: 'build_sentence', prompt: 'Build: My / favorite / color / is / blue', promptEs: 'Construye: My / favorite / color / is / blue', hintEn: 'This expresses your color preference', hintEs: 'Esto expresa tu preferencia de color', audioText: 'My favorite color is blue', options: '["My","favorite","color","is","blue"]', correctAnswer: 'My favorite color is blue', explanation: 'The correct sentence is "My favorite color is blue"', explanationEs: 'La oración correcta es "My favorite color is blue"', points: 15 },
        { type: 'find_error', prompt: 'Find the mistake: The sun is green', promptEs: 'Encuentra el error: The sun is green', hintEn: 'What color is the sun really?', hintEs: '¿De qué color es realmente el sol?', audioText: 'The sun is green', options: '[]', correctAnswer: 'The sun is yellow', explanation: 'The sun is yellow, not green. Grass is green', explanationEs: 'El sol es amarillo (yellow), no verde (green). El pasto es verde', points: 15 },
      ]
    }, {
      lessonTitle: 'Color Expressions', lessonTitleEs: 'Expresiones de Colores', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What color do you get when you mix red and white?', promptEs: '¿Qué color obtienes cuando mezclas rojo y blanco?', hintEn: 'Think of a flower', hintEs: 'Piensa en una flor', audioText: 'What color do you get when you mix red and white?', options: '["Orange","Pink","Purple","Brown"]', correctAnswer: 'Pink', explanation: 'Red + White = Pink', explanationEs: 'Rojo + Blanco = Rosa (Pink)', points: 15 },
        { type: 'translate', prompt: 'Translate to English: morado', promptEs: 'Traduce al inglés: morado', hintEn: 'Think of grapes', hintEs: 'Piensa en las uvas', audioText: 'Translate to English: morado', options: '[]', correctAnswer: 'purple', explanation: 'morado = purple', explanationEs: 'morado = purple', points: 10 },
        { type: 'flashcard', prompt: 'Orange - the color and the fruit!', promptEs: 'Orange - ¡el color y la fruta!', hintEn: 'Orange is both a color and a fruit', hintEs: 'Orange es tanto un color como una fruta', audioText: 'Orange', options: '[]', correctAnswer: 'orange', explanation: 'Orange is unique - it is both a color and a fruit name', explanationEs: 'Orange es único - es tanto un color como el nombre de una fruta', points: 5 },
        { type: 'fill_blank', prompt: 'The opposite of black is ___', promptEs: 'Lo opuesto de negro es ___', hintEn: 'Think of day and night', hintEs: 'Piensa en el día y la noche', audioText: 'The opposite of black is white', options: '[]', correctAnswer: 'white', explanation: 'Black and white are opposite colors', explanationEs: 'Black y white son colores opuestos', points: 10 },
        { type: 'build_sentence', prompt: 'Build: I / like / the / color / pink', promptEs: 'Construye: I / like / the / color / pink', hintEn: 'Subject + verb + object', hintEs: 'Sujeto + verbo + objeto', audioText: 'I like the color pink', options: '["I","like","the","color","pink"]', correctAnswer: 'I like the color pink', explanation: 'The correct sentence is "I like the color pink"', explanationEs: 'La oración correcta es "I like the color pink"', points: 15 },
        { type: 'find_error', prompt: 'Find the mistake: The grass is blue', promptEs: 'Encuentra el error: The grass is blue', hintEn: 'What color is grass in real life?', hintEs: '¿De qué color es el pasto en la vida real?', audioText: 'The grass is blue', options: '[]', correctAnswer: 'The grass is green', explanation: 'Grass is green, not blue. The sky is blue', explanationEs: 'El pasto es green (verde), no blue (azul). El cielo es azul', points: 15 },
        { type: 'listen_write', prompt: 'Listen and write the color you hear', promptEs: 'Escucha y escribe el color que oyes', hintEn: 'Think of the color of an eggplant', hintEs: 'Piensa en el color de una berenjena', audioText: 'purple', options: '[]', correctAnswer: 'purple', explanation: 'The color is purple (morado)', explanationEs: 'El color es purple (morado)', points: 15 },
        { type: 'pronunciation', prompt: 'Practice saying: pink purple orange brown gray', promptEs: 'Practica diciendo: pink purple orange brown gray', hintEn: 'These are secondary and neutral colors', hintEs: 'Estos son colores secundarios y neutros', audioText: 'pink purple orange brown gray', options: '[]', correctAnswer: 'pink purple orange brown gray', explanation: 'These are additional colors beyond the basic ones', explanationEs: 'Estos son colores adicionales más allá de los básicos', points: 10 },
        { type: 'order_words', prompt: 'Put these colors in rainbow order: green, red, violet, yellow', promptEs: 'Pon estos colores en orden del arcoíris: green, red, violet, yellow', hintEn: 'Think of the rainbow: Red, Orange, Yellow, Green, Blue, Indigo, Violet', hintEs: 'Piensa en el arcoíris: Red, Orange, Yellow, Green, Blue, Indigo, Violet', audioText: 'Put these colors in rainbow order', options: '["green","red","violet","yellow"]', correctAnswer: 'red yellow green violet', explanation: 'Rainbow order: red, yellow, green, violet', explanationEs: 'Orden del arcoíris: red, yellow, green, violet', points: 15 },
        { type: 'match_concepts', prompt: 'Match the mixed colors with their results', promptEs: 'Relaciona los colores mezclados con sus resultados', hintEn: 'red+yellow=orange, red+blue=purple, yellow+blue=green', hintEs: 'rojo+amarillo=naranja, rojo+azul=morado, amarillo+azul=verde', audioText: 'Match the mixed colors', options: '["red+yellow-orange","red+blue-purple","yellow+blue-green"]', correctAnswer: 'orange purple green', explanation: 'Red+Yellow=Orange, Red+Blue=Purple, Yellow+Blue=Green', explanationEs: 'Rojo+Amarillo=Naranja, Rojo+Azul=Morado, Amarillo+Azul=Verde', points: 15 },
      ]
    }],
    'greetings': [{
      lessonTitle: 'Hello & Goodbye', lessonTitleEs: 'Hola y Adiós', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What is the most common way to greet someone in English?', promptEs: '¿Cuál es la forma más común de saludar a alguien en inglés?', hintEn: 'It starts with H', hintEs: 'Empieza con H', audioText: 'What is the most common way to greet someone in English?', options: '["Goodbye","Hello","Sorry","Please"]', correctAnswer: 'Hello', explanation: 'Hello is the most common greeting', explanationEs: 'Hello es el saludo más común', points: 10 },
        { type: 'fill_blank', prompt: 'Good ___ (in the morning)', promptEs: 'Good ___ (por la mañana)', hintEn: 'Morning greeting', hintEs: 'Saludo matutino', audioText: 'Good morning', options: '[]', correctAnswer: 'morning', explanation: 'Good morning is used to greet someone in the morning', explanationEs: 'Good morning se usa para saludar por la mañana', points: 10 },
        { type: 'translate', prompt: 'Translate to English: buenas noches', promptEs: 'Traduce al inglés: buenas noches', hintEn: 'Used when saying goodbye at night', hintEs: 'Se usa al despedirse por la noche', audioText: 'Translate to English: buenas noches', options: '[]', correctAnswer: 'good night', explanation: 'buenas noches = good night', explanationEs: 'buenas noches = good night', points: 10 },
        { type: 'multiple_choice', prompt: 'Which greeting is informal/friendly?', promptEs: '¿Qué saludo es informal/amigable?', hintEn: 'Short and casual', hintEs: 'Corto y casual', audioText: 'Which greeting is informal?', options: '["Good evening","Hi","Good afternoon","How do you do"]', correctAnswer: 'Hi', explanation: 'Hi is an informal, friendly greeting', explanationEs: 'Hi es un saludo informal y amigable', points: 10 },
        { type: 'flashcard', prompt: 'Hello 👋 - the most universal greeting!', promptEs: 'Hello 👋 - ¡el saludo más universal!', hintEn: 'Hello works in any situation, formal or informal', hintEs: 'Hello funciona en cualquier situación, formal o informal', audioText: 'Hello', options: '[]', correctAnswer: 'Hello', explanation: 'Hello is the most universal English greeting, appropriate in all contexts', explanationEs: 'Hello es el saludo en inglés más universal, apropiado en todos los contextos', points: 5 },
        { type: 'pronunciation', prompt: 'Practice saying: Hello, good morning, good afternoon', promptEs: 'Practica diciendo: Hello, good morning, good afternoon', hintEn: 'Say each greeting clearly and naturally', hintEs: 'Di cada saludo clara y naturalmente', audioText: 'Hello, good morning, good afternoon', options: '[]', correctAnswer: 'Hello good morning good afternoon', explanation: 'These are common English greetings for different times of day', explanationEs: 'Estos son saludos comunes en inglés para diferentes horas del día', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the greeting you hear', promptEs: 'Escucha y escribe el saludo que oyes', hintEn: 'This is a greeting used in the evening', hintEs: 'Este es un saludo usado por la tarde/noche', audioText: 'Good evening', options: '[]', correctAnswer: 'Good evening', explanation: 'Good evening is the formal greeting for evening time', explanationEs: 'Good evening es el saludo formal para la tarde/noche', points: 15 },
        { type: 'order_words', prompt: 'Put these greetings in order from earliest to latest in the day: good evening, good morning, good afternoon', promptEs: 'Pon estos saludos en orden del más temprano al más tarde del día: good evening, good morning, good afternoon', hintEn: 'Morning comes first, then afternoon, then evening', hintEs: 'Mañana viene primero, luego tarde, luego noche', audioText: 'Put these greetings in time order', options: '["good evening","good morning","good afternoon"]', correctAnswer: 'good morning good afternoon good evening', explanation: 'Chronological order: morning → afternoon → evening', explanationEs: 'Orden cronológico: morning → afternoon → evening', points: 15 },
        { type: 'find_error', prompt: 'Find the mistake: Good night, how are you?', promptEs: 'Encuentra el error: Good night, how are you?', hintEn: '"Good night" is a farewell, not a greeting', hintEs: '"Good night" es una despedida, no un saludo', audioText: 'Good night, how are you?', options: '[]', correctAnswer: 'Good evening, how are you?', explanation: '"Good night" is used when leaving, not greeting. Use "Good evening" to greet someone at night', explanationEs: '"Good night" se usa al irse, no al saludar. Usa "Good evening" para saludar por la noche', points: 15 },
        { type: 'build_sentence', prompt: 'Build: Good / morning / my / friend', promptEs: 'Construye: Good / morning / my / friend', hintEn: 'A friendly morning greeting', hintEs: 'Un saludo amigable de la mañana', audioText: 'Good morning my friend', options: '["Good","morning","my","friend"]', correctAnswer: 'Good morning my friend', explanation: 'The correct sentence is "Good morning my friend"', explanationEs: 'La oración correcta es "Good morning my friend"', points: 15 },
      ]
    }, {
      lessonTitle: 'Polite Expressions', lessonTitleEs: 'Expresiones Corteses', lessonType: 'conversation',
      questions: [
        { type: 'fill_blank', prompt: 'My name ___ John', promptEs: 'Mi nombre ___ John', hintEn: 'Use the verb "is"', hintEs: 'Usa el verbo "is"', audioText: 'My name is John', options: '[]', correctAnswer: 'is', explanation: '"My name is..." is the standard way to introduce yourself', explanationEs: '"My name is..." es la forma estándar de presentarse', points: 10 },
        { type: 'multiple_choice', prompt: 'How do you ask someone their name?', promptEs: '¿Cómo le preguntas a alguien su nombre?', hintEn: 'Think politely', hintEs: 'Piensa con cortesía', audioText: 'How do you ask someone their name?', options: '["What is your name?","Who are you?","Tell me your name","Your name?"]', correctAnswer: 'What is your name?', explanation: '"What is your name?" is the polite way to ask', explanationEs: '"What is your name?" es la forma cortés de preguntar', points: 10 },
        { type: 'build_sentence', prompt: 'Build: Nice / to / you / meet', promptEs: 'Construye: Nice / to / you / meet', hintEn: 'Standard introduction phrase', hintEs: 'Frase estándar de presentación', audioText: 'Nice to meet you', options: '["Nice","to","you","meet"]', correctAnswer: 'Nice to meet you', explanation: 'Nice to meet you is the standard response when introduced', explanationEs: 'Nice to meet you es la respuesta estándar al ser presentado', points: 15 },
        { type: 'translate', prompt: 'Translate to English: gracias', promptEs: 'Traduce al inglés: gracias', hintEn: 'The magic word for showing appreciation', hintEs: 'La palabra mágica para mostrar aprecio', audioText: 'Translate to English: gracias', options: '[]', correctAnswer: 'thank you', explanation: 'gracias = thank you. You can also say "thanks" informally', explanationEs: 'gracias = thank you. También puedes decir "thanks" informalmente', points: 10 },
        { type: 'multiple_choice', prompt: 'What do you say when you want to be polite when asking for something?', promptEs: '¿Qué dices cuando quieres ser cortés al pedir algo?', hintEn: 'The magic word', hintEs: 'La palabra mágica', audioText: 'What do you say to be polite when asking?', options: '["Now","Please","Give me","Hurry"]', correctAnswer: 'Please', explanation: '"Please" makes any request polite', explanationEs: '"Please" hace que cualquier solicitud sea cortés', points: 10 },
        { type: 'flashcard', prompt: 'Thank you 🙏 - showing gratitude', promptEs: 'Thank you 🙏 - mostrando gratitud', hintEn: 'Thank you is used to show appreciation', hintEs: 'Thank you se usa para mostrar aprecio', audioText: 'Thank you', options: '[]', correctAnswer: 'thank you', explanation: 'Thank you is the polite way to express gratitude in English', explanationEs: 'Thank you es la forma cortés de expresar gratitud en inglés', points: 5 },
        { type: 'listen_write', prompt: 'Listen and write the polite expression you hear', promptEs: 'Escucha y escribe la expresión cortés que oyes', hintEn: 'You say this when you make a mistake', hintEs: 'Dices esto cuando cometes un error', audioText: 'I am sorry', options: '[]', correctAnswer: 'I am sorry', explanation: '"I am sorry" (or just "Sorry") is used to apologize', explanationEs: '"I am sorry" (o solo "Sorry") se usa para disculparse', points: 15 },
        { type: 'pronunciation', prompt: 'Practice saying: please, thank you, sorry, excuse me', promptEs: 'Practica diciendo: please, thank you, sorry, excuse me', hintEn: 'These are the four most important polite expressions', hintEs: 'Estas son las cuatro expresiones corteses más importantes', audioText: 'please thank you sorry excuse me', options: '[]', correctAnswer: 'please thank you sorry excuse me', explanation: 'These four expressions are essential for polite English conversation', explanationEs: 'Estas cuatro expresiones son esenciales para la conversación cortés en inglés', points: 10 },
        { type: 'find_error', prompt: 'Find the mistake: Give me water now', promptEs: 'Encuentra el error: Give me water now', hintEn: 'This sentence is too direct and impolite', hintEs: 'Esta oración es demasiado directa e impertinente', audioText: 'Give me water now', options: '[]', correctAnswer: 'Please give me water', explanation: 'Adding "Please" makes the request polite. "Give me now" sounds rude', explanationEs: 'Agregar "Please" hace la solicitud cortés. "Give me now" suena grosero', points: 15 },
        { type: 'order_words', prompt: 'Put these words in order to make a polite introduction: name / my / is / John / hello', promptEs: 'Pon estas palabras en orden para hacer una presentación cortés: name / my / is / John / hello', hintEn: 'Start with the greeting, then introduce yourself', hintEs: 'Empieza con el saludo, luego preséntate', audioText: 'Put the words in order for a polite introduction', options: '["name","my","is","John","hello"]', correctAnswer: 'hello my name is John', explanation: 'The correct polite introduction is: Hello, my name is John', explanationEs: 'La presentación cortés correcta es: Hello, my name is John', points: 15 },
      ]
    }],
  };

  // Generate lessons and questions for all scenarios
  for (const scenario of allScenarios) {
    const template = questionTemplates[scenario.slug];

    if (template) {
      // Use predefined templates
      for (let l = 0; l < template.length; l++) {
        const t = template[l];
        const lesson = await db.lesson.create({
          data: {
            scenarioId: scenario.id,
            title: t.lessonTitle,
            titleEs: t.lessonTitleEs,
            description: `Learn about ${t.lessonTitle.toLowerCase()}`,
            descriptionEs: `Aprende sobre ${t.lessonTitleEs.toLowerCase()}`,
            type: t.lessonType,
            order: l + 1,
            xpReward: t.questions.length * 10,
          },
        });

        for (let q = 0; q < t.questions.length; q++) {
          const question = t.questions[q];
          await db.question.create({
            data: {
              lessonId: lesson.id,
              type: question.type,
              prompt: question.prompt,
              promptEs: question.promptEs,
              hintEn: question.hintEn,
              hintEs: question.hintEs,
              audioText: question.audioText,
              options: question.options,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              explanationEs: question.explanationEs,
              points: question.points,
              order: q + 1,
            },
          });
        }
      }
    } else {
      // Generate generic lessons for scenarios without templates
      const lessonTypes = [
        { title: 'Vocabulary', titleEs: 'Vocabulario', type: 'vocabulary' },
        { title: 'Practice', titleEs: 'Práctica', type: 'grammar' },
        { title: 'Challenge', titleEs: 'Desafío', type: 'conversation' },
      ];

      for (let l = 0; l < lessonTypes.length; l++) {
        const lt = lessonTypes[l];
        const lesson = await db.lesson.create({
          data: {
            scenarioId: scenario.id,
            title: `${scenario.name} - ${lt.title}`,
            titleEs: `${scenario.nameEs} - ${lt.titleEs}`,
            description: `${lt.title} for ${scenario.name.toLowerCase()}`,
            descriptionEs: `${lt.titleEs} para ${scenario.nameEs.toLowerCase()}`,
            type: lt.type,
            order: l + 1,
            xpReward: 30,
          },
        });

        // Generate questions based on level and lesson type
        const levelSlug = scenario.level.slug;
        const isBasic = levelSlug === 'basic';
        const isIntermediate = levelSlug === 'intermediate';

        const questions = generateQuestionsForScenario(scenario, lt.type, isBasic, isIntermediate);

        for (let q = 0; q < questions.length; q++) {
          const question = questions[q];
          await db.question.create({
            data: {
              lessonId: lesson.id,
              ...question,
              order: q + 1,
            },
          });
        }
      }
    }
  }

  // ============================================
  // CREATE ACHIEVEMENTS
  // ============================================
  console.log('🏆 Creating achievements...');
  const achievements = [
    { slug: 'first-steps', name: 'First Steps', nameEs: 'Primeros Pasos', description: 'Complete your first exercise', descriptionEs: 'Completa tu primer ejercicio', icon: '👶', category: 'exercises', requirement: 1, reward: 10 },
    { slug: 'streak-3', name: 'Streak Starter', nameEs: 'Iniciador de Racha', description: 'Maintain a 3-day streak', descriptionEs: 'Mantén una racha de 3 días', icon: '🔥', category: 'streak', requirement: 3, reward: 25 },
    { slug: 'streak-7', name: 'Week Warrior', nameEs: 'Guerrero Semanal', description: 'Maintain a 7-day streak', descriptionEs: 'Mantén una racha de 7 días', icon: '⚡', category: 'streak', requirement: 7, reward: 50 },
    { slug: 'streak-30', name: 'Monthly Master', nameEs: 'Maestro Mensual', description: 'Maintain a 30-day streak', descriptionEs: 'Mantén una racha de 30 días', icon: '🌟', category: 'streak', requirement: 30, reward: 200 },
    { slug: 'streak-100', name: 'Century Streak', nameEs: 'Racha de Siglo', description: 'Maintain a 100-day streak', descriptionEs: 'Mantén una racha de 100 días', icon: '💯', category: 'streak', requirement: 100, reward: 500 },
    { slug: 'xp-100', name: 'Rising Star', nameEs: 'Estrella Naciente', description: 'Earn 100 XP', descriptionEs: 'Gana 100 XP', icon: '⭐', category: 'xp', requirement: 100, reward: 15 },
    { slug: 'xp-500', name: 'Dedicated Learner', nameEs: 'Estudiante Dedicado', description: 'Earn 500 XP', descriptionEs: 'Gana 500 XP', icon: '💫', category: 'xp', requirement: 500, reward: 30 },
    { slug: 'xp-1000', name: 'Knowledge Seeker', nameEs: 'Buscador de Conocimiento', description: 'Earn 1000 XP', descriptionEs: 'Gana 1000 XP', icon: '🧠', category: 'xp', requirement: 1000, reward: 50 },
    { slug: 'xp-5000', name: 'English Master', nameEs: 'Maestro del Inglés', description: 'Earn 5000 XP', descriptionEs: 'Gana 5000 XP', icon: '🎓', category: 'xp', requirement: 5000, reward: 200 },
    { slug: 'exercises-10', name: 'Getting Warmer', nameEs: 'Calentando', description: 'Complete 10 exercises', descriptionEs: 'Completa 10 ejercicios', icon: '📈', category: 'exercises', requirement: 10, reward: 20 },
    { slug: 'exercises-50', name: 'On a Roll', nameEs: 'En Racha', description: 'Complete 50 exercises', descriptionEs: 'Completa 50 ejercicios', icon: '🎯', category: 'exercises', requirement: 50, reward: 50 },
    { slug: 'exercises-100', name: 'Exercise Champion', nameEs: 'Campeón de Ejercicios', description: 'Complete 100 exercises', descriptionEs: 'Completa 100 ejercicios', icon: '🏅', category: 'exercises', requirement: 100, reward: 100 },
    { slug: 'scenarios-5', name: 'Explorer', nameEs: 'Explorador', description: 'Complete 5 scenarios', descriptionEs: 'Completa 5 escenarios', icon: '🗺️', category: 'scenarios', requirement: 5, reward: 30 },
    { slug: 'scenarios-25', name: 'World Traveler', nameEs: 'Viajero del Mundo', description: 'Complete 25 scenarios', descriptionEs: 'Completa 25 escenarios', icon: '✈️', category: 'scenarios', requirement: 25, reward: 150 },
    { slug: 'perfect-score', name: 'Perfectionist', nameEs: 'Perfeccionista', description: 'Get 100% on any exam', descriptionEs: 'Obtén 100% en cualquier examen', icon: '💎', category: 'special', requirement: 1, reward: 100 },
  ];

  for (const a of achievements) {
    await db.achievement.create({ data: a });
  }

  // ============================================
  // CREATE MISSIONS
  // ============================================
  console.log('📋 Creating missions...');
  const missions = [
    // ── DAILY MISSIONS ──
    { slug: 'daily-exercises-5', title: 'Exercise Time', titleEs: 'Hora de Ejercicio', description: 'Complete 5 exercises today', descriptionEs: 'Completa 5 ejercicios hoy', type: 'daily', category: 'exercises', requirement: 5, rewardXp: 25, rewardCoins: 10, icon: '💪' },
    { slug: 'daily-pronunciation', title: 'Speak Up!', titleEs: '¡Habla!', description: 'Practice pronunciation 3 times', descriptionEs: 'Practica pronunciación 3 veces', type: 'daily', category: 'pronunciation', requirement: 3, rewardXp: 20, rewardCoins: 8, icon: '🗣️' },
    { slug: 'daily-xp-50', title: 'XP Hunter', titleEs: 'Cazador de XP', description: 'Earn 50 XP today', descriptionEs: 'Gana 50 XP hoy', type: 'daily', category: 'xp', requirement: 50, rewardXp: 15, rewardCoins: 5, icon: '✨' },
    { slug: 'daily-streak', title: 'Keep the Flame', titleEs: 'Mantén la Llama', description: 'Maintain your daily streak', descriptionEs: 'Mantén tu racha diaria', type: 'daily', category: 'streak', requirement: 1, rewardXp: 10, rewardCoins: 5, icon: '🔥' },
    { slug: 'daily-scenario', title: 'Scenario Explorer', titleEs: 'Explorador de Escenarios', description: 'Complete 1 scenario today', descriptionEs: 'Completa 1 escenario hoy', type: 'daily', category: 'scenarios', requirement: 1, rewardXp: 30, rewardCoins: 15, icon: '🗺️' },
    { slug: 'daily-perfect', title: 'Perfect Score', titleEs: 'Puntuación Perfecta', description: 'Get 100% on any exercise today', descriptionEs: 'Obtén 100% en cualquier ejercicio hoy', type: 'daily', category: 'exercises', requirement: 1, rewardXp: 40, rewardCoins: 20, icon: '💯' },
    { slug: 'daily-vocabulary', title: 'Word Collector', titleEs: 'Coleccionista de Palabras', description: 'Learn 10 new words today', descriptionEs: 'Aprende 10 palabras nuevas hoy', type: 'daily', category: 'exercises', requirement: 10, rewardXp: 30, rewardCoins: 12, icon: '📖' },
    { slug: 'daily-quick', title: 'Speed Learner', titleEs: 'Aprendizaje Rápido', description: 'Complete 3 exercises in under 2 minutes each', descriptionEs: 'Completa 3 ejercicios en menos de 2 minutos cada uno', type: 'daily', category: 'exercises', requirement: 3, rewardXp: 35, rewardCoins: 15, icon: '⚡' },
    // ── WEEKLY MISSIONS ──
    { slug: 'weekly-exercises-30', title: 'Exercise Marathon', titleEs: 'Maratón de Ejercicios', description: 'Complete 30 exercises this week', descriptionEs: 'Completa 30 ejercicios esta semana', type: 'weekly', category: 'exercises', requirement: 30, rewardXp: 100, rewardCoins: 50, icon: '🏃' },
    { slug: 'weekly-xp-500', title: 'XP Machine', titleEs: 'Máquina de XP', description: 'Earn 500 XP this week', descriptionEs: 'Gana 500 XP esta semana', type: 'weekly', category: 'xp', requirement: 500, rewardXp: 75, rewardCoins: 40, icon: '⚡' },
    { slug: 'weekly-scenarios-5', title: 'World Tour', titleEs: 'Gira Mundial', description: 'Complete 5 scenarios this week', descriptionEs: 'Completa 5 escenarios esta semana', type: 'weekly', category: 'scenarios', requirement: 5, rewardXp: 120, rewardCoins: 60, icon: '🌍' },
    { slug: 'weekly-streak-7', title: 'Full Week Streak', titleEs: 'Racha de Semana Completa', description: 'Login every day this week', descriptionEs: 'Inicia sesión todos los días esta semana', type: 'weekly', category: 'streak', requirement: 7, rewardXp: 150, rewardCoins: 75, icon: '📅' },
    { slug: 'weekly-xp-1000', title: 'XP Overlord', titleEs: 'Señor del XP', description: 'Earn 1000 XP this week', descriptionEs: 'Gana 1000 XP esta semana', type: 'weekly', category: 'xp', requirement: 1000, rewardXp: 200, rewardCoins: 100, icon: '👑' },
    { slug: 'weekly-exercises-50', title: 'Iron Student', titleEs: 'Estudiante de Hierro', description: 'Complete 50 exercises this week', descriptionEs: 'Completa 50 ejercicios esta semana', type: 'weekly', category: 'exercises', requirement: 50, rewardXp: 180, rewardCoins: 90, icon: '🏋️' },
    // ── SPECIAL MISSIONS ──
    { slug: 'special-first-scenario', title: 'First Steps', titleEs: 'Primeros Pasos', description: 'Complete your first scenario', descriptionEs: 'Completa tu primer escenario', type: 'special', category: 'scenarios', requirement: 1, rewardXp: 50, rewardCoins: 25, icon: '🌱' },
    { slug: 'special-10-scenarios', title: 'World Traveler', titleEs: 'Viajero del Mundo', description: 'Complete 10 scenarios', descriptionEs: 'Completa 10 escenarios', type: 'special', category: 'scenarios', requirement: 10, rewardXp: 200, rewardCoins: 100, icon: '✈️' },
    { slug: 'special-streak-7', title: 'Week Warrior', titleEs: 'Guerrero Semanal', description: 'Maintain a 7-day streak', descriptionEs: 'Mantén una racha de 7 días', type: 'special', category: 'streak', requirement: 7, rewardXp: 150, rewardCoins: 75, icon: '🔥' },
    { slug: 'special-xp-1000', title: 'Knowledge Seeker', titleEs: 'Buscador de Conocimiento', description: 'Earn 1000 total XP', descriptionEs: 'Gana 1000 XP en total', type: 'special', category: 'xp', requirement: 1000, rewardXp: 100, rewardCoins: 50, icon: '🧠' },
  ];

  for (const m of missions) {
    await db.mission.create({ data: m });
  }

  // ============================================
  // CREATE REWARDS
  // ============================================
  console.log('🎁 Creating rewards...');
  const rewards = [
    // ── AVATARS (Common) ──
    { slug: 'avatar-fox', name: 'Fox Avatar', nameEs: 'Avatar Zorro', description: 'A clever fox avatar', descriptionEs: 'Un avatar de zorro astuto', type: 'avatar', icon: '🦊', cost: 80, rarity: 'common' },
    { slug: 'avatar-cat', name: 'Cat Avatar', nameEs: 'Avatar Gato', description: 'A cute cat avatar', descriptionEs: 'Un avatar de gato adorable', type: 'avatar', icon: '🐱', cost: 80, rarity: 'common' },
    { slug: 'avatar-dog', name: 'Dog Avatar', nameEs: 'Avatar Perro', description: 'A loyal dog avatar', descriptionEs: 'Un avatar de perro leal', type: 'avatar', icon: '🐶', cost: 100, rarity: 'common' },
    { slug: 'avatar-bear', name: 'Bear Avatar', nameEs: 'Avatar Oso', description: 'A strong bear avatar', descriptionEs: 'Un avatar de oso fuerte', type: 'avatar', icon: '🐻', cost: 120, rarity: 'common' },
    { slug: 'avatar-rabbit', name: 'Rabbit Avatar', nameEs: 'Avatar Conejo', description: 'A quick rabbit avatar', descriptionEs: 'Un avatar de conejo veloz', type: 'avatar', icon: '🐰', cost: 120, rarity: 'common' },
    { slug: 'avatar-panda', name: 'Panda Avatar', nameEs: 'Avatar Panda', description: 'A chill panda avatar', descriptionEs: 'Un avatar de panda relajado', type: 'avatar', icon: '🐼', cost: 150, rarity: 'common' },
    { slug: 'avatar-penguin', name: 'Penguin Avatar', nameEs: 'Avatar Pingüino', description: 'A dapper penguin avatar', descriptionEs: 'Un avatar de pingüino elegante', type: 'avatar', icon: '🐧', cost: 150, rarity: 'common' },
    { slug: 'avatar-owl', name: 'Owl Avatar', nameEs: 'Avatar Búho', description: 'A wise owl avatar', descriptionEs: 'Un avatar de búho sabio', type: 'avatar', icon: '🦉', cost: 180, rarity: 'common' },
    { slug: 'avatar-frog', name: 'Frog Avatar', nameEs: 'Avatar Rana', description: 'A funny frog avatar', descriptionEs: 'Un avatar de rana divertido', type: 'avatar', icon: '🐸', cost: 180, rarity: 'common' },
    { slug: 'avatar-monkey', name: 'Monkey Avatar', nameEs: 'Avatar Mono', description: 'A playful monkey avatar', descriptionEs: 'Un avatar de mono juguetón', type: 'avatar', icon: '🐒', cost: 200, rarity: 'common' },
    // ── AVATARS (Rare) ──
    { slug: 'avatar-tiger', name: 'Tiger Avatar', nameEs: 'Avatar Tigre', description: 'A fierce tiger avatar', descriptionEs: 'Un avatar de tigre feroz', type: 'avatar', icon: '🐯', cost: 350, rarity: 'rare' },
    { slug: 'avatar-lion', name: 'Lion Avatar', nameEs: 'Avatar León', description: 'The king of the jungle', descriptionEs: 'El rey de la selva', type: 'avatar', icon: '🦁', cost: 400, rarity: 'rare' },
    { slug: 'avatar-wolf', name: 'Wolf Avatar', nameEs: 'Avatar Lobo', description: 'A fierce wolf avatar', descriptionEs: 'Un avatar de lobo feroz', type: 'avatar', icon: '🐺', cost: 350, rarity: 'rare' },
    { slug: 'avatar-eagle', name: 'Eagle Avatar', nameEs: 'Avatar Águila', description: 'Soar above the rest', descriptionEs: 'Vuela por encima del resto', type: 'avatar', icon: '🦅', cost: 380, rarity: 'rare' },
    { slug: 'avatar-dolphin', name: 'Dolphin Avatar', nameEs: 'Avatar Delfín', description: 'A smart dolphin avatar', descriptionEs: 'Un avatar de delfín inteligente', type: 'avatar', icon: '🐬', cost: 380, rarity: 'rare' },
    { slug: 'avatar-horse', name: 'Horse Avatar', nameEs: 'Avatar Caballo', description: 'A majestic horse avatar', descriptionEs: 'Un avatar de caballo majestuoso', type: 'avatar', icon: '🐴', cost: 400, rarity: 'rare' },
    { slug: 'avatar-gorilla', name: 'Gorilla Avatar', nameEs: 'Avatar Gorila', description: 'A powerful gorilla avatar', descriptionEs: 'Un avatar de gorila poderoso', type: 'avatar', icon: '🦍', cost: 450, rarity: 'rare' },
    { slug: 'avatar-shark', name: 'Shark Avatar', nameEs: 'Avatar Tiburón', description: 'Rule the ocean', descriptionEs: 'Domina el océano', type: 'avatar', icon: '🦈', cost: 450, rarity: 'rare' },
    { slug: 'avatar-octopus', name: 'Octopus Avatar', nameEs: 'Avatar Pulpo', description: 'Multitask like a pro', descriptionEs: 'Multitarea como un profesional', type: 'avatar', icon: '🐙', cost: 480, rarity: 'rare' },
    { slug: 'avatar-parrot', name: 'Parrot Avatar', nameEs: 'Avatar Loro', description: 'Speak many languages', descriptionEs: 'Habla muchos idiomas', type: 'avatar', icon: '🦜', cost: 480, rarity: 'rare' },
    // ── AVATARS (Epic) ──
    { slug: 'avatar-dragon', name: 'Dragon Avatar', nameEs: 'Avatar Dragón', description: 'A legendary dragon avatar', descriptionEs: 'Un avatar de dragón legendario', type: 'avatar', icon: '🐉', cost: 900, rarity: 'epic' },
    { slug: 'avatar-phoenix', name: 'Phoenix Avatar', nameEs: 'Avatar Fénix', description: 'Rise from the ashes', descriptionEs: 'Renace de las cenizas', type: 'avatar', icon: '🔥', cost: 1000, rarity: 'epic' },
    { slug: 'avatar-robot', name: 'Robot Avatar', nameEs: 'Avatar Robot', description: 'Future is now', descriptionEs: 'El futuro es ahora', type: 'avatar', icon: '🤖', cost: 900, rarity: 'epic' },
    { slug: 'avatar-alien', name: 'Alien Avatar', nameEs: 'Avatar Alienígena', description: 'Out of this world', descriptionEs: 'Fuera de este mundo', type: 'avatar', icon: '👽', cost: 950, rarity: 'epic' },
    { slug: 'avatar-ninja', name: 'Ninja Avatar', nameEs: 'Avatar Ninja', description: 'Silent and deadly', descriptionEs: 'Silencioso y letal', type: 'avatar', icon: '🥷', cost: 1000, rarity: 'epic' },
    { slug: 'avatar-wizard', name: 'Wizard Avatar', nameEs: 'Avatar Mago', description: 'Master of spells', descriptionEs: 'Maestro de hechizos', type: 'avatar', icon: '🧙', cost: 1050, rarity: 'epic' },
    { slug: 'avatar-astronaut', name: 'Astronaut Avatar', nameEs: 'Avatar Astronauta', description: 'To infinity and beyond', descriptionEs: 'Hasta el infinito y más allá', type: 'avatar', icon: '👨‍🚀', cost: 1100, rarity: 'epic' },
    { slug: 'avatar-superhero', name: 'Superhero Avatar', nameEs: 'Avatar Superhéroe', description: 'Save the day', descriptionEs: 'Salva el día', type: 'avatar', icon: '🦸', cost: 1200, rarity: 'epic' },
    // ── AVATARS (Legendary) ──
    { slug: 'avatar-unicorn', name: 'Unicorn Avatar', nameEs: 'Avatar Unicornio', description: 'A magical unicorn avatar', descriptionEs: 'Un avatar de unicornio mágico', type: 'avatar', icon: '🦄', cost: 2000, rarity: 'legendary' },
    { slug: 'avatar-crown', name: 'Crown Avatar', nameEs: 'Avatar Corona', description: 'Royal and majestic', descriptionEs: 'Real y majestuoso', type: 'avatar', icon: '👑', cost: 2500, rarity: 'legendary' },
    { slug: 'avatar-diamond', name: 'Diamond Avatar', nameEs: 'Avatar Diamante', description: 'Unbreakable brilliance', descriptionEs: 'Brillantez irrompible', type: 'avatar', icon: '💎', cost: 3000, rarity: 'legendary' },
    { slug: 'avatar-sun', name: 'Sun Avatar', nameEs: 'Avatar Sol', description: 'Shine like the sun', descriptionEs: 'Brilla como el sol', type: 'avatar', icon: '☀️', cost: 3500, rarity: 'legendary' },
    { slug: 'avatar-galaxy', name: 'Galaxy Avatar', nameEs: 'Avatar Galaxia', description: 'The universe within you', descriptionEs: 'El universo dentro de ti', type: 'avatar', icon: '🌌', cost: 5000, rarity: 'legendary' },

    // ── FRAMES (Common) ──
    { slug: 'frame-silver', name: 'Silver Frame', nameEs: 'Marco Plateado', description: 'A classic silver frame', descriptionEs: 'Un marco plateado clásico', type: 'frame', icon: '🪙', cost: 150, rarity: 'common' },
    { slug: 'frame-bronze', name: 'Bronze Frame', nameEs: 'Marco Bronce', description: 'A warm bronze frame', descriptionEs: 'Un marco de bronce cálido', type: 'frame', icon: '🥉', cost: 180, rarity: 'common' },
    { slug: 'frame-leaf', name: 'Leaf Frame', nameEs: 'Marco Hoja', description: 'A nature-inspired frame', descriptionEs: 'Un marco inspirado en la naturaleza', type: 'frame', icon: '🍃', cost: 200, rarity: 'common' },
    { slug: 'frame-wave', name: 'Wave Frame', nameEs: 'Marco Onda', description: 'Flow like the ocean', descriptionEs: 'Fluye como el océano', type: 'frame', icon: '🌊', cost: 200, rarity: 'common' },
    // ── FRAMES (Rare) ──
    { slug: 'frame-gold', name: 'Gold Frame', nameEs: 'Marco Dorado', description: 'A shiny gold frame for your avatar', descriptionEs: 'Un marco dorado brillante para tu avatar', type: 'frame', icon: '🖼️', cost: 500, rarity: 'rare' },
    { slug: 'frame-thunder', name: 'Thunder Frame', nameEs: 'Marco Trueno', description: 'Electric energy frame', descriptionEs: 'Marco de energía eléctrica', type: 'frame', icon: '⚡', cost: 550, rarity: 'rare' },
    { slug: 'frame-rose', name: 'Rose Frame', nameEs: 'Marco Rosa', description: 'Elegant rose frame', descriptionEs: 'Marco de rosa elegante', type: 'frame', icon: '🌹', cost: 500, rarity: 'rare' },
    { slug: 'frame-snowflake', name: 'Snowflake Frame', nameEs: 'Marco Copo de Nieve', description: 'Frozen beauty frame', descriptionEs: 'Marco de belleza congelada', type: 'frame', icon: '❄️', cost: 550, rarity: 'rare' },
    { slug: 'frame-rainbow', name: 'Rainbow Frame', nameEs: 'Marco Arcoíris', description: 'Colorful rainbow frame', descriptionEs: 'Marco arcoíris colorido', type: 'frame', icon: '🌈', cost: 600, rarity: 'rare' },
    { slug: 'frame-star', name: 'Star Frame', nameEs: 'Marco Estrella', description: 'Shine bright like a star', descriptionEs: 'Brilla como una estrella', type: 'frame', icon: '⭐', cost: 650, rarity: 'rare' },
    // ── FRAMES (Epic) ──
    { slug: 'frame-diamond', name: 'Diamond Frame', nameEs: 'Marco Diamante', description: 'A sparkling diamond frame', descriptionEs: 'Un marco de diamante brillante', type: 'frame', icon: '💎', cost: 1100, rarity: 'epic' },
    { slug: 'frame-fire', name: 'Fire Frame', nameEs: 'Marco de Fuego', description: 'A blazing fire frame', descriptionEs: 'Un marco de fuego ardiente', type: 'frame', icon: '🔥', cost: 1000, rarity: 'epic' },
    { slug: 'frame-neon', name: 'Neon Frame', nameEs: 'Marco Neón', description: 'Glow in the dark', descriptionEs: 'Brilla en la oscuridad', type: 'frame', icon: '💡', cost: 1050, rarity: 'epic' },
    { slug: 'frame-crown', name: 'Crown Frame', nameEs: 'Marco Corona', description: 'Rule with style', descriptionEs: 'Gobierna con estilo', type: 'frame', icon: '👑', cost: 1100, rarity: 'epic' },
    { slug: 'frame-cosmic', name: 'Cosmic Frame', nameEs: 'Marco Cósmico', description: 'The power of the cosmos', descriptionEs: 'El poder del cosmos', type: 'frame', icon: '🌌', cost: 1200, rarity: 'epic' },
    // ── FRAMES (Legendary) ──
    { slug: 'frame-legendary', name: 'Legendary Frame', nameEs: 'Marco Legendario', description: 'Only for legends', descriptionEs: 'Solo para leyendas', type: 'frame', icon: '🏆', cost: 2500, rarity: 'legendary' },
    { slug: 'frame-eternal', name: 'Eternal Frame', nameEs: 'Marco Eterno', description: 'Timeless and infinite', descriptionEs: 'Atemporal e infinito', type: 'frame', icon: '♾️', cost: 3500, rarity: 'legendary' },
    { slug: 'frame-chaos', name: 'Chaos Frame', nameEs: 'Marco Caos', description: 'Embrace the chaos', descriptionEs: 'Abraza el caos', type: 'frame', icon: '🌀', cost: 3000, rarity: 'legendary' },

    // ── TITLES (Common) ──
    { slug: 'title-beginner', name: 'Beginner', nameEs: 'Principiante', description: 'Just starting out', descriptionEs: 'Recién comenzando', type: 'title', icon: '🌱', cost: 100, rarity: 'common' },
    { slug: 'title-learner', name: 'Learner', nameEs: 'Aprendiz', description: 'Eager to learn', descriptionEs: 'Ansioso por aprender', type: 'title', icon: '📚', cost: 120, rarity: 'common' },
    { slug: 'title-student', name: 'Student', nameEs: 'Estudiante', description: 'Dedicated student', descriptionEs: 'Estudiante dedicado', type: 'title', icon: '🎓', cost: 150, rarity: 'common' },
    { slug: 'title-explorer', name: 'Explorer', nameEs: 'Explorador', description: 'Explore new words', descriptionEs: 'Explora nuevas palabras', type: 'title', icon: '🧭', cost: 180, rarity: 'common' },
    // ── TITLES (Rare) ──
    { slug: 'title-word-master', name: 'Word Master', nameEs: 'Maestro de Palabras', description: 'A prestigious title', descriptionEs: 'Un título prestigioso', type: 'title', icon: '📝', cost: 600, rarity: 'rare' },
    { slug: 'title-grammar-guru', name: 'Grammar Guru', nameEs: 'Gurú de Gramática', description: 'Master of grammar', descriptionEs: 'Maestro de la gramática', type: 'title', icon: '📖', cost: 600, rarity: 'rare' },
    { slug: 'title-vocabulary-king', name: 'Vocabulary King', nameEs: 'Rey del Vocabulario', description: 'Rule the words', descriptionEs: 'Domina las palabras', type: 'title', icon: '👑', cost: 700, rarity: 'rare' },
    { slug: 'title-listener', name: 'Sharp Listener', nameEs: 'Oyente Agudo', description: 'Hear every detail', descriptionEs: 'Escucha cada detalle', type: 'title', icon: '👂', cost: 650, rarity: 'rare' },
    { slug: 'title-challenger', name: 'Challenger', nameEs: 'Desafiante', description: 'Never backs down', descriptionEs: 'Nunca se rinde', type: 'title', icon: '⚔️', cost: 700, rarity: 'rare' },
    { slug: 'title-linguist', name: 'Linguist', nameEs: 'Lingüista', description: 'Language expert', descriptionEs: 'Experto en idiomas', type: 'title', icon: '🗣️', cost: 750, rarity: 'rare' },
    // ── TITLES (Epic) ──
    { slug: 'title-polyglot', name: 'Polyglot', nameEs: 'Políglota', description: 'Master of languages', descriptionEs: 'Maestro de idiomas', type: 'title', icon: '🌐', cost: 1200, rarity: 'epic' },
    { slug: 'title-wordsmith', name: 'Wordsmith', nameEs: 'Forjador de Palabras', description: 'Craft words with precision', descriptionEs: 'Forja palabras con precisión', type: 'title', icon: '⚒️', cost: 1300, rarity: 'epic' },
    { slug: 'title-scholar', name: 'Scholar', nameEs: 'Erudito', description: 'Academic excellence', descriptionEs: 'Excelencia académica', type: 'title', icon: '🏛️', cost: 1400, rarity: 'epic' },
    { slug: 'title-mentor', name: 'Mentor', nameEs: 'Mentor', description: 'Guide others to success', descriptionEs: 'Guía a otros al éxito', type: 'title', icon: '🧑‍🏫', cost: 1400, rarity: 'epic' },
    // ── TITLES (Legendary) ──
    { slug: 'title-fluent', name: 'Fluent Speaker', nameEs: 'Hablante Fluido', description: 'Speak like a native', descriptionEs: 'Habla como un nativo', type: 'title', icon: '🗣️', cost: 2500, rarity: 'legendary' },
    { slug: 'title-legend', name: 'Legend', nameEs: 'Leyenda', description: 'A true legend', descriptionEs: 'Una verdadera leyenda', type: 'title', icon: '⚡', cost: 3500, rarity: 'legendary' },
    { slug: 'title-grand-master', name: 'Grand Master', nameEs: 'Gran Maestro', description: 'The ultimate achievement', descriptionEs: 'El logro definitivo', type: 'title', icon: '🌟', cost: 5000, rarity: 'legendary' },
  ];

  for (const r of rewards) {
    await db.reward.create({ data: r });
  }

  // ============================================
  // CREATE EXAMS
  // ============================================
  console.log('📝 Creating exams...');
  const exams = [
    {
      levelId: basicLevel.id,
      type: 'midterm',
      title: 'Basic Midterm Exam',
      titleEs: 'Examen Parcial Básico',
      description: 'Test your basic English skills',
      descriptionEs: 'Prueba tus habilidades básicas de inglés',
      minScore: 0.7,
      questions: JSON.stringify([
        { type: 'multiple_choice', prompt: 'What color is the sun?', options: ['Blue', 'Yellow', 'Red', 'Green'], correctAnswer: 'Yellow' },
        { type: 'fill_blank', prompt: 'Good ___ (morning greeting)', correctAnswer: 'morning' },
        { type: 'translate', prompt: 'Translate: cinco', correctAnswer: 'five' },
        { type: 'multiple_choice', prompt: 'What is 3 + 4?', options: ['six', 'seven', 'eight', 'nine'], correctAnswer: 'seven' },
        { type: 'fill_blank', prompt: 'My ___ is Maria (name/family)', correctAnswer: 'name' },
        { type: 'multiple_choice', prompt: 'Which is an animal?', options: ['Table', 'Dog', 'Red', 'Run'], correctAnswer: 'Dog' },
        { type: 'translate', prompt: 'Translate: azul', correctAnswer: 'blue' },
        { type: 'multiple_choice', prompt: 'How do you say "hola"?', options: ['Goodbye', 'Hello', 'Thanks', 'Sorry'], correctAnswer: 'Hello' },
        { type: 'fill_blank', prompt: 'I ___ a student (am/is/are)', correctAnswer: 'am' },
        { type: 'multiple_choice', prompt: 'What day comes after Monday?', options: ['Sunday', 'Tuesday', 'Wednesday', 'Saturday'], correctAnswer: 'Tuesday' },
      ]),
    },
    {
      levelId: basicLevel.id,
      type: 'final',
      title: 'Basic Final Exam',
      titleEs: 'Examen Final Básico',
      description: 'Complete exam covering all basic topics',
      descriptionEs: 'Examen completo de todos los temas básicos',
      minScore: 0.9,
      questions: JSON.stringify([
        { type: 'multiple_choice', prompt: 'What is the opposite of "hot"?', options: ['Warm', 'Cold', 'Cool', 'Wet'], correctAnswer: 'Cold' },
        { type: 'fill_blank', prompt: 'She ___ my sister (am/is/are)', correctAnswer: 'is' },
        { type: 'translate', prompt: 'Translate: buena noche', correctAnswer: 'good night' },
        { type: 'multiple_choice', prompt: 'Which word means "gato"?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 'Cat' },
        { type: 'build_sentence', prompt: 'I / like / to / eat / pizza', correctAnswer: 'I like to eat pizza' },
        { type: 'multiple_choice', prompt: 'What time is "8:00"?', options: ['Eight o\'clock', 'Seven o\'clock', 'Nine o\'clock', 'Six o\'clock'], correctAnswer: 'Eight o\'clock' },
        { type: 'translate', prompt: 'Translate: la familia', correctAnswer: 'the family' },
        { type: 'fill_blank', prompt: 'We ___ happy (am/is/are)', correctAnswer: 'are' },
        { type: 'multiple_choice', prompt: 'Where do you sleep?', options: ['Kitchen', 'Bathroom', 'Bedroom', 'Garage'], correctAnswer: 'Bedroom' },
        { type: 'find_error', prompt: 'She have two brothers', correctAnswer: 'She has two brothers' },
      ]),
    },
    {
      levelId: intermediateLevel.id,
      type: 'midterm',
      title: 'Intermediate Midterm Exam',
      titleEs: 'Examen Parcial Intermedio',
      description: 'Test your intermediate English skills',
      descriptionEs: 'Prueba tus habilidades intermedias de inglés',
      minScore: 0.7,
      questions: JSON.stringify([
        { type: 'fill_blank', prompt: 'I ___ to the store yesterday (go/went/gone)', correctAnswer: 'went' },
        { type: 'multiple_choice', prompt: 'Which is correct?', options: ['I am agree', 'I agree', 'I am agreed', 'I do agree'], correctAnswer: 'I agree' },
        { type: 'fill_blank', prompt: 'If I ___ rich, I would travel the world', correctAnswer: 'were' },
        { type: 'multiple_choice', prompt: '"Break a leg" means:', options: ['Get injured', 'Good luck', 'Run fast', 'Be careful'], correctAnswer: 'Good luck' },
        { type: 'fill_blank', prompt: 'She has been working here ___ 2015', correctAnswer: 'since' },
      ]),
    },
    {
      levelId: intermediateLevel.id,
      type: 'final',
      title: 'Intermediate Final Exam',
      titleEs: 'Examen Final Intermedio',
      description: 'Complete intermediate exam',
      descriptionEs: 'Examen intermedio completo',
      minScore: 0.9,
      questions: JSON.stringify([
        { type: 'fill_blank', prompt: 'By next year, I ___ graduated', correctAnswer: 'will have' },
        { type: 'multiple_choice', prompt: 'Choose the passive voice: "The cake was eaten"', options: ['The cake was eaten', 'Someone ate the cake', 'The cake eating', 'Eat the cake'], correctAnswer: 'The cake was eaten' },
        { type: 'fill_blank', prompt: 'I wish I ___ speak French', correctAnswer: 'could' },
        { type: 'multiple_choice', prompt: '"Hit the books" means:', options: ['Throw books', 'Study hard', 'Read casually', 'Write a book'], correctAnswer: 'Study hard' },
        { type: 'find_error', prompt: 'He don\'t know the answer', correctAnswer: 'He doesn\'t know the answer' },
        { type: 'fill_blank', prompt: 'The report ___ by the manager yesterday', correctAnswer: 'was written' },
        { type: 'multiple_choice', prompt: 'Which phrasal verb means "to postpone"?', options: ['Put off', 'Put on', 'Put up', 'Put in'], correctAnswer: 'Put off' },
        { type: 'fill_blank', prompt: '___ I borrow your pen?', correctAnswer: 'May' },
        { type: 'multiple_choice', prompt: '"Under the weather" means:', options: ['Outside', 'Feeling ill', 'Below the sky', 'In the rain'], correctAnswer: 'Feeling ill' },
        { type: 'build_sentence', prompt: 'would / I / if / I / you / apologize', correctAnswer: 'I would apologize if I were you' },
      ]),
    },
    {
      levelId: advancedLevel.id,
      type: 'midterm',
      title: 'Advanced Midterm Exam',
      titleEs: 'Examen Parcial Avanzado',
      description: 'Test your advanced English mastery',
      descriptionEs: 'Prueba tu dominio avanzado del inglés',
      minScore: 0.7,
      questions: JSON.stringify([
        { type: 'fill_blank', prompt: 'Had I known about the meeting, I ___ attended', correctAnswer: 'would have' },
        { type: 'multiple_choice', prompt: '"The ball is in your court" means:', options: ['Play tennis', 'It\'s your decision', 'Score a point', 'Game over'], correctAnswer: 'It\'s your decision' },
        { type: 'fill_blank', prompt: 'Not only ___ she intelligent, but she is also kind', correctAnswer: 'is' },
        { type: 'multiple_choice', prompt: 'Choose the correct inversion:', options: ['Rarely have I seen', 'Rarely I have seen', 'I rarely have seen', 'I have rarely seen'], correctAnswer: 'Rarely have I seen' },
        { type: 'fill_blank', prompt: 'The proposal ___ forward by the committee was rejected', correctAnswer: 'put' },
      ]),
    },
    {
      levelId: advancedLevel.id,
      type: 'final',
      title: 'Advanced Final Exam',
      titleEs: 'Examen Final Avanzado',
      description: 'Master-level English examination',
      descriptionEs: 'Examen de inglés de nivel maestro',
      minScore: 0.9,
      questions: JSON.stringify([
        { type: 'fill_blank', prompt: 'Were she ___ arrive early, we could start the meeting', correctAnswer: 'to' },
        { type: 'multiple_choice', prompt: '"Burn the midnight oil" means:', options: ['Start a fire', 'Work late into the night', 'Waste resources', 'Cook late'], correctAnswer: 'Work late into the night' },
        { type: 'fill_blank', prompt: 'At no time ___ I suggest that we should abandon the project', correctAnswer: 'did' },
        { type: 'multiple_choice', prompt: 'Which is a mixed conditional?', options: ['If I had studied, I would pass', 'If I study, I will pass', 'If I studied, I would pass', 'If I had studied, I would have passed'], correctAnswer: 'If I had studied, I would pass' },
        { type: 'find_error', prompt: 'The amount of people attending exceeded expectations', correctAnswer: 'The number of people attending exceeded expectations' },
        { type: 'fill_blank', prompt: 'So ___ was the impact that the policy was revised', correctAnswer: 'profound' },
        { type: 'multiple_choice', prompt: '"A blessing in disguise" refers to:', options: ['Hidden religious meaning', 'Something bad that turns out good', 'A surprise gift', 'Good luck charm'], correctAnswer: 'Something bad that turns out good' },
        { type: 'fill_blank', prompt: 'Little ___ they know what challenges lay ahead', correctAnswer: 'did' },
        { type: 'multiple_choice', prompt: 'Which uses the subjunctive correctly?', options: ['It is essential he be there', 'It is essential he is there', 'It is essential he was there', 'It is essential he will be there'], correctAnswer: 'It is essential he be there' },
        { type: 'build_sentence', prompt: 'not / until / we / arrived / did / the / ceremony / begin', correctAnswer: 'Not until we arrived did the ceremony begin' },
      ]),
    },
  ];

  for (const exam of exams) {
    await db.exam.create({ data: exam });
  }

  // ============================================
  // CREATE USER PROGRESS FOR DEMO USER
  // ============================================
  console.log('📊 Creating demo user progress...');
  const firstBasicScenarios = await db.scenario.findMany({
    where: { levelId: basicLevel.id },
    take: 5,
    orderBy: { order: 'asc' },
  });

  for (let i = 0; i < firstBasicScenarios.length; i++) {
    const s = firstBasicScenarios[i];
    const isCompleted = i < 3; // First 3 completed
    await db.userProgress.create({
      data: {
        userId: demoUser.id,
        scenarioId: s.id,
        status: isCompleted ? 'completed' : i === 3 ? 'in_progress' : 'unlocked',
        progress: isCompleted ? 100 : i === 3 ? 45 : 0,
        stars: isCompleted ? (i === 0 ? 3 : i === 1 ? 2 : 1) : 0,
        xpEarned: isCompleted ? s.xpReward : 0,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  // Create ranking entry
  await db.ranking.create({
    data: {
      userId: demoUser.id,
      type: 'global',
      xp: 250,
      rank: 1,
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`   Users: 2`);
  console.log(`   Levels: 3`);
  console.log(`   Scenarios: ${allScenarios.length}`);
  console.log(`   Achievements: ${achievements.length}`);
  console.log(`   Missions: ${missions.length}`);
  console.log(`   Rewards: ${rewards.length}`);
  console.log(`   Exams: ${exams.length}`);
}

// Helper function to generate questions for scenarios without specific templates
function generateQuestionsForScenario(
  scenario: { id: string; slug: string; name: string; nameEs: string; level: { slug: string } },
  lessonType: string,
  isBasic: boolean,
  isIntermediate: boolean
) {
  const questions: Array<{
    type: string;
    prompt: string;
    promptEs: string;
    hintEn: string;
    hintEs: string;
    audioText: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    explanationEs: string;
    points: number;
  }> = [];

  const topic = scenario.name;
  const topicEs = scenario.nameEs;

  if (lessonType === 'vocabulary') {
    // Vocabulary questions (8+ diverse types)
    questions.push({
      type: 'multiple_choice',
      prompt: `Which word is related to "${topic}"?`,
      promptEs: `¿Qué palabra está relacionada con "${topicEs}"?`,
      hintEn: `Think about things you find in ${topic.toLowerCase()} contexts`,
      hintEs: `Piensa en cosas que encuentras en contextos de ${topicEs.toLowerCase()}`,
      audioText: `Which word is related to ${topic}?`,
      options: '["Related word","Unrelated word","Random word","Wrong word"]',
      correctAnswer: 'Related word',
      explanation: `This word is commonly used when talking about ${topic.toLowerCase()}`,
      explanationEs: `Esta palabra se usa comúnmente cuando se habla de ${topicEs.toLowerCase()}`,
      points: 10,
    });
    questions.push({
      type: 'flashcard',
      prompt: `Learn: ${topic} vocabulary`,
      promptEs: `Aprende: vocabulario de ${topicEs}`,
      hintEn: 'Read and remember this word',
      hintEs: 'Lee y recuerda esta palabra',
      audioText: topic,
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `This is an important word related to ${topic.toLowerCase()}`,
      explanationEs: `Esta es una palabra importante relacionada con ${topicEs.toLowerCase()}`,
      points: 5,
    });
    questions.push({
      type: 'fill_blank',
      prompt: `I need to learn about ___ (${topic.toLowerCase()})`,
      promptEs: `Necesito aprender sobre ___ (${topicEs.toLowerCase()})`,
      hintEn: `The topic is ${topic}`,
      hintEs: `El tema es ${topicEs}`,
      audioText: `I need to learn about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `${topic} is the topic of this lesson`,
      explanationEs: `${topicEs} es el tema de esta lección`,
      points: 10,
    });
    questions.push({
      type: 'translate',
      prompt: `Translate to English: ${topicEs.toLowerCase()}`,
      promptEs: `Traduce al inglés: ${topicEs.toLowerCase()}`,
      hintEn: 'Think about the English equivalent',
      hintEs: 'Piensa en el equivalente en inglés',
      audioText: `Translate to English: ${topicEs.toLowerCase()}`,
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `${topicEs} = ${topic}`,
      explanationEs: `${topicEs} = ${topic}`,
      points: 10,
    });
    questions.push({
      type: 'listen_write',
      prompt: `Listen and write the word you hear about ${topic.toLowerCase()}`,
      promptEs: `Escucha y escribe la palabra que oyes sobre ${topicEs.toLowerCase()}`,
      hintEn: 'Listen carefully to the pronunciation',
      hintEs: 'Escucha cuidadosamente la pronunciación',
      audioText: topic.toLowerCase(),
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `The word is "${topic.toLowerCase()}"`,
      explanationEs: `La palabra es "${topic.toLowerCase()}"`,
      points: 15,
    });
    questions.push({
      type: 'pronunciation',
      prompt: `Practice saying: "${topic}"`,
      promptEs: `Practica decir: "${topicEs}"`,
      hintEn: 'Focus on clear pronunciation',
      hintEs: 'Enfócate en una pronunciación clara',
      audioText: topic,
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `Practice saying "${topic}" clearly`,
      explanationEs: `Practica decir "${topicEs}" claramente`,
      points: 10,
    });
    questions.push({
      type: 'match_concepts',
      prompt: `Match the ${topic.toLowerCase()} terms with their English names`,
      promptEs: `Relaciona los términos de ${topicEs.toLowerCase()} con sus nombres en inglés`,
      hintEn: `Connect each term with its correct English translation`,
      hintEs: `Conecta cada término con su traducción correcta al inglés`,
      audioText: `Match the ${topic.toLowerCase()} terms`,
      options: `["${topicEs}-${topic}","lección-lesson","palabra-word"]`,
      correctAnswer: `${topic.toLowerCase()} lesson word`,
      explanation: `These are key vocabulary words for the ${topic.toLowerCase()} topic`,
      explanationEs: `Estas son palabras clave del vocabulario para el tema de ${topicEs.toLowerCase()}`,
      points: 15,
    });
    questions.push({
      type: 'order_words',
      prompt: `Put these ${topic.toLowerCase()} words in the correct order: learn, I, about, want, to`,
      promptEs: `Pon estas palabras de ${topicEs.toLowerCase()} en el orden correcto: learn, I, about, want, to`,
      hintEn: 'Start with the subject, then the verb',
      hintEs: 'Empieza con el sujeto, luego el verbo',
      audioText: `I want to learn about ${topic.toLowerCase()}`,
      options: '["learn","I","about","want","to"]',
      correctAnswer: 'I want to learn about',
      explanation: `The correct sentence is "I want to learn about ${topic.toLowerCase()}"`,
      explanationEs: `La oración correcta es "I want to learn about ${topic.toLowerCase()}"`,
      points: 15,
    });
  } else if (lessonType === 'grammar') {
    // Grammar questions (8+ diverse types)
    questions.push({
      type: 'build_sentence',
      prompt: `Build a sentence about ${topic.toLowerCase()}`,
      promptEs: `Construye una oración sobre ${topicEs.toLowerCase()}`,
      hintEn: 'Put the words in the correct order',
      hintEs: 'Pon las palabras en el orden correcto',
      audioText: `Build a sentence about ${topic.toLowerCase()}`,
      options: '["I","like","learning","about"]',
      correctAnswer: 'I like learning about',
      explanation: `The correct sentence structure is: I like learning about ${topic.toLowerCase()}`,
      explanationEs: `La estructura correcta es: I like learning about ${topic.toLowerCase()}`,
      points: 15,
    });
    questions.push({
      type: 'find_error',
      prompt: isBasic
        ? `She go to ${topic.toLowerCase()} every day`
        : `She have went to ${topic.toLowerCase()} yesterday`,
      promptEs: isBasic
        ? `Ella va a ${topicEs.toLowerCase()} todos los días (encuentra el error)`
        : `Ella ha ido a ${topicEs.toLowerCase()} ayer (encuentra el error)`,
      hintEn: isBasic ? 'Check the verb form for third person' : 'Check the tense consistency',
      hintEs: isBasic ? 'Revisa la forma del verbo para tercera persona' : 'Revisa la consistencia del tiempo',
      audioText: isBasic ? 'She goes to the topic every day' : 'She went to the topic yesterday',
      options: '[]',
      correctAnswer: isBasic
        ? `She goes to ${topic.toLowerCase()} every day`
        : `She went to ${topic.toLowerCase()} yesterday`,
      explanation: isBasic ? 'Third person singular uses "goes" not "go"' : 'Past simple uses "went" not "have went"',
      explanationEs: isBasic ? 'Tercera persona singular usa "goes" no "go"' : 'Pasado simple usa "went" no "have went"',
      points: 15,
    });
    questions.push({
      type: 'multiple_choice',
      prompt: `Which sentence about ${topic.toLowerCase()} is correct?`,
      promptEs: `¿Qué oración sobre ${topicEs.toLowerCase()} es correcta?`,
      hintEn: 'Check grammar carefully',
      hintEs: 'Revisa la gramática con cuidado',
      audioText: `Which sentence about ${topic.toLowerCase()} is correct?`,
      options: '["Correct sentence","Wrong sentence 1","Wrong sentence 2","Wrong sentence 3"]',
      correctAnswer: 'Correct sentence',
      explanation: `This is the grammatically correct sentence`,
      explanationEs: `Esta es la oración gramaticalmente correcta`,
      points: 10,
    });
    questions.push({
      type: 'fill_blank',
      prompt: isBasic
        ? `I ___ learning about ${topic.toLowerCase()}`
        : `I have ___ about ${topic.toLowerCase()} recently`,
      promptEs: isBasic
        ? `Yo ___ aprendiendo sobre ${topicEs.toLowerCase()}`
        : `Yo he ___ sobre ${topicEs.toLowerCase()} recientemente`,
      hintEn: isBasic ? 'Use "am" for first person present continuous' : 'Use the past participle form',
      hintEs: isBasic ? 'Usa "am" para primera persona del presente continuo' : 'Usa la forma del participio pasado',
      audioText: isBasic ? `I am learning about ${topic.toLowerCase()}` : `I have learned about ${topic.toLowerCase()} recently`,
      options: '[]',
      correctAnswer: isBasic ? 'am' : 'learned',
      explanation: isBasic ? 'Use "am" with "learning" for present continuous' : 'Use "learned" as past participle with "have"',
      explanationEs: isBasic ? 'Usa "am" con "learning" para el presente continuo' : 'Usa "learned" como participio pasado con "have"',
      points: 10,
    });
    questions.push({
      type: 'translate',
      prompt: isBasic
        ? `Translate: Yo quiero aprender sobre ${topicEs.toLowerCase()}`
        : `Translate: Ella ha estudiado sobre ${topicEs.toLowerCase()}`,
      promptEs: isBasic
        ? `Traduce: Yo quiero aprender sobre ${topicEs.toLowerCase()}`
        : `Traduce: Ella ha estudiado sobre ${topicEs.toLowerCase()}`,
      hintEn: 'Think about the correct grammar structure in English',
      hintEs: 'Piensa en la estructura gramatical correcta en inglés',
      audioText: isBasic ? `I want to learn about ${topic.toLowerCase()}` : `She has studied about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: isBasic ? `I want to learn about ${topic.toLowerCase()}` : `She has studied about ${topic.toLowerCase()}`,
      explanation: `The correct translation uses proper English grammar`,
      explanationEs: `La traducción correcta usa la gramática apropiada del inglés`,
      points: 15,
    });
    questions.push({
      type: 'order_words',
      prompt: `Put these words in order: about / learning / I / enjoy / ${topic.toLowerCase()}`,
      promptEs: `Pon estas palabras en orden: about / learning / I / enjoy / ${topicEs.toLowerCase()}`,
      hintEn: 'Start with the subject, then verb, then object',
      hintEs: 'Empieza con el sujeto, luego el verbo, luego el objeto',
      audioText: `I enjoy learning about ${topic.toLowerCase()}`,
      options: `["about","learning","I","enjoy","${topic.toLowerCase()}"]`,
      correctAnswer: `I enjoy learning about ${topic.toLowerCase()}`,
      explanation: `The correct sentence is "I enjoy learning about ${topic.toLowerCase()}"`,
      explanationEs: `La oración correcta es "I enjoy learning about ${topicEs.toLowerCase()}"`,
      points: 15,
    });
    questions.push({
      type: 'listen_write',
      prompt: `Listen and write the sentence about ${topic.toLowerCase()}`,
      promptEs: `Escucha y escribe la oración sobre ${topicEs.toLowerCase()}`,
      hintEn: 'Pay attention to grammar and word order',
      hintEs: 'Presta atención a la gramática y el orden de las palabras',
      audioText: `I enjoy learning about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: `I enjoy learning about ${topic.toLowerCase()}`,
      explanation: `The correct transcription is: I enjoy learning about ${topic.toLowerCase()}`,
      explanationEs: `La transcripción correcta es: I enjoy learning about ${topicEs.toLowerCase()}`,
      points: 20,
    });
    questions.push({
      type: 'pronunciation',
      prompt: `Practice saying: I enjoy learning about ${topic.toLowerCase()}`,
      promptEs: `Practica diciendo: I enjoy learning about ${topicEs.toLowerCase()}`,
      hintEn: 'Focus on clear pronunciation and natural rhythm',
      hintEs: 'Enfócate en pronunciación clara y ritmo natural',
      audioText: `I enjoy learning about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: `I enjoy learning about ${topic.toLowerCase()}`,
      explanation: `Practice this sentence about ${topic.toLowerCase()} with clear pronunciation`,
      explanationEs: `Practica esta oración sobre ${topicEs.toLowerCase()} con pronunciación clara`,
      points: 10,
    });
  } else {
    // Conversation/Challenge (8+ diverse types)
    questions.push({
      type: 'multiple_choice',
      prompt: `In a ${topic.toLowerCase()} situation, what would you say?`,
      promptEs: `En una situación de ${topicEs.toLowerCase()}, ¿qué dirías?`,
      hintEn: 'Think about the appropriate response',
      hintEs: 'Piensa en la respuesta apropiada',
      audioText: `In a ${topic.toLowerCase()} situation, what would you say?`,
      options: '["Appropriate response","Wrong response 1","Wrong response 2","Wrong response 3"]',
      correctAnswer: 'Appropriate response',
      explanation: `This is the most appropriate response in a ${topic.toLowerCase()} context`,
      explanationEs: `Esta es la respuesta más apropiada en un contexto de ${topicEs.toLowerCase()}`,
      points: 10,
    });
    questions.push({
      type: 'listen_write',
      prompt: `Listen and write what you hear about ${topic.toLowerCase()}`,
      promptEs: `Escucha y escribe lo que oyes sobre ${topicEs.toLowerCase()}`,
      hintEn: 'Listen carefully to the pronunciation',
      hintEs: 'Escucha cuidadosamente la pronunciación',
      audioText: `I enjoy learning about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: `I enjoy learning about ${topic.toLowerCase()}`,
      explanation: `The correct transcription is: I enjoy learning about ${topic.toLowerCase()}`,
      explanationEs: `La transcripción correcta es: I enjoy learning about ${topicEs.toLowerCase()}`,
      points: 20,
    });
    questions.push({
      type: 'translate',
      prompt: isBasic
        ? `Translate to English: ${topicEs.toLowerCase()}`
        : `Translate: I want to learn more about ${topicEs.toLowerCase()}`,
      promptEs: isBasic
        ? `Traduce al inglés: ${topicEs.toLowerCase()}`
        : `Traduce: I want to learn more about ${topicEs.toLowerCase()}`,
      hintEn: 'Think about the English equivalent',
      hintEs: 'Piensa en el equivalente en inglés',
      audioText: isBasic ? topic.toLowerCase() : `I want to learn more about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: isBasic ? topic.toLowerCase() : `I want to learn more about ${topic.toLowerCase()}`,
      explanation: `The correct translation involves the vocabulary for ${topic.toLowerCase()}`,
      explanationEs: `La traducción correcta involucra el vocabulario de ${topicEs.toLowerCase()}`,
      points: 15,
    });
    questions.push({
      type: 'pronunciation',
      prompt: `Practice saying: "${topic}"`,
      promptEs: `Practica decir: "${topicEs}"`,
      hintEn: 'Focus on clear pronunciation',
      hintEs: 'Enfócate en una pronunciación clara',
      audioText: topic,
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `Practice saying "${topic}" clearly`,
      explanationEs: `Practica decir "${topicEs}" claramente`,
      points: 10,
    });
    questions.push({
      type: 'build_sentence',
      prompt: `Build a conversation starter about ${topic.toLowerCase()}: I / want / to / talk / about`,
      promptEs: `Construye un inicio de conversación sobre ${topicEs.toLowerCase()}: I / want / to / talk / about`,
      hintEn: 'Subject + verb + infinitive phrase',
      hintEs: 'Sujeto + verbo + frase infinitiva',
      audioText: `I want to talk about ${topic.toLowerCase()}`,
      options: '["I","want","to","talk","about"]',
      correctAnswer: 'I want to talk about',
      explanation: `The correct sentence is "I want to talk about ${topic.toLowerCase()}"`,
      explanationEs: `La oración correcta es "I want to talk about ${topicEs.toLowerCase()}"`,
      points: 15,
    });
    questions.push({
      type: 'find_error',
      prompt: isBasic
        ? `Find the mistake: I is learning about ${topic.toLowerCase()}`
        : `Find the mistake: She don't like talking about ${topic.toLowerCase()}`,
      promptEs: isBasic
        ? `Encuentra el error: I is learning about ${topicEs.toLowerCase()}`
        : `Encuentra el error: She don't like talking about ${topicEs.toLowerCase()}`,
      hintEn: isBasic ? 'Check the verb "to be" for "I"' : "Third person singular needs doesn't",
      hintEs: isBasic ? 'Revisa el verbo "to be" para "I"' : "Tercera persona singular necesita doesn't",
      audioText: isBasic ? `I am learning about ${topic.toLowerCase()}` : `She doesn't like talking about ${topic.toLowerCase()}`,
      options: '[]',
      correctAnswer: isBasic
        ? `I am learning about ${topic.toLowerCase()}`
        : `She doesn't like talking about ${topic.toLowerCase()}`,
      explanation: isBasic ? 'Use "am" with "I", not "is"' : "Use doesn't for third person negative, not don't",
      explanationEs: isBasic ? 'Usa "am" con "I", no "is"' : "Usa doesn't para negación en tercera persona, no don't",
      points: 15,
    });
    questions.push({
      type: 'order_words',
      prompt: `Put these words in order to ask about ${topic.toLowerCase()}: about / you / do / know / ${topic.toLowerCase()}`,
      promptEs: `Pon estas palabras en orden para preguntar sobre ${topicEs.toLowerCase()}: about / you / do / know / ${topicEs.toLowerCase()}`,
      hintEn: 'This is a question - start with the auxiliary verb',
      hintEs: 'Esta es una pregunta - empieza con el verbo auxiliar',
      audioText: `Do you know about ${topic.toLowerCase()}?`,
      options: `["about","you","do","know","${topic.toLowerCase()}"]`,
      correctAnswer: `do you know about ${topic.toLowerCase()}`,
      explanation: `The correct question is "Do you know about ${topic.toLowerCase()}?"`,
      explanationEs: `La pregunta correcta es "Do you know about ${topicEs.toLowerCase()}?"`,
      points: 15,
    });
    questions.push({
      type: 'flashcard',
      prompt: `${topic} - key conversation phrase`,
      promptEs: `${topicEs} - frase clave de conversación`,
      hintEn: 'Remember this useful phrase for conversations',
      hintEs: 'Recuerda esta frase útil para conversaciones',
      audioText: topic,
      options: '[]',
      correctAnswer: topic.toLowerCase(),
      explanation: `This is a key phrase when discussing ${topic.toLowerCase()}`,
      explanationEs: `Esta es una frase clave al discutir ${topicEs.toLowerCase()}`,
      points: 5,
    });
    questions.push({
      type: 'match_concepts',
      prompt: `Match the ${topic.toLowerCase()} conversation phrases with their meanings`,
      promptEs: `Relaciona las frases de conversación de ${topicEs.toLowerCase()} con sus significados`,
      hintEn: 'Connect each phrase with its correct meaning',
      hintEs: 'Conecta cada frase con su significado correcto',
      audioText: `Match the ${topic.toLowerCase()} phrases`,
      options: `["tell me-cuéntame","I think-creo","let's talk-hablemos"]`,
      correctAnswer: "tell me I think let's talk",
      explanation: `These are useful conversation phrases related to ${topic.toLowerCase()}`,
      explanationEs: `Estas son frases de conversación útiles relacionadas con ${topicEs.toLowerCase()}`,
      points: 15,
    });
  }

    return questions;
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
