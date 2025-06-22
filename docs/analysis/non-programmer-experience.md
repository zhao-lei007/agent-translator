# 非专业程序员使用Claude Code开发经验总结

## 概述

基于对Translator Agent项目的深入分析，总结非专业程序员使用Claude Code通过纯Prompt构建复杂项目的经验和最佳实践。

## 核心成功要素

### 1. 渐进式需求分解

从项目的版本演进可以看出，这是成功的关键：

```
v0.0 → 项目初始化 + 基础CLI框架
v0.1 → 添加React+Ink UI界面
v0.2 → 集成LLM对话功能  
v0.3 → 添加工具系统（文件读取+URL获取）
v0.4 → 完善工具调用状态显示
```

**经验总结**：
- ✅ **每个版本只解决一个核心问题**
- ✅ **先让基础功能跑起来，再添加复杂特性**
- ✅ **每次迭代都有可运行的版本**

### 2. 明确的技术栈选择

项目在一开始就确定了清晰的技术栈：

```typescript
// 明确的依赖选择
"dependencies": {
  "@ai-sdk/openai": "^1.3.22",    // AI集成
  "ai": "^4.3.16",                // AI SDK
  "ink": "^4.4.1",                // 终端UI
  "react": "^18.3.1",             // UI框架
  "turndown": "^7.2.0",           // HTML转Markdown
  "zod": "^3.25.67"               // 类型验证
}
```

**经验总结**：
- ✅ **选择成熟、文档完善的库**
- ✅ **避免重新发明轮子**
- ✅ **优先选择有官方示例的技术**

## Prompt工程最佳实践

### 1. 结构化需求描述

从文档可以看出，每个版本的需求都非常结构化：

```markdown
# v0.3 需求：支持工具

- 请添加两个工具放在 src/tools
  1. 工具1：文件读取
  根据本地路径读取本地文本文件（支持 .md, .txt, .html 等文本文件），返回结构化的文本：
  {
    filename: string
    content: string
  }
  2. 工具2: URL 抓取
  根据 http(s) 地址，请求（fetch）内容，使用 turndown 把请求后的 HTML 转成 Markdown
```

**Prompt模板**：
```markdown
# 版本需求：[功能名称]

## 目标
- [明确的功能描述]

## 技术要求
- [具体的技术实现要求]
- [依赖库和工具]

## 输入输出格式
- [详细的数据结构定义]

## 参考代码
- [相关的代码示例]
```

### 2. 提供具体的代码示例

每个需求都包含了详细的参考代码：

```markdown
调用 ai 参考代码
```ts
import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateText, LanguageModel } from "ai";

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

const result = await generateText({
  model: getLanguageModel("doubao-seed-1-6-250615"),
  system: 'You are a helpful chatbot.',
  temperature: 0.1,
  messages: [...],
});
```
```

**经验总结**：
- ✅ **提供完整的代码示例，不只是API文档链接**
- ✅ **包含具体的配置参数**
- ✅ **展示期望的调用方式**

## 架构设计经验

### 1. 分层架构的自然演进

项目采用了清晰的分层架构，这不是一开始设计的，而是自然演进的结果：

```
第一层：UI层 (components/) - 处理用户交互
第二层：业务层 (utils/ai-client.ts) - 处理AI逻辑
第三层：工具层 (tools/) - 处理具体功能
第四层：类型层 (types.ts) - 提供类型安全
```

**经验总结**：
- ✅ **让架构自然演进，不要过度设计**
- ✅ **每次只关注当前层的问题**
- ✅ **通过接口隔离不同层次**

### 2. 回调模式简化复杂性

项目巧妙地使用回调模式避免了复杂的状态管理：

```typescript
export interface ToolCallbacks {
  onToolCall?: (toolName: string, args: any) => void;
  onToolResult?: (toolName: string, result: any) => void;
  onStatusChange?: (status: string) => void;
}
```

**经验总结**：
- ✅ **回调比Promise链更容易理解**
- ✅ **事件驱动比状态机更简单**
- ✅ **优先选择声明式而非命令式**

## 技术选型经验

### 1. 优先选择"电池包含"的解决方案

