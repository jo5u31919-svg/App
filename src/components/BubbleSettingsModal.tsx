import React from 'react';
import { BubbleConfig } from '../types';
import { soundManager } from '../utils/audio';
import { Settings, X, Eye, EyeOff, Layout, Sliders, Palette, Check, Sparkles } from 'lucide-react';

interface BubbleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BubbleConfig;
  onChangeConfig: (newConfig: BubbleConfig) => void;
}

export const BubbleSettingsModal: React.FC<BubbleSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  const handleToggleEnable = () => {
    soundManager.playClickSound();
    onChangeConfig({ ...config, enabled: !config.enabled });
  };

  const handleModeChange = (mode: BubbleConfig['displayMode']) => {
    soundManager.playClickSound();
    onChangeConfig({ ...config, displayMode: mode });
  };

  const handlePositionChange = (position: BubbleConfig['dockPosition']) => {
    soundManager.playClickSound();
    onChangeConfig({ ...config, dockPosition: position });
  };

  const handleToggleAutoHide = () => {
    soundManager.playClickSound();
    onChangeConfig({ ...config, autoHidePeek: !config.autoHidePeek });
  };

  const handleThemeChange = (theme: BubbleConfig['theme']) => {
    soundManager.playClickSound();
    onChangeConfig({ ...config, theme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/70 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 p-5 border-b border-cyan-500/40 relative">
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
            <Settings className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>CONFIGURACIÓN DEL SISTEMA</span>
          </div>
          <h2 className="text-xl font-bold font-system text-white">
            Burbuja Flotante del Tiempo
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Personaliza el conteo regresivo flotante que puedes esconder en los bordes de la pantalla.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 1. Enable / Disable Toggle */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white font-system">Burbuja Flotante Activa</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Muestra un indicador flotante del tiempo restante.
              </p>
            </div>
            <button
              onClick={handleToggleEnable}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                config.enabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  config.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Display Mode Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-system">
              ¿Qué debe mostrar la Burbuja?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'auto' as const, label: 'Automático', desc: 'Temporizador o 12 AM' },
                { id: 'day_reset' as const, label: 'Reinicio 12 AM', desc: 'Tiempo del día' },
                { id: 'active_timer' as const, label: 'Temporizador', desc: 'Solo activo' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleModeChange(item.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    config.displayMode === item.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold font-system">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Screen Position */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-system">
              Ubicación en el Borde
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePositionChange('right')}
                className={`p-3 rounded-xl border text-xs font-bold font-system transition-all cursor-pointer ${
                  config.dockPosition === 'right'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                Borde Derecho (Derecha)
              </button>
              <button
                onClick={() => handlePositionChange('left')}
                className={`p-3 rounded-xl border text-xs font-bold font-system transition-all cursor-pointer ${
                  config.dockPosition === 'left'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                Borde Izquierdo (Izquierda)
              </button>
            </div>
          </div>

          {/* 4. Auto-Hide Peek Mode (Esconder en el borde con roce/toque) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white font-system">Ocultamiento en el Borde</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Esconde la burbuja en el lateral y la despliega al rozar o tocar.
                </p>
              </div>
              <button
                onClick={handleToggleAutoHide}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  config.autoHidePeek ? 'bg-purple-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                    config.autoHidePeek ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 5. Theme Palette */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-system">
              Color Neón de la Burbuja
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cyan' as const, name: 'Cyan Neón', color: 'bg-cyan-500' },
                { id: 'purple' as const, name: 'Púrpura', color: 'bg-purple-500' },
                { id: 'emerald' as const, name: 'Esmeralda', color: 'bg-emerald-500' },
                { id: 'amber' as const, name: 'Ámbar', color: 'bg-amber-500' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    config.theme === t.id
                      ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/50'
                      : 'bg-slate-950/60 border-slate-800 opacity-70'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${t.color}`} />
                  <span className="text-[10px] text-slate-300 font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save & Close CTA */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-system font-bold text-xs tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            GUARDAR CONFIGURACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};
