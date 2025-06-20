import React, {useState} from 'react';
import {Box, Text, useApp} from 'ink';
import {MessageHistory} from './MessageHistory.js';
import {InputBox} from './InputBox.js';
import {StatusLine} from './StatusLine.js';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string>('');
  const {exit} = useApp();

  const handleSubmit = (text: string) => {
    if (text.trim()) {
      // Check for exit commands
      if (text.trim().toLowerCase() === 'exit' || text.trim().toLowerCase() === 'quit') {
        exit();
        return;
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setStatus('Message sent successfully');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="round" borderColor="green" paddingX={1}>
        <Text color="green" bold>
          🌍 Welcome to Translator Agent v0.1.0
        </Text>
      </Box>
      
      <MessageHistory messages={messages} />
      
      <InputBox onSubmit={handleSubmit} />
      
      <StatusLine status={status} />
    </Box>
  );
};