/init 请帮我初始化当前项目

# 翻译助手 (Translator Agent)

一个基于 AI 的智能翻译 cli 命令行工具，支持文本、文件和网页翻译。

## 功能特性

- 🌍 **智能翻译**: 自动识别输入类型（文本/文件/URL）
- 💬 **交互式界面**: 基于 React + Ink 的美观终端界面  
- 📁 **多种输入源**: 支持直接文本、本地文件、网页 URL
- 🎯 **命令系统**: 丰富的内置命令
- 🔧 **可配置**: 自定义默认目标语言、词汇表、主题等设置

## 技术栈

- TypeScript
- React
- Ink
- ai sdk
- Node.js v20+

## 开发

- **Development**: `npm run dev` - Runs the CLI in development mode using tsx
- **Build**: `npm run build` - Builds production CLI
- **Production**: `npm start` - Runs the built CLI
- **Direct TypeScript execution**: `npx tsx src/cli.tsx` - Run TypeScript files directly


## 重要

- 每次完成后运行 npm run dev 看是否能正常运行，如果不能请修复
- 每次功能更新后要更新维护 Changelog
- 每次更新后要提交git commit，commit 中包含原始提示词