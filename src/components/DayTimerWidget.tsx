import React, { useState, useEffect } from 'react';
import { Tag, TimerPreset, TimerType, MotivationalQuote, AmbientSoundId } from '../types';
import { DayTimeStats, formatSecondsToHHMMSS } from '../utils/dayTimer';
import { soundManager } from '../utils/audio';
import { ambientAudioEngine } from '../utils/ambientAudio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  Flame,
  Plus,
  ShieldCheck,
  Tag as TagIcon,
  Pencil,
  Check,
  X,
  Quote,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';

interface DayTimerWidgetProps {
  dayStats: DayTimeStats;
  dayTitle: string;
  onChangeDayTitle: (newTitle: string) => void;
  activeQuote?: MotivationalQuote | null;
  tags: Tag[];
  presets: TimerPreset[];
  activeSession: {
    title: string;
    tagId: string;
    durationSeconds: number;
    elapsedSeconds: number;
    isRunning: boolean;
    timerType: TimerType;
    isHighValue: boolean;
    xpEarned: number;
  } | null;
  ambientSound: AmbientSoundId;
  ambientVolume: number;
  onChangeAmbientSound: (sound: AmbientSoundId) => void;
  onChangeAmbientVolume: (vol: number) => void;
  onStartTimer: (title: string, tagId: string, durationMinutes: number, mode: TimerType, isHighValue: boolean) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onResetTimer: () => void;
  onCompleteTimer: () => void;
  onOpenHighValueModal: () => void;
}

