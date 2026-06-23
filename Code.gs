// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

// ID de tu hoja de Google Sheets (lo encuentras en la URL de la hoja)
const SHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

// Nombre de la pestaña donde se guardan los tickets
const SHEET_NAME = 'Tickets';

// Tu API Key de Google Gemini / Vertex AI (o la que uses para el OCR)
const GEMINI_API_KEY = 'TU_GEMINI_API_KEY_AQUI';

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL: maneja las peticiones POST del frontend
// ═══════════════════════════════════════════════════════════════════════════
function doPost(e) {
  // Cabecera CORS — necesaria para que el navegador acepte la respuesta
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    // Parsea el body (el frontend envía JSON con Content-Type: text/plain)
    const body = JSON.parse(e.postData.contents);

    // ── MODO 1: soloOCR ──────────────────────────────────────────────────
    // El frontend acaba de subir la imagen y quiere extraer los datos
    // para mostrárselos al usuario ANTES de guardarlos.
    if (body.soloOCR === true) {
      const datos = extraerDatosConOCR(body.imagenB64, body.tipoMime);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', ...datos }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── MODO 2: guardarDatos ─────────────────────────────────────────────
    // El usuario ya revisó/editó los datos y quiere guardarlos en el Sheet.
    if (body.guardarDatos === true) {
      guardarEnSheet({
        fecha_pago: body.fecha_pago || '',
        hora_pago:  body.hora_pago  || '',
        matricula:  body.matricula  || '',
        gasto:      body.gasto      || '',
      });
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', message: 'Datos guardados correctamente' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── MODO LEGACY (compatibilidad hacia atrás) ─────────────────────────
    // Si el frontend antiguo envía imagenB64 sin soloOCR ni guardarDatos,
    // hace todo el flujo completo (OCR + guardar) en un solo paso.
    if (body.imagenB64) {
      const datos = extraerDatosConOCR(body.imagenB64, body.tipoMime);
      guardarEnSheet(datos);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', ...datos }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Si no se reconoce ningún modo válido
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Petición no reconocida. Falta soloOCR, guardarDatos o imagenB64.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Error inesperado — devuelve el mensaje para facilitar el debug
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// OCR: Envía la imagen a la API de Gemini y extrae los campos del ticket
// ═══════════════════════════════════════════════════════════════════════════
function extraerDatosConOCR(imagenB64, tipoMime) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Analiza esta imagen de un ticket de aparcamiento o parking y extrae exactamente estos campos en formato JSON:
{
  "fecha_pago": "DD/MM/YYYY",
  "hora_pago": "HH:MM",
  "matricula": "MATRÍCULA DEL VEHÍCULO EN MAYÚSCULAS",
  "gasto": "IMPORTE NUMÉRICO CON COMA DECIMAL (ej: 1,50)"
}
Responde ÚNICAMENTE con el JSON, sin texto adicional, sin bloques de código, sin explicaciones.
Si no encuentras algún campo, usa cadena vacía "".`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: tipoMime || 'image/jpeg',
              data: imagenB64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,        // respuestas deterministas
      maxOutputTokens: 256,
    },
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseJson = JSON.parse(response.getContentText());

  // Extrae el texto generado por Gemini
  const rawText = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Limpia posibles bloques de código markdown (```json ... ```)
  const cleanText = rawText.replace(/```json|```/g, '').trim();

  let datos;
  try {
    datos = JSON.parse(cleanText);
  } catch (_) {
    // Si Gemini no devolvió JSON válido, devuelve campos vacíos
    datos = { fecha_pago: '', hora_pago: '', matricula: '', gasto: '' };
  }

  // Normaliza los campos: siempre strings, matrícula en mayúsculas
  return {
    fecha_pago: String(datos.fecha_pago || '').trim(),
    hora_pago:  String(datos.hora_pago  || '').trim(),
    matricula:  String(datos.matricula  || '').toUpperCase().trim(),
    gasto:      String(datos.gasto      || '').trim(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SHEET: Inserta una fila con los datos del ticket y ordena por fecha+hora
// ═══════════════════════════════════════════════════════════════════════════
function guardarEnSheet(datos) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(`No se encontró la pestaña "${SHEET_NAME}" en la hoja de cálculo.`);
  }

  // Añade la fila al final
  sheet.appendRow([
    datos.fecha_pago,
    datos.hora_pago,
    datos.matricula,
    datos.gasto,
    new Date(), // columna de auditoría: cuándo se registró
  ]);

  // Ordena por fecha (col A) y luego por hora (col B), ignorando la cabecera
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 5);
    dataRange.sort([{ column: 1, ascending: true }, { column: 2, ascending: true }]);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GET: responde al preflight del navegador (OPTIONS) — requerido para CORS
// ═══════════════════════════════════════════════════════════════════════════
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'API de tickets activa' }))
    .setMimeType(ContentService.MimeType.JSON);
}
