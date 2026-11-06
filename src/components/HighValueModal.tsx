import React, { useState } from 'react';
import { Tag, TimerType } from '../types';
import { soundManager } from '../utils/audio';
import { Sparkles, Clock, Target, Play, X, ShieldAlert, Zap } from 'lucide-react';

interface HighValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onStartHighValueTimer: (title: string, tagId: string, durationMinutes: number, mode: TimerType) => void;
}

export const HighValueModal: React.FC<HighValueModalProps> = ({
  isOpen,
  onClose,
  tags,
  onStartHighValueTimer,
}) => {
  const highValueTags = tags.filter((t) => t.isHighValue);
  const [selectedTagId, setSelectedTagId] = useState<string>(
    highValueTags[0]?.id || tags[0]?.id || ''
  );
  const [customTitle, setCustomTitle] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [timerMode, setTimerMode] = useState<TimerType>('countdown');

  if (!isOpen) return null;

  const currentTag = tags.find((t) => t.id === selectedTagId) || tags[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playTimerStartSound();
    const titleToUse = customTitle.trim() || `Inversión de Alto Valor: ${currentTag?.name || 'Enfoque'}`;
    onStartHighValueTimer(titleToUse, selectedTagId, durationMinutes, timerMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-cyan-500/70 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-blue-950 to-purple-950 p-5 border-b border-cyan-500/40 relative">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-cyan-400 font-system text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>SISTEMA DE ALTO VALOR DE PRODUCTIVIDAD</span>
          </div>
          <h2 className="text-xl font-bold font-system text-white">
            ¿En qué vas a invertir tu tiempo hoy?
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Las actividades de alto valor otorgan <strong className="text-cyan-300">XP x2.0</strong> y potencian tu nivel en el Sistema.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tag selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-system">
              1. Selecciona la Categoría de Alto Valor
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClickSound();
                    setSelectedTagId(tag.id);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTagId === tag.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{tag.name}</p>
                    {tag.isHighValue && (
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {tag.xpMultiplier}x XP
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Goal title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-system">
              2. Nombre / Objetivo Específico
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={`Ej: Avanzar 2 módulos del Curso / Diseñar boceto`}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Duration & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-system">
                3. Tiempo Objetivo
              </label>
              <div className="flex items-center gap-2">
                {[25, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      soundManager.playClickSound();
                      setDurationMinutes(mins);
                    }}
                    className={`flex-1 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                      durationMinutes === mins
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-system">
                Modo Temporizador
              </label>
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTimerMode('countdown')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    timerMode === 'countdown'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cuenta Reg.
                </button>
                <button
                  type="button"
                  onClick={() => setTimerMode('pomodoro')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    timerMode === 'pomodoro'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pomodoro
                </button>
              </div>
            </div>
          </div>

          {/* Bonus pill summary */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-mono">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Multiplicador Activo:</span>
            </div>
            <span className="font-bold font-system text-cyan-400 text-sm">
              +{((currentTag?.xpMultiplier || 1.5) * 100 - 100).toFixed(0)}% BONUS XP
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-system font-extrabold text-sm tracking-wider shadow-lg shadow-cyan-500/30 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>INICIAR TEMPORIZADOR DE ALTO VALOR</span>
          </button>
        </form>
      </div>
    </div>
  );
};