项目选择的每个库都是"开箱即用"的：

- **Ink**：React for 终端，无需学习新的UI范式
- **AI SDK**：抽象了所有AI提供商的差异
- **Zod**：运行时类型验证，无需复杂配置
- **Turndown**：HTML到Markdown，一行代码搞定

**经验总结**：
- ✅ **选择抽象层次高的库**
- ✅ **避免需要大量配置的工具**
- ✅ **优先选择有官方示例的库**

### 2. 类型安全作为护栏

项目大量使用TypeScript和Zod提供类型安全：

```typescript
export interface FileReaderInput extends ToolInput {
  filePath: string;
}

inputSchema = z.object({
  filePath: z.string().describe("The local file path to read")
});
```

**经验总结**：
- ✅ **类型定义就是最好的文档**
- ✅ **运行时验证防止错误传播**
- ✅ **IDE提示减少认知负担**

## Prompt工程具体技巧

### 1. 使用"参考-要求-示例"三段式

```markdown
## 参考代码
[提供具体的代码示例]

## 要求
[明确的功能需求]

## 期望输出
[具体的文件结构和代码格式]
```

### 2. 明确约束条件

```markdown
- 请添加两个工具放在 src/tools
- 支持 .md, .txt, .html 等文本文件
- 使用 turndown 把请求后的 HTML 转成 Markdown
- 返回结构化的文本
```

### 3. 提供完整的上下文

每个Prompt都包含：
- 当前项目状态
- 技术栈信息
- 文件结构
- 依赖关系

## 项目管理经验

### 1. 版本化开发

每个功能都有独立的版本号和文档：
- `docs/v0.1/` - 基础UI
- `docs/v0.2/` - LLM集成
- `docs/v0.3/` - 工具系统
- `docs/v0.4/` - 状态显示

### 2. 可运行的里程碑

每个版本都确保：
- ✅ 代码可以编译
- ✅ 功能可以运行
- ✅ 有明确的测试方式

### 3. 文档驱动开发

先写需求文档，再生成代码：
```
需求文档 → Prompt → 代码生成 → 测试验证 → 下一版本
```

## 关键成功因素

### 1. 选择合适的问题域
- ✅ CLI工具比Web应用更适合AI生成
- ✅ 功能边界清晰的项目更容易成功
- ✅ 有现成库可用的领域更容易实现

### 2. 渐进式复杂度
- ✅ 从最简单的版本开始
- ✅ 每次只添加一个核心功能
- ✅ 确保每个版本都能独立运行

### 3. 充分利用生态系统
- ✅ 选择成熟的技术栈
- ✅ 使用高级抽象库
- ✅ 避免重新发明轮子

## 给非专业程序员的建议

### 1. 项目规划
```markdown
1. 选择边界清晰的问题
2. 确定技术栈（优先选择主流方案）
3. 分解为3-5个版本
4. 每个版本解决一个核心问题
```

### 2. Prompt编写
```markdown
1. 提供完整的上下文
2. 包含具体的代码示例
3. 明确输入输出格式
4. 指定文件结构和命名
```

### 3. 质量保证
```markdown
1. 每个版本都要能运行
2. 使用TypeScript提供类型安全
3. 选择有良好文档的库
4. 保持代码结构简单
```

## 总结

这个项目证明了**非专业程序员通过合理的Prompt工程，完全可以构建出架构清晰、功能完整的复杂应用**。

关键在于：**渐进式开发 + 合理的技术选型 + 结构化的需求描述**。

### 核心原则
1. **分而治之**：将复杂问题分解为简单问题
2. **站在巨人肩膀上**：充分利用现有的优秀库和工具
3. **迭代改进**：每次迭代都要有可运行的版本
4. **文档先行**：先写清楚要做什么，再让AI实现

### 适用场景
- CLI工具和命令行应用
- 功能边界清晰的小型应用
- 有成熟技术栈支持的领域
- 不需要复杂UI交互的应用

### 不适用场景
- 大型复杂的Web应用
- 需要复杂算法的应用
- 对性能要求极高的应用
- 需要深度定制的底层系统
