/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  ExternalLink,
  FileText,
  Sparkles,
  Calendar,
  CheckCircle2,
  X,
  Printer,
  Download,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Lock,
  Stamp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { mallaCurricularModulo1 } from '../data/mallaCurricularModulo1';
import { obtenerPlaneacion, guardarPlaneacionSemana, SemanaPlaneacion } from '../services/workbook/planeacionService';
import { useAppContext } from '../context/AppContext';

// Comprehensive dataset with ALL 18 weeks, 100% focused on Everyday English general situations (No technical jargon)
const semanasDemoData: { [key: number]: any } = {
  1: {
    semanaWeb: 1,
    unidad: "Unidad 1: Personal Profiles",
    eje_tematico: "Saludos, Presentaciones Personales y Cortesía Básica",
    progreso: 100,
    docenteResponsable: "Prof. Alejandro Ortega",
    estadoEvaluacion: "Aprobado",
    entregasEstimadas: [
      { id: "e1_1", titulo: "Evidencia de Tarjeta de Contacto Personal", fechaMax: "12 Sep 11:59 PM", entregado: true, calificacion: 95 },
      { id: "e1_2", titulo: "Audio de Presentación de 1 Minuto", fechaMax: "12 Sep 11:59 PM", entregado: true, calificacion: 95 }
    ],
    checksMalla: [
      { id: "chk_1_1", txt: "Validar pronombres personales sujeto (I, You, He, She, It) en el Placement Test", done: true },
      { id: "chk_1_2", txt: "Garantizar simulación síncrona reactiva oral de presentación personal", done: true }
    ],
    comentariosDirector: "Excelente índice de participación al inicio del ciclo académico."
  },
  2: {
    semanaWeb: 2,
    unidad: "Unidad 1: Classroom Space",
    eje_tematico: "Objetos Escolares y del Aula de Clase",
    progreso: 100,
    docenteResponsable: "Prof. Alejandro Ortega",
    estadoEvaluacion: "Aprobado",
    entregasEstimadas: [
      { id: "e2_1", titulo: "Inventario Escrito del Aula con Demostrativos", fechaMax: "19 Sep 11:59 PM", entregado: true, calificacion: 90 }
    ],
    checksMalla: [
      { id: "chk_2_1", txt: "Aplicación de adjetivos demostrativos 'This, That, These, Those'", done: true },
      { id: "chk_2_2", txt: "Verificación de las instrucciones obligatorias del docente en clase", done: true }
    ],
    comentariosDirector: "Inventario verificado y calificado en tiempo y forma."
  },
  3: {
    semanaWeb: 3,
    unidad: "Unidad 2: Family Tree",
    eje_tematico: "Miembros de la Familia y Relaciones Básicas",
    progreso: 65,
    docenteResponsable: "Prof. Alejandro Ortega",
    estadoEvaluacion: "En Revisión",
    entregasEstimadas: [
      { id: "e3_1", titulo: "Árbol Genealógico Redactado (4 Miembros)", fechaMax: "26 Sep 11:59 PM", entregado: true, calificacion: 88 }
    ],
    checksMalla: [
      { id: "chk_3_1", txt: "Estructuración de pertenencia con posesivos (My, Your, His, Her)", done: true },
      { id: "chk_3_2", txt: "Ejercitar monólogo oral de 45 segundos describiendo parentesco", done: false }
    ],
    comentariosDirector: "Pendiente la acreditación del monólogo oral de varios alumnos."
  },
  4: {
    semanaWeb: 4,
    unidad: "Unidad 2: Global Citizens",
    eje_tematico: "Países, Nacionalidades e Idiomas del Mundo",
    progreso: 20,
    docenteResponsable: "Prof. Alejandro Ortega",
    estadoEvaluacion: "Cargado",
    entregasEstimadas: [
      { id: "e4_1", titulo: "Formulario de Aduana sin Errores de Mayúsculas", fechaMax: "03 Oct 11:59 PM", entregado: false, calificacion: 0 }
    ],
    checksMalla: [
      { id: "chk_4_1", txt: "Dominio de origen geográfico con preposiciones 'From' e 'In'", done: false },
      { id: "chk_4_2", txt: "Revisar reglas formalizadas de capitalización en TOEFL iBT", done: false }
    ],
    comentariosDirector: "Planeación sincronizada correctamente. Listo para iniciar semana."
  },
  5: {
    semanaWeb: 5,
    unidad: "Unidad 3: Free Time & Sports",
    eje_tematico: "Pasatiempos, Deporte y Actividades Recreativas",
    progreso: 0,
    docenteResponsable: "Prof. Alejandro Ortega",
    estadoEvaluacion: "Sincronizado",
    entregasEstimadas: [
      { id: "e5_1", titulo: "Ensayo Corto sobre Hobbies de Ocio Preferidos", fechaMax: "10 Oct 11:59 PM", entregado: false, calificacion: 0 }
    ],
    checksMalla: [
      { id: "chk_5_1", txt: "Dominio conceptual de los artículos 'A', 'An', 'The'", done: false },
      { id: "chk_5_2", txt: "Ejercitar Pitch en audio de descripción de pasatiempos", done: false }
    ],
    comentariosDirector: "Insumo curricular programado en el calendario base."
  }
};

