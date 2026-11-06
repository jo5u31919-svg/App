import React, { useState } from 'react';
import { ShadowArmy, Achievement, PlayerProfile, MotivationalQuote } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Crown, 
  Shield, 
  Sparkles, 
  Flame, 
  Lock, 
  CheckCircle2, 
  Sword, 
  Zap,
  Award,
  Star,
  Quote,
  Plus,
  X,
  BookmarkCheck
} from 'lucide-react';

interface ShadowsTabProps {
  shadows: ShadowArmy[];
  achievements: Achievement[];
  quotes: MotivationalQuote[];
  profile: PlayerProfile;
  onExtractShadow: (shadowId: string) => void;
  onUnlockQuote: (quoteId: string) => void;
  onSelectActiveQuote: (quoteId: string) => void;
  onCreateCustomQuote: (quote: string, author: string) => void;
}

export const ShadowsTab: React.FC<ShadowsTabProps> = ({
  shadows,
  achievements,
  quotes,
  profile,
  onExtractShadow,
  onUnlockQuote,
  onSelectActiveQuote,
  onCreateCustomQuote,
}) => {
  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');

  const handleExtract = (shadowId: string) => {
    soundManager.playLevelUpSound();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
    onExtractShadow(shadowId);
  };

  const handleUnlockQuoteClick = (quote: MotivationalQuote) => {
    soundManager.playLevelUpSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onUnlockQuote(quote.id);
  };

  const handleSelectQuoteClick = (quoteId: string) => {
    soundManager.playClickSound();
    onSelectActiveQuote(quoteId);
  };

  const handleAddQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;
    soundManager.playClickSound();

    onCreateCustomQuote(newQuoteText.trim(), newQuoteAuthor.trim() || profile.name);
    setNewQuoteText('');
    setNewQuoteAuthor('');
    setShowAddQuoteModal(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. SECCIÓN PRINCIPAL: FRASES MOTIVADORAS DEL MONARCA Y SISTEMA */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-system text-xs font-bold uppercase tracking-wider mb-1">
              <Quote className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>DECRETOS Y MOTIVACIÓN DEL SISTEMA</span>
            </div>
            <h2 className="text-xl font-bold font-system text-white">
              Frases Motivadoras Desbloqueables
            </h2>
            <p className="text-xs text-slate-400">
              Desbloquea decretos de inspiración con tu nivel y fija tu frase activa para motivar tu jornada diaria.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound();
              setShowAddQuoteModal(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-system text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Frase Propia</span>
          </button>
        </div>

        {/* Grid of Motivational Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.map((item) => {
            const canUnlock = !item.unlocked && profile.level >= item.levelRequired;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  item.active
                    ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-cyan-950/80 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20'
                    : item.unlocked
                    ? 'bg-slate-900 border-purple-500/60 hover:border-purple-400'
                    : canUnlock
                    ? 'bg-slate-900/90 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/80 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800">
                      {item.category}
                    </span>

                    {item.active ? (
                      <span className="text-[10px] font-system font-bold px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3" />
                        Frase del Día
                      </span>
                    ) : item.unlocked ? (
                      <span className="text-[10px] text-purple-400 font-mono font-semibold">
                        Desbloqueada
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Req. Nivel {item.levelRequired}
                      </span>
                    )}
                  </div>

                  <blockquote className="text-sm font-medium text-white italic leading-relaxed">
                    "{item.quote}"
                  </blockquote>

                  <p className="text-xs font-bold text-cyan-400 mt-2 font-system">
                    — {item.author}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {item.unlocked ? (
                    <button
                      disabled={item.active}
                      onClick={() => handleSelectQuoteClick(item.id)}
                      className={`w-full py-2 px-3 rounded-xl font-system font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        item.active
                          ? 'bg-slate-950 text-cyan-400 border border-cyan-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900'
                      }`}
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>{item.active ? 'FRASE FIJADA EN EL DÍA' : 'FIJAR FRASE DEL DÍA'}</span>
                    </button>
                  ) : canUnlock ? (
                    <button
                      onClick={() => handleUnlockQuoteClick(item)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-slate-950 font-system font-extrabold text-xs shadow-md shadow-purple-500/20 cursor-pointer animate-pulse"
                    >
                      DESBLOQUEAR FRASE ({item.xpCostToUnlock} XP)
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1 mx-auto">
                      <Lock className="w-3.5 h-3.5" />
                      Alcanza el Nivel {item.levelRequired} para desbloquear
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. EJÉRCITO DE SOMBRAS DE MONARCA */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-system text-xs font-bold uppercase tracking-wider mb-1">
            <Crown className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>PODER DEL MONARCA DE LAS SOMBRAS</span>
          </div>
          <h2 className="text-xl font-bold font-system text-white">
            Ejército de Sombras Extraídas
          </h2>
          <p className="text-xs text-slate-400">
            Desbloquea sombras legendarias al alcanzar ciertos Rangos y Niveles para obtener bonificaciones permanentes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shadows.map((shadow) => {
            const canExtract = !shadow.unlocked && profile.level >= shadow.levelRequired;

            return (
              <div
                key={shadow.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  shadow.unlocked
                    ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500/80 shadow-xl shadow-purple-950/40'
                    : canExtract
                    ? 'bg-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/80 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-system font-bold border ${
                        shadow.unlocked
                          ? 'bg-purple-950 text-purple-300 border-purple-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Req: {shadow.rankRequired} (Nivel {shadow.levelRequired})
                    </span>

                    {shadow.unlocked ? (
                      <span className="text-xs font-semibold text-purple-400 flex items-center gap-1 font-system">
                        <CheckCircle2 className="w-4 h-4" />
                        Extraída
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Bloqueada
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold font-system text-white">{shadow.name}</h3>
                  <p className="text-xs font-semibold text-purple-300 mt-0.5">{shadow.title}</p>

                  <blockquote className="text-[11px] text-slate-400 italic mt-2 border-l-2 border-purple-500/40 pl-2">
                    "{shadow.quote}"
                  </blockquote>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{shadow.bonusEffect}</span>
                  </div>

                  {canExtract && !shadow.unlocked && (
                    <button
                      onClick={() => handleExtract(shadow.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-slate-950 font-system font-black text-xs tracking-wider shadow-lg shadow-purple-500/30 cursor-pointer animate-pulse"
                    >
                      SURGIR (EXTRAER SOMBRA)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LOGROS ÉPICOS DEL SISTEMA */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold font-system text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Logros Épicos Desbloqueables</span>
          </h3>
          <p className="text-xs text-slate-400">
            Hitos alcanzas al progresar en tu disciplina y horas de alto valor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/50 border-slate-900 opacity-60'
              }`}
            >
              <div
                className={`p-3 rounded-xl border shrink-0 ${
                  ach.unlocked
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Star className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    +{ach.xpBonus} XP
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">{ach.description}</p>

                {ach.unlocked && (
                  <span className="inline-block mt-2 text-[10px] font-mono text-emerald-400">
                    ✓ Desbloqueado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CREAR FRASE MOTIVADORA */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-purple-500/70 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-system font-bold text-white text-base">Crear Tu Frase Motivadora</h3>
              <button
                onClick={() => setShowAddQuoteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Frase de Impacto</label>
                <textarea
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Ej: Cada minuto que me enfoco hoy me acerca al éxito inevitable..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Autor / Firma</label>
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder={`Ej: ${profile.name} / Decreto Personal`}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-system font-bold text-xs cursor-pointer shadow-lg shadow-purple-500/20"
              >
                GUARDAR Y DESBLOQUEAR FRASE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
