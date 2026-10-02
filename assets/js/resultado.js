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

  /* ---------------- protocolo de esta página ---------------- */

  const qs = new URLSearchParams(location.search);

  function protocoloSolicitado() {
    const p = qs.get("p") || sessionStorage.getItem("ese_protocolo");
    if (p && A.protocolo(p)) return p;
    if (qs.get("codigo")) {
      const propio = A.obtenerResultados(U.correo).find(function (x) {
        return x.codigo === qs.get("codigo");
      });
      if (propio && A.protocolo(propio.protocolo)) return propio.protocolo;
    }
    const conResultado = A.protocolos().find(function (p) {
      return A.resultadosProtocolo(U.correo, p.id).length > 0;
    });
    return conResultado ? conResultado.id : (A.protocolos()[0] || {}).id || "";
  }

  const idProtocolo = protocoloSolicitado();
  const P = A.protocolo(idProtocolo);
  if (P) sessionStorage.setItem("ese_protocolo", P.id);

  function resultados() {
    return A.resultadosProtocolo(U.correo, idProtocolo).slice().sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

  function codigoDeUrl() {
    return qs.get("codigo") || sessionStorage.getItem("ese_ultimo_codigo_" + idProtocolo);
  }

  const todos = resultados();
  const codigoSolicitado = codigoDeUrl();

  let r = null;
  if (codigoSolicitado) r = todos.find(function (x) { return x.codigo === codigoSolicitado; }) || null;
  if (!r && todos.length) r = todos[0];
  if (!r) r = todos.find(function (x) { return x.aprobado; }) || null;

  document.title = "Resultado · " + (P ? P.nombre : "Protocolo") + " | ESE Municipal × Unillanos";

  /* ---------------- selector de protocolo ---------------- */

  function htmlSelector() {
    const disponibles = A.protocolos().filter(function (p) {
      return A.intentosProtocolo(U.correo, p.id) > 0;
    });
    if (disponibles.length < 2) return "";

    let h = '<div class="tarjeta selector-protocolo">';
    h += '<h2>Consultar otro protocolo</h2><div class="selector-chips">';
    disponibles.forEach(function (p) {
      const activo = p.id === idProtocolo;
      const est = A.aproboProtocolo(U.correo, p.id) ? " ✓" : "";
      h += '<a class="chip' + (activo ? " activo" : "") + '" href="resultado.html?p='
        + encodeURIComponent(p.id) + '">' + p.icono + " " + A.esc(p.nombre) + est + '</a>';
    });
    h += '</div></div>';
    return h;
  }

  /* ---------------- sin resultados ---------------- */
  if (!r) {
    zona.innerHTML = htmlSelector()
      + '<div class="tarjeta"><div class="vacio">'
      + '<span class="icono">📝</span>'
      + '<h2>Aún no has presentado esta evaluación</h2>'
      + '<p>Cuando completes el cuestionario de <b>' + A.esc(P ? P.nombre : "este protocolo")
      + '</b> verás aquí tu resultado, el detalle por tema y la justificación de cada respuesta.</p>'
      + '<div class="acciones-resultado">'
      + '<a class="btn" href="protocolos.html">Ir a los protocolos</a>'
      + (P ? '<a class="btn btn-azul" href="evaluacion.html?p=' + encodeURIComponent(P.id)
             + '">Ir a la evaluación</a>' : "")
      + '</div></div></div>';
    return;
  }

  /* ---------------- cabecera ---------------- */
  const claseCabecera = r.aprobado ? "resultado-aprobado" : "resultado-reprobado";
  const icono = r.aprobado ? "🎉" : "📘";
  const titulo = r.aprobado ? "Evaluación aprobada" : "Evaluación no aprobada";

let html = htmlSelector();

  html += '<div class="tarjeta resultado-cabecera ' + claseCabecera + '">';
  html += '<div class="icono">' + icono + '</div>';
  html += '<div class="protocolo-etiqueta">PROTOCOLO ' + A.esc(P ? P.numero : r.protocoloNumero)
    + ' · ' + A.esc(P ? P.nombre : r.protocoloNombre) + '</div>';
  html += '<h1>' + titulo + '</h1>';
  html += '<p class="texto-suave">Intento ' + A.esc(r.intento) + ' · ' + A.esc(A.conHora(r.fecha)) + '</p>';
  html += '<div class="nota-grande' + (r.aprobado ? "" : " baja") + '">' + r.porcentaje + '%</div>';
  html += '<div class="nota-etiqueta">' + r.aciertos + ' de ' + r.total + ' respuestas correctas</div>';

if (r.aprobado) {
    html += '<div class="aviso aviso-ok" style="max-width:560px;margin:1.1rem auto 0;text-align:left">'
      + '<strong>Protocolo aprobado</strong>'
      + 'Tu nota quedó registrada en el sistema con el código de seguimiento <code>'
      + A.esc(r.codigo) + '</code>. Ya puedes continuar con los demás protocolos.'
      + '</div>';
  } else {
    html += '<div class="aviso aviso-error" style="max-width:560px;margin:1.1rem auto 0;text-align:left">'
      + '<strong>No alcanzaste la nota mínima</strong>'
      + 'Se requiere ' + r.notaMinima + '% en total. Revisa las justificaciones, '
      + 'estudia de nuevo los módulos e inténtalo otra vez.'
      + '</div>';
  }

html += '<div class="acciones-resultado">';
  if (r.aprobado) {
    html += '<a class="btn btn-azul" href="protocolos.html">Volver a los protocolos</a>';
  } else if (P) {
    const reintentos = todos.filter(function (x) { return !x.aprobado; }).length;
    if (reintentos < C.programa.intentosMaximos) {
      html += '<a class="btn" href="evaluacion.html?p=' + encodeURIComponent(idProtocolo)
        + '">Reintentar evaluación</a>';
    } else {
      html += '<button type="button" class="btn" disabled>Has agotado los '
        + C.programa.intentosMaximos + ' intentos</button>';
    }
  }
  html += '<a class="btn btn-borde" href="protocolos.html">Volver a los protocolos</a>';
  html += '<button type="button" class="btn btn-borde" id="btnImprimir">Imprimir resultado</button>';
  html += '</div>';
  html += '</div>';

  /* ---------------- resumen por tema ---------------- */
  html += '<div class="tarjeta mt-1">';
  html += '<h2>Resultado por tema</h2>';
  html += '<div class="resumen-temas">';
r.temas.forEach(function (t) {
    const ok = t.porcentaje >= r.notaMinima;
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
    html += '<h2>Historial de intentos · ' + A.esc(P ? P.nombre : "") + '</h2>';
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
      + A.esc(t.id) + '">' + A.esc(t.titulo) + '</button>';
  });
  html += '</div>';

r.temas.forEach(function (t, i) {
    html += '<div class="detalle-tema' + (i === 0 ? "" : " oculto") + '" data-tema="' + A.esc(t.id) + '">';
    html += '<h3>' + A.esc(t.titulo) + ' <small class="texto-suave">('
      + t.aciertos + '/' + t.total + ' · ' + t.porcentaje + '%)</small></h3>';
    r.detalle.filter(function (d) { return d.temaId === t.id; })
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
