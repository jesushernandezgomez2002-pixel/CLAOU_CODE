'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from '@/lib/hooks/useTasks'
import { useUIStore } from '@/lib/stores/uiStore'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { QuickAddTask } from '@/components/tasks/QuickAddTask'
import type { Task, TaskStatus } from '@/types'

const FILTERS: { value: TaskStatus | 'all' | 'today'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'today', label: 'Hoy' },
  { value: 'todo', label: 'Pendientes' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'done', label: 'Completadas' },
]

export default function TasksPage() {
  const { tasks, todayTasks, loading } = useTasks()
  const { taskFilter, setTaskFilter } = useUIStore()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = taskFilter === 'today'
    ? todayTasks
    : taskFilter === 'all'
    ? tasks
    : tasks.filter(t => t.status === taskFilter)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Tareas
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {tasks.filter(t => t.status !== 'done').length} pendientes
        </p>
      </div>

      {/* Quick add */}
      <div className="mb-5">
        <QuickAddTask />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setTaskFilter(f.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={{
              background: taskFilter === f.value ? 'var(--primary)' : 'transparent',
              borderColor: taskFilter === f.value ? 'var(--primary)' : 'var(--border)',
              color: taskFilter === f.value ? 'white' : 'var(--text-secondary)',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse"
              style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      ) : (
        <motion.div layout className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 text-sm"
                style={{ color: 'var(--text-secondary)' }}>
                {taskFilter === 'today' ? 'Sin tareas para hoy 🎉' : 'No hay tareas aquí'}
              </motion.p>
            ) : (
              filtered.map(task => (
                <TaskCard key={task.id} task={task} onEdit={t => { setEditingTask(t); setShowForm(true) }} />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Edit modal */}
      <AnimatePresence>
        {showForm && (
          <TaskForm
            task={editingTask ?? undefined}
            onClose={() => { setShowForm(false); setEditingTask(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
