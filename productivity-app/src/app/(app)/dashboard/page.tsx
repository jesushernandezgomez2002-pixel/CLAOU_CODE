'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTasks } from '@/lib/hooks/useTasks'
import { useHabits } from '@/lib/hooks/useHabits'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { HabitRow } from '@/components/habits/HabitRow'
import { HabitForm } from '@/components/habits/HabitForm'
import { QuickAddTask } from '@/components/tasks/QuickAddTask'
import type { Task, HabitWithLogs } from '@/types'

export default function DashboardPage() {
  const { todayTasks, loading: tasksLoading } = useTasks()
  const { habits, loading: habitsLoading, isLoggedOnDate, getStreak, today } = useHabits()

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithLogs | null>(null)
  const [showHabitForm, setShowHabitForm] = useState(false)

  const todayLabel = format(new Date(), "EEEE d 'de' MMMM", { locale: es })
  const doneHabitsToday = habits.filter(h => isLoggedOnDate(h, today)).length
  const pendingTasks = todayTasks.length

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm capitalize mb-1" style={{ color: 'var(--text-secondary)' }}>
          {todayLabel}
        </p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Hoy
        </h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl p-4 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--primary)' }}>
            {pendingTasks}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            tareas para hoy
          </p>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--success)' }}>
            {doneHabitsToday}/{habits.length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            hábitos completados
          </p>
        </div>
      </div>

      {/* Tasks today */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-secondary)' }}>
          Tareas de hoy
        </h2>
        <div className="mb-3">
          <QuickAddTask />
        </div>
        {tasksLoading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />
            ))}
          </div>
        ) : todayTasks.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            Sin tareas urgentes para hoy 🎉
          </p>
        ) : (
          <motion.div layout className="space-y-2">
            <AnimatePresence mode="popLayout">
              {todayTasks.map(task => (
                <TaskCard key={task.id} task={task}
                  onEdit={t => { setEditingTask(t); setShowTaskForm(true) }} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Habits today */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-secondary)' }}>
          Hábitos
        </h2>
        {habitsLoading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            Sin hábitos. <a href="/habits" style={{ color: 'var(--primary)' }}>Crea uno</a>
          </p>
        ) : (
          <motion.div layout className="space-y-2">
            <AnimatePresence mode="popLayout">
              {habits.map(habit => (
                <HabitRow key={habit.id} habit={habit} today={today}
                  isLoggedOnDate={isLoggedOnDate} getStreak={getStreak}
                  onEdit={h => { setEditingHabit(h); setShowHabitForm(true) }} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {showTaskForm && (
          <TaskForm task={editingTask ?? undefined}
            onClose={() => { setShowTaskForm(false); setEditingTask(null) }} />
        )}
        {showHabitForm && (
          <HabitForm habit={editingHabit ?? undefined}
            onClose={() => { setShowHabitForm(false); setEditingHabit(null) }} />
        )}
      </AnimatePresence>
    </div>
  )
}
