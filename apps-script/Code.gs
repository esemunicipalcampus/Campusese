/**
 * =========================================================================
 *  ESE MUNICIPAL DE VILLAVICENCIO × UNIVERSIDAD DE LOS LLANOS
 *  Backend de los protocolos de seguridad del paciente — Google Apps Script
 * -------------------------------------------------------------------------
 *  Guarda participantes, resultados por PROTOCOLO, el avance de lectura
 *  sección por sección y el tiempo de estudio en cada módulo, y alimenta
 *  el registro institucional y el panel administrativo.
 *
 *  IMPORTANTE — SEGURIDAD DEL PANEL:
 *    La contraseña maestra del panel (CLAVE_ADMIN) vive SOLO aquí, en el
 *    servidor. Nunca se escribe en un archivo del sitio: si estuviera en
 *    el navegador, cualquier persona podría leerla con "ver código fuente".
 *    Cámbiala antes de poner la página en producción.
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
 *    7. Pon el mismo valor en  CLAVE  y en  CONFIG.appsScriptSecret.
 * =========================================================================
 */

/* --------------------------------------------------------------------
 * CONFIGURACIÓN
 * ------------------------------------------------------------------ */

/** Clave compartida que envía el sitio (config.js → appsScriptSecret).
 *  Evita escrituras accidentales o de bots que no revisen el código.
 *  No es un secreto fuerte: este repositorio es público. */
var CLAVE = "2k5R*PtvJ#%gSW4UE4&$#AtfcaQM$BujAmjD!iXG";

/** Contraseña MAESTRA del panel administrativo (admin.html).
 *  Se compara aquí, en el servidor, nunca en el navegador.
 *  Está escrita a mano como pidió la institución, pero al vivir en un
 *  repositorio NO es secreta: cámbiala por una larga y aleatoria antes de
 *  publicar, o léela de PropertiesService (ver leerClaveAdmin). */
var CLAVE_ADMIN = "130004708";

/** Sesiones de panel abiertas: token → hora de creación (en milisegundos). */
var SESIONES_ADMIN = {};
var DURACION_SESION_ADMIN_MS = 8 * 60 * 60 * 1000; // 8 horas

/** Nombres de las pestañas de la hoja de cálculo. */
var HOJA_REGISTRO = "Participantes";
var HOJA_RESULTADOS = "Resultados";
var HOJA_PROGRESO = "Progreso";

/** Cuántos protocolos tiene el programa (para el resumen del panel). */
var TOTAL_PROTOCOLOS = 4;

/** Nombre del archivo de hoja de cálculo. Se crea si no existe. */
var NOMBRE_SPREADSHEET = "Registro Protocolos ESE - ESE Villavicencio";

/** Método de entrega del frontend. "json" para fetch directo. */
var MODO_RESPUESTA = "json";

/** Encabezados de cada hoja (el orden define los índices). */
var COLUMNAS_REGISTRO = [
  "Fecha registro", "Correo", "Nombre", "Sede", "Cargo",
  "Dependencia", "Se dedica a", "Teléfono", "Horario", "Observaciones"
];

var COLUMNAS_RESULTADOS = [
  "Fecha", "Código", "Correo", "Nombre", "Sede", "Cargo",
  "Protocolo", "Protocolo (nombre)", "Intento", "Aciertos", "Total", "Porcentaje",
  "Aprobado", "Temas"
];

