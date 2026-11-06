import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/audio';
import { Shield, Sparkles, Zap, CheckCircle2, Crown, Lock, Eye } from 'lucide-react';

interface SystemStartupOverlayProps {
  onComplete: () => void;
  appName: string;
  playerName: string;
  playerRank: string;
  playerLevel: number;
}

export const SystemStartupOverlay: React.FC<SystemStartupOverlayProps> = ({
  onComplete,
  appName,
  playerName,
  playerRank,
  playerLevel,
}) => {
  const [phase, setPhase] = useState<number>(0);

  const logs = [
    { title: `INICIALIZANDO ${appName.toUpperCase()} 24H`, desc: 'Sincronizando reloj progresivo del día (24 Horas)...', color: '#06b6d4' },
    { title: 'CALIBRANDO REINICIO DE MEDIANOCHE', desc: 'Reseteo automático a las 12:00 AM y misiones diarias...', color: '#3b82f6' },
    { title: 'AUTENTICANDO PERFIL DE CAZADOR', desc: `${playerName} · ${playerRank} (Nivel ${playerLevel})`, color: '#a855f7' },
    { title: 'ACTIVANDO ACTIVIDADES DE ALTO VALOR', desc: 'Dominio del Monarca activado. Acceso concedido al Sistema...', color: '#10b981' },
  ];

  useEffect(() => {
    // 0ms: Pitch Total Dark
    const t0 = setTimeout(() => {
      soundManager.playTimerStartSound();
      setPhase(1); // First light awakening
    }, 700);

    const t1 = setTimeout(() => { setPhase(2); soundManager.playClickSound(); }, 1400);
    const t2 = setTimeout(() => { setPhase(3); soundManager.playClickSound(); }, 2100);
    const t3 = setTimeout(() => { setPhase(4); soundManager.playClickSound(); }, 2800);
    const t4 = setTimeout(() => { setPhase(5); soundManager.playLevelUpSound(); }, 3500);
    const tEnd = setTimeout(() => { onComplete(); }, 4400);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.15, filter: 'brightness(2) blur(10px)' }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black selection:bg-cyan-500 selection:text-slate-950 overflow-hidden"
      >
        {/* TOTAL PITCH BLACK BACKGROUND AT START */}
        <div className="absolute inset-0 bg-black pointer-events-none" />

        {/* GRADUAL SYSTEM ILLUMINATION LIGHT BEAM (Gradualmente ilumina la pantalla) */}
        <motion.div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000"
          animate={{
            opacity: phase === 0 ? 0 : phase === 1 ? 0.2 : phase === 2 ? 0.4 : phase === 3 ? 0.6 : 0.85,
            scale: phase === 0 ? 0.5 : phase === 1 ? 0.8 : 1.1,
          }}
          style={{
            background: phase <= 1 ? '#06b6d4' : phase === 2 ? '#3b82f6' : phase === 3 ? '#a855f7' : '#10b981'
          }}
        />

        {/* Subtle Cyber Grid Lines appearing as light grows */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
          animate={{ opacity: phase === 0 ? 0 : 0.6 }}
          transition={{ duration: 1 }}
        />

        {/* PHASE 0: PITCH DARK INITIAL EYE SPARK */}
        {phase === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.5], scale: [0.5, 1, 0.9] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="flex flex-col items-center gap-3 text-center text-cyan-400 font-mono text-xs z-10"
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_#06b6d4] animate-ping" />
            <span className="tracking-[0.3em] font-system text-slate-500 uppercase">
              [ SISTEMA EN ESPERA DE DESPERTARES... ]
            </span>
          </motion.div>
        ) : (
          /* PHASE 1 TO 5: GRADUALLY ILLUMINATING SYSTEM WINDOW */
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`relative w-full max-w-lg bg-black/95 border-2 rounded-3xl p-6 sm:p-8 space-y-6 overflow-hidden backdrop-blur-3xl transition-all duration-700 ${
              phase >= 4
                ? 'border-cyan-400 shadow-[0_0_90px_rgba(6,182,212,0.6)]'
                : 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
            }`}
          >
            {/* Top Resplendent Neon Emblem (Se ilumina gradualmente) */}
            <div className="text-center relative space-y-3">
              <motion.div 
                animate={{ 
                  scale: phase >= 4 ? [1, 1.1, 1] : 1,
                  filter: phase >= 4 
                    ? ['drop-shadow(0 0 25px #06b6d4)', 'drop-shadow(0 0 45px #a855f7)', 'drop-shadow(0 0 25px #06b6d4)'] 
                    : 'drop-shadow(0 0 10px #06b6d4)'
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-22 h-22 mx-auto flex items-center justify-center"
              >
                <div className={`w-20 h-20 rounded-2xl bg-black border-2 transition-all duration-500 flex items-center justify-center ${
                  phase >= 4 ? 'border-cyan-300 shadow-[0_0_50px_#06b6d4]' : 'border-cyan-500/60 shadow-[0_0_20px_#06b6d4]'
                }`}>
                  <Crown className={`w-11 h-11 transition-all duration-500 ${
                    phase >= 4 ? 'text-white drop-shadow-[0_0_20px_#06b6d4]' : 'text-cyan-400'
                  }`} />
                </div>
              </motion.div>

              <div className="space-y-1">
                <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold font-system bg-black border border-cyan-400 text-cyan-300 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  AVISO DE DESPERTARES DEL SISTEMA
                </span>
                <h1 className="font-system text-2xl sm:text-3xl font-black text-white tracking-[0.15em] uppercase drop-shadow-[0_0_25px_#06b6d4]">
                  {appName}
                </h1>
              </div>
            </div>

            {/* Telemetry Items (Resplandecen a medida que avanzan los pasos) */}
            <div className="p-4 rounded-2xl bg-black border border-slate-900 font-mono text-xs space-y-3.5 min-h-[200px] flex flex-col justify-center shadow-2xl">
              {logs.map((log, index) => {
                const stepNumber = index + 1;
                const isDone = phase > stepNumber;
                const isCurrent = phase === stepNumber;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: isDone || isCurrent ? 1 : 0.2, 
                      x: 0,
                      scale: isCurrent ? 1.03 : 1 
                    }}
                    transition={{ duration: 0.4 }}
                    className={`flex items-start justify-between gap-3 p-2.5 rounded-xl transition-all duration-500 ${
                      isDone
                        ? 'bg-slate-950 border border-slate-800 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : isCurrent
                        ? 'bg-cyan-950/60 border-2 border-cyan-400 text-white shadow-[0_0_30px_#06b6d4] ring-2 ring-cyan-400/40'
                        : 'bg-black border border-slate-950 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_10px_#06b6d4]" />
                        ) : isCurrent ? (
                          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin drop-shadow-[0_0_15px_#38bdf8]" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-800" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`font-system font-bold text-xs tracking-wider transition-colors ${
                          isCurrent
                            ? 'text-cyan-300 drop-shadow-[0_0_15px_#06b6d4]'
                            : isDone
                            ? 'text-white'
                            : 'text-slate-700'
                        }`}>
                          {log.title}
                        </p>
                        <p className={`text-[11px] truncate ${
                          isCurrent
                            ? 'text-white font-bold animate-pulse'
                            : isDone
                            ? 'text-cyan-200/90'
                            : 'text-slate-700'
                        }`}>
                          {log.desc}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border shrink-0 transition-all duration-300 ${
                        isDone
                          ? 'bg-black border-cyan-400 text-cyan-300 shadow-[0_0_12px_#06b6d4]'
                          : isCurrent
                          ? 'bg-cyan-500 text-slate-950 border-white font-black shadow-[0_0_25px_#06b6d4] animate-pulse'
                          : 'bg-black border-slate-950 text-slate-800'
                      }`}
                    >
                      {isDone ? '✓ ACTIVADO' : isCurrent ? 'CARGANDO...' : 'EN ESPERA'}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Glowing Loading Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1 font-system">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 font-bold">ILUMINANDO SISTEMA</span>
                </span>
                <span className="text-cyan-300 font-black font-system text-base drop-shadow-[0_0_12px_#06b6d4]">
                  {Math.min(100, Math.round(((Math.max(0, phase - 1)) / 4) * 100))}%
                </span>
              </div>

              <div className="w-full h-3.5 rounded-full bg-black border-2 border-cyan-400 p-0.5 overflow-hidden shadow-[0_0_25px_#06b6d4]">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#06b6d4_0%,#3b82f6_50%,#a855f7_100%)] glow-progress-bar-fine"
                  animate={{ width: `${((Math.max(0, phase - 1)) / 4) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Fast-forward Skip */}
            <button
              onClick={() => {
                soundManager.playClickSound();
                onComplete();
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-cyan-300 font-mono tracking-wider transition-colors cursor-pointer py-1"
            >
              [ Toca aquí para Omitir e Ingresar al Sistema ]
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
