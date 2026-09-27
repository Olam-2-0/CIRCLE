import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  GitFork, CheckCircle, Lock, Award, Sparkles, 
  ChevronRight, BookOpen, Layers, ShieldCheck 
} from 'lucide-react';
import { SkillNode } from '../types';

export const SkillTreePage: React.FC = () => {
  const { skills, completeSkillNode, credentials } = useEdzen();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeNode, setActiveNode] = useState<SkillNode>(skills[0]);

  const categories = ['All', 'Math & Logic', 'Computer Systems', 'Cognitive Psychology', 'Linguistics'];

  const filteredSkills = skills.filter(s => 
    selectedCategory === 'All' ? true : s.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Skill Tree Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-slate-900/60 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 mb-2">
            <GitFork className="w-3.5 h-3.5" />
            Curriculum Skill RPG Map
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Academic Mastery Skill Trees
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            Advance node by node through interconnected subject branches. Completing tier-1 foundational nodes awards verifiable on-chain micro-credentials.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Visual Tree Nodes (7 cols) + Selected Node Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Node Network Map (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.1)] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Branch Nodes ({filteredSkills.length})</span>
            <span className="text-xs text-purple-300">Click a node to inspect</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredSkills.map((node) => {
              const isSelected = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                      : node.completed
                      ? 'bg-white/5 border-emerald-500/30 hover:border-emerald-400'
                      : !node.unlocked
                      ? 'bg-slate-950/40 border-white/5 opacity-50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                      Tier {node.level} • {node.category}
                    </span>
                    {node.completed ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> Mastered
                      </span>
                    ) : !node.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-white/5 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                        {node.progress}%
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">
                    {node.title}
                  </h4>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-auto">
                    <div
                      className={`h-full rounded-full transition-all ${
                        node.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-purple-500 to-indigo-400'
                      }`}
                      style={{ width: `${node.completed ? 100 : node.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector & Credential Info (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
                {activeNode.category}
              </span>
              <span className="text-xs text-slate-400">
                Level {activeNode.level} Node
              </span>
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              {activeNode.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeNode.description}
            </p>

            <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Prerequisites:</span>
                <span className="font-semibold text-purple-200">
                  {activeNode.prerequisites.length > 0 ? activeNode.prerequisites.join(', ') : 'None (Foundation Node)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reward for Mastery:</span>
                <span className="font-bold text-amber-300">+150 XP • +80 Coins 🪙</span>
              </div>
              {activeNode.credentialId && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Unlocked Verifiable Credential:</span>
                  </div>
                  <p className="text-[11px] font-mono text-amber-300">
                    ID: {activeNode.credentialId} (Tamper-evident)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            {!activeNode.completed ? (
              <button
                onClick={() => completeSkillNode(activeNode.id)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.5)] transition hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Mastery Verification (+150 XP)</span>
              </button>
            ) : (
              <div className="w-full py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Mastered & Recorded on Student Profile</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
