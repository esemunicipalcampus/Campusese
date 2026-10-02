/**
 * =========================================================================
 *  ESE MUNICIPAL DE VILLAVICENCIO × UNIVERSIDAD DE LOS LLANOS
 *  Backend de los protocolos de seguridad del paciente — Google Apps Script
 * -------------------------------------------------------------------------
 *  Guarda el registro de participantes, los resultados por PROTOCOLO y los
 *  certificados emitidos, y alimenta el registro institucional interno.
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
 *    7. En  CLAVE  (abajo) pon una contraseña larga para el registro
 *       institucional: es la que se escribe en registro.html.
 *    8. Opcional: pon la MISMA contraseña en CONFIG.appsScriptSecret para
 *       que solo tu sitio pueda escribir en la hoja.
 * =========================================================================
 */

/* --------------------------------------------------------------------
 * CONFIGURACIÓN
 * ------------------------------------------------------------------ */

/** Código de acceso del registro institucional (registro.html). */
var CLAVE = "CLAVE_SECRETA_LARGA_Y_UNICA_AQUI";

/** Nombres de las pestañas de la hoja de cálculo. */
var HOJA_REGISTRO = "Participantes";
var HOJA_RESULTADOS = "Resultados";
var HOJA_CERTIFICADOS = "Certificados";

/** Nombre del archivo de hoja de cálculo. Se crea si no existe. */
var NOMBRE_SPREADSHEET = "Registro Protocolos ESE - ESE Villavicencio";

/** Método de entrega del frontend. "json" para fetch directo. */
var MODO_RESPUESTA = "json";

/** Encabezados de cada hoja (el orden define los índices). */
var COLUMNAS_REGISTRO = [
  "Fecha registro", "Correo", "Nombre", "Sede", "Cargo", "Correo verificado"
];

var COLUMNAS_RESULTADOS = [
  "Fecha", "Código", "Correo", "Nombre", "Sede", "Cargo",
  "Protocolo", "Protocolo (nombre)", "Intento", "Aciertos", "Total", "Porcentaje",
  "Aprobado", "Temas"
];