// Generar información administrativa para el resto de las semanas hasta la 18
for (let i = 6; i <= 18; i++) {
  const mallaSemana = mallaCurricularModulo1[i - 1] || {
    semana: i,
    unidad_libro: `Unidad ${Math.floor(i / 2) + 2}: Theme ${i}`,
    eje_tematico: `Materia Modular Temario ${i}`,
    kpi: "Entregables de control académico"
  };

  semanasDemoData[i] = {
    semanaWeb: i,
    unidad: mallaSemana.unidad_libro,
    eje_tematico: mallaSemana.eje_tematico,
    progreso: 0,
    docenteResponsable: "Prof. Alejandro Ortega",
    estadoEvaluacion: "Sincronizado",
    entregasEstimadas: [
      { id: `e${i}_1`, titulo: `Reporte de Proyecto Académico - Sem ${i}`, fechaMax: "Fecha Programada", entregado: false, calificacion: 0 }
    ],
    checksMalla: [
      { id: `chk_${i}_1`, txt: `Completar clases y temarios síncronos de Semana ${i}`, done: false },
      { id: `chk_${i}_2`, txt: `Evidencia para KPI obligatoria: ${mallaSemana.kpi}`, done: false }
    ],
    comentariosDirector: "Bloque sincronizado desde la Biblioteca Directiva."
  };
}

