import "server-only";

import { getOpenAIConfig } from "@/lib/openai/config";
import OpenAI from "openai";

let client: OpenAI | undefined;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const { apiKey } = getOpenAIConfig();
    client = new OpenAI({ apiKey });
  }

  return client;
}
