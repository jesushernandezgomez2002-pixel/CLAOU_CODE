import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { TaskPriority } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoy'
  if (isTomorrow(date)) return 'Mañana'
  return format(date, 'd MMM', { locale: es })
}

export function isDueDateOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  return isPast(date) && !isToday(date)
}

export function isDueDateToday(dateStr: string | null): boolean {
  if (!dateStr) return false
  return isToday(parseISO(dateStr))
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'text-slate-400 bg-slate-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  high: 'text-orange-400 bg-orange-400/10',
  urgent: 'text-red-400 bg-red-400/10',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

export const HABIT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#a855f7',
]
