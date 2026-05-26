import "server-only";

import { getOpenAIClient } from "@/lib/openai/client";
import { getOpenAIConfig } from "@/lib/openai/config";
import {
  generatedSyllabusSchema,
  type GeneratedSyllabus,
} from "@/schemas/course";
import { zodResponseFormat } from "openai/helpers/zod";

type GenerateSyllabusParams = {
  title: string;
  categoryName: string;
  creativePrompt?: string;
};

const SYSTEM_PROMPT = `Eres un diseñador instruccional experto en freelancing y plataformas como Upwork.
Genera temarios de cursos en español (Latinoamérica), prácticos y orientados a resultados.`;

function buildUserPrompt({
  title,
  categoryName,
  creativePrompt,
}: GenerateSyllabusParams): string {
  const focus = creativePrompt?.trim()
    ? `\nEnfoque adicional del instructor: ${creativePrompt.trim()}`
    : "";

  return `Crea el temario para un curso online con estos datos:
- Título: ${title}
- Categoría: ${categoryName}${focus}

Reglas:
- Entre 3 y 6 módulos.
- Cada módulo con 3 a 6 lecciones.
- Títulos concisos y accionables.
- Progresión lógica de lo básico a lo avanzado.
- La descripción debe ser clara para marketing (2-4 oraciones).`;
}

export async function generateCourseSyllabusWithOpenAI(
  params: GenerateSyllabusParams,
): Promise<GeneratedSyllabus> {
  const { model } = getOpenAIConfig();
  const client = getOpenAIClient();

  const completion = await client.chat.completions.parse({
    model,
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(params) },
    ],
    response_format: zodResponseFormat(
      generatedSyllabusSchema,
      "course_syllabus",
    ),
  });

  const parsed = completion.choices[0]?.message?.parsed;
  if (!parsed) {
    throw new Error("OpenAI no devolvió un temario válido.");
  }

  return parsed;
}
