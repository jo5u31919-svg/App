import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { soundManager } from '../utils/audio';
import { Bot, Sparkles, Send, X, Shield, RefreshCw } from 'lucide-react';

interface SystemAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  weeklyFocusHours: number;
}

export const SystemAIModal: React.FC<SystemAIModalProps> = ({
  isOpen,
  onClose,
  profile,
  weeklyFocusHours,
}) => {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConsult = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundManager.playClickSound();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/system-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stats: profile.stats,
          focusHoursThisWeek: weeklyFocusHours,
          topCategory: 'Trabajo y Estudio',
          userQuery: query.trim() || '¿Cómo debo estructurar mi jornada de alto valor hoy para subir de nivel rápidamente?',
        }),
      });

      const data = await response.json();
      if (data.advice) {
        setAdvice(data.advice);
      } else {
        setAdvice('El Sistema recomienda enfocarte en completar 2 bloques de Pomodoro de alto valor hoy.');
      }
    } catch (err) {
      console.error(err);
      setAdvice('El Sistema está operativo en modo offline. Concentra tu atención en tus misiones diarias para obtener el máximo XP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-purple-500/70 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 p-5 border-b border-purple-500/40 relative">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-purple-400 font-system text-xs font-bold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>DIRECTIVA TÁCTICA DEL SISTEMA</span>
          </div>
          <h2 className="text-xl font-bold font-system text-white">
            Consulta al Sistema (Gemini AI)
          </h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Obtén consejos personalizados para optimizar tu tiempo, cursos y nivel de Cazador.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Output Response */}
          {advice ? (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-system text-xs font-bold">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>[DIRECTIVA DEL SISTEMA GENERADA]</span>
              </div>
              <div className="text-slate-200 text-xs leading-relaxed space-y-2 whitespace-pre-line font-mono">
                {advice}
              </div>
              <button
                onClick={() => setAdvice(null)}
                className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold cursor-pointer"
              >
                Hacer otra consulta al Sistema
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">
                Ejemplos de preguntas para el Sistema:
              </p>
              <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                <li>"¿Cómo divido 3 horas entre estudiar un curso y dibujar?"</li>
                <li>"¿Qué temporizador me conviene para avanzar un proyecto complejo?"</li>
                <li>"Dame un plan para alcanzar el Rango A esta semana."</li>
              </ul>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleConsult} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-system">
                Tu Consulta o Desafío Actual
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe aquí tu duda sobre tu tiempo o hábitos..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-system font-bold text-xs tracking-wider shadow-lg shadow-purple-500/20 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>ANALIZANDO DATOS DEL SISTEMA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>OBTENER CONSEJO DEL SISTEMA</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
