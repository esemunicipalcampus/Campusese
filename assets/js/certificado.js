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
    const aprobado = A.protocolos().find(function (p) {
      return A.aproboProtocolo(U.correo, p.id);
    });
    return aprobado ? aprobado.id : (A.protocolos()[0] || {}).id || "";
  }

  const idProtocolo = protocoloSolicitado();
  const P = A.protocolo(idProtocolo);
  if (P) sessionStorage.setItem("ese_protocolo", P.id);

  function resultados() {
    return A.resultadosProtocolo(U.correo, idProtocolo).slice().sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

  const todos = resultados();
  const codigoUrl = qs.get("codigo");

  let r = null;
  if (codigoUrl) r = todos.find(function (x) { return x.codigo === codigoUrl; }) || null;
  if (!r) r = todos.find(function (x) { return x.aprobado; }) || null;
  if (!r && todos.length) r = todos[0];

  document.title = "Reconocimiento · " + (P ? P.nombre : "Protocolo") + " | ESE Municipal × Unillanos";

  /* ---------------- selector de reconocimientos ---------------- */
  function htmlSelector() {
    const conCertificado = A.protocolos().filter(function (p) {
      return A.aproboProtocolo(U.correo, p.id);
    });
    if (conCertificado.length < 2) return "";

    let h = '<div class="tarjeta selector-protocolo no-imprimir">';
    h += '<h2>Mis reconocimientos</h2><div class="selector-chips">';
    A.protocolos().forEach(function (p) {
      const tiene = A.aproboProtocolo(U.correo, p.id);
      h += '<a class="chip' + (p.id === idProtocolo ? " activo" : "")
        + (tiene ? "" : " chip-bloqueado") + '" href="certificado.html?p='
        + encodeURIComponent(p.id) + '">' + p.icono + " " + A.esc(p.nombre)
        + (tiene ? " ✓" : " · pendiente") + '</a>';
    });
    h += '</div></div>';
    return h;
  }

  /* ---------------- sin resultados ---------------- */
  if (!r) {
    zona.innerHTML = htmlSelector()
      + '<div class="tarjeta"><div class="vacio">'
      + '<span class="icono">🎓</span>'
      + '<h2>Todavía no tienes reconocimiento de este protocolo</h2>'
      + '<p>El reconocimiento se emite automáticamente cuando apruebas la evaluación de '
      + '<b>' + A.esc(P ? P.nombre : "este protocolo") + '</b> ('
      + C.programa.notaAprobacion + '% mínimo). Puedes reconocerte en cada protocolo por separado.</p>'
      + '<div class="acciones-resultado">'
      + '<a class="btn btn-azul" href="evaluacion.html?p=' + encodeURIComponent(idProtocolo)
      + '">Ir a la evaluación</a>'
      + '<a class="btn btn-borde" href="protocolos.html">Ver los 4 protocolos</a>'
      + '</div></div></div>';
    return;
  }

  const registro = A.leerRegistro(U.correo) || {};
  const nombre = registro.nombre || U.nombre || "Participante";
  const aprobado = !!r.aprobado;
  const nombreProtocolo = P ? P.nombre : (r.protocoloNombre || "");
  const horas = P ? P.horas : "";
  /* Sede y cargo: los elige la persona una sola vez. Si no los ha
     confirmado, no se inventa nada en el reconocimiento. */
  const sede = registro.sede || "";
  const cargo = registro.cargo || "";

  /* ---------------- datos del certificado ---------------- */
  const temasTexto = r.temas.map(function (t) { return t.titulo; }).join(" · ");
  const notaTexto = r.aciertos + " de " + r.total + " respuestas correctas (" + r.porcentaje + " %)";

  /* ---------------- certificado ---------------- */
function htmlCertificado() {
    let h = "";

    h += '<div class="cert-lienzo no-imprimir" style="padding-bottom:.6rem">';
    h += '<div class="acciones-resultado" style="margin:0 0 1rem">';
    h += '<button type="button" class="btn" id="btnDescargar">Descargar / imprimir (PDF)</button>';
    h += '<a class="btn btn-borde" href="resultado.html?p=' + encodeURIComponent(idProtocolo)
      + '&codigo=' + encodeURIComponent(r.codigo) + '">Ver resultado</a>';
    h += '<a class="btn btn-borde" href="protocolos.html">Volver a los protocolos</a>';
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
    h += A.esc(C.entidadAcademica.nombre) + ' — ' + A.esc(C.entidadAcademica.subtitulo);
    h += '</div>';
    h += '</div>';

    /* cuerpo */
    h += '<div class="cert-cuerpo">';
h += '<p class="cert-titulo">Reconocimiento</p>';
    h += '<p class="cert-subtitulo">' + A.esc(C.programa.titulo) + '</p>';

    h += '<p class="cert-otorga">La ' + A.esc(C.entidadSalud.nombre) + ', en convenio académico con la '
      + A.esc(C.entidadAcademica.nombre) + ', reconocen la participación y aprobación de:</p>';

    h += '<div class="cert-nombre' + (nombre ? "" : " cert-nombre-vacio") + '">' + A.esc(nombre) + '</div>';

    if (sede || cargo) {
      const partes = [];
      if (cargo) partes.push(A.esc(cargo));
      if (sede) partes.push(A.esc(sede));
      h += '<p class="cert-documento">' + partes.join(" · ") + '</p>';
    }

    h += '<p class="cert-texto">quien aprobó la evaluación del <b>Protocolo '
      + (P ? P.numero : r.protocoloNumero) + ': ' + A.esc(nombreProtocolo)
      + '</b>, con una calificación de <span class="resaltado">' + r.porcentaje
      + ' %</span> (' + A.esc(notaTexto) + '), '
      + 'desarrollada en los módulos y procedimientos institucionales de seguridad del paciente '
      + 'correspondientes a este protocolo'
      + (horas ? ', con una intensidad horaria de <span class="resaltado">' + horas + ' horas</span>' : '')
      + '.</p>';

    h += '<div class="cert-temas"><strong>Temas evaluados:</strong> ' + A.esc(temasTexto) + '</div>';

    h += '</div>';

    /* pie: fecha + código. Es un reconocimiento, no lleva firmas. */
    h += '<div class="cert-pie">';
    h += '<div class="cert-nota-sin-firmas">Este documento se verifica con el código '
      + 'único que aparece abajo y no requiere firma de ninguna de las entidades.</div>';
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
    h += '<h2>Datos del reconocimiento</h2>';

if (!aprobado) {
      h += '<div class="aviso aviso-error"><strong>Evaluación no aprobada</strong>'
        + 'Este documento se generó como constancia del intento, pero '
        + '<b>no es un reconocimiento válido</b> porque no se alcanzó la nota mínima de '
        + r.notaMinima + '%. Aprueba la evaluación para emitir tu reconocimiento.</div>';
    }

h += '<div class="info-certificado">';
    h += '<div class="info-cert"><span>Código</span><strong>' + A.esc(r.codigo) + '</strong></div>';
    h += '<div class="info-cert"><span>Protocolo</span><strong>' + A.esc(nombreProtocolo) + '</strong></div>';
    h += '<div class="info-cert"><span>Correo registrado</span><strong>' + A.esc(U.correo) + '</strong></div>';
    h += '<div class="info-cert"><span>Fecha</span><strong>' + A.esc(A.fechaLarga(r.fecha)) + '</strong></div>';
    h += '<div class="info-cert"><span>Calificación</span><strong>' + r.porcentaje + ' %</strong></div>';
    h += '<div class="info-cert"><span>Intento</span><strong>' + A.esc(r.intento) + ' de '
      + C.programa.intentosMaximos + '</strong></div>';
    h += '<div class="info-cert"><span>Duración</span><strong>' + horas + ' horas</strong></div>';
    if (sede) h += '<div class="info-cert"><span>Sede</span><strong>' + A.esc(sede) + '</strong></div>';
    if (cargo) h += '<div class="info-cert"><span>Cargo</span><strong>' + A.esc(cargo) + '</strong></div>';
    h += '</div>';

    /* Resultado por tema */
    h += '<h3>Desempeño por tema</h3>';
    h += '<div class="resumen-temas">';
r.temas.forEach(function (t) {
const ok = t.porcentaje >= (r.notaMinima || C.programa.notaAprobacion);
      h += '<div class="resumen-fila">';
      h += '<div class="nom">' + A.esc(t.titulo) + '</div>';
      h += '<div class="val">' + t.aciertos + '/' + t.total + '</div>';
      h += '<div class="est ' + (ok ? "est-ok" : "est-mal") + '">' + t.porcentaje + '% ' + (ok ? "✓" : "✗") + '</div>';
      h += '</div>';
    });
    h += '</div>';

    if (aprobado) {
      h += '<div class="aviso aviso-info mt-2"><strong>Cómo validar este reconocimiento</strong>'
        + 'Comunica el código <code>' + A.esc(r.codigo) + '</code> en el apartado '
        + '<em>Verificar un reconocimiento</em> de esta misma página, o directamente en '
        + '<code>certificado.html?verificar=' + A.esc(r.codigo) + '</code>.</div>';
    }

    h += '</div>';
    return h;
  }

  /* ---------------- verificador ---------------- */
  function htmlVerificador() {
    return ''
      + '<div class="tarjeta no-imprimir mt-1">'
+ '<h2>Verificar un reconocimiento</h2>'
      + '<p class="texto-suave texto-peq">Ingresa el código impreso en el reconocimiento para comprobar '
      + 'su autenticidad y los datos del participante.</p>'
      + '<div class="verificar-form">'
      + '<div class="campo">'
      + '  <label for="inpCodigo">Código de verificación</label>'
      + '  <input type="text" id="inpCodigo" placeholder="' + C.reconocimiento.prefijoCodigo + '-AAAA-000000" '
      + 'style="text-transform:uppercase">'
      + '</div>'
      + '<button type="button" class="btn btn-bloque" id="btnVerificar">Verificar</button>'
      + '<div id="salidaVerificar" class="mt-1"></div>'
      + '</div>'
      + '</div>';
  }

/* ---------------- montaje ---------------- */
  zona.innerHTML = htmlSelector() + htmlCertificado() + htmlFicha() + htmlVerificador();

  /* botón de descarga: usa la función de impresión del navegador
     (el usuario elige "Guardar como PDF") */
  const btn = document.getElementById("btnDescargar");
  if (btn) {
btn.addEventListener("click", function () {
      A.aviso("Se abrirá el cuadro de diálogo de impresión. Elige «Guardar como PDF» "
        + "para descargar el reconocimiento, o «Imprimir» para una copia en papel. "
        + "Tip: tamaño de página «Horizontal» y gráficos de fondo activados.", "info", 7000);
      setTimeout(function () { window.print(); }, 400);
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
    h += '<h3>Reconocimiento válido</h3>';
    h += '<p class="texto-suave">Emitido el ' + A.esc(A.fechaLarga(d.fecha)) + '</p>';
    h += '<div class="info-certificado" style="text-align:left">';
h += '<div class="info-cert"><span>Código</span><strong>' + A.esc(d.codigo) + '</strong></div>';
    h += '<div class="info-cert"><span>Protocolo</span><strong>'
      + A.esc(d.protocoloNombre || "—") + '</strong></div>';
    h += '<div class="info-cert"><span>Participante</span><strong>' + A.esc(d.nombre) + '</strong></div>';
    if (d.cargo) h += '<div class="info-cert"><span>Cargo</span><strong>' + A.esc(d.cargo) + '</strong></div>';
    if (d.sede) h += '<div class="info-cert"><span>Sede</span><strong>' + A.esc(d.sede) + '</strong></div>';
    h += '<div class="info-cert"><span>Calificación</span><strong>' + A.esc(d.porcentaje) + ' %</strong></div>';
    h += '<div class="info-cert"><span>Intento</span><strong>' + A.esc(d.intento || "—") + '</strong></div>';
    h += '</div></div>';
    salida.innerHTML = h;
  }

  async function verificar() {
    const codigo = inp.value.trim().toUpperCase();
    if (!codigo) { A.aviso("Escribe el código de verificación.", "error"); return; }

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
          protocoloNombre: r.protocoloNombre || "",
          nombre: reg.nombre || r.correo,
          cargo: reg.cargo,
          sede: reg.sede,
          fecha: r.fecha,
          porcentaje: r.porcentaje,
          intento: r.intento
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
