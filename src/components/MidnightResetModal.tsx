import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Flame, Clock, CheckCircle2, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MidnightResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayHighValueHours: number;
  todayTotalFocusHours: number;
  completedQuestsCount: number;
  streakDays: number;
}

export const MidnightResetModal: React.FC<MidnightResetModalProps> = ({
  isOpen,
  onClose,
  todayHighValueHours,
  todayTotalFocusHours,
  completedQuestsCount,
  streakDays,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border-2 border-cyan-500/80 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden"
        >
          {/* Top Neon Header */}
          <div className="bg-gradient-to-r from-cyan-950 via-blue-950 to-purple-950 p-6 border-b border-cyan-500/40 text-center relative">
            <button
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse-glow">
              <Clock className="w-8 h-8 text-cyan-300" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold font-system bg-cyan-950 border border-cyan-400 text-cyan-300 mb-2">
              SYSTEM ALERT // 12:00 AM
            </span>
            <h2 className="font-system text-xl font-bold text-white tracking-wide">
              REINICIO DE JORNADA COMPLETADO
            </h2>
            <p className="text-xs text-cyan-200/80 mt-1">
              El temporizador del día se ha reiniciado. ¡Comienza una nueva jornada de cazador!
            </p>
          </div>

          {/* Body stats summary */}
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-900/50 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-system">
                Resumen de la Jornada Anterior
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-lg font-bold font-mono">{todayTotalFocusHours.toFixed(1)}h</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Tiempo Enfoque</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-cyan-900/50">
                  <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-lg font-bold font-mono">{todayHighValueHours.toFixed(1)}h</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Alto Valor</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-amber-900/50">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-lg font-bold font-mono">{streakDays}d</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Racha Actual</span>
                </div>
              </div>
            </div>

            {/* Renovation Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-cyan-300 mb-0.5">Misiones Diarias Renovadas</p>
                <p className="text-slate-300 text-[11px]">
                  Tus misiones diarias del Sistema han sido reseteadas. Completa tus objetivos hoy para ganar más XP y puntos de atributos.
                </p>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-system font-bold text-sm tracking-wider shadow-lg shadow-cyan-500/25 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>INICIAR NUEVA JORNADA</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
