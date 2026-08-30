/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Zap,
  Globe,
  Camera,
  Signature,
  Award,
  FileText,
  Calendar,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  AlertTriangle,
  Fingerprint,
  QrCode,
  Download,
  Share2,
  Paperclip,
  CheckCircle2,
  Trash2,
  Plus,
  Monitor,
  X,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { GlassCard } from './GlassCard';
import { useAppContext, UserRole } from '../context/AppContext';
import { ModuleManagement } from './ModuleManagement';
import { guardarPerfil, obtenerPerfilCompleto, uploadAvatar } from '../services/identityService';

export function UserSettings({ 
  role, 
  onContactTeacher 
}: { 
  role?: UserRole; 
  onContactTeacher?: (teacherId: string, greeting: string) => void;
}) {
  const { 
    institutionName, 
    setInstitutionName, 
    institutionLogo, 
    setInstitutionLogo,
    maintenanceMode,
    setMaintenanceMode,
    identityEnabled,
    currentRole: contextRole,
    userEmail
  } = useAppContext();
  
  const effectiveRole = role || contextRole;
  
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'PERSONAL' | 'PROFESSIONAL' | 'SECURITY' | 'DIGITAL_CARD' | 'MODULES'>(effectiveRole === 'ALUMNO' ? 'PERSONAL' : 'PERSONAL');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Side panel colapsable para los botones de Guardar/Descartar
  const [isSavePanelCollapsed, setIsSavePanelCollapsed] = useState(false);
  // Modal de advertencia cuando se intenta cambiar de tab/página con cambios sin guardar
  const [pendingTab, setPendingTab] = useState<typeof activeTab | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // States for Advisor booking and Toast status
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Cargar perfil desde el Data Lake al montar
  const cargarPerfilDesdeLake = async () => {
    if (!userEmail) return;
    try {
    // Enviamos `rol` para que el backend consulte la hoja específica
    // (ALUMNOS / DOCENTES / DIRECTORES) además de USUARIOS.
    const perfil = await obtenerPerfilCompleto({ email: userEmail, rol: effectiveRole as 'ALUMNO' | 'DOCENTE' | 'DIRECTOR' });
    if (!perfil) return;
    // Email siempre viene del lake (autoridad única).
    const lakeEmail = (perfil.email as string) || userEmail;
    if (effectiveRole === 'ALUMNO') {
      // NOTA: perfil.id viene de USUARIOS.id (PK). perfil.user_id viene de ALUMNOS.user_id (FK).
      // Ambos son el mismo valor ('usr_xxx'), pero usamos perfil.id como fuente canónica.
      setStudentData(prev => ({
        ...prev,
        email: lakeEmail,
        userId: (perfil.id as string) ?? prev.userId,    // usr_xxx — ID del sistema (fuente: USUARIOS.id)
        name: (perfil.nombre as string) ?? prev.name,
        avatar: (perfil.avatar as string) ?? prev.avatar,
        phone: (perfil.phone as string) ?? prev.phone,
        bio: (perfil.bio as string) ?? prev.bio,
        curp: (perfil.curp as string) ?? prev.curp,
        studentId: (perfil.student_id as string) ?? prev.studentId,
        birthDate: (perfil.birth_date as string) ?? prev.birthDate,
        studentNumber: (perfil.numero_control as string) ?? prev.studentNumber,
        career: (perfil.carrera as string) ?? prev.career,
        shift: (perfil.turno as string) ?? prev.shift,
        level: (perfil.nivel as string) ?? prev.level,
        semestre: (perfil.semestre as string) ?? prev.semestre,
        moduloTec: (perfil.modulo_tec as string) ?? prev.moduloTec,
      }));
    } else if (effectiveRole === 'DOCENTE') {
      setTeacherData(prev => ({
        ...prev,
        email: lakeEmail,
        name: (perfil.nombre as string) ?? prev.name,
        avatar: (perfil.avatar as string) ?? prev.avatar,
        phone: (perfil.phone as string) ?? prev.phone,
        bio: (perfil.bio as string) ?? prev.bio,
        curp: (perfil.curp as string) ?? prev.curp,
        employeeId: (perfil.student_id as string) ?? prev.employeeId,
        birthDate: (perfil.birth_date as string) ?? prev.birthDate,
        degree: (perfil.degree as string) ?? prev.degree,
        specialties: (() => { try { const v = perfil.specialties; if (Array.isArray(v)) return v; if (typeof v === 'string' && v) return JSON.parse(v); return prev.specialties; } catch { return prev.specialties; } })(),
        certifications: (() => { try { const v = perfil.certifications; if (Array.isArray(v)) return v; if (typeof v === 'string' && v) return JSON.parse(v); return prev.certifications; } catch { return prev.certifications; } })(),
      }));
    } else if (effectiveRole === 'DIRECTOR') {
      setDirData(prev => ({
        ...prev,
        email: lakeEmail,
        name: (perfil.nombre as string) ?? prev.name,
        avatar: (perfil.avatar as string) ?? prev.avatar,
        phone: (perfil.phone as string) ?? prev.phone,
        bio: (perfil.bio as string) ?? prev.bio,
        curp: (perfil.curp as string) ?? prev.curp,
        birthDate: (perfil.birth_date as string) ?? prev.birthDate,
      }));
      setInstData(prev => ({
        ...prev,
        name: (perfil.institution_name as string) ?? prev.name,
        slogan: (perfil.slogan as string) ?? prev.slogan,
        phone: (perfil.inst_phone as string) ?? prev.phone,
        address: (perfil.address as string) ?? prev.address,
        email: (perfil.inst_email as string) ?? prev.email,
        facebook: (perfil.facebook as string) ?? prev.facebook,
        instagram: (perfil.instagram as string) ?? prev.instagram,
        linkedin: (perfil.linkedin as string) ?? prev.linkedin,
      }));
      if (perfil.institution_logo) setInstitutionLogo(perfil.institution_logo as string);
    }
    } catch (err) {
      console.warn('[UserSettings] Error loading profile from Lake:', err);
    }
  };

  useEffect(() => {
    cargarPerfilDesdeLake();
  }, [userEmail, effectiveRole]);

  // Aviso al cerrar la pestaña / recargar con cambios sin guardar
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Interceptar cambios de tab cuando hay cambios sin guardar
  const requestTabChange = (newTab: typeof activeTab) => {
    if (isDirty && newTab !== activeTab) {
      setPendingTab(newTab);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleSaveAndSwitch = async () => {
    await handleSave();
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setShowUnsavedModal(false);
  };

  const handleDiscardAndSwitch = async () => {
    await handleDiscard();
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setShowUnsavedModal(false);
  };
  
  // Docente Data — vacío por defecto; se hidrata desde el Data Lake.
  const [teacherData, setTeacherData] = useState({
    name: '',
    degree: '',
    specialties: [] as string[],
    bio: '',
    avatar: '',
    email: '',
    employeeId: '',
    curp: '',
    phone: '',
    birthDate: '',
    certifications: [] as { id: string; name: string; date: string }[]
  });

  // Student Data — vacío por defecto; se hidrata desde el Data Lake.
  const [studentData, setStudentData] = useState({
    name: '',
    level: '',
    bio: '',
    avatar: '',
    email: '',
    userId: '',        // usr_xxx — ID generado por la APP (solo lectura)
    studentId: '',     // ID institucional que la escuela asigna (ej: INGIND-002)
    curp: '',
    phone: '',
    birthDate: '',
    studentNumber: '', // Número de control (ej: INGIND-001)
    career: '',
    shift: '',
    semestre: '',
    moduloTec: ''
  });

  const [dirData, setDirData] = useState({
    name: '',
    curp: '',
    phone: '',
    birthDate: '',
    bio: '',
    email: '',
    avatar: ''
  });

  // Catálogo de opciones — fuente única de verdad.
  // Coincide EXACTAMENTE con los menús desplegables de la hoja ALUMNOS
  // en el Data Lake (valores en MAYÚSCULAS, sin acentos).
  // Cualquier valor fuera de estos catálogos es rechazado por el backend.
  const CARRERAS = [
    'ING INDUSTRIAL',
    'ING SISTEMAS',
    'ING CIVIL',
    'ING MECATRONICA',
    'LIC. ADMINISTRACION',
    'CONTADURIA',
    'ARQUITECTURA',
  ];
  const TURNOS = ['MATUTINO', 'VESPERTINO', 'SEMI-ESCOLARIZADO'];
  const SEMESTRES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  // Mapeo canónico modulo_tec -> nivel_ingles. El backend sincroniza
  // USUARIOS.nivel automáticamente desde modulo_tec.
  const MODULOS_TEC: { value: string; nivel: string; label: string }[] = [
    { value: 'I',   nivel: 'A1',  label: 'I (A1)' },
    { value: 'II',  nivel: 'A1+', label: 'II (A1+)' },
    { value: 'III', nivel: 'A2',  label: 'III (A2)' },
    { value: 'IV',  nivel: 'A2+', label: 'IV (A2+)' },
    { value: 'V',   nivel: 'B1',  label: 'V (B1)' },
    { value: 'VI',  nivel: 'B2',  label: 'VI (B2)' },
  ];
  // nivel_ingles se deriva de modulo_tec en el backend; no se expone al usuario.

  const getProfileData = () => {
    // Email es identidad y SIEMPRE viene del Lake (no del estado local hardcoded).
    const emailReal = userEmail || (
      effectiveRole === 'ALUMNO' ? studentData.email :
      effectiveRole === 'DIRECTOR' ? dirData.email :
      teacherData.email
    );
    if (effectiveRole === 'ALUMNO') {
      return {
        name: studentData.name,
        email: emailReal,
        userId: studentData.userId,       // usr_xxx — solo lectura
        curp: studentData.curp,
        phone: studentData.phone,
        avatar: studentData.avatar,
        bio: studentData.bio,
        birthDate: studentData.birthDate,
        studentId: studentData.studentId, // ID institucional (ej: INGIND-002)
        studentNumber: studentData.studentNumber, // Número de control
        career: studentData.career,
        shift: studentData.shift,
        level: studentData.level,
        semestre: studentData.semestre,
        moduloTec: studentData.moduloTec,
        setName: (name: string) => setStudentData(prev => ({ ...prev, name })),
        setPhone: (phone: string) => setStudentData(prev => ({ ...prev, phone })),
        setBio: (bio: string) => setStudentData(prev => ({ ...prev, bio })),
        setAvatar: (avatar: string) => setStudentData(prev => ({ ...prev, avatar })),
        setCurp: (curp: string) => setStudentData(prev => ({ ...prev, curp })),
        setBirthDate: (d: string) => setStudentData(prev => ({ ...prev, birthDate: d })),
        setStudentId: (id: string) => setStudentData(prev => ({ ...prev, studentId: id })),
        setStudentNumber: (n: string) => setStudentData(prev => ({ ...prev, studentNumber: n })),
        setCareer: (c: string) => setStudentData(prev => ({ ...prev, career: c })),
        setShift: (s: string) => setStudentData(prev => ({ ...prev, shift: s })),
        setLevel: (l: string) => setStudentData(prev => ({ ...prev, level: l })),
        setSemestre: (v: string) => setStudentData(prev => ({ ...prev, semestre: v })),
        setModuloTec: (v: string) => setStudentData(prev => ({ ...prev, moduloTec: v })),
      };
    } else if (effectiveRole === 'DIRECTOR') {
      return {
        name: dirData.name,
        email: emailReal,
        curp: dirData.curp,
        phone: dirData.phone,
        avatar: dirData.avatar,
        bio: dirData.bio,
        birthDate: dirData.birthDate,
        setName: (name: string) => setDirData(prev => ({ ...prev, name })),
        setPhone: (phone: string) => setDirData(prev => ({ ...prev, phone })),
        setBio: (bio: string) => setDirData(prev => ({ ...prev, bio })),
        setAvatar: (avatar: string) => setDirData(prev => ({ ...prev, avatar })),
        setCurp: (curp: string) => setDirData(prev => ({ ...prev, curp })),
        setBirthDate: (d: string) => setDirData(prev => ({ ...prev, birthDate: d })),
      };
    } else {
      return {
        name: teacherData.name,
        email: emailReal,
        curp: teacherData.curp,
        phone: teacherData.phone,
        avatar: teacherData.avatar,
        bio: teacherData.bio,
        birthDate: teacherData.birthDate,
        degree: teacherData.degree,
        specialties: teacherData.specialties,
        employeeId: teacherData.employeeId,
        setName: (name: string) => setTeacherData(prev => ({ ...prev, name })),
        setPhone: (phone: string) => setTeacherData(prev => ({ ...prev, phone })),
        setBio: (bio: string) => setTeacherData(prev => ({ ...prev, bio })),
        setAvatar: (avatar: string) => setTeacherData(prev => ({ ...prev, avatar })),
        setCurp: (curp: string) => setTeacherData(prev => ({ ...prev, curp })),
        setBirthDate: (d: string) => setTeacherData(prev => ({ ...prev, birthDate: d })),
        setDegree: (deg: string) => setTeacherData(prev => ({ ...prev, degree: deg })),
      };
    }
  };

  const profile = getProfileData();

  const [instData, setInstData] = useState({
    name: institutionName,
    slogan: 'Liderando el futuro con Inteligencia Artificial',
    phone: '+52 833 456 7890',
    address: 'Pánuco Hub / Dallas HQ',
    email: 'contacto@teclingo.ai',
    facebook: 'facebook.com/teclingo',
    instagram: 'instagram.com/teclingoaiedu',
    linkedin: 'linkedin.com/company/teclingo'
  });

  const handleSave = async () => {
    if (!userEmail || isSaving) return;
    setIsSaving(true);
    let campos: Record<string, string> = {};
    if (effectiveRole === 'ALUMNO') {
      campos = {
        nombre: studentData.name, avatar: studentData.avatar,
        phone: studentData.phone, bio: studentData.bio,
        curp: studentData.curp, student_id: studentData.studentId,
        birth_date: studentData.birthDate,
        // nivel se sincroniza automáticamente desde modulo_tec en el backend.
        numero_control: studentData.studentNumber,
        carrera: studentData.career, turno: studentData.shift,
        semestre: studentData.semestre,
        modulo_tec: studentData.moduloTec,
        // nivel_ingles lo calcula y persiste el backend a partir de modulo_tec.
      };
    } else if (effectiveRole === 'DOCENTE') {
      campos = {
        nombre: teacherData.name, avatar: teacherData.avatar,
        phone: teacherData.phone, bio: teacherData.bio,
        curp: teacherData.curp, student_id: teacherData.employeeId,
        birth_date: teacherData.birthDate, degree: teacherData.degree,
        specialties: JSON.stringify(teacherData.specialties),
        certifications: JSON.stringify(teacherData.certifications),
      };
    } else if (effectiveRole === 'DIRECTOR') {
      campos = {
        nombre: dirData.name, avatar: dirData.avatar,
        phone: dirData.phone, bio: dirData.bio,
        curp: dirData.curp, birth_date: dirData.birthDate,
        institution_name: instData.name, institution_logo: institutionLogo,
        slogan: instData.slogan, inst_phone: instData.phone,
        address: instData.address, inst_email: instData.email,
        facebook: instData.facebook, instagram: instData.instagram,
        linkedin: instData.linkedin,
      };
      setInstitutionName(instData.name);
    }
    try {
      const res = await guardarPerfil({ email: userEmail, rol: effectiveRole as 'ALUMNO' | 'DOCENTE' | 'DIRECTOR', campos });
      if (res.ok) {
        const hoja = res.hoja ? ` en ${res.hoja}` : '';
        setToastMessage(`Perfil guardado${hoja}`);
        setShowToast(true);
        setIsDirty(false);
        // Re-leer el perfil desde el Lake para que la UI refleje EXACTAMENTE
        // lo persistido (autoridad única = el Data Lake, no el estado local).
        await cargarPerfilDesdeLake();
      } else {
        setToastMessage('Error al guardar: ' + (res.error || 'desconocido'));
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage('Error de conexion al guardar perfil');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    if (isSaving) return;
    try {
    // Descartar = volver al estado que dicta el Lake (descarta cambios locales)
    await cargarPerfilDesdeLake();
    setIsDirty(false);
    setToastMessage('Cambios descartados');
    setShowToast(true);
    } catch (err) {
      setToastMessage('Error al descartar cambios');
      setShowToast(true);
    }
  };

  // Handle avatar file selection and upload to Google Drive
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userEmail) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setToastMessage('Solo se permiten archivos de imagen');
      setShowToast(true);
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage('La imagen no debe exceder 5MB');
      setShowToast(true);
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Leer como base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await uploadAvatar(userEmail, base64, file.name, file.type);
      if (result.ok && result.fileUrl) {
        // Actualizar el estado local del avatar
        if (effectiveRole === 'ALUMNO') {
          setStudentData(prev => ({ ...prev, avatar: result.fileUrl! }));
        } else if (effectiveRole === 'DOCENTE') {
          setTeacherData(prev => ({ ...prev, avatar: result.fileUrl! }));
        } else {
          setDirData(prev => ({ ...prev, avatar: result.fileUrl! }));
        }
        setIsDirty(true);
        setToastMessage('Avatar subido a Google Drive');
        setShowToast(true);
      } else {
        setToastMessage('Error al subir: ' + (result.error || 'desconocido'));
        setShowToast(true);
      }
    } catch (err) {
      console.error('[Avatar Upload]', err);
      setToastMessage('Error de conexión al subir avatar');
      setShowToast(true);
    } finally {
      setIsUploadingAvatar(false);
      // Limpiar el input para permitir re-seleccionar el mismo archivo
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
    }
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => requestTabChange(id)}
      className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 snap-center ${
        activeTab === id ? 'bg-[#38BDF8] text-white shadow-[0_0_20px_#38BDF840]' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </button>
  );

  const DigitalCard = () => (
    <div className="relative group w-full max-w-[340px] sm:max-w-sm mx-auto">
      <motion.div 
        layoutId="digital-card"
        className="aspect-[1.58/1] w-full neo-glass rounded-3xl sm:rounded-[2.5rem] border-white/20 p-4 sm:p-8 flex flex-col justify-between overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      >
        {/* Chips & Textures */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#38BDF8]/10 blur-[40px] sm:blur-[50px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-[#DEFF9A]/5 blur-[30px] sm:blur-[40px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex justify-between items-start relative z-10 gap-2">
          <div className="flex gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-black/40 border border-white/20 overflow-hidden shrink-0">
               <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <div className="min-w-0 flex-1">
               <h3 className="text-white text-[11px] sm:text-lg font-black tracking-tight leading-none uppercase italic truncate" title={profile.name}>{profile.name}</h3>
               <p className="text-[#38BDF8] text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest mt-1 truncate">{effectiveRole === 'ALUMNO' ? 'Alumno Inmersivo A1' : effectiveRole === 'DIRECTOR' ? 'Director Académico' : teacherData.degree}</p>
               <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                  {(effectiveRole === 'ALUMNO' ? ['Pioneers G1', 'Active Learner'] : effectiveRole === 'DIRECTOR' ? ['Plataforma', 'Gestión'] : teacherData.specialties.slice(0, 2)).map(s => (
                    <span key={s} className="text-[6px] sm:text-[7px] font-black text-white/40 border border-white/10 px-1 sm:px-1.5 py-0.5 rounded bg-white/5 uppercase truncate max-w-[70px]">{s}</span>
                  ))}
               </div>
            </div>
          </div>
          <div className="text-right shrink-0">
             <img src={institutionLogo} className="w-6 h-6 sm:w-8 sm:h-8 ml-auto mb-1 opacity-60" alt="Logo" />
             <p className="text-white/20 text-[6px] sm:text-[8px] font-black uppercase tracking-widest">ID: {effectiveRole === 'ALUMNO' ? (studentData.userId || ' usr_xxx') : effectiveRole === 'DIRECTOR' ? 'DIR-2026-001' : teacherData.employeeId}</p>
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10 mt-2">
          <div className="space-y-0.5">
             <p className="text-white/30 text-[6px] sm:text-[8px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Institutional Verification</p>
             <div className="flex items-center gap-1 sm:gap-2">
                <ShieldCheck size={10} className={`${effectiveRole === 'ALUMNO' ? "text-[#22D3EE]" : "text-[#4ADE80]"} sm:size-[14px] shrink-0`} />
                <span className="text-white text-[7px] sm:text-[10px] font-mono tracking-tighter uppercase whitespace-nowrap">{effectiveRole === 'ALUMNO' ? 'VERIFIED STUDENT' : effectiveRole === 'DIRECTOR' ? 'VERIFIED DIRECTOR' : 'VERIFIED DOCENTE ELITE'}</span>
             </div>
          </div>
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-2xl shrink-0 flex items-center justify-center">
             <QRCodeSVG value={profile.userId || userEmail || 'unknown'} size={56} bgColor="white" fgColor="#061a1a" level="M" />
          </div>
        </div>
      </motion.div>
      
      {/* Decorative background shadow */}
      <div className="absolute -inset-4 bg-[#38BDF8]/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-11 pb-16 lg:pb-32 px-1 sm:px-0">
       {/* Sidebar de Navegación Settings */}
       <div className="col-span-12 lg:col-span-3 space-y-4">
          <header className="mb-4 sm:mb-8">
             <h2 className="text-[#38BDF8] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-1 sm:mb-2">Academic Profile</h2>
             <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Configuración</h1>
          </header>
          
          <div className="flex flex-col gap-2">
             {effectiveRole === 'DIRECTOR' && identityEnabled && <TabButton id="IDENTITY" label="Identidad Institucional" icon={Globe} />}
             {effectiveRole === 'DIRECTOR' && <TabButton id="MODULES" label="Gestión de Módulos" icon={Sliders} />}
             <TabButton id="DIGITAL_CARD" label="Digital Card Preview" icon={ShieldCheck} />
             <TabButton id="PERSONAL" label="Identidad & Datos" icon={User} />
             {effectiveRole !== 'ALUMNO' && <TabButton id="PROFESSIONAL" label="Trayectoria & CV" icon={Award} />}
             <TabButton id="SECURITY" label="Seguridad & Acceso" icon={Fingerprint} />
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-black/40 border border-white/10 group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-3 mb-4">
                <Award className="text-[#38BDF8]" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Estatus Académico</span>
             </div>
             <p className="text-[20px] font-black text-white mb-1 uppercase tracking-tighter italic">
               {effectiveRole === 'ALUMNO' ? 'ALUMNO INMERSIVO' : 'DOCENTE ELITE'}
             </p>
             <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
               {effectiveRole === 'ALUMNO' 
                 ? 'Nivel A1 validado por TECLINGO AI Dallas Campus.' 
                 : 'Nivel de autoridad académica validado por la institución.'}
             </p>
          </div>
       </div>

       {/* Área de Edición */}
       <div className="col-span-12 lg:col-span-9 space-y-8">
           <AnimatePresence mode="wait">
              {activeTab === 'IDENTITY' && (
                <motion.div 
                  key="identity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <GlassCard title="Identidad Institucional" icon={Globe} accent="cyan">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Logo */}
                         <div className="md:col-span-2 flex items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                            <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                               <img src={institutionLogo} className="w-full h-full object-contain p-2" alt="Logo Institucional" />
                            </div>
                            <div className="flex-1">
                               <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Logo Institucional</h4>
                               <p className="text-[9px] text-white/30 font-bold mb-4 uppercase tracking-widest">Aparece en tu Digital Card y QR code (SVG/PNG, max 2MB)</p>
                               <button 
                                 onClick={() => {
                                   const input = document.createElement('input');
                                   input.type = 'file';
                                   input.accept = 'image/*';
                                   input.onchange = async (e) => {
                                     const file = (e.target as HTMLInputElement).files?.[0];
                                     if (!file || !userEmail) return;
                                     if (file.size > 2 * 1024 * 1024) {
                                       setToastMessage('El logo no debe exceder 2MB');
                                       setShowToast(true);
                                       return;
                                     }
                                     const base64 = await new Promise<string>((resolve, reject) => {
                                       const reader = new FileReader();
                                       reader.onload = () => resolve(reader.result as string);
                                       reader.onerror = reject;
                                       reader.readAsDataURL(file);
                                     });
                                     const result = await uploadAvatar(userEmail, base64, file.name, file.type);
                                     if (result.ok && result.fileUrl) {
                                       setInstitutionLogo(result.fileUrl);
                                       setIsDirty(true);
                                       setToastMessage('Logo subido correctamente');
                                       setShowToast(true);
                                     } else {
                                       setToastMessage('Error al subir logo: ' + (result.error || 'desconocido'));
                                       setShowToast(true);
                                     }
                                   };
                                   input.click();
                                 }}
                                 className="px-4 py-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-all font-bold"
                               >
                                 Subir Logo
                               </button>
                            </div>
                         </div>

                         {/* Nombre de la institución */}
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre de la Institución</label>
                            <input 
                             type="text" 
                             value={instData.name} 
                             onChange={(e) => { setInstData({...instData, name: e.target.value}); setIsDirty(true); }}
                             placeholder="Ej: TECNOLINGO AI"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all uppercase"
                            />
                         </div>

                         {/* Slogan */}
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Slogan Institucional</label>
                            <input 
                             type="text" 
                             value={instData.slogan} 
                             onChange={(e) => { setInstData({...instData, slogan: e.target.value}); setIsDirty(true); }}
                             placeholder="Tu lema o frase motivacional"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all italic"
                            />
                         </div>

                         {/* Teléfono institucional */}
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Teléfono Institucional</label>
                            <input 
                             type="text" 
                             value={instData.phone} 
                             onChange={(e) => { setInstData({...instData, phone: e.target.value}); setIsDirty(true); }}
                             placeholder="+52 800 000 0000"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                            />
                         </div>

                         {/* Email institucional */}
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Email Institucional</label>
                            <input 
                             type="email" 
                             value={instData.email} 
                             onChange={(e) => { setInstData({...instData, email: e.target.value}); setIsDirty(true); }}
                             placeholder="contacto@institucion.edu"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                            />
                         </div>

                         {/* Dirección */}
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Dirección</label>
                            <input 
                             type="text" 
                             value={instData.address} 
                             onChange={(e) => { setInstData({...instData, address: e.target.value}); setIsDirty(true); }}
                             placeholder="Calle, Número, Colonia, Ciudad, Estado"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all"
                            />
                         </div>

                         {/* Redes sociales */}
                         <div className="md:col-span-2 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">Redes Sociales</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                                     <Facebook size={10} /> Facebook
                                  </label>
                                  <input 
                                   type="text" 
                                   value={instData.facebook} 
                                   onChange={(e) => { setInstData({...instData, facebook: e.target.value}); setIsDirty(true); }}
                                   placeholder="facebook.com/tuinstitucion"
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                                     <Instagram size={10} /> Instagram
                                  </label>
                                  <input 
                                   type="text" 
                                   value={instData.instagram} 
                                   onChange={(e) => { setInstData({...instData, instagram: e.target.value}); setIsDirty(true); }}
                                   placeholder="instagram.com/tuinstitucion"
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                                     <Linkedin size={10} /> LinkedIn
                                  </label>
                                  <input 
                                   type="text" 
                                   value={instData.linkedin} 
                                   onChange={(e) => { setInstData({...instData, linkedin: e.target.value}); setIsDirty(true); }}
                                   placeholder="linkedin.com/company/tuinstitucion"
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all"
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </GlassCard>
                </motion.div>
              )}

              {activeTab === 'DIGITAL_CARD' && (
                <motion.div 
                  key="card-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                   <GlassCard title="Credential Preview" icon={ShieldCheck} accent="cyan">
                      <div className="flex flex-col items-center gap-12 py-12">
                         <DigitalCard />
                         <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                               <Download size={14} /> Descargar PDF
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-[#38BDF8] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(56,189,248,0.4)] hover:scale-105 transition-all">
                               <Share2 size={14} /> Compartir con Alumnos
                            </button>
                         </div>
                         <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest text-center max-w-sm italic">
                            Esta tarjeta sirve como tu identificación oficial ante alumnos de nuevo ingreso y pares académicos.
                         </p>
                      </div>
                   </GlassCard>
                </motion.div>
             )}

             {activeTab === 'PERSONAL' && (
               <motion.div 
                 key="personal"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Identidad del Profesional" icon={User} accent="cyan">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Avatar Upload */}
                         <div className="md:col-span-2 flex items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                            <input
                              ref={avatarFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                            <div 
                              className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative group overflow-hidden cursor-pointer"
                              onClick={() => avatarFileInputRef.current?.click()}
                            >
                               {isUploadingAvatar ? (
                                  <div className="w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
                               ) : (
                                  <>
                                    <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                       <Camera size={20} className="text-white" />
                                    </div>
                                  </>
                               )}
                            </div>
                            <div className="flex-1">
                               <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Avatar Profesional</h4>
                               <p className="text-[9px] text-white/30 font-bold mb-4 uppercase tracking-widest">Se sincroniza con la Digital Card y Chats (Máx. 5MB)</p>
                               <button 
                                 onClick={() => avatarFileInputRef.current?.click()}
                                 disabled={isUploadingAvatar}
                                 className="px-4 py-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 {isUploadingAvatar ? 'Subiendo...' : 'Subir Nueva Foto'}
                               </button>
                            </div>
                         </div>
 
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre Completo</label>
                           <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => { profile.setName(e.target.value); setIsDirty(true); }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all italic"
                           />
                        </div>
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                               Email de Cuenta <Lock size={10} />
                            </label>
                            <input
                             type="text"
                             value={profile.email || ''}
                             readOnly
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/60 text-xs font-bold outline-none cursor-not-allowed"
                            />
                            <p className="text-white/15 text-[7px] ml-1">Identidad del QR. No se puede modificar.</p>
                         </div>
                         <div className="space-y-2 relative">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">
                               CURP
                            </label>
                            <input
                             type="text"
                             value={profile.curp || ''}
                             onChange={(e) => { profile.setCurp?.(e.target.value.toUpperCase().slice(0, 18)); setIsDirty(true); }}
                             placeholder="CLAVE ÚNICA DE 18 CARACTERES"
                             maxLength={18}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono uppercase"
                            />
                            <p className="text-white/15 text-[7px] ml-1">Tu Clave Única de Registro de Población.</p>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                            <input 
                             type="date" 
                             value={profile.birthDate || ''} 
                             onChange={(e) => { profile.setBirthDate?.(e.target.value); setIsDirty(true); }}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                            />
                         </div>
                         {effectiveRole === 'ALUMNO' && (
                           <>
                              {/* ID Usuario — solo lectura, generado por la APP */}
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">ID Usuario (solo lectura)</label>
                                 <input 
                                  type="text" 
                                  value={profile.userId || ''} 
                                  readOnly
                                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-white/40 text-xs font-bold outline-none cursor-not-allowed font-mono"
                                 />
                                 <p className="text-[8px] text-white/15 ml-1">ID único generado por la app. Aparece en tu QR code.</p>
                              </div>
                              {/* Número de Control — ID que la institución asigna */}
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Número de Control</label>
                                 <input 
                                  type="text" 
                                  value={profile.studentId || ''} 
                                  onChange={(e) => { profile.setStudentId?.(e.target.value); setIsDirty(true); }}
                                  placeholder="Ej: INGIND-001"
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                                 />
                                 <p className="text-[8px] text-white/15 ml-1">ID que la institución te asignó al inscribirte.</p>
                              </div>
                              {/* Matrícula / Student ID */}
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Matrícula</label>
                                 <input 
                                  type="text" 
                                  value={profile.studentNumber || ''} 
                                  onChange={(e) => { profile.setStudentNumber?.(e.target.value); setIsDirty(true); }}
                                  placeholder="Ej: 2024001234"
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                                 />
                                 <p className="text-[8px] text-white/15 ml-1">Número de control o matrícula institucional.</p>
                              </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Carrera</label>
                                <select
                                 value={profile.career || ''}
                                 onChange={(e) => { profile.setCareer?.(e.target.value); setIsDirty(true); }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all appearance-none cursor-pointer"
                                >
                                 <option value="" className="bg-[#0b0f19]">Selecciona carrera…</option>
                                 {CARRERAS.map(c => (
                                   <option key={c} value={c} className="bg-[#0b0f19]">{c}</option>
                                 ))}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Turno</label>
                                <select
                                 value={profile.shift || ''}
                                 onChange={(e) => { profile.setShift?.(e.target.value); setIsDirty(true); }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all appearance-none cursor-pointer"
                                >
                                 <option value="" className="bg-[#0b0f19]">Selecciona turno…</option>
                                 {TURNOS.map(t => (
                                   <option key={t} value={t} className="bg-[#0b0f19]">{t}</option>
                                 ))}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Semestre</label>
                                <select
                                 value={profile.semestre || ''}
                                 onChange={(e) => { profile.setSemestre?.(e.target.value); setIsDirty(true); }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all appearance-none cursor-pointer"
                                >
                                 <option value="" className="bg-[#0b0f19]">Selecciona semestre…</option>
                                 {SEMESTRES.map(s => (
                                   <option key={s} value={s} className="bg-[#0b0f19]">Semestre {s}</option>
                                 ))}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Módulo TEC</label>
                                <select
                                 value={profile.moduloTec || ''}
                                 onChange={(e) => {
                                   profile.setModuloTec?.(e.target.value);
                                   // nivel_ingles y USUARIOS.nivel los sincroniza el backend
                                   // a partir de modulo_tec (ver CONFIG.MODULO_A_NIVEL en Code.gs).
                                   setIsDirty(true);
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all appearance-none cursor-pointer"
                                >
                                 <option value="" className="bg-[#0b0f19]">Selecciona módulo…</option>
                                 {MODULOS_TEC.map(m => (
                                   <option key={m.value} value={m.value} className="bg-[#0b0f19]">{m.label}</option>
                                 ))}
                                </select>
                             </div>
                            </>
                          )}
                         {effectiveRole === 'DOCENTE' && (
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Grado Académico</label>
                              <input 
                               type="text" 
                               value={profile.degree || ''} 
                               onChange={(e) => { profile.setDegree?.(e.target.value); setIsDirty(true); }}
                               placeholder="Mtro. / Dr. / Mtra. en..."
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#DEFF9A] text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all uppercase"
                              />
                           </div>
                         )}
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Teléfono Personal</label>
                            <input 
                             type="text" 
                             value={profile.phone || ''} 
                             onChange={(e) => { profile.setPhone(e.target.value); setIsDirty(true); }}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-[#38BDF8]/40 transition-all font-mono"
                            />
                         </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Abstract Académico / Bio</label>
                           <textarea 
                            value={profile.bio} 
                            onChange={(e) => { 
                              profile.setBio(e.target.value); 
                              setIsDirty(true); 
                            }}
                            rows={3}
                            placeholder="Resume tu carrera académica..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/60 text-xs font-medium outline-none focus:border-[#38BDF8]/40 transition-all resize-none italic"
                           />
                        </div>

                        {effectiveRole === 'ALUMNO' && (
                          <div className="md:col-span-2 mt-8 p-8 rounded-[3rem] bg-gradient-to-br from-[#DEFF9A]/10 to-transparent border border-[#DEFF9A]/20">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                   <h4 className="text-[14px] font-black text-white uppercase tracking-tight italic">Docente Asignado</h4>
                                   <p className="text-[9px] text-[#DEFF9A] font-black uppercase tracking-[0.2em] mt-1">Líder de Red de Apoyo</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#DEFF9A] rounded-xl text-[#061a1a] text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_#DEFF9A40]">
                                   <Award size={14} /> DOCENTE ELITE
                                </div>
                             </div>
                             
                             <div className="flex flex-col sm:flex-row items-center gap-8 bg-black/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden shrink-0">
                                   <img src={teacherData.avatar} className="w-full h-full object-cover" alt="Teacher" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                   <h5 className="text-white text-xl font-black uppercase tracking-tighter mb-1">{teacherData.name}</h5>
                                   <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                                      <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">ID: {teacherData.employeeId}</span>
                                      <span className="text-white/10">•</span>
                                      <span className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">{teacherData.degree}</span>
                                   </div>
                                </div>
                                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                                   <div className="flex gap-1">
                                      {[1,2,3,4,5].map(i => (
                                        <Zap key={i} size={14} fill={i <= 5 ? "#DEFF9A" : "transparent"} className={i <= 5 ? "text-[#DEFF9A]" : "text-white/10"} />
                                      ))}
                                   </div>
                                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Calificación IA: 9.8</p>
                                </div>
                                
                                <div className="absolute inset-0 bg-gradient-to-r from-[#DEFF9A]/05 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                             </div>
                             
                             <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <button 
                                  onClick={() => {
                                    if (onContactTeacher) {
                                      onContactTeacher(
                                        teacherData.employeeId,
                                        "Hello Teacher Ana, I would like some support with the mandatory subject pronouns, please."
                                      );
                                    }
                                  }}
                                  className="flex-1 py-4 px-6 bg-white/5 border border-white/10 hover:border-[#DEFF9A]/45 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-[#DEFF9A]/5 transition-all flex items-center justify-center gap-2"
                                >
                                   <Mail size={14} /> Contactar Docente
                                </button>
                                <button 
                                  onClick={() => setIsCalendarOpen(true)}
                                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#38BDF8] to-[#0284c7] border border-[#38BDF8]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:scale-[1.02] hover:bg-opacity-95 transition-all flex items-center justify-center gap-2"
                                >
                                   <Calendar size={14} /> Agendar Asesoría
                                </button>
                             </div>
                          </div>
                        )}
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'PROFESSIONAL' && (
               <motion.div 
                 key="professional"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Trayectoria & Certificaciones" icon={Award} accent="cyan">
                     <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Grado Académico Principal</label>
                              <input 
                               type="text" 
                               value={teacherData.degree} 
                               onChange={(e) => { setTeacherData({...teacherData, degree: e.target.value}); setIsDirty(true); }}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#DEFF9A] text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all uppercase"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Años de Experiencia</label>
                              <div className="flex items-center gap-4">
                                 <input 
                                  type="number" 
                                  value={12} readOnly 
                                  className="w-24 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black outline-none focus:border-[#38BDF8]/40 transition-all"
                                 />
                                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Años de cátedra</span>
                              </div>
                           </div>
                        </div>

                        {/* Repository of Certifications */}
                        <div className="space-y-6">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="text-[12px] font-black text-white uppercase tracking-tight">Repositorio de Certificaciones</h4>
                                 <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Respaldo legal de tu formación profesional.</p>
                              </div>
                              <button className="flex items-center gap-2 px-4 py-2 bg-[#DEFF9A]/10 text-[#DEFF9A] border border-[#DEFF9A]/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#DEFF9A]/20 transition-all">
                                 <Plus size={14} /> Añadir Documento
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <AnimatePresence>
                                 {teacherData.certifications.map(cert => (
                                    <motion.div 
                                      key={cert.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#DEFF9A]">
                                             <FileText size={20} />
                                          </div>
                                          <div>
                                             <p className="text-white text-[10px] font-black uppercase">{cert.name}</p>
                                             <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">VÁLIDO DESDE: {cert.date}</p>
                                          </div>
                                       </div>
                                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                             <Download size={14} />
                                          </button>
                                          <button className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500/40 hover:text-red-500 transition-all">
                                             <Trash2 size={14} />
                                          </button>
                                       </div>
                                    </motion.div>
                                 ))}
                              </AnimatePresence>
                           </div>
                        </div>

                        <div className="p-8 bg-[#38BDF8]/5 border border-[#38BDF8]/20 rounded-[2.5rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-full bg-[#38BDF8]/5 -skew-x-12 translate-x-16" />
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-16 h-16 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                                 <Award size={32} />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-[13px] font-black text-white uppercase tracking-tight italic">Nivel de Excelencia Académica</h4>
                                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">Tu perfil es visible para la Red de Apoyo universitaria.</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-black text-[#DEFF9A]">100%</p>
                                 <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Validado</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'SECURITY' && (
               <motion.div 
                 key="security"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <GlassCard title="Protección de Acceso" icon={Lock} accent="orange">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Contraseña Actual</label>
                           <input type="password" value="********" readOnly className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/40 text-xs font-bold outline-none" />
                        </div>
                        <div className="flex items-end">
                           <button className="w-full py-4 rounded-2xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/20 text-[10px] font-black uppercase tracking-widest text-[#DEFF9A] hover:bg-[#DEFF9A]/10 transition-all">Cambiar Password</button>
                        </div>
                        
                        {effectiveRole === 'ALUMNO' && (
                          <div className="md:col-span-2 space-y-2">
                             <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Token de Acceso Unificado</label>
                             <div className="flex items-center gap-4">
                                <input 
                                  value="ALU-DALLAS-2026-X812-PROTO" 
                                  readOnly 
                                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#38BDF8] text-xs font-mono font-black outline-none"
                                />
                                <button className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/40 hover:text-white transition-all">
                                   <Zap size={18} />
                                </button>
                             </div>
                             <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-2 ml-1">Utiliza este token para vincular dispositivos de inmersión AR externos.</p>
                          </div>
                        )}

                        <div className="md:col-span-2 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-r from-orange-500/05 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                 <Fingerprint size={28} />
                              </div>
                              <div>
                                 <h4 className="text-[13px] font-black text-white uppercase tracking-tight">Acceso Biométrico / 2FA</h4>
                                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                   {effectiveRole === 'ALUMNO' 
                                     ? 'Protege tu identidad inmersiva con FaceID o TouchID en tu dispositivo.' 
                                     : 'Añade una capa extra de protección para tu firma institucional.'}
                                 </p>
                              </div>
                           </div>
                           <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_#F9731680] transition-all relative z-10">Configurar</button>
                        </div>

                        {effectiveRole === 'ALUMNO' && (
                          <div className="md:col-span-2 p-8 bg-black/20 rounded-[2.5rem] border border-white/5">
                             <div className="flex items-center gap-3 mb-6">
                                <Monitor size={18} className="text-white/20" />
                                <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Vínculos & Sesiones Activas</h4>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center">
                                         <Monitor size={20} />
                                      </div>
                                      <div>
                                         <p className="text-white text-[10px] font-black uppercase">Web Browser - Teclingo Dashboard</p>
                                         <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">ACTUAL • DALLAS, TX</p>
                                      </div>
                                   </div>
                                   <span className="px-3 py-1 rounded-full bg-[#4ADE80]/10 text-[#4ADE80] text-[8px] font-black uppercase">En Línea</span>
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                  </GlassCard>
               </motion.div>
             )}

             {activeTab === 'MODULES' && (
                <motion.div 
                  key="modules"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <ModuleManagement />
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* Save Panel — lateral colapsable. NO bloquea los campos del formulario. */}
       <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 z-[100] flex items-end gap-2"
            >
              {/* Botón colapsable (label) */}
              {isSavePanelCollapsed ? (
                <button
                  onClick={() => setIsSavePanelCollapsed(false)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#38BDF8] text-white shadow-[0_10px_30px_rgba(56,189,248,0.4)] flex items-center justify-center animate-pulse hover:scale-110 transition-transform"
                  title="Tienes cambios sin guardar"
                  aria-label="Expandir panel de cambios"
                >
                  <Save size={18} className="sm:size-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#061a1a]" />
                </button>
              ) : (
                <div className="bg-[#38BDF8] rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-[0_20px_50px_rgba(56,189,248,0.3)] max-w-[calc(100vw-1.5rem)]">
                  <div className="flex items-center gap-2 sm:gap-3 text-white shrink-0">
                    <Save size={16} className="sm:size-5" />
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest">Cambios detectados</p>
                      <p className="text-[8px] font-bold opacity-80">Guarda para aplicar en tu perfil universitario</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={() => setIsSavePanelCollapsed(true)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all flex items-center justify-center"
                      title="Ocultar panel"
                      aria-label="Ocultar panel de cambios"
                    >
                      <X size={14} className="sm:size-4" />
                    </button>
                    <button
                      onClick={handleDiscard}
                      disabled={isSaving}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/20 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all font-bold disabled:opacity-60 disabled:cursor-wait"
                    >
                      Descartar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white text-[#38BDF8] text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl font-bold disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100"
                    >
                      {isSaving ? 'Guardando…' : 'Confirmar'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
       </AnimatePresence>

       {/* Modal de aviso: cambios sin guardar al cambiar de tab */}
       <AnimatePresence>
          {showUnsavedModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUnsavedModal(false)}
                className="absolute inset-0 bg-[#020b18]/85 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md bg-[#0b0f19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-black uppercase tracking-tight">Cambios sin guardar</h3>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1 leading-relaxed">
                      Tienes cambios sin guardar. ¿Qué quieres hacer antes de cambiar de sección?
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <button
                    onClick={handleSaveAndSwitch}
                    disabled={isSaving}
                    className="w-full py-3 sm:py-4 rounded-xl bg-[#DEFF9A] text-[#061a1a] text-[10px] font-black uppercase tracking-widest shadow-[0_0_25px_rgba(222,255,154,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                  >
                    <Save size={14} /> {isSaving ? 'Guardando…' : 'Guardar y cambiar'}
                  </button>
                  <button
                    onClick={handleDiscardAndSwitch}
                    disabled={isSaving}
                    className="w-full py-3 sm:py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-60 disabled:cursor-wait"
                  >
                    Descartar cambios y cambiar
                  </button>
                  <button
                    onClick={() => { setShowUnsavedModal(false); setPendingTab(null); }}
                    disabled={isSaving}
                    className="w-full py-3 sm:py-4 rounded-xl bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-60"
                  >
                    Quedarme aquí
                  </button>
                </div>
              </motion.div>
            </div>
          )}
       </AnimatePresence>

        <AnimatePresence>
           {isCalendarOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCalendarOpen(false)}
                  className="absolute inset-0 bg-[#020b18]/80 backdrop-blur-md"
                />
                
                {/* Modal Container */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative z-10 w-full max-w-lg bg-[#0b0f19] border border-gray-800 rounded-[3rem] p-8 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                >
                   {/* Header Decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#DEFF9A]/5 blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                   
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <span className="text-[#DEFF9A] text-[8px] font-black uppercase tracking-[0.3em]">Reserva de Red de Apoyo</span>
                         <h3 className="text-white text-xl font-black italic tracking-tight uppercase mt-1">Agenda de Asesoría síncrona</h3>
                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Mtra. Ana López (Elite Coach)</p>
                      </div>
                      <button 
                        onClick={() => setIsCalendarOpen(false)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5"
                      >
                         <X size={16} />
                      </button>
                   </div>
                   
                   {/* Calendar Slots */}
                   <div className="space-y-4">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                         <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Semana de clases activa (Próximos Horarios Disponibles)</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         {[
                           { id: '1', label: 'Lunes - 4:00 PM', desc: 'Teams síncrono' },
                           { id: '2', label: 'Lunes - 5:30 PM', desc: 'Google Meet' },
                           { id: '3', label: 'Miércoles - 9:00 AM', desc: 'Teams síncrono' },
                           { id: '4', label: 'Miércoles - 4:00 PM', desc: 'Google Meet' },
                           { id: '5', label: 'Viernes - 11:30 AM', desc: 'Teams síncrono' },
                           { id: '6', label: 'Viernes - 3:00 PM', desc: 'Google Meet' },
                         ].map(slot => {
                           const isSelected = selectedSlot === slot.label;
                           return (
                             <button
                               key={slot.id}
                               onClick={() => setSelectedSlot(slot.label)}
                               className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 group ${
                                 isSelected 
                                   ? 'bg-[#DEFF9A]/10 border-[#DEFF9A] text-[#DEFF9A] shadow-[0_0_20px_rgba(222,255,154,0.15)]'
                                   : 'bg-[#0f1424] hover:bg-[#141b30] border-gray-800 text-white/60 hover:text-white hover:border-gray-700'
                               }`}
                             >
                               <span className="text-[10px] font-black uppercase tracking-wider">{slot.label}</span>
                               <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${isSelected ? 'text-[#DEFF9A]/60' : 'text-white/20'}`}>
                                  {slot.desc}
                               </span>
                             </button>
                           );
                         })}
                      </div>
                   </div>

                   {/* Footer Controls */}
                   <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between gap-4">
                      <p className="text-[9px] text-white/30 uppercase tracking-widest max-w-[200px]">
                         La confirmación sincroniza la cita automáticamente con tu Google Calendar y Teams institucional.
                      </p>
                      <button
                        disabled={!selectedSlot}
                        onClick={() => {
                          if (selectedSlot) {
                            setToastMessage(`${selectedSlot} para desarrollo de Subject Pronouns`);
                            setShowToast(true);
                            setIsCalendarOpen(false);
                          }
                        }}
                        className="px-8 py-4 bg-[#DEFF9A] text-[#061a1a] font-black text-[10px] tracking-widest uppercase rounded-[1.5rem] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(222,255,154,0.25)] disabled:opacity-30 disabled:pointer-events-none"
                      >
                         Confirmar Cita
                      </button>
                   </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>

        <AnimatePresence>
           {showToast && (
             <motion.div
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 50, scale: 0.9 }}
               className="fixed bottom-8 right-8 z-[130] max-w-md w-full bg-[#0a0f1d] border border-[#DEFF9A]/30 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(222,255,154,0.15)] flex items-start gap-4"
             >
               <div className="w-10 h-10 rounded-xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] shrink-0">
                  {toastMessage.includes('Error') ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
               </div>
               <div className="flex-1">
                  <p className="text-[10px] text-[#DEFF9A] font-bold uppercase tracking-wider">{toastMessage}</p>
               </div>
               <button onClick={() => setShowToast(false)} className="text-white/20 hover:text-white transition-all">
                  <X size={16} />
               </button>
             </motion.div>
           )}
        </AnimatePresence>
    </div>
  );
}
