export type TimerType = 'countdown' | 'stopwatch' | 'pomodoro';

export interface Tag {
  id: string;
  name: string;
  color: string; // e.g. '#06b6d4', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'
  bgColor: string; // tailwind surface style
  borderColor: string;
  icon: string; // Lucide icon name
  isHighValue: boolean; // Indicates high-value productivity activity
  xpMultiplier: number; // e.g. 1.5x, 2.0x for high value
}

export interface TimerPreset {
  id: string;
  title: string;
  description: string;
  tagId: string;
  defaultDurationMinutes: number;
  timerType: TimerType;
  pomodoroBreakMinutes?: number;
  targetHighValue: boolean;
}

export interface TimerSession {
  id: string;
  title: string;
  tagId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationSeconds: number;
  xpEarned: number;
  date: string; // YYYY-MM-DD
  isHighValue: boolean;
  completed: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetType: 'focus_minutes' | 'high_value_minutes' | 'completed_timers' | 'specific_tag';
  targetAmount: number;
  currentAmount: number;
  rewardXp: number;
  rewardStatPoints: number;
  rewardShadowId?: string;
  completed: boolean;
  claimed: boolean;
}

export interface ShadowArmy {
  id: string;
  name: string;
  title: string;
  rankRequired: string;
  levelRequired: number;
  unlocked: boolean;
  quote: string;
  icon: string;
  bonusEffect: string;
  highValueRequiredHours?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  xpBonus: number;
  category: 'timer' | 'high_value' | 'level' | 'streak';
}

export interface PlayerStats {
  focus: number; // Fuerza de Enfoque
  learning: number; // Inteligencia / Aprendizaje
  execution: number; // Agilidad / Velocidad de Trabajo
  rest: number; // Vitalidad / Equilibrio
  consistency: number; // Voluntad / Racha Diaria
}

export type PlayerRank = 
  | 'Rango E'
  | 'Rango D'
  | 'Rango C'
  | 'Rango B'
  | 'Rango A'
  | 'Rango S'
  | 'Cazador Rango Nacional'
  | 'Monarca de las Sombras';

export type AmbientSoundId = 'none' | 'rain' | 'rpg' | 'cyber' | 'sands';

export interface PlayerProfile {
  name: string;
  title: string;
  rank: PlayerRank;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: PlayerStats;
  availableStatPoints: number;
  currentStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalHighValueHours: number;
  totalFocusHours: number;
  totalSessions: number;
  soundEnabled: boolean;
  ambientSound: AmbientSoundId;
  ambientVolume: number; // 0.0 to 1.0
}

export interface DayRecap {
  date: string; // YYYY-MM-DD
  totalFocusSeconds: number;
  highValueSeconds: number;
  sessionsCount: number;
}

export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string;
  category: 'Enfoque' | 'Disciplina' | 'Perseverancia' | 'Alto Valor' | 'Monarca';
  levelRequired: number;
  unlocked: boolean;
  active: boolean;
  xpCostToUnlock: number;
}

export interface BubbleConfig {
  enabled: boolean;
  displayMode: 'day_reset' | 'active_timer' | 'auto';
  dockPosition: 'right' | 'left';
  autoHidePeek: boolean;
  theme: 'cyan' | 'purple' | 'emerald' | 'amber';
  opacity: number;
}

export type AppThemeId = 
  | 'monarch_purple' 
  | 'cyber_cyan' 
  | 'gold_rank' 
  | 'shadow_emerald' 
  | 'crimson_blood' 
  | 'midnight_abyss'
  | 'prince_sands';

export interface AppThemeConfig {
  id: AppThemeId;
  name: string;
  subtitle: string;
  description: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  glowRgb: string;
  badgeBg: string;
  borderClass: string;
  textClass: string;
  gradientClass: string;
  previewColors: string[];
}


