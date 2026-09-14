/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * calendarRoutes.ts
 * Endpoints del backend para el Calendario Institucional TECLINGO
 * 
 * Rutas:
 *   GET    /api/data-lake/calendar?year=&month=
 *   POST   /api/data-lake/calendar
 *   PUT    /api/data-lake/calendar/:id
 *   DELETE /api/data-lake/calendar/:id
 *   GET    /api/auth/google-calendar-token
 */

import { Router } from 'express';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const router = Router();
const SPREADSHEET_ID = process.env.DATA_LAKE_SHEET_ID!;
const SHEET_TITLE = 'CALENDAR_EVENTS';

// ─── Autenticación con Service Account ───────────────────────────
const serviceAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth: serviceAuth as any });

// ─── Helper: obtener sheetId de la pestaña ───────────────────────
async function getCalendarSheetId(): Promise<number | undefined> {
  const doc = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  return doc.data.sheets?.find((s) => s.properties?.title === SHEET_TITLE)?.properties?.sheetId ?? undefined;
}

// ═════════════════════════════════════════════════════════════════
// GET /api/data-lake/calendar
// Lista eventos. Filtra por year y month si se proporcionan.
// ═════════════════════════════════════════════════════════════════
router.get('/data-lake/calendar', async (req, res) => {
  try {
    const { year, month } = req.query;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TITLE}!A2:M1000`,
    });

    const rows = result.data.values || [];
    let events = rows.map((row) => ({
      id: row[0] || '',
      day: row[1] || '',
      month: row[2] || '',
      year: row[3] || '',
      title: row[4] || '',
      type: row[5] || '',
      description: row[6] || '',
      time: row[7] || '',
      visibility: row[8] || 'GLOBAL',
      created_by: row[9] || '',
      created_at: row[10] || '',
      updated_at: row[11] || '',
      google_calendar_event_id: row[12] || '',
    }));

    if (year && month) {
      events = events.filter(
        (e) => String(e.year) === String(year) && String(e.month) === String(month)
      );
    } else if (year) {
      events = events.filter((e) => String(e.year) === String(year));
    }

    res.json({ events, count: events.length });
  } catch (err: any) {
    console.error('[Calendar API] GET error:', err);
    res.status(500).json({ error: err.message, events: [] });
  }
});

// ═════════════════════════════════════════════════════════════════
// POST /api/data-lake/calendar
// Crea un nuevo evento. Requiere validación de rol DIRECTOR.
// ═════════════════════════════════════════════════════════════════
router.post('/data-lake/calendar', async (req, res) => {
  try {
    const { event } = req.body;
    const userEmail = req.headers['x-user-email'] as string;

    if (!userEmail) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // TODO: Verificar que el usuario sea DIRECTOR en tu sistema
    // const user = await getUserByEmail(userEmail);
    // if (user.rol !== 'DIRECTOR') return res.status(403).json({ error: 'Solo el director puede crear eventos' });

    if (!event?.title || !event?.day || !event?.month || !event?.year) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TITLE}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          event.id,
          event.day,
          event.month,
          event.year,
          event.title,
          event.type,
          event.description || '',
          event.time || '',
          event.visibility || 'GLOBAL',
          event.created_by || userEmail,
          event.created_at || new Date().toISOString(),
          event.updated_at || new Date().toISOString(),
          event.google_calendar_event_id || '',
        ]],
      },
    });

    res.status(201).json({ success: true, event });
  } catch (err: any) {
    console.error('[Calendar API] POST error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════════
// PUT /api/data-lake/calendar/:id
// Actualiza campos de un evento existente.
// ═════════════════════════════════════════════════════════════════
router.put('/data-lake/calendar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { updates } = req.body;
    const userEmail = req.headers['x-user-email'] as string;

    if (!userEmail) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar la fila del evento
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TITLE}!A2:A1000`,
    });
    const rows = result.data.values || [];
    const rowIndex = rows.findIndex((r) => r[0] === id);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const sheetRow = rowIndex + 2; // +2 porque empieza en A2

    const colMap: Record<string, number> = {
      day: 1,
      month: 2,
      year: 3,
      title: 4,
      type: 5,
      description: 6,
      time: 7,
      visibility: 8,
      updated_at: 11,
      google_calendar_event_id: 12,
    };

    for (const [key, value] of Object.entries(updates)) {
      const col = colMap[key];
      if (col !== undefined) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_TITLE}!${String.fromCharCode(65 + col)}${sheetRow}`,
          valueInputOption: 'RAW',
          requestBody: { values: [[value]] },
        });
      }
    }

    res.json({ success: true, message: 'Evento actualizado' });
  } catch (err: any) {
    console.error('[Calendar API] PUT error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════════
// DELETE /api/data-lake/calendar/:id
// Elimina un evento por su ID.
// ═════════════════════════════════════════════════════════════════
router.delete('/data-lake/calendar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers['x-user-email'] as string;

    if (!userEmail) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TITLE}!A2:A1000`,
    });
    const rows = result.data.values || [];
    const rowIndex = rows.findIndex((r) => r[0] === id);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const sheetRow = rowIndex + 2;
    const sheetId = await getCalendarSheetId();

    if (!sheetId) {
      return res.status(500).json({ error: 'No se encontró la pestaña' });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: sheetRow - 1,
                endIndex: sheetRow,
              },
            },
          },
        ],
      },
    });

    res.json({ success: true, message: 'Evento eliminado' });
  } catch (err: any) {
    console.error('[Calendar API] DELETE error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════════
// GET /api/auth/google-calendar-token
// Obtiene un access token fresco para Google Calendar API.
// Requiere que el director haya vinculado su cuenta previamente.
// ═════════════════════════════════════════════════════════════════

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CALENDAR_CLIENT_ID,
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
  `${process.env.APP_URL}/auth/google-calendar/callback`
);

router.get('/auth/google-calendar-token', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] as string;
    if (!userEmail) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // TODO: Recuperar refresh_token del director desde tu base de datos
    // const director = await getDirectorByEmail(userEmail);
    // if (!director?.googleCalendarRefreshToken) {
    //   return res.status(400).json({ error: 'Google Calendar no vinculado' });
    // }

    // oauth2Client.setCredentials({ refresh_token: director.googleCalendarRefreshToken });
    // const { token } = await oauth2Client.getAccessToken();
    // res.json({ accessToken: token });

    // Placeholder hasta que implementes la DB:
    res.status(501).json({ error: 'Implementar recuperación de refresh_token desde DB' });
  } catch (err: any) {
    console.error('[Calendar API] Token error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════════
// OAuth: Iniciar vinculación con Google Calendar
// GET /api/auth/google-calendar
// ═════════════════════════════════════════════════════════════════
router.get('/auth/google-calendar', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state: req.headers['x-user-email'] as string, // pasar email para identificar al director
  });
  res.redirect(url);
});

// ═════════════════════════════════════════════════════════════════
// OAuth: Callback de Google Calendar
// GET /api/auth/google-calendar/callback
// ═════════════════════════════════════════════════════════════════
router.get('/auth/google-calendar/callback', async (req, res) => {
  try {
    const { code, state: userEmail } = req.query;
    if (!code || !userEmail) {
      return res.status(400).send('Faltan parámetros');
    }

    const { tokens } = await oauth2Client.getToken(code as string);

    // TODO: Guardar tokens.refresh_token en tu base de datos vinculado al director
    // await saveDirectorGoogleTokens(userEmail as string, tokens);

    res.send(`
      <html>
        <body style="background:#061a1a;color:#DEFF9A;font-family:sans-serif;text-align:center;padding-top:20vh;">
          <h1>✅ Google Calendar vinculado</h1>
          <p>Puedes cerrar esta ventana y volver a TECLINGO PRO.</p>
          <script>window.opener?.postMessage('google-calendar-linked','*');window.close();</script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('[OAuth] Google Calendar callback error:', err);
    res.status(500).send('Error al vincular Google Calendar');
  }
});

export default router;