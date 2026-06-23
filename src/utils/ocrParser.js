/**
 * Analiza el texto extraído por el OCR (Tesseract.js) y busca patrones
 * específicos para pre-rellenar fecha, hora, matrícula y gasto del ticket.
 *
 * @param {string} text Texto plano devuelto por el OCR.
 * @returns {object} Objeto con { fecha_pago, hora_pago, matricula, gasto }
 */
export function parseOcrText(text) {
  if (!text) {
    return { fecha_pago: '', hora_pago: '', matricula: '', gasto: '' };
  }

  // Normalizar el texto (pasar a mayúsculas y limpiar espacios excesivos)
  const cleanText = text.toUpperCase();
  const lines = cleanText.split('\n').map(line => line.trim()).filter(Boolean);

  // 1. EXTRAER FECHA (Formatos comunes: DD/MM/AAAA, DD-MM-AAAA, DD/MM/AA)
  let fecha_pago = '';
  const dateRegex = /\b(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})\b/;
  const dateMatch = cleanText.match(dateRegex);
  if (dateMatch) {
    let day = dateMatch[1].padStart(2, '0');
    let month = dateMatch[2].padStart(2, '0');
    let year = dateMatch[3];
    if (year.length === 2) {
      year = '20' + year; // Convertir YY a 20YY
    }
    fecha_pago = `${day}/${month}/${year}`;
  }

  // 2. EXTRAER HORA (Formato común: HH:MM o HH:MM:SS)
  let hora_pago = '';
  const timeRegex = /\b(\d{1,2}):(\d{2})(?::\d{2})?\b/;
  const timeMatch = cleanText.match(timeRegex);
  if (timeMatch) {
    let hour = timeMatch[1].padStart(2, '0');
    let minute = timeMatch[2];
    hora_pago = `${hour}:${minute}`;
  }

  // 3. EXTRAER MATRÍCULA (Matrículas de España)
  let matricula = '';
  
  // Regla A: Formato moderno español (4 números + 3 consonantes, ej: 1234BBB, 1234 BBB, 1234-BBB)
  // Las consonantes válidas en España excluyen vocales y Q (B-DF-HJ-NP-TV-Z)
  const modernSpainRegex = /\b(\d{4})\s*[-_./]?\s*([B-DF-HJ-NP-TV-Z]{3})\b/i;
  const modernMatch = cleanText.match(modernSpainRegex);
  
  if (modernMatch) {
    matricula = `${modernMatch[1]}${modernMatch[2]}`;
  } else {
    // Regla B: Formato clásico español (ej: M 1234 XX, M-1234-XX)
    const classicSpainRegex = /\b([A-Z]{1,2})\s*[-_./]?\s*(\d{4})\s*[-_./]?\s*([A-Z]{1,2})\b/i;
    const classicMatch = cleanText.match(classicSpainRegex);
    if (classicMatch) {
      matricula = `${classicMatch[1]}${classicMatch[2]}${classicMatch[3]}`;
    } else {
      // Regla C: Si no se detectó ninguna de las anteriores, buscar patrones generales de matrículas
      // (ej: cualquier combinación de 4 números y 3 letras de la A a la Z)
      const genericPlateRegex = /\b(\d{4})\s*([A-Z]{3})\b/i;
      const genericMatch = cleanText.match(genericPlateRegex);
      if (genericMatch) {
        matricula = `${genericMatch[1]}${genericMatch[2]}`;
      }
    }
  }

  // 4. EXTRAER GASTO / IMPORTE (Búsqueda de números decimales de tipo X,XX o X.XX)
  let gasto = '';
  
  // Lista de palabras clave asociadas al total en un ticket de parking
  const moneyKeywords = ['TOTAL', 'IMPORTE', 'PAGADO', 'COBRO', 'PAGO', 'NETO', 'EUR', '€'];
  let candidateAmounts = [];

  // Buscar todas las líneas que tengan palabras clave de dinero y extraer decimales
  for (const line of lines) {
    const hasKeyword = moneyKeywords.some(keyword => line.includes(keyword));
    const decimalMatch = line.match(/\b\d+[\.,]\d{2}\b/);
    
    if (decimalMatch) {
      const amountStr = decimalMatch[0].replace('.', ','); // Estandarizar a coma decimal
      const numValue = parseFloat(decimalMatch[0].replace(',', '.'));
      
      if (hasKeyword) {
        // Asignar mayor prioridad/puntuación a las que están en líneas con palabras clave
        candidateAmounts.push({ text: amountStr, val: numValue, priority: 2 });
      } else {
        candidateAmounts.push({ text: amountStr, val: numValue, priority: 1 });
      }
    }
  }

  if (candidateAmounts.length > 0) {
    // Ordenar los candidatos primero por prioridad (mayor a menor) y luego por valor (mayor a menor)
    // El total del ticket suele ser el valor de prioridad alta o el valor más alto del ticket
    candidateAmounts.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.val - a.val;
    });
    gasto = candidateAmounts[0].text;
  } else {
    // Si no se encuentra en línea, buscar cualquier número decimal general en todo el texto
    const generalDecimalRegex = /\b\d+[\.,]\d{2}\b/g;
    const allDecimals = cleanText.match(generalDecimalRegex);
    if (allDecimals && allDecimals.length > 0) {
      // Elegir el último decimal del texto (suele ser el total al final de los tickets)
      gasto = allDecimals[allDecimals.length - 1].replace('.', ',');
    }
  }

  return {
    fecha_pago,
    hora_pago,
    matricula: matricula.toUpperCase(),
    gasto
  };
}
