/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

interface TimeSlot {
  id: string;
  group: string;
  teacher: string;
  day: string; // 'Mon', 'Tue', etc.
  startTime: string; // '08:00'
  endTime: string;
  room: string;
  isConflict?: boolean;
}

interface TeacherAvailability {
  name: string;
  availableSlots: string[]; // e.g., ['Mon-08:00-12:00', 'Wed-10:00-14:00']
}

const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const teacherAvailability: Record<string, string[]> = {
  'Ana López': ['Lun-08:00-14:00', 'Mie-08:00-14:00', 'Vie-08:00-14:00'],
  'Luis Garcia': ['Mar-08:00-17:00', 'Jue-08:00-17:00'],
  'Pedro S.': ['Lun-14:00-18:00', 'Mar-14:00-18:00', 'Mie-14:00-18:00'],
};

export function SchedulesMaster() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: '1', group: 'A1-102', teacher: 'Ana López', day: 'Lun', startTime: '08:00', endTime: '10:00', room: 'Lab 1' },
    { id: '2', group: 'B2-201', teacher: 'Luis Garcia', day: 'Mar', startTime: '10:00', endTime: '12:00', room: 'Virtual' },
    { id: '3', group: 'C1-304', teacher: 'Ana López', day: 'Mie', startTime: '12:00', endTime: '14:00', room: 'Lab 2' },
  ]);

  const [isPublishing, setIsPublishing] = useState(false);

  const checkConflict = (teacher: string, day: string, startTime: string): boolean => {
    const availability = teacherAvailability[teacher];
    if (!availability) return false;
    
    // Simple check: is the day/time in the availability ranges?
    return !availability.some(range => {
      const [aDay, aStart, aEnd] = range.split('-');
      if (aDay !== day) return false;
      return startTime >= aStart && startTime < aEnd;
    });
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => setIsPublishing(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Logística Inteligente</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase">Smart Scheduler Master</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
            <button className="p-2 text-white/40 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#DEFF9A]">Ciclo 2026-A</div>
            <button className="p-2 text-white/40 hover:text-white transition-colors"><ChevronRight size={16} /></button>
          </div>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="relative group bg-[#DEFF9A] text-[#061a1a] rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_#DEFF9A90] transition-all disabled:opacity-50"
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <Zap size={14} className="animate-bounce" /> Publicando...
              </span>
            ) : (
              'Publicar Ciclo Escolar'
            )}
            
            {/* Pulsing glow */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-[#DEFF9A] animate-ping opacity-20 pointer-events-none" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <GlassCard className="!p-0 overflow-hidden" accent="green">
            <div className="relative overflow-x-auto min-w-[800px]">
              {/* Grid Header */}
              <div className="grid grid-cols-6 border-b border-white/5 bg-white/[0.02]">
                <div className="p-4 border-r border-white/5" />
                {days.map(day => (
                  <div key={day} className="p-4 text-center border-r last:border-0 border-white/5">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">{day}</span>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="relative">
                {hours.map((hour, hIdx) => (
                  <div key={hour} className="grid grid-cols-6 border-b border-white/5 group">
                    <div className="p-4 border-r border-white/5 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-white/20 group-hover:text-[#DEFF9A]/40 transition-colors">{hour}</span>
                    </div>
                    {days.map((day, dIdx) => (
                      <div key={day} className="h-20 border-r last:border-0 border-white/5 relative group/slot hover:bg-white/[0.02] transition-colors">
                        {/* Render Slot if it matches */}
                        {slots.filter(s => s.day === day && s.startTime === hour).map(slot => {
                          const hasConflict = checkConflict(slot.teacher, slot.day, slot.startTime);
                          return (
                            <motion.div
                              key={slot.id}
                              drag
                              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Simplified for visual 'feel'
                              className={`absolute inset-1 rounded-xl p-3 z-20 cursor-grab active:cursor-grabbing transition-all ${
                                hasConflict 
                                  ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/50 shadow-[0_0_15px_#F59E0B30]' 
                                  : 'bg-[#DEFF9A]/10 border border-[#DEFF9A]/30'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black text-white">{slot.group}</span>
                                {hasConflict && <AlertTriangle size={10} className="text-[#F59E0B]" />}
                              </div>
                              <p className="text-[8px] text-white/60 font-bold uppercase truncate">{slot.teacher}</p>
                              <div className="mt-2 flex items-center gap-1 opacity-40">
                                <MapPin size={8} />
                                <span className="text-[7px] font-bold uppercase">{slot.room}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <GlassCard title="Disponibilidad Docente" icon={User} delay={0.1}>
            <div className="space-y-4">
              {Object.entries(teacherAvailability).map(([name, ranges]) => (
                <div key={name} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] text-[10px] font-bold">
                      {name[0]}
                    </div>
                    <span className="text-xs font-bold text-white">{name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ranges.map(range => (
                      <span key={range} className="text-[8px] font-mono bg-black/40 px-2 py-1 rounded text-white/40 border border-white/5">
                        {range}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Alertas de Conflicto" icon={AlertTriangle} accent="orange" delay={0.2}>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F59E0B]/5 border border-[#F59E0B]/20">
                <p className="text-[#F59E0B] text-[10px] font-bold leading-relaxed">
                  Conflicto: Pedro S. no puede cubrir el horario del Grupo A2-105 los Viernes.
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="text-[8px] font-black uppercase tracking-widest bg-[#F59E0B]/20 text-[#F59E0B] px-3 py-1.5 rounded-lg border border-[#F59E0B]/20">Reasignar</button>
                  <button className="text-[8px] font-black uppercase tracking-widest text-white/40 px-3 py-1.5 hover:text-white transition-colors">Ignorar</button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {isPublishing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/80 backdrop-blur-xl"
          >
            <div className="p-12 neo-glass border-[#DEFF9A]/40 rounded-[3rem] text-center max-w-md">
              <div className="w-24 h-24 bg-[#DEFF9A] rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_50px_#DEFF9A80]">
                <CheckCircle2 size={48} className="text-[#061a1a]" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Ciclo Publicado</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 leading-loose">
                Notificaciones Push enviadas a<br />
                <span className="text-[#DEFF9A]">12 Docentes • 350 Alumnos</span>
              </p>
              <button 
                onClick={() => setIsPublishing(false)}
                className="px-8 py-3 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                Cerrar Terminal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
