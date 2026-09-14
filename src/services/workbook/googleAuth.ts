/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Authentication & OAuth 2.0 nativo mediante Google Identity Services (GSI).
 * Totalmente desacoplado de Firebase para evitar sobrecarga y errores de políticas de ventanas (COOP).
 */

// Scopes autorizados para Google Workspace (Google Sheets, Drive y Perfil)
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Metadatos de credenciales provistas por el usuario
export const GOOGLE_PROJECT_INFO = {
  projectId: 'tecligo-workbook-v1',
  serviceAccountEmail: 'teclingo-workbook@tecligo-workbook-v1.iam.gserviceaccount.com',
  serviceAccountId: '100411064965208412441',
  webOAuthClientId: '795270689198-58so4bqnf3gahrvcu7a0trlhu0qlr440.apps.googleusercontent.com',
  firebaseProjectId: 'tecligo-workbook-v1',
  scopes: SCOPES,
};

// Declaración global para Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
              expires_in?: number;
            }) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
          revoke?: (token: string, done: () => void) => void;
        };
      };
    };
  }
}

// Cache en memoria del access_token (aislado, seguro para llamadas a Google Sheets API v4)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface GoogleAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface GoogleAuthResult {
  user: GoogleAuthUser;
  accessToken: string | null;
  email: string;
  displayName: string;
  photoURL: string | null;
}

/**
 * Esperar a que la librería de Google Identity Services esté disponible en window
 */
const waitForGsi = async (maxWaitMs = 5000): Promise<boolean> => {
  if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
    return true;
  }

  // Si no está inyectado el script, inyectarlo dinámicamente
  if (typeof document !== 'undefined' && !document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    if (window.google?.accounts?.oauth2) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
};

/**
 * Iniciar sesión con Google usando Google Identity Services (GSI - Token Client Oficial)
 * Solicita acceso directo a Google Sheets y perfil sin intermediarios de Firebase.
 */
export const googleSignIn = async (): Promise<GoogleAuthResult> => {
  if (isSigningIn) {
    throw new Error('Ya hay un proceso de autenticación en curso.');
  }

  const isReady = await waitForGsi();
  if (!isReady || !window.google?.accounts?.oauth2) {
    throw new Error('No se pudo cargar Google Identity Services. Verifica tu conexión a internet.');
  }

  isSigningIn = true;

  return new Promise<GoogleAuthResult>((resolve, reject) => {
    try {
      const tokenClient = window.google!.accounts!.oauth2!.initTokenClient({
        client_id: GOOGLE_PROJECT_INFO.webOAuthClientId,
        scope: SCOPES.join(' '),
        prompt: 'select_account',
        callback: async (response) => {
          isSigningIn = false;
          if (response.error) {
            console.error('Error de Google OAuth:', response);
            reject(new Error(response.error_description || response.error));
            return;
          }

          const token = response.access_token || null;
          if (!token) {
            reject(new Error('No se recibió token de acceso de Google'));
            return;
          }

          cachedAccessToken = token;

          try {
            // Obtener perfil del usuario directamente de Google UserInfo API v3
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!profileRes.ok) {
              throw new Error('No se pudo obtener el perfil de usuario');
            }

            const profile = await profileRes.json();
            const uid = profile.sub || `g_${Date.now()}`;
            const email = (profile.email || '').toLowerCase();
            const displayName = profile.name || email.split('@')[0] || 'Estudiante Google';
            const photoURL = profile.picture || null;

            const authUser: GoogleAuthUser = {
              uid,
              email,
              displayName,
              photoURL,
            };

            resolve({
              user: authUser,
              accessToken: token,
              email,
              displayName,
              photoURL,
            });
          } catch (profileErr) {
            console.warn('Aviso al recuperar perfil detallado de Google:', profileErr);
            const fallbackUser: GoogleAuthUser = {
              uid: `g_${Date.now()}`,
              email: '',
              displayName: 'Estudiante Google',
              photoURL: null,
            };

            resolve({
              user: fallbackUser,
              accessToken: token,
              email: '',
              displayName: 'Estudiante Google',
              photoURL: null,
            });
          }
        },
        error_callback: (err) => {
          isSigningIn = false;
          console.warn('Error callback de Google OAuth:', err);
          reject(new Error(err?.message || 'Ventana de inicio de Google cancelada o bloqueada.'));
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      isSigningIn = false;
      reject(err);
    }
  });
};

/**
 * Obtener token de acceso en memoria
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Asignar token en memoria
 */
export const setCachedAccessToken = (token: string | null): void => {
  cachedAccessToken = token;
};

/**
 * Cerrar sesión de Google
 */
export const googleSignOut = async (): Promise<void> => {
  if (cachedAccessToken && window.google?.accounts?.oauth2?.revoke) {
    try {
      window.google.accounts.oauth2.revoke(cachedAccessToken, () => {});
    } catch {
      // Ignorar errores al revocar
    }
  }
  cachedAccessToken = null;
};

/**
 * Inspeccionar los scopes y validez del token en vivo contra la API de Google
 */
export const inspectTokenInfo = async (token?: string | null): Promise<{
  valid: boolean;
  scopes?: string[];
  expires_in?: number;
  email?: string;
  error?: string;
}> => {
  const activeToken = token || cachedAccessToken;
  if (!activeToken) {
    return { valid: false, error: 'No hay token activo en memoria' };
  }

  try {
    const res = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${activeToken}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { valid: false, error: errJson.error_description || 'Token inválido o expirado' };
    }
    const data = await res.json();
    const scopesList = typeof data.scope === 'string' ? data.scope.split(' ') : [];
    return {
      valid: true,
      scopes: scopesList,
      expires_in: data.expires_in,
      email: data.email,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Error al verificar token',
    };
  }
};

