'use client'

import { useState } from 'react'
import { createTask, updateTask } from '@/lib/actions/tasks'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import type { Task, TaskPriority } from '@/types'

interface Props {
  task?: Task
  onClose: () => void
}

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: '#7a8fa6' },
  { value: 'medium', label: 'Media', color: '#fbbf24' },
  { value: 'high', label: 'Alta', color: '#f97316' },
  { value: 'urgent', label: 'Urgente', color: '#f87171' },
]

export function TaskForm({ task, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.due_date ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      if (task) {
        await updateTask(task.id, {
          title: title.trim(),
          description: description || null,
          priority,
          due_date: dueDate || null,
        })
        toast.success('Tarea actualizada')
      } else {
        await createTask({
          title: title.trim(),
          description: description || undefined,
          priority,
          due_date: dueDate || null,
        })
        toast.success('Tarea creada')
      }
      onClose()
    } catch {
      toast.error('Error al guardar tarea')
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
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border p-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            {task ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }} className="hover:opacity-70">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título de la tarea"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
            style={inputStyle}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border resize-none"
            style={inputStyle}
          />

          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Prioridad
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button key={p.value} type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={{
                    borderColor: priority === p.value ? p.color : 'var(--border)',
                    color: priority === p.value ? p.color : 'var(--text-secondary)',
                    background: priority === p.value ? `${p.color}15` : 'transparent',
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Fecha límite
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
              style={inputStyle}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm border font-medium transition-all hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading || !title.trim()}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'var(--primary)', color: 'white' }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {task ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
