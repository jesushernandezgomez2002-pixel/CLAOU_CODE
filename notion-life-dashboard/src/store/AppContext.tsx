import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { AppState, LifeArea, Goal, Project, Task, Habit, ShopItem } from '../types';
import { format } from 'date-fns';

const STORAGE_KEY = 'notion-life-dashboard-v1';

const defaultState: AppState = {
  profile: {
    name: 'Usuario',
    motto: 'Cada día cuenta. Cada acción importa.',
    avatar: '⚡',
    points: 0,
    level: 1,
  },
  lifeAreas: [
    {
      id: '1',
      name: 'Salud & Energía',
      icon: '🏃',
      color: 'green',
      description: 'Cuerpo fuerte, mente clara',
      priority: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Carrera & Finanzas',
      icon: '💼',
      color: 'blue',
      description: 'Crecimiento profesional y estabilidad',
      priority: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Aprendizaje',
      icon: '📚',
      color: 'violet',
      description: 'Conocimiento que genera valor',
      priority: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Relaciones',
      icon: '❤️',
      color: 'pink',
      description: 'Vínculos que nutren y sostienen',
      priority: 4,
      createdAt: new Date().toISOString(),
    },
  ],
  goals: [],
  projects: [],
  tasks: [],
  habits: [
    {
      id: '1',
      name: 'Ejercicio',
      description: '30 min mínimo',
      areaId: '1',
      frequency: 'daily',
      targetDays: [1, 2, 3, 4, 5, 6, 0],
      color: 'green',
      icon: '💪',
      streak: 0,
      longestStreak: 0,
      completions: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Lectura',
      description: '20 páginas al día',
      areaId: '3',
      frequency: 'daily',
      targetDays: [1, 2, 3, 4, 5, 6, 0],
      color: 'violet',
      icon: '📖',
      streak: 0,
      longestStreak: 0,
      completions: [],
      createdAt: new Date().toISOString(),
    },
  ],
  shopItems: [],
  activeView: 'dashboard',
  battleModeActive: false,
};

type Action =
  | { type: 'SET_VIEW'; payload: AppState['activeView'] }
  | { type: 'UPDATE_PROFILE'; payload: Partial<AppState['profile']> }
  | { type: 'ADD_AREA'; payload: LifeArea }
  | { type: 'UPDATE_AREA'; payload: { id: string; data: Partial<LifeArea> } }
  | { type: 'DELETE_AREA'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: { id: string; data: Partial<Goal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; data: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT'; payload: { id: string; date: string } }
  | { type: 'ADD_SHOP_ITEM'; payload: ShopItem }
  | { type: 'UPDATE_SHOP_ITEM'; payload: { id: string; data: Partial<ShopItem> } }
  | { type: 'DELETE_SHOP_ITEM'; payload: string }
  | { type: 'TOGGLE_BATTLE_MODE' }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_STATE'; payload: AppState };

function calculateStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'ADD_AREA':
      return { ...state, lifeAreas: [...state.lifeAreas, action.payload] };
    case 'UPDATE_AREA':
      return {
        ...state,
        lifeAreas: state.lifeAreas.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
      };
    case 'DELETE_AREA':
      return {
        ...state,
        lifeAreas: state.lifeAreas.filter((a) => a.id !== action.payload),
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.data } : g
        ),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case 'TOGGLE_TASK': {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (!task) return state;
      const completed = !task.completed;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? {
                ...t,
                completed,
                completedAt: completed ? new Date().toISOString() : null,
              }
            : t
        ),
        profile: {
          ...state.profile,
          points: state.profile.points + (completed ? 10 : -10),
        },
      };
    }
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.payload.id ? { ...h, ...action.payload.data } : h
        ),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
      };
    case 'TOGGLE_HABIT': {
      const { id, date } = action.payload;
      const habit = state.habits.find((h) => h.id === id);
      if (!habit) return state;
      const alreadyDone = habit.completions.includes(date);
      const newCompletions = alreadyDone
        ? habit.completions.filter((d) => d !== date)
        : [...habit.completions, date];
      const streak = calculateStreak(newCompletions);
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === id
            ? {
                ...h,
                completions: newCompletions,
                streak,
                longestStreak: Math.max(h.longestStreak, streak),
              }
            : h
        ),
        profile: {
          ...state.profile,
          points: state.profile.points + (alreadyDone ? -5 : 5),
        },
      };
    }
    case 'ADD_SHOP_ITEM':
      return { ...state, shopItems: [...state.shopItems, action.payload] };
    case 'UPDATE_SHOP_ITEM':
      return {
        ...state,
        shopItems: state.shopItems.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.data } : s
        ),
      };
    case 'DELETE_SHOP_ITEM':
      return {
        ...state,
        shopItems: state.shopItems.filter((s) => s.id !== action.payload),
      };
    case 'TOGGLE_BATTLE_MODE':
      return { ...state, battleModeActive: !state.battleModeActive };
    case 'RESET_ALL':
      return { ...defaultState, activeView: state.activeView };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { ...defaultState, ...parsed, activeView: 'dashboard' } });
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function useDispatch() {
  return useApp().dispatch;
}
