import { CheckSquare, Flame, Target, FolderKanban, TrendingUp, Zap } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colorMap, getLevelInfo } from '../utils/helpers';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');

  const pendingTasks = state.tasks.filter((t) => !t.completed);
  const todayHabits = state.habits;
  const completedHabitsToday = todayHabits.filter((h) =>
    h.completions.includes(today)
  ).length;
  const activeGoals = state.goals.filter((g) => g.status === 'active');
  const activeProjects = state.projects.filter((p) => p.status === 'active');
  const { level, progress } = getLevelInfo(state.profile.points);

  const topHabits = state.habits.slice(0, 5);
  const urgentTasks = state.tasks
    .filter((t) => !t.completed)
    .slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Buenos días, {state.profile.name} {state.profile.avatar}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'battle' })}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-xl text-sm font-medium transition-all"
          >
            <Zap size={14} />
            Modo Batalla
          </button>
        </div>

        {/* Motto */}
        <div className="mt-4 p-4 bg-[#111118] border border-[#1a1a24] rounded-xl">
          <p className="text-slate-400 text-sm italic">"{state.profile.motto}"</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<CheckSquare size={18} className="text-blue-400" />}
          label="Pendientes"
          value={pendingTasks.length}
          sub="tareas activas"
          color="blue"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'tasks' })}
        />
        <StatCard
          icon={<Flame size={18} className="text-orange-400" />}
          label="Hábitos hoy"
          value={`${completedHabitsToday}/${todayHabits.length}`}
          sub="completados"
          color="orange"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'habits' })}
        />
        <StatCard
          icon={<Target size={18} className="text-violet-400" />}
          label="Metas activas"
          value={activeGoals.length}
          sub="en progreso"
          color="violet"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'goals' })}
        />
        <StatCard
          icon={<FolderKanban size={18} className="text-cyan-400" />}
          label="Proyectos"
          value={activeProjects.length}
          sub="activos"
          color="cyan"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'projects' })}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Tasks + Habits */}
        <div className="lg:col-span-2 space-y-4">
          {/* Today's Habits */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Flame size={14} className="text-orange-400" />
                Hábitos de hoy
              </h2>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'habits' })}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Ver todos →
              </button>
            </div>
            {topHabits.length === 0 ? (
              <EmptyState
                label="Sin hábitos registrados"
                action="Agregar hábito"
                onAction={() => dispatch({ type: 'SET_VIEW', payload: 'habits' })}
              />
            ) : (
              <div className="space-y-2">
                {topHabits.map((habit) => {
                  const done = habit.completions.includes(today);
                  const c = colorMap[habit.color];
                  return (
                    <button
                      key={habit.id}
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_HABIT',
                          payload: { id: habit.id, date: today },
                        })
                      }
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        done
                          ? `${c.light} ${c.border} border opacity-70`
                          : 'bg-[#1a1a24] border-[#2c2c3e] hover:border-[#3d3d54]'
                      }`}
                    >
                      <span className="text-xl">{habit.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${done ? c.text : 'text-slate-300'} ${done ? 'line-through opacity-70' : ''}`}>
                          {habit.name}
                        </p>
                        <p className="text-xs text-slate-600">{habit.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {habit.streak > 0 && (
                          <span className="text-xs text-orange-400 flex items-center gap-0.5">
                            🔥 {habit.streak}
                          </span>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          done ? `${c.bg} border-transparent` : 'border-[#3d3d54]'
                        }`}>
                          {done && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <CheckSquare size={14} className="text-blue-400" />
                Pendientes urgentes
              </h2>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'tasks' })}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Ver todos →
              </button>
            </div>
            {urgentTasks.length === 0 ? (
              <EmptyState
                label="Sin tareas pendientes"
                action="Agregar tarea"
                onAction={() => dispatch({ type: 'SET_VIEW', payload: 'tasks' })}
              />
            ) : (
              <div className="space-y-2">
                {urgentTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() =>
                      dispatch({ type: 'TOGGLE_TASK', payload: task.id })
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1a1a24] hover:bg-[#22222f] border border-[#2c2c3e] hover:border-[#3d3d54] transition-all text-left"
                  >
                    <div className="w-4 h-4 rounded border border-[#3d3d54] flex items-center justify-center shrink-0" />
                    <span className="text-sm text-slate-300">{task.title}</span>
                    <span
                      className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                        task.priority === 'high'
                          ? 'text-red-400 bg-red-500/10'
                          : task.priority === 'medium'
                          ? 'text-yellow-400 bg-yellow-500/10'
                          : 'text-slate-500 bg-slate-500/10'
                      }`}
                    >
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Goals + Level */}
        <div className="space-y-4">
          {/* Level & XP */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-slate-300">Tu Progreso</h2>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-2xl">
                {state.profile.avatar}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-100">Nivel {level}</p>
                <p className="text-xs text-slate-500">{state.profile.points} XP total</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progreso al nivel {level + 1}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Goals */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Target size={14} className="text-violet-400" />
                Metas activas
              </h2>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'goals' })}
                className="text-xs text-slate-600 hover:text-slate-400"
              >
                Ver todas →
              </button>
            </div>
            {activeGoals.length === 0 ? (
              <EmptyState
                label="Sin metas activas"
                action="Crear meta"
                onAction={() => dispatch({ type: 'SET_VIEW', payload: 'goals' })}
              />
            ) : (
              <div className="space-y-3">
                {activeGoals.slice(0, 4).map((goal) => {
                  const area = state.lifeAreas.find((a) => a.id === goal.areaId);
                  const c = area ? colorMap[area.color] : colorMap.violet;
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-300 leading-tight">{goal.title}</p>
                        <span className="text-xs text-slate-500 shrink-0">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bg} rounded-full transition-all`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Life Areas Quick */}
          <div className="card">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <span>🌐</span> Áreas de Vida
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {state.lifeAreas.map((area) => {
                const c = colorMap[area.color];
                return (
                  <button
                    key={area.id}
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'areas' })}
                    className={`p-2 rounded-lg ${c.light} border border-transparent hover:${c.border} transition-all text-left`}
                  >
                    <span className="text-lg">{area.icon}</span>
                    <p className={`text-xs font-medium ${c.text} mt-1 truncate`}>{area.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card hover:border-[#2c2c3e] transition-all text-left w-full group"
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors">→</span>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      <p className="text-xs text-slate-600 mt-1">{label}</p>
    </button>
  );
}

function EmptyState({
  label,
  action,
  onAction,
}: {
  label: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-slate-600 mb-2">{label}</p>
      <button onClick={onAction} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
        + {action}
      </button>
    </div>
  );
}
