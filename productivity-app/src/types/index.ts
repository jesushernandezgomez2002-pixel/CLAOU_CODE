export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  completed_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  icon: string
  frequency: HabitFrequency
  custom_days: number[] | null
  target_count: number
  archived: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  habit_id: string
  logged_date: string
  count: number
  note: string | null
  created_at: string
}

export interface HabitWithLogs extends Habit {
  habit_logs: HabitLog[]
}
