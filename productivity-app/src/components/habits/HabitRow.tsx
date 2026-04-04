'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Archive } from 'lucide-react'
import { logHabit, unlogHabit, deleteHabit, updateHabit } from '@/lib/actions/habits'
import { WeekDots } from './WeekDots'
import { StreakBadge } from './StreakBadge'
import { toast } from 'sonner'
import type { HabitWithLogs } from '@/types'

interface Props {
  habit: HabitWithLogs
  today: string
  isLoggedOnDate: (habit: HabitWithLogs, date: string) => boolean
  getStreak: (habit: HabitWithLogs) => number
  onEdit: (habit: HabitWithLogs) => void
}

export function HabitRow({ habit, today, isLoggedOnDate, getStreak, onEdit }: Props) {
  const [loading, setLoading] = useState(false)
  const loggedToday = isLoggedOnDate(habit, today)
  const streak = getStreak(habit)

  async function handleToggle() {
    setLoading(true)
    try {
      if (loggedToday) {
        await unlogHabit(habit.id, today)
      } else {
        await logHabit(habit.id, today)
      }
    } catch {
      toast.error('Error al actualizar hábito')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteHabit(habit.id)
      toast.success('Hábito eliminado')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  async function handleArchive() {
    try {
      await updateHabit(habit.id, { archived: true })
      toast.success('Hábito archivado')
    } catch {
      toast.error('Error al archivar')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Log button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        disabled={loading}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border-2 transition-all"
        style={{
          borderColor: loggedToday ? habit.color : 'var(--border)',
          background: loggedToday ? `${habit.color}20` : 'transparent',
        }}
      >
        <span style={{ filter: loggedToday ? 'none' : 'grayscale(1) opacity(0.4)' }}>
          {habit.icon}
        </span>
      </motion.button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {habit.name}
          </span>
          <StreakBadge streak={streak} />
        </div>
        <WeekDots habit={habit} isLoggedOnDate={isLoggedOnDate} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(habit)}
          className="p-1.5 rounded-md hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}>
          <Pencil size={14} />
        </button>
        <button onClick={handleArchive}
          className="p-1.5 rounded-md hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}>
          <Archive size={14} />
        </button>
        <button onClick={handleDelete}
          className="p-1.5 rounded-md hover:opacity-70"
          style={{ color: 'var(--danger)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
