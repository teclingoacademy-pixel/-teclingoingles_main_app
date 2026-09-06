/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * calendarService.ts
 * Servicio de Calendario Institucional — Data Lake (Google Sheets)
 * CRUD completo de eventos institucionales con sincronización opcional a Google Calendar
 */

import { API_BASE } from './apiConfig';

/** Identity API (Data Lake) — las acciones del Calendario Institucional viven en
 * el mismo Apps Script de identidad del ecosistema (Code.gs), igual que el resto
 * de los datos del Data Lake. */
const IDENTITY_API_URL =
  (import.meta.env.VITE_IDENTITY_API_URL as string | undefined)?.trim() ||
  'https://script.google.com/macros/s/AKfycby7SoFITEh4jp_MdvH3pwoi8HhdvOwJfmDC0l-0E6lTY0FBbs5y3MGyBLLJcoEnxpit/exec';

export type EventType = 'SCHOOL' | 'HOLIDAY' | 'TECLINGO';
export type EventVisibility = 'GLOBAL' | 'DOCENTE' | 'ALUMNO';

export interface CalendarEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  type: EventType;
  description: string;
  time?: string;
  visibility: EventVisibility[];
  createdBy: string;        // email del director
  createdAt: string;        // ISO timestamp
  updatedAt?: string;
  googleCalendarEventId?: string;  // ID del evento en Google Calendar (si se sincronizó)
}

/* ================================================================
   HELPERS
   ================================================================ */

function generateEventId(): string {
  return 'evt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
}

function getAuthHeaders(): Record<string, string> {
  const session = localStorage.getItem('tecnolingo_session');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed?.email) headers['X-User-Email'] = parsed.email;
      if (parsed?.token) headers['Authorization'] = `Bearer ${parsed.token}`;
    } catch { /* noop */ }
  }
  return headers;
}

/** Email del usuario actual, desde el mismo localStorage que usa el resto de la app. */
function getUserEmail(): string {
  const direct = localStorage.getItem('teclingo_user_email');
  if (direct) return direct;
  const session = localStorage.getItem('tecnolingo_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed?.email) return parsed.email;
    } catch { /* session puede ser un rol plano ('DIRECTOR', 'ALUMNO', ...) */ }
  }
  return '';
}

