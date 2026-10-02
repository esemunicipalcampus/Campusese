/* =========================================================================
 * BANCO DE PREGUNTAS
 * ESE Municipal de Villavicencio × Universidad de los Llanos
 * -------------------------------------------------------------------------
 * Las 30 preguntas son las que aparecen textualmente en los documentos de
 * evaluación institucionales:
 *
 *   · "Evaluación manejo de Código Azul y carro de paro"
 *       (EVALUACIÓN MANEJO DE CÓDIGO AZUL Y CARRO DE PARO.docx)
 *       I.  Código Azul ............ 10 preguntas
 *       II. Carro de paro ......... 10 preguntas
 *
 *   · "Evaluación – Ronda de Seguridad y Recibo y Entrega de Turno"
 *       (Evaluación entrega de turno y ronda de seguridad.docx)
 *       Ronda de seguridad ........ 5 preguntas
 *       Recibo y entrega de turno . 5 preguntas
 *
 * Cada protocolo tiene un solo tema de evaluación. Los módulos de estudio son
 * más extensos y alimentan esos temas.
 * ========================================================================= */

window.TEMAS = [

  /* ================================================================== */
  /* 1) CÓDIGO AZUL — 10 preguntas                                      */
  /* ================================================================== */
  {
    id: "codigo-azul",
    protocolo: "codigo-azul",
    numero: 1,
    titulo: "Código Azul",
    documento: "Evaluación manejo de Código Azul y carro de paro — sección I",
    preguntas: [
      {
        enunciado: "¿Cuál es el objetivo principal del Código Azul dentro de una institución de salud?",
        opciones: [
          "Realizar seguimiento administrativo a pacientes hospitalizados.",
          "Activar un sistema de respuesta inmediata ante pacientes en paro cardiorrespiratorio o con riesgo inminente de presentarlo.",
          "Controlar exclusivamente los medicamentos utilizados en urgencias.",
          "Coordinar el traslado de pacientes a otra institución.",
        ],
        correcta: 1,
        explicacion: "El Código Azul es el mecanismo de respuesta inmediata ante un paro cardiorrespiratorio o un riesgo inminente de paro. Lo demás describes funciones administrativas o de apoyo.",
      },
      {
        enunciado: "¿Quién puede realizar la activación del Código Azul cuando identifica un paciente en paro cardiorrespiratorio?",
        opciones: [
          "Únicamente el médico de urgencias.",
          "Exclusivamente el coordinador del servicio.",
          "Cualquier funcionario que sospeche o confirme un paro cardiorrespiratorio.",
          "Solamente el personal administrativo.",
        ],
        correcta: 2,
        explicacion: "La activación es abierta a todo el personal: cualquiera que sospeche o confirme un paro cardiorrespiratorio puede activar el Código Azul. No espera autorización.",
      },
      {
        enunciado: "¿Cuáles son los mecanismos establecidos para activar el Código Azul?",
        opciones: [
          "Llamada telefónica externa y correo institucional.",
          "Timbre ubicado en urgencias o voz de alerta diciendo “Código Azul”.",
          "Solicitud escrita en historia clínica.",
          "Activación únicamente por orden médica.",
        ],
        correcta: 1,
        explicacion: "Los mecanismos previstos son el timbre en urgencias o la voz de alerta “Código Azul”, para que el equipo responda sin originator una orden escrita.",
      },
      {
        enunciado: "Dentro del equipo de Código Azul, ¿cuál es la función principal del Médico 1 (Urgencias)?",
        opciones: [
          "Registrar los medicamentos utilizados durante la reanimación.",
          "Realizar únicamente la monitorización del paciente.",
          "Dirigir la RCP, ordenar medicamentos, realizar procedimientos avanzados y tomar decisiones durante la reanimación.",
          "Realizar exclusivamente la canalización de accesos venosos.",
        ],
        correcta: 2,
        explicacion: "El Médico 1 dirige la reanimación: ordena medicamentos, ejecuta procedimientos avanzados y toma decisiones clínicas durante el evento.",
      },
      {
        enunciado: "Durante el Código Azul, ¿cuál es una función del profesional de enfermería?",
        opciones: [
          "Realizar únicamente el traslado del paciente.",
          "Monitorizar al paciente, preparar, rotular y administrar medicamentos, informando la aplicación de estos.",
          "Realizar la auditoría mensual del carro de paro.",
          "Elaborar las fórmulas médicas.",
        ],
        correcta: 1,
        explicacion: "Enfermería monitoriza al paciente, prepara, rotula y administra los medicamentos, y deja constancia de cada aplicación realizada.",
      },
      {
        enunciado: "En la reanimación cardiopulmonar básica del adulto, la frecuencia recomendada de compresiones torácicas es:",
        opciones: [
          "60 a 80 compresiones por minuto.",
          "80 a 100 compresiones por minuto.",
          "100 a 120 compresiones por minuto.",
          "120 a 150 compresiones por minuto.",
        ],
        correcta: 2,
        explicacion: "La recomendación es de 100 a 120 compresiones torácicas por minuto, con profundidad y ritmo que permitan una reanimación eficaz.",
      },
      {
        enunciado: "En un paciente adulto sin vía aérea avanzada, la relación recomendada de compresiones y ventilaciones durante RCP básica es:",
        opciones: [
          "15 compresiones por 1 ventilación.",
          "30 compresiones por 2 ventilaciones.",
          "50 compresiones por 5 ventilaciones.",
          "10 compresiones por 2 ventilaciones.",
        ],
        correcta: 1,
        explicacion: "En RCP básica de adulto sin vía aérea avanzada la relación es 30 compresiones por 2 ventilaciones.",
      },
      {
        enunciado: "Durante la RCP en una mujer gestante después de las 20 semanas, una modificación importante es:",
        opciones: [
          "Suspender las compresiones torácicas.",
          "Realizar compresiones únicamente abdominales.",
          "Realizar desplazamiento manual del útero hacia la izquierda para disminuir la compresión aortocava.",
          "Evitar todo tipo de ventilación.",
        ],
        correcta: 2,
        explicacion: "Después de las 20 semanas el útero comprime la vena cava en decúbito supino; desplazar el útero hacia la izquierda mejora el retorno venoso y la eficacia de las compresiones.",
      },
      {
        enunciado: "En pacientes con vía aérea avanzada durante RCP, la ventilación recomendada es:",
        opciones: [
          "1 ventilación cada 6 segundos.",
          "5 ventilaciones cada 10 segundos.",
          "20 ventilaciones por minuto.",
          "Ventilación únicamente después de cada compresión.",
        ],
        correcta: 0,
        explicacion: "Con vía aérea avanzada se ventila 1 vez cada 6 segundos (unas 10 por minuto), sin necesidad de sincronizar la ventilación con cada compresión.",
      },
      {
        enunciado: "La cadena de supervivencia es importante porque:",
        opciones: [
          "Permite disminuir únicamente el tiempo administrativo de atención.",
          "Organiza las acciones necesarias desde el reconocimiento del paro hasta los cuidados posteriores, aumentando las posibilidades de supervivencia.",
          "Reemplaza el entrenamiento del personal sanitario.",
          "Solo aplica para pacientes pediátricos.",
        ],
        correcta: 1,
        explicacion: "La cadena de supervivencia ordena las acciones desde el reconocimiento del paro hasta los cuidados posteriores; seguirla en orden aumenta la supervivencia.",
      },
    ],
  },

  /* ================================================================== */
  /* 2) CARRO DE PARO — 10 preguntas                                    */
  /* ================================================================== */
  {
    id: "carro-paro",
    protocolo: "carro-paro",
    numero: 2,
    titulo: "Carro de Paro",
    documento: "Evaluación manejo de Código Azul y carro de paro — sección II",
    preguntas: [
      {
        enunciado: "El carro de paro se define como:",
        opciones: [
          "Un equipo destinado únicamente al almacenamiento de medicamentos vencidos.",
          "Una unidad móvil que integra equipos, medicamentos e insumos necesarios para atender emergencias y Código Azul.",
          "Un equipo utilizado exclusivamente para transporte de pacientes.",
          "Un elemento administrativo del servicio.",
        ],
        correcta: 1,
        explicacion: "Es una unidad móvil que reúne equipos, medicamentos e insumos para atender urgencias vitales y la activación del Código Azul.",
      },
      {
        enunciado: "La disponibilidad, funcionalidad y actualización del carro de paro son importantes porque:",
        opciones: [
          "Permiten cumplir únicamente requisitos administrativos.",
          "Determinan la rapidez y efectividad de la respuesta durante una emergencia vital.",
          "Evitan realizar auditorías institucionales.",
          "Reemplazan la capacitación del personal.",
        ],
        correcta: 1,
        explicacion: "Si el carro no está disponible, funcional y actualizado, la respuesta ante una emergencia vital se vuelve lenta o ineficaz.",
      },
      {
        enunciado: "¿Cuál es el propósito del acta de apertura del carro de paro?",
        opciones: [
          "Registrar únicamente la fecha de mantenimiento del equipo biomédico.",
          "Documentar los insumos y medicamentos utilizados durante una urgencia vital y dejar trazabilidad del proceso.",
          "Solicitar nuevos equipos tecnológicos.",
          "Registrar la asistencia del personal.",
        ],
        correcta: 1,
        explicacion: "El acta de apertura deja trazabilidad de lo utilizado en la urgencia: insumos, medicamentos, pendientes por reponer, observaciones y responsables.",
      },
      {
        enunciado: "Cuando se realiza una apertura del carro de paro, debe registrarse:",
        opciones: [
          "Únicamente el nombre del paciente.",
          "Fecha de apertura, insumos utilizados, medicamentos utilizados, pendientes por reponer, observaciones y responsables.",
          "Solo el diagnóstico médico.",
          "Solamente los medicamentos administrados.",
        ],
        correcta: 1,
        explicacion: "El registro debe ser completo: fecha, insumos y medicamentos usados, pendientes por reponer, observaciones y responsables de la reposición.",
      },
      {
        enunciado: "¿Cuál es una responsabilidad del enfermero(a) frente al carro de paro?",
        opciones: [
          "Realizar exclusivamente la prescripción médica.",
          "Garantizar control, apertura, existencia según stock y acompañamiento en auditorías del carro de paro.",
          "Realizar únicamente la limpieza del carro.",
          "Autorizar compras institucionales.",
        ],
        correcta: 1,
        explicacion: "Enfermería garantiza el control, la apertura, la existencia según stock y el acompañamiento en las auditorías del carro de paro.",
      },
      {
        enunciado: "¿Cuál de los siguientes equipos hace parte de los recursos tecnológicos del carro de paro?",
        opciones: [
          "Computador administrativo.",
          "Desfibrilador con capacidad de monitorización y marcapasos.",
          "Equipo de radiología.",
          "Ecógrafo portátil únicamente.",
        ],
        correcta: 1,
        explicacion: "El desfibrilador con monitorización y marcapasos es parte de los recursos tecnológicos del carro de paro.",
      },
      {
        enunciado: "Si el carro de paro se encuentra sellado y sin evidencia de apertura:",
        opciones: [
          "Debe abrirse diariamente para verificar medicamentos.",
          "Debe permanecer sellado y realizar la anotación correspondiente como carro sellado.",
          "Debe retirarse del servicio.",
          "Debe cambiarse todo su contenido.",
        ],
        correcta: 1,
        explicacion: "Un carro sellado se deja sellado y se anota como tal; abrirlo a diario para verificar medications defeats su propósito de resguardo.",
      },
      {
        enunciado: "La revisión mensual del carro de paro permite:",
        opciones: [
          "Verificar existencias, vencimientos y actas de apertura para garantizar disponibilidad adecuada.",
          "Cambiar todos los medicamentos mensualmente.",
          "Suspender las auditorías institucionales.",
          "Eliminar los formatos de control.",
        ],
        correcta: 0,
        explicacion: "La revisión mensual verifica existencias, vencimientos y actas de apertura, para garantizar que el carro esté disponible y completo.",
      },
      {
        enunciado: "¿Qué talento humano debe estar capacitado y actualizado en soporte vital según su nivel de competencia?",
        opciones: [
          "Únicamente personal administrativo.",
          "Médico, enfermera, auxiliares de enfermería, regente y auxiliar de farmacia.",
          "Solamente personal de mantenimiento.",
          "Únicamente pacientes y familiares.",
        ],
        correcta: 1,
        explicacion: "La actualización en soporte vital alcanza a médicos, enfermeras, auxiliares de enfermería, regentes y auxiliares de farmacia, según su nivel de competencia.",
      },
      {
        enunciado: "El manejo adecuado del carro de paro contribuye principalmente a:",
        opciones: [
          "Mejorar procesos administrativos sin impacto clínico.",
          "Garantizar una respuesta segura, organizada y oportuna ante emergencias clínicas.",
          "Disminuir la necesidad de capacitación del personal.",
          "Reemplazar los protocolos de reanimación.",
        ],
        correcta: 1,
        explicacion: "Un carro de paro bien manejado garantiza una respuesta segura, organizada y oportuna ante las emergencias clínicas.",
      },
    ],
  },

  /* ================================================================== */
  /* 3) RONDA DE SEGURIDAD — 5 preguntas                                */
  /* ================================================================== */
  {
    id: "ronda-seguridad",
    protocolo: "ronda-seguridad",
    numero: 3,
    titulo: "Ronda de Seguridad",
    documento: "Evaluación – Ronda de Seguridad y Recibo y Entrega de Turno",
    preguntas: [
      {
        enunciado: "¿Cuál es el objetivo principal de la ronda de seguridad?",
        opciones: [
          "Capacitar al personal nuevo.",
          "Evaluar el desempeño laboral.",
          "Realizar seguimiento al cumplimiento de la política y las buenas prácticas de seguridad del paciente.",
          "Controlar el inventario de medicamentos.",
        ],
        correcta: 2,
        explicacion: "La ronda de seguridad da seguimiento al cumplimiento de la política y de las buenas prácticas de seguridad del paciente. No evalúa desempeño ni inventarios.",
      },
      {
        enunciado: "¿Qué permite identificar una ronda de seguridad durante su ejecución?",
        opciones: [
          "Únicamente fallas administrativas.",
          "Riesgos e incidentes relacionados con la seguridad del paciente.",
          "Costos de atención.",
          "Horarios del personal.",
        ],
        correcta: 1,
        explicacion: "Durante la ronda se identifican riesgos e incidentes de seguridad del paciente; las fallas administrativas pueden原稿arse, pero no son el objetivo.",
      },
      {
        enunciado: "¿Con qué frecuencia mínima deben realizarse las rondas de seguridad en los centros de salud de 24 horas?",
        opciones: [
          "Semanal.",
          "Quincenal.",
          "Mensual.",
          "Trimestral.",
        ],
        correcta: 2,
        explicacion: "En los centros de salud con atención de 24 horas la periodicidad mínima es mensual.",
      },
      {
        enunciado: "¿En qué formato debe dejarse constancia de la realización de la ronda de seguridad?",
        opciones: [
          "FR-120-10.",
          "FR-130-35.",
          "FR-200-01.",
          "FR-150-22.",
        ],
        correcta: 1,
        explicacion: "La constancia de la ronda de seguridad se deja en el formato FR-130-35.",
      },
      {
        enunciado: "Después de identificar incumplimientos durante la ronda, ¿qué acción debe realizarse?",
        opciones: [
          "Archivar el informe sin seguimiento.",
          "Suspender el servicio.",
          "Establecer oportunidades de mejora y hacer seguimiento en la siguiente ronda.",
          "Cambiar inmediatamente al personal.",
        ],
        correcta: 2,
        explicacion: "Los hallazgos se convierten en oportunidades de mejora, que se verifican en la ronda siguiente. El informe nunca se archiva sin seguimiento.",
      },
    ],
  },

  /* ================================================================== */
  /* 4) RECIBO Y ENTREGA DE TURNO — 5 preguntas                        */
  /* ================================================================== */
  {
    id: "entrega-turno",
    protocolo: "entrega-turno",
    numero: 4,
    titulo: "Recibo y Entrega de Turno",
    documento: "Evaluación – Ronda de Seguridad y Recibo y Entrega de Turno",
    preguntas: [
      {
        enunciado: "¿Cuál es el propósito principal del procedimiento de recibo y entrega de turno?",
        opciones: [
          "Reducir el tiempo del cambio de turno.",
          "Estandarizar la entrega y el recibo de turno para garantizar la continuidad del servicio.",
          "Controlar el ingreso de visitantes.",
          "Evaluar el rendimiento del personal.",
        ],
        correcta: 1,
        explicacion: "El procedimiento estandariza el recibo y la entrega de turno para garantizar la continuidad del servicio. Acortar el tiempo sin estandarizar va en contra del objetivo.",
      },
      {
        enunciado: "Antes de entregar el turno, ¿qué debe hacer el personal con la historia clínica del paciente?",
        opciones: [
          "Archivar únicamente la evolución.",
          "Completar detalladamente los registros clínicos y actualizar el kardex.",
          "Entregarla al paciente.",
          "Revisarla solo si hay novedades.",
        ],
        correcta: 1,
        explicacion: "Antes de entregar el turno la historia clínica debe estar completa y el kardex actualizado, para que quien recibe tenga toda la información.",
      },
      {
        enunciado: "Antes de finalizar el cambio de turno, ¿qué debe hacer el personal de enfermería?",
        opciones: [
          "Retirarse cuando termine de entregar la información.",
          "Esperar a que el médico autorice la salida.",
          "Permanecer hasta finalizar completamente el recibo y la entrega del turno.",
          "Entregar únicamente el inventario de equipos.",
        ],
        correcta: 2,
        explicacion: "El turno no se cierra hasta completar el recibo y la entrega; retirarse antes deja sin cobertura al equipo que recibe.",
      },
      {
        enunciado: "¿Qué debe realizar el personal antes de entregar el turno para verificar el estado de los pacientes?",
        opciones: [
          "Una auditoría documental.",
          "Una pre-ronda.",
          "Un inventario administrativo.",
          "Una reunión con familiares.",
        ],
        correcta: 1,
        explicacion: "La pre-ronda permite revisar en conjunto el estado de los pacientes antes de entregar el turno.",
      },
      {
        enunciado: "Durante el cambio de turno, ¿qué elemento debe entregarse con revisión detallada e inventario?",
        opciones: [
          "Carro de aseo.",
          "Carro de alimentos.",
          "Carro de paro.",
          "Archivo clínico.",
        ],
        correcta: 2,
        explicacion: "El carro de paro se entrega con revisión detallada e inventario, porque su contenido es equipo crítico para la respuesta ante emergencias.",
      },
    ],
  },
];

