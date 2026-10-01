/* =========================================================================
 * CONTENIDO DEL CURSO
 * Transcrito de los cuatro procedimientos de la ESE Municipal de Villavicencio:
 *   · Procedimiento de Código Azul
 *   · Procedimiento de manejo de carro de paro
 *   · Procedimiento para recibo y entrega de turno de enfermería en urgencias
 *   · Procedimiento para ronda de seguridad
 *
 * Cada módulo lleva el temaId del banco de preguntas con el que se evalúa.
 * =========================================================================
 */

window.CURSO = {

  /* Datos de los autores de los procedimientos */
  autores: [
    { nombre: "Jesús Enrique Correa Guarín", cargo: "Ruralito Unillanos" },
    { nombre: "Erlis Tobón", cargo: "Líder Coordinadora — Centro de Salud Recreo" },
  ],

  /* ====================================================================
   * MÓDULOS
   * ================================================================= */
  modulos: [

    /* ---------------------------------------------------------------
     * MÓDULO 1
     * ------------------------------------------------------------- */
    {
      numero: 1,
      temaId: "codigo-azul-organizacion",
      titulo: "Código Azul",
      subtitulo: "Definición, activación y conformación del equipo de respuesta",
      icono: "🚨",
      fuente: "Procedimiento de Código Azul — págs. 2 a 5",
      secciones: [
        {
          titulo: "Objetivo",
          parrafos: [
            "Contar con una guía estandarizada para lograr una respuesta eficiente, efectiva y oportuna ante el paciente que presenta paro cardiorrespiratorio.",
            "Permite distribuir las funciones del equipo interdisciplinario y establecer previamente las especificaciones de las maniobras, medicamentos, equipos y ayudas necesarias para el proceso de reanimación cardiovascular, con el propósito de disminuir la morbimortalidad a corto y largo plazo."
          ]
        },
        {
          titulo: "Alcance y responsables",
          parrafos: [
            "El protocolo inicia desde el momento en que se encuentra un paciente en paro cardiorrespiratorio, se activa el Código Azul y finaliza cuando: se estabilizan las funciones vitales del paciente, o se produce el fallecimiento del paciente.",
            "La activación puede realizarla el funcionario que sospeche o confirme un paro cardiorrespiratorio."
          ],
          aviso: {
            tipo: "clave",
            titulo: "Punto clave",
            texto: "La activación del Código Azul NO está reservada a una sola profesión. Cualquier funcionario que sospeche o confirme un paro cardiorrespiratorio puede activarlo."
          },
          lista: [
            "La activación se realiza mediante: timbre ubicado en la sala de atención de urgencias, o voz de alerta diciendo «CÓDIGO AZUL».",
            "El objetivo de la activación es convocar de manera inmediata al equipo de respuesta."
          ]
        },
        {
          titulo: "Conformación del equipo",
          subtitulo: "Funciones asignadas previamente por rol",
          tabla: {
            columnas: ["Integrante", "Función asignada"],
            filas: [
              ["Médico 1 (Urgencias)", "Dirige la RCP, hiperventilación, intubación y verificación de la posición del tubo. Ordena administrar medicamentos, toma decisiones fundamentales y lleva la cuenta del tiempo (cronómetro)."],
              ["Médico 2 (Hospitalización)", "Realiza compresiones torácicas, cardioversión o desfibrilación dado el caso, y valora cada 2 minutos la respuesta del paciente al tratamiento."],
              ["Profesional de Enfermería", "Monitorización del paciente; envasa, rotula y administra los medicamentos e informa en voz alta la aplicación de los mismos. Posteriormente a la administración pasan 20 o 30 cc de líquidos intravenosos a chorro, inmediatamente levantando el miembro donde se encuentra canalizado."],
              ["Auxiliar 1 (Urgencias)", "Canaliza accesos venosos periféricos e inicia líquidos intravenosos. Apoya al Médico 2. Intercambia el turno de compresiones cada 2 minutos (ciclo completo compresión / ventilación)."],
              ["Auxiliar 2 (Rotatoria)", "Apoya en la monitorización de los signos vitales. Apoya y asiste al Médico 1 en: ventilaciones con bolsa de ventilación mecánica (BVM), succión, intubación, fuente de oxígeno, fijación de tubo y asistencia ventilatoria."],
              ["Auxiliar 3", "Se encarga de registrar en la historia clínica, revisar en el libro y en el carro de paro los consumos, e informar al médico para la elaboración de las respectivas fórmulas."]
            ]
          }
        },
        {
          titulo: "Definiciones operativas",
          tabla: {
            columnas: ["Término", "Definición"],
            filas: [
              ["Código Azul", "Sistema de alarma que se activa mediante un timbre o voz para convocar al equipo de profesionales y auxiliares de salud con funciones previamente asignadas para manejar pacientes en paro cardiorrespiratorio."],
              ["Triage Uno", "Paciente con riesgo inminente de perder la vida, cuadro agudo crítico o inestable y que requiere atención inmediata."],
              ["Paro cardiorrespiratorio", "Interrupción brusca y potencialmente reversible de la respiración espontánea que puede conducir a paro cardíaco y/o respiratorio."],
              ["RCCP", "Conjunto de maniobras realizadas para restablecer la oxigenación, ventilación y circulación de forma eficaz, logrando la restauración de funciones vitales."],
              ["Soporte Vital Básico (SVB)", "Conjunto de maniobras realizadas para comprobar y mantener las funciones esenciales, incluyendo intervenciones como desfibrilación y manejo de la vía aérea cuando corresponda."],
              ["Soporte Vital Avanzado (SVA)", "Actividades realizadas por profesionales capacitados que incluyen manejo avanzado de vía aérea, administración de medicamentos y tratamiento de los diferentes ritmos de paro."]
            ]
          }
        },
        {
          titulo: "Recursos del procedimiento",
          columnas: [
            {
              titulo: "Maquinaria y tecnología",
              items: ["Carro de paro", "Desfibrilador", "Succionador", "Bala de oxígeno con manómetro"]
            },
            {
              titulo: "Materiales o logística",
              items: ["Servicio de urgencias", "Sala de partos", "Servicio de hospitalización", "Ver instructivo y stock del carro de paro"]
            },
            {
              titulo: "Metodológicos",
              items: ["Aspectos destacados de la actualización de las guías de la AHA para RCP y ACE, año 2015", "Protocolo actual"]
            }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 2
     * ------------------------------------------------------------- */
    {
      numero: 2,
      temaId: "rcp-basica-adulto",
      titulo: "Reanimación Cardiopulmonar Básica en el Adulto",
      subtitulo: "Valoración inicial, compresiones torácicas y ventilación",
      icono: "🫀",
      fuente: "Procedimiento de Código Azul — págs. 7 y 8",
      secciones: [
        {
          titulo: "Cadena de supervivencia",
          parrafos: [
            "Los cuidados del paciente post-paro cardíaco comienzan desde el lugar donde ocurre el paro. El protocolo resalta la cadena de supervivencia como el secuencia organizada que integra todas las actuaciones desde el reconhecimento del evento hasta los cuidados posteriores."
          ]
        },
        {
          titulo: "¿Qué comprende la RCP básica?",
          lista: [
            "Identificar pacientes con situación clínica de paro cardíaco y/o respiratorio.",
            "Comprobar estado de conciencia: se debe identificar el grado de respuesta del paciente estimulándolo táctilmente y hablándole en voz alta; el procedimiento no debe superar los 10 segundos.",
            "Confirmar si hay respiración, si es normal o con dificultad, observando el movimiento torácico.",
            "Circulación: comprobar el pulso carotídeo durante 5 a 10 segundos; si no hay pulso, iniciar las compresiones torácicas con una relación de 30 compresiones por 2 ventilaciones."
          ]
        },
        {
          titulo: "Compresiones torácicas",
          lista: [
            "Comprimir en la mitad inferior del esternón, fuerte y rápido.",
            "Frecuencia: de 100 a 120 compresiones por minuto.",
            "Profundidad: de al menos 5 cm (2 pulgadas) en adultos, sin sobrepasar los 6 cm.",
            "Permitir una adecuada expansión torácica completa después de cada compresión, evitando apoyarse sobre el tórax entre las compresiones.",
            "Cambiar de reanimador cada 2 minutos para evitar la fatiga del reanimador.",
            "Minimizar las interrupciones con el objetivo de alcanzar la mayor fracción de compresión torácica posible, de al menos el 60 %."
          ],
          aviso: {
            tipo: "dato",
            titulo: "Cifras clave",
            texto: "100–120 por minuto · profundidad 5–6 cm · relación 30:2 · cambio de reanimador cada 2 min · fracción de compresión ≥ 60 %."
          }
        },
        {
          titulo: "Ventilación",
          parrafos: [
            "La ventilación se realiza mediante la insuflación de aire espirado, que contiene un 90 – 100 % de O₂, a través de los procedimientos boca a boca o mediante la bolsa-válvula-mascarilla (BVM).",
            "La duración de cada insuflación debe ser de unos 2 segundos, confirmando cada vez la elevación torácica, lo que significa que un volumen corriente que oscila entre 800 y 1.200 cc.",
            "En pacientes a los que se les está realizando una RCP y tengan colocado un dispositivo avanzado para la vía aérea, se recomienda una frecuencia de ventilación simplificada de 1 ventilación cada 6 segundos (10 ventilaciones por minuto)."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 3
     * ------------------------------------------------------------- */
    {
      numero: 3,
      temaId: "rcp-mujer-gestante",
      titulo: "RCP en la Mujer Gestante",
      subtitulo: "Ajuste de las maniobras por los cambios fisiológicos del embarazo",
      icono: "🤰",
      fuente: "Procedimiento de Código Azul — pág. 10",
      secciones: [
        {
          titulo: "Consideraciones fisiológicas",
          parrafos: [
            "Durante el embarazo, los cambios fisiológicos maternos requieren ajustes en las maniobras de reanimación para evitar la compresión aortocava causada por el útero gestante, especialmente después de las 20 semanas de gestación."
          ]
        },
        {
          titulo: "Maniobras recomendadas",
          tabla: {
            columnas: ["Parámetro", "Indicación"],
            filas: [
              ["Compresiones", "100 a 120 por minuto"],
              ["Ventilaciones", "30:2"],
              ["Desplazamiento manual", "Del útero hacia la izquierda (LUD), para disminuir la presión sobre grandes vasos"],
              ["Apoyo", "Bajo el flanco derecho y la cadera (toallas enrolladas, bolsas intravenosas o dispositivos de soporte)"],
              ["Posición de las manos", "Compresiones torácicas en una posición más cefálica del esternón"],
              ["A evitar", "Inclinaciones laterales excesivas, ya que pueden disminuir la eficacia de las compresiones"]
            ]
          }
        },
        {
          titulo: "Histerotomía de emergencia",
          parrafos: [
            "Si no se logra retorno de circulación espontánea después de 4 minutos de RCP avanzada (ACLS), considerar histerotomía de emergencia (cesárea perimortem) como parte de los esfuerzos de reanimación.",
            "Objetivo principal: liberar la compresión aortocava y mejorar la efectividad de la reanimación materna y fetal."
          ],
          aviso: {
            tipo: "alerta",
            titulo: "Punto de decisión",
            texto: "El punto de corte son los 4 minutos de RCP avanzada. Superado ese tiempo sin retorno de circulación espontánea, debe considerarse la cesárea perimortem."
          }
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 4
     * ------------------------------------------------------------- */
    {
      numero: 4,
      temaId: "rcp-pediatrica-neonatal",
      titulo: "RCP Pediátrica y Neonatal",
      subtitulo: "Frecuencia, profundidad y ventilación por grupo etario",
      icono: "👶",
      fuente: "Procedimiento de Código Azul — págs. 11 y 12",
      secciones: [
        {
          titulo: "RCP pediátrica",
          lista: [
            "Comprimir el centro del tórax a una frecuencia de 100 a 120 compresiones por minuto.",
            "La profundidad debe ser de un tercio del diámetro anteroposterior del tórax (aproximadamente 4 cm en lactantes y 5 cm en niños mayores).",
            "Permitir la expansión torácica completa y minimizar las interrupciones a menos de 10 segundos.",
            "Oxigenación: ventilación con bolsa-válvula-mascarilla utilizando oxígeno al 100 %.",
            "Dispositivos avanzados: colocación de cánula orofaríngea, mascarilla laríngea o intubación endotraqueal (IT), según la pericia del equipo."
          ],
          subtituloRelacion: "Relación compresión-ventilación (sin vía aérea avanzada)",
          tabla: {
            columnas: ["Escenario", "Relación"],
            filas: [
              ["Un solo reanimador", "30:2"],
              ["Dos o más reanimadores", "15:2"]
            ]
          }
        },
        {
          titulo: "Ventilación con vía aérea avanzada (pediátrica)",
          parrafos: [
            "Una vez intubado el paciente, las compresiones se vuelven continuas (100–120 por minuto) y se ventila de forma independiente, sin sincronizar con las compresiones."
          ],
          tabla: {
            columnas: ["Grupo etario", "Frecuencia de ventilación"],
            filas: [
              ["Lactantes (menores de 1 año)", "20 a 25 ventilaciones por minuto"],
              ["Niños (1 a 8 años)", "20 ventilaciones por minuto"],
              ["Niños mayores y adolescentes", "10 a 15 ventilaciones por minuto"]
            ]
          }
        },
        {
          titulo: "RCP neonatal",
          lista: [
            "Usa dos dedos (el índice y el medio) en el centro del esternón, justo debajo de la línea imaginaria entre las tetillas. Si hay dos reanimadores, se prefiere la técnica de abrazar el tórax con las dos manos y usar los dos pulgares.",
            "Profundidad: comprime al menos un tercio del tórax (unos 4 cm).",
            "Frecuencia: de 100 a 120 compresiones por minuto.",
            "Oxigenación: ventilación con bolsa-válvula-mascarilla utilizando oxígeno al 100 %.",
            "Dispositivos avanzados: cánula orofaríngea, mascarilla laríngea o intubación endotraqueal según la pericia del equipo.",
            "Con vía aérea avanzada: lactantes (menores de 1 año) 20 a 25 ventilaciones por minuto."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 5
     * ------------------------------------------------------------- */
    {
      numero: 5,
      temaId: "cadena-supervivencia",
      titulo: "Cadena de Supervivencia y Cuidados Posteriores",
      subtitulo: "Organización de las acciones desde el reconocimiento del paro",
      icono: "⛓️",
      fuente: "Procedimiento de Código Azul — págs. 6, 7, 13 a 19",
      secciones: [
        {
          titulo: "Por qué es importante la cadena de supervivencia",
          parrafos: [
            "Los cuidados del paciente post-paro cardíaco comienzan desde el lugar donde ocurre el paro. La cadena de supervivencia organiza las acciones necesarias desde el reconocimiento del paro hasta los cuidados posteriores, aumentando las posibilidades de supervivencia.",
            "El protocolo incluye los algoritmos de referencia quezgApproved deben consultarse para la atención: algoritmo de paro cardíaco en adultos, algoritmo de soporte vital básico pediátrico, algoritmo de reanimación neonatal, algoritmo de paro cardíaco durante el embarazo y algoritmo de atención para después de un paro cardíaco."
          ]
        },
        {
          titulo: "Algoritmos de referencia del procedimiento",
          tabla: {
            columnas: ["Algoritmo", "Población / situación"],
            filas: [
              ["Paro cardíaco en adultos", "Paciente adulto"],
              ["Soporte vital básico pediátrico", "Lactante, niño y adolescente"],
              ["Reanimación neonatal", "Recién nacido"],
              ["Paro cardíaco durante el embarazo", "Mujer gestante"],
              ["Atención después de un paro cardíaco", "Paciente con retorno de circulación espontánea"]
            ]
          },
          nota: "Estos algoritmos se encuentran como material gráfico dentro del procedimiento de Código Azul (págs. 15 a 19) y deben consultarse como apoyo visual durante la atención."
        },
        {
          titulo: "Base metodológica",
          parrafos: [
            "El procedimiento se sustenta en los aspectos destacados de la actualización de las guías de la AHA para RCP y ACE, año 2015, y en el protocolo institucional vigente."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 6
     * ------------------------------------------------------------- */
    {
      numero: 6,
      temaId: "carro-paro-conceptos",
      titulo: "Carro de Paro: Concepto y Manejo",
      subtitulo: "Qué es, por qué importa y quién debe estar capacitado",
      icono: "🚑",
      fuente: "Procedimiento de manejo de carro de paro — págs. 2, 3, 4 y 7",
      secciones: [
        {
          titulo: "¿Por qué es tan importante el carro de paro?",
          parrafos: [
            "La atención de una urgencia vital, como un paro cardiorrespiratorio, exige una respuesta inmediata, coordinada, altamente efectiva y organizada por parte del personal de salud.",
            "En este contexto el carro de paro se constituye como un recurso terapéutico indispensable que concentra de manera organizada y móvil los equipos, medicamentos e insumos necesarios para la reanimación cerebro-cardio-pulmonar.",
            "Su disponibilidad, funcionalidad y contenido actualizado son determinantes críticos para el éxito de las maniobras y la supervivencia de los pacientes."
          ]
        },
        {
          titulo: "Objetivo",
          parrafos: [
            "Fortalecer el conocimiento del talento humano sobre el adecuado manejo, control y disponibilidad del carro de paro como elemento fundamental para una respuesta segura y oportuna ante una emergencia clínica."
          ]
        },
        {
          titulo: "Definiciones clave",
          tabla: {
            columnas: ["Término", "Definición"],
            filas: [
              ["Carro de paro", "Unidad móvil que integra los equipos, medicamentos e insumos necesarios para atender de forma inmediata una emergencia o urgencia tras la activación de un código azul."],
              ["Código Azul", "Sistema de respuesta establecido para el manejo de los pacientes que se encuentran en paro cardiorespiratorio o todos aquellos en los que se previera la inminencia de un paro cardiorespiratorio."],
              ["Manejo de carro de paro", "Conjunto de acciones necesarias para el mantenimiento y disponibilidad oportuna de los elementos necesarios para la intervención durante la presencia de código azul y la atención de pacientes de alto riesgo en los servicios de Urgencias de la ESE Municipal."]
            ]
          }
        },
        {
          titulo: "Talento humano requerido",
          parrafos: [
            "Se recomienda que el talento humano esté capacitado y actualizado en soporte vital básico y avanzado de acuerdo a su nivel de competencia."
          ],
          lista: [
            "Médico",
            "Enfermera",
            "Auxiliar de Enfermería",
            "Regente de Farmacia",
            "Auxiliar de Farmacia"
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 7
     * ------------------------------------------------------------- */
    {
      numero: 7,
      temaId: "carro-paro-registros",
      titulo: "Carro de Paro: Registros y Responsables",
      subtitulo: "Acta de apertura, control por cargo, equipos y revisión mensual",
      icono: "📋",
      fuente: "Procedimiento de manejo de carro de paro — págs. 5, 6, 8, 9 y 10",
      secciones: [
        {
          titulo: "Acta de apertura",
          parrafos: [
            "Se define como el registro, resultado de la acción en que se inicia el acto médico y paramédico en la sala de reanimación, dejando registrado cada uno de los productos (insumos o medicamentos) utilizados durante una eventualidad considerada urgencia vital."
          ],
          tabla: {
            columnas: ["Contenido del acta", "Detalle"],
            filas: [
              ["Datos del paciente", "Identificación del paciente atendido"],
              ["Evento", "Causa de atención"],
              ["Fecha de apertura", "Momento de apertura del carro de paro"],
              ["Descripción", "Insumos o medicamentos utilizados"],
              ["Pendientes", "Productos por reponer"],
              ["Observación", "Novedad o justificación pendiente"],
              ["Fecha de cierre", "Momento de cierre de la apertura"],
              ["Responsables", "Enfermera responsable y auxiliar de farmacia"]
            ]
          },
          aviso: {
            tipo: "clave",
            titulo: "Formato oficial",
            texto: "Durante la apertura del carro de paro se debe dejar registro en el formato Acta de apertura de carro de paro (FR-331-15)."
          }
        },
        {
          titulo: "Alcance y responsables",
          tabla: {
            columnas: ["Rol", "Responsabilidad"],
            filas: [
              ["Enfermero/a", "Garantizar el control, las aperturas, la existencia según stock y la reposición de dispositivos médicos e insumos. Recepcionar fórmulas médicas con el auxiliar de farmacia. Acompañar la auditoría mensual que hace el servicio farmacéutico. Diligenciar el stock con su respectiva acta de apertura cada vez que se abra el carro de paro, y tendrá la responsabilidad de acompañar al servicio farmacéutico en la auditoría mensual."],
              ["Auxiliar de enfermería", "Apoyar la apertura, recibir los insumos y tramitar las fórmulas médicas con el auxiliar de farmacia, y emitir las respectivas órdenes en cada uno de los procesos."],
              ["Regente de farmacia", "Verificar las auditorías (informar anomalías) y realizar el cronograma de revisión."],
              ["Auxiliar de farmacia", "Verificación mensual del stock y semaforización."]
            ]
          }
        },
        {
          titulo: "Recursos del carro de paro",
          columnas: [
            {
              titulo: "Maquinaria y tecnología",
              items: [
                "Carro de paro",
                "Guayas",
                "Desfibrilador con capacidad de monitorización y marcapasos",
                "Laringoscopio con doble par de baterías, además de hojas curvas y rectas",
                "Fuente de oxígeno",
                "Aspiración de secreciones",
                "Monitor de signos vitales",
                "Bomba de infusión"
              ]
            },
            {
              titulo: "Medicamentos, dispositivos médicos e insumos",
              items: [
                "Los detallados en el stock de medicamentos y dispositivos médicos por los que presten los siguientes servicios"
              ]
            },
            {
              titulo: "Medio ambiente",
              items: [
                "Servicio de urgencias",
                "Servicio de hospitalización",
                "Sala de partos de los centros de salud que presten estos servicios"
              ]
            },
            {
              titulo: "Metodológicos",
              items: ["Procedimiento actual", "Formato de stock", "Formato de acta de apertura"]
            }
          ]
        },
        {
          titulo: "Generalidades y control mensual",
          lista: [
            "Mensualmente, en el comité de farmacia se debe presentar un informe de las existencias, vencimientos y actas de apertura, lo que permitirá ver la rotación de los productos contenidos en el carro de paro. Este informe se debe consolidar por trimestre.",
            "Si el carro se encuentra abierto se debe hacer conteo completo y verificar las existencias.",
            "Si el carro se encuentra sellado y sin apertura, se deja sellado: no debe abrirse. Se hace anotación como «carro sellado».",
            "Cuando no se haya registrado ninguna apertura, dejar registro de revisión en la lista de chequeo.",
            "Si quedan pendientes justificados, dejar la novedad y la causa en el formato correspondiente."
          ],
          aviso: {
            tipo: "alerta",
            titulo: "Regla del carro sellado",
            texto: "Un carro de paro sellado y sin evidencia de apertura NO debe abrirse para verificación rutinaria. Se anota como «carro sellado»."
          }
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 8
     * ------------------------------------------------------------- */
    {
      numero: 8,
      temaId: "ronda-seguridad",
      titulo: "Ronda de Seguridad",
      subtitulo: "Seguimiento a las buenas prácticas de seguridad del paciente",
      icono: "🛡️",
      fuente: "Procedimiento para ronda de seguridad — págs. 2 a 5",
      secciones: [
        {
          titulo: "Objetivo",
          parrafos: [
            "Definir las acciones para realizar seguimiento y evaluar el grado de cumplimiento de la política, el programa de seguridad del paciente junto con las buenas prácticas de seguridad del paciente adoptadas por la Empresa Social del Estado del Municipio de Villavicencio."
          ]
        },
        {
          titulo: "Alcance y responsables",
          parrafos: [
            "Inicia desde la planeación de la ronda de seguridad y finaliza con la realización de la ronda, análisis y correcciones y/o acciones de mejora. Aplica a los centros de salud de la Empresa Social del Estado del Municipio de Villavicencio.",
            "Son responsables de este procedimiento: la subgerencia científica, el jefe de la oficina de planeación y calidad, y los líderes de procesos asistenciales."
          ]
        },
        {
          titulo: "Términos y definiciones",
          tabla: {
            columnas: ["Término", "Definición"],
            filas: [
              ["Seguridad del paciente", "Conjunto de elementos estructurales, procesos, instrumentos y metodologías basadas en la evidencia científicamente comprobada que propende minimizar el riesgo de sufrir eventos adversos en el proceso de atención en salud o de mitigar sus consecuencias."],
              ["Rondas de seguridad", "Herramienta operativa que permite conocer la adherencia a las buenas prácticas, ayuda a identificar riesgos e incidentes en seguridad del paciente, permitiendo implementar acciones de mejora."],
              ["Riesgo", "Es la probabilidad de que un accidente o evento adverso ocurra."],
              ["Evento centinela", "Es un tipo de evento adverso en donde está presente un daño físico o psicológico severo, de carácter permanente, y que requiere tratamiento y un cambio permanente de vida."],
              ["Barrera de seguridad", "Es una acción o circunstancia que reduce la probabilidad de presentación de incidente o evento adverso."]
            ]
          }
        },
        {
          titulo: "Generalidades",
          parrafos: [
            "Se reconoce la necesidad de promover la seguridad del paciente como un principio fundamental en todos los sistemas de salud, para reducir los daños relacionados con la atención en salud."
          ],
          subtituloRelacion: "Prácticas de seguridad del paciente que se verifican",
          tabla: {
            columnas: ["Práctica segura", "En qué consiste su verificación"],
            filas: [
              ["Insumos seguros", "Verificación de insumos."],
              ["Equipos seguros", "Verificación de equipos."],
              ["Seguridad documental", "Verificación documental."],
              ["Infraestructura segura", "Verificación de la infraestructura."],
              ["Gestión de eventos adversos", "Gestión de los eventos adversos identificados."],
              ["Prácticas misionales seguras", "Verificación de las prácticas misionales seguras."]
            ]
          },
          lista: [
            "Deben ser planificadas de acuerdo al programa de auditoría definido para la vigencia.",
            "Se realiza un recorrido por los servicios programados, se entrevista al personal, pacientes y familiares.",
            "Se revisan los incumplimientos, se establecen las oportunidades de mejora y conductas a seguir, a las cuales se les hará seguimiento en la siguiente ronda de seguridad.",
            "Se deja constancia de la ronda a través del formato de ronda de seguridad (FR-130-35).",
            "Las rondas realizadas en el mes se socializan en el comité de seguridad del paciente de manera trimestral.",
            "Las rondas de seguridad se realizan de manera mensual, con una frecuencia mínima en centros de salud de 24 horas, como parte del seguimiento de los procesos seguros de los centros de salud."
          ],
          aviso: {
            tipo: "clave",
            titulo: "Frecuencia y formato",
            texto: "Rondas mensuales (mínimo) en centros de salud de 24 horas · formato FR-130-35 · socialización trimestral en el comité de seguridad del paciente."
          }
        }
      ]
    },

    /* ---------------------------------------------------------------
     * MÓDULO 9
     * ------------------------------------------------------------- */
    {
      numero: 9,
      temaId: "entrega-turno",
      titulo: "Recibo y Entrega de Turno de Enfermería",
      subtitulo: "Continuidad, seguridad del paciente y responsabilidad compartida",
      icono: "🔄",
      fuente: "Procedimiento para recibo y entrega de turno de enfermería en urgencias — págs. 3 a 13",
      secciones: [
        {
          cita: "Un buen cambio de turno no es solo entregar información; es garantizar la continuidad, la seguridad del paciente y la responsabilidad compartida del equipo. Cada dato que omitimos puede convertirse en un riesgo."
        },
        {
          titulo: "Objetivo",
          parrafos: [
            "Implementar una herramienta que permita estandarizar la entrega y recibo de turno, en centros de salud de 24 horas de la ESE Municipal de Villavicencio, donde las enfermeras profesionales y auxiliares de enfermería, de manera unificada apliquen las pautas establecidas, para asegurar la continuidad del servicio en los diferentes escenarios."
          ],
          lista: [
            "Aplica para: enfermeras profesionales y auxiliares de enfermería.",
            "Servicios: observación, hospitalización, maternidad, sala ERA y reanimación."
          ]
        },
        {
          titulo: "Alcance y responsables",
          parrafos: [
            "El alcance del procedimiento es desde el momento que se recibe turno hasta el momento en que se entregan turno.",
            "Responsable: equipo de trabajo de enfermería liderado por enfermera profesional."
          ]
        },
        {
          titulo: "Tipos de entrega de turno",
          subtituloRelacion: "Entrega en equipo",
          parrafos: [
            "Todo el equipo de enfermería conoce al paciente: diagnóstico, tratamiento médico, necesidades, exigencias del paciente y las acciones de enfermería. El equipo puede discutir situaciones del paciente para llegar a una acción que le sirva de apoyo, con elaboración del plan de cuidados continuado que requiere el paciente."
          ],
          tabla: {
            columnas: ["Desventajas de la entrega en equipo"],
            filas: [
              ["Al reunirse el equipo de enfermería en un sitio especial, los pacientes quedan solos."],
              ["El estado del paciente puede cambiar durante ese tiempo."],
              ["No se puede comprobar si la información dada corresponde a la situación actual del paciente."]
            ]
          },
          subtituloRelacion: "Entrega en forma de revista",
          parrafos: [
            "Es el recorrido que hace el personal de enfermería viendo uno por uno a cada uno de los pacientes."
          ],
          tabla: {
            columnas: ["Ventajas", "Desventajas"],
            filas: [
              ["El informe es más exacto, por la observación directa al paciente.", "La información delante de los pacientes puede complicar su situación."],
              ["Se pueden identificar otras necesidades del paciente.", "Las palabras técnicas producen ansiedad en el paciente; deben utilizarse términos claros y sencillos que no afecten la evolución del paciente ni la satisfacción del acompañante."],
              ["El paciente no se siente solo.", ""],
              ["El personal y el paciente llegan a conocerse más.", ""]
            ]
          }
        },
        {
          titulo: "Proceso de Atención de Enfermería (PAE)",
          parrafos: [
            "El PAE sirve de instrumento de trabajo para el personal de enfermería y favorece que los cuidados se realicen de manera dinámica, deliberada, consciente, ordenada y sistematizada."
          ],
          lista: [
            "Traza objetivos y actividades evaluables.",
            "Mantiene una investigación constante sobre los cuidados.",
            "Desarrolla una base de conocimientos propia, para conseguir autonomía para la enfermería y un reconocimiento social.",
            "Incluye las escalas aplicadas Dowthon y Braden.",
            "Tiene en cuenta la educación al paciente y cuidador."
          ]
        },
        {
          titulo: "Horarios para el cambio de turno",
          tabla: {
            columnas: ["Turno", "Horario"],
            filas: [
              ["Turno mañana", "07:00 a.m. – 13:00 p.m."],
              ["Turno tarde", "13:00 p.m. – 19:00 p.m."],
              ["Turno noche", "19:00 p.m. – 07:00 a.m."]
            ]
          },
          nota: "Las jornadas son de seis y doce horas."
        },
        {
          titulo: "Recomendaciones antes de entregar el turno",
          lista: [
            "La persona que va a entregar el informe debe estar lista a la hora exacta y dejar documentado el plan de cuidados instaurado por el paciente y el cumplimiento a las metas establecidas.",
            "Actualizar el kardex.",
            "Verificar el libro de movimiento de pacientes (ingresos y egresos).",
            "Revisar los pacientes para confirmar su estado.",
            "Recibir inventario de los elementos de trabajo.",
            "El personal que recibe turno debe preguntar las dudas que tenga en relación con el estado del paciente.",
            "Las observaciones especiales y los tratamientos deben ser revisados y constatados cuidadosamente.",
            "Antes de iniciar la entrega, elaborar detalladamente los registros en la historia clínica: evolución de enfermería, control de líquidos, signos vitales, monitoreo neurológico, hoja de tratamientos o medicamentos.",
            "Debe realizar una pre-ronda antes de entregar el turno."
          ]
        },
        {
          titulo: "Identificación y seguridad del paciente",
          aviso: {
            tipo: "alerta",
            titulo: "Regla principal",
            texto: "El personal de enfermería NO debe retirarse hasta finalizar el recibo y la entrega del turno."
          },
          lista: [
            "Inspección cefalocaudal al momento de recibir el paciente.",
            "Verificación de todas las medidas de seguridad del paciente: barandas elevadas, cabecera 45 grados, rótulo de cabecera, rótulo de venopunción vigente, rótulo de infusiones y demás dispositivos.",
            "Alertar cada fuga, UPP o flebitis.",
            "Custodia de las pertenencias del paciente.",
            "Días de estancia.",
            "Informar eventos adversos presentados durante el turno.",
            "Garantizar y verificar todas las medidas de seguridad del paciente."
          ]
        },
        {
          titulo: "Ingreso del paciente al servicio de hospitalización",
          parrafos: [
            "Se establece como horario para el ingreso de los pacientes al servicio de hospitalización hasta una hora antes de la entrega de turno."
          ],
          aviso: {
            tipo: "excepcion",
            titulo: "Excepciones: población priorizada",
            texto: "Maternas, pacientes con limitación física, víctimas de violencia o abuso."
          }
        },
        {
          titulo: "Contenido de la entrega del servicio",
          lista: [
            "La entrega de carro de paro, con revisión detallada del equipo de reanimación y su respectivo inventario; dejar registro en actas de apertura durante el turno.",
            "Carro de curaciones.",
            "Inventario de los elementos de trabajo (monitor de signos vitales, bombas de infusión, desfibrilador, Ambu, laringoscopio, etc.); dejar registro en el libro de verificación de equipos.",
            "Reportar si se registraron daños o pérdidas de equipos durante el turno.",
            "Entregar medicamentos por paciente de acuerdo con la formulación para las 24 horas.",
            "Verificación de procesos administrativos, incluidos trámites con referencia e historias en proceso de facturación.",
            "Entregar las novedades administrativas en trámite y verificar su registro en el libro de novedades.",
            "Informar si se presentaron eventos adversos o servicios no conformes durante el turno.",
            "Entregar la estación de enfermería organizada, limpia y bien presentada."
          ]
        },
        {
          titulo: "Seguimiento",
          parrafos: [
            "Se centra en garantizar la buena atención al paciente basada en la aplicación de los instrumentos para un adecuado cambio de turno y continuidad en la atención. Se verifica diariamente por el líder de procesos los registros de recibo y entrega de turno, tanto de médicos como de enfermería.",
            "Se tiene en cuenta la oportunidad en la atención al paciente, la eficiencia y la calidad de cuidado."
          ]
        },
        {
          titulo: "Referencias",
          lista: [
            "Ministerio de Salud y Protección Social. Resolución 00002003 de 2014 (28 de mayo de 2014).",
            "Ministerio de Salud y Protección Social. Resolución 1043 del 3 de abril de 2006 — funciones de los prestadores del servicio de salud y componente de auditoría para el mejoramiento de la calidad de atención.",
            "Modelo de cuidados de Virginia Henderson (s.f.). Fundamentos históricos y teóricos de enfermería. Tomo II.",
            "Instructivo de entrega de turno. Metrosalud."
          ]
        }
      ]
    },
  ],
};

/* -------------------------------------------------------------------------
 * Utilidades de apoyo
 * ---------------------------------------------------------------------- */
window.ContenidoCurso = {
  modulos: window.CURSO.modulos,

  /** Devuelve un módulo por su temaId. */
  porTemaId(temaId) {
    return window.CURSO.modulos.find(m => m.temaId === temaId) || null;
  },

  /** Devuelve un módulo por su número. */
  porNumero(n) {
    return window.CURSO.modulos.find(m => m.numero === n) || null;
  },

  /** Total de secciones de todo el curso (para estimar la carga de lectura). */
  totalSecciones() {
    return window.CURSO.modulos.reduce((n, m) => n + m.secciones.length, 0);
  },
};
