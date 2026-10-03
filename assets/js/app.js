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

  /* ---------------------------------------------------------------------
   * Registro de participantes: objeto { correo: {datos} }
   *
   * La persona NO vuelve a escribir sus datos: se toma lo que entrega
   * Google (nombre y correo verificado) y solo se le pide UNA vez elegir
   * su sede y su cargo, que se guardan aquí para siempre.
   * ------------------------------------------------------------------- */
  function obtenerRegistro() { return BD.leer(CLAVES.registro, {}) || {}; }
  function guardarRegistro(correo, datos) {
    const reg = obtenerRegistro();
    const anterior = reg[correo] || {};
    reg[correo] = Object.assign({}, anterior, datos, {
      correo,
      creado: anterior.creado || iso(new Date()),
      actualizado: iso(new Date()),
    });
    BD.escribir(CLAVES.registro, reg);
    return reg[correo];
  }
  function leerRegistro(correo) { return obtenerRegistro()[correo] || null; }
  function estaRegistrado(correo) { return !!leerRegistro(correo); }

  /**
   * Registra a la persona automáticamente con los datos de Google y le
   * asigna sede/cargo si todavía no los ha elegido. No pide ningún dato:
   * solo deja lista la ficha la primera vez.
   */
  function registrarDesdeGoogle(usuario) {
    if (!usuario || !usuario.correo) return null;
    const previo = leerRegistro(usuario.correo) || {};
    const sede = previo.sede || (C.sedes && C.sedes[0]) || "";
    const cargo = previo.cargo || "";
    return guardarRegistro(usuario.correo, {
      nombre: usuario.nombre || previo.nombre || "Participante",
      correo: usuario.correo,
      correoVerificado: usuario.emailVerified !== false,
      foto: usuario.foto || previo.foto || "",
      sede: sede,
      cargo: cargo,
      origen: previo.origen || "google",
    });
  }

  /** ¿La ficha ya tiene sede y cargo confirmados? */
  function perfilCompleto(correo) {
    const r = leerRegistro(correo);
    return !!(r && r.sede && r.cargo);
  }

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

  /* Progreso de lectura: sección por sección, y tiempo en cada módulo */
  /* El progreso vive en memoria mientras la página está abierta y se vuelca a
   localStorage. Sin esta caché, BD.leer devuelve una copia nueva en cada
   llamada y el cronómetro y las secciones se pisarían entre sí. */
  const progresoEnMemoria = {};

  function obtenerProgreso(correo) {
    if (progresoEnMemoria[correo]) return progresoEnMemoria[correo];
    progresoEnMemoria[correo] = BD.leer("ese_progreso_" + correo, {}) || {};
    return progresoEnMemoria[correo];
  }

  function guardarProgreso(correo) {
    const p = obtenerProgreso(correo);
    BD.escribir("ese_progreso_" + correo, p);
    return p;
  }

  /** Olvida la copia en memoria (tras un borrado). */
  function olvidarProgreso(correo) {
    delete progresoEnMemoria[correo];
  }

  /** Módulo completo = todas sus secciones marcadas como realizadas. */
  function asegurarModulo(correo, numeroModulo) {
    const p = obtenerProgreso(correo);
    if (!p[numeroModulo]) p[numeroModulo] = { secciones: [], tiempo: 0, abierto: null };
    guardarProgreso(correo);
    if (!Array.isArray(p[numeroModulo].secciones)) p[numeroModulo].secciones = [];
    if (typeof p[numeroModulo].tiempo !== "number") p[numeroModulo].tiempo = 0;
    return p[numeroModulo];
  }

  function marcarModuloLeido(correo, numeroModulo) {
    if (!correo) return;
    const p = obtenerProgreso(correo);
    p[numeroModulo].leido = true;
    p[numeroModulo].fecha = iso(new Date());
    guardarProgreso(correo);
  }

  /** Índices de las secciones ya realizadas de un módulo. */
  function seccionesHechas(correo, numeroModulo) {
    const p = obtenerProgreso(correo);
    const m = p[numeroModulo];
    if (!m) return [];
    if (Array.isArray(m.secciones)) return m.secciones.slice();
    return m.leido ? [0] : [];
  }

  /** Marca una sección como realizada (idempotente). */
  function marcarSeccionLeida(correo, numeroModulo, indice) {
    if (!correo) return seccionesHechas(correo, numeroModulo);
    const m = asegurarModulo(correo, numeroModulo);
    if (!m.secciones.includes(indice)) {
      m.secciones.push(indice);
      m.secciones.sort(function (a, b) { return a - b; });
      m.fecha = iso(new Date());
      guardarProgreso(correo);
      enviarProgreso(correo, numeroModulo);
    }
    return m.secciones;
  }

  /** ¿Están realizadas todas las secciones de este módulo? */
  function moduloCompleto(correo, numeroModulo, totalSecciones) {
    const total = Number(totalSecciones || 0);
    if (!total) return true;
    const hechas = seccionesHechas(correo, numeroModulo);
    for (let i = 0; i < total; i++) if (!hechas.includes(i)) return false;
    return true;
  }

  /** Lista de módulos del protocolo con su estado de lectura. */
  function estadoModulos(correo, idProtocolo) {
    const p = protocolo(idProtocolo);
    if (!p) return [];
    return (p.modulos || []).map(function (n) {
      const mod = window.ContenidoCurso ? window.ContenidoCurso.porNumero(n) : null;
      const total = mod ? (mod.secciones || []).length : 0;
      const hechas = seccionesHechas(correo, n);
      return {
        numero: n,
        titulo: mod ? mod.titulo : "Módulo " + n,
        total: total,
        hechas: hechas.length,
        completo: moduloCompleto(correo, n, total),
        tiempo: tiempoModulo(correo, n),
      };
    });
  }

  /** ¿Se puede abrir la evaluación de este protocolo? */
  function evaluacionHabilitada(correo, idProtocolo) {
    const est = estadoModulos(correo, idProtocolo);
    return est.length > 0 && est.every(function (m) { return m.completo; });
  }

  function modulosLeidos(correo) {
    const p = obtenerProgreso(correo);
    return Object.keys(p)
      .filter(function (k) {
        const m = p[k];
        return m && (m.leido || (Array.isArray(m.secciones) && m.secciones.length > 0));
      })
      .map(Number);
  }

  /* ---------------- Tiempo de estudio por módulo ---------------- */

  function tiempoModulo(correo, numeroModulo) {
    const p = obtenerProgreso(correo);
    const m = p[numeroModulo];
    return m && typeof m.tiempo === "number" ? m.tiempo : 0;
  }

  /** Cronómetro: arranca al abrir el módulo y acumula al salir o cambiar de pestaña. */
  function iniciarCronometro(correo, numeroModulo) {
    if (!correo) return function () { };
    const m = asegurarModulo(correo, numeroModulo);

    function abrir() {
      if (m.abierto) return;
      m.abierto = Date.now();
      guardarProgreso(correo);
    }

    function cerrar() {
      if (!m.abierto) return;
      const segundos = Math.round((Date.now() - m.abierto) / 1000);
      m.abierto = null;
      if (segundos > 0 && segundos < 6 * 3600) {
        m.tiempo = (m.tiempo || 0) + segundos;
        guardarProgreso(correo);
        Remoto.registrarTiempo({
          correo: correo,
          modulo: numeroModulo,
          segundos: segundos,
          total: m.tiempo,
        });
      }
    }

    abrir();

    window.addEventListener("pagehide", cerrar);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") cerrar();
      else abrir();
    });
    return cerrar;
  }

  /** Envía el avance de lectura de un módulo al registro central. */
  function enviarProgreso(correo, numeroModulo) {
    const mod = window.ContenidoCurso ? window.ContenidoCurso.porNumero(numeroModulo) : null;
    const m = obtenerProgreso(correo)[numeroModulo] || {};
    Remoto.registrarProgreso({
      correo: correo,
      modulo: numeroModulo,
      titulo: mod ? mod.titulo : "Módulo " + numeroModulo,
      secciones: m.secciones || [],
      totalSecciones: mod ? (mod.secciones || []).length : 0,
      tiempo: m.tiempo || 0,
      fecha: iso(new Date()),
    });
  }

  /** Protocolo al que pertenece un módulo, por número. */
  function protocoloDeModulo(numeroModulo) {
    const mod = window.ContenidoCurso ? window.ContenidoCurso.porNumero(numeroModulo) : null;
    if (mod && mod.protocolo) return mod.protocolo;
    const p = protocolos().find(function (x) {
      return (x.modulos || []).indexOf(Number(numeroModulo)) >= 0;
    });
    return p ? p.id : "";
  }

  /* ====================================================================
   * Protocolos
   * ================================================================= */

  /** Lista de protocolos desde la configuración. */
  function protocolos() {
    return C.protocolos || [];
  }

  /** Busca un protocolo por su id. */
  function protocolo(id) {
    return protocolos().find(function (p) { return p.id === id; }) || null;
  }

  /** Protocolo al que pertenece un tema del banco de preguntas. */
  function protocoloDeTema(temaId) {
    return protocolos().find(function (p) {
      return (p.temas || []).includes(temaId);
    }) || null;
  }

  /** Nº total de preguntas de un protocolo. */
  function totalPreguntasProtocolo(id) {
    const p = protocolo(id);
    if (!p || !window.BancoPreguntas) return 0;
    return window.BancoPreguntas.totalDeTemas(p.temas || []);
  }

  /** Resultados de un participante para un protocolo concreto. */
  function resultadosProtocolo(correo, idProtocolo) {
    return obtenerResultados(correo).filter(function (r) {
      return r.protocolo === idProtocolo;
    });
  }

  /** ¿El participante ya aprobó este protocolo? */
  function aproboProtocolo(correo, idProtocolo) {
    return resultadosProtocolo(correo, idProtocolo).some(function (r) { return r.aprobado; });
  }

  /** Intentos usados en un protocolo. */
  function intentosProtocolo(correo, idProtocolo) {
    return resultadosProtocolo(correo, idProtocolo).length;
  }

  /** Código único por protocolo: ESE-VLL-<ANIO>-<PROTOCOLO>-<NNNNNN> */
  function generarCodigo(correo, resultado) {
    const proto = protocolo(resultado.protocolo);
    const sig = proto
      ? (proto.sigla || proto.id.replace(/[^a-z0-9]/g, "").slice(0, 4).toUpperCase())
      : "PRT";
    const base = [
      correo,
      resultado.protocolo || "",
      resultado.aciertos,
      resultado.total,
      resultado.fecha,
    ].join("|");
    const n = (hash(base) % 1000000).toString().padStart(6, "0");
    const anio = new Date(resultado.fecha).getFullYear();
    return C.codigo.prefijo + "-" + anio + "-" + sig + "-" + n;
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
        return { ok: false, motivo: "sin-red" };
      }
    },

    registrarParticipante(datos) { return this.enviar("registro", datos); },
    registrarResultado(datos) { return this.enviar("resultado", datos); },
    registrarProgreso(datos) { return this.enviar("progreso", datos); },
    registrarTiempo(datos) { return this.enviar("tiempo", datos); },

    /* ---------------- Panel administrativo ----------------
       La contraseña maestra NUNCA viaja incrustada en esta página:
       el backend la compara y devuelve un token de sesión. */

    adminEntrar(clave) { return this.enviar("adminEntrar", { clave: clave }); },
    adminProgreso(token, q) { return this.enviar("adminProgreso", { token: token, q: q || "" }); },
    adminBorrarProgreso(token, correo) {
      return this.enviar("adminBorrar", { token: token, correo: correo });
    },
    /* La contraseña nueva viaja al servidor, que la guarda en las Propiedades
       de secuencia de comandos. Nunca pasa por el repositorio. */
    adminCambiarClave(token, actual, nueva, repetir) {
      return this.enviar("adminCambiarClave", {
        token: token, actual: actual, nueva: nueva, repetir: repetir,
      });
    },

    /**
     * Registro institucional. El código de acceso lo escribe el usuario y
     * lo valida el backend; no está incrustado en esta página.
     */
    async registroAprobados(codigoAcceso, filtros) {
      return this.enviar("registroInterno", {
        codigoAcceso: codigoAcceso,
        protocolo: (filtros && filtros.protocolo) || "",
        desde: (filtros && filtros.desde) || "",
        hasta: (filtros && filtros.hasta) || "",
        q: (filtros && filtros.q) || ""
      });
    },
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
          registrarDesdeGoogle(this.usuario);
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
              /* La ficha se crea sola con los datos de Google: la persona
                   no vuelve a escribir nombre ni correo. */
                registrarDesdeGoogle(this.usuario);
                aviso("Sesión iniciada. Tus datos se toman automáticamente de Google.", "ok");
                callback && callback(this.usuario);
              } catch (e) {
                console.error("No se pudo procesar la respuesta de Google", e);
                aviso("Ocurrió un error al procesar tu cuenta de Google. Intenta de nuevo.", "error");
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
    const enCurso = location.pathname.endsWith("protocolos.html") ||
                    location.pathname.endsWith("modulo.html") ||
                    location.pathname.endsWith("evaluacion.html") ||
                    location.pathname.endsWith("resultado.html") ||
                    location.pathname.endsWith("perfil.html");

    const enlaces = [
      { href: "protocolos.html", texto: "Protocolos" },
      { href: "resultado.html", texto: "Mis resultados" },
      { href: "perfil.html", texto: "Mi perfil" },
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
        <img class="logo logo-ese" src="${C.entidadSalud.logo}" alt="${esc(C.entidadSalud.sigla)}">
        <img class="separador" src="assets/img/separador.svg" alt="" aria-hidden="true">
        <img class="logo logo-unillanos" src="${C.entidadAcademica.logo}" alt="${esc(C.entidadAcademica.sigla)}">
        <div class="marca-textos">
          <strong>${esc(C.entidadSalud.sigla)} <span class="y">×</span> ${esc(C.entidadAcademica.sigla)}</strong>
          <span>${esc(C.programa.titulo)}</span>
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
   * Garantiza que la persona tenga ficha. Se llama al entrar con Google:
   * crea el registro con los datos de la cuenta y, si falta elegir sede
   * o cargo, envía a index.html solo para esa selección (no para pedir
   * nombre, correo ni documento, que ya vienen de Google).
   */
  function exigirRegistro() {
    const u = exigirSesion();
    if (!u) return null;
    registrarDesdeGoogle(u);
    if (!perfilCompleto(u.correo)) {
      location.replace("index.html?motivo=perfil");
      return null;
    }
    return u;
  }

  /* ====================================================================
   * Notificaciones tipo pestaña (toast)
   * ------------------------------------------------------------------
   * Uso: App.aviso("Módulo leído", "ok")
   *      tipos: "ok" (verde) · "info" (azul) · "error" (rojo)
   * ==================================================================== */
  function aviso(texto, tipo, duracion) {
    if (!texto) return;
    const clase = tipo === "error" ? "toast-error" : tipo === "info" ? "toast-info" : "toast-ok";
    let capa = $("#capaAvisos");
    if (!capa) {
      capa = document.createElement("div");
      capa.id = "capaAvisos";
      capa.className = "capa-avisos";
      capa.setAttribute("aria-live", "polite");
      capa.setAttribute("aria-atomic", "false");
      document.body.appendChild(capa);
    }
    const t = document.createElement("div");
    t.className = "toast " + clase;
    t.setAttribute("role", "status");
    const icono = tipo === "error" ? "✕" : tipo === "info" ? "i" : "✓";
    t.innerHTML = `<span class="toast-icono">${icono}</span><span class="toast-texto"></span><button type="button" class="toast-cerrar" aria-label="Cerrar aviso">×</button>`;
    t.querySelector(".toast-texto").textContent = texto;
    capa.appendChild(t);
    requestAnimationFrame(() => t.classList.add("toast-visible"));
    const quitar = () => {
      t.classList.remove("toast-visible");
      t.classList.add("toast-saliendo");
      setTimeout(() => t.remove(), 300);
    };
    const btn = t.querySelector(".toast-cerrar");
    if (btn) btn.addEventListener("click", quitar);
    setTimeout(quitar, duracion || 4000);
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
    registrarDesdeGoogle, perfilCompleto, aviso,
    obtenerResultados, guardarResultado,
    obtenerProgreso, marcarModuloLeido, modulosLeidos,
    marcarSeccionLeida, seccionesHechas, moduloCompleto,
    estadoModulos, evaluacionHabilitada,
    tiempoModulo, iniciarCronometro, protocoloDeModulo,
    protocolos, protocolo, protocoloDeTema,
    totalPreguntasProtocolo, resultadosProtocolo, aproboProtocolo, intentosProtocolo,
    generarCodigo,
    pintarEncabezado, exigirSesion, exigirRegistro, paginaActual,
  };
})();
