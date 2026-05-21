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
      coins: 150,
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
        { type: 'order_words', prompt: 'Put these letters in alphabetical order: D, B, A, C', promptEs: 'Pon estas letras en orden alfabético: D, B, A, C', hintEn: 'Start from the beginning of the alphabet', hintEs: 'Empieza desde el principio del alfabeto', audioText: 'Put these letters in alphabetical order', options: '["D","B","A","C"]', correctAnswer: 'A, B, C, D', explanation: 'The correct alphabetical order is A, B, C, D', explanationEs: 'El orden alfabético correcto es A, B, C, D', points: 15 },
        { type: 'multiple_choice', prompt: 'How many letters are in the English alphabet?', promptEs: '¿Cuántas letras hay en el alfabeto inglés?', hintEn: 'Count from A to Z', hintEs: 'Cuenta de la A a la Z', audioText: 'How many letters are in the English alphabet?', options: '["24","26","28","22"]', correctAnswer: '26', explanation: 'The English alphabet has 26 letters', explanationEs: 'El alfabeto inglés tiene 26 letras', points: 10 },
      ]
    }, {
      lessonTitle: 'Vowel Sounds', lessonTitleEs: 'Sonidos Vocálicos', lessonType: 'pronunciation',
      questions: [
        { type: 'multiple_choice', prompt: 'Which of these is a vowel?', promptEs: '¿Cuál de estas es una vocal?', hintEn: 'Vowels are A, E, I, O, U', hintEs: 'Las vocales son A, E, I, O, U', audioText: 'Which of these is a vowel?', options: '["B","E","K","T"]', correctAnswer: 'E', explanation: 'E is one of the five vowels: A, E, I, O, U', explanationEs: 'E es una de las cinco vocales: A, E, I, O, U', points: 10 },
        { type: 'flashcard', prompt: 'A - Apple', promptEs: 'A - Manzana', hintEn: 'A is for Apple', hintEs: 'A es para Manzana (Apple)', audioText: 'A, Apple', options: '[]', correctAnswer: 'A', explanation: 'A is the first vowel sound. Think of "Apple"', explanationEs: 'A es el primer sonido vocal. Piensa en "Apple"', points: 5 },
        { type: 'multiple_choice', prompt: 'How many vowels are in the English alphabet?', promptEs: '¿Cuántas vocales hay en el alfabeto inglés?', hintEn: 'A, E, I, O, U', hintEs: 'A, E, I, O, U', audioText: 'How many vowels are in the English alphabet?', options: '["4","5","6","3"]', correctAnswer: '5', explanation: 'There are 5 vowels: A, E, I, O, U', explanationEs: 'Hay 5 vocales: A, E, I, O, U', points: 10 },
      ]
    }],
    'numbers': [{
      lessonTitle: 'Counting 1-10', lessonTitleEs: 'Contando 1-10', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What number comes after 5?', promptEs: '¿Qué número viene después de 5?', hintEn: 'Count on your fingers', hintEs: 'Cuenta con tus dedos', audioText: 'What number comes after five?', options: '["4","6","7","3"]', correctAnswer: '6', explanation: '6 comes after 5', explanationEs: '6 viene después de 5', points: 10 },
        { type: 'fill_blank', prompt: 'The number 8 in English is ___', promptEs: 'El número 8 en inglés es ___', hintEn: 'It sounds like "eight"', hintEs: 'Suena como "eight"', audioText: 'The number eight in English is', options: '[]', correctAnswer: 'eight', explanation: '8 = eight', explanationEs: '8 = eight', points: 10 },
        { type: 'translate', prompt: 'Translate to English: tres', promptEs: 'Traduce al inglés: tres', hintEn: 'It rhymes with "free"', hintEs: 'Rima con "free"', audioText: 'Translate to English: tres', options: '[]', correctAnswer: 'three', explanation: 'tres = three', explanationEs: 'tres = three', points: 10 },
        { type: 'listen_write', prompt: 'Listen and write the number you hear', promptEs: 'Escucha y escribe el número que oyes', hintEn: 'Think of the number 7', hintEs: 'Piensa en el número 7', audioText: 'seven', options: '[]', correctAnswer: 'seven', explanation: 'The number is seven (7)', explanationEs: 'El número es seven (7)', points: 15 },
      ]
    }, {
      lessonTitle: 'Numbers 11-100', lessonTitleEs: 'Números 11-100', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'How do you say 12 in English?', promptEs: '¿Cómo se dice 12 en inglés?', hintEn: 'It starts with "twel"', hintEs: 'Empieza con "twel"', audioText: 'How do you say twelve in English?', options: '["twelve","twenty","two","ten-two"]', correctAnswer: 'twelve', explanation: '12 = twelve', explanationEs: '12 = twelve', points: 10 },
        { type: 'fill_blank', prompt: '25 in English is twenty-___', promptEs: '25 en inglés es twenty-___', hintEn: 'Think of 5 = five', hintEs: 'Piensa en 5 = five', audioText: 'Twenty-five', options: '[]', correctAnswer: 'five', explanation: '25 = twenty-five', explanationEs: '25 = twenty-five', points: 10 },
        { type: 'multiple_choice', prompt: 'What is 100 in English?', promptEs: '¿Qué es 100 en inglés?', hintEn: 'It starts with "hun"', hintEs: 'Empieza con "hun"', audioText: 'What is one hundred in English?', options: '["a hundred","one hundred","hundred","both A and B"]', correctAnswer: 'both A and B', explanation: '100 can be said as "a hundred" or "one hundred"', explanationEs: '100 se puede decir "a hundred" o "one hundred"', points: 15 },
      ]
    }],
    'colors': [{
      lessonTitle: 'Basic Colors', lessonTitleEs: 'Colores Básicos', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What color is the sky on a clear day?', promptEs: '¿De qué color está el cielo en un día despejado?', hintEn: 'Think of a sunny day', hintEs: 'Piensa en un día soleado', audioText: 'What color is the sky on a clear day?', options: '["Red","Blue","Green","Yellow"]', correctAnswer: 'Blue', explanation: 'The sky is blue on a clear day', explanationEs: 'El cielo es azul en un día despejado', points: 10 },
        { type: 'translate', prompt: 'Translate to English: rojo', promptEs: 'Traduce al inglés: rojo', hintEn: 'Think of fire', hintEs: 'Piensa en el fuego', audioText: 'Translate to English: rojo', options: '[]', correctAnswer: 'red', explanation: 'rojo = red', explanationEs: 'rojo = red', points: 10 },
        { type: 'fill_blank', prompt: 'Grass is ___', promptEs: 'El pasto es ___', hintEn: 'Think of nature', hintEs: 'Piensa en la naturaleza', audioText: 'Grass is green', options: '[]', correctAnswer: 'green', explanation: 'Grass is green (verde)', explanationEs: 'El pasto es green (verde)', points: 10 },
        { type: 'match_concepts', prompt: 'Match the colors with their English names', promptEs: 'Relaciona los colores con sus nombres en inglés', hintEn: 'amarillo=yellow, negro=black, blanco=white', hintEs: 'yellow=amarillo, black=negro, white=blanco', audioText: 'Match the colors', options: '["amarillo-yellow","negro-black","blanco-white"]', correctAnswer: 'yellow,black,white', explanation: 'amarillo=yellow, negro=black, blanco=white', explanationEs: 'amarillo=yellow, negro=black, blanco=white', points: 15 },
      ]
    }, {
      lessonTitle: 'More Colors', lessonTitleEs: 'Más Colores', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What color do you get when you mix red and white?', promptEs: '¿Qué color obtienes cuando mezclas rojo y blanco?', hintEn: 'Think of a flower', hintEs: 'Piensa en una flor', audioText: 'What color do you get when you mix red and white?', options: '["Orange","Pink","Purple","Brown"]', correctAnswer: 'Pink', explanation: 'Red + White = Pink', explanationEs: 'Rojo + Blanco = Rosa (Pink)', points: 15 },
        { type: 'translate', prompt: 'Translate to English: morado', promptEs: 'Traduce al inglés: morado', hintEn: 'Think of grapes', hintEs: 'Piensa en las uvas', audioText: 'Translate to English: morado', options: '[]', correctAnswer: 'purple', explanation: 'morado = purple', explanationEs: 'morado = purple', points: 10 },
        { type: 'flashcard', prompt: 'Orange - the color and the fruit!', promptEs: 'Orange - ¡el color y la fruta!', hintEn: 'Orange is both a color and a fruit', hintEs: 'Orange es tanto un color como una fruta', audioText: 'Orange', options: '[]', correctAnswer: 'orange', explanation: 'Orange is unique - it is both a color and a fruit name', explanationEs: 'Orange es único - es tanto un color como el nombre de una fruta', points: 5 },
      ]
    }],
    'greetings': [{
      lessonTitle: 'Hello & Goodbye', lessonTitleEs: 'Hola y Adiós', lessonType: 'vocabulary',
      questions: [
        { type: 'multiple_choice', prompt: 'What is the most common way to greet someone in English?', promptEs: '¿Cuál es la forma más común de saludar a alguien en inglés?', hintEn: 'It starts with H', hintEs: 'Empieza con H', audioText: 'What is the most common way to greet someone in English?', options: '["Goodbye","Hello","Sorry","Please"]', correctAnswer: 'Hello', explanation: 'Hello is the most common greeting', explanationEs: 'Hello es el saludo más común', points: 10 },
        { type: 'fill_blank', prompt: 'Good ___ (in the morning)', promptEs: 'Good ___ (por la mañana)', hintEn: 'Morning greeting', hintEs: 'Saludo matutino', audioText: 'Good morning', options: '[]', correctAnswer: 'morning', explanation: 'Good morning is used to greet someone in the morning', explanationEs: 'Good morning se usa para saludar por la mañana', points: 10 },
        { type: 'translate', prompt: 'Translate to English: buenas noches', promptEs: 'Traduce al inglés: buenas noches', hintEn: 'Used when saying goodbye at night', hintEs: 'Se usa al despedirse por la noche', audioText: 'Translate to English: buenas noches', options: '[]', correctAnswer: 'good night', explanation: 'buenas noches = good night', explanationEs: 'buenas noches = good night', points: 10 },
        { type: 'multiple_choice', prompt: 'Which greeting is informal/friendly?', promptEs: '¿Qué saludo es informal/amigable?', hintEn: 'Short and casual', hintEs: 'Corto y casual', audioText: 'Which greeting is informal?', options: '["Good evening","Hi","Good afternoon","How do you do"]', correctAnswer: 'Hi', explanation: 'Hi is an informal, friendly greeting', explanationEs: 'Hi es un saludo informal y amigable', points: 10 },
      ]
    }, {
      lessonTitle: 'Introductions', lessonTitleEs: 'Presentaciones', lessonType: 'conversation',
      questions: [
        { type: 'fill_blank', prompt: 'My name ___ John', promptEs: 'Mi nombre ___ John', hintEn: 'Use the verb "is"', hintEs: 'Usa el verbo "is"', audioText: 'My name is John', options: '[]', correctAnswer: 'is', explanation: '"My name is..." is the standard way to introduce yourself', explanationEs: '"My name is..." es la forma estándar de presentarse', points: 10 },
        { type: 'multiple_choice', prompt: 'How do you ask someone their name?', promptEs: '¿Cómo le preguntas a alguien su nombre?', hintEn: 'Think politely', hintEs: 'Piensa con cortesía', audioText: 'How do you ask someone their name?', options: '["What is your name?","Who are you?","Tell me your name","Your name?"]', correctAnswer: 'What is your name?', explanation: '"What is your name?" is the polite way to ask', explanationEs: '"What is your name?" es la forma cortés de preguntar', points: 10 },
        { type: 'build_sentence', prompt: 'Build: Nice / to / you / meet', promptEs: 'Construye: Nice / to / you / meet', hintEn: 'Standard introduction phrase', hintEs: 'Frase estándar de presentación', audioText: 'Nice to meet you', options: '["Nice","to","you","meet"]', correctAnswer: 'Nice to meet you', explanation: 'Nice to meet you is the standard response when introduced', explanationEs: 'Nice to meet you es la respuesta estándar al ser presentado', points: 15 },
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
    { slug: 'daily-exercises-5', title: 'Exercise Time', titleEs: 'Hora de Ejercicio', description: 'Complete 5 exercises today', descriptionEs: 'Completa 5 ejercicios hoy', type: 'daily', category: 'exercises', requirement: 5, rewardXp: 25, rewardCoins: 10, icon: '💪' },
    { slug: 'daily-pronunciation', title: 'Speak Up!', titleEs: '¡Habla!', description: 'Practice pronunciation 3 times', descriptionEs: 'Practica pronunciación 3 veces', type: 'daily', category: 'pronunciation', requirement: 3, rewardXp: 20, rewardCoins: 8, icon: '🗣️' },
    { slug: 'daily-xp-50', title: 'XP Hunter', titleEs: 'Cazador de XP', description: 'Earn 50 XP today', descriptionEs: 'Gana 50 XP hoy', type: 'daily', category: 'xp', requirement: 50, rewardXp: 15, rewardCoins: 5, icon: '✨' },
    { slug: 'daily-streak', title: 'Keep the Flame', titleEs: 'Mantén la Llama', description: 'Maintain your daily streak', descriptionEs: 'Mantén tu racha diaria', type: 'daily', category: 'streak', requirement: 1, rewardXp: 10, rewardCoins: 5, icon: '🔥' },
    { slug: 'daily-scenario', title: 'Scenario Explorer', titleEs: 'Explorador de Escenarios', description: 'Complete 1 scenario today', descriptionEs: 'Completa 1 escenario hoy', type: 'daily', category: 'scenarios', requirement: 1, rewardXp: 30, rewardCoins: 15, icon: '🗺️' },
    { slug: 'weekly-exercises-30', title: 'Exercise Marathon', titleEs: 'Maratón de Ejercicios', description: 'Complete 30 exercises this week', descriptionEs: 'Completa 30 ejercicios esta semana', type: 'weekly', category: 'exercises', requirement: 30, rewardXp: 100, rewardCoins: 50, icon: '🏃' },
    { slug: 'weekly-xp-500', title: 'XP Machine', titleEs: 'Máquina de XP', description: 'Earn 500 XP this week', descriptionEs: 'Gana 500 XP esta semana', type: 'weekly', category: 'xp', requirement: 500, rewardXp: 75, rewardCoins: 40, icon: '⚡' },
    { slug: 'weekly-scenarios-5', title: 'World Tour', titleEs: 'Gira Mundial', description: 'Complete 5 scenarios this week', descriptionEs: 'Completa 5 escenarios esta semana', type: 'weekly', category: 'scenarios', requirement: 5, rewardXp: 120, rewardCoins: 60, icon: '🌍' },
  ];

  for (const m of missions) {
    await db.mission.create({ data: m });
  }

  // ============================================
  // CREATE REWARDS
  // ============================================
  console.log('🎁 Creating rewards...');
  const rewards = [
    { slug: 'avatar-fox', name: 'Fox Avatar', nameEs: 'Avatar Zorro', description: 'A clever fox avatar', descriptionEs: 'Un avatar de zorro astuto', type: 'avatar', icon: '🦊', cost: 50, rarity: 'common' },
    { slug: 'avatar-tiger', name: 'Tiger Avatar', nameEs: 'Avatar Tigre', description: 'A fierce tiger avatar', descriptionEs: 'Un avatar de tigre feroz', type: 'avatar', icon: '🐯', cost: 100, rarity: 'rare' },
    { slug: 'avatar-lion', name: 'Lion Avatar', nameEs: 'Avatar León', description: 'The king of the jungle', descriptionEs: 'El rey de la selva', type: 'avatar', icon: '🦁', cost: 150, rarity: 'rare' },
    { slug: 'avatar-dragon', name: 'Dragon Avatar', nameEs: 'Avatar Dragón', description: 'A legendary dragon avatar', descriptionEs: 'Un avatar de dragón legendario', type: 'avatar', icon: '🐉', cost: 300, rarity: 'epic' },
    { slug: 'avatar-unicorn', name: 'Unicorn Avatar', nameEs: 'Avatar Unicornio', description: 'A magical unicorn avatar', descriptionEs: 'Un avatar de unicornio mágico', type: 'avatar', icon: '🦄', cost: 500, rarity: 'legendary' },
    { slug: 'frame-gold', name: 'Gold Frame', nameEs: 'Marco Dorado', description: 'A shiny gold frame for your avatar', descriptionEs: 'Un marco dorado brillante para tu avatar', type: 'frame', icon: '🖼️', cost: 200, rarity: 'rare' },
    { slug: 'frame-diamond', name: 'Diamond Frame', nameEs: 'Marco Diamante', description: 'A sparkling diamond frame', descriptionEs: 'Un marco de diamante brillante', type: 'frame', icon: '💎', cost: 400, rarity: 'epic' },
    { slug: 'frame-fire', name: 'Fire Frame', nameEs: 'Marco de Fuego', description: 'A blazing fire frame', descriptionEs: 'Un marco de fuego ardiente', type: 'frame', icon: '🔥', cost: 350, rarity: 'epic' },
    { slug: 'title-word-master', name: 'Word Master', nameEs: 'Maestro de Palabras', description: 'A prestigious title', descriptionEs: 'Un título prestigioso', type: 'title', icon: '📝', cost: 250, rarity: 'rare' },
    { slug: 'title-grammar-guru', name: 'Grammar Guru', nameEs: 'Gurú de Gramática', description: 'Master of grammar', descriptionEs: 'Maestro de la gramática', type: 'title', icon: '📖', cost: 300, rarity: 'rare' },
    { slug: 'title-fluent', name: 'Fluent Speaker', nameEs: 'Hablante Fluido', description: 'Speak like a native', descriptionEs: 'Habla como un nativo', type: 'title', icon: '🗣️', cost: 500, rarity: 'legendary' },
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
    // Vocabulary questions
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
  } else if (lessonType === 'grammar') {
    questions.push({
      type: 'build_sentence',
      prompt: `Build a sentence about ${topic.toLowerCase()}`,
      promptEs: `Construye una oración sobre ${topicEs.toLowerCase()}`,
      hintEn: 'Put the words in the correct order',
      hintEs: 'Pon las palabras en el orden correcto',
      audioText: `Build a sentence about ${topic.toLowerCase()}`,
      options: '["I","like","learning","about"]',
      correctAnswer: `I like learning about`,
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
  } else {
    // Conversation/Challenge
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
      explanationEs: `La transcripción correcta es: I enjoy learning about ${topic.toLowerCase()}`,
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
      explanationEs: `Practica decir "${topic}" claramente`,
      points: 10,
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
