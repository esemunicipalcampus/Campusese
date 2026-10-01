/* =========================================================================
 * BANCO DE PREGUNTAS
 * Fuente: "EVALUACIÓN MANEJO DE CÓDIGO AZUL Y CARRO DE PARO.docx",
 *         "Evaluación - Ronda de Seguridad y Recibo y Entrega de Turno.docx"
 *         y los 4 procedimientos (PDF) de la ESE Municipal de Villavicencio.
 *
 * Todas las preguntas conservan el enunciado y la clave de respuesta de las
 * evaluaciones originales. Las preguntas complementarias están redactadas a
 * partir del texto de los procedimientos.
 *
 * Estructura de una pregunta:
 *   { id, enunciado, opciones: [..], correcta: <índice 0-based>, explicacion }
 * =========================================================================
 */

window.TEMAS = [

  /* ======================================================================
   * TEMA 1
   * ==================================================================== */
  {
    id: "codigo-azul-organizacion",
    numero: 1,
    titulo: "Código Azul: definición, activación y organización del equipo",
    documento: "Procedimiento de Código Azul — págs. 2 a 5",
    resumen: "Qué es el Código Azul, quién puede activarlo, cómo se convoca al equipo y qué función tiene cada integrante.",
    preguntas: [
      {
        enunciado: "¿Cuál es el objetivo principal del Código Azul dentro de una institución de salud?",
        opciones: [
          "Realizar seguimiento administrativo a pacientes hospitalizados.",
          "Activar un sistema de respuesta inmediata ante pacientes en paro cardiorrespiratorio o con riesgo inminente de presentarlo.",
          "Controlar exclusivamente los medicamentos utilizados en urgencias.",
          "Coordinar el traslado de pacientes a otra institución."
        ],
        correcta: 1,
        explicacion: "El objetivo es contar con una guía estandarizada para lograr una respuesta eficiente, efectiva y oportuna ante el paciente que presenta paro cardiorrespiratorio."
      },
      {
        enunciado: "¿Quién puede realizar la activación del Código Azul cuando identifica un paciente en paro cardiorrespiratorio?",
        opciones: [
          "Únicamente el médico de urgencias.",
          "Exclusivamente el coordinador del servicio.",
          "Cualquier funcionario que sospeche o confirme un paro cardiorrespiratorio.",
          "Solamente el personal administrativo."
        ],
        correcta: 2,
        explicacion: "La activación puede realizarla el funcionario que sospeche o confirme un paro cardiorrespiratorio; no está limitada a una sola profesión."
      },
      {
        enunciado: "¿Cuáles son los mecanismos establecidos para activar el Código Azul?",
        opciones: [
          "Llamada telefónica externa y correo institucional.",
          "Timbre ubicado en urgencias o voz de alerta diciendo «Código Azul».",
          "Solicitud escrita en historia clínica.",
          "Activación únicamente por orden médica."
        ],
        correcta: 1,
        explicacion: "Se activa mediante el timbre ubicado en la sala de atención de urgencias o mediante la voz de alerta «CÓDIGO AZUL», para convocar de manera inmediata al equipo de respuesta."
      },
      {
        enunciado: "¿Cuál es la duración del protocolo de Código Azul?",
        opciones: [
          "Inicia con la activación y termina 15 minutos después.",
          "Inicia desde que se encuentra un paciente en paro cardiorrespiratorio y finaliza cuando se estabilizan las funciones vitales del paciente o se produce su fallecimiento.",
          "Inicia y termina dentro del mismo turno de trabajo.",
          "Solo comprende el tiempo de compresión torácica."
        ],
        correcta: 1,
        explicacion: "El protocolo inicia desde el momento en que se encuentra un paciente en paro cardiorrespiratorio, se activa el Código Azul y finaliza cuando se estabilizan las funciones vitales o se produce el fallecimiento."
      },
      {
        enunciado: "Dentro del equipo de Código Azul, ¿cuál es la función principal del Médico 1 (Urgencias)?",
        opciones: [
          "Registrar los medicamentos utilizados durante la reanimación.",
          "Realizar únicamente la monitorización del paciente.",
          "Dirigir la RCP, ordenar medicamentos, realizar procedimientos avanzados y tomar decisiones durante la reanimación.",
          "Realizar exclusivamente la canalización de accesos venosos."
        ],
        correcta: 2,
        explicacion: "Dirige la RCP, hiperventilación, intubación, verificación de la posición del tubo, ordena administrar medicamentos, toma decisiones fundamentales y lleva la cuenta del tiempo con cronómetro."
      },
      {
        enunciado: "¿Cuál es la función del Médico 2 (Hospitalización)?",
        opciones: [
          "Dirigir la RCP y ordenar los medicamentos.",
          "Realizar compresiones torácicas, cardioversión o desfibrilación según el caso, y valorar cada 2 minutos la respuesta del paciente.",
          "Registrar en la historia clínica los consumos del carro de paro.",
          "Permanecer como observador del evento."
        ],
        correcta: 1,
        explicacion: "El Médico 2 realiza compresiones torácicas, cardioversión o desfibrilación dado el caso, y valora cada 2 minutos la respuesta del paciente al tratamiento."
      },
      {
        enunciado: "Durante el Código Azul, ¿cuál es una función del profesional de enfermería?",
        opciones: [
          "Realizar únicamente el traslado del paciente.",
          "Monitorizar al paciente, preparar, rotular y administrar medicamentos, informando la aplicación de estos.",
          "Realizar la auditoría mensual del carro de paro.",
          "Elaborar las fórmulas médicas."
        ],
        correcta: 1,
        explicacion: "El profesional de enfermería monitoriza al paciente, envasa, rotula y administra los medicamentos e informa en voz alta la aplicación de los mismos. Después de la administración pasan 20 o 30 cc de líquidos intravenosos a chorro."
      },
      {
        enunciado: "El Auxiliar 1 (Urgencias), dentro del equipo de Código Azul:",
        opciones: [
          "Se encarga de registrar los consumos en el libro y en el carro de paro.",
          "Canaliza accesos venosos periféricos e inicia líquidos endovenosos, apoya al Médico 2 e intercambia en turno de compresiones cada 2 minutos.",
          "Apoya exclusivamente en la monitorización de signos vitales.",
          "Administra los medicamentos ordenados por el Médico 1."
        ],
        correcta: 1,
        explicacion: "Canaliza accesos venosos periféricos e inicia líquidos intravenosos, apoya al Médico 2 e intercambia cada 2 minutos en el turno de compresiones (ciclo completo compresión/ventilación)."
      },
      {
        enunciado: "El Auxiliar 2, de carácter rotatorio, dentro del equipo de Código Azul:",
        opciones: [
          "Registra en la historia clínica los consumos e informa al médico para la elaboración de fórmulas.",
          "Apoya en la monitorización de signos vitales y asiste al Médico 1 en ventilaciones con bolsa, succión, intubación, fuente de oxígeno y fijación del tubo.",
          "Elabora las fórmulas médicas del evento.",
          "Se encarga del inventario de equipos del turno."
        ],
        correcta: 1,
        explicacion: "Apoya la monitorización de signos vitales y asiste al Médico 1 en ventilaciones con bolsa de ventilación mecánica (BVM), succión, intubación, fuente de oxígeno, fijación de tubo y asistencia ventilatoria."
      },
      {
        enunciado: "El Auxiliar 3 cumple una función de registro y control así:",
        opciones: [
          "Canaliza los accesos venosos y aplica los líquidos a chorro.",
          "Se encarga de registrar en la historia clínica, revisar en el libro y en el carro de paro los consumos e informar al médico para la elaboración de las respectivas fórmulas.",
          "Dirige las compresiones torácicas del evento.",
          "Vigila exclusivamente la puerta del servicio."
        ],
        correcta: 1,
        explicacion: "El Auxiliar 3 registra en la historia clínica, revisa en el libro y en el carro de paro los consumos e informa al médico para la elaboración de las respectivas fórmulas."
      },
      {
        enunciado: "Un paciente que presenta riesgo inminente de perder la vida, cuadro agudo crítico o inestable y que requiere atención inmediata, corresponde a:",
        opciones: [
          "Triage Dos.",
          "Triage Uno.",
          "Triage Cuatro.",
          "Un paciente estable."
        ],
        correcta: 1,
        explicacion: "El Triage Uno es el paciente con riesgo inminente de perder la vida, cuadro agudo crítico o inestable y que requiere atención inmediata."
      },
      {
        enunciado: "¿Qué incluye el Soporte Vital Básico (SVB)?",
        opciones: [
          "Solo el uso de desfibrilador.",
          "Conjunto de maniobras realizadas para comprobar y mantener las funciones esenciales, incluyendo intervenciones como desfibrilación y manejo de la vía aérea cuando corresponda.",
          "La administración de medicamentos y el tratamiento de los diferentes ritmos de paro.",
          "La intervención del equipo de urgencias ante el evento."
        ],
        correcta: 1,
        explicacion: "El SVB es el conjunto de maniobras para comprobar y mantener las funciones esenciales. El SVA, en cambio, incluye vía aérea avanzada, medicamentos y tratamiento de ritmos de paro."
      },
      {
        enunciado: "Las actividades realizadas por profesionales capacitados que incluyen manejo avanzado de vía aérea, administración de medicamentos y tratamiento de los diferentes ritmos de paro corresponden a:",
        opciones: [
          "Soporte Vital Básico (SVB).",
          "Reanimación cerebro cardiopulmonar (RCCP).",
          "Soporte Vital Avanzado (SVA).",
          "Triage de Urgencias."
        ],
        correcta: 2,
        explicacion: "El Soporte Vital Avanzado (SVA) comprende las actividades realizadas por profesionales capacitados con manejo avanzado de vía aérea, medicamentos y tratamiento de ritmos de paro."
      },
      {
        enunciado: "El paro cardiorrespiratorio se define como:",
        opciones: [
          "La interrupción brusca y potencialmente reversible de la respiración espontánea que puede conducir a paro cardíaco y/o respiratorio.",
          "La elevación sostenida de la temperatura corporal del paciente.",
          "La pérdida de conciencia aislada sin alteration circulatoria.",
          "La urgencia médica que no compromete la vida."
        ],
        correcta: 0,
        explicacion: "Es la interrupción brusca y potencialmente reversible de la respiración espontánea, que puede conducir a paro cardíaco y/o respiratorio."
      }
    ]
  },

  /* ======================================================================
   * TEMA 2
   * ==================================================================== */
  {
    id: "rcp-basica-adulto",
    numero: 2,
    titulo: "Reanimación cardiopulmonar básica en el adulto",
    documento: "Procedimiento de Código Azul — págs. 7 y 8",
    resumen: "Valoración inicial, frecuencia y profundidad de las compresiones torácicas, relación de ventilaciones y calidad de la RCP.",
    preguntas: [
      {
        enunciado: "En la reanimación cardiopulmonar básica del adulto, la frecuencia recomendada de compresiones torácicas es:",
        opciones: [
          "60 a 80 compresiones por minuto.",
          "80 a 100 compresiones por minuto.",
          "100 a 120 compresiones por minuto.",
          "120 a 150 compresiones por minuto."
        ],
        correcta: 2,
        explicacion: "La recomendación es de 100 a 120 compresiones por minuto, con la mayor fracción de compresión torácica posible."
      },
      {
        enunciado: "En un paciente adulto sin vía aérea avanzada, la relación recomendada de compresiones y ventilaciones durante RCP básica es:",
        opciones: [
          "15 compresiones por 1 ventilación.",
          "30 compresiones por 2 ventilaciones.",
          "50 compresiones por 5 ventilaciones.",
          "10 compresiones por 2 ventilaciones."
        ],
        correcta: 1,
        explicacion: "Sin vía aérea avanzada se realiza una relación de 30 compresiones por 2 ventilaciones."
      },
      {
        enunciado: "¿En qué lugar se deben realizar las compresiones torácicas en el adulto?",
        opciones: [
          "En la mitad inferior del esternón, comprimiendo fuerte y rápido.",
          "Sobre el apéndice xifoides para evitar lesions hepáticas.",
          "En la región interescapular superior.",
          "Sobre el músculo recto abdominal."
        ],
        correcta: 0,
        explicacion: "Se comprime en la mitad inferior del esternón, fuerte y rápido, entre 100 y 120 compresiones por minuto."
      },
      {
        enunciado: "La profundidad de compresión en el adulto debe ser:",
        opciones: [
          "De 2 a 3 cm.",
          "De al menos 5 cm (2 pulgadas), sin sobrepasar los 6 cm.",
          "De 8 a 10 cm.",
          "La máxima que permita el paciente."
        ],
        correcta: 1,
        explicacion: "La profundidad debe ser de al menos 5 cm, pero no debe sobrepasar los 6 cm."
      },
      {
        enunciado: "¿Con qué frecuencia se debe cambiar de reanimador durante las compresiones?",
        opciones: [
          "Cada 30 segundos.",
          "Cada 2 minutos, para evitar la fatiga del reanimador.",
          "Cada 5 minutos.",
          "Solo cuando se canse por completo."
        ],
        correcta: 1,
        explicacion: "Se cambia de reanimador cada 2 minutos para evitar la fatiga. El objetivo es alcanzar una fracción de compresión torácica de al menos el 60 %."
      },
      {
        enunciado: "Al comprobar el estado de conciencia, se debe stimulating táctilmente y hablar en voz alta. ¿Cuál es el tiempo máximo permitido para esta valoración?",
        opciones: [
          "5 segundos.",
          "10 segundos.",
          "30 segundos.",
          "1 minuto."
        ],
        correcta: 1,
        explicacion: "Se debe identificar el grado de respuesta del paciente y confirmar si hay respiración; el procedimiento no debe superar los 10 segundos."
      },
      {
        enunciado: "La circulación se comprueba mediante el pulso carotídeo durante:",
        opciones: [
          "De 5 a 10 segundos; si no hay pulso se inician las compresiones torácicas.",
          "De 30 a 40 segundos antes de iniciar la RCP.",
          "De 2 a 3 minutos.",
          "Solo si el paciente está enucleado."
        ],
        correcta: 0,
        explicacion: "Se comprueba el pulso carotídeo durante 5 a 10 segundos; si no hay pulso se inician las compresiones torácicas con relación 30:2."
      },
      {
        enunciado: "En pacientes con dispositivo avanzado para la vía aérea, se recomienda una frecuencia de ventilación simplificada de:",
        opciones: [
          "1 ventilación cada 6 segundos (10 ventilaciones por minuto).",
          "1 ventilación cada 3 segundos.",
          "2 ventilaciones cada 10 segundos.",
          "Ventilación únicamente después de cada compresión."
        ],
        correcta: 0,
        explicacion: "Con dispositivo avanzado de vía aérea se recomienda 1 ventilación cada 6 segundos, es decir 10 ventilaciones por minuto."
      },
      {
        enunciado: "En la ventilación con bolsa-válvula-mascarilla (BVM), ¿cuál es el volumen corriente esperado y la duración de cada insuflación?",
        opciones: [
          "Entre 400 y 600 cc durante unos 1 segundo.",
          "Entre 800 y 1.200 cc durante unos 2 segundos, confirmando elevación torácica.",
          "Entre 1.500 y 2.000 cc durante unos 5 segundos.",
          "Entre 200 y 300 cc durante unos 0,5 segundos."
        ],
        correcta: 1,
        explicacion: "La insuflación debe durar unos 2 segundos, con un volumen corriente de 800 a 1.200 cc, confirmando la elevación torácica y la oscilación del tórax."
      },
      {
        enunciado: "¿Qué porcentaje mínimo de fracción de compresión torácica se recomienda alcanzar durante la RCP?",
        opciones: [
          "Al menos el 30 %.",
          "Al menos el 50 %.",
          "Al menos el 60 %.",
          "Al menos el 90 %."
        ],
        correcta: 2,
        explicacion: "Se deben minimizar las interrupciones con el objetivo de alcanzar la mayor fracción de compresión torácica posible, de al menos el 60 %."
      },
      {
        enunciado: "Entre otras, ¿cuál de las siguientes es una recomendación correcta durante las compresiones torácicas en el adulto?",
        opciones: [
          "Apoyarse sobre el tórax entre las compresiones para estabilizar.",
          "Permitir una adecuada expansión torácica completa después de cada compresión, evitando apoyarse sobre el tórax.",
          "Realizar pausas de 10 segundos cada minuto para revisar el monitor.",
          "Descomprimir el tórax rápidamente para favorecer el retorno venoso."
        ],
        correcta: 1,
        explicacion: "Se debe permitir una adecuada expansión torácica completa después de cada compresión, evitando apoyarse sobre el tórax entre las compresiones."
      }
    ]
  },

  /* ======================================================================
   * TEMA 3
   * ==================================================================== */
  {
    id: "rcp-mujer-gestante",
    numero: 3,
    titulo: "Reanimación cardiopulmonar en la mujer gestante",
    documento: "Procedimiento de Código Azul — pág. 10",
    resumen: "Cambios fisiológicos del embarazo, desplazamiento manual del útero, ajuste de las compresiones e histerotomía de emergencia.",
    preguntas: [
      {
        enunciado: "Durante la RCP en una mujer gestante después de las 20 semanas, una modificación importante es:",
        opciones: [
          "Suspender las compresiones torácicas.",
          "Realizar compresiones únicamente abdominales.",
          "Realizar desplazamiento manual del útero hacia la izquierda para disminuir la compresión aortocava.",
          "Evitar todo tipo de ventilación."
        ],
        correcta: 2,
        explicacion: "El desplazamiento manual del útero hacia la izquierda (LUD) disminuye la presión sobre los grandes vasos; estos cambios son especialmente necesarios después de las 20 semanas de gestación."
      },
      {
        enunciado: "¿Cuál es el objetivo principal del desplazamiento manual del útero y del apoyo con toallas, bolsas intravenosas o dispositivos de soporte?",
        opciones: [
          "Liberar la compresión aortocava y mejorar la efectividad de la reanimación materna y fetal.",
          "Evitar que la paciente cambie de posición.",
          "Reducir el dolor de las compresiones.",
          "Sustituir las compresiones torácicas."
        ],
        correcta: 0,
        explicacion: "El objetivo es liberar la compresión aortocava producida por el útero gestante y mejorar la efectividad de la reanimación materna y fetal."
      },
      {
        enunciado: "¿Cuáles son las frecuencias y relaciones recomendadas en la RCP de la mujer gestante?",
        opciones: [
          "Compresiones de 60 a 80 por minuto y relación 15:2.",
          "Compresiones de 100 a 120 por minuto y relación de 30:2.",
          "Compresiones de 120 a 140 por minuto y relación 50:5.",
          "Compresiones de 80 a 100 por minuto y relación 10:2."
        ],
        correcta: 1,
        explicacion: "Se mantienen las compresiones de 100 a 120 por minuto y la relación de 30:2, con los ajustes posicionales propios del embarazo."
      },
      {
        enunciado: "Respecto a la posición de las manos en la RCP de la mujer gestante, es correcto que:",
        opciones: [
          "Las compresiones deben realizarse en una posición más caudal del esternón.",
          "Debe evitarse todo desplazamiento del útero.",
          "Las compresiones torácicas se ubican en una posición más cefálica del esternón.",
          "Se deben realizar inclinaciones laterales excesivas para liberar el útero."
        ],
        correcta: 2,
        explicacion: "Las compresiones se ubican en una posición más cefálica del esternón y deben evitarse inclinaciones laterales excesivas, ya que disminuyen la eficacia de las compresiones."
      },
      {
        enunciado: "¿En qué momento debe considerarse la histerotomía de emergencia (cesárea perimortem)?",
        opciones: [
          "Si no se logra retorno de circulación espontánea después de 4 minutos de RCP avanzada (ACLS).",
          "Siempre que la paciente sea una mujer en edad fértil.",
          "Únicamente si el feto presenta bradicardia.",
          "Después de 20 minutos de RCP básica."
        ],
        correcta: 0,
        explicacion: "Si no se logra retorno de circulación espontánea después de 4 minutos de RCP avanzada (ACLS), se considera la histerotomía de emergencia como parte de los esfuerzos de reanimación."
      }
    ]
  },

  /* ======================================================================
   * TEMA 4
   * ==================================================================== */
  {
    id: "rcp-pediatrica-neonatal",
    numero: 4,
    titulo: "Reanimación cardiopulmonar pediátrica y neonatal",
    documento: "Procedimiento de Código Azul — págs. 11 y 12",
    resumen: "Profundidad y frecuencia de compresiones por grupo etario, relaciones de ventilación y técnica de compresión neonatal.",
    preguntas: [
      {
        enunciado: "En la RCP pediátrica, ¿qué frecuencia de compresiones torácicas se recomienda?",
        opciones: [
          "De 60 a 80 por minuto.",
          "De 100 a 120 por minuto.",
          "De 140 a 160 por minuto.",
          "De 40 a 60 por minuto."
        ],
        correcta: 1,
        explicacion: "Se comprime el centro del tórax a una frecuencia de 100 a 120 compresiones por minuto."
      },
      {
        enunciado: "La profundidad de compresión en la RCP pediátrica corresponde a:",
        opciones: [
          "La mitad del diámetro anteroposterior del tórax.",
          "Un tercio del diámetro anteroposterior del tórax (aproximadamente 4 cm en lactantes y 5 cm en niños mayores).",
          "Dos centímetros en todos los casos.",
          "La misma profundidad del adulto (5 a 6 cm)."
        ],
        correcta: 1,
        explicacion: "La profundidad es un tercio del diámetro anteroposterior del tórax, aproximadamente 4 cm en lactantes y 5 cm en niños mayores."
      },
      {
        enunciado: "En el paciente pediátrico sin vía aérea avanzada, la relación compresión-ventilación es:",
        opciones: [
          "30:2 si hay un solo reanimador y 15:2 si hay dos o más reanimadores.",
          "30:2 en todos los casos.",
          "15:2 siempre, incluso con un solo reanimador.",
          "5:1 en neonatos y adultos por igual."
        ],
        correcta: 0,
        explicacion: "Sin vía aérea avanzada la relación es 30:2 con un solo reanimador y 15:2 con dos o más reanimadores."
      },
      {
        enunciado: "En la RCP pediátrica, la oxigenación se realiza con bolsa-válvula-mascarilla utilizando oxígeno al:",
        opciones: [
          "40 %.",
          "80 %.",
          "100 %.",
          "21 % (aire ambiente)."
        ],
        correcta: 2,
        explicacion: "La ventilación con bolsa-válvula-mascarilla se realiza utilizando oxígeno al 100 %."
      },
      {
        enunciado: "Una vez intubado el paciente pediátrico con vía aérea avanzada, la frecuencia de ventilación recomendada es:",
        opciones: [
          "Lactantes (< 1 año): 20 a 25 ventilaciones por minuto.",
          "Lactantes (< 1 año): 40 a 45 ventilaciones por minuto.",
          "Niños (1 a 8 años): 30 ventilaciones por minuto.",
          "Niños mayores y adolescentes: 25 a 30 ventilaciones por minuto."
        ],
        correcta: 0,
        explicacion: "Con vía aérea avanzada, las compresiones son continuas (100-120 por minuto) y se ventila de forma independiente: lactantes 20 a 25 por minuto, niños de 1 a 8 años 20 por minuto, y niños mayores y adolescentes 10 a 15 por minuto."
      },
      {
        enunciado: "En la reanimación neonatal, la técnica de compresión torácica con un solo reanimador consiste en:",
        opciones: [
          "Comprimir con dos dedos (índice y medio) en el centro del esternón, justo debajo de la línea imaginaria entre las tetillas.",
          "Comprimir con el talón de la mano en el apéndice xifoides.",
          "Comprimir con dos dedos en el borde lateral del tórax.",
          "Comprimir con ambas manos en la región interescapular."
        ],
        correcta: 0,
        explicacion: "Se usan dos dedos (índice y medio) en el centro del esternón, justo debajo de la línea imaginaria entre las tetillas. Si hay dos reanimadores se prefiere abrazar el tórax con las dos manos y usar los dos pulgares."
      },
      {
        enunciado: "En la reanimación neonatal, la profundidad y la frecuencia de compresión son:",
        opciones: [
          "Al menos un tercio del tórax (unos 4 cm) y de 100 a 120 compresiones por minuto.",
          "5 a 6 cm y de 80 a 100 compresiones por minuto.",
          "2 cm y de 60 a 80 compresiones por minuto.",
          "Al menos la mitad del tórax y de 140 compresiones por minuto."
        ],
        correcta: 0,
        explicacion: "Se comprime al menos un tercio del tórax (unos 4 cm) a una frecuencia de 100 a 120 compresiones por minuto."
      },
      {
        enunciado: "¿Cuál de los siguientes dispositivos puede utilizarse para asegurar la vía aérea según la pericia del equipo?",
        opciones: [
          "Únicamente la intubación endotraqueal.",
          "Cánula orofaríngea, mascarilla laríngea o intubación endotraqueal.",
          "Solamente la mascarilla laríngea.",
          "Únicamente la cánula orofaríngea."
        ],
        correcta: 1,
        explicacion: "Los dispositivos avanzados incluyen colocación de cánula orofaríngea, mascarilla laríngea o intubación endotraqueal, según la pericia del equipo."
      }
    ]
  },

  /* ======================================================================
   * TEMA 5
   * ==================================================================== */
  {
    id: "cadena-supervivencia",
    numero: 5,
    titulo: "Cadena de supervivencia y cuidados posteriores al paro",
    documento: "Procedimiento de Código Azul — págs. 6, 7 y 19",
    resumen: "Importancia de la cadena de supervivencia, inicio de los cuidados post-paro y insumos y metodología del procedimiento.",
    preguntas: [
      {
        enunciado: "La cadena de supervivencia es importante porque:",
        opciones: [
          "Permite disminuir únicamente el tiempo administrativo de atención.",
          "Organiza las acciones necesarias desde el reconocimiento del paro hasta los cuidados posteriores, aumentando las posibilidades de supervivencia.",
          "Reemplaza el entrenamiento del personal sanitario.",
          "Solo aplica para pacientes pediátricos."
        ],
        correcta: 1,
        explicacion: "La cadena de supervivencia organiza las acciones desde el reconocimiento del paro hasta los cuidados posteriores, aumentando las posibilidades de supervivencia."
      },
      {
        enunciado: "¿En qué lugar deben comenzar los cuidados del paciente post-paro cardíaco?",
        opciones: [
          "En la sala de reanimación, después del ingreso.",
          "En el lugar donde ocurre el paro.",
          "En el servicio de hospitalización, una vez estabilizado.",
          "En el servicio de urgencias, tras 10 minutos de observación."
        ],
        correcta: 1,
        explicacion: "Los cuidados del paciente post-paro cardíaco comienzan desde el lugar donde ocurre el paro."
      },
      {
        enunciado: "Los protocolos de reanimación del procedimiento están sustentados en:",
        opciones: [
          "Aspectos destacados de la actualización de las guías de la AHA para RCP y ACE año 2015.",
          "Las guías de la OMS del año 1998.",
          "El manual de Romeo y Juliet del año 2010.",
          "Protocolos internos no publicados de la institución."
        ],
        correcta: 0,
        explicacion: "El recurso metodológico del procedimiento son los aspectos destacados de la actualización de las guías de la AHA para RCP y ACE año 2015."
      },
      {
        enunciado: "¿Cuál de los siguientes insumos hace parte de los recursos con los que debe contar el servicio para atender un Código Azul?",
        opciones: [
          "Solo el carro de paro y el desfibrilador.",
          "Carro de paro, desfibrilador, succionador y bala de oxígeno con manómetro, en los servicios de urgencias, sala de partos y hospitalización.",
          "Únicamente el monitor de signos vitales.",
          "El carro de curacion y la carro de aseo."
        ],
        correcta: 1,
        explicacion: "Los recursos de maquinaria y tecnología incluyen carro de paro, desfibrilador, succionador y bala de oxígeno con manómetro; y como logística, los servicios de urgencias, sala de partos y hospitalización, además del instructivo y el stock del carro de paro."
      }
    ]
  },

  /* ======================================================================
   * TEMA 6
   * ==================================================================== */
  {
    id: "carro-paro-conceptos",
    numero: 6,
    titulo: "Carro de paro: conceptualización y manejo",
    documento: "Procedimiento de manejo de carro de paro — págs. 2, 3, 4 y 7",
    resumen: "Definición del carro de paro, su importancia para la respuesta ante emergencias, el concepto de manejo y el talento humano requerido.",
    preguntas: [
      {
        enunciado: "El carro de paro se define como:",
        opciones: [
          "Un equipo destinado únicamente al almacenamiento de medicamentos vencidos.",
          "Una unidad móvil que integra equipos, medicamentos e insumos necesarios para atender emergencias y Código Azul.",
          "Un equipo utilizado exclusivamente para transporte de pacientes.",
          "Un elemento administrativo del servicio."
        ],
        correcta: 1,
        explicacion: "Es una unidad móvil que integra los equipos, medicamentos e insumos necesarios para atender de forma inmediata una emergencia o urgencia tras la activación de un código azul."
      },
      {
        enunciado: "La disponibilidad, funcionalidad y actualización del carro de paro son importantes porque:",
        opciones: [
          "Permiten cumplir únicamente requisitos administrativos.",
          "Determinan la rapidez y efectividad de la respuesta durante una emergencia vital.",
          "Evitan realizar auditorías institucionales.",
          "Reemplazan la capacitación del personal."
        ],
        correcta: 1,
        explicacion: "Son determinantes críticos para el éxito de las maniobras y la supervivencia de los pacientes."
      },
      {
        enunciado: "El manejo del carro de paro se define como:",
        opciones: [
          "El conjunto de acciones necesarias para el mantenimiento y disponibilidad oportuna de los elementos requeridos durante un código azul y la atención de pacientes de alto riesgo en Urgencias.",
          "La compra trimestral de los insumos del carro.",
          "El diligenciamiento trimestral del inventario institucional.",
          "La reparación técnica de los equipos biomédicos."
        ],
        correcta: 0,
        explicacion: "El manejo del carro de paro es el conjunto de acciones necesarias para el mantenimiento y disponibilidad oportuna de los elementos necesarios para la intervención durante la presencia de código azul y atención de pacientes de alto riesgo."
      },
      {
        enunciado: "La atención de una emergencia vital exige una respuesta por parte del personal de salud:",
        opciones: [
          "Inmediata, pero no necesariamente coordinada.",
          "Inmediata, coordinada, altamente efectiva y organizada.",
          "Únicamente después de la confirmación médica del diagnóstico.",
          "Diferida, para evitar perturbar al paciente."
        ],
        correcta: 1,
        explicacion: "La atención de una urgencia vital exige una respuesta inmediata, coordinada, altamente efectiva y organizada por parte del personal de salud."
      },
      {
        enunciado: "En este contexto, el carro de paro se constituye en:",
        opciones: [
          "Un recurso terapéutico indispensable que concentra de manera organizada y móvil los equipos, medicamentos e insumos necesarios para la reanimación cerebro-cardio-pulmonar.",
          "Un elemento de almacenamiento del servicio de farmacia.",
          "Un registro administrativo del inventario.",
          "Un dispositivo de transporte entre servicios."
        ],
        correcta: 0,
        explicacion: "El carro de paro es un recurso terapéutico indispensable que concentra de manera organizada y móvil los equipos, medicamentos e insumos necesarios para la reanimación cerebro-cardio-pulmonar."
      },
      {
        enunciado: "¿Qué talento humano debe estar capacitado y actualizado en soporte vital básico y avanzado según su nivel de competencia?",
        opciones: [
          "Únicamente personal administrativo.",
          "Médico, enfermería, auxiliares de enfermería, regente y auxiliar de farmacia.",
          "Solamente personal de mantenimiento.",
          "Únicamente pacientes y familiares."
        ],
        correcta: 1,
        explicacion: "Se recomienda que el talento humano esté capacitado y actualizado en soporte vital básico y avanzado de acuerdo con su nivel de competencia."
      }
    ]
  },

  /* ======================================================================
   * TEMA 7
   * ==================================================================== */
  {
    id: "carro-paro-registros",
    numero: 7,
    titulo: "Carro de paro: acta de apertura, responsables y control",
    documento: "Procedimiento de manejo de carro de paro — págs. 5, 6, 8, 9 y 10",
    resumen: "Acta de apertura, responsabilidades por cargo, equipos del carro, control mensual, y los hogares deben permanecer sellados.",
    preguntas: [
      {
        enunciado: "¿Cuál es el propósito del acta de apertura del carro de paro?",
        opciones: [
          "Registrar únicamente la fecha de mantenimiento del equipo biomédico.",
          "Documentar los insumos y medicamentos utilizados durante una urgencia vital y dejar trazabilidad del proceso.",
          "Solicitar nuevos equipos tecnológicos.",
          "Registrar la asistencia del personal."
        ],
        correcta: 1,
        explicacion: "El acta de apertura deja registrado cada uno de los productos utilizados durante una eventualidad considerada urgencia vital, permitiendo la trazabilidad del proceso."
      },
      {
        enunciado: "Cuando se realiza una apertura del carro de paro, debe registrarse:",
        opciones: [
          "Únicamente el nombre del paciente.",
          "Fecha de apertura, insumos utilizados, medicamentos utilizados, pendientes por reponer, observaciones y responsables.",
          "Solo el diagnóstico médico.",
          "Solamente los medicamentos administrados."
        ],
        correcta: 1,
        explicacion: "Consta de datos del paciente, evento (causa de atención), fecha de apertura, descripción de insumos o medicamentos utilizados, pendientes por reponer, observación, fecha de cierre, enfermera responsable y auxiliar de farmacia."
      },
      {
        enunciado: "¿Cuál es una responsabilidad del enfermero(a) frente al carro de paro?",
        opciones: [
          "Realizar exclusivamente la prescripción médica.",
          "Garantizar el control, las aperturas, la existencia según stock y el acompañamiento en las auditorías del carro de paro.",
          "Realizar únicamente la limpieza del carro.",
          "Autorizar compras institucionales."
        ],
        correcta: 1,
        explicacion: "El enfermero(a) garantiza el control, las aperturas, la existencia según stock y la reposición, recepciona fórmulas médicas con auxiliar de farmacia y acompaña la auditoría mensual que hace el servicio farmacéutico. Además diligencia el stock con su respectiva acta de apertura."
      },
      {
        enunciado: "¿Cuál es la responsabilidad del auxiliar de enfermería frente al carro de paro?",
        opciones: [
          "Apoyar la apertura, recibir los insumos y tramitar las fórmulas médicas con el auxiliar de farmacia, y auditar mensualmente los procesos.",
          "Prescribir los medicamentos del evento.",
          "Dirigir la RCP del paciente.",
          "Administrar los recursos de la institución."
        ],
        correcta: 0,
        explicacion: "El auxiliar de enfermería apoya la apertura, recibe los insumos, tramita las fórmulas médicas con el auxiliar de farmacia y acompaña la auditoría mensual del servicio farmacéutico."
      },
      {
        enunciado: "¿Cuál es la responsabilidad del regente y del auxiliar de farmacia respecto al carro de paro?",
        opciones: [
          "Administrar los signos vitales del paciente.",
          "Verificar las auditorías (informar anomalías), realizar el cronograma de revisión y la verificación mensual del stock y su semaforización.",
          "Realizar las compresiones torácicas.",
          "Diligenciar la historia clínica del paciente."
        ],
        correcta: 1,
        explicacion: "El regente de farmacia verifica las auditorías e informa anomalías, realiza el cronograma de revisión; el auxiliar de farmacia realiza la verificación mensual del stock y la semaforización."
      },
      {
        enunciado: "Si el carro de paro se encuentra sellado y sin evidencia de apertura:",
        opciones: [
          "Debe abrirse diariamente para verificar los medicamentos.",
          "Debe permanecer sellado y realizar la anotación correspondiente como carro sellado.",
          "Debe retirarse del servicio.",
          "Debe cambiarse todo su contenido."
        ],
        correcta: 1,
        explicacion: "Si el carro se encuentra sellado y sin apertura, se deja sellado, no debe abrirse, y se hace anotación como carro sellado. Si se encuentra abierto se debe hacer conteo completo y verificar las existencias."
      },
      {
        enunciado: "La revisión mensual del carro de paro permite:",
        opciones: [
          "Verificar existencias, vencimientos y actas de apertura para garantizar la disponibilidad adecuada.",
          "Cambiar todos los medicamentos mensualmente.",
          "Suspender las auditorías institucionales.",
          "Eliminar los formatos de control."
        ],
        correcta: 0,
        explicacion: "Permite ver la rotación de los productos contenidos en el carro de paro, garantindo la disponibilidad adecuada de insumos y medicamentos."
      },
      {
        enunciado: "Durante la apertura del carro de paro se debe dejar registro en el formato:",
        opciones: [
          "FR-130-35.",
          "FR-200-15.",
          "FR-331-15.",
          "FR-120-10."
        ],
        correcta: 2,
        explicacion: "El registro se debe dejar en el formato Acta de apertura de carro de paro (FR-331-15)."
      },
      {
        enunciado: "Cuando no se haya registrado ninguna apertura del carro de paro, se debe:",
        opciones: [
          "Abrir el carro para verificar el contenido.",
          "Dejar registro de revisión en la lista de chequeo.",
          "No dejar ningún registro.",
          "Notificar a todo el personal por correo."
        ],
        correcta: 1,
        explicacion: "Cuando no se haya registrado ninguna apertura, se deja registro de revisión en la lista de chequeo. Si quedan pendientes justificados, se deja la novedad y la causa en el formato correspondiente."
      },
      {
        enunciado: "Con qué frecuencia y ante qué instancia se consolida el informe de existencias, vencimientos y actas de apertura del carro de paro?",
        opciones: [
          "Mensualmente ante el comité de farmacia, consolidando el informe por trimestre.",
          "Trimestralmente ante el comité de seguridad del paciente.",
          "Semanalmente ante la subgerencia científica.",
          "Solo cuando se abre el carro de paro."
        ],
        correcta: 0,
        explicacion: "Mensualmente en el comité de farmacia se debe presentar un informe de las existencias, vencimientos y actas de apertura, lo que permitirá ver la rotación de los productos; este informe se debe consolidar por trimestre."
      },
      {
        enunciado: "¿Cuál de los siguientes equipos hace parte de los recursos tecnológicos del carro de paro?",
        opciones: [
          "Computador administrativo.",
          "Desfibrilador con capacidad de monitorización y marcapasos.",
          "Equipo de radiología.",
          "Ecógrafo portátil únicamente."
        ],
        correcta: 1,
        explicacion: "Los recursos incluyen carro de paro, guayas, desfibrilador con capacidad de monitorización y marcapasos, laringoscopio con doble par de baterías además de hojas curvas y rectas, fuente de oxígeno, aspiración de secreciones, monitor de signos vitales y bomba de infusión."
      },
      {
        enunciado: "Los recursos metodológicos del carro de paro incluyen:",
        opciones: [
          "Procedimiento actual, formato de stock y formato de acta de apertura.",
          "Solo el procedimiento actual.",
          "Formato de stock y manual de compras.",
          "Solo el formato de acta de apertura."
        ],
        correcta: 0,
        explicacion: "Los recursos metodológicos son el procedimiento actual, el formato de stock y el formato de acta de apertura."
      }
    ]
  },

  /* ======================================================================
   * TEMA 8
   * ==================================================================== */
  {
    id: "ronda-seguridad",
    numero: 8,
    titulo: "Ronda de seguridad",
    documento: "Procedimiento para ronda de seguridad — págs. 2 a 5",
    resumen: "Objetivo, alcance, definiciones, generalidades y frecuencia de las rondas de seguridad en la ESE Municipal.",
    preguntas: [
      {
        enunciado: "¿Cuál es el objetivo principal de la ronda de seguridad?",
        opciones: [
          "Capacitar al personal nuevo.",
          "Evaluar el desempeño laboral.",
          "Realizar seguimiento al cumplimiento de la política y las buenas prácticas de seguridad del paciente.",
          "Controlar el inventario de medicamentos."
        ],
        correcta: 2,
        explicacion: "El objetivo es definir las acciones para realizar seguimiento y evaluar el grado de cumplimiento de la política, el programa de seguridad del paciente junto con las buenas prácticas de seguridad del paciente."
      },
      {
        enunciado: "¿Qué permite identificar una ronda de seguridad durante su ejecución?",
        opciones: [
          "Únicamente fallas administrativas.",
          "Riesgos e incidentes relacionados con la seguridad del paciente.",
          "Costos de atención.",
          "Horarios del personal."
        ],
        correcta: 1,
        explicacion: "La ronda de seguridad es una herramienta operativa que permite conocer la adherencia a las buenas prácticas, ayuda a identificar riesgos e incidentes en seguridad del paciente, permitiendo implementar acciones de mejora."
      },
      {
        enunciado: "¿Con qué frecuencia mínima deben realizarse las rondas de seguridad en los centros de salud de 24 horas?",
        opciones: [
          "Semanal.",
          "Quincenal.",
          "Mensual.",
          "Trimestral."
        ],
        correcta: 2,
        explicacion: "Las rondas de seguridad se realizan de manera mensual, con una frecuencia mínima en centros de salud de 24 horas, como parte del seguimiento de los procesos seguros."
      },
      {
        enunciado: "¿En qué formato debe dejarse constancia de la realización de la ronda de seguridad?",
        opciones: [
          "FR-120-10.",
          "FR-130-35.",
          "FR-200-01.",
          "FR-150-22."
        ],
        correcta: 1,
        explicacion: "Se deja constancia de la ronda a través del formato de ronda de seguridad (FR-130-35)."
      },
      {
        enunciado: "Después de identificar incumplimientos durante la ronda, ¿qué acción debe realizarse?",
        opciones: [
          "Archivar el informe sin seguimiento.",
          "Suspender el servicio.",
          "Establecer oportunidades de mejora y hacer seguimiento en la siguiente ronda.",
          "Cambiar inmediatamente al personal."
        ],
        correcta: 2,
        explicacion: "Se revisan los incumplimientos, se establecen las oportunidades de mejora y conductas a seguir, a las cuales se les hará seguimiento en la siguiente ronda de seguridad."
      },
      {
        enunciado: "¿Cuál es el alcance del procedimiento de ronda de seguridad?",
        opciones: [
          "Inicia desde la planeación de la ronda y finaliza con su realización, análisis y correcciones y/o acciones de mejora; aplica a los centros de salud de la ESE Municipal de Villavicencio.",
          "Solo aplica al servicio de urgencias.",
          "Inicia con la elaboración del informe y finaliza con el archivo.",
          "Aplica únicamente a los profesionales médicos."
        ],
        correcta: 0,
        explicacion: "Inicia desde la planeación de la ronda de seguridad y finaliza con la realización de la ronda, análisis y correcciones y/o acciones de mejora; aplica a los centros de salud de la ESE Municipal."
      },
      {
        enunciado: "¿Quiénes son responsables del procedimiento de ronda de seguridad?",
        opciones: [
          "Solamente los líderes de procesos asistenciales.",
          "La subgerencia científica, el jefe de la oficina de planeación y calidad y los líderes de procesos asistenciales.",
          "Únicamente la oficina de planeación y calidad.",
          "Todos los colaboradores de la institución por igual."
        ],
        correcta: 1,
        explicacion: "Son responsables: la subgerencia científica, el jefe de la oficina de planeación y calidad y los líderes de procesos asistenciales."
      },
      {
        enunciado: "Un evento centinela se define como:",
        opciones: [
          "Un tipo de evento adverso en donde está presente un daño físico o psicológico severo de carácter permanente y que requiere tratamiento y un cambio permanente de vida.",
          "Una falla administrativa sin impacto en el paciente.",
          "Un incidente menor sin lesión.",
          "Una práctica de seguridad correcta verificada en la ronda."
        ],
        correcta: 0,
        explicacion: "El evento centinela es un evento adverso con daño físico o psicológico severo, de carácter permanente, que requiere tratamiento y un cambio permanente de vida."
      },
      {
        enunciado: "Una barrera de seguridad se define como:",
        opciones: [
          "Una acción o circunstancia que reduce la probabilidad de presentación de incidente o evento adverso.",
          "El equipo de seguridad que vigila las instalaciones.",
          "La señalización de las zonas restringidas.",
          "El procedimiento de control de acceso del personal."
        ],
        correcta: 0,
        explicacion: "Una barrera de seguridad es una acción o circunstancia que reduce la probabilidad de presentación de incidente o evento adverso."
      },
      {
        enunciado: "La seguridad del paciente se define como:",
        opciones: [
          "El conjunto de elementos estructurales, procesos, instrumentos y metodologías basadas en la evidencia científicamente comprobada que propende minimizar el riesgo de sufrir eventos adversos en el proceso de atención en salud o de mitigar sus consecuencias.",
          "La cumplimiento de la normativa institucional interna.",
          "El uso adecuado de los equipos biomédicos.",
          "La aplicación de los protocolos de régimen de medicamentos."
        ],
        correcta: 0,
        explicacion: "Es el conjunto de elementos estructurales, procesos, instrumentos y metodologías basadas en evidencia científica que propende minimizar el riesgo de eventos adversos o mitigar sus consecuencias."
      },
      {
        enunciado: "Las buenas prácticas de seguridad del paciente que se verifican en la ronda incluyen:",
        opciones: [
          "Solo insumos seguros y equipos seguros.",
          "Insumos seguros, equipos seguros, seguridad documental, infraestructura segura, gestión de eventos adversos y prácticas misionales seguras.",
          "Únicamente infraestructura segura y documentos.",
          "Solo gestión de eventos adversos."
        ],
        correcta: 1,
        explicacion: "Se verifican las prácticas misionales seguras: insumos seguros, equipos seguros, seguridad documental, infraestructura segura y gestión de eventos adversos, además de realizar un recorrido por los servicios programados y entrevistar al personal, pacientes y familiares."
      },
      {
        enunciado: "¿Con qué periodicidad se socializan en el comité de seguridad del paciente las rondas realizadas en el mes?",
        opciones: [
          "De manera trimestral.",
          "De manera quincenal.",
          "De manera semanal.",
          "De manera anual."
        ],
        correcta: 0,
        explicacion: "Las rondas realizadas en el mes se socializan en el comité de seguridad del paciente de manera trimestral."
      }
    ]
  },

  /* ======================================================================
   * TEMA 9
   * ==================================================================== */
  {
    id: "entrega-turno",
    numero: 9,
    titulo: "Recibo y entrega de turno de enfermería",
    documento: "Procedimiento para recibo y entrega de turno de enfermería en Urgencias — págs. 3 a 13",
    resumen: "Objetivo, tipos de entrega de turno, PAE, horarios, medidas de seguridad del paciente y contenido de la entrega.",
    preguntas: [
      {
        enunciado: "¿Cuál es el propósito principal del procedimiento de recibo y entrega de turno?",
        opciones: [
          "Reducir el tiempo del cambio de turno.",
          "Estandarizar la entrega y el recibo de turno para garantizar la continuidad del servicio.",
          "Controlar el ingreso de visitantes.",
          "Evaluar el rendimiento del personal."
        ],
        correcta: 1,
        explicacion: "El objetivo es implementar una herramienta que permita estandarizar la entrega y recibo de turno en los centros de salud de 24 horas, asegurando la continuidad del servicio en los diferentes escenarios."
      },
      {
        enunciado: "Antes de entregar el turno, ¿qué debe hacer el personal con la historia clínica del paciente?",
        opciones: [
          "Archivar únicamente la evolución.",
          "Completar detalladamente los registros clínicos y actualizar el kardex.",
          "Entregarla al paciente.",
          "Revisarla solo si hay novedades."
        ],
        correcta: 1,
        explicacion: "Antes de iniciar la entrega se deben elaborar detalladamente los registros en la historia clínica: evolución de enfermería, control de líquidos, signos vitales, monitoreo neurológico, hoja de tratamientos o medicamentos; además actualizar el kardex y verificar el plan de cuidados instaurado por el paciente y el cumplimiento a las metas establecidas."
      },
      {
        enunciado: "Antes de finalizar el cambio de turno, ¿qué debe hacer el personal de enfermería?",
        opciones: [
          "Retirarse cuando termine de entregar la información.",
          "Esperar a que el médico autorice la salida.",
          "Permanecer hasta finalizar completamente el recibo y la entrega del turno.",
          "Entregar únicamente el inventario de equipos."
        ],
        correcta: 2,
        explicacion: "El personal de enfermería no debe retirarse hasta finalizar el recibo y la entrega del turno."
      },
      {
        enunciado: "¿Qué debe realizar el personal antes de entregar el turno para verificar el estado de los pacientes?",
        opciones: [
          "Una auditoría documental.",
          "Una pre-ronda.",
          "Un inventario administrativo.",
          "Una reunión con familiares."
        ],
        correcta: 1,
        explicacion: "Se debe realizar una pre-ronda antes de entregar el turno, además de revisar los pacientes para confirmar su estado y actualizar el kardex."
      },
      {
        enunciado: "Durante el cambio de turno, ¿qué elemento debe entregarse con revisión detallada e inventario?",
        opciones: [
          "Carro de aseo.",
          "Carro de alimentos.",
          "Carro de paro.",
          "Archivo clínico."
        ],
        correcta: 2,
        explicacion: "La entrega y recibo de turno debe incluir la entrega de carro de paro con revisión detallada del equipo de reanimación y su respectivo inventario, dejando registro en actas de apertura durante el turno."
      },
      {
        enunciado: "Aplica para el procedimiento de recibo y entrega de turno de enfermería:",
        opciones: [
          "Únicamente a enfermeras profesionales en urgencias.",
          "Enfermeras profesionales, auxiliares de enfermería y personal de los servicios de observación, hospitalización, maternidad, sala ERA y reanimación.",
          "Solo al personal de sala de partos.",
          "Exclusivamente a los coordinadores de turno."
        ],
        correcta: 1,
        explicacion: "Aplica para enfermeras profesionales, auxiliares de enfermería y servicios de observación, hospitalización, maternidad, sala ERA y reanimación."
      },
      {
        enunciado: "Sobre los tipos de entrega de turno, la entrega en equipo consiste en que:",
        opciones: [
          "Todo el equipo de enfermería conoce al paciente: diagnóstico, tratamiento médico, necesidades, exigencias del paciente y las acciones de enfermería.",
          "Solo se recorre a cada paciente con el personal entrante.",
          "Se entrega el turno por escrito únicamente.",
          "Se realiza únicamente con el médico responsable."
        ],
        correcta: 0,
        explicacion: "En la entrega en equipo todo el equipo de enfermería conoce al paciente y puede discutir su situación para llegar a una acción de apoyo, con elaboración de plan de cuidados continuado."
      },
      {
        enunciado: "Una de las desventajas de la entrega de turno en equipo es que:",
        opciones: [
          "El paciente puede sentir miedo del equipo de enfermería.",
          "Al reunirse el equipo de enfermería en un sitio especial, los pacientes quedan solos y el estado del paciente puede cambiar durante ese tiempo.",
          "No se puede elaborar el plan de cuidados.",
          "Se duplica la información entregada."
        ],
        correcta: 1,
        explicacion: "Las desventajas señaladas en el procedimiento son que al reunirse el equipo en un sitio especial los pacientes quedan solos, el estado del paciente puede cambiar durante ese tiempo y no se puede comprobar si la información dada corresponde a la situación actual del paciente."
      },
      {
        enunciado: "En la entrega de turno en forma de revista, una ventaja es:",
        opciones: [
          "Es más rápida porque no se requiere la presencia de los pacientes.",
          "El informe es más exacto por la observación directa al paciente y se pueden identificar otras necesidades.",
          "Evita la ansiedad del paciente.",
          "No requiere personal adicional."
        ],
        correcta: 1,
        explicacion: "Ventajas: el informe es más exacto por la observación directa, se pueden identificar otras necesidades del paciente, el paciente no se siente solo y el personal y el paciente llegan a conocerse más."
      },
      {
        enunciado: "Una desventaja de la entrega de turno en forma de revista es que:",
        opciones: [
          "La información delante de los pacientes puede complicar su situación y las palabras técnicas producen ansiedad.",
          "El paciente se siente solo durante el recorrido.",
          "No se identifica otras necesidades del paciente.",
          "El personal no conoce al paciente."
        ],
        correcta: 0,
        explicacion: "La información delante de los pacientes puede complicar su situación; las palabras técnicas producen ansiedad, por lo que deben utilizarse términos claros y sencillos que no afecten la evolución del paciente ni la satisfacción del acompañante."
      },
      {
        enunciado: "Las jornadas de turno de enfermería en el procedimiento son de:",
        opciones: [
          "Seis y ocho horas.",
          "Seis y doce horas.",
          "Ocho y doce horas.",
          "Cuatro y seis horas."
        ],
        correcta: 1,
        explicacion: "Las jornadas son de seis y doce horas: turno mañana 07:00 a.m. – 13:00 p.m., turno tarde 13:00 p.m. – 19:00 p.m. y turno noche 19:00 p.m. – 07:00 a.m."
      },
      {
        enunciado: "El personal que recibe turno debe:",
        opciones: [
          "Recibir únicamente el inventario de los elementos de trabajo.",
          "Preguntar las dudas que tenga en relación con el estado del paciente.",
          "Esperar a que el personal saliente se retire para preguntar.",
          "No preguntar dudas para no retrasar el cambio de turno."
        ],
        correcta: 1,
        explicacion: "El personal que recibe turno debe preguntar las dudas que tenga en relación con el estado del paciente."
      },
      {
        enunciado: "El Proceso de Atención de Enfermería (PAE) sirve como:",
        opciones: [
          "Un registro exclusivamente administrativo del turno.",
          "Un instrumento de trabajo que favorece cuidados de enfermería dinámicos, deliberados, conscientes, ordenados y sistematizados.",
          "Una escala de evaluación del riesgo de úlceras.",
          "Un formato de entrega de medicamentos."
        ],
        correcta: 1,
        explicacion: "El PAE sirve de instrumento de trabajo, favorece que los cuidados se realicen de manera dinámica, deliberada, consciente, ordenada y sistematizada, traza objetivos y actividades evaluables y permite una base de conocimientos propia para la autonomía de la enfermería."
      },
      {
        enunciado: "Entre las escalas a tener en cuenta en el PAE se encuentran:",
        opciones: [
          "Dowthon y Braden.",
          "Glasgow y Apgar.",
          "Mallory y Killip.",
          "Sofia y Framingham."
        ],
        correcta: 0,
        explicacion: "Las escalas aplicadas dentro del PAE son Dowthon (riesgo de úlcera por presión) y Braden."
      },
      {
        enunciado: "Dentro de las medidas de seguridad del paciente verificadas al recibo del turno se incluye:",
        opciones: [
          "Barandas elevadas y cabecera a 45 grados.",
          "Cabecera a 90 grados y barandas bajas.",
          "Solo rótulo de cabecera.",
          "Rótulo de venopunción, únicamente."
        ],
        correcta: 0,
        explicacion: "Se debe verificar todas las medidas de seguridad del paciente: barandas elevadas, cabecera 45 grados, rótulo de cabecera, rótulo de venopunción vigente, rótulo de infusiones y demás dispositivos. Además se alerta cada fuga, UPP o flebitis."
      },
      {
        enunciado: "Se establece como horario para el ingreso de pacientes al servicio de hospitalización:",
        opciones: [
          "Hasta una hora antes de la entrega de turno.",
          "Hasta dos horas después de la entrega de turno.",
          "Hasta el final de la jornada nocturna.",
          "Sin horario establecido."
        ],
        correcta: 0,
        explicacion: "El ingreso de pacientes al servicio de hospitalización se establece hasta una hora antes de la entrega de turno, con excepción de la población priorizada (maternas, pacientes con limitación física, víctimas de violencia o abuso)."
      },
      {
        enunciado: "Con respecto a la entrega de medicamentos entre turnos, es correcto que:",
        opciones: [
          "Se entregan los medicamentos pendientes de la semana anterior.",
          "Se entregan los medicamentos por paciente de acuerdo con la formulación para las 24 horas.",
          "No se entregan medicamentos durante el cambio de turno.",
          "El paciente debe comprar sus medicamentos en cada turno."
        ],
        correcta: 1,
        explicacion: "La entrega de turno incluye entregar medicamentos por paciente de acuerdo con la formulación para las 24 horas."
      },
      {
        enunciado: "El inventario de los elementos de trabajo que debe entregarse en el cambio de turno incluye:",
        opciones: [
          "Únicamente el monitor de signos vitales.",
          "Monitor de signos vitales, bombas de infusión, desfibrilador, Ambu y laringoscopio, entre otros, dejando registro en el libro de verificación de equipos.",
          "Solo las bombas de infusión.",
          "Únicamente el desfibrilador."
        ],
        correcta: 1,
        explicacion: "Se debe entregar el inventario de los elementos de trabajo (monitor de signos vitales, bombas de infusión, desfibrilador, Ambu, laringoscopio, etc.) y dejar registro en el libro de verificación de equipos, además de reportar daños o pérdidas."
      },
      {
        enunciado: "Además de los procedimientos clínicos, la entrega y recibo de turno debe incluir:",
        opciones: [
          "Solo las novedades clínicas del turno.",
          "Verificación de procesos administrativos, novedades administrativas en trámite con registro en el libro de novedades y entrega de la estación de enfermería organizada, limpia y bien presentada.",
          "Únicamente la entrega del carro de paro.",
          "Solo el reporte de eventos adversos."
        ],
        correcta: 1,
        explicacion: "La entrega incluye verificación de procesos administrativos (trámites con referencia e historias en proceso de facturación), entregar novedades administrativas en trámite con registro en el libro de novedades, informar eventos adversos o servicios no conformes y entregar la estación de enfermería organizada."
      },
      {
        enunciado: "¿Quién verifica diariamente los registros de recibo y entrega de turno, tanto de médicos como de enfermería?",
        opciones: [
          "El coordinador administrativo del centro de salud.",
          "El líder de procesos.",
          "El comité de seguridad del paciente, trimestralmente.",
          "El comité de farmacia."
        ],
        correcta: 1,
        explicacion: "Se verifica diariamente por el líder de procesos los registros de recibo y entrega de turno tanto de médicos como de enfermería, teniendo en cuenta la oportunidad en la atención al paciente, eficiencia y calidad de cuidado."
      }
    ]
  },
];

/* -------------------------------------------------------------------------
 * Utilidades de apoyo para el motor de evaluación
 * ---------------------------------------------------------------------- */
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
