/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Users, 
  ChevronDown, 
  Eye, 
  TrendingUp, 
  Mic2, 
  CheckCircle2,
  MoreVertical,
  X,
  Zap,
  Plus,
  MessageCircle,
  Calendar,
  Clock,
  LayoutGrid,
  List as ListIcon,
  ShieldCheck,
  UserCheck,
  FolderOpen,
  Check,
  UserX,
  ShieldAlert,
  Info,
  Lock,
  ArrowLeft,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext, Group } from '../context/AppContext';
import { registrarAsistencia, obtenerAsistenciaGrupo, type RegistroAsistencia } from '../services/identityService';

// Reusing User interface concept but simplified/expanded for context
interface Student {
  id: string;
  name: string;
  photo: string;
  performance: number;
  attendance: string;
  pronunciation: number;
  tasks: number;
  level: string;
}

// Master detailed list of high-fidelity student records
const MASTER_STUDENTS_LIST: Record<string, Student> = {
  'USR-304-Z11': { id: 'USR-304-Z11', name: 'Juan Pérez', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', performance: 92, attendance: '95%', pronunciation: 88, tasks: 12, level: 'A2' },
  'USR-221-C99': { id: 'USR-221-C99', name: 'Sofía Méndez', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop', performance: 85, attendance: '82%', pronunciation: 75, tasks: 10, level: 'A1' },
  'USR-001-A22': { id: 'USR-001-A22', name: 'Carlos Mendoza', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', performance: 94, attendance: '100%', pronunciation: 92, tasks: 15, level: 'A1' },
  'USR-502-A81': { id: 'USR-502-A81', name: 'Mateo Sandoval', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', performance: 78, attendance: '90%', pronunciation: 80, tasks: 9, level: 'A1' },
  'USR-108-K12': { id: 'USR-108-K12', name: 'Valentina Rojas', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', performance: 81, attendance: '88%', pronunciation: 79, tasks: 11, level: 'A1' },
  'STU-101': { id: 'STU-101', name: 'Camila Blanco', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', performance: 89, attendance: '94%', pronunciation: 85, tasks: 12, level: 'B2' },
  'STU-102': { id: 'STU-102', name: 'Esteban Paredes', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', performance: 91, attendance: '98%', pronunciation: 90, tasks: 14, level: 'C1' },
  'STU-103': { id: 'STU-103', name: 'Lucía Fernández', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop', performance: 74, attendance: '80%', pronunciation: 70, tasks: 8, level: 'A2' },
  'STU-104': { id: 'STU-104', name: 'Guillermo Fraustro', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', performance: 88, attendance: '92%', pronunciation: 83, tasks: 11, level: 'B1' },
  'USR-001': { id: 'USR-001', name: 'Aline Gutiérrez', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', performance: 85, attendance: '91%', pronunciation: 82, tasks: 10, level: 'A1' },
  'USR-002': { id: 'USR-002', name: 'Jorge Montes', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop', performance: 80, attendance: '85%', pronunciation: 78, tasks: 9, level: 'A2' },
};

const mockTeachers = [
  { id: 'USR-823-X92', name: 'Ana López', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: 'USR-901-B33', name: 'Luis Garcia', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
];

interface GradeRecord {
  exams: number;
  homework: number;
  speaking: number;
  project: number;
  average: number;
  history: { name: string; grade: number; date: string }[];
}

const STUDENT_GRADES: Record<string, GradeRecord> = {
  'USR-304-Z11': { exams: 90, homework: 95, speaking: 92, project: 88, average: 91, history: [{ name: 'Examen de Medio Ritmo', grade: 92, date: 'May 10' }, { name: 'Páginas Semanales', grade: 95, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 88, date: 'May 19' }, { name: 'Proyecto Final', grade: 90, date: 'May 25' }] },
  'USR-221-C99': { exams: 82, homework: 88, speaking: 80, project: 85, average: 84, history: [{ name: 'Examen de Medio Ritmo', grade: 80, date: 'May 10' }, { name: 'Páginas Semanales', grade: 85, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 82, date: 'May 19' }, { name: 'Proyecto Final', grade: 88, date: 'May 25' }] },
  'USR-001-A22': { exams: 95, homework: 93, speaking: 96, project: 92, average: 94, history: [{ name: 'Examen de Medio Ritmo', grade: 95, date: 'May 10' }, { name: 'Páginas Semanales', grade: 94, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 96, date: 'May 19' }, { name: 'Proyecto Final', grade: 92, date: 'May 25' }] },
  'USR-502-A81': { exams: 75, homework: 80, speaking: 74, project: 78, average: 77, history: [{ name: 'Examen de Medio Ritmo', grade: 76, date: 'May 10' }, { name: 'Páginas Semanales', grade: 78, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 74, date: 'May 19' }, { name: 'Proyecto Final', grade: 80, date: 'May 25' }] },
  'USR-108-K12': { exams: 80, homework: 84, speaking: 81, project: 82, average: 82, history: [{ name: 'Examen de Medio Ritmo', grade: 82, date: 'May 10' }, { name: 'Páginas Semanales', grade: 80, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 84, date: 'May 19' }, { name: 'Proyecto Final', grade: 81, date: 'May 25' }] },
  'STU-101': { exams: 88, homework: 90, speaking: 87, project: 89, average: 88.5, history: [{ name: 'Examen de Medio Ritmo', grade: 88, date: 'May 10' }, { name: 'Páginas Semanales', grade: 90, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 87, date: 'May 19' }, { name: 'Proyecto Final', grade: 89, date: 'May 25' }] },
  'STU-102': { exams: 92, homework: 94, speaking: 90, project: 91, average: 91.8, history: [{ name: 'Examen de Medio Ritmo', grade: 92, date: 'May 10' }, { name: 'Páginas Semanales', grade: 94, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 90, date: 'May 19' }, { name: 'Proyecto Final', grade: 91, date: 'May 25' }] },
  'STU-103': { exams: 72, homework: 76, speaking: 75, project: 73, average: 74, history: [{ name: 'Examen de Medio Ritmo', grade: 72, date: 'May 10' }, { name: 'Páginas Semanales', grade: 75, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 76, date: 'May 19' }, { name: 'Proyecto Final', grade: 73, date: 'May 25' }] },
  'STU-104': { exams: 86, homework: 89, speaking: 87, project: 88, average: 87.5, history: [{ name: 'Examen de Medio Ritmo', grade: 87, date: 'May 10' }, { name: 'Páginas Semanales', grade: 89, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 86, date: 'May 19' }, { name: 'Proyecto Final', grade: 88, date: 'May 25' }] },
  'USR-001': { exams: 83, homework: 86, speaking: 85, project: 82, average: 84, history: [{ name: 'Examen de Medio Ritmo', grade: 84, date: 'May 10' }, { name: 'Páginas Semanales', grade: 86, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 82, date: 'May 19' }, { name: 'Proyecto Final', grade: 84, date: 'May 25' }] },
  'USR-002': { exams: 78, homework: 82, speaking: 80, project: 79, average: 79.8, history: [{ name: 'Examen de Medio Ritmo', grade: 78, date: 'May 10' }, { name: 'Páginas Semanales', grade: 80, date: 'May 14' }, { name: 'Comprensión Oral A2', grade: 82, date: 'May 19' }, { name: 'Proyecto Final', grade: 79, date: 'May 25' }] },
};

const getStudentGrades = (id: string): GradeRecord => {
  return STUDENT_GRADES[id] || {
    exams: 85,
    homework: 88,
    speaking: 84,
    project: 86,
    average: 85.8,
    history: [
      { name: 'Examen de Medio Ritmo', grade: 85, date: 'May 10' },
      { name: 'Páginas Semanales', grade: 88, date: 'May 14' },
      { name: 'Comprensión Oral A2', grade: 84, date: 'May 19' },
      { name: 'Proyecto Final', grade: 86, date: 'May 25' }
    ]
  };
};

export function GroupManagement({ onTakeAttendance }: { onTakeAttendance?: (group: string) => void }) {
  const { currentRole, groups, addGroup, deleteGroup, updateGroup, setQuickChatUser, userEmail } = useAppContext();
  
  // Selection states
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentGrades, setSelectedStudentGrades] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [layoutMode, setLayoutMode] = useState<'cards' | 'table'>('cards');

  // State to track which group is currently "opened/expanded" to view its student roll-and-attendance panel
  const [openedGroupId, setOpenedGroupId] = useState<string | null>(null);

  // Attendance date selector
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Daily attendance state for students in the session ('PRESENTE', 'AUSENTE', 'JUSTIFICADO', 'RETRASO', 'SIN_REGISTRO')
  const [attendanceState, setAttendanceState] = useState<Record<string, 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' | 'RETRASO' | 'SIN_REGISTRO'>>({});

  // Load attendance from API when opened group or date changes
  useEffect(() => {
    if (!openedGroupId || !userEmail) {
      setAttendanceState({});
      return;
    }
    let cancelled = false;
    const loadAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const records = await obtenerAsistenciaGrupo(userEmail, openedGroupId, attendanceDate);
        if (cancelled) return;
        const stateMap: Record<string, 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' | 'RETRASO' | 'SIN_REGISTRO'> = {};
        // Initialize all students as SIN_REGISTRO
        const group = teacherGroupsList.find(g => g.id === openedGroupId);
        if (group) {
          group.studentIds.forEach(id => { stateMap[id] = 'SIN_REGISTRO'; });
        }
        // Apply loaded records
        records.forEach((r: any) => {
          if (r.user_id && r.estado) {
            stateMap[r.user_id] = r.estado as any;
          }
        });
        setAttendanceState(stateMap);
      } catch (err) {
        console.warn('[GroupManagement] loadAttendance error:', err);
      } finally {
        if (!cancelled) setAttendanceLoading(false);
      }
    };
    loadAttendance();
    return () => { cancelled = true; };
  }, [openedGroupId, attendanceDate, userEmail]);

  // Save attendance to API
  const saveAttendance = useCallback(async (groupId: string, studentId: string, estado: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' | 'RETRASO') => {
    if (!userEmail) return;
    try {
      const registros: RegistroAsistencia[] = [{
        user_id: studentId,
        email: studentId.toLowerCase().includes('@') ? studentId : `${studentId}@teclingo.edu`,
        nombre: MASTER_STUDENTS_LIST[studentId]?.name || studentId,
        estado,
      }];
      await registrarAsistencia(userEmail, groupId, registros, attendanceDate);
    } catch (err) {
      console.warn('[GroupManagement] saveAttendance error:', err);
    }
  }, [userEmail, attendanceDate]);

  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    name: '',
    level: 'A1 - Beginner',
    teacherId: '',
    studentIds: [],
    schedule: '08:00 - 10:00',
    time: '08:00 AM',
    days: ['LUN', 'MIÉ', 'VIE'],
    status: 'ACTIVE'
  });

  // Comprehensive high-fidelity list of groups assigned to the teacher
  const teacherGroupsList = useMemo(() => {
    const baseGroups = groups.filter(g => g.teacherId === 'USR-901-B33' || g.teacherId === '');
    
    const customList = [
      {
        id: 'A1-102',
        name: 'Basic English Lab',
        level: 'A1 - Beginner',
        room: 'Aula 4-A',
        schedule: '08:00 - 09:40',
        timeStart: '08:00',
        timeEnd: '09:40',
        type: 'PRESENCIAL',
        topic: 'Roleplay: Airport and Greetings',
        studentIds: ['USR-001-A22', 'USR-221-C99', 'USR-502-A81', 'USR-108-K12'],
        status: 'ACTIVE' as const
      },
      {
        id: 'B2-205',
        name: 'Everyday Dialogue Practice',
        level: 'B2 - Upper-Int',
        room: 'Zoom Lab 2',
        schedule: '10:00 - 11:40',
        timeStart: '10:00',
        timeEnd: '11:40',
        type: 'VIRTUAL',
        topic: 'Verbal expressions and shopping vocabulary',
        studentIds: ['STU-101', 'STU-102', 'STU-103'],
        status: 'ACTIVE' as const
      },
      {
        id: 'B1-105',
        name: 'Grammar in Everyday Context',
        level: 'B1 - Intermediate',
        room: 'Aula Central',
        schedule: '14:00 - 15:40',
        timeStart: '14:00',
        timeEnd: '15:40',
        type: 'PRESENCIAL',
        topic: 'Possessives & Family Relationship Dialogue',
        studentIds: ['STU-103', 'STU-104'],
        status: 'ACTIVE' as const
      },
      {
        id: 'C1-302',
        name: 'Advanced Speech & Fluency Lab',
        level: 'C1 - Advanced',
        room: 'Auditorio',
        schedule: '09:00 - 10:40',
        timeStart: '09:00',
        timeEnd: '10:40',
        type: 'PRESENCIAL',
        topic: 'Capitalization Rules & Speech patterns under 50s',
        studentIds: ['USR-304-Z11', 'USR-221-C99'],
        status: 'ACTIVE' as const
      }
    ];

    // Append newly created groups from context elegantly
    baseGroups.forEach(bg => {
      if (!customList.some(cl => cl.id === bg.id || cl.name.toLowerCase() === bg.name.toLowerCase())) {
        customList.push({
          id: bg.id,
          name: bg.name,
          level: bg.level || 'A1 - Beginner',
          room: 'Aula Virtual B',
          schedule: '16:00 - 17:40',
          timeStart: '16:00',
          timeEnd: '17:40',
          type: 'VIRTUAL',
          topic: 'English Proficiency diagnostics',
          studentIds: bg.studentIds && bg.studentIds.length > 0 ? bg.studentIds : ['USR-001', 'USR-002'],
          status: 'ACTIVE' as const
        });
      }
    });

    return customList;
  }, [groups]);

  const filteredGroups = useMemo(() => {
    if (currentRole === 'DIRECTOR') return groups;
    if (currentRole === 'DOCENTE') return teacherGroupsList;
    if (currentRole === 'ALUMNO') return teacherGroupsList.filter(g => g.studentIds.includes('USR-304-Z11'));
    return [];
  }, [groups, currentRole, teacherGroupsList]);

  // Sync selected group
  const activeGroup = useMemo(() => {
    const found = filteredGroups.find(g => g.id === selectedGroupId);
    return found || filteredGroups[0];
  }, [filteredGroups, selectedGroupId]);

  // Set initial selected group ID if not set
  useMemo(() => {
    if (!selectedGroupId && filteredGroups.length > 0) {
      setSelectedGroupId(filteredGroups[0].id);
    }
  }, [filteredGroups, selectedGroupId]);

  const handleAddGroup = () => {
    if (newGroup.name && newGroup.teacherId) {
      addGroup({
        ...newGroup as Group,
        id: `GRP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      });
      setShowAddModal(false);
      setNewGroup({
        name: '',
        level: 'A1 - Beginner',
        teacherId: '',
        studentIds: [],
        schedule: '08:00 - 10:00',
        time: '08:00 AM',
        days: ['LUN', 'MIÉ', 'VIE'],
        status: 'ACTIVE'
      });
    }
  };

  const getStudentDetails = (id: string): Student => {
    return MASTER_STUDENTS_LIST[id] || {
      id,
      name: `Estudiante ${id.replace('USR-', '').replace('STU-', '')}`,
      photo: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop`,
      performance: 82,
      attendance: '88%',
      pronunciation: 80,
      tasks: 10,
      level: 'A2'
    };
  };

  const levels = ['A1 - Beginner', 'A2 - Pre-Int', 'B1 - Intermediate', 'B2 - Upper-Int', 'C1 - Advanced'];

  if (currentRole === 'ALUMNO' && activeGroup) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-center md:text-left">Identidad Estudiantil</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight text-center md:text-left">Mi Grupo Académico</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <GlassCard accent="cyan" className="!p-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-[2rem] bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A] shadow-[0_0_30px_rgba(222,255,154,0.15)]">
                   <Users size={48} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{activeGroup.name}</h3>
                   <span className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] block mt-2">{activeGroup.level}</span>
                </div>

                <div className="flex gap-4 w-full pt-6 border-t border-white/10">
                   <div className="flex-1 text-center">
                      <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Horario</p>
                      <p className="text-white text-xs font-bold uppercase">{activeGroup.schedule}</p>
                   </div>
                   <div className="flex-1 text-center">
                      <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Días</p>
                      <p className="text-white text-xs font-bold uppercase">LUN, MIÉ, VIE</p>
                   </div>
                </div>
              </div>
           </GlassCard>

           <GlassCard accent="green" className="!p-10">
              <div className="space-y-8">
                 <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Mi Profesor</h4>
                 <div className="flex items-center gap-6">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" className="w-20 h-20 rounded-full border-2 border-[#DEFF9A]" alt="" />
                    <div className="space-y-1">
                       <h5 className="text-xl font-black text-white uppercase">Luis Garcia</h5>
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Docente Certificado ADN</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setQuickChatUser({ id: 'USR-901-B33', name: 'Luis Garcia' })}
                  className="w-full py-4 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#DEFF9A] hover:text-black transition-all"
                 >
                    Enviar Mensaje Directo
                 </button>
              </div>
           </GlassCard>
        </div>
      </div>
    );
  }

  // --- COMPONENT RENDER FOR DOCENT & DIRECTOR GENERAL PANEL ---
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Header of the page (Shown only if no group is deeply opened) */}
      <AnimatePresence mode="wait">
        {!openedGroupId ? (
          <motion.header 
            key="header-list"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${currentRole === 'DIRECTOR' ? 'text-[#DEFF9A]' : 'text-[#4ADE80]'}`}>
                {currentRole === 'DIRECTOR' ? 'Control de Estructura' : 'Operación Académica'}
              </h2>
              <h1 className="text-3xl font-black text-white bevel-text uppercase tracking-tight">Gestión de Grupos</h1>
              <p className="text-white/40 text-xs mt-1">Monitorea clases, abre grupos para tomar asistencia y consulta expedientes.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
               {currentRole === 'DIRECTOR' && (
                 <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-3 bg-[#DEFF9A] text-[#061a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(222,255,154,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
                 >
                    <Plus size={16} /> Crear Nuevo Grupo
                 </button>
               )}
               
               <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
                  <button 
                    onClick={() => setViewMode('GRID')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/25' : 'text-white/20 hover:text-white'}`}
                    id="btn-grid-mode"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('LIST')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-[#4ADE80] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}
                    id="btn-list-mode"
                  >
                    <ListIcon size={16} />
                  </button>
               </div>
            </div>
          </motion.header>
        ) : null}
      </AnimatePresence>

      {/* 2. Main content router based onopenedGroupId state */}
      <AnimatePresence mode="wait">
        {!openedGroupId ? (
          /* =========================================================================
             A. GROUPS GRID OR LIST OVERVIEW VIEW (SELECTING A CELL FOR DETAILED OPENING) 
             ========================================================================= */
          <motion.div 
            key="groups-overview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {viewMode === 'GRID' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredGroups.map((group) => {
                  const studentCount = group.studentIds?.length || 0;
                  return (
                    <motion.div
                      key={group.id}
                      whileHover={{ y: -6 }}
                      className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#4ADE80]/30 transition-all group overflow-hidden relative flex flex-col justify-between p-8"
                      id={`card-group-${group.id}`}
                    >
                      <div>
                        {/* Upper Badges */}
                        <div className="flex justify-between items-center mb-6">
                          <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#4ADE80] text-[10px] font-black uppercase tracking-widest">
                            {group.id}
                          </span>
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                            {group.type || 'PRESENCIAL'}
                          </span>
                        </div>

                        {/* Title & Level */}
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-[#4ADE80] transition-colors leading-tight mb-2">
                          {group.name}
                        </h3>
                        <p className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-widest inline-block px-3 py-1 bg-[#DEFF9A]/5 rounded-lg border border-[#DEFF9A]/10">
                          {group.level}
                        </p>

                        {/* Middle details */}
                        <div className="space-y-3 my-6 pt-6 border-t border-white/5 text-white/50 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Clock size={14} className="text-white/20 shrink-0" />
                            <span className="font-medium tracking-tight">Horario: <b className="text-white font-bold">{group.schedule}</b></span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Users size={14} className="text-white/20 shrink-0" />
                            <span className="font-medium tracking-tight">Roster: <b className="text-white font-bold">{studentCount} Estudiantes Matat</b></span>
                          </div>
                          {group.room && (
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck size={14} className="text-[#4ADE80]/40 shrink-0" />
                              <span className="font-medium tracking-tight">Salón: <b className="text-white font-bold">{group.room}</b></span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ACTION ACTION ACTION: EL BOTÓN DE ABRIR */}
                      <button
                        onClick={() => {
                          setSelectedGroupId(group.id);
                          setOpenedGroupId(group.id);
                        }}
                        className="w-full mt-4 py-4 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 hover:bg-[#4ADE80] text-[#4ADE80] hover:text-[#061a1a] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 shadow-[0_5px_15px_rgba(74,222,128,0.05)] text-center"
                        id={`btn-open-${group.id}`}
                      >
                        <FolderOpen size={16} />
                        Abrir Grupo
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* LIST/TABLE MODE */
              <GlassCard className="!p-0 overflow-hidden" accent="green">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Código / ID</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Nombre del Grupo</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Nivel / ADN</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Matrícula</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Horario / Salón</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Acción de Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredGroups.map(group => (
                      <tr key={group.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5">
                          <span className="font-mono text-xs font-bold text-white/40">{group.id}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80]">
                              <Users size={14} />
                            </div>
                            <span className="text-white font-bold group-hover:text-[#4ADE80] transition-colors uppercase text-sm">{group.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 text-[#DEFF9A] rounded-lg">
                            {group.level}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-white font-black text-xs">{group.studentIds?.length || 0} Alumnos</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-white/20" />
                            <span className="text-white/40 text-[10px] font-black uppercase">
                              {group.schedule} | {group.room || 'Aula F-102'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => {
                              setSelectedGroupId(group.id);
                              setOpenedGroupId(group.id);
                            }} 
                            className="px-5 py-2.5 bg-[#4ADE80]/15 border border-[#4ADE80]/20 hover:bg-[#4ADE80] text-[#4ADE80] hover:text-[#061a1a] rounded-xl text-[9px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2"
                            id={`btn-table-open-${group.id}`}
                          >
                            <FolderOpen size={12} /> Abrir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            )}
          </motion.div>
        ) : (
          /* =========================================================================
             B. DETAILED GROUP DEEP DIVE (THE ROLL CALL ACTION LIST - TEACHER OVERVIEW) 
             ========================================================================= */
          (() => {
            const currentOpenedGroup = filteredGroups.find(g => g.id === openedGroupId) || filteredGroups[0];
            const groupStudentIds = currentOpenedGroup.studentIds || [];
            
            // Stats Calculations
            const stats = groupStudentIds.reduce(
              (acc, id) => {
                const status = attendanceState[id] || 'SIN_REGISTRO';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
              },
              { PRESENTE: 0, AUSENTE: 0, JUSTIFICADO: 0, RETRASO: 0, SIN_REGISTRO: 0 }
            );

            return (
              <motion.div 
                key="group-detail-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Back Control and Roster Title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
                  <div className="space-y-2">
                    <button
                      onClick={() => setOpenedGroupId(null)}
                      className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 w-max"
                      id="btn-back-to-groups"
                    >
                      <ArrowLeft size={14} /> Volver a Grupos
                    </button>
                    <div className="flex items-center gap-3 pt-2">
                      <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                        Célula Grupal: <span className="text-[#4ADE80]">{currentOpenedGroup.name}</span>
                      </h1>
                      <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 rounded-xl text-[9px] font-mono font-bold uppercase shrink-0">
                        {currentOpenedGroup.id}
                      </div>
                    </div>
                    {/* Metadata summary */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 pt-1">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {currentOpenedGroup.schedule}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Salón: <b className="text-white/60 font-semibold">{currentOpenedGroup.room}</b></span>
                      <span className="hidden sm:inline">•</span>
                      <span>Nivel: <b className="text-white/60 font-semibold">{currentOpenedGroup.level}</b></span>
                      <span className="hidden sm:inline">•</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#4ADE80]/15 text-[#4ADE80] font-black uppercase text-[8px] tracking-wider">{currentOpenedGroup.type || 'PRESENCIAL'}</span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-white/30" />
                        <input
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-[10px] font-bold outline-none focus:border-[#4ADE80]/40"
                        />
                        {attendanceLoading && (
                          <span className="text-[8px] font-black text-[#4ADE80] animate-pulse uppercase tracking-widest">Cargando...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Dynamic stats pills inside the header */}
                  <div className="flex flex-wrap gap-2.5">
                    <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{stats.PRESENTE} Presentes</span>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>{stats.AUSENTE} Ausentes</span>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{stats.JUSTIFICADO} Justificados</span>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>{stats.RETRASO} Retrasos</span>
                    </div>
                  </div>
                </div>

                {/* READ-ONLY DISCLAIMER BANNER (Specifying that actual student data is managed by Director or personal accounts) */}
                <div className="p-5 rounded-3xl bg-[#4ADE80]/5 border border-[#4ADE80]/15 flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-[#4ADE80]/10 text-[#4ADE80] shrink-0 mt-0.5">
                    <Lock size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                      Rango de Operación: Régimen de Asistencia (Lector Exclusivo de Roster)
                    </h4>
                    <p className="text-white/50 text-[11px] leading-relaxed">
                      El enrolamiento de usuarios, bajas, modificaciones de nombres, imágenes de perfiles o niveles académicos están <b>consolidados de forma estricta (Read-Only)</b> para el docente. Toda modificación estructural de alumnos se efectúa directamente desde el panel del <b>Director</b> o por autogestión de cada alumno en su propia cuenta. Tu perfil de docente está habilitado únicamente para la registrar el pase de lista diario interactivo de la clase actual.
                    </p>
                  </div>
                </div>

                {/* Visualizer layout mode selector for student roster inside the group details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                    <p className="text-white/60 text-[11px] font-black uppercase tracking-widest font-mono">
                      {groupStudentIds.length} Alumnos en este Grupo (Rango sugerido: 4 - 30 alumnos)
                    </p>
                  </div>

                  {/* HIGH-VELOCITY CONTROL DE ESTADO (LAYOUT SWITCH) */}
                  <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1.5 rounded-2xl shrink-0 font-mono">
                    <button
                      onClick={() => setLayoutMode('cards')}
                      className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                        layoutMode === 'cards'
                          ? 'text-white border-b-2 border-emerald-400 font-black'
                          : 'text-white/40 hover:text-white/80 border-b-2 border-transparent'
                      }`}
                      title="Vista de Tarjetas Detallada"
                      id="student-view-card"
                    >
                      VISTA TARJETAS
                    </button>
                    <div className="w-[1px] h-3.5 bg-white/10" />
                    <button
                      onClick={() => setLayoutMode('table')}
                      className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                        layoutMode === 'table'
                          ? 'text-white border-b-2 border-emerald-400 font-black'
                          : 'text-white/40 hover:text-white/80 border-b-2 border-transparent'
                      }`}
                      title="Vista de Tabla Compacta"
                      id="student-view-table"
                    >
                      TABLA DE CLASE
                    </button>
                  </div>
                </div>

                {/* THE STUDENTS TABLE / ROW LIST */}
                {layoutMode === 'cards' ? (
                  <div className="space-y-4">
                    {groupStudentIds.map((stuId) => {
                      const student = getStudentDetails(stuId);
                      const currentStatus = attendanceState[student.id] || 'SIN_REGISTRO';
                      
                      const statusBadgeConfig = {
                        PRESENTE: { bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', label: 'Presente', icon: CheckCircle2, ring: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
                        AUSENTE: { bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400', label: 'Ausente', icon: XCircle, ring: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
                        JUSTIFICADO: { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400', label: 'Justificado', icon: ShieldAlert, ring: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
                        RETRASO: { bg: 'bg-pink-500/15 border-pink-500/30 text-pink-400', label: 'Retraso', icon: Clock, ring: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' },
                        SIN_REGISTRO: { bg: 'bg-white/5 border-white/10 text-white/40', label: 'Pendiente Pase', icon: Info, ring: 'border-white/10' }
                      }[currentStatus];

                      const StatusIcon = statusBadgeConfig.icon;

                      // Dynamic card borders based on attendance status in real time
                      let dynamicCardBorderClass = 'border-white/5 bg-white/[0.02]';
                      if (currentStatus === 'PRESENTE') {
                        dynamicCardBorderClass = 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-[0_0_20px_rgba(16,185,129,0.05)]';
                      } else if (currentStatus === 'AUSENTE') {
                        dynamicCardBorderClass = 'border-rose-500/40 bg-rose-500/[0.03] shadow-[0_0_20px_rgba(244,63,94,0.05)]';
                      } else if (currentStatus === 'JUSTIFICADO') {
                        dynamicCardBorderClass = 'border-blue-500/40 bg-blue-500/[0.03] shadow-[0_0_20px_rgba(59,130,246,0.05)]';
                      } else if (currentStatus === 'RETRASO') {
                        dynamicCardBorderClass = 'border-amber-500/45 bg-amber-500/[0.03] shadow-[0_0_20px_rgba(245,158,11,0.05)]';
                      }

                      return (
                        <div 
                          key={student.id}
                          className={`p-5 rounded-[2rem] border hover:bg-white/[0.04] transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-6 ${dynamicCardBorderClass}`}
                          id={`student-row-${student.id}`}
                        >
                          {/* Student personal info (Read-only representation) */}
                          <div className="flex items-center gap-5 shrink-0">
                            <div className="relative">
                              <img 
                                src={student.photo} 
                                className={`w-14 h-14 rounded-full object-cover border-2 p-0.5 transition-all duration-300 ${statusBadgeConfig.ring}`} 
                                alt={student.name} 
                              />
                              {student.performance >= 90 && (
                                <div className="absolute -top-1 -right-1 w-5.5 h-5.5 bg-amber-400 rounded-lg flex items-center justify-center text-black border border-black shadow-md rotate-12">
                                  <Zap size={10} fill="currentColor" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white text-md font-bold uppercase tracking-tight leading-tight">{student.name}</h4>
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/30 text-[7px] font-black uppercase tracking-widest font-mono">
                                  READ-ONLY
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-white/35 font-semibold uppercase">{student.id}</span>
                                <span className="text-white/20 text-xs">•</span>
                                <span className="text-[9px] font-black text-[#DEFF9A]/80 uppercase tracking-wider font-mono">Nivel {student.level}</span>
                                <span className="text-white/20 text-xs">•</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase">PPD: {student.performance}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Mid Section: Concentrado de Calificaciones inside card */}
                          <div className="flex flex-col gap-1.5 bg-black/30 border border-white/5 rounded-2xl p-3 min-w-[200px] xl:max-w-xs w-full shrink-0">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-[8px] font-black uppercase tracking-wider text-white/40 font-mono">Notas / Calificaciones</p>
                              <button 
                                onClick={() => setSelectedStudentGrades(student)}
                                className="text-[#4ADE80] hover:text-[#4ADE80]/80 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all font-mono"
                                title="Ver Concentrado Completo de Calificaciones"
                              >
                                <span>Ver Todo</span>
                                <TrendingUp size={10} />
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 text-center mt-1">
                              <div className="bg-white/5 rounded-lg p-1">
                                <p className="text-[7px] text-white/30 uppercase font-bold font-mono font-black">Exam</p>
                                <p className="text-[10px] font-mono font-black text-[#DEFF9A]">{getStudentGrades(student.id).exams}%</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-1">
                                <p className="text-[7px] text-white/30 uppercase font-bold font-mono font-black">Tareas</p>
                                <p className="text-[10px] font-mono font-black text-[#DEFF9A]">{getStudentGrades(student.id).homework}%</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-1">
                                <p className="text-[7px] text-white/30 uppercase font-bold font-mono font-black">Speak</p>
                                <p className="text-[10px] font-mono font-black text-[#DEFF9A]">{getStudentGrades(student.id).speaking}%</p>
                              </div>
                              <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-lg p-1">
                                <p className="text-[7px] text-[#4ADE80] uppercase font-bold font-mono font-black font-black">PROM</p>
                                <p className="text-[10px] font-mono font-black text-[#4ADE80]">{getStudentGrades(student.id).average}%</p>
                              </div>
                            </div>
                          </div>

                          {/* Mid Section: Current session status badge */}
                          <div className="flex items-center gap-4">
                            <div className="hidden min-[480px]:block text-right">
                              <p className="text-white/20 text-[7px] font-black uppercase tracking-widest leading-none mb-1 font-mono">Estado de Sesión</p>
                              <span className="text-white text-[10px] uppercase font-bold text-white/50">Fecha de Hoy</span>
                            </div>
                            <div className={`px-4.5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-mono ${statusBadgeConfig.bg}`}>
                              <StatusIcon size={12} className="shrink-0" />
                              {statusBadgeConfig.label}
                            </div>
                          </div>

                          {/* Right Section: ACTIVE ATTENDANCE ROLL-CALL BUTTONS FOR TEACHER */}
                          <div className="flex flex-wrap items-center gap-2.5 bg-black/30 border border-white/5 p-2 rounded-2xl shrink-0 font-mono">
                            {/* Presente Button: Green */}
                            <button
                              onClick={() => {
                                setAttendanceState(prev => ({ ...prev, [student.id]: 'PRESENTE' }));
                                if (openedGroupId) saveAttendance(openedGroupId, student.id, 'PRESENTE');
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'PRESENTE' 
                                  ? 'bg-[#4ADE80] text-black border-transparent shadow-[0_0_15px_rgba(74,222,128,0.4)] scale-105'
                                  : 'bg-emerald-500/5 hover:bg-emerald-500 hover:text-black border-emerald-500/20 text-emerald-400'
                              }`}
                              title="Establecer alumno como Presente en clase."
                            >
                              <CheckCircle2 size={12} />
                              Presente
                            </button>

                            {/* Ausente Button: Red */}
                            <button
                              onClick={() => {
                                setAttendanceState(prev => ({ ...prev, [student.id]: 'AUSENTE' }));
                                if (openedGroupId) saveAttendance(openedGroupId, student.id, 'AUSENTE');
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'AUSENTE' 
                                  ? 'bg-rose-500 text-black border-transparent shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-105'
                                  : 'bg-rose-500/5 hover:bg-rose-500 hover:text-black border-rose-500/20 text-rose-400'
                              }`}
                              title="Establecer alumno como Ausente en clase."
                            >
                              <XCircle size={12} />
                              Ausente
                            </button>

                            {/* Justificado Button: Orange */}
                            <button
                              onClick={() => {
                                setAttendanceState(prev => ({ ...prev, [student.id]: 'JUSTIFICADO' }));
                                if (openedGroupId) saveAttendance(openedGroupId, student.id, 'JUSTIFICADO');
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'JUSTIFICADO' 
                                  ? 'bg-amber-500 text-[#061a1a] border-transparent shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                                  : 'bg-amber-500/5 hover:bg-amber-500 hover:text-black border-amber-500/20 text-amber-400'
                              }`}
                              title="Justificante de inasistencia presentado y aprobado."
                            >
                              <ShieldAlert size={12} />
                              Justificado
                            </button>

                            {/* Retraso Button: Pink */}
                            <button
                              onClick={() => {
                                setAttendanceState(prev => ({ ...prev, [student.id]: 'RETRASO' }));
                                if (openedGroupId) saveAttendance(openedGroupId, student.id, 'RETRASO');
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'RETRASO' 
                                  ? 'bg-pink-500 text-black border-transparent shadow-[0_0_15px_rgba(236,72,153,0.4)] scale-105'
                                  : 'bg-pink-500/5 hover:bg-pink-500 hover:text-black border-pink-500/20 text-pink-400'
                              }`}
                              title="Alumno ingresó a clase con atraso tolerado."
                            >
                              <Clock size={12} />
                              Retraso
                            </button>
                          </div>

                          {/* Extra detail eye/pdp button and messaging button inside each roster */}
                          <div className="shrink-0 flex justify-end items-center gap-2">
                            <button
                              onClick={() => {
                                setQuickChatUser({ id: student.id, name: student.name });
                              }}
                              className="p-3 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-xl hover:bg-[#4ADE80] hover:text-black text-[#4ADE80] transition-all text-xs flex items-center gap-1.5 font-mono"
                              title="Enviar Mensaje Directo"
                            >
                              <MessageCircle size={14} /> <span className="xl:hidden">Mensaje Directo</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                              }}
                              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] text-white/50 hover:border-[#4ADE80]/20 transition-all text-xs flex items-center gap-1.5 font-mono"
                              title="Consultar expediente académico (Read-Only)"
                            >
                              <Eye size={14} /> <span className="xl:hidden">Ver Expediente</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* 2. MAQUETACIÓN DEL GRID COMPACTO (layoutMode === 'table') with High-Density Dark Engineering Style */
                  <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02] text-[#6b7280] font-mono text-[10px] font-black uppercase tracking-wider">
                          <th className="py-4 px-6 text-left">ALUMNO</th>
                          <th className="py-4 px-6 text-left">ID</th>
                          <th className="py-4 px-6 text-left">NIVEL</th>
                          <th className="py-4 px-6 text-center">PROM</th>
                          <th className="py-4 px-6 text-center">ACCIÓN DE ASISTENCIA RÁPIDA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50 text-xs text-white">
                        {groupStudentIds.map((stuId) => {
                          const student = getStudentDetails(stuId);
                          const currentStatus = attendanceState[student.id] || 'SIN_REGISTRO';
                          const studentGrades = getStudentGrades(student.id);

                          return (
                            <tr key={student.id} className="hover:bg-gray-900/40 transition-colors group">
                              {/* Alumno column with 32x32 image and name inline */}
                              <td className="py-3 px-6">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={student.photo} 
                                    className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" 
                                    alt={student.name} 
                                  />
                                  <span className="font-bold text-white group-hover:text-[#4ADE80] transition-colors uppercase tracking-tight text-xs leading-none">
                                    {student.name}
                                  </span>
                                </div>
                              </td>

                              {/* Student ID column */}
                              <td className="py-3 px-6 font-mono text-[10px] text-white/40 tracking-wider">
                                {student.id}
                              </td>

                              {/* Student Level column */}
                              <td className="py-3 px-6">
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#DEFF9A]/80 font-mono text-[9px] font-black uppercase tracking-wider">
                                  Nivel {student.level}
                                </span>
                              </td>

                              {/* Student PROM column */}
                              <td className="py-3 px-6 text-center font-mono font-black text-xs text-[#4ADE80]">
                                {studentGrades.average}%
                              </td>

                              {/* Compact Button Group for rapid attendance action */}
                              <td className="py-3 px-6">
                                <div className="flex items-center justify-center">
                                  <div className="inline-flex rounded-xl overflow-hidden border border-white/5 bg-black/60 p-0.5 mt-0.5 shrink-0 select-none">
                                    {/* P: Presente (Green) */}
                                    <button
                                      onClick={() => {
                                        setAttendanceState(prev => ({ ...prev, [student.id]: 'PRESENTE' }));
                                        if (openedGroupId) saveAttendance(openedGroupId, student.id, 'PRESENTE');
                                      }}
                                      className={`w-7.5 h-7.5 flex items-center justify-center text-[10px] font-black tracking-widest transition-all rounded-lg ${
                                        currentStatus === 'PRESENTE'
                                          ? 'bg-emerald-500 text-black font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                          : 'text-white/40 hover:text-white hover:bg-white/5'
                                      }`}
                                      title="Presente (P)"
                                    >
                                      P
                                    </button>

                                    {/* A: Ausente (Red) */}
                                    <button
                                      onClick={() => {
                                        setAttendanceState(prev => ({ ...prev, [student.id]: 'AUSENTE' }));
                                        if (openedGroupId) saveAttendance(openedGroupId, student.id, 'AUSENTE');
                                      }}
                                      className={`w-7.5 h-7.5 flex items-center justify-center text-[10px] font-black tracking-widest transition-all rounded-lg ${
                                        currentStatus === 'AUSENTE'
                                          ? 'bg-rose-500 text-black font-black shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                                          : 'text-white/40 hover:text-white hover:bg-white/5'
                                      }`}
                                      title="Ausente (A)"
                                    >
                                      A
                                    </button>

                                    {/* J: Justificado (Blue) */}
                                    <button
                                      onClick={() => {
                                        setAttendanceState(prev => ({ ...prev, [student.id]: 'JUSTIFICADO' }));
                                        if (openedGroupId) saveAttendance(openedGroupId, student.id, 'JUSTIFICADO');
                                      }}
                                      className={`w-7.5 h-7.5 flex items-center justify-center text-[10px] font-black tracking-widest transition-all rounded-lg ${
                                        currentStatus === 'JUSTIFICADO'
                                          ? 'bg-blue-500 text-white font-black shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                                          : 'text-white/40 hover:text-white hover:bg-white/5'
                                      }`}
                                      title="Justificado (J)"
                                    >
                                      J
                                    </button>

                                    {/* R: Retraso (Yellow) */}
                                    <button
                                      onClick={() => {
                                        setAttendanceState(prev => ({ ...prev, [student.id]: 'RETRASO' }));
                                        if (openedGroupId) saveAttendance(openedGroupId, student.id, 'RETRASO');
                                      }}
                                      className={`w-7.5 h-7.5 flex items-center justify-center text-[10px] font-black tracking-widest transition-all rounded-lg ${
                                        currentStatus === 'RETRASO'
                                          ? 'bg-amber-500 text-black font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                          : 'text-white/40 hover:text-white hover:bg-white/5'
                                      }`}
                                      title="Retraso (R)"
                                    >
                                      R
                                    </button>

                                    {/* Ø: Sin Registro (Gris técnico / Reset) */}
                                    <button
                                      onClick={() => setAttendanceState(prev => ({ ...prev, [student.id]: 'SIN_REGISTRO' }))}
                                      className={`w-7 h-7 flex items-center justify-center text-[10px] font-black tracking-wider transition-all rounded-lg ${
                                        currentStatus === 'SIN_REGISTRO'
                                          ? 'bg-white/10 text-white/50 border border-white/10'
                                          : 'text-white/20 hover:text-white hover:bg-white/5'
                                      }`}
                                      title="Reiniciar a Pendiente (-)"
                                    >
                                      -
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* DYNAMIC INTEGRATION: EXÁMENES ASIGNADOS DEL TEMPLATE MAKER */}
                {(() => {
                  let exams: any[] = [];
                  try {
                    const saved = localStorage.getItem('library_created_exams');
                    if (saved) {
                      exams = JSON.parse(saved);
                    }
                  } catch (e) {
                    console.error(e);
                  }

                  // Enforce absolute key uniqueness on exam list
                  const seenExams = new Set<string>();
                  const uniqueExams: any[] = [];
                  for (const ex of exams) {
                    let id = ex.id;
                    if (!id || seenExams.has(id)) {
                      id = 'exam_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                    }
                    seenExams.add(id);
                    uniqueExams.push({ ...ex, id });
                  }

                  // Filter by current opened group id or standard "all"
                  const groupExams = uniqueExams.filter(ex => ex.group === 'all' || ex.group === currentOpenedGroup.id);

                  return (
                    <div className="mt-8 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 text-left">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <span>📋 Exámenes & Evaluaciones Activas ({groupExams.length})</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#4ADE80]/15 text-[#4ADE80] text-[8px] font-mono uppercase">
                              Test Maker Sync
                            </span>
                          </h3>
                          <p className="text-[#061a1a]/10 dark:text-white/40 text-[10px]">
                            Pruebas bimestrales y quizzes de planeación académica distribuidos por la dirección para este grupo.
                          </p>
                        </div>
                      </div>

                      {groupExams.length === 0 ? (
                        <div className="py-8 text-center text-white/30 text-xs rounded-2xl border border-dashed border-white/5 bg-black/20">
                          No hay exámenes programados para esta célula grupal actualmente.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {groupExams.map((ex: any) => (
                            <div 
                              key={ex.id}
                              className="p-5 rounded-3xl bg-[#0b1219]/75 border border-white/5 hover:border-[#4ADE80]/30 transition-all space-y-4"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="space-y-0.5">
                                  <span className="text-[#DEFF9A] text-[7.5px] font-mono font-black uppercase tracking-wider block">
                                    {ex.semester}
                                  </span>
                                  <h4 className="text-xs font-black text-white uppercase tracking-tight leading-tight line-clamp-2">
                                    {ex.title}
                                  </h4>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] text-[8px] font-mono leading-none shrink-0">
                                  PENDIENTE
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 py-3 text-[10px] font-mono">
                                <div className="text-center">
                                  <span className="block text-[7.5px] text-white/30 font-sans font-bold uppercase">Reactivos</span>
                                  <b className="text-[#DEFF9A] text-xs">{ex.questionCount || 5}</b>
                                </div>
                                <div className="text-center">
                                  <span className="block text-[7.5px] text-white/30 font-sans font-bold uppercase">Duración</span>
                                  <b className="text-white text-xs">{ex.duration || 45}m</b>
                                </div>
                                <div className="text-center">
                                  <span className="block text-[7.5px] text-white/30 font-sans font-bold uppercase">Puntaje</span>
                                  <b className="text-[#DEFF9A] text-xs">{ex.totalPoints || 100}</b>
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-[8.5px] font-mono">
                                <span className="text-white/30">DISTRIBUCIÓN: <b className="text-white/60 uppercase">{(ex.group === 'all' || !ex.group) ? 'GLOBAL' : ex.group}</b></span>
                                <span className="text-[#4ADE80] font-bold">{ex.createdAt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

              </motion.div>
            );
          })()
        )}
      </AnimatePresence>

      {/* 3. Student PDP Modal (Original logic preserved intact) */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full bg-[#111215] border border-white/10 rounded-[3rem] p-10 md:p-12 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                id="btn-close-pdp-modal"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <div className="col-span-12 md:col-span-4 text-center space-y-6">
                  <div className="relative inline-block">
                     <img src={selectedStudent.photo} className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#4ADE80]/40 p-2 object-cover mx-auto" alt="" />
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#4ADE80] text-[#061a1a] px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(74,222,128,0.4)]">
                        {selectedStudent.performance}% PPD
                     </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{selectedStudent.name}</h3>
                    <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em] mt-2">{selectedStudent.id}</p>
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[10px] font-bold uppercase tracking-widest inline-block">
                       Nivel IA: {selectedStudent.level || 'A1'}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 space-y-10 md:space-y-12">
                   <div>
                      <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Mapeo Genético de Habilidades</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <div className="flex items-center gap-2 text-white/60">
                                  <Mic2 size={14} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Speaking Accuracy</span>
                                </div>
                               <span className="text-xs font-black text-[#DEFF9A]">{selectedStudent.pronunciation}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#DEFF9A]" style={{ width: `${selectedStudent.pronunciation}%` }} />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <div className="flex items-center gap-2 text-white/60">
                                  <Users size={14} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Attendance consistency</span>
                               </div>
                               <span className="text-xs font-black text-[#4ADE80]">{selectedStudent.attendance}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#4ADE80]" style={{ width: selectedStudent.attendance }} />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 font-sans">
                      <h5 className="text-white text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                         <ShieldCheck size={16} className="text-[#DEFF9A]" /> Certificación Vigente
                      </h5>
                      <div className="flex gap-4">
                         <div className="flex-1 p-4 rounded-2xl bg-black/40 border border-white/5">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Folios Completos</p>
                            <p className="text-lg md:text-xl font-black text-white">{selectedStudent.tasks}/15</p>
                         </div>
                         <div className="flex-1 p-4 rounded-2xl bg-black/40 border border-white/5">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Status Global</p>
                            <p className="text-lg md:text-xl font-black text-[#DEFF9A]">AVANZADO</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 py-4 bg-[#DEFF9A] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-[0_0_30px_rgba(222,255,154,0.3)] hover:brightness-110 transition-all">
                         Descargar Reporte ADN
                      </button>
                      <button 
                        onClick={() => {
                          setQuickChatUser({ id: selectedStudent.id, name: selectedStudent.name });
                          setSelectedStudent(null);
                        }}
                        className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all"
                      >
                        Contactar Alumno
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3.5 Student Grades Overview Modal */}
      <AnimatePresence>
        {selectedStudentGrades && (() => {
          const grades = getStudentGrades(selectedStudentGrades.id);
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-6 md:p-8 text-white"
              onClick={() => setSelectedStudentGrades(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-xl w-full bg-[#111215] border border-white/10 rounded-[3rem] p-8 md:p-10 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)] font-sans"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedStudentGrades(null)}
                  className="absolute top-8 right-8 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors animate-all"
                  id="btn-close-grades-modal"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-4 mb-8 text-left">
                  <div className="relative">
                    <img 
                      src={selectedStudentGrades.photo} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#4ADE80]" 
                      alt="" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#4ADE80] text-black w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9px] font-mono font-black border-2 border-[#111215]">
                      {Math.round(grades.average)}%
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">{selectedStudentGrades.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-[#DEFF9A] uppercase tracking-wider">ID: {selectedStudentGrades.id}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[9px] font-bold text-white/40 uppercase font-mono">Nivel {selectedStudentGrades.level}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-left">
                  <div>
                    <h4 className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Concentrado Big Picture</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-white/30 text-[8px] font-black uppercase tracking-wider mb-1">Exámenes</p>
                        <p className="text-xl font-mono font-black text-[#DEFF9A]">{grades.exams}%</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-white/30 text-[8px] font-black uppercase tracking-wider mb-1">Tareas</p>
                        <p className="text-xl font-mono font-black text-[#DEFF9A]">{grades.homework}%</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-[#96e6ec] text-[8px] font-black uppercase tracking-wider mb-1">Speaking</p>
                        <p className="text-xl font-mono font-black text-[#96e6ec]">{grades.speaking}%</p>
                      </div>
                      <div className="bg-[#4ADE80]/5 border border-[#4ADE80]/20 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(74,222,128,0.05)]">
                        <p className="text-[#4ADE80] text-[8px] font-black uppercase tracking-wider mb-1">Promedio</p>
                        <p className="text-xl font-mono font-black text-[#4ADE80]">{grades.average}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Historial de Evaluaciones</h4>
                      <span className="text-[#4ADE80] text-[8px] font-black uppercase tracking-widest bg-[#4ADE80]/10 border border-[#4ADE80]/25 px-2.5 py-1 rounded font-mono">RÉGIMEN ACTIVO</span>
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {grades.history.map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <div>
                            <p className="text-white text-xs font-bold uppercase">{h.name}</p>
                            <p className="text-white/30 text-[8px] uppercase tracking-wider mt-0.5">{h.date} • Bimestre Actual</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-xl font-mono font-black text-xs ${h.grade >= 90 ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                             {h.grade}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                    <Info size={16} className="text-[#DEFF9A] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/40 leading-relaxed font-sans text-left">
                      Este concentrado de calificaciones es de <b>Lector Exclusivo (Read-Only)</b> para el docente. Toda modificación estructural de notas oficiales o re-evaluación se coordina a través del perfil del Director o mediante solicitudes formales validadas.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setQuickChatUser({ id: selectedStudentGrades.id, name: selectedStudentGrades.name });
                        setSelectedStudentGrades(null);
                      }}
                      className="flex-1 py-4 bg-[#4ADE80]/15 border border-[#4ADE80]/20 hover:bg-[#4ADE80] hover:text-black hover:border-transparent text-[#4ADE80] text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={14} />
                      <span>Contactar Alumno</span>
                    </button>
                    <button 
                      onClick={() => setSelectedStudentGrades(null)}
                      className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Cerrar Panel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* 4. Add Group Modal (Director Only - Preserved Intact) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061a1a]/95 backdrop-blur-2xl p-8"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-[#111215] border border-white/10 rounded-[3rem] p-10 overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
                     <UserCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Crear Nueva Célula Grupal</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Configuración Institucional de Grupos</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Nombre del Grupo</label>
                       <input 
                         type="text"
                         value={newGroup.name}
                         onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                         placeholder="Ej. Pioneers A1 - Evening"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50 placeholder:text-white/10"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Nivel Académico (Referencia ADN)</label>
                       <select 
                         value={newGroup.level}
                         onChange={e => setNewGroup({...newGroup, level: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       >
                          {levels.map(l => <option key={l} value={l} className="bg-[#061a1a]">{l}</option>)}
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Asignar Docente</label>
                       <select 
                         value={newGroup.teacherId}
                         onChange={e => setNewGroup({...newGroup, teacherId: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50"
                       >
                          <option value="" className="bg-[#061a1a]">Seleccionar Docente...</option>
                          {mockTeachers.map(t => <option key={t.id} value={t.id} className="bg-[#061a1a]">{t.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Asignar Alumnos (ID List)</label>
                       <div className="relative">
                          <input 
                            type="text"
                            placeholder="Separar por comas (Ej. USR-001, USR-002)"
                            onChange={e => setNewGroup({...newGroup, studentIds: e.target.value.split(',').map(id => id.trim())})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#DEFF9A]/50 placeholder:text-white/10 text-xs"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 space-y-6">
                     <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} className="text-[#DEFF9A]" /> Programación de Sesiones
                     </h4>
                     <div className="grid grid-cols-3 gap-3">
                        {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
                          <button
                            key={day}
                            onClick={() => {
                              const current = newGroup.days || [];
                              if (current.includes(day)) {
                                setNewGroup({...newGroup, days: current.filter(d => d !== day)});
                              } else {
                                setNewGroup({...newGroup, days: [...current, day]});
                              }
                            }}
                            className={`py-3 rounded-xl border text-[10px] font-black transition-all ${
                              newGroup.days?.includes(day)
                              ? 'bg-[#DEFF9A] border-[#DEFF9A] text-black shadow-lg shadow-[#DEFF9A]/20'
                              : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Rango de Horario</label>
                          <input 
                            type="text"
                            placeholder="08:00 - 10:00 AM"
                            value={newGroup.schedule}
                            onChange={e => setNewGroup({...newGroup, schedule: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Duración (IA Suggestion)</label>
                          <div className="h-10 flex items-center px-4 bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 rounded-xl text-[10px] font-bold text-[#DEFF9A]">
                             2 Horas Pedagógicas
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                    >
                      Descartar
                    </button>
                    <button 
                      onClick={handleAddGroup}
                      className="flex-[2] py-4 rounded-2xl bg-[#DEFF9A] text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(222,255,154,0.2)] hover:brightness-110 transition-all"
                    >
                      Establecer Grupo y Chat Automático
                    </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
