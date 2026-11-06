import { 
  Tag, 
  TimerPreset, 
  TimerSession, 
  DailyQuest, 
  ShadowArmy, 
  Achievement, 
  PlayerProfile, 
  DayRecap,
  PlayerRank,
  MotivationalQuote,
  BubbleConfig
} from '../types';
import { 
  INITIAL_TAGS, 
  INITIAL_PRESETS, 
  INITIAL_PROFILE, 
  INITIAL_QUESTS, 
  INITIAL_SHADOWS, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_QUOTES,
  DEFAULT_BUBBLE_CONFIG
} from './initialData';

const STORAGE_KEYS = {
  TAGS: 'chronos_tags_v1',
  PRESETS: 'chronos_presets_v1',
  SESSIONS: 'chronos_sessions_v1',
  PROFILE: 'chronos_profile_v1',
  QUESTS: 'chronos_quests_v1',
  SHADOWS: 'chronos_shadows_v1',
  ACHIEVEMENTS: 'chronos_achievements_v1',
  RECAPS: 'chronos_recaps_v1',
  ACTIVE_TIMER: 'chronos_active_timer_v1',
  DAY_TITLE: 'chronos_day_title_v1',
  QUOTES: 'chronos_quotes_v1',
  BUBBLE_CONFIG: 'chronos_bubble_config_v1',
  APP_NAME: 'chronos_app_name_v1',
};

// Calculate rank based on player level
export function calculateRank(level: number): PlayerRank {
  if (level >= 40) return 'Monarca de las Sombras';
  if (level >= 30) return 'Cazador Rango Nacional';
  if (level >= 25) return 'Rango S';
  if (level >= 18) return 'Rango A';
  if (level >= 12) return 'Rango B';
  if (level >= 7) return 'Rango C';
  if (level >= 4) return 'Rango D';
  return 'Rango E';
}

// Storage Helpers
export function loadTags(): Tag[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : INITIAL_TAGS;
  } catch (e) {
    return INITIAL_TAGS;
  }
}

export function saveTags(tags: Tag[]): void {
  localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
}

export function loadPresets(): TimerPreset[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRESETS);
    return data ? JSON.parse(data) : INITIAL_PRESETS;
  } catch (e) {
    return INITIAL_PRESETS;
  }
}

export function savePresets(presets: TimerPreset[]): void {
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
}

export function loadSessions(): TimerSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveSessions(sessions: TimerSession[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function loadProfile(): PlayerProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return INITIAL_PROFILE;
    const profile: PlayerProfile = JSON.parse(data);
    
    // Auto sync rank with level
    profile.rank = calculateRank(profile.level);
    return profile;
  } catch (e) {
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  profile.rank = calculateRank(profile.level);
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function loadQuests(): DailyQuest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return data ? JSON.parse(data) : INITIAL_QUESTS;
  } catch (e) {
    return INITIAL_QUESTS;
  }
}

export function saveQuests(quests: DailyQuest[]): void {
  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
}

export function loadShadows(): ShadowArmy[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHADOWS);
    return data ? JSON.parse(data) : INITIAL_SHADOWS;
  } catch (e) {
    return INITIAL_SHADOWS;
  }
}

export function saveShadows(shadows: ShadowArmy[]): void {
  localStorage.setItem(STORAGE_KEYS.SHADOWS, JSON.stringify(shadows));
}

export function loadAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
  } catch (e) {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function loadRecaps(): DayRecap[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECAPS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecaps(recaps: DayRecap[]): void {
  localStorage.setItem(STORAGE_KEYS.RECAPS, JSON.stringify(recaps));
}

export function loadDayTitle(): string {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAY_TITLE);
    return data || 'Progreso de la Jornada';
  } catch (e) {
    return 'Progreso de la Jornada';
  }
}

export function saveDayTitle(title: string): void {
  localStorage.setItem(STORAGE_KEYS.DAY_TITLE, title);
}

export function loadQuotes(): MotivationalQuote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
    return data ? JSON.parse(data) : INITIAL_QUOTES;
  } catch (e) {
    return INITIAL_QUOTES;
  }
}

export function saveQuotes(quotes: MotivationalQuote[]): void {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}

export function loadBubbleConfig(): BubbleConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUBBLE_CONFIG);
    return data ? JSON.parse(data) : DEFAULT_BUBBLE_CONFIG;
  } catch (e) {
    return DEFAULT_BUBBLE_CONFIG;
  }
}

export function saveBubbleConfig(config: BubbleConfig): void {
  localStorage.setItem(STORAGE_KEYS.BUBBLE_CONFIG, JSON.stringify(config));
}

export function loadAppName(): string {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APP_NAME);
    return data || 'CHRONOS SYSTEM';
  } catch (e) {
    return 'CHRONOS SYSTEM';
  }
}

export function saveAppName(appName: string): void {
  localStorage.setItem(STORAGE_KEYS.APP_NAME, appName);
  if (typeof document !== 'undefined') {
    document.title = `${appName} - Temporizador del Día & Solo Leveling RPG`;
  }
}




