/* =========================================================================
 * CERTIFICADO
 * Genera el certificado imprimible/PDF y un verificador público por código.
 * ========================================================================= */
(function () {
  "use strict";

  const A = window.App;
  const C = window.CONFIG;
  const U = A.exigirRegistro();
  if (!U) return;

  const zona = document.getElementById("zonaCertificado");
  const LETRAS = ["A", "B", "C", "D", "E", "F"];

  function resultados() {
    return A.obtenerResultados(U.correo).slice().sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

  const todos = resultados();
  const codigoUrl = new URLSearchParams(location.search).get("codigo");

  let r = null;
  if (codigoUrl) r = todos.find(function (x) { return x.codigo === codigoUrl; }) || null;
  if (!r) r = todos.find(function (x) { return x.aprobado; }) || null;
  if (!r && todos.length) r = todos[0];

  /* ---------------- sin resultados ---------------- */
  if (!r) {
    zona.innerHTML =
      '<div class="tarjeta"><div class="vacio">'
      + '<span class="icono">🎓</span>'
      + '<h2>Todavía no tienes certificado</h2>'
      + '<p>El certificado se emite automáticamente cuando apruebas la evaluación '
      + '(' + C.curso.notaAprobacion + '% mínimo, con al menos ' + C.curso.notaPorTema
      + '% en cada tema).</p>'
      + '<div class="acciones-resultado">'
      + '<a class="btn btn-azul" href="evaluacion.html">Ir a la evaluación</a>'
      + '</div></div></div>';
    return;
  }

  const registro = A.leerRegistro(U.correo) || {};
  const nombre = registro.nombre || U.nombre || "Participante";
  const aprobado = !!r.aprobado;

  /* ---------------- datos del certificado ---------------- */
  const temasTexto = r.temas.map(function (t) { return t.titulo; }).join(" · ");
  const notaTexto = r.aciertos + " de " + r.total + " respuestas correctas (" + r.porcentaje + " %)";

  /* ---------------- certificado ---------------- */
  function htmlCertificado() {
    let h = "";

    h += '<div class="cert-lienzo no-imprimir" style="padding-bottom:.6rem">';
    h += '<div class="acciones-resultado" style="margin:0 0 1rem">';
    h += '<button type="button" class="btn" id="btnDescargar">Descargar / imprimir (PDF)</button>';
    h += '<a class="btn btn-borde" href="resultado.html?codigo=' + encodeURIComponent(r.codigo) + '">Ver resultado</a>';
    h += '<a class="btn btn-borde" href="curso.html">Volver al curso</a>';
    h += '</div></div>';

    h += '<div class="cert-lienzo">';
    h += '<div class="certificado" id="certificado">';

    h += '<div class="cert-cinta"></div>';
    h += '<div class="cert-marco"></div>';

    /* cabecera con los dos logotipos */
    h += '<div class="cert-cabecera">';
    h += '<div class="cert-logueos">';
    h += '<img src="' + C.entidadSalud.logo + '" alt="' + A.esc(C.entidadSalud.sigla) + '">';
    h += '<div class="sep"></div>';
    h += '<img src="' + C.entidadAcademica.logo + '" alt="' + A.esc(C.entidadAcademica.sigla) + '">';
    h += '</div>';
    h += '<div class="texto">';
    h += '<b>' + A.esc(C.entidadSalud.nombre) + '</b>';
    h += A.esc(C.entidadSalud.subtitulo) + '<br>';
    h += A.esc(C.entidadSalud.centro) + '<br>';
    h += A.esc(C.entidadAcademica.nombre) + ' — ' + A.esc(C.entidadAcademica.subtitulo);
    h += '</div>';
    h += '</div>';

    /* cuerpo */
    h += '<div class="cert-cuerpo">';
    h += '<p class="cert-titulo">Certificado</p>';
    h += '<p class="cert-subtitulo">' + A.esc(C.curso.titulo) + '</p>';

    h += '<p class="cert-otorga">La ' + A.esc(C.entidadSalud.nombre) + ', en convenio académico con la '
      + A.esc(C.entidadAcademica.nombre) + ', otorgan el presente certificado a:</p>';

    h += '<div class="cert-nombre' + (nombre ? "" : " cert-nombre-vacio") + '">' + A.esc(nombre) + '</div>';

    if (registro.documento) {
      h += '<p class="cert-documento">Documento de identidad: ' + A.esc(registro.documento) + '</p>';
    }
    if (registro.cargo || registro.servicio) {
      h += '<p class="cert-documento">'
        + A.esc(registro.cargo || "") + (registro.cargo && registro.servicio ? " · " : "")
        + A.esc(registro.servicio || "")
        + (registro.centro ? " — " + A.esc(registro.centro) : "")
        + '</p>';
    }

    h += '<p class="cert-texto">por haber aprobado la evaluación de conocimientos con una calificación de '
      + '<span class="resaltado">' + r.porcentaje + ' %</span> (' + A.esc(notaTexto) + '), '
      + 'desarrollada en los protocolos y procedimientos institucionales de seguridad del paciente, '
      + 'con una intensidad horaria de <span class="resaltado">' + C.certificado.horas + ' horas</span>.</p>';

    h += '<div class="cert-temas"><strong>Temas evaluados:</strong> ' + A.esc(temasTexto) + '</div>';

    h += '</div>';

    /* pie: firmas + código */
    h += '<div class="cert-pie">';
    h += '<div class="cert-firmas">';
    h += '<div class="cert-firma"><div class="linea"><strong>'
      + A.esc(C.certificado.firmante1) + '</strong><span>'
      + A.esc(C.certificado.cargoFirmante1) + '</span></div></div>';
    h += '<div class="cert-firma"><div class="linea"><strong>'
      + A.esc(C.certificado.firmante2) + '</strong><span>'
      + A.esc(C.certificado.cargoFirmante2) + '</span></div></div>';
    h += '</div>';
    h += '<div class="cert-sello">';
    h += 'Fecha de expedición<br><strong>' + A.esc(A.fechaLarga(r.fecha)) + '</strong><br>';
    h += 'Código de verificación<br><span class="codigo">' + A.esc(r.codigo) + '</span>';
    h += '</div>';
    h += '</div>';

    h += '</div></div>';

    return h;
  }

  /* ---------------- ficha de datos ---------------- */
  function htmlFicha() {
    let h = '<div class="tarjeta no-imprimir mt-1">';
    h += '<h2>Datos de la certificación</h2>';

    if (!aprobado) {
      h += '<div class="aviso aviso-error"><strong>Evaluación no aprobada</strong>'
        + 'Este documento se generó como constancia del intento, pero '
        + '<b>no es un certificado válido</b> porque no se alcanzó la nota mínima de '
        + r.notaMinima + '%. Aprueba la evaluación para emitir tu certificado.</div>';
    }

    h += '<div class="info-certificado">';
    h += '<div class="info-cert"><span>Código</span><strong>' + A.esc(r.codigo) + '</strong></div>';
    h += '<div class="info-cert"><span>Correo registrado</span><strong>' + A.esc(U.correo) + '</strong></div>';
    h += '<div class="info-cert"><span>Fecha</span><strong>' + A.esc(A.fechaLarga(r.fecha)) + '</strong></div>';
    h += '<div class="info-cert"><span>Calificación</span><strong>' + r.porcentaje + ' %</strong></div>';
    h += '<div class="info-cert"><span>Intento</span><strong>' + A.esc(r.intento) + ' de '
      + C.curso.intentosMaximos + '</strong></div>';
    h += '<div class="info-cert"><span>Duración</span><strong>' + C.certificado.horas + ' horas</strong></div>';
    h += '</div>';

    /* Resultado por tema */
    h += '<h3>Desempeño por tema</h3>';
    h += '<div class="resumen-temas">';
    r.temas.forEach(function (t) {
      const ok = t.porcentaje >= r.notaMinimaTema;
      h += '<div class="resumen-fila">';
      h += '<div class="nom">' + A.esc(t.numero) + '. ' + A.esc(t.titulo) + '</div>';
      h += '<div class="val">' + t.aciertos + '/' + t.total + '</div>';
      h += '<div class="est ' + (ok ? "est-ok" : "est-mal") + '">' + t.porcentaje + '% ' + (ok ? "✓" : "✗") + '</div>';
      h += '</div>';
    });
    h += '</div>';

    if (aprobado) {
      h += '<div class="aviso aviso-info mt-2"><strong>Cómo validar este certificado</strong>'
        + 'Comunica el código <code>' + A.esc(r.codigo) + '</code> en la pestaña '
        + '<em>Verificar certificado</em> de esta misma página, o directamente en '
        + '<code>certificado.html?verificar=' + A.esc(r.codigo) + '</code>.</div>';
    }

    h += '</div>';
    return h;
  }

  /* ---------------- verificador ---------------- */
  function htmlVerificador() {
    return ''
      + '<div class="tarjeta no-imprimir mt-1">'
      + '<h2>Verificar un certificado</h2>'
      + '<p class="texto-suave texto-peq">Ingresa el código impreso en el certificado para comprobar '
      + 'su autenticidad y los datos del participante.</p>'
      + '<div class="verificar-form">'
      + '<div class="campo">'
      + '  <label for="inpCodigo">Código de verificación</label>'
      + '  <input type="text" id="inpCodigo" placeholder="' + C.certificado.prefijoCodigo + '-AAAA-000000" '
      + 'style="text-transform:uppercase">'
      + '</div>'
      + '<button type="button" class="btn btn-bloque" id="btnVerificar">Verificar</button>'
      + '<div id="salidaVerificar" class="mt-1"></div>'
      + '</div>'
      + '</div>';
  }

  /* ---------------- montaje ---------------- */
  zona.innerHTML = htmlCertificado() + htmlFicha() + htmlVerificador();

  /* botón de descarga: usa la función de impresión del navegador
     (el usuario elige "Guardar como PDF") */
  const btn = document.getElementById("btnDescargar");
  if (btn) {
    btn.addEventListener("click", function () {
      alert("Se abrirá el cuadro de diálogo de impresión.\n\n"
        + "Elige «Guardar como PDF» como destino para descargar el certificado, "
        + "o «Imprimir» para sacar una copia en papel.\n\n"
        + "Tip: selecciona el tamaño de página «Horizontal» y activa los gráficos de fondo.");
      window.print();
    });
  }

  /* ---------------- verificador ---------------- */
  const inp = document.getElementById("inpCodigo");
  const salida = document.getElementById("salidaVerificar");
  const btnVer = document.getElementById("btnVerificar");

  function pintarVerificacion(res) {
    if (!res.encontrado) {
      salida.innerHTML = '<div class="aviso aviso-error resultado-verif">'
        + '<div class="icono">❌</div>'
        + '<h3>Código no encontrado</h3>'
        + 'No existe ningún certificado emitido con el código <code>' + A.esc(res.codigo) + '</code>.'
        + '</div>';
      return;
    }

    const d = res.datos;
    let h = '<div class="tarjeta resultado-verif">';
    h += '<div class="icono">✅</div>';
    h += '<h3>Certificado válido</h3>';
    h += '<p class="texto-suave">Emitido el ' + A.esc(A.fechaLarga(d.fecha)) + '</p>';
    h += '<div class="info-certificado" style="text-align:left">';
    h += '<div class="info-cert"><span>Código</span><strong>' + A.esc(d.codigo) + '</strong></div>';
    h += '<div class="info-cert"><span>Participante</span><strong>' + A.esc(d.nombre) + '</strong></div>';
    h += '<div class="info-cert"><span>Documento</span><strong>' + A.esc(d.documento || "—") + '</strong></div>';
    h += '<div class="info-cert"><span>Cargo</span><strong>' + A.esc(d.cargo || "—") + '</strong></div>';
    h += '<div class="info-cert"><span>Centro de salud</span><strong>' + A.esc(d.centro || "—") + '</strong></div>';
    h += '<div class="info-cert"><span>Calificación</span><strong>' + A.esc(d.porcentaje) + ' %</strong></div>';
    h += '</div></div>';
    salida.innerHTML = h;
  }

  async function verificar() {
    const codigo = inp.value.trim().toUpperCase();
    if (!codigo) { alert("Escribe el código de verificación."); return; }

    salida.innerHTML = '<p class="centro texto-suave">Verificando…</p>';

    if (A.Remoto.habilitado()) {
      const res = await A.Remoto.consultarCodigo(codigo);
      if (res && res.ok && res.encontrado !== undefined) {
        pintarVerificacion(res);
        return;
      }
    }

    /* modo local: busca en los resultados guardados en este navegador */
    const todos = A.obtenerResultados();
    const r = todos.find(function (x) { return x.codigo === codigo; });
    if (r) {
      const reg = A.leerRegistro(r.correo) || {};
      pintarVerificacion({
        encontrado: true,
        codigo: codigo,
        datos: {
          codigo: r.codigo,
          nombre: reg.nombre || r.correo,
          documento: reg.documento,
          cargo: reg.cargo,
          centro: reg.centro,
          fecha: r.fecha,
          porcentaje: r.porcentaje
        }
      });
      return;
    }

    pintarVerificacion({ encontrado: false, codigo: codigo });
  }

  btnVer.addEventListener("click", verificar);
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") verificar(); });

  /* verificación por URL: certificado.html?verificar=CODIGO */
  const porUrl = new URLSearchParams(location.search).get("verificar");
  if (porUrl) {
    inp.value = porUrl.toUpperCase();
    verificar();
  }
})();
