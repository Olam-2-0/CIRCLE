export type Language = 'en' | 'hi' | 'ml' | 'es' | 'ta';

export type PetSpecies = 'cat' | 'dog' | 'rabbit' | 'parrot' | 'dragon' | 'spirit' | 'robot';

export interface PetAccessory {
  id: string;
  name: string;
  slot: 'hat' | 'glasses' | 'neck' | 'back';
  icon: string;
  price: number;
  unlocked: boolean;
  color?: string;
  description: string;
}

export interface PetState {
  name: string;
  species: PetSpecies;
  color: string;
  level: number;
  hunger: number; // 0 - 100
  energy: number; // 0 - 100
  happiness: number; // 0 - 100
  equipped: {
    hat?: string;
    glasses?: string;
    neck?: string;
    back?: string;
  };
  roamingEnabled: boolean;
  lastFedTimestamp: number;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskEnergy = 'high' | 'medium' | 'low';

export interface QuestTask {
  id: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  energyRequired: TaskEnergy;
  priority: TaskPriority;
  deadline?: string;
  completed: boolean;
  category: 'study' | 'assignment' | 'revision' | 'wellness' | 'routine';
  xpReward: number;
  coinReward: number;
  notes?: string;
}

export interface HabitItem {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'flexible';
  streak: number;
  completedToday: boolean;
  forgivenessTokens: number; // Non-punitive streak shield!
  icon: string;
}

export interface SkillNode {
  id: string;
  title: string;
  category: 'Math & Logic' | 'Computer Systems' | 'Cognitive Psychology' | 'Linguistics';
  level: number;
  unlocked: boolean;
  completed: boolean;
  progress: number; // 0 - 100
  credentialId?: string;
  description: string;
  prerequisites: string[];
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  tag: string;
  author: string;
  upvotes: number;
  recommendedFor: string;
  tasks: Array<{
    title: string;
    minutes: number;
    timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
    energy: TaskEnergy;
  }>;
}

export interface SyllabusModule {
  id: string;
  code: string;
  name: string;
  totalChapters: number;
  completedChapters: number;
  examDate: string;
  difficulty: 'Comfortable' | 'Challenging' | 'High Alert';
  isWeakSubject: boolean;
  keyConcepts: {
    term: string;
    summary: Record<Language, string>;
  }[];
}

export interface QuestionChallenge {
  id: string;
  subject: string;
  question: string;
  hints: string[];
  correctAnswerSummary: string;
  expectedKeywords: string[];
  xp: number;
  coins: number;
}

export interface CoOpBoss {
  id: string;
  name: string;
  title: string;
  avatar: string;
  totalHealth: number;
  currentHealth: number;
  rewardPoolXp: number;
  rewardPoolCoins: number;
  activeDebuff: string;
}

export interface StudyBuddy {
  id: string;
  name: string;
  avatar: string;
  status: string;
  currentTask: string;
  focusMinutesToday: number;
  petSpecies: PetSpecies;
  online: boolean;
}

export interface VerifiedCredential {
  id: string;
  credentialCode: string;
  title: string;
  issuer: string;
  recipientName: string;
  issueDate: string;
  skillsVerified: string[];
  grade: string;
  blockchainHash: string;
}
