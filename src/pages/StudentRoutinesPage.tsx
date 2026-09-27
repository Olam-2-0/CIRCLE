import React from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  BookOpenCheck, ThumbsUp, Sparkles, Clock, 
  Check, ArrowRight, UserCheck, Flame 
} from 'lucide-react';

export const StudentRoutinesPage: React.FC = () => {
  const {
    t,
    routines,
    activeRoutineId,
    adoptRoutine
  } = useEdzen();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-slate-900/60 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 mb-2">
            <BookOpenCheck className="w-3.5 h-3.5" />
            Biorhythm & Community Templates
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('routinesTitle')}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            {t('routinesSubtitle')} Don't force yourself into a rigid mold—choose a rhythm that honors your natural energy peaks.
          </p>
        </div>
      </div>

      {/* Routine Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routines.map((routine) => {
          const isActive = activeRoutineId === routine.id;

          return (
            <div
              key={routine.id}
              className={`p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)] bg-purple-950/30'
                  : 'border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.1)] hover:border-purple-400/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30 uppercase">
                    {routine.tag}
                  </span>
                  
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                    <ThumbsUp className="w-3 h-3 text-amber-400" />
                    <span>{routine.upvotes}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {routine.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {routine.description}
                </p>

                <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5 text-xs text-purple-200/90 mb-4">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">
                    Recommended For:
                  </span>
                  {routine.recommendedFor}
                </div>

                {/* Step Breakdown */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Routine Flow:
                  </span>
                  {routine.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-white font-medium">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span>{task.timeOfDay}</span>
                        <span>•</span>
                        <span className="text-purple-300 font-semibold">{task.minutes}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  By {routine.author}
                </span>

                <button
                  onClick={() => adoptRoutine(routine.id)}
                  disabled={isActive}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Current Active Routine</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t('adaptRoutineBtn')}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
