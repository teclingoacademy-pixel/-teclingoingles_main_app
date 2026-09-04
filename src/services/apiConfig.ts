/**
 * API Configuration — centralized base URL for backend endpoints.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  '';

export const API_BASE = API_BASE_URL;

export const DATA_LAKE_SHEET_ID = 'CALENDAR_EVENTS';

/** Google Drive folder IDs for certification document storage */
export const DRIVE_FOLDER_DOCENTES =
  (import.meta.env.VITE_DRIVE_FOLDER_DOCENTES as string | undefined)?.trim() || '';

export const DRIVE_FOLDER_ALUMNOS =
  (import.meta.env.VITE_DRIVE_FOLDER_ALUMNOS as string | undefined)?.trim() || '';

/** Helper: builds full URL for a given backend path (e.g. '/api/tutor') */
export function apiUrl(path: string): string {
  if (!API_BASE_URL) return path; // fallback to relative path (local dev)
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
