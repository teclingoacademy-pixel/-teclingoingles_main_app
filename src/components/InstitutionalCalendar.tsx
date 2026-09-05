/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * InstitutionalCalendar.tsx
 * Calendario Institucional TECLINGO PRO v2
 * 
 * Características:
 * - Fechas reales (mes/año navegables)
 * - CRUD completo contra Data Lake (Google Sheets)
 * - Solo DIRECTOR puede crear/editar/eliminar
 * - Todos los roles ven eventos según visibilidad
 * - Sincronización opcional con Google Calendar
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  X,
  Zap,
  Star,
  Award,
  Loader2,
  Trash2,
  Edit3,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';
import {
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  syncToGoogleCalendar,
  getGoogleCalendarToken,
  type CalendarEvent,
  type EventType,
  type EventVisibility,
} from '../services/calendarService';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEK_DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

interface EventFormData {
  day: number;
  month: number;
  year: number;
  title: string;
  type: EventType;
  description: string;
  time: string;
  visibility: EventVisibility[];
}

export function InstitutionalCalendar() {
  const { currentRole, userEmail } = useAppContext();
  const isDirector = currentRole === 'DIRECTOR';

  // Estado de fecha
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Estado de eventos
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Modales
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario
  const [formData, setFormData] = useState<EventFormData>({
    day: today.getDate(),
    month: currentMonth + 1,
    year: currentYear,
    title: '',
    type: 'SCHOOL',
    description: '',
    time: '08:00 AM',
    visibility: ['GLOBAL'],
  });

  /* ================================================================
     CARGA DE EVENTOS
     ================================================================ */

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalendarEvents(currentYear, currentMonth + 1);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /* ================================================================
     HELPERS DE CALENDARIO
     ================================================================ */

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const emptySlots = firstDay;

  const getEventsForDay = (day: number): CalendarEvent[] => {
    return events.filter((e) => {
      if (e.day !== day || e.month !== currentMonth + 1 || e.year !== currentYear) return false;
      if (isDirector) return true;
      return e.visibility.includes('GLOBAL') || e.visibility.includes(currentRole as EventVisibility);
    });
  };

  /* ================================================================
     NAVEGACIÓN
     ================================================================ */

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  /* ================================================================
     CRUD
     ================================================================ */

  const handleAddEvent = async () => {
    if (!formData.title || !formData.day) return;
    setLoading(true);
    try {
      const newEvent = await createCalendarEvent({
        day: formData.day,
        month: formData.month,
        year: formData.year,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        time: formData.time,
        visibility: formData.visibility,
      });
      setEvents((prev) => [...prev, newEvent]);
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !formData.title) return;
    setLoading(true);
    try {
      await updateCalendarEvent(selectedEvent.id, {
        day: formData.day,
        month: formData.month,
        year: formData.year,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        time: formData.time,
        visibility: formData.visibility,
      });
      await loadEvents();
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('¿Eliminar este evento permanentemente?')) return;
    setLoading(true);
    try {
      await deleteCalendarEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setSelectedEvent(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToGoogle = async (event: CalendarEvent) => {
    setSyncing(true);
    try {
      const token = await getGoogleCalendarToken();
      if (!token) {
        alert('El director debe vincular su cuenta de Google Calendar primero.');
        return;
      }
      const googleId = await syncToGoogleCalendar(event, token);
      if (googleId) {
        alert('✅ Evento sincronizado con Google Calendar');
        await loadEvents();
      } else {
        alert('❌ No se pudo sincronizar');
      }
    } finally {
      setSyncing(false);
    }
  };

  /* ================================================================
     FORMULARIO
     ================================================================ */

  const resetForm = () => {
    setFormData({
      day: today.getDate(),
      month: currentMonth + 1,
      year: currentYear,
      title: '',
      type: 'SCHOOL',
      description: '',
      time: '08:00 AM',
      visibility: ['GLOBAL'],
    });
    setError(null);
  };

  const openEditModal = (event: CalendarEvent) => {
    setFormData({
      day: event.day,
      month: event.month,
      year: event.year,
      title: event.title,
      type: event.type,
      description: event.description,
      time: event.time || '08:00 AM',
      visibility: event.visibility,
    });
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const openAddModalForDay = (day: number) => {
    setFormData({
      day,
      month: currentMonth + 1,
      year: currentYear,
      title: '',
      type: 'SCHOOL',
      description: '',
      time: '08:00 AM',
      visibility: ['GLOBAL'],
    });
    setShowAddModal(true);
  };

  /* ================================================================
     RENDER HELPERS
     ================================================================ */

  const getTypeStyles = (type: EventType) => {
    switch (type) {
      case 'SCHOOL': return 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]';
      case 'HOLIDAY': return 'bg-orange-500 shadow-[0_0_10px_#f97316]';
      case 'TECLINGO': return 'bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]';
    }
  };

  const getTypeLabel = (type: EventType) => {
    switch (type) {
      case 'SCHOOL': return 'Escolar';
      case 'HOLIDAY': return 'Asueto';
      case 'TECLINGO': return 'TECLINGO';
    }
  };

  const getIcon = (type: EventType) => {
    switch (type) {
      case 'SCHOOL': return <Award size={10} className="text-[#061a1a]" />;
      case 'HOLIDAY': return <Star size={10} className="text-[#061a1a]" />;
      case 'TECLINGO': return <Zap size={10} className="text-[#061a1a]" />;
    }
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Evento más próximo
  const upcomingEvent = events
    .filter((e) => {
      const eventDate = new Date(e.year, e.month - 1, e.day);
      return eventDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    })
    .sort((a, b) => {
      const da = new Date(a.year, a.month - 1, a.day);
      const db = new Date(b.year, b.month - 1, b.day);
      return da.getTime() - db.getTime();
    })[0];

  const daysUntilUpcoming = upcomingEvent
    ? Math.ceil(
        (new Date(upcomingEvent.year, upcomingEvent.month - 1, upcomingEvent.day).getTime() -
          new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Agenda Global
          </h2>
          <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">
            Calendario Institucional
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isDirector && (
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="px-6 py-3 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(222,255,154,0.3)] transition-all flex items-center gap-2"
            >
              <CalendarIcon size={14} />
              Agregar Evento
            </button>
          )}

          <button
            onClick={goToToday}
            className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Hoy
          </button>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 h-12">
            <button onClick={goToPrevMonth} className="p-2 text-white/20 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black text-white uppercase tracking-widest px-4 min-w-[140px] text-center">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button onClick={goToNextMonth} className="p-2 text-white/20 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={loadEvents}
            disabled={loading}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all disabled:opacity-30"
            title="Recargar eventos"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Calendario */}
        <div className="col-span-12 lg:col-span-9">
          <GlassCard accent="green" className="!p-0 overflow-hidden">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 border-b border-white/10">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="p-4 text-center text-[10px] font-black text-white/20 uppercase tracking-widest border-r border-white/5 last:border-0"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7">
              {/* Espacios vacíos al inicio */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square border-r border-b border-white/5 bg-white/[0.01]"
                />
              ))}

              {/* Días del mes */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayEvents = getEventsForDay(day);
                const todayFlag = isToday(day);

                return (
                  <div
                    key={day}
                    onClick={() => isDirector && dayEvents.length === 0 && openAddModalForDay(day)}
                    className={`aspect-square border-r border-b border-white/5 p-2 sm:p-3 flex flex-col gap-1 hover:bg-white/[0.02] transition-colors relative group cursor-default ${
                      todayFlag ? 'bg-[#DEFF9A]/5' : ''
                    } ${isDirector ? 'cursor-pointer' : ''}`}
                  >
                    <span
                      className={`text-[10px] font-black transition-colors w-6 h-6 flex items-center justify-center rounded-full ${
                        todayFlag
                          ? 'bg-[#DEFF9A] text-black'
                          : 'text-white/10 group-hover:text-white/40'
                      }`}
                    >
                      {day}
                    </span>

                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[70%] custom-scrollbar">
                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          className={`w-full h-2 min-h-[8px] rounded-full ${getTypeStyles(
                            event.type
                          )} transition-transform hover:scale-x-110`}
                          title={`${event.title} — ${event.time || 'Todo el día'}`}
                        />
                      ))}
                    </div>

                    {/* Indicador de más eventos */}
                    {dayEvents.length > 3 && (
                      <span className="text-[7px] text-white/20 text-center font-black">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Leyenda */}
          <GlassCard title="Leyenda Operativa" icon={Info} accent="cyan">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Escolar (Exámenes)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Días de Asueto
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#DEFF9A] shadow-[0_0_10px_#DEFF9A]" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Eventos TECLINGO PRO
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Próximo Hito */}
          {upcomingEvent && daysUntilUpcoming !== null && (
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-t from-white/5 to-transparent border border-white/10 text-center">
              <Star className="mx-auto text-[#DEFF9A] mb-4" />
              <p className="text-white text-xs font-black uppercase tracking-widest mb-1">
                Próximo Hito
              </p>
              <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-2">
                {upcomingEvent.title}
              </p>
              <p className="text-white/30 text-[8px] uppercase font-bold tracking-widest mb-4">
                {upcomingEvent.day} de {MONTHS[upcomingEvent.month - 1]}
              </p>
              <p className="text-[10px] font-black text-[#DEFF9A]">
                {daysUntilUpcoming === 0
                  ? '¡ES HOY!'
                  : `FALTAN ${daysUntilUpcoming} DÍA${daysUntilUpcoming !== 1 ? 'S' : ''}`}
              </p>
            </div>
          )}

          {/* Lista de eventos del mes */}
          <GlassCard title="Eventos del Mes" accent="green">
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {events.length === 0 ? (
                <p className="text-white/20 text-[10px] text-center py-4">
                  No hay eventos este mes
                </p>
              ) : (
                events
                  .sort((a, b) => a.day - b.day)
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getTypeStyles(event.type)}`} />
                        <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">
                          {event.day} {MONTHS[event.month - 1].substring(0, 3)}
                        </span>
                      </div>
                      <p className="text-white text-[10px] font-black uppercase tracking-wide truncate">
                        {event.title}
                      </p>
                    </button>
                  ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Detalle de Evento
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full neo-glass border-white/20 rounded-[3rem] p-10 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center ${getTypeStyles(
                selectedEvent.type
              )} !shadow-none`}>
                {getIcon(selectedEvent.type)}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-full border ${
                        selectedEvent.type === 'SCHOOL'
                          ? 'text-cyan-500 border-cyan-500/30'
                          : selectedEvent.type === 'HOLIDAY'
                          ? 'text-orange-500 border-orange-500/30'
                          : 'text-[#DEFF9A] border-[#DEFF9A]/30'
                      }`}
                    >
                      {getTypeLabel(selectedEvent.type)}
                    </span>
                    <span className="text-white/20 text-[8px]">•</span>
                    <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">
                      {selectedEvent.day} de {MONTHS[selectedEvent.month - 1]} {selectedEvent.year}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                    {selectedEvent.title}
                  </h3>
                </div>

                <p className="text-white/60 text-sm font-medium leading-relaxed italic">
                  "{selectedEvent.description}"
                </p>

                {selectedEvent.time && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#DEFF9A]">
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">
                        Hora de Programación
                      </p>
                      <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">
                        {selectedEvent.time}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">
                    Visibilidad:
                  </span>
                  {selectedEvent.visibility.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[8px] font-black uppercase"
                    >
                      {v}
                    </span>
                  ))}
                </div>

                {/* Acciones de Director */}
                {isDirector && (
                  <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        openEditModal(selectedEvent);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>

                    {selectedEvent.googleCalendarEventId ? (
                      <a
                        href={`https://calendar.google.com/calendar/event?eid=${btoa(selectedEvent.googleCalendarEventId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest hover:bg-[#DEFF9A]/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={14} />
                        Ver en Google
                      </a>
                    ) : (
                      <button
                        onClick={() => handleSyncToGoogle(selectedEvent)}
                        disabled={syncing}
                        className="flex-1 py-3 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-widest hover:bg-[#DEFF9A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {syncing ? <Loader2 size={14} className="animate-spin" /> : <CalendarIcon size={14} />}
                        Sincronizar
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Agregar Evento
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAddModal && (
          <EventModal
            title="Programar Evento Institucional"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddEvent}
            onClose={() => { setShowAddModal(false); resetForm(); }}
            submitLabel="Emitir Evento Global"
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Editar Evento
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showEditModal && (
          <EventModal
            title="Editar Evento Institucional"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateEvent}
            onClose={() => { setShowEditModal(false); setSelectedEvent(null); resetForm(); }}
            submitLabel="Guardar Cambios"
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   SUB-COMPONENTE: Modal de Formulario (Add / Edit)
   ================================================================ */

interface EventModalProps {
  title: string;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
  loading: boolean;
}

function EventModal({ title, formData, setFormData, onSubmit, onClose, submitLabel, loading }: EventModalProps) {
  const monthsList = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (role: EventVisibility) => {
    setFormData((prev) => {
      const current = prev.visibility;
      if (current.includes(role)) {
        return { ...prev, visibility: current.filter((r) => r !== role) };
      }
      return { ...prev, visibility: [...current, role] };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-xl w-full neo-glass border-white/20 rounded-[3rem] p-8 sm:p-10 overflow-hidden relative max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">
          {title}
        </h3>

        <div className="space-y-5">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">
              Título del Evento *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ej. Examen de ADN"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50 placeholder:text-white/20"
            />
          </div>

          {/* Fecha: Día / Mes / Año */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Día *</label>
              <input
                type="number"
                min={1}
                max={31}
                value={formData.day}
                onChange={(e) => updateField('day', Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Mes *</label>
              <select
                value={formData.month}
                onChange={(e) => updateField('month', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50"
              >
                {monthsList.map((m, i) => (
                  <option key={i} value={i + 1} className="bg-[#061a1a]">{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Año *</label>
              <input
                type="number"
                min={2024}
                max={2035}
                value={formData.year}
                onChange={(e) => updateField('year', parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50"
              />
            </div>
          </div>

          {/* Tipo + Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">
                Tipo de Evento
              </label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value as EventType)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50"
              >
                <option value="SCHOOL" className="bg-[#061a1a]">Escolar (Examen)</option>
                <option value="HOLIDAY" className="bg-[#061a1a]">Feriado</option>
                <option value="TECLINGO" className="bg-[#061a1a]">Evento Teclingo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">
                Hora / Duración
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                placeholder="Ej. 10:00 AM"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50 placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DEFF9A]/50 resize-none placeholder:text-white/20"
              placeholder="Detalles del evento..."
            />
          </div>

          {/* Visibilidad */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">
              Visibilidad (Jerarquía)
            </label>
            <div className="flex gap-3">
              {(['GLOBAL', 'DOCENTE', 'ALUMNO'] as EventVisibility[]).map((role) => (
                <button
                  key={role}
                  onClick={() => toggleVisibility(role)}
                  className={`flex-1 py-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                    formData.visibility.includes(role)
                      ? 'bg-[#DEFF9A]/20 border-[#DEFF9A] text-[#DEFF9A]'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <p className="text-[8px] text-white/20 font-bold">
              GLOBAL = visible para todos. Selecciona los roles adicionales según corresponda.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !formData.title}
              className="flex-[2] py-4 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.2)] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}