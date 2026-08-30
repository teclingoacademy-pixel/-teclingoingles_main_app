/**
 * Identity Service — puente al Data Lake TECLINGO_IDENTITY_LAKE_V1.
 *
 * Identidad ÚNICA del ecosistema: un usuario existe UNA vez en el lake
 * (llave = email en minúsculas). Esta app delega en la Identity API.
 *
 * Patrón anti-CORS (probado en FASE 0): POST con body JSON pero
 * Content-Type text/plain;charset=utf-8. NUNCA mode:'no-cors'.
 */

const IDENTITY_API_URL =
  (import.meta.env.VITE_IDENTITY_API_URL as string | undefined)?.trim() ||
  'https://script.google.com/macros/s/AKfycbzJA5dkIj9IBlUbYewD-pIwA-RwScgAkk9DGBRI79R1n--FIZib_He6gKPum37X-WHK/exec';

const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ||
  '853891222522-t26sp8ig5kn5vfir05om765vr2i0jsj3.apps.googleusercontent.com';

export interface IdentidadResultado {
  ok: boolean;
  code?: string;
  error?: string;
  email?: string;
  perfil?: Record<string, unknown>;
}

interface LakeResponse {
  ok?: boolean;
  code?: string;
  error?: string;
  exists?: boolean;
  perfil?: Record<string, unknown>;
}

async function postAlLake(payload: Record<string, unknown>, timeoutMs = 12000): Promise<LakeResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(IDENTITY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return await resp.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Verifica si un email ya existe en el ecosistema */
export async function verificarEmail(email: string): Promise<boolean> {
  try {
    const res = await postAlLake({ action: 'verificarEmail', email: email.toLowerCase().trim() }, 8000);
    return Boolean(res?.ok && res.exists);
  } catch {
    return false;
  }
}

/**
 * Consulta el lake distinguiendo 3 estados. Se usa al arrancar la app para
 * evitar que una sesión fantasma en localStorage (pruebas previas) deje entrar
 * a un usuario SIN pasar por AuthPortal / registro.
 */
export type EstadoIdentidadLake = 'existe' | 'no_existe' | 'indefinido';
export async function consultarIdentidadEnLake(email: string): Promise<EstadoIdentidadLake> {
  try {
    const res = await postAlLake({ action: 'verificarEmail', email: email.toLowerCase().trim() }, 6000);
    if (res?.ok) return res.exists ? 'existe' : 'no_existe';
    return 'indefinido';
  } catch {
    return 'indefinido';
  }
}

/** Registra un usuario nuevo en el lake (hash de password generado server-side) */
export async function registrarUsuario(
  email: string,
  password: string,
  nombre: string,
  rol: string = 'ALUMNO',
  institutionCode: string = ''
): Promise<IdentidadResultado> {
  try {
    const res = await postAlLake({
      action: 'registrarUsuario',
      email: email.toLowerCase().trim(),
      password,
      nombre,
      metodo: 'email',
      rol,
      institution_code: institutionCode,
      origen_app: 'teclingo_v4',
    });
    if (res?.ok) {
      return { ok: true, code: res.code, email: res.perfil?.email as string, perfil: res.perfil };
    }
    return { ok: false, code: res?.code, error: res?.error };
  } catch (err) {
    console.warn('[Identity] Lake no disponible para registro:', err);
    return { ok: false, error: 'identity_unreachable' };
  }
}

/** Login con email y password */
export async function loginEmail(
  email: string,
  password: string
): Promise<IdentidadResultado> {
  try {
    const res = await postAlLake({
      action: 'loginEmail',
      email: email.toLowerCase().trim(),
      password,
      origen_app: 'teclingo_v4',
    });
    if (res?.ok && res.code === 'login_ok') {
      return { ok: true, code: 'login_ok', email: res.perfil?.email as string, perfil: res.perfil };
    }
    return { ok: false, code: res?.code, error: res?.error };
  } catch (err) {
    console.warn('[Identity] Lake no disponible para login:', err);
    return { ok: false, error: 'identity_unreachable' };
  }
}

/** Login con token de Google (validado por el lake contra tokeninfo) */
export async function loginGoogle(token: string, rol: string = 'ALUMNO', institutionCode: string = ''): Promise<IdentidadResultado> {
  if (!token) return { ok: false, error: 'token_requerido' };
  try {
    const res = await postAlLake({
      action: 'loginGoogle',
      token,
      client_id: GOOGLE_CLIENT_ID,
      rol,
      institution_code: institutionCode,
      origen_app: 'teclingo_v4',
    });
    if (res?.ok) {
      return { ok: true, code: res.code, email: res.perfil?.email as string, perfil: res.perfil };
    }
    return { ok: false, code: res?.code, error: res?.error };
  } catch (err) {
    console.warn('[Identity] Lake no disponible para loginGoogle:', err);
    return { ok: false, error: 'identity_unreachable' };
  }
}

/**
 * Completa el registro de un usuario de PRIMERA VEZ que entró con Google.
 * loginGoogle ya validó el token y dio de alta la identidad; esta función
 * asigna el rol (ALUMNO/DOCENTE/DIRECTOR) e institución que el usuario
 * eligió, garantizando que nunca entre al dashboard sin haber elegido su
 * tipo de perfil.
 */
export async function finalizarRegistroGoogle(
  email: string,
  rol: string,
  institutionCode: string = ''
): Promise<IdentidadResultado> {
  try {
    const res = await postAlLake({
      action: 'finalizarRegistroGoogle',
      email: email.toLowerCase().trim(),
      rol,
      institution_code: institutionCode,
      origen_app: 'teclingo_v4',
    });
    if (res?.ok) {
      return { ok: true, code: res.code, email: res.perfil?.email as string, perfil: res.perfil };
    }
    return { ok: false, code: res?.code, error: res?.error };
  } catch (err) {
    console.warn('[Identity] Lake no disponible para finalizarRegistroGoogle:', err);
    return { ok: false, error: 'identity_unreachable' };
  }
}

/** Obtiene el perfil completo de un usuario desde el lake */
export async function obtenerPerfil(email: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await postAlLake({ action: 'obtenerPerfil', email: email.toLowerCase().trim() }, 8000);
    if (res?.ok && res.perfil) {
      return res.perfil;
    }
    return null;
  } catch {
    return null;
  }
}

