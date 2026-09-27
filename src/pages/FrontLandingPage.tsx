import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { NavigationTab } from '../components/Navbar';
import { PixelPetEngine } from '../components/PixelPetEngine';
import { PetAvatar2D } from '../components/PetAvatar2D';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Heart, 
  CalendarRange, ShieldAlert, GitFork, Timer, 
  Swords, Users2, Target, HeartPulse, BookOpenCheck, 
  Shirt, Award, CheckCircle2, ChevronRight, Play, 
  Compass, Coffee, Flame, RefreshCw, Star
} from 'lucide-react';
import { PetSpecies } from '../types';

interface FrontLandingPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const FrontLandingPage: React.FC<FrontLandingPageProps> = ({ onNavigate }) => {
  const { 
    t, pet, setPetSpecies, userCoins, userLevel, 
    tasks, addTask, toggleTaskComplete, deleteTask, 
    rebalanceTasksNonPunitive, showToast 
  } = useEdzen();
  const [demoSpecies, setDemoSpecies] = useState<PetSpecies>(pet.species);

  // Main Page Task Option State
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskSubject, setTaskSubject] = useState<string>('Computer Systems');
  const [taskMinutes, setTaskMinutes] = useState<number>(25);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      subject: taskSubject,
      estimatedMinutes: taskMinutes,
      energyRequired: taskPriority === 'high' ? 'high' : 'medium',
      priority: taskPriority,
      deadline: 'Today',
      category: 'assignment',
      xpReward: 50,
      coinReward: 30,
      notes: 'Added from EDZEN Main Front Page'
    });

    setTaskTitle('');
    setShowAddTask(false);
    sounds.playSuccess();
    showToast('✨ Quest added to your active student log!');
  };

  const speciesShowcase: {
    id: PetSpecies;
    name: string;
    tagline: string;
    perk: string;
    icon: string;
    desc: string;
    studentHabit: string;
  }[] = [
    {
      id: 'cat',
      name: 'Study Cat',
      tagline: 'Deep Flow & Cozy Revision',
      perk: '+10% Habit Streak Shield & Naps',
      icon: '🐱',
      desc: 'Sits beside your notes with a glowing pixel laptop, sips boba tea, and curls up for power naps when energy drops.',
      studentHabit: 'Laptop Deep Study & Boba Breaks'
    },
    {
      id: 'dog',
      name: 'Study Pup',
      tagline: 'High-Momentum Pair Programmer',
      perk: '+15% Focus Momentum & Zoomies',
      icon: '🐶',
      desc: 'Wags its tail enthusiastically as you clear tasks, celebrates quest wins with high-speed zoomies sprints across the screen.',
      studentHabit: 'Pair Programming & Zoomies Sprints'
    },
    {
      id: 'rabbit',
      name: 'Cram Bunny',
      tagline: 'Speed-Reading Revision Specialist',
      perk: '+20% Speed Reading & Hops',
      icon: '🐰',
      desc: 'Drills flashcards at lightning pace, performs acrobatic high vertical leaps, and twitch-hops between library study spots.',
      studentHabit: 'Flashcard Sprints & Mega Hops'
    },
    {
      id: 'parrot',
      name: 'Scholar Parrot',
      tagline: 'Formula & Theorem Recall Master',
      perk: '+15% Formula Recall & Aerial Loops',
      icon: '🦜',
      desc: 'Flaps colorful wings while reciting physics formulas and theorems (E=mc²), executing 360° aerial barrel rolls in celebration.',
      studentHabit: 'Active Theorem Recall & Aerial Flips'
    },
  ];

  const corePillars: {
    id: NavigationTab;
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'planner',
      title: 'Adaptive AI Daily Planner',
      subtitle: 'Cognitive load metering with 1-click rebalancing. Never feel guilty when life interrupts your study schedule.',
      badge: 'Non-Punitive',
      icon: <CalendarRange className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-600/30 to-indigo-600/20'
    },
    {
      id: 'examRescue',
      title: '5-Minute Exam Rescue',
      subtitle: 'Upload any exam syllabus or PDF. AI triages high-yield chapters, weak concepts, and multilingual study sheets.',
      badge: 'High Yield',
      icon: <ShieldAlert className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-600/30 to-orange-600/20'
    },
    {
      id: 'focus',
      title: 'Focus Quests & Zen Pomodoro',
      subtitle: '25-minute single-task flow sprints with custom ambient audio (Lofi, Rain, Zen Temple) earning Quest Coins (🪙).',
      badge: 'Flow State',
      icon: <Timer className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-600/30 to-teal-600/20'
    },
    {
      id: 'answerBattle',
      title: 'Answer Battle RPG Boss Fights',
      subtitle: 'Turn revision questions into turn-based combat against the Procrastination Demon with progressive hints.',
      badge: 'Gamified',
      icon: <Swords className="w-6 h-6 text-rose-400" />,
      color: 'from-rose-600/30 to-pink-600/20'
    },
    {
      id: 'skillTree',
      title: 'Visual Skill Mastery Tree',
      subtitle: 'Interactive RPG skill trees mapping algorithmic mastery, calculus foundations, and cognitive memory nodes.',
      badge: 'Mastery',
      icon: <GitFork className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-600/30 to-blue-600/20'
    },
    {
      id: 'studyTogether',
      title: 'Silent Study Together Pods',
      subtitle: 'Virtual distraction-free coworking rooms with synchronized timers, raid attacks, and peer accountability.',
      badge: 'Social',
      icon: <Users2 className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-600/30 to-purple-600/20'
    },
    {
      id: 'wellness',
      title: 'Wellness & Burnout Recovery',
      subtitle: 'Burnout detection triggers gentle 5-minute mind resets, resonant breathing exercises, and emotional decomp.',
      badge: 'Empathy',
      icon: <HeartPulse className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-600/30 to-rose-600/20'
    },
    {
      id: 'petShop',
      title: '50px Pixel Companion Wardrobe',
      subtitle: 'Unlock wizard hats, cyber shades, and astral wings with earned quest coins. Your pet studies & flips alongside you.',
      badge: 'Cosmetics',
      icon: <Shirt className="w-6 h-6 text-amber-300" />,
      color: 'from-amber-600/30 to-yellow-600/20'
    },
  ];

  const triggerLandingStunt = (stunt: 'backflip' | 'spin' | 'zoomies') => {
    sounds.playPetCheer();
    if (stunt === 'backflip') {
      confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.6 } });
    }
    window.dispatchEvent(new CustomEvent('edzen-pet-action', { detail: { type: 'stunt', stunt } }));
  };

  const triggerLandingAction = (action: 'studying' | 'cramming' | 'caffeine_boost' | 'procrastinating' | 'sleeping') => {
    sounds.playPetCheer();
    window.dispatchEvent(new CustomEvent('edzen-pet-action', { detail: { type: 'action', action } }));
  };

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-300">
      
      {/* ================= 1. HERO SECTION - Dark Futuristic Liquid Glass ================= */}
      <section className="relative pt-6 sm:pt-10 pb-12 rounded-3xl bg-gradient-to-b from-purple-900/30 via-slate-900/40 to-slate-950/80 backdrop-blur-3xl border border-purple-500/30 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden px-6 sm:px-12 text-center flex flex-col items-center">
        
        {/* Glow ambient background orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-indigo-600/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-pink-600/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold tracking-wide uppercase shadow-sm mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Adaptive AI Student Life Companion • Sustainable Progress</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">EDZEN</span> —{' '}
          <span className="text-white">
            A Workspace That Adapts To You.
          </span>
        </h1>

        {/* Core Philosophy Callout */}
        <p className="mt-5 text-sm sm:text-base text-purple-200 max-w-2xl font-medium leading-relaxed italic bg-purple-950/40 py-2.5 px-6 rounded-2xl border border-purple-500/30 shadow-inner">
          "{t('corePhilosophy')}"
        </p>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          The all-in-one student operating system combining AI exam rescue, gamified Boss battles, skill trees, and an autonomous <strong className="text-purple-300">50-pixel companion</strong> that studies, crams, and pulls off backflip stunts right on your screen.
        </p>

        {/* Primary Call-to-Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <button
            onClick={() => {
              sounds.playSuccess();
              onNavigate('dashboard');
            }}
            className="flex-1 min-w-[200px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 text-white font-black text-sm shadow-[0_6px_25px_rgba(147,51,234,0.45)] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🚀 Enter Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playCoin();
              onNavigate('petShop');
            }}
            className="py-3.5 px-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 text-purple-200 font-bold text-sm transition-all duration-300 hover:scale-105 shadow-sm flex items-center justify-center gap-2"
          >
            <span>🐾 Meet Your Pet</span>
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-md">
            <div className="text-xl font-black text-purple-300">25-min</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Focus Sprints</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-md">
            <div className="text-xl font-black text-amber-400">4 Species</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">50px Pixel Pets</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-md">
            <div className="text-xl font-black text-emerald-400">100% Offline</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LocalStorage Private</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-md">
            <div className="text-xl font-black text-pink-400">Streak Shield</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Non-Punitive Recovery</div>
          </div>
        </div>

      </section>

      {/* ================= 2. LIVE 50px PIXEL PET SHOWCASE ================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-purple-500/20 shadow-[0_10px_35px_0_rgba(0,0,0,0.4)] space-y-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 mb-2">
              <span>🐾</span>
              Autonomous 50px Pixel Pet Engine
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Meet Your Organic Student Companion
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              They study with a laptop, cram flashcards, sip boba, take desk naps, and pull off 360° backflips right on your screen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('petShop')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Shirt className="w-3.5 h-3.5 text-amber-300" />
              <span>Customize Wardrobe Sets (🪙)</span>
            </button>
          </div>
        </div>

        {/* 4 Species Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {speciesShowcase.map((sp) => {
            const isCurrent = pet.species === sp.id;
            return (
              <div
                key={sp.id}
                onClick={() => {
                  setPetSpecies(sp.id);
                  setDemoSpecies(sp.id);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'bg-purple-900/40 border-purple-400 shadow-[0_6px_25px_rgba(168,85,247,0.3)] scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-900/80 border-purple-500/20 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{sp.icon}</span>
                  {isCurrent ? (
                    <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Active Buddy
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full font-semibold border border-purple-500/20">
                      Select
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">{sp.name}</h3>
                  <div className="text-[10px] text-purple-300 font-bold mt-0.5">{sp.tagline}</div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {sp.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 block">
                    ✨ {sp.perk}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Habit: {sp.studentHabit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Stunt & Action Test Bench */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🤸 Test Live Stunts:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => triggerLandingStunt('backflip')}
                className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition shadow-sm"
              >
                🤸 Backflip!
              </button>
              <button
                onClick={() => triggerLandingStunt('spin')}
                className="px-3 py-1 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-bold transition shadow-sm"
              >
                🕺 Breakdance!
              </button>
              <button
                onClick={() => triggerLandingStunt('zoomies')}
                className="px-3 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition shadow-sm"
              >
                ⚡ Zoomies!
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Student Routine:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => triggerLandingAction('studying')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/30 text-slate-200 font-medium text-xs transition border border-purple-500/30 shadow-sm"
              >
                💻 Study
              </button>
              <button
                onClick={() => triggerLandingAction('cramming')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/30 text-slate-200 font-medium text-xs transition border border-purple-500/30 shadow-sm"
              >
                📝 Cram
              </button>
              <button
                onClick={() => triggerLandingAction('caffeine_boost')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/30 text-slate-200 font-medium text-xs transition border border-purple-500/30 shadow-sm"
              >
                🧋 Boba
              </button>
              <button
                onClick={() => triggerLandingAction('sleeping')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/30 text-slate-200 font-medium text-xs transition border border-purple-500/30 shadow-sm"
              >
                💤 Nap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN PAGE TASK & QUEST OPTION ================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-purple-500/20 shadow-[0_10px_35px_0_rgba(0,0,0,0.4)] space-y-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Main Page Task Command Center</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Today's Study Quests</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                {tasks.filter(t => !t.completed).length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Check off quests, launch 25-minute Pomodoro sprints, or add new study targets right from the main page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddTask(prev => !prev)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <span>+ Quick Add Task</span>
            </button>
            <button
              onClick={() => onNavigate('planner')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 text-purple-200 text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <CalendarRange className="w-3.5 h-3.5 text-purple-400" />
              <span>Adaptive Planner</span>
            </button>
            <button
              onClick={() => {
                rebalanceTasksNonPunitive();
                sounds.playSuccess();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Rebalance delayed tasks without guilt"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebalance</span>
            </button>
          </div>
        </div>

        {/* Quick Add Task Drawer Form */}
        {showAddTask && (
          <form onSubmit={handleQuickAddTask} className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-3 animate-in fade-in duration-200 shadow-sm text-white">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Task / Quest Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Read Physics Chapter 3 or Solve 5 Calculus Problems"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 shadow-inner"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Subject / Topic
                </label>
                <select
                  value={taskSubject}
                  onChange={e => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-xs text-white outline-none focus:border-purple-400 shadow-inner font-medium"
                >
                  <option value="Computer Systems">Computer Systems</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Linguistics">Linguistics</option>
                  <option value="General">General / Study</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Duration
                </label>
                <select
                  value={taskMinutes}
                  onChange={e => setTaskMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-xs text-white outline-none focus:border-purple-400 shadow-inner font-medium"
                >
                  <option value={15}>15m (Micro Focus)</option>
                  <option value={25}>25m (Zen Pomodoro)</option>
                  <option value={45}>45m (Deep Revision)</option>
                  <option value={60}>60m (Intense Sprint)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Priority:</span>
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize border transition ${
                      taskPriority === p
                        ? p === 'high' ? 'bg-rose-500/30 text-rose-300 border-rose-500/50' :
                          p === 'medium' ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' :
                          'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900 border-purple-500/20 text-slate-400 hover:bg-purple-900/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:scale-105 transition"
                >
                  Save Quest (+50 XP, +30 🪙)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Task Filter Chips */}
        <div className="flex items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
          <div className="flex gap-1.5">
            {(['all', 'pending', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition ${
                  taskFilter === f
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f} ({f === 'all' ? tasks.length : f === 'pending' ? tasks.filter(t => !t.completed).length : tasks.filter(t => t.completed).length})
              </button>
            ))}
          </div>

          <div className="text-[11px] text-purple-300 font-bold hidden sm:block">
            ⚡ Earn coins & level up your 50px pixel pet with every checkmark
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                t.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                  : 'bg-slate-950/60 hover:bg-slate-900/70 border-purple-500/20 shadow-sm text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => {
                    toggleTaskComplete(t.id);
                    if (!t.completed) {
                      sounds.playSuccess();
                      sounds.playCoin();
                      confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.7 } });
                    }
                  }}
                  className="mt-1 w-4 h-4 rounded-md accent-purple-600 cursor-pointer"
                />
                <div className="flex-1">
                  <h4 className={`text-xs font-bold ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {t.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      {t.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 font-medium">
                      ⏱️ {t.estimatedMinutes}m
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                      t.priority === 'high' ? 'bg-rose-500/30 text-rose-300' :
                      t.priority === 'medium' ? 'bg-amber-500/30 text-amber-300' :
                      'bg-emerald-500/30 text-emerald-300'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-amber-400 font-mono font-extrabold">
                      +{t.coinReward} 🪙
                    </span>
                  </div>
                </div>
              </div>

              {/* Task Bottom Actions */}
              <div className="mt-3 pt-2 border-t border-purple-500/20 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">
                  {t.deadline ? `Due: ${t.deadline}` : 'Due: Today'}
                </span>
                <div className="flex items-center gap-1.5">
                  {!t.completed && (
                    <button
                      onClick={() => onNavigate('focus')}
                      className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition flex items-center gap-1 shadow-sm"
                      title="Launch Zen Pomodoro Sprint for this quest"
                    >
                      <Timer className="w-3 h-3 text-emerald-400" />
                      <span>Sprint</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                    title="Delete quest"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. THE 8 PILLARS OF EDZEN ================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            Complete Student Life Architecture
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            The 8 Pillars of Sustainable Productivity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered around genuine student psychology. No toxic hustle culture, no rigid streak punishments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {corePillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => onNavigate(pillar.id)}
              className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-purple-500/20 shadow-[0_8px_30px_0_rgba(0,0,0,0.3)] hover:border-purple-400/50 hover:bg-slate-900/80 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 text-white"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {pillar.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-400 font-bold">
                <span>Explore section</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. THE NON-PUNITIVE ADAPTABILITY LOOP ================= */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 backdrop-blur-2xl border border-purple-500/20 shadow-[0_10px_35px_0_rgba(0,0,0,0.4)] text-white">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            The EDZEN Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How The System Adapts To You
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Conventional apps demand robotic consistency. EDZEN is built for real student biology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rigid Apps Card */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span>❌</span>
              <span>Traditional Productivity Apps</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Treat you like a machine with rigid schedules and fixed due dates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Miss a single day? Your streak resets to zero, causing guilt and burnout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Overwhelm leads to app abandonment and cycle of procrastination.</span>
              </li>
            </ul>
          </div>

          {/* EDZEN Adaptive Card */}
          <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span>✅</span>
              <span>The EDZEN Adaptive System</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Detects cognitive dips and proactively triggers 5-min recharge protocols.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-purple-300">Streak Shields</strong> protect habits when exam weeks or health get turbulent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>1-Click Rebalance redistributes delayed quests seamlessly with zero shame.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= 5. STUDENT TESTIMONIALS ================= */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-white">Loved by Students</h2>
          <p className="text-xs text-slate-400">Real feedback from students studying for competitive exams and university degrees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-xl shadow-sm text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
              "The Exam Rescue feature saved my differential equations midterm. Instead of crying over 200 pages, EDZEN triaged the high-yield formulas and gave me 25-min quests."
            </p>
            <div className="mt-3 pt-2 border-t border-purple-500/20 text-[10px] text-purple-300 font-bold">
              Engineering Sophomore • Caltech
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-xl shadow-sm text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
              "Having the 50px Study Pup on my screen do zoomies whenever I finish a 25-minute Pomodoro makes coding sprints so fun. Plus the zero-streak-reset policy is a lifesaver."
            </p>
            <div className="mt-3 pt-2 border-t border-purple-500/20 text-[10px] text-purple-300 font-bold">
              CS Major • National Institute of Tech
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-xl shadow-sm text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
              "The Boss Answer Battle against the Procrastination Demon turned anatomy flashcards into an actual RPG. Earned enough coins to equip the wizard hat on my parrot!"
            </p>
            <div className="mt-3 pt-2 border-t border-purple-500/20 text-[10px] text-purple-300 font-bold">
              Pre-Med Student • London
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. FINAL CALL TO ACTION ================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/70 via-indigo-950/80 to-purple-900/70 text-white backdrop-blur-3xl text-center space-y-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] border border-purple-500/30">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Ready to Reclaim Your Focus & Sanity?
        </h2>
        <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto leading-relaxed">
          No sign-ups, no tracking cookies, zero external backend dependencies. Fully stored in your browser's LocalStorage.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              sounds.playSuccess();
              onNavigate('dashboard');
            }}
            className="py-3.5 px-8 rounded-2xl bg-white text-purple-900 font-black text-sm shadow-[0_4px_25px_rgba(0,0,0,0.15)] transition hover:scale-105 hover:bg-purple-50 flex items-center gap-2"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playCoin();
              onNavigate('petShop');
            }}
            className="py-3.5 px-6 rounded-2xl bg-purple-900/50 hover:bg-purple-900/70 border border-purple-400/40 text-white font-bold text-sm transition hover:scale-105 shadow-sm"
          >
            <span>🐾 Pet Wardrobe Shop</span>
          </button>
        </div>
      </section>

    </div>
  );
};
