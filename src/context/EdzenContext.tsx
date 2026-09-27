import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, PetState, PetAccessory, QuestTask, HabitItem, SkillNode, 
  RoutineTemplate, SyllabusModule, QuestionChallenge, CoOpBoss, StudyBuddy, VerifiedCredential 
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const INITIAL_ACCESSORIES: PetAccessory[] = [
  // Hats
  { id: 'wizard_hat', name: 'Archmage Wizard Hat', slot: 'hat', icon: '🧙‍♂️', price: 120, unlocked: true, description: 'Grants +10 Focus Aura while deciphering complex equations' },
  { id: 'royal_crown', name: 'Sovereign Gold Crown', slot: 'hat', icon: '👑', price: 250, unlocked: false, description: 'Worn by scholars who consistently conquer their 25-min quests' },
  { id: 'scholar_cap', name: 'Honors Graduation Cap', slot: 'hat', icon: '🎓', price: 150, unlocked: false, description: 'Earned through disciplined, non-punitive routine mastery' },
  { id: 'lotus_flower', name: 'Zen Lotus Blossom', slot: 'hat', icon: '🪷', price: 90, unlocked: true, description: 'Radiates calming energy to protect against exam overwhelm' },

  // Glasses
  { id: 'cyber_shades', name: 'Astral Neon Visor', slot: 'glasses', icon: '🕶️', price: 140, unlocked: true, description: 'Filters out cognitive fatigue and blue light' },
  { id: 'nerd_glasses', name: 'Vintage Brass Spectacles', slot: 'glasses', icon: '👓', price: 80, unlocked: true, description: 'Increases progressive hint discernment in answer battles' },
  { id: 'starlight_goggles', name: 'Starlight Aviators', slot: 'glasses', icon: '🥽', price: 200, unlocked: false, description: 'Allows Edzemon to perceive hidden creative connections' },

  // Neck
  { id: 'cozy_scarf', name: 'Lavender Knit Scarf', slot: 'neck', icon: '🧣', price: 70, unlocked: true, description: 'Warm and comforting during late-night study sessions' },
  { id: 'astral_amulet', name: 'Celestial Pendulum', slot: 'neck', icon: '🔮', price: 180, unlocked: false, description: 'Glows softly whenever your study energy drops below 30%' },
  { id: 'bell_collar', name: 'Chime of Mindfulness', slot: 'neck', icon: '🔔', price: 100, unlocked: false, description: 'Tinkles gently to remind you to unclamp your jaw and breathe' },

  // Back
  { id: 'astral_cape', name: 'Midnight Nebula Cape', slot: 'back', icon: '🌌', price: 220, unlocked: true, description: 'Flows behind Edzemon as they wander your viewport' },
  { id: 'angel_wings', name: 'Seraphic Light Wings', slot: 'back', icon: '🪽', price: 300, unlocked: false, description: 'Floating wings of pure resilience for overwhelming days' },
  { id: 'jetpack', name: 'Cosmic Boost Jetpack', slot: 'back', icon: '🚀', price: 280, unlocked: false, description: 'Hyper-accelerates quest completion and boss attack power' },
];

export const INITIAL_TASKS: QuestTask[] = [
  {
    id: 't-1',
    title: 'Review Fourier Transforms & Discrete Signals',
    subject: 'Signals & Systems',
    estimatedMinutes: 30,
    energyRequired: 'high',
    priority: 'high',
    deadline: 'Today, 6:00 PM',
    completed: false,
    category: 'study',
    xpReward: 80,
    coinReward: 40,
    notes: 'Focus on inverse transform and frequency domain duality.'
  },
  {
    id: 't-2',
    title: 'Solve 4 Database Normalization Problem Sets (BCNF)',
    subject: 'Computer Systems',
    estimatedMinutes: 35,
    energyRequired: 'medium',
    priority: 'high',
    deadline: 'Tomorrow, 11:00 AM',
    completed: false,
    category: 'assignment',
    xpReward: 90,
    coinReward: 50,
    notes: 'Identify functional dependencies and lossless decomposition.'
  },
  {
    id: 't-3',
    title: 'Draft Abstract for Cognitive Biases Term Paper',
    subject: 'Psychology',
    estimatedMinutes: 25,
    energyRequired: 'medium',
    priority: 'medium',
    deadline: 'Oct 2, 2026',
    completed: false,
    category: 'assignment',
    xpReward: 60,
    coinReward: 30,
    notes: 'Synthesize Kahneman System 1 vs System 2 research.'
  },
  {
    id: 't-4',
    title: '5-Minute Desk Decompression & Hydration',
    subject: 'Wellness',
    estimatedMinutes: 10,
    energyRequired: 'low',
    priority: 'low',
    deadline: 'Anytime',
    completed: true,
    category: 'wellness',
    xpReward: 30,
    coinReward: 20,
    notes: 'Gentle spinal twists and 3 deep physiological sighs.'
  },
  {
    id: 't-5',
    title: 'Spanish Vocabulary Drill: Subjunctive Mood',
    subject: 'Linguistics',
    estimatedMinutes: 20,
    energyRequired: 'low',
    priority: 'medium',
    deadline: 'Today, 9:00 PM',
    completed: false,
    category: 'revision',
    xpReward: 50,
    coinReward: 25,
    notes: 'Spaced repetition flashcards review.'
  }
];

