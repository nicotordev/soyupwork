export type MarketingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** FAQs de marketing — alineadas con keywords Upwork LATAM y docs de producto. */
export const MARKETING_FAQ_ITEMS: readonly MarketingFaqItem[] = [
  {
    id: "faq-trust",
    question: "¿Es confiable Upwork en Latinoamérica?",
    answer:
      "Upwork es una plataforma internacional consolidada para trabajo remoto y contratos freelance. Como en cualquier mercado, los resultados dependen de tu nicho, propuestas y ejecución. En soyup.work no vendemos la plataforma: enseñamos criterio comercial para competir en Upwork desde LATAM con menos improvisación.",
  },
  {
    id: "faq-what-is-soyup",
    question: "¿Qué es soyup.work?",
    answer:
      "soyup.work es una academia práctica en español para freelancers que quieren vender servicios en Upwork. No es un marketplace ni un reemplazo de Upwork: es formación enfocada en propuestas, perfil, Connects, pricing, entrevistas en inglés y operación freelance internacional.",
  },
  {
    id: "faq-english",
    question: "¿Necesito hablar un inglés nativo o perfecto?",
    answer:
      "No. El enfoque es inglés comercial funcional: entender al cliente, explicar alcance, hacer preguntas, presentar precio y cerrar los próximos pasos con claridad.",
  },
  {
    id: "faq-only-devs",
    question: "¿Esto es únicamente para programadores?",
    answer:
      "No. soyup.work está pensado para freelancers digitales que quieren vender servicios en Upwork: desarrollo, diseño, edición, data, redacción, automatización, marketing y otras especialidades compatibles con trabajo remoto.",
  },
  {
    id: "faq-beginners",
    question: "¿Sirve si soy principiante o no tengo experiencia en Upwork?",
    answer:
      "Sí, siempre que ya tengas una habilidad vendible o estés construyendo una oferta clara. Los cursos no empiezan desde cero en tu oficio técnico: te ayudan a posicionarte, postular con criterio y operar comercialmente en Upwork, incluso si aún no tienes historial en la plataforma.",
  },
  {
    id: "faq-income",
    question: "¿Los cursos prometen resultados o ingresos?",
    answer:
      "No. La promesa es formación práctica y criterio aplicado, no una garantía de ingresos. Upwork depende del nicho, experiencia, mercado, calidad de ejecución y consistencia de cada freelancer.",
  },
  {
    id: "faq-purchase",
    question: "¿Cómo compro un curso y cuándo obtengo acceso?",
    answer:
      "Eliges el curso en el catálogo, pagas con Stripe Checkout de forma segura y, al confirmarse el pago, se activa tu inscripción automáticamente. Recibirás correos transaccionales de confirmación. El acceso queda ligado a tu cuenta; no depende solo de volver a la página de éxito del pago.",
  },
  {
    id: "faq-includes",
    question: "¿Qué incluye un curso en soyup.work?",
    answer:
      "Módulos y lecciones en video o texto, recursos descargables cuando aplique, quizzes de práctica, seguimiento de progreso por lección y certificado verificable al completar los requisitos del curso. Algunas lecciones pueden liberarse de forma progresiva (drip content) según el diseño de cada ruta.",
  },
  {
    id: "faq-lifetime",
    question: "¿El acceso al curso es de por vida?",
    answer:
      "Depende del producto que compres. La mayoría de los cursos se venden con acceso de compra única (lifetime) al contenido publicado de esa ruta. Si en el futuro ofrecemos membresías o suscripciones, quedará indicado claramente en la página de precios antes de pagar.",
  },
  {
    id: "faq-connects",
    question: "¿Qué son los Connects y los enseñan a usarlos?",
    answer:
      "Los Connects son la moneda interna de Upwork para postular a proyectos. No vendemos Connects ni códigos promocionales: enseñamos cuándo conviene postular, cómo leer un proyecto rápido, cómo no quemar presupuesto y cómo aprender de cada intento para mejorar tus propuestas.",
  },
  {
    id: "faq-register-only",
    question: "¿Solo enseñan a registrarse en Upwork?",
    answer:
      "No. Crear cuenta es el primer paso, pero no es el producto. El foco está en competir comercialmente: nicho, propuestas breves, señales de perfil, pricing, entrevistas y operación freelance. Si buscas únicamente un tutorial de registro sin estrategia, este no es el lugar.",
  },
  {
    id: "faq-community",
    question: "¿Hay comunidad, foro o mentoría grupal incluida?",
    answer:
      "Por ahora el formato principal es curso autoguiado con lecciones, ejercicios y progreso en la plataforma. Comunidad, cohortes y gamificación están planificadas como evolución del producto, pero no forman parte del MVP actual salvo que un curso lo indique explícitamente.",
  },
  {
    id: "faq-certificate",
    question: "¿Recibo certificado al terminar un curso?",
    answer:
      "Los cursos que lo indiquen emiten un certificado con código único verificable públicamente al cumplir los requisitos de completitud (lecciones y quizzes requeridos). El certificado acredita que completaste esa formación en soyup.work; no es una credencial oficial de Upwork.",
  },
  {
    id: "faq-preview",
    question: "¿Puedo ver contenido antes de comprar?",
    answer:
      "Sí. Las páginas públicas de cada curso muestran información comercial, temario y, cuando el instructor lo habilita, lecciones de vista previa sin necesidad de compra. El resto del contenido queda protegido hasta que tengas una inscripción activa.",
  },
] as const;

export const MARKETING_FAQ_SECTION = {
  badge: "PREGUNTAS FRECUENTES",
  title: "Antes de entrar a un curso",
} as const;
