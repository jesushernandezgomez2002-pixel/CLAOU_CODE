import { useState } from 'react';
import { Plus, Trash2, Check, X, Package, Gift, Wrench, Minus } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { ShopItem } from '../types';
import { nanoid } from '../utils/helpers';

const TYPE_ICONS = { resource: '📦', reward: '🎁', tool: '🔧' };
const TYPE_LABELS = { resource: 'Recurso', reward: 'Recompensa', tool: 'Herramienta' };
const TYPE_COLORS = {
  resource: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  reward: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  tool: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
};

const ITEM_ICONS = ['📦', '🎁', '🔧', '💎', '🏆', '⭐', '🎮', '📱', '💰', '🌟', '🎯', '🎨'];

function ItemForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<ShopItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ShopItem['type']>('resource');
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState(0);
  const [icon, setIcon] = useState('📦');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description, type, quantity, cost, icon });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Nombre *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Café premium" autoFocus />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Tipo</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as ShopItem['type'])}>
            <option value="resource">📦 Recurso</option>
            <option value="reward">🎁 Recompensa</option>
            <option value="tool">🔧 Herramienta</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Cantidad</label>
          <input type="number" min={0} className="input" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Costo (XP)</label>
          <input type="number" min={0} className="input" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Para qué sirve este ítem?" />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Ícono</label>
        <div className="flex flex-wrap gap-1.5">
          {ITEM_ICONS.map((i) => (
            <button type="button" key={i} onClick={() => setIcon(i)}
              className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${icon === i ? 'bg-violet-600/30 ring-1 ring-violet-500' : 'hover:bg-[#2c2c3e]'}`}>
              {i}
            </button>
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

export default function Tiendita() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | ShopItem['type']>('all');

  const handleAdd = (data: Omit<ShopItem, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_SHOP_ITEM', payload: { ...data, id: nanoid(), createdAt: new Date().toISOString() } });
    setShowForm(false);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const item = state.shopItems.find((s) => s.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    dispatch({ type: 'UPDATE_SHOP_ITEM', payload: { id, data: { quantity: newQty } } });
  };

  const filtered = state.shopItems.filter((s) => filterType === 'all' || s.type === filterType);

  const resources = state.shopItems.filter((s) => s.type === 'resource');
  const rewards = state.shopItems.filter((s) => s.type === 'reward');
  const tools = state.shopItems.filter((s) => s.type === 'tool');

  return (
    <div className="p-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">La Tiendita</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestiona recursos, recompensas e inventario personal</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Nuevo Ítem
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center">
          <Package size={20} className="text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-200">{resources.length}</p>
          <p className="text-xs text-slate-600">Recursos</p>
        </div>
        <div className="card text-center">
          <Gift size={20} className="text-pink-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-200">{rewards.length}</p>
          <p className="text-xs text-slate-600">Recompensas</p>
        </div>
        <div className="card text-center">
          <Wrench size={20} className="text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-200">{tools.length}</p>
          <p className="text-xs text-slate-600">Herramientas</p>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4 animate-[slideUp_0.2s_ease]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">Nuevo Ítem</h2>
            <button onClick={() => setShowForm(false)}><X size={14} className="text-slate-600" /></button>
          </div>
          <ItemForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'resource', 'reward', 'tool'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === t ? 'bg-violet-600 text-white' : 'bg-[#1a1a24] text-slate-500 hover:text-slate-300'}`}
          >
            {t === 'all' ? 'Todos' : `${TYPE_ICONS[t]} ${TYPE_LABELS[t]}s`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="card flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              item.type === 'resource' ? 'bg-blue-500/10' : item.type === 'reward' ? 'bg-pink-500/10' : 'bg-amber-500/10'
            }`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{item.name}</h3>
                  {item.description && <p className="text-xs text-slate-600">{item.description}</p>}
                </div>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este ítem?')) dispatch({ type: 'DELETE_SHOP_ITEM', payload: item.id });
                  }}
                  className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 size={11} className="text-slate-700 hover:text-red-400" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className={`badge border ${TYPE_COLORS[item.type]}`}>{TYPE_ICONS[item.type]} {TYPE_LABELS[item.type]}</span>
                {item.cost > 0 && (
                  <span className="text-xs text-violet-400">⚡ {item.cost} XP</span>
                )}
              </div>
              {/* Quantity control */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">Cantidad:</span>
                <button onClick={() => handleQuantityChange(item.id, -1)} className="w-5 h-5 rounded bg-[#1a1a24] hover:bg-[#2c2c3e] flex items-center justify-center transition-colors">
                  <Minus size={10} className="text-slate-400" />
                </button>
                <span className="text-sm font-bold text-slate-200 w-8 text-center">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)} className="w-5 h-5 rounded bg-[#1a1a24] hover:bg-[#2c2c3e] flex items-center justify-center transition-colors">
                  <Plus size={10} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🛒</p>
          <h3 className="text-slate-400 font-medium mb-1">Tu tiendita está vacía</h3>
          <p className="text-sm text-slate-600 mb-4">Agrega recursos, recompensas o herramientas que quieras gestionar</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Agregar primer ítem</button>
        </div>
      )}
    </div>
  );
}