export const INITIAL_HABITS: HabitItem[] = [
  { id: 'h-1', title: '25-Min Deep Focus Sprint', category: 'Focus', frequency: 'daily', streak: 12, completedToday: true, forgivenessTokens: 2, icon: '🎯' },
  { id: 'h-2', title: 'Drink 2L Water During Sessions', category: 'Health', frequency: 'daily', streak: 8, completedToday: false, forgivenessTokens: 3, icon: '💧' },
  { id: 'h-3', title: 'Pre-Exam Active Recall / Flashcards', category: 'Academics', frequency: 'daily', streak: 5, completedToday: false, forgivenessTokens: 2, icon: '🧠' },
  { id: 'h-4', title: 'Screen Sunset 30m Before Sleep', category: 'Sleep', frequency: 'daily', streak: 4, completedToday: false, forgivenessTokens: 1, icon: '🌙' },
];

export const INITIAL_ROUTINES: RoutineTemplate[] = [
  {
    id: 'r-1',
    name: 'The Balanced Zen Scholar',
    description: 'Designed for high academic retention with strict guardrails against cognitive exhaustion.',
    tag: 'Sustainable / All-Rounder',
    author: 'Dr. Evelyn Vance (Cognitive Lab)',
    upvotes: 1420,
    recommendedFor: 'Students with 3+ technical courses needing steady daily rhythm',
    tasks: [
      { title: 'Morning Brain Priming & Flashcards', minutes: 25, timeOfDay: 'Morning', energy: 'low' },
      { title: 'Hardest Core Concept Problem Solving', minutes: 45, timeOfDay: 'Morning', energy: 'high' },
      { title: 'Post-Lunch Light Reading / Review', minutes: 30, timeOfDay: 'Afternoon', energy: 'medium' },
      { title: 'Daily Wind-Down & Desk Reset', minutes: 15, timeOfDay: 'Evening', energy: 'low' }
    ]
  },
  {
    id: 'r-2',
    name: 'ADHD-Friendly 25-Min Sprint Routine',
    description: 'Micro-bursts of interest-driven learning with built-in dopamine rewards and movement prompts.',
    tag: 'Dopamine-Optimized / ADHD',
    author: 'Samir Patel (Neurodiversity Guild)',
    upvotes: 2190,
    recommendedFor: 'Students experiencing executive dysfunction or rapid task-switching urges',
    tasks: [
      { title: '5-Minute Novelty Primer (Any interesting topic)', minutes: 15, timeOfDay: 'Morning', energy: 'low' },
      { title: 'High-Impact Pomodoro Sprint with Edzemon', minutes: 25, timeOfDay: 'Morning', energy: 'high' },
      { title: 'Audio/Podcast Walk & Revision', minutes: 20, timeOfDay: 'Afternoon', energy: 'low' },
      { title: 'Zero-Guilt Free Time & Habit Shield Check', minutes: 10, timeOfDay: 'Night', energy: 'low' }
    ]
  },
  {
    id: 'r-3',
    name: 'Night Owl Deep Work Protocol',
    description: 'Capitalizes on nocturnal quiet hours without wrecking the following day circadian rhythms.',
    tag: 'Nocturnal / High Flow',
    author: 'Devon K. (OpenSource Maintainer)',
    upvotes: 980,
    recommendedFor: 'Students who naturally hit peak focus between 8 PM and midnight',
    tasks: [
      { title: 'Evening Energy Boost & Brain Dump', minutes: 20, timeOfDay: 'Evening', energy: 'medium' },
      { title: 'Deep Architecture & Coding / Heavy Math', minutes: 45, timeOfDay: 'Night', energy: 'high' },
      { title: 'Secondary Focus: Theory & Synthesis', minutes: 35, timeOfDay: 'Night', energy: 'medium' },
      { title: 'Blue-Light Cutoff & Somatic Stretch', minutes: 15, timeOfDay: 'Night', energy: 'low' }
    ]
  },
  {
    id: 'r-4',
    name: 'Exam Rescue 72-Hour Rapid Triage',
    description: 'Emergency triage routine: strips away perfectionism and isolates 80/20 high-yield concepts.',
    tag: 'Exam Survival / High Yield',
    author: 'EDZEN Academic Board',
    upvotes: 3410,
    recommendedFor: 'Students facing midterms in under 3 days with overwhelming backlogs',
    tasks: [
      { title: 'Past Exam Question Pattern Deconstruction', minutes: 35, timeOfDay: 'Morning', energy: 'high' },
      { title: 'Active Recall on Formula Sheets', minutes: 25, timeOfDay: 'Afternoon', energy: 'medium' },
      { title: 'Practice Test Battle Under Time Pressure', minutes: 40, timeOfDay: 'Evening', energy: 'high' },
      { title: 'Gentle Sleep Protection (Minimum 7h rest mandatory)', minutes: 10, timeOfDay: 'Night', energy: 'low' }
    ]
  }
];

