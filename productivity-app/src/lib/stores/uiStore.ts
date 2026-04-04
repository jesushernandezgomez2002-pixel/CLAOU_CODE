import { create } from 'zustand'
import type { TaskStatus, TaskPriority } from '@/types'

interface UIStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  taskFilter: TaskStatus | 'all' | 'today'
  setTaskFilter: (filter: TaskStatus | 'all' | 'today') => void

  taskPriorityFilter: TaskPriority | 'all'
  setTaskPriorityFilter: (priority: TaskPriority | 'all') => void

  selectedHabitId: string | null
  setSelectedHabitId: (id: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  taskFilter: 'all',
  setTaskFilter: (filter) => set({ taskFilter: filter }),

  taskPriorityFilter: 'all',
  setTaskPriorityFilter: (priority) => set({ taskPriorityFilter: priority }),

  selectedHabitId: null,
  setSelectedHabitId: (id) => set({ selectedHabitId: id }),
}))
