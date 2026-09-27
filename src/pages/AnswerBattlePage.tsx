import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  Swords, Camera, Sparkles, HelpCircle, CheckCircle, 
  AlertCircle, ChevronRight, ShieldAlert, Award, RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export const AnswerBattlePage: React.FC = () => {
  const {
    t,
    questions,
    boss,
    attackBoss,
    addXp,
    addCoins,
    boostEnergy
  } = useEdzen();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [unlockedHints, setUnlockedHints] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    correct: boolean;
    score: number;
    feedback: string;
  } | null>(null);
  const [isCameraScanning, setIsCameraScanning] = useState<boolean>(false);

  const activeQuestion = questions[currentIdx % questions.length];

  const handleUnlockHint = () => {
    if (unlockedHints < activeQuestion.hints.length) {
      setUnlockedHints(h => h + 1);
      sounds.playPetCheer();
    }
  };

  const handleSimulateCameraUpload = () => {
    setIsCameraScanning(true);
    setTimeout(() => {
      setIsCameraScanning(false);
      // Auto populate accurate student handwritten OCR text
      setUserAnswer(activeQuestion.correctAnswerSummary);
      sounds.playSuccess();
    }, 1200);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);

      // Deterministic keyword matching evaluation
      const lower = userAnswer.toLowerCase();
      const matched = activeQuestion.expectedKeywords.filter(kw => lower.includes(kw));
      const scoreRatio = matched.length / activeQuestion.expectedKeywords.length;

      const isCorrect = scoreRatio >= 0.4 || userAnswer.length > 50;
      const score = Math.max(60, Math.round(scoreRatio * 100));

      if (isCorrect) {
        sounds.playSuccess();
        const dmg = 120 - (unlockedHints * 15);
        attackBoss(dmg);
        addXp(activeQuestion.xp);
        addCoins(activeQuestion.coins);
        boostEnergy(15);
        confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.6 } });

        setEvaluationResult({
          correct: true,
          score,
          feedback: `Outstanding! Answer contains key concepts. Boss took ${dmg} damage! +${activeQuestion.xp} XP, +${activeQuestion.coins} 🪙 earned.`
        });
      } else {
        sounds.playZenBowl();
        setEvaluationResult({
          correct: false,
          score: 40,
          feedback: "Good attempt! Check the progressive hints to reinforce your understanding."
        });
      }
    }, 1000);
  };

  const handleNextChallenge = () => {
    setCurrentIdx(i => i + 1);
    setUnlockedHints(0);
    setUserAnswer('');
    setEvaluationResult(null);
  };

  const bossHealthPct = Math.round((boss.currentHealth / boss.totalHealth) * 100);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Co-Op Boss Health Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900/60 backdrop-blur-2xl border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce-gentle">
            {boss.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">{boss.name}</h3>
              <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                Active Raid Boss
              </span>
            </div>
            <p className="text-xs text-rose-200/80">
              {boss.title} • Debuff: <span className="text-amber-300">{boss.activeDebuff}</span>
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>Raid Boss HP</span>
            <span className="font-bold text-rose-400">{boss.currentHealth} / {boss.totalHealth} ({bossHealthPct}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-rose-500/20">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${bossHealthPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 uppercase">
              {activeQuestion.subject}
            </span>
            <span className="text-xs text-slate-400">
              Challenge {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-amber-300">+{activeQuestion.coins} 🪙 Coins</span>
            <span className="text-purple-300">+{activeQuestion.xp} XP</span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {activeQuestion.question}
        </h3>

        {/* Progressive Hints Accordion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Progressive Cognitive Hints ({unlockedHints}/{activeQuestion.hints.length})</span>
            </span>

            {unlockedHints < activeQuestion.hints.length && (
              <button
                onClick={handleUnlockHint}
                className="text-xs text-purple-300 hover:text-white font-semibold transition"
              >
                + Unlock Hint {unlockedHints + 1} (No Penalty)
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {activeQuestion.hints.slice(0, unlockedHints).map((hint, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 animate-in fade-in duration-200"
              >
                {hint}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Submission Form */}
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Your Answer (Explain or state key concepts):
              </label>
              
              <button
                type="button"
                onClick={handleSimulateCameraUpload}
                disabled={isCameraScanning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-purple-300 border border-white/10 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCameraScanning ? 'Simulating OCR...' : t('simulateCameraUpload')}</span>
              </button>
            </div>

            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              rows={4}
              placeholder="Type your explanation here, or click 'Simulate Camera Answer Upload' above to simulate scanning your handwritten notes..."
              className="w-full p-4 rounded-2xl bg-slate-950/70 border border-purple-500/30 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-purple-400/50 outline-none resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleNextChallenge}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Challenge</span>
            </button>

            <button
              type="submit"
              disabled={isEvaluating || !userAnswer.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] transition hover:scale-105"
            >
              <Swords className="w-4 h-4" />
              <span>{isEvaluating ? 'Evaluating Mastery...' : t('checkAnswer')}</span>
            </button>
          </div>
        </form>

        {/* Evaluation Result Feedback Card */}
        {evaluationResult && (
          <div className={`p-4 rounded-2xl border animate-in fade-in duration-300 ${
            evaluationResult.correct 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {evaluationResult.correct ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>Mastery Score: {evaluationResult.score}%</span>
            </div>
            <p className="text-xs leading-relaxed">
              {evaluationResult.feedback}
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
