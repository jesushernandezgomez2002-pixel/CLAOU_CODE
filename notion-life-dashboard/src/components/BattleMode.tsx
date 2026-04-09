import { useState } from 'react';
import { X, Swords, Check, Flame, Pencil } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { format } from 'date-fns';
import { colorMap } from '../utils/helpers';

export default function BattleMode() {
  const { state, dispatch } = useApp();
  const [editingMotto, setEditingMotto] = useState(false);
  const [motto, setMotto] = useState(state.profile.motto);
  const today = format(new Date(), 'yyyy-MM-dd');

  const pendingTasks = state.tasks.filter((t) => !t.completed && t.priority === 'high').slice(0, 5);
  const todayHabits = state.habits.slice(0, 6);
  const completedHabitsToday = todayHabits.filter((h) => h.completions.includes(today)).length;

  const handleSaveMotto = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { motto } });
    setEditingMotto(false);
  };

  return (
    <div className="flex-1 bg-[#0a0a0f] flex flex-col items-center justify-center p-8 animate-[fadeIn_0.3s_ease] relative min-h-screen">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      {/* Exit button */}
      <button
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
        className="absolute top-4 right-4 p-2 hover:bg-[#1a1a24] rounded-xl transition-colors text-slate-600 hover:text-slate-400"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Swords size={20} className="text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Modo Batalla</span>
          <Swords size={20} className="text-violet-400" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-100 mb-1">
          {state.profile.avatar} {state.profile.name}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-3">
          {editingMotto ? (
            <div className="flex items-center gap-2">
              <input
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="input text-center text-lg italic text-violet-300 bg-transparent border-b border-violet-500 rounded-none px-2"
                autoFocus
              />
              <button onClick={handleSaveMotto} className="p-1 text-violet-400 hover:text-violet-300">
                <Check size={16} />
              </button>
              <button onClick={() => setEditingMotto(false)} className="p-1 text-slate-600 hover:text-slate-400">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <p className="text-lg text-slate-400 italic max-w-xl text-center">"{state.profile.motto}"</p>
              <button
                onClick={() => setEditingMotto(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil size={12} className="text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Habit quick-check */}
      <div className="w-full max-w-xl mb-8 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-500 font-medium">Hábitos de hoy</p>
          <p className="text-sm font-bold text-slate-300">{completedHabitsToday}/{todayHabits.length}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {todayHabits.map((habit) => {
            const done = habit.completions.includes(today);
            const c = colorMap[habit.color];
            return (
              <button
                key={habit.id}
                onClick={() => dispatch({ type: 'TOGGLE_HABIT', payload: { id: habit.id, date: today } })}
                className={`p-3 rounded-xl border transition-all text-center ${
                  done
                    ? `${c.light} border-current ${c.text}`
                    : 'bg-[#111118] border-[#1a1a24] hover:border-[#2c2c3e]'
                }`}
              >
                <p className="text-2xl mb-1">{habit.icon}</p>
                <p className={`text-xs font-medium truncate ${done ? c.text : 'text-slate-500'}`}>{habit.name}</p>
                {habit.streak > 0 && (
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    <Flame size={9} className="text-orange-400" />
                    <span className="text-xs text-orange-400">{habit.streak}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* High priority tasks */}
      {pendingTasks.length > 0 && (
        <div className="w-full max-w-xl relative z-10">
          <p className="text-sm text-slate-500 font-medium mb-3">Misiones críticas</p>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                className="w-full flex items-center gap-3 p-3 bg-red-900/10 hover:bg-red-900/20 border border-red-900/30 hover:border-red-700/50 rounded-xl transition-all text-left"
              >
                <div className="w-5 h-5 rounded-md border-2 border-red-600/50 flex items-center justify-center shrink-0" />
                <span className="text-sm text-slate-300">{task.title}</span>
                <span className="ml-auto text-xs text-red-400 shrink-0">URGENTE</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* XP display */}
      <div className="mt-8 flex items-center gap-3 relative z-10">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-600/50" />
        <p className="text-xs text-slate-600 font-mono">{state.profile.points} XP · Nivel {Math.floor(state.profile.points / 100) + 1}</p>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-600/50" />
      </div>
    </div>
  );
}
