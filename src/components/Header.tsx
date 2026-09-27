import React from 'react';
import { useEdzen } from '../context/EdzenContext';
import { LANGUAGES } from '../i18n/translations';
import { Language } from '../types';
import { 
  Sparkles, Coins, Zap, HeartHandshake, Volume2, 
  VolumeX, CloudRain, Music, Disc3, ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  onNavigate?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const {
    language,
    setLanguage,
    t,
    userLevel,
    userXp,
    userXpMax,
    userCoins,
    userEnergy,
    isOverwhelmed,
    toggleOverwhelmed,
    ambientSound,
    setAmbientSound
  } = useEdzen();

  const xpPercentage = Math.min(100, Math.round((userXp / userXpMax) * 100));

  const handleNextAmbient = () => {
    if (ambientSound === 'off') setAmbientSound('rain');
    else if (ambientSound === 'rain') setAmbientSound('lofi');
    else if (ambientSound === 'lofi') setAmbientSound('zen');
    else setAmbientSound('off');
  };

  const getAmbientIcon = () => {
    switch (ambientSound) {
      case 'rain': return <CloudRain className="w-4 h-4 text-cyan-300 animate-bounce-gentle" />;
      case 'lofi': return <Music className="w-4 h-4 text-purple-300 animate-pulse" />;
      case 'zen': return <Disc3 className="w-4 h-4 text-amber-300 animate-spin" />;
      default: return <VolumeX className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-950/70 border-b border-purple-500/20 shadow-[0_4px_25px_0_rgba(0,0,0,0.5)] px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo & Philosophy Slogan (Clickable to Front Page) */}
        <div 
          onClick={() => onNavigate?.('home')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to EDZEN Main Front Page"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-[2px] shadow-[0_4px_20px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center backdrop-blur-md">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
                ED
              </span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-white group-hover:text-purple-300 transition-colors">
                <span className="text-purple-400">ED</span>ZEN
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                AI Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden md:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Center / Right: Student Stats (Level, XP, Coins, Energy) */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          
          {/* Level & XP */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 px-3 py-1.5 rounded-2xl shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-purple-300 shadow-inner">
              Lv.{userLevel}
            </div>
            <div className="w-20 sm:w-28">
              <div className="flex justify-between text-[10px] font-bold text-purple-200 mb-0.5">
                <span>XP</span>
                <span>{userXp}/{userXpMax}</span>
              </div>
              <div className="w-full h-1.5 bg-purple-950/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quest Coins (🪙) */}
          <div 
            className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 px-3 py-1.5 rounded-2xl shadow-sm group hover:border-amber-400 transition"
            title="Quest Coins earned through focus & answer challenges"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-200" />
            <span className="text-xs font-extrabold text-amber-300 font-mono tracking-wide">
              {userCoins}
            </span>
          </div>

          {/* Cognitive Energy Bar */}
          <div 
            className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 px-3 py-1.5 rounded-2xl shadow-sm"
            title="Cognitive Energy - Regenerates through recovery and 25m breaks"
          >
            <Zap className={`w-4 h-4 ${userEnergy > 50 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div className="hidden sm:block">
              <div className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                <span>{userEnergy}%</span>
              </div>
            </div>
          </div>

          {/* Ambient Generative Audio Switcher */}
          <button
            onClick={handleNextAmbient}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all ${
              ambientSound !== 'off' 
                ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                : 'bg-slate-900/80 border-purple-500/30 text-slate-400 hover:text-white hover:bg-purple-900/30'
            }`}
            title={`Ambient Sound: ${ambientSound.toUpperCase()} (Click to cycle)`}
          >
            {getAmbientIcon()}
            <span className="capitalize text-[11px] hidden sm:inline">{ambientSound === 'off' ? 'Sound' : ambientSound}</span>
          </button>

          {/* "I'm Overwhelmed" Emergency Gentle Mode Toggle */}
          <button
            onClick={toggleOverwhelmed}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-bold text-xs transition-all duration-300 border ${
              isOverwhelmed 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' 
                : 'bg-purple-950/50 hover:bg-purple-900/50 text-purple-200 border-purple-500/40 shadow-sm'
            }`}
            title="Activate gentle, non-punitive focus filter"
          >
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">
              {isOverwhelmed ? t('overwhelmedActive') : t('overwhelmedBtn')}
            </span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-slate-900/90 border border-purple-500/30 text-slate-200 font-semibold text-xs rounded-2xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400/50 cursor-pointer shadow-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};
