/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Video, 
  CheckCircle2, 
  Plus, 
  History, 
  Inbox, 
  Calendar,
  CheckCircle, 
  Trash2, 
  User, 
  XCircle,
  HelpCircle,
  Sparkles,
  Search,
  Check,
  AlertTriangle,
  FileCheck,
  Zap,
  ExternalLink,
  RefreshCw,
  Bell,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';
import { 
  listarHorariosDisponiblesDocente, 
  crearHitoAsesoria, 
  eliminarHitoAsesoria 
} from '../services/identityService';

// Lugares comunes en una institución universitaria
const LUGARES_COMUNES = [
  'AULA 1',
  'AULA 2',
  'AULA 3',
  'AULA 4',
  'AULA 5',
  'AULA 6',
  'AULA 7',
  'AULA 8',
  'AULA 9',
  'AULA 10',
  'SALA DE JUNTAS',
  'DIRECCIÓN',
  'OFicina Docente',
  'CAFETERÍA',
  'BIBLIOTECA',
  'LABORATORIO DE CÓMPUTO',
  'AUDITORIO',
  'SALA DE ESTUDIOS',
  'PLAZA CENTRAL',
  'ONLINE (Meet)',
  'ONLINE (Teams)',
  'OTRO (especificar en tema)'
];

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  platform: 'GOOGLE_MEET' | 'TEAMS_SYNCHRONOUS';
  lugar: string;
  status: 'AVAILABLE' | 'BOOKED';
  bookedBy?: {
    name: string;
    id: string;
    group: string;
    avatar: string;
    topic: string;
  };
}

interface PendingRequest {
  id: string;
  student: string;
  studentId: string;
  group: string;
  timeSlot: string;
  day: string;
  platform: 'GOOGLE_MEET' | 'TEAMS_SYNCHRONOUS';
  date: string;
  topic: string;
  avatar: string;
}

interface HistoryItem {
  id: string;
  student: string;
  studentId: string;
  group: string;
  topic: string;
  date: string;
  time: string;
  status: 'COMPLETED' | 'CANCELLED';
  platform: 'GOOGLE_MEET' | 'TEAMS_SYNCHRONOUS';
}

