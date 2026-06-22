import { useState, useRef, useEffect } from 'react';

// ─── Endpoint del Apps Script de Google Sheets ─────────────────────────────
// Reemplaza esta URL con la URL de despliegue de tu Apps Script.
const API_URL = "https://script.google.com/macros/s/AKfycbzkgjuEj5qCTQGneKH7sSjKZk90UngaxTTRqNKWOovVAdlj5_s3cc8UyCgdG6e4-EnhSA/exec";

// ─── Iconos SVG inline ─────────────────────────────────────────────────────

/** Icono de cámara */
const IconCamera = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

/** Icono de galería / imagen */
const IconGallery = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

/** Icono de spinner de carga animado */
const IconSpinner = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5 text-amber-600 animate-spin" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/** Icono de doble check de verificación */
const IconDoubleCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-6 h-6 text-emerald-500 shrink-0" aria-hidden="true">
    <path d="M2 12l5 5L22 4" />
    <path d="M7 12l5 5 8-9" opacity="0.4" />
  </svg>
);

/** Icono de alerta / error */
const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-6 h-6 text-red-500 shrink-0" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** Icono de archivo / ticket */
const IconTicket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

/** Icono de calendario */
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/** Icono de reloj */
const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/** Icono de coche */
const IconCar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <rect x="1" y="10" width="22" height="8" rx="2" ry="2" />
    <path d="M5 10l1.5-5.5a2 2 0 0 1 1.9-1.5h7.2a2 2 0 0 1 1.9 1.5L19 10" />
    <circle cx="7.5" cy="18" r="1.5" />
    <circle cx="16.5" cy="18" r="1.5" />
  </svg>
);

/** Icono de moneda */
const IconMoney = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

/** Icono de X / cerrar */
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5 text-slate-400" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Componente auxiliar: fila del grid de resultados ──────────────────────
const DataRow = ({ icon, label, value, mono = false, bold = false }) => (
  <div className="bg-white rounded-xl p-3 border border-emerald-100 flex flex-col gap-1 shadow-sm">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
    </div>
    <span className={`text-sm text-slate-800 ${mono ? 'font-mono tracking-widest' : ''} ${bold ? 'font-bold text-slate-900' : ''}`}>
      {value}
    </span>
  </div>
);

