/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Bell, 
  Calendar, 
  Settings as SettingsIcon,
  Shield,
  Zap,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Search,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  Monitor,
  Languages,
  Stamp,
  Library,
  BookOpen,
  Lock,
  Sliders,
  Database,
  FileText,
  Activity,
  CheckSquare,
  Terminal,
  UserCheck,
  Copy,
  Check,
  KeyRound,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { MasterSwitcher, UserRole } from './MasterSwitcher';
import { Sidebar, SidebarItem } from './Sidebar';
import { GlassCard } from './GlassCard';
import { AcademicBI } from './AcademicBI';
import { OperationalCommand } from './OperationalCommand';
import { InnovationAlerts } from './InnovationAlerts';
import { UsersMaster } from './UsersMaster';
import { AcademicAudit } from './AcademicAudit';
import { UserSettings } from './UserSettings';
import { MessagingModule } from './MessagingModule';
import { QuickChat } from './QuickChat';
import { FolioConstructor } from './FolioConstructor';
import { FolioMonitor } from './FolioMonitor';
import { AcademicCatalog } from './AcademicCatalog';
import { GroupManager } from './GroupManager';
import { DirectorLibrary } from './DirectorLibrary';
import { GruposInglesDirector } from './GruposInglesDirector';
import { RealTimeMonitorPanel } from './RealTimeMonitorPanel';
import { LibroVirtualDirectorCompleto } from './LibroVirtualDirectorCompleto';
import { AccessControlModule } from './AccessControlModule';
import { ProfileOnboardingModal, isProfileComplete } from './ProfileOnboardingModal';
import { obtenerPerfilCompleto } from '../services/identityService';

import { TeachersMaster } from './TeachersMaster';

