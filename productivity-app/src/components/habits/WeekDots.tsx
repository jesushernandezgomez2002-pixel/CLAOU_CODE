'use client'

import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import type { HabitWithLogs } from '@/types'

interface Props {
  habit: HabitWithLogs
  isLoggedOnDate: (habit: HabitWithLogs, date: string) => boolean
}

export function WeekDots({ habit, isLoggedOnDate }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const logged = isLoggedOnDate(habit, dateStr)
    const label = format(date, 'EEE', { locale: es }).slice(0, 2)
    return { dateStr, logged, label }
  })

  return (
    <div className="flex items-center gap-1.5">
      {days.map(({ dateStr, logged, label }) => (
        <div key={dateStr} className="flex flex-col items-center gap-1">
          <motion.div
            initial={false}
            animate={{ scale: logged ? 1 : 0.85, opacity: logged ? 1 : 0.3 }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: logged ? habit.color : 'var(--border)' }}
          />
          <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
