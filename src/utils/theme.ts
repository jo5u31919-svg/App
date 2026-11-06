import { AppThemeId, AppThemeConfig } from '../types';

export const APP_THEMES: Record<AppThemeId, AppThemeConfig> = {
  monarch_purple: {
    id: 'monarch_purple',
    name: 'Monarca de las Sombras',
    subtitle: 'Estilo Canónico Solo Leveling',
    description: 'Aura mística púrpura y destellos violáceos del Rey de los Muertos.',
    primaryHex: '#a855f7',
    secondaryHex: '#06b6d4',
    accentHex: '#c084fc',
    glowRgb: '168, 85, 247',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    gradientClass: 'from-purple-500 via-cyan-400 to-purple-600',
    previewColors: ['#a855f7', '#06b6d4', '#c084fc', '#581c87'],
  },
  cyber_cyan: {
    id: 'cyber_cyan',
    name: 'Cyber Neón Cyan',
    subtitle: 'Interfaz Futurista Hiper-Luminosa',
    description: 'Azul cian neón de alta tensión, circuitos cibernéticos y energía pura.',
    primaryHex: '#06b6d4',
    secondaryHex: '#3b82f6',
    accentHex: '#38bdf8',
    glowRgb: '6, 182, 212',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-400',
    gradientClass: 'from-cyan-400 via-blue-400 to-purple-500',
    previewColors: ['#06b6d4', '#3b82f6', '#38bdf8', '#083344'],
  },
  gold_rank: {
    id: 'gold_rank',
    name: 'Cazador Rango S (Dorado)',
    subtitle: 'Dominio de Oro & Gloria',
    description: 'Ámbar brillante, oro solar y aura dorada reservada para cazadores de élite.',
    primaryHex: '#f59e0b',
    secondaryHex: '#fbbf24',
    accentHex: '#f97316',
    glowRgb: '245, 158, 11',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-400',
    gradientClass: 'from-amber-400 via-orange-400 to-yellow-300',
    previewColors: ['#f59e0b', '#fbbf24', '#f97316', '#451a03'],
  },
  shadow_emerald: {
    id: 'shadow_emerald',
    name: 'Código Esmeralda Matrix',
    subtitle: 'Matriz Bio-Tecnológica',
    description: 'Verde esmeralda neón y código cibernético de la red de cazadores.',
    primaryHex: '#10b981',
    secondaryHex: '#34d399',
    accentHex: '#06b6d4',
    glowRgb: '16, 185, 129',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    gradientClass: 'from-emerald-400 via-teal-400 to-cyan-400',
    previewColors: ['#10b981', '#34d399', '#06b6d4', '#064e3b'],
  },
  crimson_blood: {
    id: 'crimson_blood',
    name: 'Sed de Sangre Carmesí',
    subtitle: 'Furia de Combate Escarlata',
    description: 'Rojo carmesí de batalla, destellos rubí y aura de modo frenesí.',
    primaryHex: '#ef4444',
    secondaryHex: '#f43f5e',
    accentHex: '#fb7185',
    glowRgb: '239, 68, 68',
    badgeBg: 'bg-red-950/80 text-red-300 border-red-500',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    gradientClass: 'from-red-500 via-rose-400 to-amber-500',
    previewColors: ['#ef4444', '#f43f5e', '#fb7185', '#450a0a'],
  },
  midnight_abyss: {
    id: 'midnight_abyss',
    name: 'Abismo de Noche Profunda',
    subtitle: 'Oscuridad & Enfoque Nocturno',
    description: 'Negro abisal con neón azul ultramar para la concentración total.',
    primaryHex: '#3b82f6',
    secondaryHex: '#6366f1',
    accentHex: '#60a5fa',
    glowRgb: '59, 130, 246',
    badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-500',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    gradientClass: 'from-blue-500 via-indigo-400 to-cyan-400',
    previewColors: ['#3b82f6', '#6366f1', '#60a5fa', '#172554'],
  },
  prince_sands: {
    id: 'prince_sands',
    name: 'Arenas del Tiempo (Prince of Persia)',
    subtitle: 'Reloj Místico & Polvo Dorado',
    description: 'Oro persa resplandeciente, polvo de arena místico y ralentización del tiempo.',
    primaryHex: '#f59e0b',
    secondaryHex: '#d97706',
    accentHex: '#fef08a',
    glowRgb: '245, 158, 11',
    badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-400 shadow-amber-500/30',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-300',
    gradientClass: 'from-amber-400 via-yellow-300 to-amber-600',
    previewColors: ['#f59e0b', '#d97706', '#fef08a', '#78350f'],
  },
};

const STORAGE_KEY_THEME = 'chronos_app_theme_v1';

export function loadAppTheme(): AppThemeId {
  try {
    const data = localStorage.getItem(STORAGE_KEY_THEME);
    if (data && data in APP_THEMES) {
      return data as AppThemeId;
    }
  } catch (e) {
    // fallback
  }
  return 'cyber_cyan';
}

export function saveAppTheme(themeId: AppThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
    applyAppTheme(themeId);
  } catch (e) {
    // fallback
  }
}

export function applyAppTheme(themeId: AppThemeId): void {
  const theme = APP_THEMES[themeId] || APP_THEMES.cyber_cyan;
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', themeId);
  root.style.setProperty('--theme-primary', theme.primaryHex);
  root.style.setProperty('--theme-secondary', theme.secondaryHex);
  root.style.setProperty('--theme-accent', theme.accentHex);
  root.style.setProperty('--theme-glow-rgb', theme.glowRgb);
}