interface DirectivoMainboardProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function DirectivoMainboard({ currentRole, onRoleChange }: DirectivoMainboardProps) {
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    t,
    isSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    institutionName,
    setInstitutionName,
    globalEvents,
    managementEnabled,
    coursesEnabled,
    foliosEnabled,
    identityEnabled,
    reticularEnabled,
    distributionEnabled,
    userEmail
  } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [targetChatId, setTargetChatId] = useState<string | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [directorProfileData, setDirectorProfileData] = useState<Record<string, unknown>>({});
  const [institutionCode, setInstitutionCode] = useState<string>('');

  // Cargar perfil del director para verificar si está completo
  useEffect(() => {
    const loadProfile = async () => {
      if (!userEmail) return;
      try {
        const perfil = await obtenerPerfilCompleto({ email: userEmail, rol: 'DIRECTOR' });
        if (perfil) {
          const profileFields = {
            name: perfil.nombre || '',
            institutionName: perfil.institution_name || '',
          };
          setDirectorProfileData(profileFields);
          setInstitutionCode((perfil.institution_code as string) || '');
          if (!isProfileComplete('DIRECTOR', profileFields)) {
            setTimeout(() => setShowOnboardingModal(true), 800);
          }
        }
      } catch (err) {
        console.warn('[DirectivoMainboard] Error loading profile:', err);
      }
    };
    loadProfile();
  }, [userEmail]);

  // Copiar código al portapapeles
  const [codeCopied, setCodeCopied] = useState(false);
  const copyInstitutionCode = async () => {
    if (!institutionCode) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(institutionCode);
      } else {
        const ta = document.createElement('textarea');
        ta.value = institutionCode;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2200);
    } catch (err) {
      console.error('[Copy Institution Code]', err);
    }
  };

  const handleNavigateToFullChat = (userId: string) => {
    setTargetChatId(userId);
    setCurrentView('mensajes');
  };

  const isViewDisabled = (view: string) => {
    const academicViewsList = ['biblioteca', 'teachers', 'groups', 'gestor-horarios', 'bi'];
    const managementViewsList = ['operations', 'users', 'audit', 'folios', 'alerts', 'mensajes'];
    
    if (academicViewsList.includes(view) && !coursesEnabled) return true;
    if (managementViewsList.includes(view) && !managementEnabled) return true;

    // Sub-feature checks
    if (view === 'folios' && !foliosEnabled) return true;
    if (view === 'bi' && !distributionEnabled) return true;
    if (view === 'groups' && !reticularEnabled) return true;
    
    return false;
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, category: 'Soporte & Global', isPrincipal: true },
    { id: 'mensajes', label: 'Communication', icon: MessageSquare, category: 'Soporte & Global' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, category: 'Soporte & Global' },

    { id: 'groups', label: 'Grados y Grupos', icon: Users, badge: 'DEMANDA', category: 'Académico', isPrincipal: true },
    { id: 'grupos-ingles', label: 'Grupos Inglés (CLE)', icon: Languages, category: 'Académico' },
    { id: 'biblioteca', label: 'Biblioteca Directiva', icon: Library, category: 'Académico' },
    { id: 'teachers', label: 'Plantilla Docente', icon: UserCheck, category: 'Académico' },
    { id: 'bi', label: 'Academic BI', icon: BarChart3, badge: 'REAL-TIME', category: 'Académico' },

    { id: 'operations', label: 'Operations Control', icon: Sliders, category: 'Operaciones', isPrincipal: true },
    { id: 'users', label: 'User Master', icon: Database, category: 'Operaciones' },
    { id: 'folios', label: 'Gestión Folios', icon: FileText, badge: 'OFFICIAL', category: 'Operaciones' },
    { id: 'control-accesos', label: 'Control de Accesos', icon: Lock, badge: 'ESTRICTO', category: 'Operaciones' },

    { id: 'real-time', label: 'Real-Time', icon: Activity, category: 'Monitoreo & Innovación', isPrincipal: true },
    { id: 'audit', label: 'Academic Audit', icon: CheckSquare, category: 'Monitoreo & Innovación' },
    { id: 'alerts', label: 'Innovation Logs', icon: Terminal, badge: '12', category: 'Monitoreo & Innovación' },
  ];

  const quickStats = [
    { label: 'Matrícula Total', value: '1,284', trend: '+12%', icon: Users, color: 'text-cyan-400' },
    { label: 'Retención IA', value: '94.2%', trend: '+3%', icon: TrendingUp, color: 'text-[#DEFF9A]' },
    { label: 'Eficiencia Docente', value: '88%', trend: '-2%', icon: Zap, color: 'text-orange-400' },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => {
    // Siempre mostrar estos botones críticos
    if (item.id === 'settings' || item.id === 'dashboard' || item.id === 'control-accesos' || item.id === 'real-time') return true;
    // Siempre mostrar Grados y Grupos (DEMANDA) — se valida al hacer click
    if (item.id === 'groups') return true;
    return !isViewDisabled(item.id);
  });

  return (
    <div className="h-screen bg-gradient-to-tr from-[#010a0a] via-[#041a1a] to-[#010808] text-white lg:grid lg:grid-cols-[auto_1fr] overflow-hidden relative">
      <Sidebar 
        items={filteredSidebarItems}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        userName="Dir. Hub TECLINGO"
        userSub="Nivel Ejecutivo"
        userInitials="DH"
      />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-screen ${isSidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'} custom-scrollbar pt-20 lg:pt-0 transition-all duration-300`}>
        <div className="p-3 sm:p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full space-y-4 sm:space-y-8 md:space-y-12 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {isViewDisabled(currentView) ? (
                 <div className="p-12 text-center py-32 bg-black/45 rounded-[2.5rem] border border-white/5 space-y-6 max-w-2xl mx-auto flex flex-col items-center justify-center neo-glass shadow-[0_20px_50px_rgba(0,0,0,0.3)] select-none">
                    <div className="w-20 h-20 bg-red-400/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                       <Shield size={40} className="animate-pulse" />
                    </div>
                    <h2 className="text-xl font-black uppercase text-white tracking-tighter">Módulo Temporalmente Inactivo</h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase leading-relaxed tracking-wider max-w-sm">
                       La sección "{currentView.toUpperCase()}" ha sido deshabilitada a nivel de servidor mediante la consola de control de Feature Flags.
                    </p>
                    <button 
                      onClick={() => setCurrentView('dashboard')}
                      className="px-8 py-3.5 bg-[#DEFF9A] text-[#061a1a] hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_25px_rgba(222,255,154,0.3)]"
                    >
                       Regresar al Command Center
                    </button>
                 </div>
              ) : currentView === 'dashboard' ? (
                <div className="space-y-8 md:space-y-12">
                   <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                      <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">{institutionName} Command Center</h2>
                      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                         ESTADO <span className="text-[#DEFF9A]">OPERATIVO</span>
                      </h1>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {globalEvents.length > 0 && (
                          <div className="px-6 py-3 rounded-2xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center gap-4 hidden xl:flex">
                             <Calendar size={16} className="text-[#DEFF9A]" />
                             <div>
                                <p className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-widest leading-none">Próximo Evento</p>
                                <p className="text-white text-[10px] font-bold uppercase truncate max-w-[150px]">{globalEvents[0].title}</p>
                             </div>
                             <div className="ml-2 px-2 py-1 bg-[#DEFF9A] rounded text-[8px] font-black text-black">MAYO</div>
                          </div>
                        )}
                        <button 
                          onClick={() => setCurrentView('biblioteca')}
                          className="px-6 py-3 rounded-2xl bg-white/5 text-white border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all group"
                        >
                           <Zap size={16} className="text-[#DEFF9A] group-hover:rotate-12 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Biblioteca</span>
                        </button>

                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-pulse shadow-[0_0_10px_#DEFF9A]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sistemas IA Online</span>
                       </div>
                    </div>
</header>

                   {/* CARD: CÓDIGO INSTITUCIONAL — visible solo para DIRECTOR */}
                   {institutionCode && (
                     <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#DEFF9A]/10 via-[#DEFF9A]/5 to-transparent border border-[#DEFF9A]/30 relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#DEFF9A]/10 blur-[60px] rounded-full" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#DEFF9A]/15 flex items-center justify-center text-[#DEFF9A] shrink-0">
                              <Hash size={28} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[#DEFF9A] text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
                                 🔒 Código Institucional
                              </p>
                              <p className="text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3">
                                 Compártelo con tus alumnos y docentes para que se vinculen a tu institución
                              </p>
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                 <div className="flex-1 min-w-0 bg-black/40 border border-[#DEFF9A]/20 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-3 sm:px-5 overflow-hidden">
                                    <code className="text-[#DEFF9A] text-base sm:text-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] whitespace-nowrap select-all cursor-default block overflow-x-auto">
                                       {institutionCode}
                                    </code>
                                 </div>
                                 <button
                                    onClick={copyInstitutionCode}
                                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border transition-all font-black uppercase text-[10px] sm:text-xs tracking-widest whitespace-nowrap ${
                                       codeCopied
                                          ? 'bg-[#DEFF9A]/30 border-[#DEFF9A]/40 text-[#DEFF9A]'
                                          : 'bg-[#DEFF9A]/10 border-[#DEFF9A]/30 text-[#DEFF9A] hover:bg-[#DEFF9A]/20 hover:scale-105 cursor-pointer'
                                    }`}
                                    title="Copiar al portapapeles"
                                 >
                                    {codeCopied ? (
                                       <>
                                          <Check size={14} />
                                          <span className="hidden sm:inline">Copiado</span>
                                          <span className="sm:hidden">OK</span>
                                       </>
                                    ) : (
                                       <>
                                          <Copy size={14} />
                                          <span className="hidden sm:inline">Copiar</span>
                                          <span className="sm:hidden">📋</span>
                                       </>
                                    )}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {quickStats.map((stat, i) => (
                       <div key={i}>
                         <GlassCard className="!p-8">
                           <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                 <stat.icon size={24} />
                              </div>
                              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-red-500/10 text-red-400'}`}>
                                 {stat.trend}
                              </span>
                           </div>
                           <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                           <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                        </GlassCard>
                       </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-8">
                        <OperationalCommand />
                     </div>
                     <div className="lg:col-span-4">
                        <InnovationAlerts />
                     </div>
                  </div>
                </div>
              ) : currentView === 'bi' ? (
                <AcademicBI />
              ) : currentView === 'biblioteca' ? (
                <DirectorLibrary />
              ) : currentView === 'libro-maestro' ? (
                <LibroVirtualDirectorCompleto />
              ) : currentView === 'catalog' ? (
                <AcademicCatalog />
              ) : currentView === 'teachers' ? (
                <TeachersMaster />
              ) : currentView === 'groups' ? (
                <GroupManager 
                  onOpenScheduler={(id) => {
                    setSelectedGroupId(id);
                  }} 
                />
              ) : currentView === 'grupos-ingles' ? (
                <GruposInglesDirector />
              ) : currentView === 'operations' ? (
                <OperationalCommand />
              ) : currentView === 'users' ? (
                <UsersMaster />
              ) : currentView === 'audit' ? (
                <AcademicAudit />
              ) : currentView === 'folios' ? (
                <div className="space-y-12">
                   <header>
                      <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3">Módulo de Documentación</h2>
                      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                         GESTIÓN DE <span className="text-[#DEFF9A]">FOLIOS</span>
                      </h1>
                   </header>
                   <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                      <div className="xl:col-span-12">
                         <FolioMonitor />
                      </div>
                      <div className="xl:col-span-12">
                         <FolioConstructor />
                      </div>
                   </div>
                </div>
              ) : currentView === 'alerts' ? (
                <InnovationAlerts />
              ) : currentView === 'mensajes' ? (
                <MessagingModule initialChatId={targetChatId || undefined} />
              ) : currentView === 'control-accesos' ? (
                <AccessControlModule />
              ) : currentView === 'real-time' ? (
                <RealTimeMonitorPanel />
              ) : currentView === 'settings' ? (
                <UserSettings role="DIRECTOR" />
              ) : (
                 <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Shield size={64} className="mb-4" />
                    <h2 className="text-2xl font-black uppercase">Module Encrypted</h2>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <QuickChat onNavigateToFullChat={handleNavigateToFullChat} />
      </main>

      {/* Modal de Onboarding — Perfil incompleto */}
      <ProfileOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onCompleteProfile={() => {
          setShowOnboardingModal(false);
          setCurrentView('settings');
        }}
        role="DIRECTOR"
        profileData={directorProfileData}
      />
    </div>
  );
}
