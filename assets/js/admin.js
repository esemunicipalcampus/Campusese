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
        A.aviso(r && r.mensaje ? r.mensaje : "Contraseña incorrecta.", "error");
        return;
      }
      guardarToken(r.token);
      cargar();
    });
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

    const resumen = `
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
        ${resumen}
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
          A.aviso(r && r.mensaje ? r.mensaje : "No se pudo borrar.", "error");
          return;
        }
        A.aviso("Progreso de " + correo + " borrado.", "ok");
        cargar();
      });
    });
  }

  async function cargar() {
    if (!token) return pintarAcceso();
    const r = await A.Remoto.adminProgreso(token);
    if (!r || r.ok !== true) {
      guardarToken(null);
      return pintarAcceso(r && r.mensaje ? r.mensaje : "La sesión expiró. Vuelve a entrar.");
    }
    datos = r;
    pintar();
  }

  token = leerToken();
  if (token) cargar(); else pintarAcceso();
})();