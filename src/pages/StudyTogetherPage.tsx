import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  Users2, Globe2, Swords, Sparkles, MessageCircle, 
  Flame, Heart, Send, Award, Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export const StudyTogetherPage: React.FC = () => {
  const {
    t,
    buddies,
    boss,
    attackBoss,
    addCoins,
    addXp,
    boostEnergy
  } = useEdzen();

  const [chatMessages, setChatMessages] = useState<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
    badge?: string;
  }[]>([
    { id: '1', author: 'Elena R. (Oxford)', text: 'Finished my 30m organic synthesis review! Hydrating now.', timestamp: '2m ago', badge: '110m' },
    { id: '2', author: 'Kenji T. (Tokyo Tech)', text: 'Distributed systems raft logic verified! Stay strong everyone.', timestamp: '5m ago', badge: '135m' },
    { id: '3', author: 'Ananya S. (IIT Bombay)', text: 'Starting a 25m calculus problem sprint. Let us take down this raid boss!', timestamp: '8m ago', badge: '95m' },
  ]);

  const [myMessage, setMyMessage] = useState<string>('');
  const [hasCheered, setHasCheered] = useState<boolean>(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        author: 'Alex Mercer (You)',
        text: myMessage.trim(),
        timestamp: 'Just now',
        badge: '85m'
      }
    ]);
    setMyMessage('');
    sounds.playPetCheer();
  };

  const handleCoopAttack = () => {
    attackBoss(150);
    addXp(80);
    addCoins(40);
    boostEnergy(20);
    confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.6 } });
    setHasCheered(true);
  };

  const bossHealthPct = Math.round((boss.currentHealth / boss.totalHealth) * 100);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-slate-900/60 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_8px_32px_0_rgba(6,182,212,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1.5 mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            Global Synchronized Focus Room
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('studyTogetherTitle')}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            {t('studyTogetherSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 text-xs text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span><strong>1,842</strong> Students Online Worldwide</span>
        </div>
      </div>

      {/* Global Raid Boss Collaborative Battle Bar */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-pulse">
            {boss.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{boss.name}</h3>
              <span className="text-xs text-rose-300 font-semibold bg-rose-500/20 px-2 py-0.5 rounded-full">
                Weekly Community Raid
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Defeat by pooling focus sprints! Reward pool: <span className="text-amber-300 font-bold">{boss.rewardPoolCoins} 🪙 Coins + {boss.rewardPoolXp} XP</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-56 text-right">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Collective HP</span>
              <span className="font-bold text-rose-400">{boss.currentHealth} / {boss.totalHealth} ({bossHealthPct}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-rose-500/30">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${bossHealthPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleCoopAttack}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-black shadow-[0_0_20px_rgba(244,63,94,0.5)] transition hover:scale-105 whitespace-nowrap"
          >
            ⚔️ Attack Boss with 25m Focus (-150 HP)
          </button>
        </div>
      </div>

      {/* Grid: Live Study Buddies (8 cols) + Supportive Chat (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Study Buddies (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.1)] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>{t('activeBuddies')} ({buddies.length})</span>
            <span className="text-xs text-purple-300">Synchronized Pomodoros</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {buddies.map((buddy) => (
              <div
                key={buddy.id}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-xl shrink-0">
                    {buddy.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{buddy.name}</h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-purple-300 font-semibold mt-0.5">
                      {buddy.status}
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
                      "{buddy.currentTask}"
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    {buddy.focusMinutesToday}m Today
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase">
                    Pet: {buddy.petSpecies}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Supportive Chat & Intentions (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span>Study Intentions Stream</span>
              </h3>
              <span className="text-[10px] text-slate-400">Quiet Room</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-2xl bg-slate-950/50 border border-white/5 text-xs space-y-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-purple-300">{msg.author}</span>
                    <span className="text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-white/10">
            <input
              type="text"
              value={myMessage}
              onChange={e => setMyMessage(e.target.value)}
              placeholder="Share study intention..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950/70 border border-white/15 text-white text-xs outline-none focus:ring-1 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
