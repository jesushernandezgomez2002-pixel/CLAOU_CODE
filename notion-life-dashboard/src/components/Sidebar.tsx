import {
  LayoutDashboard,
  Target,
  FolderKanban,
  CheckSquare,
  Flame,
  BarChart3,
  Swords,
  ShoppingBag,
  AlertTriangle,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { AppState } from '../types';
import { getLevelInfo } from '../utils/helpers';

const navItems: {
  id: AppState['activeView'];
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  special?: boolean;
}[] = [
  { id: 'dashboard', label: 'Panel Central', icon: <LayoutDashboard size={16} /> },
  { id: 'areas', label: 'Áreas de Vida', icon: <Globe2 size={16} /> },
  { id: 'goals', label: 'Metas', icon: <Target size={16} /> },
  { id: 'projects', label: 'Proyectos', icon: <FolderKanban size={16} /> },
  { id: 'tasks', label: 'Pendientes', icon: <CheckSquare size={16} /> },
  { id: 'habits', label: 'Hábitos', icon: <Flame size={16} /> },
  { id: 'stats', label: 'Estadísticas', icon: <BarChart3 size={16} /> },
  { id: 'battle', label: 'Modo Batalla', icon: <Swords size={16} />, special: true },
  { id: 'shop', label: 'La Tiendita', icon: <ShoppingBag size={16} /> },
  { id: 'danger', label: 'Zona Peligrosa', icon: <AlertTriangle size={16} />, danger: true },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { level, progress } = getLevelInfo(state.profile.points);

  return (
    <aside className="w-56 shrink-0 bg-[#0d0d14] border-r border-[#1a1a24] flex flex-col h-screen sticky top-0">
      {/* Profile */}
      <div className="p-4 border-b border-[#1a1a24]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-lg">
            {state.profile.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{state.profile.name}</p>
            <p className="text-xs text-slate-500">Nivel {level}</p>
          </div>
        </div>
        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>{state.profile.points} XP</span>
            <span>Nivel {level + 1}</span>
          </div>
          <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = state.activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 group ${
                active
                  ? item.danger
                    ? 'bg-red-900/30 text-red-400'
                    : item.special
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'bg-[#1a1a24] text-slate-200'
                  : item.danger
                  ? 'text-red-500/60 hover:bg-red-900/20 hover:text-red-400'
                  : item.special
                  ? 'text-violet-400/70 hover:bg-violet-600/10 hover:text-violet-300'
                  : 'text-slate-500 hover:bg-[#1a1a24] hover:text-slate-300'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {active && (
                <ChevronRight size={12} className="opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1a1a24]">
        <div className="text-xs text-slate-600 text-center">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      </div>
    </aside>
  );
}
