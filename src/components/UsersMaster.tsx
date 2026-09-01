/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  ShieldCheck,
  GraduationCap,
  Users,
  Settings2,
  X,
  ShieldAlert,
  Edit3,
  RefreshCw,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  Zap,
  TrendingUp,
  BrainCircuit,
  Copy,
  Check,
  Star,
  Lock,
  Map,
  Trash2,
  Eye,
  MessageSquare,
  BarChart3,
  MoreVertical,
  Key,
  Ban,
  Flame,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { listarUsuarios, UsuarioComunidad } from '../services/identityService';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

type UserRole = 'ADMIN' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'DIRECTOR';

export interface ADNResults {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  criticalPoint: string;
  dominantSkill: string;
  suggestedLevel: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface User {
  id: string;
  controlNumber: string;
  id_empleado?: string;
  curp: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  groups?: string[];
  capacity?: number;
  joinDate: string;
  level?: string;
  progress?: number;
  nativeMatch?: number;
  photo?: string;
  adnResults?: ADNResults;
  attendancePercentage?: number;
  attendanceStreak?: number;
  attendanceHistory?: AttendanceRecord[];
  // Campos para Docentes (Horario)
  maxHours?: number;
  qualifiedSubjects?: string[]; 
}

const mockUsers: User[] = [
  { 
    id: 'USR-823-X92', 
    controlNumber: 'TEC-2024-001',
    curp: 'LOZA850101HDFLNR01',
    name: 'Ana López', 
    email: 'ana.lopez@tecnolingo.ai', 
    phone: '+52 833 456 7890',
    location: 'Campus Norte',
    role: 'DOCENTE', 
    status: 'ACTIVE', 
    groups: ['A1-102', 'C1-304'], 
    capacity: 5,
    joinDate: '12 ENE 2024',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  { 
    id: 'USR-102-Y84', 
    controlNumber: 'TEC-2023-045',
    curp: 'RODC801212HDFLNR02',
    name: 'Carlos Rodríguez', 
    email: 'c.rod@tecnolingo.ai', 
    phone: '+52 833 111 2222',
    location: 'Corporate HQ',
    role: 'ADMIN', 
    status: 'ACTIVE',
    joinDate: '01 DIC 2023',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  { 
    id: 'USR-304-Z11', 
    controlNumber: 'TEC-2024-502',
    curp: 'PERJ950505HDFLNR03',
    name: 'Juan Pérez', 
    email: 'juan.p@student.ai', 
    phone: '+52 833 555 6666',
    location: 'Campus Sur',
    role: 'ALUMNO', 
    status: 'ACTIVE',
    joinDate: '15 MAR 2024',
    level: 'A2 - Pre-Intermediate',
    progress: 42,
    nativeMatch: 68,
    attendancePercentage: 92,
    attendanceStreak: 12,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    adnResults: {
      speaking: 65,
      listening: 85,
      reading: 70,
      writing: 60,
      criticalPoint: 'Speaking - Pronunciación',
      dominantSkill: 'Listening Comprehension',
      suggestedLevel: 'A2'
    },
    attendanceHistory: [
      { date: '2024-05-10', status: 'PRESENT' },
      { date: '2024-05-09', status: 'PRESENT' },
      { date: '2024-05-08', status: 'PRESENT' },
      { date: '2024-05-07', status: 'PRESENT' },
      { date: '2024-05-06', status: 'LATE' },
    ]
  },
  { 
    id: 'USR-221-C99', 
    controlNumber: 'TEC-2024-991',
    curp: 'MENS981010HDFLNR06',
    name: 'Sofía Méndez', 
    email: 's.mendez@student.ai', 
    phone: '+52 833 222 3333',
    location: 'Campus Sur',
    role: 'ALUMNO', 
    status: 'ACTIVE',
    joinDate: '10 ABR 2024',
    level: 'B1 - Intermediate',
    progress: 15,
    nativeMatch: 55,
    attendancePercentage: 65,
    attendanceStreak: 0,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    attendanceHistory: [
      { date: '2024-05-10', status: 'ABSENT' },
      { date: '2024-05-09', status: 'ABSENT' },
      { date: '2024-05-08', status: 'ABSENT' },
    ]
  },
  { 
    id: 'USR-552-A12', 
    controlNumber: 'TEC-2024-882',
    curp: 'SILM900808HDFLNR04',
    name: 'Martha Silva', 
    email: 'm.silva@tutor.ai', 
    phone: '+52 833 999 8888',
    location: 'Hub Virtual',
    role: 'TUTOR', 
    status: 'ACTIVE',
    joinDate: '20 FEB 2024',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  { 
    id: 'USR-901-B33', 
    controlNumber: 'TEC-2024-105',
    curp: 'GArL880404HDFLNR05',
    name: 'Luis Garcia', 
    email: 'l.garcia@tecnolingo.ai', 
    phone: '+52 833 777 4444',
    location: 'Campus Norte',
    role: 'DOCENTE', 
    status: 'ACTIVE', 
    groups: ['B2-201', 'A2-105', 'B1-101'], 
    capacity: 5,
    joinDate: '05 ENE 2024',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
];

interface ModalProps {
  user: User;
  onClose: () => void;
  onUpdateRole: (role: UserRole) => void;
  onToggleStatus: () => void;
  onSave?: (updatedUser: User) => void;
  onResetADN?: () => void;
  initialMode?: 'VIEW' | 'EDIT';
}

export function UserHierarchyModal({ user, onClose, onUpdateRole, onToggleStatus, onSave, onResetADN, initialMode = 'VIEW' }: ModalProps) {
  const { careers, careers: allCareers, updateTeacher } = useAppContext();
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>(initialMode);
  const [activeTab, setActiveTab] = useState<'DOISSIER' | 'ATTENDANCE' | 'COMPETENCIES'>('DOISSIER');
  const [editData, setEditData] = useState({ 
    ...user,
    maxHours: user.maxHours || 40,
    qualifiedSubjects: user.qualifiedSubjects || []
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const adnData = user.adnResults ? [
    { subject: 'Speaking', A: user.adnResults.speaking },
    { subject: 'Listening', A: user.adnResults.listening },
    { subject: 'Reading', A: user.adnResults.reading },
    { subject: 'Writing', A: user.adnResults.writing },
  ] : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] overflow-y-auto p-4 md:p-8 backdrop-blur-3xl bg-black/80 flex justify-center items-start md:items-center"
    >
      <div className="fixed inset-0" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl min-h-[50vh] max-h-[90dvh] md:max-h-[85vh] overflow-hidden flex flex-col my-auto"
      >
        <div className="flex-1 flex flex-col neo-glass border-[#DEFF9A]/20 bg-[#0d1117] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden min-h-0 relative">
          {/* Header */}
          <div className="p-8 border-b border-white/10 flex justify-between items-start shrink-0">
            <div className="flex items-center gap-6">
              <div className="relative">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-full border-2 border-[#DEFF9A] shadow-[0_0_20px_#DEFF9A40] object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-[#DEFF9A] flex items-center justify-center text-2xl font-black text-[#DEFF9A]">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#061a1a] ${user.status === 'ACTIVE' ? 'bg-[#DEFF9A]' : 'bg-red-500'}`} />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {mode === 'EDIT' ? (
                    <input 
                      type="text" 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="text-3xl font-black text-white uppercase tracking-tight bg-transparent focus:outline-none border-b border-[#DEFF9A]/20"
                    />
                  ) : (
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{user.name}</h2>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'ADMIN' ? 'bg-purple-500 text-white' : 
                    user.role === 'DOCENTE' ? 'bg-[#DEFF9A] text-[#061a1a]' : 
                    'bg-[#38BDF8] text-white'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="opacity-50 font-mono">ID: {user.id}</span>
                    <button onClick={() => copyToClipboard(user.id)} className="hover:text-[#DEFF9A] transition-colors">
                      <Copy size={12} />
                    </button>
                  </div>
                  {user.role === 'DOCENTE' && user.id_empleado && (
                    <>
                      <span className="opacity-50">•</span>
                      <div className="flex items-center gap-2">
                        <span className="opacity-50 font-mono text-[#DEFF9A]">{user.id_empleado}</span>
                        <button onClick={() => copyToClipboard(user.id_empleado)} className="hover:text-[#DEFF9A] transition-colors">
                          <Copy size={12} />
                        </button>
                      </div>
                    </>
                  )}
                  <span className="opacity-50">•</span>
                  <span className={user.status === 'ACTIVE' ? 'text-[#DEFF9A]' : 'text-red-500'}>{user.status}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl border border-white/10 text-white/30 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-8 border-b border-white/10 flex gap-8 bg-black/20 shrink-0 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('DOISSIER')}
              className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'DOISSIER' ? 'border-[#DEFF9A] text-[#DEFF9A]' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              Dossier Académico
            </button>
            <button 
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'ATTENDANCE' ? 'border-[#DEFF9A] text-[#DEFF9A]' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              Historial de Asistencia
            </button>
            {user.role === 'DOCENTE' && (
              <button 
                onClick={() => setActiveTab('COMPETENCIES')}
                className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'COMPETENCIES' ? 'border-[#DEFF9A] text-[#DEFF9A]' : 'border-transparent text-white/40 hover:text-white'}`}
              >
                Competencias y Carga
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-8">
            {activeTab === 'COMPETENCIES' ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Max Hours Block */}
                <div className="p-6 rounded-3xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-white text-lg font-black uppercase tracking-tight italic">Capacidad Docente</h4>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Horas Máximas según contrato</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <input 
                         type="number" 
                         value={editData.maxHours}
                         disabled={mode === 'VIEW'}
                         onChange={(e) => setEditData({...editData, maxHours: parseInt(e.target.value)})}
                         className="w-24 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xl font-black text-center focus:outline-none focus:border-[#DEFF9A]/50 transition-colors"
                       />
                       <span className="text-[#DEFF9A] font-black uppercase text-[10px] tracking-widest">Hrs / Sem</span>
                    </div>
                  </div>
                </div>

                {/* Subjects Block */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Competencias Académicas</h4>
                      <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{editData.qualifiedSubjects?.length || 0} Materias Habilitadas</span>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                      {careers.map(career => (
                        <div key={career.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                           <h5 className="text-white text-[10px] font-black uppercase tracking-[0.2em] italic border-b border-white/5 pb-2 flex items-center gap-3">
                              <Zap size={12} className="text-[#DEFF9A]" /> {career.name}
                           </h5>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {career.subjects.map(subject => {
                                const isQualified = editData.qualifiedSubjects?.includes(subject.id);
                                return (
                                  <button
                                    key={subject.id}
                                    disabled={mode === 'VIEW'}
                                    onClick={() => {
                                      const current = editData.qualifiedSubjects || [];
                                      const updated = isQualified 
                                        ? current.filter(id => id !== subject.id)
                                        : [...current, subject.id];
                                      setEditData({...editData, qualifiedSubjects: updated});
                                    }}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                                      isQualified 
                                        ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/40 text-[#DEFF9A] shadow-[0_0_15px_rgba(222,255,154,0.1)]' 
                                        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                                    }`}
                                  >
                                     <div className="flex-1 pr-4">
                                        <p className="text-[10px] font-bold tracking-tight leading-tight">{subject.name}</p>
                                        <p className="text-[8px] font-black uppercase opacity-40 mt-1">Semestre {subject.semester} • {subject.weeklyHours}h</p>
                                     </div>
                                     {isQualified && <CheckCircle2 size={14} className="shrink-0" />}
                                  </button>
                                );
                              })}
                           </div>
                        </div>
                      ))}
                      {careers.length === 0 && (
                        <div className="py-16 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-white/20 flex flex-col items-center gap-4">
                           <AlertCircle size={40} className="animate-pulse" />
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest italic">No hay materias en el catálogo</p>
                              <p className="text-[8px] font-bold uppercase opacity-60">Configura el catálogo primero en la sección de 'Asignaturas'</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ) : activeTab === 'DOISSIER' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Personal Block */}
                <div className="space-y-4">
                  <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Datos Personales</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative group">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Mail size={10} /> Correo Institutional (Bloqueado)
                      </span>
                      <p className="text-white text-xs font-bold truncate opacity-60">{user.email}</p>
                      <Lock size={10} className="absolute top-4 right-4 text-white/10" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative group">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert size={10} /> CURP (Protegido)
                      </span>
                      <p className="text-white text-xs font-bold truncate opacity-60 font-mono tracking-tighter">{user.curp}</p>
                      <Lock size={10} className="absolute top-4 right-4 text-white/10" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Phone size={10} /> Teléfono
                      </span>
                      {mode === 'EDIT' ? (
                        <input 
                          type="text" 
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="bg-transparent text-white text-xs font-bold w-full focus:outline-none border-b border-[#DEFF9A]/20"
                        />
                      ) : (
                        <p className="text-white text-xs font-bold">{user.phone}</p>
                      )}
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Map size={10} /> Ubicación / Campus
                      </span>
                      {mode === 'EDIT' ? (
                        <input 
                          type="text" 
                          value={editData.location}
                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                          className="bg-transparent text-white text-xs font-bold w-full focus:outline-none border-b border-[#DEFF9A]/20"
                        />
                      ) : (
                        <p className="text-white text-xs font-bold">{user.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Institutional Block */}
                <div className="space-y-4">
                  <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Perfil Institucional</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {user.role === 'DOCENTE' && user.id_empleado && (
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative group">
                        <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Key size={10} /> ID Empleado
                        </span>
                        <p className="text-[#DEFF9A] text-xs font-bold font-mono tracking-tighter">{user.id_empleado}</p>
                        <button onClick={() => copyToClipboard(user.id_empleado)} className="absolute top-4 right-4 text-white/10 hover:text-[#DEFF9A] transition-colors">
                          <Copy size={10} />
                        </button>
                      </div>
                    )}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative group">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Key size={10} /> No. Control (Fijo)
                      </span>
                      <p className="text-white text-xs font-bold opacity-60 font-mono tracking-tighter">{user.controlNumber}</p>
                      <Lock size={10} className="absolute top-4 right-4 text-white/10" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={10} /> Ingreso
                      </span>
                      <p className="text-white text-xs font-bold">{user.joinDate}</p>
                    </div>
                  </div>
                </div>

                {/* Operational Block */}
                <div className="space-y-4">
                  <h4 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em]">Estatus Operativo</h4>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    {user.role === 'DOCENTE' ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                           <div>
                              {mode === 'EDIT' ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={editData.capacity}
                                    onChange={(e) => setEditData({...editData, capacity: parseInt(e.target.value)})}
                                    className="text-white text-2xl font-black bg-transparent w-16 focus:outline-none border-b border-[#DEFF9A]/20"
                                  />
                                  <p className="text-white text-2xl font-black">Límite</p>
                                </div>
                              ) : (
                                <p className="text-white text-2xl font-black">{user.groups?.length || 0} / {user.capacity || 5}</p>
                              )}
                              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Carga de Grupos</p>
                           </div>
                           <div className="text-right">
                              <p className={`text-xl font-black ${ (user.groups?.length || 0) >= (user.capacity || 5) ? 'text-red-500' : 'text-[#DEFF9A]'}`}>
                                {Math.round(((user.groups?.length || 0) / (user.capacity || 5)) * 100)}%
                              </p>
                              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Ocupación</p>
                           </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${((user.groups?.length || 0) / (user.capacity || 5)) * 100}%` }}
                             className={`h-full rounded-full ${ (user.groups?.length || 0) >= (user.capacity || 5) ? 'bg-red-500' : 'bg-[#DEFF9A]'}`}
                           />
                        </div>
                      </div>
                    ) : user.role === 'ALUMNO' ? (
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#38BDF8]">
                               <TrendingUp size={16} />
                               <span className="text-xl font-black">{user.progress}%</span>
                            </div>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Avance Curricular</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#DEFF9A]">
                               <Zap size={16} fill="currentColor" />
                               <span className="text-xl font-black">{user.nativeMatch}%</span>
                            </div>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Native Match</p>
                         </div>
                      </div>
                    ) : (
                      <p className="text-white/20 text-xs italic font-medium">No se requiere monitoreo operativo para este rol.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {user.role === 'ALUMNO' && user.adnResults ? (
                  <div className="space-y-6">
                    <h4 className="text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.4em]">Perfil Genético Académico (ADN Test)</h4>
                    
                    <div className="p-6 rounded-[2.5rem] bg-black/40 border border-[#38BDF8]/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#38BDF8]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="h-[250px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={adnData}>
                            <PolarGrid stroke="#ffffff10" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 900 }} />
                            <Radar
                              name="ADN"
                              dataKey="A"
                              stroke="#38BDF8"
                              fill="#38BDF8"
                              fillOpacity={0.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[#38BDF8] text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit size={10} /> Fortaleza
                          </span>
                          <p className="text-white text-[11px] font-black leading-tight">{user.adnResults.dominantSkill}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-orange-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert size={10} /> Punto Crítico
                          </span>
                          <p className="text-white text-[11px] font-black leading-tight">{user.adnResults.criticalPoint}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8]">
                        <div className="flex items-center gap-3">
                          <Star size={18} fill="currentColor" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Nivel Sugerido IA</p>
                            <p className="text-sm font-black">{user.adnResults.suggestedLevel}</p>
                          </div>
                        </div>
                        <button 
                          onClick={onResetADN}
                          className="p-2 hover:bg-[#38BDF8]/10 rounded-lg transition-colors"
                          title="Repetir Test"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center p-8">
                    <div className="w-full max-w-sm">
                      {/* ID CARD INSTITUCIONAL */}
                      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0a0f1a] to-[#111827] shadow-2xl">
                        {/* Header bar */}
                        <div className="bg-[#DEFF9A] px-6 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#061a1a] flex items-center justify-center">
                              <GraduationCap size={16} className="text-[#DEFF9A]" />
                            </div>
                            <div>
                              <p className="text-[#061a1a] text-[10px] font-black uppercase tracking-widest leading-none">TECLINGO</p>
                              <p className="text-[#061a1a]/60 text-[7px] font-bold uppercase tracking-widest">Instituto de Inglés</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-500/20 text-green-800'
                              : 'bg-red-500/20 text-red-800'
                          }`}>
                            {user.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </div>

                        {/* Photo + Info */}
                        <div className="p-6 flex flex-col items-center text-center space-y-4">
                          {/* Avatar */}
                          <div className="relative">
                            {user.photo ? (
                              <img
                                src={user.photo}
                                alt={user.name}
                                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : null}
                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-[#DEFF9A]/20 to-[#DEFF9A]/5 flex items-center justify-center text-[#DEFF9A] text-2xl font-black border border-[#DEFF9A]/20 ${user.photo ? 'absolute inset-0 -z-10' : ''}`}>
                              {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0a0f1a] flex items-center justify-center text-[7px] font-black ${
                              user.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {user.status === 'ACTIVE' ? '✓' : '✕'}
                            </div>
                          </div>

                          {/* Name + Role */}
                          <div>
                            <h3 className="text-white text-lg font-black uppercase tracking-tight italic">{user.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                                user.role === 'DOCENTE' ? 'bg-[#DEFF9A]/20 text-[#DEFF9A]' :
                                user.role === 'DIRECTOR' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-[#38BDF8]/20 text-[#38BDF8]'
                              }`}>
                                {user.role}
                              </span>
                              {user.id_empleado && (
                                <span className="text-[#DEFF9A] text-[9px] font-mono font-bold tracking-wider">{user.id_empleado}</span>
                              )}
                            </div>
                          </div>

                          {/* ID Fields */}
                          <div className="w-full space-y-2">
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                              <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">ID Sistema</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white/60 text-[9px] font-mono tracking-tighter">{user.id}</span>
                                <button onClick={() => copyToClipboard(user.id)} className="text-white/20 hover:text-[#DEFF9A] transition-colors">
                                  {copiedId === user.id ? <Check size={10} /> : <Copy size={10} />}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                              <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">CURP</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white/60 text-[9px] font-mono tracking-tighter">{user.curp || '—'}</span>
                                {user.curp && (
                                  <button onClick={() => copyToClipboard(user.curp)} className="text-white/20 hover:text-[#DEFF9A] transition-colors">
                                    {copiedId === user.curp ? <Check size={10} /> : <Copy size={10} />}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                              <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">No. Control</span>
                              <span className="text-white/60 text-[9px] font-mono tracking-tighter">{user.controlNumber || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                              <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">Email</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white/60 text-[9px] font-mono tracking-tighter truncate max-w-[180px]">{user.email}</span>
                                <button onClick={() => copyToClipboard(user.email)} className="text-white/20 hover:text-[#DEFF9A] transition-colors">
                                  {copiedId === user.email ? <Check size={10} /> : <Copy size={10} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                          <span className="text-white/15 text-[7px] font-bold uppercase tracking-widest">Registro: {user.joinDate || '—'}</span>
                          <span className="text-white/15 text-[7px] font-bold uppercase tracking-widest">TECLINGO IDENTITY™</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GlassCard accent="green" className="!bg-white/[0.03]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Racha de Asistencia</p>
                    <div className="flex items-center gap-3">
                      <Flame size={24} className="text-[#F59E0B]" fill="currentColor" />
                      <h3 className="text-3xl font-black text-white">{user.attendanceStreak || 0} DÍAS</h3>
                    </div>
                  </GlassCard>
                  <GlassCard accent="cyan" className="!bg-white/[0.03]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Porcentaje Global</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-3xl font-black text-white">{user.attendancePercentage || 0}%</h3>
                       <span className="text-[#DEFF9A] text-[10px] font-bold">Óptimo</span>
                    </div>
                  </GlassCard>
                  <GlassCard accent="orange" className="!bg-white/[0.03]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Inasistencias</p>
                    <h3 className="text-3xl font-black text-white">{user.attendanceHistory?.filter(r => r.status === 'ABSENT').length || 0} Sesiones</h3>
                  </GlassCard>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5">
                  <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Calendar size={16} className="text-[#DEFF9A]" />
                    Registro de Actividad Reciente
                  </h4>
                  <div className="space-y-3">
                    {user.attendanceHistory?.map((record, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#DEFF9A]/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                             record.status === 'PRESENT' ? 'bg-[#DEFF9A]' : 
                             record.status === 'ABSENT' ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{record.date}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                           record.status === 'PRESENT' ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 
                           record.status === 'ABSENT' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                    {!user.attendanceHistory?.length && (
                      <p className="text-white/20 text-xs italic py-8 text-center">No hay registros de asistencia para este periodo.</p>
                    )}
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A]">
                         <BarChart3 size={24} />
                      </div>
                      <div>
                         <h5 className="text-white text-sm font-black uppercase tracking-tight">Análisis de Permanencia</h5>
                         <p className="text-white/40 text-[10px] font-medium leading-relaxed">El alumno mantiene una puntualidad promedio del 92%. Se recomienda intervención del tutor para evitar rezago en Speaking.</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/10 bg-black/20 flex flex-wrap gap-4 relative shrink-0">
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-red-600 backdrop-blur-xl z-[110] flex items-center justify-between px-8"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <ShieldAlert size={24} className="text-white" />
                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">CONFIRMACIÓN VIP REQUERIDA</p>
                      <p className="text-white/80 text-[8px] font-bold">Ingresa contraseña de Director para eliminar a {user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none placeholder:text-white/30"
                    />
                    <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold uppercase text-[9px] tracking-widest hover:bg-white/20 transition-colors">Cancelar</button>
                    <button onClick={() => { alert('Usuario eliminado de la comunidad.'); onClose(); }} className="px-6 py-2 rounded-lg bg-white text-red-600 font-black uppercase text-[9px] tracking-widest shadow-2xl hover:bg-red-50 transition-colors">Confirmar</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 mr-auto">
              {['ADMIN', 'DOCENTE', 'ALUMNO', 'TUTOR'].map(roleVal => (
                <button
                  key={roleVal}
                  onClick={() => onUpdateRole(roleVal as UserRole)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    user.role === roleVal 
                      ? 'bg-[#DEFF9A] border-[#DEFF9A] text-[#061a1a]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  {roleVal}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all overflow-hidden relative group"
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={onToggleStatus}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                user.status === 'ACTIVE' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' 
                  : 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-[#DEFF9A] hover:bg-[#DEFF9A] hover:text-[#061a1a]'
              }`}
            >
              {user.status === 'ACTIVE' ? (
                <>
                  <UserX size={14} /> Suspender
                </>
              ) : (
                <>
                  <UserCheck size={14} /> Activar
                </>
              )}
            </button>
            
            {mode === 'VIEW' ? (
              <button 
                onClick={() => setMode('EDIT')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#061a1a] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all"
              >
                <Edit3 size={14} /> Editar Perfil
              </button>
            ) : (
              <button 
                onClick={() => { 
                  setMode('VIEW'); 
                  onSave?.(editData as User);
                  if (user.role === 'DOCENTE') {
                    updateTeacher({
                      id: editData.id,
                      name: editData.name,
                      email: editData.email,
                      phone: editData.phone,
                      maxHours: editData.maxHours || 40,
                      qualifiedSubjects: editData.qualifiedSubjects || [],
                      status: editData.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
                    });
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_#DEFF9A80]"
              >
                <ShieldCheck size={14} /> Guardar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function UsersMaster() {
  const { setQuickChatUser } = useAppContext();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filter, setFilter] = useState<UserRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Cargar usuarios del Data Lake según filtro
  const cargarUsuarios = async (
    filtro: UserRole | 'ALL' = filter,
    buscar: string = search
  ) => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const filtroBackend =
        filtro === 'ALL' ? 'TODOS' :
        (filtro === 'DOCENTE' || filtro === 'ALUMNO' || filtro === 'DIRECTOR') ? filtro : 'TODOS';

      const data = await listarUsuarios(filtroBackend as any, buscar);

      // Mapear UsuarioComunidad → User (para mantener compatibilidad con UserHierarchyModal)
      const mapped: User[] = data.map((u) => ({
        id: u.id,
        controlNumber: u.controlNumber,
        id_empleado: u.id_empleado || '',
        curp: u.curp,
        name: u.nombre,
        email: u.email,
        phone: u.phone,
        location: u.location,
        role: u.rol as UserRole,
        status: u.status,
        joinDate: u.joinDate,
        level: u.nivel,
        photo: u.avatar || undefined,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error('[UsersMaster] Error listando usuarios:', err);
      setUsersError('No se pudo cargar el listado del Data Lake');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Cargar al montar y cuando cambian filtro/búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarUsuarios(filter, search);
    }, 300); // debounce 300ms
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search]);

  const filteredUsers = users.filter(user => {
    const matchesRole = filter === 'ALL' || user.role === filter;
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          (user.controlNumber || '').toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleOpenUser = (user: User, mode: 'VIEW' | 'EDIT' = 'VIEW') => {
    setSelectedUser(user);
    setModalMode(mode);
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, role: newRole });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
    if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, status: selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' });
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(updatedUser);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Comunidad Tecnolingo</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase">Control de Jerarquía</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#DEFF9A] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/40 w-full md:w-80 transition-all backdrop-blur-xl"
            />
          </div>
          <button className="bg-[#DEFF9A] text-[#061a1a] rounded-2xl px-6 py-3 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_20px_#DEFF9A80] transition-all">
            <UserPlus size={16} /> Alta Usuario
          </button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[
          { label: 'Todos', value: 'ALL', icon: Users, disabled: false },
          { label: 'Administrativos', value: 'ADMIN', icon: ShieldCheck, disabled: true },
          { label: 'Docentes', value: 'DOCENTE', icon: GraduationCap, disabled: false },
          { label: 'Alumnos', value: 'ALUMNO', icon: UserPlus, disabled: false },
          { label: 'Tutores', value: 'TUTOR', icon: UserPlus, disabled: true },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => !btn.disabled && setFilter(btn.value as any)}
            disabled={btn.disabled}
            title={btn.disabled ? 'No disponible en este modelo' : undefined}
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
              btn.disabled
                ? 'bg-white/[0.02] border-white/5 text-white/15 cursor-not-allowed opacity-40'
                : filter === btn.value
                ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-[#DEFF9A] shadow-[0_0_15px_#DEFF9A15]'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
            }`}
          >
            <btn.icon size={14} />
            {btn.label}
          </button>
        ))}
      </div>

      <GlassCard className="!p-0 overflow-hidden" accent={filter === 'DOCENTE' ? 'green' : 'cyan'}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Usuario</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Rol</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Estado</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Carga / Avance</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Asistencia</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingUsers && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-[#DEFF9A]">
                      <div className="w-4 h-4 border-2 border-[#DEFF9A] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Cargando del Data Lake...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loadingUsers && usersError && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="text-red-400 text-xs font-bold uppercase tracking-widest">{usersError}</div>
                  </td>
                </tr>
              )}
              {!loadingUsers && !usersError && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Sin resultados para este filtro</div>
                  </td>
                </tr>
              )}
              {!loadingUsers && !usersError && filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => handleOpenUser(user)}
                  className="group hover:bg-[#DEFF9A]/05 transition-colors cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-2xl border border-white/10 object-cover group-hover:border-[#DEFF9A]/40 transition-all" />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DEFF9A] font-bold group-hover:border-[#DEFF9A]/40 transition-all">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <p className="text-white text-sm font-bold tracking-tight group-hover:text-[#DEFF9A] transition-colors">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={10} className="text-white/20" />
                          <p className="text-white/30 text-[10px] font-medium font-mono">{user.controlNumber}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                      user.role === 'ADMIN' ? 'text-purple-400 bg-purple-400/5 border-purple-400/10' :
                      user.role === 'DOCENTE' ? 'text-[#DEFF9A] bg-[#DEFF9A]/5 border-[#DEFF9A]/10' :
                      'text-[#38BDF8] bg-[#38BDF8]/5 border-[#38BDF8]/10'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#DEFF9A] shadow-[0_0_8px_#DEFF9A]' : 'bg-red-500'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${user.status === 'ACTIVE' ? 'text-white/60' : 'text-red-500/80'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {user.role === 'DOCENTE' && user.groups && user.capacity ? (
                      <div className="w-40 space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider text-white/40">
                          <span>{user.groups.length} / {user.capacity} GRUPOS</span>
                          <span className={user.groups.length >= user.capacity ? 'text-orange-500' : 'text-[#DEFF9A]'}>
                            {Math.round((user.groups.length / user.capacity) * 100)}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              user.groups.length >= user.capacity ? 'bg-orange-500' : 'bg-[#DEFF9A]'
                            }`}
                            style={{ width: `${(user.groups.length / user.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : user.role === 'ALUMNO' && user.progress !== undefined ? (
                      <div className="w-40 space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider text-white/40">
                          <span>AVANCE CURRICULAR</span>
                          <span className="text-[#38BDF8]">{user.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-[#38BDF8] transition-all duration-1000 shadow-[0_0_10px_#38BDF8]"
                            style={{ width: `${user.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/20 text-[10px] uppercase font-bold italic tracking-tighter">N/A</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {user.role === 'ALUMNO' && user.attendancePercentage !== undefined ? (
                      <div className="flex items-center gap-3">
                         <div className="relative w-10 h-10">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle
                                  cx="20"
                                  cy="20"
                                  r="16"
                                  fill="transparent"
                                  stroke="rgba(255,255,255,0.05)"
                                  strokeWidth="3"
                               />
                               <circle
                                  cx="20"
                                  cy="20"
                                  r="16"
                                  fill="transparent"
                                  stroke={user.attendancePercentage > 85 ? "#DEFF9A" : "#ef4444"}
                                  strokeWidth="3"
                                  strokeDasharray={2 * Math.PI * 16}
                                  strokeDashoffset={2 * Math.PI * 16 * (1 - user.attendancePercentage / 100)}
                                  strokeLinecap="round"
                               />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <span className="text-[8px] font-black text-white">{user.attendancePercentage}%</span>
                            </div>
                         </div>
                         {user.attendancePercentage < 80 && (
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse" title="RIESGO DE DESERCIÓN">
                               <AlertCircle size={14} />
                            </div>
                         )}
                      </div>
                    ) : (
                      <span className="text-white/10 italic text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenUser(user, 'VIEW'); }}
                        title="Ver Expediente" 
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/30 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setQuickChatUser(user);
                        }}
                        title="Enviar Mensaje"
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-[#DEFF9A] hover:bg-[#DEFF9A]/10 hover:border-[#DEFF9A]/30 transition-all"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenUser(user, 'EDIT'); }}
                        title="Editar Jerarquía"
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/30 transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(confirm('¿Confirmar eliminación VIP?')) {
                            console.log('Deleted:', user.id);
                          }
                        }}
                        title="Eliminar Usuario"
                        className="p-2 rounded-xl border border-white/5 text-white/30 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AnimatePresence>
        {selectedUser && (
          <UserHierarchyModal 
            user={selectedUser} 
            initialMode={modalMode}
            onClose={() => setSelectedUser(null)}
            onUpdateRole={(newRole) => handleUpdateRole(selectedUser.id, newRole)}
            onToggleStatus={() => handleToggleStatus(selectedUser.id)}
            onSave={handleSaveUser}
            onResetADN={() => {
              console.log('Resetting ADN for:', selectedUser.id);
            }}
          />
        )}
      </AnimatePresence>

      {/* Docente Specific Monitor - Extra Context */}
      {filter === 'DOCENTE' && (
        <div className="grid grid-cols-12 gap-6 mt-8">
          <GlassCard className="col-span-12 lg:col-span-12" title="Monitor de Carga Docente" icon={BarChart3} accent="green">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                <div className="space-y-2">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Carga Promedio</p>
                   <p className="text-3xl font-black text-[#DEFF9A] bevel-text tracking-tighter">72%</p>
                </div>
                <div className="space-y-2">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Disponibilidad</p>
                   <p className="text-3xl font-black text-[#4ADE80] bevel-text tracking-tighter">08 RANURAS</p>
                </div>
                <div className="space-y-2">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Sugerencia IA</p>
                   <p className="text-[10px] text-white/80 leading-relaxed italic">Optimización sugerida: Rebalancear Carga de Luis Garcia (Sobrecupo 105%) hacia Ana López.</p>
                </div>
             </div>
          </GlassCard>
        </div>
      )}
    </motion.div>
  );
}
