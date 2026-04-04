'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { HabitFrequency } from '@/types'

const HabitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().default('#6366f1'),
  icon: z.string().default('✓'),
  frequency: z.enum(['daily', 'weekdays', 'weekends', 'custom']).default('daily'),
  custom_days: z.array(z.number()).optional(),
})

async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('No autenticado')
  return { supabase, user }
}

export async function createHabit(data: {
  name: string
  description?: string
  color?: string
  icon?: string
  frequency?: HabitFrequency
  custom_days?: number[]
}) {
  const { supabase, user } = await getUser()
  const parsed = HabitSchema.parse(data)

  const { error } = await supabase.from('habits').insert({
    ...parsed,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function updateHabit(id: string, data: Partial<{
  name: string
  description: string | null
  color: string
  icon: string
  frequency: HabitFrequency
  archived: boolean
}>) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('habits')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/habits')
}

export async function deleteHabit(id: string) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function logHabit(habitId: string, date: string) {
  const { supabase, user } = await getUser()

  const { error } = await supabase.from('habit_logs').upsert({
    habit_id: habitId,
    user_id: user.id,
    logged_date: date,
    count: 1,
  }, { onConflict: 'habit_id,logged_date' })

  if (error) throw new Error(error.message)
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function unlogHabit(habitId: string, date: string) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('logged_date', date)

  if (error) throw new Error(error.message)
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}
