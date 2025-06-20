# v0.2 需求，实现一个和 LLM 联通的 Chatbot cli

请基于当前 v0.1 版本，实现 LLM 交互的功能：

- 使用 `ai` 和 `@ai-sdk/openai`，并生成访问LLM的util代码，方便共用
- 当用户输入消息后，提交LLM，返回消息后更新消息列表
- 和 LLM 交互时显示 loading、成功、失败 状态


参考代码：

将 API 等信息保存到 .env 中，借助 dotenv 加载 .env，生成 .env.example 
```
OPENAI_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
OPENAI_API_KEY = 
MODEL_NAME = "doubao-seed-1-6-250615"  # Optional, if you want to specify a default model
```


调用 ai 参考代码
```ts
import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateText, LanguageModel } from "ai";

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});


export const getLanguageModel = (modelName?: string): LanguageModel => {
  const modelName = modelName ?? process.env.MODEL_NAME || "doubao-seed-1-6-250615";
  return openai(modelName);
}


const result = await generateText({
  model: getLanguageModel("doubao-seed-1-6-250615"),
  system: 'You are a helpful chatbot.',
  temperature: 0.1, // 温度设置为 0.1，控制输出的随机性
  messages: [
    {
      role: 'user',
      content: 'Hello!',
    },
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
    {
      role: 'user',
      content: 'I need help with my computer.',
    },
  ],
});

console.log(result.text);
```