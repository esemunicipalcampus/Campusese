/* =========================================================================
 * PANEL ADMINISTRATIVO
 * -------------------------------------------------------------------------
 * Solo entra quien conozca la contraseña maestra. La contraseña NO está en
 * este archivo: se envía al backend, que la compara y devuelve un token
 * de sesión. Por eso el panel no funciona hasta desplegar el Apps Script.
 * ========================================================================= */
(function () {
  "use strict";

  const A = window.App;
  const C = window.CONFIG;
  const cont = document.getElementById("contenidoAdmin");
  const CLAVE_SESION = "ese_admin_sesion";

  let token = null;
  let datos = null;

  /* Filtros, orden y forma de ver la lista. Vive aquí porque los botones
     de Excel deben sacar exactamente lo que hay en pantalla. */
  const estado = {
    q: "", sede: "", cargo: "", estado: "", protocolo: "",
    orden: { col: "nombre", dir: 1 },
    vista: "tabla",
  };

  /* ------------------------------------------------------------------ */
  /* Sesión del administrador                                            */
  /* ------------------------------------------------------------------ */
  function leerToken() {
    try { return sessionStorage.getItem(CLAVE_SESION) || null; } catch (e) { return null; }
  }
  function guardarToken(t) {
    token = t;
    try { t ? sessionStorage.setItem(CLAVE_SESION, t) : sessionStorage.removeItem(CLAVE_SESION); } catch (e) { }
  }

  /* ------------------------------------------------------------------ */
  /* Pantalla de acceso                                                  */
  /* ------------------------------------------------------------------ */
  function pintarAcceso(mensaje) {
    cont.innerHTML = `
      <div class="tarjeta" style="max-width:520px;margin:0 auto">
        <h1 style="text-align:center">Panel administrativo</h1>
        <p class="texto-suave" style="text-align:center">
          Acceso restringido a la coordinación de capacitación.
        </p>

        ${!A.Remoto.habilitado() ? `
        <div class="aviso aviso-alerta">
          <strong>El registro central no está conectado</strong>
          En <code>assets/js/config.js</code> faltan <code>almacenamiento: "sheet"</code>
          y <code>appsScriptUrl</code>. Sin eso el panel no tiene datos de otras
          personas: solo verías lo guardado en este navegador.
        </div>` : ""}

        ${mensaje && /propiedades de secuencia de comandos/i.test(mensaje) ? `
        <div class="aviso aviso-alerta">
          <strong>El panel todavía no tiene contraseña maestra</strong>
          Ya no está escrita en el sitio, por seguridad. Crear la contraseña es
          una sola vez, en Google Apps Script: <b>Configuración del proyecto →
          Propiedades de secuencia de comandos → Agregar</b>, con el nombre
          <code>CLAVE_ADMIN</code> y como valor la contraseña que quieras usar.
        </div>` : ""}

        <form id="formAcceso" novalidate>
          <div class="campo">
            <label for="claveAdmin">Contraseña maestra</label>
            <input type="password" id="claveAdmin" autocomplete="current-password" required>
          </div>
          <button type="submit" class="btn btn-bloque">Entrar</button>
        </form>

        ${mensaje ? `<div class="aviso aviso-error mt-2">${A.esc(mensaje)}</div>` : ""}
      </div>`;

    const form = document.getElementById("formAcceso");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const clave = document.getElementById("claveAdmin").value;
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Verificando…";

      const r = await A.Remoto.adminEntrar(clave);
      btn.disabled = false;
      btn.textContent = "Entrar";

      if (!r || r.ok !== true || !r.token) {
        A.aviso(motivoDeFallo(r), "error", 9000);
        return;
      }
      guardarToken(r.token);
      cargar();
    });
  }

  /* Explica por qué no se pudo entrar. Antes decía "Contraseña incorrecta"
     aunque el servidor ni siquiera estaba configurado, y eso hacía pensar
     que la contraseña estaba mal cuando el problema era otro. */
  function motivoDeFallo(r) {
    if (r && r.motivo === "deshabilitado") {
      return "El registro central no está conectado, así que no se puede verificar "
        + "ninguna contraseña. En assets/js/config.js faltan almacenamiento: \"sheet\" "
        + "y appsScriptUrl. El panel solo entra cuando el Apps Script está desplegado "
        + "y tiene la contraseña maestra guardada en sus propiedades.";
    }
    if (r && r.motivo === "sin-red") {
      return "No hubo respuesta del servidor. Revisa tu conexión o el despliegue del Apps Script.";
    }
    if (r && r.motivo) {
      return "El servidor respondió: " + (r.mensaje || r.motivo);
    }
    if (r && r.mensaje) return r.mensaje;
    return "No se pudo verificar la contraseña.";
  }

  /* ------------------------------------------------------------------ */
  /* Tablero                                                             */
  /* ------------------------------------------------------------------ */
  function minutos(s) {
    if (!s) return "—";
    if (s < 60) return s + " s";
    const m = Math.round(s / 60);
    return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + (m % 60) + " min";
  }

  function barra(pct) {
    const v = Math.max(0, Math.min(100, Number(pct) || 0));
    return `<span class="pt-lectura-barra"><i style="width:${v}%"></i></span>`;
  }

  /* ------------------------------------------------------------------ */
  /* Filtros, estados y orden                                            */
  /* ------------------------------------------------------------------ */

  /* Los cuatro estados que de verdad sirven para perseguir a alguien.
     Se calculan aquí y no vienen del servidor, para que la tabla, los
     filtros y el Excel salgan siempre con lo mismo. */
  const ESTADOS = [
    { id: "sin-iniciar", txt: "Sin iniciar", pill: "pill-neutro" },
    { id: "en-curso", txt: "En curso", pill: "pill-avanzando" },
    { id: "lectura-completa", txt: "Terminó la lectura", pill: "pill-mal" },
    { id: "aprobado", txt: "Aprobó los 4", pill: "pill-ok" },
  ];

  function totalModulosCurso() {
    return (window.CURSO && window.CURSO.modulos) ? window.CURSO.modulos.length : 0;
  }

  function estadoDe(p) {
    const leidos = (p.modulos || []).filter((m) => m.completo).length;
    if ((p.aprobados || 0) >= (p.totalProtocolos || 0)) return "aprobado";
    if (leidos === 0 && !p.tiempoTotal) return "sin-iniciar";
    if (totalModulosCurso() && leidos >= totalModulosCurso()) return "lectura-completa";
    return "en-curso";
  }

  function estadoInfo(id) {
    return ESTADOS.find((e) => e.id === id) || ESTADOS[0];
  }

  /** Marca de tiempo de la última actividad de la persona. */
  function ultimoAvance(p) {
    let max = 0;
    (p.modulos || []).forEach((m) => {
      const t = Date.parse(m.actualizado || "") || 0;
      if (t > max) max = t;
    });
    return max;
  }

  function fechaCorta(t) {
    if (!t) return "—";
    const d = new Date(t);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }

  function sinAcento(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function coincide(p, q) {
    if (!q) return true;
    return sinAcento([p.nombre, p.correo, p.sede, p.cargo, p.dependencia, p.telefono].join(" "))
      .includes(sinAcento(q));
  }

  /** Aplica buscador + filtros. Devuelve la lista que se ve y la que se exporta. */
  function filtrar() {
    let filas = (datos && datos.participantes) || [];
    const f = estado;

    if (f.q) filas = filas.filter((p) => coincide(p, f.q));
    if (f.sede) filas = filas.filter((p) => (p.sede || "—") === f.sede);
    if (f.cargo) filas = filas.filter((p) => (p.cargo || "—") === f.cargo);
    if (f.estado) filas = filas.filter((p) => estadoDe(p) === f.estado);
    if (f.protocolo) {
      filas = filas.filter((p) => (p.protocolos || []).some((x) => x.id === f.protocolo && x.aprobado));
    }

    /* Se busca por id, no por el objeto entero: si no, ninguna columna
       coincidiría y la lista saldría siempre ordenada por nombre. */
    const col = COLUMNAS.find((c) => c.id === f.orden.col) || COLUMNAS[0];
    const dir = f.orden.dir;
    return filas.slice().sort((a, b) => {
      const va = col.valor(a);
      const vb = col.valor(b);
      if (col.num) return (va - vb) * dir;
      return String(va).localeCompare(String(vb), "es") * dir;
    });
  }

  /** Opciones de un desplegable, a partir de lo que hay en los datos. */
  function opciones(campo) {
    const vistos = [];
    ((datos && datos.participantes) || []).forEach((p) => {
      const v = campo === "sede" ? (p.sede || "—") : (p.cargo || "—");
      if (!vistos.includes(v)) vistos.push(v);
    });
    return vistos.sort((a, b) => a.localeCompare(b, "es"));
  }

  const COLUMNAS = [
    { id: "nombre", txt: "Nombre", valor: (p) => p.nombre || "" },
    { id: "sede", txt: "Sede", valor: (p) => p.sede || "" },
    { id: "cargo", txt: "Cargo", valor: (p) => p.cargo || "" },
    { id: "estado", txt: "Estado", valor: (p) => estadoInfo(estadoDe(p)).txt },
    { id: "aprobados", txt: "Aprobados", valor: (p) => p.aprobados || 0, num: true },
    { id: "avance", txt: "Avance", valor: (p) => p.avanceLectura || 0, num: true },
    { id: "tiempo", txt: "Tiempo", valor: (p) => p.tiempoTotal || 0, num: true },
    { id: "ultimo", txt: "Última actividad", valor: ultimoAvance, num: true },
  ];

  function pintar() {
    const total = ((datos && datos.participantes) || []).length;
    const visibles = filtrar().length;

    /* Cifras reales del curso, leidas de la misma fuente que usa el sitio.
       No van escritas a mano para que no se desactualicen. */
    const protocolos = (C.protocolos || []).length;
    const modulos = totalModulosCurso();
    const temas = window.TEMAS ? window.TEMAS.length : 0;
    const preguntas = window.BancoPreguntas ? window.BancoPreguntas.total() : 0;
    const horas = (C.protocolos || []).reduce((s, p) => s + Number(p.horas || 0), 0);

    const filtro = (id, etiqueta, opciones_, actual) => `
      <div class="campo">
        <label for="${id}">${etiqueta}</label>
        <select id="${id}">
          <option value="">Todos</option>
          ${opciones_.map((o) => `<option value="${A.esc(o.id || o)}"${actual === (o.id || o) ? " selected" : ""}>${A.esc(o.txt || o)}</option>`).join("")}
        </select>
      </div>`;

    cont.innerHTML = `
      <div class="tarjeta">
        <div class="fila-top admin-cabecera">
          <div>
            <h1 style="margin:0">Panel administrativo</h1>
            <p class="texto-peq texto-suave" style="margin:.2rem 0 0">
              <a href="index.html" class="enlace-volver">&larr; Volver al inicio</a>
            </p>
          </div>
          <div class="admin-cabecera-botones">
            <button type="button" class="btn btn-borde" id="btnExcel">Descargar Excel</button>
            <button type="button" class="btn btn-borde" id="btnSalirAdmin">Salir</button>
          </div>
        </div>

        <h2 class="admin-seccion">Contenido del curso</h2>
        <div class="contenido-curso">
          <div class="cc cc-azul"><span class="cc-num">${A.esc(protocolos)}</span><span class="cc-txt">Protocolos</span></div>
          <div class="cc cc-magenta"><span class="cc-num">${A.esc(modulos)}</span><span class="cc-txt">Módulos de estudio</span></div>
          <div class="cc cc-verde"><span class="cc-num">${A.esc(temas)}</span><span class="cc-txt">Temas de evaluación</span></div>
          <div class="cc cc-amarillo"><span class="cc-num">${A.esc(preguntas)}</span><span class="cc-txt">Preguntas</span></div>
          <div class="cc cc-cian"><span class="cc-num">${A.esc(horas)} h</span><span class="cc-txt">Duración total</span></div>
        </div>

        <h2 class="admin-seccion">Actividad de los participantes</h2>
        <div class="datos-curso" style="margin:.6rem 0 1rem">
          <div class="dato"><strong>${total}</strong><span>Participantes</span></div>
          <div class="dato"><strong>${(datos && datos.aprobados) || 0}</strong><span>Protocolos aprobados</span></div>
          <div class="dato"><strong>${(datos && datos.intentos) || 0}</strong><span>Intentos totales</span></div>
          <div class="dato"><strong>${A.esc(minutos((datos && datos.tiempoTotal) || 0))}</strong><span>Tiempo de estudio</span></div>
        </div>

        <div class="admin-filtros">
          <div class="campo campo-ancho">
            <label for="buscarAdmin">Buscar por nombre, correo o cargo</label>
            <input type="search" id="buscarAdmin" value="${A.esc(estado.q)}" placeholder="Escribe para filtrar…">
          </div>
          ${filtro("fSede", "Sede", opciones("sede"), estado.sede)}
          ${filtro("fCargo", "Cargo", opciones("cargo"), estado.cargo)}
          ${filtro("fEstado", "Estado", ESTADOS, estado.estado)}
          <div class="campo">
            <label for="fProtocolo">Aprobó el protocolo</label>
            <select id="fProtocolo">
              <option value="">Todos</option>
              ${(C.protocolos || []).map((pr) => `<option value="${A.esc(pr.id)}"${estado.protocolo === pr.id ? " selected" : ""}>${A.esc(pr.nombre)}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="admin-lista-cabecera">
          <p class="texto-peq texto-suave" style="margin:0">
            Mostrando <strong id="cuentaVisibles">${visibles}</strong> de ${total} personas.
            El Excel sale con estos mismos filtros.
          </p>
          <div class="admin-vistas" role="group" aria-label="Forma de ver la lista">
            <button type="button" class="btn btn-mini${estado.vista === "tabla" ? " btn-activo" : ""}" data-vista="tabla">Tabla</button>
            <button type="button" class="btn btn-mini${estado.vista === "tarjetas" ? " btn-activo" : ""}" data-vista="tarjetas">Tarjetas</button>
            <button type="button" class="btn btn-mini" id="btnLimpiar">Limpiar filtros</button>
          </div>
        </div>
      </div>

      <div class="tarjeta">
        <h2>Participantes</h2>
        <div id="listaAdmin"></div>
      </div>

      ${seccionClave()}`;

    /* ---- eventos ---- */
    document.getElementById("btnSalirAdmin").addEventListener("click", function () {
      guardarToken(null);
      pintarAcceso();
    });

    const excel = document.getElementById("btnExcel");
    excel.addEventListener("click", function () {
      excel.disabled = true;
      try {
        descargarExcel();
      } finally {
        excel.disabled = false;
      }
    });

    document.getElementById("btnLimpiar").addEventListener("click", function () {
      estado.q = ""; estado.sede = ""; estado.cargo = "";
      estado.estado = ""; estado.protocolo = "";
      pintar();
    });

    ["fSede", "fCargo", "fEstado", "fProtocolo"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", function (ev) {
        estado[id.replace("f", "").toLowerCase()] = ev.target.value;
        pintarLista();
      });
    });

    const buscar = document.getElementById("buscarAdmin");
    let reloj;
    buscar.addEventListener("input", function () {
      estado.q = buscar.value.trim();
      /* Se espera a que dejes de escribir: con 200 personas no hace falta
         repintar en cada tecla. */
      clearTimeout(reloj);
      reloj = setTimeout(pintarLista, 180);
    });

    A.$$("[data-vista]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        estado.vista = btn.getAttribute("data-vista");
        pintar();
      });
    });

    const formClave = document.getElementById("formClave");
    if (formClave) formClave.addEventListener("submit", cambiarClave);

    pintarLista();
  }

  /* ------------------------------------------------------------------ */
  /* Lista: tabla o tarjetas                                             */
  /* ------------------------------------------------------------------ */
  function pintarLista() {
    const zona = document.getElementById("listaAdmin");
    if (!zona) return;
    const filas = filtrar();
    const cuenta = document.getElementById("cuentaVisibles");
    if (cuenta) cuenta.textContent = filas.length;

    if (!filas.length) {
      zona.innerHTML = '<div class="vacio">No hay participantes que cumplan estos filtros.</div>';
      return;
    }

    zona.innerHTML = estado.vista === "tarjetas" ? tablaTarjetas(filas) : tablaDatos(filas);

    /* Los eventos se enganchan aquí y no en pintar(): la lista se repinta
       con cada filtro, así que volver a engancharlos en otro sitio los
       dejaría duplicados. */

    /* Los eventos de orden y de borrado se delegan desde el contenedor,
       porque la lista se repinta con cada filtro. */
    A.$$("[data-orden]", zona).forEach(function (th) {
      th.addEventListener("click", function () {
        const col = th.getAttribute("data-orden");
        if (estado.orden.col === col) estado.orden.dir = -estado.orden.dir;
        else estado.orden = { col: col, dir: 1 };
        pintarLista();
      });
    });
    A.$$("[data-borrar]", zona).forEach(function (btn) {
      btn.addEventListener("click", function () { confirmarBorrado(btn); });
    });
  }

  function tablaDatos(filas) {
    const flecha = (id) => estado.orden.col === id ? (estado.orden.dir > 0 ? " ▲" : " ▼") : "";

    const cab = COLUMNAS.map((c) => `
      <th data-orden="${c.id}" class="${c.num ? "celda-centro" : ""}" title="Ordenar por ${A.esc(c.txt.toLowerCase())}">
        ${A.esc(c.txt)}${flecha(c.id)}
      </th>`).join("");

    const cuerpo = filas.map((p) => {
      const est = estadoInfo(estadoDe(p));
      const prots = (p.protocolos || []).map((x) => `${A.esc(x.nombre)} ${x.mejor}%`).join(" · ") || "—";
      return `<tr class="admin-fila">
        <td>
          <span class="af-nombre">${A.esc(p.nombre || "(sin nombre)")}</span>
          <span class="af-correo">${A.esc(p.correo)}</span>
        </td>
        <td>${A.esc(p.sede || "—")}</td>
        <td>${A.esc(p.cargo || "—")}</td>
        <td class="celda-centro"><span class="pill-est ${est.pill}">${A.esc(est.txt)}</span></td>
        <td class="celda-centro"><strong>${p.aprobados || 0}</strong>/${p.totalProtocolos || 0}</td>
        <td class="celda-centro celda-ancho">
          ${barra(p.avanceLectura)} ${Math.round(p.avanceLectura) || 0}%
        </td>
        <td class="celda-centro">${A.esc(minutos(p.tiempoTotal))}</td>
        <td class="celda-centro">${A.esc(fechaCorta(ultimoAvance(p)))}</td>
        <td class="texto-peq">${prots}</td>
        <td class="celda-centro">
          <button type="button" class="btn btn-mini btn-mal" data-borrar="${A.esc(p.correo)}">Borrar</button>
        </td>
      </tr>`;
    }).join("");

    return `
      <div class="tabla-envoltura">
        <table class="datos tabla-admin">
          <thead><tr>${cab}<th class="celda-centro">Notas</th><th class="celda-centro">Avance</th></tr></thead>
          <tbody>${cuerpo}</tbody>
        </table>
      </div>
      <p class="texto-peq texto-suave">
        Pasa el cursor por el encabezado para cambiar el orden.
      </p>`;
  }

  /* La vista de tarjetas se conserva: sirve para leer el detalle de una persona. */
  function tablaTarjetas(filas) {
    return filas.map(function (p) {
      const est = estadoInfo(estadoDe(p));
      const modulos = (p.modulos || []).map((m) => {
        const pct = m.total ? Math.round((m.hechas / m.total) * 100) : 0;
        return `<tr>
          <td>${m.numero}. ${A.esc(m.titulo)}</td>
          <td class="celda-centro">${m.hechas}/${m.total}</td>
          <td class="celda-ancho">${barra(pct)}</td>
          <td class="celda-centro">${m.completo ? "✓" : "—"}</td>
          <td class="celda-centro">${A.esc(minutos(m.tiempo))}</td>
        </tr>`;
      }).join("");

      const protos = (p.protocolos || []).map((x) => `<span class="pill-est ${x.aprobado ? "pill-ok" : "pill-neutro"}">
          ${A.esc(x.nombre)} · mejor ${x.mejor}% · último ${x.ultimo}% (intento ${x.ultimoIntento})</span>`).join(" ");

      return `
        <details class="admin-persona">
          <summary>
            <span class="ap-nombre">${A.esc(p.nombre || "(sin nombre)")}</span>
            <span class="ap-correo">${A.esc(p.correo)}</span>
            <span class="ap-datos">${A.esc(p.sede || "—")} · ${A.esc(p.cargo || "—")}</span>
            <span class="ap-estado"><span class="pill-est ${est.pill}">${A.esc(est.txt)}</span></span>
            <span class="ap-tiempo">${A.esc(minutos(p.tiempoTotal))}</span>
          </summary>
          <div class="admin-detalle">
            <p class="texto-peq texto-suave">
              <b>${Math.round(p.avanceLectura) || 0} % lectura</b> ·
              <b>${p.aprobados || 0}/${p.totalProtocolos || 0} aprobados</b>
            </p>
            <p class="texto-peq texto-suave">
              ${p.dependencia ? "<b>Dónde trabaja:</b> " + A.esc(p.dependencia) + "<br>" : ""}
              ${p.profesion ? "<b>A qué se dedica:</b> " + A.esc(p.profesion) + "<br>" : ""}
              ${p.telefono ? "<b>Teléfono:</b> " + A.esc(p.telefono) + "<br>" : ""}
              ${p.horario ? "<b>Horario:</b> " + A.esc(p.horario) + "<br>" : ""}
              ${p.observaciones ? "<b>Observaciones:</b> " + A.esc(p.observaciones) : ""}
            </p>
            <div class="admin-protocolos">${protos || '<span class="texto-peq texto-suave">Sin evaluaciones todavía.</span>'}</div>
            <table class="datos tabla-envoltura">
              <thead><tr>
                <th>Módulo</th><th>Secciones</th><th>Avance</th><th>Completo</th><th>Tiempo</th>
              </tr></thead>
              <tbody>${modulos || '<tr><td colspan="5" class="texto-suave">Sin módulos registrados.</td></tr>'}</tbody>
            </table>
            <div class="admin-acciones">
              <button type="button" class="btn btn-borde btn-mal" data-borrar="${A.esc(p.correo)}">
                Borrar todo el progreso de esta persona
              </button>
            </div>
          </div>
        </details>`;
    }).join("");
  }

  async function confirmarBorrado(btn) {
    const correo = btn.getAttribute("data-borrar");
    const original = btn.textContent;

    if (btn.dataset.confirmar !== "1") {
      btn.dataset.confirmar = "1";
      btn.textContent = "¿Confirmar? Se borrará todo su avance";
      setTimeout(function () {
        if (btn.dataset.confirmar === "1") {
          btn.dataset.confirmar = "";
          btn.textContent = original;
        }
      }, 6000);
      return;
    }

    btn.disabled = true;
    btn.textContent = "Borrando…";
    const r = await A.Remoto.adminBorrarProgreso(token, correo);
    btn.disabled = false;

    if (!r || r.ok !== true) {
      btn.dataset.confirmar = "";
      btn.textContent = original;
      A.aviso(explicar(r, "No se pudo borrar."), "error", 9000);
      return;
    }
    A.aviso("Progreso de " + correo + " borrado.", "ok");
    cargar();
  }

  /* ------------------------------------------------------------------ */
  /* Exportar a Excel                                                    */
  /* ------------------------------------------------------------------ */
  function descargarExcel() {
    if (!window.XLSX) {
      A.aviso("No se cargó el generador de Excel (assets/js/xlsx.js).", "error", 9000);
      return;
    }
    const filas = filtrar();
    const cuenta = document.getElementById("cuentaVisibles");
    if (cuenta) cuenta.textContent = filas.length;
    if (!filas.length) {
      A.aviso("No hay participantes con esos filtros, así que no hay nada que exportar.", "error");
      return;
    }

    /* 1) Una fila por persona. */
    const personas = [["Correo", "Nombre", "Sede", "Cargo", "Dependencia", "Se dedica a",
      "Teléfono", "Horario", "Observaciones", "Fecha de registro", "Estado",
      "Avance de lectura (%)", "Protocolos aprobados", "Tiempo (segundos)", "Última actividad"]];

    filas.forEach((p) => {
      personas.push([
        p.correo, p.nombre || "", p.sede || "", p.cargo || "", p.dependencia || "",
        p.profesion || "", p.telefono || "", p.horario || "", p.observaciones || "",
        p.fechaRegistro || "", estadoInfo(estadoDe(p)).txt,
        Number(p.avanceLectura) || 0, Number(p.aprobados) || 0,
        Number(p.tiempoTotal) || 0, fechaCorta(ultimoAvance(p)),
      ]);
    });

    /* 2) Una fila por intento de protocolo: es la hoja donde se ven las notas. */
    const notas = [["Correo", "Nombre", "Protocolo", "Intentos", "Mejor %", "Último %", "Aprobado"]];
    filas.forEach((p) => {
      (p.protocolos || []).forEach((x) => {
        notas.push([p.correo, p.nombre || "", x.nombre, Number(x.intentos) || 0,
          Number(x.mejor) || 0, Number(x.ultimo) || 0, x.aprobado ? "Sí" : "No"]);
      });
    });

    /* 3) Una fila por módulo leído. */
    const avance = [["Correo", "Nombre", "Módulo", "Título del módulo", "Secciones leídas",
      "Secciones totales", "¿Completo?", "Tiempo (segundos)", "Última actividad"]];
    filas.forEach((p) => {
      (p.modulos || []).forEach((m) => {
        avance.push([p.correo, p.nombre || "", m.numero, m.titulo || "",
          Number(m.hechas) || 0, Number(m.total) || 0, m.completo ? "Sí" : "No",
          Number(m.tiempo) || 0, fechaCorta(Date.parse(m.actualizado || "") || 0)]);
      });
    });

    window.XLSX.descargar("participantes-campus", [
      { nombre: "Participantes", filas: personas, anchos: [26, 24, 22, 18, 20, 18, 14, 14, 24, 16, 20, 12, 12, 12, 16] },
      { nombre: "Notas por protocolo", filas: notas, anchos: [26, 24, 22, 10, 10, 10, 10] },
      { nombre: "Avance por módulo", filas: avance, anchos: [26, 24, 9, 34, 14, 14, 12, 14, 16] },
    ]);

    A.aviso("Excel descargado con " + filas.length + " personas y los filtros actuales.", "ok", 6000);
  }

  /* ------------------------------------------------------------------ */
  /* Cambiar la contraseña maestra                                        */
  /* ------------------------------------------------------------------ */
  function seccionClave() {
    return `
      <div class="tarjeta">
        <details class="admin-seguridad">
          <summary><b>Cambiar la contraseña de este panel</b> <span class="texto-peq texto-suave">(opcional)</span></summary>
          <p class="texto-peq texto-suave">
            La contraseña no está escrita en el sitio: se guarda en las propiedades del
            proyecto de Google Apps Script. Al cambiarla desde aquí te quedarás fuera
            de este equipo.
          </p>
          <p class="texto-peq texto-suave">
            Mientras no se actualice el despliegue en Apps Script, el botón te avisará
            que falta hacerlo. Puedes seguir entrando con la contraseña de siempre.
          </p>
          <form id="formClave" novalidate>
            <div class="campo">
              <label for="claveActual">Contraseña actual</label>
              <input type="password" id="claveActual" autocomplete="current-password" required>
            </div>
            <div class="admin-filtros">
              <div class="campo">
                <label for="claveNueva">Nueva contraseña</label>
                <input type="password" id="claveNueva" autocomplete="new-password" minlength="8" required>
              </div>
              <div class="campo">
                <label for="claveRepetir">Repetir la nueva</label>
                <input type="password" id="claveRepetir" autocomplete="new-password" minlength="8" required>
              </div>
            </div>
            <button type="submit" class="btn">Guardar contraseña</button>
            <p class="texto-peq texto-suave">Mínimo 8 caracteres.</p>
          </form>
        </details>
      </div>`;
  }

  async function cambiarClave(ev) {
    ev.preventDefault();
    const btn = ev.target.querySelector('button[type="submit"]');
    const actual = document.getElementById("claveActual").value;
    const nueva = document.getElementById("claveNueva").value;
    const repetir = document.getElementById("claveRepetir").value;

    btn.disabled = true;
    btn.textContent = "Guardando…";
    const r = await A.Remoto.adminCambiarClave(token, actual, nueva, repetir);
    btn.disabled = false;
    btn.textContent = "Guardar contraseña";

    if (!r || r.ok !== true) {
      /* El servidor devuelve "error" (no "mensaje") cuando todavía no
         conoce esta función: pasa hasta que se actualice el despliegue
         en Apps Script. Se avisa de eso y no del fallo en sí. */
      if (r && r.error && !r.mensaje) {
        A.aviso("El servidor todavía no tiene esta función. Hay que actualizar "
          + "el despliegue en Google Apps Script y recargar esta página.", "error", 11000);
        return;
      }
      A.aviso(explicar(r, "No se pudo cambiar la contraseña."), "error", 9000);
      return;
    }
    ev.target.reset();
    A.aviso(r.mensaje || "Contraseña actualizada.", "ok", 8000);
  }

  /* Traduce la respuesta del servidor a algo que un administrador pueda
     entender. Un error técnico del backend no se esconde detrás de
     "la sesión expiró". */
  function explicar(r, porDefecto) {
    if (!r) return porDefecto;
    if (r.mensaje) return r.mensaje;
    if (r.error) {
      if (/getSpreadsheet is not a function/i.test(r.error)) {
        return "El backend desplegado tiene una versión vieja. Vuelve a copiar "
          + "apps-script/Code.gs en script.google.com y crea una implementación "
          + "nueva (Implementar → Nueva implementación → Aplicación web).";
      }
      return "El servidor devolvió un error: " + r.error;
    }
    return porDefecto;
  }

  async function cargar() {
    if (!token) return pintarAcceso();
    const r = await A.Remoto.adminProgreso(token);
    if (!r || r.ok !== true) {
      guardarToken(null);
      return pintarAcceso(explicar(r, "La sesión expiró. Vuelve a entrar."));
    }
    datos = r;
    pintar();
  }

  token = leerToken();
  if (token) cargar(); else pintarAcceso();
})();