var COLUMNAS_CERTIFICADOS = [
  "Código", "Fecha expedición", "Nombre", "Correo", "Sede", "Cargo",
  "Protocolo", "Protocolo (nombre)",
  "Intento", "Aciertos", "Total", "Porcentaje", "Temas"
];

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
  // Consulta pública por URL:
  //   ?accion=consulta&codigo=ESE-VLL-2026-CAUZ-000123
  var p = (e && e.parameter) || {};
  var salida;
  try {
    salida = manejar({
      accion: p.accion || "consulta",
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
  var datos = payload.datos || {};

  // Verificación de certificados: pública, para que cualquiera valide.
  if (accion === "consulta") return consultarCodigo(datos);

  // Registro institucional: pide el código de acceso, no la clave del sitio.
  if (accion === "registrointerno") return listarAprobados(datos);

  // El resto exige la clave compartida del sitio.
  if (CLAVE && CLAVE !== "CAMBIA_ESTA_CLAVE" && payload.clave !== CLAVE) {
    return { ok: false, error: "Clave incorrecta" };
  }

  switch (accion) {
    case "registro":
      return registrarParticipante(datos);
    case "resultado":
      return registrarResultado(datos);
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
  asegurarEncabezados(hoja, COLUMNAS_REGISTRO);

  // Actualiza si ya existe (evita duplicados por reintentos).
  var fila = buscarFilaPorColumna(hoja, correo, 2);
  var registro = [
    new Date(d.registro || d.fecha || ahora),
    d.correo || "",
    d.nombre || d.googleNombre || "",
    d.sede || "",
    d.cargo || "",
    d.emailVerified ? "Sí" : (d.correoVerificado ? "Sí" : "No")
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
  asegurarEncabezados(hoja, COLUMNAS_RESULTADOS);

  hoja.appendRow([
    new Date(),
    codigo,
    correo,
d.nombre || "",
    d.sede || "",
    d.cargo || "",
    d.protocolo || "",
    d.protocoloNombre || "",
    d.intento || 1,
    d.aciertos || 0,
    d.total || 0,
    d.porcentaje || 0,
    d.aprobado ? "Sí" : "NO",
    resumenTemas(d.temas)
  ]);

  // Solo los aprobados generan certificado, y solo una vez por código.
  if (d.aprobado) {
    var hc = ss.getSheetByName(HOJA_CERTIFICADOS);
    asegurarEncabezados(hc, COLUMNAS_CERTIFICADOS);

    if (buscarFilaPorColumna(hc, codigo, 1) === 0) {
      hc.appendRow([
        codigo,
        new Date(),
        d.nombre || "",
        correo,
        d.sede || "",
        d.cargo || "",
        d.protocolo || "",
        d.protocoloNombre || "",
        d.intento || 1,
        d.aciertos || 0,
        d.total || 0,
        d.porcentaje || 0,
        resumenTemas(d.temas)
      ]);
    }
  }

  return { ok: true, codigo: codigo };
}

/**
 * Registro institucional: quién aprobó cada protocolo, con fecha y nota.
 * Solo se ejecuta con el código de acceso correcto.
 */
function listarAprobados(d) {
  var clave = String(d.codigoAcceso || "");
  if (!CLAVE || CLAVE === "CLAVE_SECRETA_LARGA_Y_UNICA_AQUI") {
    return { ok: false, error: "El backend no tiene código de acceso configurado" };
  }
  if (clave !== CLAVE) return { ok: false, error: "Código de acceso incorrecto" };

  var ss = obtenerSpreadsheet();
  var hc = ss.getSheetByName(HOJA_CERTIFICADOS);
  if (!hc || hc.getLastRow() < 2) {
    return { ok: true, total: 0, generados: hoyIso(), registros: [] };
  }

  var filas = hc.getDataRange().getValues().slice(1);
  var fProtocolo = normalizar(d.protocolo);
  var desde = normalizar(d.desde);
  var hasta = normalizar(d.hasta);
  var q = String(d.q || "").trim().toLowerCase();

  var registros = filas
    .map(function (f) {
      return {
        codigo: f[0],
        fecha: formatearFechaIso(f[1]),
        nombre: f[2],
        correo: f[3],
        sede: f[4],
        cargo: f[5],
        protocolo: f[6],
        protocoloNombre: f[7],
        intento: f[8],
        aciertos: f[9],
        total: f[10],
        porcentaje: f[11],
        temas: f[12]
      };
    })
    .filter(function (r) {
      if (fProtocolo && normalizar(r.protocolo) !== fProtocolo) return false;
      if (desde && r.fecha < desde) return false;
      if (hasta && r.fecha > hasta) return false;
      if (q) {
        var texto = [r.nombre, r.correo, r.codigo, r.sede, r.cargo]
          .join(" ").toLowerCase();
        if (texto.indexOf(q) === -1) return false;
      }
      return true;
    })
    .sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });

  // Resumen por protocolo.
  var resumen = {};
  registros.forEach(function (r) {
    var k = r.protocoloNombre || r.protocolo || "Sin protocolo";
    if (!resumen[k]) resumen[k] = 0;
    resumen[k]++;
  });

  return {
    ok: true,
    total: registros.length,
    resumen: resumen,
    generados: hoyIso(),
    registros: registros
  };
}

function consultarCodigo(d) {
  var codigo = String(d.codigo || "").toUpperCase().trim();
  if (!codigo) return { ok: false, error: "Falta el código" };

  var ss = obtenerSpreadsheet();
  var hc = ss.getSheetByName(HOJA_CERTIFICADOS);
  if (!hc) return { ok: true, encontrado: false, codigo: codigo };

  var fila = buscarFilaPorColumna(hc, codigo, 1);
  if (fila === 0) return { ok: true, encontrado: false, codigo: codigo };

  var v = hc.getRange(fila, 1, 1, COLUMNAS_CERTIFICADOS.length).getValues()[0];
  return {
    ok: true,
    encontrado: true,
    codigo: codigo,
    datos: {
      codigo: v[0],
      fecha: formatearFecha(v[1]),
      nombre: v[2],
      correo: v[3],
      sede: v[4],
      cargo: v[5],
      protocolo: v[6],
      protocoloNombre: v[7],
      intento: v[8],
      aciertos: v[9],
      total: v[10],
      porcentaje: v[11],
      temas: v[12]
    }
  };
}

function listarParticipantes() {
  var ss = obtenerSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_REGISTRO);
  if (!hoja) return { ok: true, total: 0, participantes: [] };

  var datos = hoja.getDataRange().getValues();
  var filas = datos.slice(1);
  var participantes = filas.map(function (f) {
    return {
      fecha: formatearFecha(f[0]),
      correo: f[1],
      nombre: f[2],
      sede: f[3],
      cargo: f[4],
      verificado: f[5]
    };
  });
  return { ok: true, total: participantes.length, participantes: participantes };
}

/* --------------------------------------------------------------------
 * UTILIDADES
 * ------------------------------------------------------------------ */

function obtenerSpreadsheet() {
  var ss = buscarPorNombre(NOMBRE_SPREADSHEET);
  if (!ss) ss = SpreadsheetApp.create(NOMBRE_SPREADSHEET);
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
      .setBackground("#306090")
      .setFontColor("#FFFFFF");
    hoja.setFrozenRows(1);
  }
}