export const INITIAL_SYLLABUS_MODULES: SyllabusModule[] = [
  {
    id: 's-1',
    code: 'MATH-302',
    name: 'Multivariable Calculus & Vector Fields',
    totalChapters: 8,
    completedChapters: 6,
    examDate: 'Oct 14, 2026',
    difficulty: 'Challenging',
    isWeakSubject: true,
    keyConcepts: [
      {
        term: "Green's Theorem",
        summary: {
          en: "Relates a line integral around a simple closed curve C to a double integral over the plane region D bounded by C.",
          hi: "एक बंद वक्र C के रेखा समाकलन को C द्वारा घिरे तल क्षेत्र D के दोहरे समाकलन से जोड़ता है।",
          ml: "ഒരു അടഞ്ഞ വക്രത്തിന് ചുറ്റുമുള്ള ലൈൻ ഇന്റഗ്രലിനെ അത് ഉൾക്കൊള്ളുന്ന തലത്തിന്റെ ഡബിൾ ഇന്റഗ്രലുമായി ബന്ധിപ്പിക്കുന്നു.",
          es: "Relaciona una integral de línea alrededor de una curva simple cerrada C con una integral doble sobre la región plana D.",
          ta: "ஒரு மூடிய வளைகோட்டின் கோட்டுத் தொகையீட்டை, அதனால் சூழப்பட்ட பரப்பின் இரட்டைத் தொகையீட்டுடன் இணைக்கிறது."
        }
      },
      {
        term: "Gradient Vector & Directional Derivative",
        summary: {
          en: "The gradient points in the direction of greatest rate of increase of a scalar field, with magnitude equal to the maximum rate.",
          hi: "प्रवणता (Gradient) अदिश क्षेत्र के अधिकतम वृद्धि की दिशा को दर्शाती है।",
          ml: "ഒരു ഫംഗ്ഷന്റെ ഏറ്റവും ഉയർന്ന വർദ്ധനവിന്റെ ദിശയെ ഗ്രേഡിയന്റ് വെക്റ്റർ സൂചിപ്പിക്കുന്നു.",
          es: "El gradiente apunta en la dirección de mayor tasa de incremento de un campo escalar.",
          ta: "கிரேடியண்ட் ஒரு செயல்பாட்டின் அதிகபட்ச அதிகரிப்பின் திசையைக் குறிக்கிறது."
        }
      }
    ]
  },
  {
    id: 's-2',
    code: 'CS-401',
    name: 'Distributed Systems & Consensus',
    totalChapters: 6,
    completedChapters: 4,
    examDate: 'Oct 22, 2026',
    difficulty: 'Comfortable',
    isWeakSubject: false,
    keyConcepts: [
      {
        term: "Raft Consensus Algorithm",
        summary: {
          en: "Decomposes consensus into leader election, log replication, and safety. Easy to understand and implement.",
          hi: "सहमति एल्गोरिदम जिसे लीडर चुनाव, लॉग प्रतिकृति और सुरक्षा में विभाजित किया गया है।",
          ml: "ഡിസ്ട്രിബ്യൂട്ടഡ് സിസ്റ്റങ്ങളിൽ സമവായം ഉണ്ടാക്കാനുപയോഗിക്കുന്ന സുതാര്യമായ അൽഗോരിതം.",
          es: "Descompone el consenso distribuido en elección de líder, replicación de registros y seguridad.",
          ta: "தலைவர் தேர்தல் மற்றும் பதிவு பிரதி மூலம் விநியோகிக்கப்பட்ட அமைப்புகளில் உடன்பாட்டை உருவாக்குகிறது."
        }
      },
      {
        term: "CAP Theorem",
        summary: {
          en: "States that a distributed data store can simultaneously provide at most two of: Consistency, Availability, Partition tolerance.",
          hi: "एक वितरित डेटा स्टोर एक समय में केवल दो गुण दे सकता है: निरंतरता, उपलब्धता या विभाजन सहनशीलता।",
          ml: "ഒരു വിതരണ ഡാറ്റാബേസിന് ഒരേസമയം സ്ഥിരത, ലഭ്യത, പാർട്ടീഷൻ ടോളറൻസ് എന്നിവയിൽ രണ്ടെണ്ണം മാത്രമേ നൽകാൻ കഴിയൂ.",
          es: "Establece que un sistema distribuido solo puede garantizar dos de: Consistencia, Disponibilidad o Tolerancia a particiones.",
          ta: "ஒரு விநியோகிக்கப்பட்ட தரவுத்தளம் ஒரே நேரத்தில் நிலைத்தன்மை, கிடைக்கும் தன்மை அல்லது பகிர்வு சகிப்புத்தன்மை ஆகியவற்றில் இரண்டை மட்டுமே வழங்க முடியும்."
        }
      }
    ]
  },
  {
    id: 's-3',
    code: 'NEURO-210',
    name: 'Cognitive Neuroscience & Memory',
    totalChapters: 7,
    completedChapters: 3,
    examDate: 'Nov 05, 2026',
    difficulty: 'High Alert',
    isWeakSubject: true,
    keyConcepts: [
      {
        term: "Long-Term Potentiation (LTP)",
        summary: {
          en: "Persistent strengthening of synapses based on recent patterns of activity, considered the primary cellular mechanism of learning and memory.",
          hi: "हाल की गतिविधियों के आधार पर सिनेप्स का स्थायी सुदृढ़ीकरण, जो सीखने और स्मृति का मुख्य जैविक आधार है।",
          ml: "പഠനവും ഓർമ്മയും രൂപപ്പെടുന്നതിന് സഹായിക്കുന്ന ന്യൂറോണുകൾ തമ്മിലുള്ള ബന്ധത്തിന്റെ ദൃഢീകരണം.",
          es: "Fortalecimiento persistente de las sinapsis basado en patrones de actividad reciente; base celular del aprendizaje.",
          ta: "கற்றல் மற்றும் நினைவாற்றலின் முதன்மை செல்லுலார் பொறிமுறையாகக் கருதப்படும் சினாப்ஸ்களின் தொடர்ச்சியான வலுவூட்டல்."
        }
      }
    ]
  }
];

