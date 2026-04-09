import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { LifeArea, AreaColor } from '../types';
import { colorMap, nanoid } from '../utils/helpers';

const AREA_COLORS: AreaColor[] = [
  'violet', 'blue', 'cyan', 'green', 'yellow', 'red', 'orange', 'pink',
];

const AREA_ICONS = ['🏃', '💼', '📚', '❤️', '🎨', '💰', '🧘', '🏡', '✈️', '🎯', '💡', '🎵'];

function AreaForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<LifeArea>;
  onSave: (data: Omit<LifeArea, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? '🎯');
  const [color, setColor] = useState<AreaColor>(initial?.color ?? 'violet');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priority, setPriority] = useState(initial?.priority ?? 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, color, description, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Nombre</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Salud & Energía"
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Prioridad (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            className="input"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Qué representa esta área?"
        />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Ícono</label>
        <div className="flex flex-wrap gap-2">
          {AREA_ICONS.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIcon(i)}
              className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                icon === i ? 'bg-violet-600/30 ring-1 ring-violet-500' : 'hover:bg-[#2c2c3e]'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Color</label>
        <div className="flex gap-2">
          {AREA_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full ${colorMap[c].bg} transition-all ${
                color === c ? 'ring-2 ring-offset-2 ring-offset-[#111118] ring-white' : 'opacity-60 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex items-center gap-1">
          <Check size={14} /> Guardar
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function LifeAreas() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleAdd = (data: Omit<LifeArea, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_AREA',
      payload: { ...data, id: nanoid(), createdAt: new Date().toISOString() },
    });
    setShowForm(false);
  };

  const handleEdit = (id: string, data: Omit<LifeArea, 'id' | 'createdAt'>) => {
    dispatch({ type: 'UPDATE_AREA', payload: { id, data } });
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta área? Los elementos vinculados no se eliminarán.')) {
      dispatch({ type: 'DELETE_AREA', payload: id });
    }
  };

  const sorted = [...state.lifeAreas].sort((a, b) => b.priority - a.priority);

  return (
    <div className="p-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Áreas de Vida</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organiza tu vida en dimensiones claras y priorizadas
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Nueva Área
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 animate-[slideUp_0.2s_ease]">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Nueva Área de Vida</h2>
          <AreaForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((area) => {
          const c = colorMap[area.color];
          const areaGoals = state.goals.filter((g) => g.areaId === area.id);
          const areaHabits = state.habits.filter((h) => h.areaId === area.id);
          const isEditing = editId === area.id;

          return (
            <div key={area.id} className="card">
              {isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-300">Editar Área</h3>
                    <button onClick={() => setEditId(null)}>
                      <X size={14} className="text-slate-600" />
                    </button>
                  </div>
                  <AreaForm
                    initial={area}
                    onSave={(data) => handleEdit(area.id, data)}
                    onCancel={() => setEditId(null)}
                  />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${c.light} flex items-center justify-center text-xl`}>
                        {area.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm ${c.text}`}>{area.name}</h3>
                        <p className="text-xs text-slate-600">{area.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditId(area.id)}
                        className="p-1.5 hover:bg-[#2c2c3e] rounded-lg transition-colors"
                      >
                        <Pencil size={12} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Priority stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < area.priority ? c.text : 'text-slate-700'}>
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-slate-600 ml-1">Prioridad {area.priority}/5</span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-200">{areaGoals.length}</p>
                      <p className="text-xs text-slate-600">Metas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-200">{areaHabits.length}</p>
                      <p className="text-xs text-slate-600">Hábitos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-200">
                        {state.projects.filter((p) => p.areaId === area.id).length}
                      </p>
                      <p className="text-xs text-slate-600">Proyectos</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {state.lifeAreas.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🌐</p>
          <h3 className="text-slate-400 font-medium mb-1">Sin áreas de vida</h3>
          <p className="text-sm text-slate-600 mb-4">Define las dimensiones de tu vida que quieres mejorar</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Crear primera área
          </button>
        </div>
      )}
    </div>
  );
}
