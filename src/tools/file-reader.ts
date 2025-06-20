import { z } from "zod";
import { readFile } from "fs/promises";
import { extname } from "path";
import { Tool, ToolInput, ToolResult } from "./types";

export interface FileReaderInput extends ToolInput {
  filePath: string;
}

export interface FileReaderResult {
  filename: string;
  content: string;
}

export class FileReaderTool implements Tool<FileReaderInput> {
  name = "file_reader";
  description = "Read local text files (.md, .txt, .html, etc.) and return structured content";
  
  inputSchema = z.object({
    filePath: z.string().describe("The local file path to read")
  });

  async prompt(input: FileReaderInput): Promise<string> {
    return `Reading file: ${input.filePath}`;
  }

  async* call(
    input: FileReaderInput,
    context: { abortController: AbortController; options: { isNonInteractiveSession: boolean } }
  ): AsyncGenerator<ToolResult, void, unknown> {
    try {
      const { filePath } = input;
      const ext = extname(filePath).toLowerCase();
      
      // Check if it's a supported text file
      const supportedExtensions = ['.md', '.txt', '.html', '.htm', '.json', '.js', '.ts', '.css', '.xml', '.csv'];
      if (!supportedExtensions.includes(ext)) {
        throw new Error(`Unsupported file type: ${ext}. Supported types: ${supportedExtensions.join(', ')}`);
      }

      const content = await readFile(filePath, 'utf-8');
      const filename = filePath.split('/').pop() || filePath;

      const result: FileReaderResult = {
        filename,
        content
      };

      yield {
        type: 'file_read',
        data: result
      };
    } catch (error) {
      yield {
        type: 'error',
        data: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          filePath: input.filePath
        }
      };
    }
  }
}