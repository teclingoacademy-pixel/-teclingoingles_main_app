/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken, SCOPES } from './googleAuth';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

/**
 * Validar si el usuario cuenta con token activo para interactuar con Google Workspace
 */
export const hasWorkspaceToken = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return Boolean(token);
};

/**
 * Listar hojas de cálculo de Google Sheets accesibles en Google Drive con el scope autorizado
 */
export const listDriveSpreadsheets = async (): Promise<{
  success: boolean;
  files: DriveSpreadsheetFile[];
  error?: string;
}> => {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      files: [],
      error: 'Inicia sesión con Google para listar tus hojas de cálculo.',
    };
  }

  try {
    const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&pageSize=20`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        files: [],
        error: err.error?.message || `Error ${res.status} al consultar Google Drive`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      files: data.files || [],
    };
  } catch (e: unknown) {
    return {
      success: false,
      files: [],
      error: e instanceof Error ? e.message : 'Error inesperado al conectar con Google Drive',
    };
  }
};

/**
 * Obtener detalles y pestañas de una hoja de cálculo
 */
export const getSpreadsheetMetadata = async (spreadsheetId: string): Promise<{
  success: boolean;
  title?: string;
  sheets?: { title: string; sheetId: number }[];
  error?: string;
}> => {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Token de Google no disponible. Inicia sesión con Google.',
    };
  }

  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties(sheetId,title)`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.error?.message || `Error ${res.status} al leer la hoja de cálculo`,
      };
    }

    const data = await res.json();
    interface SheetApiItem {
      properties?: {
        sheetId?: number;
        title?: string;
      };
    }
    const sheets = (data.sheets || []).map((s: SheetApiItem) => ({
      title: s.properties?.title || 'Sin título',
      sheetId: s.properties?.sheetId ?? 0,
    }));

    return {
      success: true,
      title: data.properties?.title,
      sheets,
    };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Error al conectar con Google Sheets',
    };
  }
};

/**
 * Leer un rango específico de valores de Google Sheets
 */
export const readSpreadsheetValues = async (
  spreadsheetId: string,
  range: string
): Promise<{ success: boolean; values?: (string | number | boolean)[][]; error?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: 'Inicia sesión con Google para leer datos.' };
  }

  try {
    const encodedRange = encodeURIComponent(range);
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.error?.message || `Error ${res.status} al leer el rango de celdas`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      values: data.values || [],
    };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Error al leer celdas en Google Sheets',
    };
  }
};

/**
 * REGLA DE ESCRITURA: Anexar filas en Google Sheets
 * Soporta modo directo o con diálogo de confirmación explícita según necesidad.
 */
export const appendSpreadsheetRow = async (
  spreadsheetId: string,
  sheetName: string,
  rowValues: (string | number | boolean)[],
  actionDescription: string = '¿Deseas agregar este registro a tu hoja de cálculo de Google Sheets?',
  requireConfirmation: boolean = false
): Promise<{ success: boolean; updatedRows?: number; error?: string }> => {
  if (requireConfirmation) {
    const userConfirmed = window.confirm(actionDescription);
    if (!userConfirmed) {
      return {
        success: false,
        error: 'Operación cancelada por el usuario.',
      };
    }
  }

  return appendSpreadsheetRowDirect(spreadsheetId, sheetName, rowValues);
};

/**
 * Anexar directamente una fila a una hoja de Google Sheets utilizando el token de acceso activo.
 */
export const appendSpreadsheetRowDirect = async (
  spreadsheetId: string,
  sheetName: string,
  rowValues: (string | number | boolean)[]
): Promise<{ success: boolean; updatedRows?: number; error?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: 'No se encontró un token de Google activo.' };
  }

  try {
    const encodedRange = encodeURIComponent(`${sheetName}!A1`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.error?.message || `Error ${res.status} al escribir en Google Sheets`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      updatedRows: data.updates?.updatedRows || 1,
    };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Error al guardar datos en Google Sheets',
    };
  }
};

/**
 * Actualizar un rango específico en Google Sheets utilizando el token de acceso activo (PUT).
 */
export const updateSpreadsheetValuesDirect = async (
  spreadsheetId: string,
  range: string,
  values: (string | number | boolean)[][]
): Promise<{ success: boolean; updatedCells?: number; error?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: 'No se encontró un token de Google activo.' };
  }

  try {
    const encodedRange = encodeURIComponent(range);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.error?.message || `Error ${res.status} al actualizar celdas en Google Sheets`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      updatedCells: data.updatedCells || 1,
    };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Error al actualizar celdas en Google Sheets',
    };
  }
};

