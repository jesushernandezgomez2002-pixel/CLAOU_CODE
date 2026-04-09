import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';

const AVATARS = ['⚡', '🔥', '🦅', '🐉', '🦁', '⚔️', '🎯', '🌙', '💎', '🚀', '🧠', '🏆'];

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.profile.name);
  const [motto, setMotto] = useState(state.profile.motto);
  const [avatar, setAvatar] = useState(state.profile.avatar);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { name, motto, avatar } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#111118] border border-[#1a1a24] rounded-2xl p-6 max-w-sm w-full animate-[slideUp_0.2s_ease]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-100">Tu Perfil</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1a1a24] rounded-lg transition-colors">
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all ${
                    avatar === a ? 'bg-violet-600/30 ring-1 ring-violet-500' : 'hover:bg-[#1a1a24]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Nombre</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Lema personal</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="Tu frase motivacional..."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-1">
            <Check size={14} /> Guardar cambios
          </button>
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
