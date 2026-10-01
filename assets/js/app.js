/* =========================================================================
 * NÚCLEO DEL APLICATIVO
 * Autenticación con Google (Google Identity Services), registro, resultados
 * y utilidades compartidas por todas las páginas.
 * =========================================================================
 */

(function () {
  "use strict";

  const C = window.CONFIG;
  const CLAVES = C.claves;

  /* ====================================================================
   * Utilidades generales
   * ================================================================= */

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));

  function esc(texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function fechaLarga(d) {
    const f = d instanceof Date ? d : new Date(d);
    return f.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  }

  function fechaCorta(d) {
    const f = d instanceof Date ? d : new Date(d);
    return f.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function conHora(d) {
    const f = d instanceof Date ? d : new Date(d);
    return (
      fechaLarga(f) + " — " +
      f.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
    );
  }

  /** Hash simple (FNV-1a de 32 bits) → sirve para derivar códigos de certificado. */
  function hash(texto) {
    let h = 0x811c9dc5;
    for (let i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function iso(d) {
    const f = d instanceof Date ? d : new Date(d);
    return f.toISOString();
  }

  /* ====================================================================
   * Almacenamiento local
   * ================================================================= */

  const BD = {
    leer(clave, alterno) {
      try {
        const bruto = localStorage.getItem(clave);
        return bruto ? JSON.parse(bruto) : alterno;
      } catch (e) {
        console.warn("BD.leer error", e);
        return alterno;
      }
    },
    escribir(clave, valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (e) {
        console.warn("BD.escribir error", e);
        return false;
      }
    },
    borrar(clave) {
      try { localStorage.removeItem(clave); } catch (e) { /* noop */ }
    },
  };

  /* Registro de participantes: objeto { correo: {datos} } */
  function obtenerRegistro() { return BD.leer(CLAVES.registro, {}) || {}; }
  function guardarRegistro(correo, datos) {
    const reg = obtenerRegistro();
    reg[correo] = Object.assign({}, reg[correo], datos, { correo, actualizado: iso(new Date()) });
    BD.escribir(CLAVES.registro, reg);
    return reg[correo];
  }
  function leerRegistro(correo) { return obtenerRegistro()[correo] || null; }
  function estaRegistrado(correo) { return !!leerRegistro(correo); }

  /* Resultados: arreglo de intentos */
  function obtenerResultados(correo) {
    const todos = BD.leer(CLAVES.resultados, []) || [];
    if (!correo) return todos;
    return todos.filter(r => r.correo === correo);
  }
  function guardarResultado(correo, registro) {
    // Importante: se parte del arreglo COMPLETO, no del filtrado por correo,
    // de lo contrario se borrarían los intentos de los demás participantes.
    const todos = BD.leer(CLAVES.resultados, []) || [];
    const nuevo = Object.assign({ correo }, registro);
    todos.push(nuevo);
    BD.escribir(CLAVES.resultados, todos);
    return nuevo;
  }

  /* Progreso de lectura por módulo */
  function obtenerProgreso(correo) {
    return BD.leer("ese_progreso_" + correo, {}) || {};
  }
  function marcarModuloLeido(correo, numeroModulo) {
    if (!correo) return;
    const p = obtenerProgreso(correo);
    p[numeroModulo] = { leido: true, fecha: iso(new Date()) };
    BD.escribir("ese_progreso_" + correo, p);
  }
  function modulosLeidos(correo) {
    const p = obtenerProgreso(correo);
    return Object.keys(p).filter(k => p[k] && p[k].leido).map(Number);
  }

  /* ====================================================================
   * Código de certificado
   * ================================================================= */
  function generarCodigo(correo, resultado) {
    const base = [correo, resultado.puntaje, resultado.total, resultado.fecha].join("|");
    const n = (hash(base) % 1000000).toString().padStart(6, "0");
    const anio = new Date(resultado.fecha).getFullYear();
    return C.certificado.prefijoCodigo + "-" + anio + "-" + n;
  }

  /* ====================================================================
   * Envío al backend (Google Apps Script) — opcional
   * ================================================================= */
  const Remoto = {
    habilitado() {
      return C.almacenamiento === "sheet" && !!C.appsScriptUrl;
    },

    async enviar(accion, payload) {
      if (!this.habilitado()) return { ok: false, motivo: "deshabilitado" };
      try {
        const res = await fetch(C.appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ accion, clave: C.appsScriptSecret, datos: payload }),
          redirect: "follow",
        });
        const texto = await res.text();
        try { return JSON.parse(texto); } catch (e) { return { ok: res.ok, bruto: texto }; }
      } catch (e) {
        console.warn("Remoto.enviar error", e);
        return { ok: false, motivo: String(e) };
      }
    },

    registrarParticipante(datos) { return this.enviar("registro", datos); },
    registrarResultado(datos) { return this.enviar("resultado", datos); },
    consultarCodigo(codigo) { return this.enviar("consulta", { codigo }); },
  };

  /* ====================================================================
   * Autenticación con Google
   * ================================================================= */
  const Sesion = {
    usuario: null,

    googleConfigurado() {
      return !!(C.googleClientId && C.googleClientId.trim().length > 20);
    },

    /** ¿Estamos en el navegador de un dominio autorizado para modo demo? */
    esDemoPermitido() {
      const h = location.hostname;
      return (C.demoDominios || []).includes(h);
    },

    modoDemo() {
      return !this.googleConfigurado() && this.esDemoPermitido();
    },

    guardar(u) {
      BD.escribir("ese_sesion", u);
      this.usuario = u;
      return u;
    },

    leer() {
      const u = BD.leer("ese_sesion", null);
      this.usuario = u;
      return u;
    },

    cerrar() {
      BD.borrar("ese_sesion");
      try { localStorage.removeItem("google.credential"); } catch (e) { /* noop */ }
      this.usuario = null;
    },

    /** Renderiza el botón de Google en el elemento indicado. */
    montarBoton(el, callback) {
      if (!el) return;
      if (this.modoDemo()) {
        el.innerHTML =
          '<button type="button" class="btn btn-google" id="btnDemo">' +
          '<span class="g-logo">G</span> Continuar con Google <small>(modo demo)</small></button>';
        $("#btnDemo", el).addEventListener("click", () => {
          const correo = prompt(
            "MODO DEMO — Google Sign-In no está configurado.\n\n" +
            "Escribe un correo de prueba (se guardará solo en este navegador):",
            "participante@esevillavicencio.gov.co"
          );
          if (!correo) return;
          this.guardar({
            correo: correo.trim().toLowerCase(),
            nombre: "Participante (demo)",
            foto: "",
            sub: "demo-" + hash(correo),
            demo: true,
            fecha: iso(new Date()),
          });
          callback && callback(this.usuario);
        });
        return;
      }

      if (!this.googleConfigurado()) {
        el.innerHTML =
          '<div class="aviso aviso-error"><strong>Google Sign-In no configurado.</strong><br>' +
          "Abre <code>assets/js/config.js</code> y pega tu Client ID de OAuth " +
          "(<code>...apps.googleusercontent.com</code>).<br>" +
          "<small>El acceso está deshabilitado hasta configurarlo.</small></div>";
        return;
      }

      /* Carga diferida de la librería de Google Identity Services */
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = () => {
        try {
          google.accounts.id.initialize({
            client_id: C.googleClientId.trim(),
            callback: (respuesta) => {
              try {
                const payload = JSON.parse(atob(respuesta.credential.split(".")[1]));
                this.guardar({
                  correo: (payload.email || "").toLowerCase(),
                  nombre: payload.name || payload.given_name || "Participante",
                  foto: payload.picture || "",
                  emailVerified: payload.email_verified,
                  sub: payload.sub,
                  demo: false,
                  fecha: iso(new Date()),
                });
                callback && callback(this.usuario);
              } catch (e) {
                console.error("No se pudo procesar la respuesta de Google", e);
                alert("Ocurrió un error al procesar tu cuenta de Google. Intenta de nuevo.");
              }
            },
          });
          google.accounts.id.renderButton(el, {
            theme: "outline",
            size: "large",
            shape: "rectangular",
            text: "continue_with",
            width: 320,
            locale: "es",
          });
        } catch (e) {
          console.error(e);
          el.innerHTML = '<div class="aviso aviso-error">No se pudo cargar el botón de Google. Revisa tu Client ID.</div>';
        }
      };
      s.onerror = () => {
        el.innerHTML =
          '<div class="aviso aviso-error">No se pudo cargar la librería de Google. ' +
          "Revisa tu conexión a internet.</div>";
      };
      document.head.appendChild(s);
    },
  };

  /* ====================================================================
   * Encabezado común (navegación + estado de sesión)
   * ================================================================= */
  function pintarEncabezado() {
    const cont = $("#encabezado");
    if (!cont) return;

    const usuario = Sesion.leer();
    const enCurso = location.pathname.endsWith("curso.html") ||
                    location.pathname.endsWith("evaluacion.html") ||
                    location.pathname.endsWith("resultado.html") ||
                    location.pathname.endsWith("certificado.html");

    const enlaces = [
      { href: "curso.html", texto: "Curso" },
      { href: "evaluacion.html", texto: "Evaluación" },
      { href: "certificado.html", texto: "Mi certificado" },
    ];

    let nav = "";
    if (usuario) {
      nav = enlaces
        .map(e => `<a class="nav-enlace ${e.href === paginaActual() ? "activo" : ""}" href="${e.href}">${e.texto}</a>`)
        .join("");
    }

    const identidad = usuario
      ? `<div class="usuario">
           ${usuario.foto ? `<img class="usuario-foto" src="${esc(usuario.foto)}" alt="" referrerpolicy="no-referrer">` : ""}
           <div class="usuario-datos">
             <strong>${esc(usuario.nombre)}</strong>
             <span>${esc(usuario.correo)}</span>
           </div>
           <button type="button" class="btn btn-salir" id="btnSalir">Salir</button>
         </div>`
      : `<span class="sesion-vacia">Sin sesión iniciada</span>`;

    cont.innerHTML = `
      <div class="marca">
        <img class="logo" src="${C.entidadSalud.logo}" alt="${esc(C.entidadSalud.sigla)}">
        <img class="separador" src="assets/img/separador.svg" alt="" aria-hidden="true">
        <img class="logo" src="${C.entidadAcademica.logo}" alt="${esc(C.entidadAcademica.sigla)}">
        <div class="marca-textos">
          <strong>${esc(C.entidadSalud.sigla)} <span class="y">×</span> ${esc(C.entidadAcademica.sigla)}</strong>
          <span>${esc(C.curso.titulo)}</span>
        </div>
      </div>
      ${enCurso && usuario ? `<nav class="nav">${nav}</nav>` : ""}
      ${identidad}`;

    const btn = $("#btnSalir");
    if (btn) {
      btn.addEventListener("click", () => {
        Sesion.cerrar();
        location.href = "index.html";
      });
    }
  }

  function paginaActual() {
    const p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  /** Redirige a index.html si no hay sesión. Devuelve el usuario. */
  function exigirSesion() {
    const u = Sesion.leer();
    if (!u) {
      location.replace("index.html?motivo=sesion");
      return null;
    }
    return u;
  }

  /**
   * Redirige a index.html si el participante aún no completó el registro
   * institucional. Se usa en las páginas que ya no deben perder datos.
   */
  function exigirRegistro() {
    const u = exigirSesion();
    if (!u) return null;
    if (!estaRegistrado(u.correo)) {
      location.replace("index.html?motivo=registro");
      return null;
    }
    return u;
  }

  /* ====================================================================
   * Aviso de modo demo (banner global)
   * ================================================================= */
  function bannerDemo() {
    if (!Sesion.modoDemo()) return;
    const b = document.createElement("div");
    b.className = "banner-demo";
    b.innerHTML =
      "<strong>MODO DEMO.</strong> Google Sign-In no está configurado todavía. " +
      "Los datos se guardan solo en este navegador. " +
      'Configura <code>assets/js/config.js</code> para activar el registro real.';
    document.body.prepend(b);
  }

  /* ====================================================================
   * Inicio
   * ================================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    bannerDemo();
    pintarEncabezado();
  });

  /* ====================================================================
   * API pública
   * ================================================================= */
  window.App = {
    $, $$, esc, fechaLarga, fechaCorta, conHora, iso, hash,
    BD, Sesion, Remoto,
    obtenerRegistro, guardarRegistro, leerRegistro, estaRegistrado,
    obtenerResultados, guardarResultado,
    obtenerProgreso, marcarModuloLeido, modulosLeidos,
    generarCodigo,
    pintarEncabezado, exigirSesion, exigirRegistro, paginaActual,
  };
})();
