/**
 * =========================================================================
 *  ESE MUNICIPAL DE VILLAVICENCIO × UNIVERSIDAD DE LOS LLANOS
 *  Backend del curso de protocolos — Google Apps Script
 * -------------------------------------------------------------------------
 *  Almacena el registro de participantes y los resultados de las
 *  evaluaciones en Google Sheets, y permite verificar certificados por código.
 *
 *  INSTALACIÓN (5 minutos):
 *    1. Abre https://script.google.com  → "Nuevo proyecto"
 *    2. Borra el contenido de Code.gs y pega este archivo.
 *    3. En "Configuración del proyecto" marca "Mostrar el archivo
 *       appsscript.json" y sustituye su contenido por el del archivo
 *       appsscript.json (incluido en esta carpeta).
 *    4. Ejecuta la función  crearHojas  una vez y acepta los permisos.
 *    5. Implementar → Nueva implementación → tipo "Aplicación web"
 *         · Ejecutar como:  Yo
 *         · Quién tiene acceso:  Cualquier persona
 *    6. Copia la URL que termina en /exec y pégala en
 *       CONFIG.appsScriptUrl  (archivo assets/js/config.js)
 *    7. Opcional: en  CONFIG.appsScriptSecret  pon una contraseña larga
 *       y repítela en  CLAVE  más abajo, para que solo tu sitio escriba.
 * =========================================================================
 */

/* --------------------------------------------------------------------
 * CONFIGURACIÓN
 * ------------------------------------------------------------------ */

/** Contraseña compartida. Debe coincidir con CONFIG.appsScriptSecret. */
var CLAVE = "CLAVE_SECRETA_LARGA_Y_UNICA_AQUI";

/** Nombres de las pestañas de la hoja de cálculo. */
var HOJA_REGISTRO = "Participantes";
var HOJA_RESULTADOS = "Resultados";
var HOJA_CERTIFICADOS = "Certificados";

/** Nombre del archivo de hoja de cálculo. Se crea si no existe. */
var NOMBRE_SPREADSHEET = "Registro Curso Protocolos - ESE Villavicencio";

/** Método de entrega del frontend. "json" para fetch directo. */
var MODO_RESPUESTA = "json";

/* --------------------------------------------------------------------
 * PUNTO DE ENTRADA ÚNICO
 * ------------------------------------------------------------------ */

function doPost(e) {
  var salida;
  try {
    var payload = JSON.parse(e.postData.contents);
    salida = manejar(payload);
  } catch (err) {
    salida = { ok: false, error: String(err) };
  }
  return responder(salida);
}

function doGet(e) {
  // Permite consultar por URL: ?accion=consulta&codigo=ESE-VLL-2026-000123
  var p = (e && e.parameter) || {};
  var salida;
  try {
    salida = manejar({
      accion: p.accion || "consulta",
      clave: p.clave || "",
      datos: { codigo: (p.codigo || "").toUpperCase() }
    });
  } catch (err) {
    salida = { ok: false, error: String(err) };
  }
  return responder(salida);
}

function responder(objeto) {
  var json = JSON.stringify(objeto);
  if (MODO_RESPUESTA === "json") {
    return ContentService.createTextOutput(json).setMimeType(
      ContentService.MimeType.JSON
    );
  }
  return ContentService.createTextOutput(
    "<!doctype html><meta charset='utf-8'><pre style='font:14px monospace;padding:20px'>"
    + htmlEscape(json) + "</pre>"
  );
}

/* --------------------------------------------------------------------
 * ENRUTADOR
 * ------------------------------------------------------------------ */

function manejar(payload) {
  var accion = String(payload.accion || "").toLowerCase();

  // La consulta de verificación es pública (para que cualquiera valide).
  if (accion === "consulta") {
    return consultarCodigo(payload.datos || {});
  }

  // El resto exige la clave compartida.
  if (CLAVE && CLAVE !== "CAMBIA_ESTA_CLAVE" && payload.clave !== CLAVE) {
    return { ok: false, error: "Clave incorrecta" };
  }

  switch (accion) {
    case "registro":
      return registrarParticipante(payload.datos || {});
    case "resultado":
      return registrarResultado(payload.datos || {});
    case "listado":
      return listarParticipantes();
    default:
      return { ok: false, error: "Acción desconocida: " + accion };
  }
}