export function PlanningModule() {
  const { userEmail } = useAppContext();
  const [semanas, setSemanas] = useState<{ [key: number]: any }>(semanasDemoData);
  const [semanaSeleccionadaId, setSemanaSeleccionadaId] = useState<number>(1);
  const [filtroEstado, setFiltroEstado] = useState<'TODAS' | 'APROBADAS' | 'PENDIENTES'>('TODAS');
  const [loadingDataLake, setLoadingDataLake] = useState(true);

  // Modal control states
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  
  // Edit planning temporal states
  const [tempResponsable, setTempResponsable] = useState("Prof. Alejandro Ortega");
  const [tempComentarios, setTempComentarios] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Load planeación from Data Lake on mount
  useEffect(() => {
    const loadDataLakePlaneacion = async () => {
      try {
        const res = await obtenerPlaneacion();
        if (res.ok && res.data && res.data.length > 0) {
          const semanasMap: { [key: number]: any } = {};
          res.data.forEach((s) => {
            const semanaNum = Number(s.semana);
            let horas = [];
            try { horas = JSON.parse(s.horas_json || '[]'); } catch {}
            semanasMap[semanaNum] = {
              semanaWeb: semanaNum,
              unidad: s.unidad_libro || `Unidad ${Math.ceil(semanaNum / 2)}`,
              eje_tematico: s.eje_tematico || '',
              progreso: s.estado === 'aprobada' ? 100 : 0,
              docenteResponsable: s.docente_email || 'Sin asignar',
              estadoEvaluacion: s.estado || 'borrador',
              entregasEstimadas: [],
              checksMalla: horas.map((h: any, i: number) => ({
                id: `chk_${semanaNum}_${i}`,
                txt: h.leccion || `Lección ${i + 1}`,
                done: false
              })),
              comentariosDirector: s.aprobado_por ? `Aprobado por ${s.aprobado_por}` : ''
            };
          });
          setSemanas(prev => ({ ...prev, ...semanasMap }));
        }
      } catch (e) {
        console.warn('[PlanningModule] Data Lake no disponible, usando datos locales:', e);
      } finally {
        setLoadingDataLake(false);
      }
    };
    loadDataLakePlaneacion();
  }, []);

  const activeSemana = semanas[semanaSeleccionadaId];

  const handleEditOpen = () => {
    setTempResponsable(activeSemana.docenteResponsable);
    setTempComentarios(activeSemana.comentariosDirector);
    setShowEditPlanModal(true);
  };

  const handleSavePlanChanges = () => {
    const newEstado = activeSemana.estadoEvaluacion === 'Sincronizado' ? 'Cargado' : activeSemana.estadoEvaluacion;
    setSemanas(prev => ({
      ...prev,
      [semanaSeleccionadaId]: {
        ...prev[semanaSeleccionadaId],
        docenteResponsable: tempResponsable,
        comentariosDirector: tempComentarios,
        estadoEvaluacion: newEstado
      }
    }));

    // Persist to Data Lake
    const semanaPayload: SemanaPlaneacion = {
      semana: semanaSeleccionadaId,
      fecha_inicio: '',
      fecha_fin: '',
      eje_tematico: activeSemana.eje_tematico || '',
      unidad_libro: activeSemana.unidad || '',
      horas_json: JSON.stringify(activeSemana.checksMalla?.map((c: any) => ({ leccion: c.txt })) || []),
      kpi: activeSemana.entregasEstimadas?.[0]?.titulo || '',
      estado: newEstado?.toLowerCase() || 'borrador',
      docente_email: tempResponsable || userEmail || '',
      aprobado_por: '',
      aprobado_fecha: '',
    };
    guardarPlaneacionSemana(semanaPayload).catch(err =>
      console.warn('[PlanningModule] Error guardando en Data Lake:', err)
    );

    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setShowEditPlanModal(false);
    }, 1500);
  };

  const toggleCheck = (checkId: string) => {
    setSemanas(prev => {
      const sem = prev[semanaSeleccionadaId];
      const updatedChecks = sem.checksMalla.map((c: any) => 
        c.id === checkId ? { ...c, done: !c.done } : c
      );
      
      // Recalcular progreso en base a checks terminados
      const finished = updatedChecks.filter((c: any) => c.done).length;
      const progressPercent = Math.round((finished / updatedChecks.length) * 100);

      return {
        ...prev,
        [semanaSeleccionadaId]: {
          ...sem,
          checksMalla: updatedChecks,
          progreso: progressPercent,
          estadoEvaluacion: progressPercent === 100 ? "Aprobado" : "En Revisión"
        }
      };
    });
  };

  const filteredWeeks = Object.values(semanas).filter((s: any) => {
    if (filtroEstado === 'APROBADAS') return s.estadoEvaluacion === 'Aprobado';
    if (filtroEstado === 'PENDIENTES') return s.estadoEvaluacion !== 'Aprobado';
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* PLANNING HEADER BRANDING */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/20 via-[#0a1a20]/30 to-transparent border border-cyan-500/25 shadow-xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 text-left">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[9px] font-black px-2.5 py-1 rounded border border-cyan-500/20 uppercase tracking-widest">
              GÉSTION & ENTREGABLES ACADÉMICOS
            </span>
            <span className="text-white/40 text-[10px] font-mono">• TECLINGO ACADEMIC CONTROL</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
            CALENDARIOS DE PLANEACIÓN & AUDITORÍA SEMANALES
          </h2>
          <p className="text-xs text-white/50 max-w-xl leading-relaxed">
            Administra los calendarios de entregas y plan escolar semanal. Modifica asignaciones, audita el cumplimento de las lecciones, los KPIs asociados y autoriza la impartición de las semanas curriculares.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={() => setShowCalendarModal(true)}
            className="flex-1 sm:flex-initial bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-mono text-xs font-black px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 border border-cyan-400/20 cursor-pointer uppercase"
          >
            <Calendar size={15} />
            Cronograma General
          </button>
        </div>
      </div>

      {/* TACTILE SELECTION RAIL AND FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-950/25 border border-white/5 p-4 rounded-3xl text-left">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">Filtrar Semanas:</span>
          {['TODAS', 'APROBADAS', 'PENDIENTES'].map((st) => (
            <button
              key={st}
              onClick={() => setFiltroEstado(st as any)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                filtroEstado === st 
                  ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-400' 
                  : 'text-white/45 bg-black/40 hover:text-white/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono text-white/40 font-bold uppercase">Módulos:</span>
          <select 
            value={semanaSeleccionadaId}
            onChange={(e) => setSemanaSeleccionadaId(Number(e.target.value))}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono font-semibold cursor-pointer"
          >
            {Object.values(semanas).map((s: any) => (
              <option key={s.semanaWeb} value={s.semanaWeb}>
                S{s.semanaWeb.toString().padStart(2, '0')} — {s.unidad.split(':')[1]?.trim() || s.unidad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CORE TWO-COLUMN INTERFACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* WEEKLY TIMELINE SUMMARY PANEL (4 GRID SPACES) */}
        <div className="lg:col-span-4 bg-black/40 border border-white/5 p-4 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <FileText size={13} />
              Avance de Planeaciones
            </span>
            <span className="text-[10px] text-white/40 font-mono">SEP A1.1</span>
          </div>

          <div className="space-y-2">
            {filteredWeeks.map((wk: any) => {
              const semActualIdx = wk.semanaWeb;
              const isActive = semActualIdx === semanaSeleccionadaId;

              return (
                <button
                  key={wk.semanaWeb}
                  onClick={() => setSemanaSeleccionadaId(wk.semanaWeb)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-950/25 text-white border-cyan-400/40 shadow-inner' 
                      : 'bg-black/20 text-white/50 border-white/[0.02] hover:bg-white/5 hover:text-white/85'
                  }`}
                >
                  <div className="space-y-0.5 truncate text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[9px] font-black px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-cyan-500 text-slate-900 font-bold' : 'bg-white/5 text-white/40'
                      }`}>
                        S{wk.semanaWeb.toString().padStart(2, '0')}
                      </span>
                      <strong className="text-white/90 truncate">{wk.unidad.split(':')[1]?.trim() || wk.unidad}</strong>
                    </div>
                    <p className="text-[10px] text-white/30 truncate pl-1 font-mono italic">
                      {wk.eje_tematico}
                    </p>
                  </div>

                  {wk.estadoEvaluacion === 'Aprobado' ? (
                    <Award size={15} className="text-cyan-400 shrink-0" />
                  ) : (
                    <div className="text-[9px] font-mono text-white/35 bg-white/5 border border-white/5 p-1 rounded shrink-0 leading-none">
                      {wk.progreso}%
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* COMPREHENSIVE DETAIL MONITORING PANEL (8 GRID SPACES) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <GlassCard title={`Detalles Curriculares - Semana ${activeSemana.semanaWeb}`} icon={BookOpen} accent="cyan">
            
            <div className="space-y-6 text-left">
              
              {/* PRIMARY ROW INFO SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-white/30 text-[9px] font-mono uppercase">Unidad del Libro</span>
                  <p className="text-white text-xs font-black uppercase tracking-tight">{activeSemana.unidad}</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-white/30 text-[9px] font-mono uppercase">Docente Impartidor</span>
                  <p className="text-white text-xs font-black uppercase tracking-tight">{activeSemana.docenteResponsable}</p>
                </div>
              </div>

              {/* CURRICULUM DESCRIPTION BOX */}
              <div className="p-4 rounded-2xl bg-cyan-950/15 border border-cyan-500/20 space-y-1 text-left">
                <span className="text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider block">Tema General (Syllabus)</span>
                <p className="text-white text-sm font-black leading-snug">{activeSemana.eje_tematico}</p>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/40 uppercase">Estructura Impartida / Acreditada:</span>
                  <span className="text-cyan-300 font-bold">{activeSemana.progreso}% completado</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300"
                    style={{ width: `${activeSemana.progreso}%` }}
                  />
                </div>
              </div>

              {/* ACTIONS CHECKLIST OF SYLLABUS SINK */}
              <div className="space-y-3 text-left">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider block">Auditoría de Cumplimiento Escolar:</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {activeSemana.checksMalla.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCheck(c.id)}
                      className={`p-4 rounded-2xl border transition text-left flex items-start gap-3.5 cursor-pointer hover:scale-[1.01] ${
                        c.done 
                          ? 'bg-cyan-950/10 border-cyan-500/30 text-white' 
                          : 'bg-black/30 border-white/5 text-white/50 hover:border-white/10'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition ${
                        c.done ? 'bg-cyan-400 border-cyan-400 text-[#0c2e2e]' : 'border-white/20'
                      }`}>
                        {c.done && <CheckSquare size={12} strokeWidth={3} />}
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className={`text-[11px] font-bold uppercase tracking-tight block ${c.done ? 'text-white' : 'text-white/30'}`}>
                          {c.txt}
                        </span>
                        <span className="text-[9px] font-mono text-white/25">Acción Académica Obligatoria</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ESTIMATED DELIVERIES (KPI) */}
              <div className="space-y-3 text-left pt-2 border-t border-white/5">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider block">KPIs / Entregables Programados:</span>
                
                <div className="space-y-2">
                  {activeSemana.entregasEstimadas.map((e: any) => (
                    <div key={e.id} className="p-3.5 bg-black/45 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl border border-white/5 text-white/40">
                          <FileText size={15} />
                        </div>
                        <div className="text-left">
                          <strong className="text-xs text-white block">{e.titulo}</strong>
                          <span className="text-[9.5px] text-white/30 block font-mono">Entrega Máxima: {e.fechaMax}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-center">
                        <span className="text-[10px] text-white/35 font-mono">Acreditada</span>
                        <span className="bg-emerald-500/10 text-[#22c55e] border border-emerald-500/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded leading-none">
                          ✓ Sí
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMENTS & STAMP */}
              <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-widest block flex items-center gap-1.5 animate-pulse">
                    <Stamp size={12} />
                    Sello de Validación Directiva
                  </span>
                  <p className="text-[11px] text-white/60 leading-relaxed italic pr-2">
                    "{activeSemana.comentariosDirector || 'Sin anotaciones directivas registradas para este folio'}"
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto shrink-0 self-end md:self-center">
                  <button
                    onClick={handleEditOpen}
                    className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition cursor-pointer"
                  >
                    Editar Plan
                  </button>
                </div>
              </div>

            </div>

          </GlassCard>
        </div>

      </div>

      {/* ================= CRONOGRAMA MODAL DRAWER ================= */}
      <AnimatePresence>
        {showCalendarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl overflow-hidden bg-[#05111b] border border-cyan-500/25 rounded-3xl p-6 shadow-2xl space-y-4 text-left"
            >
              <button
                onClick={() => setShowCalendarModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-lg"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 rounded-xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Cronograma Anual de Asignaciones (18 Semanas)</h3>
                  <p className="text-[10px] text-white/40 font-mono">Plan Integrado Para El Primer Ciclo Modular</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[350px] overflow-y-auto custom-scrollbar p-1 text-left">
                {Object.values(semanas).map((s: any) => (
                  <div 
                    key={s.semanaWeb}
                    className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                      s.semanaWeb === semanaSeleccionadaId 
                        ? 'bg-cyan-950/20 border-cyan-400/40' 
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-cyan-400 font-bold">SEMANA {s.semanaWeb.toString().padStart(2, '0')}</span>
                      <span className="text-white/30">{s.estadoEvaluacion}</span>
                    </div>
                    <strong className="text-[10.5px] text-white truncate block uppercase leading-snug">{s.unidad.split(':')[1]?.trim() || s.unidad}</strong>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${s.progreso}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="bg-cyan-500 text-slate-900 border border-white/5 font-mono text-[10px] font-black px-6 py-2.5 rounded-xl cursor-pointer hover:bg-cyan-400 transition"
                >
                  Entendido / Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= EDIT PLAN MODAL DRAWER ================= */}
      <AnimatePresence>
        {showEditPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden bg-[#05111b] border border-cyan-500/25 rounded-3xl p-6 shadow-2xl space-y-5 text-left"
            >
              <button
                onClick={() => setShowEditPlanModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-lg"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 rounded-xl">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Editar Planeación - Semana {activeSemana.semanaWeb}</h3>
                  <p className="text-[10px] text-white/40 font-mono">Modificación de Parámetros de Control Escolar</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/40 font-mono uppercase block">Docente Responsable:</span>
                  <input 
                    type="text" 
                    value={tempResponsable}
                    onChange={(e) => setTempResponsable(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 outline-none rounded-xl p-2.5 text-xs text-white placeholder-white/20 transition-all font-bold font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/40 font-mono uppercase block">Directrices / Sello de Validación:</span>
                  <textarea
                    rows={4}
                    value={tempComentarios}
                    onChange={(e) => setTempComentarios(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 outline-none rounded-xl p-3 text-xs text-white placeholder-white/20 transition-all resize-none font-sans leading-normal text-left"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                {alertSuccess ? (
                  <span className="text-emerald-400 text-[10px] font-mono font-black animate-pulse">
                    ✓ Cambios Guardados
                  </span>
                ) : (
                  <span className="text-[9px] text-white/25 font-mono">Control Central V2</span>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditPlanModal(false)}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Salir
                  </button>
                  <button
                    onClick={handleSavePlanChanges}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 border border-white/5 font-mono text-[10px] font-black px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck size={13} />
                    Sellar Plan
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
