import React, { useState, useEffect } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  Play, Pause, RotateCcw, Sparkles, CloudRain, 
  Music, Disc3, VolumeX, Coffee, Heart, Zap, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export const QuestsFocusPage: React.FC = () => {
  const {
    t,
    addXp,
    addCoins,
    boostEnergy,
    attackBoss,
    ambientSound,
    setAmbientSound,
    pet
  } = useEdzen();

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(3);

  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;

  useEffect(() => {
    let timer: number | null = null;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Completed session!
      setIsRunning(false);
      sounds.playSuccess();
      confetti({ particleCount: 10, spread: 35, scalar: 0.6, origin: { y: 0.6 } });

      if (mode === 'focus') {
        addXp(60);
        addCoins(30);
        boostEnergy(25);
        attackBoss(80);
        setSessionsCompleted(s => s + 1);
        setMode('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode, addXp, addCoins, boostEnergy, attackBoss]);

  const toggleTimer = () => {
    if (!isRunning) {
      sounds.playPetCheer();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleModeChange = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : newMode === 'shortBreak' ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const strokeDashoffset = 565 - (565 * progress) / 100;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Timer Section Card */}
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] text-center relative overflow-hidden">
        
        {/* Glow behind timer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Tabs */}
        <div className="flex justify-center gap-2 mb-8 relative z-10">
          <button
            onClick={() => handleModeChange('focus')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              mode === 'focus'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            25m Deep Focus
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            5m Short Rest
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            15m Recovery Walk
          </button>
        </div>

        {/* Circular SVG Progress Ring */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4 z-10">
          <svg className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="128"
              cy="128"
              r="90"
              className="text-white/10"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke={mode === 'focus' ? '#c084fc' : '#34d399'}
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray="565"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-white font-mono tracking-wider drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-semibold text-purple-300 mt-1 uppercase tracking-widest">
              {mode === 'focus' ? 'Focus Quest' : 'Rest Interval'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-6 relative z-10">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base shadow-[0_0_30px_rgba(168,85,247,0.6)] transition hover:scale-105"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Sprint</span>
              </>
            )}
          </button>
        </div>

        {/* Pet Energy Reward Tag */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Feeds Companion: <strong>+25% Hunger</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Regenerates: <strong>+20% Student Energy</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Deals: <strong>80 DMG to Boss</strong></span>
          </div>
        </div>

      </div>

      {/* Ambient Sound Dock */}
      <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span>Generative Focus Audio:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAmbientSound('rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              ambientSound === 'rain' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-slate-300'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Gentle Rain</span>
          </button>

          <button
            onClick={() => setAmbientSound('lofi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              ambientSound === 'lofi' ? 'bg-purple-600 text-white font-bold' : 'bg-white/10 text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Cosmic Lofi</span>
          </button>

          <button
            onClick={() => setAmbientSound('zen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              ambientSound === 'zen' ? 'bg-amber-500 text-black font-bold' : 'bg-white/10 text-slate-300'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>Zen Temple</span>
          </button>

          <button
            onClick={() => setAmbientSound('off')}
            className={`p-1.5 rounded-xl text-xs transition ${
              ambientSound === 'off' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-slate-400'
            }`}
            title="Mute"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
