/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  GraduationCap,
  Layers,
  ArrowRight,
  Zap,
  MoreVertical,
  Trash2,
  Clock,
  LayoutGrid,
  Table,
  Lock,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Group, GroupSubject } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { listarGrupos, crearGrupo, eliminarGrupo, GrupoAcademico } from '../services/identityService';
import { obtenerConfigAcademica } from '../services/identityService';

interface GroupManagerProps {
  onOpenScheduler: (groupId: string) => void;
}

export function GroupManager({ onOpenScheduler }: GroupManagerProps) {
  const { careers, groups, addGroup, deleteGroup, userEmail } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    careerId: '',
    semester: '1',
    section: 'A',
    shift: 'Matutino'
  });

  // Datos del data lake
  const [gruposLake, setGruposLake] = useState<GrupoAcademico[]>([]);
  const [carrerasLake, setCarrerasLake] = useState<string[]>([]);
  const [loadingLake, setLoadingLake] = useState(false);
  const [savingGroup, setSavingGroup] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Vista: 'grid' (cards) o 'table' (tabla)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Cargar grupos y config académica del director desde el Data Lake
  const cargarDesdeLake = async () => {
    if (!userEmail) {
      setInitError('Sin email de usuario — verifica que hayas iniciado sesión');
      return;
    }
    setLoadingLake(true);
    setInitError(null);
    try {
      const gruposData = await listarGrupos(userEmail);
      setGruposLake(gruposData.filter(g => g.status === 'ACTIVE'));
      const cfg = await obtenerConfigAcademica({ email: userEmail });
      if (cfg.ok && Array.isArray((cfg as any).carreras)) {
        setCarrerasLake((cfg as any).carreras);
      }
    } catch (err) {
      console.error('[GroupManager] Error cargando del Lake:', err);
      setInitError('No se pudo conectar con el Data Lake. El backend puede no estar re-desplegado.');
    } finally {
      setLoadingLake(false);
    }
  };

  useEffect(() => {
    cargarDesdeLake();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // Lógica de Herencia: Clonar materias de la carrera
  const getInheritedSubjects = (): GroupSubject[] => {
    const career = careers.find(c => c.id === newGroupData.careerId);
    if (!career) return [];

    return career.subjects
      .filter(s => s.semester === parseInt(newGroupData.semester))
      .map(s => ({
        ...s,
        assignedTeacherId: undefined,
        isCompleted: false
      }));
  };

  const inheritedSubjects = getInheritedSubjects();

  const handleCreateGroup = async () => {
    if (!newGroupData.careerId) return;

    // newGroupData.careerId ahora guarda el NOMBRE de la carrera (no el id)
    const careerName = newGroupData.careerId;
    const careerMatch = careers.find(c => c.name.toUpperCase() === careerName.toUpperCase());

    // Local (optimista) — siempre se guarda local
    const grupoLocal: Group = {
      id: `GRP-${Date.now()}`,
      name: `${careerName} - ${newGroupData.semester}° ${newGroupData.section}`,
      level: newGroupData.semester,
      careerId: careerMatch?.id || careerName, // usa id si existe, sino el nombre como fallback
      subjects: careerMatch ? careerMatch.subjects.filter(s => s.semester === parseInt(newGroupData.semester)).map(s => ({
        ...s, assignedTeacherId: undefined, isCompleted: false
      })) : inheritedSubjects,
      teacherId: '',
      studentIds: [],
      schedule: {},
      time: newGroupData.shift === 'Matutino' ? '07:00 AM' : '02:00 PM',
      days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'],
      status: 'ACTIVE'
    };
    addGroup(grupoLocal);

    // Data Lake (persistencia) — si falla, sigue funcionando local
    if (!userEmail) {
      console.warn('[GroupManager] Sin userEmail, grupo solo en local');
      setShowAddModal(false);
      setNewGroupData({ careerId: '', semester: '1', section: 'A', shift: 'Matutino' });
      return;
    }

    setSavingGroup(true);
    try {
      const result = await crearGrupo(userEmail, {
        carrera: careerName,
        grado: newGroupData.semester,
        seccion: newGroupData.section,
        turno: newGroupData.shift.toUpperCase(),
        modalidad: 'PRESENCIAL',
        materias: inheritedSubjects.map(s => ({ nombre: s.name, horas: s.weeklyHours })),
        horario: {},
        dias: 'LUN,MAR,MIÉ,JUE,VIE'
      });
      if (result.ok) {
        await cargarDesdeLake();
      } else if (result.error === 'carrera_no_en_config') {
        console.warn('[GroupManager] Carrera no está en config académica del lake:', careerName);
        // El grupo ya está guardado local — no bloqueamos al usuario
      } else {
        console.error('[GroupManager] Error creando grupo en lake:', result.error);
      }
    } catch (err) {
      console.error('[GroupManager] Error creando grupo:', err);
    } finally {
      setSavingGroup(false);
      setShowAddModal(false);
      setNewGroupData({ careerId: '', semester: '1', section: 'A', shift: 'Matutino' });
    }
  };

  const handleDeleteGroup = async (grupoId: string) => {
    deleteGroup(grupoId);
    if (userEmail) {
      try {
        await eliminarGrupo(userEmail, grupoId);
        await cargarDesdeLake();
      } catch (err) {
        console.error('[GroupManager] Error eliminando:', err);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {initError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">{initError}</span>
          </div>
          <button
            onClick={cargarDesdeLake}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-400 transition-all"
          >
            Reintentar
          </button>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Estructura Institucional</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            GRADOS Y <span className="text-[#DEFF9A]">GRUPOS</span>
          </h1>
          {loadingLake && (
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Sincronizando con Data Lake...
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Toggle Grid / Table */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#DEFF9A]/15 text-[#DEFF9A] shadow-[0_0_10px_rgba(222,255,154,0.2)]'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Vista en tarjetas"
            >
              <LayoutGrid size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                viewMode === 'table'
                  ? 'bg-[#DEFF9A]/15 text-[#DEFF9A] shadow-[0_0_10px_rgba(222,255,154,0.2)]'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Vista en tabla"
            >
              <Table size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Tabla</span>
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 rounded-2xl bg-[#DEFF9A] text-black flex items-center gap-4 hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.3)]"
          >
            <Plus size={20} />
            Crear Nuevo Grupo
          </button>
        </div>
      </header>

      {/* Group List — Grid o Tabla según viewMode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group.id}>
              <GlassCard className="!p-0 group relative overflow-hidden border-white/5 hover:border-[#DEFF9A]/30 transition-all">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                        <Layers size={24} />
                     </div>
                     <button onClick={() => handleDeleteGroup(group.id)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                     </button>
                  </div>

                  <div>
<h3 className="text-xl font-black text-white uppercase tracking-tight italic leading-tight group-hover:text-[#DEFF9A] transition-colors">
                       {group.name}
                   </h3>
                   <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{group.level}° Semestre</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="text-[10px] font-bold text-[#DEFF9A] uppercase tracking-widest italic">Grupo {group.name.split(' ').pop()}</span>
                   </div>
                 </div>

                 <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Carga Académica</p>
                       <p className="text-white text-xs font-bold">{group.subjects.length} Materias</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Estado</p>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A] animate-pulse" />
                          <p className="text-white text-xs font-bold uppercase">Activo</p>
                       </div>
                    </div>
                 </div>

                 <button
                   disabled
                   className="w-full py-4 rounded-xl bg-white/5 border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest cursor-not-allowed select-none transition-all flex items-center justify-center gap-3"
                 >
                    Gestionar Materias (Deshabilitado) <Lock size={14} />
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </GlassCard>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] text-white/20 gap-6">
             <LayoutGrid size={80} className="opacity-20" />
             <div className="text-center">
                <p className="text-2xl font-black uppercase italic">Tablero Vacío</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-60">Inicia la estructura creando el primer grupo académico</p>
             </div>
          </div>
        )}
      </div>
      ) : (
        /* Vista TABLA */
        <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-white/5 bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Carrera</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Grado</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Sección</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Turno</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Modalidad</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Materias</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groups.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-white/20">
                        <Table size={48} className="opacity-30" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No hay grupos en la tabla</p>
                      </div>
                    </td>
                  </tr>
                )}
                {groups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-[#DEFF9A]/05 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-white text-xs font-bold uppercase tracking-tight">
                        {group.name.split(' - ')[0] || group.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#DEFF9A]/10 text-[#DEFF9A] rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {group.level}°
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white text-xs font-bold uppercase">{group.name.split(' ').pop()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-xs font-bold uppercase">{group.time?.includes('AM') ? 'Matutino' : group.time?.includes('PM') ? 'Vespertino' : '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-xs font-bold uppercase">{(group as any).modalidad || 'PRESENCIAL'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/60 text-xs font-bold">{group.subjects.length} mat.</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#DEFF9A]/10 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DEFF9A] animate-pulse" />
                        <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">Activo</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Eliminar grupo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-[#061a1a]/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <GlassCard className="!p-8 space-y-8 border-[#DEFF9A]/20 relative">
                 {/* Overlay de loading — bloquea interacción visual durante guardado */}
                 {savingGroup && (
                   <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#061a1a]/80 backdrop-blur-sm rounded-2xl">
                      <div className="relative">
                         <Loader2 size={64} className="text-[#DEFF9A] animate-spin" />
                         <CheckCircle2 size={20} className="text-[#DEFF9A] absolute -bottom-1 -right-1 opacity-0 animate-pulse" />
                      </div>
                      <p className="mt-6 text-[#DEFF9A] text-xs font-black uppercase tracking-[0.3em]">
                        Construyendo grupo en el Data Lake
                      </p>
                      <p className="mt-2 text-white/40 text-[9px] font-bold uppercase tracking-widest">
                        Por favor espera...
                      </p>
                   </div>
                 )}
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">NUEVA <span className="text-[#DEFF9A]">UNIDAD GRUPAL</span></h2>
                    <button onClick={() => setShowAddModal(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Seleccionar Carrera</label>
                       <select
                         value={newGroupData.careerId}
                         onChange={(e) => {
                           console.log('[GroupManager] Carrera seleccionada:', e.target.value);
                           setNewGroupData({...newGroupData, careerId: e.target.value});
                         }}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-[#DEFF9A]/50 transition-all appearance-none"
                       >
                          <option value="" className="bg-[#061a1a]">-- Elegir Carrera --</option>
                          {/* Primero las del Data Lake (config académica del director) */}
                          {carrerasLake.length > 0 && carrerasLake.map((nombre, idx) => {
                            const careerMatch = careers.find(c => c.name.toUpperCase() === nombre.toUpperCase());
                            // Usar el nombre del Lake como value para que SIEMPRE funcione,
                            // incluso si no hay match en el array careers (mock)
                            return (
                              <option key={`lake-${idx}`} value={nombre} className="bg-[#061a1a]">
                                {nombre}
                              </option>
                            );
                          })}
                          {/* Luego las hardcoded como fallback */}
                          {careers.filter(c => !carrerasLake.some(n => n.toUpperCase() === c.name.toUpperCase())).map(c => (
                            <option key={c.id} value={c.name} className="bg-[#061a1a]">{c.name}</option>
                          ))}
                       </select>
                       {carrerasLake.length === 0 && !loadingLake && (
                         <p className="text-[8px] text-white/20 pl-4 italic">
                           ⚠️ Sin config académica del director. Ve a Settings → IDENTIDAD → Configuración Académica.
                         </p>
                       )}
                    </div>

                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Semestre</label>
                       <select 
                         value={newGroupData.semester}
                         onChange={(e) => setNewGroupData({...newGroupData, semester: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-[#DEFF9A]/50 transition-all appearance-none"
                       >
                          {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n} className="bg-[#061a1a]">{n}° Semestre</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Grupo / Sección</label>
                       <input 
                         type="text" 
                         value={newGroupData.section}
                         placeholder="A, B, C..."
                         onChange={(e) => setNewGroupData({...newGroupData, section: e.target.value.toUpperCase()})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-[#DEFF9A]/50 transition-all"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-white/20 text-[10px] font-black uppercase tracking-widest pl-4">Turno</label>
                       <div className="grid grid-cols-2 gap-4">
                          {['Matutino', 'Vespertino'].map(t => (
                            <button 
                              key={t}
                              onClick={() => setNewGroupData({...newGroupData, shift: t})}
                              className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${newGroupData.shift === t ? 'bg-[#DEFF9A] text-black border-[#DEFF9A]' : 'bg-white/5 text-white/20 border-white/10'}`}
                            >
                               {t}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Preview Inheritance */}
                 {newGroupData.careerId && (
                   <div className="p-6 rounded-[2.5rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/10 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-[#DEFF9A] flex items-center justify-center text-black">
                            <Zap size={16} />
                         </div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">Herencia Académica Detectada</h4>
                      </div>
                      <div className="space-y-2">
                         {inheritedSubjects.map((s, i) => (
                           <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[10px] font-bold text-white/60">{s.name}</span>
                              <span className="text-[9px] font-black text-[#DEFF9A]">{s.weeklyHours}h</span>
                           </div>
                         ))}
                         {inheritedSubjects.length === 0 && (
                           <p className="text-[10px] text-white/20 italic font-black text-center py-4">No hay materias configuradas para este semestre en el catálogo.</p>
                         )}
                      </div>
                   </div>
                 )}

                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-5 rounded-[2rem] border border-white/10 bg-white/5 text-white/60 hover:text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                       Cancelar / Regresar
                    </button>
<button
                       onClick={handleCreateGroup}
                       disabled={!newGroupData.careerId || savingGroup}
                       className={`flex-[2] py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 cursor-pointer relative overflow-hidden ${savingGroup ? 'bg-[#DEFF9A]/70 text-black cursor-wait' : !newGroupData.careerId ? 'bg-white/5 text-white/10 opacity-50 cursor-not-allowed' : 'bg-[#DEFF9A] text-black shadow-[0_0_40px_rgba(222,255,154,0.4)] hover:scale-[1.02]'}`}
                     >
                       {savingGroup ? (
                           <>
                              {/* Spinner animado */}
                              <Loader2 size={20} className="animate-spin" />
                              {/* Texto dinámico */}
                              <span>Construyendo grupo...</span>
                              {/* Pulse indicator */}
                              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <span className="w-3 h-3 bg-[#DEFF9A] rounded-full animate-ping opacity-75" />
                              </span>
                           </>
                       ) : newGroupData.careerId ? (
                           <>
                              <Plus size={18} />
                              Finalizar y Crear Grupo
                           </>
                       ) : (
                           <>
                              <Plus size={18} />
                              Selecciona una carrera
                           </>
                       )}
                     </button>
                 </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
