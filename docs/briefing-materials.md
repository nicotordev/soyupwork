## Resumen estratégico — soyup.work LMS

**soyup.work** debe posicionarse como una **academia práctica para vender servicios en Upwork**, no como “otro curso para crear una cuenta”. El briefing marca una oportunidad clara: LATAM necesita formación en **ventas B2B, propuestas, nichos, pricing, inglés para entrevistas, Connects, fiscalidad y operación freelance internacional**. 

## Propuesta técnica recomendada

Construirlo custom, no usar WordPress/Teachable/Hotmart, porque queremos control de marca, datos, funnels, comunidad y pricing.

### Stack base

| Capa       | Elección                                           |
| ---------- | -------------------------------------------------- |
| Frontend   | **Next.js App Router + React + TypeScript strict** |
| UI         | Tailwind CSS v4 + shadcn/ui                        |
| DB         | PostgreSQL                                         |
| ORM        | Prisma                                             |
| Auth       | Clerk o Auth.js                                    |
| Pagos      | Stripe Checkout + webhooks                         |
| Video      | Bunny Stream o Mux                                 |
| Archivos   | UploadThing / S3 compatible                        |
| Email      | Resend                                             |
| Analytics  | PostHog / Amplitude                                |
| Deploy     | Vercel + Neon/Supabase/Railway Postgres            |
| Jobs       | Inngest / Trigger.dev / QStash                     |
| Validación | Zod + next-safe-action                             |

Next.js App Router usa Server Components, Server Functions y Suspense; Prisma tiene guía oficial para Next.js + PostgreSQL; Stripe Checkout sigue siendo la vía simple para pagos seguros y conversión. ([Next.js][1])

## Arquitectura

```txt
Next.js App Router
├─ Marketing site
├─ LMS app
│  ├─ Cursos
│  ├─ Módulos
│  ├─ Lecciones
│  ├─ Progreso
│  ├─ Quizzes
│  ├─ Certificados
│  └─ Comunidad ligera
├─ Admin dashboard
│  ├─ Gestión de cursos
│  ├─ Usuarios
│  ├─ Ventas
│  ├─ Cohortes
│  └─ Métricas
├─ Stripe webhooks
├─ Prisma + PostgreSQL
├─ Bunny/Mux video
└─ Resend emails
```

## Modelo de datos mínimo

Entidades principales:

```txt
User
Course
Module
Lesson
Enrollment
LessonProgress
Quiz
QuizAttempt
Certificate
Product
Order
Subscription
Coupon
CommunityPost
Comment
Lead
EmailSequence
```

## Funciones MVP

**Must-have:**

* Landing SEO para vender el curso.
* Registro/login.
* Compra de curso con Stripe.
* Acceso protegido por compra.
* Player de video protegido.
* Progreso por lección.
* Drip content.
* Quizzes simples.
* Certificado básico.
* Admin para crear cursos/módulos/lecciones.
* Emails transaccionales.
* Analytics de conversión.

**Después:**

* Comunidad tipo Skool light.
* Gamificación.
* Afiliados.
* Planes mensuales.
* Cohortes en vivo.
* Simulador de propuestas Upwork con IA.
* Calculadora ROI de Connects.

## Currículum sugerido

1. **Fundamentos reales de Upwork**
2. **Especialización y nichos rentables**
3. **Perfil optimizado para búsqueda**
4. **Economía de Connects y bidding**
5. **Propuestas cortas que convierten**
6. **Inglés para entrevistas**
7. **Pricing, paquetes y retainers**
8. **Entrega profesional y JSS**
9. **Legal/fiscal para freelancers LATAM**
10. **Automatización con IA**

El briefing insiste en que el valor no está en enseñar “cómo abrir Upwork”, sino en enseñar **cómo competir algorítmica y comercialmente**. 

## Decisión pragmática

Para MVP: **Next.js + Prisma + Stripe + Bunny Stream + Resend + PostHog**.

Evitaría meter comunidad compleja al inicio. Primero validar ventas, contenido y retención. Luego agregamos comunidad/gamificación.