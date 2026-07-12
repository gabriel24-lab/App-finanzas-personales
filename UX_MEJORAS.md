# Auditoría y mejoras de UI/UX — App de Finanzas Personales

Este documento resume el trabajo hecho como "desarrollador senior de UI/UX"
sobre el proyecto: qué se cambió, por qué, y cómo se aplicó cada una de las
**12 leyes de UX** (marco de Jon Yablonski, *Laws of UX*, el más usado en la
industria). El objetivo fue que la app sea igual de usable para alguien que
ya usa apps como Mint, Fintonic o un banco digital, como para alguien que
nunca ha llevado sus finanzas en una app.

---

## 1. Ley de Jakob (los usuarios prefieren que tu app funcione como las que ya conocen)

- El formulario de movimientos ya usaba patrones familiares (tabs
  Gasto/Ingreso en rojo/verde, íconos de flecha arriba/abajo). Se mantuvo,
  porque es exactamente el patrón que cualquier app bancaria usa.
- **Bug de consistencia corregido**: `BudgetOverview` y `TransactionList`
  tenían la moneda `"COP"` hardcodeada, mientras que `KPICards` y
  `DashboardCharts` sí usaban la moneda real de la cuenta (`wallet.currency_code`).
  Un usuario con cuenta en USD o EUR habría visto pesos colombianos en unas
  pantallas y su moneda real en otras — rompe el modelo mental. Ahora las
  cuatro vistas usan la misma fuente de verdad.
- Se corrigió una inconsistencia de tuteo/voseo ("Creá" vs "Crea") en
  `BudgetManager` para que el tono sea uniforme en toda la app.

## 2. Ley de Fitts (los objetivos deben ser fáciles de alcanzar: grandes y cerca)

- El botón principal "Guardar Transacción" ya ocupa todo el ancho del
  formulario — correcto, es la acción más frecuente.
- Se mejoró el estado vacío de "Categorías" para que apunte explícitamente
  al botón "Nueva" en vez de dejar al usuario buscarlo.
- Recomendación a futuro: en móvil, los botones de editar/eliminar de
  `CategoryRow` solo aparecen con `hover`, lo cual no funciona con dedo.
  Sugerido: mostrarlos siempre en pantallas táctiles.

## 3. Ley de Hick (más opciones = más tiempo para decidir)

- El selector de tipo de movimiento sigue limitado a 2 opciones (Gasto /
  Ingreso), no una lista larga — correcto.
- En `TransactionForm`, cuando el usuario no tiene categorías creadas para
  el tipo elegido, antes el `<select>` quedaba vacío sin explicación (el
  usuario no podía completar el formulario y no sabía por qué). Ahora se
  reemplaza por un mensaje claro que dirige a la pestaña Categorías,
  eliminando una decisión imposible.

## 4. Ley de Miller (la memoria de trabajo es limitada, ~7 elementos)

- Los KPI se agrupan en 3 tarjetas (Balance, Ingresos, Gastos), no una
  lista larga de números — ya cumplía esto.
- Se añadieron explicaciones cortas (tooltips) en vez de párrafos largos
  permanentes, para no sobrecargar la pantalla de texto que la mayoría de
  usuarios no necesita leer dos veces.

## 5. Efecto estética-usabilidad (lo que se ve bien, se percibe como más fácil de usar)

- Se mantuvo el sistema visual existente (tarjetas redondeadas, degradados
  suaves, iconografía consistente vía `lucide-react`) — ya es de buen nivel.
- Se agregó un componente `InfoTooltip` con la misma estética (bordes
  redondeados, sombra suave) para que la ayuda contextual no se sienta como
  un elemento ajeno al diseño.

## 6. Divulgación progresiva / Navaja de Occam (mostrar solo lo necesario)

- En vez de agregar textos explicativos largos y permanentes (que estorban
  a quien ya sabe qué es un "balance" o un "presupuesto"), se creó
  `InfoTooltip.jsx`: un ícono "?" que solo muestra la explicación cuando el
  usuario la pide (hover, foco de teclado o toque). Se aplicó en:
  - `KPICards` → Balance total, Ingresos totales, Gastos totales.
  - `BudgetOverview` → qué es un presupuesto por categoría.
  - `CategoryManager` → para qué sirven las categorías.
  - `TransactionForm` → cómo escribir el monto (decimales, sin símbolo).

## 7. Umbral de Doherty (la app debe responder en <400ms para que el usuario no pierda el hilo)

- Los filtros de transacciones (`TransactionFilters`) ya filtran en tiempo
  real sin botón "Buscar" — correcto, no se tocó.
- Las animaciones de entrada de las tarjetas (`framer-motion`) están en
  ~300-500ms, dentro de un rango que se siente inmediato sin ser abrupto.

## 8. Prevención de errores (Nielsen) / Postel's Law (sé flexible con lo que aceptas)

- El formulario de transacciones ya validaba monto > 0, descripción no
  vacía, categoría y fecha antes de habilitar "Guardar" — correcto.
- Se reforzó: si no hay categorías disponibles para el tipo elegido, el
  formulario ahora **explica por qué** en vez de dejar un `<select>` vacío
  y confuso (ver también Ley de Hick arriba).

## 9. Mensajes de estado precisos y accionables (heurística de Nielsen)