export const INITIAL_SKILLS: SkillNode[] = [
  { id: 'sk-1', title: 'Calculus & Optimization', category: 'Math & Logic', level: 1, unlocked: true, completed: true, progress: 100, credentialId: 'EDZ-MATH-8849', description: 'Differential forms, Lagrange multipliers, and convex optimization fundamentals.', prerequisites: [] },
  { id: 'sk-2', title: 'Linear Algebra & Tensors', category: 'Math & Logic', level: 2, unlocked: true, completed: false, progress: 65, description: 'Eigenvalues, SVD decomposition, and tensor transformations in n-dimensions.', prerequisites: ['sk-1'] },
  { id: 'sk-3', title: 'Operating Systems & Concurrency', category: 'Computer Systems', level: 1, unlocked: true, completed: true, progress: 100, credentialId: 'EDZ-SYS-2910', description: 'Virtual memory management, POSIX threading, deadlocks, and epoll mechanics.', prerequisites: [] },
  { id: 'sk-4', title: 'Distributed Systems & Raft', category: 'Computer Systems', level: 2, unlocked: true, completed: false, progress: 45, description: 'Byzantine fault tolerance, vector clocks, and linearizable consistency.', prerequisites: ['sk-3'] },
  { id: 'sk-5', title: 'Cognitive Architecture & Working Memory', category: 'Cognitive Psychology', level: 1, unlocked: true, completed: false, progress: 80, description: 'Baddeley model, phonological loops, executive function, and metacognition.', prerequisites: [] },
  { id: 'sk-6', title: 'Neuroplasticity & Habit Formation', category: 'Cognitive Psychology', level: 2, unlocked: false, completed: false, progress: 0, description: 'Hebbian learning, dopamine baseline management, and sustainable behavioral design.', prerequisites: ['sk-5'] },
  { id: 'sk-7', title: 'Cross-Linguistic Grammar & Semantics', category: 'Linguistics', level: 1, unlocked: true, completed: false, progress: 50, description: 'Morphosyntax, generative grammar trees, and multilingual cognitive transfer.', prerequisites: [] },
];

export const INITIAL_QUESTIONS: QuestionChallenge[] = [
  {
    id: 'q-1',
    subject: 'Computer Systems',
    question: 'Explain why a deadlock occurs in concurrent processes, and list the four Coffman conditions necessary for a deadlock to exist.',
    hints: [
      'Hint 1: Think about processes holding resources while waiting for another resource held by another process.',
      'Hint 2: Mutual exclusion is one condition. What about preemption?',
      'Hint 3: The 4 conditions are: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.'
    ],
    correctAnswerSummary: 'Deadlock happens when a set of concurrent processes are blocked because each holds a resource and waits for another resource held by another process. The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
    expectedKeywords: ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait', 'resource'],
    xp: 120,
    coins: 60
  },
  {
    id: 'q-2',
    subject: 'Mathematics',
    question: "State Green's Theorem and describe what the orientation of the boundary curve C must be for the standard theorem formula to hold.",
    hints: [
      'Hint 1: It equates a line integral around curve C with a double integral of (dQ/dx - dP/dy) dA.',
      'Hint 2: Boundary curve C must be piecewise smooth, simple, and positively oriented.',
      'Hint 3: Positive orientation means counter-clockwise so the region D always stays to the left.'
    ],
    correctAnswerSummary: "Green's Theorem states that for a positively oriented, piecewise-smooth simple closed curve C enclosing region D: ∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA. Curve C must be counter-clockwise (positive orientation).",
    expectedKeywords: ['line integral', 'double integral', 'counter-clockwise', 'positive orientation', 'region'],
    xp: 140,
    coins: 75
  },
  {
    id: 'q-3',
    subject: 'Cognitive Neuroscience',
    question: 'How does the "physiological sigh" trigger rapid somatic parasympathetic recovery in the autonomic nervous system?',
    hints: [
      'Hint 1: It involves a double inhale through the nose followed by a long, slow exhale through the mouth.',
      'Hint 2: It reinflates collapsed alveoli in the lungs.',
      'Hint 3: The extended exhale slows heart rate via the vagus nerve and the sinoatrial node.',
      'Hint 4: It shifts autonomic balance from sympathetic (fight/flight) to parasympathetic (rest/recover).'
    ],
    correctAnswerSummary: 'The physiological sigh consists of a double nasal inhale followed by an extended oral exhale. The second inhale reinflates collapsed lung alveoli, increasing surface area for CO2 offloading. The prolonged exhale increases thoracic pressure, causing the brain to signal the sinoatrial node via the vagus nerve to slow heart rate, immediately activating the parasympathetic nervous system.',
    expectedKeywords: ['double inhale', 'alveoli', 'exhale', 'vagus nerve', 'parasympathetic', 'heart rate'],
    xp: 100,
    coins: 50
  }
];

