import React, { useState } from 'react';
import { Tag, TimerSession, DayRecap } from '../types';
import { 
  BarChart3, 
  PieChart, 
  Clock, 
  Sparkles, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface WeeklyStatsTabProps {
  sessions: TimerSession[];
  tags: Tag[];
  recaps: DayRecap[];
}

export const WeeklyStatsTab: React.FC<WeeklyStatsTabProps> = ({
  sessions,
  tags,
  recaps,
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getTag = (id: string) => tags.find((t) => t.id === id) || tags[0];

  // Compute Weekly Total Stats (Last 7 Days)
  const now = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    return { dateKey, dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1) };
  });

  // Calculate focus seconds per day
  const dailyData = last7Days.map((day) => {
    const daySessions = sessions.filter((s) => s.date === day.dateKey && s.completed);
    const totalSecs = daySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const highValueSecs = daySessions
      .filter((s) => s.isHighValue)
      .reduce((acc, s) => acc + s.durationSeconds, 0);

    return {
      dateKey: day.dateKey,
      dayName: day.dayName,
      totalHours: totalSecs / 3600,
      highValueHours: highValueSecs / 3600,
      standardHours: (totalSecs - highValueSecs) / 3600,
    };
  });

  const totalWeeklyFocusSecs = sessions
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + s.durationSeconds, 0);

  const totalWeeklyHighValueSecs = sessions
    .filter((s) => s.completed && s.isHighValue)
    .reduce((acc, s) => acc + s.durationSeconds, 0);

  const totalWeeklyHours = totalWeeklyFocusSecs / 3600;
  const totalWeeklyHighValueHours = totalWeeklyHighValueSecs / 3600;

  // Max daily hours for chart scaling
  const maxDailyHours = Math.max(3, ...dailyData.map((d) => d.totalHours));

  // Tag Breakdown
  const tagBreakdown = tags.map((tag) => {
    const tagSessions = sessions.filter((s) => s.tagId === tag.id && s.completed);
    const secs = tagSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    return {
      tag,
      hours: secs / 3600,
      count: tagSessions.length,
    };
  }).filter((tb) => tb.hours > 0 || tb.count > 0);

  // Filtered Sessions History
  const filteredSessions = sessions.filter((s) => {
    const matchesTag = selectedTagFilter === 'all' || s.tagId === selectedTagFilter;
    const matchesQuery = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* 1. RESUMEN SEMANAL */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 font-system text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>ESTADÍSTICAS SEMANALES Y PRODUCTIVIDAD ACUMULADA</span>
        </div>
        <h2 className="text-xl font-bold font-system text-white">
          Rendimiento Semanal de Cazador
        </h2>
        <p className="text-xs text-slate-400">
          Visualiza tus horas acumuladas de enfoque y distribución por categorías.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-system mb-1">
            <span>Enfoque Total Semanal</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-cyan-300">
            {totalWeeklyHours.toFixed(1)} <span className="text-sm">horas</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            En {sessions.filter((s) => s.completed).length} sesiones completadas
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-system mb-1">
            <span>Tiempo de Alto Valor</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-purple-300">
            {totalWeeklyHighValueHours.toFixed(1)} <span className="text-sm">horas</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalWeeklyHours > 0
              ? `${((totalWeeklyHighValueHours / totalWeeklyHours) * 100).toFixed(0)}% del total semanal`
              : '0% de alto valor'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-900/60 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-system mb-1">
            <span>Índice de Eficiencia</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-300">
            {totalWeeklyHours >= 10 ? 'S-RANK' : totalWeeklyHours >= 5 ? 'A-RANK' : 'B-RANK'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Basado en consistencia e inversión de tiempo
          </p>
        </div>
      </div>

      {/* 2. GRÁFICA BARRAS DIARIAS */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-system text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Horas de Enfoque por Día de la Semana</span>
        </h3>

        {/* Bar Chart Container */}
        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-2 h-48 border-b border-slate-800 pb-2">
            {dailyData.map((d) => {
              const heightPercent = Math.min(100, (d.totalHours / maxDailyHours) * 100);
              const highValuePercent = d.totalHours > 0 ? (d.highValueHours / d.totalHours) * 100 : 0;

              return (
                <div key={d.dateKey} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-300">
                    {d.totalHours > 0 ? `${d.totalHours.toFixed(1)}h` : ''}
                  </span>

                  <div className="w-full max-w-[36px] h-full flex flex-col justify-end bg-slate-950 rounded-t-lg overflow-hidden border border-slate-800">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 to-purple-500 rounded-t-lg transition-all duration-500 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* High value portion highlight */}
                      <div
                        className="w-full bg-cyan-400/40"
                        style={{ height: `${highValuePercent}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">{d.dayName}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-cyan-500" />
              <span>Tiempo de Alto Valor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-600" />
              <span>Tiempo Estándar</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DESGLOSE POR ETIQUETAS */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-system text-white uppercase tracking-wider flex items-center gap-2">
          <PieChart className="w-4 h-4 text-purple-400" />
          <span>Distribución por Categorías</span>
        </h3>

        <div className="space-y-3">
          {tagBreakdown.length > 0 ? (
            tagBreakdown.map((tb) => {
              const percent = totalWeeklyHours > 0 ? (tb.hours / totalWeeklyHours) * 100 : 0;
              return (
                <div key={tb.tag.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tb.tag.color }}
                      />
                      <span className="font-semibold text-white">{tb.tag.name}</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold">
                      {tb.hours.toFixed(1)}h ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: tb.tag.color,
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">
              Aún no hay sesiones registradas esta semana. ¡Completa tu primer temporizador!
            </p>
          )}
        </div>
      </div>

      {/* 4. HISTORIAL DE SESIONES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold font-system text-white uppercase tracking-wider">
            Historial Completo de Sesiones
          </h3>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar sesión..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Tag filter */}
            <select
              value={selectedTagFilter}
              onChange={(e) => setSelectedTagFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todas las etiquetas</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => {
              const tag = getTag(session.tagId);
              const durationMins = Math.round(session.durationSeconds / 60);

              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white truncate">{session.title}</h4>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0"
                          style={{
                            backgroundColor: `${tag?.color}20`,
                            borderColor: tag?.color,
                            color: tag?.color,
                          }}
                        >
                          {tag?.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {session.date} · {durationMins} minutos
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-cyan-300">
                      +{session.xpEarned} XP
                    </span>
                    {session.isHighValue && (
                      <p className="text-[10px] text-purple-400 font-mono">Alto Valor</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 text-center py-6 bg-slate-900 rounded-xl border border-slate-800">
              No se encontraron sesiones para este filtro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