- Los estados vacíos genéricos ("No hay movimientos", "Aún no has definido
  presupuestos") se reescribieron para:
  - Explicar la causa probable (cuenta nueva vs. filtros activos).
  - Dar un ejemplo concreto y el siguiente paso exacto (p. ej. "Ponle un
    límite de $300.000 a la categoría Comida" en vez de solo "define un
    presupuesto").

## 10. Ley de proximidad y regla de "peak-end" (lo último que ves define cómo recuerdas la experiencia)

- Se mantuvo el agrupamiento visual existente (título + subtítulo + acción
  dentro de la misma tarjeta con `border` y `shadow-sm`) — ya seguía esta
  ley correctamente en todos los componentes revisados.
- El mensaje de error del formulario aparece justo antes del botón de
  envío (no arriba, lejos del campo), para que la última interacción antes
  de decidir "reintentar" sea clara.

## 11. Modelo mental / lenguaje del usuario, no del sistema

- Se unificó el vocabulario: la app usaba "Transacción" en el título del
  formulario pero "Movimiento" en todo el resto (historial, confirmaciones
  de borrado, lista vacía). Para alguien nuevo, dos palabras para la misma
  cosa genera duda ("¿es lo mismo?"). Ahora todo dice "movimiento", que es
  además el término más común en español cotidiano (vs. "transacción", más
  técnico/bancario).
- Se agregó una micro-descripción bajo el título del formulario aclarando
  qué es un "movimiento" en lenguaje simple, sin jerga financiera.

## 12. Ley de Tesler / complejidad conservada (la complejidad no desaparece, se mueve)

- Un usuario avanzado necesita crear categorías y presupuestos con
  precisión (multi-moneda, límites por categoría, filtros combinados). Esa
  complejidad no se puede eliminar sin quitar funcionalidad real, así que
  se mantuvo intacta la potencia de la herramienta, pero se movió el
  "costo cognitivo" hacia tooltips opcionales y mensajes de ayuda
  contextual — quien no la necesita, no la ve; quien sí, la tiene a un
  toque.

---

## Resumen de archivos modificados

| Archivo | Cambio principal |
|---|---|
| `frontend/src/components/InfoTooltip.jsx` | **Nuevo.** Ícono de ayuda contextual accesible (teclado + mouse + touch). |
| `frontend/src/components/KPICards.jsx` | Tooltips explicativos, mensajes más claros en la tarjeta de gastos. |
| `frontend/src/components/TransactionForm.jsx` | Título/subtítulo consistentes con el resto de la app, tooltip en "Monto", manejo del caso "sin categorías". |
| `frontend/src/components/BudgetOverview.jsx` | Tooltip explicando qué es un presupuesto, estado vacío con ejemplo concreto, moneda dinámica (bug fix). |
| `frontend/src/components/BudgetManager.jsx` | Textos más claros sobre qué significa un límite de 0, corrección de voseo. |
| `frontend/src/components/CategoryManager.jsx` | Tooltip explicando categorías, estado vacío accionable. |
| `frontend/src/components/TransactionList.jsx` | Moneda dinámica (bug fix), estado vacío más preciso. |
| `frontend/src/App.jsx` | Se pasa `wallet` a `TransactionList` y `BudgetOverview` para que la moneda sea consistente en toda la app. |

## Segunda pasada: funcionalidades nuevas (dashboard "con vida")

Para que la pantalla principal se sienta menos rígida y con más contenido
útil desde el primer ingreso:

| Archivo | Qué hace |
|---|---|
| `frontend/src/components/InsightsPanel.jsx` | Ya existía pero no estaba conectado a `App.jsx` — se conectó. Muestra frases automáticas ("Gastaste 20% más en Comida") generadas por el backend. |
| `frontend/src/components/OnboardingChecklist.jsx` | **Nuevo.** Guía de 3 pasos para usuarios nuevos (primer movimiento, presupuesto, categorías). Se oculta sola al completarse o al cerrarla; se recuerda por usuario. |
| `frontend/src/components/SavingsGoals.jsx` | **Nuevo.** Metas de ahorro con nombre, monto objetivo y progreso visual. Se guardan en `localStorage` por usuario (el backend aún no tiene un modelo `Goal`; ver nota dentro del archivo para migrarlo a API en el futuro). Nueva pestaña "Metas" en la navegación. |
| `frontend/src/components/UpcomingPayments.jsx` | **Nuevo.** Detecta gastos recurrentes (misma descripción + categoría repetida en 2+ meses) y estima la fecha del próximo pago. Se calcula 100% en el navegador, sin backend nuevo. |
| `frontend/src/i18n/translations.js` | Saludo dinámico según la hora del día (mañana/tarde/noche) en los 4 idiomas, en vez de un "Hola" fijo. |

### Pendiente para una tercera pasada
- **Modo oscuro**: no se incluyó porque requiere revisar y agregar variantes `dark:` en prácticamente todos los componentes (~15 archivos) para que se vea bien, no solo activarlo a medias.
- **Sección de inversión con IA**: pendiente de diseño (ver conversación) — implica una pestaña nueva, contenido educativo, insights derivados de los propios datos del usuario (no recomendaciones de compra/venta) y enlaces salientes a plataformas reguladas, con los disclaimers legales correspondientes.
- Migrar `SavingsGoals` de `localStorage` a un endpoint real del backend (`/api/goals`) para que las metas sincronicen entre dispositivos.

