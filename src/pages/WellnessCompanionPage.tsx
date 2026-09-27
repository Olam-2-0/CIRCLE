import React, { useState, useEffect } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  HeartPulse, Sparkles, Send, HeartHandshake, ShieldCheck, 
  Wind, Smile, Sun, Moon, ArrowRight, Play, Pause, RotateCcw 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const WellnessCompanionPage: React.FC = () => {
  const {
    t,
    isOverwhelmed,
    toggleOverwhelmed,
    rebalanceTasksNonPunitive,
    boostEnergy,
    language
  } = useEdzen();

  // AI Chat Messages
  const [messages, setMessages] = useState<{
    sender: 'ai' | 'user';
    text: string;
    timestamp: string;
  }[]>([
    {
      sender: 'ai',
      text: "Hello Alex. I'm ZenBot, your non-judgmental student companion. How is your nervous system holding up right now? Remember: you are a human being having an academic experience, not an exam-taking machine.",
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');

  // 5-Min Breath Reset State
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  // Breathing loop (4-7-8 rhythm)
  useEffect(() => {
    let interval: number | null = null;
    if (breathingActive) {
      interval = window.setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive, breathPhase]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText, timestamp: 'Just now' }]);
    setInputVal('');

    // Empathetic simulated AI response
    setTimeout(() => {
      sounds.playPetCheer();
      const lower = userText.toLowerCase();
      let reply = "I hear you deeply. Take off the pressure of having to solve everything at once. Focus on the single next breath.";
      
      if (lower.includes('stress') || lower.includes('exam') || lower.includes('tired') || lower.includes('overwhelm')) {
        reply = "It makes total sense that you are feeling this strain. When the brain senses a deadline surge, the amygdala fires stress hormones. Let's activate the 'I'm Overwhelmed' mode to trim down today's cognitive load.";
      } else if (lower.includes('cant study') || lower.includes("can't study")) {
        reply = "Permission granted to pause. Rest is not something you earn after working; rest is a biological prerequisite for cognitive function. I've safely shifted non-critical tasks forward.";
      } else {
        reply = "You are handling so much with grace. Let's take a 5-minute somatic reset together. Your companion Astra and I are rooting for you!";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, timestamp: 'Just now' }]);
    }, 700);
  };

  const handleStartBreathing = () => {
    sounds.playZenBowl();
    setBreathingActive(!breathingActive);
  };

  const handleCantStudyProtocol = () => {
    rebalanceTasksNonPunitive();
    boostEnergy(30);
    sounds.playZenBowl();
    alert("Permission Protocol Activated: We've safely shifted your tasks forward over the next 48 hours with zero penalty. Turn off your screen, drink warm tea, and let your mind unwind.");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900/60 backdrop-blur-2xl border border-pink-500/30 shadow-[0_8px_32px_0_rgba(244,114,182,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 inline-flex items-center gap-1.5 mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-pink-400" />
            Nervous System Decompression
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('wellnessTitle')}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
            {t('wellnessSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={toggleOverwhelmed}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
              isOverwhelmed
                ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            {isOverwhelmed ? 'Gentle Mode Active 🌸' : "Activate I'm Overwhelmed Mode"}
          </button>

          <button
            onClick={handleCantStudyProtocol}
            className="px-4 py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/30 text-xs font-bold transition"
          >
            "I Can't Study Right Now" Protocol 🛡️
          </button>
        </div>
      </div>

      {/* Grid: 5-Min Guided Breathing Widget (5 cols) + Empathetic AI Companion Chat (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 5-Min Somatic Breath Reset (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between text-center space-y-4">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t('fiveMinRecovery')}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              4-7-8 Parasympathetic Vagus Nerve Decompression
            </p>

            {/* Expanding/Contracting Breathing Orb */}
            <div className="my-8 relative flex items-center justify-center">
              <div 
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-[0_0_40px_rgba(168,85,247,0.4)] ${
                  breathPhase === 'Inhale' 
                    ? 'scale-125 bg-gradient-to-tr from-purple-600 to-cyan-500' 
                    : breathPhase === 'Hold'
                    ? 'scale-125 bg-gradient-to-tr from-amber-500 to-purple-600 animate-pulse'
                    : 'scale-90 bg-gradient-to-tr from-indigo-700 to-purple-900'
                }`}
              >
                <span className="text-xl font-black text-white">{breathPhase}</span>
                <span className="text-3xl font-mono font-bold text-white/90 mt-1">{breathTimer}s</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300 max-w-xs mx-auto">
              <p>• Inhale through your nose (4s)</p>
              <p>• Hold your breath gently (7s)</p>
              <p>• Exhale completely through mouth (8s)</p>
            </div>
          </div>

          <button
            onClick={handleStartBreathing}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition"
          >
            {breathingActive ? 'Pause Breathing Cycle' : 'Begin 5-Min Reset Session'}
          </button>
        </div>

        {/* Empathetic AI Companion Chat (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ZenBot AI Companion</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Always here • Non-judgmental
                  </span>
                </div>
              </div>
              <span className="text-xs text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full">
                Multilingual Support
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none shadow'
                        : 'bg-slate-950/70 border border-purple-500/20 text-purple-100 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Prompts & Chat Input */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setInputVal("I feel so overwhelmed by my upcoming exams.")}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10 transition"
              >
                "I feel overwhelmed"
              </button>
              <button
                type="button"
                onClick={() => setInputVal("I can't study right now, my brain is completely drained.")}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10 transition"
              >
                "My brain is drained"
              </button>
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Talk to ZenBot about study anxiety, pressure, or burnout..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-white/15 text-white text-xs outline-none focus:ring-1 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
