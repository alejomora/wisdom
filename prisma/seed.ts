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
    { slug: 'avatar-fox', name: 'Fox Avatar', nameEs: 'Avatar Zorro', description: 'A clever fox avatar', descriptionEs: 'Un avatar de zorro astuto', type: 'avatar', icon: '🦊', cost: 250, rarity: 'common' },
    { slug: 'avatar-cat', name: 'Cat Avatar', nameEs: 'Avatar Gato', description: 'A cute cat avatar', descriptionEs: 'Un avatar de gato adorable', type: 'avatar', icon: '🐱', cost: 250, rarity: 'common' },
    { slug: 'avatar-dog', name: 'Dog Avatar', nameEs: 'Avatar Perro', description: 'A loyal dog avatar', descriptionEs: 'Un avatar de perro leal', type: 'avatar', icon: '🐶', cost: 300, rarity: 'common' },
    { slug: 'avatar-bear', name: 'Bear Avatar', nameEs: 'Avatar Oso', description: 'A strong bear avatar', descriptionEs: 'Un avatar de oso fuerte', type: 'avatar', icon: '🐻', cost: 350, rarity: 'common' },
    { slug: 'avatar-rabbit', name: 'Rabbit Avatar', nameEs: 'Avatar Conejo', description: 'A quick rabbit avatar', descriptionEs: 'Un avatar de conejo veloz', type: 'avatar', icon: '🐰', cost: 350, rarity: 'common' },
    { slug: 'avatar-panda', name: 'Panda Avatar', nameEs: 'Avatar Panda', description: 'A chill panda avatar', descriptionEs: 'Un avatar de panda relajado', type: 'avatar', icon: '🐼', cost: 450, rarity: 'common' },
    { slug: 'avatar-penguin', name: 'Penguin Avatar', nameEs: 'Avatar Pingüino', description: 'A dapper penguin avatar', descriptionEs: 'Un avatar de pingüino elegante', type: 'avatar', icon: '🐧', cost: 450, rarity: 'common' },
    { slug: 'avatar-owl', name: 'Owl Avatar', nameEs: 'Avatar Búho', description: 'A wise owl avatar', descriptionEs: 'Un avatar de búho sabio', type: 'avatar', icon: '🦉', cost: 550, rarity: 'common' },
    { slug: 'avatar-frog', name: 'Frog Avatar', nameEs: 'Avatar Rana', description: 'A funny frog avatar', descriptionEs: 'Un avatar de rana divertido', type: 'avatar', icon: '🐸', cost: 550, rarity: 'common' },
    { slug: 'avatar-monkey', name: 'Monkey Avatar', nameEs: 'Avatar Mono', description: 'A playful monkey avatar', descriptionEs: 'Un avatar de mono juguetón', type: 'avatar', icon: '🐒', cost: 600, rarity: 'common' },
    // ── AVATARS (Rare) ──
    { slug: 'avatar-tiger', name: 'Tiger Avatar', nameEs: 'Avatar Tigre', description: 'A fierce tiger avatar', descriptionEs: 'Un avatar de tigre feroz', type: 'avatar', icon: '🐯', cost: 900, rarity: 'rare' },
    { slug: 'avatar-lion', name: 'Lion Avatar', nameEs: 'Avatar León', description: 'The king of the jungle', descriptionEs: 'El rey de la selva', type: 'avatar', icon: '🦁', cost: 1000, rarity: 'rare' },
    { slug: 'avatar-wolf', name: 'Wolf Avatar', nameEs: 'Avatar Lobo', description: 'A fierce wolf avatar', descriptionEs: 'Un avatar de lobo feroz', type: 'avatar', icon: '🐺', cost: 900, rarity: 'rare' },
    { slug: 'avatar-eagle', name: 'Eagle Avatar', nameEs: 'Avatar Águila', description: 'Soar above the rest', descriptionEs: 'Vuela por encima del resto', type: 'avatar', icon: '🦅', cost: 950, rarity: 'rare' },
    { slug: 'avatar-dolphin', name: 'Dolphin Avatar', nameEs: 'Avatar Delfín', description: 'A smart dolphin avatar', descriptionEs: 'Un avatar de delfín inteligente', type: 'avatar', icon: '🐬', cost: 950, rarity: 'rare' },
    { slug: 'avatar-horse', name: 'Horse Avatar', nameEs: 'Avatar Caballo', description: 'A majestic horse avatar', descriptionEs: 'Un avatar de caballo majestuoso', type: 'avatar', icon: '🐴', cost: 1000, rarity: 'rare' },
    { slug: 'avatar-gorilla', name: 'Gorilla Avatar', nameEs: 'Avatar Gorila', description: 'A powerful gorilla avatar', descriptionEs: 'Un avatar de gorila poderoso', type: 'avatar', icon: '🦍', cost: 1100, rarity: 'rare' },
    { slug: 'avatar-shark', name: 'Shark Avatar', nameEs: 'Avatar Tiburón', description: 'Rule the ocean', descriptionEs: 'Domina el océano', type: 'avatar', icon: '🦈', cost: 1100, rarity: 'rare' },
    { slug: 'avatar-octopus', name: 'Octopus Avatar', nameEs: 'Avatar Pulpo', description: 'Multitask like a pro', descriptionEs: 'Multitarea como un profesional', type: 'avatar', icon: '🐙', cost: 1200, rarity: 'rare' },
    { slug: 'avatar-parrot', name: 'Parrot Avatar', nameEs: 'Avatar Loro', description: 'Speak many languages', descriptionEs: 'Habla muchos idiomas', type: 'avatar', icon: '🦜', cost: 1200, rarity: 'rare' },
    // ── AVATARS (Epic) ──
    { slug: 'avatar-dragon', name: 'Dragon Avatar', nameEs: 'Avatar Dragón', description: 'A legendary dragon avatar', descriptionEs: 'Un avatar de dragón legendario', type: 'avatar', icon: '🐉', cost: 1800, rarity: 'epic' },
    { slug: 'avatar-phoenix', name: 'Phoenix Avatar', nameEs: 'Avatar Fénix', description: 'Rise from the ashes', descriptionEs: 'Renace de las cenizas', type: 'avatar', icon: '🔥', cost: 2000, rarity: 'epic' },
    { slug: 'avatar-robot', name: 'Robot Avatar', nameEs: 'Avatar Robot', description: 'Future is now', descriptionEs: 'El futuro es ahora', type: 'avatar', icon: '🤖', cost: 1800, rarity: 'epic' },
    { slug: 'avatar-alien', name: 'Alien Avatar', nameEs: 'Avatar Alienígena', description: 'Out of this world', descriptionEs: 'Fuera de este mundo', type: 'avatar', icon: '👽', cost: 1900, rarity: 'epic' },
    { slug: 'avatar-ninja', name: 'Ninja Avatar', nameEs: 'Avatar Ninja', description: 'Silent and deadly', descriptionEs: 'Silencioso y letal', type: 'avatar', icon: '🥷', cost: 2000, rarity: 'epic' },
    { slug: 'avatar-wizard', name: 'Wizard Avatar', nameEs: 'Avatar Mago', description: 'Master of spells', descriptionEs: 'Maestro de hechizos', type: 'avatar', icon: '🧙', cost: 2100, rarity: 'epic' },
    { slug: 'avatar-astronaut', name: 'Astronaut Avatar', nameEs: 'Avatar Astronauta', description: 'To infinity and beyond', descriptionEs: 'Hasta el infinito y más allá', type: 'avatar', icon: '👨‍🚀', cost: 2200, rarity: 'epic' },
    { slug: 'avatar-superhero', name: 'Superhero Avatar', nameEs: 'Avatar Superhéroe', description: 'Save the day', descriptionEs: 'Salva el día', type: 'avatar', icon: '🦸', cost: 2400, rarity: 'epic' },
    // ── AVATARS (Legendary) ──
    { slug: 'avatar-unicorn', name: 'Unicorn Avatar', nameEs: 'Avatar Unicornio', description: 'A magical unicorn avatar', descriptionEs: 'Un avatar de unicornio mágico', type: 'avatar', icon: '🦄', cost: 4000, rarity: 'legendary' },
    { slug: 'avatar-crown', name: 'Crown Avatar', nameEs: 'Avatar Corona', description: 'Royal and majestic', descriptionEs: 'Real y majestuoso', type: 'avatar', icon: '👑', cost: 5000, rarity: 'legendary' },
    { slug: 'avatar-diamond', name: 'Diamond Avatar', nameEs: 'Avatar Diamante', description: 'Unbreakable brilliance', descriptionEs: 'Brillantez irrompible', type: 'avatar', icon: '💎', cost: 6000, rarity: 'legendary' },
    { slug: 'avatar-sun', name: 'Sun Avatar', nameEs: 'Avatar Sol', description: 'Shine like the sun', descriptionEs: 'Brilla como el sol', type: 'avatar', icon: '☀️', cost: 7000, rarity: 'legendary' },
    { slug: 'avatar-galaxy', name: 'Galaxy Avatar', nameEs: 'Avatar Galaxia', description: 'The universe within you', descriptionEs: 'El universo dentro de ti', type: 'avatar', icon: '🌌', cost: 10000, rarity: 'legendary' },

    // ── FRAMES (Common) ──
    { slug: 'frame-silver', name: 'Silver Frame', nameEs: 'Marco Plateado', description: 'A classic silver frame', descriptionEs: 'Un marco plateado clásico', type: 'frame', icon: '🪙', cost: 450, rarity: 'common' },
    { slug: 'frame-bronze', name: 'Bronze Frame', nameEs: 'Marco Bronce', description: 'A warm bronze frame', descriptionEs: 'Un marco de bronce cálido', type: 'frame', icon: '🥉', cost: 550, rarity: 'common' },
    { slug: 'frame-leaf', name: 'Leaf Frame', nameEs: 'Marco Hoja', description: 'A nature-inspired frame', descriptionEs: 'Un marco inspirado en la naturaleza', type: 'frame', icon: '🍃', cost: 600, rarity: 'common' },
    { slug: 'frame-wave', name: 'Wave Frame', nameEs: 'Marco Onda', description: 'Flow like the ocean', descriptionEs: 'Fluye como el océano', type: 'frame', icon: '🌊', cost: 600, rarity: 'common' },
    // ── FRAMES (Rare) ──
    { slug: 'frame-gold', name: 'Gold Frame', nameEs: 'Marco Dorado', description: 'A shiny gold frame for your avatar', descriptionEs: 'Un marco dorado brillante para tu avatar', type: 'frame', icon: '🖼️', cost: 1250, rarity: 'rare' },
    { slug: 'frame-thunder', name: 'Thunder Frame', nameEs: 'Marco Trueno', description: 'Electric energy frame', descriptionEs: 'Marco de energía eléctrica', type: 'frame', icon: '⚡', cost: 1400, rarity: 'rare' },
    { slug: 'frame-rose', name: 'Rose Frame', nameEs: 'Marco Rosa', description: 'Elegant rose frame', descriptionEs: 'Marco de rosa elegante', type: 'frame', icon: '🌹', cost: 1250, rarity: 'rare' },
    { slug: 'frame-snowflake', name: 'Snowflake Frame', nameEs: 'Marco Copo de Nieve', description: 'Frozen beauty frame', descriptionEs: 'Marco de belleza congelada', type: 'frame', icon: '❄️', cost: 1400, rarity: 'rare' },
    { slug: 'frame-rainbow', name: 'Rainbow Frame', nameEs: 'Marco Arcoíris', description: 'Colorful rainbow frame', descriptionEs: 'Marco arcoíris colorido', type: 'frame', icon: '🌈', cost: 1500, rarity: 'rare' },
    { slug: 'frame-star', name: 'Star Frame', nameEs: 'Marco Estrella', description: 'Shine bright like a star', descriptionEs: 'Brilla como una estrella', type: 'frame', icon: '⭐', cost: 1600, rarity: 'rare' },
    // ── FRAMES (Epic) ──
    { slug: 'frame-diamond', name: 'Diamond Frame', nameEs: 'Marco Diamante', description: 'A sparkling diamond frame', descriptionEs: 'Un marco de diamante brillante', type: 'frame', icon: '💎', cost: 2200, rarity: 'epic' },
    { slug: 'frame-fire', name: 'Fire Frame', nameEs: 'Marco de Fuego', description: 'A blazing fire frame', descriptionEs: 'Un marco de fuego ardiente', type: 'frame', icon: '🔥', cost: 2000, rarity: 'epic' },
    { slug: 'frame-neon', name: 'Neon Frame', nameEs: 'Marco Neón', description: 'Glow in the dark', descriptionEs: 'Brilla en la oscuridad', type: 'frame', icon: '💡', cost: 2100, rarity: 'epic' },
    { slug: 'frame-crown', name: 'Crown Frame', nameEs: 'Marco Corona', description: 'Rule with style', descriptionEs: 'Gobierna con estilo', type: 'frame', icon: '👑', cost: 2200, rarity: 'epic' },
    { slug: 'frame-cosmic', name: 'Cosmic Frame', nameEs: 'Marco Cósmico', description: 'The power of the cosmos', descriptionEs: 'El poder del cosmos', type: 'frame', icon: '🌌', cost: 2400, rarity: 'epic' },
    // ── FRAMES (Legendary) ──
    { slug: 'frame-legendary', name: 'Legendary Frame', nameEs: 'Marco Legendario', description: 'Only for legends', descriptionEs: 'Solo para leyendas', type: 'frame', icon: '🏆', cost: 5000, rarity: 'legendary' },
    { slug: 'frame-eternal', name: 'Eternal Frame', nameEs: 'Marco Eterno', description: 'Timeless and infinite', descriptionEs: 'Atemporal e infinito', type: 'frame', icon: '♾️', cost: 7000, rarity: 'legendary' },
    { slug: 'frame-chaos', name: 'Chaos Frame', nameEs: 'Marco Caos', description: 'Embrace the chaos', descriptionEs: 'Abraza el caos', type: 'frame', icon: '🌀', cost: 6000, rarity: 'legendary' },

    // ── TITLES (Common) ──
    { slug: 'title-beginner', name: 'Beginner', nameEs: 'Principiante', description: 'Just starting out', descriptionEs: 'Recién comenzando', type: 'title', icon: '🌱', cost: 300, rarity: 'common' },
    { slug: 'title-learner', name: 'Learner', nameEs: 'Aprendiz', description: 'Eager to learn', descriptionEs: 'Ansioso por aprender', type: 'title', icon: '📚', cost: 350, rarity: 'common' },
    { slug: 'title-student', name: 'Student', nameEs: 'Estudiante', description: 'Dedicated student', descriptionEs: 'Estudiante dedicado', type: 'title', icon: '🎓', cost: 450, rarity: 'common' },
    { slug: 'title-explorer', name: 'Explorer', nameEs: 'Explorador', description: 'Explore new words', descriptionEs: 'Explora nuevas palabras', type: 'title', icon: '🧭', cost: 550, rarity: 'common' },
    // ── TITLES (Rare) ──
    { slug: 'title-word-master', name: 'Word Master', nameEs: 'Maestro de Palabras', description: 'A prestigious title', descriptionEs: 'Un título prestigioso', type: 'title', icon: '📝', cost: 1500, rarity: 'rare' },
    { slug: 'title-grammar-guru', name: 'Grammar Guru', nameEs: 'Gurú de Gramática', description: 'Master of grammar', descriptionEs: 'Maestro de la gramática', type: 'title', icon: '📖', cost: 1500, rarity: 'rare' },
    { slug: 'title-vocabulary-king', name: 'Vocabulary King', nameEs: 'Rey del Vocabulario', description: 'Rule the words', descriptionEs: 'Domina las palabras', type: 'title', icon: '👑', cost: 1750, rarity: 'rare' },
    { slug: 'title-listener', name: 'Sharp Listener', nameEs: 'Oyente Agudo', description: 'Hear every detail', descriptionEs: 'Escucha cada detalle', type: 'title', icon: '👂', cost: 1600, rarity: 'rare' },
    { slug: 'title-challenger', name: 'Challenger', nameEs: 'Desafiante', description: 'Never backs down', descriptionEs: 'Nunca se rinde', type: 'title', icon: '⚔️', cost: 1750, rarity: 'rare' },
    { slug: 'title-linguist', name: 'Linguist', nameEs: 'Lingüista', description: 'Language expert', descriptionEs: 'Experto en idiomas', type: 'title', icon: '🗣️', cost: 1900, rarity: 'rare' },
    // ── TITLES (Epic) ──
    { slug: 'title-polyglot', name: 'Polyglot', nameEs: 'Políglota', description: 'Master of languages', descriptionEs: 'Maestro de idiomas', type: 'title', icon: '🌐', cost: 2400, rarity: 'epic' },
    { slug: 'title-wordsmith', name: 'Wordsmith', nameEs: 'Forjador de Palabras', description: 'Craft words with precision', descriptionEs: 'Forja palabras con precisión', type: 'title', icon: '⚒️', cost: 2600, rarity: 'epic' },
    { slug: 'title-scholar', name: 'Scholar', nameEs: 'Erudito', description: 'Academic excellence', descriptionEs: 'Excelencia académica', type: 'title', icon: '🏛️', cost: 2800, rarity: 'epic' },
    { slug: 'title-mentor', name: 'Mentor', nameEs: 'Mentor', description: 'Guide others to success', descriptionEs: 'Guía a otros al éxito', type: 'title', icon: '🧑‍🏫', cost: 2800, rarity: 'epic' },
    // ── TITLES (Legendary) ──
    { slug: 'title-fluent', name: 'Fluent Speaker', nameEs: 'Hablante Fluido', description: 'Speak like a native', descriptionEs: 'Habla como un nativo', type: 'title', icon: '🗣️', cost: 5000, rarity: 'legendary' },
    { slug: 'title-legend', name: 'Legend', nameEs: 'Leyenda', description: 'A true legend', descriptionEs: 'Una verdadera leyenda', type: 'title', icon: '⚡', cost: 7000, rarity: 'legendary' },
    { slug: 'title-grand-master', name: 'Grand Master', nameEs: 'Gran Maestro', description: 'The ultimate achievement', descriptionEs: 'El logro definitivo', type: 'title', icon: '🌟', cost: 10000, rarity: 'legendary' },
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

  // Create scenario-level progress records (scenarioId set, NO lessonId)
  // AND lesson-level progress records (lessonId set, NO scenarioId)
  // These MUST be separate records to avoid unique constraint conflicts
  for (let i = 0; i < firstBasicScenarios.length; i++) {
    const s = firstBasicScenarios[i];
    const isCompleted = i < 3; // First 3 completed

    // Scenario progress record
    await db.userProgress.create({
      data: {
        userId: demoUser.id,
        scenarioId: s.id,
        // DO NOT set lessonId here
        status: isCompleted ? 'completed' : i === 3 ? 'in_progress' : 'unlocked',
        progress: isCompleted ? 100 : i === 3 ? 45 : 0,
        stars: isCompleted ? (i === 0 ? 3 : i === 1 ? 2 : 1) : 0,
        xpEarned: isCompleted ? s.xpReward : 0,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Lesson progress records for completed/in-progress scenarios
    if (isCompleted || i === 3) {
      const lessonsInScenario = await db.lesson.findMany({
        where: { scenarioId: s.id },
        orderBy: { order: 'asc' },
        ...(i === 3 ? { take: 1 } : {}), // Only first lesson for in-progress
      });
      for (const lesson of lessonsInScenario) {
        await db.userProgress.create({
          data: {
            userId: demoUser.id,
            lessonId: lesson.id,
            // DO NOT set scenarioId here - it would conflict with scenario progress records
            status: 'completed',
            progress: 100,
            stars: i === 0 ? 3 : i === 1 ? 2 : 1,
            xpEarned: lesson.xpReward,
            completedAt: new Date(),
          },
        });
      }
    }
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
// Vocabulary data for each scenario - real English-Spanish word pairs
const scenarioVocabulary: Record<string, Array<{ en: string; es: string }>> = {
  // ── BASIC SCENARIOS ──
  'family': [
    { en: 'mother', es: 'madre' }, { en: 'father', es: 'padre' }, { en: 'brother', es: 'hermano' },
    { en: 'sister', es: 'hermana' }, { en: 'grandmother', es: 'abuela' }, { en: 'grandfather', es: 'abuelo' },
    { en: 'uncle', es: 'tío' }, { en: 'aunt', es: 'tía' }, { en: 'cousin', es: 'primo' },
    { en: 'daughter', es: 'hija' }, { en: 'son', es: 'hijo' }, { en: 'husband', es: 'esposo' },
    { en: 'wife', es: 'esposa' }, { en: 'parents', es: 'padres' }, { en: 'baby', es: 'bebé' },
  ],
  'food': [
    { en: 'bread', es: 'pan' }, { en: 'rice', es: 'arroz' }, { en: 'chicken', es: 'pollo' },
    { en: 'fish', es: 'pescado' }, { en: 'milk', es: 'leche' }, { en: 'cheese', es: 'queso' },
    { en: 'egg', es: 'huevo' }, { en: 'apple', es: 'manzana' }, { en: 'banana', es: 'plátano' },
    { en: 'orange', es: 'naranja' }, { en: 'potato', es: 'papa' }, { en: 'tomato', es: 'tomate' },
    { en: 'water', es: 'agua' }, { en: 'sugar', es: 'azúcar' }, { en: 'salt', es: 'sal' },
  ],
  'animals': [
    { en: 'dog', es: 'perro' }, { en: 'cat', es: 'gato' }, { en: 'bird', es: 'pájaro' },
    { en: 'horse', es: 'caballo' }, { en: 'cow', es: 'vaca' }, { en: 'pig', es: 'cerdo' },
    { en: 'sheep', es: 'oveja' }, { en: 'duck', es: 'pato' }, { en: 'rabbit', es: 'conejo' },
    { en: 'mouse', es: 'ratón' }, { en: 'snake', es: 'serpiente' }, { en: 'elephant', es: 'elefante' },
    { en: 'lion', es: 'león' }, { en: 'bear', es: 'oso' }, { en: 'whale', es: 'ballena' },
  ],
  'school': [
    { en: 'teacher', es: 'profesor' }, { en: 'student', es: 'estudiante' }, { en: 'book', es: 'libro' },
    { en: 'pencil', es: 'lápiz' }, { en: 'desk', es: 'escritorio' }, { en: 'homework', es: 'tarea' },
    { en: 'classroom', es: 'aula' }, { en: 'exam', es: 'examen' }, { en: 'library', es: 'biblioteca' },
    { en: 'eraser', es: 'borrador' }, { en: 'notebook', es: 'cuaderno' }, { en: 'ruler', es: 'regla' },
    { en: 'backpack', es: 'mochila' }, { en: 'lesson', es: 'lección' }, { en: 'subject', es: 'materia' },
  ],
  'house': [
    { en: 'kitchen', es: 'cocina' }, { en: 'bedroom', es: 'dormitorio' }, { en: 'bathroom', es: 'baño' },
    { en: 'living room', es: 'sala' }, { en: 'door', es: 'puerta' }, { en: 'window', es: 'ventana' },
    { en: 'table', es: 'mesa' }, { en: 'chair', es: 'silla' }, { en: 'bed', es: 'cama' },
    { en: 'sofa', es: 'sofá' }, { en: 'refrigerator', es: 'refrigerador' }, { en: 'stairs', es: 'escaleras' },
    { en: 'roof', es: 'techo' }, { en: 'garden', es: 'jardín' }, { en: 'garage', es: 'garaje' },
  ],
  'clothes': [
    { en: 'shirt', es: 'camisa' }, { en: 'pants', es: 'pantalones' }, { en: 'dress', es: 'vestido' },
    { en: 'skirt', es: 'falda' }, { en: 'jacket', es: 'chaqueta' }, { en: 'shoes', es: 'zapatos' },
    { en: 'hat', es: 'sombrero' }, { en: 'socks', es: 'calcetines' }, { en: 'coat', es: 'abrigo' },
    { en: 'belt', es: 'cinturón' }, { en: 'gloves', es: 'guantes' }, { en: 'boots', es: 'botas' },
    { en: 'scarf', es: 'bufanda' }, { en: 'sweater', es: 'suéter' }, { en: 'tie', es: 'corbata' },
  ],
  'transportation': [
    { en: 'car', es: 'auto' }, { en: 'bus', es: 'autobús' }, { en: 'train', es: 'tren' },
    { en: 'airplane', es: 'avión' }, { en: 'bicycle', es: 'bicicleta' }, { en: 'boat', es: 'barco' },
    { en: 'taxi', es: 'taxi' }, { en: 'motorcycle', es: 'motocicleta' }, { en: 'subway', es: 'metro' },
    { en: 'truck', es: 'camión' }, { en: 'helicopter', es: 'helicóptero' }, { en: 'ship', es: 'barco' },
    { en: 'station', es: 'estación' }, { en: 'airport', es: 'aeropuerto' }, { en: 'ticket', es: 'boleto' },
  ],
  'body-parts': [
    { en: 'head', es: 'cabeza' }, { en: 'arm', es: 'brazo' }, { en: 'leg', es: 'pierna' },
    { en: 'hand', es: 'mano' }, { en: 'foot', es: 'pie' }, { en: 'eye', es: 'ojo' },
    { en: 'ear', es: 'oreja' }, { en: 'nose', es: 'nariz' }, { en: 'mouth', es: 'boca' },
    { en: 'shoulder', es: 'hombro' }, { en: 'knee', es: 'rodilla' }, { en: 'finger', es: 'dedo' },
    { en: 'heart', es: 'corazón' }, { en: 'stomach', es: 'estómago' }, { en: 'back', es: 'espalda' },
  ],
  'daily-routine': [
    { en: 'wake up', es: 'despertarse' }, { en: 'shower', es: 'ducha' }, { en: 'breakfast', es: 'desayuno' },
    { en: 'brush teeth', es: 'cepillarse los dientes' }, { en: 'commute', es: 'viaje al trabajo' },
    { en: 'lunch', es: 'almuerzo' }, { en: 'dinner', es: 'cena' }, { en: 'sleep', es: 'dormir' },
    { en: 'exercise', es: 'ejercicio' }, { en: 'work', es: 'trabajar' }, { en: 'study', es: 'estudiar' },
    { en: 'cook', es: 'cocinar' }, { en: 'clean', es: 'limpiar' }, { en: 'rest', es: 'descansar' },
    { en: 'get dressed', es: 'vestirse' },
  ],
  'time': [
    { en: 'morning', es: 'mañana' }, { en: 'afternoon', es: 'tarde' }, { en: 'evening', es: 'noche' },
    { en: 'midnight', es: 'medianoche' }, { en: 'today', es: 'hoy' }, { en: 'tomorrow', es: 'mañana' },
    { en: 'yesterday', es: 'ayer' }, { en: 'week', es: 'semana' }, { en: 'month', es: 'mes' },
    { en: 'year', es: 'año' }, { en: 'hour', es: 'hora' }, { en: 'minute', es: 'minuto' },
    { en: 'second', es: 'segundo' }, { en: 'Monday', es: 'lunes' }, { en: 'clock', es: 'reloj' },
  ],
  'weather': [
    { en: 'rain', es: 'lluvia' }, { en: 'sun', es: 'sol' }, { en: 'cloud', es: 'nube' },
    { en: 'snow', es: 'nieve' }, { en: 'wind', es: 'viento' }, { en: 'storm', es: 'tormenta' },
    { en: 'temperature', es: 'temperatura' }, { en: 'hot', es: 'caliente' }, { en: 'cold', es: 'frío' },
    { en: 'fog', es: 'niebla' }, { en: 'thunder', es: 'trueno' }, { en: 'lightning', es: 'relámpago' },
    { en: 'hurricane', es: 'huracán' }, { en: 'sunny', es: 'soleado' }, { en: 'cloudy', es: 'nublado' },
  ],
  'shopping': [
    { en: 'price', es: 'precio' }, { en: 'discount', es: 'descuento' }, { en: 'receipt', es: 'recibo' },
    { en: 'cash', es: 'efectivo' }, { en: 'credit card', es: 'tarjeta de crédito' }, { en: 'store', es: 'tienda' },
    { en: 'size', es: 'talla' }, { en: 'sale', es: 'oferta' }, { en: 'customer', es: 'cliente' },
    { en: 'bag', es: 'bolsa' }, { en: 'change', es: 'cambio' }, { en: 'expensive', es: 'caro' },
    { en: 'cheap', es: 'barato' }, { en: 'shopping cart', es: 'carrito' }, { en: 'brand', es: 'marca' },
  ],
  'restaurant': [
    { en: 'menu', es: 'menú' }, { en: 'waiter', es: 'mesero' }, { en: 'order', es: 'pedido' },
    { en: 'bill', es: 'cuenta' }, { en: 'tip', es: 'propina' }, { en: 'appetizer', es: 'entrada' },
    { en: 'dessert', es: 'postre' }, { en: 'beverage', es: 'bebida' }, { en: 'reservation', es: 'reservación' },
    { en: 'plate', es: 'plato' }, { en: 'fork', es: 'tenedor' }, { en: 'knife', es: 'cuchillo' },
    { en: 'spoon', es: 'cuchara' }, { en: 'napkin', es: 'servilleta' }, { en: 'chef', es: 'chef' },
  ],
  'work': [
    { en: 'office', es: 'oficina' }, { en: 'meeting', es: 'reunión' }, { en: 'salary', es: 'salario' },
    { en: 'boss', es: 'jefe' }, { en: 'colleague', es: 'colega' }, { en: 'deadline', es: 'fecha límite' },
    { en: 'project', es: 'proyecto' }, { en: 'email', es: 'correo' }, { en: 'schedule', es: 'horario' },
    { en: 'contract', es: 'contrato' }, { en: 'resume', es: 'currículum' }, { en: 'interview', es: 'entrevista' },
    { en: 'promotion', es: 'ascenso' }, { en: 'overtime', es: 'horas extra' }, { en: 'department', es: 'departamento' },
  ],
  'travel': [
    { en: 'passport', es: 'pasaporte' }, { en: 'luggage', es: 'equipaje' }, { en: 'hotel', es: 'hotel' },
    { en: 'reservation', es: 'reservación' }, { en: 'flight', es: 'vuelo' }, { en: 'destination', es: 'destino' },
    { en: 'map', es: 'mapa' }, { en: 'tourist', es: 'turista' }, { en: 'souvenir', es: 'recuerdo' },
    { en: 'customs', es: 'aduanas' }, { en: 'boarding pass', es: 'pase de abordar' }, { en: 'arrival', es: 'llegada' },
    { en: 'departure', es: 'salida' }, { en: 'suitcase', es: 'maleta' }, { en: 'vacation', es: 'vacaciones' },
  ],
  'directions': [
    { en: 'left', es: 'izquierda' }, { en: 'right', es: 'derecha' }, { en: 'straight', es: 'recto' },
    { en: 'north', es: 'norte' }, { en: 'south', es: 'sur' }, { en: 'east', es: 'este' },
    { en: 'west', es: 'oeste' }, { en: 'corner', es: 'esquina' }, { en: 'block', es: 'cuadra' },
    { en: 'intersection', es: 'intersección' }, { en: 'traffic light', es: 'semáforo' },
    { en: 'crosswalk', es: 'cruce peatonal' }, { en: 'map', es: 'mapa' }, { en: 'bridge', es: 'puente' },
    { en: 'turn', es: 'girar' },
  ],
  'emotions': [
    { en: 'happy', es: 'feliz' }, { en: 'sad', es: 'triste' }, { en: 'angry', es: 'enojado' },
    { en: 'scared', es: 'asustado' }, { en: 'surprised', es: 'sorprendido' }, { en: 'excited', es: 'emocionado' },
    { en: 'tired', es: 'cansado' }, { en: 'bored', es: 'aburrido' }, { en: 'nervous', es: 'nervioso' },
    { en: 'proud', es: 'orgulloso' }, { en: 'jealous', es: 'celoso' }, { en: 'grateful', es: 'agradecido' },
    { en: 'lonely', es: 'solitario' }, { en: 'confident', es: 'seguro' }, { en: 'worried', es: 'preocupado' },
  ],
  'hobbies': [
    { en: 'reading', es: 'lectura' }, { en: 'painting', es: 'pintura' }, { en: 'cooking', es: 'cocinar' },
    { en: 'swimming', es: 'natación' }, { en: 'dancing', es: 'bailar' }, { en: 'singing', es: 'cantar' },
    { en: 'fishing', es: 'pesca' }, { en: 'hiking', es: 'senderismo' }, { en: 'gardening', es: 'jardinería' },
    { en: 'photography', es: 'fotografía' }, { en: 'writing', es: 'escritura' }, { en: 'drawing', es: 'dibujo' },
    { en: 'cycling', es: 'ciclismo' }, { en: 'knitting', es: 'tejer' }, { en: 'playing guitar', es: 'tocar guitarra' },
  ],
  'technology': [
    { en: 'computer', es: 'computadora' }, { en: 'phone', es: 'teléfono' }, { en: 'internet', es: 'internet' },
    { en: 'password', es: 'contraseña' }, { en: 'software', es: 'software' }, { en: 'keyboard', es: 'teclado' },
    { en: 'screen', es: 'pantalla' }, { en: 'download', es: 'descargar' }, { en: 'upload', es: 'subir' },
    { en: 'website', es: 'sitio web' }, { en: 'email', es: 'correo electrónico' }, { en: 'camera', es: 'cámara' },
    { en: 'printer', es: 'impresora' }, { en: 'battery', es: 'batería' }, { en: 'device', es: 'dispositivo' },
  ],
  'conversations': [
    { en: 'hello', es: 'hola' }, { en: 'goodbye', es: 'adiós' }, { en: 'please', es: 'por favor' },
    { en: 'thank you', es: 'gracias' }, { en: 'excuse me', es: 'disculpe' }, { en: 'how are you', es: 'cómo estás' },
    { en: 'I agree', es: 'estoy de acuerdo' }, { en: 'maybe', es: 'quizás' }, { en: 'of course', es: 'por supuesto' },
    { en: 'no problem', es: 'no hay problema' }, { en: 'I think so', es: 'creo que sí' },
    { en: 'what do you mean', es: 'qué quieres decir' }, { en: 'let me think', es: 'déjame pensar' },
    { en: 'that sounds great', es: 'suena genial' }, { en: 'see you later', es: 'nos vemos luego' },
  ],
  'real-life': [
    { en: 'appointment', es: 'cita' }, { en: 'emergency', es: 'emergencia' }, { en: 'address', es: 'dirección' },
    { en: 'neighbor', es: 'vecino' }, { en: 'bill', es: 'factura' }, { en: 'form', es: 'formulario' },
    { en: 'signature', es: 'firma' }, { en: 'delivery', es: 'entrega' }, { en: 'repair', es: 'reparación' },
    { en: 'insurance', es: 'seguro' }, { en: 'complaint', es: 'queja' }, { en: 'service', es: 'servicio' },
    { en: 'application', es: 'solicitud' }, { en: 'document', es: 'documento' }, { en: 'deadline', es: 'plazo' },
  ],
  // ── INTERMEDIATE SCENARIOS ──
  'small-talk': [
    { en: 'weather', es: 'clima' }, { en: 'weekend', es: 'fin de semana' }, { en: 'hobby', es: 'pasatiempo' },
    { en: 'vacation', es: 'vacaciones' }, { en: 'family', es: 'familia' }, { en: 'plans', es: 'planes' },
    { en: 'job', es: 'trabajo' }, { en: 'favorite', es: 'favorito' }, { en: 'nice to meet you', es: 'gusto en conocerte' },
    { en: 'how about you', es: 'y tú' }, { en: 'sounds good', es: 'suena bien' }, { en: 'catch up', es: 'ponerse al día' },
    { en: 'by the way', es: 'por cierto' }, { en: 'take care', es: 'cuídate' }, { en: 'long time no see', es: 'cuánto tiempo' },
  ],
  'at-the-office': [
    { en: 'meeting room', es: 'sala de reuniones' }, { en: 'deadline', es: 'fecha límite' }, { en: 'report', es: 'informe' },
    { en: 'presentation', es: 'presentación' }, { en: 'colleague', es: 'colega' }, { en: 'schedule', es: 'horario' },
    { en: 'assignment', es: 'asignación' }, { en: 'feedback', es: 'retroalimentación' }, { en: 'conference call', es: 'llamada de conferencia' },
    { en: 'printer', es: 'impresora' }, { en: 'spreadsheet', es: 'hoja de cálculo' }, { en: 'memo', es: 'memorándum' },
    { en: 'break room', es: 'sala de descanso' }, { en: 'coworker', es: 'compañero de trabajo' }, { en: 'task', es: 'tarea' },
  ],
  'phone-calls': [
    { en: 'dial', es: 'marcar' }, { en: 'hang up', es: 'colgar' }, { en: 'voicemail', es: 'buzón de voz' },
    { en: 'ring', es: 'timbrar' }, { en: 'caller', es: 'llamante' }, { en: 'hold on', es: 'espera' },
    { en: 'call back', es: 'devolver la llamada' }, { en: 'busy', es: 'ocupado' }, { en: 'receptionist', es: 'recepcionista' },
    { en: 'extension', es: 'extensión' }, { en: 'message', es: 'mensaje' }, { en: 'conference call', es: 'conferencia' },
    { en: 'missed call', es: 'llamada perdida' }, { en: 'connection', es: 'conexión' }, { en: 'leave a message', es: 'dejar un mensaje' },
  ],
  'making-plans': [
    { en: 'schedule', es: 'programar' }, { en: 'available', es: 'disponible' }, { en: 'cancel', es: 'cancelar' },
    { en: 'postpone', es: 'posponer' }, { en: 'confirm', es: 'confirmar' }, { en: 'invite', es: 'invitar' },
    { en: 'arrange', es: 'organizar' }, { en: 'appointment', es: 'cita' }, { en: 'get together', es: 'reunirse' },
    { en: 'pick up', es: 'recoger' }, { en: 'drop by', es: 'pasar por' }, { en: 'meet up', es: 'encontrarse' },
    { en: 'free time', es: 'tiempo libre' }, { en: 'what time', es: 'a qué hora' }, { en: 'let me check', es: 'déjame verificar' },
  ],
  'shopping-mall': [
    { en: 'escalator', es: 'escalera mecánica' }, { en: 'fitting room', es: 'probador' }, { en: 'checkout', es: 'caja' },
    { en: 'aisle', es: 'pasillo' }, { en: 'display', es: 'escaparate' }, { en: 'return', es: 'devolución' },
    { en: 'exchange', es: 'cambio' }, { en: 'warranty', es: 'garantía' }, { en: 'promotion', es: 'promoción' },
    { en: 'floor', es: 'piso' }, { en: 'elevator', es: 'ascensor' }, { en: 'parking lot', es: 'estacionamiento' },
    { en: 'food court', es: 'patio de comidas' }, { en: 'cash register', es: 'caja registradora' }, { en: 'try on', es: 'probarse' },
  ],
  'hotel-checkin': [
    { en: 'check-in', es: 'registro' }, { en: 'check-out', es: 'salida' }, { en: 'room key', es: 'llave de habitación' },
    { en: 'reservation', es: 'reservación' }, { en: 'lobby', es: 'vestíbulo' }, { en: 'suite', es: 'suite' },
    { en: 'room service', es: 'servicio al cuarto' }, { en: 'bellboy', es: 'botones' }, { en: 'receptionist', es: 'recepcionista' },
    { en: 'amenities', es: 'servicios' }, { en: 'concierge', es: 'conserje' }, { en: 'floor', es: 'piso' },
    { en: 'deposit', es: 'depósito' }, { en: 'booking', es: 'reserva' }, { en: 'occupancy', es: 'ocupación' },
  ],
  'doctor-visit': [
    { en: 'appointment', es: 'cita' }, { en: 'symptoms', es: 'síntomas' }, { en: 'prescription', es: 'receta' },
    { en: 'medicine', es: 'medicina' }, { en: 'pain', es: 'dolor' }, { en: 'fever', es: 'fiebre' },
    { en: 'headache', es: 'dolor de cabeza' }, { en: 'allergy', es: 'alergia' }, { en: 'pharmacy', es: 'farmacia' },
    { en: 'insurance', es: 'seguro médico' }, { en: 'diagnosis', es: 'diagnóstico' }, { en: 'treatment', es: 'tratamiento' },
    { en: 'blood pressure', es: 'presión arterial' }, { en: 'waiting room', es: 'sala de espera' }, { en: 'check-up', es: 'chequeo' },
  ],
  'bank-money': [
    { en: 'account', es: 'cuenta' }, { en: 'deposit', es: 'depósito' }, { en: 'withdrawal', es: 'retiro' },
    { en: 'balance', es: 'saldo' }, { en: 'interest', es: 'interés' }, { en: 'loan', es: 'préstamo' },
    { en: 'transfer', es: 'transferencia' }, { en: 'ATM', es: 'cajero automático' }, { en: 'savings', es: 'ahorros' },
    { en: 'check', es: 'cheque' }, { en: 'teller', es: 'cajero' }, { en: 'currency', es: 'moneda' },
    { en: 'exchange rate', es: 'tipo de cambio' }, { en: 'mortgage', es: 'hipoteca' }, { en: 'investment', es: 'inversión' },
  ],
  'public-transport': [
    { en: 'bus stop', es: 'parada de autobús' }, { en: 'schedule', es: 'horario' }, { en: 'fare', es: 'tarifa' },
    { en: 'transfer', es: 'trasbordo' }, { en: 'route', es: 'ruta' }, { en: 'passenger', es: 'pasajero' },
    { en: 'platform', es: 'andén' }, { en: 'delay', es: 'retraso' }, { en: 'commuter', es: 'viajante' },
    { en: 'ticket machine', es: 'máquina de boletos' }, { en: 'seat', es: 'asiento' }, { en: 'crowded', es: 'lleno' },
    { en: 'monthly pass', es: 'pase mensual' }, { en: 'departure', es: 'salida' }, { en: 'terminal', es: 'terminal' },
  ],
  'job-interview': [
    { en: 'resume', es: 'currículum' }, { en: 'experience', es: 'experiencia' }, { en: 'qualification', es: 'cualificación' },
    { en: 'strength', es: 'fortaleza' }, { en: 'weakness', es: 'debilidad' }, { en: 'salary expectation', es: 'expectativa salarial' },
    { en: 'position', es: 'puesto' }, { en: 'candidate', es: 'candidato' }, { en: 'reference', es: 'referencia' },
    { en: 'hiring', es: 'contratación' }, { en: 'skills', es: 'habilidades' }, { en: 'cover letter', es: 'carta de presentación' },
    { en: 'background', es: 'antecedentes' }, { en: 'teamwork', es: 'trabajo en equipo' }, { en: 'notice period', es: 'preaviso' },
  ],
  'weather-chat': [
    { en: 'forecast', es: 'pronóstico' }, { en: 'breeze', es: 'brisa' }, { en: 'humidity', es: 'humedad' },
    { en: 'drizzle', es: 'llovizna' }, { en: 'downpour', es: 'aguacero' }, { en: 'chilly', es: 'fresco' },
    { en: 'warm', es: 'cálido' }, { en: 'muggy', es: 'bochornoso' }, { en: 'clear sky', es: 'cielo despejado' },
    { en: 'overcast', es: 'nublado' }, { en: 'season', es: 'estación' }, { en: 'drought', es: 'sequía' },
    { en: 'flood', es: 'inundación' }, { en: 'climate', es: 'clima' }, { en: 'degrees', es: 'grados' },
  ],
  'cooking-recipes': [
    { en: 'recipe', es: 'receta' }, { en: 'ingredient', es: 'ingrediente' }, { en: 'stir', es: 'revolver' },
    { en: 'bake', es: 'hornear' }, { en: 'boil', es: 'hervir' }, { en: 'fry', es: 'freír' },
    { en: 'chop', es: 'picar' }, { en: 'mix', es: 'mezclar' }, { en: 'season', es: 'sazonar' },
    { en: 'peel', es: 'pelar' }, { en: 'pour', es: 'verter' }, { en: 'oven', es: 'horno' },
    { en: 'pan', es: 'sartén' }, { en: 'tablespoon', es: 'cucharada' }, { en: 'teaspoon', es: 'cucharadita' },
  ],
  'sports-fitness': [
    { en: 'exercise', es: 'ejercicio' }, { en: 'stretch', es: 'estiramiento' }, { en: 'workout', es: 'entrenamiento' },
    { en: 'coach', es: 'entrenador' }, { en: 'team', es: 'equipo' }, { en: 'score', es: 'puntuación' },
    { en: 'goal', es: 'gol' }, { en: 'muscle', es: 'músculo' }, { en: 'endurance', es: 'resistencia' },
    { en: 'warm up', es: 'calentamiento' }, { en: 'cool down', es: 'enfriamiento' }, { en: 'reps', es: 'repeticiones' },
    { en: 'cardio', es: 'cardio' }, { en: 'weightlifting', es: 'levantamiento de pesas' }, { en: 'yoga', es: 'yoga' },
  ],
  'music-movies': [
    { en: 'song', es: 'canción' }, { en: 'movie', es: 'película' }, { en: 'actor', es: 'actor' },
    { en: 'director', es: 'director' }, { en: 'album', es: 'álbum' }, { en: 'concert', es: 'concierto' },
    { en: 'genre', es: 'género' }, { en: 'soundtrack', es: 'banda sonora' }, { en: 'plot', es: 'trama' },
    { en: 'scene', es: 'escena' }, { en: 'review', es: 'reseña' }, { en: 'lyrics', es: 'letra' },
    { en: 'melody', es: 'melodía' }, { en: 'box office', es: 'taquilla' }, { en: 'screening', es: 'función' },
  ],
  'news-media': [
    { en: 'headline', es: 'titular' }, { en: 'article', es: 'artículo' }, { en: 'journalist', es: 'periodista' },
    { en: 'broadcast', es: 'transmisión' }, { en: 'editorial', es: 'editorial' }, { en: 'report', es: 'reporte' },
    { en: 'interview', es: 'entrevista' }, { en: 'breaking news', es: 'última hora' }, { en: 'source', es: 'fuente' },
    { en: 'coverage', es: 'cobertura' }, { en: 'anchor', es: 'presentador' }, { en: 'column', es: 'columna' },
    { en: 'press', es: 'prensa' }, { en: 'edition', es: 'edición' }, { en: 'subscriber', es: 'suscriptor' },
  ],
  'family-life': [
    { en: 'childhood', es: 'infancia' }, { en: 'babysitter', es: 'niñera' }, { en: 'chores', es: 'quehaceres' },
    { en: 'bedtime', es: 'hora de dormir' }, { en: 'siblings', es: 'hermanos' }, { en: 'tradition', es: 'tradición' },
    { en: 'pregnancy', es: 'embarazo' }, { en: 'newborn', es: 'recién nacido' }, { en: 'adoption', es: 'adopción' },
    { en: 'generation', es: 'generación' }, { en: 'reunion', es: 'reunión familiar' }, { en: 'anniversary', es: 'aniversario' },
    { en: 'divorce', es: 'divorcio' }, { en: 'household', es: 'hogar' }, { en: 'upbringing', es: 'educación' },
  ],
  'pet-care': [
    { en: 'veterinarian', es: 'veterinario' }, { en: 'leash', es: 'correa' }, { en: 'kibble', es: 'alimento' },
    { en: 'litter box', es: 'arenero' }, { en: 'vaccination', es: 'vacunación' }, { en: 'grooming', es: 'aseo' },
    { en: 'breed', es: 'raza' }, { en: 'shelter', es: 'refugio' }, { en: 'adoption', es: 'adopción' },
    { en: 'training', es: 'entrenamiento' }, { en: 'treat', es: 'premio' }, { en: 'crate', es: 'jaula' },
    { en: 'flea', es: 'pulga' }, { en: 'collar', es: 'collar' }, { en: 'spay', es: 'esterilizar' },
  ],
  'home-repairs': [
    { en: 'plumber', es: 'plomero' }, { en: 'leak', es: 'fuga' }, { en: 'wrench', es: 'llave inglesa' },
    { en: 'hammer', es: 'martillo' }, { en: 'nail', es: 'clavo' }, { en: 'screwdriver', es: 'destornillador' },
    { en: 'paint', es: 'pintura' }, { en: 'pipe', es: 'tubería' }, { en: 'wire', es: 'cable' },
    { en: 'drill', es: 'taladro' }, { en: 'faucet', es: 'grifo' }, { en: 'patch', es: 'parche' },
    { en: 'toolbox', es: 'caja de herramientas' }, { en: 'maintenance', es: 'mantenimiento' }, { en: 'repair', es: 'reparación' },
  ],
  'gardening': [
    { en: 'seed', es: 'semilla' }, { en: 'soil', es: 'tierra' }, { en: 'watering can', es: 'regadera' },
    { en: 'pruning', es: 'poda' }, { en: 'fertilizer', es: 'fertilizante' }, { en: 'weed', es: 'maleza' },
    { en: 'harvest', es: 'cosecha' }, { en: 'bloom', es: 'floración' }, { en: 'greenhouse', es: 'invernadero' },
    { en: 'pot', es: 'maceta' }, { en: 'sprout', es: 'brote' }, { en: 'mulch', es: 'mantillo' },
    { en: 'compost', es: 'composta' }, { en: 'shovel', es: 'pala' }, { en: 'lawn', es: 'césped' },
  ],
  'car-problems': [
    { en: 'engine', es: 'motor' }, { en: 'tire', es: 'neumático' }, { en: 'brake', es: 'freno' },
    { en: 'battery', es: 'batería' }, { en: 'oil change', es: 'cambio de aceite' }, { en: 'mechanic', es: 'mecánico' },
    { en: 'flat tire', es: 'llanta ponchada' }, { en: 'overheat', es: 'sobrecalentarse' }, { en: 'tow truck', es: 'grúa' },
    { en: 'steering', es: 'dirección' }, { en: 'exhaust', es: 'escape' }, { en: 'wiper', es: 'limpiaparabrisas' },
    { en: 'headlight', es: 'faros' }, { en: 'inspection', es: 'inspección' }, { en: 'dashboard', es: 'tablero' },
  ],
  'neighborhood': [
    { en: 'neighbor', es: 'vecino' }, { en: 'sidewalk', es: 'acera' }, { en: 'park', es: 'parque' },
    { en: 'street', es: 'calle' }, { en: 'community', es: 'comunidad' }, { en: 'block party', es: 'fiesta del barrio' },
    { en: 'local', es: 'local' }, { en: 'suburb', es: 'suburbio' }, { en: 'playground', es: 'parque infantil' },
    { en: 'convenience store', es: 'tienda de conveniencia' }, { en: 'crosswalk', es: 'cruce' },
    { en: 'mailbox', es: 'buzón' }, { en: 'trash', es: 'basura' }, { en: 'fence', es: 'cerca' },
    { en: 'association', es: 'asociación' },
  ],
  'celebrations': [
    { en: 'birthday', es: 'cumpleaños' }, { en: 'wedding', es: 'boda' }, { en: 'anniversary', es: 'aniversario' },
    { en: 'graduation', es: 'graduación' }, { en: 'fireworks', es: 'fuegos artificiales' }, { en: 'gift', es: 'regalo' },
    { en: 'toast', es: 'brindis' }, { en: 'ceremony', es: 'ceremonia' }, { en: 'decoration', es: 'decoración' },
    { en: 'invitation', es: 'invitación' }, { en: 'celebration', es: 'celebración' }, { en: 'cake', es: 'pastel' },
    { en: 'champagne', es: 'champán' }, { en: 'balloon', es: 'globo' }, { en: 'congratulations', es: 'felicidades' },
  ],
  'social-media': [
    { en: 'post', es: 'publicación' }, { en: 'follow', es: 'seguir' }, { en: 'like', es: 'me gusta' },
    { en: 'share', es: 'compartir' }, { en: 'comment', es: 'comentario' }, { en: 'notification', es: 'notificación' },
    { en: 'profile', es: 'perfil' }, { en: 'timeline', es: 'línea de tiempo' }, { en: 'feed', es: 'feed' },
    { en: 'hashtag', es: 'hashtag' }, { en: 'trending', es: 'tendencia' }, { en: 'viral', es: 'viral' },
    { en: 'influencer', es: 'influencer' }, { en: 'privacy', es: 'privacidad' }, { en: 'direct message', es: 'mensaje directo' },
  ],
  'volunteer-work': [
    { en: 'charity', es: 'caridad' }, { en: 'donation', es: 'donación' }, { en: 'community service', es: 'servicio comunitario' },
    { en: 'shelter', es: 'refugio' }, { en: 'fundraiser', es: 'colecta de fondos' }, { en: 'outreach', es: 'alcance' },
    { en: 'nonprofit', es: 'sin fines de lucro' }, { en: 'contribute', es: 'contribuir' }, { en: 'mentor', es: 'mentor' },
    { en: 'initiative', es: 'iniciativa' }, { en: 'cause', es: 'causa' }, { en: 'impact', es: 'impacto' },
    { en: 'dedication', es: 'dedicación' }, { en: 'solidarity', es: 'solidaridad' }, { en: 'awareness', es: 'conciencia' },
  ],
  'cultural-events': [
    { en: 'festival', es: 'festival' }, { en: 'exhibition', es: 'exhibición' }, { en: 'performance', es: 'actuación' },
    { en: 'tradition', es: 'tradición' }, { en: 'heritage', es: 'patrimonio' }, { en: 'parade', es: 'desfile' },
    { en: 'gallery', es: 'galería' }, { en: 'concert', es: 'concierto' }, { en: 'museum', es: 'museo' },
    { en: 'sculpture', es: 'escultura' }, { en: 'folklore', es: 'folclore' }, { en: 'audience', es: 'audiencia' },
    { en: 'curator', es: 'curador' }, { en: 'masterpiece', es: 'obra maestra' }, { en: 'celebrate', es: 'celebrar' },
  ],
  // ── ADVANCED SCENARIOS ──
  'business-negotiations': [
    { en: 'leverage', es: 'apalancamiento' }, { en: 'compromise', es: 'compromiso' }, { en: 'counteroffer', es: 'contraoferta' },
    { en: 'stakeholder', es: 'interesado' }, { en: 'terms', es: 'términos' }, { en: 'proposal', es: 'propuesta' },
    { en: 'concession', es: 'concesión' }, { en: 'agreement', es: 'acuerdo' }, { en: 'dealbreaker', es: 'inaceptable' },
    { en: 'bottom line', es: 'línea base' }, { en: 'bargain', es: 'regatear' }, { en: 'deadline', es: 'plazo' },
    { en: 'clause', es: 'cláusula' }, { en: 'revenue', es: 'ingresos' }, { en: 'margin', es: 'margen' },
  ],
  'academic-writing': [
    { en: 'thesis', es: 'tesis' }, { en: 'hypothesis', es: 'hipótesis' }, { en: 'methodology', es: 'metodología' },
    { en: 'citation', es: 'cita' }, { en: 'abstract', es: 'resumen' }, { en: 'peer review', es: 'revisión por pares' },
    { en: 'journal', es: 'revista académica' }, { en: 'findings', es: 'hallazgos' }, { en: 'literature review', es: 'revisión bibliográfica' },
    { en: 'plagiarism', es: 'plagio' }, { en: 'dissertation', es: 'disertación' }, { en: 'appendix', es: 'apéndice' },
    { en: 'bibliography', es: 'bibliografía' }, { en: 'conclusion', es: 'conclusión' }, { en: 'framework', es: 'marco' },
  ],
  'legal-english': [
    { en: 'attorney', es: 'abogado' }, { en: 'lawsuit', es: 'demanda' }, { en: 'verdict', es: 'veredicto' },
    { en: 'contract', es: 'contrato' }, { en: 'liability', es: 'responsabilidad' }, { en: 'statute', es: 'estatuto' },
    { en: 'plaintiff', es: 'demandante' }, { en: 'defendant', es: 'demandado' }, { en: 'jurisdiction', es: 'jurisdicción' },
    { en: 'evidence', es: 'evidencia' }, { en: 'testimony', es: 'testimonio' }, { en: 'appeal', es: 'apelación' },
    { en: 'legislation', es: 'legislación' }, { en: 'compliance', es: 'cumplimiento' }, { en: 'provision', es: 'disposición' },
  ],
  'medical-english': [
    { en: 'diagnosis', es: 'diagnóstico' }, { en: 'prognosis', es: 'pronóstico' }, { en: 'symptom', es: 'síntoma' },
    { en: 'therapy', es: 'terapia' }, { en: 'surgery', es: 'cirugía' }, { en: 'prescription', es: 'receta' },
    { en: 'chronic', es: 'crónico' }, { en: 'acute', es: 'agudo' }, { en: 'pathology', es: 'patología' },
    { en: 'anesthesia', es: 'anestesia' }, { en: 'rehabilitation', es: 'rehabilitación' }, { en: 'prophylaxis', es: 'profilaxis' },
    { en: 'side effect', es: 'efecto secundario' }, { en: 'outpatient', es: 'paciente ambulatorio' }, { en: 'ward', es: 'pabellón' },
  ],
  'engineering-talk': [
    { en: 'blueprint', es: 'plano' }, { en: 'specification', es: 'especificación' }, { en: 'prototype', es: 'prototipo' },
    { en: 'tolerance', es: 'tolerancia' }, { en: 'load', es: 'carga' }, { en: 'efficiency', es: 'eficiencia' },
    { en: 'calibration', es: 'calibración' }, { en: 'structural', es: 'estructural' }, { en: 'infrastructure', es: 'infraestructura' },
    { en: 'simulation', es: 'simulación' }, { en: 'algorithm', es: 'algoritmo' }, { en: 'parameter', es: 'parámetro' },
    { en: 'optimization', es: 'optimización' }, { en: 'failure rate', es: 'tasa de fallos' }, { en: 'workflow', es: 'flujo de trabajo' },
  ],
  'financial-reports': [
    { en: 'revenue', es: 'ingresos' }, { en: 'expense', es: 'gasto' }, { en: 'profit margin', es: 'margen de beneficio' },
    { en: 'quarterly', es: 'trimestral' }, { en: 'balance sheet', es: 'balance general' }, { en: 'cash flow', es: 'flujo de caja' },
    { en: 'dividend', es: 'dividendo' }, { en: 'equity', es: 'patrimonio' }, { en: 'depreciation', es: 'depreciación' },
    { en: 'audit', es: 'auditoría' }, { en: 'forecast', es: 'pronóstico' }, { en: 'liability', es: 'pasivo' },
    { en: 'asset', es: 'activo' }, { en: 'fiscal year', es: 'año fiscal' }, { en: 'overhead', es: 'gastos generales' },
  ],
  'marketing-strategy': [
    { en: 'target audience', es: 'público objetivo' }, { en: 'brand awareness', es: 'conocimiento de marca' },
    { en: 'campaign', es: 'campaña' }, { en: 'conversion', es: 'conversión' }, { en: 'engagement', es: 'interacción' },
    { en: 'demographic', es: 'demográfico' }, { en: 'ROI', es: 'retorno de inversión' }, { en: 'segmentation', es: 'segmentación' },
    { en: 'positioning', es: 'posicionamiento' }, { en: 'competitor', es: 'competidor' }, { en: 'value proposition', es: 'propuesta de valor' },
    { en: 'funnel', es: 'embudo' }, { en: 'launch', es: 'lanzamiento' }, { en: 'retention', es: 'retención' },
    { en: 'outreach', es: 'alcance' },
  ],
  'environmental-science': [
    { en: 'ecosystem', es: 'ecosistema' }, { en: 'biodiversity', es: 'biodiversidad' }, { en: 'sustainability', es: 'sostenibilidad' },
    { en: 'emission', es: 'emisión' }, { en: 'carbon footprint', es: 'huella de carbono' }, { en: 'conservation', es: 'conservación' },
    { en: 'renewable', es: 'renovable' }, { en: 'pollution', es: 'contaminación' }, { en: 'habitat', es: 'hábitat' },
    { en: 'deforestation', es: 'deforestación' }, { en: 'greenhouse effect', es: 'efecto invernadero' },
    { en: 'endangered', es: 'en peligro' }, { en: 'erosion', es: 'erosión' }, { en: 'ozone layer', es: 'capa de ozono' },
    { en: 'waste management', es: 'gestión de residuos' },
  ],
  'political-debate': [
    { en: 'policy', es: 'política' }, { en: 'legislation', es: 'legislación' }, { en: 'democracy', es: 'democracia' },
    { en: 'constituency', es: 'circunscripción' }, { en: 'referendum', es: 'referéndum' }, { en: 'partisan', es: 'partidista' },
    { en: 'amendment', es: 'enmienda' }, { en: 'diplomacy', es: 'diplomacia' }, { en: 'sanction', es: 'sanción' },
    { en: 'sovereignty', es: 'soberanía' }, { en: 'bipartisan', es: 'bipartidista' }, { en: 'rhetoric', es: 'retórica' },
    { en: 'platform', es: 'plataforma' }, { en: 'mandate', es: 'mandato' }, { en: 'veto', es: 'veto' },
  ],
  'philosophical-discussion': [
    { en: 'ethics', es: 'ética' }, { en: 'metaphysics', es: 'metafísica' }, { en: 'epistemology', es: 'epistemología' },
    { en: 'morality', es: 'moralidad' }, { en: 'consciousness', es: 'conciencia' }, { en: 'rationality', es: 'racionalidad' },
    { en: 'existentialism', es: 'existencialismo' }, { en: 'pragmatism', es: 'pragmatismo' },
    { en: 'determinism', es: 'determinismo' }, { en: 'free will', es: 'libre albedrío' },
    { en: 'utilitarianism', es: 'utilitarismo' }, { en: 'dialectic', es: 'dialéctica' },
    { en: 'ontology', es: 'ontología' }, { en: 'skepticism', es: 'escepticismo' }, { en: 'virtue', es: 'virtud' },
  ],
  'tech-startup': [
    { en: 'pitch deck', es: 'presentación de proyecto' }, { en: 'seed funding', es: 'financiamiento inicial' },
    { en: 'MVP', es: 'producto mínimo viable' }, { en: 'pivot', es: 'pivotar' }, { en: 'scalable', es: 'escalable' },
    { en: 'disruption', es: 'disrupción' }, { en: 'venture capital', es: 'capital de riesgo' },
    { en: 'iteration', es: 'iteración' }, { en: 'burn rate', es: 'tasa de quema' }, { en: 'traction', es: 'tracción' },
    { en: 'acquisition', es: 'adquisición' }, { en: 'equity', es: 'participación' }, { en: 'runway', es: 'runway' },
    { en: 'incubator', es: 'incubadora' }, { en: 'prototype', es: 'prototipo' },
  ],
  'research-methods': [
    { en: 'qualitative', es: 'cualitativo' }, { en: 'quantitative', es: 'cuantitativo' }, { en: 'variable', es: 'variable' },
    { en: 'sample', es: 'muestra' }, { en: 'correlation', es: 'correlación' }, { en: 'hypothesis', es: 'hipótesis' },
    { en: 'experiment', es: 'experimento' }, { en: 'validity', es: 'validez' }, { en: 'reliability', es: 'fiabilidad' },
    { en: 'bias', es: 'sesgo' }, { en: 'control group', es: 'grupo de control' }, { en: 'statistical', es: 'estadístico' },
    { en: 'survey', es: 'encuesta' }, { en: 'longitudinal', es: 'longitudinal' }, { en: 'peer review', es: 'revisión por pares' },
  ],
  'public-speaking': [
    { en: 'audience', es: 'audiencia' }, { en: 'gesture', es: 'gesto' }, { en: 'persuade', es: 'persuadir' },
    { en: 'rhetoric', es: 'retórica' }, { en: 'stage fright', es: 'miedo escénico' }, { en: 'keynote', es: 'discurso principal' },
    { en: 'anecdote', es: 'anécdota' }, { en: 'delivery', es: 'entrega' }, { en: 'modulation', es: 'modulación' },
    { en: 'engagement', es: 'participación' }, { en: 'body language', es: 'lenguaje corporal' },
    { en: 'cue cards', es: 'tarjetas de apoyo' }, { en: 'eloquence', es: 'elocuencia' },
    { en: 'forum', es: 'foro' }, { en: 'impromptu', es: 'improvisado' },
  ],
  'creative-writing': [
    { en: 'narrative', es: 'narrativa' }, { en: 'character', es: 'personaje' }, { en: 'plot twist', es: 'giro argumental' },
    { en: 'metaphor', es: 'metáfora' }, { en: 'dialogue', es: 'diálogo' }, { en: 'setting', es: 'escenario' },
    { en: 'foreshadowing', es: 'presagio' }, { en: 'protagonist', es: 'protagonista' }, { en: 'climax', es: 'clímax' },
    { en: 'imagery', es: 'imágenes' }, { en: 'pacing', es: 'ritmo' }, { en: 'tone', es: 'tono' },
    { en: 'point of view', es: 'punto de vista' }, { en: 'suspense', es: 'suspenso' }, { en: 'draft', es: 'borrador' },
  ],
  'journalism': [
    { en: 'headline', es: 'titular' }, { en: 'editorial', es: 'editorial' }, { en: 'byline', es: 'firma' },
    { en: 'lead', es: 'entrada' }, { en: 'source', es: 'fuente' }, { en: 'fact-checking', es: 'verificación' },
    { en: 'beat', es: 'área' }, { en: 'deadline', es: 'fecha límite' }, { en: 'circulation', es: 'circulación' },
    { en: 'freelance', es: 'freelance' }, { en: 'press release', es: 'comunicado de prensa' }, { en: 'off the record', es: 'off the record' },
    { en: 'op-ed', es: 'opinión' }, { en: 'syndicate', es: 'sindicato' }, { en: 'correspondent', es: 'corresponsal' },
  ],
  'international-relations': [
    { en: 'diplomacy', es: 'diplomacia' }, { en: 'treaty', es: 'tratado' }, { en: 'sanction', es: 'sanción' },
    { en: 'alliance', es: 'alianza' }, { en: 'ambassador', es: 'embajador' }, { en: 'sovereignty', es: 'soberanía' },
    { en: 'bilateral', es: 'bilateral' }, { en: 'multilateral', es: 'multilateral' }, { en: 'embargo', es: 'embargo' },
    { en: 'consulate', es: 'consulado' }, { en: 'protocol', es: 'protocolo' }, { en: 'negotiation', es: 'negociación' },
    { en: 'refugee', es: 'refugiado' }, { en: 'asylum', es: 'asilo' }, { en: 'summit', es: 'cumbre' },
  ],
  'project-management': [
    { en: 'milestone', es: 'hito' }, { en: 'deliverable', es: 'entregable' }, { en: 'stakeholder', es: 'interesado' },
    { en: 'scope', es: 'alcance' }, { en: 'Gantt chart', es: 'diagrama de Gantt' }, { en: 'agile', es: 'ágil' },
    { en: 'sprint', es: 'sprint' }, { en: 'resource', es: 'recurso' }, { en: 'risk assessment', es: 'evaluación de riesgos' },
    { en: 'baseline', es: 'línea base' }, { en: 'kickoff', es: 'inicio' }, { en: 'status report', es: 'informe de estado' },
    { en: 'bottleneck', es: 'cuello de botella' }, { en: 'timeline', es: 'cronograma' }, { en: 'budget', es: 'presupuesto' },
  ],
  'crisis-management': [
    { en: 'contingency', es: 'contingencia' }, { en: 'evacuation', es: 'evacuación' }, { en: 'protocol', es: 'protocolo' },
    { en: 'escalation', es: 'escalada' }, { en: 'mitigation', es: 'mitigación' }, { en: 'response', es: 'respuesta' },
    { en: 'recovery', es: 'recuperación' }, { en: 'damage control', es: 'control de daños' }, { en: 'emergency', es: 'emergencia' },
    { en: 'assessment', es: 'evaluación' }, { en: 'coordination', es: 'coordinación' }, { en: 'deployment', es: 'despliegue' },
    { en: 'drill', es: 'simulacro' }, { en: 'aftermath', es: 'consecuencias' }, { en: 'resilience', es: 'resiliencia' },
  ],
  'art-critique': [
    { en: 'composition', es: 'composición' }, { en: 'technique', es: 'técnica' }, { en: 'aesthetic', es: 'estética' },
    { en: 'interpretation', es: 'interpretación' }, { en: 'medium', es: 'medio' }, { en: 'contrast', es: 'contraste' },
    { en: 'perspective', es: 'perspectiva' }, { en: 'texture', es: 'textura' }, { en: 'abstract', es: 'abstracto' },
    { en: 'figurative', es: 'figurativo' }, { en: 'palette', es: 'paleta' }, { en: 'symbolism', es: 'simbolismo' },
    { en: 'avant-garde', es: 'vanguardia' }, { en: 'provocative', es: 'provocador' }, { en: 'craftsmanship', es: 'artesanía' },
  ],
  'scientific-presentation': [
    { en: 'methodology', es: 'metodología' }, { en: 'finding', es: 'hallazgo' }, { en: 'data', es: 'datos' },
    { en: 'analysis', es: 'análisis' }, { en: 'conclusion', es: 'conclusión' }, { en: 'implication', es: 'implicación' },
    { en: 'limitation', es: 'limitación' }, { en: 'hypothesis', es: 'hipótesis' }, { en: 'significance', es: 'significancia' },
    { en: 'correlation', es: 'correlación' }, { en: 'peer review', es: 'revisión por pares' }, { en: 'publication', es: 'publicación' },
    { en: 'graph', es: 'gráfico' }, { en: 'statistical significance', es: 'significancia estadística' }, { en: 'reproducibility', es: 'reproducibilidad' },
  ],
  'investment-banking': [
    { en: 'merger', es: 'fusión' }, { en: 'acquisition', es: 'adquisición' }, { en: 'IPO', es: 'oferta pública' },
    { en: 'underwriting', es: 'suscripción' }, { en: 'portfolio', es: 'portafolio' }, { en: 'hedge fund', es: 'fondo de cobertura' },
    { en: 'leverage', es: 'apalancamiento' }, { en: 'valuation', es: 'valoración' }, { en: 'bond', es: 'bono' },
    { en: 'equity', es: 'capital' }, { en: 'dividend', es: 'dividendo' }, { en: 'yield', es: 'rendimiento' },
    { en: 'liquidity', es: 'liquidez' }, { en: 'derivative', es: 'derivado' }, { en: 'arbitrage', es: 'arbitraje' },
  ],
  'diplomatic-english': [
    { en: 'ambassador', es: 'embajador' }, { en: 'consulate', es: 'consulado' }, { en: 'protocol', es: 'protocolo' },
    { en: 'detente', es: 'distensión' }, { en: 'bilateral', es: 'bilateral' }, { en: 'communique', es: 'comunicado' },
    { en: 'convention', es: 'convención' }, { en: 'ratification', es: 'ratificación' }, { en: 'demarche', es: 'demarche' },
    { en: 'accredited', es: 'acreditado' }, { en: 'legation', es: 'legación' }, { en: 'credentials', es: 'credenciales' },
    { en: 'persona non grata', es: 'persona non grata' }, { en: 'modus vivendi', es: 'modus vivendi' }, { en: 'precedent', es: 'precedente' },
  ],
  'advanced-idioms': [
    { en: 'bite the bullet', es: 'hacer de tripas corazón' }, { en: 'break the ice', es: 'romper el hielo' },
    { en: 'burn bridges', es: 'quemar naves' }, { en: 'hit the nail on the head', es: 'dar en el clavo' },
    { en: 'piece of cake', es: 'pan comido' }, { en: 'spill the beans', es: 'revelar el secreto' },
    { en: 'under the weather', es: 'indispuesto' }, { en: 'once in a blue moon', es: 'una vez cada nunca' },
    { en: 'the ball is in your court', es: 'la pelota está en tu tejado' }, { en: 'cost an arm and a leg', es: 'costar un ojo de la cara' },
    { en: 'cut corners', es: 'ahorrar esfuerzo' }, { en: 'go the extra mile', es: 'esforzarse más' },
    { en: 'let the cat out of the bag', es: 'descubrir el pastel' }, { en: 'on thin ice', es: 'en terreno peligroso' },
    { en: 'throw in the towel', es: 'tirar la toalla' },
  ],
  'phrasal-verbs-master': [
    { en: 'look forward to', es: 'esperar con ansias' }, { en: 'put up with', es: 'tolerar' },
    { en: 'come across', es: 'encontrarse con' }, { en: 'turn down', es: 'rechazar' }, { en: 'carry out', es: 'llevar a cabo' },
    { en: 'give up', es: 'rendirse' }, { en: 'take over', es: 'hacerse cargo' }, { en: 'bring up', es: 'mencionar' },
    { en: 'figure out', es: 'resolver' }, { en: 'run into', es: 'encontrarse' }, { en: 'set up', es: 'establecer' },
    { en: 'call off', es: 'cancelar' }, { en: 'point out', es: 'señalar' }, { en: 'work out', es: 'resolver' },
    { en: 'make up', es: 'inventar' },
  ],
  'slang-colloquial': [
    { en: 'hang out', es: 'pasar el rato' }, { en: 'bummer', es: 'decepción' }, { en: 'dough', es: 'dinero' },
    { en: 'rip-off', es: 'estafa' }, { en: 'chill', es: 'relajarse' }, { en: 'awesome', es: 'increíble' },
    { en: 'no-brainer', es: 'algo obvio' }, { en: 'beat', es: 'exhausto' }, { en: 'bucks', es: 'dólares' },
    { en: 'couch potato', es: 'holgazán' }, { en: 'freak out', es: 'asustarse' }, { en: 'laid-back', es: 'relajado' },
    { en: 'my bad', es: 'mi error' }, { en: 'pitch in', es: 'colaborar' }, { en: 'zonked', es: 'agotado' },
  ],
};

// Helper to shuffle an array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper to round to nearest 50
function roundTo50(n: number): number {
  return Math.round(n / 50) * 50;
}

// Helper to pick N random items from array
function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// Helper to get wrong answers from vocabulary (different from correct)
function getWrongOptions(vocab: Array<{ en: string; es: string }>, correctEn: string, count: number): string[] {
  const others = vocab.filter(v => v.en !== correctEn);
  return pickRandom(others, count).map(v => v.en);
}

function generateQuestionsForScenario(
  scenario: { id: string; slug: string; name: string; nameEs: string; level: { slug: string } },
  lessonType: string,
  isBasic: boolean,
  isIntermediate: boolean
) {
  const questions: Array<{
    type: string; prompt: string; promptEs: string; hintEn: string; hintEs: string;
    audioText: string; options: string; correctAnswer: string; explanation: string; explanationEs: string; points: number;
  }> = [];

  const topic = scenario.name;
  const topicEs = scenario.nameEs;
  let vocab = scenarioVocabulary[scenario.slug] || [];

  if (vocab.length === 0) {
    vocab = [
      { en: topic.toLowerCase(), es: topicEs.toLowerCase() },
      { en: 'lesson', es: 'lección' }, { en: 'word', es: 'palabra' },
      { en: 'learn', es: 'aprender' }, { en: 'practice', es: 'practicar' },
      { en: 'study', es: 'estudiar' }, { en: 'sentence', es: 'oración' },
      { en: 'example', es: 'ejemplo' }, { en: 'question', es: 'pregunta' },
      { en: 'answer', es: 'respuesta' }, { en: 'correct', es: 'correcto' },
      { en: 'translate', es: 'traducir' }, { en: 'listen', es: 'escuchar' },
      { en: 'speak', es: 'hablar' }, { en: 'read', es: 'leer' },
    ];
  }

  const selectedWords = pickRandom(vocab, Math.min(12, vocab.length));
  const w0 = selectedWords[0] || vocab[0];
  const w1 = selectedWords[1] || vocab[1];
  const w2 = selectedWords[2] || vocab[2];
  const w3 = selectedWords[3] || vocab[3];
  const w4 = selectedWords[4] || vocab[4];
  const w5 = selectedWords[5] || vocab[5];
  const w6 = selectedWords[6] || vocab[6];
  const w7 = selectedWords[7] || vocab[7];

  if (lessonType === 'vocabulary') {
    const wrong1 = getWrongOptions(vocab, w0.en, 3);
    questions.push({ type: 'multiple_choice', prompt: `What does "${w0.es}" mean in English?`, promptEs: `¿Qué significa "${w0.es}" en inglés?`, hintEn: `Think about the ${topic.toLowerCase()} vocabulary`, hintEs: `Piensa en el vocabulario de ${topicEs.toLowerCase()}`, audioText: `What does ${w0.es} mean in English?`, options: JSON.stringify([w0.en, ...wrong1]), correctAnswer: w0.en, explanation: `"${w0.es}" means "${w0.en}" in English`, explanationEs: `"${w0.es}" significa "${w0.en}" en inglés`, points: 10 });
    questions.push({ type: 'flashcard', prompt: `${w1.en} - ${w1.es}`, promptEs: `${w1.es} - ${w1.en}`, hintEn: `Remember: "${w1.en}" is "${w1.es}" in Spanish`, hintEs: `Recuerda: "${w1.es}" es "${w1.en}" en inglés`, audioText: w1.en, options: '[]', correctAnswer: w1.en, explanation: `"${w1.en}" = "${w1.es}". This is an important ${topic.toLowerCase()} word.`, explanationEs: `"${w1.en}" = "${w1.es}". Esta es una palabra importante de ${topicEs.toLowerCase()}.`, points: 5 });
    questions.push({ type: 'fill_blank', prompt: `The English word for "${w2.es}" is ___`, promptEs: `La palabra en inglés para "${w2.es}" es ___`, hintEn: `It starts with "${w2.en.charAt(0)}"`, hintEs: `Empieza con "${w2.en.charAt(0)}"`, audioText: `The English word for ${w2.es} is`, options: '[]', correctAnswer: w2.en, explanation: `"${w2.es}" = "${w2.en}"`, explanationEs: `"${w2.es}" = "${w2.en}"`, points: 10 });
    questions.push({ type: 'translate', prompt: `Translate to English: ${w3.es}`, promptEs: `Traduce al inglés: ${w3.es}`, hintEn: `This is a ${topic.toLowerCase()} word`, hintEs: `Esta es una palabra de ${topicEs.toLowerCase()}`, audioText: `Translate to English: ${w3.es}`, options: '[]', correctAnswer: w3.en, explanation: `${w3.es} = ${w3.en}`, explanationEs: `${w3.es} = ${w3.en}`, points: 10 });
    questions.push({ type: 'listen_write', prompt: `Listen and write the ${topic.toLowerCase()} word you hear`, promptEs: `Escucha y escribe la palabra de ${topicEs.toLowerCase()} que oyes`, hintEn: `This word means "${w4.es}" in Spanish`, hintEs: `Esta palabra significa "${w4.es}" en español`, audioText: w4.en, options: '[]', correctAnswer: w4.en, explanation: `The word is "${w4.en}" (${w4.es})`, explanationEs: `La palabra es "${w4.en}" (${w4.es})`, points: 15 });
    const pronWords = [w0.en, w1.en, w2.en].join(' ');
    questions.push({ type: 'pronunciation', prompt: `Practice saying these ${topic.toLowerCase()} words: ${pronWords}`, promptEs: `Practica diciendo estas palabras de ${topicEs.toLowerCase()}: ${pronWords}`, hintEn: 'Say each word clearly and slowly', hintEs: 'Di cada palabra clara y lentamente', audioText: pronWords, options: '[]', correctAnswer: pronWords, explanation: `These are important ${topic.toLowerCase()} words: ${pronWords}`, explanationEs: `Estas son palabras importantes de ${topicEs.toLowerCase()}: ${pronWords}`, points: 10 });
    const matchWords = pickRandom(vocab, 3);
    questions.push({ type: 'match_concepts', prompt: `Match the Spanish words with their English translations`, promptEs: `Relaciona las palabras en español con sus traducciones al inglés`, hintEn: matchWords.map(w => `${w.es}=${w.en}`).join(', '), hintEs: matchWords.map(w => `${w.es}=${w.en}`).join(', '), audioText: `Match the ${topic.toLowerCase()} words`, options: JSON.stringify(matchWords.map(w => `${w.es}-${w.en}`)), correctAnswer: matchWords.map(w => w.en).join(' '), explanation: matchWords.map(w => `${w.es} = ${w.en}`).join(', '), explanationEs: matchWords.map(w => `${w.es} = ${w.en}`).join(', '), points: 15 });
    questions.push({ type: 'order_words', prompt: `Put these words in the correct order: need, ${w5.en}, I`, promptEs: `Pon estas palabras en el orden correcto: need, ${w5.en}, I`, hintEn: 'Start with the subject', hintEs: 'Empieza con el sujeto', audioText: `I need ${w5.en}`, options: JSON.stringify(shuffle(['I', 'need', w5.en])), correctAnswer: `I need ${w5.en}`, explanation: `The correct sentence is "I need ${w5.en}"`, explanationEs: `La oración correcta es "I need ${w5.en}"`, points: 15 });
    questions.push({ type: 'build_sentence', prompt: `Build: She / likes / ${w6.en}`, promptEs: `Construye: She / likes / ${w6.en}`, hintEn: 'Subject + verb + object', hintEs: 'Sujeto + verbo + objeto', audioText: `She likes ${w6.en}`, options: JSON.stringify(shuffle(['She', 'likes', w6.en])), correctAnswer: `She likes ${w6.en}`, explanation: `The correct sentence is "She likes ${w6.en}"`, explanationEs: `La oración correcta es "She likes ${w6.en}"`, points: 15 });
    questions.push({ type: 'find_error', prompt: isBasic ? `Find the mistake: She like ${w7.en}` : `Find the mistake: She have ${w7.en} yesterday`, promptEs: isBasic ? `Encuentra el error: She like ${w7.en}` : `Encuentra el error: She have ${w7.en} yesterday`, hintEn: isBasic ? 'Check the verb form for third person' : 'Check the past tense form', hintEs: isBasic ? 'Revisa la forma del verbo para tercera persona' : 'Revisa la forma del pasado', audioText: isBasic ? `She likes ${w7.en}` : `She had ${w7.en} yesterday`, options: '[]', correctAnswer: isBasic ? `She likes ${w7.en}` : `She had ${w7.en} yesterday`, explanation: isBasic ? 'Third person singular uses "likes" not "like"' : 'Past tense uses "had" not "have"', explanationEs: isBasic ? 'Tercera persona singular usa "likes" no "like"' : 'Pasado usa "had" no "have"', points: 15 });
    const wrong2 = getWrongOptions(vocab, w3.en, 3);
    questions.push({ type: 'multiple_choice', prompt: `Which word means "${w3.es}"?`, promptEs: `¿Qué palabra significa "${w3.es}"?`, hintEn: `Think about the ${topic.toLowerCase()} vocabulary`, hintEs: `Piensa en el vocabulario de ${topicEs.toLowerCase()}`, audioText: `Which word means ${w3.es}?`, options: JSON.stringify([w3.en, ...wrong2]), correctAnswer: w3.en, explanation: `"${w3.es}" = "${w3.en}"`, explanationEs: `"${w3.es}" = "${w3.en}"`, points: 10 });
    questions.push({ type: 'flashcard', prompt: `${w5.en} - ${w5.es}`, promptEs: `${w5.es} - ${w5.en}`, hintEn: `Remember this ${topic.toLowerCase()} word`, hintEs: `Recuerda esta palabra de ${topicEs.toLowerCase()}`, audioText: w5.en, options: '[]', correctAnswer: w5.en, explanation: `"${w5.en}" = "${w5.es}"`, explanationEs: `"${w5.en}" = "${w5.es}"`, points: 5 });
    questions.push({ type: 'fill_blank', prompt: `We call "${w0.es}" ___ in English`, promptEs: `Llamamos "${w0.es}" ___ en inglés`, hintEn: `It is a common ${topic.toLowerCase()} word`, hintEs: `Es una palabra común de ${topicEs.toLowerCase()}`, audioText: `We call ${w0.es} ${w0.en} in English`, options: '[]', correctAnswer: w0.en, explanation: `"${w0.es}" is called "${w0.en}" in English`, explanationEs: `"${w0.es}" se dice "${w0.en}" en inglés`, points: 10 });

  } else if (lessonType === 'grammar') {
    const gWords = pickRandom(vocab, 3);
    const s1Words = ['I', 'am', 'learning', 'about', gWords[0].en];
    questions.push({ type: 'build_sentence', prompt: `Build: I / am / learning / about / ${gWords[0].en}`, promptEs: `Construye: I / am / learning / about / ${gWords[0].en}`, hintEn: 'Present continuous: subject + am/is/are + verb-ing', hintEs: 'Presente continuo: sujeto + am/is/are + verbo-ing', audioText: `I am learning about ${gWords[0].en}`, options: JSON.stringify(shuffle(s1Words)), correctAnswer: `I am learning about ${gWords[0].en}`, explanation: `The correct sentence is "I am learning about ${gWords[0].en}"`, explanationEs: `La oración correcta es "I am learning about ${gWords[0].en}"`, points: 15 });
    questions.push({ type: 'find_error', prompt: isBasic ? `Find the mistake: She go to the ${gWords[1].en} every day` : `Find the mistake: She have went to the ${gWords[1].en} yesterday`, promptEs: isBasic ? `Encuentra el error: She go to the ${gWords[1].en} every day` : `Encuentra el error: She have went to the ${gWords[1].en} yesterday`, hintEn: isBasic ? 'Check the verb form for third person singular' : 'Check the tense consistency', hintEs: isBasic ? 'Revisa la forma del verbo para tercera persona' : 'Revisa la consistencia del tiempo', audioText: isBasic ? `She goes to the ${gWords[1].en} every day` : `She went to the ${gWords[1].en} yesterday`, options: '[]', correctAnswer: isBasic ? `She goes to the ${gWords[1].en} every day` : `She went to the ${gWords[1].en} yesterday`, explanation: isBasic ? 'Third person singular uses "goes" not "go"' : 'Past simple uses "went" not "have went"', explanationEs: isBasic ? 'Tercera persona singular usa "goes" no "go"' : 'Pasado simple usa "went" no "have went"', points: 15 });
    questions.push({ type: 'multiple_choice', prompt: `Which sentence about ${gWords[2].en} is correct?`, promptEs: `¿Qué oración sobre ${gWords[2].en} es correcta?`, hintEn: 'Check grammar carefully', hintEs: 'Revisa la gramática con cuidado', audioText: `Which sentence about ${gWords[2].en} is correct?`, options: JSON.stringify([`I need a ${gWords[2].en}`, `I need an ${gWords[2].en}`, `I needs a ${gWords[2].en}`, `I needing a ${gWords[2].en}`]), correctAnswer: `I need a ${gWords[2].en}`, explanation: `"I need a ${gWords[2].en}" uses the correct grammar: subject + verb + article + noun`, explanationEs: `"I need a ${gWords[2].en}" usa la gramática correcta: sujeto + verbo + artículo + sustantivo`, points: 10 });
    questions.push({ type: 'fill_blank', prompt: isBasic ? `There ___ many ${gWords[0].en} here` : `The ${gWords[0].en} has been ___ recently`, promptEs: isBasic ? `Hay ___ muchos ${gWords[0].es} aquí` : `El/la ${gWords[0].es} ha sido ___ recientemente`, hintEn: isBasic ? 'Use "are" for plural nouns' : 'Use the past participle form', hintEs: isBasic ? 'Usa "are" para sustantivos plurales' : 'Usa la forma del participio pasado', audioText: isBasic ? `There are many ${gWords[0].en} here` : `The ${gWords[0].en} has been improved recently`, options: '[]', correctAnswer: isBasic ? 'are' : 'improved', explanation: isBasic ? 'Use "are" with plural nouns' : 'Use "improved" as past participle with "has been"', explanationEs: isBasic ? 'Usa "are" con sustantivos plurales' : 'Usa "improved" como participio pasado con "has been"', points: 10 });
    questions.push({ type: 'translate', prompt: isBasic ? `Translate: Yo necesito ${gWords[1].es}` : `Translate: Ella ha estudiado sobre ${gWords[1].es}`, promptEs: isBasic ? `Traduce: Yo necesito ${gWords[1].es}` : `Traduce: Ella ha estudiado sobre ${gWords[1].es}`, hintEn: 'Think about the correct grammar structure in English', hintEs: 'Piensa en la estructura gramatical correcta en inglés', audioText: isBasic ? `I need ${gWords[1].en}` : `She has studied about ${gWords[1].en}`, options: '[]', correctAnswer: isBasic ? `I need ${gWords[1].en}` : `She has studied about ${gWords[1].en}`, explanation: 'The correct translation uses proper English grammar', explanationEs: 'La traducción correcta usa la gramática apropiada del inglés', points: 15 });
    const s2Words = ['We', 'enjoy', gWords[2].en, 'very', 'much'];
    questions.push({ type: 'order_words', prompt: `Put these words in order: enjoy / ${gWords[2].en} / We / very / much`, promptEs: `Pon estas palabras en orden: enjoy / ${gWords[2].es} / We / very / much`, hintEn: 'Start with the subject, then verb, then object', hintEs: 'Empieza con el sujeto, luego el verbo, luego el objeto', audioText: `We enjoy ${gWords[2].en} very much`, options: JSON.stringify(shuffle(s2Words)), correctAnswer: `We enjoy ${gWords[2].en} very much`, explanation: `The correct sentence is "We enjoy ${gWords[2].en} very much"`, explanationEs: `La oración correcta es "We enjoy ${gWords[2].en} very much"`, points: 15 });
    questions.push({ type: 'listen_write', prompt: `Listen and write the sentence you hear`, promptEs: `Escucha y escribe la oración que oyes`, hintEn: 'Pay attention to grammar and word order', hintEs: 'Presta atención a la gramática y el orden de las palabras', audioText: `I enjoy learning about ${gWords[0].en}`, options: '[]', correctAnswer: `I enjoy learning about ${gWords[0].en}`, explanation: `The correct transcription is: I enjoy learning about ${gWords[0].en}`, explanationEs: `La transcripción correcta es: I enjoy learning about ${gWords[0].en}`, points: 20 });
    questions.push({ type: 'pronunciation', prompt: `Practice saying: I enjoy learning about ${gWords[0].en}`, promptEs: `Practica diciendo: I enjoy learning about ${gWords[0].es}`, hintEn: 'Focus on clear pronunciation and natural rhythm', hintEs: 'Enfócate en pronunciación clara y ritmo natural', audioText: `I enjoy learning about ${gWords[0].en}`, options: '[]', correctAnswer: `I enjoy learning about ${gWords[0].en}`, explanation: `Practice this sentence about ${gWords[0].en} with clear pronunciation`, explanationEs: `Practica esta oración sobre ${gWords[0].es} con pronunciación clara`, points: 10 });
    questions.push({ type: 'find_error', prompt: isBasic ? `Find the mistake: They has two ${gWords[2].en}` : `Find the mistake: If I would have ${gWords[2].en}, I would be happy`, promptEs: isBasic ? `Encuentra el error: They has two ${gWords[2].en}` : `Encuentra el error: If I would have ${gWords[2].en}, I would be happy`, hintEn: isBasic ? 'Check subject-verb agreement' : 'Conditional sentences use "had" not "would have" in the if-clause', hintEs: isBasic ? 'Revisa la concordancia sujeto-verbo' : 'Las condicionales usan "had" no "would have" en la cláusula if', audioText: isBasic ? `They have two ${gWords[2].en}` : `If I had ${gWords[2].en}, I would be happy`, options: '[]', correctAnswer: isBasic ? `They have two ${gWords[2].en}` : `If I had ${gWords[2].en}, I would be happy`, explanation: isBasic ? '"They" takes "have" not "has"' : 'In the if-clause of a second conditional, use "had" not "would have"', explanationEs: isBasic ? '"They" usa "have" no "has"' : 'En la cláusula if del segundo condicional, usa "had" no "would have"', points: 15 });
    const s3Words = ['Do', 'you', 'like', gWords[1].en, '?'];
    questions.push({ type: 'build_sentence', prompt: `Build a question: Do / you / like / ${gWords[1].en} / ?`, promptEs: `Construye una pregunta: Do / you / like / ${gWords[1].es} / ?`, hintEn: 'Question form: auxiliary + subject + verb + object', hintEs: 'Forma de pregunta: auxiliar + sujeto + verbo + objeto', audioText: `Do you like ${gWords[1].en}?`, options: JSON.stringify(shuffle(s3Words)), correctAnswer: `Do you like ${gWords[1].en}?`, explanation: `The correct question is "Do you like ${gWords[1].en}?"`, explanationEs: `La pregunta correcta es "Do you like ${gWords[1].en}?"`, points: 15 });
    questions.push({ type: 'fill_blank', prompt: `She ___ ${gWords[0].en} every day (present simple, third person)`, promptEs: `Ella ___ ${gWords[0].es} todos los días (presente simple, tercera persona)`, hintEn: 'Add -s or -es to the base form for third person singular', hintEs: 'Agrega -s o -es a la forma base para tercera persona singular', audioText: `She uses ${gWords[0].en} every day`, options: '[]', correctAnswer: 'uses', explanation: 'Third person singular present simple adds -s or -es to the verb', explanationEs: 'La tercera persona singular del presente simple agrega -s o -es al verbo', points: 10 });
    const gMatchWords = pickRandom(vocab, 3);
    questions.push({ type: 'match_concepts', prompt: `Match the ${topic.toLowerCase()} words with their English translations`, promptEs: `Relaciona las palabras de ${topicEs.toLowerCase()} con sus traducciones al inglés`, hintEn: gMatchWords.map(w => `${w.es}=${w.en}`).join(', '), hintEs: gMatchWords.map(w => `${w.es}=${w.en}`).join(', '), audioText: `Match the ${topic.toLowerCase()} words`, options: JSON.stringify(gMatchWords.map(w => `${w.es}-${w.en}`)), correctAnswer: gMatchWords.map(w => w.en).join(' '), explanation: gMatchWords.map(w => `${w.es} = ${w.en}`).join(', '), explanationEs: gMatchWords.map(w => `${w.es} = ${w.en}`).join(', '), points: 15 });

  } else {
    const cWords = pickRandom(vocab, 5);
    const wrongC = getWrongOptions(vocab, cWords[0].en, 3);
    questions.push({ type: 'multiple_choice', prompt: `In a conversation about ${topic.toLowerCase()}, someone says "${cWords[0].es}". What do they mean?`, promptEs: `En una conversación sobre ${topicEs.toLowerCase()}, alguien dice "${cWords[0].es}". ¿Qué significa?`, hintEn: `Think about the English word for "${cWords[0].es}"`, hintEs: `Piensa en la palabra en inglés para "${cWords[0].es}"`, audioText: `What does ${cWords[0].es} mean?`, options: JSON.stringify([cWords[0].en, ...wrongC]), correctAnswer: cWords[0].en, explanation: `"${cWords[0].es}" means "${cWords[0].en}" in English`, explanationEs: `"${cWords[0].es}" significa "${cWords[0].en}" en inglés`, points: 10 });
    questions.push({ type: 'listen_write', prompt: `Listen and write the ${topic.toLowerCase()} sentence you hear`, promptEs: `Escucha y escribe la oración de ${topicEs.toLowerCase()} que oyes`, hintEn: 'Pay attention to every word', hintEs: 'Presta atención a cada palabra', audioText: `Can you tell me about ${cWords[1].en}?`, options: '[]', correctAnswer: `Can you tell me about ${cWords[1].en}?`, explanation: `The correct transcription is: Can you tell me about ${cWords[1].en}?`, explanationEs: `La transcripción correcta es: Can you tell me about ${cWords[1].en}?`, points: 20 });
    questions.push({ type: 'translate', prompt: isBasic ? `Translate to English: Quiero ${cWords[2].es}` : `Translate: Me gustaría saber más sobre ${cWords[2].es}`, promptEs: isBasic ? `Traduce al inglés: Quiero ${cWords[2].es}` : `Traduce: Me gustaría saber más sobre ${cWords[2].es}`, hintEn: 'Think about the correct grammar structure', hintEs: 'Piensa en la estructura gramatical correcta', audioText: isBasic ? `I want ${cWords[2].en}` : `I would like to know more about ${cWords[2].en}`, options: '[]', correctAnswer: isBasic ? `I want ${cWords[2].en}` : `I would like to know more about ${cWords[2].en}`, explanation: 'The correct translation uses proper English grammar', explanationEs: 'La traducción correcta usa la gramática apropiada del inglés', points: 15 });
    questions.push({ type: 'pronunciation', prompt: `Practice saying: "${cWords[3].en}"`, promptEs: `Practica diciendo: "${cWords[3].es}"`, hintEn: 'Focus on clear pronunciation', hintEs: 'Enfócate en una pronunciación clara', audioText: cWords[3].en, options: '[]', correctAnswer: cWords[3].en, explanation: `Practice saying "${cWords[3].en}" (${cWords[3].es}) clearly`, explanationEs: `Practica decir "${cWords[3].en}" (${cWords[3].es}) claramente`, points: 10 });
    const bWords = ['I', 'want', 'to', 'talk', 'about', cWords[0].en];
    questions.push({ type: 'build_sentence', prompt: `Build: I / want / to / talk / about / ${cWords[0].en}`, promptEs: `Construye: I / want / to / talk / about / ${cWords[0].es}`, hintEn: 'Subject + verb + infinitive phrase', hintEs: 'Sujeto + verbo + frase infinitiva', audioText: `I want to talk about ${cWords[0].en}`, options: JSON.stringify(shuffle(bWords)), correctAnswer: `I want to talk about ${cWords[0].en}`, explanation: `The correct sentence is "I want to talk about ${cWords[0].en}"`, explanationEs: `La oración correcta es "I want to talk about ${cWords[0].en}"`, points: 15 });
    questions.push({ type: 'find_error', prompt: isBasic ? `Find the mistake: I is learning about ${cWords[1].en}` : `Find the mistake: She don't like talking about ${cWords[1].en}`, promptEs: isBasic ? `Encuentra el error: I is learning about ${cWords[1].en}` : `Encuentra el error: She don't like talking about ${cWords[1].en}`, hintEn: isBasic ? 'Check the verb "to be" for "I"' : "Third person singular needs doesn't", hintEs: isBasic ? 'Revisa el verbo "to be" para "I"' : "Tercera persona singular necesita doesn't", audioText: isBasic ? `I am learning about ${cWords[1].en}` : `She doesn't like talking about ${cWords[1].en}`, options: '[]', correctAnswer: isBasic ? `I am learning about ${cWords[1].en}` : `She doesn't like talking about ${cWords[1].en}`, explanation: isBasic ? 'Use "am" with "I", not "is"' : "Use doesn't for third person negative, not don't", explanationEs: isBasic ? 'Usa "am" con "I", no "is"' : "Usa doesn't para negación en tercera persona, no don't", points: 15 });
    const qWords = ['Do', 'you', 'know', 'about', cWords[2].en];
    questions.push({ type: 'order_words', prompt: `Put these words in order to ask about ${cWords[2].en}: about / you / Do / know / ${cWords[2].en}`, promptEs: `Pon estas palabras en orden para preguntar sobre ${cWords[2].es}: about / you / Do / know / ${cWords[2].es}`, hintEn: 'This is a question - start with the auxiliary verb', hintEs: 'Esta es una pregunta - empieza con el verbo auxiliar', audioText: `Do you know about ${cWords[2].en}?`, options: JSON.stringify(shuffle(qWords)), correctAnswer: `Do you know about ${cWords[2].en}`, explanation: `The correct question is "Do you know about ${cWords[2].en}?"`, explanationEs: `La pregunta correcta es "Do you know about ${cWords[2].en}?"`, points: 15 });
    questions.push({ type: 'flashcard', prompt: `${cWords[3].en} - ${cWords[3].es}`, promptEs: `${cWords[3].es} - ${cWords[3].en}`, hintEn: `Remember this useful ${topic.toLowerCase()} word for conversations`, hintEs: `Recuerda esta palabra útil de ${topicEs.toLowerCase()} para conversaciones`, audioText: cWords[3].en, options: '[]', correctAnswer: cWords[3].en, explanation: `"${cWords[3].en}" (${cWords[3].es}) is a key word when discussing ${topic.toLowerCase()}`, explanationEs: `"${cWords[3].en}" (${cWords[3].es}) es una palabra clave al discutir ${topicEs.toLowerCase()}`, points: 5 });
    const cMatchWords = pickRandom(vocab, 3);
    questions.push({ type: 'match_concepts', prompt: `Match the ${topic.toLowerCase()} conversation terms with their English translations`, promptEs: `Relaciona los términos de conversación de ${topicEs.toLowerCase()} con sus traducciones al inglés`, hintEn: cMatchWords.map(w => `${w.es}=${w.en}`).join(', '), hintEs: cMatchWords.map(w => `${w.es}=${w.en}`).join(', '), audioText: `Match the ${topic.toLowerCase()} terms`, options: JSON.stringify(cMatchWords.map(w => `${w.es}-${w.en}`)), correctAnswer: cMatchWords.map(w => w.en).join(' '), explanation: cMatchWords.map(w => `${w.es} = ${w.en}`).join(', '), explanationEs: cMatchWords.map(w => `${w.es} = ${w.en}`).join(', '), points: 15 });
    questions.push({ type: 'fill_blank', prompt: `Can you explain what "${cWords[4].en}" means? It means ___ in Spanish`, promptEs: `¿Puedes explicar qué significa "${cWords[4].en}"? Significa ___ en español`, hintEn: `Think about the Spanish word for ${cWords[4].en}`, hintEs: `Piensa en la palabra en español para ${cWords[4].en}`, audioText: `${cWords[4].en} means ${cWords[4].es} in Spanish`, options: '[]', correctAnswer: cWords[4].es, explanation: `"${cWords[4].en}" means "${cWords[4].es}" in Spanish`, explanationEs: `"${cWords[4].en}" significa "${cWords[4].es}" en español`, points: 10 });
    const wrongC2 = getWrongOptions(vocab, cWords[4].en, 3);
    questions.push({ type: 'multiple_choice', prompt: `Your friend asks about ${cWords[4].en}. What is the best response?`, promptEs: `Tu amigo pregunta sobre ${cWords[4].en}. ¿Cuál es la mejor respuesta?`, hintEn: 'Choose the most informative and natural response', hintEs: 'Elige la respuesta más informativa y natural', audioText: `Your friend asks about ${cWords[4].en}. What is the best response?`, options: JSON.stringify([`It means "${cWords[4].es}"`, ...wrongC2.slice(0, 3)]), correctAnswer: `It means "${cWords[4].es}"`, explanation: `The best response is to explain that "${cWords[4].en}" means "${cWords[4].es}"`, explanationEs: `La mejor respuesta es explicar que "${cWords[4].en}" significa "${cWords[4].es}"`, points: 10 });
    const pronWords2 = [cWords[0].en, cWords[1].en, cWords[2].en].join(' ');
    questions.push({ type: 'pronunciation', prompt: `Practice saying these ${topic.toLowerCase()} words: ${pronWords2}`, promptEs: `Practica diciendo estas palabras de ${topicEs.toLowerCase()}: ${pronWords2}`, hintEn: 'Say each word clearly and slowly', hintEs: 'Di cada palabra clara y lentamente', audioText: pronWords2, options: '[]', correctAnswer: pronWords2, explanation: `These are important ${topic.toLowerCase()} conversation words`, explanationEs: `Estas son palabras importantes de conversación de ${topicEs.toLowerCase()}`, points: 10 });
    questions.push({ type: 'listen_write', prompt: `Listen and write the ${topic.toLowerCase()} word you hear`, promptEs: `Escucha y escribe la palabra de ${topicEs.toLowerCase()} que oyes`, hintEn: `This word means "${cWords[3].es}" in Spanish`, hintEs: `Esta palabra significa "${cWords[3].es}" en español`, audioText: cWords[3].en, options: '[]', correctAnswer: cWords[3].en, explanation: `The word is "${cWords[3].en}" (${cWords[3].es})`, explanationEs: `La palabra es "${cWords[3].en}" (${cWords[3].es})`, points: 15 });
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
