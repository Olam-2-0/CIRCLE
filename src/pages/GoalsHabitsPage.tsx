import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  Target, ShieldCheck, Flame, CheckCircle2, Circle, 
  Plus, Sparkles, Layers, Heart, Award, ShieldAlert 
} from 'lucide-react';
import { HabitItem } from '../types';

export const GoalsHabitsPage: React.FC = () => {
  const {
    t,
    habits,
    toggleHabit,
    useForgivenessToken
  } = useEdzen();

  const [selectedGoalFilter, setSelectedGoalFilter] = useState<'All' | 'Academics' | 'Focus' | 'Health'>('All');

  // Sample hierarchical goal representation
  const goalHierarchy = [
    {
      goal: "Ace Midterm Semester with High Retention",
      milestone: "Master 8 Calculus Optimization Theorems & Distributed Raft",
      habit: "25-Min Deep Focus Sprint Daily",
      quest: "Solve 4 Database Normalization Problem Sets (BCNF)"
    },
    {
      goal: "Maintain Pristine Mental & Physical Energy",
      milestone: "Eliminate Late-Night Cognitive Exhaustion & Sleep Deficit",
      habit: "Screen Sunset 30m Before Sleep",
      quest: "5-Minute Desk Decompression & Hydration"
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Forgiveness Shield Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/60 backdrop-blur-2xl border border-purple-500/30 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Non-Punitive Habit Architecture
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('goalsHabitsTitle')}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
            {t('goalsHabitsSubtitle')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
          <div className="text-2xl font-black text-amber-300">🛡️ 8 Tokens</div>
          <div className="text-[11px] text-purple-200">Total Shield Reserves</div>
        </div>
      </div>

      {/* Goal -> Milestone -> Habit -> Quest Hierarchy Visualizer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Connected Life Hierarchy: Goal → Milestone → Habit → Quest
          </h3>
        </div>

        <div className="space-y-4">
          {goalHierarchy.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold">
                  🎯 Goal
                </span>
                <span className="font-bold text-white">{item.goal}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pl-2 border-l-2 border-purple-500/40">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-purple-300 uppercase font-bold block mb-0.5">🏆 Milestone</span>
                  <span className="text-slate-200 text-[11px]">{item.milestone}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block mb-0.5">🌱 Daily Habit</span>
                  <span className="text-slate-200 text-[11px]">{item.habit}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-amber-300 uppercase font-bold block mb-0.5">⚡ 25m Quest</span>
                  <span className="text-slate-200 text-[11px]">{item.quest}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habits List with Forgiveness Tokens */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Daily Habits ({habits.length})
          </h3>
          <span className="text-xs text-purple-300">
            Click checkbox to check-off, or use a Shield Token if today was impossible!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                habit.completedToday 
                  ? 'bg-purple-950/40 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className="text-slate-400 hover:text-emerald-400 transition mt-0.5"
                  >
                    {habit.completedToday ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-bold ${habit.completedToday ? 'text-white' : 'text-slate-200'}`}>
                      {habit.title}
                    </h4>
                    <span className="text-[10px] text-purple-300 font-semibold uppercase">
                      {habit.category} • {habit.frequency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 text-xs font-bold text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{habit.streak}d</span>
                </div>
              </div>

              {/* Forgiveness Shield Action */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tokens: <strong>{habit.forgivenessTokens} remaining</strong></span>
                </div>

                {!habit.completedToday && (
                  <button
                    onClick={() => useForgivenessToken(habit.id)}
                    className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[11px] font-semibold border border-purple-400/30 transition"
                  >
                    Use Shield Token 🛡️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
