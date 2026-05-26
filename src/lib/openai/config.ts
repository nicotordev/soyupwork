export class OpenAIConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIConfigError";
  }
}

export function getOpenAIConfig(): { apiKey: string; model: string } {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();

  if (!apiKey) {
    throw new OpenAIConfigError(
      "OPENAI_API_KEY no está configurada en el entorno.",
    );
  }

  if (!model) {
    throw new OpenAIConfigError(
      "OPENAI_MODEL no está configurado en el entorno.",
    );
  }

  return { apiKey, model };
}
