/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Base de Datos Integral TecLingo A1 (10 Hojas de Google Sheets)
 * Conforme a la especificación maestra para integración con App Móvil & API REST v1.
 */

export interface SheetConfigRow {
  clave: string;
  valor: string;
  descripcion: string;
  categoria: 'curso' | 'academico' | 'evaluacion' | 'multimedia' | 'sistema';
  tipo_dato: 'string' | 'number' | 'boolean' | 'json';
  actualizado_el: string;
}

export interface SheetClaseRow {
  clase_id: string; // e.g. "A1_C01"
  clase_numero: number;
  semana: number;
  sesion: 'A' | 'B';
  titulo_clase: string;
  titulo_video: string;
  video_url: string;
  tema_principal: string;
  tipo_contenido: 'original' | 'repaso' | 'taller';
  duracion_min: number;
  estado: 'activo' | 'inactivo';
}

export interface SheetVocabularioRow {
  vocab_id: string;
  clase_id: string;
  palabra_ingles: string;
  palabra_espanol: string;
  categoria: 'sustantivo' | 'verbo' | 'adjetivo' | 'expresion' | 'pronombre' | 'adverbio';
  pronunciacion_af: string;
  audio_url: string;
  ejemplo_uso: string;
  dificultad: number; // 1-3
}

export interface SheetVerboRow {
  verbo_id: string;
  clase_id: string;
  infinitivo: string;
  traduccion: string;
  presente_simple: string;
  tercera_persona: string;
  pasado_simple: string;
  participio: string;
  tipo: 'regular' | 'irregular';
  ejemplo_oracion: string;
}

export interface SheetTextoExplicativoRow {
  explicacion_id: string;
  clase_id: string;
  titulo_explicacion: string;
  contenido_html: string;
  contenido_markdown: string;
  ejemplos_tabla_json: string;
  reglas_clave: string;
  duracion_lectura_min: number;
  version: number;
  activo: boolean;
}

export interface SheetTextoBaseRow {
  texto_id: string;
  clase_id: string;
  titulo?: string;
  titulo_texto?: string;
  contenido?: string;
  contenido_texto?: string;
  palabras_count: number;
  dificultad: number;
  vocabulario_usado?: string[];
  verbos_usados?: string[];
  audio_tts_url?: string;
  tiempo_audio_seg: number;
  tipo_texto?: 'dialogo' | 'narrativo' | 'descriptivo';
  activo?: boolean;
}

export interface Reactivo {
  reactivo_id: string;
  clase_id: string;
  habilidad: string;
  numero_reactivo: number;
  tipo_pregunta: string;
  instruccion: string;
  pregunta_texto: string;
  opciones_json: string[];
  respuesta_correcta: string;
  respuesta_explicacion: string;
  audio_url: string;
  puntos: number;
  tiempo_limite_seg: number;
  dificultad: number;
  activo: boolean;
  
  // NUEVOS CAMPOS PEDAGÓGICOS
  contexto_espanol?: string;
  frase_traduccion?: string;
  opciones_traduccion?: string[];
  opciones_traduccion_json?: string[];
  pista_vocabulario?: string;
  mostrar_traduccion?: 'completa' | 'parcial' | 'ninguna' | string;
  palabras_clave_traduccion?: string;
}

export interface OpcionV3 {
  id: string; // 'a' | 'b' | 'c'
  texto: string;
  traduccion: string;
}

export interface ReglasValidacion {
  tipo: string;
  normalizar?: string[];
  requiere_polaridad?: boolean;
}

export interface SheetReactivoRow {
  reactivo_id: string;
  clase_id: string;
  habilidad: 'grammar' | 'reading' | 'listening' | 'writing' | 'speaking';
  numero: number;
  numero_reactivo?: number;
  tipo_pregunta: 'multiple_choice' | 'fill_in_blank' | 'true_false' | 'sentence_reorder' | 'audio_matching' | string;
  instruccion: string;
  pregunta_texto: string;
  opciones: string[];
  opciones_json?: string[] | string;
  respuesta_correcta: string;
  respuesta_explicacion: string;
  audio_url?: string;
  puntos: number;
  tiempo_limite_seg: number;
  dificultad: number;
  activo?: boolean;

  // NUEVAS COLUMNAS (después de "activo")
  opciones_v3_json?: OpcionV3[] | string;
  respuesta_correcta_id?: string;
  shuffle_opciones?: boolean;
  reglas_validacion_json?: ReglasValidacion | string;
  audio_autoplay?: boolean;
  fuente_evidencia?: string;
  idioma_enunciado?: 'en' | 'es' | string;
  idioma_opciones?: 'en' | 'es' | 'na' | string;

  // CAMPOS PEDAGÓGICOS COMPLEMENTARIOS
  contexto_espanol?: string;
  frase_traduccion?: string;
  opciones_traduccion?: string[];
  opciones_traduccion_json?: string[] | string;
  pista_vocabulario?: string;
  mostrar_traduccion?: 'completa' | 'parcial' | 'ninguna' | string;
  palabras_clave_traduccion?: string;
}

export interface SheetExposicionRow {
  exposicion_id: string;
  semana: number;
  titulo: string;
  instrucciones: string;
  tema_presentacion: string;
  tiempo_minutos: number;
  criterios_evaluacion: string;
  vocabulario_sugerido: string[];
}

export interface SheetExamenRow {
  examen_id: string;
  titulo: string;
  clases_evaluadas: string;
  total_preguntas: number;
  tiempo_limite_min: number;
  puntaje_minimo_aprobatorio: number;
  descripcion: string;
}

export interface SheetProgresoUsuarioRow {
  progreso_id: string;
  user_id: string;
  clase_id: string;
  habilidad: string;
  reactivo_id: string;
  respuesta_usuario: string;
  correcto: boolean;
  tiempo_respuesta_seg: number;
  puntaje_obtenido: number;
  fecha_registro: string;
}

export interface SheetResumenProgresoRow {
  resumen_id?: string;
  user_id: string;
  clase_id: string;
  habilidades_completadas?: number;
  reactivos_totales_clase?: number;
  reactivos_correctos?: number;
  puntaje_obtenido?: number;
  puntaje_maximo_posible?: number;
  porcentaje_avance: number;
  xp_ganado?: number;
  estado_clase: 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada' | 'disponible' | string;
  ultima_actualizacion: string;
  // Compatibilidad con campos anteriores
  xp_obtenidos?: number;
  reactivos_resueltos?: number;
}

export interface SheetUsuarioRow {
  user_id: string;
  email: string;
  nombre: string;
  avatar_url?: string | null;
  fecha_registro: string;
  nivel_actual: string;
  xp_total: number;
  clases_completadas: number;
  tipo_cuenta: 'regular' | 'demo';
  activo: boolean;
  password?: string;
}

// 0. USUARIOS (Hoja de Registro con Usuario Demo predefinido)
export const INITIAL_USUARIOS: SheetUsuarioRow[] = [
  {
    user_id: 'demo_user_001',
    email: 'demo@teclingo.com',
    nombre: 'Estudiante Demo',
    avatar_url: '🧪',
    fecha_registro: '2026-09-08T00:00:00.000Z',
    nivel_actual: 'A1_C01',
    xp_total: 350,
    clases_completadas: 0,
    tipo_cuenta: 'demo',
    activo: true,
  },
  {
    user_id: 'usr_david_002',
    email: 'david@teclingo.com',
    nombre: 'David Rodríguez',
    avatar_url: null,
    fecha_registro: '2026-09-01T12:00:00.000Z',
    nivel_actual: 'A1_C02',
    xp_total: 520,
    clases_completadas: 1,
    tipo_cuenta: 'regular',
    activo: true,
  },
  {
    user_id: 'usr_sofia_003',
    email: 'sofia@teclingo.com',
    nombre: 'Sofía Valenzuela',
    avatar_url: null,
    fecha_registro: '2026-09-03T15:30:00.000Z',
    nivel_actual: 'A1_C03',
    xp_total: 890,
    clases_completadas: 2,
    tipo_cuenta: 'regular',
    activo: true,
  }
];

// 1. CONFIGURACION (24 Filas)
export const INITIAL_CONFIGURACION: SheetConfigRow[] = [
  { clave: "CURSO_ID", valor: "A1_MCER", descripcion: "Identificador único del curso", categoria: "curso", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "CURSO_NOMBRE", valor: "Módulo A1 - TecLingo Academy", descripcion: "Nombre oficial del curso", categoria: "curso", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "NIVEL_MCER", valor: "A1", descripcion: "Nivel del Marco Común Europeo", categoria: "academico", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "TOTAL_HORAS", valor: "90", descripcion: "Horas pedagógicas totales", categoria: "academico", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "TOTAL_CLASES", valor: "35", descripcion: "Catálogo completo de clases", categoria: "academico", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "TOTAL_REACTIVOS", valor: "875", descripcion: "Banco global de reactivos previstos", categoria: "academico", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "DURACION_SEMANAS", valor: "18", descripcion: "Duración en semanas calendario", categoria: "academico", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "SESIONES_POR_SEMANA", valor: "2", descripcion: "Frecuencia de sesiones (A y B)", categoria: "academico", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "DURACION_CLASE_MIN", valor: "120", descripcion: "Minutos por sesión presencial/virtual", categoria: "academico", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "HABILIDADES_EVALUADAS", valor: "grammar,reading,listening,writing,speaking", descripcion: "5 competencias nucleares", categoria: "evaluacion", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "PUNTAJE_APROBATORIO", valor: "70", descripcion: "Porcentaje mínimo para acreditar", categoria: "evaluacion", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "TIEMPO_EXAMEN_MIN", valor: "60", descripcion: "Duración de los exámenes parciales", categoria: "evaluacion", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "XP_POR_REACTIVO", valor: "15", descripcion: "Puntos de experiencia por acierto", categoria: "evaluacion", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "CANAL_YOUTUBE", valor: "@teclingoacademy", descripcion: "Canal oficial del contenido", categoria: "multimedia", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "YOUTUBE_URL_BASE", valor: "https://youtube.com/@teclingoacademy", descripcion: "URL principal de YouTube", categoria: "multimedia", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "FORMATO_VIDEO_DEFECTO", valor: "HD [1080p_60fps]", descripcion: "Estándar de calidad de video", categoria: "multimedia", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "MOTOR_AUDIO_TTS", valor: "en-US-Neural2-F", descripcion: "Voz neuronal de síntesis auditiva", categoria: "multimedia", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "MODO_VALIDACION", valor: "three_state_active", descripcion: "Motor de 3 estados (unanswered/first_fail/correct)", categoria: "sistema", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "RATE_LIMIT_RPM", valor: "100", descripcion: "Límite de peticiones por minuto por usuario", categoria: "sistema", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "CACHE_TTL_SEG", valor: "3600", descripcion: "Tiempo de vida de caché en endpoints estáticos", categoria: "sistema", tipo_dato: "number", actualizado_el: "2026-09-07" },
  { clave: "API_VERSION", valor: "v1", descripcion: "Versión actual de la API REST", categoria: "sistema", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "MODO_OFFLINE_PERMITIDO", valor: "true", descripcion: "Habilitar caché local en cliente móvil", categoria: "sistema", tipo_dato: "boolean", actualizado_el: "2026-09-07" },
  { clave: "INSTITUCION_MATRIZ", valor: "TecNM / TecLingo", descripcion: "Alianza curricular y de certificación", categoria: "curso", tipo_dato: "string", actualizado_el: "2026-09-07" },
  { clave: "SOPORTE_EMAIL", valor: "teclingoacademy@gmail.com", descripcion: "Contacto de soporte académico y técnico", categoria: "sistema", tipo_dato: "string", actualizado_el: "2026-09-07" },
];

