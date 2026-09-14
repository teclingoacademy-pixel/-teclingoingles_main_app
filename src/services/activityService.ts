/**
 * activityService.ts
 * Servicio para guardar y leer actividades de alumnos en el Data Lake
 */

const ACTIVITY_API_URL = 'https://script.google.com/macros/s/AKfycbz1OBcF2logEt-r_gaOdpG9MhcjsVkz3_MZiJKf9iSS1T1lpYmAj_MoFtrssCnT7q-k/exec';
const ACTIVITY_SECRET = 'teclingo_secret_2026';

interface ActividadAlumno {
  email: string;
  lesson_id: string;
  skill: string;
  exercise_id: string;
  pregunta: string;
  respuesta_alumno: string;
  respuesta_correcta: string;
  es_correcta: boolean;
  fecha?: string;
  tiempo_segundos?: number;
  calificacion_docente?: string;
  retroalimentacion?: string;
  // Metadatos de intentos del alumno (para el análisis final en el Data Lake)
  intentos?: number;       // número de intentos fallidos en el ejercicio
  estado_final?: string;   // 'correct' | 'failed' (2ª oportunidad) | 'blocked' (2 errores)
}

interface ActividadResponse {
  ok: boolean;
  id?: string;
  action?: string;
  error?: string;
}

interface ObtenerActividadesResponse {
  ok: boolean;
  data?: any[];
  total?: number;
  error?: string;
}

/**
 * Guarda una actividad de alumno en el Data Lake
 */
export async function guardarActividadAlumno(actividad: ActividadAlumno): Promise<ActividadResponse> {
  try {
    const response = await fetch(ACTIVITY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'guardarActividadAlumno',
        secret: ACTIVITY_SECRET,
        ...actividad,
        fecha: actividad.fecha || new Date().toISOString()
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[activityService] Error guardando actividad:', error);
    return { ok: false, error: String(error) };
  }
}

/**
 * Obtiene todas las actividades de un alumno
 */
export async function obtenerActividadesAlumno(email: string, lessonId?: string): Promise<ObtenerActividadesResponse> {
  try {
    const response = await fetch(ACTIVITY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'obtenerActividadesAlumno',
        secret: ACTIVITY_SECRET,
        email,
        lesson_id: lessonId || ''
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[activityService] Error obteniendo actividades:', error);
    return { ok: false, error: String(error) };
  }
}

/**
 * Califica una actividad (para docentes)
 */
export async function calificarActividadAlumno(
  email: string,
  exerciseId: string,
  calificacion: string,
  retroalimentacion: string
): Promise<ActividadResponse> {
  try {
    const response = await fetch(ACTIVITY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'calificarActividadAlumno',
        secret: ACTIVITY_SECRET,
        email,
        exercise_id: exerciseId,
        calificacion_docente: calificacion,
        retroalimentacion
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[activityService] Error calificando actividad:', error);
    return { ok: false, error: String(error) };
  }
}
