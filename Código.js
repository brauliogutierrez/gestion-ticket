// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const SHEET_ID = '1YETTxKoi19Eueecq0ZB3vwY8qj_Ec4ndRwlFRzGPNdA';   // ID de la hoja de cálculo
const SHEET_NAME = 'TicketsLaPalma';             // Nombre de la pestaña

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL — maneja los POST del frontend React
// ═══════════════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respuesta({ status: 'error', message: 'No se recibió cuerpo en la petición.' });
    }

    const body = JSON.parse(e.postData.contents);

    // Guardamos los datos enviados por el frontend
    if (body.guardarDatos === true || body.fecha_pago || body.matricula) {
      guardarEnSheet({
        fecha_pago: (body.fecha_pago || '').trim(),
        hora_pago: (body.hora_pago || '').trim(),
        matricula: (body.matricula || '').toUpperCase().trim(),
        gasto: (body.gasto || '').trim(),
      });
      return respuesta({ status: 'success', message: 'Datos guardados correctamente.' });
    }

    return respuesta({ status: 'error', message: 'Petición no reconocida o campos vacíos.' });

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
// SHEET: inserta la fila y reordena por fecha + hora (ignora cabecera fila 1)
// ═══════════════════════════════════════════════════════════════════════════
function guardarEnSheet(datos) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Robustez: si no encuentra la pestaña por el nombre configurado, 
  // busca por otras opciones o usa la primera pestaña activa del documento.
  if (!sheet) {
    sheet = ss.getSheetByName('Tickets') ||
      ss.getSheetByName('TicketsLaPalma') ||
      ss.getSheets()[0];
  }

  if (!sheet) {
    throw new Error(`No se encontró ninguna pestaña disponible en la hoja de cálculo.`);
  }

  // Fila nueva alineada exactamente con las columnas de la hoja:
  // Col A: Fecha
  // Col B: Hora
  // Col C: Concepto
  // Col D: Matrícula
  // Col E: Gasto
  // Col F: Total
  // Col G: Fecha Registro (Auditoría)
  sheet.appendRow([
    datos.fecha_pago,   // Col A: Fecha
    datos.hora_pago,    // Col B: Hora
    'PARKING',          // Col C: Concepto
    datos.matricula,    // Col D: Matrícula
    datos.gasto,        // Col E: Gasto
    datos.gasto,        // Col F: Total
  ]);

  // Ordena por col A (fecha) y col B (hora), ordenando toda la fila (lastCol) sin tocar la cabecera
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow > 2) {
    sheet.getRange(2, 1, lastRow - 1, lastCol)
      .sort([
        { column: 1, ascending: true },
        { column: 2, ascending: true },
      ]);
  }
}

function doGet() {
  return respuesta({ status: 'ok', message: 'API de tickets activa ✓' });
}
