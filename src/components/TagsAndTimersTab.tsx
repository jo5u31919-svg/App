import React, { useState } from 'react';
import { Tag, TimerPreset, TimerType } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Plus, 
  Tag as TagIcon, 
  Sparkles, 
  Clock, 
  Trash2, 
  Play, 
  Check, 
  Zap,
  Edit2,
  X
} from 'lucide-react';

interface TagsAndTimersTabProps {
  tags: Tag[];
  presets: TimerPreset[];
  onCreateTag: (newTag: Omit<Tag, 'id' | 'bgColor' | 'borderColor'>) => void;
  onDeleteTag: (tagId: string) => void;
  onCreatePreset: (newPreset: Omit<TimerPreset, 'id'>) => void;
  onDeletePreset: (presetId: string) => void;
  onStartTimer: (title: string, tagId: string, durationMinutes: number, mode: TimerType, isHighValue: boolean) => void;
}

const COLOR_OPTIONS = [
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#64748b', // Slate
];

export const TagsAndTimersTab: React.FC<TagsAndTimersTabProps> = ({
  tags,
  presets,
  onCreateTag,
  onDeleteTag,
  onCreatePreset,
  onDeletePreset,
  onStartTimer,
}) => {
  const [showTagModal, setShowTagModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  // Tag Form state
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#06b6d4');
  const [tagIsHighValue, setTagIsHighValue] = useState(true);
  const [tagXpMultiplier, setTagXpMultiplier] = useState(1.8);

  // Preset Form state
  const [presetTitle, setPresetTitle] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [presetTagId, setPresetTagId] = useState(tags[0]?.id || '');
  const [presetDuration, setPresetDuration] = useState(45);
  const [presetType, setPresetType] = useState<TimerType>('countdown');

  const handleCreateTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    soundManager.playClickSound();

    onCreateTag({
      name: tagName.trim(),
      color: tagColor,
      icon: 'Tag',
      isHighValue: tagIsHighValue,
      xpMultiplier: tagIsHighValue ? tagXpMultiplier : 1.0,
    });

    setTagName('');
    setShowTagModal(false);
  };

  const handleCreatePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetTitle.trim()) return;
    soundManager.playClickSound();

    const selectedTag = tags.find((t) => t.id === presetTagId);

    onCreatePreset({
      title: presetTitle.trim(),
      description: presetDescription.trim() || 'Temporizador personalizado del Cazador.',
      tagId: presetTagId,
      defaultDurationMinutes: presetDuration,
      timerType: presetType,
      targetHighValue: selectedTag?.isHighValue || false,
    });

    setPresetTitle('');
    setPresetDescription('');
    setShowPresetModal(false);
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: ETIQUETAS PERSONALIZADAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-system text-white flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-cyan-400" />
              <span>Etiquetas Personalizadas del Día</span>
            </h2>
            <p className="text-xs text-slate-400">
              Organiza tus actividades (Trabajo, Cursos, Dibujo) y asigna multiplicadores de alto valor.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound();
              setShowTagModal(true);
            }}
            className="py-2 px-3 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 hover:border-cyan-500 font-system text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Etiqueta</span>
          </button>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{tag.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    {tag.isHighValue ? (
                      <span className="text-cyan-400 font-mono font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Alto Valor ({tag.xpMultiplier}x XP)
                      </span>
                    ) : (
                      <span className="text-slate-500">Estándar (1.0x XP)</span>
                    )}
                  </div>
                </div>
              </div>

              {tags.length > 1 && (
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    onDeleteTag(tag.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Eliminar Etiqueta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: TEMPORIZADORES PERSONALIZADOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-system text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Temporizadores Específicos</span>
            </h2>
            <p className="text-xs text-slate-400">
              Crea bloques para completar un curso, dibujar o sprint de trabajo profundo.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound();
              setShowPresetModal(true);
            }}
            className="py-2 px-3 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 hover:border-purple-500 font-system text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Temporizador</span>
          </button>
        </div>

        {/* Custom Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map((preset) => {
            const tag = tags.find((t) => t.id === preset.tagId) || tags[0];
            return (
              <div
                key={preset.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border truncate max-w-[130px]"
                      style={{
                        backgroundColor: `${tag?.color}20`,
                        borderColor: tag?.color,
                        color: tag?.color,
                      }}
                    >
                      {tag?.name}
                    </span>

                    {presets.length > 1 && (
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          onDeletePreset(preset.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{preset.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{preset.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="font-mono text-slate-400">
                    {preset.defaultDurationMinutes > 0 ? `${preset.defaultDurationMinutes} min` : 'Cronómetro'}
                  </span>

                  <button
                    onClick={() => {
                      soundManager.playTimerStartSound();
                      onStartTimer(
                        preset.title,
                        preset.tagId,
                        preset.defaultDurationMinutes,
                        preset.timerType,
                        preset.targetHighValue
                      );
                    }}
                    className="py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-system text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-600/20"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Lanzar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: CREAR ETIQUETA */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-cyan-500/60 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-system font-bold text-white text-base">Crear Nueva Etiqueta</h3>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTagSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Etiqueta</label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Ej: Curso de Programación, Dibujo Manga, Lectura"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Color Distintivo</label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTagColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        tagColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tagIsHighValue}
                    onChange={(e) => setTagIsHighValue(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 accent-cyan-500"
                  />
                  <span className="text-xs font-semibold text-cyan-300">
                    Marcar como Actividad de Alto Valor
                  </span>
                </label>

                {tagIsHighValue && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Multiplicador de Experiencia (XP): {tagXpMultiplier}x
                    </label>
                    <input
                      type="range"
                      min="1.2"
                      max="3.0"
                      step="0.1"
                      value={tagXpMultiplier}
                      onChange={(e) => setTagXpMultiplier(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-system font-bold text-xs"
              >
                GUARDAR ETIQUETA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR TEMPORIZADOR */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-purple-500/60 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-system font-bold text-white text-base">Crear Temporizador Específico</h3>
              <button
                onClick={() => setShowPresetModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePresetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Temporizador</label>
                <input
                  type="text"
                  value={presetTitle}
                  onChange={(e) => setPresetTitle(e.target.value)}
                  placeholder="Ej: Módulo 3 del Curso / Practicar Bocetos"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Etiqueta Asociada</label>
                <select
                  value={presetTagId}
                  onChange={(e) => setPresetTagId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  {tags.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.isHighValue ? '(Alto Valor)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Minutos</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={presetDuration}
                    onChange={(e) => setPresetDuration(parseInt(e.target.value) || 25)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modo</label>
                  <select
                    value={presetType}
                    onChange={(e) => setPresetType(e.target.value as TimerType)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="countdown">Cuenta Regresiva</option>
                    <option value="pomodoro">Pomodoro</option>
                    <option value="stopwatch">Cronómetro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Nota</label>
                <input
                  type="text"
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder="Detalles sobre lo que completarás en la sesión..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-system font-bold text-xs"
              >
                CREAR TEMPORIZADOR
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
