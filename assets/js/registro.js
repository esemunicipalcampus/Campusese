/* =========================================================================
 * REGISTRO INSTITUCIONAL
 * Muestra quién entró a la capacitación y qué nota obtuvo en cada protocolo,
 * incluidos los intentos no aprobados. El código de acceso se escribe aquí
 * y lo valida Google Apps Script: no está incrustado en el sitio.
 * ========================================================================= */
(function () {
  "use strict";

  const A = window.App;
  const C = window.CONFIG;

  const cajaAcceso = document.getElementById("cajaAcceso");
  const zona = document.getElementById("zonaRegistro");
  const inp = document.getElementById("inpClave");
  const salida = document.getElementById("salidaAcceso");
  const btn = document.getElementById("btnEntrar");

  let datos = [];

  /* ------------------------------------------------------------------
   * Vista local: participantes y notas guardadas en ESTE navegador.
   * ---------------------------------------------------------------- */
  function sinBackend() {
    cajaAcceso.innerHTML =
      '<div class="aviso aviso-error"><strong>El registro central no está conectado</strong>'
      + 'La página funciona con Google Sheets como almacén. Pide al administrador que '
      + 'configure <code>CONFIG.appsScriptUrl</code> y active '
      + '<code>CONFIG.almacenamiento = "sheet"</code>.</div>';

    const fichas = A.obtenerRegistro();
    const correos = Object.keys(fichas);
    const todos = A.obtenerResultados();

    if (!correos.length && !todos.length) {
      zona.classList.remove("oculto");
      zona.innerHTML = '<div class="tarjeta"><div class="vacio"><span class="icono">📋</span>'
        + '<h2>Sin registros en este equipo</h2>'
        + '<p>Nadie ha entrado a la capacitación desde este navegador.</p></div></div>';
      return;
    }

    zona.classList.remove("oculto");
    zona.innerHTML = '<div class="aviso aviso-info"><strong>Vista local</strong>'
      + 'Estos son únicamente los registros guardados en este navegador, no el '
      + 'registro institucional central.</div>'
      + resumenLocal(correos, todos)
      + tabla(correos, todos);
  }

  function resumenLocal(correos, todos) {
    const aprobados = todos.filter(function (r) { return r.aprobado; });
    const conNota = todos.length;
    const promedio = conNota
      ? Math.round(aprobados.reduce(function (s, r) { return s + Number(r.porcentaje || 0); }, 0) / conNota)
      : 0;
    const sinAprobar = conNota - aprobados.length;
    return '<div class="tarjeta"><h2>Resumen</h2><div class="resumen-temas">'
      + filaResumen("Personas que entraron", correos.length, "est-ok")
      + filaResumen("Evaluaciones realizadas", conNota, "est-ok")
      + filaResumen("Aprobadas", aprobados.length, "est-ok")
      + filaResumen("No aprobadas", sinAprobar, sinAprobar ? "est-mal" : "est-ok")
      + filaResumen("Promedio de notas", promedio + " %", "est-ok")
      + "</div></div>";
  }

  function filaResumen(nombre, valor, clase) {
    return '<div class="resumen-fila"><div class="nom">' + A.esc(nombre) + "</div>"
      + '<div class="est ' + clase + '">' + A.esc(valor) + "</div></div>";
  }

  /* ------------------------------------------------------------------
   * Tabla principal: una fila por persona y protocolo, con la NOTA de
   * su mejor intento (o el último, si nunca aprobó).
   * ---------------------------------------------------------------- */
  function tabla(correos, todos) {
    let h = '<div class="tarjeta"><h2>Participantes y notas</h2>';
    h += '<p class="texto-suave texto-peq">Una fila por persona. '
      + "En la última columna se ve el detalle de cada intento.</p>";

    h += '<div class="tabla-envoltura"><table class="datos"><thead><tr>'
      + "<th>Nombre</th><th>Correo</th><th>Sede</th><th>Cargo</th>"
      + "<th>Protocolo</th><th>Nota</th><th>Intentos</th><th>Estado</th><th>Fecha</th>"
      + "</tr></thead><tbody>";

    correos.forEach(function (correo) {
      const ficha = (function () { const f = A.obtenerRegistro(); return f[correo] || {}; })();
      const nombre = ficha.nombre || correo;
      const susResultados = todos.filter(function (r) { return r.correo === correo; });

      if (!susResultados.length) {
        h += "<tr>"
          + "<td><strong>" + A.esc(nombre) + "</strong></td>"
          + "<td><small>" + A.esc(correo) + "</small></td>"
          + "<td>" + A.esc(ficha.sede || "—") + "</td>"
          + "<td>" + A.esc(ficha.cargo || "—") + "</td>"
          + '<td colspan="5"><em class="texto-suave">Entró, pero aún no presenta ninguna evaluación</em></td>'
          + "</tr>";
        return;
      }

      A.protocolos().forEach(function (p) {
        const rs = susResultados
          .filter(function (r) { return r.protocolo === p.id; })
          .sort(function (a, b) { return new Date(a.fecha) - new Date(b.fecha); });
        if (!rs.length) return;

        const aprobado = rs.find(function (r) { return r.aprobado; });
        const mejor = aprobado || rs[rs.length - 1];
        const ultimo = rs[rs.length - 1];

        h += "<tr>"
          + "<td><strong>" + A.esc(nombre) + "</strong></td>"
          + "<td><small>" + A.esc(correo) + "</small></td>"
          + "<td>" + A.esc(ficha.sede || "—") + "</td>"
          + "<td>" + A.esc(ficha.cargo || "—") + "</td>"
          + "<td>" + A.esc(p.nombre) + "</td>"
          + "<td><b>" + A.esc(mejor.porcentaje) + " %</b><br>"
            + "<small class=\"texto-suave\">" + A.esc(mejor.aciertos) + "/" + A.esc(mejor.total) + "</small></td>"
          + "<td>" + rs.length + " de " + C.programa.intentosMaximos + "</td>"
          + "<td>" + (aprobado
            ? '<span class="pill-est pill-ok">Aprobado</span>'
            : '<span class="pill-est pill-mal">No aprobó</span>') + "</td>"
          + "<td><small>" + A.esc(A.fechaCorta(ultimo.fecha)) + "</small>"
            + detalleIntentos(rs) + "</td>"
          + "</tr>";
      });
    });

    h += "</tbody></table></div></div>";
    return h;
  }

  function detalleIntentos(rs) {
    const items = rs.map(function (r) {
      return "Intento " + r.intento + ": " + r.porcentaje + " %"
        + " (" + r.aciertos + "/" + r.total + ")"
        + (r.aprobado ? " ✓" : "");
    });
    return '<details class="detalle-intentos"><summary>Ver intentos</summary>'
      + "<ul>" + items.map(function (i) { return "<li>" + A.esc(i) + "</li>"; }).join("") + "</ul>"
      + "</details>";
  }

  /* ------------------------------------------------------------------
   * Vista remota: lo que devuelve Google Sheets.
   * ---------------------------------------------------------------- */
  function tablaRemota(lista) {
    let h = '<div class="tabla-envoltura"><table class="datos"><thead><tr>'
      + "<th>Nombre</th><th>Correo</th><th>Sede</th><th>Cargo</th>"
      + "<th>Protocolo</th><th>Nota</th><th>Fecha</th><th>Código</th>"
      + "</tr></thead><tbody>";

    lista.forEach(function (r) {
      h += "<tr>"
        + "<td><strong>" + A.esc(r.nombre || "—") + "</strong></td>"
        + "<td><small>" + A.esc(r.correo || "—") + "</small></td>"
        + "<td>" + A.esc(r.sede || "—") + "</td>"
        + "<td>" + A.esc(r.cargo || "—") + "</td>"
        + "<td>" + A.esc(r.protocoloNombre || r.protocolo || "—") + "</td>"
        + "<td><b>" + A.esc(r.porcentaje) + " %</b><br>"
          + "<small class=\"texto-suave\">" + A.esc(r.aciertos) + "/" + A.esc(r.total) + "</small></td>"
        + "<td><small>" + A.esc(r.fecha || "") + "</small></td>"
        + "<td><code>" + A.esc(r.codigo || "") + "</code></td>"
        + "</tr>";
    });

    h += "</tbody></table></div>";
    return h;
  }

  function resumenHtml(resumen) {
    const claves = Object.keys(resumen || {});
    if (!claves.length) return "";
    let h = '<div class="tarjeta mt-1"><h2>Resumen por protocolo</h2><div class="resumen-temas">';
    claves.forEach(function (k) {
      h += '<div class="resumen-fila"><div class="nom">' + A.esc(k) + "</div>"
        + '<div class="est est-ok">' + resumen[k] + "</div></div>";
    });
    return h + "</div></div>";
  }

  function pintar(res) {
    datos = res.registros || [];

    let h = '<div class="tarjeta">';
    h += "<h2>Registro de participantes (" + datos.length + ")</h2>";
    h += '<p class="texto-suave texto-peq">Consulta generada el '
      + A.esc(res.generados || "") + "</p>";

    h += '<div class="filtros-registro">'
      + '<div class="campo"><label for="fProtocolo">Protocolo</label>'
      + '<select id="fProtocolo"><option value="">Todos</option>'
      + A.protocolos().map(function (p) {
          return '<option value="' + A.esc(p.id) + '">' + A.esc(p.nombre) + "</option>";
        }).join("")
      + "</select></div>"
      + '<div class="campo"><label for="fDesde">Desde</label><input type="date" id="fDesde"></div>'
      + '<div class="campo"><label for="fHasta">Hasta</label><input type="date" id="fHasta"></div>'
      + '<div class="campo"><label for="fTexto">Buscar</label>'
      + '<input type="text" id="fTexto" placeholder="Nombre, correo, cargo o código"></div>'
      + '<button type="button" class="btn" id="btnFiltrar">Aplicar filtros</button>'
      + '<button type="button" class="btn btn-borde" id="btnExportar">Descargar CSV</button>'
      + '<button type="button" class="btn btn-borde" id="btnSalirReg">Cerrar sesión</button>'
      + "</div>";
    h += "</div>";

    h += resumenHtml(res.resumen);
    h += '<div id="tablaResultado">' + tablaRemota(datos) + "</div>";

    zona.innerHTML = h;
    zona.classList.remove("oculto");
    cajaAcceso.classList.add("oculto");

    document.getElementById("btnFiltrar").addEventListener("click", consultar);
    document.getElementById("btnExportar").addEventListener("click", exportar);
    document.getElementById("btnSalirReg").addEventListener("click", function () {
      inp.value = "";
      datos = [];
      zona.classList.add("oculto");
      zona.innerHTML = "";
      cajaAcceso.classList.remove("oculto");
    });

    document.getElementById("btnExportar").disabled = datos.length === 0;
  }

  function exportar() {
    const cab = ["Nombre", "Correo", "Sede", "Cargo",
      "Protocolo", "Nota", "Aciertos", "Total", "Fecha", "Código"];
    const filas = datos.map(function (r) {
      return [r.nombre, r.correo, r.sede, r.cargo,
        r.protocoloNombre || r.protocolo, r.porcentaje, r.aciertos, r.total, r.fecha, r.codigo];
    });
    const csv = [cab].concat(filas)
      .map(function (f) {
        return f.map(function (v) {
          return '"' + String(v === undefined || v === null ? "" : v).replace(/"/g, '""') + '"';
        }).join(";");
      })
      .join("\r\n");

    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "registro-protocolos-ese.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function consultar() {
    const clave = inp.value.trim();
    if (!clave) {
      salida.innerHTML = '<div class="aviso aviso-error">Escribe el código de acceso.</div>';
      return;
    }

    btn.disabled = true;
    salida.innerHTML = '<p class="centro texto-suave">Consultando…</p>';

    const filtros = {
      protocolo: (document.getElementById("fProtocolo") || {}).value || "",
      desde: (document.getElementById("fDesde") || {}).value || "",
      hasta: (document.getElementById("fHasta") || {}).value || "",
      q: (document.getElementById("fTexto") || {}).value || ""
    };

    const res = await A.Remoto.registroAprobados(clave, filtros);

    btn.disabled = false;

    if (!res || res.ok !== true) {
      salida.innerHTML = '<div class="aviso aviso-error"><strong>No se pudo consultar</strong>'
        + A.esc((res && (res.error || res.motivo || res.bruto)) || "El backend no respondió.")
        + "</div>";
      return;
    }

    pintar(res);
  }

  btn.addEventListener("click", consultar);
  inp.addEventListener("keydown", function (e) {
    if (e.key === "Enter") consultar();
  });

  if (!A.Remoto.habilitado()) sinBackend();
})();