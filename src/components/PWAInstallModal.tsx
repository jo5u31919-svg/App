import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';
import { Smartphone, Download, CheckCircle2, ShieldCheck, X, Copy, Terminal, ExternalLink, Cpu } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    soundManager.playClickSound();
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const capacitorSteps = [
    { title: '1. Instalar Capacitor CLI', cmd: 'npm install @capacitor/core @capacitor/cli @capacitor/android' },
    { title: '2. Inicializar Proyecto Móvil', cmd: 'npx cap init ChronosSystem com.chronos.app --web-dir dist' },
    { title: '3. Construir la Web App', cmd: 'npm run build' },
    { title: '4. Añadir Plataforma Android', cmd: 'npx cap add android' },
    { title: '5. Abrir en Android Studio & Generar APK', cmd: 'npx cap open android' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in selection:bg-cyan-500 selection:text-slate-950">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-system text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
                APLICACIÓN MÓVIL & ARCHIVO APK
              </h2>
              <p className="text-xs text-slate-400">
                Instala la App en tu dispositivo Android/iOS o compila un archivo APK firmado
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

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('pwa');
            }}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-system font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'pwa'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            INSTALACIÓN RÁPIDA PWA (RECOMENDADO)
          </button>

          <button
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('apk');
            }}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-system font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'apk'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            COMPILAR ARCHIVO APK NATIVO
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          {activeTab === 'pwa' ? (
            <div className="space-y-5">
              {/* Option 1: Chrome / Android Install Button */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-system font-bold text-cyan-400 uppercase tracking-widest">
                      MODO STANDALONE MÓVIL
                    </span>
                    <h3 className="font-system text-base font-extrabold text-white mt-0.5">
                      Instalar en Android / Chrome
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Funciona exactamente como una App nativa descargada de Google Play Store: pantalla completa sin barra de navegación, icono propio en tu inicio y soporte offline.
                    </p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
                </div>

                {isInstalled ? (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-system font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>¡Aplicación ya instalada en este dispositivo!</span>
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={async () => {
                      soundManager.playLevelUpSound();
                      await install();
                    }}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-system font-black text-sm shadow-xl shadow-cyan-500/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    INSTALAR AHORA EN PANTALLA DE INICIO (ANDROID)
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                    <p className="font-system font-bold text-cyan-300 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      Pasos para añadir a la pantalla de inicio manualmente:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                      <li>Toca los tres puntos (⋮) en la esquina superior del navegador Chrome.</li>
                      <li>Selecciona <strong>"Añadir a la pantalla de inicio"</strong> o <strong>"Instalar aplicación"</strong>.</li>
                      <li>Confirma y abre la App desde tu menú de aplicaciones en el celular.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Option 2: iOS Safari Instructions */}
              {isIOS && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3">
                  <h4 className="font-system font-bold text-white text-sm flex items-center gap-2">
                    <span>Instalación en iPhone / iPad (iOS Safari)</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    1. Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en Safari.<br />
                    2. Desplázate hacia abajo y selecciona <strong>"Añadir a la pantalla de inicio"</strong>.<br />
                    3. Toca <strong>Añadir</strong> en la esquina superior derecha.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* APK Building Guide Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 space-y-1">
                <p className="font-system font-bold text-white text-sm">
                  ¿Cómo empaquetar esta Web App como un APK Nativo para Android?
                </p>
                <p className="text-slate-300">
                  Puedes convertir este proyecto en un archivo APK nativo empaquetándolo con Capacitor JS. Ejecuta los siguientes comandos en la terminal de tu computadora:
                </p>
              </div>

              <div className="space-y-3">
                {capacitorSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-system text-xs font-bold text-cyan-300">
                        {step.title}
                      </span>
                      <button
                        onClick={() => handleCopy(step.cmd, step.title)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedCmd === step.title ? '¡Copiado!' : 'Copiar Comando'}
                      </button>
                    </div>
                    <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                      <code>{step.cmd}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>Modo Offline & PWA Standalone Soportados</span>
          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-system font-bold text-xs cursor-pointer"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  );
};