export const DayTimerWidget: React.FC<DayTimerWidgetProps> = ({
  dayStats,
  dayTitle,
  onChangeDayTitle,
  activeQuote,
  tags,
  presets,
  activeSession,
  ambientSound,
  ambientVolume,
  onChangeAmbientSound,
  onChangeAmbientVolume,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onResetTimer,
  onCompleteTimer,
  onOpenHighValueModal,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(dayTitle);

  useEffect(() => {
    setEditedTitle(dayTitle);
  }, [dayTitle]);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      soundManager.playClickSound();
      onChangeDayTitle(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const getTag = (id: string) => tags.find((t) => t.id === id) || tags[0];

  // Active timer calculation
  const activeTag = activeSession ? getTag(activeSession.tagId) : null;
  
  let remainingTimeStr = '00:00';
  let progressPercent = 0;

  if (activeSession) {
    if (activeSession.timerType === 'stopwatch') {
      remainingTimeStr = formatSecondsToHHMMSS(activeSession.elapsedSeconds);
      progressPercent = (activeSession.elapsedSeconds % 60) * (100 / 60);
    } else {
      const remainingSecs = Math.max(0, activeSession.durationSeconds - activeSession.elapsedSeconds);
      remainingTimeStr = formatSecondsToHHMMSS(remainingSecs);
      progressPercent = activeSession.durationSeconds > 0
        ? (activeSession.elapsedSeconds / activeSession.durationSeconds) * 100
        : 0;
    }
  }

  // SVG Radial Progress math
  const strokeWidth = 8;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Active Motivational Quote Banner */}
      {activeQuote && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/50 shadow-lg shadow-purple-950/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 shrink-0">
            <Quote className="w-5 h-5 text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white italic line-clamp-2">
              "{activeQuote.quote}"
            </p>
            <p className="text-[10px] font-bold text-cyan-400 font-system mt-0.5">
              — {activeQuote.author}
            </p>
          </div>
        </div>
      )}
      {/* 1. BARRA ANIMADA DEL DÍA (24h Day Timer) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-system text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>TEMPORIZADOR PROGRESIVO DEL DÍA (24 HORAS)</span>
            </div>

            {/* Editable Title Section */}
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                    autoFocus
                    className="px-3 py-1 rounded-lg bg-slate-950 border-2 border-cyan-400 text-white font-system font-extrabold text-xl sm:text-2xl focus:outline-none"
                    placeholder="Escribe el nombre aquí..."
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
                    title="Guardar nombre"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                  <button
                    onClick={() => {
                      setEditedTitle(dayTitle);
                      setIsEditingTitle(false);
                    }}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-system text-white tracking-wide">
                    {dayTitle}
                  </h2>
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setIsEditingTitle(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                    title="Editar título de la jornada"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 capitalize mt-0.5">
              {dayStats.formattedDate} · <span className="font-mono text-cyan-300 font-semibold">{dayStats.formattedTime}</span>
            </p>
          </div>

          {/* Larger Midnight Countdown Pill */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/50 shadow-xl shadow-cyan-950/60 flex items-center gap-3.5 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/80 flex items-center justify-center text-cyan-400 border border-cyan-500/60 shadow-md">
              <RotateCcw className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-cyan-400 uppercase font-system font-bold tracking-wider mb-0.5">
                Reinicio del día en
              </p>
              <p className="text-xl sm:text-2xl font-black font-mono text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] tracking-tight">
                {String(dayStats.hoursRemaining).padStart(2, '0')}:
                {String(dayStats.minutesRemaining).padStart(2, '0')}:
                {String(dayStats.secondsRemainingInMin).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Fine High-Luminosity Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-medium">00:00 (Inicio)</span>
            <span className="text-cyan-300 font-bold font-system text-xs drop-shadow-[0_0_8px_rgba(6,182,212,0.9)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{dayStats.percentagePassed.toFixed(1)}% COMPLETADO DEL DÍA</span>
            </span>
            <span className="text-slate-400 font-medium">23:59 (Medianoche)</span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-slate-950 border border-cyan-400/60 p-[1px] overflow-visible shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#06b6d4_0%,#3b82f6_35%,#a855f7_70%,#06b6d4_100%)] animate-shimmer-sweep glow-progress-bar-fine transition-all duration-1000 relative"
              style={{ width: `${Math.max(1.5, dayStats.percentagePassed)}%` }}
            >
              {/* Inner Light Sheen Ray */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-white/80 rounded-full pointer-events-none" />

              {/* Fine Pulsing Luminous Lead Orb Head */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full animate-orb-head-fine z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-cyan-300/80 font-mono text-right flex items-center justify-end gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>El tiempo avanza progresivamente y se reiniciará automáticamente a las 12:00 AM.</span>
          </p>
        </div>
      </div>

      {/* 2. ACTIVE TIMER CONTAINER */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-900/60 shadow-xl relative overflow-hidden">
        {activeSession ? (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            {/* Tag and mode badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5"
                style={{
                  backgroundColor: `${activeTag?.color}20`,
                  borderColor: activeTag?.color,
                  color: activeTag?.color,
                }}
              >
                <TagIcon className="w-3.5 h-3.5" />
                {activeTag?.name}
              </span>

              {activeSession.isHighValue && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Alto Valor ({activeTag?.xpMultiplier || 2.0}x XP)
                </span>
              )}

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800">
                Modo: {activeSession.timerType.toUpperCase()}
              </span>
            </div>

            {/* Session Title */}
            <h3 className="text-xl sm:text-2xl font-bold font-system text-white max-w-md">
              {activeSession.title}
            </h3>

            {/* SVG Circle Progress & Digital Timer */}
            <div className="relative w-60 h-60 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  className="stroke-slate-950"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  className="transition-all duration-500 ease-out"
                  stroke={activeSession.isHighValue ? '#06b6d4' : '#3b82f6'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Central Digital Time */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tighter drop-shadow-md">
                  {remainingTimeStr}
                </span>
                <div className="flex items-center gap-1 mt-2 text-xs font-mono text-cyan-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{activeSession.xpEarned} XP Acumulados</span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2 w-full max-w-xs">
              {activeSession.isRunning ? (
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    onPauseTimer();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-system font-bold text-xs shadow-lg shadow-amber-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSAR</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    onResumeTimer();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-system font-bold text-xs shadow-lg shadow-cyan-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>REANUDAR</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playClickSound();
                  onResetTimer();
                }}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar Temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onCompleteTimer();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-system font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>FINALIZAR</span>
              </button>
            </div>

            {/* Ambient Sound Selector Control Bar */}
            <div className="w-full max-w-md p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-system font-bold text-cyan-300 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-purple-400 animate-pulse" />
                  AUDIO AMBIENTAL DE FONDO
                </span>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(e) => onChangeAmbientVolume(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    title="Volumen del sonido ambiental"
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-[11px] font-system font-bold">
                {[
                  { id: 'none' as const, label: 'Silencio', icon: '🔇' },
                  { id: 'rain' as const, label: 'Lluvia', icon: '🌧️' },
                  { id: 'rpg' as const, label: 'RPG Pad', icon: '🎶' },
                  { id: 'cyber' as const, label: 'Cyber Hum', icon: '⚡' },
                  { id: 'sands' as const, label: 'Arenas', icon: '⏳' },
                ].map((item) => {
                  const isSelected = ambientSound === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundManager.playClickSound();
                        onChangeAmbientSound(item.id);
                      }}
                      className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 truncate ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="truncate w-full text-center text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Empty Active Timer state with High-Value Prompt */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-system text-white">
                No hay un temporizador activo en este momento
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Selecciona una de tus actividades preconfiguradas o inicia una inversión de tiempo de alto valor.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  onOpenHighValueModal();
                }}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-system font-extrabold text-xs tracking-wider shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>INICIAR TIEMPO DE ALTO VALOR</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. PRESETS TEMPORIZADORES PRECONFIGURADOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-system text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Temporizadores Rápido por Actividad</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map((preset) => {
            const tag = getTag(preset.tagId);
            return (
              <div
                key={preset.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border truncate max-w-[140px]"
                      style={{
                        backgroundColor: `${tag?.color}20`,
                        borderColor: tag?.color,
                        color: tag?.color,
                      }}
                    >
                      {tag?.name}
                    </span>
                    {preset.targetHighValue && (
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">
                        Alto Valor
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="font-mono text-slate-400">
                    {preset.defaultDurationMinutes > 0
                      ? `${preset.defaultDurationMinutes} min (${preset.timerType})`
                      : 'Cronómetro'}
                  </span>

                  <button
                    onClick={() => {
                      soundManager.playTimerStartSound();
                      onStartTimer(
                        preset.title,
                        preset.tagId,
                        preset.defaultDurationMinutes,
                        preset.timerType,
                        preset.targetHighValue
                      );
                    }}
                    className="p-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 hover:border-cyan-500 transition-all cursor-pointer flex items-center gap-1 font-system text-[11px] font-bold"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>INICIAR</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
