import { useState } from 'react';
import { Plus, Trash2, Flame, Check, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Habit, AreaColor } from '../types';
import { colorMap, nanoid } from '../utils/helpers';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

const HABIT_ICONS = ['💪', '📖', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🎯', '🎨', '🧹', '💊'];
const COLORS: AreaColor[] = ['violet', 'blue', 'cyan', 'green', 'yellow', 'red', 'orange', 'pink'];

function HabitForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'longestStreak' | 'completions'>) => void;
  onCancel: () => void;
}) {
  const { state } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState(state.lifeAreas[0]?.id ?? '');
  const [icon, setIcon] = useState('💪');
  const [color, setColor] = useState<AreaColor>('green');
  const [frequency] = useState<'daily'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description, areaId, icon, color, frequency, targetDays: [0, 1, 2, 3, 4, 5, 6] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Nombre *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Meditación" autoFocus />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Área</label>
          <select className="input" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            {state.lifeAreas.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            <option value="">Sin área</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Cuánto tiempo / cuántas veces?" />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Ícono</label>
        <div className="flex flex-wrap gap-1.5">
          {HABIT_ICONS.map((i) => (
            <button type="button" key={i} onClick={() => setIcon(i)}
              className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${icon === i ? 'bg-violet-600/30 ring-1 ring-violet-500' : 'hover:bg-[#2c2c3e]'}`}>
              {i}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Color</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button type="button" key={c} onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full ${colorMap[c].bg} transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-[#111118] ring-white' : 'opacity-60 hover:opacity-100'}`} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex items-center gap-1"><Check size={14} /> Guardar</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  );
}

function HabitHeatmap({ completions, color }: { completions: string[]; color: AreaColor }) {
  const c = colorMap[color];
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 27), end: today });

  return (
    <div className="flex gap-0.5 flex-wrap">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const done = completions.includes(dateStr);
        return (
          <div
            key={dateStr}
            title={format(day, "d 'de' MMMM", { locale: es })}
            className={`w-3 h-3 rounded-sm transition-all habit-grid-cell ${done ? c.bg : 'bg-[#1a1a24]'}`}
          />
        );
      })}
    </div>
  );
}

export default function Habits() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAdd = (data: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'longestStreak' | 'completions'>) => {
    dispatch({
      type: 'ADD_HABIT',
      payload: {
        ...data,
        id: nanoid(),
        streak: 0,
        longestStreak: 0,
        completions: [],
        createdAt: new Date().toISOString(),
      },
    });
    setShowForm(false);
  };

  const completedToday = state.habits.filter((h) => h.completions.includes(today)).length;
  const totalHabits = state.habits.length;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Hábitos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {completedToday}/{totalHabits} completados hoy · La consistencia genera resultados
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Nuevo Hábito
        </button>
      </div>

      {/* Today progress */}
      {totalHabits > 0 && (
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Progreso de hoy</p>
            <p className="text-sm text-slate-500">{completedToday}/{totalHabits}</p>
          </div>
          <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: totalHabits ? `${(completedToday / totalHabits) * 100}%` : '0%' }}
            />
          </div>
          {completedToday === totalHabits && totalHabits > 0 && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">🎉 ¡Todos los hábitos completados! +{totalHabits * 5} XP</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="card mb-4 animate-[slideUp_0.2s_ease]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">Nuevo Hábito</h2>
            <button onClick={() => setShowForm(false)}><X size={14} className="text-slate-600" /></button>
          </div>
          <HabitForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-3">
        {state.habits.map((habit) => {
          const c = colorMap[habit.color];
          const done = habit.completions.includes(today);

          return (
            <div key={habit.id} className={`card transition-all ${done ? 'opacity-80' : ''}`}>
              <div className="flex items-start gap-3 mb-3">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_HABIT', payload: { id: habit.id, date: today } })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all shrink-0 ${
                    done ? `${c.bg} scale-95` : 'bg-[#1a1a24] hover:bg-[#22222f]'
                  }`}
                >
                  {habit.icon}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-semibold ${done ? c.text : 'text-slate-200'}`}>
                        {habit.name} {done && '✓'}
                      </h3>
                      {habit.description && (
                        <p className="text-xs text-slate-600">{habit.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                          <Flame size={10} className="text-orange-400" />
                          <span className="text-xs text-orange-400 font-bold">{habit.streak}</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar este hábito?')) dispatch({ type: 'DELETE_HABIT', payload: habit.id });
                        }}
                        className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={11} className="text-slate-700 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heatmap 28 days */}
              <div>
                <p className="text-xs text-slate-600 mb-1.5">Últimos 28 días</p>
                <HabitHeatmap completions={habit.completions} color={habit.color} />
              </div>

              <div className="flex gap-4 mt-2.5 pt-2.5 border-t border-[#1a1a24]">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">{habit.streak}</p>
                  <p className="text-xs text-slate-600">Racha actual</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">{habit.longestStreak}</p>
                  <p className="text-xs text-slate-600">Mejor racha</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">{habit.completions.length}</p>
                  <p className="text-xs text-slate-600">Total días</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {state.habits.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔥</p>
          <h3 className="text-slate-400 font-medium mb-1">Sin hábitos registrados</h3>
          <p className="text-sm text-slate-600 mb-4">Los hábitos pequeños generan resultados grandes con el tiempo</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Crear primer hábito</button>
        </div>
      )}
    </div>
  );
}
