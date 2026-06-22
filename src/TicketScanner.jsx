import { useState, useRef, useEffect } from 'react';

// ─── Endpoint del Apps Script de Google Sheets ─────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbzHMAHASEwwhX-Ka23BnX--Lasq7X4Nm6Lf3SV8B9BmAc7-h5Jc_y1RAVozytgijvXWXQ/exec";

// ═══════════════════════════════════════════════════════════════════════════
// ICONOS SVG INLINE
// ═══════════════════════════════════════════════════════════════════════════

const IconCamera = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const IconGallery = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconSpinner = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5 text-amber-600 animate-spin" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const IconDoubleCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-6 h-6 text-emerald-500 shrink-0" aria-hidden="true">
    <path d="M2 12l5 5L22 4" />
    <path d="M7 12l5 5 8-9" opacity="0.4" />
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-6 h-6 text-red-500 shrink-0" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

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

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

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

const IconMoney = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 text-slate-400" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Icono del disparador de cámara (círculo blanco grande) ─────────────────
const IconShutter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-8 h-8 text-white" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" fill="white" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE: Captura de cámara con getUserMedia (funciona en desktop + móvil)
// ═══════════════════════════════════════════════════════════════════════════
const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady]   = useState(false);
  const [camErr, setCamErr] = useState('');

  // Inicia el stream de la cámara al montar el componente
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        // Intenta primero la cámara trasera; si falla, acepta cualquiera
        const constraints = { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) setCamErr(err.message || 'Permiso de cámara denegado');
      }
    };

    start();

    return () => {
      cancelled = true;
      // Libera la cámara al desmontar el componente
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Captura el fotograma actual del video y lo convierte a File
  const handleShutter = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      // Detiene el stream antes de pasar la imagen al padre
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const file = new File([blob], `ticket_${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60">
        <span className="text-white font-semibold text-sm tracking-wide">Capturar ticket</span>
        <button onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          aria-label="Cerrar cámara">
          <IconClose />
        </button>
      </div>

      {/* Área de video */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {camErr ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-900/40 flex items-center justify-center">
              <IconAlert />
            </div>
            <p className="text-white font-medium text-sm">No se pudo acceder a la cámara</p>
            <p className="text-slate-400 text-xs leading-relaxed">{camErr}</p>
            <button onClick={onClose}
              className="mt-2 px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* Video en vivo */}
            <video ref={videoRef} playsInline muted
              className="absolute inset-0 w-full h-full object-cover" />

            {/* Guía de encuadre */}
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/40 rounded-full animate-ping" />
              </div>
            )}
            {ready && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-40 border-2 border-white/50 rounded-xl" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Botón disparador */}
      {!camErr && (
        <div className="px-6 py-6 bg-black/60 flex items-center justify-center">
          <button
            onClick={handleShutter}
            disabled={!ready}
            aria-label="Tomar foto"
            className={`
              w-18 h-18 rounded-full border-4 border-white
              flex items-center justify-center
              transition-all duration-150 active:scale-90
              ${ready ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}
            `}
            style={{ width: 72, height: 72 }}
          >
            <IconShutter />
          </button>
        </div>
      )}

      {/* Canvas oculto para capturar el fotograma */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE: Action Sheet (bottom sheet)
// ═══════════════════════════════════════════════════════════════════════════
const ActionSheet = ({ isOpen, onClose, onCamera, onGallery }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Seleccionar origen de imagen"
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl px-4 pb-8 pt-3
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm font-semibold text-slate-700">Añadir imagen del ticket</p>
          <button onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
            aria-label="Cerrar">
            <IconClose />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Opción cámara → usa getUserMedia (funciona desktop + móvil) */}
          <button onClick={onCamera}
            className="flex items-center gap-4 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200
              border border-emerald-100 rounded-2xl px-5 py-4 transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 text-left">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500 shrink-0 shadow-sm">
              <IconCamera className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Usar la cámara</p>
              <p className="text-xs text-slate-500 mt-0.5">Toma una foto ahora mismo</p>
            </div>
          </button>

          {/* Opción galería → input file sin capture */}
          <button onClick={onGallery}
            className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 active:bg-slate-200
              border border-slate-100 rounded-2xl px-5 py-4 transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 text-left">
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE: Fila de datos en el grid de éxito
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function TicketScanner() {
  const [uiState, setUiState]           = useState('idle');
  const [imageFile, setImageFile]       = useState(null);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [errorMsg, setErrorMsg]         = useState('');
  const [isDragging, setIsDragging]     = useState(false);
  const [sheetOpen, setSheetOpen]       = useState(false);
  const [showCamera, setShowCamera]     = useState(false);  // ← controla la cámara getUserMedia

  const galleryInputRef = useRef(null);  // solo galería (sin capture)

  // ── Manejo de archivo seleccionado (galería o captura) ────────────────────
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUiState('preview');
    setErrorMsg('');
    setExtractedData(null);
    setSheetOpen(false);
    setShowCamera(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  };

  // ── Action sheet: abrir cámara getUserMedia o galería ─────────────────────
  const openCamera = () => {
    setSheetOpen(false);
    // Pequeño delay para que el sheet cierre visualmente antes de la cámara
    setTimeout(() => setShowCamera(true), 250);
  };

  const openGallery = () => {
    setSheetOpen(false);
    setTimeout(() => galleryInputRef.current?.click(), 150);
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // ── Envío a la API de Apps Script ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!imageFile) return;
    setUiState('loading');

    try {
      // PASO 1: Convertir la imagen a Base64.
      // readAsDataURL devuelve "data:<mime>;base64,<datos>".
      // Con .split(',')[1] extraemos solo el flujo binario puro.
      const base64Clean = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Error al leer el archivo de imagen'));
        reader.readAsDataURL(imageFile);
      });

      const fileType = imageFile.type; // ej: "image/jpeg"

      // PASO 2: POST a Apps Script con Content-Type: text/plain.
      // "text/plain" es una "simple request" → el navegador NO envía preflight OPTIONS,
      // evitando el bloqueo CORS. Apps Script recibe el body en e.postData.contents
      // y puede parsearlo con JSON.parse() aunque el tipo sea text/plain.
      // Al NO usar mode:"no-cors", la respuesta sigue siendo legible.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ imagenB64: base64Clean, tipoMime: fileType }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      // PASO 3: Leer y mostrar los datos extraídos por el OCR de la API.
      const text = await response.text();
      console.log('Respuesta cruda de la API:', text);

      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('La respuesta de Google Apps Script no es un JSON válido (posiblemente devolvió un error HTML 403 o de autenticación). Revisa la consola del navegador.');
      }

      if (json.status === 'success') {
        setExtractedData({
          fecha_pago: json.fecha_pago ?? '—',
          hora_pago:  json.hora_pago  ?? '—',
          matricula:  json.matricula  ?? '—',
          gasto:      json.gasto      ?? '—',
        });
        setUiState('success');
      } else {
        throw new Error(json.message || 'La API procesó la solicitud pero devolvió un error');
      }
    } catch (err) {
      // Captura errores de red, lectura de archivo o respuesta inesperada de la API
      setErrorMsg(err.message || 'Error de conexión. Comprueba la red e inténtalo de nuevo.');
      setUiState('error');
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setUiState('idle');
    setImageFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setErrorMsg('');
    setSheetOpen(false);
    setShowCamera(false);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Módulo de cámara getUserMedia (overlay pantalla completa) ──────── */}
      {showCamera && (
        <CameraCapture
          onCapture={(file) => handleFileSelect(file)}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* ── Input oculto solo para galería ────────────────────────────────── */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* ── Action Sheet ──────────────────────────────────────────────────── */}
      <ActionSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCamera={openCamera}
        onGallery={openGallery}
      />

      {/* ── Pantalla principal ────────────────────────────────────────────── */}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50
        flex items-center justify-center p-4">
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

          {/* ── ESTADO 1: DROPZONE ──────────────────────────────────────────── */}
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
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200 select-none
                ${isDragging
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100">
                    <IconCamera className="w-10 h-10 text-slate-400" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex items-center justify-center
                    w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow">+</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Toca para añadir imagen</p>
                  <p className="text-xs text-slate-400 mt-1">Cámara · Galería · Arrastra aquí</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700
                    bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                    <IconCamera className="w-3.5 h-3.5" />Cámara
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500
                    bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                    <IconGallery className="w-3.5 h-3.5" />Galería
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400
                    bg-white border border-slate-200 rounded-full px-3 py-1">
                    <IconTicket />JPG · PNG · WEBP
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── ESTADO 2: VISTA PREVIA ──────────────────────────────────────── */}
          {uiState === 'preview' && previewUrl && (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                <img src={previewUrl} alt="Vista previa del ticket"
                  className="max-h-60 w-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs
                  rounded-full px-2.5 py-1 backdrop-blur-sm font-medium">Vista previa</div>
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
                    hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300">
                  Cambiar imagen
                </button>
              </div>
            </div>
          )}

          {/* ── ESTADO 3: PROCESANDO ────────────────────────────────────────── */}
          {uiState === 'loading' && (
            <div className="flex flex-col gap-4">
              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-100">
                  <img src={previewUrl} alt="Procesando"
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
                  <div className="h-full w-1/3 bg-amber-400 rounded-full animate-bounce" />
                </div>
              </div>
              <button disabled
                className="bg-slate-100 text-slate-400 font-semibold w-full py-3.5 rounded-xl cursor-not-allowed">
                Procesando…
              </button>
            </div>
          )}

          {/* ── ESTADO 4: ÉXITO ─────────────────────────────────────────────── */}
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
                  <DataRow icon={<IconCalendar />} label="Fecha Pago" value={extractedData.fecha_pago} />
                  <DataRow icon={<IconClock />}    label="Hora Pago"  value={extractedData.hora_pago} />
                  <DataRow icon={<IconCar />}      label="Matrícula"  value={extractedData.matricula} mono />
                  <DataRow icon={<IconMoney />}    label="Gasto"      value={extractedData.gasto} bold />
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

          {/* ── ESTADO DE ERROR ──────────────────────────────────────────────── */}
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
                    hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300">
                  Elegir otra imagen
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-slate-300 mt-6 select-none">
            Procesado con Google Sheets · Apps Script
          </p>
        </div>
      </div>
    </>
  );
}