/** POST anti-CORS al Apps Script de identidad (mismo patrón que identityService.ts). */
async function postAlCalendario(payload: Record<string, unknown>, timeoutMs = 12000): Promise<any> {
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

/* ================================================================
   CRUD — DATA LAKE (CALENDAR_EVENTS vía Identity API / Code.gs)
   ================================================================ */

/**
 * Obtiene todos los eventos del calendario institucional.
 * Filtra automáticamente por año/mes si se proporcionan.
 */
export async function fetchCalendarEvents(
  year?: number,
  month?: number
): Promise<CalendarEvent[]> {
  try {
    const res = await postAlCalendario({
      action: 'obtenerEventosCalendario',
      year: year || undefined,
      month: month || undefined,
    });

    if (!res?.ok) throw new Error(res?.error || 'Error al obtener eventos');
    return (res.events || []).map((row: any) => {
      const rawVis = Array.isArray(row.visibility)
        ? row.visibility.join(',')
        : (row.visibility || 'GLOBAL');
      return {
        id: row.id,
        day: Number(row.day),
        month: Number(row.month),
        year: Number(row.year),
        title: row.title || '',
        type: (row.type || 'SCHOOL') as EventType,
        description: row.description || '',
        time: row.time || '',
        visibility: String(rawVis).split(',').map((v: string) => v.trim()).filter(Boolean) as EventVisibility[],
        createdBy: row.created_by || '',
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at,
        googleCalendarEventId: row.google_calendar_event_id || undefined,
      };
    });
  } catch (err) {
    console.error('[calendarService] fetchCalendarEvents error:', err);
    // Fallback: leer del localStorage si el Data Lake no responde
    const fallback = localStorage.getItem('tecnolingo_calendar_fallback');
    if (fallback) {
      const events = JSON.parse(fallback) as CalendarEvent[];
      if (year && month) return events.filter(e => e.year === year && e.month === month);
      return events;
    }
    return [];
  }
}

/**
 * Crea un nuevo evento institucional.
 * Solo el DIRECTOR puede ejecutar esta función (validado en backend).
 */
export async function createCalendarEvent(
  eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>
): Promise<CalendarEvent> {
  const email = getUserEmail();

  const newEvent: CalendarEvent = {
    ...eventData,
    id: generateEventId(),
    createdBy: email,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await postAlCalendario({
      action: 'crearEventoCalendario',
      email,
      event: {
        id: newEvent.id,
        day: newEvent.day,
        month: newEvent.month,
        year: newEvent.year,
        title: newEvent.title,
        type: newEvent.type,
        description: newEvent.description || '',
        time: newEvent.time || '',
        visibility: newEvent.visibility,
        created_by: newEvent.createdBy,
        created_at: newEvent.createdAt,
        updated_at: newEvent.createdAt,
        google_calendar_event_id: newEvent.googleCalendarEventId || '',
      },
    });

    if (!res?.ok) throw new Error(res?.error || 'Error al crear evento');

    // Guardar fallback en localStorage
    const existing = JSON.parse(localStorage.getItem('tecnolingo_calendar_fallback') || '[]');
    existing.push(newEvent);
    localStorage.setItem('tecnolingo_calendar_fallback', JSON.stringify(existing));

    return newEvent;
  } catch (err) {
    console.error('[calendarService] createCalendarEvent error:', err);
    // Fallback: guardar solo en localStorage
    const existing = JSON.parse(localStorage.getItem('tecnolingo_calendar_fallback') || '[]');
    existing.push(newEvent);
    localStorage.setItem('tecnolingo_calendar_fallback', JSON.stringify(existing));
    return newEvent;
  }
}

/**
 * Actualiza un evento existente.
 */
export async function updateCalendarEvent(
  id: string,
  updates: Partial<Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>>
): Promise<CalendarEvent | null> {
  try {
    const res = await postAlCalendario({
      action: 'actualizarEventoCalendario',
      email: getUserEmail(),
      event_id: id,
      campos: (() => {
        const { googleCalendarEventId, visibility, ...rest } = updates;
        return {
          ...rest,
          ...(googleCalendarEventId !== undefined ? { google_calendar_event_id: googleCalendarEventId } : {}),
          visibility: Array.isArray(visibility) ? visibility.join(',') : visibility,
          updated_at: new Date().toISOString(),
        };
      })(),
    });

    if (!res?.ok) throw new Error(res?.error || 'Error al actualizar evento');

    // Actualizar fallback
    const existing = JSON.parse(localStorage.getItem('tecnolingo_calendar_fallback') || '[]');
    const idx = existing.findIndex((e: CalendarEvent) => e.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('tecnolingo_calendar_fallback', JSON.stringify(existing));
      return existing[idx];
    }
    return null;
  } catch (err) {
    console.error('[calendarService] updateCalendarEvent error:', err);
    // Fallback
    const existing = JSON.parse(localStorage.getItem('tecnolingo_calendar_fallback') || '[]');
    const idx = existing.findIndex((e: CalendarEvent) => e.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('tecnolingo_calendar_fallback', JSON.stringify(existing));
      return existing[idx];
    }
    return null;
  }
}

/**
 * Elimina un evento institucional.
 */
export async function deleteCalendarEvent(id: string): Promise<boolean> {
  try {
    const res = await postAlCalendario({
      action: 'eliminarEventoCalendario',
      email: getUserEmail(),
      event_id: id,
    });

    if (!res?.ok) throw new Error(res?.error || 'Error al eliminar evento');

    // Actualizar fallback
    const existing = JSON.parse(localStorage.getItem('tecnolingo_calendar_fallback') || '[]');
    const filtered = existing.filter((e: CalendarEvent) => e.id !== id);
    localStorage.setItem('tecnolingo_calendar_fallback', JSON.stringify(filtered));

    return true;
  } catch (err) {
    console.error('[calendarService] deleteCalendarEvent error:', err);
    // Fallback
    const existing = JSON.parse(localStorage.getItem('tecnolingo_calendar_fallback') || '[]');
    const filtered = existing.filter((e: CalendarEvent) => e.id !== id);
    localStorage.setItem('tecnolingo_calendar_fallback', JSON.stringify(filtered));
    return true;
  }
}

/* ================================================================
   SINCRONIZACIÓN CON GOOGLE CALENDAR (Opcional)
   ================================================================ */

/**
 * Crea un evento en Google Calendar vinculado al evento institucional.
 * Requiere que el usuario haya autorizado OAuth2 con scope de Calendar.
 */
export async function syncToGoogleCalendar(
  event: CalendarEvent,
  accessToken: string
): Promise<string | null> {
  try {
    const dateStr = `${event.year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`;
    const hasTime = event.time && event.time.includes(':');

    // Parsear hora si existe
    let startDateTime = dateStr;
    let endDateTime = dateStr;

    if (hasTime) {
      const [timePart, meridian] = event.time!.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (meridian?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (meridian?.toUpperCase() === 'AM' && hours === 12) hours = 0;
      startDateTime = `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      endDateTime = `${dateStr}T${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    }

    const googleEvent = {
      summary: `[TECLINGO] ${event.title}`,
      description: event.description + `\n\nTipo: ${event.type}\nVisibilidad: ${event.visibility.join(', ')}\nID: ${event.id}`,
      start: hasTime
        ? { dateTime: startDateTime, timeZone: 'America/Mexico_City' }
        : { date: dateStr, timeZone: 'America/Mexico_City' },
      end: hasTime
        ? { dateTime: endDateTime, timeZone: 'America/Mexico_City' }
        : { date: dateStr, timeZone: 'America/Mexico_City' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'email', minutes: 1440 },
        ],
      },
    };

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEvent),
    });

    if (!res.ok) throw new Error(`Google Calendar HTTP ${res.status}`);
    const data = await res.json();

    // Guardar el ID de Google Calendar en el evento
    await updateCalendarEvent(event.id, { googleCalendarEventId: data.id });

    return data.id;
  } catch (err) {
    console.error('[calendarService] syncToGoogleCalendar error:', err);
    return null;
  }
}

/**
 * Elimina un evento de Google Calendar.
 */
export async function deleteFromGoogleCalendar(
  googleEventId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return res.ok || res.status === 410; // 410 = already deleted
  } catch (err) {
    console.error('[calendarService] deleteFromGoogleCalendar error:', err);
    return false;
  }
}

/**
 * Obtiene el token de acceso de Google Calendar desde el backend.
 * El backend debe tener el refresh token almacenado para el director.
 */
export async function getGoogleCalendarToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/google-calendar-token`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken || null;
  } catch {
    return null;
  }
}