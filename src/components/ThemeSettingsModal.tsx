import React from 'react';
import { AppThemeId } from '../types';
import { APP_THEMES } from '../utils/theme';
import { soundManager } from '../utils/audio';
import { Palette, Check, Sparkles, X, Shield, Eye } from 'lucide-react';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppThemeId;
  onChangeTheme: (themeId: AppThemeId) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onChangeTheme,
}) => {
  if (!isOpen) return null;

  const activeThemeConfig = APP_THEMES[currentTheme] || APP_THEMES.cyber_cyan;

  const handleSelectTheme = (themeId: AppThemeId) => {
    soundManager.playClickSound();
    onChangeTheme(themeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in selection:bg-cyan-500 selection:text-slate-950">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow behind modal */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-40 transition-colors duration-500"
          style={{ backgroundColor: activeThemeConfig.primaryHex }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-2xl bg-slate-950 border border-slate-700 shadow-md flex items-center justify-center transition-colors"
              style={{ borderColor: activeThemeConfig.primaryHex }}
            >
              <Palette className="w-6 h-6" style={{ color: activeThemeConfig.primaryHex }} />
            </div>
            <div>
              <h2 className="font-system text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
                CONFIGURACIÓN DE TEMAS
              </h2>
              <p className="text-xs text-slate-400">
                Personaliza la apariencia neón del Sistema Solo Leveling & Temporizador
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Theme Options Grid */}
        <div className="overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          {/* Live Preview Panel */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-system text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Eye className="w-4 h-4" style={{ color: activeThemeConfig.primaryHex }} />
                VISTA PREVIA EN VIVO
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-slate-800 text-slate-300">
                {activeThemeConfig.name}
              </span>
            </div>

            {/* Mock Live Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Barra de Progresión 24H</span>
                <span className="font-bold" style={{ color: activeThemeConfig.primaryHex }}>
                  68.4% Transcurrido
                </span>
              </div>
              <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 glow-progress-bar-fine"
                  style={{ 
                    width: '68.4%',
                    background: `linear-gradient(90deg, ${activeThemeConfig.primaryHex}, ${activeThemeConfig.secondaryHex}, ${activeThemeConfig.accentHex})` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Theme Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(APP_THEMES) as AppThemeId[]).map((themeKey) => {
              const theme = APP_THEMES[themeKey];
              const isSelected = currentTheme === themeKey;

              return (
                <div
                  key={themeKey}
                  onClick={() => handleSelectTheme(themeKey)}
                  className={`relative group p-4 rounded-2xl bg-slate-950 border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'shadow-xl ring-1'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.primaryHex : undefined,
                    boxShadow: isSelected ? `0 0 25px -5px ${theme.primaryHex}60` : undefined,
                  }}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div 
                      className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black font-system flex items-center gap-1 shadow-md text-slate-950"
                      style={{ backgroundColor: theme.primaryHex }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      EQUIPADO
                    </div>
                  )}

                  {/* Swatch Color Gradient Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pt-1">
                      {theme.previewColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-lg border border-slate-900 shadow-inner transition-transform group-hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <div>
                      <h3 className="font-system font-extrabold text-white text-base tracking-wide group-hover:text-cyan-300 transition-colors">
                        {theme.name}
                      </h3>
                      <p 
                        className="text-[11px] font-semibold tracking-wider uppercase mb-1"
                        style={{ color: theme.primaryHex }}
                      >
                        {theme.subtitle}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  {/* Select Button Action Footer */}
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      ID: {theme.id}
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-system font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {isSelected ? 'Actual' : 'Seleccionar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>El tema seleccionado se aplica a toda la interfaz y se guarda en el Sistema.</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-system font-black text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            GUARDAR Y CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
