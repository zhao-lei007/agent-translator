# v0.3 需求：支持工具

- 请添加两个工具放在 src/tools
  1. 工具1：文件读取
  根据本地路径读取本地文本文件（支持 .md, .txt, .html 等文本文件），返回结构化的文本：
  {
    filename: string
    content: string
  }
  2. 工具2: URL 抓取
  根据 http(s) 地址，请求（fetch）内容，使用 turndown 把请求后的 HTML 转成 Markdown，返回结构化内容：
  {
    url: string
    content: string // markdown
    title: string
  }

- 更新和用户对话的逻辑
  - 在和LLM交互时提交用户工具，判断用户是否需要使用工具，如果需要，就调用翻译工具并传入正确的参数
  - 修改提示词，让 LLM 知道需要使用工具
  - 将工具返回结果返还给用户。

## 参考代码

工具接口参考

```ts
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
  prompt(tool: T): Promise<string>; // 提交给 LLM 的工具说明
  call(input: T, context: {
    abortController: AbortController;
    options: { isNonInteractiveSession: boolean }
  }): AsyncGenerator<ToolResult, void, unknown>;
}
```

调用工具
（文档地址：https://ai-sdk.dev/cookbook/node/call-tools）
Call Tools
Some models allow developers to provide a list of tools that can be called at any time during a generation. This is useful for extending the capabilites of a language model to either use logic or data to interact with systems external to the model.

Accessing Tool Results
You can access the result of a tool call by checking the toolResults property on the result.

Model Response
When using tools, it's important to note that the model won't respond with the tool call results by default. This is because the model has technically already generated its response to the prompt: the tool call. Many use cases will require the model to summarise the results of the tool call within the context of the original prompt automatically. You can achieve this by using maxSteps which will automatically send toolResults to the model to trigger another generation.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

async function main() {
  const result = await generateText({
    model: openai('gpt-3.5-turbo'),
    maxTokens: 512,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
      cityAttractions: tool({
        parameters: z.object({ city: z.string() }),
      }),
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
  });

  // typed tool results for tools with execute method:
  for (const toolResult of result.toolResults) {
    switch (toolResult.toolName) {
      case 'weather': {
        toolResult.args.location; // string
        toolResult.result.location; // string
        toolResult.result.temperature; // number
        break;
      }
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);

```