/** Registra un evento en LOG_ACTIVIDAD_GLOBAL del lake (fire-and-forget) */
export async function logActividadGlobal(
  email: string,
  herramienta: string,
  accion: string,
  detalle: string
): Promise<void> {
  try {
    await postAlLake({
      action: 'registrarActividadGlobal',
      email: email.toLowerCase().trim(),
      app: 'teclingo_v4',
      herramienta,
      accion,
      detalle,
    }, 5000);
  } catch {
    // Fire-and-forget: no bloquea la UI
  }
}

// ============================================================
// PERFIL COMPLETO
// ============================================================
//
// Nueva arquitectura de hojas separadas (reestructuración 2026):
//   - USUARIOS:   datos comunes de acceso + rol + avatar
//   - ALUMNOS:    phone, bio, curp, student_id, birth_date,
//                 student_number, career, shift
//   - DOCENTES:   phone, bio, degree, specialties, certifications
//   - DIRECTORES: phone, bio, institution_name, institution_logo,
//                 slogan, inst_phone, address, inst_email,
//                 facebook, instagram, linkedin, institution_code
//
// El front-end ahora SIEMPRE envía `rol` en cada llamada para que
// el backend (Apps Script) enrute a la hoja correcta.
// La hoja legacy `USERS` está oculta y no debe usarse.

export type RolUsuario = 'ALUMNO' | 'DOCENTE' | 'DIRECTOR';

export interface GuardarPerfilArgs {
  email: string;
  rol: RolUsuario;
  campos: Record<string, string>;
}

