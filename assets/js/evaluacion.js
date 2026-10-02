/* =========================================================================
 * EVALUACIÓN DE UN PROTOCOLO
 * Cada protocolo tiene su propio cuestionario, sus propios intentos y
 * su propio certificado.
 *   evaluacion.html?p=codigo-azul
 * ========================================================================= */
(function () {
  "use strict";

  const A = window.App;
  const C = window.CONFIG;
  const U = A.exigirRegistro();
  if (!U) return;

  const zona = document.getElementById("zonaEval");
  const acciones = document.getElementById("evalAcciones");
  const barra = document.getElementById("barraEval");
  const txtBarra = document.getElementById("txtEval");
  const meta = document.getElementById("evalMeta");
  const LETRAS = ["A", "B", "C", "D", "E", "F"];

  /* ---------------------------------------------------------------- */
  /* Protocolo de esta página                                           */
  /* ---------------------------------------------------------------- */

  const idProtocolo =
    new URLSearchParams(location.search).get("p") ||
    sessionStorage.getItem("ese_protocolo") ||
    "";

  const P = A.protocolo(idProtocolo);

  if (!P) {
    zona.innerHTML =
      '<div class="tarjeta"><div class="vacio">'
      + '<span class="icono">🧭</span>'
      + '<h2>Protocolo no encontrado</h2>'
      + '<p class="texto-suave">Elige un protocolo para presentar su evaluación.</p>'
      + '<div class="acciones-resultado">'
      + '<a class="btn btn-azul" href="protocolos.html">Ver protocolos</a>'
      + '</div></div></div>';
    if (barra) barra.style.width = "0%";
    if (txtBarra) txtBarra.textContent = "—";
    if (meta) meta.textContent = "";
    if (acciones) acciones.innerHTML = '<a class="btn btn-borde" href="protocolos.html">Volver</a>';
    return;
  }

  sessionStorage.setItem("ese_protocolo", P.id);
  document.title = "Evaluación · " + P.nombre + " | ESE Municipal × Unillanos";

  const h1 = document.getElementById("evalTitulo");
  if (h1) h1.textContent = "Evaluación · " + P.nombre;

  /* ---------------------------------------------------------------- */
  /* Estado                                                            */
  /* ---------------------------------------------------------------- */

  let preguntas = [];
  let respuestas = {};
  let enviados = false;

  const claveBorrador = "ese_borrador_" + P.id + "_" + U.correo;
  const semilla = A.hash(U.correo + P.id + (U.sub || "") +
    new Date().toISOString().slice(0, 10));

  function preparar() {
    preguntas = window.BancoPreguntas.aplanar()
      .filter(function (p) { return (P.temas || []).includes(p.temaId); })
      .map(function (p) {
        const b = window.BancoPreguntas.barajarOpciones(
          p.opciones, p.correcta, A.hash(p.ref + semilla)
        );
        return {
          ref: p.ref,
          temaId: p.temaId,
          temaNumero: p.temaNumero,
          temaTitulo: p.temaTitulo,
          enunciado: p.enunciado,
          opciones: b.opciones,
          correcta: b.correcta,
          explicacion: p.explicacion
        };
      });
    respuestas = {};
  }

  function recuperarBorrador() {
    const b = A.BD.leer(claveBorrador, null);
    if (!b || !b.respuestas) return;
    const validas = {};
    for (const ref in b.respuestas) {
      if (preguntas.some(function (p) { return p.ref === ref; })) {
        validas[ref] = b.respuestas[ref];
      }
    }
    if (Object.keys(validas).length) respuestas = validas;
  }

  /** Guarda el borrador en cada cambio para no perder el avance. */
  function guardarBorrador() {
    A.BD.escribir(claveBorrador, {
      protocolo: P.id,
      respuestas: respuestas,
      semilla: semilla,
      ts: new Date().toISOString()
    });
  }

  /* ---------------------------------------------------------------- */
  /* Cálculo                                                           */
  /* ---------------------------------------------------------------- */

  function calcular() {
    let aciertos = 0;
    let contestadas = 0;
    const porTema = {};
    const detalle = [];

    preguntas.forEach(function (p) {
      const r = respuestas[p.ref];
      const contestada = r !== undefined && r !== null;
      if (contestada) contestadas++;
      const ok = contestada && r === p.correcta;
      if (ok) aciertos++;

      if (!porTema[p.temaId]) {
        porTema[p.temaId] = {
          id: p.temaId,
          numero: p.temaNumero,
          titulo: p.temaTitulo,
          aciertos: 0,
          total: 0,
          detalle: []
        };
      }
      const t = porTema[p.temaId];
      t.total++;
      if (ok) t.aciertos++;

      t.detalle.push({
        ref: p.ref,
        temaId: p.temaId,
        temaNumero: p.temaNumero,
        enunciado: p.enunciado,
        opciones: p.opciones,
        correcta: p.correcta,
        elegida: contestada ? r : null,
        acierto: ok,
        explicacion: p.explicacion
      });
    });

    const total = preguntas.length;
    const porcentaje = total === 0 ? 0 : Math.round((aciertos / total) * 100);

    const temas = Object.keys(porTema).map(function (k) {
      const t = porTema[k];
      t.porcentaje = t.total === 0 ? 0 : Math.round((t.aciertos / t.total) * 100);
      t.aprobado = t.porcentaje >= C.programa.notaAprobacion;
      return t;
    }).sort(function (a, b) { return a.numero - b.numero; });

    const notaMinima = C.programa.notaAprobacion;
    const notaMinimaTema = notaMinima;

    const totalTemasAprobados = temas.every(function (t) { return t.aprobado; });
    const aprobado = porcentaje >= notaMinima && totalTemasAprobados;

    return {
      protocolo: P.id,
      protocoloNombre: P.nombre,
      protocoloNumero: P.numero,
      temas: temas,
      detalle: temas.reduce(function (acc, t) { return acc.concat(t.detalle); }, []),
      aciertos: aciertos,
      total: total,
      contestadas: contestadas,
      porcentaje: porcentaje,
      notaMinima: notaMinima,
      notaMinimaTema: notaMinimaTema,
      aprobadoTemas: totalTemasAprobados,
      aprobado: aprobado,
      fecha: A.iso(new Date())
    };
  }

  /* ---------------------------------------------------------------- */
  /* Pintado                                                           */
  /* ---------------------------------------------------------------- */

  function htmlInstrucciones() {
    return ''
      + '<div class="tarjeta">'
      + '  <h2>Instrucciones</h2>'
      + '  <ol class="pasos">'
      + '    <li>Responde todas las preguntas antes de enviar.</li>'
      + '    <li>El orden de las opciones cambia en cada intento.</li>'
      + '    <li>Necesitas <strong>' + C.programa.notaAprobacion + '% o más</strong> para aprobar.</li>'
      + '    <li>Dispones de <strong>' + C.programa.intentosMaximos + ' intentos</strong>.</li>'
      + '    <li>Si apruebas, se emite tu certificado de este protocolo.</li>'
      + '  </ol>'
      + '  <div class="aviso aviso-info"><strong>Tiempo</strong>'
      + '    No hay límite de tiempo. Las respuestas quedan guardadas en esta página '
      + '    mientras no cierres el navegador.</div>'
      + '</div>';
  }

  function htmlPregunta(p) {
    const elegida = respuestas[p.ref];
    let clase = "pregunta";
    if (enviados) {
      clase += (elegida === p.correcta) ? " correcta" : " incorrecta";
    } else if (elegida !== undefined && elegida !== null) {
      clase += " respondida";
    }

    let h = '<div class="' + clase + '" id="q_' + p.ref + '" data-ref="' + p.ref + '">';
    h += '<div class="pregunta-cabecera">';
    h += '<span class="pregunta-num">' + A.esc(p.ref) + '</span>';
    h += '<div class="pregunta-enunciado">' + A.esc(p.enunciado) + '</div>';
    h += '</div><div class="opciones">';

    p.opciones.forEach(function (op, i) {
      let oc = "opcion";
      if (enviados) {
        oc += " bloqueada";
        if (i === p.correcta) oc += " acierto";
        else if (i === elegida) oc += " fallo";
      } else if (i === elegida) {
        oc += " seleccionada";
      }
      h += '<label class="' + oc + '">';
      h += '<input type="radio" name="q_' + p.ref + '" value="' + i + '"'
         + (elegida === i ? " checked" : "")
         + (enviados ? " disabled" : "") + '>';
      h += '<span><strong>' + LETRAS[i] + '.</strong> ' + A.esc(op) + '</span>';
      h += '</label>';
    });

    h += '</div>';

    if (enviados) {
      h += '<div class="explicacion">';
      h += '<strong>'
         + (elegida === p.correcta ? "Correcta" : "Incorrecta")
         + ' · Respuesta correcta: ' + LETRAS[p.correcta] + '. ' + A.esc(p.opciones[p.correcta])
         + '</strong>';
      h += A.esc(p.explicacion);
      h += '</div>';
    }

    h += '</div>';
    return h;
  }

  function pintar() {
    let html = "";

    if (!enviados && Object.keys(respuestas).length === 0) html += htmlInstrucciones();

    const porTema = {};
    preguntas.forEach(function (p) {
      if (!porTema[p.temaId]) porTema[p.temaId] = [];
      porTema[p.temaId].push(p);
    });

    window.TEMAS.forEach(function (tema) {
      const lista = porTema[tema.id];
      if (!lista) return;

      html += '<div class="tema-bloque" id="tema_' + tema.id + '">';
      html += '<div class="tema-encabezado">';
      html += '<div class="num">' + tema.numero + '</div>';
      html += '<h2>' + A.esc(tema.titulo) + '</h2>';
      html += '<span class="doc">' + A.esc(tema.documento) + '</span>';
      html += '</div>';
      lista.forEach(function (p) { html += htmlPregunta(p); });
      html += '</div>';
    });

    if (!enviados) {
      html += '<div class="tarjeta centro">';
      html += '<div class="aviso aviso-error oculto" id="avisoFaltantes"></div>';
      html += '<button type="button" class="btn" id="btnEnviar">Enviar evaluación</button>';
      html += '<p class="texto-peq texto-suave mt-1" id="txtSinResponder"></p>';
      html += '</div>';
    }

    zona.innerHTML = html;

    acciones.innerHTML = enviados
      ? '<a class="btn btn-azul" href="resultado.html?p=' + encodeURIComponent(P.id) + '">Ver resultado</a>'
      : '<button type="button" class="btn btn-borde btn-medio" id="btnReiniciar">Reiniciar</button>';

    if (!enviados) {
      zona.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
          const ref = radio.closest(".pregunta").dataset.ref;
          respuestas[ref] = parseInt(radio.value, 10);
          zona.querySelectorAll("#q_" + ref + " .opcion").forEach(function (o) {
            o.classList.remove("seleccionada");
          });
          radio.closest(".opcion").classList.add("seleccionada");
          guardarBorrador();
          actualizarProgreso();
        });
      });

      const btn = document.getElementById("btnEnviar");
      if (btn) btn.addEventListener("click", enviar);

      const btnR = document.getElementById("btnReiniciar");
      if (btnR) {
        btnR.addEventListener("click", function () {
          if (!confirm("¿Deseas borrar todas tus respuestas y empezar de nuevo?")) return;
          respuestas = {};
          A.BD.borrar(claveBorrador);
          pintar();
          window.scrollTo({ top: 0 });
        });
      }
    }

    actualizarProgreso();
  }

  function actualizarProgreso() {
    const total = preguntas.length;
    const n = Object.keys(respuestas).length;
    const pct = total === 0 ? 0 : Math.round((n / total) * 100);

    barra.style.width = pct + "%";
    txtBarra.textContent = n + " / " + total;

    const t = document.getElementById("txtSinResponder");
    if (t) {
      t.textContent = n === total
        ? "Todas las preguntas tienen respuesta. Puedes enviar."
        : "Faltan " + (total - n) + " pregunta" + (total - n === 1 ? "" : "s") + " por responder.";
    }

    meta.textContent = P.nombre + " · " + preguntas.length + " preguntas · "
      + "aprobación " + C.programa.notaAprobacion + "%";
  }

  /* ---------------------------------------------------------------- */
  /* Envío                                                             */
  /* ---------------------------------------------------------------- */

  function enviar() {
    const total = preguntas.length;
    const n = Object.keys(respuestas).length;

    if (n < total) {
      const av = document.getElementById("avisoFaltantes");
      if (av) {
        av.classList.remove("oculto");
        av.innerHTML = "<strong>Te faltan " + (total - n) + " preguntas por responder.</strong>"
          + "Resuelve todas las preguntas antes de enviar la evaluación.";
      }
      const primera = preguntas.find(function (p) { return respuestas[p.ref] === undefined; });
      if (primera) {
        const el = document.getElementById("q_" + primera.ref);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const resultado = calcular();
    resultado.intento = intentosHechos() + 1;
    resultado.codigo = A.generarCodigo(U.correo, resultado);
    resultado.ultimoIntento = resultado.intento >= C.programa.intentosMaximos;

    A.guardarResultado(U.correo, resultado);
    A.BD.borrar(claveBorrador);

    enviados = true;

    const registro = A.leerRegistro(U.correo) || {};
    A.Remoto.registrarResultado({
      codigo: resultado.codigo,
      correo: U.correo,
      nombre: registro.nombre || U.nombre,
      cargo: registro.cargo || "",
      sede: registro.sede || "",
      protocolo: P.id,
      protocoloNombre: P.nombre,
      intento: resultado.intento,
      fecha: resultado.fecha,
      porcentaje: resultado.porcentaje,
      aciertos: resultado.aciertos,
      total: resultado.total,
      aprobado: resultado.aprobado,
      temas: resultado.temas.map(function (t) {
        return {
          numero: t.numero, titulo: t.titulo,
          aciertos: t.aciertos, total: t.total, porcentaje: t.porcentaje
        };
      })
    });

    pintar();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!resultado.aprobado && !resultado.ultimoIntento) {
      acciones.innerHTML =
        '<button type="button" class="btn btn-borde btn-medio" id="btnReintentar">Intentar de nuevo</button>'
        + ' <a class="btn btn-azul" href="resultado.html?p=' + encodeURIComponent(P.id) + '">Ver resultado</a>';
      const btnReintentar = document.getElementById("btnReintentar");
      if (btnReintentar) {
        btnReintentar.addEventListener("click", function () {
          location.href = "evaluacion.html?p=" + encodeURIComponent(P.id);
        });
      }
    }

if (resultado.aprobado) {
      A.aviso("¡Felicitaciones! Aprobaste " + P.nombre + " con " + resultado.porcentaje
        + " %. Tu resultado ya quedó registrado.", "ok", 5000);
      setTimeout(function () {
        location.href = "resultado.html?p=" + encodeURIComponent(P.id);
      }, 2200);
    } else {
      A.aviso("No alcanzaste el " + C.programa.notaAprobacion + " % en " + P.nombre
        + ". Obtuviste " + resultado.porcentaje + " %. Revisa las explicaciones e inténtalo de nuevo.",
        "error", 7000);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Control de intentos                                               */
  /* ---------------------------------------------------------------- */

  function intentosHechos() { return A.intentosProtocolo(U.correo, P.id); }

  /**
   * La evaluación está bloqueada mientras falte alguna sección por leer
   * en cualquier módulo del protocolo.
   */
  function bloquearSiFaltaLectura() {
    if (A.evaluacionHabilitada(U.correo, P.id)) return false;

    const est = A.estadoModulos(U.correo, P.id);
    const pendientes = est.filter(function (m) { return !m.completo; });

    let html =
      '<div class="tarjeta"><div class="vacio">'
      + '<span class="icono">📖</span>'
      + '<h2>Antes de evaluar, termina la lectura</h2>'
      + '<p class="texto-suave">La evaluación de ' + A.esc(P.nombre)
      + ' se abre cuando marcaste como realizadas todas las secciones de sus módulos.</p>'
      + '<div class="lista-pendientes">';
    pendientes.forEach(function (m) {
      html += '<div class="pendiente-item">'
        + '<span class="pendiente-titulo">' + A.esc(m.titulo) + '</span>'
        + '<span class="pendiente-barras"><i style="width:'
        + (m.total ? Math.round((m.hechas / m.total) * 100) : 0) + '%"></i></span>'
        + '<span class="pendiente-txt">' + m.hechas + ' de ' + m.total + ' secciones</span>'
        + '<a class="btn btn-borde btn-peq" href="modulo.html?n=' + m.numero
        + '&p=' + encodeURIComponent(P.id) + '">Continuar</a>'
        + '</div>';
    });
    html += '</div>'
      + '<div class="acciones-resultado">'
      + '<a class="btn btn-azul" href="modulo.html?n=' + (pendientes[0] ? pendientes[0].numero : 1)
      + '&p=' + encodeURIComponent(P.id) + '">Ir a leer</a>'
      + '<a class="btn btn-borde" href="protocolos.html">Volver a los protocolos</a>'
      + '</div></div></div>';

    zona.innerHTML = html;
    if (barra) barra.style.width = "0%";
    if (txtBarra) txtBarra.textContent = "Lectura pendiente";
    if (meta) meta.textContent = P.nombre + " · falta lectura";
    if (acciones) acciones.innerHTML = '<a class="btn btn-borde" href="protocolos.html">Volver</a>';
    return true;
  }

  function bloquearSiNoPuedeIntentar() {
    const previos = intentosHechos();

    if (A.aproboProtocolo(U.correo, P.id)) {
      zona.innerHTML =
        '<div class="tarjeta"><div class="vacio">'
        + '<span class="icono">✅</span>'
        + '<h2>Ya aprobaste este protocolo</h2>'
        + '<p class="texto-suave">Tu resultado de ' + A.esc(P.nombre)
        + ' ya está aprobado. No se puede repetir una evaluación aprobada.</p>'
        + '<div class="acciones-resultado">'
        + '<a class="btn btn-azul" href="resultado.html?p=' + encodeURIComponent(P.id) + '">Ver mi resultado</a>'
        + '<a class="btn btn-borde" href="protocolos.html">Ver protocolos</a>'
        + '</div></div></div>';
      if (barra) barra.style.width = "100%";
      if (txtBarra) txtBarra.textContent = "Completada";
      if (meta) meta.textContent = P.nombre + " · aprobado";
      if (acciones) acciones.innerHTML = '<a class="btn btn-borde" href="protocolos.html">Ver protocolos</a>';
      return true;
    }

    if (previos >= C.programa.intentosMaximos) {
      zona.innerHTML =
        '<div class="tarjeta"><div class="vacio">'
        + '<span class="icono">🔒</span>'
        + '<h2>Agotaste los ' + C.programa.intentosMaximos + ' intentos</h2>'
        + '<p class="texto-suave">Alcanzaste el número máximo de intentos para '
        + A.esc(P.nombre) + ' (' + previos + ' de ' + C.programa.intentosMaximos
        + ') sin alcanzar la nota mínima. Comunícate con la coordinación de '
        + 'capacitación para recibir orientación antes de presentar de nuevo.</p>'
        + '<div class="acciones-resultado">'
        + '<a class="btn btn-borde" href="resultado.html?p=' + encodeURIComponent(P.id) + '">Revisar mis intentos</a>'
        + '<a class="btn btn-borde" href="protocolos.html">Volver a los protocolos</a>'
        + '</div></div></div>';
      if (barra) barra.style.width = "100%";
      if (txtBarra) txtBarra.textContent = "Intentos agotados";
      if (meta) meta.textContent = P.nombre + " · sin intentos disponibles";
      if (acciones) acciones.innerHTML = '<a class="btn btn-borde" href="protocolos.html">Volver</a>';
      return true;
    }

    return false;
  }

  /* ---------------------------------------------------------------- */
  /* Arranque                                                          */
  /* ---------------------------------------------------------------- */

  preparar();
  if (!bloquearSiNoPuedeIntentar() && !bloquearSiFaltaLectura()) {
    recuperarBorrador();
    pintar();
  }
})();