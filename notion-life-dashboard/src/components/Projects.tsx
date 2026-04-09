import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Project, Priority, Status } from '../types';
import { colorMap, nanoid, priorityColors, priorityLabels, statusColors, statusLabels } from '../utils/helpers';

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Project>;
  onSave: (data: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const { state } = useApp();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [goalId, setGoalId] = useState(initial?.goalId ?? '');
  const [areaId, setAreaId] = useState(initial?.areaId ?? state.lifeAreas[0]?.id ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [status, setStatus] = useState<Status>(initial?.status ?? 'active');
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [deadline, setDeadline] = useState(initial?.deadline ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, goalId, areaId, priority, status, progress, deadline });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Título del proyecto *</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Rutina matutina 30 días" autoFocus />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
        <textarea className="input resize-none" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Qué implica este proyecto?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Meta vinculada</label>
          <select className="input" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
            <option value="">Sin meta</option>
            {state.goals.map((g) => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>
        </div>
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

export default function Projects() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAdd = (data: Omit<Project, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: { ...data, id: nanoid(), createdAt: new Date().toISOString() } });
    setShowForm(false);
  };

  const handleEdit = (id: string, data: Omit<Project, 'id' | 'createdAt'>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, data } });
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este proyecto?')) dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  const filtered = state.projects.filter((p) => filterStatus === 'all' || p.status === filterStatus);

  return (
    <div className="p-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Proyectos</h1>
          <p className="text-sm text-slate-500 mt-0.5">Planes concretos que llevan tus metas a la acción</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Nuevo Proyecto
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'active', 'paused', 'completed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-violet-600 text-white' : 'bg-[#1a1a24] text-slate-500 hover:text-slate-300'}`}
          >
            {s === 'all' ? 'Todos' : statusLabels[s]}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card mb-4 animate-[slideUp_0.2s_ease]">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Nuevo Proyecto</h2>
          <ProjectForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((project) => {
          const area = state.lifeAreas.find((a) => a.id === project.areaId);
          const goal = state.goals.find((g) => g.id === project.goalId);
          const c = area ? colorMap[area.color] : colorMap.blue;
          const isEditing = editId === project.id;
          const tasks = state.tasks.filter((t) => t.projectId === project.id);
          const completedTasks = tasks.filter((t) => t.completed).length;

          return (
            <div key={project.id} className="card">
              {isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-300">Editar Proyecto</h3>
                    <button onClick={() => setEditId(null)}><X size={14} className="text-slate-600" /></button>
                  </div>
                  <ProjectForm initial={project} onSave={(data) => handleEdit(project.id, data)} onCancel={() => setEditId(null)} />
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <div className={`w-1 self-stretch rounded-full ${c.bg} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-200">{project.title}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setEditId(project.id)} className="p-1.5 hover:bg-[#2c2c3e] rounded-lg transition-colors">
                          <Pencil size={11} className="text-slate-600" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={11} className="text-slate-600 hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-xs text-slate-600 mt-0.5">{project.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {area && <span className={`badge ${c.light} ${c.text}`}>{area.icon} {area.name}</span>}
                      {goal && <span className="badge bg-violet-500/10 text-violet-400">🎯 {goal.title}</span>}
                      <span className={`badge border ${priorityColors[project.priority]}`}>{priorityLabels[project.priority]}</span>
                      <span className={`badge ${statusColors[project.status]}`}>{statusLabels[project.status]}</span>
                      {project.deadline && (
                        <span className="text-xs text-slate-600">📅 {new Date(project.deadline).toLocaleDateString('es-ES')}</span>
                      )}
                    </div>

                    <div className="mt-2.5 space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Progreso</span>
                        <span>{project.progress}% · {completedTasks}/{tasks.length} tareas</span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                        <div className={`h-full ${c.bg} rounded-full transition-all`} style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📁</p>
          <h3 className="text-slate-400 font-medium mb-1">Sin proyectos</h3>
          <p className="text-sm text-slate-600 mb-4">Un proyecto convierte una meta vaga en un plan ejecutable</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Crear primer proyecto</button>
        </div>
      )}
    </div>
  );
}
