import React from 'react';
import { PlayerProfile, DailyQuest } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  Sparkles, 
  Flame, 
  Award, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Zap,
  Swords,
  Brain,
  Activity,
  Heart,
  Target,
  Pencil,
  Check,
  X
} from 'lucide-react';

interface SoloLevelingTabProps {
  profile: PlayerProfile;
  quests: DailyQuest[];
  onUpgradeStat: (statKey: keyof PlayerProfile['stats']) => void;
  onClaimQuestReward: (questId: string) => void;
  onUpdatePlayerName?: (newName: string, newTitle?: string) => void;
}

export const SoloLevelingTab: React.FC<SoloLevelingTabProps> = ({
  profile,
  quests,
  onUpgradeStat,
  onClaimQuestReward,
  onUpdatePlayerName,
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editedName, setEditedName] = React.useState(profile.name);
  const [editedTitle, setEditedTitle] = React.useState(profile.title);

  React.useEffect(() => {
    setEditedName(profile.name);
    setEditedTitle(profile.title);
  }, [profile.name, profile.title]);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editedName.trim() && onUpdatePlayerName) {
      soundManager.playClickSound();
      onUpdatePlayerName(editedName.trim(), editedTitle.trim());
    }
    setIsEditingName(false);
  };

  const statConfig = [
    {
      key: 'focus' as const,
      name: 'Fuerza de Enfoque',
      desc: 'Potencia el XP obtenido en Pomodoros y Trabajo Profundo',
      icon: Swords,
      color: 'text-cyan-400',
    },
    {
      key: 'learning' as const,
      name: 'Inteligencia (Cursos)',
      desc: 'Aumenta el rendimiento en temporizadores de Estudio y Lectura',
      icon: Brain,
      color: 'text-blue-400',
    },
    {
      key: 'execution' as const,
      name: 'Agilidad de Ejecución',
      desc: 'Reduce el cansancio percibido y agiliza las entregas',
      icon: Activity,
      color: 'text-emerald-400',
    },
    {
      key: 'rest' as const,
      name: 'Vitalidad (Descanso)',
      desc: 'Optimiza los intervalos de descanso y recuperación',
      icon: Heart,
      color: 'text-red-400',
    },
    {
      key: 'consistency' as const,
      name: 'Voluntad (Racha)',
      desc: 'Refuerza la protección de la racha diaria contra reseteos',
      icon: Flame,
      color: 'text-amber-400',
    },
  ];

  const handleClaim = (questId: string) => {
    soundManager.playLevelUpSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaimQuestReward(questId);
  };

  return (
    <div className="space-y-8">
      {/* 1. PLAYER SYSTEM CARD (Estilo Interfaz de Cazador Solo Leveling) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/50 relative overflow-hidden space-y-6">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/30 pb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-cyan-400 font-system text-xs font-bold tracking-wider mb-1">
              <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>VENTANA DEL SISTEMA DE CAZADOR</span>
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex flex-col gap-2 mt-2 max-w-md">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    autoFocus
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border-2 border-cyan-400 font-system text-lg font-black text-white focus:outline-none w-full shadow-inner shadow-cyan-500/20"
                    placeholder="Nombre del Cazador (ej. Sung Jin-Woo)..."
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold cursor-pointer transition-transform active:scale-95 shrink-0"
                    title="Guardar Nombre de Cazador"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(profile.name);
                      setEditedTitle(profile.title);
                      setIsEditingName(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer shrink-0"
                    title="Cancelar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  placeholder="Título de Cazador (ej. Monarca de las Sombras)..."
                />
              </form>
            ) : (
              <div className="flex items-center gap-2.5 group">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black font-system text-white tracking-wide">
                      {profile.name}
                    </h2>
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setIsEditingName(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
                      title="Editar / Configurar Nombre de Cazador"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">{profile.title}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-cyan-950 border-2 border-cyan-400 text-cyan-300 font-system font-bold text-sm shadow-md shadow-cyan-500/30">
              {profile.rank}
            </div>
            <div className="px-4 py-2 rounded-xl bg-purple-950 border-2 border-purple-400 text-purple-300 font-system font-bold text-sm shadow-md shadow-purple-500/30">
              NIVEL {profile.level}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Puntos de Experiencia (XP)</span>
            <span className="text-cyan-300 font-bold font-system">
              {profile.xp} / {profile.xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-[0_0_10px_#06b6d4]"
              style={{
                width: `${Math.min(100, (profile.xp / profile.xpToNextLevel) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 font-system text-[10px] uppercase">Racha de Días</p>
            <p className="text-lg font-bold font-mono text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4" />
              {profile.currentStreakDays}d
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 font-system text-[10px] uppercase">Horas Alto Valor</p>
            <p className="text-lg font-bold font-mono text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
              <Zap className="w-4 h-4" />
              {profile.totalHighValueHours.toFixed(1)}h
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 font-system text-[10px] uppercase">Puntos Disponibles</p>
            <p className="text-lg font-bold font-mono text-purple-400 flex items-center justify-center gap-1 mt-0.5">
              <Plus className="w-4 h-4" />
              {profile.availableStatPoints}
            </p>
          </div>
        </div>
      </div>

      {/* 2. DISTRIBUCIÓN DE ATRIBUTOS DEL JUGADOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-system text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Estadísticas y Atributos de Cazador</span>
            </h3>
            <p className="text-xs text-slate-400">
              Distribuye tus puntos de atributo para mejorar tus capacidades de productividad.
            </p>
          </div>

          {profile.availableStatPoints > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-500 animate-pulse">
              ¡{profile.availableStatPoints} Puntos por Asignar!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {statConfig.map((stat) => {
            const Icon = stat.icon;
            const value = profile.stats[stat.key];
            return (
              <div
                key={stat.key}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{stat.name}</h4>
                      <span className="text-sm font-extrabold font-mono text-cyan-300">
                        {value}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{stat.desc}</p>
                  </div>
                </div>

                <button
                  disabled={profile.availableStatPoints <= 0}
                  onClick={() => {
                    soundManager.playClickSound();
                    onUpgradeStat(stat.key);
                  }}
                  className="p-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:border-cyan-500 disabled:opacity-30 disabled:hover:border-cyan-800 transition-all cursor-pointer shrink-0"
                  title="Aumentar Atributo"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MISIONES DIARIAS DEL SISTEMA */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold font-system text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>Misiones Diarias del Sistema</span>
          </h3>
          <p className="text-xs text-slate-400">
            Completa tus misiones antes de la medianoche (12:00 AM) para ganar recompensas épicas.
          </p>
        </div>

        <div className="space-y-3">
          {quests.map((quest) => {
            const isFinished = quest.currentAmount >= quest.targetAmount;
            return (
              <div
                key={quest.id}
                className={`p-5 rounded-2xl border transition-all ${
                  quest.claimed
                    ? 'bg-slate-950/50 border-slate-900 opacity-60'
                    : isFinished
                    ? 'bg-cyan-950/40 border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-system font-bold text-cyan-400 uppercase tracking-wider">
                      MISIÓN DIARIA
                    </span>
                    <h4 className="text-sm font-bold text-white">{quest.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{quest.description}</p>
                  </div>

                  <div className="shrink-0">
                    {quest.claimed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-500 border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Completada
                      </span>
                    ) : isFinished ? (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-system font-bold text-xs shadow-lg shadow-cyan-500/30 cursor-pointer animate-pulse"
                      >
                        RECLAMAR RECOMPENSA (+{quest.rewardXp} XP)
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-cyan-300 font-semibold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                        {quest.currentAmount} / {quest.targetAmount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (quest.currentAmount / quest.targetAmount) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
