/**
 * One-off seed: quizzes for course 2389cac0-5a74-44b9-bf23-c8141ce5806c
 * Run: bun run scripts/seed-upwork-course-quizzes.ts
 */
import prisma from "../src/lib/db/prisma";

const COURSE_ID = "2389cac0-5a74-44b9-bf23-c8141ce5806c";

type OptionSeed = { text: string; isCorrect: boolean };
type QuestionSeed = { question: string; options: OptionSeed[] };

const MODULE_QUIZZES: {
  moduleId: string;
  slug: string;
  title: string;
  quizTitle: string;
  quizDescription: string;
  questions: QuestionSeed[];
}[] = [
  {
    moduleId: "371bfb2a-3710-42d6-8e02-a7818c263c83",
    slug: "quiz-modulo-1-fundamentos-upwork",
    title: "Quiz: Fundamentos de Upwork",
    quizTitle: "Check — Módulo 1",
    quizDescription:
      "Comprueba lo esencial sobre cómo funciona Upwork en 2026.",
    questions: [
      {
        question:
          "¿Qué modelo usa Upwork principalmente para pagar a freelancers?",
        options: [
          { text: "Comisión por proyecto cerrado y connects", isCorrect: true },
          { text: "Salario fijo mensual de Upwork", isCorrect: false },
          { text: "Solo publicidad en el perfil", isCorrect: false },
          {
            text: "Suscripción anual obligatoria del freelancer",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "¿Cuáles de estas señales suelen mejorar tu visibilidad en la plataforma?",
        options: [
          { text: "Perfil completo y especializado", isCorrect: true },
          {
            text: "Respuestas rápidas y buena tasa de respuesta",
            isCorrect: true,
          },
          {
            text: "Enviar la misma propuesta genérica a todos",
            isCorrect: false,
          },
          { text: "Perfil vacío con título genérico", isCorrect: false },
        ],
      },
      {
        question: "Un error típico de principiante en Upwork es…",
        options: [
          { text: "Ofrecer demasiados servicios sin foco", isCorrect: true },
          { text: "Definir un nicho claro desde el inicio", isCorrect: false },
          { text: "Leer la oferta antes de proponer", isCorrect: false },
          { text: "Personalizar cada propuesta", isCorrect: false },
        ],
      },
      {
        question: "¿Para qué sirven los Connects?",
        options: [
          {
            text: "Presentar propuestas a ofertas de clientes",
            isCorrect: true,
          },
          { text: "Subir vídeos al portafolio", isCorrect: false },
          { text: "Ver estadísticas de la competencia", isCorrect: false },
          { text: "Recibir pagos directos sin contrato", isCorrect: false },
        ],
      },
    ],
  },
  {
    moduleId: "298a215d-468e-4513-bc72-3138fd1185bf",
    slug: "quiz-modulo-2-elegir-nicho",
    title: "Quiz: Elegir tu nicho",
    quizTitle: "Check — Módulo 2",
    quizDescription: "Valida si tu nicho tiene demanda y enfoque comercial.",
    questions: [
      {
        question: "Un nicho con demanda real en Upwork suele tener…",
        options: [
          { text: "Ofertas publicadas de forma recurrente", isCorrect: true },
          {
            text: "Clientes dispuestos a pagar por el resultado",
            isCorrect: true,
          },
          { text: "Cero búsquedas en la plataforma", isCorrect: false },
          { text: "Solo proyectos sin presupuesto definido", isCorrect: false },
        ],
      },
      {
        question: "¿Qué servicio suele vender más rápido para empezar?",
        options: [
          {
            text: "Algo acotado con entregable claro (ej. landing, copy corto)",
            isCorrect: true,
          },
          {
            text: "Consultoría estratégica de 6 meses sin alcance",
            isCorrect: false,
          },
          { text: "Desarrollo full-stack ilimitado", isCorrect: false },
          { text: "Cualquier cosa que publique el cliente", isCorrect: false },
        ],
      },
      {
        question:
          "Al elegir entre especialización y amplitud, un principiante debería…",
        options: [
          { text: "Empezar más enfocado y ampliar con datos", isCorrect: true },
          { text: "Listar 20 skills sin prioridad", isCorrect: false },
          { text: "Evitar decir en qué es bueno", isCorrect: false },
          { text: "Copiar el perfil del competidor #1", isCorrect: false },
        ],
      },
    ],
  },
  {
    moduleId: "1a4d89f1-0cda-4b69-9dd3-fd14d2ffc049",
    slug: "quiz-modulo-3-perfil",
    title: "Quiz: Perfil que convierte",
    quizTitle: "Check — Módulo 3",
    quizDescription: "SEO, portafolio y credibilidad en tu perfil.",
    questions: [
      {
        question: "Un perfil que vende en Upwork incluye…",
        options: [
          { text: "Título específico orientado al cliente", isCorrect: true },
          { text: "Resumen con problema → solución → prueba", isCorrect: true },
          {
            text: "Título genérico tipo 'Freelancer profesional'",
            isCorrect: false,
          },
          { text: "Sin portafolio ni casos", isCorrect: false },
        ],
      },
      {
        question: "Si estás empezando y tienes poca experiencia, puedes…",
        options: [
          {
            text: "Mostrar proyectos propios o prácticos relevantes",
            isCorrect: true,
          },
          { text: "Inventar clientes falsos", isCorrect: false },
          { text: "Dejar el portafolio en blanco", isCorrect: false },
          { text: "Ocultar tu especialidad", isCorrect: false },
        ],
      },
      {
        question: "Las palabras clave en el perfil sirven para…",
        options: [
          { text: "Aparecer en búsquedas de clientes", isCorrect: true },
          { text: "Ganar connects gratis", isCorrect: false },
          { text: "Evitar entrevistas", isCorrect: false },
          { text: "Saltarse la verificación", isCorrect: false },
        ],
      },
      {
        question: "Un portafolio mínimo viable debe…",
        options: [
          { text: "Demostrar el resultado que prometes", isCorrect: true },
          { text: "Tener 50 proyectos irrelevantes", isCorrect: false },
          { text: "Ser solo texto sin ejemplos", isCorrect: false },
          { text: "Incluir precios de todos tus paquetes", isCorrect: false },
        ],
      },
    ],
  },
  {
    moduleId: "03e032ef-cfc9-4535-965b-83fcb3fa6b7e",
    slug: "quiz-modulo-4-propuestas",
    title: "Quiz: Propuestas que responden",
    quizTitle: "Check — Módulo 4",
    quizDescription: "Propuestas cortas, humanas y con intención comercial.",
    questions: [
      {
        question: "Antes de escribir una propuesta debes…",
        options: [
          {
            text: "Leer la oferta y detectar intención de compra",
            isCorrect: true,
          },
          { text: "Enviar tu plantilla estándar sin leer", isCorrect: false },
          {
            text: "Copiar la propuesta ganadora de otro nicho",
            isCorrect: false,
          },
          { text: "Poner el precio más bajo sin contexto", isCorrect: false },
        ],
      },
      {
        question: "Una propuesta corta y efectiva suele incluir…",
        options: [
          {
            text: "Gancho personalizado al problema del cliente",
            isCorrect: true,
          },
          { text: "Plan breve o primer paso claro", isCorrect: true },
          { text: "Biografía de 2 páginas", isCorrect: false },
          { text: "Lista de 30 tecnologías sin relación", isCorrect: false },
        ],
      },
      {
        question: "Para no sonar como bot o IA conviene…",
        options: [
          { text: "Usar detalles concretos de la oferta", isCorrect: true },
          { text: "Escribir con tono humano y directo", isCorrect: true },
          { text: "Usar frases genéricas de marketing", isCorrect: false },
          { text: "Repetir 'Soy el mejor' sin pruebas", isCorrect: false },
        ],
      },
    ],
  },
  {
    moduleId: "d9e68d27-6ea8-42c0-b2ac-35a41e4a982f",
    slug: "quiz-modulo-5-primer-contrato",
    title: "Quiz: Tu primer contrato",
    quizTitle: "Check — Módulo 5",
    quizDescription: "Entrevistas, cierre y primera review de 5 estrellas.",
    questions: [
      {
        question: "Para conseguir más entrevistas con consistencia…",
        options: [
          { text: "Mantener ritmo de propuestas de calidad", isCorrect: true },
          {
            text: "Hacer seguimiento profesional cuando aplique",
            isCorrect: true,
          },
          { text: "Enviar 2 propuestas al mes", isCorrect: false },
          { text: "Desaparecer después del primer mensaje", isCorrect: false },
        ],
      },
      {
        question: "En mensajes y entrevistas conviene…",
        options: [
          { text: "Escuchar el problema y confirmar alcance", isCorrect: true },
          { text: "Hablar solo de ti sin preguntar", isCorrect: false },
          { text: "Prometer todo sin límites", isCorrect: false },
          { text: "Evitar hablar de plazos", isCorrect: false },
        ],
      },
      {
        question: "Al cerrar tu primer contrato…",
        options: [
          { text: "Define alcance y entregables por escrito", isCorrect: true },
          {
            text: "Acepta cualquier precio sin negociar valor",
            isCorrect: false,
          },
          { text: "Trabaja fuera de Upwork desde el día 1", isCorrect: false },
          { text: "No aclares revisiones", isCorrect: false },
        ],
      },
      {
        question: "Para tu primera review de 5 estrellas…",
        options: [
          { text: "Sobrecumple en comunicación y plazos", isCorrect: true },
          { text: "Pide feedback antes del cierre si encaja", isCorrect: true },
          { text: "Desaparece al entregar", isCorrect: false },
          { text: "Evita pedir claridad al cliente", isCorrect: false },
        ],
      },
    ],
  },
];

async function main() {
  const course = await prisma.course.findUnique({
    where: { id: COURSE_ID },
    select: { id: true, title: true },
  });

  if (!course) {
    throw new Error(`Curso ${COURSE_ID} no encontrado`);
  }

  console.log(`Sembrando quizzes en: ${course.title}`);

  for (const seed of MODULE_QUIZZES) {
    const existing = await prisma.lesson.findFirst({
      where: { moduleId: seed.moduleId, slug: seed.slug },
      select: { id: true },
    });

    if (existing) {
      console.log(`  ↷ Ya existe: ${seed.title}`);
      continue;
    }

    const maxPosition = await prisma.lesson.aggregate({
      where: { moduleId: seed.moduleId },
      _max: { position: true },
    });
    const position = (maxPosition._max.position ?? -1) + 1;

    await prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.create({
        data: {
          moduleId: seed.moduleId,
          title: seed.title,
          slug: seed.slug,
          type: "QUIZ",
          position,
          content: null,
          isPreview: seed.moduleId === MODULE_QUIZZES[0].moduleId,
        },
      });

      const quiz = await tx.quiz.create({
        data: {
          lessonId: lesson.id,
          title: seed.quizTitle,
          description: seed.quizDescription,
          passingScore: 70,
        },
      });

      for (let qPos = 0; qPos < seed.questions.length; qPos++) {
        const q = seed.questions[qPos];
        const question = await tx.quizQuestion.create({
          data: {
            quizId: quiz.id,
            question: q.question,
            position: qPos,
          },
        });

        for (let oPos = 0; oPos < q.options.length; oPos++) {
          const opt = q.options[oPos];
          await tx.quizOption.create({
            data: {
              questionId: question.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
              position: oPos,
            },
          });
        }
      }

      console.log(
        `  ✓ ${seed.title} — ${seed.questions.length} preguntas (pos ${position})`,
      );
    });
  }

  const summary = await prisma.course.findUnique({
    where: { id: COURSE_ID },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { type: "QUIZ" },
            include: {
              quiz: { include: { _count: { select: { questions: true } } } },
            },
          },
        },
      },
    },
  });

  console.log("\nResumen quizzes:");
  for (const mod of summary?.modules ?? []) {
    for (const lesson of mod.lessons) {
      console.log(
        `  - [${mod.title}] ${lesson.title}: ${lesson.quiz?._count.questions ?? 0} preguntas`,
      );
    }
  }

  console.log(
    `\nPreview: /admin/courses/${COURSE_ID}/preview/lecciones/quiz-modulo-1-fundamentos-upwork`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
