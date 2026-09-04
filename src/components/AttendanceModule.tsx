/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  QrCode, 
  Save,
  MessageSquare,
  ChevronLeft,
  AlertTriangle,
  FileText,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { QRScannerModule } from './QRScannerModule';
import { useAppContext } from '../context/AppContext';
import { registrarAsistencia, obtenerMiembrosDeGrupo, type RegistroAsistencia } from '../services/identityService';

interface Student {
  id: string;
  name: string;
  email: string;
  photo: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | null;
}

type AttendanceStatus = Student['status'];

export function AttendanceModule({ groupName = "A1-102", onBack }: { groupName?: string; onBack: () => void }) {
  const { userEmail } = useAppContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load real students from API
  useEffect(() => {
    if (!userEmail || !groupName) return;
    let cancelled = false;
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const miembros = await obtenerMiembrosDeGrupo(userEmail, groupName);
        if (cancelled) return;
        const mapped: Student[] = miembros.map(m => ({
          id: m.user_id,
          name: (m.nombre || m.email || '').toUpperCase(),
          email: m.email || '',
          photo: `https://i.pravatar.cc/150?u=${m.user_id}`,
          status: null,
        }));
        setStudents(mapped);
      } catch (err) {
        console.warn('[AttendanceModule] Error loading students:', err);
        setStudents([]);
      } finally {
        if (!cancelled) setLoadingStudents(false);
      }
    };
    loadStudents();
    return () => { cancelled = true; };
  }, [userEmail, groupName]);

  const updateStatus = useCallback((id: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }, []);

  const stats = {
    present: students.filter(s => s.status === 'PRESENT').length,
    absent: students.filter(s => s.status === 'ABSENT').length,
    late: students.filter(s => s.status === 'LATE').length,
  };

  const handleSaveAttendance = async () => {
    if (!userEmail) return;
    setSaving(true);
    try {
      const registros: RegistroAsistencia[] = students
        .filter(s => s.status !== null)
        .map(s => ({
          user_id: s.id,
          email: s.email,
          nombre: s.name,
          estado: s.status === 'PRESENT' ? 'PRESENTE' :
                  s.status === 'ABSENT' ? 'AUSENTE' :
                  'RETRASO' as any,
        }));

      if (registros.length === 0) {
        setToastMsg('No hay registros para guardar');
        setTimeout(() => setToastMsg(null), 3000);
        setSaving(false);
        return;
      }

      const res = await registrarAsistencia(userEmail, groupName, registros);
      if ((res as any).ok) {
        setToastMsg(`${registros.length} registros guardados correctamente`);
      } else {
        setToastMsg('Error al guardar: ' + ((res as any).error || 'desconocido'));
      }
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      console.error('[AttendanceModule] save error:', err);
      setToastMsg('Error al guardar asistencia');
      setTimeout(() => setToastMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleQrScan = useCallback(async (data: string) => {
    let id: string | undefined;
    const trimmed = String(data || '').trim();

    if (trimmed.startsWith('TECLINGO:')) {
      id = trimmed.substring('TECLINGO:'.length);
    } else if (trimmed.includes('@')) {
      id = trimmed;
    } else if (trimmed.startsWith('usr_')) {
      id = trimmed;
    } else if (trimmed.includes('-')) {
      id = trimmed.split('-').pop()?.replace(/^0+/, '') || trimmed;
    } else {
      id = trimmed;
    }

    if (id) {
      updateStatus(id, 'PRESENT');
      setToastMsg(`Presente: ${id}`);
      setTimeout(() => setToastMsg(null), 2000);

      // Persist immediately via API
      if (userEmail) {
        const found = students.find(s => s.id === id);
        try {
          await registrarAsistencia(userEmail, groupName, [{
            user_id: id,
            email: found?.email || `${id}@teclingo.edu`,
            nombre: found?.name || id,
            estado: 'PRESENTE',
          }]);
        } catch (err) {
          console.warn('[AttendanceModule] QR auto-save error:', err);
        }
      }
    }
  }, [updateStatus, userEmail, groupName, students]);

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <button 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/10"
           >
              <ChevronLeft size={24} />
           </button>
           <div>
              <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Gestion de Aula</h2>
              <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Pase de Lista: {groupName}</h1>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">
                Sesion: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
           </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80] text-[10px] font-black uppercase tracking-widest text-center min-w-[100px]">
              Presentes: {stats.present}
           </div>
           <div className="px-6 py-3 rounded-2xl bg-[#F87171]/10 border border-[#F87171]/20 text-[#F87171] text-[10px] font-black uppercase tracking-widest text-center min-w-[100px]">
              Faltas: {stats.absent}
           </div>
           <div className="px-6 py-3 rounded-2xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] text-[10px] font-black uppercase tracking-widest text-center min-w-[100px]">
              Retrasos: {stats.late}
           </div>
        </div>
      </header>

      {loadingStudents ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#DEFF9A]/30 border-t-[#DEFF9A] rounded-full animate-spin mb-4" />
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cargando alumnos del grupo...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Users size={48} className="text-white/20 mb-4" />
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">No hay alumnos en este grupo</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
         {students.map((student) => {
           const borderClass = student.status === 'PRESENT' ? 'border-[#4ADE80]/40 shadow-[0_0_20px_rgba(74,222,128,0.1)]' :
                               student.status === 'ABSENT' ? 'border-[#F87171]/40 shadow-[0_0_20px_rgba(248,113,113,0.1)]' :
                               student.status === 'LATE' ? 'border-[#FBBF24]/40 shadow-[0_0_20px_rgba(251,191,36,0.1)]' :
                               'border-white/5';
           
           const bgClass = student.status === 'PRESENT' ? 'bg-[#4ADE80]/05' :
                           student.status === 'ABSENT' ? 'bg-[#F87171]/05' :
                           student.status === 'LATE' ? 'bg-[#FBBF24]/05' :
                           'bg-white/[0.02]';

           return (
             <motion.div 
              key={student.id}
              className={`p-6 rounded-[2.5rem] border ${borderClass} ${bgClass} transition-all flex items-center gap-8 group`}
             >
                <div className="flex items-center gap-6 flex-1">
                   <div className="relative">
                      <div className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                         <img src={student.photo} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#DEFF9A] flex items-center justify-center text-[#061a1a] shadow-lg">
                         <Users size={8} />
                      </div>
                   </div>
                   <div>
                      <h4 className="text-white text-lg font-black uppercase tracking-tight">{student.name}</h4>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mt-1">ID: {student.id}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => updateStatus(student.id, 'PRESENT')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      student.status === 'PRESENT' ? 'bg-[#4ADE80] text-[#061a1a] border-[#4ADE80] shadow-[0_0_20px_#4ADE8060]' : 'bg-white/5 text-white/30 border-white/10 hover:text-white'
                    }`}
                   >
                      <CheckCircle2 size={12} /> Presente
                   </button>
                   <button 
                    onClick={() => updateStatus(student.id, 'ABSENT')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      student.status === 'ABSENT' ? 'bg-[#F87171] text-[#061a1a] border-[#F87171] shadow-[0_0_20px_#F8717160]' : 'bg-white/5 text-white/30 border-white/10 hover:text-white'
                    }`}
                   >
                      <XCircle size={12} /> Falta
                   </button>
                   <button 
                    onClick={() => updateStatus(student.id, 'LATE')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      student.status === 'LATE' ? 'bg-[#FBBF24] text-[#061a1a] border-[#FBBF24] shadow-[0_0_20px_#FBBF2460]' : 'bg-white/5 text-white/30 border-white/10 hover:text-white'
                    }`}
                   >
                      <Clock size={12} /> Retraso
                   </button>
                   
                   <div className="w-px h-8 bg-white/10 mx-2" />
                   
                   <button 
                    onClick={() => setShowNotificationModal(student.name)}
                    className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]/60 hover:bg-[#DEFF9A]/20 hover:text-[#DEFF9A] transition-all"
                    title="Enviar mensaje al alumno"
                   >
                      <MessageSquare size={18} />
                   </button>
                </div>
             </motion.div>
           );
         })}
      </div>
      )}

      <div className="fixed bottom-12 right-12 z-40 flex gap-4">
         <button 
          onClick={() => setShowScanner(true)}
          className="px-10 py-5 rounded-[2.5rem] bg-white/5 border border-white/10 text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 hover:text-white transition-all"
         >
            <QrCode size={18} className="text-[#DEFF9A]" /> QR Scan Mode
         </button>
         <button 
          onClick={handleSaveAttendance}
          disabled={saving}
          className="px-12 py-5 rounded-[2.5rem] bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest shadow-[0_15px_40px_rgba(222,255,154,0.4)] flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50"
         >
            <Save size={18} /> {saving ? 'Guardando...' : 'Finalizar Pase de Lista'}
         </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(222,255,154,0.4)]"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner + Notification Modal */}
      <AnimatePresence>
        {showScanner && (
          <QRScannerModule 
            onClose={() => setShowScanner(false)} 
            onScanSuccess={handleQrScan}
          />
        )}
        {showNotificationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
          >
             <GlassCard accent="green" className="max-w-md w-full !p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Notificacion a Tutor</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-8">ALUMNO: {showNotificationModal}</p>
                
                <div className="space-y-4 mb-10">
                   <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-[#DEFF9A]/40 transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={12} className="text-yellow-400" />
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Retraso Academico</p>
                      </div>
                      <p className="text-white/40 text-[9px] font-bold">Informa que el alumno llego tarde a la sesion.</p>
                   </button>
                   <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-[#DEFF9A]/40 transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={12} className="text-green-400" />
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Felicidades (Puntualidad)</p>
                      </div>
                      <p className="text-white/40 text-[9px] font-bold">Premia la consistencia y puntualidad del alumno.</p>
                   </button>
                   <div className="relative">
                      <textarea 
                        placeholder="Mensaje personalizado..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-[11px] placeholder:text-white/10 h-32 outline-none focus:border-[#DEFF9A]/40"
                      />
                   </div>
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={() => setShowNotificationModal(null)}
                    className="flex-1 py-4 border border-white/10 rounded-2xl text-white/40 text-[10px] font-black uppercase"
                   >
                      Cancelar
                   </button>
                   <button 
                    onClick={() => {
                      setToastMsg('Mensaje enviado');
                      setTimeout(() => setToastMsg(null), 2000);
                      setShowNotificationModal(null);
                    }}
                    className="flex-[2] py-4 bg-[#DEFF9A] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase shadow-[0_10px_30px_rgba(222,255,154,0.3)] flex items-center justify-center gap-2"
                   >
                      <Send size={14} /> Enviar Aviso TECLINGO
                   </button>
                </div>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
