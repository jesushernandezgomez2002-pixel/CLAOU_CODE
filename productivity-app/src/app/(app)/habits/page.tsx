'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHabits } from '@/lib/hooks/useHabits'
import { HabitRow } from '@/components/habits/HabitRow'
import { HabitForm } from '@/components/habits/HabitForm'
import type { HabitWithLogs } from '@/types'

export default function HabitsPage() {
  const { habits, loading, isLoggedOnDate, getStreak, today } = useHabits()
  const [editingHabit, setEditingHabit] = useState<HabitWithLogs | null>(null)
  const [showForm, setShowForm] = useState(false)

  const doneToday = habits.filter(h => isLoggedOnDate(h, today)).length

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Hábitos
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {doneToday}/{habits.length} completados hoy
          </p>
        </div>
        <button onClick={() => { setEditingHabit(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'var(--primary)', color: 'white' }}>
          <Plus size={16} />
          Nuevo hábito
        </button>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="mb-6">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--success)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(doneToday / habits.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16">
          <p className="text-4xl mb-3">🌱</p>
          <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Sin hábitos aún
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Crea tu primer hábito y empieza a construir racha
          </p>
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'var(--primary)', color: 'white' }}>
            Crear hábito
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="space-y-2">
          <AnimatePresence mode="popLayout">
            {habits.map(habit => (
              <HabitRow
                key={habit.id}
                habit={habit}
                today={today}
                isLoggedOnDate={isLoggedOnDate}
                getStreak={getStreak}
                onEdit={h => { setEditingHabit(h); setShowForm(true) }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showForm && (
          <HabitForm
            habit={editingHabit ?? undefined}
            onClose={() => { setShowForm(false); setEditingHabit(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
