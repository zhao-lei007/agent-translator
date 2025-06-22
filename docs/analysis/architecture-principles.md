# 架构设计原则分析

## 项目架构设计原则

### 按功能模块分层的架构

```
src/
├── cli.tsx           # 🚪 入口层：CLI启动点
├── components/       # 🎨 UI层：React组件
├── utils/           # 🔧 工具层：通用工具函数
└── tools/           # 🛠️ 业务层：AI工具实现
```

## tools文件夹放在src下的设计原因

### 1. 业务逻辑的一部分

`tools`不是外部依赖或配置，而是**应用核心业务逻辑**的重要组成部分：

```typescript
import { FileReaderTool, UrlFetcherTool } from "../tools";

const fileReaderTool = new FileReaderTool();
const urlFetcherTool = new UrlFetcherTool();

// 工具被直接集成到AI客户端的核心逻辑中
export async function generateChatResponse(
  messages: ChatMessage[],
  modelName?: string,
  callbacks?: ToolCallbacks
): Promise<string> {
  // 工具调用逻辑
}
```

### 2. 需要编译和类型检查

工具代码使用TypeScript编写，需要参与编译过程：

```typescript
import { z } from "zod";
import { readFile } from "fs/promises";
import { Tool, ToolInput, ToolResult } from "./types";

export class FileReaderTool implements Tool<FileReaderInput> {
  // TypeScript类型安全的实现
  async* call(input: FileReaderInput, context: {...}): AsyncGenerator<ToolResult, void, unknown> {
    // 需要编译的业务逻辑
  }
}
```

### 3. 与其他模块紧密耦合

工具与UI组件、状态管理等有直接的数据流关系：

```typescript
const callbacks: ToolCallbacks = {
  onToolCall: (toolName: string, args: any) => {
    setToolStatus(`Calling ${toolName} tool...`);
  },
  onToolResult: (toolName: string, result: any) => {
    const toolMessage: Message = {
      id: `tool-${Date.now()}`,
      text: JSON.stringify(result, null, 2),
      timestamp: new Date(),
      role: 'tool',
      toolName,
    };
    setMessages(prev => [...prev, toolMessage]);
  }
};
```

## 文件夹组织的设计模式

### 1. 按技术层次分层（当前采用）

```
src/
├── components/    # React UI组件
├── utils/        # 通用工具函数  
├── tools/        # AI工具实现
└── cli.tsx       # 应用入口
```

**优点**：
- ✅ 技术栈清晰分离
- ✅ 便于理解代码结构
- ✅ 适合小到中型项目
- ✅ 符合React生态习惯

### 2. 其他可能的组织方式

#### A. 按业务功能分层
```
src/
├── translation/   # 翻译相关
│   ├── tools/
│   ├── services/
│   └── types/
├── ui/           # 界面相关
└── core/         # 核心功能
```

#### B. 独立tools目录
```
tools/            # 独立于src外
├── file-reader/
├── url-fetcher/
└── types/
src/
├── components/
└── utils/
```

#### C. 插件化架构
```
src/
├── core/
├── plugins/
│   ├── file-reader/
│   └── url-fetcher/
└── ui/
```

## 为什么选择当前方案？

### 1. 项目规模适配
这是一个**中小型CLI工具**，当前的分层方式最适合：
- 工具数量有限（2个）
- 团队规模小
- 功能相对集中

### 2. 开发效率优先

```typescript
export { FileReaderTool, type FileReaderInput, type FileReaderResult } from './file-reader';
export { UrlFetcherTool, type UrlFetcherInput, type UrlFetcherResult } from './url-fetcher';
export { type Tool, type ToolInput, type ToolResult } from './types';
```

- ✅ 统一的导出入口
- ✅ 类型安全的模块导入
- ✅ 便于重构和维护

### 3. 构建系统集成
工具代码需要与主应用一起编译：

```json
{
  "scripts": {
    "dev": "tsx src/cli.tsx",
    "build": "tsc",
    "start": "node dist/cli.js"
  }
}
```

- TypeScript编译器会处理整个`src`目录
- 保持构建配置的简单性

## 演进路径

### 当项目规模扩大时，可以考虑重构：

#### 1. 工具数量增加（>5个）
```
src/
├── tools/
│   ├── file/
│   │   ├── reader.ts
│   │   └── writer.ts
│   ├── web/
│   │   ├── fetcher.ts
│   │   └── scraper.ts
│   └── ai/
│       ├── translator.ts
│       └── summarizer.ts
```

#### 2. 支持插件系统
```
src/
├── core/
├── plugins/
│   ├── built-in/
│   └── external/
```

#### 3. 微服务架构
```
packages/
├── core/
├── tools/
├── ui/
└── cli/
```

## 设计原则总结

### 1. 就近原则
相关功能放在一起，减少跨目录引用

### 2. 单一职责
每个目录有明确的职责边界

### 3. 渐进式复杂度
从简单开始，随着需求增长逐步重构

### 4. 工具链友好
符合TypeScript、Node.js生态的最佳实践

## 架构决策记录

### 决策：将tools放在src/tools下
- **日期**：项目v0.3版本
- **背景**：需要添加AI工具支持
- **决策**：将工具作为业务逻辑的一部分，放在src下
- **理由**：
  1. 工具是核心业务逻辑，不是外部依赖
  2. 需要TypeScript编译和类型检查
  3. 与UI和状态管理紧密耦合
  4. 项目规模适合简单分层

### 决策：使用统一的工具接口
- **日期**：项目v0.3版本
- **背景**：需要支持多种工具类型
- **决策**：定义统一的Tool接口
- **理由**：
  1. 便于扩展新工具
  2. 提供类型安全
  3. 简化AI客户端集成

## 结论

**当前的`src/tools`组织方式是合理的**，因为：

1. ✅ **符合项目规模**：小型CLI工具，简单分层最有效
2. ✅ **技术栈一致**：都是TypeScript代码，需要统一编译
3. ✅ **业务耦合度高**：工具与UI、状态管理紧密集成
4. ✅ **开发效率高**：便于导入、调试和维护
5. ✅ **符合惯例**：React/Node.js生态的常见做法

这种组织方式体现了**实用主义的架构设计**——不过度设计，但为未来扩展留有空间。当项目复杂度增加时，可以平滑地重构到更复杂的架构模式。
