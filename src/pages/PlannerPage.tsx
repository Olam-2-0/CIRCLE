import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  BrainCircuit, Sparkles, Plus, Trash2, CheckCircle2, 
  Circle, Clock, Zap, AlertCircle, Compass, HeartHandshake, Filter 
} from 'lucide-react';
import { TaskEnergy, TaskPriority } from '../types';

export const PlannerPage: React.FC = () => {
  const {
    t,
    tasks,
    addTask,
    toggleTaskComplete,
    deleteTask,
    rebalanceTasksNonPunitive,
    synthesizeBrainDump,
    isOverwhelmed
  } = useEdzen();

  const [brainDumpInput, setBrainDumpInput] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [filterEnergy, setFilterEnergy] = useState<string>('all');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Academics');
  const [newMinutes, setNewMinutes] = useState(25);
  const [newEnergy, setNewEnergy] = useState<TaskEnergy>('medium');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');

  const handleBrainDumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainDumpInput.trim()) return;
    synthesizeBrainDump(brainDumpInput);
    setBrainDumpInput('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      subject: newSubject,
      estimatedMinutes: Number(newMinutes),
      energyRequired: newEnergy,
      priority: newPriority,
      deadline: 'Today',
      category: 'study',
      xpReward: Number(newMinutes) * 2,
      coinReward: Math.floor(Number(newMinutes) * 1.2)
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filterEnergy !== 'all' && t.energyRequired !== filterEnergy) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Non-punitive Rebalance Encouragement Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-950/40 backdrop-blur-2xl border border-purple-500/30 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t('planChangedTitle')}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Zero Penalty
              </span>
            </h3>
            <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
              {t('planChangedBody')}
            </p>
          </div>
        </div>

        <button
          onClick={rebalanceTasksNonPunitive}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:scale-105"
        >
          {t('oneClickRebalance')}
        </button>
      </div>

      {/* AI Brain Dump Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {t('brainDumpTitle')}
              </h2>
              <p className="text-xs text-slate-300">
                Type whatever is cluttering your mind. We automatically extract deadlines, effort, and energy.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30 hidden sm:inline">
            Multilingual NLP
          </span>
        </div>

        <form onSubmit={handleBrainDumpSubmit} className="space-y-3">
          <textarea
            value={brainDumpInput}
            onChange={(e) => setBrainDumpInput(e.target.value)}
            rows={3}
            placeholder={t('brainDumpPlaceholder')}
            className="w-full p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none shadow-inner"
          />

          {/* Quick Presets / In-head thoughts */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-400">Quick ideas:</span>
            <button
              type="button"
              onClick={() => setBrainDumpInput("Prepare 3 slides for physics presentation, practice 2 vector calculus integrals, feeling burnt out")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10 transition"
            >
              Physics presentation & Calculus
            </button>
            <button
              type="button"
              onClick={() => setBrainDumpInput("Finish biology chapter on synaptic transmission, submit assignment before 5pm, drink water")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10 transition"
            >
              Biology chapter & Assignment
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!brainDumpInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('brainDumpSubmit')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Task List Header with Energy Filters & Create Task Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">
            Adaptive 20–45m Quests ({filteredTasks.length})
          </h3>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <Filter className="w-3 h-3 text-slate-400 ml-1" />
            <button
              onClick={() => setFilterEnergy('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] ${filterEnergy === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterEnergy('low')}
              className={`px-2 py-0.5 rounded-lg text-[11px] ${filterEnergy === 'low' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Low Energy
            </button>
            <button
              onClick={() => setFilterEnergy('high')}
              className={`px-2 py-0.5 rounded-lg text-[11px] ${filterEnergy === 'high' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'}`}
            >
              High Energy
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
        >
          <Plus className="w-4 h-4 text-purple-300" />
          <span>{showAddForm ? 'Cancel' : t('addCustomQuest')}</span>
        </button>
      </div>

      {/* Add Custom Quest Form Modal/Dropdown */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="p-5 rounded-3xl bg-white/10 backdrop-blur-2xl border border-purple-400/40 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
            Create 20–45 Min Bite-Sized Quest
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Quest Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Read 4 pages of neural network backprop"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs focus:ring-1 focus:ring-purple-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Subject / Domain</label>
              <input
                type="text"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                placeholder="e.g. Machine Learning / Systems"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs focus:ring-1 focus:ring-purple-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Duration (Mins)</label>
              <select
                value={newMinutes}
                onChange={e => setNewMinutes(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs outline-none"
              >
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={25}>25 Minutes (Standard)</option>
                <option value={35}>35 Minutes</option>
                <option value={45}>45 Minutes (Max)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Energy Cost</label>
              <select
                value={newEnergy}
                onChange={e => setNewEnergy(e.target.value as TaskEnergy)}
                className="w-full px-2 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs outline-none"
              >
                <option value="low">Low (Chill)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Deep Brainwork)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="w-full px-2 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow"
            >
              Add Quest
            </button>
          </div>
        </form>
      )}

      {/* Quests Cards */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-3xl bg-white/10 backdrop-blur-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
              task.completed 
                ? 'border-white/5 bg-white/5 opacity-50' 
                : 'border-white/20 hover:border-purple-400/40 shadow-[0_8px_32px_0_rgba(168,85,247,0.1)]'
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
                <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {task.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="text-purple-300 font-semibold">{task.subject}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3 h-3 text-purple-300" />
                    {task.estimatedMinutes}m
                  </span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 font-semibold ${
                    task.energyRequired === 'high' ? 'text-rose-400' : task.energyRequired === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    <Zap className="w-3 h-3" />
                    {task.energyRequired} energy
                  </span>
                  {task.notes && (
                    <>
                      <span>•</span>
                      <span className="italic text-slate-400 truncate max-w-xs">{task.notes}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-amber-300">+{task.coinReward}🪙</div>
                <div className="text-[10px] text-purple-300">+{task.xpReward} XP</div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-500 hover:text-rose-400 transition p-1"
                title="Remove quest"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
