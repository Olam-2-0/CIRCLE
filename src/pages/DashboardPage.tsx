import React from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  Sparkles, CheckCircle2, Circle, ArrowRight, Zap, 
  BrainCircuit, HeartHandshake, Shirt, MessageSquare, 
  ShieldCheck, Flame, Compass, Coffee
} from 'lucide-react';
import { NavigationTab } from '../components/Navbar';
import { PetAvatar2D } from '../components/PetAvatar2D';

interface DashboardPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    t,
    userName,
    userLevel,
    userEnergy,
    focusStreak,
    isOverwhelmed,
    toggleOverwhelmed,
    tasks,
    toggleTaskComplete,
    habits,
    pet,
    feedPet,
    rebalanceTasksNonPunitive
  } = useEdzen();

  // Find optimal "Right Now" priority task matching energy
  const pendingTasks = tasks.filter(t => !t.completed);
  const rightNowTask = pendingTasks.find(t => 
    isOverwhelmed ? t.energyRequired === 'low' : t.priority === 'high'
  ) || pendingTasks[0];

  const completedToday = tasks.filter(t => t.completed).length;
  const habitsDone = habits.filter(h => h.completedToday).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Gentle Overwhelmed Banner if active */}
      {isOverwhelmed && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-300">
              <HeartHandshake className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200">
                Gentle Overwhelm Mode is Active
              </h3>
              <p className="text-xs text-rose-300/80">
                We've filtered high-friction tasks and relaxed deadlines. Take a breath; you are doing enough.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('wellness')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 text-rose-100 text-xs font-semibold transition"
            >
              5-Min Reset
            </button>
            <button
              onClick={toggleOverwhelmed}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              Resume Normal
            </button>
          </div>
        </div>
      )}

      {/* Hero "Right Now" Card & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Now Hero (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/10 via-purple-900/20 to-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                {t('rightNow')}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Energy: <strong className="text-white">{userEnergy}%</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              {rightNowTask ? rightNowTask.title : "All Quests Complete for now!"}
            </h2>
            <p className="text-sm text-purple-200/80 mb-6 max-w-xl">
              {rightNowTask 
                ? `${rightNowTask.subject} • ${rightNowTask.estimatedMinutes} mins • Matches your current cognitive energy.`
                : "Wonderful work! Take a walk, hydrate, or customize your companion."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            {rightNowTask && (
              <>
                <button
                  onClick={() => onNavigate('focus')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t('startFocusSession')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleTaskComplete(rightNowTask.id)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('markComplete')}</span>
                </button>
              </>
            )}
            
            <button
              onClick={rebalanceTasksNonPunitive}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-400/30 transition ml-auto"
              title="Missed a step? Rebalance automatically without stress"
            >
              <Compass className="w-3.5 h-3.5 text-purple-300" />
              <span>{t('oneClickRebalance')}</span>
            </button>
          </div>
        </div>

        {/* Pet Companion Status Mini-Widget (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Edzemon Status</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Lv.{pet.level} {pet.species.toUpperCase()}
                </span>
              </h3>
              <button
                onClick={() => onNavigate('petShop')}
                className="text-xs text-purple-300 hover:text-white font-semibold transition"
              >
                Wardrobe →
              </button>
            </div>

            {/* 2D Mini Avatar Visual */}
            <div 
              onClick={() => onNavigate('petShop')}
              className="flex items-center justify-center py-2 cursor-pointer hover:scale-105 transition"
              title="Click to open Pet Customization & Sets"
            >
              <PetAvatar2D pet={pet} size={84} isAnimated={true} />
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Pet Energy</span>
                  <span className="font-bold text-purple-300">{pet.energy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all"
                    style={{ width: `${pet.energy}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Pet Fullness</span>
                  <span className="font-bold text-amber-300">{pet.hunger}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
                    style={{ width: `${pet.hunger}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20 mb-3">
              "{t('petFocusCheer')}"
            </p>
          </div>

          <button
            onClick={feedPet}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Feed Cosmic Berry (15 🪙)</span>
          </button>
        </div>

      </div>

      {/* Quick Action Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('planner')}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-xl flex items-center gap-3 transition hover:scale-[1.02] text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{t('brainDumpBtn')}</div>
            <div className="text-[11px] text-slate-400">Synthesize ideas</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('wellness')}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-xl flex items-center gap-3 transition hover:scale-[1.02] text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-400/40 flex items-center justify-center text-pink-300 group-hover:scale-110 transition">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{t('talkCompanionBtn')}</div>
            <div className="text-[11px] text-slate-400">ZenBot Check-in</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('petShop')}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-xl flex items-center gap-3 transition hover:scale-[1.02] text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{t('petShopBtn')}</div>
            <div className="text-[11px] text-slate-400">Customize avatar</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('wellness')}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-xl flex items-center gap-3 transition hover:scale-[1.02] text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{t('takeFiveBreak')}</div>
            <div className="text-[11px] text-slate-400">Guided breath reset</div>
          </div>
        </button>
      </div>

      {/* Daily Momentum Rings & Active 25-45m Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Momentum & Habit Rings (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{t('dailyFocusRings')}</span>
            </h3>
            <span className="text-xs text-purple-300 font-bold">
              {focusStreak} Day Streak 🔥
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20">
              <div className="text-xl font-black text-white">{completedToday}</div>
              <div className="text-[10px] text-purple-300">Quests Done</div>
            </div>
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20">
              <div className="text-xl font-black text-emerald-400">{habitsDone}/{habits.length}</div>
              <div className="text-[10px] text-emerald-300">Habits Kept</div>
            </div>
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20">
              <div className="text-xl font-black text-amber-400">85m</div>
              <div className="text-[10px] text-amber-300">Deep Focus</div>
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
            <span className="text-purple-300 font-semibold">EDZEN Shield:</span> Missed a habit? Your forgiveness tokens prevent streak resets. No shame, just continuity.
          </div>
        </div>

        {/* Active Quests List (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t('upcomingQuests')}</span>
              <span className="text-xs font-normal text-purple-300">
                ({tasks.filter(t => !t.completed).length} pending)
              </span>
            </h3>
            <button
              onClick={() => onNavigate('planner')}
              className="text-xs text-purple-300 hover:text-white font-semibold transition"
            >
              View Full Planner →
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed 
                    ? 'bg-white/5 border-white/5 opacity-60' 
                    : 'bg-white/5 hover:bg-white/10 border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="text-slate-400 hover:text-emerald-400 transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="text-purple-300">{task.subject}</span>
                      <span>•</span>
                      <span>{task.estimatedMinutes}m</span>
                      <span>•</span>
                      <span className={`capitalize ${task.energyRequired === 'high' ? 'text-rose-400' : task.energyRequired === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {task.energyRequired} Energy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <span>+{task.coinReward}🪙</span>
                  </div>
                  <button
                    onClick={() => onNavigate('focus')}
                    className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 text-xs font-semibold border border-purple-400/30 transition"
                  >
                    Focus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
