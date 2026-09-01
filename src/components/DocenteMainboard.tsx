/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  QrCode, 
  BookOpen, 
  Camera, 
  FileText, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Upload,
  Calendar,
  Settings as SettingsIcon,
  Mail,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  UserCheck,
  ClipboardList,
  Activity,
  Sun,
  Moon,
  Monitor,
  Languages,
  Award,
  Trophy,
  Star,
  Leaf,
  Medal,
  Sparkles,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, SidebarItem } from './Sidebar';
import { GlassCard } from './GlassCard';
import { GroupManagement } from './GroupManagement';
import { UserSettings } from './UserSettings';
import { PlanningModule } from './PlanningModule';
import { EvidenceModule } from './EvidenceModule';
import { FoliosDocente } from './FoliosDocente';
import { DocenteReconocimiento } from './DocenteReconocimiento';
import { LibroVirtualDirectorCompleto } from './LibroVirtualDirectorCompleto';
import { AvailabilityModule } from './AvailabilityModule';
import { InstitutionalCalendar } from './InstitutionalCalendar';
import { TeacherSchedules } from './TeacherSchedules';
import { MasterSwitcher, UserRole } from './MasterSwitcher';
import { MessagingModule } from './MessagingModule';
import { AttendanceModule } from './AttendanceModule';
import { TeacherAttendance } from './TeacherAttendance';
import { StudentAcademicActivity } from './StudentAcademicActivity';
import { QRScannerModule } from './QRScannerModule';
import { useAppContext } from '../context/AppContext';
import { SafeZoneTeacherAnalytics } from './SafeZoneTeacherAnalytics';
import { GruposInglesDocente } from './GruposInglesDocente';
import { QuickChat } from './QuickChat';
import { MessageNotificationBell } from './MessageNotificationBell';
import { TeacherGrades } from './TeacherGrades';
import { ProfileOnboardingModal, isProfileComplete } from './ProfileOnboardingModal';
import { obtenerPerfilCompleto } from '../services/identityService';

interface DocenteMainboardProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

interface AlumnoAsistencia {
  id: string;
  name: string;
  present: boolean;
  photo: string;
}

interface GroupData {
  id: string;
  name: string;
  room: string;
  schedule: string;
  timeStart: string;
  timeEnd: string;
  type: 'PRESENCIAL' | 'VIRTUAL';
  topic: string;
  students: AlumnoAsistencia[];
}

