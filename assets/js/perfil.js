/* =========================================================================
 * MI PERFIL — la persona puede corregir y ampliar sus datos
 * -------------------------------------------------------------------------
 * El nombre y el correo vienen de Google y no se editan a mano.
 * Todo lo demás (teléfono, dónde trabaja, a qué se dedica, sede y cargo)
 * sí se puede cambiar cuando la persona quiera.
 * ========================================================================= */
(function () {
  "use strict";

  const A = window.App;
  const C = window.CONFIG;
  const U = A.exigirRegistro();
  if (!U) return;

  const cont = document.getElementById("contenidoPerfil");
  const ficha = A.leerRegistro(U.correo) || {};
  const usuario = A.Sesion.leer() || {};

  function campo(id, etiqueta, valor, tipo, ayuda, autocomplete) {
    return `
      <div class="campo">
        <label for="${id}">${A.esc(etiqueta)}</label>
        <input type="${tipo || "text"}" id="${id}" name="${id}"
               value="${A.esc(valor || "")}"
               ${autocomplete ? `autocomplete="${autocomplete}"` : ""}>
        ${ayuda ? `<div class="ayuda">${A.esc(ayuda)}</div>` : ""}
      </div>`;
  }

  function selector(id, etiqueta, lista, valor, ayuda) {
    return `
      <div class="campo medio">
        <label for="${id}">${A.esc(etiqueta)} *</label>
        <select id="${id}" name="${id}">
          <option value="">Selecciona…</option>
          ${(lista || []).map(o =>
            `<option value="${A.esc(o)}" ${valor === o ? "selected" : ""}>${A.esc(o)}</option>`).join("")}
        </select>
        ${ayuda ? `<div class="ayuda">${A.esc(ayuda)}</div>` : ""}
      </div>`;
  }

  const resueltos = A.obtenerResultados(U.correo);
  const modulos = C.protocolos.reduce((s, p) => s + (p.modulos || []).length, 0);
  const leidos = A.modulosLeidos(U.correo).length;
  const aprobados = C.protocolos.filter(p => A.aproboProtocolo(U.correo, p.id)).length;
  const tiempoTotal = C.protocolos
    .flatMap(p => p.modulos || [])
    .reduce((s, n) => s + A.tiempoModulo(U.correo, n), 0);

  function minutos(total) {
    if (!total) return "0 min";
    if (total < 60) return total + " s";
    const m = Math.round(total / 60);
    return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + (m % 60) + " min";
  }

  cont.innerHTML = `
    <div class="tarjeta">
      <div class="caja-usuario">
        ${usuario.foto ? `<img src="${A.esc(usuario.foto)}" alt="" referrerpolicy="no-referrer">` : ""}
        <div>
          <strong>${A.esc(usuario.nombre || ficha.nombre || "")}</strong>
          <span>${A.esc(U.correo)}</span>
        </div>
      </div>

      <h2 style="margin-top:1.4rem">Editar mis datos</h2>
      <p class="texto-suave texto-peq">
        Tu nombre y tu correo los trae Google y no se pueden cambiar aquí.
        El resto sí lo puedes modificar y actualizar cuando quieras.
      </p>

      <form id="formPerfilEdit" novalidate>
        <div class="grilla-campos">
          ${campo("pNombreMostrado", "Cómo quieres que te llamen", ficha.nombreMostrado || usuario.nombre, "text",
            "Así te verá la coordinación en el registro.", "name")}
          ${selector("pSede", "Sede o punto de atención", C.sedes, ficha.sede,
            "Se muestra en el registro institucional.")}
          ${selector("pCargo", "Cargo", C.cargos, ficha.cargo)}
          ${campo("pDependencia", "Dónde trabajas (dependencia / servicio)", ficha.dependencia,
            "text", "Ej.: Urgencias, UCI, Consulta externa.")}
          ${campo("pProfesion", "A qué te dedicas", ficha.profesion,
            "text", "Ej.: enfermería, medicina, bacteriología, administración.")}
          ${campo("pTelefono", "Teléfono de contacto", ficha.telefono, "tel", "Opcional. Solo para avisos de la coordinación.", "tel")}
          ${campo("pHorario", "Horario en que asistes a la institución", ficha.horario, "text",
            "Opcional. Ej.: turno de mañana.")}
        </div>

        <div class="campo">
          <label for="pObservaciones">Algo más que quieras contar</label>
          <textarea id="pObservaciones" name="pObservaciones" rows="3"
            placeholder="Ej.: soy tutor de práctica, me interesa la parte de obstetricia.">${A.esc(ficha.observaciones || "")}</textarea>
        </div>

        <div class="acciones-resultado" style="justify-content:flex-start">
          <button type="submit" class="btn">Guardar cambios</button>
          <a href="protocolos.html" class="btn btn-borde">Volver a los protocolos</a>
        </div>
      </form>
    </div>

    <div class="tarjeta">
      <h2>Mi avance</h2>
      <div class="datos-curso" style="margin:.6rem 0 0">
        <div class="dato"><strong>${leidos}/${modulos}</strong><span>Módulos leídos</span></div>
        <div class="dato"><strong>${aprobados}/${C.protocolos.length}</strong><span>Protocolos aprobados</span></div>
        <div class="dato"><strong>${resueltos.length}</strong><span>Intentos realizados</span></div>
        <div class="dato"><strong>${A.esc(minutos(tiempoTotal))}</strong><span>Tiempo de estudio</span></div>
      </div>
    </div>`;

  const form = document.getElementById("formPerfilEdit");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const sede = document.getElementById("pSede").value.trim();
    const cargo = document.getElementById("pCargo").value.trim();

    if (!sede || !cargo) {
      A.aviso("Elige tu sede y tu cargo: son los datos que pide la institución.", "error");
      return;
    }

    const datos = {
      nombreMostrado: document.getElementById("pNombreMostrado").value.trim(),
      sede: sede,
      cargo: cargo,
      dependencia: document.getElementById("pDependencia").value.trim(),
      profesion: document.getElementById("pProfesion").value.trim(),
      telefono: document.getElementById("pTelefono").value.trim(),
      horario: document.getElementById("pHorario").value.trim(),
      observaciones: document.getElementById("pObservaciones").value.trim(),
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    A.guardarRegistro(U.correo, datos);

    const remoto = await A.Remoto.registrarParticipante(
      Object.assign({ correo: U.correo, nombre: datos.nombreMostrado || U.nombre }, datos)
    );

    btn.disabled = false;

    if (remoto && remoto.ok === false && remoto.motivo !== "deshabilitado") {
      A.aviso("Se guardó en este navegador, pero no llegó al registro central. "
        + "Motivo: " + (remoto.motivo || remoto.bruto || "desconocido"), "error", 8000);
      return;
    }

    A.aviso("Datos actualizados ✓", "ok");
  });
})();