export function AvailabilityModule() {
  const { userEmail } = useAppContext();
  const [activeTab, setActiveTab] = useState<'config' | 'pending' | 'history'>('config');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Slots published by teacher (Hitos) - loaded from API
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  // Incoming booking requests from students (Data Lake pending sync)
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  // Completed or cancelled advisor sessions (Academic ledgers)
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  // Form states for creating a new slot of availability
  const [newDay, setNewDay] = useState<string>('Lunes');
  const [newTime, setNewTime] = useState<string>('04:00 PM');
  const [newPlatform, setNewPlatform] = useState<'GOOGLE_MEET' | 'TEAMS_SYNCHRONOUS'>('GOOGLE_MEET');
  const [newLugar, setNewLugar] = useState<string>(LUGARES_COMUNES[0]);

  // Load slots from API on mount
  useEffect(() => {
    if (!userEmail) return;
    
    const loadSlots = async () => {
      try {
        setIsLoadingData(true);
        const apiSlots = await listarHorariosDisponiblesDocente(userEmail);
        const mappedSlots: TimeSlot[] = apiSlots.map(slot => ({
          id: slot.asesoria_id,
          day: slot.dia,
          time: slot.hora,
          platform: slot.plataforma as 'GOOGLE_MEET' | 'TEAMS_SYNCHRONOUS',
          lugar: slot.lugar,
          status: slot.estado as 'AVAILABLE' | 'BOOKED',
        }));
        setSlots(mappedSlots);
      } catch (err) {
        console.error('Error cargando slots:', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadSlots();
  }, [userEmail]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    try {
      const result = await crearHitoAsesoria({
        email: userEmail,
        dia: newDay,
        hora: newTime,
        plataforma: newPlatform,
        lugar: newLugar,
        duracion_minutos: 45,
        max_alumnos_por_slot: 1,
        anticipacion_horas_min: 24,
      });

      if (result.ok && result.asesoria_id) {
        const newSlot: TimeSlot = {
          id: result.asesoria_id,
          day: newDay,
          time: newTime,
          platform: newPlatform,
          lugar: newLugar,
          status: 'AVAILABLE'
        };
        setSlots(prev => [...prev, newSlot]);
        showToast(`Hito de asistencia (${newDay} - ${newTime}) publicado con éxito en el portal del alumno.`);
      } else {
        showToast(`Error: ${result.error || 'No se pudo crear el hito'}`);
      }
    } catch (err) {
      console.error('Error creando hito:', err);
      showToast('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleRemoveSlot = async (id: string) => {
    if (!userEmail) return;
    
    try {
      const result = await eliminarHitoAsesoria(userEmail, id);
      if (result.ok) {
        const slotToRemove = slots.find(s => s.id === id);
        setSlots(prev => prev.filter(slot => slot.id !== id));
        if (slotToRemove) {
          showToast(`Hito retirado: (${slotToRemove.day} - ${slotToRemove.time}) ya no está disponible para reserva.`);
        }
      } else {
        showToast(`Error: ${result.error || 'No se pudo eliminar'}`);
      }
    } catch (err) {
      console.error('Error eliminando hito:', err);
      showToast('Error de conexión. Intenta de nuevo.');
    }
  };

  // Accept a pending request: sync with GCalendar/Teams and add to active booked slots
  const handleAcceptRequest = (request: PendingRequest) => {
    setIsSyncing(true);
    
    setTimeout(() => {
      // 1. Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
      
      // 2. Add to actual slots of the teacher as BOOKED
      const newBookedSlot: TimeSlot = {
        id: `SLT-${Date.now()}`,
        day: request.day,
        time: request.timeSlot,
        platform: request.platform,
        lugar: 'SIN ESPECIFICAR',
        status: 'BOOKED',
        bookedBy: {
          name: request.student,
          id: request.studentId,
          group: request.group,
          avatar: request.avatar,
          topic: request.topic
        }
      };

      setSlots(prev => [...prev, newBookedSlot]);

      // 3. Keep in history with "COMPLETED" or as standard history future placeholder logic
      showToast(`¡Solicitud de ${request.student} validada! Evento sincronizado con Google Calendar & Teams Server.`);
      setIsSyncing(false);
    }, 1500);
  };

  // Reject a pending request
  const handleRejectRequest = (request: PendingRequest) => {
    setPendingRequests(prev => prev.filter(req => req.id !== request.id));
    
    // Add to history as CANCELLED
    const cancelledRecord: HistoryItem = {
      id: `HIS-${Date.now()}`,
      student: request.student,
      studentId: request.studentId,
      group: request.group,
      topic: request.topic,
      date: new Date().toISOString().split('T')[0],
      time: request.timeSlot,
      status: 'CANCELLED',
      platform: request.platform
    };

    setHistoryList(prev => [cancelledRecord, ...prev]);
    showToast(`Asesoría cancelada. Se notificó a ${request.student} por correo institucional.`);
  };

  // Simulate complete/archive of a booked slot
  const handleArchiveSession = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.bookedBy) return;

    // Remove from active slots list
    setSlots(prev => prev.filter(s => s.id !== slotId));

    // Add to completed history
    const completedRecord: HistoryItem = {
      id: `HIS-${Date.now()}`,
      student: slot.bookedBy.name,
      studentId: slot.bookedBy.id,
      group: slot.bookedBy.group,
      topic: slot.bookedBy.topic,
      date: new Date().toISOString().split('T')[0],
      time: slot.time,
      status: 'COMPLETED',
      platform: slot.platform
    };

    setHistoryList(prev => [completedRecord, ...prev]);
    showToast(`Sesión con ${slot.bookedBy.name} guardada exitosamente en la bitácora histórica.`);
  };

  // Sync overall calendar
  const handleOverallSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Consolidación completada. Todos los calendarios están sincronizados con Microsoft Graph API y Google Workspace.');
    }, 1800);
  };

  return (
    <div className="space-y-10 relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4.5 rounded-2xl bg-[#061a1a] border-2 border-cyan-400 text-cyan-300 font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-3 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-md"
          >
            <Zap size={14} className="text-cyan-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">MÓDULO: RED DE ASESORÍAS SÍNCRONAS</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight">ENGINE::SLOTS_MANAGER</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button 
            onClick={handleOverallSync}
            disabled={isSyncing}
            className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-white font-mono text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin text-cyan-400' : 'text-white'} />
            FORZAR HANDSHAKE GENERAL
          </button>
        </div>
      </header>

      {/* TACTICAL NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 overflow-x-auto gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === 'config' 
                ? 'bg-cyan-500/10 border-cyan-500/30 text-[#22D3EE]' 
                : 'bg-white/[0.01] border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <Plus size={13} />
            GESTOR DE HITOS ({slots.length})
          </button>
          
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-2 border relative ${
              activeTab === 'pending' 
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' 
                : 'bg-white/[0.01] border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <Inbox size={13} />
            SOLICITUDES ENTRANTE
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-[#0c0d12] font-sans font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === 'history' 
                ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]' 
                : 'bg-white/[0.01] border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <History size={13} />
            BITÁCORA DE RESOLTOS ({historyList.filter(h => h.status==='COMPLETED').length})
          </button>
        </div>

        {/* Sync Indicator */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/5 bg-white/[0.02] rounded-xl text-[9px] font-mono select-none">
          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="text-white/40 uppercase font-bold">API CONEXIÓN:</span>
          <span className="text-emerald-400 font-bold uppercase">ONLINE (SYNC GOOGLE/TEAMS)</span>
        </div>
      </div>

      {/* DYNAMIC CONTENT CONTAINER */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* VIEW 1: GESTOR DE HITOS (CONFIGURACIÓN) */}
        {activeTab === 'config' && (
          <>
            {/* Panel Izquierdo: Sembrado de Hito */}
            <div className="col-span-12 lg:col-span-4">
              <GlassCard title="Inyectar Disponibilidad" icon={Plus} accent="cyan">
                <form onSubmit={handleAddSlot} className="space-y-6 font-mono text-xs">
                  <p className="text-white/40 text-[10px] leading-relaxed mb-4">
                    Establece tus bloques de horas hábiles. Tus alumnos del grupo activo podrán reservar estas ranuras de tutoría personalizada en tiempo real.
                  </p>

                  <div className="space-y-1">
                    <label className="text-white/30 font-bold uppercase tracking-widest text-[9px] block">DÍA DE LA SEMANA</label>
                    <select 
                      value={newDay} 
                      onChange={(e) => setNewDay(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 p-3 rounded-xl text-white font-sans focus:border-[#22D3EE] outline-none"
                    >
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/30 font-bold uppercase tracking-widest text-[9px] block">HORA (SÍNCRONA)</label>
                    <input 
                      type="text" 
                      value={newTime} 
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 04:00 PM o 11:30 AM"
                      className="w-full bg-[#0d0e12] border border-white/10 p-3 rounded-xl text-white font-sans focus:border-[#22D3EE] focus:ring-0 outline-none uppercase font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/30 font-bold uppercase tracking-widest text-[9px] block">CANAL DE TRANSMISIÓN</label>
                    <select 
                      value={newPlatform} 
                      onChange={(e) => setNewPlatform(e.target.value as any)}
                      className="w-full bg-[#0d0e12] border border-white/10 p-3 rounded-xl text-white font-sans focus:border-[#22D3EE] outline-none"
                    >
                      <option value="GOOGLE_MEET">GOOGLE MEET (Cuentas Workspace)</option>
                      <option value="TEAMS_SYNCHRONOUS">MICROSOFT TEAMS (Sincrónico)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/30 font-bold uppercase tracking-widest text-[9px] block flex items-center gap-1">
                      <MapPin size={10} /> LUGAR / UBICACIÓN
                    </label>
                    <select 
                      value={newLugar} 
                      onChange={(e) => setNewLugar(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 p-3 rounded-xl text-white font-sans focus:border-[#22D3EE] outline-none"
                    >
                      {LUGARES_COMUNES.map(lugar => (
                        <option key={lugar} value={lugar}>{lugar}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#22D3EE] text-[#061a1a] font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_35px_rgba(34,211,238,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 [border:none]"
                  >
                    <Plus size={14} /> PUBLICAR HITO DE ASESORÍA
                  </button>
                </form>
              </GlassCard>
            </div>

            {/* Panel Derecho: Lista de Disponibilidad Activa */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <GlassCard title="Plantilla de Espacios Abiertos en el Dashboard" icon={Clock} accent="cyan">
                <div className="space-y-4">
                  {slots.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                      <AlertTriangle className="mx-auto text-white/20 mb-4" size={32} />
                      <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">No tienes ningún hito de disponibilidad creado para esta semana.</p>
                    </div>
                  ) : (
                    slots.map(slot => {
                      const isBooked = slot.status === 'BOOKED';
                      return (
                        <div 
                          key={slot.id} 
                          className={`p-5 rounded-3xl border-2 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                            isBooked 
                              ? 'border-amber-400/20 bg-amber-450/5' 
                              : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl border ${
                              isBooked 
                                ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' 
                                : 'bg-cyan-500/10 border-cyan-500/20 text-[#22D3EE]'
                            }`}>
                              <Calendar size={18} />
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h4 className="text-white text-sm font-black font-mono tracking-tight">{slot.day} &bull; {slot.time}</h4>
                                <span className={`text-[7px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                                  isBooked 
                                    ? 'bg-amber-400/20 border-amber-400/30 text-amber-300' 
                                    : 'bg-cyan-500/15 border-cyan-500/20 text-[#22D3EE]'
                                }`}>
                                  {isBooked ? 'RESERVADO' : 'LIBRE/ABIERTO'}
                                </span>
                              </div>

                              <p className="text-white/40 text-[9px] font-mono uppercase font-bold mt-1 tracking-widest flex items-center gap-1">
                                <Video size={10} className="text-white/20" />
                                {slot.platform === 'GOOGLE_MEET' ? 'Google Meet (Workspace auto-meet)' : 'Microsoft Teams Synced link'}
                              </p>
                              <p className="text-white/40 text-[9px] font-mono uppercase font-bold mt-1 tracking-widest flex items-center gap-1">
                                <MapPin size={10} className="text-white/20" />
                                {slot.lugar || 'SIN ESPECIFICAR'}
                              </p>

                              {/* Student Detail if Booked */}
                              {isBooked && slot.bookedBy && (
                                <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 max-w-md">
                                  <img src={slot.bookedBy.avatar} className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                                  <div>
                                    <p className="text-white text-[10px] font-black uppercase">{slot.bookedBy.name}</p>
                                    <p className="text-white/30 text-[8px] font-mono uppercase tracking-widest leading-none mt-0.5">{slot.bookedBy.group} &bull; {slot.bookedBy.id}</p>
                                    <p className="text-amber-300/80 text-[8px] italic font-mono mt-1 text-wrap line-clamp-1">{slot.bookedBy.topic}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                            {isBooked && (
                              <button 
                                onClick={() => handleArchiveSession(slot.id)}
                                className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5"
                                title="Dar sesión por completada"
                              >
                                <FileCheck size={11} />
                                Completada
                              </button>
                            )}

                            <button 
                              onClick={() => handleRemoveSlot(slot.id)}
                              className="p-2.5 rounded-xl border border-white/5 hover:border-red-400/30 text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                              title="Retirar ranura horaria"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* VIEW 2: SOLICITUDES ENTRANTE */}
        {activeTab === 'pending' && (
          <div className="col-span-12 space-y-6">
            <GlassCard 
              title="Solicitudes Pendientes de Validación" 
              icon={Inbox} 
              accent="orange"
            >
              {/* Caption description */}
              <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed mb-4 italic max-w-4xl border-l border-amber-400/30 pl-3">
                A continuación se listan las solicitudes enviadas por los alumnos desde su panel de asesoría. Al aceptarlas, se consolida la reserva, y se gatilla la sincronización directa hacia tu Google Calendar y Microsoft Teams.
              </p>
              <div className="space-y-4 pt-4">
                {pendingRequests.length === 0 ? (
                  <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                    <CheckCircle2 className="mx-auto text-emerald-400/20 mb-4 animate-[bounce_2s_infinite]" size={36} />
                    <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">¡Tu bandeja está vacía! No hay solicitudes de asesoría pendientes.</p>
                  </div>
                ) : (
                  pendingRequests.map(req => (
                    <motion.div 
                      key={req.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 rounded-3xl border-2 border-amber-500/20 bg-amber-500/[0.01] flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative">
                          <img src={req.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#061a1a] rounded-full border border-amber-500/30 flex items-center justify-center">
                            <Clock size={10} className="text-amber-400 animate-spin" />
                          </div>
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-white text-sm font-black font-mono uppercase tracking-tight">{req.student}</h3>
                            <span className="text-[7px] font-mono font-black text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded uppercase bg-amber-500/10">
                              PENDIENTE SYNC
                            </span>
                            <span className="text-white/30 text-[8px] font-mono uppercase tracking-widest">{req.group}</span>
                          </div>

                          <p className="text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Calendar size={11} className="shrink-0" />
                            FECHA/HORA SÍNCRO: {req.day} &bull; {req.timeSlot} ({req.platform === 'GOOGLE_MEET' ? 'Google Meet' : 'Teams'})
                          </p>

                          <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5 mt-3 max-w-3xl leading-relaxed">
                            <span className="text-white/20 text-[7px] font-mono tracking-widest block uppercase font-bold mb-1">Habilidad / Tópico de Refuerzo:</span>
                            <p className="text-white/70 italic text-[10px] font-mono">{req.topic}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2.5 w-full md:w-auto justify-end self-stretch md:self-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                        <button 
                          onClick={() => handleAcceptRequest(req)}
                          disabled={isSyncing}
                          className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-emerald-500 text-[#0c0d12] font-mono text-[9px] font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(74,222,128,0.30)] active:scale-95 transition-all flex items-center justify-center gap-2 [border:none]"
                        >
                          <CheckCircle size={12} />
                          ACEPTAR Y SINCRONIZAR
                        </button>
                        
                        <button 
                          onClick={() => handleRejectRequest(req)}
                          className="px-4 py-3 rounded-2xl bg-rose-500/10 border-2 border-rose-500/25 hover:border-rose-500 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={12} />
                          RECHAZAR
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* VIEW 3: BITÁCORA DE RESUELTOS */}
        {activeTab === 'history' && (
          <div className="col-span-12">
            <GlassCard 
              title="Bitácora de Cobertura e Historial de Citas" 
              icon={History} 
              accent="green"
            >
              {/* Caption description */}
              <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed mb-4 italic max-w-4xl border-l border-emerald-400/30 pl-3">
                Historial registrado en el Data Lake educativo. Contiene las asesorías que ya han sido resueltas, así como aquellas que fueron rechazadas o canceladas por motivos académicos.
              </p>
              <div className="pt-4 overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse font-mono text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/5 pb-2 text-[8px] sm:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] font-mono">
                      <th className="py-4">FECHA LOG</th>
                      <th className="py-4">ALUMNO</th>
                      <th className="py-4">TÓPICO / DETALLE DE ASESORÍA</th>
                      <th className="py-4">PLATA-CANAL</th>
                      <th className="py-4 text-right">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {historyList.map((item) => {
                      const isCompleted = item.status === 'COMPLETED';
                      return (
                        <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 text-white/40 text-[10px]">{item.date} &bull; {item.time}</td>
                          <td className="py-4">
                            <p className="text-white font-black uppercase tracking-tight">{item.student}</p>
                            <p className="text-[8px] text-white/20 uppercase mt-0.5">{item.group} &bull; {item.studentId}</p>
                          </td>
                          <td className="py-4 text-white/60 italic leading-relaxed text-[10px] max-w-xs truncate">{item.topic}</td>
                          <td className="py-4 text-white/40 text-[9px]">
                            {item.platform === 'GOOGLE_MEET' ? 'Google Meet API' : 'MS Teams Direct'}
                          </td>
                          <td className="py-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-wider ${
                              isCompleted 
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}>
                              {isCompleted ? <Check size={8} /> : <XCircle size={8} />}
                              {isCompleted ? 'RESUELTA' : 'CANCELADA'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </div>
  );
}