export const INITIAL_BOSS: CoOpBoss = {
  id: 'boss-1',
  name: 'The Procrastination Behemoth',
  title: 'Devourer of Unscheduled Deadlines',
  avatar: '👾',
  totalHealth: 2500,
  currentHealth: 1480,
  rewardPoolXp: 800,
  rewardPoolCoins: 400,
  activeDebuff: 'Mental Fog (-10% initial focus initiation energy)'
};

export const INITIAL_BUDDIES: StudyBuddy[] = [
  { id: 'b-1', name: 'Elena R.', avatar: '👩‍🔬', status: 'Focusing on Organic Synthesis', currentTask: 'Revising chirality stereocenters', focusMinutesToday: 110, petSpecies: 'dragon', online: true },
  { id: 'b-2', name: 'Kenji T.', avatar: '🧑‍💻', status: 'Writing Rust Distributed Log', currentTask: 'Debugging raft heartbeats', focusMinutesToday: 135, petSpecies: 'robot', online: true },
  { id: 'b-3', name: 'Ananya S.', avatar: '👩‍🎓', status: 'Solving Multi-variable ODEs', currentTask: 'Green Theorem practice problems', focusMinutesToday: 95, petSpecies: 'cat', online: true },
  { id: 'b-4', name: 'Mateo G.', avatar: '🧑‍🎨', status: 'Cognitive Science Notes', currentTask: 'Summarizing Kahneman heuristics', focusMinutesToday: 75, petSpecies: 'spirit', online: true },
  { id: 'b-5', name: 'Priya K.', avatar: '👩‍🏫', status: 'Neuroanatomy Flashcards', currentTask: 'LTP synaptic consolidation', focusMinutesToday: 150, petSpecies: 'cat', online: true },
];

export const INITIAL_CREDENTIALS: VerifiedCredential[] = [
  {
    id: 'cred-1',
    credentialCode: 'EDZ-MATH-8849',
    title: 'Mastery of Discrete Mathematics & Convex Optimization',
    issuer: 'EDZEN Academic Verification Protocol (ERC-4337 Compliant)',
    recipientName: 'Alex Mercer (Student #ED-7821)',
    issueDate: 'September 18, 2026',
    skillsVerified: ['Multivariable Calculus', 'Convex Optimization', 'Lagrange Multipliers', 'Matrix Decompositions'],
    grade: 'Exemplary (98.4% Mastery)',
    blockchainHash: '0x8f4c2b9a71e3d09a25b184f938210984f8812c3b88a91c7f99148d82ef4a01c2'
  },
  {
    id: 'cred-2',
    credentialCode: 'EDZ-SYS-2910',
    title: 'High-Performance Operating Systems & Concurrency',
    issuer: 'EDZEN Academic Verification Protocol',
    recipientName: 'Alex Mercer (Student #ED-7821)',
    issueDate: 'September 24, 2026',
    skillsVerified: ['Virtual Memory', 'Lock-Free Data Structures', 'POSIX Concurrency', 'Kernel Preemption'],
    grade: 'Advanced Honors (95.1% Mastery)',
    blockchainHash: '0x17c9a4192ddb820a45f91754bc388910023aaeef91083949827104958bcda913'
  }
];

