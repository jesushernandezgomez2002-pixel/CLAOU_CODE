import type { AreaColor } from '../types';

export function nanoid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const colorMap: Record<
  AreaColor,
  { bg: string; text: string; border: string; light: string }
> = {
  violet: {
    bg: 'bg-violet-600',
    text: 'text-violet-400',
    border: 'border-violet-500',
    light: 'bg-violet-500/10',
  },
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-400',
    border: 'border-blue-500',
    light: 'bg-blue-500/10',
  },
  cyan: {
    bg: 'bg-cyan-600',
    text: 'text-cyan-400',
    border: 'border-cyan-500',
    light: 'bg-cyan-500/10',
  },
  green: {
    bg: 'bg-green-600',
    text: 'text-green-400',
    border: 'border-green-500',
    light: 'bg-green-500/10',
  },
  yellow: {
    bg: 'bg-yellow-600',
    text: 'text-yellow-400',
    border: 'border-yellow-500',
    light: 'bg-yellow-500/10',
  },
  red: {
    bg: 'bg-red-600',
    text: 'text-red-400',
    border: 'border-red-500',
    light: 'bg-red-500/10',
  },
  orange: {
    bg: 'bg-orange-600',
    text: 'text-orange-400',
    border: 'border-orange-500',
    light: 'bg-orange-500/10',
  },
  pink: {
    bg: 'bg-pink-600',
    text: 'text-pink-400',
    border: 'border-pink-500',
    light: 'bg-pink-500/10',
  },
};

export const priorityColors = {
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

export const priorityLabels = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const statusColors = {
  active: 'text-green-400 bg-green-500/10',
  completed: 'text-blue-400 bg-blue-500/10',
  paused: 'text-yellow-400 bg-yellow-500/10',
  archived: 'text-slate-400 bg-slate-500/10',
};

export const statusLabels = {
  active: 'Activo',
  completed: 'Completado',
  paused: 'Pausado',
  archived: 'Archivado',
};

export function getLevelInfo(points: number) {
  const level = Math.floor(points / 100) + 1;
  const currentLevelPoints = (level - 1) * 100;
  const nextLevelPoints = level * 100;
  const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
  return { level, progress, pointsToNext: nextLevelPoints - points };
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}
