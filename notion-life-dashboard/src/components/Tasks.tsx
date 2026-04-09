import { useState } from 'react';
import { Plus, Trash2, Check, CheckSquare } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Task, Priority } from '../types';
import { nanoid, priorityColors, priorityLabels } from '../utils/helpers';
import { format } from 'date-fns';

function TaskForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
  onCancel: () => void;
}) {
  const { state } = useApp();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [goalId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      projectId: projectId || null,
      goalId: goalId || null,
      areaId: areaId || null,
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Qué tienes que hacer?" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">Sin proyecto</option>
          {state.projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="high">Alta prioridad</option>
          <option value="medium">Media prioridad</option>
          <option value="low">Baja prioridad</option>
        </select>
        <select className="input" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          <option value="">Sin área</option>
          {state.lifeAreas.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
        </select>
        <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex items-center gap-1"><Check size={14} /> Agregar</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  );
}

export default function Tasks() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAdd = (data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        ...data,
        id: nanoid(),
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
      },
    });
    setShowForm(false);
  };

  const filtered = state.tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pending = state.tasks.filter((t) => !t.completed).length;
  const completedToday = state.tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(today)
  ).length;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Pendientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{pending} pendientes · {completedToday} completadas hoy</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Nueva Tarea
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 animate-[slideUp_0.2s_ease]">
          <TaskForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['pending', 'all', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-violet-600 text-white' : 'bg-[#1a1a24] text-slate-500 hover:text-slate-300'}`}
          >
            {f === 'pending' ? 'Pendientes' : f === 'all' ? 'Todas' : 'Completadas'}
          </button>
        ))}
      </div>

      {/* Quick add inline */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-3 rounded-xl border border-dashed border-[#2c2c3e] hover:border-violet-500/40 text-slate-600 hover:text-slate-400 text-sm text-left transition-all mb-4 flex items-center gap-2"
        >
          <Plus size={14} />
          Agregar tarea rápida...
        </button>
      )}

      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <CheckSquare size={40} className="text-slate-700 mx-auto mb-3" />
            <h3 className="text-slate-400 font-medium mb-1">
              {filter === 'pending' ? '¡Sin pendientes!' : 'Sin tareas'}
            </h3>
            <p className="text-sm text-slate-600">
              {filter === 'pending' ? 'Excelente trabajo. Agrega nuevas tareas cuando las necesites.' : 'Las tareas que crees aparecerán aquí.'}
            </p>
          </div>
        ) : (
          filtered.map((task) => {
            const area = state.lifeAreas.find((a) => a.id === task.areaId);
            const project = state.projects.find((p) => p.id === task.projectId);
            const isOverdue = task.dueDate && task.dueDate < today && !task.completed;

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all group ${
                  task.completed
                    ? 'bg-[#0d0d14] border-[#111118] opacity-50'
                    : 'bg-[#111118] border-[#1a1a24] hover:border-[#2c2c3e]'
                }`}
              >
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    task.completed
                      ? 'bg-violet-600 border-violet-600'
                      : 'border-[#3d3d54] hover:border-violet-500'
                  }`}
                >
                  {task.completed && <Check size={11} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {area && (
                      <span className="text-xs text-slate-600">{area.icon} {area.name}</span>
                    )}
                    {project && (
                      <span className="text-xs text-slate-600">· {project.title}</span>
                    )}
                    {task.dueDate && (
                      <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-slate-600'}`}>
                        {isOverdue ? '⚠️' : '📅'} {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className={`badge border text-xs ${priorityColors[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                    className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={11} className="text-slate-600 hover:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
