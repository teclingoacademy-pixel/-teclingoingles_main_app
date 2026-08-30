/**
 * API Configuration — centralized base URL for backend endpoints.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  '';

/** Helper: builds full URL for a given backend path (e.g. '/api/tutor') */
export function apiUrl(path: string): string {
  if (!API_BASE_URL) return path; // fallback to relative path (local dev)
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
