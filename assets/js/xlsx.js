/* =========================================================================
 * XLSX MÍNIMO — genera un archivo .xlsx real en el navegador
 * -------------------------------------------------------------------------
 * Un .xlsx es un ZIP con archivos XML. Aquí se arma a mano para no meter
 * una librería externa en el sitio: el panel exporta las mismas tablas que
 * ya tiene en memoria, así que no hace falta pedirle nada al servidor.
 *
 *   window.XLSX.descargar("participantes", [
 *     { nombre: "Participantes", filas: [["Correo", "Nombre"], ["a@b.co", "Ana"]] },
 *     { nombre: "Notas", filas: [["Correo", "Nota"]] },
 *   ]);
 *
 * Los textos van como "inline string" (no hay sharedStrings) y se congela
 * la primera fila para que el encabezado quede siempre visible.
 * ========================================================================= */
(function (raiz) {
  "use strict";

  /* ---------------------------------------------------------------
   * ZIP: los archivos se guardan sin comprimir (método "store"), que es
   * un ZIP válido y lo abre Excel sin problema. Para estos datos no vale
   * la pena meter un descompresor.
   * --------------------------------------------------------------- */
  var TABLA_CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = TABLA_CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function texto(valor) {
    var encoder = new TextEncoder();
    return encoder.encode(valor);
  }

  /* Fecha y hora en el formato que usa el ZIP (hora local). */
  function marcaTiempo(d) {
    return ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() / 2)) & 0xFFFF;
  }
  function marcaFecha(d) {
    return (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
  }

  /** Escribe una fila de enteros de 32 bits little-endian, avanzando el
   *  puntero 4 bytes por valor. */
  function escribirEnteros(destino, desde, valores) {
    for (var i = 0; i < valores.length; i++) {
      var v = valores[i];
      destino[desde] = v & 0xFF;
      destino[desde + 1] = (v >>> 8) & 0xFF;
      destino[desde + 2] = (v >>> 16) & 0xFF;
      destino[desde + 3] = (v >>> 24) & 0xFF;
      desde += 4;
    }
    return desde;
  }

  /** Escribe una fila de enteros de 16 bits little-endian (el ZIP usa de
   *  ambos tamaños según el campo: fecha y longitudes son de 16 bits). */
  function escribirCortos(destino, desde, valores) {
    for (var i = 0; i < valores.length; i++) {
      destino[desde + i * 2] = valores[i] & 0xFF;
      destino[desde + i * 2 + 1] = (valores[i] >>> 8) & 0xFF;
    }
    return desde + valores.length * 2;
  }

  /** Devuelve los bytes de un ZIP que contiene los archivos dados.
   *
   *  Disposición de la cabecera local (30 bytes fijos + nombre):
   *    0-firma | 4-versión | 6-flags | 8-método | 10-fecha | 12-hora
   *    14-crc | 18-tamaño comprimido | 22-tamaño real | 26-nombre | 28-extra
   *  Y del directorio central (46 bytes fijos + nombre):
   *    0-firma | 4-versión | 6-versión necesaria | 8-flags | 10-método
   *    12-fecha | 14-hora | 16-crc | 20-tamaño | 24-tamaño real
   *    28-nombre | 30-extra | 32-comentario | 34-disco | 36-atributos internos
   *    38-atributos externos | 42-posición | 46-nombre
   */
  function zip(archivos) {
    var piezas = [];
    var central = [];
    var desplazamiento = 0;
    var ahora = new Date();
    var hora = marcaTiempo(ahora);
    var fecha = marcaFecha(ahora);

    archivos.forEach(function (archivo) {
      var nombre = texto(archivo.nombre);
      var contenido = typeof archivo.datos === "string" ? texto(archivo.datos) : archivo.datos;
      var crc = crc32(contenido);
      var largo = nombre.length;

      var cabecera = new Uint8Array(30 + largo);
      cabecera[0] = 0x50; cabecera[1] = 0x4B; cabecera[2] = 3; cabecera[3] = 4;
      cabecera[4] = 20;                                   // versión necesaria
      cabecera[8] = 0;                                    // método: store
      escribirCortos(cabecera, 10, [hora, fecha]);
      escribirEnteros(cabecera, 14, [crc, contenido.length, contenido.length]);
      escribirCortos(cabecera, 26, [largo, 0]);
      cabecera.set(nombre, 30);

      piezas.push(cabecera, contenido);

      var cd = new Uint8Array(46 + largo);
      cd[0] = 0x50; cd[1] = 0x4B; cd[2] = 1; cd[3] = 2;
      cd[4] = 20; cd[6] = 20;                              // versión
      cd[8] = 0; cd[10] = 0;                               // flags y método
      escribirCortos(cd, 12, [hora, fecha]);
      escribirEnteros(cd, 16, [crc, contenido.length, contenido.length]);
      escribirCortos(cd, 28, [largo, 0, 0, 0, 0, 0]);
      escribirEnteros(cd, 42, [desplazamiento]);
      cd.set(nombre, 46);
      central.push(cd);

      desplazamiento += cabecera.length + contenido.length;
    });

    var centralTotal = central.reduce((s, c) => s + c.length, 0);
    var fin = new Uint8Array(22);
    fin[0] = 0x50; fin[1] = 0x4B; fin[2] = 5; fin[3] = 6;
    escribirCortos(fin, 4, [0, 0, archivos.length, archivos.length]);
    escribirEnteros(fin, 12, [centralTotal, desplazamiento]);
    escribirCortos(fin, 20, [0]);

    var todo = new Uint8Array(desplazamiento + centralTotal + fin.length);
    var pos = 0;
    piezas.forEach((x) => { todo.set(x, pos); pos += x.length; });
    central.forEach((x) => { todo.set(x, pos); pos += x.length; });
    todo.set(fin, pos);
    return todo;
  }

  /* ---------------------------------------------------------------
   * OOXML
   * --------------------------------------------------------------- */
  function escapar(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      /* Los caracteres de control son inválidos en XML y Excel los rechaza. */
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  }

  /** Columna 1 -> A, 27 -> AA. Excel cuenta en base 26. */
  function columna(n) {
    var letras = "";
    while (n > 0) {
      var resto = (n - 1) % 26;
      letras = String.fromCharCode(65 + resto) + letras;
      n = (n - resto - 1) / 26;
    }
    return letras;
  }

  function esNumero(v) {
    return typeof v === "number" && isFinite(v);
  }

  function celda(valor, fila, col, estilo) {
    var ref = columna(col) + fila;
    /* s="1" = encabezado: blanco sobre verde. */
    var s = estilo ? ' s="' + estilo + '"' : "";
    if (valor === null || valor === undefined || valor === "") return "";
    if (esNumero(valor)) return '<c r="' + ref + '"' + s + "><v>" + valor + "</v></c>";
    return '<c r="' + ref + '"' + s + ' t="inlineStr"><is><t xml:space="preserve">'
      + escapar(valor) + "</t></is></c>";
  }

  function hojaXml(hoja) {
    var filas = hoja.filas || [];
    var ancho = filas.reduce((max, f) => Math.max(max, (f || []).length), 1);
    var cuerpo = "";

    for (var f = 0; f < filas.length; f++) {
      var celdas = "";
      for (var c = 0; c < (filas[f] || []).length; c++) {
        celdas += celda(filas[f][c], f + 1, c + 1, f === 0 ? 1 : 0);
      }
      cuerpo += '<row r="' + (f + 1) + '">' + celdas + "</row>";
    }

    var columnas = "";
    if (hoja.anchos && hoja.anchos.length) {
      columnas = "<cols>" + hoja.anchos.map((w, i) =>
        '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'
      ).join("") + "</cols>";
    }

    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      /* Congela la fila del encabezado al desplazarse. */
      + '<sheetViews><sheetView workbookViewId="0">'
      + '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
      + "</sheetView></sheetViews>"
      + '<sheetFormatPr defaultRowHeight="15"/>'
      + columnas
      + '<sheetData>' + cuerpo + "</sheetData>"
      + "</worksheet>";
  }

  var ESTILOS =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + '<fonts count="2">'
    + '<font><sz val="11"/><name val="Calibri"/></font>'
    + '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'
    + "</fonts>"
    + '<fills count="3">'
    + '<fill><patternFill patternType="none"/></fill>'
    + '<fill><patternFill patternType="gray125"/></fill>'
    + '<fill><patternFill patternType="solid"><fgColor rgb="FF1B5E20"/><bgColor indexed="64"/></patternFill></fill>'
    + "</fills>"
    + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + '<cellXfs count="2">'
    + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
    + '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
    + "</cellXfs>"
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
    + "</styleSheet>";

  function construir(nombreBase, hojas) {
    var lista = hojas.filter(Boolean);
    if (!lista.length) lista = [{ nombre: "Hoja 1", filas: [["Sin datos"]] }];

    var archivos = [];

    var contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      + '<Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
      + lista.map((h, i) =>
        '<Override PartName="/xl/worksheets/sheet' + (i + 1) + ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>"
      ).join("")
      + "</Types>";
    archivos.push({ nombre: "[Content_Types].xml", datos: contentTypes });

    archivos.push({
      nombre: "_rels/.rels",
      datos: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        + "</Relationships>",
    });

    var hojasXml = lista.map((h, i) =>
      '<sheet name="' + escapar(h.nombre) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'
    ).join("");

    archivos.push({
      nombre: "xl/workbook.xml",
      datos: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
        + ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        + "<sheets>" + hojasXml + "</sheets></workbook>",
    });

    var rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + lista.map((h, i) =>
        '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'
      ).join("")
      + '<Relationship Id="rId' + (lista.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
      + "</Relationships>";
    archivos.push({ nombre: "xl/_rels/workbook.xml.rels", datos: rels });

    lista.forEach((h, i) => {
      archivos.push({ nombre: "xl/worksheets/sheet" + (i + 1) + ".xml", datos: hojaXml(h) });
    });

    archivos.push({ nombre: "xl/styles.xml", datos: ESTILOS });

    return { bytes: zip(archivos), hojas: lista.length };
  }

  var API = {
    /** Devuelve los bytes del .xlsx (útil para probar). */
    construir: construir,

    /** Arma el archivo y lo descarga. */
    descargar: function (nombreBase, hojas) {
      var salida = construir(nombreBase, hojas);
      var blob = new Blob([salida.bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var dia = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = nombreBase + "-" + dia + ".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      /* Se libera en un instante para no dejar el archivo retenido en memoria. */
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return salida;
    },
  };

  raiz.XLSX = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : this);