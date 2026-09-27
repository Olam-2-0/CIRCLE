import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { 
  FileText, Upload, Sparkles, AlertTriangle, CheckCircle, 
  Calendar, BookOpen, Languages, ShieldAlert, ChevronRight, Eye 
} from 'lucide-react';
import { Language } from '../types';

export const ExamRescuePage: React.FC = () => {
  const {
    t,
    syllabus,
    toggleWeakSubject,
    simulateSyllabusScan,
    language
  } = useEdzen();

  const [filterWeakOnly, setFilterWeakOnly] = useState<boolean>(false);
  const [selectedLanguageForCard, setSelectedLanguageForCard] = useState<Language>(language);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      simulateSyllabusScan();
    }, 1200);
  };

  const displayedModules = syllabus.filter(m => filterWeakOnly ? m.isWeakSubject : true);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Info Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-900/20 to-slate-900/60 backdrop-blur-2xl border border-amber-500/30 shadow-[0_8px_32px_0_rgba(245,158,11,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              80/20 High-Yield Rescue Protocol
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('examRescueTitle')}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
            {t('examRescueSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setFilterWeakOnly(!filterWeakOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
              filterWeakOnly 
                ? 'bg-rose-500/30 text-rose-200 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            {t('weakSubjectToggle')}: {filterWeakOnly ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'OCR Scanning Syllabus...' : t('simulateUpload')}</span>
          </button>
        </div>
      </div>

      {/* Upload Drag & Drop Simulated Box */}
      <div 
        onClick={handleSimulateUpload}
        className="p-8 rounded-3xl border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-center cursor-pointer transition-all duration-300 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-400/30 mx-auto flex items-center justify-center text-purple-300 group-hover:scale-110 transition duration-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">
          {t('uploadSyllabus')}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Drag & drop course PDF, lecture slide images, or syllabus outline. Our multimodal OCR instantly identifies core modules, weights, and high-frequency exam questions.
        </p>
      </div>

      {/* Language Toggle for Concept Summaries */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-200">
          <Languages className="w-4 h-4 text-purple-400" />
          <span>Multilingual Concept Flashcard Translation:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(['en', 'hi', 'ml', 'es', 'ta'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguageForCard(lang)}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition ${
                selectedLanguageForCard === lang
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Syllabus Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedModules.map((module) => {
          const progressPct = Math.round((module.completedChapters / module.totalChapters) * 100);

          return (
            <div
              key={module.id}
              className={`p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between ${
                module.isWeakSubject 
                  ? 'border-rose-400/40 shadow-[0_0_25px_rgba(244,63,94,0.15)]' 
                  : 'border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.1)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30 uppercase">
                      {module.code}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {module.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleWeakSubject(module.id)}
                    className={`p-1.5 rounded-xl border text-[10px] font-bold transition ${
                      module.isWeakSubject 
                        ? 'bg-rose-500/30 text-rose-200 border-rose-400/50' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                    title="Toggle Weak Subject Focus"
                  >
                    {module.isWeakSubject ? 'Priority Focus ⚠️' : 'Normal'}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Syllabus Coverage</span>
                    <span className="font-bold text-purple-300">
                      {module.completedChapters}/{module.totalChapters} Chapters ({progressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950/70 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        module.isWeakSubject 
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exam Target: <strong>{module.examDate}</strong></span>
                </div>

                {/* Key Concepts Translated */}
                <div className="space-y-2.5 pt-3 border-t border-white/10">
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>High-Yield Concepts ({selectedLanguageForCard.toUpperCase()}):</span>
                  </div>

                  {module.keyConcepts.map((concept, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950/50 border border-purple-500/20 text-xs space-y-1">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{concept.term}</span>
                        <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                          92% Frequency
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {concept.summary[selectedLanguageForCard] || concept.summary['en']}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                <span className={`text-[11px] font-semibold ${module.difficulty === 'High Alert' ? 'text-rose-400' : 'text-purple-300'}`}>
                  Difficulty: {module.difficulty}
                </span>
                <button
                  onClick={() => alert(`Starting targeted active recall flashcard session for ${module.name}!`)}
                  className="flex items-center gap-1 text-xs text-purple-300 hover:text-white font-semibold transition"
                >
                  <span>Practice Flashcards</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