const groupsDataset: GroupData[] = [
  {
    id: 'A1-102',
    name: 'Basic English Lab',
    room: 'Aula 4-A',
    schedule: '08:00 - 09:40',
    timeStart: '08:00',
    timeEnd: '09:40',
    type: 'PRESENCIAL',
    topic: 'Roleplay: Airport and Greetings',
    students: [
      { id: '1', name: 'Juan P.', present: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: '2', name: 'Maria G.', present: true, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
      { id: '3', name: 'Luis M.', present: false, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: '4', name: 'Ana S.', present: true, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
      { id: '5', name: 'Pedro R.', present: false, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: '6', name: 'Sofia L.', present: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { id: '7', name: 'Héctor V.', present: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { id: '8', name: 'Elena D.', present: true, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    ]
  },
  {
    id: 'B2-205',
    name: 'Everyday Dialogue Practice',
    room: 'Zoom Lab 2',
    schedule: '10:00 - 11:40',
    timeStart: '10:00',
    timeEnd: '11:40',
    type: 'VIRTUAL',
    topic: 'Verbal expressions and shopping vocabulary',
    students: [
      { id: '11', name: 'Robert G.', present: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { id: '12', name: 'Emily W.', present: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { id: '13', name: 'Albert J.', present: false, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
      { id: '14', name: 'Charles S.', present: true, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
      { id: '15', name: 'Diana K.', present: false, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
    ]
  },
  {
    id: 'B1-105',
    name: 'Grammar in Everyday Context',
    room: 'Aula Central',
    schedule: '14:00 - 15:40',
    timeStart: '14:00',
    timeEnd: '15:40',
    type: 'PRESENCIAL',
    topic: 'Possessives & Family Relationship Dialogue',
    students: [
      { id: '21', name: 'Fernando T.', present: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: '22', name: 'Patricia L.', present: false, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: '23', name: 'Hugo B.', present: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: '24', name: 'Monica G.', present: true, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
      { id: '25', name: 'Iván S.', present: false, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
    ]
  },
  {
    id: 'C1-302',
    name: 'Advanced Speech & Fluency Lab',
    room: 'Auditorio',
    schedule: '09:00 - 10:40',
    timeStart: '09:00',
    timeEnd: '10:40',
    type: 'PRESENCIAL',
    topic: 'Capitalization Rules & Speech patterns under 50s',
    students: [
      { id: '31', name: 'Guillermo F.', present: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: '32', name: 'Adriana N.', present: true, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
      { id: '33', name: 'Julio C.', present: true, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
      { id: '34', name: 'Liliana M.', present: false, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    ]
  }
];

export function DocenteMainboard({ currentRole, onRoleChange }: DocenteMainboardProps) {
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t,
    isSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    globalEvents,
    groups: contextGroups,
    userEmail
  } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [targetChatId, setTargetChatId] = useState<string | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [teacherProfileData, setTeacherProfileData] = useState<Record<string, unknown>>({});
  
  // Custom states for group selection and auto-swapping schedule logic
  const [groups, setGroups] = useState<GroupData[]>(groupsDataset);
  const [currentGroupIdx, setCurrentGroupIdx] = useState<number>(0);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState<boolean>(false);
  const [isAutoScheduleMode, setIsAutoScheduleMode] = useState<boolean>(true); // Option 1
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0); // 0 to 50 min

  // Help map student IDs from custom groups to high-fidelity profile images and names
  const getStudentMockData = (id: string) => {
    const map: Record<string, { name: string; photo: string }> = {
      'USR-304-Z11': { name: 'Juan Pérez', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      'USR-221-C99': { name: 'Sofía Méndez', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
      'USR-001-A22': { name: 'Carlos Mendoza', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      'USR-502-A81': { name: 'Mateo Sandoval', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
      'USR-108-K12': { name: 'Valentina Rojas', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      'STU-101': { name: 'Camila Blanco', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      'STU-102': { name: 'Esteban Paredes', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      'STU-103': { name: 'Lucía Fernández', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
      'STU-104': { name: 'Guillermo Fraustro', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
      'USR-001': { name: 'Aline Gutiérrez', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
      'USR-002': { name: 'Jorge Montes', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
    };
    return map[id] || { name: `Estudiante ${id.replace('USR-', '').replace('STU-', '')}`, photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' };
  };

  // Keep local groups dataset synchronized with any groups created in the Director panel
  useEffect(() => {
    if (!contextGroups) return;
    setGroups(prev => {
      const updated = [...groupsDataset];
      contextGroups.forEach(cg => {
        // Only append if it's not already in the list
        if (updated.some(g => g.id === cg.id)) return;

        const studentsList = (cg.studentIds || []).map((sId) => {
          const detail = getStudentMockData(sId);
          return {
            id: sId,
            name: detail.name,
            present: false, // default in progress state
            photo: detail.photo
          };
        });

        if (studentsList.length === 0) {
          // Add default students if the group was created empty
          studentsList.push(
            { id: 'USR-304-Z11', name: 'Juan Pérez', present: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
            { id: 'USR-221-C99', name: 'Sofía Méndez', present: false, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' }
          );
        }

        updated.push({
          id: cg.id,
          name: cg.name,
          room: 'Aula Virtual C',
          schedule: cg.time ? `${cg.time} - ${cg.days?.join(', ') || 'LUN'}` : '16:00 - 17:40',
          timeStart: cg.time ? cg.time.split(' ')[0] : '16:00',
          timeEnd: '17:40',
          type: 'VIRTUAL',
          topic: 'English Proficiency diagnostics',
          students: studentsList
        });
      });
      return updated;
    });
  }, [contextGroups]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGroupForAttendance, setSelectedGroupForAttendance] = useState<string | null>(null);

  const handleNavigateToFullChat = (userId: string) => {
    setTargetChatId(userId);
    setCurrentView('mensajes');
  };

  const handleBellNavigateToChat = (chatId: string) => {
    setTargetChatId(chatId);
    setCurrentView('mensajes');
  };

  // Cargar perfil del docente para verificar si está completo
  useEffect(() => {
    const loadProfile = async () => {
      if (!userEmail) return;
      try {
        const perfil = await obtenerPerfilCompleto({ email: userEmail, rol: 'DOCENTE' });
        if (perfil) {
          const profileFields = {
            name: perfil.nombre || '',
            curp: perfil.curp || '',
            degree: perfil.degree || '',
          };
          setTeacherProfileData(profileFields);
          if (!isProfileComplete('DOCENTE', profileFields)) {
            setTimeout(() => setShowOnboardingModal(true), 800);
          }
        }
      } catch (err) {
        console.warn('[DocenteMainboard] Error loading profile:', err);
      }
    };
    loadProfile();
  }, [userEmail]);

  const activeGroup = groups[currentGroupIdx];
  const presentCount = activeGroup ? activeGroup.students.filter(s => s.present).length : 0;
  const totalStudentsCount = activeGroup ? activeGroup.students.length : 0;

  const [lastClassSwapNotification, setLastClassSwapNotification] = useState<string | null>(null);

  // Auto transition timer logic (Option 1)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoScheduleMode) {
      timer = setInterval(() => {
        setElapsedMinutes(prev => {
          if (prev >= 49) {
            // Elapse to 50min: swap group and reset timer
            const nextIdx = (currentGroupIdx + 1) % groups.length;
            const nextGrp = groups[nextIdx];
            setLastClassSwapNotification(
              `¡Límite de clase de 50 min alcanzado! Avanzando al siguiente grupo en el horario: ${nextGrp.id} - ${nextGrp.name}`
            );
            setCurrentGroupIdx(nextIdx);
            
            // Clear notification after 6 seconds
            setTimeout(() => {
              setLastClassSwapNotification(null);
            }, 6000);
            
            return 0;
          }
          return prev + 1;
        });
      }, 2500); // 2.5 seconds = 1 simulated minute. Easy to demonstrate in real-time.
    } else {
      setElapsedMinutes(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoScheduleMode, currentGroupIdx, groups.length]);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Mi Clase', icon: BarChart3, category: 'Soporte & Global', isPrincipal: true },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare, category: 'Soporte & Global' },
    { id: 'settings', label: 'Configuración', icon: SettingsIcon, category: 'Soporte & Global' },

    { id: 'grupos', label: 'Mis Grupos', icon: Users, category: 'Académico', isPrincipal: true },
    { id: 'grupos-ingles', label: 'Grupos Inglés (CLE)', icon: Languages, category: 'Académico' },
    { id: 'calificaciones', label: 'Calificaciones', icon: ClipboardList, badge: 'PRO', category: 'Académico' },
    { id: 'planeacion', label: 'Planeación', icon: BookOpen, category: 'Académico' },
    { id: 'libro-maestro', label: 'Libro Virtual Maestro', icon: BookOpen, badge: 'MÁSTER', category: 'Académico' },

    { id: 'academic', label: 'Actividad de Mis Grupos', icon: Activity, category: 'Operaciones', isPrincipal: true },
    { id: 'asistencias', label: 'Asistencias', icon: BarChart3, category: 'Operaciones' },
    { id: 'calendario', label: 'Calendario', icon: Calendar, category: 'Operaciones' },
    { id: 'horarios', label: 'Horarios', icon: Clock, category: 'Operaciones' },
    { id: 'disponibilidad', label: 'Asesorías / Slots', icon: Clock, badge: 'SYNC', category: 'Operaciones' },
    { id: 'folios', label: 'Folios', icon: FileText, category: 'Operaciones' },

    { id: 'safe-zone', label: '🛡️ Auditoría SafeZone', icon: Shield, badge: 'CONV', category: 'Monitoreo & Innovación', isPrincipal: true },
    { id: 'evidencias', label: 'Evidencias', icon: Camera, category: 'Monitoreo & Innovación' },
    { id: 'reconocimiento', label: 'Reconocimiento / Muro', icon: Award, category: 'Monitoreo & Innovación' },
  ];

  return (
    <div className="lg:grid lg:grid-cols-[auto_1fr] h-screen bg-gradient-to-tr from-[#050506] via-[#18191c] to-[#050506] text-white overflow-hidden relative">
      <Sidebar
        items={sidebarItems}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        userName="Ana López"
        userSub="Senior Teacher"
        userInitials="AL"
        userColor="bg-[#4ADE80]"
        onNavigateToChat={handleBellNavigateToChat}
      />

      <MessageNotificationBell
        onNavigateToChat={handleBellNavigateToChat}
        accentColor="#4ADE80"
      />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-screen ${isSidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar pt-20 lg:pt-0 transition-all duration-300`}>
        <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-12">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {selectedGroupForAttendance ? (
                <AttendanceModule 
                  groupName={selectedGroupForAttendance} 
                  onBack={() => setSelectedGroupForAttendance(null)} 
                />
              ) : currentView === 'dashboard' ? (
                <>
                  {lastClassSwapNotification && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-8 p-5 bg-[#4ADE80]/15 border-2 border-[#4ADE80] text-white rounded-3xl flex items-center gap-4 backdrop-blur-xl shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                    >
                      <CheckCircle2 className="text-[#4ADE80] shrink-0 animate-bounce" size={20} />
                      <span className="text-xs font-black uppercase tracking-wider leading-relaxed">{lastClassSwapNotification}</span>
                    </motion.div>
                  )}

                  <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h2 className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Módulo: Operación y Evidencia</h2>
                        <h1 className="text-3xl md:text-4xl font-black text-white bevel-text uppercase tracking-tight">Clase del Día</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        {globalEvents.some(e => e.visibility.includes('GLOBAL') || e.visibility.includes('DOCENTE')) && (
                          <div className="px-6 py-3 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center gap-4 hidden xl:flex">
                             <Calendar size={16} className="text-[#4ADE80]" />
                             <div className="text-left">
                                <p className="text-[#4ADE80] text-[8px] font-black uppercase tracking-widest leading-none">Circular Institucional</p>
                                <p className="text-white text-[10px] font-bold uppercase truncate max-w-[120px]">
                                   {globalEvents.find(e => e.visibility.includes('GLOBAL') || e.visibility.includes('DOCENTE'))?.title}
                                </p>
                             </div>
                          </div>
                        )}
                        <div className="text-left md:text-right w-full md:w-auto">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Status de Sesión</p>
                        <div className="flex items-center gap-2 text-[#4ADE80] md:justify-end">
                          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_8px_#4ADE80]" />
                          <span className="text-sm font-black uppercase tracking-widest">En Progreso</span>
                        </div>
                    </div>
                  </div>
                </header>

                {/* Switcher de Lógica de Operación (Opción 1 y Opción 2) */}
                <div className="mb-8 flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
                  <div className="p-1.5 bg-white/5 border border-white/10 rounded-3xl flex flex-col sm:flex-row gap-2 max-w-2xl w-full xl:w-auto">
                    <button 
                      onClick={() => {
                        setIsAutoScheduleMode(true);
                        setElapsedMinutes(0);
                        setIsGroupDropdownOpen(false);
                      }}
                      className={`flex-1 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${isAutoScheduleMode ? 'bg-gradient-to-r from-emerald-500 to-[#4ADE80] text-[#061a1a] shadow-[0_0_20px_rgba(74,222,128,0.25)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                      id="opt-auto-advance"
                    >
                      <Clock size={12} />
                      Opción 1: Reloj Horario (Auto-Avance 50m)
                    </button>
                    <button 
                      onClick={() => {
                        setIsAutoScheduleMode(false);
                      }}
                      className={`flex-1 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${!isAutoScheduleMode ? 'bg-gradient-to-r from-cyan-500 to-[#22D3EE] text-[#061a1a] shadow-[0_0_20px_rgba(34,211,238,0.25)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                      id="opt-manual-select"
                    >
                      <Users size={12} />
                      Opción 2: Selector Manual de Grupo
                    </button>
                  </div>

                  {/* PROMINENT SELECTOR DE GRUPOS DISPONIBLES (ONLY IN OPTION 2 / MANUAL SELECTED MODE) */}
                  <AnimatePresence>
                    {!isAutoScheduleMode && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="relative w-full xl:w-80"
                      >
                        <div className="relative">
                          <button 
                            onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                            className="w-full px-5 py-3.5 bg-black/40 hover:bg-black/60 border-2 border-dashed border-[#22D3EE]/30 rounded-2xl text-left flex items-center justify-between text-white text-[10px] font-black uppercase tracking-wider transition-all group shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-[#22D3EE] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                            id="btn-manual-group-dropdown"
                            title="Haz clic para seleccionar el grupo para la clase de hoy"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                              <span className="text-white/50 font-bold">GRUPO DISPONIBLE:</span>
                              <span className="truncate max-w-[150px] text-white">
                                {activeGroup ? `${activeGroup.id} - ${activeGroup.name}` : 'SELECCIONAR'}
                              </span>
                            </span>
                            <ChevronDown size={14} className={`text-[#22D3EE] transform transition-transform duration-300 ${isGroupDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                          </button>

                          {/* Dropdown Options List */}
                          {isGroupDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-50 left-0 right-0 mt-2 bg-[#141519]/95 backdrop-blur-xl border border-[#22D3EE]/40 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-h-80 overflow-y-auto custom-scrollbar"
                              id="list-manual-groups"
                            >
                              <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#22D3EE] text-center">GRUPOS DISPONIBLES EN SISTEMA</p>
                              </div>
                              <div className="p-1.5 divide-y divide-white/5 font-sans">
                                {groups.map((groupItem, gIdx) => (
                                  <button
                                    key={groupItem.id}
                                    onClick={() => {
                                      setCurrentGroupIdx(gIdx);
                                      setIsGroupDropdownOpen(false);
                                    }}
                                    className={`w-full p-3 text-left rounded-2xl flex items-center justify-between transition-all ${gIdx === currentGroupIdx ? 'bg-[#22D3EE]/15 text-[#22D3EE]' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}
                                  >
                                    <div className="space-y-1 truncate max-w-[190px]">
                                      <div className="flex items-center gap-2">
                                        <span className={`font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded ${gIdx === currentGroupIdx ? 'bg-[#22D3EE] text-[#061a1a]' : 'bg-white/10 text-white/70'}`}>{groupItem.id}</span>
                                        <span className="font-bold text-xs truncate">{groupItem.name}</span>
                                      </div>
                                      <p className="text-[8px] opacity-40 uppercase truncate">
                                        Horario: {groupItem.schedule} • {groupItem.room}
                                      </p>
                                    </div>
                                    <div className="shrink-0 pl-2">
                                      {gIdx === currentGroupIdx ? (
                                        <div className="w-4 h-4 rounded-full bg-[#22D3EE] flex items-center justify-center text-[8px] font-black text-[#010101]">✓</div>
                                      ) : (
                                        <span className="text-[7px] font-black uppercase tracking-wider text-white/30 hover:text-[#22D3EE]">Elegir</span>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
                  {/* Clase Actual Card */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-8">
                    <GlassCard accent={isAutoScheduleMode ? "green" : "cyan"} className="!p-6 md:!p-8 h-full flex flex-col justify-between">
                       <div className="space-y-6 w-full">
                         
                         {/* Mode Header */}
                         <div className="flex items-center justify-between border-b border-white/5 pb-4">
                           <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
                             {isAutoScheduleMode ? "MONITOR DE CRONOGRAMA ACTIVO (TRANSICIÓN DE 50 MIN)" : "SELECTOR DE GRUPOS DISPONIBLES (CONTROL DOCENTE)"}
                           </span>
                           <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full animate-pulse ${isAutoScheduleMode ? 'bg-[#4ADE80]' : 'bg-[#22D3EE]'}`} />
                             <span className={`text-[8px] font-black uppercase tracking-widest ${isAutoScheduleMode ? 'text-[#4ADE80]' : 'text-[#22D3EE]'}`}>
                               {isAutoScheduleMode ? "SISTEMA ACTIVO" : "MANUAL INTERACTIVO"}
                             </span>
                           </div>
                         </div>

                         <div className="flex flex-col lg:flex-row justify-between gap-8">
                           <div className="space-y-6 flex-1">
                               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                                 <div className="flex items-start sm:items-center gap-4">
                                   <div className={`px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-base md:text-lg font-black uppercase tracking-tighter ${isAutoScheduleMode ? 'text-[#4ADE80]' : 'text-[#22D3EE]'}`}>
                                       {activeGroup.id}
                                   </div>
                                   <div>
                                       <p className="text-white text-xl md:text-2xl font-black tracking-tight uppercase leading-none">{activeGroup.name}</p>
                                       <div className="flex items-center gap-2 mt-2">
                                         <Clock size={12} className="text-white/30" />
                                         <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{activeGroup.schedule} • SALÓN {activeGroup.room}</span>
                                       </div>
                                   </div>
                                 </div>

                                 {!isAutoScheduleMode && (
                                   <button
                                     onClick={() => setIsGroupDropdownOpen(prev => !prev)}
                                     className="px-4 py-2.5 bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/20 hover:border-[#22D3EE]/40 rounded-xl text-cyan-400 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                                     id="btn-quick-change-inner"
                                   >
                                     <Users size={11} />
                                     <span>Seleccionar Grupo</span>
                                     <ChevronDown size={11} className={`transform transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                                   </button>
                                 )}
                               </div>

                               <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between gap-4">
                                 <div>
                                   <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Tema del Día</p>
                                   <span className="text-white text-xs md:text-sm font-black uppercase tracking-tight">{activeGroup.topic}</span>
                                 </div>
                                 <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ${activeGroup.type === 'VIRTUAL' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20'}`}>
                                   {activeGroup.type}
                                 </div>
                               </div>

                               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                     <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Asistencia</p>
                                     <p className="text-xl font-black text-white">{presentCount} / {totalStudentsCount}</p>
                                 </div>
                                 <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                     <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Evidencia</p>
                                     <p className="text-xl font-black text-white uppercase text-[10px]">Guardada</p>
                                 </div>
                                 <div className="p-4 rounded-2xl bg-[#4ADE80]/5 border border-[#4ADE80]/10">
                                     <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Pase de Lista QR</p>
                                     <p className="text-[10px] font-black text-[#4ADE80] uppercase truncate">Código activo</p>
                                 </div>
                               </div>

                               {/* Dynamic custom view based on selected Option logic */}
                               {isAutoScheduleMode ? (
                                 <div className="space-y-4 pt-4 border-t border-white/5">
                                   <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase font-black tracking-widest">
                                     <span className="text-white/50">Progreso de Clase Activa (50 min límite)</span>
                                     <span className="text-[#4ADE80]">{elapsedMinutes}m / 50m transcurridos</span>
                                   </div>
                                   
                                   {/* Gorgeous physical progress bar */}
                                   <div className="w-full h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                     <div 
                                       style={{ width: `${Math.min((elapsedMinutes / 50) * 100, 100)}%` }} 
                                       className="h-full bg-gradient-to-r from-emerald-500 to-[#4ADE80] rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(74,222,128,0.4)]" 
                                     />
                                   </div>

                                   {/* Siguiente clase del horario - Validando la sección horario */}
                                   <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                     <div>
                                       <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Validación de Próxima Clase (Sección Horario)</p>
                                       <p className="text-[11px] font-black text-white uppercase">
                                         Siguiente: {groups[(currentGroupIdx + 1) % groups.length].id} - {groups[(currentGroupIdx + 1) % groups.length].name}
                                       </p>
                                       <p className="text-[9px] font-medium text-white/40 mt-1">
                                         Hora: {groups[(currentGroupIdx + 1) % groups.length].timeStart} ~ {groups[(currentGroupIdx + 1) % groups.length].timeEnd} • Salón {groups[(currentGroupIdx + 1) % groups.length].room}
                                       </p>
                                     </div>
                                     <div className="shrink-0 py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black uppercase text-white/60 tracking-wider">
                                       Auto-Validado
                                     </div>
                                   </div>

                                   {/* Quick simulated timers to make demo very interactive */}
                                   <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4">
                                     <p className="text-[8px] font-black text-[#F59E0B] uppercase tracking-widest mb-2.5">Simulador de Tiempo (Demostración de los 50 min)</p>
                                     <div className="flex flex-wrap gap-2">
                                       <button 
                                         onClick={() => setElapsedMinutes(prev => Math.min(prev + 10, 50))}
                                         className="px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl text-[8px] font-black uppercase tracking-wider text-amber-300 hover:bg-[#F59E0B] hover:text-black transition-all"
                                       >
                                         Simular +10 Minutos
                                       </button>
                                       <button 
                                         onClick={() => setElapsedMinutes(49)}
                                         className="px-4 py-2 bg-[#4ADE80]/15 border border-[#4ADE80]/30 rounded-xl text-[8px] font-black uppercase tracking-wider text-[#4ADE80] hover:bg-[#4ADE80] hover:text-black transition-all"
                                       >
                                         Consumir 50 Min (Cambio Automático)
                                       </button>
                                     </div>
                                   </div>
                                 </div>
                               ) : (
                                 <div className="space-y-4 pt-4 border-t border-white/5">
                                   <p className="text-[9px] font-black text-[#22D3EE] uppercase tracking-[0.2em] mb-2">Intercambiar Grupo (Asignados a su Gestión)</p>
                                   
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                     {groups.map((groupItem, gIdx) => (
                                       <button
                                         key={groupItem.id}
                                         onClick={() => {
                                           setCurrentGroupIdx(gIdx);
                                         }}
                                         className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${gIdx === currentGroupIdx ? 'bg-[#22D3EE]/20 border-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.25)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                       >
                                         <div>
                                           <span className="text-white text-xs font-black uppercase block">{groupItem.id}</span>
                                           <span className="text-white/40 text-[9px] font-medium uppercase truncate max-w-[140px] block mt-0.5">{groupItem.name}</span>
                                         </div>
                                         <div className="flex items-center gap-2">
                                           <span className="text-[8px] font-mono font-bold text-white/50">{groupItem.timeStart}</span>
                                           {gIdx === currentGroupIdx && (
                                             <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                                           )}
                                         </div>
                                       </button>
                                     ))}
                                   </div>
                                 </div>
                               )}

                           </div>

                           <div className="flex flex-col justify-center">
                               <button 
                                 onClick={() => setIsScanning(true)}
                                 className={`w-full lg:w-auto text-[#061a1a] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 transition-all group overflow-hidden relative min-h-[140px] ${isAutoScheduleMode ? 'bg-[#4ADE80] hover:shadow-[0_0_30px_rgba(74,222,128,0.35)]' : 'bg-[#22D3EE] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]'}`}
                               >
                                 <QrCode size={40} className="group-hover:scale-110 transition-transform md:size-48" />
                                 <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest">Pase de Lista (QR)</span>
                                 <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20 animate-scan pointer-events-none" />
                               </button>
                           </div>
                         </div>
                       </div>
                    </GlassCard>
                  </div>

                  {/* Monitor de Asistencia Live */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <GlassCard title="Monitor en Vivo" icon={Users} accent={isAutoScheduleMode ? "green" : "cyan"}>
                      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                          {activeGroup.students.map((a) => (
                            <div key={a.id} className="relative group">
                              <div className={`w-full aspect-square rounded-xl md:rounded-2xl border-2 p-0.5 md:p-1 transition-all ${a.present ? 'border-[#4ADE80]' : 'border-white/5'}`}>
                                  <img src={a.photo} className={`w-full h-full rounded-lg md:rounded-xl object-cover ${a.present ? 'opacity-100' : 'opacity-20'}`} alt="" />
                              </div>
                              {a.present && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4ADE80] rounded-full border-2 border-[#061a1a] flex items-center justify-center text-[10px] font-black">
                                    ✓
                                </div>
                              )}
                              <span className="absolute -bottom-1 -left-1 right-1 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded text-[6px] font-black uppercase text-white/80 truncate">{a.name}</span>
                            </div>
                          ))}
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Puntualidad de Sesión: {Math.round((presentCount / (totalStudentsCount || 1)) * 100)}%</span>
                          <button className="text-[8px] font-black text-[#4ADE80] uppercase tracking-widest hover:underline">Ver Todos</button>
                      </div>
                    </GlassCard>
                  </div>

                    {/* Módulo de Evidencia Diaria */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-7">
                      <GlassCard title="Evidencia SMART" icon={Camera} accent="cyan">
                          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center">
                            <div 
                              onClick={() => setIsUploading(true)}
                              className="w-full sm:w-40 h-40 md:w-48 md:h-48 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-[#22D3EE]/40 hover:bg-[#22D3EE]/5 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group shrink-0"
                            >
                                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 group-hover:bg-[#22D3EE]/20 transition-colors">
                                  <Upload size={24} className="text-white/20 group-hover:text-[#22D3EE] md:size-32" />
                                </div>
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest text-center px-4 leading-tight group-hover:text-white/40 transition-colors">Capturar Evidencia</p>
                            </div>
                            <div className="space-y-4 text-center sm:text-left">
                                <p className="text-white/60 text-[11px] md:text-xs font-medium leading-relaxed italic">
                                  "Sube la evidencia de hoy para validar tu sesión ante Dirección. El sistema TECLINGO PRO 1.1 analizará el contexto pedagógico."
                                </p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                  <div className="px-3 py-1.5 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[8px] font-black uppercase tracking-widest">JPG, PNG</div>
                                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/20 text-[8px] font-black uppercase tracking-widest">Max 10MB</div>
                                </div>
                            </div>
                          </div>
                      </GlassCard>
                    </div>

                    {/* Folios Pendientes Alert */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-5">
                      <GlassCard title="Mensajería" icon={Mail} accent="orange">
                          <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 relative overflow-hidden group hover:bg-[#F59E0B]/10 transition-all cursor-pointer">
                            <div className="flex items-center gap-4 md:gap-6 mb-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#F59E0B] shadow-[0_0_20px_#F59E0B40] flex items-center justify-center text-[#061a1a] shrink-0">
                                  <AlertTriangle size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                  <h4 className="text-white text-md md:text-lg font-black tracking-tight uppercase truncate">Circular Pendiente</h4>
                                  <p className="text-[#F59E0B] text-[8px] font-black uppercase tracking-widest mt-0.5">Acción: Firma Digital</p>
                                </div>
                            </div>
                            <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed mb-6">
                                Tienes 1 circular del Director esperando tu firma para confirmar el protocolo.
                            </p>
                            <button className="w-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F59E0B] hover:text-[#061a1a] transition-all">
                                Ir al Buzón <ChevronRight size={14} />
                            </button>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
                          </div>
                      </GlassCard>
                    </div>
                  </div>
                </>
              ) : currentView === 'academic' ? (
                <StudentAcademicActivity role="DOCENTE" />
              ) : currentView === 'grupos' ? (
                <GroupManagement onTakeAttendance={(group) => setSelectedGroupForAttendance(group)} />
              ) : currentView === 'grupos-ingles' ? (
                <GruposInglesDocente />
              ) : currentView === 'calificaciones' ? (
                <TeacherGrades />
              ) : currentView === 'asistencias' ? (
                <TeacherAttendance />
              ) : currentView === 'mensajes' ? (
                <MessagingModule initialChatId={targetChatId || undefined} />
              ) : currentView === 'calendario' ? (
                <InstitutionalCalendar />
              ) : currentView === 'horarios' ? (
                <TeacherSchedules />
              ) : currentView === 'planeacion' ? (
                <PlanningModule />
              ) : currentView === 'libro-maestro' ? (
                <LibroVirtualDirectorCompleto />
              ) : currentView === 'safe-zone' ? (
                <SafeZoneTeacherAnalytics />
              ) : currentView === 'evidencias' ? (
                <EvidenceModule />
              ) : currentView === 'folios' ? (
                <FoliosDocente />
              ) : currentView === 'reconocimiento' ? (
                <DocenteReconocimiento />
              ) : currentView === 'disponibilidad' ? (
                <AvailabilityModule />
              ) : currentView === 'settings' ? (
                <UserSettings role="DOCENTE" />
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-4 opacity-20 text-center">
                  <p className="text-2xl md:text-4xl font-black tracking-[0.3em] md:tracking-[0.5em] uppercase bevel-text leading-tight">Módulo en Desarrollo</p>
                  <p className="text-[10px] md:text-[12px] mt-4 tracking-widest font-bold">DOCENTE OPERATIVO PROTOCOL</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Full Screen QR Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <QRScannerModule 
            onClose={() => setIsScanning(false)}
            onScanSuccess={(data) => {
              // Extract student ID from code e.g. ROD-PANC-26-03 or STU-2026-003
              const id = data.split('-').pop()?.replace(/^0+/, '');
              if (id) {
                setGroups(prev => prev.map((g, idx) => {
                  if (idx === currentGroupIdx) {
                    return {
                      ...g,
                      students: g.students.map(s => s.id === id ? { ...s, present: true } : s)
                    };
                  }
                  return g;
                }));
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* QuickChat flotante */}
      <QuickChat onNavigateToFullChat={handleNavigateToFullChat} />

      {/* Modal de Onboarding — Perfil incompleto */}
      <ProfileOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onCompleteProfile={() => {
          setShowOnboardingModal(false);
          setCurrentView('settings');
        }}
        role="DOCENTE"
        profileData={teacherProfileData}
      />

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
