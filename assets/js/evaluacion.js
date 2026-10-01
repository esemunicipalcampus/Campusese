/* =========================================================================
 * MOTOR DE EVALUACIÓN
 * Evaluación tipo formulario: agrupa por tema, mezcla las opciones,
 * calcula el resultado y lo guarda con su código de certificado.
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
  /* Estado                                                           */
  /* ---------------------------------------------------------------- */
  let preguntas = [];
  let respuestas = {};
  let enviados = false;
  let borradorGuardado = false;

  const semilla = A.hash(U.correo + (U.sub || "") + new Date().toISOString().slice(0, 10));

  function preparar() {
    preguntas = window.BancoPreguntas.aplanar().map(function (p) {
      const b = window.BancoPreguntas.barajarOpciones(p.opciones, p.correcta, A.hash(p.ref + semilla));
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
    const b = A.BD.leer("ese_borrador_" + U.correo, null);
    if (!b || !b.respuestas) return;
    const validas = {};
    for (const ref in b.respuestas) {
      if (preguntas.some(p => p.ref === ref)) validas[ref] = b.respuestas[ref];
    }
    if (Object.keys(validas).length) respuestas = validas;
  }

  /* Guarda el borrador en el navegador.
     Se llama en cada cambio de respuesta para no perder el avance
     si el participante cierra o recarga la página a mitad del intento. */
  function guardarBorrador() {
    A.BD.escribir("ese_borrador_" + U.correo, {
      respuestas: respuestas,
      semilla: semilla,
      ts: new Date().toISOString()
    });
    borradorGuardado = true;
  }

  /* ---------------------------------------------------------------- */
  /* Cálculo                                                          */
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
          id: p.temaId, numero: p.temaNumero, titulo: p.temaTitulo, total: 0, aciertos: 0
        };
      }
      porTema[p.temaId].total++;
      if (ok) porTema[p.temaId].aciertos++;

      detalle.push({
        ref: p.ref,
        temaNumero: p.temaNumero,
        enunciado: p.enunciado,
        opciones: p.opciones,
        elegida: contestada ? r : null,
        correcta: p.correcta,
        explicacion: p.explicacion,
        acierto: ok
      });
    });

    const total = preguntas.length;
    const porcentaje = total === 0 ? 0 : Math.round((aciertos / total) * 100);
    const temas = Object.keys(porTema).map(function (k) {
      const t = porTema[k];
      t.porcentaje = t.total === 0 ? 0 : Math.round((t.aciertos / t.total) * 100);
      return t;
    });

    const aprobadoTemas = temas.every(function (t) { return t.porcentaje >= C.curso.notaPorTema; });
    const aprobado = porcentaje >= C.curso.notaAprobacion && aprobadoTemas;

    return {
      total: total,
      aciertos: aciertos,
      contestadas: contestadas,
      porcentaje: porcentaje,
      temas: temas,
      aprobado: aprobado,
      aprobadoTemas: aprobadoTemas,
      notaMinima: C.curso.notaAprobacion,
      notaMinimaTema: C.curso.notaPorTema,
      detalle: detalle,
      fecha: new Date().toISOString()
    };
  }

  /* ---------------------------------------------------------------- */
  /* Pintado                                                          */
  /* ---------------------------------------------------------------- */
  function htmlInstrucciones() {
    return ''
      + '<div class="tarjeta">'
      + '  <h2>Instrucciones</h2>'
      + '  <ol class="pasos">'
      + '    <li>Responde todas las preguntas antes de enviar.</li>'
      + '    <li>Las preguntas están agrupadas por tema y el orden de las opciones cambia en cada intento.</li>'
      + '    <li>Necesitas <strong>' + C.curso.notaAprobacion + '% o más</strong> en total y al menos '
      + C.curso.notaPorTema + '% en cada tema para aprobar.</li>'
      + '    <li>Al enviar verás el resultado inmediato con la justificación de cada respuesta.</li>'
      + '    <li>Si apruebas, se emite tu certificado de inmediato.</li>'
      + '  </ol>'
      + '  <div class="aviso aviso-info"><strong>Tiempo</strong>'
      + '    Puedes responder sin límite de tiempo. Las respuestas quedan guardadas en esta página '
      + '    mientras no la recargues.</div>'
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
      ? '<a class="btn btn-azul" href="resultado.html">Ver resultado</a>'
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
          borradorGuardado = false;
          A.BD.borrar("ese_borrador_" + U.correo);
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

    meta.textContent = preguntas.length + " preguntas · "
      + window.TEMAS.length + " temas · aprobación "
      + C.curso.notaAprobacion + "% (mínimo "
      + C.curso.notaPorTema + "% por tema)";
  }

  /* ---------------------------------------------------------------- */
  /* Envío                                                            */
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
    const intentosPrevios = A.obtenerResultados(U.correo).length;

    resultado.intento = intentosPrevios + 1;
    resultado.codigo = A.generarCodigo(U.correo, resultado);
    resultado.ultimoIntento = resultado.intento >= C.curso.intentosMaximos;

    A.guardarResultado(U.correo, resultado);
    A.BD.borrar("ese_borrador_" + U.correo);
    sessionStorage.setItem("ese_ultimo_codigo", resultado.codigo);

    enviados = true;

    const registro = A.leerRegistro(U.correo) || {};
    A.Remoto.registrarResultado({
      codigo: resultado.codigo,
      correo: U.correo,
      nombre: registro.nombre || U.nombre,
      documento: registro.documento || "",
      cargo: registro.cargo || "",
      servicio: registro.servicio || "",
      centro: registro.centro || "",
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

    if (resultado.aprobado) {
      setTimeout(function () {
        alert("Felicitaciones. Aprobaste la evaluación.\n\nPuedes descargar tu certificado.");
        location.href = "certificado.html?codigo=" + encodeURIComponent(resultado.codigo);
      }, 400);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Arranque                                                         */
  /* ---------------------------------------------------------------- */
  preparar();
  recuperarBorrador();
  // Si ya no puede intentar (aprobó o agotó intentos), se muestra el aviso
  // en lugar del cuestionario: no se llama a pintar().
  if (!bloquearSiNoPuedeIntentar()) pintar();

  /* ---------------------------------------------------------------- */
  /* Control de intentos                                              */
  /* ---------------------------------------------------------------- */

  /** Intentos ya realizados por este participante. */
  function intentosHechos() {
    return A.obtenerResultados(U.correo).length;
  }

  /** ¿Ya aprobó en algún intento? */
  function aprobadoAntes() {
    return A.obtenerResultados(U.correo).some(function (r) { return r.aprobado; });
  }

  /**
   * Impide repetir la evaluación cuando ya se agotaron los intentos
   * o cuando el participante ya obtuvo su certificado.
   */
  function bloquearSiNoPuedeIntentar() {
    const previos = intentosHechos();

    if (aprobadoAntes()) {
      zona.innerHTML = ""
        + '<div class="tarjeta"><div class="vacio">'
        + '<span class="icono">✅</span>'
        + '<h2>Ya aprobaste esta evaluación</h2>'
        + '<p class="texto-suave">Tu certificado ya está disponible. '
        + 'La evaluación no puede repetirse una vez aprobada.</p>'
        + '<div class="acciones-resultado">'
        + '<a class="btn btn-azul" href="certificado.html">Ver mi certificado</a>'
        + '<a class="btn btn-borde" href="resultado.html">Ver mi resultado</a>'
        + '</div></div></div>';
      if (barra) barra.style.width = "100%";
      if (txtBarra) txtBarra.textContent = "Completada";
      if (meta) meta.textContent = "Evaluación aprobada";
      if (acciones) acciones.innerHTML = '<a class="btn btn-borde" href="curso.html">Volver al curso</a>';
      return true;
    }

    if (previos >= C.curso.intentosMaximos) {
      zona.innerHTML = ""
        + '<div class="tarjeta"><div class="vacio">'
        + '<span class="icono">🔒</span>'
        + '<h2>Agotaste los ' + C.curso.intentosMaximos + ' intentos</h2>'
        + '<p class="texto-suave">Alcanzaste el número máximo de intentos permitido '
        + '(' + previos + ' de ' + C.curso.intentosMaximos + ') sin alcanzar la nota mínima. '
        + 'Comunícate con la coordinación de capacitación para recibir orientación '
        + 'antes de presentar una nueva evaluación.</p>'
        + '<div class="acciones-resultado">'
        + '<a class="btn btn-borde" href="resultado.html">Revisar mis intentos</a>'
        + '<a class="btn btn-borde" href="curso.html">Repasar el curso</a>'
        + '</div></div></div>';
      if (barra) barra.style.width = "100%";
      if (txtBarra) txtBarra.textContent = "Intentos agotados";
      if (meta) meta.textContent = "Sin intentos disponibles";
      if (acciones) acciones.innerHTML = '<a class="btn btn-borde" href="curso.html">Volver al curso</a>';
      return true;
    }

    return false;
  }
})();
