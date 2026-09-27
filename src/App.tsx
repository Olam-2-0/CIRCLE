import React, { useState } from 'react';
import { EdzenProvider, useEdzen } from './context/EdzenContext';
import { Header } from './components/Header';
import { Navbar, NavigationTab } from './components/Navbar';
import { RoamingPet } from './components/RoamingPet';

// Pages
import { FrontLandingPage } from './pages/FrontLandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlannerPage } from './pages/PlannerPage';
import { ExamRescuePage } from './pages/ExamRescuePage';
import { SkillTreePage } from './pages/SkillTreePage';
import { QuestsFocusPage } from './pages/QuestsFocusPage';
import { AnswerBattlePage } from './pages/AnswerBattlePage';
import { StudyTogetherPage } from './pages/StudyTogetherPage';
import { GoalsHabitsPage } from './pages/GoalsHabitsPage';
import { WellnessCompanionPage } from './pages/WellnessCompanionPage';
import { StudentRoutinesPage } from './pages/StudentRoutinesPage';
import { PetWardrobeShopPage } from './pages/PetWardrobeShopPage';
import { ProfileCredentialsPage } from './pages/ProfileCredentialsPage';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const { toastMessage, t } = useEdzen();

  const renderActivePage = () => {
    switch (currentTab) {
      case 'home':
        return <FrontLandingPage onNavigate={setCurrentTab} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentTab} />;
      case 'planner':
        return <PlannerPage />;
      case 'examRescue':
        return <ExamRescuePage />;
      case 'skillTree':
        return <SkillTreePage />;
      case 'focus':
        return <QuestsFocusPage />;
      case 'answerBattle':
        return <AnswerBattlePage />;
      case 'studyTogether':
        return <StudyTogetherPage />;
      case 'goalsHabits':
        return <GoalsHabitsPage />;
      case 'wellness':
        return <WellnessCompanionPage />;
      case 'routines':
        return <StudentRoutinesPage />;
      case 'petShop':
        return <PetWardrobeShopPage />;
      case 'profile':
        return <ProfileCredentialsPage />;
      default:
        return <FrontLandingPage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white selection:bg-purple-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Background ambient lighting orbs - Deep Purple & Indigo Refraction */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed bottom-10 right-1/4 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-purple-500/50 shadow-[0_8px_30px_0_rgba(0,0,0,0.6)] text-[11px] font-bold text-white flex items-center gap-1.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header onNavigate={setCurrentTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-4 pb-20">
        
        {/* Navigation Dock */}
        <div className="mb-6">
          <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />
        </div>

        {/* Dynamic Page Router */}
        {renderActivePage()}
      </main>

      {/* Global Interactive Roaming Pet Companion */}
      <RoamingPet />

      {/* Footer */}
      <footer className="w-full backdrop-blur-xl bg-slate-950/60 border-t border-purple-500/20 py-4 px-4 text-center text-xs text-slate-400 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white"><span className="text-purple-400">ED</span>ZEN</span>
            <span>—</span>
            <span className="italic text-slate-400">{t('sustainableProgress')}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Hackathon MVP • LocalStorage Persisted • Zero External Backend Dependency
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <EdzenProvider>
      <MainAppContent />
    </EdzenProvider>
  );
}

export default App;
