import { z } from "zod";

export type ToolInput = { [key: string]: string };

export interface ToolResult {
  type: string;
  data: any;
}

export interface Tool<T extends ToolInput> {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
  prompt(tool: T): Promise<string>;
  call(input: T, context: {
    abortController: AbortController;
    options: { isNonInteractiveSession: boolean }
  }): AsyncGenerator<ToolResult, void, unknown>;
}