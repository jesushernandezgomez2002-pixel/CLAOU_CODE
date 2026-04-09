import { useState } from 'react';
import { AlertTriangle, Trash2, RotateCcw, X, ShieldOff } from 'lucide-react';
import { useApp } from '../store/AppContext';

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}) {
  const [typed, setTyped] = useState('');
  const required = 'ELIMINAR';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#111118] border border-red-900/50 rounded-2xl p-6 max-w-md w-full animate-[slideUp_0.2s_ease]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{message}</p>
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">
            Escribe <span className="font-mono text-red-400 bg-red-900/20 px-1 rounded">{required}</span> para confirmar:
          </p>
          <input
            className="input border-red-900/50 focus:border-red-600"
            value={typed}
            onChange={(e) => setTyped(e.target.value.toUpperCase())}
            placeholder={required}
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={typed !== required}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              typed === required
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-red-900/20 text-red-900 cursor-not-allowed'
            }`}
          >
            {confirmText}
          </button>
          <button onClick={onCancel} className="btn-ghost px-4">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DangerZone() {
  const { state, dispatch } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const dangerActions = [
    {
      id: 'delete-tasks',
      icon: <Trash2 size={18} className="text-red-400" />,
      title: 'Eliminar todas las tareas',
      description: 'Borra permanentemente todas las tareas, completadas y pendientes. Esta acción no se puede deshacer.',
      action: () => {
        state.tasks.forEach((t) => dispatch({ type: 'DELETE_TASK', payload: t.id }));
        setActiveModal(null);
      },
      count: `${state.tasks.length} tareas`,
    },
    {
      id: 'delete-habits',
      icon: <Trash2 size={18} className="text-red-400" />,
      title: 'Eliminar todos los hábitos',
      description: 'Borra todos los hábitos incluyendo su historial de rachas y completados. Perderás todos los datos de consistencia.',
      action: () => {
        state.habits.forEach((h) => dispatch({ type: 'DELETE_HABIT', payload: h.id }));
        setActiveModal(null);
      },
      count: `${state.habits.length} hábitos`,
    },
    {
      id: 'delete-goals',
      icon: <Trash2 size={18} className="text-red-400" />,
      title: 'Eliminar todas las metas',
      description: 'Elimina todas las metas registradas. Los proyectos vinculados no se eliminarán automáticamente.',
      action: () => {
        state.goals.forEach((g) => dispatch({ type: 'DELETE_GOAL', payload: g.id }));
        setActiveModal(null);
      },
      count: `${state.goals.length} metas`,
    },
    {
      id: 'reset-xp',
      icon: <RotateCcw size={18} className="text-orange-400" />,
      title: 'Resetear XP y nivel',
      description: 'Reinicia tus puntos de experiencia y nivel a cero. No afecta tus datos de hábitos, tareas ni metas.',
      action: () => {
        dispatch({ type: 'UPDATE_PROFILE', payload: { points: 0, level: 1 } });
        setActiveModal(null);
      },
      count: `${state.profile.points} XP`,
      orange: true,
    },
    {
      id: 'reset-all',
      icon: <ShieldOff size={18} className="text-red-500" />,
      title: 'Reset completo del sistema',
      description: 'Elimina TODOS los datos: áreas, metas, proyectos, tareas, hábitos, tiendita y perfil. Vuelves al estado inicial. IRREVERSIBLE.',
      action: () => {
        dispatch({ type: 'RESET_ALL' });
        setActiveModal(null);
      },
      count: 'Todo tu progreso',
      critical: true,
    },
  ];

  const active = dangerActions.find((a) => a.id === activeModal);

  return (
    <div className="p-6 max-w-3xl mx-auto animate-[fadeIn_0.3s_ease]">
      {activeModal && active && (
        <ConfirmModal
          title={active.title}
          message={active.description}
          onConfirm={active.action}
          onCancel={() => setActiveModal(null)}
          confirmText="Sí, eliminar"
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-800/50 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Zona Peligrosa</h1>
          <p className="text-sm text-red-400/70 mt-0.5">Las acciones aquí son irreversibles. Procede con cuidado.</p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-xl mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300/80">
            Esta sección contiene acciones destructivas que <strong>no se pueden deshacer</strong>.
            Cada acción requiere confirmación explícita. Si no estás seguro, cierra esta página.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {dangerActions.map((action) => (
          <div
            key={action.id}
            className={`p-4 rounded-xl border transition-all ${
              action.critical
                ? 'bg-red-950/20 border-red-800/40 hover:border-red-700/60'
                : action.orange
                ? 'bg-orange-950/20 border-orange-800/40 hover:border-orange-700/60'
                : 'bg-[#111118] border-[#1a1a24] hover:border-red-900/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  action.critical ? 'bg-red-900/40' : action.orange ? 'bg-orange-900/40' : 'bg-red-900/20'
                }`}>
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${action.critical ? 'text-red-300' : 'text-slate-200'}`}>
                      {action.title}
                    </h3>
                    <span className={`badge text-xs ${action.orange ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                      {action.count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(action.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  action.critical
                    ? 'bg-red-900/30 hover:bg-red-800/50 text-red-400 border-red-800/50 hover:border-red-600/70'
                    : action.orange
                    ? 'bg-orange-900/30 hover:bg-orange-800/50 text-orange-400 border-orange-800/50'
                    : 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-900/40'
                }`}
              >
                Ejecutar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-700 text-center mt-6">
        Los datos se guardan localmente en tu navegador. No hay forma de recuperarlos una vez eliminados.
      </p>
    </div>
  );
}