// 2. CLASES (35 Filas)
export const INITIAL_CLASES: SheetClaseRow[] = [
  { clase_id: "A1_C01", clase_numero: 1, semana: 1, sesion: "A", titulo_clase: "Clase 01: Fase Cero - Singular & Plural", titulo_video: "FASE CERO TECLINGO: El Secreto de los Singulares y Plurales", video_url: "https://youtube.com/shorts/JBB6JZT4VIc?si=Pz1xbJ-YOJpAWmpQ", tema_principal: "La Regla de Oro del Inglés: YOU siempre es plural", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C02", clase_numero: 2, semana: 1, sesion: "B", titulo_clase: "Clase 01: Verbo To Be Presente (Afirmativo)", titulo_video: "CLASE 01 TECLINGO: Dominando el Verbo To Be", video_url: "https://youtube.com/shorts/4yQeI0N2j2o?si=Qv67iR_9p84y5d_y", tema_principal: "Verbo To Be, Pronombres Personales, Ser/Estar", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C03", clase_numero: 3, semana: 2, sesion: "A", titulo_clase: "Clase 02: Verbo To Be (Negativo & Preguntas)", titulo_video: "CLASE 02: Preguntas y Negaciones sin Miedo", video_url: "https://youtube.com/shorts/6-8nL7pW9mE?si=HjKl88N22bVv11cQ", tema_principal: "To Be Negativo (isn't, aren't), Yes/No Questions", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C04", clase_numero: 4, semana: 2, sesion: "B", titulo_clase: "Clase 03: Sustantivos Contables e Incontables", titulo_video: "CLASE 03: Cómo Contar en Inglés sin Errores", video_url: "https://youtube.com/shorts/3iNk89Lp_0w?si=Ak98Lmk120987654", tema_principal: "Countable & Uncountable, Some, Any, How much/many", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C05", clase_numero: 5, semana: 3, sesion: "A", titulo_clase: "Clase 04: Posesivos y Genitivo Sajón ('s)", titulo_video: "CLASE 04: Dueño + 's + Objeto - Regla de Oro", video_url: "https://youtube.com/shorts/9pLo0Mn34kL?si=OpLkm10982347651", tema_principal: "Genitivo Sajón ('s), My, Your, His, Her", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C06", clase_numero: 6, semana: 3, sesion: "B", titulo_clase: "Clase 05: Pronombres Posesivos vs Adjetivos", titulo_video: "CLASE 05: Mine, Yours, Ours - Nunca los Confundas", video_url: "https://youtube.com/shorts/1qAz2Ws34Ed?si=PlMno09812345678", tema_principal: "Mine, Yours, His, Hers, Ours, Theirs", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C07", clase_numero: 7, semana: 4, sesion: "A", titulo_clase: "Clase 06: Demostrativos: This, That, These, Those", titulo_video: "CLASE 06: Distancia y Número en Inglés Cotidiano", video_url: "https://youtube.com/shorts/5tGb6Yh78Uj?si=Qazwsx1234567890", tema_principal: "Demostrativos de Cercanía y Distancia", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C08", clase_numero: 8, semana: 4, sesion: "B", titulo_clase: "Clase 07: Artículos Indefinidos: A vs AN", titulo_video: "CLASE 07: El Sonido Clave para A y AN", video_url: "https://youtube.com/shorts/8uJm9Kl01Op?si=Wsedrt1234567890", tema_principal: "Artículos Indefinidos, Regla Fonética", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C09", clase_numero: 9, semana: 5, sesion: "A", titulo_clase: "Clase 08: El Verbo Have y Posesión", titulo_video: "CLASE 08: Have vs Has - Usos Esenciales", video_url: "https://youtube.com/shorts/2wSx3Ed45Rf?si=Rfvbgty123456789", tema_principal: "Have, Has, Familia y Objetos Personales", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C10", clase_numero: 10, semana: 5, sesion: "B", titulo_clase: "Clase 09: Presente Simple - 3ra Persona Singular", titulo_video: "CLASE 09: La 'S' que todo el mundo Olvida", video_url: "https://youtube.com/shorts/6yHn7Uj89Ik?si=Tgbyhn1234567890", tema_principal: "He/She/It en Presente Simple, Reglas de -s/-es/-ies", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C11", clase_numero: 11, semana: 6, sesion: "A", titulo_clase: "Clase 10: Presente Simple - Auxiliares Do / Does", titulo_video: "CLASE 10: Preguntas y Negaciones con Do y Does", video_url: "https://youtube.com/shorts/4eRf5Tg67Yh?si=Yhnuji1234567890", tema_principal: "Do, Does, Don't, Doesn't", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C12", clase_numero: 12, semana: 6, sesion: "B", titulo_clase: "Clase 11: Adverbios de Frecuencia", titulo_video: "CLASE 11: Always, Never, Sometimes - Rutinas Reales", video_url: "https://youtube.com/shorts/7uJm8Ik90Ol?si=Ujmiko1234567890", tema_principal: "Adverbios de Frecuencia y Posición Oracional", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C13", clase_numero: 13, semana: 7, sesion: "A", titulo_clase: "Clase 12: Wh- Questions en Presente", titulo_video: "CLASE 12: What, Where, When, Who, Why, How", video_url: "https://youtube.com/shorts/9oKp0Lm12Qe?si=Ikmlpo1234567890", tema_principal: "Wh- Information Questions", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C14", clase_numero: 14, semana: 7, sesion: "B", titulo_clase: "Clase 13: La Hora y Preposiciones de Tiempo (At, In, On)", titulo_video: "CLASE 13: Domina At, In, On para Horas y Fechas", video_url: "https://youtube.com/shorts/1qAz2Ws34Rf?si=Okmijn1234567890", tema_principal: "Telling Time, At/In/On Temporal", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C15", clase_numero: 15, semana: 8, sesion: "A", titulo_clase: "Clase 14: Preposiciones de Lugar (In, On, Under, Next to)", titulo_video: "CLASE 14: Dónde están las cosas en tu habitación", video_url: "https://youtube.com/shorts/3eDc4Rf56Tg?si=Plmokn1234567890", tema_principal: "Preposiciones de Espacio y Ubicación", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C16", clase_numero: 16, semana: 8, sesion: "B", titulo_clase: "Clase 15: There is / There are (Existencia)", titulo_video: "CLASE 15: Cómo decir 'Hay' en Inglés sin Errores", video_url: "https://youtube.com/shorts/5tGb6Yh78Uj?si=Qazwsx0987654321", tema_principal: "There is (singular/incontable) vs There are (plural)", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C17", clase_numero: 17, semana: 9, sesion: "A", titulo_clase: "Clase 16: Habilidades y Habilidad con Can / Can't", titulo_video: "CLASE 16: I Can Speak English - Verbo Modal Can", video_url: "https://youtube.com/shorts/7uJm8Ik90Ol?si=Wsxedc0987654321", tema_principal: "Can, Can't, Peticiones y Permisos", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C18", clase_numero: 18, semana: 9, sesion: "B", titulo_clase: "Clase 17: Pronombres Objeto (Me, Him, Her, Us, Them)", titulo_video: "CLASE 17: Pronombres Objeto que Cambian tus Frases", video_url: "https://youtube.com/shorts/9oKp0Lm12Qe?si=Edcrfv0987654321", tema_principal: "Direct and Indirect Object Pronouns", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C19", clase_numero: 19, semana: 10, sesion: "A", titulo_clase: "Clase 18: Presente Continuo (Acciones Ahora)", titulo_video: "CLASE 18: I am Studying - Estructura del Presente Continuo", video_url: "https://youtube.com/shorts/2wSx3Ed45Rf?si=Tgbvfd0987654321", tema_principal: "Subject + Be + Verb-ING", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C20", clase_numero: 20, semana: 10, sesion: "B", titulo_clase: "Clase 19: Presente Simple vs Presente Continuo", titulo_video: "CLASE 19: Rutina vs En Este Momento - Duelo de Tiempos", video_url: "https://youtube.com/shorts/4eRf5Tg67Yh?si=Yhnujm0987654321", tema_principal: "Contrast between Habits and Ongoing Actions", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C21", clase_numero: 21, semana: 11, sesion: "A", titulo_clase: "Clase 20: Imperativos y Dar Instrucciones", titulo_video: "CLASE 20: Comandos, Señales y Direcciones en la Calle", video_url: "https://youtube.com/shorts/6yHn7Uj89Ik?si=Ujmiko0987654321", tema_principal: "Imperatives (Positive & Negative), Giving Directions", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C22", clase_numero: 22, semana: 11, sesion: "B", titulo_clase: "Clase 21: Adjetivos y su Posición en la Frase", titulo_video: "CLASE 21: ¿Un carro rojo o un red car? Posición correcta", video_url: "https://youtube.com/shorts/8uJm9Kl01Op?si=Ikmlpo0987654321", tema_principal: "Adjective Word Order and Modifiers", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C23", clase_numero: 23, semana: 12, sesion: "A", titulo_clase: "Clase 22: Comparativos Regulares (-er / more)", titulo_video: "CLASE 22: Taller de Comparaciones Rápidas", video_url: "https://youtube.com/shorts/1qAz2Ws34Rf?si=Plmokn0987654321", tema_principal: "Comparative Adjectives (-er than, more ... than)", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C24", clase_numero: 24, semana: 12, sesion: "B", titulo_clase: "Clase 23: Superlativos (The -est / The Most)", titulo_video: "CLASE 23: El Más Alto, El Más Rápido - Superlativos", video_url: "https://youtube.com/shorts/3eDc4Rf56Tg?si=Qazwsx1122334455", tema_principal: "Superlative Adjectives in Everyday Context", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C25", clase_numero: 25, semana: 13, sesion: "A", titulo_clase: "Clase 24: Pasado Simple del Verbo To Be (Was / Were)", titulo_video: "CLASE 24: I Was There - Pasado de Ser y Estar", video_url: "https://youtube.com/shorts/5tGb6Yh78Uj?si=Wsxedc1122334455", tema_principal: "Was, Were, Wasn't, Weren't", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C26", clase_numero: 26, semana: 13, sesion: "B", titulo_clase: "Clase 25: Pasado Simple - Verbos Regulares (-ed)", titulo_video: "CLASE 25: Los 3 Sonidos de la Terminación -ED", video_url: "https://youtube.com/shorts/7uJm8Ik90Ol?si=Edcrfv1122334455", tema_principal: "Past Simple Regular Verbs, Pronunciation /t/, /d/, /ɪd/", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C27", clase_numero: 27, semana: 14, sesion: "A", titulo_clase: "Clase 26: Pasado Simple - Verbos Irregulares Top 20", titulo_video: "CLASE 26: Went, Had, Did, Saw - Los Verbos Clave", video_url: "https://youtube.com/shorts/9oKp0Lm12Qe?si=Tgbvfd1122334455", tema_principal: "Irregular Past Verbs and Memory Hacks", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C28", clase_numero: 28, semana: 14, sesion: "B", titulo_clase: "Clase 27: Pasado Simple - Auxiliar Did / Didn't", titulo_video: "CLASE 27: Preguntas y Negaciones en Pasado", video_url: "https://youtube.com/shorts/2wSx3Ed45Rf?si=Yhnujm1122334455", tema_principal: "Did you go? I didn't see", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C29", clase_numero: 29, semana: 15, sesion: "A", titulo_clase: "Clase 28: Planes a Futuro con Be Going To", titulo_video: "CLASE 28: I am Going to Travel - Planes Reales", video_url: "https://youtube.com/shorts/4eRf5Tg67Yh?si=Ujmiko1122334455", tema_principal: "Be going to + Infinitive for Intentions", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C30", clase_numero: 30, semana: 15, sesion: "B", titulo_clase: "Clase 29: Consolidación Final & Proyecto A1", titulo_video: "CLASE 29: Tu Gran Examen Oral y Certificación A1", video_url: "https://youtube.com/shorts/6yHn7Uj89Ik?si=Ikmlpo1122334455", tema_principal: "Integración de las 5 Habilidades en Inglés Real", tipo_contenido: "original", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C31", clase_numero: 31, semana: 16, sesion: "A", titulo_clase: "Clase 30: Repaso de Fluidez Auditiva A1", titulo_video: "Repaso Auditivo A1: Audio Inmersivo y Acentos", video_url: "https://youtube.com/shorts/8uJm9Kl01Op?si=Plmokn1122334455", tema_principal: "Listening Comprehension Booster", tipo_contenido: "repaso", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C32", clase_numero: 32, semana: 16, sesion: "B", titulo_clase: "Clase 31: Taller de Redacción de Correos y Mensajes", titulo_video: "Cómo Escribir tu Primer Correo Profesional en Inglés", video_url: "https://youtube.com/shorts/1qAz2Ws34Rf?si=Qazwsx9988776655", tema_principal: "Writing Practical Messages & Emails", tipo_contenido: "taller", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C33", clase_numero: 33, semana: 17, sesion: "A", titulo_clase: "Clase 32: Estrategias de Examen MCER A1", titulo_video: "Técnicas para Aprobar cualquier Examen A1", video_url: "https://youtube.com/shorts/3eDc4Rf56Tg?si=Wsxedc9988776655", tema_principal: "Exam Strategies, Timing, Elimination Tactics", tipo_contenido: "repaso", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C34", clase_numero: 34, semana: 17, sesion: "B", titulo_clase: "Clase 33: Simulacro Global Parte 1 (Grammar & Reading)", titulo_video: "Simulacro en Vivo: Gramática y Comprensión", video_url: "https://youtube.com/shorts/5tGb6Yh78Uj?si=Edcrfv9988776655", tema_principal: "Mock Exam Section A", tipo_contenido: "repaso", duracion_min: 120, estado: "activo" },
  { clase_id: "A1_C35", clase_numero: 35, semana: 18, sesion: "A", titulo_clase: "Clase 34: Simulacro Global Parte 2 (Listening & Speaking)", titulo_video: "Simulacro en Vivo: Escucha y Producción Oral", video_url: "https://youtube.com/shorts/7uJm8Ik90Ol?si=Tgbvfd9988776655", tema_principal: "Mock Exam Section B & Graduation", tipo_contenido: "repaso", duracion_min: 120, estado: "activo" },
];

// 3. VOCABULARIO (Filas Maestro)
export const INITIAL_VOCABULARIO: SheetVocabularioRow[] = [
  // A1_C01: Pronombres Personales (7 tarjetas)
  { vocab_id: "A1_C01_V01", clase_id: "A1_C01", palabra_ingles: "I", palabra_espanol: "yo", categoria: "pronombre", pronunciacion_af: "/aɪ/", audio_url: "https://assets.teclingo.com/audio/I.mp3", ejemplo_uso: "I am a student.", dificultad: 1 },
  { vocab_id: "A1_C01_V02", clase_id: "A1_C01", palabra_ingles: "you", palabra_espanol: "tú / usted", categoria: "pronombre", pronunciacion_af: "/juː/", audio_url: "https://assets.teclingo.com/audio/you.mp3", ejemplo_uso: "You are my friend.", dificultad: 1 },
  { vocab_id: "A1_C01_V03", clase_id: "A1_C01", palabra_ingles: "he", palabra_espanol: "él", categoria: "pronombre", pronunciacion_af: "/hiː/", audio_url: "https://assets.teclingo.com/audio/he.mp3", ejemplo_uso: "He is a teacher.", dificultad: 1 },
  { vocab_id: "A1_C01_V04", clase_id: "A1_C01", palabra_ingles: "she", palabra_espanol: "ella", categoria: "pronombre", pronunciacion_af: "/ʃiː/", audio_url: "https://assets.teclingo.com/audio/she.mp3", ejemplo_uso: "She is Maria.", dificultad: 1 },
  { vocab_id: "A1_C01_V05", clase_id: "A1_C01", palabra_ingles: "it", palabra_espanol: "eso / ello", categoria: "pronombre", pronunciacion_af: "/ɪt/", audio_url: "https://assets.teclingo.com/audio/it.mp3", ejemplo_uso: "It is a book.", dificultad: 1 },
  { vocab_id: "A1_C01_V06", clase_id: "A1_C01", palabra_ingles: "we", palabra_espanol: "nosotros", categoria: "pronombre", pronunciacion_af: "/wiː/", audio_url: "https://assets.teclingo.com/audio/we.mp3", ejemplo_uso: "We are friends.", dificultad: 1 },
  { vocab_id: "A1_C01_V07", clase_id: "A1_C01", palabra_ingles: "they", palabra_espanol: "ellos", categoria: "pronombre", pronunciacion_af: "/ðeɪ/", audio_url: "https://assets.teclingo.com/audio/they.mp3", ejemplo_uso: "They are students.", dificultad: 1 },

  // A1_C01: Sustantivos Clave (7 tarjetas)
  { vocab_id: "A1_C01_V08", clase_id: "A1_C01", palabra_ingles: "student", palabra_espanol: "estudiante", categoria: "sustantivo", pronunciacion_af: "/ˈstjuːdənt/", audio_url: "https://assets.teclingo.com/audio/student.mp3", ejemplo_uso: "One student is here.", dificultad: 1 },
  { vocab_id: "A1_C01_V09", clase_id: "A1_C01", palabra_ingles: "students", palabra_espanol: "estudiantes", categoria: "sustantivo", pronunciacion_af: "/ˈstjuːdənts/", audio_url: "https://assets.teclingo.com/audio/students.mp3", ejemplo_uso: "Many students are here.", dificultad: 1 },
  { vocab_id: "A1_C01_V10", clase_id: "A1_C01", palabra_ingles: "book", palabra_espanol: "libro", categoria: "sustantivo", pronunciacion_af: "/bʊk/", audio_url: "https://assets.teclingo.com/audio/book.mp3", ejemplo_uso: "One book is here.", dificultad: 1 },
  { vocab_id: "A1_C01_V11", clase_id: "A1_C01", palabra_ingles: "books", palabra_espanol: "libros", categoria: "sustantivo", pronunciacion_af: "/bʊks/", audio_url: "https://assets.teclingo.com/audio/books.mp3", ejemplo_uso: "Two books are here.", dificultad: 1 },
  { vocab_id: "A1_C01_V12", clase_id: "A1_C01", palabra_ingles: "teacher", palabra_espanol: "profesor", categoria: "sustantivo", pronunciacion_af: "/ˈtiːtʃər/", audio_url: "https://assets.teclingo.com/audio/teacher.mp3", ejemplo_uso: "The teacher is here.", dificultad: 1 },
  { vocab_id: "A1_C01_V13", clase_id: "A1_C01", palabra_ingles: "friend", palabra_espanol: "amigo", categoria: "sustantivo", pronunciacion_af: "/frend/", audio_url: "https://assets.teclingo.com/audio/friend.mp3", ejemplo_uso: "He is my friend.", dificultad: 1 },
  { vocab_id: "A1_C01_V14", clase_id: "A1_C01", palabra_ingles: "classroom", palabra_espanol: "aula", categoria: "sustantivo", pronunciacion_af: "/ˈklɑːsruːm/", audio_url: "https://assets.teclingo.com/audio/classroom.mp3", ejemplo_uso: "We are in the classroom.", dificultad: 1 },
  { vocab_id: "A1_C02_V01", clase_id: "A1_C02", palabra_ingles: "student", palabra_espanol: "estudiante", categoria: "sustantivo", pronunciacion_af: "/ˈstjuːdənt/", audio_url: "https://assets.teclingo.com/audio/student.mp3", ejemplo_uso: "I am a student at the university.", dificultad: 1 },
  { vocab_id: "A1_C02_V02", clase_id: "A1_C02", palabra_ingles: "teacher", palabra_espanol: "profesor(a)", categoria: "sustantivo", pronunciacion_af: "/ˈtiːtʃər/", audio_url: "https://assets.teclingo.com/audio/teacher.mp3", ejemplo_uso: "She is my English teacher.", dificultad: 1 },
  { vocab_id: "A1_C02_V03", clase_id: "A1_C02", palabra_ingles: "doctor", palabra_espanol: "médico/a", categoria: "sustantivo", pronunciacion_af: "/ˈdɒktər/", audio_url: "https://assets.teclingo.com/audio/doctor.mp3", ejemplo_uso: "He is a doctor in Mexico City.", dificultad: 1 },
  { vocab_id: "A1_C02_V04", clase_id: "A1_C02", palabra_ingles: "engineer", palabra_espanol: "ingeniero/a", categoria: "sustantivo", pronunciacion_af: "/ˌɛndʒɪˈnɪər/", audio_url: "https://assets.teclingo.com/audio/engineer.mp3", ejemplo_uso: "We are software engineers.", dificultad: 2 },
  { vocab_id: "A1_C03_V01", clase_id: "A1_C03", palabra_ingles: "happy", palabra_espanol: "feliz", categoria: "adjetivo", pronunciacion_af: "/ˈhæpi/", audio_url: "https://assets.teclingo.com/audio/happy.mp3", ejemplo_uso: "Are you happy today?", dificultad: 1 },
  { vocab_id: "A1_C03_V02", clase_id: "A1_C03", palabra_ingles: "tired", palabra_espanol: "cansado/a", categoria: "adjetivo", pronunciacion_af: "/ˈtaɪərd/", audio_url: "https://assets.teclingo.com/audio/tired.mp3", ejemplo_uso: "I am not tired after work.", dificultad: 1 },
  { vocab_id: "A1_C03_V03", clase_id: "A1_C03", palabra_ingles: "ready", palabra_espanol: "listo/a", categoria: "adjetivo", pronunciacion_af: "/ˈrɛdi/", audio_url: "https://assets.teclingo.com/audio/ready.mp3", ejemplo_uso: "Is the team ready for the lesson?", dificultad: 1 },
  { vocab_id: "A1_C03_V04", clase_id: "A1_C03", palabra_ingles: "busy", palabra_espanol: "ocupado/a", categoria: "adjetivo", pronunciacion_af: "/ˈbɪzi/", audio_url: "https://assets.teclingo.com/audio/busy.mp3", ejemplo_uso: "They aren't busy right now.", dificultad: 1 },
  { vocab_id: "A1_C04_V01", clase_id: "A1_C04", palabra_ingles: "apple", palabra_espanol: "manzana", categoria: "sustantivo", pronunciacion_af: "/ˈæpəl/", audio_url: "https://assets.teclingo.com/audio/apple.mp3", ejemplo_uso: "There are two apples on the desk.", dificultad: 1 },
  { vocab_id: "A1_C04_V02", clase_id: "A1_C04", palabra_ingles: "water", palabra_espanol: "agua", categoria: "sustantivo", pronunciacion_af: "/ˈwɔːtər/", audio_url: "https://assets.teclingo.com/audio/water.mp3", ejemplo_uso: "Do you have some water?", dificultad: 1 },
  { vocab_id: "A1_C04_V03", clase_id: "A1_C04", palabra_ingles: "money", palabra_espanol: "dinero", categoria: "sustantivo", pronunciacion_af: "/ˈmʌni/", audio_url: "https://assets.teclingo.com/audio/money.mp3", ejemplo_uso: "How much money do we need?", dificultad: 1 },
  { vocab_id: "A1_C04_V04", clase_id: "A1_C04", palabra_ingles: "information", palabra_espanol: "información", categoria: "sustantivo", pronunciacion_af: "/ˌɪnfərˈmeɪʃən/", audio_url: "https://assets.teclingo.com/audio/information.mp3", ejemplo_uso: "This information is very useful.", dificultad: 2 },
  { vocab_id: "A1_C05_V01", clase_id: "A1_C05", palabra_ingles: "book", palabra_espanol: "libro", categoria: "sustantivo", pronunciacion_af: "/bʊk/", audio_url: "https://assets.teclingo.com/audio/book.mp3", ejemplo_uso: "This is Maria's book.", dificultad: 1 },
  { vocab_id: "A1_C05_V02", clase_id: "A1_C05", palabra_ingles: "car", palabra_espanol: "carro / auto", categoria: "sustantivo", pronunciacion_af: "/kɑːr/", audio_url: "https://assets.teclingo.com/audio/car.mp3", ejemplo_uso: "John's car is blue.", dificultad: 1 },
  { vocab_id: "A1_C05_V03", clase_id: "A1_C05", palabra_ingles: "house", palabra_espanol: "casa", categoria: "sustantivo", pronunciacion_af: "/haʊs/", audio_url: "https://assets.teclingo.com/audio/house.mp3", ejemplo_uso: "My parents' house is very big.", dificultad: 1 },
  { vocab_id: "A1_C05_V04", clase_id: "A1_C05", palabra_ingles: "laptop", palabra_espanol: "computadora portátil", categoria: "sustantivo", pronunciacion_af: "/ˈlæptɒp/", audio_url: "https://assets.teclingo.com/audio/laptop.mp3", ejemplo_uso: "Is this the teacher's laptop?", dificultad: 1 },
  { vocab_id: "A1_C06_V01", clase_id: "A1_C06", palabra_ingles: "mine", palabra_espanol: "mío / mía", categoria: "pronombre", pronunciacion_af: "/maɪn/", audio_url: "https://assets.teclingo.com/audio/mine.mp3", ejemplo_uso: "That notebook is mine.", dificultad: 1 },
  { vocab_id: "A1_C06_V02", clase_id: "A1_C06", palabra_ingles: "yours", palabra_espanol: "tuyo / tuya", categoria: "pronombre", pronunciacion_af: "/jɔːrz/", audio_url: "https://assets.teclingo.com/audio/yours.mp3", ejemplo_uso: "The coffee on the table is yours.", dificultad: 1 },
  { vocab_id: "A1_C06_V03", clase_id: "A1_C06", palabra_ingles: "theirs", palabra_espanol: "de ellos / de ellas", categoria: "pronombre", pronunciacion_af: "/ðɛərz/", audio_url: "https://assets.teclingo.com/audio/theirs.mp3", ejemplo_uso: "Those project folders are theirs.", dificultad: 2 },
  { vocab_id: "A1_C06_V04", clase_id: "A1_C06", palabra_ingles: "ours", palabra_espanol: "nuestro / nuestra", categoria: "pronombre", pronunciacion_af: "/ˈaʊərz/", audio_url: "https://assets.teclingo.com/audio/ours.mp3", ejemplo_uso: "The success is ours.", dificultad: 2 },
  { vocab_id: "A1_C07_V01", clase_id: "A1_C07", palabra_ingles: "this", palabra_espanol: "este / esta (cerca)", categoria: "pronombre", pronunciacion_af: "/ðɪs/", audio_url: "https://assets.teclingo.com/audio/this.mp3", ejemplo_uso: "This is my favorite phone.", dificultad: 1 },
  { vocab_id: "A1_C07_V02", clase_id: "A1_C07", palabra_ingles: "that", palabra_espanol: "ese / aquel (lejos)", categoria: "pronombre", pronunciacion_af: "/ðæt/", audio_url: "https://assets.teclingo.com/audio/that.mp3", ejemplo_uso: "That building is the library.", dificultad: 1 },
  { vocab_id: "A1_C07_V03", clase_id: "A1_C07", palabra_ingles: "these", palabra_espanol: "estos / estas (cerca)", categoria: "pronombre", pronunciacion_af: "/ðiːz/", audio_url: "https://assets.teclingo.com/audio/these.mp3", ejemplo_uso: "These headphones sound great.", dificultad: 1 },
  { vocab_id: "A1_C07_V04", clase_id: "A1_C07", palabra_ingles: "those", palabra_espanol: "esos / aquellos (lejos)", categoria: "pronombre", pronunciacion_af: "/ðoʊz/", audio_url: "https://assets.teclingo.com/audio/those.mp3", ejemplo_uso: "Those trees are very tall.", dificultad: 1 },
  { vocab_id: "A1_C08_V01", clase_id: "A1_C08", palabra_ingles: "hour", palabra_espanol: "hora (sonido vocal)", categoria: "sustantivo", pronunciacion_af: "/ˈaʊər/", audio_url: "https://assets.teclingo.com/audio/hour.mp3", ejemplo_uso: "We have an hour for lunch.", dificultad: 2 },
  { vocab_id: "A1_C08_V02", clase_id: "A1_C08", palabra_ingles: "university", palabra_espanol: "universidad (sonido consonante /j/)", categoria: "sustantivo", pronunciacion_af: "/ˌjuːnɪˈvɜːrsəti/", audio_url: "https://assets.teclingo.com/audio/university.mp3", ejemplo_uso: "She studies at a university.", dificultad: 2 },
  { vocab_id: "A1_C08_V03", clase_id: "A1_C08", palabra_ingles: "umbrella", palabra_espanol: "paraguas", categoria: "sustantivo", pronunciacion_af: "/ʌmˈbrɛlə/", audio_url: "https://assets.teclingo.com/audio/umbrella.mp3", ejemplo_uso: "Take an umbrella today.", dificultad: 1 },
  { vocab_id: "A1_C08_V04", clase_id: "A1_C08", palabra_ingles: "hotel", palabra_espanol: "hotel", categoria: "sustantivo", pronunciacion_af: "/hoʊˈtɛl/", audio_url: "https://assets.teclingo.com/audio/hotel.mp3", ejemplo_uso: "They stay at a quiet hotel.", dificultad: 1 },
  { vocab_id: "A1_C09_V01", clase_id: "A1_C09", palabra_ingles: "brother", palabra_espanol: "hermano", categoria: "sustantivo", pronunciacion_af: "/ˈbrʌðər/", audio_url: "https://assets.teclingo.com/audio/brother.mp3", ejemplo_uso: "I have one brother.", dificultad: 1 },
  { vocab_id: "A1_C09_V02", clase_id: "A1_C09", palabra_ingles: "sister", palabra_espanol: "hermana", categoria: "sustantivo", pronunciacion_af: "/ˈsɪstər/", audio_url: "https://assets.teclingo.com/audio/sister.mp3", ejemplo_uso: "She has two sisters.", dificultad: 1 },
  { vocab_id: "A1_C09_V03", clase_id: "A1_C09", palabra_ingles: "pet", palabra_espanol: "mascota", categoria: "sustantivo", pronunciacion_af: "/pɛt/", audio_url: "https://assets.teclingo.com/audio/pet.mp3", ejemplo_uso: "Do you have any pets?", dificultad: 1 },
  { vocab_id: "A1_C09_V04", clase_id: "A1_C09", palabra_ingles: "family", palabra_espanol: "familia", categoria: "sustantivo", pronunciacion_af: "/ˈfæmɪli/", audio_url: "https://assets.teclingo.com/audio/family.mp3", ejemplo_uso: "We have a wonderful family.", dificultad: 1 },
  { vocab_id: "A1_C10_V01", clase_id: "A1_C10", palabra_ingles: "always", palabra_espanol: "siempre (100%)", categoria: "adverbio", pronunciacion_af: "/ˈɔːlweɪz/", audio_url: "https://assets.teclingo.com/audio/always.mp3", ejemplo_uso: "He always works hard.", dificultad: 1 },
  { vocab_id: "A1_C10_V02", clase_id: "A1_C10", palabra_ingles: "usually", palabra_espanol: "usualmente (80%)", categoria: "adverbio", pronunciacion_af: "/ˈjuːʒuəli/", audio_url: "https://assets.teclingo.com/audio/usually.mp3", ejemplo_uso: "She usually drinks tea in the morning.", dificultad: 1 },
  { vocab_id: "A1_C10_V03", clase_id: "A1_C10", palabra_ingles: "sometimes", palabra_espanol: "a veces (50%)", categoria: "adverbio", pronunciacion_af: "/ˈsʌmtaɪmz/", audio_url: "https://assets.teclingo.com/audio/sometimes.mp3", ejemplo_uso: "We sometimes study together.", dificultad: 1 },
  { vocab_id: "A1_C10_V04", clase_id: "A1_C10", palabra_ingles: "never", palabra_espanol: "nunca (0%)", categoria: "adverbio", pronunciacion_af: "/ˈnɛvər/", audio_url: "https://assets.teclingo.com/audio/never.mp3", ejemplo_uso: "He never arrives late.", dificultad: 1 },
  { vocab_id: "A1_C11_V01", clase_id: "A1_C11", palabra_ingles: "breakfast", palabra_espanol: "desayuno", categoria: "sustantivo", pronunciacion_af: "/ˈbrɛkfəst/", audio_url: "https://assets.teclingo.com/audio/breakfast.mp3", ejemplo_uso: "Do you eat breakfast every day?", dificultad: 1 },
  { vocab_id: "A1_C11_V02", clase_id: "A1_C11", palabra_ingles: "routine", palabra_espanol: "rutina", categoria: "sustantivo", pronunciacion_af: "/ruːˈtiːn/", audio_url: "https://assets.teclingo.com/audio/routine.mp3", ejemplo_uso: "My morning routine is very simple.", dificultad: 1 },
];

// 4. VERBOS (27 Filas)
export const INITIAL_VERBOS: SheetVerboRow[] = [
  { verbo_id: "V01", clase_id: "A1_C02", infinitivo: "to be", traduccion: "ser / estar", presente_simple: "am, are", tercera_persona: "is", pasado_simple: "was, were", participio: "been", tipo: "irregular", ejemplo_oracion: "She is an engineer." },
  { verbo_id: "V02", clase_id: "A1_C09", infinitivo: "to have", traduccion: "tener / haber", presente_simple: "have", tercera_persona: "has", pasado_simple: "had", participio: "had", tipo: "irregular", ejemplo_oracion: "I have two brothers." },
  { verbo_id: "V03", clase_id: "A1_C11", infinitivo: "to do", traduccion: "hacer", presente_simple: "do", tercera_persona: "does", pasado_simple: "did", participio: "done", tipo: "irregular", ejemplo_oracion: "Do you play guitar?" },
  { verbo_id: "V04", clase_id: "A1_C10", infinitivo: "to work", traduccion: "trabajar", presente_simple: "work", tercera_persona: "works", pasado_simple: "worked", participio: "worked", tipo: "regular", ejemplo_oracion: "Carlos works at a clinic." },
  { verbo_id: "V05", clase_id: "A1_C10", infinitivo: "to study", traduccion: "estudiar", presente_simple: "study", tercera_persona: "studies", pasado_simple: "studied", participio: "studied", tipo: "regular", ejemplo_oracion: "She studies English daily." },
  { verbo_id: "V06", clase_id: "A1_C10", infinitivo: "to go", traduccion: "ir", presente_simple: "go", tercera_persona: "goes", pasado_simple: "went", participio: "gone", tipo: "irregular", ejemplo_oracion: "He goes to school by bus." },
  { verbo_id: "V07", clase_id: "A1_C10", infinitivo: "to live", traduccion: "vivir", presente_simple: "live", tercera_persona: "lives", pasado_simple: "lived", participio: "lived", tipo: "regular", ejemplo_oracion: "They live in Guadalajara." },
  { verbo_id: "V08", clase_id: "A1_C17", infinitivo: "to speak", traduccion: "hablar", presente_simple: "speak", tercera_persona: "speaks", pasado_simple: "spoke", participio: "spoken", tipo: "irregular", ejemplo_oracion: "Can you speak Spanish?" },
  { verbo_id: "V09", clase_id: "A1_C11", infinitivo: "to listen", traduccion: "escuchar", presente_simple: "listen", tercera_persona: "listens", pasado_simple: "listened", participio: "listened", tipo: "regular", ejemplo_oracion: "We listen to the teacher." },
  { verbo_id: "V10", clase_id: "A1_C05", infinitivo: "to read", traduccion: "leer", presente_simple: "read", tercera_persona: "reads", pasado_simple: "read (/rɛd/)", participio: "read", tipo: "irregular", ejemplo_oracion: "I read an article every day." },
  { verbo_id: "V11", clase_id: "A1_C32", infinitivo: "to write", traduccion: "escribir", presente_simple: "write", tercera_persona: "writes", pasado_simple: "wrote", participio: "written", tipo: "irregular", ejemplo_oracion: "She writes clear emails." },
  { verbo_id: "V12", clase_id: "A1_C11", infinitivo: "to make", traduccion: "fabricar / hacer", presente_simple: "make", tercera_persona: "makes", pasado_simple: "made", participio: "made", tipo: "irregular", ejemplo_oracion: "He makes fresh coffee." },
  { verbo_id: "V13", clase_id: "A1_C14", infinitivo: "to take", traduccion: "tomar / llevar", presente_simple: "take", tercera_persona: "takes", pasado_simple: "took", participio: "taken", tipo: "irregular", ejemplo_oracion: "I take the metro at 7 AM." },
  { verbo_id: "V14", clase_id: "A1_C20", infinitivo: "to get", traduccion: "conseguir / llegar", presente_simple: "get", tercera_persona: "gets", pasado_simple: "got", participio: "gotten", tipo: "irregular", ejemplo_oracion: "She gets home early." },
  { verbo_id: "V15", clase_id: "A1_C11", infinitivo: "to eat", traduccion: "comer", presente_simple: "eat", tercera_persona: "eats", pasado_simple: "ate", participio: "eaten", tipo: "irregular", ejemplo_oracion: "We eat fruit for breakfast." },
  { verbo_id: "V16", clase_id: "A1_C04", infinitivo: "to drink", traduccion: "beber", presente_simple: "drink", tercera_persona: "drinks", pasado_simple: "drank", participio: "drunk", tipo: "irregular", ejemplo_oracion: "Drink plenty of water." },
  { verbo_id: "V17", clase_id: "A1_C12", infinitivo: "to sleep", traduccion: "dormir", presente_simple: "sleep", tercera_persona: "sleeps", pasado_simple: "slept", participio: "slept", tipo: "irregular", ejemplo_oracion: "He sleeps 8 hours every night." },
  { verbo_id: "V18", clase_id: "A1_C04", infinitivo: "to buy", traduccion: "comprar", presente_simple: "buy", tercera_persona: "buys", pasado_simple: "bought", participio: "bought", tipo: "irregular", ejemplo_oracion: "They buy fresh bread." },
  { verbo_id: "V19", clase_id: "A1_C27", infinitivo: "to see", traduccion: "ver", presente_simple: "see", tercera_persona: "sees", pasado_simple: "saw", participio: "seen", tipo: "irregular", ejemplo_oracion: "I saw my friend yesterday." },
  { verbo_id: "V20", clase_id: "A1_C31", infinitivo: "to hear", traduccion: "oír", presente_simple: "hear", tercera_persona: "hears", pasado_simple: "heard", participio: "heard", tipo: "irregular", ejemplo_oracion: "Can you hear the music?" },
  { verbo_id: "V21", clase_id: "A1_C09", infinitivo: "to want", traduccion: "querer", presente_simple: "want", tercera_persona: "wants", pasado_simple: "wanted", participio: "wanted", tipo: "regular", ejemplo_oracion: "She wants to learn French." },
  { verbo_id: "V22", clase_id: "A1_C09", infinitivo: "to need", traduccion: "necesitar", presente_simple: "need", tercera_persona: "needs", pasado_simple: "needed", participio: "needed", tipo: "regular", ejemplo_oracion: "We need more practice." },
  { verbo_id: "V23", clase_id: "A1_C11", infinitivo: "to like", traduccion: "gustar", presente_simple: "like", tercera_persona: "likes", pasado_simple: "liked", participio: "liked", tipo: "regular", ejemplo_oracion: "Do you like classical music?" },
  { verbo_id: "V24", clase_id: "A1_C17", infinitivo: "can", traduccion: "poder (modal)", presente_simple: "can", tercera_persona: "can", pasado_simple: "could", participio: "could", tipo: "irregular", ejemplo_oracion: "I can drive a car." },
  { verbo_id: "V25", clase_id: "A1_C11", infinitivo: "to play", traduccion: "jugar / tocar", presente_simple: "play", tercera_persona: "plays", pasado_simple: "played", participio: "played", tipo: "regular", ejemplo_oracion: "He plays soccer on Sundays." },
  { verbo_id: "V26", clase_id: "A1_C12", infinitivo: "to watch", traduccion: "mirar / ver", presente_simple: "watch", tercera_persona: "watches", pasado_simple: "watched", participio: "watched", tipo: "regular", ejemplo_oracion: "We watch YouTube lessons." },
  { verbo_id: "V27", clase_id: "A1_C29", infinitivo: "to come", traduccion: "venir", presente_simple: "come", tercera_persona: "comes", pasado_simple: "came", participio: "come", tipo: "irregular", ejemplo_oracion: "Are you coming to the meeting?" },
];

// 5. TEXTO_EXPLICATIVO (10 Filas - Datos Exactos provistos por el usuario)
export const INITIAL_TEXTO_EXPLICATIVO: SheetTextoExplicativoRow[] = [
  {
    explicacion_id: "A1_C01_EXP",
    clase_id: "A1_C01",
    titulo_explicacion: "Fase Cero: Fundamentos de Cantidad y Clasificación de Sujetos",
    contenido_html: `<h3>Fase Cero: Fundamentos de Cantidad y Clasificación de Sujetos</h3>
<p>Para construir una base lingüística sólida y evitar errores sistemáticos de traducción, es indispensable dominar la estructura de los sujetos antes de introducir cualquier verbo o regla gramatical compleja.</p>
<h4>1. El Concepto de Cantidad: Singular vs. Plural</h4>
<p>El primer paso para pensar en inglés consiste en clasificar todo elemento del entorno según su número gramatical:</p>
<ul>
  <li><b>Singular (Concepto "Uno"):</b> Se refiere de manera estricta a una sola entidad (objeto, persona o concepto). Por ejemplo: <code>"student"</code> (estudiante), <code>"book"</code> (libro), <code>"office"</code> (oficina).</li>
  <li><b>Plural (Concepto "Varios" / "Más de uno"):</b> Representa a dos o más entidades de la misma clase. En inglés, por regla general, se añade el sufijo <b>"-s"</b> o <b>"-es"</b> al sustantivo. Por ejemplo: <code>"students"</code> (estudiantes), <code>"books"</code> (libros), <code>"offices"</code> (oficinas).</li>
</ul>
<h4>2. El Filtro Maestro R.O.D. (Procesamiento de Pronombres)</h4>
<p>Para eliminar la memorización mecánica de conjugaciones desordenadas, el sistema de aprendizaje procesa los pronombres personales a través de tres canales lógicos e inflexibles:</p>
<p><b>Canal Azul (Primera Persona):</b> El pronombre <code>"I"</code> (Yo). Representa exclusivamente al emisor del mensaje. Es un canal unifilar y prioritario que cuenta con su propia salida verbal dedicada.</p>
<p><b>Canal Verde (Bloque Plural):</b> Los pronombres <code>"You"</code> (Tú / Usted / Ustedes), <code>"We"</code> (Nosotros / Nosotras) y <code>"They"</code> (Ellos / Ellas).</p>
<p><b>La Regla de Oro de Teclingo:</b> En nuestro método, el pronombre <code>"You"</code> se clasifica y se procesa estructuralmente dentro del bloque de los Plurales. ¿Por qué? En el inglés moderno no existe un pronombre independiente para "ustedes"; <code>"You"</code> absorbe tanto la función singular como la plural. <i>Anclaje Cognitivo:</i> ¿Quiénes somos "tú" y "yo"? Nosotros (Plural). Por ende, todo el bloque comparte el mismo auxiliar de salida.</p>
<p><b>Canal Naranja (Bloque Singular de Tercera Persona):</b> Los pronombres <code>"He"</code> (Él), <code>"She"</code> (Ella) e <code>"It"</code> (Eso / objeto / animal / concepto). Representa a las personas u objetos fuera de la interacción directa del habla.</p>
<h4>3. La Regla de Oro Sintáctica: El Sujeto Obligatorio</h4>
<p>A diferencia del español, donde es común omitir el sujeto en la oración (ej: "Estamos en la biblioteca"), en inglés la omisión del pronombre o sujeto es incorrecta. Toda oración requiere declarar explícitamente quién o qué ejecuta la acción.</p>
<p>Ejemplo en español: "Es un libro." ❌<br/>Ejemplo en inglés: <code>"It is a book."</code> ✅</p>
<h4>4. Tabla de Conexión Direccional (Fase Cero → Verbo To Be)</h4>
<ul>
  <li><b>Primera Persona (Singular):</b> Pronombre <code>"I"</code> → Verbo <code>"am"</code> → Equivalencia: "Yo soy / Yo estoy" → Ejemplo: <code>"I am a student."</code> (Yo soy estudiante.)</li>
  <li><b>Segundas Personas (Plurales):</b> Pronombres <code>"You, We, They"</code> → Verbo <code>"are"</code> → Equivalencia: "Tú eres, Nosotros somos, Ellos son / están" → Ejemplo: <code>"They are friends."</code> (Ellos son amigos.)</li>
  <li><b>Terceras Personas (Singulares):</b> Pronombres <code>"He, She, It"</code> → Verbo <code>"is"</code> → Equivalencia: "Él es, Ella es, (Eso) es / está" → Ejemplo: <code>"He is a teacher."</code> (Él es maestro.)</li>
</ul>`,
    contenido_markdown: `## Fase Cero: Fundamentos de Cantidad y Clasificación de Sujetos

Para construir una base lingüística sólida y evitar errores sistemáticos de traducción, es indispensable dominar la estructura de los sujetos antes de introducir cualquier verbo o regla gramatical compleja.

### 1. El Concepto de Cantidad: Singular vs. Plural

El primer paso para pensar en inglés consiste en clasificar todo elemento del entorno según su número gramatical:

- **Singular (Concepto "Uno"):** Se refiere de manera estricta a una sola entidad (objeto, persona o concepto). Por ejemplo: "student" (estudiante), "book" (libro), "office" (oficina).
- **Plural (Concepto "Varios" / "Más de uno"):** Representa a dos o más entidades de la misma clase. En inglés, por regla general, se añade el sufijo "-s" o "-es" al sustantivo. Por ejemplo: "students" (estudiantes), "books" (libros), "offices" (oficinas).

### 2. El Filtro Maestro R.O.D. (Procesamiento de Pronombres)

Para eliminar la memorización mecánica de conjugaciones desordenadas, el sistema de aprendizaje procesa los pronombres personales a través de tres canales lógicos e inflexibles:

**Canal Azul (Primera Persona):** El pronombre "I" (Yo). Representa exclusivamente al emisor del mensaje. Es un canal unifilar y prioritario que cuenta con su propia salida verbal dedicada.

**Canal Verde (Bloque Plural):** Los pronombres "You" (Tú / Usted / Ustedes), "We" (Nosotros / Nosotras) y "They" (Ellos / Ellas). 

**La Regla de Oro de Teclingo:** En nuestro método, el pronombre "You" se clasifica y se procesa estructuralmente dentro del bloque de los Plurales. 

¿Por qué? En el inglés moderno no existe un pronombre sólido e independiente para la palabra "ustedes"; "You" absorbe tanto la función singular como la plural. Además, la interacción comunicativa requiere como mínimo de dos entidades (emisor y receptor).

Anclaje Cognitivo: Si el estudiante experimenta alguna duda sobre la naturaleza de este bloque, se aplica la siguiente regla de descarte: ¿Quiénes somos "tú" y "yo" en los pronombres? Nosotros (Plural). Por ende, todo el bloque comparte el mismo auxiliar de salida.

**Canal Naranja (Bloque Singular de Tercera Persona):** Los pronombres "He" (Él), "She" (Ella) e "It" (Eso / objeto / animal / concepto). Representa a las personas u objetos que están fuera de la interacción directa del habla. Toda entidad singular externa se procesa unificadamente a través de este canal.

### 3. La Regla de Oro Sintáctica: El Sujeto Obligatorio

A diferencia del español, donde es común omitir el sujeto en la oración (por ejemplo: "Estamos en la biblioteca"), en el idioma inglés la omisión del pronombre o sujeto es incorrecta. Toda oración requiere de manera obligatoria declarar explícitamente quién o qué ejecuta la acción o experimenta el estado.

Ejemplo en español (sujeto elidido): "Es un libro." ❌
Ejemplo en inglés (estructura obligatoria): "It is a book." ✅

### 4. Tabla de Conexión Direccional (Fase Cero → Verbo To Be)

Esta matriz integra los cimientos de la Fase Cero con la conjugación en tiempo presente, demostrando al alumno que la asignación del verbo no es aleatoria, sino el resultado lógico de su clasificación previa:

- **Primera Persona (Singular):** Pronombre "I" → Verbo "am" → Equivalencia: "Yo soy / Yo estoy" → Ejemplo: "I am a student." (Yo soy estudiante.)
- **Segundas Personas (Plurales):** Pronombres "You, We, They" → Verbo "are" → Equivalencia: "Tú eres, Nosotros somos, Ellos son / están" → Ejemplo: "They are friends." (Ellos son amigos.)
- **Terceras Personas (Singulares):** Pronombres "He, She, It" → Verbo "is" → Equivalencia: "Él es, Ella es, (Eso) es / está" → Ejemplo: "He is a teacher." (Él es maestro.)`,
    ejemplos_tabla_json: `[{"singular":"student","plural":"students","traduccion":"estudiante"},{"singular":"book","plural":"books","traduccion":"libro"},{"singular":"office","plural":"offices","traduccion":"oficina"},{"singular":"child","plural":"children","traduccion":"niño(a)"},{"singular":"person","plural":"people","traduccion":"persona"}]`,
    reglas_clave: "YOU = plural siempre (Regla de Oro de TecLingo). En inglés el sujeto es estrictamente OBLIGATORIO (ej. 'It is a book').",
    duracion_lectura_min: 4,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C02_EXP",
    clase_id: "A1_C02",
    titulo_explicacion: "El Verbo To Be en Presente",
    contenido_html: "<p>El verbo <b>\"To Be\"</b> significa SER o ESTAR en español. Cuenta con tres formas en presente: <b>\"am\"</b>, <b>\"is\"</b> y <b>\"are\"</b>. Con el pronombre <b>\"I\"</b> se utiliza <b>\"am\"</b>; con <b>\"He\"</b>, <b>\"She\"</b>, <b>\"It\"</b> se utiliza <b>\"is\"</b>; y con <b>\"You\"</b>, <b>\"We\"</b>, <b>\"They\"</b> se utiliza <b>\"are\"</b>. Por ejemplo: <code>\"I am a student.\"</code> (Yo soy estudiante).</p>",
    contenido_markdown: "El verbo \"To Be\" significa SER o ESTAR en español. Cuenta con tres formas en presente: \"am\", \"is\" y \"are\". Con el pronombre \"I\" se utiliza \"am\"; con \"He\", \"She\", \"It\" se utiliza \"is\"; y con \"You\", \"We\", \"They\" se utiliza \"are\". Por ejemplo: \"I am a student\" (Yo soy estudiante) y \"She is a teacher\" (Ella es profesora).",
    ejemplos_tabla_json: `[{"pronombre":"I","llave":"am","ejemplo":"I am a student.","traduccion":"Yo soy estudiante."},{"pronombre":"He/She/It","llave":"is","ejemplo":"She is a teacher.","traduccion":"Ella es profesora."},{"pronombre":"You/We/They","llave":"are","ejemplo":"They are friends.","traduccion":"Ellos son amigos."}]`,
    reglas_clave: "\"I\"=\"am\", \"He/She/It\"=\"is\", \"You/We/They\"=\"are\"",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C03_EXP",
    clase_id: "A1_C03",
    titulo_explicacion: "El Verbo Auxiliar: Negación e Interrogación",
    contenido_html: "<p>Para formular <b>preguntas</b> o <b>negaciones</b> en inglés, requerimos la función de verbo auxiliar. Con el verbo <b>\"To Be\"</b>, para negar añadimos la partícula <b>\"not\"</b>. Por ejemplo: <code>\"She is not happy.\"</code> (Ella no está feliz). Para preguntar, invertimos el orden: <code>\"Is she happy?\"</code> (¿Está ella feliz?).</p>",
    contenido_markdown: "Para formular preguntas o negaciones en inglés, requerimos la función de verbo auxiliar. Con el verbo \"To Be\", para negar añadimos la partícula \"not\". Por ejemplo: \"She is not happy\" (Ella no está feliz). Para preguntar, invertimos el orden: \"Is she happy?\" (¿Está ella feliz?).",
    ejemplos_tabla_json: `[{"tipo":"afirmacion","ejemplo":"She is a teacher.","traduccion":"Ella es profesora."},{"tipo":"negacion","ejemplo":"She is not a teacher.","traduccion":"Ella no es profesora."},{"tipo":"pregunta","ejemplo":"Is she a teacher?","traduccion":"¿Es ella profesora?"}]`,
    reglas_clave: "Para negar: agregar \"not\". Para preguntar: invertir orden (\"Is she...?\").",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C04_EXP",
    clase_id: "A1_C04",
    titulo_explicacion: "Sustantivos Contables e Incontables",
    contenido_html: "<p>Los sustantivos <b>contables</b> se pueden cuantificar por unidades: <code>\"one apple\"</code> (una manzana), <code>\"two apples\"</code> (dos manzanas). Los <b>incontables</b> no se pueden dividir individualmente: <code>\"water\"</code> (agua), <code>\"money\"</code> (dinero), <code>\"information\"</code> (información).</p>",
    contenido_markdown: "Los sustantivos contables se pueden cuantificar por unidades: \"one apple\" (una manzana), \"two apples\" (dos manzanas). Los incontables no se pueden dividir individualmente: \"water\" (agua), \"money\" (dinero), \"information\" (información). Esta diferencia determina el uso de cuantificadores.",
    ejemplos_tabla_json: `[{"tipo":"contable","ejemplos":["apple","book","car"]},{"tipo":"incontable","ejemplos":["water","money","information"]}]`,
    reglas_clave: "Contables: se cuentan con números (\"one apple\"). Incontables: masa indivisible (\"water\").",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C05_EXP",
    clase_id: "A1_C05",
    titulo_explicacion: "La Posesión: Dueño + 's + Objeto",
    contenido_html: "<p>Para indicar posesión en personas, usamos el apóstrofe y la letra ese <b>\"'s\"</b>. La fórmula invariable es: <b>Dueño + 's + Objeto</b>. Por ejemplo: <code>\"Maria's book\"</code> (El libro de María) y <code>\"John's car\"</code> (El carro de John).</p>",
    contenido_markdown: "Para indicar posesión en personas, usamos el apóstrofe y la letra ese \"'s\". La fórmula invariable es: Dueño + 's + Objeto. Por ejemplo: \"Maria's book\" (El libro de María) y \"John's car\" (El carro de John).",
    ejemplos_tabla_json: `[{"dueno":"Maria","objeto":"book","frase":"Maria's book","traduccion":"El libro de María"},{"dueno":"John","objeto":"car","frase":"John's car","traduccion":"El carro de John"}]`,
    reglas_clave: "Fórmula de posesión: Dueño + 's + Objeto (ej. \"Maria's book\").",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C06_EXP",
    clase_id: "A1_C06",
    titulo_explicacion: "Pronombres Posesivos",
    contenido_html: "<p>Los pronombres posesivos sustituyen al sustantivo para evitar redundancias. Por ejemplo: <code>\"This book is mine.\"</code> (Este libro es mío) frente a <code>\"This car is yours.\"</code> (Este coche es tuyo). Relación: <b>\"my\"</b> cambia a <b>\"mine\"</b>, y <b>\"your\"</b> a <b>\"yours\"</b>.</p>",
    contenido_markdown: "Los pronombres posesivos sustituyen al sustantivo para evitar redundancias. Por ejemplo: \"This book is mine\" (Este libro es mío) y \"This car is yours\" (Este coche es tuyo). Relación: \"my\" cambia a \"mine\", \"your\" a \"yours\", \"her\" a \"hers\".",
    ejemplos_tabla_json: `[{"adjetivo":"MY","pronombre":"MINE","ejemplo":"This book is mine.","traduccion":"Este libro es mío."},{"adjetivo":"YOUR","pronombre":"YOURS","ejemplo":"This car is yours.","traduccion":"Este coche es tuyo."}]`,
    reglas_clave: "\"my\"→\"mine\", \"your\"→\"yours\", \"her\"→\"hers\", \"our\"→\"ours\"",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C07_EXP",
    clase_id: "A1_C07",
    titulo_explicacion: "Demostrativos: This, That, These, Those",
    contenido_html: "<p>Los demostrativos indican cercanía física o temporal y cantidad. Para objetos cercanos: <code>\"This\"</code> (singular) y <code>\"These\"</code> (plural). Para objetos lejanos: <code>\"That\"</code> (singular) y <code>\"Those\"</code> (plural). Ejemplo: <code>\"This is a book.\"</code> (Este es un libro).</p>",
    contenido_markdown: "Los demostrativos indican cercanía y número. Cerca: \"This\" (singular) y \"These\" (plural). Lejos: \"That\" (singular) y \"Those\" (plural). Por ejemplo: \"This is a book\" (Este es un libro) y \"Those are cars\" (Aquellos son autos).",
    ejemplos_tabla_json: `[{"distancia":"cerca","numero":"singular","palabra":"This","ejemplo":"This is a book.","traduccion":"Este es un libro."},{"distancia":"cerca","numero":"plural","palabra":"These","ejemplo":"These are books.","traduccion":"Estos son libros."},{"distancia":"lejos","numero":"singular","palabra":"That","ejemplo":"That is a car.","traduccion":"Aquel es un coche."},{"distancia":"lejos","numero":"plural","palabra":"Those","ejemplo":"Those are cars.","traduccion":"Aquellos son coches."}]`,
    reglas_clave: "Cerca: \"This\" / \"These\". Lejos: \"That\" / \"Those\".",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C08_EXP",
    clase_id: "A1_C08",
    titulo_explicacion: "Artículos Indefinidos: A / AN",
    contenido_html: "<p>Usamos el artículo <b>\"a\"</b> antes de palabras que inician con sonido de consonante: <code>\"a book\"</code> (un libro). Usamos <b>\"an\"</b> antes de sonido de vocal: <code>\"an apple\"</code> (una manzana). La regla se basa en el <b>sonido fonético</b>, no en la letra escrita: <code>\"an hour\"</code> (una hora) porque la hache es muda.</p>",
    contenido_markdown: "Usamos el artículo \"a\" antes de palabras con sonido consonántico: \"a book\" (un libro). Usamos \"an\" antes de sonido vocálico: \"an apple\" (una manzana). La regla se basa en el sonido fonético: \"an hour\" (una hora) porque la hache es muda.",
    ejemplos_tabla_json: `[{"articulo":"A","ejemplo":"a book","razon":"Sonido consonántico","traduccion":"un libro"},{"articulo":"AN","ejemplo":"an apple","razon":"Sonido vocálico","traduccion":"una manzana"},{"articulo":"AN","ejemplo":"an hour","razon":"H muda, sonido vocálico","traduccion":"una hora"}]`,
    reglas_clave: "\"a\" = sonido de consonante. \"an\" = sonido de vocal. La clave es el SONIDO.",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C09_EXP",
    clase_id: "A1_C09",
    titulo_explicacion: "El Verbo Have: Posesión",
    contenido_html: "<p>El verbo <b>\"have\"</b> expresa posesión (tener). Con los pronombres <b>\"I, You, We, They\"</b> se conjuga como <b>\"have\"</b>. Con la tercera persona <b>\"He, She, It\"</b> se transforma en <b>\"has\"</b>. Por ejemplo: <code>\"She has a car.\"</code> (Ella tiene un auto).</p>",
    contenido_markdown: "El verbo \"have\" expresa posesión (tener). Con los pronombres \"I, You, We, They\" se conjuga como \"have\". Con la tercera persona singular \"He, She, It\" se transforma en \"has\". Por ejemplo: \"I have a book\" (Yo tengo un libro) y \"She has a car\" (Ella tiene un auto).",
    ejemplos_tabla_json: `[{"sujeto":"I","forma":"have","ejemplo":"I have a book.","traduccion":"Yo tengo un libro."},{"sujeto":"She","forma":"has","ejemplo":"She has a car.","traduccion":"Ella tiene un auto."}]`,
    reglas_clave: "\"I/You/We/They\" = \"have\". \"He/She/It\" = \"has\".",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
  {
    explicacion_id: "A1_C10_EXP",
    clase_id: "A1_C10",
    titulo_explicacion: "Presente Simple: 3ra Persona",
    contenido_html: "<p>En el presente simple afirmativo, los sujetos de tercera persona singular (<b>\"He\"</b>, <b>\"She\"</b>, <b>\"It\"</b>) modifican el verbo agregando <b>\"-s\"</b> o <b>\"-es\"</b>. Regla general: <code>\"work\"</code> → <code>\"works\"</code>. Terminaciones en -o, -ch, -sh, -x, -ss: <code>\"go\"</code> → <code>\"goes\"</code>. Consonante más y griega: <code>\"study\"</code> → <code>\"studies\"</code>.</p>",
    contenido_markdown: "En el presente simple afirmativo, los sujetos de tercera persona singular (\"He\", \"She\", \"It\") modifican el verbo. Regla general: añadir \"-s\" (\"works\"). Terminaciones especiales: añadir \"-es\" (\"goes\", \"watches\"). Consonante más y griega: \"-ies\" (\"studies\").",
    ejemplos_tabla_json: `[{"verbo":"work","3ra":"works","traduccion":"trabajar"},{"verbo":"go","3ra":"goes","traduccion":"ir"},{"verbo":"study","3ra":"studies","traduccion":"estudiar"}]`,
    reglas_clave: "3ra persona singular (\"He, She, It\"): agregar \"-s\", \"-es\" o \"-ies\" al verbo.",
    duracion_lectura_min: 3,
    version: 2,
    activo: true
  },
];

// 6. TEXTOS_BASE (10 Filas para Reading/Listening)
export const INITIAL_TEXTOS_BASE: SheetTextoBaseRow[] = [
  {
    texto_id: "A1_C01_TXT01",
    clase_id: "A1_C01",
    titulo: "My Classroom",
    titulo_texto: "My Classroom",
    contenido: "Hello! I am Ana. I am a student. This is my classroom. It is big and nice. My friend Carlos is here. He is a student too. We are friends. This is our teacher. Her name is Mrs. Garcia. She is a teacher. She is very nice. She has a book. It is a red book. The book is on the desk. Look! One book is here. Two books are there. Many books are in the classroom. The books are for the students. Many students are in the classroom. They are students. They are my friends. Carlos and I are students too. We are all happy. I like my classroom.",
    contenido_texto: "Hello! I am Ana. I am a student. This is my classroom. It is big and nice. My friend Carlos is here. He is a student too. We are friends. This is our teacher. Her name is Mrs. Garcia. She is a teacher. She is very nice. She has a book. It is a red book. The book is on the desk. Look! One book is here. Two books are there. Many books are in the classroom. The books are for the students. Many students are in the classroom. They are students. They are my friends. Carlos and I are students too. We are all happy. I like my classroom.",
    palabras_count: 105,
    dificultad: 1,
    audio_tts_url: "https://assets.teclingo.com/audio/txt_c01.mp3",
    tiempo_audio_seg: 60,
    tipo_texto: "descriptivo",
    activo: true
  },
  { texto_id: "A1_C02_TXT01", clase_id: "A1_C02", titulo: "My Friend David", titulo_texto: "My Friend David", contenido: "Hello! I am David and I am twenty-two years old. I am a student at the Technological Institute in Mexico. My friend Sarah is from Canada. She is an English teacher. We are very happy to practice together every afternoon!", contenido_texto: "Hello! I am David and I am twenty-two years old. I am a student at the Technological Institute in Mexico. My friend Sarah is from Canada. She is an English teacher. We are very happy to practice together every afternoon!", palabras_count: 42, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c02.mp3", tiempo_audio_seg: 24, tipo_texto: "dialogo", activo: true },
  { texto_id: "A1_C03_TXT01", clase_id: "A1_C03", titulo: "At the Airport Counter", titulo_texto: "At the Airport Counter", contenido: "Excuse me, officer. Is this the flight to Guadalajara? No, sir, it isn't. That flight is at Gate 14. Are you ready with your passport? Yes, I am. Thank you very much for your help!", contenido_texto: "Excuse me, officer. Is this the flight to Guadalajara? No, sir, it isn't. That flight is at Gate 14. Are you ready with your passport? Yes, I am. Thank you very much for your help!", palabras_count: 37, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c03.mp3", tiempo_audio_seg: 20, tipo_texto: "dialogo", activo: true },
  { texto_id: "A1_C04_TXT01", clase_id: "A1_C04", titulo: "In the Kitchen", titulo_texto: "In the Kitchen", contenido: "There are four red apples on the wooden table. We have some fresh milk and bread in the refrigerator, but we don't have any orange juice. How much water do you drink during study sessions?", contenido_texto: "There are four red apples on the wooden table. We have some fresh milk and bread in the refrigerator, but we don't have any orange juice. How much water do you drink during study sessions?", palabras_count: 37, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c04.mp3", tiempo_audio_seg: 21, tipo_texto: "descriptivo", activo: true },
  { texto_id: "A1_C05_TXT01", clase_id: "A1_C05", titulo: "Maria's Workspace", titulo_texto: "Maria's Workspace", contenido: "This is Maria's new office. Her computer is on the left side of the desk, and her brother's notebook is on the right. She loves working with technological tools because everything is organized.", contenido_texto: "This is Maria's new office. Her computer is on the left side of the desk, and her brother's notebook is on the right. She loves working with technological tools because everything is organized.", palabras_count: 34, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c05.mp3", tiempo_audio_seg: 19, tipo_texto: "descriptivo", activo: true },
  { texto_id: "A1_C06_TXT01", clase_id: "A1_C06", titulo: "Whose Backpack is This?", titulo_texto: "Whose Backpack is This?", contenido: "Look at these two bags! That blue backpack is mine, and the black one is yours. Where is Carlos? His project folder is here on the sofa, so this notebook must be his.", contenido_texto: "Look at these two bags! That blue backpack is mine, and the black one is yours. Where is Carlos? His project folder is here on the sofa, so this notebook must be his.", palabras_count: 35, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c06.mp3", tiempo_audio_seg: 20, tipo_texto: "dialogo", activo: true },
  { texto_id: "A1_C07_TXT01", clase_id: "A1_C07", titulo: "At the Gadget Store", titulo_texto: "At the Gadget Store", contenido: "This smartwatch is very fast and modern. That laptop over there is expensive, but those headphones are on sale today. I really like these digital tools for learning languages at home.", contenido_texto: "This smartwatch is very fast and modern. That laptop over there is expensive, but those headphones are on sale today. I really like these digital tools for learning languages at home.", palabras_count: 33, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c07.mp3", tiempo_audio_seg: 18, tipo_texto: "descriptivo", activo: true },
  { texto_id: "A1_C08_TXT01", clase_id: "A1_C08", titulo: "Elena's Daily Schedule", titulo_texto: "Elena's Daily Schedule", contenido: "Elena works as an architect in Monterrey. Every day, she leaves her house at seven o'clock and takes an hour to review building designs. She carries a notebook and an umbrella in her briefcase.", contenido_texto: "Elena works as an architect in Monterrey. Every day, she leaves her house at seven o'clock and takes an hour to review building designs. She carries a notebook and an umbrella in her briefcase.", palabras_count: 35, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c08.mp3", tiempo_audio_seg: 20, tipo_texto: "narrativo", activo: true },
  { texto_id: "A1_C09_TXT01", clase_id: "A1_C09", titulo: "Our Big Family", titulo_texto: "Our Big Family", contenido: "I have a big family. I have two older brothers and one little sister. My brother Luis has a fast red car, and my parents have a cozy house in the countryside. We love spending weekends together.", contenido_texto: "I have a big family. I have two older brothers and one little sister. My brother Luis has a fast red car, and my parents have a cozy house in the countryside. We love spending weekends together.", palabras_count: 37, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c09.mp3", tiempo_audio_seg: 21, tipo_texto: "narrativo", activo: true },
  { texto_id: "A1_C10_TXT01", clase_id: "A1_C10", titulo: "A Software Engineer's Day", titulo_texto: "A Software Engineer's Day", contenido: "Mateo works as a developer for a tech startup. He wakes up at 6:30 AM, drinks black coffee, and studies English grammar before starting his coding sprint. He always finishes his tasks on time.", contenido_texto: "Mateo works as a developer for a tech startup. He wakes up at 6:30 AM, drinks black coffee, and studies English grammar before starting his coding sprint. He always finishes his tasks on time.", palabras_count: 34, dificultad: 1, audio_tts_url: "https://assets.teclingo.com/audio/txt_c10.mp3", tiempo_audio_seg: 19, tipo_texto: "narrativo", activo: true },
];

// 7. REACTIVOS (50+ Filas clasificadas por las 5 Habilidades)
export const INITIAL_REACTIVOS: SheetReactivoRow[] = [
  // Clase A1_C01 (Fase Cero: Pronombres, Singular vs Plural - 50 Reactivos Oficiales: 10 Grammar, 10 Reading, 10 Listening, 10 Writing, 10 Speaking)
  {
    reactivo_id: "A1_C01_GRAM_01",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 1,
    numero_reactivo: 1,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona la opción correcta",
    pregunta_texto: "The plural of \"book\" is ___.",
    frase_traduccion: "El plural de \"libro\" es ___.",
    opciones: ["book","books","bookes"],
    opciones_json: "[\"book\",\"books\",\"bookes\"]",
    opciones_traduccion: ["libro (singular)","libros (plural)","incorrecto"],
    opciones_traduccion_json: "[\"libro (singular)\",\"libros (plural)\",\"incorrecto\"]",
    respuesta_correcta: "books",
    respuesta_explicacion: "Regla general: agregar -s al final. Book → books.",
    contexto_espanol: "Según el vocabulario de \"Sustantivos Clave\", selecciona el PLURAL correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"book\" (libro) → \"books\" (libros).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"book","traduccion":"libro (singular)"},{"id":"b","texto":"books","traduccion":"libros (plural)"},{"id":"c","texto":"bookes","traduccion":"incorrecto"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Regla general de plurales regulares: añadir -s al final (book → books).",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_02",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 2,
    numero_reactivo: 2,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona la opción correcta",
    pregunta_texto: "The plural of \"student\" is ___.",
    frase_traduccion: "El plural de \"estudiante\" es ___.",
    opciones: ["studentes","student","students"],
    opciones_json: "[\"studentes\",\"student\",\"students\"]",
    opciones_traduccion: ["incorrecto","estudiante (singular)","estudiantes (plural)"],
    opciones_traduccion_json: "[\"incorrecto\",\"estudiante (singular)\",\"estudiantes (plural)\"]",
    respuesta_correcta: "students",
    respuesta_explicacion: "Regla general: agregar -s al final. Student → students.",
    contexto_espanol: "Según el vocabulario de \"Sustantivos Clave\", selecciona el PLURAL correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"student\" (estudiante) → \"students\" (estudiantes).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"studentes","traduccion":"incorrecto"},{"id":"b","texto":"student","traduccion":"estudiante (singular)"},{"id":"c","texto":"students","traduccion":"estudiantes (plural)"}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Regla general de plurales regulares: añadir -s al final (student → students).",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_03",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 3,
    numero_reactivo: 3,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona la opción correcta",
    pregunta_texto: "The singular of \"books\" is ___.",
    frase_traduccion: "El singular de \"libros\" es ___.",
    opciones: ["book","books","bookes"],
    opciones_json: "[\"book\",\"books\",\"bookes\"]",
    opciones_traduccion: ["libro (singular)","libros (plural)","incorrecto"],
    opciones_traduccion_json: "[\"libro (singular)\",\"libros (plural)\",\"incorrecto\"]",
    respuesta_correcta: "book",
    respuesta_explicacion: "Para volver al singular, quitamos la -s final. Books → book.",
    contexto_espanol: "Según el vocabulario de \"Sustantivos Clave\", selecciona el SINGULAR correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"books\" (libros) → \"book\" (libro).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"book","traduccion":"libro (singular)"},{"id":"b","texto":"books","traduccion":"libros (plural)"},{"id":"c","texto":"bookes","traduccion":"incorrecto"}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Formación de singular a partir de plural regular con sufijo -s: books → book.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_04",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 4,
    numero_reactivo: 4,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona la opción correcta",
    pregunta_texto: "The singular of \"students\" is ___.",
    frase_traduccion: "El singular de \"estudiantes\" es ___.",
    opciones: ["studentes","student","students"],
    opciones_json: "[\"studentes\",\"student\",\"students\"]",
    opciones_traduccion: ["incorrecto","estudiante (singular)","estudiantes (plural)"],
    opciones_traduccion_json: "[\"incorrecto\",\"estudiante (singular)\",\"estudiantes (plural)\"]",
    respuesta_correcta: "student",
    respuesta_explicacion: "Para volver al singular, quitamos la -s final. Students → student.",
    contexto_espanol: "Según el vocabulario de \"Sustantivos Clave\", selecciona el SINGULAR correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"students\" (estudiantes) → \"student\" (estudiante).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"studentes","traduccion":"incorrecto"},{"id":"b","texto":"student","traduccion":"estudiante (singular)"},{"id":"c","texto":"students","traduccion":"estudiantes (plural)"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Formación de singular a partir de plural regular con sufijo -s: students → student.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_05",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 5,
    numero_reactivo: 5,
    tipo_pregunta: "multiple_choice",
    instruccion: "Completa la oración",
    pregunta_texto: "One ___ is here. (Un ___ está aquí.)",
    frase_traduccion: "Un ___ está aquí.",
    opciones: ["books","students","child"],
    opciones_json: "[\"books\",\"students\",\"child\"]",
    opciones_traduccion: ["libros (plural)","estudiantes (plural)","niño/niña (singular)"],
    opciones_traduccion_json: "[\"libros (plural)\",\"estudiantes (plural)\",\"niño/niña (singular)\"]",
    respuesta_correcta: "child",
    respuesta_explicacion: "\"One\" (uno) requiere sustantivo singular. \"Child\" es singular, \"books\" y \"students\" son plurales.",
    contexto_espanol: "Según el texto \"My Classroom\", completa con la palabra SINGULAR correcta:",
    pista_vocabulario: "Revisa: \"One\" = uno (singular). \"Books\" y \"students\" terminan en -s (plural). \"Child\" no tiene -s (singular).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"books","traduccion":"libros (plural)"},{"id":"b","texto":"students","traduccion":"estudiantes (plural)"},{"id":"c","texto":"child","traduccion":"niño/niña (singular)"}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "El cuantificador 'One' (uno) rige obligatoriamente un sustantivo singular (child).",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_06",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 6,
    numero_reactivo: 6,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona el pronombre",
    pregunta_texto: "The pronoun for \"my dad\" is ___.",
    frase_traduccion: "El pronombre para \"mi papá\" es ___.",
    opciones: ["He","She","It"],
    opciones_json: "[\"He\",\"She\",\"It\"]",
    opciones_traduccion: ["Él","Ella","Eso"],
    opciones_traduccion_json: "[\"Él\",\"Ella\",\"Eso\"]",
    respuesta_correcta: "He",
    respuesta_explicacion: "\"He\" se usa para hombres en tercera persona singular.",
    contexto_espanol: "Según el vocabulario de \"Pronombres Personales\", selecciona el pronombre correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"He\" = él (hombre). Ejemplo: \"He is a teacher.\" (Él es profesor.)",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He","traduccion":"Él"},{"id":"b","texto":"She","traduccion":"Ella"},{"id":"c","texto":"It","traduccion":"Eso"}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Tercera persona del singular masculino: He = él.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_07",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 7,
    numero_reactivo: 7,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona el pronombre",
    pregunta_texto: "The pronoun for \"my mom\" is ___.",
    frase_traduccion: "El pronombre para \"mi mamá\" es ___.",
    opciones: ["He","She","It"],
    opciones_json: "[\"He\",\"She\",\"It\"]",
    opciones_traduccion: ["Él","Ella","Eso"],
    opciones_traduccion_json: "[\"Él\",\"Ella\",\"Eso\"]",
    respuesta_correcta: "She",
    respuesta_explicacion: "\"She\" se usa para mujeres en tercera persona singular.",
    contexto_espanol: "Según el vocabulario de \"Pronombres Personales\", selecciona el pronombre correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"She\" = ella (mujer). Ejemplo: \"She is a teacher.\" (Ella es profesora.)",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He","traduccion":"Él"},{"id":"b","texto":"She","traduccion":"Ella"},{"id":"c","texto":"It","traduccion":"Eso"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Tercera persona del singular femenino: She = ella.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_08",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 8,
    numero_reactivo: 8,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona el pronombre",
    pregunta_texto: "The pronoun for \"the book\" is ___.",
    frase_traduccion: "El pronombre para \"el libro\" es ___.",
    opciones: ["He","We","It"],
    opciones_json: "[\"He\",\"We\",\"It\"]",
    opciones_traduccion: ["Él","Nosotros","Eso"],
    opciones_traduccion_json: "[\"Él\",\"Nosotros\",\"Eso\"]",
    respuesta_correcta: "It",
    respuesta_explicacion: "\"It\" se usa para objetos, animales o conceptos en singular.",
    contexto_espanol: "Según el vocabulario de \"Pronombres Personales\", selecciona el pronombre correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"It\" = eso (cosa/objeto). Ejemplo: \"It is a book.\" (Es un libro.)",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He","traduccion":"Él"},{"id":"b","texto":"We","traduccion":"Nosotros"},{"id":"c","texto":"It","traduccion":"Eso"}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Tercera persona del singular neutro para objetos inanimados: It = eso.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_09",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 9,
    numero_reactivo: 9,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona el pronombre",
    pregunta_texto: "The pronoun for \"Maria and I\" is ___.",
    frase_traduccion: "El pronombre para \"María y yo\" es ___.",
    opciones: ["We","You","They"],
    opciones_json: "[\"We\",\"You\",\"They\"]",
    opciones_traduccion: ["Nosotros","Tú/Ustedes","Ellos"],
    opciones_traduccion_json: "[\"Nosotros\",\"Tú/Ustedes\",\"Ellos\"]",
    respuesta_correcta: "We",
    respuesta_explicacion: "\"We\" se usa cuando el hablante está incluido (nosotros).",
    contexto_espanol: "Según el vocabulario de \"Pronombres Personales\", selecciona el pronombre correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"We\" = nosotros (incluyéndome). Ejemplo: \"We are friends.\" (Somos amigos.)",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"We","traduccion":"Nosotros"},{"id":"b","texto":"You","traduccion":"Tú / Ustedes"},{"id":"c","texto":"They","traduccion":"Ellos"}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Primera persona del plural con hablante incluido ('and I'): We = nosotros.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_GRAM_10",
    clase_id: "A1_C01",
    habilidad: "grammar",
    numero: 10,
    numero_reactivo: 10,
    tipo_pregunta: "multiple_choice",
    instruccion: "Selecciona el pronombre",
    pregunta_texto: "The pronoun for \"the students\" (not me) is ___.",
    frase_traduccion: "El pronombre para \"los estudiantes\" (sin incluirme) es ___.",
    opciones: ["He","They","It"],
    opciones_json: "[\"He\",\"They\",\"It\"]",
    opciones_traduccion: ["Él","Ellos","Eso"],
    opciones_traduccion_json: "[\"Él\",\"Ellos\",\"Eso\"]",
    respuesta_correcta: "They",
    respuesta_explicacion: "\"They\" se usa para un grupo del que el hablante NO forma parte. Otros estudiantes = ellos.",
    contexto_espanol: "Según el vocabulario de \"Pronombres Personales\", selecciona el pronombre correcto:",
    pista_vocabulario: "Revisa en el vocabulario: \"They\" = ellos/ellas (sin incluirme). Ejemplo: \"They are students.\" (Ellos son estudiantes.)",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He","traduccion":"Él"},{"id":"b","texto":"They","traduccion":"Ellos / Ellas"},{"id":"c","texto":"It","traduccion":"Eso"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Tercera persona del plural sin incluir al emisor: They = ellos/ellas.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_01",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 1,
    numero_reactivo: 1,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Who is a teacher in the text?",
    frase_traduccion: "¿Quién es profesora en el texto?",
    opciones: ["Carlos","Mrs. Garcia","Ana"],
    opciones_json: "[\"Carlos\",\"Mrs. Garcia\",\"Ana\"]",
    opciones_traduccion: ["Carlos","Sra. García","Ana"],
    opciones_traduccion_json: "[\"Carlos\",\"Sra. García\",\"Ana\"]",
    respuesta_correcta: "Mrs. Garcia",
    respuesta_explicacion: "En el texto dice: \"This is our teacher. Her name is Mrs. Garcia. She is a teacher.\"",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto la frase con \"our teacher\" y \"Mrs. Garcia\".",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"Carlos","traduccion":"Carlos (estudiante)"},{"id":"b","texto":"Mrs. Garcia","traduccion":"Sra. García (profesora)"},{"id":"c","texto":"Ana","traduccion":"Ana (estudiante)"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "This is our teacher. Her name is Mrs. Garcia. She is a teacher.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_02",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 2,
    numero_reactivo: 2,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Who is a student?",
    frase_traduccion: "¿Quién es un estudiante?",
    opciones: ["I","He","It"],
    opciones_json: "[\"I\",\"He\",\"It\"]",
    opciones_traduccion: ["Yo","Él","Eso"],
    opciones_traduccion_json: "[\"Yo\",\"Él\",\"Eso\"]",
    respuesta_correcta: "I",
    respuesta_explicacion: "En el texto dice: \"I am a student.\" (Yo soy estudiante.)",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto la frase \"I am a student.\"",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"I","traduccion":"Yo (Ana)"},{"id":"b","texto":"He","traduccion":"Él"},{"id":"c","texto":"It","traduccion":"Eso"}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Hello! I am Ana. I am a student.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_03",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 3,
    numero_reactivo: 3,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Which pronoun refers to Mrs. Garcia in the text?",
    frase_traduccion: "¿Qué pronombre se refiere a Mrs. Garcia en el texto?",
    opciones: ["He","It","She"],
    opciones_json: "[\"He\",\"It\",\"She\"]",
    opciones_traduccion: ["Él (masculino)","Eso (objeto)","Ella (femenino)"],
    opciones_traduccion_json: "[\"Él (masculino)\",\"Eso (objeto)\",\"Ella (femenino)\"]",
    respuesta_correcta: "She",
    respuesta_explicacion: "En el texto dice: \"Her name is Mrs. Garcia. She is a teacher.\" Usamos \"She\" porque Mrs. Garcia es femenino (mujer).",
    contexto_espanol: "Según el texto \"My Classroom\", identifica el pronombre femenino correcto para Mrs. Garcia:",
    pista_vocabulario: "Revisa en el texto: \"Her name is Mrs. Garcia. She is a teacher.\"",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He","traduccion":"Él (masculino)"},{"id":"b","texto":"It","traduccion":"Eso (objeto)"},{"id":"c","texto":"She","traduccion":"Ella (femenino)"}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Her name is Mrs. Garcia. She is a teacher. She is very nice.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_04",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 4,
    numero_reactivo: 4,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Where are the students?",
    frase_traduccion: "¿Dónde están los estudiantes?",
    opciones: ["In the book","In the classroom","Here"],
    opciones_json: "[\"In the book\",\"In the classroom\",\"Here\"]",
    opciones_traduccion: ["En el libro","En el aula","Aquí"],
    opciones_traduccion_json: "[\"En el libro\",\"En el aula\",\"Aquí\"]",
    respuesta_correcta: "In the classroom",
    respuesta_explicacion: "En el texto dice: \"Many students are in the classroom.\"",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto la palabra \"classroom\" (aula).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"In the book","traduccion":"En el libro"},{"id":"b","texto":"In the classroom","traduccion":"En el aula"},{"id":"c","texto":"Here","traduccion":"Aquí"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Many students are in the classroom.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_05",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 5,
    numero_reactivo: 5,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Who is Carlos in the text?",
    frase_traduccion: "¿Quién es Carlos en el texto?",
    opciones: ["He is my friend and student","He is the teacher","He is a book"],
    opciones_json: "[\"He is my friend and student\",\"He is the teacher\",\"He is a book\"]",
    opciones_traduccion: ["Él es mi amigo y estudiante","Él es el profesor","Él es un libro"],
    opciones_traduccion_json: "[\"Él es mi amigo y estudiante\",\"Él es el profesor\",\"Él es un libro\"]",
    respuesta_correcta: "He is my friend and student",
    respuesta_explicacion: "En el texto dice: \"My friend Carlos is here. He is a student too. We are friends.\"",
    contexto_espanol: "Según el texto \"My Classroom\", identifica quién es Carlos:",
    pista_vocabulario: "Busca en el texto la frase \"My friend Carlos is here.\"",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He is my friend and student","traduccion":"Él es mi amigo y estudiante"},{"id":"b","texto":"He is the teacher","traduccion":"Él es el profesor"},{"id":"c","texto":"He is a book","traduccion":"Él es un libro"}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "My friend Carlos is here. He is a student too. We are friends.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_06",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 6,
    numero_reactivo: 6,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "How many books are here on the desk?",
    frase_traduccion: "¿Cuántos libros hay aquí en el escritorio?",
    opciones: ["Two","One","Many"],
    opciones_json: "[\"Two\",\"One\",\"Many\"]",
    opciones_traduccion: ["Dos","Uno","Muchos"],
    opciones_traduccion_json: "[\"Dos\",\"Uno\",\"Muchos\"]",
    respuesta_correcta: "One",
    respuesta_explicacion: "En el texto dice: \"Look! One book is here.\" (Un libro está aquí.)",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto la frase \"One book is here.\"",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"Two","traduccion":"Dos"},{"id":"b","texto":"One","traduccion":"Uno"},{"id":"c","texto":"Many","traduccion":"Muchos"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Look! One book is here.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_07",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 7,
    numero_reactivo: 7,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "How many students are in the classroom?",
    frase_traduccion: "¿Cuántos estudiantes hay en el aula?",
    opciones: ["One","Two","Many"],
    opciones_json: "[\"One\",\"Two\",\"Many\"]",
    opciones_traduccion: ["Uno","Dos","Muchos"],
    opciones_traduccion_json: "[\"Uno\",\"Dos\",\"Muchos\"]",
    respuesta_correcta: "Many",
    respuesta_explicacion: "En el texto dice: \"Many students are in the classroom.\"",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto la palabra \"Many\" antes de \"students\".",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"One","traduccion":"Uno"},{"id":"b","texto":"Two","traduccion":"Dos"},{"id":"c","texto":"Many","traduccion":"Muchos"}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Many students are in the classroom. They are students.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_08",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 8,
    numero_reactivo: 8,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Who are \"We\" in \"We are friends\"?",
    frase_traduccion: "¿Quiénes son \"We\" en \"We are friends\"?",
    opciones: ["Ana and Carlos","The books","The teachers"],
    opciones_json: "[\"Ana and Carlos\",\"The books\",\"The teachers\"]",
    opciones_traduccion: ["Ana y Carlos","Los libros","Los profesores"],
    opciones_traduccion_json: "[\"Ana y Carlos\",\"Los libros\",\"Los profesores\"]",
    respuesta_correcta: "Ana and Carlos",
    respuesta_explicacion: "En el texto dice: \"Carlos and I are students too. We are all happy.\" Ana y Carlos son 'We'.",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto quiénes son amigos.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"Ana and Carlos","traduccion":"Ana y Carlos"},{"id":"b","texto":"The books","traduccion":"Los libros"},{"id":"c","texto":"The teachers","traduccion":"Los profesores"}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Carlos and I are students too. We are all happy.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_09",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 9,
    numero_reactivo: 9,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Is Mrs. Garcia a teacher?",
    frase_traduccion: "¿Mrs. Garcia es profesora?",
    opciones: ["No","Yes"],
    opciones_json: "[\"No\",\"Yes\"]",
    opciones_traduccion: ["No","Sí"],
    opciones_traduccion_json: "[\"No\",\"Sí\"]",
    respuesta_correcta: "Yes",
    respuesta_explicacion: "En el texto dice: \"She is a teacher. She is very nice.\"",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto la frase \"She is a teacher.\"",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"No","traduccion":"No"},{"id":"b","texto":"Yes","traduccion":"Sí"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "She is a teacher. She is very nice.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_READ_10",
    clase_id: "A1_C01",
    habilidad: "reading",
    numero: 10,
    numero_reactivo: 10,
    tipo_pregunta: "comprehension",
    instruccion: "Lee el texto y responde",
    pregunta_texto: "Is the book a student?",
    frase_traduccion: "¿El libro es un estudiante?",
    opciones: ["Yes","No"],
    opciones_json: "[\"Yes\",\"No\"]",
    opciones_traduccion: ["Sí","No"],
    opciones_traduccion_json: "[\"Sí\",\"No\"]",
    respuesta_correcta: "No",
    respuesta_explicacion: "En el texto dice: \"It is a book.\" (Es un libro), NO un estudiante.",
    contexto_espanol: "Según el texto \"My Classroom\" (Mi Aula), responde la pregunta de comprensión:",
    pista_vocabulario: "Busca en el texto qué es \"It\".",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 45,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"Yes","traduccion":"Sí"},{"id":"b","texto":"No","traduccion":"No"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "She has a book. It is a red book.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_01",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 1,
    numero_reactivo: 1,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona el pronombre",
    pregunta_texto: "Listen and identify the pronoun pronounced /aɪ/:",
    frase_traduccion: "Escucha e identifica el pronombre pronunciado /aɪ/:",
    opciones: ["He","I","It"],
    opciones_json: "[\"He\",\"I\",\"It\"]",
    opciones_traduccion: ["Él (/hiː/)","Yo (/aɪ/)","Eso (/ɪt/)"],
    opciones_traduccion_json: "[\"Él (/hiː/)\",\"Yo (/aɪ/)\",\"Eso (/ɪt/)\"]",
    respuesta_correcta: "I",
    respuesta_explicacion: "El pronombre \"I\" (yo) se pronuncia con el diptongo /aɪ/.",
    contexto_espanol: "Escucha la pronunciación fonética y selecciona el pronombre correspondiente:",
    pista_vocabulario: "El pronombre de primera persona singular en inglés es \"I\" (/aɪ/).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He","traduccion":"Él (/hiː/)"},{"id":"b","texto":"I","traduccion":"Yo (/aɪ/)"},{"id":"c","texto":"It","traduccion":"Eso (/ɪt/)"}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Pronunciación fonética del pronombre 'I': /aɪ/.",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_02",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 2,
    numero_reactivo: 2,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ is a teacher.",
    frase_traduccion: "Ella es profesora.",
    opciones: ["He is a teacher.","It is a teacher.","She is a teacher."],
    opciones_json: "[\"He is a teacher.\",\"It is a teacher.\",\"She is a teacher.\"]",
    opciones_traduccion: ["Él es profesor.","Eso es profesor.","Ella es profesora."],
    opciones_traduccion_json: "[\"Él es profesor.\",\"Eso es profesor.\",\"Ella es profesora.\"]",
    respuesta_correcta: "She is a teacher.",
    respuesta_explicacion: "El audio dice \"She\" (Ella), no \"He\" (Él) ni \"It\" (Eso).",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención si es \"She\" o \"He\".",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"He is a teacher.","traduccion":"Él es profesor."},{"id":"b","texto":"It is a teacher.","traduccion":"Eso es profesor."},{"id":"c","texto":"She is a teacher.","traduccion":"Ella es profesora."}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'She is a teacher.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_03",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 3,
    numero_reactivo: 3,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ is a book.",
    frase_traduccion: "Es un libro.",
    opciones: ["It is a book.","It is a student.","It is a teacher."],
    opciones_json: "[\"It is a book.\",\"It is a student.\",\"It is a teacher.\"]",
    opciones_traduccion: ["Es un libro.","Es un estudiante.","Es un profesor."],
    opciones_traduccion_json: "[\"Es un libro.\",\"Es un estudiante.\",\"Es un profesor.\"]",
    respuesta_correcta: "It is a book.",
    respuesta_explicacion: "El audio dice \"book\" (libro), no \"student\" ni \"teacher\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al sustantivo final.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"It is a book.","traduccion":"Es un libro."},{"id":"b","texto":"It is a student.","traduccion":"Es un estudiante."},{"id":"c","texto":"It is a teacher.","traduccion":"Es un profesor."}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'It is a book.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_04",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 4,
    numero_reactivo: 4,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ are friends.",
    frase_traduccion: "Somos amigos.",
    opciones: ["They are friends.","We are friends.","You are friends."],
    opciones_json: "[\"They are friends.\",\"We are friends.\",\"You are friends.\"]",
    opciones_traduccion: ["Ellos son amigos.","Somos amigos.","Ustedes son amigos."],
    opciones_traduccion_json: "[\"Ellos son amigos.\",\"Somos amigos.\",\"Ustedes son amigos.\"]",
    respuesta_correcta: "We are friends.",
    respuesta_explicacion: "El audio dice \"We\" (Nosotros), no \"They\" ni \"You\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al pronombre.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"They are friends.","traduccion":"Ellos son amigos."},{"id":"b","texto":"We are friends.","traduccion":"Somos amigos."},{"id":"c","texto":"You are friends.","traduccion":"Ustedes son amigos."}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'We are friends.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_05",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 5,
    numero_reactivo: 5,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ are students.",
    frase_traduccion: "Ellos son estudiantes.",
    opciones: ["We are students.","You are students.","They are students."],
    opciones_json: "[\"We are students.\",\"You are students.\",\"They are students.\"]",
    opciones_traduccion: ["Somos estudiantes.","Ustedes son estudiantes.","Ellos son estudiantes."],
    opciones_traduccion_json: "[\"Somos estudiantes.\",\"Ustedes son estudiantes.\",\"Ellos son estudiantes.\"]",
    respuesta_correcta: "They are students.",
    respuesta_explicacion: "El audio dice \"They\" (Ellos), no \"We\" ni \"You\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al pronombre.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"We are students.","traduccion":"Somos estudiantes."},{"id":"b","texto":"You are students.","traduccion":"Ustedes son estudiantes."},{"id":"c","texto":"They are students.","traduccion":"Ellos son estudiantes."}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'They are students.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_06",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 6,
    numero_reactivo: 6,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ book is here.",
    frase_traduccion: "Un libro está aquí.",
    opciones: ["One book is here.","Two books are here.","Many books are here."],
    opciones_json: "[\"One book is here.\",\"Two books are here.\",\"Many books are here.\"]",
    opciones_traduccion: ["Un libro está aquí.","Dos libros están aquí.","Muchos libros están aquí."],
    opciones_traduccion_json: "[\"Un libro está aquí.\",\"Dos libros están aquí.\",\"Muchos libros están aquí.\"]",
    respuesta_correcta: "One book is here.",
    respuesta_explicacion: "El audio dice \"One\" (uno), no \"Two\" ni \"Many\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al número.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"One book is here.","traduccion":"Un libro está aquí."},{"id":"b","texto":"Two books are here.","traduccion":"Dos libros están aquí."},{"id":"c","texto":"Many books are here.","traduccion":"Muchos libros están aquí."}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'One book is here.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_07",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 7,
    numero_reactivo: 7,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ students are here.",
    frase_traduccion: "Muchos estudiantes están aquí.",
    opciones: ["Two students are here.","Many students are here.","One student is here."],
    opciones_json: "[\"Two students are here.\",\"Many students are here.\",\"One student is here.\"]",
    opciones_traduccion: ["Dos estudiantes están aquí.","Muchos estudiantes están aquí.","Un estudiante está aquí."],
    opciones_traduccion_json: "[\"Dos estudiantes están aquí.\",\"Muchos estudiantes están aquí.\",\"Un estudiante está aquí.\"]",
    respuesta_correcta: "Many students are here.",
    respuesta_explicacion: "El audio dice \"Many\" (muchos), no \"One\" ni \"Two\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al cuantificador.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"Two students are here.","traduccion":"Dos estudiantes están aquí."},{"id":"b","texto":"Many students are here.","traduccion":"Muchos estudiantes están aquí."},{"id":"c","texto":"One student is here.","traduccion":"Un estudiante está aquí."}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'Many students are here.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_08",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 8,
    numero_reactivo: 8,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ is my friend.",
    frase_traduccion: "Él es mi amigo.",
    opciones: ["She is my friend.","It is my friend.","He is my friend."],
    opciones_json: "[\"She is my friend.\",\"It is my friend.\",\"He is my friend.\"]",
    opciones_traduccion: ["Ella es mi amiga.","Eso es mi amigo.","Él es mi amigo."],
    opciones_traduccion_json: "[\"Ella es mi amiga.\",\"Eso es mi amigo.\",\"Él es mi amigo.\"]",
    respuesta_correcta: "He is my friend.",
    respuesta_explicacion: "El audio dice \"He\" (Él), no \"She\" ni \"It\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al pronombre.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"She is my friend.","traduccion":"Ella es mi amiga."},{"id":"b","texto":"It is my friend.","traduccion":"Eso es mi amigo."},{"id":"c","texto":"He is my friend.","traduccion":"Él es mi amigo."}],
    respuesta_correcta_id: "c",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'He is my friend.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_09",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 9,
    numero_reactivo: 9,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ are a student.",
    frase_traduccion: "Tú eres un estudiante.",
    opciones: ["You are a student.","I am a student.","He is a student."],
    opciones_json: "[\"You are a student.\",\"I am a student.\",\"He is a student.\"]",
    opciones_traduccion: ["Tú eres estudiante.","Yo soy estudiante.","Él es estudiante."],
    opciones_traduccion_json: "[\"Tú eres estudiante.\",\"Yo soy estudiante.\",\"Él es estudiante.\"]",
    respuesta_correcta: "You are a student.",
    respuesta_explicacion: "El audio dice \"You are\" (Tú eres), no \"I am\" ni \"He is\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al pronombre y verbo.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"You are a student.","traduccion":"Tú eres estudiante."},{"id":"b","texto":"I am a student.","traduccion":"Yo soy estudiante."},{"id":"c","texto":"He is a student.","traduccion":"Él es estudiante."}],
    respuesta_correcta_id: "a",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'You are a student.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_LIST_10",
    clase_id: "A1_C01",
    habilidad: "listening",
    numero: 10,
    numero_reactivo: 10,
    tipo_pregunta: "audio_comprehension",
    instruccion: "Escucha y selecciona",
    pregunta_texto: "___ books are here.",
    frase_traduccion: "Dos libros están aquí.",
    opciones: ["One book is here.","Two books are here.","Many books are here."],
    opciones_json: "[\"One book is here.\",\"Two books are here.\",\"Many books are here.\"]",
    opciones_traduccion: ["Un libro está aquí.","Dos libros están aquí.","Muchos libros están aquí."],
    opciones_traduccion_json: "[\"Un libro está aquí.\",\"Dos libros están aquí.\",\"Muchos libros están aquí.\"]",
    respuesta_correcta: "Two books are here.",
    respuesta_explicacion: "El audio dice \"Two\" (dos), no \"One\" ni \"Many\".",
    contexto_espanol: "Escucha el audio y selecciona lo que oyes:",
    pista_vocabulario: "Presta atención al número.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [{"id":"a","texto":"One book is here.","traduccion":"Un libro está aquí."},{"id":"b","texto":"Two books are here.","traduccion":"Dos libros están aquí."},{"id":"c","texto":"Many books are here.","traduccion":"Muchos libros están aquí."}],
    respuesta_correcta_id: "b",
    shuffle_opciones: true,
    reglas_validacion_json: {"tipo":"exacta","normalizar":[]},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'Two books are here.'",
    idioma_enunciado: "en",
    idioma_opciones: "en",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_01",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 1,
    numero_reactivo: 1,
    tipo_pregunta: "write_word",
    instruccion: "Escribe en inglés",
    pregunta_texto: "El plural de \"book\" (libro) es:",
    frase_traduccion: "The plural of \"book\" is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "books",
    respuesta_explicacion: "La regla general es agregar -s al final: book → books.",
    contexto_espanol: "Escribe la palabra correcta en inglés:",
    pista_vocabulario: "Recuerda: para hacer plural, agrega -s.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Regla gramatical: sustantivo singular + 's' → book + s = books.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_02",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 2,
    numero_reactivo: 2,
    tipo_pregunta: "write_word",
    instruccion: "Escribe en inglés",
    pregunta_texto: "El plural de \"student\" (estudiante) es:",
    frase_traduccion: "The plural of \"student\" is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "students",
    respuesta_explicacion: "La regla general es agregar -s al final: student → students.",
    contexto_espanol: "Escribe la palabra correcta en inglés:",
    pista_vocabulario: "Recuerda: para hacer plural, agrega -s.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Regla gramatical: sustantivo singular + 's' → student + s = students.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_03",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 3,
    numero_reactivo: 3,
    tipo_pregunta: "write_word",
    instruccion: "Escribe en inglés",
    pregunta_texto: "El singular de \"books\" (libros) es:",
    frase_traduccion: "The singular of \"books\" is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "book",
    respuesta_explicacion: "Para volver al singular, quitamos la -s final: books → book.",
    contexto_espanol: "Escribe la palabra correcta en inglés:",
    pista_vocabulario: "Recuerda: para hacer singular, quita la -s.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Regla gramatical: eliminación de sufijo plural -s → books → book.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_04",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 4,
    numero_reactivo: 4,
    tipo_pregunta: "write_pronoun",
    instruccion: "Escribe el pronombre",
    pregunta_texto: "El pronombre para \"mi papá\" (él) es:",
    frase_traduccion: "The pronoun for \"my dad\" (he) is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "he",
    respuesta_explicacion: "He se usa para hombres en tercera persona singular.",
    contexto_espanol: "Escribe el pronombre correcto en inglés:",
    pista_vocabulario: "Revisa el vocabulario de pronombres: He = él.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Pronombre sujeto 3a persona singular masculino: he = él.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_05",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 5,
    numero_reactivo: 5,
    tipo_pregunta: "write_pronoun",
    instruccion: "Escribe el pronombre",
    pregunta_texto: "El pronombre para \"mi mamá\" (ella) es:",
    frase_traduccion: "The pronoun for \"my mom\" (she) is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "she",
    respuesta_explicacion: "She se usa para mujeres en tercera persona singular.",
    contexto_espanol: "Escribe el pronombre correcto en inglés:",
    pista_vocabulario: "Revisa el vocabulario de pronombres: She = ella.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Pronombre sujeto 3a persona singular femenino: she = ella.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_06",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 6,
    numero_reactivo: 6,
    tipo_pregunta: "write_pronoun",
    instruccion: "Escribe el pronombre",
    pregunta_texto: "El pronombre para \"el libro\" (eso/objeto) es:",
    frase_traduccion: "The pronoun for \"the book\" (it) is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "it",
    respuesta_explicacion: "It se usa para objetos, animales o conceptos.",
    contexto_espanol: "Escribe el pronombre correcto en inglés:",
    pista_vocabulario: "Revisa el vocabulario de pronombres: It = eso.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Pronombre sujeto 3a persona singular neutro para cosas: it = eso/objeto.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_07",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 7,
    numero_reactivo: 7,
    tipo_pregunta: "write_pronoun",
    instruccion: "Escribe el pronombre",
    pregunta_texto: "El pronombre para \"María y yo\" (nosotros) es:",
    frase_traduccion: "The pronoun for \"Maria and I\" (we) is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "we",
    respuesta_explicacion: "We se usa cuando el hablante está incluido (nosotros).",
    contexto_espanol: "Escribe el pronombre correcto en inglés:",
    pista_vocabulario: "Revisa el vocabulario: We = nosotros.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Pronombre sujeto 1a persona plural: we = nosotros/nosotras.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_08",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 8,
    numero_reactivo: 8,
    tipo_pregunta: "write_pronoun",
    instruccion: "Escribe el pronombre",
    pregunta_texto: "El pronombre para \"los otros estudiantes\" (ellos, sin incluirme) es:",
    frase_traduccion: "The pronoun for \"the other students\" (they) is:",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "they",
    respuesta_explicacion: "They se usa para un grupo del que el hablante NO forma parte.",
    contexto_espanol: "Escribe el pronombre correcto en inglés:",
    pista_vocabulario: "Revisa el vocabulario: They = ellos.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Pronombre sujeto 3a persona plural: they = ellos/ellas.",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_09",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 9,
    numero_reactivo: 9,
    tipo_pregunta: "write_sentence",
    instruccion: "Escribe la oración",
    pregunta_texto: "Traduce: \"Un libro está aquí.\"",
    frase_traduccion: "Translate: \"One book is here.\"",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "One book is here.",
    respuesta_explicacion: "One (uno) + \"book\" (libro) + \"is\" (está) + \"here\" (aquí).",
    contexto_espanol: "Escribe la oración completa en inglés:",
    pista_vocabulario: "Recuerda: el sujeto es obligatorio en inglés.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Estructura oracional afirmativa: Sujeto cuantificado (One book) + verbo (is) + adverbio de lugar (here).",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_WRIT_10",
    clase_id: "A1_C01",
    habilidad: "writing",
    numero: 10,
    numero_reactivo: 10,
    tipo_pregunta: "write_sentence",
    instruccion: "Escribe la oración",
    pregunta_texto: "Traduce: \"Ella es profesora.\"",
    frase_traduccion: "Translate: \"She is a teacher.\"",
    opciones: [],
    opciones_json: "[]",
    opciones_traduccion: null,
    opciones_traduccion_json: null,
    respuesta_correcta: "She is a teacher.",
    respuesta_explicacion: "She (ella) + \"is\" (es) + \"a teacher\" (una profesora).",
    contexto_espanol: "Escribe la oración completa en inglés:",
    pista_vocabulario: "Recuerda: el sujeto es obligatorio en inglés.",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 60,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim","sin_puntuacion"]},
    audio_autoplay: false,
    fuente_evidencia: "Estructura oracional afirmativa con profesión: Sujeto (She) + verbo (is) + artículo indefinido (a) + sustantivo singular (teacher).",
    idioma_enunciado: "es",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_01",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 1,
    numero_reactivo: 1,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "I am a student.",
    frase_traduccion: "Yo soy un estudiante.",
    opciones: ["I am a student."],
    opciones_json: "[\"I am a student.\"]",
    opciones_traduccion: ["Yo soy un estudiante."],
    opciones_traduccion_json: "[\"Yo soy un estudiante.\"]",
    respuesta_correcta: "I am a student.",
    respuesta_explicacion: "La pronunciación correcta es: /aɪ æm ə ˈstjuːdənt/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"I am\" (Yo soy).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'I am a student.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_02",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 2,
    numero_reactivo: 2,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "You are a student.",
    frase_traduccion: "Tú eres un estudiante.",
    opciones: ["You are a student."],
    opciones_json: "[\"You are a student.\"]",
    opciones_traduccion: ["Tú eres un estudiante."],
    opciones_traduccion_json: "[\"Tú eres un estudiante.\"]",
    respuesta_correcta: "You are a student.",
    respuesta_explicacion: "La pronunciación correcta es: /juː ɑːr ə ˈstjuːdənt/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"You are\" (Tú eres).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'You are a student.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_03",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 3,
    numero_reactivo: 3,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "He is a teacher.",
    frase_traduccion: "Él es un profesor.",
    opciones: ["He is a teacher."],
    opciones_json: "[\"He is a teacher.\"]",
    opciones_traduccion: ["Él es un profesor."],
    opciones_traduccion_json: "[\"Él es un profesor.\"]",
    respuesta_correcta: "He is a teacher.",
    respuesta_explicacion: "La pronunciación correcta es: /hiː ɪz ə ˈtiːtʃər/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"He is\" (Él es).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'He is a teacher.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_04",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 4,
    numero_reactivo: 4,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "She is a teacher.",
    frase_traduccion: "Ella es una profesora.",
    opciones: ["She is a teacher."],
    opciones_json: "[\"She is a teacher.\"]",
    opciones_traduccion: ["Ella es una profesora."],
    opciones_traduccion_json: "[\"Ella es una profesora.\"]",
    respuesta_correcta: "She is a teacher.",
    respuesta_explicacion: "La pronunciación correcta es: /ʃiː ɪz ə ˈtiːtʃər/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"She is\" (Ella es).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'She is a teacher.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_05",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 5,
    numero_reactivo: 5,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "It is a book.",
    frase_traduccion: "Es un libro.",
    opciones: ["It is a book."],
    opciones_json: "[\"It is a book.\"]",
    opciones_traduccion: ["Es un libro."],
    opciones_traduccion_json: "[\"Es un libro.\"]",
    respuesta_correcta: "It is a book.",
    respuesta_explicacion: "La pronunciación correcta es: /ɪt ɪz ə bʊk/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"It is\" (Es).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'It is a book.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_06",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 6,
    numero_reactivo: 6,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "We are friends.",
    frase_traduccion: "Somos amigos.",
    opciones: ["We are friends."],
    opciones_json: "[\"We are friends.\"]",
    opciones_traduccion: ["Somos amigos."],
    opciones_traduccion_json: "[\"Somos amigos.\"]",
    respuesta_correcta: "We are friends.",
    respuesta_explicacion: "La pronunciación correcta es: /wiː ɑːr frendz/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"We are\" (Somos).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'We are friends.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_07",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 7,
    numero_reactivo: 7,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "They are students.",
    frase_traduccion: "Ellos son estudiantes.",
    opciones: ["They are students."],
    opciones_json: "[\"They are students.\"]",
    opciones_traduccion: ["Ellos son estudiantes."],
    opciones_traduccion_json: "[\"Ellos son estudiantes.\"]",
    respuesta_correcta: "They are students.",
    respuesta_explicacion: "La pronunciación correcta es: /ðeɪ ɑːr ˈstjuːdənts/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"They are\" (Ellos son).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'They are students.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_08",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 8,
    numero_reactivo: 8,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "One book is here.",
    frase_traduccion: "Un libro está aquí.",
    opciones: ["One book is here."],
    opciones_json: "[\"One book is here.\"]",
    opciones_traduccion: ["Un libro está aquí."],
    opciones_traduccion_json: "[\"Un libro está aquí.\"]",
    respuesta_correcta: "One book is here.",
    respuesta_explicacion: "La pronunciación correcta es: /wʌn bʊk ɪz hɪər/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"One book\" (Un libro).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'One book is here.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_09",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 9,
    numero_reactivo: 9,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "Two books are here.",
    frase_traduccion: "Dos libros están aquí.",
    opciones: ["Two books are here."],
    opciones_json: "[\"Two books are here.\"]",
    opciones_traduccion: ["Dos libros están aquí."],
    opciones_traduccion_json: "[\"Dos libros están aquí.\"]",
    respuesta_correcta: "Two books are here.",
    respuesta_explicacion: "La pronunciación correcta es: /tuː bʊks ɑːr hɪər/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"Two books\" (Dos libros).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'Two books are here.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },
  {
    reactivo_id: "A1_C01_SPEAK_10",
    clase_id: "A1_C01",
    habilidad: "speaking",
    numero: 10,
    numero_reactivo: 10,
    tipo_pregunta: "repetition",
    instruccion: "Repite en voz alta",
    pregunta_texto: "Many students are here.",
    frase_traduccion: "Muchos estudiantes están aquí.",
    opciones: ["Many students are here."],
    opciones_json: "[\"Many students are here.\"]",
    opciones_traduccion: ["Muchos estudiantes están aquí."],
    opciones_traduccion_json: "[\"Muchos estudiantes están aquí.\"]",
    respuesta_correcta: "Many students are here.",
    respuesta_explicacion: "La pronunciación correcta es: /ˈmeni ˈstjuːdənts ɑːr hɪər/",
    contexto_espanol: "Repite la oración en voz alta después de escucharla:",
    pista_vocabulario: "Presta atención a \"Many students\" (Muchos estudiantes).",
    audio_url: "",
    puntos: 10,
    tiempo_limite_seg: 30,
    dificultad: 1,
    activo: true,

    // NUEVAS COLUMNAS (después de "activo")
    opciones_v3_json: [],
    respuesta_correcta_id: "",
    shuffle_opciones: false,
    reglas_validacion_json: {"tipo":"exacta","normalizar":["lowercase","trim"],"requiere_polaridad":true},
    audio_autoplay: false,
    fuente_evidencia: "Transcripción de audio: 'Many students are here.'",
    idioma_enunciado: "en",
    idioma_opciones: "na",

    mostrar_traduccion: "completa",
  },

  // Clase A1_C02 (Verbo To Be) - 5 Habilidades
  { reactivo_id: "A1_C02_GRAM_01", clase_id: "A1_C02", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Selecciona la opción correcta para completar la oración.", pregunta_texto: "She ___ a doctor in the general hospital.", opciones: ["am", "is", "are"], respuesta_correcta: "is", respuesta_explicacion: "She usa 'is' porque es tercera persona del singular.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C02_GRAM_02", clase_id: "A1_C02", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "Selecciona la forma correcta del verbo To Be.", pregunta_texto: "They ___ proud students of TecLingo Academy.", opciones: ["is", "am", "are"], respuesta_correcta: "are", respuesta_explicacion: "They es plural, por lo tanto requiere 'are'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C02_READ_01", clase_id: "A1_C02", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Basado en el texto 'My Friend David', responde:", pregunta_texto: "What is Sarah's profession in the text?", opciones: ["She is a doctor.", "She is an English teacher.", "She is a student."], respuesta_correcta: "She is an English teacher.", respuesta_explicacion: "El texto afirma explícitamente: 'My friend Sarah is an English teacher.'", puntos: 10, tiempo_limite_seg: 35, dificultad: 1 },
  { reactivo_id: "A1_C02_LIST_01", clase_id: "A1_C02", habilidad: "listening", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Escucha el audio y selecciona la afirmación que escuchas.", pregunta_texto: "[Audio: 'I am a software engineer'] ¿Qué pronombre y profesión se mencionan?", opciones: ["He is an architect", "I am a software engineer", "They are engineers"], respuesta_correcta: "I am a software engineer", respuesta_explicacion: "La pista de audio pronuncia claramente 'I am a software engineer'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C02_WRIT_01", clase_id: "A1_C02", habilidad: "writing", numero: 1, tipo_pregunta: "sentence_reorder", instruccion: "Ordena las palabras para formar una oración afirmativa correcta.", pregunta_texto: "student / I / a / diligent / am", opciones: ["I am a diligent student.", "A student am I diligent.", "Am I a student diligent."], respuesta_correcta: "I am a diligent student.", respuesta_explicacion: "La estructura oracional afirmativa es Sujeto + Verbo To Be + Complemento.", puntos: 10, tiempo_limite_seg: 40, dificultad: 1 },
  { reactivo_id: "A1_C02_SPK_01", clase_id: "A1_C02", habilidad: "speaking", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "¿Cuál es la respuesta oral más natural y formal al presentarte?", pregunta_texto: "'Nice to meet you, I'm Carlos.' -> Respond:", opciones: ["Nice to meet you too, Carlos.", "Yes, I am happy.", "Tomorrow at eight."], respuesta_correcta: "Nice to meet you too, Carlos.", respuesta_explicacion: "La réplica conversacional estándar ante 'Nice to meet you' es 'Nice to meet you too'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C03 (Negación e Interrogación To Be)
  { reactivo_id: "A1_C03_GRAM_01", clase_id: "A1_C03", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Transforma a pregunta: 'She is ready.'", pregunta_texto: "Interrogative form of 'She is ready':", opciones: ["Is she ready?", "She is ready?", "Does she ready?"], respuesta_correcta: "Is she ready?", respuesta_explicacion: "Con To Be se invierte la posición: Verbo Auxiliar + Sujeto.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C03_GRAM_02", clase_id: "A1_C03", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "Selecciona la contracción negativa correcta:", pregunta_texto: "We ___ at the classroom today.", opciones: ["aren't", "isn't", "am not"], respuesta_correcta: "aren't", respuesta_explicacion: "We are not se contrae como 'We aren't'.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C03_READ_01", clase_id: "A1_C03", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "En el diálogo del aeropuerto: ¿Dónde está el vuelo a Guadalajara?", pregunta_texto: "Where is the Guadalajara flight located?", opciones: ["At Gate 14", "At Gate 1", "Outside the airport"], respuesta_correcta: "At Gate 14", respuesta_explicacion: "El oficial indica: 'That flight is at Gate 14.'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C03_LIST_01", clase_id: "A1_C03", habilidad: "listening", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Distingue entonación ascendente de pregunta cerrada.", pregunta_texto: "Yes/No questions with To Be have an intonation that is:", opciones: ["Rising (goes up at the end)", "Falling (goes down)", "Flat monotone"], respuesta_correcta: "Rising (goes up at the end)", respuesta_explicacion: "Las preguntas de Sí/No en inglés cierran con entonación ascendente.", puntos: 10, tiempo_limite_seg: 30, dificultad: 2 },
  { reactivo_id: "A1_C03_WRIT_01", clase_id: "A1_C03", habilidad: "writing", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Selecciona la oración negativa gramaticalmente impecable.", pregunta_texto: "Which sentence is correctly negated?", opciones: ["He isn't tired after study.", "He not is tired.", "He doesn't tired."], respuesta_correcta: "He isn't tired after study.", respuesta_explicacion: "'Isn't' es la forma correcta con el verbo To Be y adjetivos.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C04 (Contables e Incontables)
  { reactivo_id: "A1_C04_GRAM_01", clase_id: "A1_C04", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "¿Cuál de estos sustantivos es INCONTABLE?", pregunta_texto: "Which noun is uncountable in English?", opciones: ["apple", "water", "car"], respuesta_correcta: "water", respuesta_explicacion: "El agua es un líquido/masa y no se cuenta como unidades individuales sin contenedor.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C04_GRAM_02", clase_id: "A1_C04", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "Completa la pregunta de cantidad para dinero.", pregunta_texto: "How ___ money do you have in your pocket?", opciones: ["many", "much", "any"], respuesta_correcta: "much", respuesta_explicacion: "Money es incontable, por lo que usamos 'How much'.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C04_READ_01", clase_id: "A1_C04", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Basado en 'In the Kitchen', ¿cuántas manzanas hay?", pregunta_texto: "How many apples are on the wooden table?", opciones: ["two", "four", "none"], respuesta_correcta: "four", respuesta_explicacion: "El texto indica: 'There are four red apples on the wooden table.'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C04_WRIT_01", clase_id: "A1_C04", habilidad: "writing", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Completa la oración afirmativa con sustantivo incontable.", pregunta_texto: "We have ___ fresh milk in the fridge.", opciones: ["some", "any", "a"], respuesta_correcta: "some", respuesta_explicacion: "En oraciones afirmativas con incontables se utiliza 'some'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C04_SPK_01", clase_id: "A1_C04", habilidad: "speaking", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "¿Cómo pides un vaso de agua cortésmente?", pregunta_texto: "Polite request for water:", opciones: ["Can I have a glass of water, please?", "Give water now.", "I want drink."], respuesta_correcta: "Can I have a glass of water, please?", respuesta_explicacion: "'Can I have ..., please?' es la fórmula cortés estándar en A1.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C05 (Posesión / Genitivo Sajón)
  { reactivo_id: "A1_C05_GRAM_01", clase_id: "A1_C05", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Aplica la fórmula Dueño + 's + Objeto para 'El carro de Carlos'.", pregunta_texto: "Express 'The car of Carlos' using the Saxon genitive:", opciones: ["Carlos's car", "The car's Carlos", "Carlos car of him"], respuesta_correcta: "Carlos's car", respuesta_explicacion: "Fórmula: Dueño (Carlos) + 's + Objeto (car).", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C05_GRAM_02", clase_id: "A1_C05", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "¿Dónde se ubica el apóstrofe para plural regular de 'parents'?", pregunta_texto: "The house of my parents -> My ___ house.", opciones: ["parents'", "parent's", "parentses"], respuesta_correcta: "parents'", respuesta_explicacion: "Para sustantivos plurales terminados en -s, solo se añade el apóstrofe al final.", puntos: 10, tiempo_limite_seg: 30, dificultad: 2 },
  { reactivo_id: "A1_C05_READ_01", clase_id: "A1_C05", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "¿De quién es la computadora en 'Maria's Workspace'?", pregunta_texto: "Whose computer is on the left side of the desk?", opciones: ["Maria's", "John's", "Her brother's"], respuesta_correcta: "Maria's", respuesta_explicacion: "El texto afirma: 'This is Maria's new office. Her computer is on the left side...'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C05_LIST_01", clase_id: "A1_C05", habilidad: "listening", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Reconoce la pronunciación de 's en 'Maria's' vs 'John's'.", pregunta_texto: "In 'John's car', the 's sounds like:", opciones: ["/z/ (voiced)", "/s/ (unvoiced)", "/ɪz/"], respuesta_correcta: "/z/ (voiced)", respuesta_explicacion: "Después de la consonante sonora /n/, la 's se pronuncia como /z/ sonora.", puntos: 10, tiempo_limite_seg: 30, dificultad: 2 },
  { reactivo_id: "A1_C05_WRIT_01", clase_id: "A1_C05", habilidad: "writing", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Corrige el error de posesión en: 'The book of the teacher is blue.'", pregunta_texto: "More natural English equivalent:", opciones: ["The teacher's book is blue.", "The book teacher is blue.", "Teachers book is blue."], respuesta_correcta: "The teacher's book is blue.", respuesta_explicacion: "En inglés para personas se prefiere 'Dueño + 's + Objeto'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C06 (Pronombres Posesivos)
  { reactivo_id: "A1_C06_GRAM_01", clase_id: "A1_C06", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Reemplaza 'my book' por un pronombre posesivo.", pregunta_texto: "This is my book. -> This book is ___.", opciones: ["mine", "my", "me"], respuesta_correcta: "mine", respuesta_explicacion: "El pronombre posesivo correspondiente a MY es MINE.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C06_GRAM_02", clase_id: "A1_C06", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "¿Cuál pronombre posesivo corresponde a 'OUR'?", pregunta_texto: "That project is ___ (belonging to us).", opciones: ["ours", "our", "we"], respuesta_correcta: "ours", respuesta_explicacion: "El pronombre posesivo para 'we/our' es 'ours'.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C06_READ_01", clase_id: "A1_C06", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "En 'Whose Backpack is This?', ¿de qué color es la mochila del narrador?", pregunta_texto: "What color is the narrator's backpack?", opciones: ["Blue", "Black", "Red"], respuesta_correcta: "Blue", respuesta_explicacion: "El texto dice: 'That blue backpack is mine'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C06_WRIT_01", clase_id: "A1_C06", habilidad: "writing", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Completa la comparación: 'My phone is fast, but ___ is faster.'", pregunta_texto: "Select the pronoun for 'your phone':", opciones: ["yours", "your", "you"], respuesta_correcta: "yours", respuesta_explicacion: "'Yours' reemplaza a 'your phone' sin repetir el sustantivo.", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C07 (Demostrativos)
  { reactivo_id: "A1_C07_GRAM_01", clase_id: "A1_C07", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Para un objeto singular que está LEJOS, usamos:", pregunta_texto: "Singular + Far away:", opciones: ["That", "This", "Those"], respuesta_correcta: "That", respuesta_explicacion: "That se usa para singular lejano.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C07_GRAM_02", clase_id: "A1_C07", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "Para varios objetos plurales que están CERCA, usamos:", pregunta_texto: "Plural + Near here:", opciones: ["These", "Those", "This"], respuesta_correcta: "These", respuesta_explicacion: "These se usa para plural cercano.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C07_READ_01", clase_id: "A1_C07", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "En la tienda de tecnología: ¿Qué dispositivo está en oferta hoy?", pregunta_texto: "Which items are on sale today in the store text?", opciones: ["Those headphones", "This smartwatch", "That laptop"], respuesta_correcta: "Those headphones", respuesta_explicacion: "El texto afirma: '...but those headphones are on sale today.'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C08 (A vs AN)
  { reactivo_id: "A1_C08_GRAM_01", clase_id: "A1_C08", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Elige A o AN para 'hour'.", pregunta_texto: "We need ___ hour to finish the test.", opciones: ["an", "a", "the"], respuesta_correcta: "an", respuesta_explicacion: "La H en 'hour' es muda, por lo que inicia con sonido de vocal: 'an hour'.", puntos: 10, tiempo_limite_seg: 25, dificultad: 2 },
  { reactivo_id: "A1_C08_GRAM_02", clase_id: "A1_C08", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "Elige A o AN para 'university'.", pregunta_texto: "He studies at ___ university in Querétaro.", opciones: ["a", "an", "the"], respuesta_correcta: "a", respuesta_explicacion: "'University' comienza con sonido consonántico semivocal /j/ (yú-ni-ver-si-ty), por lo que lleva 'a'.", puntos: 10, tiempo_limite_seg: 30, dificultad: 2 },
  { reactivo_id: "A1_C08_READ_01", clase_id: "A1_C08", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Basado en 'Elena's Daily Schedule', ¿qué lleva en su portafolio?", pregunta_texto: "What does Elena carry in her briefcase?", opciones: ["A notebook and an umbrella", "A laptop and water", "Two books"], respuesta_correcta: "A notebook and an umbrella", respuesta_explicacion: "El texto dice: 'She carries a notebook and an umbrella in her briefcase.'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C09 (Verbo Have)
  { reactivo_id: "A1_C09_GRAM_01", clase_id: "A1_C09", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Completa con have o has: 'She ___ a meeting now.'", pregunta_texto: "She ___ an important meeting.", opciones: ["has", "have", "haves"], respuesta_correcta: "has", respuesta_explicacion: "He/She/It utiliza la forma irregular 'has'.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C09_GRAM_02", clase_id: "A1_C09", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "¿Cuál es la forma negativa correcta con 'I'?", pregunta_texto: "I ___ a laptop.", opciones: ["don't have", "doesn't have", "haven't not"], respuesta_correcta: "don't have", respuesta_explicacion: "En presente simple de posesión, I usa 'don't have'.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C09_READ_01", clase_id: "A1_C09", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "En 'Our Big Family', ¿cuántos hermanos tiene el autor?", pregunta_texto: "How many brothers does the author have?", opciones: ["Two older brothers", "One brother", "Three brothers"], respuesta_correcta: "Two older brothers", respuesta_explicacion: "El texto dice: 'I have two older brothers and one little sister.'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },

  // Clase A1_C10 (Presente Simple 3ra Persona)
  { reactivo_id: "A1_C10_GRAM_01", clase_id: "A1_C10", habilidad: "grammar", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Conjugación en 3ra persona de 'study':", pregunta_texto: "He ___ English grammar every afternoon.", opciones: ["studies", "studys", "study"], respuesta_correcta: "studies", respuesta_explicacion: "Consonante + Y cambia a -ies: study -> studies.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C10_GRAM_02", clase_id: "A1_C10", habilidad: "grammar", numero: 2, tipo_pregunta: "multiple_choice", instruccion: "Conjugación en 3ra persona de 'go':", pregunta_texto: "Carlos ___ to work by bicycle.", opciones: ["goes", "gos", "go"], respuesta_correcta: "goes", respuesta_explicacion: "Verbos terminados en -o agregan -es: go -> goes.", puntos: 10, tiempo_limite_seg: 25, dificultad: 1 },
  { reactivo_id: "A1_C10_READ_01", clase_id: "A1_C10", habilidad: "reading", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "En 'A Software Engineer's Day', ¿a qué hora despierta Mateo?", pregunta_texto: "What time does Mateo wake up?", opciones: ["At 6:30 AM", "At 8:00 AM", "At 7:00 PM"], respuesta_correcta: "At 6:30 AM", respuesta_explicacion: "El texto dice: 'He wakes up at 6:30 AM...'", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
  { reactivo_id: "A1_C10_LIST_01", clase_id: "A1_C10", habilidad: "listening", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Reconoce la pronunciación de la -s en 'watches'.", pregunta_texto: "In the word 'watches', the -es ending sounds like:", opciones: ["/ɪz/", "/s/", "/z/"], respuesta_correcta: "/ɪz/", respuesta_explicacion: "Verbos que terminan en sonido sibilante (ch, sh, s, x) añaden sílaba /ɪz/.", puntos: 10, tiempo_limite_seg: 30, dificultad: 2 },
  { reactivo_id: "A1_C10_WRIT_01", clase_id: "A1_C10", habilidad: "writing", numero: 1, tipo_pregunta: "multiple_choice", instruccion: "Completa la oración con el adverbio en la posición correcta.", pregunta_texto: "He ___ arrives late to class.", opciones: ["never", "arrives never", "never does arrive"], respuesta_correcta: "never", respuesta_explicacion: "Los adverbios de frecuencia se colocan antes del verbo principal: He never arrives...", puntos: 10, tiempo_limite_seg: 30, dificultad: 1 },
];

// 8. EXPOSICIONES (4 Filas para Práctica Oral)
export const INITIAL_EXPOSICIONES: SheetExposicionRow[] = [
  {
    exposicion_id: "EXP_01",
    semana: 4,
    titulo: "Exposición Oral 1: Mi Identidad & Mi Entorno",
    instrucciones: "Graba o presenta en 2 minutos tu nombre, ocupación, origen, y describe 3 objetos clave de tu espacio de trabajo usando This, That, These y Those.",
    tema_presentacion: "Self-Introduction & My Workspace",
    tiempo_minutos: 2,
    criterios_evaluacion: "Pronunciación clara de To Be (am, is, are), uso correcto de demostrativos, fluidez continua sin pausas > 5 segundos.",
    vocabulario_sugerido: ["student", "engineer", "this", "that", "workspace", "computer", "happy"]
  },
  {
    exposicion_id: "EXP_02",
    semana: 9,
    titulo: "Exposición Oral 2: Mi Rutina Diaria & Mi Familia",
    instrucciones: "Describe tu día típico desde la mañana hasta la noche, utilizando adverbios de frecuencia y describiendo la ocupación de 2 miembros de tu familia con 'Have/Has'.",
    tema_presentacion: "Daily Habits & Family Members",
    tiempo_minutos: 3,
    criterios_evaluacion: "Conjugación precisa de 3ra persona singular (-s/-es), adverbios de frecuencia en posición correcta, vocabulario de parentesco.",
    vocabulario_sugerido: ["wake up", "always", "usually", "brother", "sister", "has", "breakfast"]
  },
  {
    exposicion_id: "EXP_03",
    semana: 14,
    titulo: "Exposición Oral 3: Un Viaje o Fin de Semana Pasado",
    instrucciones: "Narra 4 actividades que realizaste el fin de semana pasado combinando el verbo To Be en pasado (was/were) y al menos 3 verbos en pasado simple.",
    tema_presentacion: "My Last Weekend Adventure",
    tiempo_minutos: 3,
    criterios_evaluacion: "Uso de Was/Were, pronunciación diferenciada de terminación regular -ed (/t/, /d/, /ɪd/), verbos irregulares top (went, saw, had).",
    vocabulario_sugerido: ["was", "were", "went", "visited", "enjoyed", "saw", "yesterday"]
  },
  {
    exposicion_id: "EXP_04",
    semana: 18,
    titulo: "Exposición Oral 4: Proyecto Final - Mis Metas y Planes con Inglés",
    instrucciones: "Presentación final de graduación A1: Describe tus planes futuros profesionales con 'Be Going To' y cómo usarás el inglés en tu carrera.",
    tema_presentacion: "My Future Career & Tech Plans",
    tiempo_minutos: 4,
    criterios_evaluacion: "Estructura Be Going To + Infinitivo, vocabulario técnico-profesional, soltura conversacional, respuesta a 1 pregunta espontánea del docente.",
    vocabulario_sugerido: ["I am going to", "travel", "work", "technology", "fluent", "achieve", "future"]
  }
];

// 9. EXAMENES (3 Filas)
export const INITIAL_EXAMENES: SheetExamenRow[] = [
  {
    examen_id: "EXAM_PARCIAL_1",
    titulo: "Examen Parcial 1: Fundamentos A1 (Clases 00 a 10)",
    clases_evaluadas: "A1_C01 a A1_C10",
    total_preguntas: 25,
    tiempo_limite_min: 45,
    puntaje_minimo_aprobatorio: 70,
    descripcion: "Evaluación integral de Fonética, Verbo To Be (afirmación, negación, pregunta), Contables/Incontables, Posesivos ('s), Demostrativos, A/AN y Presente Simple."
  },
  {
    examen_id: "EXAM_PARCIAL_2",
    titulo: "Examen Parcial 2: Rutinas y Habilidades (Clases 11 a 20)",
    clases_evaluadas: "A1_C11 a A1_C20",
    total_preguntas: 25,
    tiempo_limite_min: 45,
    puntaje_minimo_aprobatorio: 70,
    descripcion: "Evaluación de Do/Does, Adverbios de Frecuencia, Wh- Questions, Preposiciones de Tiempo/Lugar, There is/are, Modal Can y Presente Continuo."
  },
  {
    examen_id: "EXAM_FINAL_A1",
    titulo: "Examen Global de Certificación MCER A1 (Clases 00 a 30)",
    clases_evaluadas: "A1_C01 a A1_C35",
    total_preguntas: 50,
    tiempo_limite_min: 60,
    puntaje_minimo_aprobatorio: 75,
    descripcion: "Examen estandarizado alineado al Marco Común Europeo (MCER). Incluye las 5 habilidades: Grammar (15), Reading (10), Listening (10), Writing (10), Speaking (5)."
  }
];

// 10. PROGRESO_USUARIO (Simulación de seguimiento detallado)
export const INITIAL_PROGRESO_USUARIO: SheetProgresoUsuarioRow[] = [
  {
    progreso_id: "PRG_001",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C02",
    habilidad: "grammar",
    reactivo_id: "A1_C02_GRAM_01",
    respuesta_usuario: "is",
    correcto: true,
    tiempo_respuesta_seg: 14,
    puntaje_obtenido: 10,
    fecha_registro: "2026-09-07T03:15:00Z"
  },
  {
    progreso_id: "PRG_002",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C02",
    habilidad: "grammar",
    reactivo_id: "A1_C02_GRAM_02",
    respuesta_usuario: "are",
    correcto: true,
    tiempo_respuesta_seg: 11,
    puntaje_obtenido: 10,
    fecha_registro: "2026-09-07T03:16:00Z"
  },
  {
    progreso_id: "PRG_003",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C02",
    habilidad: "reading",
    reactivo_id: "A1_C02_READ_01",
    respuesta_usuario: "She is an English teacher.",
    correcto: true,
    tiempo_respuesta_seg: 18,
    puntaje_obtenido: 10,
    fecha_registro: "2026-09-07T03:17:30Z"
  },
  {
    progreso_id: "PRG_004",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C02",
    habilidad: "listening",
    reactivo_id: "A1_C02_LIST_01",
    respuesta_usuario: "I am a software engineer",
    correcto: true,
    tiempo_respuesta_seg: 12,
    puntaje_obtenido: 10,
    fecha_registro: "2026-09-07T03:18:45Z"
  },
  {
    progreso_id: "PRG_005",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C02",
    habilidad: "writing",
    reactivo_id: "A1_C02_WRIT_01",
    respuesta_usuario: "I am a diligent student.",
    correcto: true,
    tiempo_respuesta_seg: 22,
    puntaje_obtenido: 10,
    fecha_registro: "2026-09-07T03:20:00Z"
  }
];

// 11. RESUMEN_PROGRESO (Hoja de consulta rápida para UI y Gamificación)
export const INITIAL_RESUMEN_PROGRESO: SheetResumenProgresoRow[] = [
  {
    resumen_id: "RES_user_teclingo_demo_A1_C01",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C01",
    habilidades_completadas: 0,
    reactivos_totales_clase: 50,
    reactivos_correctos: 0,
    puntaje_obtenido: 0,
    puntaje_maximo_posible: 500,
    porcentaje_avance: 0,
    xp_ganado: 0,
    estado_clase: "pendiente",
    ultima_actualizacion: "2026-09-07T00:00:00Z",
    xp_obtenidos: 0,
    reactivos_resueltos: 0,
  },
  {
    resumen_id: "RES_user_teclingo_demo_A1_C02",
    user_id: "user_teclingo_demo",
    clase_id: "A1_C02",
    habilidades_completadas: 1,
    reactivos_totales_clase: 50,
    reactivos_correctos: 5,
    puntaje_obtenido: 50,
    puntaje_maximo_posible: 500,
    porcentaje_avance: 10,
    xp_ganado: 50,
    estado_clase: "en_progreso",
    ultima_actualizacion: "2026-09-07T03:20:00Z",
    xp_obtenidos: 50,
    reactivos_resueltos: 5,
  }
];

// Helper functions for Datasheet in-memory management & persistence
const STORAGE_KEY = 'teclingo_a1_datasheet_v1';

export interface DatasheetState {
  configuracion: SheetConfigRow[];
  clases: SheetClaseRow[];
  vocabulario: SheetVocabularioRow[];
  verbos: SheetVerboRow[];
  textoExplicativo: SheetTextoExplicativoRow[];
  textosBase: SheetTextoBaseRow[];
  reactivos: SheetReactivoRow[];
  exposiciones: SheetExposicionRow[];
  examenes: SheetExamenRow[];
  progresoUsuario: SheetProgresoUsuarioRow[];
  resumenProgreso: SheetResumenProgresoRow[];
  usuarios?: SheetUsuarioRow[];
  lastSyncedAt?: string;
  sourceUrl?: string;
}

export function loadDatasheetFromStorage(): DatasheetState {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
      const parsed = JSON.parse(raw);
      const rawClases: SheetClaseRow[] = parsed.clases || INITIAL_CLASES;
      // Auto-migrate any outdated dummy video URL for A1_C01
      const clases = rawClases.map((c) => {
        if (c.clase_id === 'A1_C01' && (c.video_url.includes('qC_8Yp_d-Ww') || !c.video_url)) {
          return {
            ...c,
            titulo_video: "FASE CERO TECLINGO: El Secreto de los Singulares y Plurales",
            video_url: "https://youtube.com/shorts/JBB6JZT4VIc?si=Pz1xbJ-YOJpAWmpQ"
          };
        }
        return c;
      });

      // Force update A1_C01_EXP if stale
      const rawTexto = parsed.textoExplicativo || INITIAL_TEXTO_EXPLICATIVO;
      const textoExplicativo = rawTexto.map((t: SheetTextoExplicativoRow) => {
        if (t.clase_id === 'A1_C01') {
          const fresh = INITIAL_TEXTO_EXPLICATIVO.find((e) => e.clase_id === 'A1_C01');
          if (fresh && (!t.titulo_explicacion?.includes('Fase Cero') || (t.version || 1) < 2)) {
            return fresh;
          }
        }
        return t;
      });

      // Force update A1_C01 vocabulary if stale (e.g. still has 'alphabet', 'vowel', 'consonant', 'sound' or fewer than 14 items)
      const rawVocab: SheetVocabularioRow[] = parsed.vocabulario || INITIAL_VOCABULARIO;
      const a1c01List = rawVocab.filter(v => v.clase_id === 'A1_C01');
      const hasOldVocab = a1c01List.some(v => 
        ['alphabet', 'vowel', 'consonant', 'sound', 'spelling', 'phonetics'].includes(v.palabra_ingles.toLowerCase())
      ) || a1c01List.length < 14;
      const vocabulario = hasOldVocab
        ? [
            ...rawVocab.filter(v => v.clase_id !== 'A1_C01'),
            ...INITIAL_VOCABULARIO.filter(v => v.clase_id === 'A1_C01')
          ]
        : rawVocab;

      // Also ensure texts base for A1_C01 uses the updated coherent text with Ana and Carlos
      const rawTexts: SheetTextoBaseRow[] = parsed.textosBase || INITIAL_TEXTOS_BASE;
      const textosBase = rawTexts.map(tb => {
        if (
          tb.clase_id === 'A1_C01' &&
          (tb.titulo?.includes('Sounds') ||
            tb.contenido?.includes('vowels') ||
            tb.contenido?.includes('You are my friend. He is a teacher') ||
            !tb.contenido?.includes('Ana'))
        ) {
          const fresh = INITIAL_TEXTOS_BASE.find(t => t.clase_id === 'A1_C01');
          return fresh || tb;
        }
        return tb;
      });

      // Force update A1_C01 reactivos if stale (e.g. contains phonetics questions, lacks contexto_espanol, or has fewer than 30 items)
      const rawReactivos: SheetReactivoRow[] = parsed.reactivos || INITIAL_REACTIVOS;
      const a1c01Reactivos = rawReactivos.filter(r => r.clase_id === 'A1_C01');
      const hasOldReactivos = a1c01Reactivos.some(r =>
        r.pregunta_texto.toLowerCase().includes('alphabet') ||
        r.pregunta_texto.toLowerCase().includes('letters') ||
        r.pregunta_texto.toLowerCase().includes('ipa') ||
        r.pregunta_texto.toLowerCase().includes('vowel sound') ||
        r.pregunta_texto.toLowerCase().includes('short vowel') ||
        !r.contexto_espanol ||
        !r.frase_traduccion ||
        !r.pista_vocabulario ||
        !r.opciones_v3_json
      ) || a1c01Reactivos.length < 50;

      const reactivos = hasOldReactivos
        ? [
            ...rawReactivos.filter(r => r.clase_id !== 'A1_C01'),
            ...INITIAL_REACTIVOS.filter(r => r.clase_id === 'A1_C01')
          ]
        : rawReactivos;

      return {
        configuracion: parsed.configuracion || INITIAL_CONFIGURACION,
        clases,
        vocabulario,
        verbos: parsed.verbos || INITIAL_VERBOS,
        textoExplicativo,
        textosBase,
        reactivos,
        exposiciones: parsed.exposiciones || INITIAL_EXPOSICIONES,
        examenes: parsed.examenes || INITIAL_EXPOSICIONES,
        progresoUsuario: parsed.progresoUsuario || INITIAL_PROGRESO_USUARIO,
        resumenProgreso: parsed.resumenProgreso || INITIAL_RESUMEN_PROGRESO,
        usuarios: parsed.usuarios || INITIAL_USUARIOS,
        lastSyncedAt: parsed.lastSyncedAt || new Date().toISOString(),
        sourceUrl: parsed.sourceUrl || 'Google Sheets / Datasheet Maestro',
      };
      }
    }
  } catch (e) {
    console.warn('Could not read datasheet from storage, using defaults', e);
  }

  return {
    configuracion: INITIAL_CONFIGURACION,
    clases: INITIAL_CLASES,
    vocabulario: INITIAL_VOCABULARIO,
    verbos: INITIAL_VERBOS,
    textoExplicativo: INITIAL_TEXTO_EXPLICATIVO,
    textosBase: INITIAL_TEXTOS_BASE,
    reactivos: INITIAL_REACTIVOS,
    exposiciones: INITIAL_EXPOSICIONES,
    examenes: INITIAL_EXAMENES,
    progresoUsuario: INITIAL_PROGRESO_USUARIO,
    resumenProgreso: INITIAL_RESUMEN_PROGRESO,
    usuarios: INITIAL_USUARIOS,
    lastSyncedAt: new Date().toISOString(),
    sourceUrl: 'Google Sheets / Datasheet Maestro',
  };
}

export function saveDatasheetToStorage(data: DatasheetState): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Error saving datasheet to storage', e);
  }
}

// --------------------------------------------------------------------------
// LÓGICA DE ACTUALIZACIÓN DE PROGRESO EN TIEMPO REAL (ACCIONES A Y B)
// --------------------------------------------------------------------------
export interface SubmitAnswerParams {
  user_id: string;
  clase_id: string;
  habilidad: string;
  reactivo_id: string;
  respuesta_usuario: string;
  correcto: boolean;
  tiempo_respuesta_seg: number;
  puntaje_obtenido?: number;
}

export interface SubmitAnswerResult {
  detalle: SheetProgresoUsuarioRow;
  resumen: SheetResumenProgresoRow;
  desbloqueo?: {
    clase_desbloqueada_id: string;
    clase_desbloqueada_titulo: string;
    mensaje: string;
  };
  nuevo_porcentaje: number;
  xp_ganados: number;
}

export function recordAnswerAndUpdateProgress(params: SubmitAnswerParams): SubmitAnswerResult {
  const puntaje = params.puntaje_obtenido !== undefined 
    ? params.puntaje_obtenido 
    : (params.correcto ? 10 : 0);

  // Acción A: Guardar el detalle (Hoja PROGRESO_USUARIO)
  const newDetalle: SheetProgresoUsuarioRow = {
    progreso_id: `PRG_${Date.now()}_${params.reactivo_id}`,
    user_id: params.user_id,
    clase_id: params.clase_id,
    habilidad: params.habilidad,
    reactivo_id: params.reactivo_id,
    respuesta_usuario: params.respuesta_usuario,
    correcto: params.correcto,
    tiempo_respuesta_seg: params.tiempo_respuesta_seg,
    puntaje_obtenido: puntaje,
    fecha_registro: new Date().toISOString(),
  };

  const state = loadDatasheetFromStorage();
  const existingProgreso = state.progresoUsuario || [];
  // Evitar duplicados del mismo reactivo por el mismo usuario
  const filteredProgreso = existingProgreso.filter(
    (p) => !(p.user_id === params.user_id && p.reactivo_id === params.reactivo_id)
  );
  state.progresoUsuario = [...filteredProgreso, newDetalle];

  // Acción B: Actualizar el resumen (Hoja RESUMEN_PROGRESO)
  const existingResumenList = [...(state.resumenProgreso || [])];
  const resumenIdx = existingResumenList.findIndex(
    (r) => r.user_id === params.user_id && r.clase_id === params.clase_id
  );

  let updatedResumen: SheetResumenProgresoRow;
  let wasCompleted = false;

  if (resumenIdx >= 0) {
    const existing = existingResumenList[resumenIdx];
    wasCompleted = existing.estado_clase === 'completada' || existing.porcentaje_avance >= 100;
    const newCorrectos = (existing.reactivos_correctos || 0) + (params.correcto ? 1 : 0);
    const newPuntaje = (existing.puntaje_obtenido || 0) + puntaje;
    const newResueltos = (existing.reactivos_resueltos || 0) + 1;
    // 500 Puntos = 100% (50 reactivos * 10 puntos o puntaje max 500)
    const newPorcentaje = Math.min(100, Math.round((newPuntaje / 500) * 100));
    const habs = existing.habilidades_completadas || 0;
    const newEstado = habs >= 5 || newPorcentaje >= 100 ? 'completada' : (habs > 0 || newCorrectos > 0 ? 'en_progreso' : 'pendiente');

    updatedResumen = {
      ...existing,
      reactivos_correctos: newCorrectos,
      puntaje_obtenido: newPuntaje,
      porcentaje_avance: newPorcentaje,
      xp_ganado: newPuntaje,
      estado_clase: newEstado,
      ultima_actualizacion: new Date().toISOString(),
      xp_obtenidos: newPuntaje,
      reactivos_resueltos: newResueltos,
    };
    existingResumenList[resumenIdx] = updatedResumen;
  } else {
    const newPuntaje = puntaje;
    const newPorcentaje = Math.min(100, Math.round((newPuntaje / 500) * 100));
    const newEstado = newPorcentaje >= 100 ? 'completada' : (params.correcto ? 'en_progreso' : 'pendiente');

    updatedResumen = {
      resumen_id: `RES_${params.user_id}_${params.clase_id}`,
      user_id: params.user_id,
      clase_id: params.clase_id,
      habilidades_completadas: 0,
      reactivos_totales_clase: 50,
      reactivos_correctos: params.correcto ? 1 : 0,
      puntaje_obtenido: newPuntaje,
      puntaje_maximo_posible: 500,
      porcentaje_avance: newPorcentaje,
      xp_ganado: newPuntaje,
      estado_clase: newEstado,
      ultima_actualizacion: new Date().toISOString(),
      xp_obtenidos: newPuntaje,
      reactivos_resueltos: 1,
    };
    existingResumenList.push(updatedResumen);
  }

  // 2. Lógica de Desbloqueo (Gamificación)
  let desbloqueo: { clase_desbloqueada_id: string; clase_desbloqueada_titulo: string; mensaje: string } | undefined;

  if (updatedResumen.porcentaje_avance >= 100 && !wasCompleted) {
    updatedResumen.estado_clase = 'completada';

    // Desbloquear la siguiente clase
    const currentClassIdx = INITIAL_CLASES.findIndex((c) => c.clase_id === params.clase_id);
    if (currentClassIdx >= 0 && currentClassIdx < INITIAL_CLASES.length - 1) {
      const nextClase = INITIAL_CLASES[currentClassIdx + 1];
      const nextIdx = existingResumenList.findIndex(
        (r) => r.user_id === params.user_id && r.clase_id === nextClase.clase_id
      );

      if (nextIdx >= 0) {
        if (existingResumenList[nextIdx].estado_clase === 'bloqueada') {
          existingResumenList[nextIdx].estado_clase = 'disponible';
        }
      } else {
        existingResumenList.push({
          resumen_id: `RES_${params.user_id}_${nextClase.clase_id}`,
          user_id: params.user_id,
          clase_id: nextClase.clase_id,
          xp_obtenidos: 0,
          reactivos_resueltos: 0,
          porcentaje_avance: 0,
          estado_clase: 'disponible',
          ultima_actualizacion: new Date().toISOString(),
        });
      }

      const msg = params.clase_id === 'A1_C01'
        ? "¡Felicidades! Completaste la Fase Cero. Desbloqueada: Clase 01"
        : `¡Felicidades! Completaste ${INITIAL_CLASES[currentClassIdx].titulo_clase}. Desbloqueada: ${nextClase.titulo_clase}`;

      desbloqueo = {
        clase_desbloqueada_id: nextClase.clase_id,
        clase_desbloqueada_titulo: nextClase.titulo_clase,
        mensaje: msg,
      };
    }
  }

  state.resumenProgreso = existingResumenList;
  saveDatasheetToStorage(state);

  return {
    detalle: newDetalle,
    resumen: updatedResumen,
    desbloqueo,
    nuevo_porcentaje: updatedResumen.porcentaje_avance,
    xp_ganados: puntaje,
  };
}

// Consulta rápida para UI (Frontend): Consulta ÚNICAMENTE RESUMEN_PROGRESO
export function getClaseResumenProgreso(userId: string, claseId: string): SheetResumenProgresoRow {
  const state = loadDatasheetFromStorage();
  const list = state.resumenProgreso || INITIAL_RESUMEN_PROGRESO;
  const found = list.find((r) => r.user_id === userId && r.clase_id === claseId);
  if (found) {
    return found;
  }
  return {
    resumen_id: `RES_${userId}_${claseId}`,
    user_id: userId,
    clase_id: claseId,
    habilidades_completadas: 0,
    reactivos_totales_clase: 50,
    reactivos_correctos: 0,
    puntaje_obtenido: 0,
    puntaje_maximo_posible: 500,
    porcentaje_avance: 0,
    xp_ganado: 0,
    estado_clase: 'pendiente',
    ultima_actualizacion: new Date().toISOString(),
    xp_obtenidos: 0,
    reactivos_resueltos: 0,
  };
}

// Consulta del Texto Base correspondiente a una clase desde la hoja TEXTOS_BASE
export function getTextoBaseFromSheet(claseId: string): SheetTextoBaseRow | null {
  try {
    const state = loadDatasheetFromStorage();
    const list = state.textosBase && state.textosBase.length > 0 ? state.textosBase : INITIAL_TEXTOS_BASE;
    const found = list.find((t) => t.clase_id.toUpperCase() === claseId.toUpperCase())
      || INITIAL_TEXTOS_BASE.find((t) => t.clase_id.toUpperCase() === claseId.toUpperCase());
    
    if (!found) return null;

    const titulo = found.titulo_texto || found.titulo || 'Reading Comprehension';
    const contenido = found.contenido_texto || found.contenido || '';
    const palabras = found.palabras_count || (contenido ? contenido.trim().split(/\s+/).length : 38);

    return {
      ...found,
      titulo_texto: titulo,
      titulo: titulo,
      contenido_texto: contenido,
      contenido: contenido,
      palabras_count: palabras,
      tiempo_audio_seg: found.tiempo_audio_seg || Math.max(15, Math.round(palabras * 0.6)),
      audio_tts_url: found.audio_tts_url || `https://assets.teclingo.com/audio/txt_${claseId.toLowerCase()}.mp3`,
      activo: found.activo !== undefined ? found.activo : true,
    };
  } catch (e) {
    console.warn('Error reading getTextoBaseFromSheet:', e);
    const fallback = INITIAL_TEXTOS_BASE.find((t) => t.clase_id.toUpperCase() === claseId.toUpperCase()) || INITIAL_TEXTOS_BASE[0];
    return fallback;
  }
}

// Direct standard exports for simple imports across components
export const clases: SheetClaseRow[] = INITIAL_CLASES;
export const progresoUsuario: SheetProgresoUsuarioRow[] = INITIAL_PROGRESO_USUARIO;
export const resumenProgreso: SheetResumenProgresoRow[] = INITIAL_RESUMEN_PROGRESO;
export const usuarios: SheetUsuarioRow[] = INITIAL_USUARIOS;

