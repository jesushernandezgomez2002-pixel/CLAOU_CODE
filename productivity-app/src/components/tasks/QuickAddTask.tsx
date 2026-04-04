'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { createTask } from '@/lib/actions/tasks'
import { toast } from 'sonner'

export function QuickAddTask() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    setLoading(true)
    try {
      await createTask({ title: value.trim() })
      setValue('')
    } catch {
      toast.error('Error al crear tarea')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Plus size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-secondary)' }} />
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Añadir tarea rápida... (Enter para guardar)"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-colors"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
      <button type="submit" disabled={loading || !value.trim()}
        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
        style={{ background: 'var(--primary)', color: 'white' }}>
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Añadir
      </button>
    </form>
  )
}
