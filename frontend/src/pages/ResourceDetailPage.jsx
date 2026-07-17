import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { PublicPageLayout } from "../components/PublicPageLayout";
import { RESOURCES } from "./ResourcesPage";

// ─── Títulos ──────────────────────────────────────────────────────────────────
const RESOURCE_TITLES = {
  "como-crear-presupuesto": "Cómo crear un presupuesto",
  "regla-50-30-20": "Regla 50/30/20",
  "como-ahorrar-dinero": "Cómo ahorrar dinero",
  "fondo-de-emergencia": "Qué es un fondo de emergencia",
  "como-eliminar-deudas": "Cómo eliminar deudas",
  "errores-financieros": "Errores financieros comunes",
  "educacion-financiera-estudiantes": "Educación financiera para estudiantes",
  "gastos-hormiga": "Cómo controlar gastos hormiga",
  "metodos-de-ahorro": "Métodos de ahorro",
  "glosario-financiero": "Glosario financiero",
};

// ─── Contenido de cada recurso ────────────────────────────────────────────────
const RESOURCE_CONTENT = {
  "como-crear-presupuesto": {
    readTime: "6 min",
    category: "Presupuesto",
    intro:
      "Crear un presupuesto desde cero no es un ejercicio de restricción ni de disciplina extrema; es una forma de convertir el caos financiero en claridad. Cuando aprendes a dar un destino a cada peso, dejas de reaccionar ante el dinero y empiezas a dirigirlo con intención, como quien construye un mapa antes de emprender un viaje.",
    sections: [
      {
        title: "Por qué es indispensable",
        body: "Un presupuesto no sirve solo para controlar el dinero que ya tienes, sino para anticipar el dinero que vas a necesitar. La diferencia entre quien vive al día y quien construye estabilidad no está únicamente en los ingresos, sino en la capacidad de organizar el gasto de manera consciente. Cuando el presupuesto existe, las decisiones dejan de ser improvisadas y empiezan a ser estratégicas.",
      },
      {
        title: "Fase 1 — Identificación y registro",
        body: "Antes de proyectar el futuro, debes conocer tu presente. Durante un mes completo, registra todos tus movimientos financieros y divídelos en categorías claras:\n\n• Ingresos netos: el dinero real que ingresa a tus cuentas después de retenciones, impuestos y seguridad social. Si eres independiente, calcula un promedio de tus últimos 3 a 6 meses.\n• Costos fijos obligatorios: arriendo o hipoteca, servicios públicos, alimentación básica, transporte al trabajo o estudio, seguros y cuotas mínimas de créditos.\n• Costos variables: salidas a comer, streaming, ropa, hobbies y otros gastos que fluctúan según tus decisiones.",
      },
      {
        title: "Fase 2 — El enfoque base cero",
        body: "Este método consiste en asignar un trabajo a cada centavo antes de que comience el mes. La idea es simple: tus ingresos menos tus gastos menos tus metas de ahorro e inversión debe dar cero. Si te sobran $50.000 COP sin asignar, tu cerebro los gastará de manera impulsiva. Mejor asígnalos formalmente a un fondo de ahorro, al pago de una deuda o a una meta específica.",
      },
      {
        title: "La fórmula del presupuesto base cero",
        body: "Ingresos - Gastos - Ahorro/Inversión = 0\n\nCuando el saldo final de tu plan es cero, significa que cada peso ya tiene un propósito. Eso es lo que convierte un presupuesto en una herramienta real de control y no en una simple lista de gastos.",
      },
      {
        title: "Cómo convertirlo en un hábito durable",
        body: "Un presupuesto no se mantiene por voluntad absoluta; se mantiene porque se vuelve parte de la rutina. Revisarlo una vez por semana, ajustar pequeñas desviaciones y celebrando los avances, es lo que lo hace sostenible. La meta no es ser perfecto, sino ser consistente. Con el tiempo, una buena estructura financiera deja de sentirse como una carga y empieza a sentirse como una forma de paz.",
      },
    ],
    tips: [
      "Empieza registrando todos tus gastos durante un mes antes de crear tu presupuesto definitivo.",
      "Incluye una categoría para imprevistos aunque sea pequeña, para que no se rompa el plan.",
      "Si algo no encaja, no lo ignores: el presupuesto debe reflejar la realidad de tu vida.",
      "Haz seguimiento semanal para ajustar el plan antes de que el problema se vuelva grande.",
      "Revisa cada cambio de ingresos o gastos como una oportunidad para mejorar el sistema, no para romperlo.",
    ],
  },

  "regla-50-30-20": {
    readTime: "5 min",
    category: "Presupuesto",
    intro:
      "La regla 50/30/20 ha sobrevivido a las modas financieras porque resuelve algo fundamental: te da una forma simple de decidir cómo repartir lo que ganas sin perder de vista ni tus necesidades ni tus sueños. Es una herramienta práctica, pero también una filosofía de equilibrio entre supervivencia, disfrute y construcción de futuro.",
    sections: [
      {
        title: "Cómo funciona la regla",
        body: "La distribución se basa en tres bloques: 50% para necesidades, 30% para deseos y 20% para ahorro y pago de deudas. La idea es que cada peso que recibes tenga una función clara desde el inicio del mes.\n\n• 50% necesidades: vivienda, servicios públicos, mercado básico, transporte y pagos mínimos de deudas.\n• 30% deseos: restaurantes, streaming, ropa no esencial, viajes y hobbies.\n• 20% ahorro: fondo de emergencia, inversiones a futuro y abonos extra para deudas.",
      },
      {
        title: "Análisis detallado de los porcentajes",
        body: "El 50% para necesidades representa el costo de tu infraestructura vital. Si este porcentaje supera el 50%, tu estilo de vida es demasiado caro para tus ingresos actuales y estás expuesto a un riesgo financiero alto ante cualquier imprevisto. El 30% para deseos garantiza calidad de vida sin que el presupuesto se vuelva una prisión. La restricción absoluta puede generar frustración y compras impulsivas por rebote. Y el 20% para ahorro y pago de deudas es el motor de tu libertad financiera, porque convierte el futuro en una prioridad presente.",
      },
      {
        title: "Prueba la distribución en tu caso",
        body: "La regla 50/30/20 sirve como punto de partida, pero no es una camisa de fuerza. Si vives en una ciudad cara, puedes ajustar el porcentaje de necesidades al 60%. Si tu prioridad es salir de deudas, puedes elevar el ahorro temporalmente al 30%. Lo importante no es seguir la regla al pie de la letra, sino entender el principio: primero lo esencial, luego el disfrute y, finalmente, el futuro.",
      },
      {
        title: "Por qué esta regla sigue siendo útil",
        body: "La razón por la que esta regla perdura es que funciona como una brújula. No necesitas memorizar fórmulas complicadas para tomar mejores decisiones financieras; basta con tener una estructura simple que te ayude a decidir con claridad. En un mundo de estímulos constantes, la simplicidad es una forma de poder.",
      },
    ],
    tips: [
      "Calcula siempre sobre tu ingreso neto, no sobre el bruto.",
      "Si tus necesidades superan el 50%, revisa tus gastos fijos antes de recortar tus deseos.",
      "Automatiza el 20% de ahorro el día de pago para no depender de la fuerza de voluntad.",
      "Revisa la distribución cada 6 meses o cuando tu ingreso cambie.",
      "En vez de obsesionarte con la perfección, busca consistencia y equilibrio.",
    ],
  },

  "como-ahorrar-dinero": {
    readTime: "7 min",
    category: "Ahorro",
    intro:
      "Ahorrar no consiste en renunciar a todo lo que disfrutas; consiste en decidir, desde el principio, que una parte de tu dinero tiene un propósito más grande que el consumo inmediato. Cuando el ahorro se convierte en una práctica deliberada y automática, deja de sentirse como una imposición y empieza a parecer una forma de libertad.",
    sections: [
      {
        title: "El sesgo del descuento hiperbólico",
        body: "La psicología financiera demuestra que valoramos mucho más las recompensas inmediatas, como comprar un café o un videojuego hoy, que las recompensas futuras, como comprar una moto o jubilarte. Para combatir este sesgo inconsciente, debes aplicar tres pilares técnicos.",
      },
      {
        title: "Págate a ti primero",
        body: "Tan pronto como recibas tus ingresos, transfiere tu porcentaje de ahorro a una cuenta separada. No esperes a fin de mes. El objetivo es que el ahorro sea una prioridad automática, no una decisión emocional que se pospone.",
      },
      {
        title: "Fricción de salida y automatización",
        body: "Automatiza transferencias a un bolsillo o cuenta de ahorros el mismo día de tu pago. Si colocas barreras físicas, como no llevar la tarjeta de esa cuenta en la billetera, reduces el impulso de gastarlo. El ahorro funciona mejor cuando no depende de tu voluntad del día.",
      },
      {
        title: "Objetivos S.M.A.R.T.",
        body: "No ahorres para ver qué pasa. Define metas concretas y medibles. Un ejemplo incorrecto es: «Quiero ahorrar para una moto». Un ejemplo correcto es: «Ahorraré $600.000 COP mensuales durante 8 meses para completar la cuota inicial de mi motocicleta en diciembre de 2026».",
      },
      {
        title: "La verdadera ventaja del ahorro constante",
        body: "El verdadero poder del ahorro no está en la cantidad que guardas un día, sino en la constancia con la que lo haces. Un pequeño ahorro mensual, mantenido durante años, puede generar más estabilidad que una gran suma obtenida de manera errática. Lo que cambia la historia financiera de una persona no es el golpe de suerte, sino la disciplina de los pequeños hábitos repetidos.",
      },
    ],
    tips: [
      "Empieza con un porcentaje pequeño y aumenta poco a poco hasta llegar al 10% o más.",
      "Usa una cuenta separada para evitar que el dinero de ahorro se mezcle con tus gastos diarios.",
      "Haz que tus metas sean visibles y medibles para mantener la motivación.",
      "Si un gasto no está alineado con tu objetivo, no lo conviertas en una decisión impulsiva.",
      "Piensa en el ahorro como una inversión en tu tranquilidad, no como un sacrificio innecesario.",
    ],
  },

  "fondo-de-emergencia": {
    readTime: "6 min",
    category: "Ahorro",
    intro:
      "Un fondo de emergencia no es un lujo ni una meta sofisticada; es la base más humilde y más poderosa de la estabilidad financiera. Cuando la vida te sorprende con una enfermedad, una pérdida de ingresos o una reparación urgente, este colchón de liquidez puede marcar la diferencia entre una crisis temporal y una catástrofe económica.",
    sections: [
      {
        title: "Por qué es vital",
        body: "Estudios de comportamiento financiero estiman que una gran parte de los hogares que caen en deudas de tarjetas de crédito con intereses usureros lo hacen para cubrir un gasto imprevisto de salud o reparación del hogar de baja escala. Tener un fondo de emergencia evita que un problema pequeño se convierta en una crisis financiera.",
      },
      {
        title: "Características fundamentales",
        body: "Tu fondo de emergencia debe ser de alta liquidez, de bajo riesgo y capaz de cubrir entre 3 y 6 meses de gastos fijos vitales para tu supervivencia. El dinero debe estar disponible en menos de 24 horas y sin exposición a la volatilidad de instrumentos de riesgo como criptomonedas o la bolsa.",
      },
      {
        title: "Cómo calcularlo",
        body: "Suma tus gastos fijos mensuales de supervivencia, como arriendo, alimentos básicos, transporte y servicios. Si esa cifra es de $1.200.000 COP, tu meta podría ser de $3.600.000 a $7.200.000 COP, dependiendo de la estabilidad de tus ingresos.",
      },
      {
        title: "Cómo construirlo desde cero",
        body: "No necesitas tenerlo todo de inmediato. Comienza con una meta mínima, por ejemplo $500.000 COP, y aumenta gradualmente hasta completar 3 o 6 meses de gastos. El progreso cuenta más que la perfección: un ahorro pequeño y constante es mucho mejor que uno grande y esporádico.",
      },
      {
        title: "El valor emocional del fondo",
        body: "Más allá del cálculo matemático, este fondo cambia la forma en que enfrentas el estrés. Cuando sabes que tienes un respaldo real para los imprevistos, reduces la ansiedad, tomas decisiones con más calma y evitas caer en la tentación de resolver problemas con deuda. A veces, la mayor ventaja del fondo no es financiera, sino psicológica.",
      },
    ],
    tips: [
      "Guárdalo en una cuenta separada y de fácil acceso para que no se mezcle con tus gastos diarios.",
      "Evita invertirlo en productos volátiles; su propósito es protegerte, no generar riesgo.",
      "Repón el fondo inmediatamente después de usarlo para mantenerlo intacto.",
      "Si lo ves como una prioridad, será más fácil cuidarlo cuando llegue la sorpresa inesperada.",
      "Ponle un nombre claro a la cuenta para recordarte su propósito cada vez que la veas.",
    ],
  },

  "como-eliminar-deudas": {
    readTime: "8 min",
    category: "Deudas",
    intro:
      "Salir de deudas no es solo una decisión financiera; es una decisión emocional, psicológica y estratégica. La deuda no solo consume dinero, también consume energía, tranquilidad y capacidad de planear. Cuando aprendes a atacarla con orden, el proceso deja de sentirse como una condena y empieza a parecer una recuperación.",
    sections: [
      {
        title: "Paso 1 — Haz un inventario completo",
        body: "Escribe en una lista todas tus deudas de consumo: tarjetas de crédito, préstamos personales y deudas con familiares. Ordénalas de menor a mayor saldo total, sin importar la tasa de interés que cobren.",
      },
      {
        title: "Paso 2 — Garantiza los pagos mínimos",
        body: "Configura tu presupuesto para pagar el valor mínimo requerido en todas las deudas. Esto evita reportes negativos, cobros prejurídicos y cargos por mora. La disciplina en esta parte es lo que evita que el problema se agrande.",
      },
      {
        title: "Paso 3 — Concentra toda tu fuerza en la deuda más pequeña",
        body: "Cualquier dinero extra que consigas, como recortes de gastos, trabajos extra o primas, agrégalo directamente al pago de la primera deuda de tu lista. Al ser una deuda pequeña, la liquidarás en poco tiempo y ganarás un impulso psicológico decisivo.",
      },
      {
        title: "Paso 4 — Activa el efecto de bola de nieve",
        body: "Una vez liquidada la primera deuda, toma todo el dinero que destinabas a ella y súmalo al pago mínimo de la segunda deuda más pequeña. El dinero disponible para pagar la siguiente deuda crecerá exponencialmente, acelerando todo el proceso.",
      },
      {
        title: "La parte más difícil: no volver a caer",
        body: "El mayor error al salir de deudas no es simplemente tardar más tiempo, sino volver a caer en el mismo patrón. Si no cambias el comportamiento que te llevó a endeudarte, el alivio será temporal. Por eso, una vez empieces a ver resultados, conviene reforzar tus hábitos: reducir gastos innecesarios, evitar nuevas líneas de crédito y mantener un fondo de emergencia que te proteja de recaídas.",
      },
    ],
    tips: [
      "No abras nuevas deudas mientras eliminas las actuales; eso solo aumenta la presión.",
      "La motivación importa tanto como las matemáticas: una victoria rápida puede cambiar todo.",
      "Si una deuda te está consumiendo, busca negociar antes que dejar que crezca.",
      "Cada pago extra que hagas es una prueba de que estás tomando el control.",
      "Cuando una deuda se paga, no la reemplaces por otra: protege el avance que acabas de lograr.",
    ],
  },

  "errores-financieros": {
    readTime: "6 min",
    category: "Educación",
    intro:
      "La riqueza no solo se construye ganando más, sino evitando fugas de capital innecesarias. Los errores financieros más dañinos no siempre son los más visibles: muchas veces aparecen como hábitos aparentemente inocentes que, con el tiempo, erosionan tus ingresos y tu estabilidad.",
    sections: [
      {
        title: "La inflación del estilo de vida",
        body: "Este error consiste en aumentar tus gastos de forma paralela a tus ingresos. Si recibes un incremento salarial y, de inmediato, cambias de apartamento, de celular, de transporte o empiezas a salir más seguido, tu capacidad de ahorro no mejora realmente; simplemente tu nivel de gasto se vuelve más caro. El problema no es ganar más, sino mantener el control sobre la forma en que crece tu consumo.",
      },
      {
        title: "No comprender el poder y el peligro del interés compuesto",
        body: "El interés compuesto es la acumulación de intereses sobre intereses anteriores. A tu favor, en inversiones, permite que pequenas cantidades crezcan de forma exponencial con el tiempo. En tu contra, en tarjetas de crédito o créditos rotativos, si solo pagas el mínimo, los intereses pueden devorar tu capital y convertir una compra pequeña en una deuda mucho más pesada de lo que parecía en un inicio.",
      },
      {
        title: "Esperar a ganar mucho para empezar a ahorrar",
        body: "Este es uno de los errores más comunes porque parece lógico: «cuando gane más, empezaré a ahorrar». El problema es que el tiempo es el activo más valioso cuando se trata de crecimiento financiero. Una cantidad pequeña, pero constante, puede superar a una suma grande aplicada demasiado tarde. El mejor momento para empezar siempre fue antes, y el segundo mejor es hoy.",
      },
      {
        title: "Tomar decisiones financieras desde la emoción",
        body: "Muchas decisiones financieras se toman impulsivamente: se compra por impulso, se usa la tarjeta por ansiedad, se entra en deuda por una urgencia emocional o se compara la propia vida con la de otros en redes. La economía del comportamiento muestra que las personas no siempre actúan de forma racional cuando el estrés o la presión social están presentes. Por eso, establecer reglas claras antes de comprar es tan importante como tener ingresos.",
      },
    ],
    tips: [
      "Revisa tus gastos cada mes y pregúntate si están alineados con tus metas reales o solo con tu impulso del momento.",
      "No esperes a tener una gran suma para empezar a invertir: la constancia pesa más que el monto inicial.",
      "Haz un chequeo financiero cada trimestre para detectar patrones antes de que se conviertan en problemas grandes.",
      "Si algo te hace sentir presión, espera 24 horas antes de tomar una decisión financiera importante.",
    ],
  },

  "educacion-financiera-estudiantes": {
    readTime: "7 min",
    category: "Educación",
    intro:
      "La educación financiera es una de las habilidades más valiosas que cualquier estudiante puede desarrollar, porque enseña a convertir recursos limitados en oportunidades reales. El momento en que estás estudiando es perfecto para construir hábitos sólidos antes de que aparezcan obligaciones más grandes, como vivienda, familia o deudas.",
    sections: [
      {
        title: "Por qué este momento es tan importante",
        body: "Los hábitos financieros se forman con mucha frecuencia entre los 18 y 25 años. Ese periodo es clave porque aún no tienes una carga financiera demasiado pesada, pero sí ya empiezas a tomar decisiones que marcarán tu patrón de consumo. Aprender a manejar un presupuesto, ahorrar de forma automática y evitar deudas innecesarias hoy puede multiplicar tu libertad mañana.",
      },
      {
        title: "Conceptos básicos que todo estudiante debe conocer",
        body: "Antes de cualquier estrategia, debes entender con claridad los conceptos que mueven la economía personal. El ingreso es lo que entra; el gasto es lo que sale; el ahorro es lo que reservas para el futuro; la deuda es el dinero que debes devolver; el interés es el costo de pedir prestado o el beneficio de ahorrar; y la inflación es el fenómeno por el cual el mismo dinero compra menos con el tiempo. Entenderlos te permite tomar decisiones menos emocionales y más inteligentes.",
      },
      {
        title: "Aprovecha el efecto estudiante",
        body: "Una de las ventajas reales de ser estudiante es el acceso a descuentos y beneficios que muchas veces no se aprovechan. Plataformas tecnológicas, transporte, software, educación online, eventos culturales y servicios de suscripción ofrecen reducciones importantes para personas con correo institucional. Usar esas oportunidades de forma estratégica puede bajar tus costos fijos, ampliar tu acceso a herramientas y permitirte ahorrar de manera casi invisible.",
      },
      {
        title: "Usa el crédito con disciplina, no con comodidad",
        body: "Los bancos y entidades financieras suelen ofrecer tarjetas de crédito de bajo cupo para estudiantes. Ese tipo de producto puede ser útil si se usa con mucha disciplina, pero también puede convertirse en una trampa si se usa para financiar un estilo de vida que no puedes sostener. La mejor estrategia es usar el crédito solo para compras planificadas y pagarlas en una sola cuota, construyendo así un historial crediticio sólido sin caer en intereses innecesarios.",
      },
      {
        title: "Invierte en tu capital humano",
        body: "Tu activo más valioso en esta etapa no es solo el dinero que puedes guardar, sino la capacidad de generar ingresos en el futuro. Por eso invertir en tu capital humano es una de las mejores decisiones financieras que puedes tomar. Aprender inglés, programación, diseño, análisis de datos, marketing o habilidades de comunicación puede elevar significativamente tu potencial salarial y, con el tiempo, mejorar tu capacidad de acumular riqueza.",
      },
    ],
    tips: [
      "Lleva un registro de tus gastos durante 30 días para entender qué te consume más recursos y por qué.",
      "Evita crear deudas de consumo mientras aún estás formando tus hábitos financieros.",
      "Busca trabajo o servicios que te permitan generar ingresos adicionales sin comprometer tu tiempo de estudio.",
      "Haz de la educación financiera una práctica continua: leer, aprender y aplicar es mejor que acumular información sin usarla.",
    ],
  },

  "gastos-hormiga": {
    readTime: "6 min",
    category: "Hábitos",
    intro:
      "Los gastos hormiga son consumos cotidianos de bajo valor nominal que parecen insignificantes, pero que, al acumularse, pueden erosionar de forma silenciosa tu capacidad de ahorro. No son solo un problema de dinero: también son un problema de conciencia financiera y de hábitos automáticos.",
    sections: [
      {
        title: "Qué son y por qué son tan peligrosos",
        body: "Comer un snack, tomar un café, comprar un paquete de agua, pagar una suscripción olvidada o usar delivery para una comida rápida parecen desembolsos triviales. Sin embargo, la suma de estos pequeños gastos se vuelve enorme cuando se repite con frecuencia. Un solo gasto pequeño puede pasar desapercibido, pero una rutina de varios al día termina afectando el presupuesto mensual de forma considerable.",
      },
      {
        title: "La psicología detrás de los gastos hormiga",
        body: "El cerebro humano suele valorar mucho más un gasto grande y visible que una serie de pequeños gastos aparentemente inocentes. Esto se debe a la manera en que percibimos el costo emocional y el esfuerzo de pagar. Un gasto de $50.000 COP se siente más grave que cinco gastos de $10.000 COP, aunque el resultado final sea el mismo. Por eso el problema de los gastos hormiga es tan difícil de detectar: se esconden dentro de la normalidad.",
      },
      {
        title: "Técnicas psicológicas para controlarlos",
        body: "La regla de las 48 horas es una herramienta útil para frenar compras no esenciales. Cuando tengas la tentación de comprar algo innecesario, espera dos días antes de pagar. En muchos casos, esa urgencia desaparecerá. También puedes convertir el costo en horas de trabajo: si algo cuesta el equivalente a varias horas de tu salario, probablemente no sea una compra tan trivial como parece. Y si te cuesta mucho controlar el gasto, asigna un presupuesto concreto de «dinero de culpa» para disfrutar de algunos caprichos sin que se salgan del plan.",
      },
      {
        title: "Un ejemplo real del impacto acumulado",
        body: "Si gastas $4.000 COP al día en café, $3.000 COP al día en snacks y pagas una suscripción que no usas por $25.000 COP al mes, tu gasto silencioso puede superar los $230.000 COP mensuales. Eso equivale a más de $2.800.000 COP al año. Lo más preocupante es que, en la mayoría de los casos, ni siquiera sientes que estás gastando tanto porque el daño está fragmentado en pequeños actos.",
      },
    ],
    tips: [
      "Haz una revisión de tus gastos pequeños cada semana y detecta los que no aportan valor real.",
      "Usa efectivo o una tarjeta separada para tus gastos cotidianos para que el consumo se vuelva más visible.",
      "Establece un límite mensual para compras de placer y respétalo como si fuera una meta financiera.",
      "Recuerda que el objetivo no es vivir sin disfrutar, sino disfrutar sin perder el control.",
    ],
  },

  "metodos-de-ahorro": {
    readTime: "7 min",
    category: "Ahorro",
    intro:
      "No existe un único método de ahorro que funcione para todos. La mejor estrategia no es la más sofisticada, sino la que se adapta a tu personalidad, tu ritmo de ingresos y la fuerza de voluntad que realmente tienes en tu día a día.",
    sections: [
      {
        title: "Método #1 — Págate a ti primero",
        body: "Este es probablemente el método más recomendado por la literatura financiera porque elimina la decisión de ahorrar de forma emocional. La regla consiste en transferir automáticamente un porcentaje de tu ingreso a una cuenta de ahorro o inversión antes de gastar en otras cosas. No depende de si te sobra dinero al final del mes, porque el ahorro ya se ha convertido en una obligación previa al consumo.",
      },
      {
        title: "Método #2 — El reto de las 52 semanas",
        body: "El sistema de las 52 semanas combina ahorro y gamificación. Empiezas ahorrando una cantidad pequeña en la semana 1 y vas incrementando progresivamente. El beneficio principal no es solo el monto acumulado, sino la constancia que genera. Este método funciona bien para personas que necesitan una estructura visual y un reto que les ayude a mantenerse motivadas.",
      },
      {
        title: "Método #3 — Kakebo y el registro diario",
        body: "El método japonés Kakebo propone llevar un registro diario de ingresos, gastos y metas para tomar conciencia de cada movimiento financiero. En vez de dejar que el gasto se vuelva invisible, obliga a observarlo de forma explícita. Es particularmente útil para quienes hablan de control financiero, pero en la práctica gastan sin darse cuenta porque no ven el impacto de cada decisión.",
      },
      {
        title: "Método #4 — Ahorro por redondeo y automatización",
        body: "Algunas instituciones bancarias permiten redondear tus compras al siguiente peso y transferir la diferencia a un fondo de ahorro. Es una herramienta muy útil porque hace el ahorro casi imperceptible. No genera grandes cantidades por sí sola, pero sí crea un hábito sólido de acumulación continua que, con el tiempo, se vuelve muy relevante.",
      },
      {
        title: "Método #5 — Sobre de efectivo o presupuesto por categorías",
        body: "Más que un sistema de ahorro, es un sistema de control. Consiste en retirar el dinero destinado a categorías variables como comida, ocio o transporte y dividirlo en sobres o bolsas específicas. Cuando el sobre se termina, esa categoría se acabó para el mes. Esto funciona muy bien para personas que suelen gastar de forma impulsiva con tarjeta y necesitan una barrera tangible para detenerse.",
      },
    ],
    tips: [
      "La mejor combinación suele ser: automatizar un ahorro base y complementar con un método que te mantenga motivado.",
      "Elige un método según tu personalidad: si eres impulsivo, usa barreras; si te gusta competir, usa retos; si necesitas conciencia, usa registro.",
      "No intentes cambiar todo de golpe: la disciplina sostenida es más poderosa que los cambios radicales y temporales.",
      "Tu método debe ser simple suficiente para que lo sigas incluso en semanas de estrés o de bajo presupuesto.",
    ],
  },

  "glosario-financiero": {
    readTime: "8 min",
    category: "Educación",
    intro:
      "Entender el lenguaje de las finanzas personales es el primer paso para tomar mejores decisiones. El problema no es que las finanzas sean demasiado complejas, sino que la falta de vocabulario hace que muchas personas eviten aprenderlas o se dejen llevar por consejos incompletos.",
    sections: [
      {
        title: "Activos, pasivos y patrimonio",
        body: "Un activo es cualquier recurso que tiene valor económico y puede generar utilidad o ingresos en el futuro, como un negocio, una inversión o una propiedad. Un pasivo, por el contrario, es una obligación financiera que exige dinero de tu bolsillo en el tiempo, como una deuda o una cuota mensual. El patrimonio neto es el resultado de restar tus pasivos a tus activos, y refleja en términos prácticos tu posición financiera real.",
      },
      {
        title: "Tasa de interés y capitalización",
        body: "La tasa de interés es el porcentaje que representa el costo de pedir dinero prestado o el rendimiento de ahorrar o invertir. Cuando los intereses generan nuevos intereses, hablamos de capitalización o interés compuesto. Esto es clave porque puede trabajar a tu favor cuando ahorras o inviertes, pero también puede aumentar significativamente el costo de una deuda si no se maneja con disciplina.",
      },
      {
        title: "Inflación y liquidez",
        body: "La inflación es el aumento generalizado de precios que reduce el poder adquisitivo del dinero con el tiempo. Por eso, el dinero que guardas sin generar rendimiento puede perder valor. La liquidez, en cambio, es la facilidad con la que un activo puede convertirse en efectivo disponible sin perder valor. El efectivo tiene una liquidez muy alta; una propiedad o un negocio pueden tener menos liquidez, aunque puedan tener mayor potencial de crecimiento.",
      },
      {
        title: "Presupuesto, déficit y diversificación",
        body: "Un presupuesto es un plan que organiza tus ingresos y gastos para asignar recursos de forma consciente. Un déficit ocurre cuando gastas más de lo que ingresas en un periodo determinado. La diversificación, por su parte, es la estrategia de distribuir tus inversiones entre distintos activos para reducir el riesgo. En finanzas personales, estos conceptos permiten tomar decisiones más estables y menos impulsivas.",
      },
    ],
    tips: [
      "Aprende al menos 3 términos nuevos cada semana: el conocimiento financiero se acumula con la práctica.",
      "Cuando escuches un término técnico, búscalo y compáralo con ejemplos reales de tu vida.",
      "No necesitas dominar todo el idioma financiero de golpe; lo importante es comprender lo que afecta tus decisiones diarias.",
      "El vocabulario financiero es una herramienta de poder porque te ayuda a evitar errores costosos.",
    ],
  },
};

