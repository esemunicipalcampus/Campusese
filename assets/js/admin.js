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
        + "y appsScriptUrl. La contraseña 130004708 es la del backend: solo empieza "
        + "a funcionar cuando el Apps Script esté desplegado.";
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

  function pintar() {
    const filas = (datos && datos.participantes) || [];

    /* Cifras reales del curso, leidas de la misma fuente que usa el sitio.
       No van escritas a mano para que no se desactualicen. */
    const protocolos = (C.protocolos || []).length;
    const modulos = (window.CURSO && window.CURSO.modulos) ? window.CURSO.modulos.length : 0;
    const temas = window.TEMAS ? window.TEMAS.length : 0;
    const preguntas = window.BancoPreguntas ? window.BancoPreguntas.total() : 0;
    const horas = (C.protocolos || []).reduce((s, p) => s + Number(p.horas || 0), 0);

    const contenido = `
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
        <div class="dato"><strong>${filas.length}</strong><span>Participantes</span></div>
        <div class="dato"><strong>${(datos && datos.aprobados) || 0}</strong><span>Protocolos aprobados</span></div>
        <div class="dato"><strong>${(datos && datos.intentos) || 0}</strong><span>Intentos totales</span></div>
        <div class="dato"><strong>${A.esc(minutos((datos && datos.tiempoTotal) || 0))}</strong><span>Tiempo de estudio</span></div>
      </div>`;

    const cuerpo = filas.length ? filas.map(function (p) {
      const modulos = (p.modulos || []).map(function (m) {
        const pct = m.total ? Math.round((m.hechas / m.total) * 100) : 0;
        return `<tr>
          <td>${m.numero}. ${A.esc(m.titulo)}</td>
          <td class="celda-centro">${m.hechas}/${m.total}</td>
          <td class="celda-ancho">${barra(pct)}</td>
          <td class="celda-centro">${m.completo ? "✓" : "—"}</td>
          <td class="celda-centro">${A.esc(minutos(m.tiempo))}</td>
        </tr>`;
      }).join("");

      const protos = (p.protocolos || []).map(function (x) {
        return `<span class="pill-est ${x.aprobado ? "pill-ok" : "pill-neutro"}">
          ${A.esc(x.nombre)} · mejor ${x.mejor}% · último ${x.ultimo}% (intento ${x.ultimoIntento})</span>`;
      }).join(" ");

      return `
        <details class="admin-persona">
          <summary>
            <span class="ap-nombre">${A.esc(p.nombre || "(sin nombre)")}</span>
            <span class="ap-correo">${A.esc(p.correo)}</span>
            <span class="ap-datos">${A.esc(p.sede || "—")} · ${A.esc(p.cargo || "—")}</span>
            <span class="ap-avance">${barra(p.avanceLectura)} ${Math.round(p.avanceLectura) || 0}% lectura</span>
            <span class="ap-estado">${p.aprobados}/${p.totalProtocolos} aprobados${p.pendientes ? " · " + p.pendientes + " sin evaluar" : ""}</span>
            <span class="ap-tiempo">${A.esc(minutos(p.tiempoTotal))}</span>
          </summary>
          <div class="admin-detalle">
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
    }).join("")
      : '<div class="vacio">Todavía no hay participantes en el registro.</div>';

    cont.innerHTML = `
      <div class="tarjeta">
        <div class="fila-top" style="justify-content:space-between;align-items:center">
          <h1 style="margin:0">Panel administrativo</h1>
          <button type="button" class="btn btn-borde" id="btnSalirAdmin">Salir</button>
        </div>
        ${contenido}
        <div class="campo">
          <label for="buscarAdmin">Buscar por nombre, correo o cargo</label>
          <input type="search" id="buscarAdmin" placeholder="Escribe para filtrar…">
        </div>
      </div>

      <div class="tarjeta">
        <h2>Participantes</h2>
        <div id="listaAdmin">${cuerpo}</div>
      </div>`;

    document.getElementById("btnSalirAdmin").addEventListener("click", function () {
      guardarToken(null);
      pintarAcceso();
    });

    const buscar = document.getElementById("buscarAdmin");
    buscar.addEventListener("input", function () {
      const q = buscar.value.trim().toLowerCase();
      A.$$(".admin-persona").forEach(function (el) {
        el.style.display = !q || el.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });

    A.$$('[data-borrar]').forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const correo = btn.getAttribute("data-borrar");

        // Confirmación en dos pasos, sin ventanas del navegador.
        if (btn.dataset.confirmar !== "1") {
          btn.dataset.confirmar = "1";
          btn.textContent = "¿Confirmar? Se borrará todo su avance";
          return;
        }

        btn.disabled = true;
        btn.textContent = "Borrando…";
        const r = await A.Remoto.adminBorrarProgreso(token, correo);
        btn.disabled = false;

        if (!r || r.ok !== true) {
          btn.dataset.confirmar = "";
          btn.textContent = "Borrar todo el progreso de esta persona";
          A.aviso(explicar(r, "No se pudo borrar."), "error", 9000);
          return;
        }
        A.aviso("Progreso de " + correo + " borrado.", "ok");
        cargar();
      });
    });
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