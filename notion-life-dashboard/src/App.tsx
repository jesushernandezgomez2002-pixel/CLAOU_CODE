import { useState } from 'react';
import { Settings } from 'lucide-react';
import { AppProvider, useApp } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LifeAreas from './components/LifeAreas';
import Goals from './components/Goals';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Habits from './components/Habits';
import Statistics from './components/Statistics';
import BattleMode from './components/BattleMode';
import Tiendita from './components/Tiendita';
import DangerZone from './components/DangerZone';
import ProfileModal from './components/ProfileModal';

function AppContent() {
  const { state } = useApp();
  const [showProfile, setShowProfile] = useState(false);

  const view = state.activeView;

  // Battle mode is full-screen
  if (view === 'battle') {
    return (
      <div className="flex-1 flex">
        <BattleMode />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-sm border-b border-[#1a1a24] px-6 py-3 flex items-center justify-end">
          <button
            onClick={() => setShowProfile(true)}
            className="p-2 hover:bg-[#1a1a24] rounded-xl transition-colors"
            title="Editar perfil"
          >
            <Settings size={16} className="text-slate-600 hover:text-slate-400" />
          </button>
        </div>

        {/* Views */}
        {view === 'dashboard' && <Dashboard />}
        {view === 'areas' && <LifeAreas />}
        {view === 'goals' && <Goals />}
        {view === 'projects' && <Projects />}
        {view === 'tasks' && <Tasks />}
        {view === 'habits' && <Habits />}
        {view === 'stats' && <Statistics />}
        {view === 'shop' && <Tiendita />}
        {view === 'danger' && <DangerZone />}
      </main>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
