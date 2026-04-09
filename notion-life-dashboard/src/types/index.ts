export type Priority = 'high' | 'medium' | 'low';
export type Status = 'active' | 'completed' | 'paused' | 'archived';
export type AreaColor =
  | 'violet'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'yellow'
  | 'red'
  | 'orange'
  | 'pink';

export interface LifeArea {
  id: string;
  name: string;
  icon: string;
  color: AreaColor;
  description: string;
  priority: number; // 1-5
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  areaId: string;
  status: Status;
  priority: Priority;
  progress: number; // 0-100
  deadline: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  goalId: string;
  areaId: string;
  status: Status;
  priority: Priority;
  progress: number;
  deadline: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  goalId: string | null;
  areaId: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  areaId: string;
  frequency: 'daily' | 'weekly';
  targetDays: number[];
  color: AreaColor;
  icon: string;
  streak: number;
  longestStreak: number;
  completions: string[]; // ISO date strings
  createdAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'resource' | 'reward' | 'tool';
  quantity: number;
  cost: number;
  icon: string;
  createdAt: string;
}

export interface Stats {
  totalPoints: number;
  level: number;
  weeklyTasksCompleted: number;
  monthlyTasksCompleted: number;
  currentHabitStreak: number;
}

export interface AppState {
  profile: {
    name: string;
    motto: string;
    avatar: string;
    points: number;
    level: number;
  };
  lifeAreas: LifeArea[];
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  habits: Habit[];
  shopItems: ShopItem[];
  activeView:
    | 'dashboard'
    | 'areas'
    | 'goals'
    | 'projects'
    | 'tasks'
    | 'habits'
    | 'stats'
    | 'battle'
    | 'shop'
    | 'danger';
  battleModeActive: boolean;
}