/* =========================================================================
 * API DEL BANCO DE PREGUNTAS
 * ========================================================================= */
window.BancoPreguntas = {
  temas: window.TEMAS,

  /** Devuelve el total de preguntas de la evaluación. */
  total() {
    return window.TEMAS.reduce((n, t) => n + t.preguntas.length, 0);
  },

  /** Devuelve las preguntas de un tema por su id. */
  porTema(idTema) {
    const t = window.TEMAS.find(x => x.id === idTema);
    return t ? t.preguntas : [];
  },

  /** Suma de preguntas de una lista de temas (o de un solo protocolo). */
  totalDeTemas(ids) {
    return window.TEMAS.reduce((n, t) => ids.includes(t.id) ? n + t.preguntas.length : n, 0);
  },

  /** Aplana el banco asignando un id único y un número global a cada pregunta. */
  aplanar() {
    const lista = [];
    let n = 0;
    for (const tema of window.TEMAS) {
      for (const p of tema.preguntas) {
        lista.push({
          ref: "P" + String(++n).padStart(3, "0"),
          temaId: tema.id,
          temaNumero: tema.numero,
          temaTitulo: tema.titulo,
          enunciado: p.enunciado,
          opciones: p.opciones,
          correcta: p.correcta,
          explicacion: p.explicacion,
        });
      }
    }
    return lista;
  },

  /** Baraja las opciones de forma determinista según una semilla numérica. */
  barajarOpciones(opciones, correcta, semilla) {
    const indices = opciones.map((_, i) => i);
    let s = semilla || 1;
    for (let i = indices.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) % 2147483648;
      const j = s % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return {
      opciones: indices.map(i => opciones[i]),
      correcta: indices.indexOf(correcta),
    };
  },
};