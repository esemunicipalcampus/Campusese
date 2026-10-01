/* =========================================================================
 * PÁGINA DE RESULTADO
 * Muestra la nota, el detalle por tema, la justificación de cada respuesta
 * y da acceso al certificado.
 * ========================================================================= */
(function () {
  "use strict";

  const A = window.App;
  const C = window.CONFIG;
  const U = A.exigirRegistro();
  if (!U) return;

  const zona = document.getElementById("zonaResultado");
  const LETRAS = ["A", "B", "C", "D", "E", "F"];

  function resultados() {
    return A.obtenerResultados(U.correo).slice().sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

  function codigoDeUrl() {
    const p = new URLSearchParams(location.search).get("codigo");
    if (p) return p;
    return sessionStorage.getItem("ese_ultimo_codigo");
  }

  const todos = resultados();
  const codigoSolicitado = codigoDeUrl();

  let r = null;
  if (codigoSolicitado) r = todos.find(function (x) { return x.codigo === codigoSolicitado; }) || null;
  if (!r && todos.length) r = todos[0];
  if (!r) r = todos.find(function (x) { return x.aprobado; }) || null;

  /* ---------------- sin resultados ---------------- */
  if (!r) {
    zona.innerHTML =
      '<div class="tarjeta"><div class="vacio">'
      + '<span class="icono">📝</span>'
      + '<h2>Aún no has presentado la evaluación</h2>'
      + '<p>Cuando completes el cuestionario verás aquí tu resultado, el detalle por tema '
      + 'y la justificación de cada respuesta.</p>'
      + '<div class="acciones-resultado">'
      + '<a class="btn" href="curso.html">Ir al curso</a>'
      + '<a class="btn btn-azul" href="evaluacion.html">Ir a la evaluación</a>'
      + '</div></div></div>';
    return;
  }

  /* ---------------- cabecera ---------------- */
  const claseCabecera = r.aprobado ? "resultado-aprobado" : "resultado-reprobado";
  const icono = r.aprobado ? "🎉" : "📘";
  const titulo = r.aprobado ? "Evaluación aprobada" : "Evaluación no aprobada";

  let html = "";

  html += '<div class="tarjeta resultado-cabecera ' + claseCabecera + '">';
  html += '<div class="icono">' + icono + '</div>';
  html += '<h1>' + titulo + '</h1>';
  html += '<p class="texto-suave">Intento ' + A.esc(r.intento) + ' · ' + A.esc(A.conHora(r.fecha)) + '</p>';
  html += '<div class="nota-grande' + (r.aprobado ? "" : " baja") + '">' + r.porcentaje + '%</div>';
  html += '<div class="nota-etiqueta">' + r.aciertos + ' de ' + r.total + ' respuestas correctas</div>';

  if (r.aprobado) {
    html += '<div class="aviso aviso-ok" style="max-width:560px;margin:1.1rem auto 0;text-align:left">'
      + '<strong>Certificado disponible</strong>'
      + 'Tu código de verificación es <code>' + A.esc(r.codigo) + '</code>. '
      + 'Descárgalo o imprímelo para presentarlo ante la ESE Municipal.'
      + '</div>';
  } else {
    html += '<div class="aviso aviso-error" style="max-width:560px;margin:1.1rem auto 0;text-align:left">'
      + '<strong>No alcanzaste la nota mínima</strong>'
      + 'Se requiere ' + r.notaMinima + '% en total y al menos ' + r.notaMinimaTema
      + '% en cada tema. Revisa las justificaciones, estudia de nuevo los módulos e inténtalo otra vez.'
      + '</div>';
  }

  html += '<div class="acciones-resultado">';
  if (r.aprobado) {
    html += '<a class="btn btn-azul" href="certificado.html?codigo=' + encodeURIComponent(r.codigo) + '">Ver / descargar certificado</a>';
  } else {
    const reintentos = todos.filter(function (x) { return !x.aprobado; }).length;
    if (reintentos < C.curso.intentosMaximos) {
      html += '<a class="btn" href="evaluacion.html">Reintentar evaluación</a>';
    } else {
      html += '<button type="button" class="btn" disabled>Has agotado los ' + C.curso.intentosMaximos + ' intentos</button>';
    }
  }
  html += '<a class="btn btn-borde" href="curso.html">Volver al curso</a>';
  html += '<button type="button" class="btn btn-borde" id="btnImprimir">Imprimir resultado</button>';
  html += '</div>';
  html += '</div>';

  /* ---------------- resumen por tema ---------------- */
  html += '<div class="tarjeta mt-1">';
  html += '<h2>Resultado por tema</h2>';
  html += '<div class="resumen-temas">';
  r.temas.forEach(function (t) {
    const ok = t.porcentaje >= r.notaMinimaTema;
    html += '<div class="resumen-fila">';
    html += '<div class="nom">' + A.esc(t.numero) + '. ' + A.esc(t.titulo) + '</div>';
    html += '<div class="val">' + t.aciertos + '/' + t.total + '</div>';
    html += '<div class="est ' + (ok ? "est-ok" : "est-mal") + '">' + t.porcentaje + '% '
      + (ok ? "✓" : "✗") + '</div>';
    html += '</div>';
  });
  html += '</div></div>';

  /* ---------------- historial ---------------- */
  if (todos.length > 1) {
    html += '<div class="tarjeta">';
    html += '<h2>Historial de intentos</h2>';
    html += '<div class="tabla-envoltura"><table class="datos"><thead><tr>'
      + '<th>Intento</th><th>Fecha</th><th>Puntaje</th><th>Resultado</th><th>Código</th>'
      + '</tr></thead><tbody>';
    todos.forEach(function (x) {
      html += '<tr><td>' + A.esc(x.intento) + '</td>'
        + '<td>' + A.esc(A.fechaCorta(x.fecha)) + '</td>'
        + '<td>' + x.aciertos + '/' + x.total + ' (' + x.porcentaje + '%)</td>'
        + '<td class="' + (x.aprobado ? "est-ok" : "est-mal") + '">'
        + (x.aprobado ? "Aprobado" : "No aprobado") + '</td>'
        + '<td><code>' + A.esc(x.codigo) + '</code></td></tr>';
    });
    html += '</tbody></table></div></div>';
  }

  /* ---------------- detalle ---------------- */
  html += '<div class="tarjeta">';
  html += '<h2>Detalle de respuestas</h2>';
  html += '<div class="tabs">';
  r.temas.forEach(function (t, i) {
    html += '<button type="button" class="tab' + (i === 0 ? " activo" : "") + '" data-tema="'
      + A.esc(t.id) + '">Tema ' + t.numero + '</button>';
  });
  html += '</div>';

  r.temas.forEach(function (t, i) {
    html += '<div class="detalle-tema' + (i === 0 ? "" : " oculto") + '" data-tema="' + A.esc(t.id) + '">';
    html += '<h3>Tema ' + t.numero + ': ' + A.esc(t.titulo) + ' <small class="texto-suave">('
      + t.aciertos + '/' + t.total + ')</small></h3>';
    r.detalle.filter(function (d) { return String(d.temaNumero) === String(t.numero); })
      .forEach(function (d) {
        html += '<div class="detalle-pregunta">';
        html += '<div class="cab"><span class="pregunta-num">' + A.esc(d.ref) + '</span>'
          + '<div class="pregunta-enunciado">' + A.esc(d.enunciado) + '</div></div>';
        html += '<div class="tu-respuesta">Tu respuesta: <b>'
          + (d.elegida === null ? "sin responder" : LETRAS[d.elegida] + ". " + A.esc(d.opciones[d.elegida]))
          + '</b></div>';
        html += '<div class="tu-respuesta ' + (d.acierto ? "est-ok" : "est-mal") + '">'
          + (d.acierto ? "✓ Correcta" : "✗ Correcta: " + LETRAS[d.correcta] + ". " + A.esc(d.opciones[d.correcta]))
          + '</div>';
        html += '<div class="explicacion"><strong>Justificación</strong>' + A.esc(d.explicacion) + '</div>';
        html += '</div>';
      });
    html += '</div>';
  });

  html += '</div>';

  zona.innerHTML = html;

  /* ---------------- eventos ---------------- */
  document.getElementById("btnImprimir").addEventListener("click", function () {
    window.print();
  });

  zona.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      const id = tab.dataset.tema;
      zona.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("activo"); });
      tab.classList.add("activo");
      zona.querySelectorAll(".detalle-tema").forEach(function (d) {
        d.classList.toggle("oculto", d.dataset.tema !== id);
      });
    });
  });
})();
