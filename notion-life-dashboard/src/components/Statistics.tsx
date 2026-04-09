import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../store/AppContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { getLevelInfo, colorMap } from '../utils/helpers';
import { TrendingUp, Target, Flame, CheckSquare, Award } from 'lucide-react';

const CHART_COLORS = ['#7c3aed', '#2563eb', '#0891b2', '#16a34a', '#ca8a04', '#dc2626', '#ea580c', '#db2777'];

export default function Statistics() {
  const { state } = useApp();
  const { level, progress } = getLevelInfo(state.profile.points);

  // Task completion last 7 days
  const last7 = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
  const taskData = last7.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const completed = state.tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt.startsWith(dateStr)
    ).length;
    return {
      day: format(day, 'EEE', { locale: es }),
      completadas: completed,
    };
  });

  // Habit consistency last 7 days
  const habitData = last7.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const total = state.habits.length;
    const done = state.habits.filter((h) => h.completions.includes(dateStr)).length;
    return {
      day: format(day, 'EEE', { locale: es }),
      porcentaje: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });

  // Goals by area (pie)
  const goalsByArea = state.lifeAreas.map((area) => ({
    name: area.name,
    value: state.goals.filter((g) => g.areaId === area.id).length,
    color: area.color,
  })).filter((a) => a.value > 0);

  // Streak champions
  const habitsByStreak = [...state.habits].sort((a, b) => b.streak - a.streak).slice(0, 5);

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const activeGoals = state.goals.filter((g) => g.status === 'active').length;
  const maxStreak = state.habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const totalHabitDays = state.habits.reduce((sum, h) => sum + h.completions.length, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-100">Estadísticas</h1>
        <p className="text-sm text-slate-500 mt-0.5">Los números no mienten — esto es lo que muestran los datos</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Award size={18} className="text-violet-400" />} label="Nivel" value={level} sub={`${Math.round(progress)}% al siguiente`} />
        <KpiCard icon={<CheckSquare size={18} className="text-blue-400" />} label="Tareas completadas" value={completedTasks} sub={`de ${totalTasks} totales`} />
        <KpiCard icon={<Target size={18} className="text-green-400" />} label="Metas activas" value={activeGoals} sub="en progreso" />
        <KpiCard icon={<Flame size={18} className="text-orange-400" />} label="Racha máxima" value={maxStreak} sub="días consecutivos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Task completion chart */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <CheckSquare size={14} className="text-blue-400" />
            Tareas completadas (últimos 7 días)
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={taskData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a24', border: '1px solid #2c2c3e', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#7c3aed' }}
              />
              <Bar dataKey="completadas" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Habit consistency */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Flame size={14} className="text-orange-400" />
            Consistencia de hábitos (%)
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={habitData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a24', border: '1px solid #2c2c3e', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#ea580c' }}
                formatter={(v) => [`${v}%`, 'Completados']}
              />
              <Line
                type="monotone"
                dataKey="porcentaje"
                stroke="#ea580c"
                strokeWidth={2}
                dot={{ fill: '#ea580c', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Goals by area pie */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Target size={14} className="text-violet-400" />
            Metas por área de vida
          </h2>
          {goalsByArea.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-8">Sin metas registradas</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={goalsByArea} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                    {goalsByArea.map((_entry, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {goalsByArea.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-slate-400 truncate">{item.name}</span>
                    <span className="ml-auto text-slate-500 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Habit streaks */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-green-400" />
            Hábitos con mejor racha
          </h2>
          {habitsByStreak.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-8">Sin hábitos registrados</p>
          ) : (
            <div className="space-y-3">
              {habitsByStreak.map((habit) => {
                const c = colorMap[habit.color];
                const maxStreak = Math.max(...state.habits.map((h) => h.longestStreak), 1);
                return (
                  <div key={habit.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{habit.icon}</span>
                      <span className="text-xs text-slate-300 flex-1 truncate">{habit.name}</span>
                      <span className="text-xs font-bold text-slate-400">{habit.streak}d</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${c.bg} rounded-full transition-all`}
                        style={{ width: `${maxStreak > 0 ? (habit.streak / maxStreak) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="card mt-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Resumen general</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryItem label="Total XP ganados" value={state.profile.points} />
          <SummaryItem label="Días con hábitos" value={totalHabitDays} />
          <SummaryItem label="Proyectos activos" value={state.projects.filter(p => p.status === 'active').length} />
          <SummaryItem label="Ítems en tiendita" value={state.shopItems.length} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-slate-500">{label}</span></div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-slate-200">{value}</p>
      <p className="text-xs text-slate-600 mt-0.5">{label}</p>
    </div>
  );
}