var COLUMNAS_PROGRESO = [
  "Fecha", "Correo", "Nombre", "Módulo", "Módulo (título)",
  "Secciones realizadas", "Secciones totales", "Tiempo (segundos)"
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
  // Solo se permite consultar por GET: el resto se hace por POST.
  return responder({
    ok: false,
    error: "Usa POST. El acceso al panel y al registro es por envío de datos."
  });
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

  /* ---------------- Panel administrativo ----------------
     Estas tres acciones NO exigen la clave del sitio: se validan con la
     contraseña maestra y, después, con el token de sesión. */
  if (accion === "adminentrar") return adminEntrar(datos);
  if (accion === "adminprogreso") return adminProgreso(datos);
  if (accion === "adminborrar") return adminBorrar(datos);

  // Registro institucional: pide el código de acceso, no la clave del sitio.
  if (accion === "registrointerno") return listarAprobados(datos);

  // El resto exige la clave compartida del sitio.
  if (CLAVE && CLAVE !== "CLAVE_SECRETA_LARGA_Y_UNICA_AQUI" && payload.clave !== CLAVE) {
    return { ok: false, error: "Clave incorrecta" };
  }

  switch (accion) {
    case "registro":
      return registrarParticipante(datos);
    case "resultado":
      return registrarResultado(datos);
    case "progreso":
      return registrarProgreso(datos);
    case "tiempo":
      return registrarTiempo(datos);
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
    d.nombre || d.nombreMostrado || d.googleNombre || "",
    d.sede || "",
    d.cargo || "",
    d.dependencia || "",
    d.profesion || "",
    d.telefono || "",
    d.horario || "",
    d.observaciones || ""
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

  return { ok: true, codigo: codigo };
}

/* --------------------------------------------------------------------
 * AVANCE DE LECTURA Y TIEMPO DE ESTUDIO
 * ------------------------------------------------------------------ */

/** Una fila por módulo y persona: secciones leídas y tiempo acumulado. */
function registrarProgreso(d) {
  var correo = normalizar(d.correo);
  if (!correo) return { ok: false, error: "Falta el correo" };

  var ss = obtenerSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_PROGRESO);
  asegurarEncabezados(hoja, COLUMNAS_PROGRESO);

  var modulo = String(d.modulo || "");
  var fila = buscarFilaProgreso(hoja, correo, modulo);

  var valores = [
    new Date(),
    correo,
    d.nombre || "",
    modulo,
    d.titulo || "",
    String(d.secciones || ""),
    d.totalSecciones || 0,
    Math.max(0, Math.round(Number(d.tiempo) || 0))
  ];

  if (fila > 0) {
    hoja.getRange(fila, 1, 1, valores.length).setValues([valores]);
  } else {
    hoja.appendRow(valores);
  }
  return { ok: true, correo: correo, modulo: modulo };
}

/** El tiempo llega desde el cronómetro del navegador. */
function registrarTiempo(d) {
  var correo = normalizar(d.correo);
  if (!correo) return { ok: false, error: "Falta el correo" };

  var segundos = Math.max(0, Math.round(Number(d.segundos) || 0));
  var total = Math.max(0, Math.round(Number(d.total) || 0));
  if (segundos === 0 && total === 0) return { ok: true, correo: correo, acumulado: 0 };

  var ss = obtenerSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_PROGRESO);
  asegurarEncabezados(hoja, COLUMNAS_PROGRESO);

  var modulo = String(d.modulo || "");
  var fila = buscarFilaProgreso(hoja, correo, modulo);

  if (fila === 0) {
    hoja.appendRow([
      new Date(), correo, d.nombre || "", modulo, d.titulo || "", "0", 0, total
    ]);
    return { ok: true, correo: correo, acumulado: total };
  }

  // El navegador manda el total ya acumulado (incluye este tramo). Se conserva
  // el mayor entre lo que había en la hoja y lo que llega, para que un reloj
  // que va atrás no borre lo recorrido. Si el total no viniera, se suma el tramo.
  var previo = Number(hoja.getRange(fila, 8).getValue()) || 0;
  var acumulado = total > 0 ? Math.max(previo, total) : previo + segundos;
  hoja.getRange(fila, 8).setValue(acumulado);
  hoja.getRange(fila, 1).setValue(new Date());

  return { ok: true, correo: correo, acumulado: acumulado };
}

