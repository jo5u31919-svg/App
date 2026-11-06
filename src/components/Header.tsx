import React, { useState, useEffect } from 'react';
import { PlayerProfile } from '../types';
import { soundManager } from '../utils/audio';
import { Shield, Sparkles, Volume2, VolumeX, Bot, Sliders, Pencil, Check, X, Palette, Smartphone } from 'lucide-react';

interface HeaderProps {
  appName: string;
  onChangeAppName: (newAppName: string) => void;
  profile: PlayerProfile;
  onOpenHighValue: () => void;
  onOpenAiAdvice: () => void;
  onToggleSound: () => void;
  onSimulateMidnight: () => void;
  onOpenBubbleSettings: () => void;
  onOpenThemeSettings: () => void;
  onOpenPwaModal: () => void;
  onReplayStartup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appName,
  onChangeAppName,
  profile,
  onOpenHighValue,
  onOpenAiAdvice,
  onToggleSound,
  onSimulateMidnight,
  onOpenBubbleSettings,
  onOpenThemeSettings,
  onOpenPwaModal,
  onReplayStartup,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(appName);

  useEffect(() => {
    setEditedName(appName);
  }, [appName]);

  const handleSaveAppName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editedName.trim()) {
      soundManager.playClickSound();
      onChangeAppName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Monarca de las Sombras':
        return 'bg-purple-950/80 text-purple-300 border-purple-500 shadow-purple-500/30';
      case 'Cazador Rango Nacional':
      case 'Rango S':
        return 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-amber-500/30';
      case 'Rango A':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-cyan-500/30';
      case 'Rango B':
        return 'bg-blue-950/80 text-blue-300 border-blue-500 shadow-blue-500/30';
      case 'Rango C':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-cyan-950/60 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Solo Leveling Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => {
              if (onReplayStartup) {
                soundManager.playClickSound();
                onReplayStartup();
              }
            }}
            className="relative cursor-pointer group"
            title="Toca el ícono para volver a ejecutar la Animación de Inicio"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center font-system font-bold text-slate-950 text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              {appName.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold">
              {profile.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <form onSubmit={handleSaveAppName} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    autoFocus
                    className="px-2 py-0.5 rounded-md bg-slate-950 border border-cyan-400 font-system text-sm font-extrabold text-white focus:outline-none max-w-[160px] sm:max-w-xs"
                    placeholder="Nombre App..."
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-md bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
                    title="Guardar nombre de la app"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(appName);
                      setIsEditingName(false);
                    }}
                    className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="Cancelar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <h1 
                    onClick={() => {
                      if (onReplayStartup) {
                        soundManager.playClickSound();
                        onReplayStartup();
                      }
                    }}
                    className="font-system text-base font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent cursor-pointer group-hover:brightness-125 transition-all truncate max-w-[180px] sm:max-w-none"
                    title="Toca para ejecutar animación de inicio"
                  >
                    {appName}
                  </h1>

                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                    title="Cambiar el nombre de la aplicación"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-sm ${getRankBadgeColor(profile.rank)}`}>
                    {profile.rank}
                  </span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-none">
              Nivel {profile.level} · {profile.xp} / {profile.xpToNextLevel} XP
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* High-Value Investment Button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenHighValue();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title="Aviso de Inversión de Alto Valor"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span className="hidden sm:inline">Inversión Alto Valor</span>
            <span className="sm:hidden">Alto Valor</span>
          </button>

          {/* AI System Advice */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenAiAdvice();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-medium active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title="Consultar al Sistema AI"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Consultar AI</span>
          </button>

          {/* Simulate Midnight test button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onSimulateMidnight();
            }}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 text-[11px] cursor-pointer"
            title="Probar Reinicio de Medianoche"
          >
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Reinicio 12 AM</span>
          </button>

          {/* Smartphone / APK Install Button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenPwaModal();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Instalar App / APK en Móvil"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Theme Palette button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenThemeSettings();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Cambiar Tema de la Aplicación"
          >
            <Palette className="w-4 h-4 text-purple-400" />
          </button>

          {/* Bubble Settings button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenBubbleSettings();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Configurar Burbuja Flotante"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onToggleSound();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title={profile.soundEnabled ? 'Desactivar Sonidos' : 'Activar Sonidos'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