interface EdzenContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Student Stats
  userName: string;
  userLevel: number;
  userXp: number;
  userXpMax: number;
  userCoins: number;
  userEnergy: number; // 0 - 100
  focusStreak: number;
  isOverwhelmed: boolean;
  toggleOverwhelmed: () => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  consumeEnergy: (amount: number) => void;
  boostEnergy: (amount: number) => void;

  // Pet System
  pet: PetState;
  setPetName: (name: string) => void;
  setPetSpecies: (species: PetState['species']) => void;
  setPetColor: (color: string) => void;
  equipAccessory: (accessory: PetAccessory) => void;
  unequipAccessory: (slot: 'hat' | 'glasses' | 'neck' | 'back') => void;
  feedPet: () => void;
  petAccessories: PetAccessory[];
  unlockAccessory: (id: string) => boolean;
  toggleRoaming: () => void;

  // Quests & Tasks
  tasks: QuestTask[];
  addTask: (task: Omit<QuestTask, 'id' | 'completed'>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  rebalanceTasksNonPunitive: () => void;
  synthesizeBrainDump: (text: string) => void;

  // Habits
  habits: HabitItem[];
  toggleHabit: (id: string) => void;
  useForgivenessToken: (id: string) => void;

  // Syllabus & Rescue
  syllabus: SyllabusModule[];
  toggleWeakSubject: (id: string) => void;
  simulateSyllabusScan: () => void;

  // Skills
  skills: SkillNode[];
  completeSkillNode: (id: string) => void;

  // Routines
  routines: RoutineTemplate[];
  activeRoutineId: string;
  adoptRoutine: (id: string) => void;

  // Questions & Combat
  questions: QuestionChallenge[];
  boss: CoOpBoss;
  attackBoss: (damage: number) => void;

  // Study Together
  buddies: StudyBuddy[];
  credentials: VerifiedCredential[];

  // Ambient sound
  ambientSound: 'rain' | 'lofi' | 'zen' | 'off';
  setAmbientSound: (sound: 'rain' | 'lofi' | 'zen' | 'off') => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const EdzenContext = createContext<EdzenContextType | undefined>(undefined);

export const EdzenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persisted or default states
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('edzen_language') as Language) || 'en';
  });

  const [userName] = useState<string>('Alex Mercer');
  const [userLevel, setUserLevel] = useState<number>(() => {
    const val = localStorage.getItem('edzen_user_level');
    return val ? parseInt(val, 10) : 4;
  });
  const [userXp, setUserXp] = useState<number>(() => {
    const val = localStorage.getItem('edzen_user_xp');
    return val ? parseInt(val, 10) : 340;
  });
  const [userCoins, setUserCoins] = useState<number>(() => {
    const val = localStorage.getItem('edzen_user_coins');
    return val ? parseInt(val, 10) : 420;
  });
  const [userEnergy, setUserEnergy] = useState<number>(() => {
    const val = localStorage.getItem('edzen_user_energy');
    return val ? parseInt(val, 10) : 82;
  });
  const [focusStreak] = useState<number>(7);
  const [isOverwhelmed, setIsOverwhelmed] = useState<boolean>(false);

  // Pet State
  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem('edzen_pet_state');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: 'Edzemon Astra',
      species: 'cat',
      color: '#c084fc',
      level: 4,
      hunger: 82,
      energy: 78,
      happiness: 90,
      equipped: {
        hat: 'wizard_hat',
        glasses: 'cyber_shades',
        neck: 'cozy_scarf',
        back: 'astral_cape'
      },
      roamingEnabled: true,
      lastFedTimestamp: Date.now()
    };
  });

  const [petAccessories, setPetAccessories] = useState<PetAccessory[]>(() => {
    const saved = localStorage.getItem('edzen_pet_accessories');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ACCESSORIES;
  });

  const [tasks, setTasks] = useState<QuestTask[]>(() => {
    const saved = localStorage.getItem('edzen_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('edzen_habits');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_HABITS;
  });

  const [syllabus, setSyllabus] = useState<SyllabusModule[]>(() => {
    const saved = localStorage.getItem('edzen_syllabus');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SYLLABUS_MODULES;
  });

  const [skills, setSkills] = useState<SkillNode[]>(() => {
    const saved = localStorage.getItem('edzen_skills');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SKILLS;
  });

  const [routines] = useState<RoutineTemplate[]>(INITIAL_ROUTINES);
  const [activeRoutineId, setActiveRoutineId] = useState<string>('r-1');
  const [questions] = useState<QuestionChallenge[]>(INITIAL_QUESTIONS);
  const [boss, setBoss] = useState<CoOpBoss>(INITIAL_BOSS);
  const [buddies] = useState<StudyBuddy[]>(INITIAL_BUDDIES);
  const [credentials] = useState<VerifiedCredential[]>(INITIAL_CREDENTIALS);

  const [ambientSound, setAmbientSoundState] = useState<'rain' | 'lofi' | 'zen' | 'off'>('off');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('edzen_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('edzen_user_level', userLevel.toString());
    localStorage.setItem('edzen_user_xp', userXp.toString());
    localStorage.setItem('edzen_user_coins', userCoins.toString());
    localStorage.setItem('edzen_user_energy', userEnergy.toString());
  }, [userLevel, userXp, userCoins, userEnergy]);

  useEffect(() => {
    localStorage.setItem('edzen_pet_state', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem('edzen_pet_accessories', JSON.stringify(petAccessories));
  }, [petAccessories]);

  useEffect(() => {
    localStorage.setItem('edzen_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('edzen_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('edzen_syllabus', JSON.stringify(syllabus));
  }, [syllabus]);

  useEffect(() => {
    localStorage.setItem('edzen_skills', JSON.stringify(skills));
  }, [skills]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    showToast(`Language switched to ${lang.toUpperCase()}`);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const userXpMax = userLevel * 200;

  const addXp = (amount: number) => {
    setUserXp(prev => {
      const nextXp = prev + amount;
      if (nextXp >= userXpMax) {
        setUserLevel(l => l + 1);
        confetti({
          particleCount: 12,
          spread: 35,
          scalar: 0.6,
          origin: { y: 0.6 }
        });
        sounds.playSuccess();
        showToast(`🎉 Level Up! You reached Level ${userLevel + 1}!`);
        return nextXp - userXpMax;
      }
      return nextXp;
    });
  };

  const addCoins = (amount: number) => {
    sounds.playCoin();
    setUserCoins(c => c + amount);
  };

  const consumeEnergy = (amount: number) => {
    setUserEnergy(e => Math.max(5, e - amount));
  };

  const boostEnergy = (amount: number) => {
    setUserEnergy(e => Math.min(100, e + amount));
    setPet(p => ({ ...p, energy: Math.min(100, p.energy + amount), happiness: Math.min(100, p.happiness + 10) }));
  };

  const toggleOverwhelmed = () => {
    setIsOverwhelmed(prev => {
      const next = !prev;
      if (next) {
        showToast("🧘 Gentle Overwhelm Mode Activated. Workload simplified.");
        sounds.playZenBowl();
      } else {
        showToast("Standard Mode Resumed.");
      }
      return next;
    });
  };

  const setPetName = (name: string) => {
    setPet(prev => ({ ...prev, name }));
  };

  const setPetSpecies = (species: PetState['species']) => {
    setPet(prev => ({ ...prev, species }));
    sounds.playPetCheer();
    showToast(`Edzemon evolved into a ${species.toUpperCase()}!`);
  };

  const setPetColor = (color: string) => {
    setPet(prev => ({ ...prev, color }));
  };

  const equipAccessory = (acc: PetAccessory) => {
    setPet(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [acc.slot]: acc.id
      }
    }));
    sounds.playCoin();
    showToast(`Equipped ${acc.name}!`);
  };

  const unequipAccessory = (slot: 'hat' | 'glasses' | 'neck' | 'back') => {
    setPet(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [slot]: undefined
      }
    }));
  };

  const feedPet = () => {
    if (userCoins < 15) {
      showToast("Need 15 coins for a Pet Snack!");
      return;
    }
    setUserCoins(c => c - 15);
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 25),
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.min(100, prev.energy + 10)
    }));
    sounds.playPetCheer();
    showToast("Nom nom! Edzemon loved the cosmic berries!");
  };

  const unlockAccessory = (id: string): boolean => {
    const item = petAccessories.find(a => a.id === id);
    if (!item) return false;
    if (userCoins < item.price) {
      showToast(t('notEnoughCoins'));
      return false;
    }
    setUserCoins(c => c - item.price);
    setPetAccessories(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
    equipAccessory(item);
    confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.7 } });
    showToast(`✨ Unlocked and equipped ${item.name}!`);
    return true;
  };

  const toggleRoaming = () => {
    setPet(prev => ({ ...prev, roamingEnabled: !prev.roamingEnabled }));
  };

  const addTask = (task: Omit<QuestTask, 'id' | 'completed'>) => {
    const newTask: QuestTask = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    showToast("Quest added to your adaptive schedule!");
  };

  const toggleTaskComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (!task.completed) {
      // Completing
      sounds.playSuccess();
      addXp(task.xpReward);
      addCoins(task.coinReward);
      boostEnergy(15);
      attackBoss(50);
      confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.7 } });
      showToast(`Quest completed! +${task.xpReward} XP, +${task.coinReward} Coins 🪙, Boss dealt 50 DMG!`);
    }

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast("Quest removed.");
  };

  // Non-punitive Rebalance
  const rebalanceTasksNonPunitive = () => {
    sounds.playZenBowl();
    setTasks(prev => {
      return prev.map((t, idx) => {
        if (!t.completed && (t.priority === 'high' || t.energyRequired === 'high')) {
          return {
            ...t,
            estimatedMinutes: Math.max(20, Math.floor(t.estimatedMinutes * 0.75)),
            priority: idx === 0 ? 'high' : 'medium',
            deadline: 'Gently spaced over next 48h'
          };
        }
        return t;
      });
    });
    boostEnergy(20);
    showToast("🌸 Plan gently rebalanced. Your workload has been redistributed without guilt.");
  };

  // AI Brain Dump NLP Parser
  const synthesizeBrainDump = (rawText: string) => {
    if (!rawText.trim()) return;
    
    // Simulate intelligent NLP breakdown into 20-45m bite-sized quests
    const lines = rawText.split(/[,\n;.]+/).map(l => l.trim()).filter(l => l.length > 5);
    const synthesized: QuestTask[] = lines.slice(0, 3).map((line, idx) => {
      const minutes = idx === 0 ? 30 : idx === 1 ? 25 : 40;
      const energy: QuestTask['energyRequired'] = idx === 0 ? 'medium' : idx === 1 ? 'high' : 'low';
      return {
        id: `dump-${Date.now()}-${idx}`,
        title: line.charAt(0).toUpperCase() + line.slice(1),
        subject: 'Brain Dump Quest',
        estimatedMinutes: minutes,
        energyRequired: energy,
        priority: idx === 0 ? 'high' : 'medium',
        deadline: 'Today',
        completed: false,
        category: 'study',
        xpReward: minutes * 2,
        coinReward: Math.floor(minutes * 1.2),
        notes: 'Synthesized automatically from your cognitive brain dump.'
      };
    });

    if (synthesized.length === 0) {
      synthesized.push({
        id: `dump-${Date.now()}`,
        title: rawText.slice(0, 60),
        subject: 'General Study',
        estimatedMinutes: 25,
        energyRequired: 'medium',
        priority: 'medium',
        deadline: 'Today',
        completed: false,
        category: 'study',
        xpReward: 50,
        coinReward: 25
      });
    }

    setTasks(prev => [...synthesized, ...prev]);
    sounds.playSuccess();
    showToast(`✨ AI synthesized ${synthesized.length} actionable 25-40 min Quests!`);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const next = !h.completedToday;
        if (next) {
          sounds.playSuccess();
          addCoins(15);
          addXp(30);
          showToast(`Habit cleared! Streak protected at ${h.streak + 1} days!`);
          return { ...h, completedToday: true, streak: h.streak + 1 };
        } else {
          return { ...h, completedToday: false, streak: Math.max(1, h.streak - 1) };
        }
      }
      return h;
    }));
  };

  const useForgivenessToken = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        if (h.forgivenessTokens <= 0) {
          showToast("No forgiveness tokens left for this habit.");
          return h;
        }
        sounds.playZenBowl();
        showToast(t('streakShield'));
        return { ...h, forgivenessTokens: h.forgivenessTokens - 1, completedToday: true };
      }
      return h;
    }));
  };

  const toggleWeakSubject = (id: string) => {
    setSyllabus(prev => prev.map(m => m.id === id ? { ...m, isWeakSubject: !m.isWeakSubject } : m));
  };

  const simulateSyllabusScan = () => {
    sounds.playSuccess();
    showToast("📄 Syllabus OCR scan completed! 3 high-yield modules identified.");
  };

  const completeSkillNode = (id: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id === id) {
        sounds.playSuccess();
        addXp(150);
        addCoins(80);
        confetti({ particleCount: 10, spread: 35, scalar: 0.6 });
        showToast(`Skill mastered: ${s.title}! Micro-credential unlocked.`);
        return { ...s, completed: true, progress: 100 };
      }
      return s;
    }));
  };

  const adoptRoutine = (id: string) => {
    setActiveRoutineId(id);
    const routine = routines.find(r => r.id === id);
    if (routine) {
      const routineTasks: QuestTask[] = routine.tasks.map((task, idx) => ({
        id: `routine-${Date.now()}-${idx}`,
        title: task.title,
        subject: routine.name,
        estimatedMinutes: task.minutes,
        energyRequired: task.energy,
        priority: task.energy === 'high' ? 'high' : 'medium',
        deadline: task.timeOfDay,
        completed: false,
        category: 'routine',
        xpReward: task.minutes * 2,
        coinReward: Math.floor(task.minutes * 1.2),
        notes: `Adopted from ${routine.name}`
      }));
      setTasks(prev => [...routineTasks, ...prev]);
      sounds.playSuccess();
      showToast(`🌟 Adopted "${routine.name}"! Tasks populated to your schedule.`);
    }
  };

  const attackBoss = (damage: number) => {
    sounds.playBossHit();
    setBoss(prev => {
      const nextHp = Math.max(0, prev.currentHealth - damage);
      if (nextHp === 0 && prev.currentHealth > 0) {
        // Boss defeated!
        confetti({ particleCount: 16, spread: 45, scalar: 0.6, origin: { y: 0.5 } });
        addXp(prev.rewardPoolXp);
        addCoins(prev.rewardPoolCoins);
        showToast(`🏆 RAID VICTORY! Boss defeated! +${prev.rewardPoolXp} XP, +${prev.rewardPoolCoins} Coins awarded!`);
        return { ...prev, currentHealth: prev.totalHealth, activeDebuff: 'Debuff Cleansed! +20% focus boost' };
      }
      return { ...prev, currentHealth: nextHp };
    });
  };

  const setAmbientSound = (sound: 'rain' | 'lofi' | 'zen' | 'off') => {
    setAmbientSoundState(sound);
    sounds.playAmbient(sound);
    showToast(sound === 'off' ? 'Ambient audio muted' : `Playing ${sound.toUpperCase()} ambient tone`);
  };

  return (
    <EdzenContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userName,
        userLevel,
        userXp,
        userXpMax,
        userCoins,
        userEnergy,
        focusStreak,
        isOverwhelmed,
        toggleOverwhelmed,
        addXp,
        addCoins,
        consumeEnergy,
        boostEnergy,
        pet,
        setPetName,
        setPetSpecies,
        setPetColor,
        equipAccessory,
        unequipAccessory,
        feedPet,
        petAccessories,
        unlockAccessory,
        toggleRoaming,
        tasks,
        addTask,
        toggleTaskComplete,
        deleteTask,
        rebalanceTasksNonPunitive,
        synthesizeBrainDump,
        habits,
        toggleHabit,
        useForgivenessToken,
        syllabus,
        toggleWeakSubject,
        simulateSyllabusScan,
        skills,
        completeSkillNode,
        routines,
        activeRoutineId,
        adoptRoutine,
        questions,
        boss,
        attackBoss,
        buddies,
        credentials,
        ambientSound,
        setAmbientSound,
        toastMessage,
        showToast
      }}
    >
      {children}
    </EdzenContext.Provider>
  );
};

export const useEdzen = () => {
  const ctx = useContext(EdzenContext);
  if (!ctx) throw new Error('useEdzen must be used within an EdzenProvider');
  return ctx;
};
