/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { registrarMensaje, registrarChat, obtenerMensajes, obtenerChats } from '../services/identityService';

type Theme = 'dark' | 'light' | 'normal';
type Language = 'es' | 'en';

interface Event {
  id: string;
  day: number;
  title: string;
  type: 'SCHOOL' | 'HOLIDAY' | 'TECLINGO';
  description: string;
  time?: string;
  visibility: ('GLOBAL' | 'DOCENTE' | 'ALUMNO')[];
}

export type UserRole = 'DIRECTOR' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'ADMIN';

export interface SyllabusUnit {
  number: number;
  title: string;
  topics: string[];
}

export interface Syllabus {
  generalObjective: string;
  units: SyllabusUnit[];
}

export interface Subject {
  id: string;
  clave: string;
  name: string;
  weeklyHours: number;
  careerId: string;
  semester: number;
  syllabus?: Syllabus;
}

export interface Career {
  id: string;
  name: string;
  claveReticula: string;
  horasLimiteSemestre: number;
  subjects: Subject[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxHours: number;
  qualifiedSubjects: string[]; // IDs de materias
  status: 'ACTIVE' | 'INACTIVE';
}

export interface GroupSubject extends Subject {
  assignedTeacherId?: string;
  isCompleted: boolean;
}

export interface Group {
  id: string;
  name: string;
  level: string;
  careerId: string;
  subjects: GroupSubject[];
  teacherId: string;
  studentIds: string[];
  schedule: any;
  time: string;
  days: string[];
  room?: string;
  type?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  isDirector?: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  type: 'GROUP' | 'DIRECT' | 'GLOBAL';
  participants: string[];
  messages: Message[];
  lastMessage?: string;
  unreadCount: number;
  lastReadAt?: string;
  participantNames?: Record<string, string>;
  participantRoles?: Record<string, UserRole>;
}

export interface FolioSignature {
  teacherId: string;
  teacherName: string;
  signatureData: string; // Base64 signature
  timestamp: string;
}

export interface FolioEvidence {
  teacherId: string;
  teacherName: string;
  fileName: string;
  fileUrl: string;
  timestamp: string;
}

export interface Folio {
  id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
  senderName: string;
  assignedToIds: string[]; // Teacher IDs
  signatures: FolioSignature[];
  evidence: FolioEvidence[];
  status: 'PENDING' | 'COMPLETED';
}

interface AppContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  userProgress: number;
  setUserProgress: (progress: number) => void;
  globalEvents: Event[];
  addGlobalEvent: (event: Event) => void;
  updateGlobalEvent: (event: Event) => void;
  deleteGlobalEvent: (id: string) => void;
  careers: Career[];
  setCareers: React.Dispatch<React.SetStateAction<Career[]>>;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  teachers: Teacher[];
  updateTeacher: (teacher: Teacher) => void;
  groups: Group[];
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  chats: ChatThread[];
  addMessage: (chatId: string, message: Message) => void;
  createGroupChat: (groupId: string, name: string, participants: string[]) => void;
  cargarMensajesChat: (chatId: string) => Promise<void>;
  markChatAsRead: (chatId: string) => void;
  totalUnreadCount: number;
  folios: Folio[];
  addFolio: (folio: Folio) => void;
  signFolio: (folioId: string, signature: FolioSignature) => void;
  addFolioEvidence: (folioId: string, evidence: FolioEvidence) => void;
  completeFolio: (folioId: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  institutionName: string;
  setInstitutionName: (name: string) => void;
  institutionLogo: string;
  setInstitutionLogo: (logo: string) => void;
  quickChatUser: any | null;
  setQuickChatUser: (user: any | null) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (mode: boolean) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  isExtracurricularUnlocked: boolean;
  setIsExtracurricularUnlocked: (isUnlocked: boolean) => void;
  managementEnabled: boolean;
  setManagementEnabled: (enabled: boolean) => void;
  coursesEnabled: boolean;
  setCoursesEnabled: (enabled: boolean) => void;
  foliosEnabled: boolean;
  setFoliosEnabled: (enabled: boolean) => void;
  identityEnabled: boolean;
  setIdentityEnabled: (enabled: boolean) => void;
  reticularEnabled: boolean;
  setReticularEnabled: (enabled: boolean) => void;
  distributionEnabled: boolean;
  setDistributionEnabled: (enabled: boolean) => void;
}

const mockEvents: Event[] = [
  { id: '1', day: 15, title: 'Examen Global A1', type: 'SCHOOL', description: 'Evaluación final del primer bloque de Basic English.', time: '08:00 AM', visibility: ['GLOBAL'] },
  { id: '2', day: 20, title: 'Día de la Revolución', type: 'HOLIDAY', description: 'Suspensión de labores académicas por fecha oficial.', time: 'Todo el día', visibility: ['GLOBAL'] },
  { id: '3', day: 22, title: 'AI Workshop: Prompt Engineering', type: 'TECLINGO', description: 'Taller presencial sobre el uso de la IA en la creación de prompts para aprendizaje de idiomas.', time: '04:00 PM', visibility: ['ALUMNO', 'DOCENTE'] },
  { id: '4', day: 25, title: 'Lanzamiento: Album AR Linguistic', type: 'TECLINGO', description: 'Evento especial con realidad aumentada para la presentación de nuevo material auditivo.', time: '06:00 PM', visibility: ['GLOBAL'] },
  { id: '5', day: 10, title: 'Junta de Docentes', type: 'SCHOOL', description: 'Reunión de coordinación pedagógica ciclo 2026-A.', time: '01:00 PM', visibility: ['DOCENTE'] },
];

const translations = {
  es: {
    dashboard: 'Panel de Control',
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    profile: 'Mi Perfil',
    adn: 'Mi ADN',
    skills: 'Habilidades',
    normal: 'Normal',
    dark: 'Oscuro',
    light: 'Claro',
    english: 'Inglés',
    spanish: 'Español',
    welcome: '¡Hola!',
    progress: 'Progreso',
    new: 'NUEVO',
    logout: 'Cerrar Sesión',
    back: 'Volver',
    my_dashboard: 'Mi Dashboard',
    progress_map: 'Mapa de Progreso',
    ai_support: 'Soporte AI',
    pdp: 'Habilidades (PDP)',
    my_group: 'Mi Grupo',
    tasks: 'Tareas / Exámenes',
    grades: 'Calificaciones',
    calendar: 'Mi Calendario',
    folios: 'Mis Folios',
    messages: 'Mis Mensajes',
    achievements: 'Logros'
  },
  en: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    profile: 'Profile',
    adn: 'My ADN',
    skills: 'Skills',
    normal: 'Normal',
    dark: 'Dark',
    light: 'Light',
    english: 'English',
    spanish: 'Spanish',
    welcome: 'Hello!',
    progress: 'Progress',
    new: 'NEW',
    logout: 'Logout',
    back: 'Back',
    my_dashboard: 'My Dashboard',
    progress_map: 'Progress Map',
    ai_support: 'AI Support',
    pdp: 'Skills (PDP)',
    my_group: 'My Group',
    tasks: 'Tasks / Exams',
    grades: 'Grades',
    calendar: 'My Calendar',
    folios: 'My Folios',
    messages: 'My Messages',
    achievements: 'Achievements'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => (localStorage.getItem('tecnolingo_session') as UserRole) || 'DIRECTOR');
  // Modo DEMO: solo en demo se muestra el MasterSwitcher (simulador de roles).
  // Un usuario real (con email registrado en el Lake) lo oculta para evitar
  // que cambie de rol después de elegir su perfil en el registro.
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const session = localStorage.getItem('tecnolingo_session');
    const email = localStorage.getItem('teclingo_user_email');
    return Boolean(session) && !email;
  });
  const [isExtracurricularUnlocked, setIsExtracurricularUnlocked] = useState(() => localStorage.getItem('extracurricular_unlocked') === 'true');

  const [managementEnabled, setManagementEnabledImpl] = useState<boolean>(() => {
    const persisted = localStorage.getItem('teclingo_management_enabled');
    return persisted !== 'false';
  });

  const [coursesEnabled, setCoursesEnabledImpl] = useState<boolean>(() => {
    const persisted = localStorage.getItem('teclingo_courses_enabled');
    return persisted !== 'false';
  });

  const [foliosEnabled, setFoliosEnabledImpl] = useState<boolean>(() => {
    const persisted = localStorage.getItem('teclingo_folios_enabled');
    return persisted !== 'false';
  });

  const [identityEnabled, setIdentityEnabledImpl] = useState<boolean>(() => {
    const persisted = localStorage.getItem('teclingo_identity_enabled');
    return persisted !== 'false';
  });

  const [reticularEnabled, setReticularEnabledImpl] = useState<boolean>(() => {
    const persisted = localStorage.getItem('teclingo_reticular_enabled');
    return persisted !== 'false';
  });

  const [distributionEnabled, setDistributionEnabledImpl] = useState<boolean>(() => {
    const persisted = localStorage.getItem('teclingo_distribution_enabled');
    return persisted !== 'false';
  });

  const setManagementEnabled = (enabled: boolean) => {
    setManagementEnabledImpl(enabled);
    localStorage.setItem('teclingo_management_enabled', String(enabled));
  };

  const setCoursesEnabled = (enabled: boolean) => {
    setCoursesEnabledImpl(enabled);
    localStorage.setItem('teclingo_courses_enabled', String(enabled));
  };

  const setFoliosEnabled = (enabled: boolean) => {
    setFoliosEnabledImpl(enabled);
    localStorage.setItem('teclingo_folios_enabled', String(enabled));
  };

  const setIdentityEnabled = (enabled: boolean) => {
    setIdentityEnabledImpl(enabled);
    localStorage.setItem('teclingo_identity_enabled', String(enabled));
  };

  const setReticularEnabled = (enabled: boolean) => {
    setReticularEnabledImpl(enabled);
    localStorage.setItem('teclingo_reticular_enabled', String(enabled));
  };

  const setDistributionEnabled = (enabled: boolean) => {
    setDistributionEnabledImpl(enabled);
    localStorage.setItem('teclingo_distribution_enabled', String(enabled));
  };
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'es');
  const [userProgress, setUserProgress] = useState(75);
  const [globalEvents, setGlobalEvents] = useState<Event[]>(mockEvents);
  const [careers, setCareers] = useState<Career[]>([
    {
      id: 'car-dem-001',
      name: 'Ingeniería en Sistemas Computacionales',
      claveReticula: 'IINF-2010-220',
      horasLimiteSemestre: 33,
      subjects: [
        {
          id: 'sub-dem-001',
          clave: 'TEC-001',
          name: 'TecLingo AI (Inglés I)',
          weeklyHours: 4,
          careerId: 'car-dem-001',
          semester: 1,
          syllabus: {
            generalObjective: 'Desarrollar la competencia comunicativa bilingüe en entornos tecnológicos y de desarrollo de software.',
            units: [
              {
                number: 1,
                title: 'Fundamentos de TI',
                topics: ['Vocabulary: Hardware Components', 'Grammar: Present Simple', 'Reading: Tech Documentation']
              },
              {
                number: 2,
                title: 'Lógica y Algoritmos',
                topics: ['Conditionals (If/Else)', 'Logic operators', 'Function names and verbs']
              }
            ]
          }
        }
      ]
    }
  ]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 'USR-901-B33',
      name: 'Prof. Armando Paredes',
      email: 'armando@tecnolingo.ai',
      phone: '555-0101',
      maxHours: 40,
      qualifiedSubjects: [],
      status: 'ACTIVE'
    }
  ]);
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'GRP-001',
      name: 'Pioneers A1 - Morning',
      level: '1',
      careerId: '',
      subjects: [],
      teacherId: 'USR-901-B33',
      studentIds: ['USR-001-A22', 'USR-221-C99'],
      schedule: {},
      time: '08:00 AM',
      days: ['LUN', 'MIÉ', 'VIE'],
      status: 'ACTIVE'
    }
  ]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const loadingChatsRef = useRef<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [folios, setFolios] = useState<Folio[]>([
    {
      id: 'FOL-2026-042',
      title: 'Circular Informativa 042',
      subject: 'Protocolo de Evaluación Verano',
      content: 'Estimados docentes, se les recuerda que a partir del próximo ciclo el porcentaje de evidencia diaria impactará en el 15% del KPI Operativo...',
      date: '12 MAY, 2026',
      senderName: 'Dirección Central',
      assignedToIds: ['USR-901-B33'],
      signatures: [],
      evidence: [],
      status: 'PENDING'
    }
  ]);

  const addFolio = (folio: Folio) => {
    setFolios(prev => [folio, ...prev]);
  };

  const signFolio = (folioId: string, signature: FolioSignature) => {
    setFolios(prev => prev.map(f => {
      if (f.id === folioId) {
        return {
          ...f,
          signatures: [...f.signatures, signature]
        };
      }
      return f;
    }));
  };

  const addFolioEvidence = (folioId: string, item: FolioEvidence) => {
    setFolios(prev => prev.map(f => {
      if (f.id === folioId) {
        return {
          ...f,
          evidence: [...f.evidence, item]
        };
      }
      return f;
    }));
  };

  const completeFolio = (folioId: string) => {
    setFolios(prev => prev.map(f => f.id === folioId ? { ...f, status: 'COMPLETED' } : f));
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [institutionName, setInstitutionName] = useState('TECNOLINGO AI');
  const [institutionLogo, setInstitutionLogo] = useState('https://raw.githubusercontent.com/lucide-react/lucide/main/icons/zap.svg');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('teclingo_user_email') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('teclingo_user_name') || '');
  const [quickChatUser, setQuickChatUser] = useState<any | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('tecnolingo_session', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('teclingo_user_email', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('teclingo_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('extracurricular_unlocked', String(isExtracurricularUnlocked));
  }, [isExtracurricularUnlocked]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'normal') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  // Cargar chats del DataLake cuando el usuario inicia sesión
  useEffect(() => {
    if (!userEmail) return;
    let cancelled = false;
    const userEmailLower = userEmail.toLowerCase();

    const cargarChats = async () => {
      try {
        const remoteChats = await obtenerChats(userEmail);
        if (cancelled || !remoteChats || remoteChats.length === 0) return;

        setChats(prev => {
          const merged = [...prev];
          remoteChats.forEach((rc: any) => {
            const existing = merged.find(c => c.id === rc.id);
            if (existing) {
              // Si el last_message remoto es más nuevo que el local, marcarlo para refresh
              // (la lógica de unreadCount se recalcula en cargarMensajesChat)
              return;
            }
            const chatType: ChatThread['type'] =
              rc.type === 'GLOBAL' ? 'GLOBAL' :
              rc.type === 'DIRECT' ? 'DIRECT' : 'GROUP';
            const normalizedParticipants: string[] = Array.isArray(rc.participants)
              ? Array.from(new Set(rc.participants.map((p: string) => String(p || '').trim().toLowerCase()).filter(Boolean)))
              : [];
            // Inicializar unreadCount: el last_message es un preview, pero el conteo real
            // se calculará cuando cargarMensajesChat traiga los mensajes
            const isFromOther = rc.last_message && rc.last_message_at &&
              new Date(rc.last_message_at).getTime() > 0;
            merged.push({
              id: rc.id,
              name: rc.name || rc.id,
              type: chatType,
              participants: normalizedParticipants,
              messages: [],
              lastMessage: rc.last_message || '',
              unreadCount: 0
            });
          });
          return merged;
        });

        // Para cada chat remoto con mensajes, calcular no leídos basados en lastReadAt del chat
        // Si el usuario NUNCA leyó el chat, todos los mensajes de otros cuentan como no leídos
        for (const rc of remoteChats) {
          const lastMsg = rc.last_message;
          if (!lastMsg) continue;
          // Disparar carga de mensajes para calcular unread real
          cargarMensajesChat(rc.id);
        }
      } catch {}
    };

    cargarChats();

    // Polling: refrescar chats cada 15 segundos
    const interval = setInterval(cargarChats, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [userEmail]);

  // Helper: parsea timestamps en formato "DD/MM/YYYY HH:MM:SS" o ISO
  const parseTimestamp = useCallback((ts: string): number => {
    if (!ts) return 0;
    const iso = Date.parse(ts);
    if (!isNaN(iso)) return iso;
    const m = ts.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/);
    if (m) {
      const [, d, mo, y, h, mi, s] = m;
      return new Date(+y, +mo - 1, +d, +h, +mi, +s).getTime();
    }
    return 0;
  }, []);

  // Cargar mensajes de un chat específico desde el Data Lake
  const cargarMensajesChat = useCallback(async (chatId: string) => {
    if (!userEmail) return;
    if (loadingChatsRef.current.has(chatId)) return;
    loadingChatsRef.current.add(chatId);
    try {
      const remoteMsgs = await obtenerMensajes(chatId, 100);
      if (!remoteMsgs || remoteMsgs.length === 0) return;

      setChats(prev => prev.map(chat => {
        if (chat.id !== chatId) return chat;
        const existingIds = new Set(chat.messages.map(m => m.id));
        const newMsgs = remoteMsgs
          .filter((m: any) => !existingIds.has(m.id))
          .map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderRole: m.sender_role,
            content: m.content,
            timestamp: m.timestamp,
            isDirector: m.is_director === 'TRUE' || m.is_director === true
          }));
        if (newMsgs.length === 0) return chat;
        const merged = [...chat.messages, ...newMsgs];
        const lastRead = chat.lastReadAt ? new Date(chat.lastReadAt).getTime() : 0;
        const userEmailLower = userEmail.toLowerCase();
        const newUnread = merged.filter(m => {
          if (m.senderId === 'ME') return false;
          if (String(m.senderId || '').toLowerCase() === userEmailLower) return false;
          const ts = parseTimestamp(m.timestamp);
          return ts > lastRead;
        }).length;
        const pNames = { ...chat.participantNames };
        const pRoles = { ...chat.participantRoles };
        merged.forEach(m => {
          const sid = String(m.senderId || '').toLowerCase();
          if (sid && sid !== 'me' && m.senderName) pNames[sid] = m.senderName;
          if (sid && sid !== 'me' && m.senderRole) pRoles[sid] = m.senderRole;
        });
        return {
          ...chat,
          messages: merged,
          lastMessage: newMsgs[newMsgs.length - 1].content,
          unreadCount: newUnread,
          participantNames: pNames,
          participantRoles: pRoles
        };
      }));
    } catch {} finally {
      loadingChatsRef.current.delete(chatId);
    }
  }, [userEmail, parseTimestamp]);

  // Marcar un chat como leído (setea lastReadAt = ahora y resetea unreadCount)
  const markChatAsRead = useCallback((chatId: string) => {
    const now = new Date().toISOString();
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, lastReadAt: now, unreadCount: 0 }
        : chat
    ));
  }, []);

  // Auto-cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (!userEmail || chats.length === 0) return;
    chats.forEach(chat => {
      if (chat.messages.length === 0 && !loadingChatsRef.current.has(chat.id)) {
        cargarMensajesChat(chat.id);
      }
    });
  }, [chats.length, userEmail, cargarMensajesChat]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const addGlobalEvent = (event: Event) => {
    setGlobalEvents(prev => [...prev, event]);
  };

  const updateGlobalEvent = (event: Event) => {
    setGlobalEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const deleteGlobalEvent = (id: string) => {
    setGlobalEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateTeacher = (teacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === teacher.id ? teacher : t));
  };
  
  const addGroup = (group: Group) => {
    setGroups(prev => [...prev, group]);
    createGroupChat(group.id, `${group.name} (Grupo)`, [group.teacherId, ...group.studentIds]);
  };

  const updateGroup = (group: Group) => {
    setGroups(prev => prev.map(g => g.id === group.id ? group : g));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setChats(prev => prev.filter(c => c.id !== id));
  };

  const addMessage = useCallback((chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const isFromOther = message.senderId !== 'ME' &&
          String(message.senderId || '').toLowerCase() !== String(userEmail || '').toLowerCase();
        if (isFromOther && chat.lastReadAt) {
          const lastRead = new Date(chat.lastReadAt).getTime();
          const msgTs = parseTimestamp(message.timestamp);
          if (msgTs <= lastRead) {
            return { ...chat, messages: [...chat.messages, message], lastMessage: message.content };
          }
        }
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.content,
          unreadCount: chat.unreadCount + (isFromOther ? 1 : 0)
        };
      }
      return chat;
    }));

    if (userEmail) {
      registrarMensaje(
        userEmail, chatId, message.content,
        message.senderName, message.senderRole, message.isDirector
      ).catch(() => {});
    }
  }, [userEmail, parseTimestamp]);

  const createGroupChat = useCallback((groupId: string, name: string, participants: string[]) => {
    const chatType: ChatThread['type'] = groupId.startsWith('DIRECT-') ? 'DIRECT' : 'GROUP';
    const normalizedParticipants = Array.from(
      new Set(participants.map(p => String(p || '').trim().toLowerCase()).filter(Boolean))
    );
    const newChat: ChatThread = {
      id: groupId,
      name,
      type: chatType,
      participants: normalizedParticipants,
      messages: [],
      unreadCount: 0,
      lastReadAt: new Date().toISOString()
    };
    setChats(prev => {
      const exists = prev.find(c => c.id === groupId);
      if (exists) return prev;
      return [...prev, newChat];
    });

    if (userEmail) {
      registrarChat(userEmail, groupId, name, chatType, normalizedParticipants).catch(() => {});
    }
  }, [userEmail]);

  return (
    <AppContext.Provider value={{ 
      theme, 
      language, 
      setTheme, 
      setLanguage, 
      t, 
      userEmail,
      setUserEmail,
      userName,
      setUserName,
      userProgress, 
      setUserProgress, 
      globalEvents, 
      addGlobalEvent,
      updateGlobalEvent,
      deleteGlobalEvent,
      careers,
      setCareers,
      subjects,
      setSubjects,
      teachers,
      updateTeacher,
      groups,
      addGroup,
      updateGroup,
      deleteGroup,
      chats,
      addMessage,
      createGroupChat,
      cargarMensajesChat,
      markChatAsRead,
      totalUnreadCount: chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
      folios,
      addFolio,
      signFolio,
      addFolioEvidence,
      completeFolio,
      isSidebarOpen,
      setIsSidebarOpen,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      institutionName,
      setInstitutionName,
      institutionLogo,
      setInstitutionLogo,
      quickChatUser,
      setQuickChatUser,
      maintenanceMode,
      setMaintenanceMode,
      currentRole,
      setCurrentRole,
      isDemoMode,
      setIsDemoMode,
      isExtracurricularUnlocked,
      setIsExtracurricularUnlocked,
      managementEnabled,
      setManagementEnabled,
      coursesEnabled,
      setCoursesEnabled,
      foliosEnabled,
      setFoliosEnabled,
      identityEnabled,
      setIdentityEnabled,
      reticularEnabled,
      setReticularEnabled,
      distributionEnabled,
      setDistributionEnabled
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