// ─── Action Sheet: elige entre cámara o galería ────────────────────────────
const ActionSheet = ({ isOpen, onClose, onCamera, onGallery }) => {
  // Cierra con la tecla Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop semitransparente */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet deslizable desde abajo */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Seleccionar origen de imagen"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          flex flex-col
          bg-white rounded-t-3xl shadow-2xl
          px-4 pb-8 pt-3
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Handle visual */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        {/* Título + cerrar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm font-semibold text-slate-700">
            Añadir imagen del ticket
          </p>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Cerrar"
          >
            <IconClose />
          </button>
        </div>

        {/* Opciones */}
        <div className="flex flex-col gap-3">
          {/* Opción 1 → Cámara nativa trasera */}
          <button
            onClick={onCamera}
            className="
              flex items-center gap-4
              bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200
              border border-emerald-100
              rounded-2xl px-5 py-4
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
              text-left
            "
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500 shrink-0 shadow-sm">
              <IconCamera className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Usar la cámara</p>
              <p className="text-xs text-slate-500 mt-0.5">Toma una foto ahora mismo</p>
            </div>
          </button>

          {/* Opción 2 → Galería de fotos */}
          <button
            onClick={onGallery}
            className="
              flex items-center gap-4
              bg-slate-50 hover:bg-slate-100 active:bg-slate-200
              border border-slate-100
              rounded-2xl px-5 py-4
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
              text-left
            "
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-600 shrink-0 shadow-sm">
              <IconGallery className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Importar de la galería</p>
              <p className="text-xs text-slate-500 mt-0.5">Elige una imagen ya guardada</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Componente principal ──────────────────────────────────────────────────
export default function TicketScanner() {
  // Estados de la UI: 'idle' | 'preview' | 'loading' | 'success' | 'error'
  const [uiState, setUiState]       = useState('idle');
  const [imageFile, setImageFile]   = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [errorMsg, setErrorMsg]     = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOpen, setSheetOpen]   = useState(false);

  // Dos inputs ocultos: uno con capture (cámara) y otro sin él (galería)
  const cameraInputRef  = useRef(null);
  const galleryInputRef = useRef(null);

  // ── Manejo de selección de imagen ─────────────────────────────────────────
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUiState('preview');
    setErrorMsg('');
    setExtractedData(null);
    setSheetOpen(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Resetea el value para que onChange vuelva a dispararse con el mismo archivo
    e.target.value = '';
  };

  // ── Action sheet handlers ──────────────────────────────────────────────────
  const openCamera  = () => { setSheetOpen(false); setTimeout(() => cameraInputRef.current?.click(), 150); };
  const openGallery = () => { setSheetOpen(false); setTimeout(() => galleryInputRef.current?.click(), 150); };

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // ── Lógica de envío a la API ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!imageFile) return;
    setUiState('loading');

    try {
      // PASO 1: Leer el archivo y convertirlo a Base64 mediante FileReader.
      // readAsDataURL produce "data:<mime>;base64,<datos>". Con .split(',')[1]
      // extraemos únicamente el flujo binario puro para enviarlo limpio a la API.
      const base64Clean = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsDataURL(imageFile);
      });

      const fileType = imageFile.type; // ej: "image/jpeg"

      // PASO 2: POST a la API de Apps Script con el payload { imagenB64, tipoMime }.
      // La API lee el ticket con OCR, extrae fecha_pago y hora_pago e inserta la
      // fila ordenada cronológicamente en Google Sheets.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagenB64: base64Clean, tipoMime: fileType }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (json.status === 'success') {
        setExtractedData({
          fecha_pago: json.fecha_pago,
          hora_pago:  json.hora_pago,
          matricula:  json.matricula,
          gasto:      json.gasto,
        });
        setUiState('success');
      } else {
        throw new Error(json.message || 'La API no pudo procesar el ticket');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error desconocido. Inténtalo de nuevo.');
      setUiState('error');
    }
  };

  // ── Resetear al estado inicial ────────────────────────────────────────────
  const handleReset = () => {
    setUiState('idle');
    setImageFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setErrorMsg('');
    setSheetOpen(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inputs ocultos ─────────────────────────────────────────────────── */}
      {/* capture="environment" → fuerza la cámara trasera en móvil */}
      <input ref={cameraInputRef}  type="file" accept="image/*" capture="environment"
        onChange={handleInputChange} className="hidden" aria-hidden="true" />
      {/* Sin capture → el sistema operativo muestra el selector de galería */}
      <input ref={galleryInputRef} type="file" accept="image/*"
        onChange={handleInputChange} className="hidden" aria-hidden="true" />

      {/* Action Sheet ───────────────────────────────────────────────────── */}
      <ActionSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCamera={openCamera}
        onGallery={openGallery}
      />

      {/* Pantalla principal ─────────────────────────────────────────────── */}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 border border-slate-100">

          {/* Cabecera */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="w-6 h-6 text-emerald-600" aria-hidden="true">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Scanner de Tickets</h1>
            <p className="text-sm text-slate-400 mt-0.5">Parking · Gestión Automática</p>
          </div>

          {/* ── ESTADO 1: DROPZONE / INICIAL ───────────────────────────── */}
          {uiState === 'idle' && (
            <div
              onClick={() => setSheetOpen(true)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Seleccionar origen de imagen del ticket"
              onKeyDown={(e) => e.key === 'Enter' && setSheetOpen(true)}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200 select-none
                ${isDragging
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
              `}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Icono central */}
                <div className="relative">
                  <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100">
                    <IconCamera className="w-10 h-10 text-slate-400" />
                  </div>
                  {/* Badge con signo + */}
                  <span className="absolute -bottom-1 -right-1 flex items-center justify-center
                    w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow">
                    +
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600">Toca para añadir imagen</p>
                  <p className="text-xs text-slate-400 mt-1">Cámara · Galería · Arrastra aquí</p>
                </div>

                {/* Chips de opciones rápidas (decorativos) */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700
                    bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                    <IconCamera className="w-3.5 h-3.5" />
                    Cámara
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500
                    bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                    <IconGallery className="w-3.5 h-3.5" />
                    Galería
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400
                    bg-white border border-slate-200 rounded-full px-3 py-1">
                    <IconTicket />
                    JPG · PNG · WEBP
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── ESTADO 2: VISTA PREVIA ──────────────────────────────────── */}
          {uiState === 'preview' && previewUrl && (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                <img src={previewUrl} alt="Vista previa del ticket de parking"
                  className="max-h-60 w-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs
                  rounded-full px-2.5 py-1 backdrop-blur-sm font-medium">
                  Vista previa
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                <IconTicket />
                <span className="text-xs text-slate-500 truncate flex-1">{imageFile?.name}</span>
                <span className="text-xs text-slate-400 shrink-0">
                  {imageFile ? (imageFile.size / 1024).toFixed(0) + ' KB' : ''}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <button onClick={handleSubmit}
                  className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
                    text-white font-semibold w-full py-3.5 rounded-xl
                    transition-all duration-150 shadow-md hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">
                  Subir y Organizar
                </button>
                <button onClick={() => setSheetOpen(true)}
                  className="text-slate-500 hover:text-slate-700 text-sm w-full py-2.5 rounded-xl
                    hover:bg-slate-50 transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-slate-300">
                  Cambiar imagen
                </button>
              </div>
            </div>
          )}

          {/* ── ESTADO 3: PROCESANDO ────────────────────────────────────── */}
          {uiState === 'loading' && (
            <div className="flex flex-col gap-4">
              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-100">
                  <img src={previewUrl} alt="Procesando ticket"
                    className="max-h-60 w-full object-cover opacity-40 blur-[1px]" />
                </div>
              )}
              <div className="animate-pulse bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <IconSpinner />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Analizando con IA…</p>
                    <p className="text-xs text-amber-600 mt-0.5">Leyendo ticket y ordenando celdas en Sheets</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-amber-400 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
                </div>
              </div>
              <button disabled
                className="bg-slate-100 text-slate-400 font-semibold w-full py-3.5 rounded-xl cursor-not-allowed">
                Procesando…
              </button>
            </div>
          )}

          {/* ── ESTADO 4: ÉXITO ─────────────────────────────────────────── */}
          {uiState === 'success' && extractedData && (
            <div className="flex flex-col gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <IconDoubleCheck />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">¡Ticket procesado y guardado!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Fila insertada y ordenada cronológicamente</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <DataRow icon={<IconCalendar />} label="Fecha Pago" value={extractedData.fecha_pago ?? '—'} />
                  <DataRow icon={<IconClock />}    label="Hora Pago"  value={extractedData.hora_pago  ?? '—'} />
                  <DataRow icon={<IconCar />}      label="Matrícula"  value={extractedData.matricula  ?? '—'} mono />
                  <DataRow icon={<IconMoney />}    label="Gasto"      value={extractedData.gasto      ?? '—'} bold />
                </div>
              </div>
              <button onClick={handleReset}
                className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
                  text-white font-semibold w-full py-3.5 rounded-xl
                  transition-all duration-150 shadow-md hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">
                Escanear otro ticket
              </button>
            </div>
          )}

          {/* ── ESTADO DE ERROR ──────────────────────────────────────────── */}
          {uiState === 'error' && (
            <div className="flex flex-col gap-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <IconAlert />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Error al procesar</p>
                    <p className="text-xs text-red-600 mt-1 leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <button onClick={handleSubmit}
                  className="bg-red-500 hover:bg-red-600 active:bg-red-700
                    text-white font-semibold w-full py-3.5 rounded-xl
                    transition-all duration-150 shadow-md
                    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">
                  Reintentar
                </button>
                <button onClick={handleReset}
                  className="text-slate-500 hover:text-slate-700 text-sm w-full py-2.5 rounded-xl
                    hover:bg-slate-50 transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-slate-300">
                  Elegir otra imagen
                </button>
              </div>
            </div>
          )}

          {/* Pie de tarjeta */}
          <p className="text-center text-xs text-slate-300 mt-6 select-none">
            Procesado con Google Sheets · Apps Script
          </p>
        </div>
      </div>
    </>
  );
}
