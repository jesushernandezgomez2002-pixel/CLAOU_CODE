'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { TaskPriority, TaskStatus } from '@/types'

const TaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
})

async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('No autenticado')
  return { supabase, user }
}

export async function createTask(data: {
  title: string
  description?: string
  priority?: TaskPriority
  due_date?: string | null
}) {
  const { supabase, user } = await getUser()
  const parsed = TaskSchema.parse(data)

  const { error } = await supabase.from('tasks').insert({
    ...parsed,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function updateTask(id: string, data: Partial<{
  title: string
  description: string | null
  priority: TaskPriority
  due_date: string | null
  status: TaskStatus
}>) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('tasks')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function toggleTaskDone(id: string, isDone: boolean) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('tasks')
    .update({
      status: isDone ? 'done' : 'todo',
      completed_at: isDone ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}
