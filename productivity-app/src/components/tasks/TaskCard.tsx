'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Calendar, Flag, Pencil } from 'lucide-react'
import { toggleTaskDone, deleteTask } from '@/lib/actions/tasks'
import { cn, formatDueDate, isDueDateOverdue, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/utils'
import { toast } from 'sonner'
import type { Task } from '@/types'

interface Props {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: Props) {
  const [loading, setLoading] = useState(false)
  const done = task.status === 'done'

  async function handleToggle() {
    setLoading(true)
    try {
      await toggleTaskDone(task.id, !done)
    } catch {
      toast.error('Error al actualizar tarea')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteTask(task.id)
      toast.success('Tarea eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const overdue = !done && isDueDateOverdue(task.due_date)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors hover:border-opacity-60"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all"
        style={{
          borderColor: done ? 'var(--success)' : 'var(--border)',
          background: done ? 'var(--success)' : 'transparent',
        }}
      >
        <AnimatePresence>
          {done && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              width="10" height="10" viewBox="0 0 10 10" fill="none"
            >
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium leading-snug transition-all', done && 'line-through opacity-40')}
          style={{ color: 'var(--text-primary)' }}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', PRIORITY_COLORS[task.priority])}>
            <Flag size={10} />
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.due_date && (
            <span className={cn('inline-flex items-center gap-1 text-xs')}
              style={{ color: overdue ? 'var(--danger)' : 'var(--text-secondary)' }}>
              <Calendar size={11} />
              {formatDueDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(task)}
          className="p-1.5 rounded-md transition-colors hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}>
          <Pencil size={14} />
        </button>
        <button onClick={handleDelete}
          className="p-1.5 rounded-md transition-colors hover:opacity-70"
          style={{ color: 'var(--danger)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
