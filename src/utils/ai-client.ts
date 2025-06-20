import { createOpenAI } from "@ai-sdk/openai";
import { generateText, LanguageModel } from "ai";
import dotenv from "dotenv";

dotenv.config();

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const getLanguageModel = (modelName?: string): LanguageModel => {
  const model = modelName ?? (process.env.MODEL_NAME || "doubao-seed-1-6-250615");
  return openai(model);
};

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  modelName?: string
): Promise<string> {
  try {
    const result = await generateText({
      model: getLanguageModel(modelName),
      system: "You are a helpful chatbot.",
      temperature: 0.1,
      messages: messages,
    });
    
    return result.text;
  } catch (error) {
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}