function buscarFilaPorColumna(hoja, valor, columna) {
  var ultima = hoja.getLastRow();
  if (ultima < 1) return 0;
  var rango = hoja.getRange(ultima, columna, ultima, 1);
  var valores = rango.getValues();
  for (var i = 0; i < valores.length; i++) {
    if (String(valores[i][0]).trim().toUpperCase() === String(valor).trim().toUpperCase()) {
      return ultima - valores.length + i + 1;
    }
  }
  return 0;
}

function normalizar(correo) {
  return String(correo || "").trim().toLowerCase();
}

function resumenTemas(temas) {
  if (!temas || !temas.length) return "";
  return temas
    .map(function (t) {
      return t.titulo + " (" + t.porcentaje + "%)";
    })
    .join(" | ");
}

function formatearFecha(valor) {
  if (!valor) return "";
  var f = valor instanceof Date ? valor : new Date(valor);
  return Utilities.formatDate(f, Session.getScriptTimeZone(), "dd/MM/yyyy");
}

function formatearFechaIso(valor) {
  if (!valor) return "";
  var f = valor instanceof Date ? valor : new Date(valor);
  return Utilities.formatDate(f, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function hoyIso() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
}

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* --------------------------------------------------------------------
 * PRUEBA MANUAL (opcional).
 * Ejecuta esta funcion una vez desde el editor para comprobar que la hoja
 * recibe datos. Luego borra la fila de prueba que queda.
 * ------------------------------------------------------------------ */
function testRegistro() {
  var r1 = registrarResultado({
    codigo: "ESE-VLL-2026-CAUZ-000001",
    correo: "prueba@esevillavicencio.gov.co",
    nombre: "Participante de Prueba",
    sede: "CAMPUS ESE MUNICIPAL",
    cargo: "Enfermeria",
    protocolo: "codigo-azul",
    protocoloNombre: "Codigo Azul",
    intento: 1,
    aciertos: 9,
    total: 10,
    porcentaje: 90,
    aprobado: true,
    temas: [{ titulo: "Codigo Azul", porcentaje: 90 }]
  });
  Logger.log("registrarResultado: " + JSON.stringify(r1));

  var r2 = consultarCodigo({ codigo: "ESE-VLL-2026-CAUZ-000001" });
  Logger.log("consulta: " + JSON.stringify(r2));

  Logger.log("Queda una fila de prueba en " + NOMBRE_SPREADSHEET + ".");
}