// ─── Componentes ──────────────────────────────────────────────────────────────
const easeOut = [0.22, 1, 0.36, 1];

function HeroImage({ resource }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl shadow-xl"
      style={{ height: "280px" }}
    >
      <img
        src={resource.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${resource.color}bb 0%, rgba(0,0,0,0.65) 100%)`,
        }}
        aria-hidden="true"
      />
      {/* Fallback color */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: resource.color }}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col justify-end p-8">
        <resource.Icon className="h-12 w-12 text-white mb-3 drop-shadow-lg" strokeWidth={1.5} />
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
        >
          {RESOURCE_CONTENT[resource.slug]?.category}
        </span>
      </div>
    </div>
  );
}

function ContentSection({ section, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut, delay: 0.1 + index * 0.07 }}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-3 w-full">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100">
          <BookOpen className="h-3.5 w-3.5 text-neutral-500" />
        </span>
        <div className="flex-1 w-full min-w-0">
          <h2 className="text-base font-bold text-neutral-900">{section.title}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {section.body}
          </p>
          {section.diagram && (
            <div className="mt-5 w-full overflow-x-auto rounded-xl bg-neutral-900 p-5 shadow-inner">
              <pre className="text-[10px] sm:text-xs font-mono text-brand-300 whitespace-pre">
                {section.diagram}
              </pre>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function TipsBlock({ tips, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut, delay: 0.5 }}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5" style={{ color }} />
        <h2 className="text-base font-bold text-neutral-900">Consejos rápidos</h2>
      </div>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-neutral-600">{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function AlertBanner({ color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut, delay: 0.08 }}
      className="flex items-start gap-3 rounded-2xl border p-4"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
      <p className="text-sm leading-relaxed" style={{ color }}>
        Este recurso es informativo. Para decisiones financieras importantes, consulta con un profesional certificado.
      </p>
    </motion.div>
  );
}

export function ResourceDetailPage({ slug, onBack, onBackToResources }) {
  const resource = RESOURCES.find((r) => r.slug === slug);
  const content = RESOURCE_CONTENT[slug];

  if (!resource || !content) {
    return (
      <PublicPageLayout
        title="Recurso no encontrado"
        subtitle="El recurso que buscas no existe."
        onBack={onBack}
      />
    );
  }

  const title = RESOURCE_TITLES[slug];

  return (
    <PublicPageLayout title={title} subtitle={content.intro} onBack={onBack}>
      {/* Metadata chips */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          <Clock className="h-3.5 w-3.5" />
          {content.readTime} de lectura
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: resource.color }}
        >
          <Tag className="h-3.5 w-3.5" />
          {content.category}
        </span>
      </div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="mb-6"
      >
        <HeroImage resource={resource} />
      </motion.div>

      {/* Botón volver a recursos */}
      <button
        type="button"
        onClick={onBackToResources}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Ver todos los recursos
      </button>

      {/* Banner aviso */}
      <div className="mb-5">
        <AlertBanner color={resource.color} />
      </div>

      {/* Secciones de contenido */}
      <div className="space-y-4">
        {content.sections.map((section, i) => (
          <ContentSection key={i} section={section} index={i} />
        ))}

        {/* Bloque de consejos */}
        {content.tips?.length > 0 && (
          <TipsBlock tips={content.tips} color={resource.color} />
        )}
      </div>
    </PublicPageLayout>
  );
}
