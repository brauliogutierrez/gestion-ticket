// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN  ← Rellena estos tres valores antes de publicar
// ═══════════════════════════════════════════════════════════════════════════

const SHEET_ID       = 'TU_SPREADSHEET_ID_AQUI';   // ID de la hoja de cálculo
const SHEET_NAME     = 'Tickets';                   // Nombre de la pestaña
const GEMINI_API_KEY = 'TU_GEMINI_API_KEY_AQUI';   // Clave de la API de Gemini

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL — maneja los POST del frontend React
// ═══════════════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respuesta({ status: 'error', message: 'No se recibió cuerpo en la petición.' });
    }

    const body = JSON.parse(e.postData.contents);

    // ── MODO 1: soloOCR ────────────────────────────────────────────────────
    // El frontend subió la imagen. Extraemos datos con Gemini y los devolvemos
    // para que el usuario los revise/edite ANTES de guardarlos.
    if (body.soloOCR === true) {
      validarBase64(body.imagenB64);
      const datos = extraerDatosConGemini(body.imagenB64, body.tipoMime);
      return respuesta({ status: 'success', ...datos });
    }

    // ── MODO 2: guardarDatos ───────────────────────────────────────────────
    // El usuario ya revisó los datos y pulsa "Enviar al Sheet".
    // Guardamos los campos que el frontend nos manda (ya editados).
    if (body.guardarDatos === true) {
      guardarEnSheet({
        fecha_pago : (body.fecha_pago || '').trim(),
        hora_pago  : (body.hora_pago  || '').trim(),
        matricula  : (body.matricula  || '').toUpperCase().trim(),
        gasto      : (body.gasto      || '').trim(),
      });
      return respuesta({ status: 'success', message: 'Datos guardados correctamente.' });
    }

    // ── MODO LEGACY ────────────────────────────────────────────────────────
    // Compatible con versiones anteriores del frontend (OCR + guardar en 1 paso).
    if (body.imagenB64) {
      validarBase64(body.imagenB64);
      const datos = extraerDatosConGemini(body.imagenB64, body.tipoMime);
      guardarEnSheet(datos);
      return respuesta({ status: 'success', ...datos });
    }

    return respuesta({ status: 'error', message: 'Petición no reconocida. Falta soloOCR, guardarDatos o imagenB64.' });

  } catch (err) {
    return respuesta({ status: 'error', message: String(err.message || err) });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: respuesta JSON estándar (evita repetir código)
// ═══════════════════════════════════════════════════════════════════════════
function respuesta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: valida que el base64 no esté vacío ni sea demasiado largo
// ═══════════════════════════════════════════════════════════════════════════
function validarBase64(b64) {
  if (!b64 || typeof b64 !== 'string') {
    throw new Error('La imagen recibida está vacía o no es válida.');
  }
  // Gemini acepta hasta ~20 MB en inline_data; 15 MB en base64 ≈ 20 MB binario
  const LIMITE_CHARS = 20_000_000;
  if (b64.length > LIMITE_CHARS) {
    throw new Error('La imagen es demasiado grande. Usa una de menor resolución.');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// OCR: envía la imagen a Gemini Flash y extrae los 4 campos del ticket
// NOTA: usamos inline_data (base64 directo) — NO se usa Utilities.newBlob()
//       porque eso causaba el error "Unexpected error while getting newBlob".
// ═══════════════════════════════════════════════════════════════════════════
function extraerDatosConGemini(imagenB64, tipoMime) {
  const MODELO = 'gemini-1.5-flash';
  const url    = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${GEMINI_API_KEY}`;

  const prompt =
    'Analiza esta imagen de un ticket de parking/aparcamiento y extrae EXACTAMENTE estos campos en JSON:\n' +
    '{\n' +
    '  "fecha_pago": "DD/MM/YYYY",\n' +
    '  "hora_pago": "HH:MM",\n' +
    '  "matricula": "MATRÍCULA EN MAYÚSCULAS",\n' +
    '  "gasto": "IMPORTE CON COMA DECIMAL (ej: 1,50)"\n' +
    '}\n' +
    'Responde ÚNICAMENTE con el JSON puro. Sin bloques de código, sin explicaciones. ' +
    'Si no encuentras un campo, usa cadena vacía "".';

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            // ← inline_data: enviamos el base64 directamente, sin newBlob
            inline_data: {
              mime_type : tipoMime || 'image/jpeg',
              data      : imagenB64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature    : 0,    // respuestas deterministas
      maxOutputTokens: 300,
    },
  };

  const options = {
    method          : 'post',
    contentType     : 'application/json',
    payload         : JSON.stringify(payload),
    muteHttpExceptions: true,  // capturamos errores HTTP manualmente
  };

  const res     = UrlFetchApp.fetch(url, options);
  const resCode = res.getResponseCode();
  const resText = res.getContentText();

  if (resCode !== 200) {
    throw new Error(`Gemini devolvió HTTP ${resCode}: ${resText.substring(0, 200)}`);
  }

  const resJson  = JSON.parse(resText);
  const rawText  = (resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

  // Elimina posibles bloques markdown ``` que Gemini a veces incluye
  const cleanText = rawText.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

  let datos;
  try {
    datos = JSON.parse(cleanText);
  } catch (_) {
    // Si Gemini no devolvió JSON válido, campos vacíos (mejor que un error)
    Logger.log('Gemini no devolvió JSON válido: ' + rawText);
    datos = { fecha_pago: '', hora_pago: '', matricula: '', gasto: '' };
  }

  return {
    fecha_pago : String(datos.fecha_pago || '').trim(),
    hora_pago  : String(datos.hora_pago  || '').trim(),
    matricula  : String(datos.matricula  || '').toUpperCase().trim(),
    gasto      : String(datos.gasto      || '').trim(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SHEET: inserta la fila y reordena por fecha + hora (ignora cabecera fila 1)
// ═══════════════════════════════════════════════════════════════════════════
function guardarEnSheet(datos) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(`No se encontró la pestaña "${SHEET_NAME}" en el spreadsheet.`);
  }

  // Fila nueva: fecha | hora | matrícula | gasto | timestamp registro
  sheet.appendRow([
    datos.fecha_pago,
    datos.hora_pago,
    datos.matricula,
    datos.gasto,
    new Date(),
  ]);

  // Ordena por col A (fecha) y col B (hora), sin tocar la fila de cabecera
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.getRange(2, 1, lastRow - 1, 5)
      .sort([
        { column: 1, ascending: true },
        { column: 2, ascending: true },
      ]);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GET: responde a peticiones de comprobación (health-check)
// ═══════════════════════════════════════════════════════════════════════════
function doGet() {
  return respuesta({ status: 'ok', message: 'API de tickets activa ✓' });
}
