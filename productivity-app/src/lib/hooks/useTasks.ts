'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isDueDateToday, isDueDateOverdue } from '@/lib/utils'
import type { Task } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setTasks(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetch])

  const todayTasks = tasks.filter(t =>
    t.status !== 'done' && (isDueDateToday(t.due_date) || isDueDateOverdue(t.due_date))
  )

  return { tasks, todayTasks, loading, refetch: fetch }
}