/** Busca la fila de (correo, módulo) en la hoja de progreso. */
function buscarFilaProgreso(hoja, correo, modulo) {
  var ultima = hoja.getLastRow();
  if (ultima < 2) return 0;
  var valores = hoja.getRange(2, 1, ultima - 1, 4).getValues();
  for (var i = 0; i < valores.length; i++) {
    var c = normalizar(valores[i][1]);
    var m = String(valores[i][3]).trim();
    if (c === correo && m === String(modulo).trim()) return i + 2;
  }
  return 0;
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
  var hr = ss.getSheetByName(HOJA_RESULTADOS);
  if (!hr || hr.getLastRow() < 2) {
    return { ok: true, total: 0, generados: hoyIso(), registros: [] };
  }

  var filas = hr.getDataRange().getValues().slice(1);
  var fProtocolo = normalizar(d.protocolo);
  var desde = normalizar(d.desde);
  var hasta = normalizar(d.hasta);
  var q = String(d.q || "").trim().toLowerCase();

  var registros = filas
    .map(function (f) {
      return {
        codigo: f[1],
        fecha: formatearFechaIso(f[0]),
        nombre: f[3],
        correo: f[2],
        sede: f[4],
        cargo: f[5],
        protocolo: f[6],
        protocoloNombre: f[7],
        intento: f[8],
        aciertos: f[9],
        total: f[10],
        porcentaje: f[11],
        aprobado: f[12] === "Sí",
        temas: f[13]
      };
    })
    .filter(function (r) {
      if (!r.aprobado) return false;
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

/* --------------------------------------------------------------------
 * PANEL ADMINISTRATIVO
 * ------------------------------------------------------------------ */

/**
 * Entrada al panel. Se compara la contraseña maestra AQUÍ, en el servidor,
 * y se devuelve un token de sesión que el navegador guarda en sessionStorage.
 */
function adminEntrar(d) {
  if (!CLAVE_ADMIN || CLAVE_ADMIN === "CLAVE_SECRETA_LARGA_Y_UNICA_AQUI") {
    return { ok: false, mensaje: "El backend no tiene contraseña maestra configurada." };
  }
  if (String(d.clave || "") !== CLAVE_ADMIN) {
    return { ok: false, mensaje: "Contraseña incorrecta." };
  }

  var token = Utilities.getUuid() + Utilities.getUuid().slice(0, 8);
  cargarSesiones();
  limpiarSesiones();
  SESIONES_ADMIN[token] = new Date().getTime();
  guardarSesiones();

  return { ok: true, token: token, vence: DURACION_SESION_ADMIN_MS / 3600000 };
}

/** Valida el token de sesión o devuelve un mensaje de error. */
function revisarToken(token) {
  if (!token || !SESIONES_ADMIN[token]) return false;
  var edad = new Date().getTime() - SESIONES_ADMIN[token];
  if (edad > DURACION_SESION_ADMIN_MS) {
    delete SESIONES_ADMIN[token];
    return false;
  }
  return true;
}

/** La hoja de cálculo guarda las sesiones, para que sobrevivan a los reinicios. */
function cargarSesiones() {
  try {
    var cache = CacheService.getScriptCache();
    var crudo = cache.get("sesiones_admin");
    if (crudo) SESIONES_ADMIN = JSON.parse(crudo);
  } catch (e) { /* sin caché: se usa el mapa en memoria */ }
  return SESIONES_ADMIN;
}

function guardarSesiones() {
  try {
    CacheService.getScriptCache().put(
      "sesiones_admin", JSON.stringify(SESIONES_ADMIN), DURACION_SESION_ADMIN_MS / 1000
    );
  } catch (e) { /* sin caché: las sesiones viven solo en memoria */ }
}

function limpiarSesiones() {
  var ahora = new Date().getTime();
  Object.keys(SESIONES_ADMIN).forEach(function (k) {
    if (ahora - SESIONES_ADMIN[k] > DURACION_SESION_ADMIN_MS) delete SESIONES_ADMIN[k];
  });
}

/**
 * Todo el progreso de todas las personas: lectura, tiempo por módulo y
 * notas por protocolo. Es la única acción que requiere contraseña maestra.
 */
function adminProgreso(d) {
  cargarSesiones();
  if (!revisarToken(d.token)) {
    return { ok: false, mensaje: "La sesión expiró. Vuelve a entrar." };
  }

  var ss = obtenerSpreadsheet();
  var porCorreo = {};

  /* --- ficha --- */
  var hr = ss.getSheetByName(HOJA_REGISTRO);
  if (hr && hr.getLastRow() > 1) {
    hr.getDataRange().getValues().slice(1).forEach(function (f) {
      var correo = normalizar(f[1]);
      if (!correo) return;
      porCorreo[correo] = porCorreo[correo] || { correo: correo };
      var p = porCorreo[correo];
      p.nombre = f[2] || p.nombre || "";
      p.sede = f[3] || p.sede || "";
      p.cargo = f[4] || p.cargo || "";
      p.dependencia = f[5] || p.dependencia || "";
      p.profesion = f[6] || p.profesion || "";
      p.telefono = f[7] || p.telefono || "";
      p.horario = f[8] || p.horario || "";
      p.observaciones = f[9] || p.observaciones || "";
      p.fechaRegistro = formatearFechaIso(f[0]);
    });
  }

  /* --- progreso de lectura y tiempo --- */
  var hp = ss.getSheetByName(HOJA_PROGRESO);
  if (hp && hp.getLastRow() > 1) {
    hp.getDataRange().getValues().slice(1).forEach(function (f) {
      var correo = normalizar(f[1]);
      if (!correo) return;
      porCorreo[correo] = porCorreo[correo] || { correo: correo, nombre: f[2] || "" };
      var p = porCorreo[correo];
      p.nombre = p.nombre || f[2] || "";
      p.modulos = p.modulos || {};
      p.modulos[String(f[3])] = {
        numero: f[3],
        titulo: f[4] || ("Módulo " + f[3]),
        seccionesHechas: parseLista(f[5]),
        total: Number(f[6]) || 0,
        tiempo: Number(f[7]) || 0,
        actualizado: formatearFechaIso(f[0])
      };
    });
  }

  /* --- resultados por protocolo --- */
  var hres = ss.getSheetByName(HOJA_RESULTADOS);
  if (hres && hres.getLastRow() > 1) {
    hres.getDataRange().getValues().slice(1).forEach(function (f) {
      var correo = normalizar(f[2]);
      if (!correo) return;
      porCorreo[correo] = porCorreo[correo] || { correo: correo, nombre: f[3] || "" };
      var p = porCorreo[correo];
      p.nombre = p.nombre || f[3] || "";
      p.protocolos = p.protocolos || {};
      var id = String(f[6] || "").trim();
      if (!id) return;
      var prev = p.protocolos[id];
      var nota = Number(f[11]) || 0;
      p.protocolos[id] = {
        id: id,
        nombre: f[7] || id,
        aprobado: prev ? (prev.aprobado || f[12] === "Sí") : f[12] === "Sí",
        intentos: prev ? prev.intentos + 1 : 1,
        mejor: prev ? Math.max(prev.mejor, nota) : nota,
        ultimo: nota,
        ultimoIntento: Number(f[8]) || 1
      };
    });
  }

  /* --- arma la respuesta --- */
  var participantes = Object.keys(porCorreo).map(function (correo) {
    var p = porCorreo[correo];
    var mods = Object.keys(p.modulos || {}).map(function (k) {
      return p.modulos[k];
    }).sort(function (a, b) { return Number(a.numero) - Number(b.numero); });

    var seccionesOk = 0, seccionesTotales = 0, tiempoTotal = 0, modulosCompletos = 0;
    mods.forEach(function (m) {
      seccionesOk += m.seccionesHechas.length;
      seccionesTotales += m.total;
      tiempoTotal += m.tiempo;
      if (m.total > 0 && m.seccionesHechas.length >= m.total) modulosCompletos++;
    });

    var protos = Object.keys(p.protocolos || {}).map(function (k) {
      var x = p.protocolos[k];
      return {
        id: x.id,
        nombre: x.nombre,
        aprobado: x.aprobado,
        intentos: x.intentos,
        mejor: x.mejor,
        ultimo: x.ultimo,
        ultimoIntento: x.ultimoIntento
      };
    });

    var aprobados = protos.filter(function (x) { return x.aprobado; }).length;
    var intentos = protos.reduce(function (s, x) { return s + x.intentos; }, 0);

    return {
      correo: p.correo,
      nombre: p.nombre || "(sin nombre)",
      sede: p.sede || "",
      cargo: p.cargo || "",
      dependencia: p.dependencia || "",
      profesion: p.profesion || "",
      telefono: p.telefono || "",
      horario: p.horario || "",
      observaciones: p.observaciones || "",
      fechaRegistro: p.fechaRegistro || "",
      modulos: mods.map(function (m) {
        return {
          numero: m.numero,
          titulo: m.titulo,
          total: m.total,
          hechas: m.seccionesHechas.length,
          completo: m.total > 0 && m.seccionesHechas.length >= m.total,
          tiempo: m.tiempo,
          actualizado: m.actualizado
        };
      }),
      protocolos: protos,
      modulosCompletos: modulosCompletos,
      avanceLectura: seccionesTotales
        ? Math.round((seccionesOk / seccionesTotales) * 100)
        : 0,
      tiempoTotal: tiempoTotal,
      aprobados: aprobados,
      totalProtocolos: TOTAL_PROTOCOLOS,
      pendientes: Math.max(0, TOTAL_PROTOCOLOS - protos.length),
      intentos: intentos
    };
  }).sort(function (a, b) {
    return String(a.nombre).localeCompare(String(b.nombre), "es");
  });

  guardarSesiones();

  return {
    ok: true,
    participantes: participantes,
    aprobados: participantes.reduce(function (s, p) { return s + p.aprobados; }, 0),
    intentos: participantes.reduce(function (s, p) { return s + p.intentos; }, 0),
    tiempoTotal: participantes.reduce(function (s, p) { return s + p.tiempoTotal; }, 0),
    consultado: hoyIso()
  };
}

/**
 * Borra TODO el progreso de una persona: lectura, tiempo y resultados.
 * La ficha (nombre, sede, cargo) se conserva.
 */
function adminBorrar(d) {
  cargarSesiones();
  if (!revisarToken(d.token)) {
    return { ok: false, mensaje: "La sesión expiró. Vuelve a entrar." };
  }

  var correo = normalizar(d.correo);
  if (!correo) return { ok: false, mensaje: "Falta el correo." };

  var ss = obtenerSpreadsheet();

  var borrados = 0;
  [HOJA_PROGRESO, HOJA_RESULTADOS].forEach(function (nombreHoja) {
    var hoja = ss.getSheetByName(nombreHoja);
    if (!hoja || hoja.getLastRow() < 2) return;
    var valores = hoja.getDataRange().getValues();
    var columnaCorreo = nombreHoja === HOJA_PROGRESO ? 1 : 2;
    for (var i = valores.length - 1; i >= 1; i--) {
      if (normalizar(valores[i][columnaCorreo]) === correo) {
        hoja.deleteRow(i + 1);
        borrados++;
      }
    }
  });

  return { ok: true, correo: correo, filasBorradas: borrados };
}

/** Convierte "0,2,4" en [0, 2, 4]. */
function parseLista(texto) {
  if (texto === null || texto === undefined || texto === "") return [];
  return String(texto).split(",")
    .map(function (x) { return parseInt(x, 10); })
    .filter(function (x) { return !isNaN(x); });
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
      dependencia: f[5],
      profesion: f[6],
      telefono: f[7],
      horario: f[8],
      observaciones: f[9]
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
  /* DriveApp.getFilesByName devuelve CUALQUIER archivo con ese nombre: carpetas,
     proyectos de script y otros. Antes setomaba el primero y se le llamaba
     getSpreadsheet(), que reventaba con
     "archivos.next(...).getSpreadsheet is not a function".
     Ahora se filtra por tipo de archivo y se abre por ID. */
  var archivos = DriveApp.getFilesByName(nombre);
  while (archivos.hasNext()) {
    var archivo = archivos.next();
    if (archivo.getMimeType() === "application/vnd.google-apps.spreadsheet") {
      return SpreadsheetApp.openById(archivo.getId());
    }
  }
  return null;
}

/** Ejecuta esta función UNA VEZ desde el editor para crear las pestañas. */
function crearHojas() {
  crearHojas(obtenerSpreadsheet());
  Logger.log("Pestañas listas en: " + NOMBRE_SPREADSHEET);
}

function crearHojas(ss) {
  [HOJA_REGISTRO, HOJA_RESULTADOS, HOJA_PROGRESO].forEach(function (nombre) {
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
  var r1 = registrarParticipante({
    correo: "prueba@esevillavicencio.gov.co",
    nombre: "Participante de Prueba",
    sede: "CAMPUS ESE MUNICIPAL",
    cargo: "Enfermería",
    dependencia: "Urgencias",
    profesion: "Enfermería"
  });
  Logger.log("registrarParticipante: " + JSON.stringify(r1));

  var r2 = registrarResultado({
    codigo: "ESE-VLL-2026-CAUZ-000001",
    correo: "prueba@esevillavicencio.gov.co",
    nombre: "Participante de Prueba",
    sede: "CAMPUS ESE MUNICIPAL",
    cargo: "Enfermería",
    protocolo: "codigo-azul",
    protocoloNombre: "Código Azul",
    intento: 1,
    aciertos: 9,
    total: 10,
    porcentaje: 90,
    aprobado: true,
    temas: [{ titulo: "Código Azul", porcentaje: 90 }]
  });
  Logger.log("registrarResultado: " + JSON.stringify(r2));

  var r3 = registrarProgreso({
    correo: "prueba@esevillavicencio.gov.co",
    nombre: "Participante de Prueba",
    modulo: "1",
    titulo: "Código Azul",
    secciones: "0,1",
    totalSecciones: 4,
    tiempo: 300
  });
  Logger.log("registrarProgreso: " + JSON.stringify(r3));

  var r4 = adminEntrar({ clave: "CLAVE_ADMIN_REAL" });
  Logger.log("adminEntrar: " + JSON.stringify(r4));

  Logger.log("Quedan filas de prueba en " + NOMBRE_SPREADSHEET + ".");
}
