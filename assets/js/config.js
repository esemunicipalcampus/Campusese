/* =========================================================================
 * CONFIGURACIÓN GENERAL
 * ESE Municipal de Villavicencio  ×  Universidad de los Llanos
 * -------------------------------------------------------------------------
 * SOLO DEBES EDITAR ESTE ARCHIVO. El resto del sitio lee de aquí.
 * =========================================================================
 */

window.CONFIG = {

  /* --------------------------------------------------------------------
   * 1) AUTENTICACIÓN CON GOOGLE
   * --------------------------------------------------------------------
   * Client ID de Google Cloud (tipo "Aplicación web").
   * NO es un secreto: lo que protege el acceso es la lista de
   * "Orígenes de JavaScript autorizados" en Google Cloud Console.
   * ------------------------------------------------------------------ */
  googleClientId: "418198580980-t0voulutr9fujbvo71nr3adprrcph5u6.apps.googleusercontent.com",

  /* Dominios permitidos a entrar en MODO DEMO (solo revisión previa). */
  demoDominios: ["localhost", "127.0.0.1"],

  /* --------------------------------------------------------------------
   * 2) IDENTIDAD DEL PROGRAMA
   * ------------------------------------------------------------------ */
  programa: {
    titulo: "Campus Virtual ESE Municipal",
    subtitulo: "Código Azul · Carro de Paro · Ronda de Seguridad · Entrega de Turno",
    descripcion:
      "Capacitación institucional en los cuatro protocolos de seguridad del paciente " +
      "de la ESE Municipal de Villavicencio. Cada protocolo se estudia y se evalúa " +
      "por separado, con lectura obligatoria antes de la evaluación.",
    notaAprobacion: 80,           // % mínimo para aprobar
    intentosMaximos: 3,           // intentos por protocolo
  },

  /* --------------------------------------------------------------------
   * 2-bis) SEDES Y CARGOS
   * ------------------------------------------------------------------
   * La persona elige su sede y su cargo UNA sola vez. Se guardan en su
   * registro y ya nunca se vuelven a pedir. Si tu institución tiene otras
   * sedes o cargos, agrégalalos aquí: aparecerán solos en el selector.
   * ------------------------------------------------------------------ */
  sedes: [
    "CAMPUS ESE MUNICIPAL",
  ],

  cargos: [
    "Enfermería",
    "Medicina",
    "Auxiliar de enfermería",
    "Administración",
    "Docencia",
    "Otro",
  ],

  /* --------------------------------------------------------------------
   * 3) LOS CUATRO PROTOCOLOS
   * --------------------------------------------------------------------
   * Cada protocolo agrupa varios módulos de contenido y varios temas de
   * evaluación, y genera su propio certificado.
   *   modulos → números de módulo en assets/js/contenido.js
   *   temas   → ids en window.TEMAS (assets/js/preguntas.js)
   * ------------------------------------------------------------------ */
  protocolos: [
    {
      id: "codigo-azul",
      numero: 1,
      sigla: "CAUZ",
      nombre: "Código Azul",
      subtitulo: "Respuesta ante el paro cardiorrespiratorio",
      descripcion:
        "Definición, activación y organización del equipo de respuesta; reanimación " +
        "cardiopulmonar en el adulto, la mujer gestante, el paciente pediátrico y el " +
        "neonato; cadena de supervivencia y cuidados posteriores al paro.",
      icono: "🚨",
      color: "#306090",
      modulos: [1, 2, 3, 4, 5],
      temas: ["codigo-azul"],
      evaluacion: 10,
      pdf: "assets/pdf/codigo-azul.pdf",
      pdfNombre: "Procedimiento de Código Azul",
      horas: 2,
    },
    {
      id: "carro-paro",
      numero: 2,
      sigla: "CARP",
      nombre: "Carro de Paro",
      subtitulo: "Conceptualización, manejo, responsables y registros",
      descripcion:
        "Composición, verificación y control de los elementos del carro de paro; " +
        "acta de apertura, responsables por cargo y revisión mensual.",
      icono: "🚑",
      color: "#C03060",
      modulos: [6, 7],
      temas: ["carro-paro"],
      evaluacion: 10,
      pdf: "assets/pdf/carro-paro.pdf",
      pdfNombre: "Procedimiento de manejo de carro de paro",
      horas: 1,
    },
    {
      id: "ronda-seguridad",
      numero: 3,
      sigla: "RONDA",
      nombre: "Ronda de Seguridad",
      subtitulo: "Procedimiento de verificación y recorrido institucional",
      descripcion:
        "Acta de apertura, recorrido por las áreas, verificación de CONDITIONS " +
        "SEGURAS y control de los hogares de paso y elementos de seguridad.",
      icono: "🔒",
      color: "#8A6A1E",
      modulos: [8],
      temas: ["ronda-seguridad"],
      evaluacion: 5,
      pdf: "assets/pdf/ronda-seguridad.pdf",
      pdfNombre: "Procedimiento para ronda de seguridad",
      horas: 0.5,
    },
    {
      id: "entrega-turno",
      numero: 4,
      sigla: "TURN",
      nombre: "Recibo y Entrega de Turno",
      subtitulo: "Continuidad del cuidado en urgencias",
      descripcion:
        "Procedimiento de recibo y entrega de turno de enfermería en urgencias: " +
        "aspectos a tener en cuenta, elementos que deben transferirse y situaciones " +
        "que interfieren con la entrega.",
      icono: "🤝",
      color: "#1F7A5C",
      modulos: [9],
      temas: ["entrega-turno"],
      evaluacion: 5,
      pdf: "assets/pdf/entrega-turno.pdf",
      pdfNombre: "Procedimiento para recibo y entrega de turno de enfermería",
      horas: 0.5,
    },
  ],

  /* --------------------------------------------------------------------
   * 4) ENTIDADES  (logotipos y colores institucionales)
   * ------------------------------------------------------------------
   * Colores extraídos de los logotipos oficiales:
   *   · ESE Municipal   → azul #306090, magenta #C03060, amarillo #E0C000
   *   · Unillanos       → azul institucional #1B3A6B
   * ------------------------------------------------------------------ */
  entidadSalud: {
    nombre: "ESE Municipal de Villavicencio",
    sigla: "ESE MUNICIPAL",
    subtitulo: "Empresa Social del Estado del Municipio de Villavicencio",
    logo: "assets/logos/eselogo.jpg",
    color: "#306090",
    colorSecundario: "#C03060",
    colorAcento: "#E0C000",
  },

  entidadAcademica: {
    nombre: "Universidad de los Llanos",
    sigla: "UNILLANOS",
    subtitulo: "Ruralito Unillanos",
    /* El archivo es un logotipo blanco: sobre fondos claros se invierte
       para que sea legible. Sobre fondo de color se usa sin filtro. */
    logo: "assets/logos/Logo_unillanos1.png",
    color: "#1B3A6B",
  },

  responsables: [
    { nombre: "Jesús Enrique Correa Guarín", cargo: "Ruralito Unillanos" },
    { nombre: "Erlis Tobón", cargo: "Líder Coordinadora — ESE Municipal" },
  ],

  /* --------------------------------------------------------------------
   * 5) CÓDIGOS DE SEGUIMIENTO
   * ------------------------------------------------------------------
   * Cada intento de evaluación queda con un código único. No es un
   * certificado: solo sirve para identificar el intento en el registro.
   * ------------------------------------------------------------------ */
  codigo: {
    prefijo: "ESE-VLL",
  },

  /* --------------------------------------------------------------------
   * 6) REGISTRO INTERNO DE PARTICIPANTES
   * --------------------------------------------------------------------
   * NO se guarda ninguna clave aquí: registro.html pide el código de
   * acceso y lo valida Google Apps Script. Si el código quedara en este
   * archivo, cualquiera que abra la página podría leerlo.
   * ------------------------------------------------------------------ */

  /* --------------------------------------------------------------------
   * 7) ALMACENAMIENTO
   * --------------------------------------------------------------------
   * 'local' → todo queda en el navegador (funciona sin backend)
   * 'sheet' → además envía los registros a Google Sheets
   *
   * Está en "sheet": el Web App de abajo está desplegado con la versión
   * corregida del backend y se verificó en vivo contra la hoja real
   * (registro, progreso, tiempo, resultado y panel del administrador).
   * Si algún día hay que volver a "local" para trabajar sin conexión,
   * cambia solo esta línea.
   * ------------------------------------------------------------------ */
  almacenamiento: "sheet",

  /* URL del Web App de Google Apps Script.
   * Se obtiene en: Implementar → Nueva implementación → Aplicación web,
   * con "Quién tiene acceso: Cualquier persona".
   * Debe empezar por https://script.google.com/macros/s/ y terminar en /exec.
   * Si aparece "a/macros/dominio" adelante, está restringida y no funciona. */
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbxWri9yYG5_pogE6biqs8MUCpt7hY1Ww4Zy6fDH-m7UzwcUFHdfoJHy2M11JipeVfqg/exec",

  /* Clave compartida para que solo este sitio escriba en la hoja.
   * OJO: este archivo es público, así que esta clave NO es un secreto real.
   * Sirve para evitar escrituras por accidente o de bots que no revisen el
   * código. Quien quiera bloquear de verdad el acceso debe poner la clave en
   * Apps Script (Propiedades de secuencia de comandos), no aquí. */
  appsScriptSecret: "2k5R*PtvJ#%gSW4UE4&$#AtfcaQM$BujAmjD!iXG",

  /* --------------------------------------------------------------------
   * 8) CLAVES DE ALMACENAMIENTO LOCAL
   * ------------------------------------------------------------------ */
  claves: {
    registro: "ese_registro_v2",     // datos de inscripción
    resultados: "ese_resultados_v2", // intentos de evaluación
  },
};