'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, subDays } from 'date-fns'
import type { HabitWithLogs } from '@/types'

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    const since = format(subDays(new Date(), 35), 'yyyy-MM-dd')

    const { data } = await supabase
      .from('habits')
      .select(`*, habit_logs(*)`)
      .eq('archived', false)
      .gte('habit_logs.logged_date', since)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    setHabits(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()

    const channel = supabase
      .channel('habits-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits' }, fetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs' }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetch])

  function isLoggedOnDate(habit: HabitWithLogs, date: string) {
    return habit.habit_logs.some(l => l.logged_date === date)
  }

  function getStreak(habit: HabitWithLogs): number {
    const sorted = [...habit.habit_logs]
      .map(l => l.logged_date)
      .sort((a, b) => b.localeCompare(a))

    if (!sorted.length) return 0

    const today = format(new Date(), 'yyyy-MM-dd')
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0

    let streak = 0
    let check = sorted[0] === today ? new Date() : subDays(new Date(), 1)

    for (const date of sorted) {
      if (date === format(check, 'yyyy-MM-dd')) {
        streak++
        check = subDays(check, 1)
      } else {
        break
      }
    }
    return streak
  }

  const todayHabits = habits.filter(() => true) // show all active
  const today = format(new Date(), 'yyyy-MM-dd')

  return { habits, todayHabits, loading, refetch: fetch, isLoggedOnDate, getStreak, today }
}
