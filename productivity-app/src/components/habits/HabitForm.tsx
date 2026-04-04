'use client'

import { useState } from 'react'
import { createHabit, updateHabit } from '@/lib/actions/habits'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import { HABIT_COLORS } from '@/lib/utils'
import type { Habit } from '@/types'

interface Props {
  habit?: Habit
  onClose: () => void
}

const ICONS = ['✓', '💧', '📚', '🏃', '🧘', '💪', '🎯', '🌿', '✍️', '🛌']

export function HabitForm({ habit, onClose }: Props) {
  const [name, setName] = useState(habit?.name ?? '')
  const [description, setDescription] = useState(habit?.description ?? '')
  const [color, setColor] = useState(habit?.color ?? HABIT_COLORS[0])
  const [icon, setIcon] = useState(habit?.icon ?? '✓')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      if (habit) {
        await updateHabit(habit.id, { name: name.trim(), description: description || null, color, icon })
        toast.success('Hábito actualizado')
      } else {
        await createHabit({ name: name.trim(), description: description || undefined, color, icon })
        toast.success('Hábito creado')
      }
      onClose()
    } catch {
      toast.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--surface-elevated)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border p-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            {habit ? 'Editar hábito' : 'Nuevo hábito'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }} className="hover:opacity-70">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus value={name} onChange={e => setName(e.target.value)}
            placeholder="Nombre del hábito"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
            style={inputStyle}
          />
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Descripción (opcional)" rows={2}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border resize-none"
            style={inputStyle}
          />

          {/* Icon */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Icono
            </label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all"
                  style={{
                    borderColor: icon === i ? color : 'var(--border)',
                    background: icon === i ? `${color}20` : 'transparent',
                  }}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {HABIT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }} />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm border font-medium hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading || !name.trim()}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'var(--primary)', color: 'white' }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {habit ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