/* --------------------------------------------------------------------
 * ACCIONES
 * ------------------------------------------------------------------ */

function registrarParticipante(d) {
  var correo = normalizar(d.correo);
  if (!correo) return { ok: false, error: "Falta el correo" };

  var ss = obtenerSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_REGISTRO);
  asegurarEncabezados(hoja, [
    "Fecha registro", "Correo", "Nombre", "Documento", "Cargo",
    "Servicio", "Centro de salud", "Teléfono", "Profesional", "Correo verificado"
  ]);

  // Actualiza si ya existe (evita duplicados por reintentos).
  var fila = buscarFilaPorCorreo(hoja, correo, 2);
  var registro = [
    new Date(),
    correo,
    d.nombre || "",
    d.documento || "",
    d.cargo || "",
    d.servicio || "",
    d.centro || "",
    d.telefono || "",
    d.profesional || "",
    d.googleNombre || "",
  ];

  if (fila > 0) {
    hoja.getRange(fila, 1, 1, registro.length).setValues([registro]);
  } else {
    hoja.appendRow(registro);
  }

  return { ok: true, correo: correo, actualizado: fila > 0 };
}

function registrarResultado(d) {
  var codigo = String(d.codigo || "").toUpperCase();
  var correo = normalizar(d.correo);
  if (!codigo || !correo) return { ok: false, error: "Faltan codigo o correo" };

  var ss = obtenerSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_RESULTADOS);
  asegurarEncabezados(hoja, [
    "Fecha", "Código", "Correo", "Nombre", "Documento", "Cargo", "Centro",
    "Intento", "Puntaje", "Total", "Porcentaje", "Aprobado", "Temas"
  ]);

  hoja.appendRow([
    new Date(),
    codigo,
    correo,
    d.nombre || "",
    d.documento || "",
    d.cargo || "",
    d.centro || "",
    d.intento || 1,
    d.aciertos || 0,
    d.total || 0,
    d.porcentaje || 0,
    d.aprobado ? "SÍ" : "NO",
    resumenTemas(d.temas)
  ]);

  // Solo los aprobados generan certificado.
  if (d.aprobado) {
    var hc = ss.getSheetByName(HOJA_CERTIFICADOS);
    asegurarEncabezados(hc, [
      "Código", "Fecha expedición", "Nombre", "Correo", "Documento",
      "Cargo", "Servicio", "Centro", "Puntaje", "Total", "Porcentaje", "Temas"
    ]);

    if (buscarFilaPorColumna(hc, codigo, 1) === 0) {
      hc.appendRow([
        codigo,
        new Date(),
        d.nombre || "",
        correo,
        d.documento || "",
        d.cargo || "",
        d.servicio || "",
        d.centro || "",
        d.aciertos || 0,
        d.total || 0,
        d.porcentaje || 0,
        resumenTemas(d.temas)
      ]);
    }
  }

  return { ok: true, codigo: codigo };
}

function consultarCodigo(d) {
  var codigo = String(d.codigo || "").toUpperCase().trim();
  if (!codigo) return { ok: false, error: "Falta el código" };

  var ss = obtenerSpreadsheet();
  var hc = ss.getSheetByName(HOJA_CERTIFICADOS);
  if (!hc) return { ok: true, encontrado: false, codigo: codigo };

  var fila = buscarFilaPorColumna(hc, codigo, 1);
  if (fila === 0) return { ok: true, encontrado: false, codigo: codigo };

  var v = hc.getRange(fila, 1, 1, 12).getValues()[0];
  return {
    ok: true,
    encontrado: true,
    codigo: codigo,
    datos: {
      codigo: v[0],
      fecha: formatearFecha(v[1]),
      nombre: v[2],
      correo: v[3],
      documento: v[4],
      cargo: v[5],
      servicio: v[6],
      centro: v[7],
      aciertos: v[8],
      total: v[9],
      porcentaje: v[10],
      temas: v[11]
    }
  };
}

