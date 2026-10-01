/* =========================================================================
 * CONFIGURACIÓN GENERAL DEL CURSO
 * ESE Municipal de Villavicencio  ×  Universidad de los Llanos
 * -------------------------------------------------------------------------
 * SOLO DEBES EDITAR ESTE ARCHIVO. El resto del sitio lee de aquí.
 * =========================================================================
 */

window.CONFIG = {

  /* --------------------------------------------------------------------
   * 1) AUTENTICACIÓN CON GOOGLE  (OBLIGATORIO)
   * --------------------------------------------------------------------
   * Consigue este ID en https://console.cloud.google.com
   *   1. Crea o selecciona un proyecto.
   *   2. Ve a "APIs y servicios" → "Credenciales".
   *   3. "Crear credenciales" → "ID de cliente OAuth".
   *   4. Tipo de aplicación: "Aplicación web".
   *   5. Orígenes de JavaScript autorizados: pega aquí el dominio donde
   *      se publica la página, por ejemplo:
   *          https://tu-usuario.github.io
   *          http://localhost:8000
   *      (localhost con puerto debe ir tal cual, sin barra final)
   *   6. Copia el "ID de cliente" (empieza por ...apps.googleusercontent.com)
   *      y pégalo abajo.
   *
   * Si lo dejas vacío, el sitio arranca en MODO DEMO para que puedas
   * revisar el contenido antes de configurarlo.
   */
  googleClientId: "TU_CLIENT_ID_AQUI.apps.googleusercontent.com",

  /* Dominios permitidos a entrar en MODO DEMO (solo para revisión previa). */
  demoDominios: ["localhost", "127.0.0.1"],

  /* --------------------------------------------------------------------
   * 2) IDENTIDAD DEL CURSO
   * --------------------------------------------------------------------
   */
  curso: {
    titulo: "Capacitación en Protocolos de Urgencias",
    subtitulo: "Código Azul · RCP · Carro de Paro · Ronda de Seguridad · Entrega de Turno",
    tipo: "Curso virtual de actualización",
    duracion: "4 horas",
    notaAprobacion: 70,           // % mínimo para aprobar
    notaPorTema: 60,             // % mínimo por cada tema
    intentosMaximos: 3,          // intentos permitidos por participante
    numeroCreditos: 20,
  },

  /* --------------------------------------------------------------------
   * 3) ENTIDADES  (logotipos y textos institucionales)
   * --------------------------------------------------------------------
   */
  entidadSalud: {
    nombre: "ESE Municipal de Villavicencio",
    sigla: "ESE MUNICIPAL",
    subtitulo: "Empresa Social del Estado del Municipio de Villavicencio",
    centro: "Centro de Salud Recreo",
    logo: "assets/logos/logo-ese.svg",
    color: "#0F6C4A",
  },

  entidadAcademica: {
    nombre: "Universidad de los Llanos",
    sigla: "UNILLANOS",
    subtitulo: "Ruralito Unillanos",
    logo: "assets/logos/logo-unillanos.svg",
    color: "#1B3A6B",
  },

  responsables: [
    { nombre: "Jesús Enrique Correa Guarín", cargo: "Ruralito Unillanos" },
    { nombre: "Erlis Tobón", cargo: "Líder Coordinadora Centro de Salud Recreo" },
  ],

  /* --------------------------------------------------------------------
   * 4) CERTIFICADO
   * --------------------------------------------------------------------
   */
  certificado: {
    prefijoCodigo: "ESE-VLL",
    horas: 4,
    firmante1: "Dirección General",
    cargoFirmante1: "ESE Municipal de Villavicencio",
    firmante2: "Coordinación Académica",
    cargoFirmante2: "Universidad de los Llanos",
  },

  /* --------------------------------------------------------------------
   * 5) ALMACENAMIENTO
   * --------------------------------------------------------------------
   * 'local'  → todo queda en el navegador (funciona sin backend)
   * 'sheet'  → además envía los registros a Google Sheets (ver LEEME.md)
   */
  almacenamiento: "local",

  /* URL del Web App de Google Apps Script (opcional). Se obtiene al
   * desplegar el archivo apps-script/Code.gs  →  Implementar → Nueva
   * implementación → Aplicación web. Pega aquí la URL /exec */
  appsScriptUrl: "PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT_EXEC",

  /* Clave secreta para que solo tu sitio pueda escribir en la hoja. */
  appsScriptSecret: "CLAVE_SECRETA_LARGA_Y_UNICA_AQUI",

  /* --------------------------------------------------------------------
   * 6) ALMACENAMIENTO LOCAL  (claves de registro)
   * --------------------------------------------------------------------
   */
  claves: {
    registro: "ese_registro_v1",     // datos de inscripción del participante
    resultados: "ese_resultados_v1", // intentos de evaluación
  },
};
