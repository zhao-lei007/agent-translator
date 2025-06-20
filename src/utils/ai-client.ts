import { createOpenAI } from "@ai-sdk/openai";
import { generateText, LanguageModel, tool } from "ai";
import { z } from "zod";
import dotenv from "dotenv";
import { FileReaderTool, UrlFetcherTool } from "../tools";

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

const fileReaderTool = new FileReaderTool();
const urlFetcherTool = new UrlFetcherTool();

export async function generateChatResponse(
  messages: ChatMessage[],
  modelName?: string
): Promise<string> {
  try {
    const result = await generateText({
      model: getLanguageModel(modelName),
      system: `You are a helpful translation assistant. You can help translate text, files, and web pages.

Available tools:
- file_reader: Read local text files (.md, .txt, .html, etc.) when user provides a file path
- url_fetcher: Fetch and convert web pages to markdown when user provides a URL

When the user provides a file path or URL, use the appropriate tool to fetch the content first, then provide translation or other assistance.`,
      temperature: 0.1,
      maxSteps: 5,
      messages: messages,
      tools: {
        file_reader: tool({
          description: 'Read local text files (.md, .txt, .html, etc.) and return structured content',
          parameters: z.object({
            filePath: z.string().describe('The local file path to read')
          }),
          execute: async ({ filePath }) => {
            const abortController = new AbortController();
            const context = {
              abortController,
              options: { isNonInteractiveSession: false }
            };
            
            for await (const result of fileReaderTool.call({ filePath }, context)) {
              if (result.type === 'file_read') {
                return result.data;
              } else if (result.type === 'error') {
                throw new Error(result.data.message);
              }
            }
          }
        }),
        url_fetcher: tool({
          description: 'Fetch content from HTTP(S) URLs and convert HTML to Markdown',
          parameters: z.object({
            url: z.string().url().describe('The HTTP(S) URL to fetch content from')
          }),
          execute: async ({ url }) => {
            const abortController = new AbortController();
            const context = {
              abortController,
              options: { isNonInteractiveSession: false }
            };
            
            for await (const result of urlFetcherTool.call({ url }, context)) {
              if (result.type === 'url_fetched') {
                return result.data;
              } else if (result.type === 'error') {
                throw new Error(result.data.message);
              }
            }
          }
        })
      }
    });
    
    return result.text;
  } catch (error) {
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}