function listarParticipantes() {
  var ss = obtenerSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_REGISTRO);
  if (!hoja) return { ok: true, total: 0, participantes: [] };

  var datos = hoja.getDataRange().getValues();
  var filas = datos.slice(1);
  var participants = filas.map(function (f) {
    return {
      correo: f[1],
      nombre: f[2],
      documento: f[3],
      cargo: f[4],
      servicio: f[5],
      centro: f[6],
      fecha: formatearFecha(f[0])
    };
  });
  return { ok: true, total: participants.length, participantes: participants };
}

/* --------------------------------------------------------------------
 * UTILIDADES
 * ------------------------------------------------------------------ */

function obtenerSpreadsheet() {
  var ss = buscarPorNombre(NOMBRE_SPREADSHEET);
  if (!ss) {
    ss = SpreadsheetApp.create(NOMBRE_SPREADSHEET);
  }
  crearHojas(ss);
  return ss;
}

function buscarPorNombre(nombre) {
  var archivos = DriveApp.getFilesByName(nombre);
  return archivos.hasNext() ? archivos.next().getSpreadsheet() : null;
}

/** Ejecuta esta función UNA VEZ desde el editor para crear las pestañas. */
function crearHojas() {
  crearHojas(obtenerSpreadsheet());
  Logger.log("Pestañas listas en: " + NOMBRE_SPREADSHEET);
}

function crearHojas(ss) {
  [HOJA_REGISTRO, HOJA_RESULTADOS, HOJA_CERTIFICADOS].forEach(function (nombre) {
    if (!ss.getSheetByName(nombre)) ss.insertSheet(nombre);
  });
  return ss;
}

function asegurarEncabezados(hoja, columnas) {
  if (!hoja) return;
  if (hoja.getLastRow() === 0) {
    hoja
      .getRange(1, 1, 1, columnas.length)
      .setValues([columnas])
      .setFontWeight("bold")
      .setBackground("#0F6C4A")
      .setFontColor("#FFFFFF");
    hoja.setFrozenRows(1);
  }
}

function buscarFilaPorColumna(hoja, valor, columna) {
  var rango = hoja.getRange(hoja.getLastRow(), columna, hoja.getLastRow(), 1);
  var valores = rango.getValues();
  for (var i = 0; i < valores.length; i++) {
    if (String(valores[i][0]).trim().toUpperCase() === String(valor).trim().toUpperCase()) {
      return hoja.getLastRow() - valores.length + i + 1;
    }
  }
  return 0;
}

function buscarFilaPorCorreo(hoja, correo, columna) {
  return buscarFilaPorColumna(hoja, correo, columna);
}

function normalizar(correo) {
  return String(correo || "").trim().toLowerCase();
}

function resumenTemas(temas) {
  if (!temas || !temas.length) return "";
  return temas
    .map(function (t) {
      return t.numero + ". " + t.titulo + " (" + t.porcentaje + "%)";
    })
    .join(" | ");
}

function formatearFecha(valor) {
  if (!valor) return "";
  var f = valor instanceof Date ? valor : new Date(valor);
  return Utilities.formatDate(f, Session.getScriptTimeZone(), "dd/MM/yyyy");
}

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* --------------------------------------------------------------------
 * PRUEBA RÁPIDA — ejecutar desde el editor
 * ------------------------------------------------------------------ */

function testRegistro() {
  var r1 = registrarResultado({
    codigo: "ESE-VLL-2026-000001",
    correo: "prueba@esevillavicencio.gov.co",
    nombre: "Participante de Prueba",
    documento: "12345678",
    cargo: "Enfermera profesional",
    servicio: "Urgencias",
    centro: "Centro de Salud Recreo",
    intento: 1,
    aciertos: 90,
    total: 92,
    porcentaje: 98,
    aprobado: true,
    temas: [{ numero: 1, titulo: "Código Azul", porcentaje: 100 }]
  });
  Logger.log("registroResultado: " + JSON.stringify(r1));

  var r2 = consultarCodigo({ codigo: "ESE-VLL-2026-000001" });
  Logger.log("consulta: " + JSON.stringify(r2));

  Logger.log("Abandoné una fila de prueba en " + NOMBRE_SPREADSHEET + ".");
}
