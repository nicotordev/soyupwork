import type { ResourceCatalogItem } from "@/types/resource-catalog.types";

export type GuideDetail = {
  item: ResourceCatalogItem;
  content: string;
};

const GUIDE_CONTENT: Record<string, string> = {
  "leer-job-post-3-minutos": `## Objetivo

Decidir en pocos minutos si un proyecto merece Connects y energía mental.

## 1. Budget y tipo de fee

- ¿Hourly o fixed? Si fixed, ¿hay rango o es "open"?
- ¿El budget es realista para el scope descrito?
- Red flag: "we'll discuss budget later" sin señales de urgencia claras.

## 2. Señales de comprador serio

- Historial de gasto en Upwork o equipo con roles definidos.
- Preguntas concretas en la descripción (stack, deadline, entregables).
- Evitar: copy-paste genérico, "simple task", "ASAP" sin contexto.

## 3. Fit con tu oferta

- ¿Podés demostrar 1–2 proyectos similares en las primeras líneas?
- ¿El idioma del post coincide con tu nivel operativo (no nativo fingido)?

## 4. Competencia esperada

- ¿Cuántos freelancers ya postularon?
- Si hay 50+ propuestas en 2 horas, necesitás un ángulo muy específico o pasar.

## Regla práctica

Si falla budget + fit, no postules. Usá el tiempo en mejorar perfil o outreach directo.`,

  "estructura-propuesta-sin-plantilla": `## Marco de 4 bloques

### 1. Hook contextual (2–3 líneas)

Referencia algo específico del post: métrica, stack, industria o restricción. Nada de "I am passionate about...".

### 2. Relevancia breve

Una prueba social alineada: proyecto similar, resultado numérico o proceso comparable. Un enlace o captura basta.

### 3. Plan en 3 pasos

Qué harías primero, qué entregarías y en qué orden. El cliente debe visualizar el trabajo sin leer un ensayo.

### 4. Pregunta de cierre

Una pregunta que invite respuesta: aclarar scope, prioridad o criterio de éxito. Facilita el reply.

## Errores comunes en LATAM

- Propuesta larga en español cuando el post está en inglés.
- Copiar la misma intro en 20 posts del día.
- Prometer timeline sin preguntar dependencias del cliente.

## Próximo paso

Adaptá este esqueleto y medí tasa de respuesta por nicho durante dos semanas.`,

  "pricing-por-valor-freelance": `## Cuando piden hourly

Muchos posts en Upwork piden hourly por defecto. Podés responder con un paquete acotado que ancle valor.

## Anclas útiles

- Rango de inversión ("projects like this typically land between X–Y").
- Qué incluye y qué queda fuera del scope.
- Opción de fase 1 pequeña (audit, discovery) antes del build grande.

## Red flags del cliente

- "We have a small budget but unlimited revisions."
- Comparación directa con la propuesta más barata sin criterio de calidad.
- Cambios de scope sin ajuste de precio acordado por escrito.

## Cómo presentarlo en la propuesta

1. Resumí el outcome deseado en una línea.
2. Ofrecé 2 tiers (esencial vs. completo) si aplica.
3. Pedí una call corta solo si el scope es ambiguo — no regales horas.

## Mentalidad

El precio comunica posicionamiento. Si dudás, subí el piso y mejorá el filtro de leads, no bajes a competir por volumen.`,

  "primeros-30-dias-perfil-upwork": `## Semana 1: Fundamentos

- Título orientado a outcome, no a herramienta ("I help X achieve Y").
- 1 caso de estudio bien escrito > 5 bullets genéricos.
- Foto y video opcional: profesional, no corporativo falso.

## Semana 2: Prueba social

- Pedí testimonios cortos a clientes previos (aunque no sean de Upwork).
- Subí muestras reales: capturas, métricas, antes/después.
- Definí 1 nicho para no parecer "hago de todo".

## Semana 3: Primeras postulaciones

- 5–8 propuestas/semana con criterio, no spam.
- Registrá qué hooks tuvieron reply.
- Ajustá título según el tipo de proyecto que más miran.

## Semana 4: Iteración

- Revisá Job Success y feedback temprano.
- Documentá objeciones en calls y mejorá FAQ del perfil.
- Conectá con catálogo de cursos si necesitás sistema completo.

## Recordatorio

El perfil es landing page. Debe responder: qué problema resolvés, para quién y por qué confiar.`,

  "frases-entrevista-ingles-funcional": `## Apertura de call

- "Thanks for your time — I reviewed the brief and have a few clarifying questions."
- "My goal today is to understand success criteria before we talk scope."

## Preguntas de discovery

- "What does done look like for this phase?"
- "Who else is involved in approvals?"
- "Are there technical or brand constraints I should know upfront?"

## Si no entendés algo

- "Let me repeat that back to make sure I got it right..."
- "Could you give me an example of what you mean by [term]?"

## Cierre

- "I'll send a short summary and next steps within [timeframe]."
- "Does this timeline align with your internal deadline?"

## Mindset

Claridad > perfección gramatical. El cliente compra seguridad de ejecución.`,
};

export function getGuideDetail(
  item: ResourceCatalogItem,
): GuideDetail | null {
  const content = GUIDE_CONTENT[item.slug];
  if (!content) return null;
  return { item, content };
}
