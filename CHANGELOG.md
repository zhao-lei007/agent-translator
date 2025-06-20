# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-06-20

### Added
- Tool call status display in the status line below input box
- Tool call results shown in message history with proper labeling
- Real-time status updates during tool execution
- Visual indicators for tool messages (🔧 icon and magenta color)
- Enhanced message types to support tool call information

### Changed
- Status line now shows tool-specific status (e.g. "Reading file: ...", "Fetching URL: ...")
- Message history displays tool results as separate messages
- Improved visual feedback during AI tool execution

### Technical Details
- Extended Message interface with tool-specific properties
- Added ToolCallbacks interface for status event handling
- Enhanced StatusLine component with tool status support
- Updated MessageHistory component for tool message rendering
- Modified AI client to emit tool call events and status updates

## [0.1.0] - 2025-06-20

### Added
- Initial release of Translator Agent CLI
- Basic chat interface with message history
- Interactive terminal UI using React + Ink
- Welcome message display
- Message input with timestamp
- Status line for feedback
- Exit commands support ('exit' or 'quit')
- TypeScript support with ESM modules
- Build and development scripts

### Technical Details
- Built with TypeScript, React, and Ink v4
- Supports Node.js v20+
- Uses ESM modules for modern JavaScript
- Includes proper error handling for non-TTY environments