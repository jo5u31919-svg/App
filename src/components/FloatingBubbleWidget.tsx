import React, { useState } from 'react';
import { BubbleConfig, Tag } from '../types';
import { DayTimeStats, formatSecondsToHHMMSS } from '../utils/dayTimer';
import { soundManager } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  RotateCcw, 
  Play, 
  Pause, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Zap,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface FloatingBubbleWidgetProps {
  config: BubbleConfig;
  dayStats: DayTimeStats;
  activeSession: {
    title: string;
    tagId: string;
    durationSeconds: number;
    elapsedSeconds: number;
    isRunning: boolean;
    timerType: string;
    isHighValue: boolean;
  } | null;
  tags: Tag[];
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onOpenSettings: () => void;
}

export const FloatingBubbleWidget: React.FC<FloatingBubbleWidgetProps> = ({
  config,
  dayStats,
  activeSession,
  tags,
  onPauseTimer,
  onResumeTimer,
  onOpenSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState(!config.autoHidePeek);

  if (!config.enabled) return null;

  // Determine what to display
  let isTimerActive = false;
  let title = 'Reinicio 12:00 AM';
  let countdownText = `${String(dayStats.hoursRemaining).padStart(2, '0')}:${String(dayStats.minutesRemaining).padStart(2, '0')}:${String(dayStats.secondsRemainingInMin).padStart(2, '0')}`;
  let isHighValue = false;
  let progressPercent = dayStats.percentagePassed;

  if (
    (config.displayMode === 'active_timer' || (config.displayMode === 'auto' && activeSession)) &&
    activeSession
  ) {
    isTimerActive = true;
    title = activeSession.title;
    isHighValue = activeSession.isHighValue;

    if (activeSession.timerType === 'stopwatch') {
      countdownText = formatSecondsToHHMMSS(activeSession.elapsedSeconds);
      progressPercent = (activeSession.elapsedSeconds % 60) * (100 / 60);
    } else {
      const rem = Math.max(0, activeSession.durationSeconds - activeSession.elapsedSeconds);
      countdownText = formatSecondsToHHMMSS(rem);
      progressPercent = activeSession.durationSeconds > 0
        ? (activeSession.elapsedSeconds / activeSession.durationSeconds) * 100
        : 0;
    }
  }

  // Theme colors
  const getThemeStyles = () => {
    switch (config.theme) {
      case 'purple':
        return {
          border: 'border-purple-500/80',
          bg: 'bg-slate-950/90',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
          text: 'text-purple-300',
          badgeBg: 'bg-purple-950 border-purple-500',
          handleBg: 'bg-purple-600',
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/80',
          bg: 'bg-slate-950/90',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
          text: 'text-emerald-300',
          badgeBg: 'bg-emerald-950 border-emerald-500',
          handleBg: 'bg-emerald-600',
        };
      case 'amber':
        return {
          border: 'border-amber-500/80',
          bg: 'bg-slate-950/90',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
          text: 'text-amber-300',
          badgeBg: 'bg-amber-950 border-amber-500',
          handleBg: 'bg-amber-600',
        };
      default: // cyan
        return {
          border: 'border-cyan-400/80',
          bg: 'bg-slate-950/90',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
          text: 'text-cyan-300',
          badgeBg: 'bg-cyan-950 border-cyan-500',
          handleBg: 'bg-cyan-500',
        };
    }
  };

  const theme = getThemeStyles();
  const isRight = config.dockPosition === 'right';

  return (
    <div
      className={`fixed top-1/3 z-50 transition-all duration-300 ${
        isRight ? 'right-0' : 'left-0'
      }`}
      style={{ opacity: config.opacity }}
      onMouseEnter={() => {
        if (config.autoHidePeek) setIsExpanded(true);
      }}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          /* EXPANDED FLOATING BUBBLE */
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: isRight ? 50 : -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: isRight ? 50 : -50 }}
            className={`relative p-3.5 sm:p-4 rounded-2xl ${theme.bg} border-2 ${theme.border} ${theme.glow} backdrop-blur-xl shadow-2xl flex items-center gap-3 group max-w-xs`}
          >
            {/* Collapse Side Button */}
            <button
              onClick={() => {
                soundManager.playClickSound();
                setIsExpanded(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Esconder en el borde"
            >
              {isRight ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Bubble Icon & Progress Circle */}
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
              <Clock className={`w-5 h-5 ${theme.text} animate-pulse`} />
              {isHighValue && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                </div>
              )}
            </div>

            {/* Title & Countdown */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-system font-bold uppercase tracking-wider text-slate-400 truncate">
                  {title}
                </span>
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    onOpenSettings();
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Configurar Burbuja"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`text-lg sm:text-xl font-black font-mono tracking-tight ${theme.text}`}>
                {countdownText}
              </div>
            </div>

            {/* Play/Pause Control if timer active */}
            {isTimerActive && activeSession && (
              <div className="shrink-0">
                {activeSession.isRunning ? (
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      onPauseTimer();
                    }}
                    className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md cursor-pointer transition-transform active:scale-95"
                    title="Pausar"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      onResumeTimer();
                    }}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md cursor-pointer transition-transform active:scale-95"
                    title="Reanudar"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          /* MINIMIZED PEEKING TAB HANDLE (Escondido en el borde, desplegable al toque/roce) */
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              soundManager.playClickSound();
              setIsExpanded(true);
            }}
            className={`p-2.5 ${isRight ? 'rounded-l-2xl border-l-2 border-y-2' : 'rounded-r-2xl border-r-2 border-y-2'} ${theme.bg} ${theme.border} ${theme.glow} backdrop-blur-md shadow-2xl flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform`}
            title="Toca o roza para desplegar el conteo regresivo"
          >
            {isRight && <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />}
            
            <div className="flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${theme.text} animate-pulse`} />
              <span className={`text-xs font-mono font-bold ${theme.text}`}>
                {countdownText.split(' ')[0]}
              </span>
            </div>

            {!isRight && <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