export async function guardarPerfil(
  emailOrArgs: string | GuardarPerfilArgs,
  camposLegacy?: Record<string, string>
): Promise<IdentidadResultado & { actualizados?: number; hoja?: string }> {
  // Compatibilidad hacia atrás: signature antigua (email, campos)
  const args: GuardarPerfilArgs = typeof emailOrArgs === 'string'
    ? { email: emailOrArgs, rol: 'ALUMNO', campos: camposLegacy || {} }
    : emailOrArgs;
  try {
    const res = await postAlLake({
      action: 'guardarPerfil',
      email: args.email.toLowerCase().trim(),
      rol: args.rol,
      campos: args.campos,
    }, 15000);
    if (res?.ok) {
      return {
        ok: true,
        perfil: res.perfil,
        actualizados: (res as any).actualizados,
        hoja: (res as any).hoja, // nombre de la hoja donde se persistió
      };
    }
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export interface ObtenerPerfilCompletoArgs {
  email: string;
  rol?: RolUsuario; // si no se pasa, el backend infiere por USUARIOS
}

export async function obtenerPerfilCompleto(
  emailOrArgs: string | ObtenerPerfilCompletoArgs
): Promise<Record<string, unknown> | null> {
  const args: ObtenerPerfilCompletoArgs = typeof emailOrArgs === 'string'
    ? { email: emailOrArgs }
    : emailOrArgs;
  try {
    const payload: Record<string, unknown> = {
      action: 'obtenerPerfilCompleto',
      email: args.email.toLowerCase().trim(),
    };
    if (args.rol) payload.rol = args.rol;
    const res = await postAlLake(payload, 8000);
    if (res?.ok && res.perfil) return res.perfil;
    return null;
  } catch { return null; }
}

// ============================================================
// METAS
// ============================================================

export async function registrarMeta(
  email: string, titulo: string, descripcion: string, plazo: string, origen_app: string
): Promise<IdentidadResultado & { id?: string }> {
  try {
    const res = await postAlLake({
      action: 'registrarMeta', email: email.toLowerCase().trim(),
      titulo, descripcion, plazo, origen_app
    });
    if (res?.ok) return { ok: true, id: (res as any).id };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export async function obtenerMetas(email: string): Promise<any[]> {
  try {
    const res = await postAlLake({ action: 'obtenerMetas', email: email.toLowerCase().trim() });
    if (res?.ok && (res as any).metas) return (res as any).metas;
    return [];
  } catch { return []; }
}

export async function actualizarMeta(
  email: string, id: string, campos: Record<string, string>
): Promise<IdentidadResultado> {
  try {
    const res = await postAlLake({ action: 'actualizarMeta', email: email.toLowerCase().trim(), id, campos });
    if (res?.ok) return { ok: true };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export async function eliminarMeta(email: string, id: string): Promise<IdentidadResultado> {
  try {
    const res = await postAlLake({ action: 'eliminarMeta', email: email.toLowerCase().trim(), id });
    if (res?.ok) return { ok: true };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

// ============================================================
// LOGROS
// ============================================================

export async function registrarLogro(
  email: string, logro_id: string, app_origen: string, titulo: string, descripcion: string
): Promise<IdentidadResultado & { id?: string }> {
  try {
    const res = await postAlLake({
      action: 'registrarLogro', email: email.toLowerCase().trim(),
      logro_id, app_origen, titulo, descripcion
    });
    if (res?.ok) return { ok: true, id: (res as any).id };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export async function obtenerLogros(email: string): Promise<any[]> {
  try {
    const res = await postAlLake({ action: 'obtenerLogros', email: email.toLowerCase().trim() });
    if (res?.ok && (res as any).logros) return (res as any).logros;
    return [];
  } catch { return []; }
}

// ============================================================
// PAGOS Y SUSCRIPCIONES (para consultas desde V4)
// ============================================================

export async function registrarPago(
  email: string, proveedor: string, referencia: string, monto: string,
  moneda: string, estado: string, origen_app: string
): Promise<IdentidadResultado & { id?: string }> {
  try {
    const res = await postAlLake({
      action: 'registrarPago', email: email.toLowerCase().trim(),
      proveedor, referencia, monto, moneda, estado, origen_app
    });
    if (res?.ok) return { ok: true, id: (res as any).id };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export async function registrarSuscripcion(
  email: string, plan: string, estado: string, origen_app: string
): Promise<IdentidadResultado & { id?: string }> {
  try {
    const res = await postAlLake({
      action: 'registrarSuscripcion', email: email.toLowerCase().trim(),
      plan, estado, origen_app
    });
    if (res?.ok) return { ok: true, id: (res as any).id };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

// ============================================================
// EMAIL DE BIENVENIDA
// ============================================================

export async function sendWelcomeEmail(
  email: string, nombre: string, metodo: string
): Promise<void> {
  try {
    const appUrl = window.location.origin;
    await postAlLake({
      action: 'sendWelcomeEmail',
      email: email.toLowerCase().trim(),
      nombre,
      metodo,
      app_url: appUrl,
    }, 5000);
  } catch { /* fire-and-forget */ }
}

// ============================================================
// GOOGLE DRIVE — AVATAR Y ARCHIVOS DE USUARIO
// ============================================================

export interface UploadAvatarResult {
  ok: boolean;
  fileUrl?: string;
  fileId?: string;
  code?: string;
  error?: string;
}

/** Sube imagen (base64) al Drive del usuario y actualiza el avatar en el perfil */
export async function uploadAvatar(
  email: string,
  imageBase64: string,
  fileName: string = 'avatar.jpg',
  mimeType: string = 'image/jpeg'
): Promise<UploadAvatarResult> {
  try {
    const res = await postAlLake({
      action: 'uploadAvatar',
      email: email.toLowerCase().trim(),
      imageBase64,
      fileName,
      mimeType,
    }, 30000); // 30s timeout para archivos grandes
    if (res?.ok) {
      return { ok: true, fileUrl: (res as any).fileUrl, fileId: (res as any).fileId };
    }
    return { ok: false, code: res?.code, error: res?.error };
  } catch (err) {
    console.warn('[Identity] uploadAvatar error:', err);
    return { ok: false, error: 'drive_unreachable' };
  }
}

// ============================================================
// MENSAJERÍA
// ============================================================

export async function registrarChat(
  email: string, chatId: string, name: string, type: string,
  participants: string[], lastMessage?: string
): Promise<IdentidadResultado & { chat_id?: string }> {
  try {
    const res = await postAlLake({
      action: 'registrarChat', email: email.toLowerCase().trim(),
      chat_id: chatId, name, type, participants, last_message: lastMessage || ''
    });
    if (res?.ok) return { ok: true, chat_id: (res as any).chat_id };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export async function registrarMensaje(
  email: string, chatId: string, content: string,
  senderName: string, senderRole: string, isDirector?: boolean
): Promise<IdentidadResultado & { msg_id?: string }> {
  try {
    const res = await postAlLake({
      action: 'registrarMensaje', email: email.toLowerCase().trim(),
      chat_id: chatId, content, sender_name: senderName,
      sender_role: senderRole, is_director: isDirector || false
    });
    if (res?.ok) return { ok: true, msg_id: (res as any).msg_id };
    return { ok: false, code: res?.code, error: res?.error };
  } catch { return { ok: false, error: 'lake_unreachable' }; }
}

export async function obtenerMensajes(
  chatId: string, limit?: number
): Promise<any[]> {
  try {
    const res = await postAlLake({
      action: 'obtenerMensajes', chat_id: chatId, limit: limit || 100
    });
    if (res?.ok && (res as any).mensajes) return (res as any).mensajes;
    return [];
  } catch { return []; }
}

export async function obtenerChats(
  email: string
): Promise<any[]> {
  try {
    const res = await postAlLake({
      action: 'obtenerChats', email: email.toLowerCase().trim()
    });
    if (res?.ok && (res as any).chats) return (res as any).chats;
    return [];
  } catch { return []; }
}

// ============================================================
// COMUNIDAD TECNOLINGO — LISTADO DE USUARIOS
// ============================================================

export interface UsuarioComunidad {
  id: string;
  email: string;
  nombre: string;
  rol: 'ALUMNO' | 'DOCENTE' | 'DIRECTOR';
  avatar: string;
  status: 'ACTIVE' | 'SUSPENDED';
  phone: string;
  curp: string;
  controlNumber: string;
  location: string;
  nivel: string;
  joinDate: string;
  hoja: string;
}

/**
 * Lista usuarios del Data Lake para la vista Comunidad Tecnolingo.
 * Une USUARIOS + ALUMNOS/DOCENTES/DIRECTORES por user_id.
 * Filtros: TODOS / DOCENTE / ALUMNO / DIRECTOR
 * Búsqueda: case-insensitive en nombre o email
 */
export async function listarUsuarios(
  filtro: 'TODOS' | 'DOCENTE' | 'ALUMNO' | 'DIRECTOR' = 'TODOS',
  buscar: string = ''
): Promise<UsuarioComunidad[]> {
  try {
    const res = await postAlLake({
      action: 'listarUsuarios',
      filtro,
      buscar
    }, 15000);
    if (res?.ok && Array.isArray((res as any).usuarios)) {
      return (res as any).usuarios as UsuarioComunidad[];
    }
    return [];
  } catch {
    return [];
  }
}

// ============================================================
// GRUPOS ACADÉMICOS
// ============================================================

export interface GrupoAcademico {
  grupo_id: string;
  director_email: string;
  institution_code: string;
  carrera: string;
  grado: string;
  seccion: string;
  turno: string;
  modalidad: string;
  materias: any[];
  horario: Record<string, string>;
  dias: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export async function listarGrupos(email: string): Promise<GrupoAcademico[]> {
  try {
    const res = await postAlLake({
      action: 'listarGrupos',
      email: email.toLowerCase().trim()
    }, 15000);
    if (res?.ok && Array.isArray((res as any).grupos)) {
      return (res as any).grupos as GrupoAcademico[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function crearGrupo(
  email: string,
  grupo: {
    carrera: string;
    grado: string;
    seccion: string;
    turno: string;
    modalidad?: string;
    materias?: any[];
    horario?: Record<string, string>;
    dias?: string;
  }
): Promise<IdentidadResultado & { grupo_id?: string }> {
  try {
    const res = await postAlLake({
      action: 'crearGrupo',
      email: email.toLowerCase().trim(),
      ...grupo,
      modalidad: grupo.modalidad || 'PRESENCIAL',
      dias: grupo.dias || 'LUN,MAR,MIÉ,JUE,VIE'
    }, 15000);
    if (res?.ok) {
      return { ok: true, grupo_id: (res as any).grupo_id };
    }
    return { ok: false, error: (res as any).error };
  } catch {
    return { ok: false, error: 'lake_unreachable' };
  }
}

export async function eliminarGrupo(email: string, grupoId: string): Promise<IdentidadResultado> {
  try {
    const res = await postAlLake({
      action: 'eliminarGrupo',
      email: email.toLowerCase().trim(),
      grupo_id: grupoId
    }, 15000);
    if (res?.ok) return { ok: true };
    return { ok: false, error: (res as any).error };
  } catch {
    return { ok: false, error: 'lake_unreachable' };
  }
}

export async function obtenerConfigAcademica(
  args: { email: string; director_email?: string }
): Promise<{ ok: boolean; institution_type?: string; carreras?: string[]; turnos?: string[]; modalidad?: string; defaults?: boolean; error?: string }> {
  try {
    const res = await postAlLake({
      action: 'obtenerConfigAcademica',
      email: args.email.toLowerCase().trim(),
      director_email: args.director_email?.toLowerCase().trim() || args.email.toLowerCase().trim()
    }, 15000);
    if (res?.ok) {
      return {
        ok: true,
        institution_type: (res as any).institution_type,
        carreras: (res as any).carreras || [],
        turnos: (res as any).turnos || [],
        modalidad: (res as any).modalidad,
        defaults: (res as any).defaults
      };
    }
    return { ok: false, error: (res as any).error };
  } catch {
    return { ok: false, error: 'lake_unreachable' };
  }
}

const identityService = {
  verificarEmail,
  consultarIdentidadEnLake,
  registrarUsuario,
  loginEmail,
  loginGoogle,
  finalizarRegistroGoogle,
  obtenerPerfil,
  logActividadGlobal,
  registrarMeta,
  obtenerMetas,
  actualizarMeta,
  eliminarMeta,
  registrarLogro,
  obtenerLogros,
  registrarPago,
  registrarSuscripcion,
  sendWelcomeEmail,
  guardarPerfil,
  obtenerPerfilCompleto,
  uploadAvatar,
  registrarChat,
  registrarMensaje,
  obtenerMensajes,
  obtenerChats,
  listarUsuarios,
  listarGrupos,
  crearGrupo,
  eliminarGrupo,
  obtenerConfigAcademica,
};
export default identityService;
