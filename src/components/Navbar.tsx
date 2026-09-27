import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  Sparkles, LayoutDashboard, CalendarRange, ShieldAlert, GitFork, 
  Timer, Swords, Users2, Target, HeartPulse, 
  BookOpenCheck, Shirt, Award, ChevronLeft, ChevronRight 
} from 'lucide-react';

export type NavigationTab = 
  | 'home'
  | 'dashboard'
  | 'planner'
  | 'examRescue'
  | 'skillTree'
  | 'focus'
  | 'answerBattle'
  | 'studyTogether'
  | 'goalsHabits'
  | 'wellness'
  | 'routines'
  | 'petShop'
  | 'profile';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { t, tasks } = useEdzen();
  const activeTasksCount = tasks.filter(t => !t.completed).length;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const navItems: { id: NavigationTab; labelKey: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', labelKey: 'navHome', icon: <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />, badge: 'Front' },
    { id: 'dashboard', labelKey: 'navDashboard', icon: <LayoutDashboard className="w-4 h-4 text-sky-400" /> },
    { id: 'planner', labelKey: 'navPlanner', icon: <CalendarRange className="w-4 h-4 text-purple-400" />, badge: `${activeTasksCount} Tasks` },
    { id: 'examRescue', labelKey: 'navExamRescue', icon: <ShieldAlert className="w-4 h-4 text-amber-400" /> },
    { id: 'skillTree', labelKey: 'navSkillTree', icon: <GitFork className="w-4 h-4 text-teal-400" /> },
    { id: 'focus', labelKey: 'navFocus', icon: <Timer className="w-4 h-4 text-emerald-400" /> },
    { id: 'answerBattle', labelKey: 'navAnswerBattle', icon: <Swords className="w-4 h-4 text-rose-400" />, badge: 'Boss' },
    { id: 'studyTogether', labelKey: 'navStudyTogether', icon: <Users2 className="w-4 h-4 text-indigo-400" /> },
    { id: 'goalsHabits', labelKey: 'navGoalsHabits', icon: <Target className="w-4 h-4 text-cyan-400" /> },
    { id: 'wellness', labelKey: 'navWellness', icon: <HeartPulse className="w-4 h-4 text-pink-400" /> },
    { id: 'routines', labelKey: 'navRoutines', icon: <BookOpenCheck className="w-4 h-4 text-blue-400" /> },
    { id: 'petShop', labelKey: 'navPetShop', icon: <Shirt className="w-4 h-4 text-amber-400" />, badge: 'Pixel' },
    { id: 'profile', labelKey: 'navProfile', icon: <Award className="w-4 h-4 text-amber-300" /> },
  ];

  // Check scroll positions
  const updateScrollIndicators = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollIndicators();
    el.addEventListener('scroll', updateScrollIndicators, { passive: true });
    window.addEventListener('resize', updateScrollIndicators);

    return () => {
      el.removeEventListener('scroll', updateScrollIndicators);
      window.removeEventListener('resize', updateScrollIndicators);
    };
  }, [updateScrollIndicators]);

  // Center active tab smoothly on change
  useEffect(() => {
    const activeEl = itemRefs.current[currentTab];
    if (activeEl && scrollContainerRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
    updateScrollIndicators();
  }, [currentTab, updateScrollIndicators]);

  // Scroll left and right functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Convert vertical mouse wheel into horizontal scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current && e.deltaY !== 0) {
      scrollContainerRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  return (
    <nav className="w-full sticky top-[68px] z-30 py-2 px-1 sm:px-3">
      {/* Outer Liquid Glass Taskbar Shell */}
      <div className="relative max-w-7xl mx-auto rounded-3xl p-1.5 bg-gradient-to-r from-slate-950/85 via-purple-950/40 to-slate-950/85 backdrop-blur-2xl backdrop-saturate-150 border border-purple-500/30 border-t-white/30 border-b-purple-900/40 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1.5px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(168,85,247,0.2),0_0_30px_rgba(168,85,247,0.15)] transition-all">
        
        {/* Specular Liquid Sheen Top Bar */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Left Scroll Button & Glass Fade Overlay */}
        {canScrollLeft && (
          <div className="absolute left-1.5 top-1.5 bottom-1.5 z-20 flex items-center pr-6 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent rounded-l-2xl pointer-events-none">
            <button
              onClick={scrollLeft}
              className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-purple-600/30 hover:bg-purple-600/50 backdrop-blur-md border border-purple-400/40 text-purple-200 hover:text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all active:scale-95 ml-1"
              title="Scroll taskbar left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right Scroll Button & Glass Fade Overlay */}
        {canScrollRight && (
          <div className="absolute right-1.5 top-1.5 bottom-1.5 z-20 flex items-center pl-6 bg-gradient-to-l from-slate-950/95 via-slate-950/70 to-transparent rounded-r-2xl pointer-events-none">
            <button
              onClick={scrollRight}
              className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-purple-600/30 hover:bg-purple-600/50 backdrop-blur-md border border-purple-400/40 text-purple-200 hover:text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all active:scale-95 mr-1"
              title="Scroll taskbar right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Container with Suitable Liquid Scrollbar & Equalized Filled Fit */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="w-full flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 px-1 scroll-smooth liquid-scrollbar"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                onClick={() => onSelectTab(item.id)}
                className={`group relative flex-1 min-w-fit flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.55),inset_0_1.5px_1px_rgba(255,255,255,0.4)] border border-white/30 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent hover:shadow-[0_4px_16px_rgba(168,85,247,0.2)]'
                }`}
              >
                {/* Floating liquid gloss highlight for active tab */}
                {isActive && (
                  <div className="absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full pointer-events-none" />
                )}

                <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>

                <span className="tracking-tight">{t(item.labelKey)}</span>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-white/30 text-white border border-white/40 shadow-sm'
                        : item.id === 'home'
                        ? 'bg-purple-500/25 text-purple-300 border border-purple-400/40 group-hover:border-purple-300'
                        : 'bg-purple-900/50 text-purple-300 border border-purple-500/30 group-hover:border-purple-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
