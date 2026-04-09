import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Goal, Priority, Status } from '../types';
import { colorMap, nanoid, priorityColors, priorityLabels, statusColors, statusLabels } from '../utils/helpers';

function GoalForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Goal>;
  onSave: (data: Omit<Goal, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const { state } = useApp();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [areaId, setAreaId] = useState(initial?.areaId ?? state.lifeAreas[0]?.id ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [status, setStatus] = useState<Status>(initial?.status ?? 'active');
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [deadline, setDeadline] = useState(initial?.deadline ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, areaId, priority, status, progress, deadline });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Título de la meta *</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Correr 5km sin parar" autoFocus />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
        <textarea className="input resize-none" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Por qué es importante esta meta?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Área de Vida</label>
          <select className="input" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            {state.lifeAreas.map((a) => (
              <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
            ))}
            <option value="">Sin área</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Prioridad</label>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Estado</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="active">Activo</option>
            <option value="paused">Pausado</option>
            <option value="completed">Completado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Fecha límite</label>
          <input type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Progreso: {progress}%</label>
        <input type="range" min={0} max={100} className="w-full accent-violet-500" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex items-center gap-1"><Check size={14} /> Guardar</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  );
}

export default function Goals() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAdd = (data: Omit<Goal, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_GOAL', payload: { ...data, id: nanoid(), createdAt: new Date().toISOString() } });
    setShowForm(false);
  };

  const handleEdit = (id: string, data: Omit<Goal, 'id' | 'createdAt'>) => {
    dispatch({ type: 'UPDATE_GOAL', payload: { id, data } });
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta meta?')) dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const filtered = state.goals.filter((g) => filterStatus === 'all' || g.status === filterStatus);

  return (
    <div className="p-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Metas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Objetivos concretos con fecha y progreso medible</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Nueva Meta
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'active', 'paused', 'completed', 'archived'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-violet-600 text-white' : 'bg-[#1a1a24] text-slate-500 hover:text-slate-300'}`}
          >
            {s === 'all' ? 'Todas' : statusLabels[s]}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card mb-4 animate-[slideUp_0.2s_ease]">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Nueva Meta</h2>
          <GoalForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((goal) => {
          const area = state.lifeAreas.find((a) => a.id === goal.areaId);
          const c = area ? colorMap[area.color] : colorMap.violet;
          const isEditing = editId === goal.id;
          const isExpanded = expanded === goal.id;
          const linkedProjects = state.projects.filter((p) => p.goalId === goal.id);

          return (
            <div key={goal.id} className="card animate-[fadeIn_0.2s_ease]">
              {isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-300">Editar Meta</h3>
                    <button onClick={() => setEditId(null)}><X size={14} className="text-slate-600" /></button>
                  </div>
                  <GoalForm initial={goal} onSave={(data) => handleEdit(goal.id, data)} onCancel={() => setEditId(null)} />
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${c.bg} mt-2 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-200">{goal.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => setEditId(goal.id)} className="p-1.5 hover:bg-[#2c2c3e] rounded-lg transition-colors">
                            <Pencil size={11} className="text-slate-600" />
                          </button>
                          <button onClick={() => handleDelete(goal.id)} className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 size={11} className="text-slate-600 hover:text-red-400" />
                          </button>
                          <button onClick={() => setExpanded(isExpanded ? null : goal.id)} className="p-1.5 hover:bg-[#2c2c3e] rounded-lg transition-colors">
                            {isExpanded ? <ChevronUp size={11} className="text-slate-600" /> : <ChevronDown size={11} className="text-slate-600" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {area && (
                          <span className={`badge ${c.light} ${c.text}`}>{area.icon} {area.name}</span>
                        )}
                        <span className={`badge border ${priorityColors[goal.priority]}`}>{priorityLabels[goal.priority]}</span>
                        <span className={`badge ${statusColors[goal.status]}`}>{statusLabels[goal.status]}</span>
                        {goal.deadline && (
                          <span className="text-xs text-slate-600">📅 {new Date(goal.deadline).toLocaleDateString('es-ES')}</span>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                          <div className={`h-full ${c.bg} rounded-full transition-all duration-500`} style={{ width: `${goal.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{goal.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#1a1a24] animate-[slideUp_0.2s_ease]">
                      {goal.description && (
                        <p className="text-xs text-slate-500 mb-3">{goal.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-500 font-medium">Proyectos vinculados ({linkedProjects.length})</p>
                        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'projects' })} className="text-xs text-violet-400 hover:text-violet-300">
                          + Agregar proyecto
                        </button>
                      </div>
                      {linkedProjects.length === 0 ? (
                        <p className="text-xs text-slate-700">Sin proyectos vinculados aún</p>
                      ) : (
                        <div className="space-y-1">
                          {linkedProjects.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 text-xs text-slate-400">
                              <Target size={10} className="text-slate-600" />
                              {p.title}
                              <span className="ml-auto text-slate-600">{p.progress}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🎯</p>
          <h3 className="text-slate-400 font-medium mb-1">Sin metas {filterStatus !== 'all' ? statusLabels[filterStatus as Status]?.toLowerCase() + 's' : ''}</h3>
          <p className="text-sm text-slate-600 mb-4">Las metas sin plan son solo deseos</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Crear primera meta</button>
        </div>
      )}
    </div>
  );
}
